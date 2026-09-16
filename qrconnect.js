/*
 * qrconnect.js - root-level serverless signalling for VDO.Ninja
 *
 * Connects two VDO.Ninja peers by passing one small code each way over any
 * out-of-band channel - a QR code held up to a camera, an IRC line, a DM -
 * instead of going through the handshake server.
 *
 * VDO.Ninja itself is untouched. It runs in an iframe with &bypass, which
 * already swaps its WebSocket for postMessage (webrtc.js session.connect), and
 * takes signalling back in through the routeMessage iframe call (main.js).
 *
 * The bootstrap offer carries no audio or video, only the datachannel, which is
 * what keeps the code small enough to fit in a QR. Every ICE candidate is
 * gathered and the retained routes are folded into that one code, so there is
 * a single offer and a single answer and nothing left to trickle. Once the
 * bootstrap datachannel opens, the wrapper negotiates an independent persistent
 * datachannel over it and the out-of-band exchange is finished. Anything
 * VDO.Ninja later puts on its signalling path, including renegotiation and ICE
 * restarts, is tunnelled peer to peer over that sidecar by relaySignal().
 * Optional LoRa mode splits the bootstrap into bounded ASCII messages and
 * continues to expose overflow and late ICE candidates until connected.
 */

(function (global) {
	"use strict";

	// Fixed identities used on the wire. Real session UUIDs are generated per
	// page load, so each side swaps its own for a slot name on the way out and
	// swaps it back on the way in. That keeps a code independent of the session
	// that produced it, and lets the offerer address a peer that does not exist
	// yet.
	var SLOT_OFFER = "qrconnect0000000000a";
	var SLOT_ANSWER = "qrconnect0000000000b";

	// A single ASCII letter identifies the text alphabet. Y is the current
	// Base30000 form; Z remains decodable so previously shared Base2048 codes do
	// not go stale just because the denser alphabet shipped.
	var MAGIC = "Y";
	var BASE2048_MAGIC = "Z";
	var BASE512_MAGIC = "VQ";
	var LEGACY_MAGIC = "VN";
	var FORMAT = 3;
	var OFFER_LIMIT = 118;
	var ANSWER_LIMIT = 118;
	var MAX_CODE_CHARACTERS = 16384;
	var MAX_TEXT_BYTES = 16384;
	var MAX_COMPRESSED_SDP_BYTES = 32768;
	var MAX_SDP_BYTES = 65536;
	var MAX_CANDIDATES = 256;
	var MAX_SDP_LINES = 512;

	// There is no server to collide with and only ever two peers, so the stream
	// name carries no information. Both sides just agree on one and it costs
	// nothing to send. A caller can still pass its own.
	var DEFAULT_STREAM_ID = "qrc";

	/* ------------------------------------------------------------------ *
	 * bytes in, bytes out
	 * ------------------------------------------------------------------ */

	function Writer() {
		this.bytes = [];
	}
	Writer.prototype.u8 = function (value) {
		this.bytes.push(value & 0xff);
		return this;
	};
	Writer.prototype.u16 = function (value) {
		return this.u8(value >> 8).u8(value);
	};
	Writer.prototype.varint = function (value) {
		while (value >= 0x80) {
			this.u8((value & 0x7f) | 0x80);
			value >>>= 7;
		}
		return this.u8(value);
	};
	Writer.prototype.u64 = function (decimalString) {
		var value = BigInt(decimalString);
		var out = new Array(8);
		for (var i = 7; i >= 0; i--) {
			out[i] = Number(value & 0xffn);
			value >>= 8n;
		}
		for (i = 0; i < 8; i++) {
			this.u8(out[i]);
		}
		return this;
	};
	Writer.prototype.raw = function (list) {
		for (var i = 0; i < list.length; i++) {
			this.u8(list[i]);
		}
		return this;
	};
	Writer.prototype.blob = function (list) {
		this.varint(list.length);
		return this.raw(list);
	};
	Writer.prototype.text = function (value) {
		return this.blob(Array.from(new TextEncoder().encode(value)));
	};
	Writer.prototype.done = function () {
		return new Uint8Array(this.bytes);
	};

	function Reader(bytes) {
		this.bytes = bytes;
		this.at = 0;
	}
	Reader.prototype.u8 = function () {
		if (this.at >= this.bytes.length) {
			throw new Error("That code is incomplete.");
		}
		return this.bytes[this.at++];
	};
	Reader.prototype.u16 = function () {
		return (this.u8() << 8) | this.u8();
	};
	Reader.prototype.varint = function () {
		var out = 0;
		var multiplier = 1;
		var count = 0;
		var byte;
		do {
			byte = this.u8();
			if (count === 4 && byte & 0xf0) {
				throw new Error("That code contains an invalid length.");
			}
			out += (byte & 0x7f) * multiplier;
			multiplier *= 128;
			count += 1;
		} while (byte & 0x80);
		return out;
	};
	Reader.prototype.u64 = function () {
		var value = 0n;
		for (var i = 0; i < 8; i++) {
			value = (value << 8n) | BigInt(this.u8());
		}
		return value.toString();
	};
	Reader.prototype.raw = function (length) {
		if (length < 0 || length !== Math.floor(length) || length > this.bytes.length - this.at) {
			throw new Error("That code is incomplete.");
		}
		var out = this.bytes.slice(this.at, this.at + length);
		this.at += length;
		return out;
	};
	Reader.prototype.blob = function (maxLength) {
		var length = this.varint();
		if (maxLength !== undefined && length > maxLength) {
			throw new Error("That code contains a field that is too large.");
		}
		return this.raw(length);
	};
	Reader.prototype.text = function (maxLength) {
		return new TextDecoder().decode(this.blob(maxLength === undefined ? MAX_TEXT_BYTES : maxLength));
	};

	function toBase64url(bytes) {
		var binary = "";
		for (var i = 0; i < bytes.length; i++) {
			binary += String.fromCharCode(bytes[i]);
		}
		return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
	}

	function fromBase64url(text) {
		if (!text || text.length > MAX_CODE_CHARACTERS || !/^[A-Za-z0-9_-]+$/.test(text) || text.length % 4 === 1) {
			throw new Error("That connect code is invalid.");
		}
		var padded = text.replace(/-/g, "+").replace(/_/g, "/");
		while (padded.length % 4) {
			padded += "=";
		}
		var binary = atob(padded);
		var bytes = new Uint8Array(binary.length);
		for (var i = 0; i < binary.length; i++) {
			bytes[i] = binary.charCodeAt(i);
		}
		return bytes;
	}

	/*
	 * Legacy VQ decoder: nine bits per visible character, using 512 non-ASCII
	 * code points from
	 * qntm/base2048's transport-safe repertoire. Every character is a single
	 * left-to-right BMP code point below U+0800, is stable under all Unicode
	 * normalization forms, has weight one in X posts, and takes exactly two
	 * bytes in UTF-8. An ASCII digit before the encoded data records how many
	 * padding bits the last symbol carries.
	 *
	 * Repertoires adapted from qntm/base2048 and qntm/base32768:
	 *
	 * MIT License
	 * Copyright (c) 2017 qntm
	 *
	 * Permission is hereby granted, free of charge, to any person obtaining a
	 * copy of this software and associated documentation files (the "Software"),
	 * to deal in the Software without restriction, including without limitation
	 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
	 * and/or sell copies of the Software, and to permit persons to whom the
	 * Software is furnished to do so, subject to the following conditions:
	 *
	 * The above copyright notice and this permission notice shall be included in
	 * all copies or substantial portions of the Software.
	 *
	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
	 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
	 * DEALINGS IN THE SOFTWARE.
	 */
	var BASE512_RANGES = "ÆÆÐÐØØÞßææððøøþþĐđĦħııĸĸŁłŊŋŒœŦŧƀƟƢƮƱǃǝǝǤǥǶǷȜȝȠȥȴʯͰͳͶͷͻͽͿͿΑΡΣΩαωϏϏϗϯϳϳϷϸϺϿЂЂЄІЈЋЏИКикяђђєіјћџѵѸҁҊӀӃӏӔӕӘәӠӡӨөӶӷӺӽ";
	var BASE512_ENCODE = [];
	var BASE512_DECODE = {};

	(function buildBase512Repertoire() {
		for (var index = 0; index < BASE512_RANGES.length; index += 2) {
			var first = BASE512_RANGES.charCodeAt(index);
			var last = BASE512_RANGES.charCodeAt(index + 1);
			for (var code = first; code <= last; code++) {
				var character = String.fromCharCode(code);
				BASE512_DECODE[character] = BASE512_ENCODE.length;
				BASE512_ENCODE.push(character);
			}
		}
		if (BASE512_ENCODE.length !== 512) {
			throw new Error("The compact-code alphabet is incomplete.");
		}
	})();

	function toBase512(bytes) {
		var output = "";
		var accumulator = 0;
		var bits = 0;

		for (var index = 0; index < bytes.length; index++) {
			accumulator = (accumulator << 8) | bytes[index];
			bits += 8;
			while (bits >= 9) {
				bits -= 9;
				output += BASE512_ENCODE[(accumulator >> bits) & 0x1ff];
				accumulator &= (1 << bits) - 1;
			}
		}

		var padding = 0;
		if (bits) {
			padding = 9 - bits;
			output += BASE512_ENCODE[(accumulator << padding) | ((1 << padding) - 1)];
		}
		return String(padding) + output;
	}

	function fromBase512(text) {
		if (!text || text.length > MAX_CODE_CHARACTERS) {
			throw new Error("That connect code is invalid.");
		}

		var paddingText = text.charAt(0);
		if (!/^[0-8]$/.test(paddingText)) {
			throw new Error("That connect code has an invalid padding marker.");
		}
		var padding = Number(paddingText);
		var characterCount = text.length - 1;
		var bitLength = characterCount * 9 - padding;
		if (bitLength < 0 || bitLength % 8 || (padding && !characterCount)) {
			throw new Error("That connect code has an invalid length.");
		}

		var output = new Uint8Array(bitLength / 8);
		var outputAt = 0;
		var accumulator = 0;
		var bits = 0;

		for (var index = 0; index < characterCount; index++) {
			var value = BASE512_DECODE[text.charAt(index + 1)];
			if (value === undefined) {
				throw new Error("That connect code contains an unsupported character.");
			}

			var characterBits = 9;
			if (index === characterCount - 1 && padding) {
				var mask = (1 << padding) - 1;
				if ((value & mask) !== mask) {
					throw new Error("That connect code has invalid padding.");
				}
				value >>= padding;
				characterBits -= padding;
			}

			accumulator = (accumulator << characterBits) | value;
			bits += characterBits;
			while (bits >= 8) {
				bits -= 8;
				output[outputAt++] = (accumulator >> bits) & 0xff;
				accumulator &= (1 << bits) - 1;
			}
		}

		if (bits || outputAt !== output.length) {
			throw new Error("That connect code has an invalid length.");
		}
		return output;
	}

	/*
	 * Eleven bits per visible character. This is qntm/base2048's complete
	 * transport-safe repertoire: one BMP code point per character, no emoji,
	 * no combining marks or whitespace, stable under every Unicode
	 * normalization form, and weight one in X posts. The small second
	 * repertoire encodes the final one to three bits, so no padding character
	 * is needed.
	 */
	var BASE2048_RANGES = ["89AZazÆÆÐÐØØÞßææððøøþþĐđĦħııĸĸŁłŊŋŒœŦŧƀƟƢƮƱǃǝǝǤǥǶǷȜȝȠȥȴʯͰͳͶͷͻͽͿͿΑΡΣΩαωϏϏϗϯϳϳϷϸϺϿЂЂЄІЈЋЏИКикяђђєіјћџѵѸҁҊӀӃӏӔӕӘәӠӡӨөӶӷӺԯԱՖաֆאתװײؠءاؿفي٠٩ٮٯٱٴٹڿہہۃےەەۮۼۿۿܐܐܒܯݍޥޱޱ߀ߪࠀࠕࡀࡘࡠࡪࢠࢴࢶࢽऄनपरलळवहऽऽॐॐॠॡ०९ॲঀঅঌএঐওনপরললশহঽঽৎৎৠৡ০ৱ৴৹ৼৼਅਊਏਐਓਨਪਰਲਲਵਵਸਹੜੜ੦੯ੲੴઅઍએઑઓનપરલળવહઽઽૐૐૠૡ૦૯ૹૹଅଌଏଐଓନପରଲଳଵହଽଽୟୡ୦୯ୱ୷ஃஃஅஊஎஐஒஓககஙசஜஜஞடணதநபமஹௐௐ௦௲అఌఎఐఒనపహఽఽౘౚౠౡ౦౯౸౾ಀಀಅಌಎಐಒನಪಳವಹಽಽೞೞೠೡ೦೯ೱೲഅഌഎഐഒഺഽഽൎൎൔൖ൘ൡ൦൸ൺൿඅඖකනඳරලලවෆ෦෯กะาาเๅ๐๙ກຂຄຄງຈຊຊຍຍດທນຟມຣລລວວສຫອະາາຽຽເໄ໐໙ໞໟༀༀ༠༳ཀགངཇཉཌཎདནབམཛཝཨཪཬྈྌကဥဧဪဿ၉ၐၕ", "07"];
	var BASE2048_ENCODE = {};
	var BASE2048_DECODE = {};

	(function buildBase2048Repertoire() {
		BASE2048_RANGES.forEach(function (ranges, repertoire) {
			var bits = repertoire ? 3 : 11;
			var characters = [];
			for (var index = 0; index < ranges.length; index += 2) {
				var first = ranges.charCodeAt(index);
				var last = ranges.charCodeAt(index + 1);
				for (var code = first; code <= last; code++) {
					var character = String.fromCharCode(code);
					BASE2048_DECODE[character] = { bits: bits, value: characters.length };
					characters.push(character);
				}
			}
			BASE2048_ENCODE[bits] = characters;
		});
		if (BASE2048_ENCODE[11].length !== 2048 || BASE2048_ENCODE[3].length !== 8) {
			throw new Error("The dense compact-code alphabet is incomplete.");
		}
	})();

	function toBase2048(bytes) {
		var output = "";
		var value = 0;
		var bits = 0;
		for (var index = 0; index < bytes.length; index++) {
			for (var shift = 7; shift >= 0; shift--) {
				value = (value << 1) | ((bytes[index] >> shift) & 1);
				bits += 1;
				if (bits === 11) {
					output += BASE2048_ENCODE[11][value];
					value = 0;
					bits = 0;
				}
			}
		}
		if (bits) {
			while (BASE2048_ENCODE[bits] === undefined) {
				value = (value << 1) | 1;
				bits += 1;
			}
			output += BASE2048_ENCODE[bits][value];
		}
		return output;
	}

	function fromBase2048(text) {
		if (!text || text.length > MAX_CODE_CHARACTERS) {
			throw new Error("That connect code is invalid.");
		}
		var output = new Uint8Array(Math.floor((text.length * 11) / 8));
		var outputAt = 0;
		var byte = 0;
		var byteBits = 0;
		for (var index = 0; index < text.length; index++) {
			var entry = BASE2048_DECODE[text.charAt(index)];
			if (!entry) {
				throw new Error("That connect code contains an unsupported character.");
			}
			if (entry.bits !== 11 && index !== text.length - 1) {
				throw new Error("That connect code contains misplaced final data.");
			}
			for (var shift = entry.bits - 1; shift >= 0; shift--) {
				byte = (byte << 1) | ((entry.value >> shift) & 1);
				byteBits += 1;
				if (byteBits === 8) {
					output[outputAt++] = byte;
					byte = 0;
					byteBits = 0;
				}
			}
		}
		if (byte !== (1 << byteBits) - 1) {
			throw new Error("That connect code has invalid padding.");
		}
		return output.slice(0, outputAt);
	}

	/*
	 * Nearly fifteen bits per visible character. This is a 30,000-character
	 * subset of qntm's transport-safe repertoires, restricted to Unicode
	 * letters and numbers:
	 *
	 *   2,048 Base2048 letters/numbers
	 *     464 Canadian Aboriginal letters (U+1420..U+15EF)
	 *  27,488 CJK Unified Ideographs (U+3400..U+4D9F and U+4E00..U+9FBF)
	 *
	 * Every symbol is one UTF-16 code unit, one Unicode code point, stable under
	 * NFC/NFD/NFKC/NFKD, and neither emoji, punctuation, whitespace nor a
	 * combining mark. At the 118-character hard guard the text is at most 235
	 * weighted X characters including the ASCII prefix, 118 YouTube characters
	 * and 352 UTF-8 bytes before IRC framing.
	 *
	 * A leading binary one preserves zero bytes, then ordinary base conversion
	 * packs log2(30000), or about 14.87, payload bits into each glyph.
	 */
	var BASE30000_RADIX = 30000n;
	var BASE30000_EXT_A_START = 0x3400;
	var BASE30000_EXT_A_SIZE = 0x19a0;
	var BASE30000_UNIFIED_START = 0x4e00;
	var BASE30000_UNIFIED_SIZE = 0x51c0;
	var BASE30000_CANADIAN_START = 0x1420;
	var BASE30000_CANADIAN_SIZE = 0x1d0;

	function base30000Character(index) {
		if (index < 2048) {
			return BASE2048_ENCODE[11][index];
		}
		index -= 2048;
		if (index < BASE30000_EXT_A_SIZE) {
			return String.fromCharCode(BASE30000_EXT_A_START + index);
		}
		index -= BASE30000_EXT_A_SIZE;
		if (index < BASE30000_UNIFIED_SIZE) {
			return String.fromCharCode(BASE30000_UNIFIED_START + index);
		}
		index -= BASE30000_UNIFIED_SIZE;
		if (index < BASE30000_CANADIAN_SIZE) {
			return String.fromCharCode(BASE30000_CANADIAN_START + index);
		}
		throw new Error("The compact-code alphabet is incomplete.");
	}

	function base30000Value(character) {
		var entry = BASE2048_DECODE[character];
		if (entry && entry.bits === 11) {
			return entry.value;
		}
		var code = character.charCodeAt(0);
		if (code >= BASE30000_EXT_A_START && code < BASE30000_EXT_A_START + BASE30000_EXT_A_SIZE) {
			return 2048 + code - BASE30000_EXT_A_START;
		}
		if (code >= BASE30000_UNIFIED_START && code < BASE30000_UNIFIED_START + BASE30000_UNIFIED_SIZE) {
			return 2048 + BASE30000_EXT_A_SIZE + code - BASE30000_UNIFIED_START;
		}
		if (code >= BASE30000_CANADIAN_START && code < BASE30000_CANADIAN_START + BASE30000_CANADIAN_SIZE) {
			return 2048 + BASE30000_EXT_A_SIZE + BASE30000_UNIFIED_SIZE + code - BASE30000_CANADIAN_START;
		}
		return -1;
	}

	function toBase30000(bytes) {
		var value = 1n;
		for (var index = 0; index < bytes.length; index++) {
			value = (value << 8n) | BigInt(bytes[index]);
		}
		var output = [];
		while (value) {
			output.push(base30000Character(Number(value % BASE30000_RADIX)));
			value /= BASE30000_RADIX;
		}
		return output.reverse().join("");
	}

	function fromBase30000(text) {
		if (!text || text.length > Math.max(OFFER_LIMIT, ANSWER_LIMIT) - MAGIC.length) {
			throw new Error("That connect code is invalid.");
		}
		var value = 0n;
		for (var index = 0; index < text.length; index++) {
			var digit = base30000Value(text.charAt(index));
			if (digit < 0 || (!index && text.length > 1 && !digit)) {
				throw new Error("That connect code contains an unsupported character.");
			}
			value = value * BASE30000_RADIX + BigInt(digit);
		}
		var reversed = [];
		while (value > 1n) {
			reversed.push(Number(value & 0xffn));
			value >>= 8n;
		}
		if (value !== 1n) {
			throw new Error("That connect code has an invalid length.");
		}
		reversed.reverse();
		return new Uint8Array(reversed);
	}

	function collectStream(readable, maxLength) {
		var reader = readable.getReader();
		var chunks = [];
		var total = 0;

		function readNext() {
			return reader.read().then(function (result) {
				if (result.done) {
					var joined = new Uint8Array(total);
					var at = 0;
					chunks.forEach(function (chunk) {
						joined.set(chunk, at);
						at += chunk.byteLength;
					});
					return joined;
				}
				total += result.value.byteLength;
				if (total > maxLength) {
					reader.cancel().catch(function () {});
					throw new Error("That connect code expands beyond the supported size.");
				}
				chunks.push(result.value);
				return readNext();
			});
		}

		return readNext();
	}

	function transformBytes(stream, bytes, maxOutput) {
		var writer = stream.writable.getWriter();
		var writing = writer.write(bytes).then(function () {
			return writer.close();
		});
		var reading = collectStream(stream.readable, maxOutput);
		return Promise.all([writing, reading]).then(function (results) {
			return results[1];
		});
	}

	function deflate(text) {
		var bytes = new TextEncoder().encode(text);
		if (bytes.length > MAX_SDP_BYTES) {
			return Promise.reject(new Error("The connection description is too large."));
		}
		return transformBytes(new CompressionStream("deflate-raw"), bytes, MAX_COMPRESSED_SDP_BYTES);
	}

	function inflate(bytes) {
		if (bytes.length > MAX_COMPRESSED_SDP_BYTES) {
			return Promise.reject(new Error("That connect code contains too much compressed data."));
		}
		return transformBytes(new DecompressionStream("deflate-raw"), bytes, MAX_SDP_BYTES).then(function (output) {
			return new TextDecoder().decode(output);
		});
	}

	function randomID(length) {
		var alphabet = "abcdefghijkmnpqrstuvwxyz23456789";
		var values = new Uint8Array(length);
		crypto.getRandomValues(values);
		var out = "";
		for (var i = 0; i < length; i++) {
			out += alphabet[values[i] % alphabet.length];
		}
		return out;
	}

	/* ------------------------------------------------------------------ *
	 * short strings
	 *
	 * RFC 5245 defines ice-char as ALPHA / DIGIT / "+" / "/" - exactly 64
	 * symbols - so ice-ufrag and ice-pwd always fit six bits per character, and
	 * VDO.Ninja's session token is alphanumeric, a subset of the same set.
	 * Firefox goes further and generates both as lowercase hex, which is only
	 * four bits a character; spotting that turns its 32-character pwd into 16
	 * bytes rather than 24. Anything outside both alphabets is carried plainly.
	 * ------------------------------------------------------------------ */

	var ICE_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
	var ICE_INDEX = {};
	for (var iceAt = 0; iceAt < ICE_ALPHABET.length; iceAt++) {
		ICE_INDEX[ICE_ALPHABET.charAt(iceAt)] = iceAt;
	}
	var HEX_ALPHABET = "0123456789abcdef";

	var PACK_RAW = 0;
	var PACK_SIX = 1;
	var PACK_HEX = 2;

	function packSixBit(text) {
		var out = [];
		var acc = 0;
		var bits = 0;
		for (var i = 0; i < text.length; i++) {
			var value = ICE_INDEX[text.charAt(i)];
			if (value === undefined) {
				return null;
			}
			acc = (acc << 6) | value;
			bits += 6;
			while (bits >= 8) {
				bits -= 8;
				out.push((acc >> bits) & 0xff);
				acc &= (1 << bits) - 1;
			}
		}
		if (bits) {
			out.push((acc << (8 - bits)) & 0xff);
		}
		return out;
	}

	function unpackSixBit(bytes, count) {
		var out = "";
		var acc = 0;
		var bits = 0;
		var at = 0;
		while (out.length < count) {
			while (bits < 6) {
				acc = (acc << 8) | (at < bytes.length ? bytes[at++] : 0);
				bits += 8;
			}
			bits -= 6;
			out += ICE_ALPHABET.charAt((acc >> bits) & 63);
			acc &= (1 << bits) - 1;
		}
		return out;
	}

	function packFourBit(text) {
		var out = [];
		for (var i = 0; i < text.length; i += 2) {
			var high = HEX_ALPHABET.indexOf(text.charAt(i));
			var low = i + 1 < text.length ? HEX_ALPHABET.indexOf(text.charAt(i + 1)) : 0;
			if (high < 0 || low < 0) {
				return null;
			}
			out.push((high << 4) | low);
		}
		return out;
	}

	function unpackFourBit(bytes, count) {
		var out = "";
		for (var i = 0; i < bytes.length && out.length < count; i++) {
			out += HEX_ALPHABET.charAt(bytes[i] >> 4);
			if (out.length < count) {
				out += HEX_ALPHABET.charAt(bytes[i] & 15);
			}
		}
		return out;
	}

	function choosePacking(text) {
		if (!text.length) {
			return PACK_RAW;
		}
		if (packFourBit(text)) {
			return PACK_HEX;
		}
		return packSixBit(text) ? PACK_SIX : PACK_RAW;
	}

	function writeString(writer, text, mode) {
		if (mode === PACK_RAW) {
			return writer.text(text);
		}
		writer.varint(text.length);
		return writer.raw(mode === PACK_HEX ? packFourBit(text) : packSixBit(text));
	}

	function readString(reader, mode) {
		if (mode === PACK_RAW) {
			return reader.text();
		}
		var count = reader.varint();
		if (count > MAX_TEXT_BYTES) {
			throw new Error("That code contains a field that is too large.");
		}
		if (mode === PACK_HEX) {
			return unpackFourBit(reader.raw(Math.ceil(count / 2)), count);
		}
		return unpackSixBit(reader.raw(Math.ceil((count * 6) / 8)), count);
	}

	function packHex(text) {
		var hex = text.replace(/:/g, "");
		if (!/^[0-9A-Fa-f]+$/.test(hex) || hex.length % 2) {
			return null;
		}
		var bytes = [];
		for (var i = 0; i < hex.length; i += 2) {
			bytes.push(parseInt(hex.substr(i, 2), 16));
		}
		return bytes;
	}

	function unpackHex(bytes) {
		var out = [];
		for (var i = 0; i < bytes.length; i++) {
			out.push(("0" + bytes[i].toString(16)).slice(-2).toUpperCase());
		}
		return out.join(":");
	}

	/* ------------------------------------------------------------------ *
	 * addresses
	 * ------------------------------------------------------------------ */

	function packIPv4(text) {
		var parts = text.split(".");
		if (parts.length !== 4) {
			return null;
		}
		var bytes = [];
		for (var i = 0; i < 4; i++) {
			var value = Number(parts[i]);
			if (!/^\d{1,3}$/.test(parts[i]) || value > 255) {
				return null;
			}
			bytes.push(value);
		}
		return bytes;
	}

	function packIPv6(text) {
		var halves = text.split("::");
		if (halves.length > 2 || text.indexOf(".") >= 0) {
			return null;
		}
		var head = halves[0] ? halves[0].split(":") : [];
		var tail = halves.length === 2 && halves[1] ? halves[1].split(":") : [];
		var groups;
		if (halves.length === 1) {
			groups = head;
		} else {
			var missing = 8 - head.length - tail.length;
			if (missing < 1) {
				return null;
			}
			groups = head.concat(new Array(missing).fill("0"), tail);
		}
		if (groups.length !== 8) {
			return null;
		}
		var bytes = [];
		for (var i = 0; i < 8; i++) {
			if (!/^[0-9a-f]{1,4}$/i.test(groups[i])) {
				return null;
			}
			var value = parseInt(groups[i], 16);
			bytes.push(value >> 8, value & 0xff);
		}
		return bytes;
	}

	// RFC 5952 form, which is what browsers emit, so the round-trip check below
	// accepts it and we stay on the compact path.
	function unpackIPv6(bytes) {
		var groups = [];
		var i;
		for (i = 0; i < 8; i++) {
			groups.push((bytes[i * 2] << 8) | bytes[i * 2 + 1]);
		}
		var bestStart = -1;
		var bestLength = 0;
		var runStart = -1;
		for (i = 0; i <= 8; i++) {
			if (i < 8 && groups[i] === 0) {
				if (runStart < 0) {
					runStart = i;
				}
			} else if (runStart >= 0) {
				if (i - runStart > bestLength) {
					bestLength = i - runStart;
					bestStart = runStart;
				}
				runStart = -1;
			}
		}
		if (bestLength < 2) {
			bestStart = -1;
		}
		var out = [];
		for (i = 0; i < 8; i++) {
			if (i === bestStart) {
				out.push("");
				i += bestLength - 1;
				if (i === 7) {
					out.push("");
				}
				continue;
			}
			out.push(groups[i].toString(16));
		}
		var text = out.join(":");
		return bestStart === 0 ? ":" + text : text;
	}

	var MDNS = /^([0-9a-f]{8})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{12})\.local$/i;

	function packAddress(text) {
		var ipv4 = packIPv4(text);
		if (ipv4) {
			return { kind: 0, bytes: ipv4 };
		}
		var mdns = MDNS.exec(text);
		if (mdns) {
			var hex = mdns.slice(1).join("").toLowerCase();
			var bytes = [];
			for (var i = 0; i < 32; i += 2) {
				bytes.push(parseInt(hex.substr(i, 2), 16));
			}
			return { kind: 2, bytes: bytes };
		}
		var ipv6 = packIPv6(text);
		if (ipv6) {
			return { kind: 1, bytes: ipv6 };
		}
		return { kind: 3, bytes: Array.from(new TextEncoder().encode(text)) };
	}

	function unpackAddressBytes(kind, bytes) {
		if (kind === 0) {
			return bytes.join(".");
		}
		if (kind === 1) {
			return unpackIPv6(bytes);
		}
		var hex = "";
		for (var i = 0; i < 16; i++) {
			hex += ("0" + bytes[i].toString(16)).slice(-2);
		}
		return [hex.slice(0, 8), hex.slice(8, 12), hex.slice(12, 16), hex.slice(16, 20), hex.slice(20)].join("-") + ".local";
	}

	function unpackAddress(kind, reader) {
		var size = kind === 0 ? 4 : 16;
		var bytes = [];
		for (var i = 0; i < size; i++) {
			bytes.push(reader.u8());
		}
		return unpackAddressBytes(kind, bytes);
	}

	/* ------------------------------------------------------------------ *
	 * ICE candidates
	 *
	 * Only the address, port, transport and type actually have to survive the
	 * trip. Foundation and priority are regenerated - browsers accept whatever
	 * we invent, and priority only orders the connectivity checks, so deriving
	 * it from the position in the list preserves the order the browser wanted.
	 * The related address on srflx and relay candidates is informational and can
	 * be left off entirely. Chrome was checked to accept all three of those
	 * liberties before they were relied on here.
	 * ------------------------------------------------------------------ */

	var CAND_TYPES = ["host", "srflx", "prflx", "relay"];
	var TYPE_PREFERENCE = { host: 126, prflx: 110, srflx: 100, relay: 0 };
	var TCP_TYPES = ["", "active", "passive", "so"];

	function buildCandidate(parts, index) {
		var preference = TYPE_PREFERENCE[parts.type];
		var priority = preference * 16777216 + (65535 - index) * 256 + 255;
		var text = "candidate:" + (index + 1) + " 1 " + parts.transport + " " + priority + " " + parts.address + " " + parts.port + " typ " + parts.type;
		// RFC 5245 makes raddr/rport mandatory on anything but a host candidate.
		// The real values are of no use to the far side and are not carried, but
		// omitting the attributes altogether leaves a candidate that a lenient
		// parser accepts and a strict one may refuse to pair. Zeroes cost
		// nothing on the wire and keep the line well-formed.
		if (parts.type !== "host") {
			text += " raddr 0.0.0.0 rport 0";
		}
		if (parts.tcptype) {
			text += " tcptype " + parts.tcptype;
		}
		return text;
	}

	function parseCandidate(text) {
		var match = /^candidate:(\S+) (\d+) (udp|tcp) (\d+) (\S+) (\d+) typ (host|srflx|prflx|relay)(?: |$)/i.exec(text);
		if (!match) {
			return null;
		}
		var tcptype = / tcptype (\S+)/i.exec(text);
		return {
			component: match[2],
			transport: match[3].toLowerCase(),
			priority: Number(match[4]),
			address: match[5],
			port: Number(match[6]),
			type: match[7].toLowerCase(),
			tcptype: tcptype ? tcptype[1].toLowerCase() : ""
		};
	}

	// Browsers hand out ports in runs, so most of them are one more than the
	// last. Spending two bits on saying so beats spending two bytes.
	var PORT_ABSOLUTE = 0;
	var PORT_NEXT = 1;
	var PORT_SAME = 2;
	var PORT_DELTA = 3;

	function portMode(port, previous) {
		if (previous === null) {
			return PORT_ABSOLUTE;
		}
		if (port === previous + 1) {
			return PORT_NEXT;
		}
		if (port === previous) {
			return PORT_SAME;
		}
		var delta = port - previous;
		var zigzag = delta < 0 ? -2 * delta - 1 : 2 * delta;
		return zigzag < 128 ? PORT_DELTA : PORT_ABSOLUTE;
	}

	function packCandidates(writer, candidates) {
		writer.varint(candidates.length);
		var previous = null;
		candidates.forEach(function (candidate, index) {
			var text = candidate.candidate;
			var parts = parseCandidate(text);
			// Only the address codec can actually lose information here - the
			// rest is either exact or deliberately regenerated - so that is what
			// gets checked before we commit to the compact form.
			var address = parts && packAddress(parts.address);
			var usable = !!parts && parts.component === "1" && parts.port <= 65535 && TCP_TYPES.indexOf(parts.tcptype) >= 0 && candidate.sdpMid === "0" && candidate.sdpMLineIndex === 0 && address.kind !== 3 && unpackAddressBytes(address.kind, address.bytes) === parts.address;

			if (!usable) {
				writer.u8(0x80);
				writer.text(text);
				writer.text(candidate.sdpMid == null ? "" : String(candidate.sdpMid));
				writer.varint(candidate.sdpMLineIndex || 0);
				return;
			}
			var mode = portMode(parts.port, previous);
			writer.u8((CAND_TYPES.indexOf(parts.type) << 5) | ((parts.transport === "tcp" ? 1 : 0) << 4) | (address.kind << 2) | mode);
			if (parts.transport === "tcp") {
				writer.u8(TCP_TYPES.indexOf(parts.tcptype));
			}
			writer.raw(address.bytes);
			if (mode === PORT_ABSOLUTE) {
				writer.u16(parts.port);
			} else if (mode === PORT_DELTA) {
				var delta = parts.port - previous;
				writer.u8(delta < 0 ? -2 * delta - 1 : 2 * delta);
			}
			previous = parts.port;
		});
	}

	function unpackCandidates(reader, ufrag, offset) {
		var count = reader.varint();
		if (count > MAX_CANDIDATES) {
			throw new Error("That code contains too many network routes.");
		}
		var out = [];
		var previous = null;
		for (var index = 0; index < count; index++) {
			var flags = reader.u8();
			if (flags & 0x80) {
				out.push({
					candidate: reader.text(),
					sdpMid: reader.text(),
					sdpMLineIndex: reader.varint(),
					usernameFragment: ufrag
				});
				continue;
			}
			var transport = (flags >> 4) & 1 ? "tcp" : "udp";
			var mode = flags & 3;
			var tcpType = transport === "tcp" ? reader.u8() : 0;
			if (tcpType >= TCP_TYPES.length) {
				throw new Error("That code contains an invalid TCP candidate type.");
			}
			var parts = {
				type: CAND_TYPES[flags >> 5],
				transport: transport,
				tcptype: TCP_TYPES[tcpType],
				address: unpackAddress((flags >> 2) & 3, reader),
				port: 0
			};
			if (mode === PORT_ABSOLUTE) {
				parts.port = reader.u16();
			} else if (mode === PORT_NEXT) {
				parts.port = previous + 1;
			} else if (mode === PORT_SAME) {
				parts.port = previous;
			} else {
				var zigzag = reader.u8();
				parts.port = previous + (zigzag & 1 ? -(zigzag + 1) / 2 : zigzag / 2);
			}
			previous = parts.port;
			out.push({
				candidate: buildCandidate(parts, index + (offset || 0)),
				sdpMid: "0",
				sdpMLineIndex: 0,
				usernameFragment: ufrag
			});
		}
		return out;
	}

	function BitWriter(writer) {
		this.writer = writer;
		this.byte = 0;
		this.bits = 0;
	}
	BitWriter.prototype.write = function (value, count) {
		for (var shift = count - 1; shift >= 0; shift--) {
			this.byte = (this.byte << 1) | ((value >> shift) & 1);
			this.bits += 1;
			if (this.bits === 8) {
				this.writer.u8(this.byte);
				this.byte = 0;
				this.bits = 0;
			}
		}
		return this;
	};
	BitWriter.prototype.raw = function (bytes) {
		for (var index = 0; index < bytes.length; index++) {
			this.write(bytes[index], 8);
		}
		return this;
	};
	BitWriter.prototype.finish = function () {
		if (this.bits) {
			this.writer.u8(this.byte << (8 - this.bits));
			this.byte = 0;
			this.bits = 0;
		}
		return this.writer;
	};

	function BitReader(reader) {
		this.reader = reader;
		this.byte = 0;
		this.bits = 0;
	}
	BitReader.prototype.read = function (count) {
		var value = 0;
		for (var index = 0; index < count; index++) {
			if (!this.bits) {
				this.byte = this.reader.u8();
				this.bits = 8;
			}
			this.bits -= 1;
			value = (value << 1) | ((this.byte >> this.bits) & 1);
		}
		return value;
	};
	BitReader.prototype.raw = function (length) {
		var bytes = [];
		for (var index = 0; index < length; index++) {
			bytes.push(this.read(8));
		}
		return bytes;
	};
	BitReader.prototype.finish = function () {
		if (this.bits && this.byte & ((1 << this.bits) - 1)) {
			throw new Error("That code has invalid candidate padding.");
		}
		this.bits = 0;
	};

	function compactCandidate(candidate) {
		var parts = candidate && parseCandidate(candidate.candidate);
		var address = parts && packAddress(parts.address);
		if (!parts || parts.component !== "1" || parts.port > 65535 || TCP_TYPES.indexOf(parts.tcptype) < 0 || candidate.sdpMid !== "0" || candidate.sdpMLineIndex !== 0 || address.kind === 3 || unpackAddressBytes(address.kind, address.bytes) !== parts.address) {
			return null;
		}
		// A UUIDv4 has six fixed bits. Dense mDNS addresses omit them.
		if (address.kind === 2 && ((address.bytes[6] & 0xf0) !== 0x40 || (address.bytes[8] & 0xc0) !== 0x80)) {
			return null;
		}
		return { parts: parts, address: address };
	}

	function writeDenseAddress(bits, address) {
		if (address.kind !== 2) {
			return bits.raw(address.bytes);
		}
		bits.raw(address.bytes.slice(0, 6));
		bits.write(address.bytes[6] & 15, 4);
		bits.write(address.bytes[7], 8);
		bits.write(address.bytes[8] & 63, 6);
		return bits.raw(address.bytes.slice(9));
	}

	function readDenseAddress(bits, kind) {
		if (kind !== 2) {
			return bits.raw(kind === 0 ? 4 : 16);
		}
		var bytes = bits.raw(6);
		bytes.push(0x40 | bits.read(4));
		bytes.push(bits.read(8));
		bytes.push(0x80 | bits.read(6));
		return bytes.concat(bits.raw(7));
	}

	function commonAddressNibbles(left, right) {
		if (left.kind !== right.kind || (left.kind !== 0 && left.kind !== 1)) {
			return 0;
		}
		for (var index = 0; index < left.bytes.length; index++) {
			if (left.bytes[index] === right.bytes[index]) {
				continue;
			}
			return index * 2 + (left.bytes[index] >> 4 === right.bytes[index] >> 4 ? 1 : 0);
		}
		return left.bytes.length * 2;
	}

	function writeAddressSuffix(bits, bytes, prefixNibbles) {
		for (var nibble = prefixNibbles; nibble < bytes.length * 2; nibble++) {
			var value = nibble & 1 ? bytes[nibble >> 1] & 15 : bytes[nibble >> 1] >> 4;
			bits.write(value, 4);
		}
	}

	function readAddressSuffix(bits, base, prefixNibbles) {
		var total = base.bytes.length * 2;
		if (!prefixNibbles || prefixNibbles >= total) {
			throw new Error("That code contains an invalid address prefix.");
		}
		var nibbles = [];
		for (var nibble = 0; nibble < prefixNibbles; nibble++) {
			nibbles.push(nibble & 1 ? base.bytes[nibble >> 1] & 15 : base.bytes[nibble >> 1] >> 4);
		}
		while (nibbles.length < total) {
			nibbles.push(bits.read(4));
		}
		var bytes = [];
		for (var index = 0; index < nibbles.length; index += 2) {
			bytes.push((nibbles[index] << 4) | nibbles[index + 1]);
		}
		return bytes;
	}

	/*
	 * The dense wire format bit-packs candidate flags and refers back to an
	 * address already used in the same code. This is especially valuable when
	 * a public IPv6 address is both host and reflexive, or TURN exposes UDP and
	 * TCP on the same relay. A reserved address kind also carries an IPv4/IPv6
	 * suffix against an earlier address; shared ISP and TURN prefixes then cost
	 * only the changed nibbles. Unknown future candidate syntax falls back to
	 * the previous lossless candidate codec.
	 */
	function packCandidatesDense(writer, candidates) {
		var compact = candidates.map(compactCandidate);
		var allCompact = compact.every(function (candidate) {
			return !!candidate;
		});
		writer.varint(candidates.length * 2 + (allCompact ? 1 : 0));

		if (!allCompact) {
			var legacy = new Writer();
			packCandidates(legacy, candidates);
			writer.blob(legacy.done());
			return;
		}

		var bits = new BitWriter(writer);
		var addresses = [];
		var previousPort = null;
		compact.forEach(function (candidate) {
			var parts = candidate.parts;
			var address = candidate.address;
			var type = CAND_TYPES.indexOf(parts.type);
			var tcp = parts.transport === "tcp";
			bits.write(type, 2).write(tcp ? 1 : 0, 1);
			if (tcp) {
				bits.write(TCP_TYPES.indexOf(parts.tcptype), 2);
			}

			var key = address.kind + ":" + address.bytes.join(",");
			var addressAt = -1;
			for (var addressIndex = 0; addressIndex < addresses.length; addressIndex++) {
				if (addresses[addressIndex].key === key) {
					addressAt = addressIndex;
					break;
				}
			}
			if (addressAt >= 0 && addressAt < 16) {
				bits.write(1, 1).write(addressAt, 4);
			} else {
				var prefixAt = -1;
				var prefixNibbles = 0;
				for (var prefixIndex = 0; prefixIndex < addresses.length; prefixIndex++) {
					var shared = commonAddressNibbles(address, addresses[prefixIndex]);
					if (shared > prefixNibbles && shared < address.bytes.length * 2) {
						prefixAt = prefixIndex;
						prefixNibbles = shared;
					}
				}
				bits.write(0, 1);
				// Four bits select the base and five carry a nibble count. Only
				// use the prefix form when those nine bits actually save space.
				if (prefixAt >= 0 && prefixAt < 16 && prefixNibbles * 4 > 9) {
					bits.write(3, 2).write(prefixAt, 4).write(prefixNibbles, 5);
					writeAddressSuffix(bits, address.bytes, prefixNibbles);
				} else {
					bits.write(address.kind, 2);
					writeDenseAddress(bits, address);
				}
				if (addresses.length < 16) {
					addresses.push({
						key: key,
						kind: address.kind,
						bytes: address.bytes.slice()
					});
				}
			}

			var mode = portMode(parts.port, previousPort);
			bits.write(mode, 2);
			if (mode === PORT_ABSOLUTE) {
				bits.write(parts.port, 16);
			} else if (mode === PORT_DELTA) {
				var delta = parts.port - previousPort;
				bits.write(delta < 0 ? -2 * delta - 1 : 2 * delta, 8);
			}
			previousPort = parts.port;
		});
		bits.finish();
	}

	function unpackCandidatesDense(reader, ufrag, offset) {
		var taggedCount = reader.varint();
		var count = Math.floor(taggedCount / 2);
		var compact = taggedCount & 1;
		if (count > MAX_CANDIDATES) {
			throw new Error("That code contains too many network routes.");
		}
		if (!compact) {
			var legacyReader = new Reader(reader.blob(MAX_SDP_BYTES));
			var legacy = unpackCandidates(legacyReader, ufrag, offset);
			if (legacy.length !== count || legacyReader.at !== legacyReader.bytes.length) {
				throw new Error("That code contains invalid network routes.");
			}
			return legacy;
		}

		var bits = new BitReader(reader);
		var addresses = [];
		var previousPort = null;
		var out = [];
		for (var index = 0; index < count; index++) {
			var type = bits.read(2);
			var transport = bits.read(1) ? "tcp" : "udp";
			var tcptype = transport === "tcp" ? TCP_TYPES[bits.read(2)] : "";
			if (!CAND_TYPES[type] || (transport === "tcp" && tcptype === undefined)) {
				throw new Error("That code contains an invalid network route.");
			}

			var address;
			if (bits.read(1)) {
				var addressAt = bits.read(4);
				if (addresses[addressAt] === undefined) {
					throw new Error("That code contains an invalid address reference.");
				}
				address = addresses[addressAt].text;
			} else {
				var kind = bits.read(2);
				var packed;
				if (kind === 3) {
					var prefixAt = bits.read(4);
					var prefixNibbles = bits.read(5);
					var base = addresses[prefixAt];
					if (!base || (base.kind !== 0 && base.kind !== 1)) {
						throw new Error("That code contains an invalid address prefix.");
					}
					kind = base.kind;
					packed = readAddressSuffix(bits, base, prefixNibbles);
				} else {
					packed = readDenseAddress(bits, kind);
				}
				address = unpackAddressBytes(kind, packed);
				if (addresses.length < 16) {
					addresses.push({ text: address, kind: kind, bytes: packed });
				}
			}

			var mode = bits.read(2);
			var port;
			if (mode === PORT_ABSOLUTE) {
				port = bits.read(16);
			} else if (previousPort === null) {
				throw new Error("That code contains an invalid relative port.");
			} else if (mode === PORT_NEXT) {
				port = previousPort + 1;
			} else if (mode === PORT_SAME) {
				port = previousPort;
			} else {
				var zigzag = bits.read(8);
				port = previousPort + (zigzag & 1 ? -(zigzag + 1) / 2 : zigzag / 2);
			}
			if (port < 0 || port > 65535) {
				throw new Error("That code contains an invalid network port.");
			}
			previousPort = port;
			out.push({
				candidate: buildCandidate(
					{
						type: CAND_TYPES[type],
						transport: transport,
						tcptype: tcptype,
						address: address,
						port: port
					},
					index + (offset || 0)
				),
				sdpMid: "0",
				sdpMLineIndex: 0,
				usernameFragment: ufrag
			});
		}
		bits.finish();
		return out;
	}

	/* ------------------------------------------------------------------ *
	 * SDP
	 * ------------------------------------------------------------------ */

	var SDP_MODE_KNOWN = 0;
	var SDP_MODE_LINES = 1;
	var SDP_MODE_SKELETON = 2;
	var SDP_MODE_RAW = 3;

	/*
	 * The six values that vary from one connection to the next. Each is lifted
	 * out and replaced by a one-character marker, so putting it back is an
	 * unambiguous string replace rather than a second round of parsing. The o=
	 * username is in here because Firefox stamps its build version into it,
	 * which would otherwise make every Firefox release look like a brand new SDP
	 * shape.
	 */
	var MARK = [];
	for (var markAt = 0; markAt < 6; markAt++) {
		MARK.push(String.fromCharCode(1 + markAt));
	}

	var TOKENS = [
		{ mark: MARK[0], find: /^(o=\S+ )(\d+)( )/m },
		{ mark: MARK[1], find: /^(o=)(\S+)( )/m },
		{ mark: MARK[2], find: /^(a=ice-ufrag:)(\S+)(\r?$)/m },
		{ mark: MARK[3], find: /^(a=ice-pwd:)(\S+)(\r?$)/m },
		{ mark: MARK[4], find: /^(a=fingerprint:sha-256 )(\S+)(\r?$)/m },
		{ mark: MARK[5], find: /^(a=setup:)(\S+)(\r?$)/m }
	];

	function splitSDP(sdp) {
		var values = [];
		var skeleton = sdp;
		for (var i = 0; i < TOKENS.length; i++) {
			var match = TOKENS[i].find.exec(skeleton);
			if (!match) {
				return null;
			}
			values.push(match[2]);
			skeleton = skeleton.replace(match[0], match[1] + TOKENS[i].mark + match[3]);
		}
		// Never trust the regexes over the actual bytes.
		if (joinSDP(skeleton, values) !== sdp) {
			return null;
		}
		return { skeleton: skeleton, values: values };
	}

	function joinSDP(skeleton, values) {
		var sdp = skeleton;
		for (var i = 0; i < TOKENS.length; i++) {
			sdp = sdp.replace(TOKENS[i].mark, values[i]);
		}
		return sdp;
	}

	var CRLF = String.fromCharCode(13) + String.fromCharCode(10);
	var ORIGIN_CHROME = "o=" + MARK[1] + " " + MARK[0] + " 2 IN IP4 127.0.0.1";
	var ORIGIN_FIREFOX = "o=" + MARK[1] + " " + MARK[0] + " 0 IN IP4 0.0.0.0";
	var LINE_UFRAG = "a=ice-ufrag:" + MARK[2];
	var LINE_PWD = "a=ice-pwd:" + MARK[3];
	var LINE_FINGERPRINT = "a=fingerprint:sha-256 " + MARK[4];
	var LINE_SETUP = "a=setup:" + MARK[5];

	/*
	 * Whole shapes we recognise. Legacy codes spend one byte on the index; the
	 * dense format folds its two-bit index into the header.
	 *
	 * There are only two WebRTC implementations in the wild - libwebrtc, which
	 * Chrome, Edge and Safari all use, and Gecko - so this table is not N-by-N
	 * in browsers. It is two-by-two in stacks: each stack's own shape, plus the
	 * shape each produces when answering the other. Four entries cover every
	 * pairing of every current browser, and the set only grows if a third stack
	 * ships. Measured: Chrome offers and Chrome-answering-Chrome both land on
	 * entry 0, Firefox on entry 1, and the two cross-pairings on 2 and 3.
	 *
	 * Index is the id stored in the code, so once this ships, only ever append -
	 * never reorder or remove, or previously issued codes stop decoding.
	 */
	var SKELETONS = [
		["v=0", ORIGIN_CHROME, "s=-", "t=0 0", "a=group:BUNDLE 0", "a=extmap-allow-mixed", "a=msid-semantic: WMS", "m=application 9 UDP/DTLS/SCTP webrtc-datachannel", "c=IN IP4 0.0.0.0", LINE_UFRAG, LINE_PWD, "a=ice-options:trickle", LINE_FINGERPRINT, LINE_SETUP, "a=mid:0", "a=sctp-port:5000", "a=max-message-size:262144", ""].join(CRLF),
		// Gecko's own shape, as VDO.Ninja actually drives it. It carries a
		// session-level a=sendrecv that a bare RTCPeerConnection does not emit -
		// an entry captured from a lab peer connection sat here for a while
		// looking correct and never matching once. Capture from the real app.
		["v=0", ORIGIN_FIREFOX, "s=-", "t=0 0", "a=sendrecv", LINE_FINGERPRINT, "a=group:BUNDLE 0", "a=ice-options:trickle", "a=msid-semantic:WMS *", "m=application 9 UDP/DTLS/SCTP webrtc-datachannel", "c=IN IP4 0.0.0.0", "a=sendrecv", "a=extmap-allow-mixed", LINE_PWD, LINE_UFRAG, "a=mid:0", LINE_SETUP, "a=sctp-port:5000", "a=max-message-size:1073741823", ""].join(CRLF),
		// An answer mirrors the offer it replies to, so the cross-engine pairs
		// are shapes of their own. Firefox answering Chrome:
		["v=0", ORIGIN_FIREFOX, "s=-", "t=0 0", "a=sendrecv", "a=extmap-allow-mixed", LINE_FINGERPRINT, "a=group:BUNDLE 0", "a=ice-options:trickle", "a=msid-semantic:WMS *", "m=application 9 UDP/DTLS/SCTP webrtc-datachannel", "c=IN IP4 0.0.0.0", "a=sendrecv", "a=extmap-allow-mixed", LINE_PWD, LINE_UFRAG, "a=mid:0", LINE_SETUP, "a=sctp-port:5000", "a=max-message-size:1073741823", ""].join(CRLF),
		// ...and Chrome answering Firefox, which drops a=extmap-allow-mixed.
		["v=0", ORIGIN_CHROME, "s=-", "t=0 0", "a=group:BUNDLE 0", "a=msid-semantic: WMS", "m=application 9 UDP/DTLS/SCTP webrtc-datachannel", "c=IN IP4 0.0.0.0", LINE_UFRAG, LINE_PWD, "a=ice-options:trickle", LINE_FINGERPRINT, LINE_SETUP, "a=mid:0", "a=sctp-port:5000", "a=max-message-size:262144", ""].join(CRLF)
	];

	/*
	 * Individual lines we recognise, costing six bits each. This is what stops
	 * an engine we have never seen - and Safari cannot be tested from here -
	 * from falling all the way back to shipping a compressed SDP, which measured
	 * 260 bytes against Chrome's one. Browsers draw on much the same small
	 * vocabulary of datachannel SDP lines even when they order them differently,
	 * so an unfamiliar SDP usually costs a byte per line instead. Append only,
	 * same as above.
	 */
	var SDP_LINES = ["v=0", "s=-", "t=0 0", "", ORIGIN_CHROME, ORIGIN_FIREFOX, "o=" + MARK[1] + " " + MARK[0] + " 1 IN IP4 127.0.0.1", "o=" + MARK[1] + " " + MARK[0] + " 2 IN IP4 0.0.0.0", "a=group:BUNDLE 0", "a=extmap-allow-mixed", "a=msid-semantic: WMS", "a=msid-semantic:WMS *", "a=msid-semantic: WMS *", "m=application 9 UDP/DTLS/SCTP webrtc-datachannel", "m=application 0 UDP/DTLS/SCTP webrtc-datachannel", "c=IN IP4 0.0.0.0", LINE_UFRAG, LINE_PWD, "a=ice-options:trickle", LINE_FINGERPRINT, LINE_SETUP, "a=mid:0", "a=sctp-port:5000", "a=max-message-size:262144", "a=max-message-size:1073741823", "a=sendrecv", "a=sendonly", "a=recvonly", "a=inactive", "a=rtcp-mux", "a=end-of-candidates"];
	var SDP_LINE_INDEX = {};
	SDP_LINES.forEach(function (line, at) {
		if (!(line in SDP_LINE_INDEX)) {
			SDP_LINE_INDEX[line] = at;
		}
	});
	// Six bits an index, so the dictionary can hold 63 entries and still cost
	// less than a byte a line. Unrecognised lines are flagged in the bitstream
	// and their text follows the packed block, which keeps the bit-packing free
	// of variable-length interruptions.
	var LINE_BITS = 6;
	var LINE_VERBATIM = (1 << LINE_BITS) - 1;

	function packLines(skeleton) {
		var writer = new Writer();
		var lines = skeleton.split(CRLF);
		var extras = [];
		var acc = 0;
		var bits = 0;
		writer.varint(lines.length);
		lines.forEach(function (line) {
			var at = SDP_LINE_INDEX[line];
			if (at === undefined || at >= LINE_VERBATIM) {
				at = LINE_VERBATIM;
				extras.push(line);
			}
			acc = (acc << LINE_BITS) | at;
			bits += LINE_BITS;
			while (bits >= 8) {
				bits -= 8;
				writer.u8((acc >> bits) & 0xff);
				acc &= (1 << bits) - 1;
			}
		});
		if (bits) {
			writer.u8((acc << (8 - bits)) & 0xff);
		}
		extras.forEach(function (line) {
			writer.text(line);
		});
		return writer.done();
	}

	function unpackLines(reader) {
		var count = reader.varint();
		if (count > MAX_SDP_LINES) {
			throw new Error("That code contains too many SDP lines.");
		}
		var packed = reader.raw(Math.ceil((count * LINE_BITS) / 8));
		var indices = [];
		var acc = 0;
		var bits = 0;
		var at = 0;
		while (indices.length < count) {
			while (bits < LINE_BITS) {
				acc = (acc << 8) | (at < packed.length ? packed[at++] : 0);
				bits += 8;
			}
			bits -= LINE_BITS;
			indices.push((acc >> bits) & LINE_VERBATIM);
			acc &= (1 << bits) - 1;
		}
		return indices
			.map(function (index) {
				return index === LINE_VERBATIM ? reader.text() : SDP_LINES[index];
			})
			.join(CRLF);
	}

	/*
	 * o= usernames. Chrome writes "-" and pays nothing for it. Firefox writes
	 * its build version, which is thirty characters that change every release,
	 * so runs of digits are lifted out and the rest looked up in a table: the
	 * template costs a byte and "142" and "0" cost three more, instead of
	 * thirty-two for the literal. Append only, and an unrecognised username is
	 * still carried whole.
	 */
	var NAME_DIGITS = String.fromCharCode(7);
	var ORIGIN_NAMES = ["mozilla...THIS_IS_SDPARTA-" + NAME_DIGITS + "." + NAME_DIGITS];
	var NAME_VERBATIM = 255;

	function writeOriginName(writer, name) {
		var digits = [];
		var template = name.replace(/\d+/g, function (run) {
			digits.push(run);
			return NAME_DIGITS;
		});
		var at = ORIGIN_NAMES.indexOf(template);
		if (at < 0 || at >= NAME_VERBATIM) {
			writer.u8(NAME_VERBATIM);
			return writer.text(name);
		}
		writer.u8(at);
		writer.varint(digits.length);
		digits.forEach(function (run) {
			writeString(writer, run, PACK_HEX);
		});
		return writer;
	}

	function readOriginName(reader) {
		var at = reader.u8();
		if (at === NAME_VERBATIM) {
			return reader.text();
		}
		var parts = ORIGIN_NAMES[at].split(NAME_DIGITS);
		var count = reader.varint();
		var out = parts[0];
		for (var i = 0; i < count; i++) {
			out += readString(reader, PACK_HEX) + (parts[i + 1] === undefined ? "" : parts[i + 1]);
		}
		return out;
	}

	var SETUPS = ["actpass", "active", "passive", "holdconn"];

	/* ------------------------------------------------------------------ *
	 * trimming
	 *
	 * Applied before encoding, whether or not the code would already fit.
	 *
	 * Every step here removes only redundancy - a duplicate route, or data ICE
	 * derives during connectivity checks. No step can remove an entire gathered
	 * bootstrap class, so there is always at least one host, server-reflexive and
	 * relay candidate left. An earlier version would strip relay candidates to
	 * make the code fit and produced a QR that could not connect two phones on
	 * cellular at all. Essential routes are never traded for a shorter code; an
	 * unencodable payload fails the hard limit instead.
	 *
	 * Collapsing duplicates is also cheaper than it looks, because ICE discovers
	 * the addresses we left out anyway: the far side sends its checks from every
	 * local interface, and we learn them as peer-reflexive candidates.
	 * ------------------------------------------------------------------ */

	function isType(candidate, type) {
		var parts = parseCandidate(candidate.candidate);
		return !!parts && parts.type === type;
	}

	function isIPv6(candidate) {
		var parts = parseCandidate(candidate.candidate);
		return !!parts && packAddress(parts.address).kind === 1;
	}

	// Keep the highest-priority candidate of this type per address family. The
	// browser's own priority already encodes which interface it prefers.
	function bestPerFamily(type) {
		return function (list) {
			var best = {};
			list.forEach(function (candidate) {
				var parts = parseCandidate(candidate.candidate);
				if (!parts || parts.type !== type) {
					return;
				}
				var kind = packAddress(parts.address).kind;
				var group = parts.transport + "/" + kind;
				best[group] = best[group] || [];
				best[group].push({ priority: parts.priority, candidate: candidate });
				best[group].sort(function (left, right) {
					return right.priority - left.priority;
				});
				// Firefox hides IPv4 and IPv6 host addresses behind unrelated
				// mDNS names. Keep its two preferred names because their family
				// cannot be recovered from the candidate text.
				best[group] = best[group].slice(0, type === "host" && kind === 2 ? 2 : 1);
			});
			var keep = [];
			Object.keys(best).forEach(function (group) {
				best[group].forEach(function (entry) {
					keep.push(entry.candidate);
				});
			});
			return list.filter(function (candidate) {
				return !isType(candidate, type) || keep.indexOf(candidate) >= 0;
			});
		};
	}

	// Every trimming pass must leave at least one route of each bootstrap class
	// the browser gathered. Peer-reflexive routes are excluded here because ICE
	// learns them from connectivity checks; RFC 8445 explicitly says candidate
	// gathering never produces them. In particular, a TCP relay may be the only
	// usable TURN route on a restrictive network.
	function preserveCandidateTypes(before, after) {
		var keep = after.slice();
		["host", "srflx", "relay"].forEach(function (type) {
			var hasType = keep.some(function (candidate) {
				return isType(candidate, type);
			});
			if (hasType) {
				return;
			}
			var best = null;
			before.forEach(function (candidate) {
				var parts = parseCandidate(candidate.candidate);
				if (parts && parts.type === type && (!best || parts.priority > best.priority)) {
					best = { candidate: candidate, priority: parts.priority };
				}
			});
			if (best) {
				keep.push(best.candidate);
			}
		});
		return before.filter(function (candidate) {
			return keep.indexOf(candidate) >= 0;
		});
	}

	var COMPACT_ORDER = [
		// A peer-reflexive address is discovered from an inbound connectivity
		// check and immediately forms a valid pair. It is not a gathered
		// bootstrap route and does not need out-of-band signalling.
		{
			label: "peer-reflexive routes",
			apply: function (list) {
				return list.filter(function (c) {
					return !isType(c, "prflx");
				});
			}
		},
		// A machine with virtual adapters emits a pile of host candidates that
		// are never going to route anywhere.
		{ label: "duplicate local addresses", apply: bestPerFamily("host") },
		// VDO.Ninja offers three TURN servers; one is enough to get connected.
		{ label: "spare TURN servers", apply: bestPerFamily("relay") },
		{ label: "duplicate reflexive addresses", apply: bestPerFamily("srflx") }
	];

	/* ------------------------------------------------------------------ *
	 * code: "Y" + base30000(dense binary)
	 *
	 * Existing "Z" Base2048, "VQ" Base512 and "VN" Base64URL codes remain
	 * decodable.
	 * The magic identifies this wire version, so its first byte is entirely
	 * useful data rather than carrying another version marker.
	 * ------------------------------------------------------------------ */

	function knownFieldSpec(known) {
		if (known === 0 || known === 3) {
			return { ufragMode: PACK_SIX, ufragLength: 4, pwdMode: PACK_SIX, pwdLength: 24 };
		}
		if (known === 1 || known === 2) {
			return { ufragMode: PACK_HEX, ufragLength: 8, pwdMode: PACK_HEX, pwdLength: 32 };
		}
		return null;
	}

	function defaultSetup(role) {
		return role === "answer" ? "active" : "actpass";
	}

	function fixedPacked(text, mode, length) {
		if (text.length !== length || choosePacking(text) !== mode) {
			return null;
		}
		return mode === PACK_HEX ? packFourBit(text) : packSixBit(text);
	}

	function derivedOrigin(fingerprint) {
		var value = BigInt(fingerprint[0] & 0x7f);
		for (var index = 1; index < 8; index++) {
			value = (value << 8n) | BigInt(fingerprint[index]);
		}
		return (value || 1n).toString();
	}

	function derivedSession(fingerprint) {
		var alphabet = "abcdefghijkmnpqrstuvwxyz23456789";
		var output = "";
		var value = 0;
		var bits = 0;
		for (var index = 8; index < fingerprint.length && output.length < 10; index++) {
			value = (value << 8) | fingerprint[index];
			bits += 8;
			while (bits >= 5 && output.length < 10) {
				bits -= 5;
				output += alphabet[(value >> bits) & 31];
				value &= (1 << bits) - 1;
			}
		}
		return output;
	}

	function compactAliases(sdp) {
		var split = splitSDP(sdp);
		var fingerprint = split && packHex(split.values[4]);
		if (!fingerprint || fingerprint.length !== 32) {
			return null;
		}
		return {
			origin: derivedOrigin(fingerprint),
			session: derivedSession(fingerprint)
		};
	}

	function fastKnownData(role, known, split) {
		var spec = knownFieldSpec(known);
		if (!spec || !split || split.values[5] !== defaultSetup(role)) {
			return null;
		}
		var ufrag = fixedPacked(split.values[2], spec.ufragMode, spec.ufragLength);
		var pwd = fixedPacked(split.values[3], spec.pwdMode, spec.pwdLength);
		return ufrag && pwd ? { spec: spec, ufrag: ufrag, pwd: pwd } : null;
	}

	function encodeBlobUnchecked(payload, asBytes) {
		var split = splitSDP(payload.sdp);
		var fingerprint = split && packHex(split.values[4]);
		var setup = split ? SETUPS.indexOf(split.values[5]) : -1;

		// The skeleton pins the hash to sha-256, so 32 bytes is implied and the
		// length prefix can go. Anything else falls back to carrying the SDP.
		var usable = !!split && !!fingerprint && fingerprint.length === 32 && setup >= 0;
		var known = usable ? SKELETONS.indexOf(split.skeleton) : -1;
		var lines = usable && known < 0 ? packLines(split.skeleton) : null;

		var mode = SDP_MODE_RAW;
		if (known >= 0) {
			mode = SDP_MODE_KNOWN;
		} else if (usable) {
			mode = SDP_MODE_LINES;
		}

		var role = payload.role === "answer" ? "answer" : "offer";
		var streamID = role === "offer" && payload.streamID !== DEFAULT_STREAM_ID ? payload.streamID : "";
		var token = payload.session || "";
		if (payload.deriveSession && fastKnownData(role, known, split)) {
			token = "";
		}
		var hasToken = !!token;
		var plainName = usable && split.values[1] === "-";

		function assemble(sdpMode, compressed) {
			var writer = new Writer();
			var fixed = sdpMode === SDP_MODE_KNOWN ? fastKnownData(role, known, split) : null;
			var fixedToken = !hasToken || fixedPacked(token, PACK_SIX, 10);
			var fast = !!fixed && !!fixedToken;
			var auxiliary = sdpMode === SDP_MODE_KNOWN ? known : Math.max(setup, 0);
			var header = (role === "answer" ? 128 : 0) | (sdpMode << 5) | (streamID ? 16 : 0) | (fast ? 8 : 0) | (hasToken ? 4 : 0) | (auxiliary & 3);
			writer.u8(header);

			if (sdpMode === SDP_MODE_KNOWN) {
				if (!fast) {
					writer.u8(Math.max(setup, 0));
				}
			} else if (sdpMode === SDP_MODE_LINES) {
				writer.raw(lines);
			} else {
				writer.blob(compressed);
			}

			if (fast) {
				// In recognised browser shapes, ICE encodings and lengths are
				// fixed. The o= username is descriptive only, so normalise it to
				// "-" instead of transmitting Firefox's release banner. The
				// random origin ID is derived from the DTLS fingerprint.
				writer.raw(fixed.ufrag);
				writer.raw(fixed.pwd);
				writer.raw(fingerprint);
				if (hasToken) {
					writer.raw(fixedToken);
				}
			} else {
				var tokenMode = choosePacking(token);
				if (sdpMode === SDP_MODE_RAW) {
					writer.u8(tokenMode << 4);
				} else {
					var ufragMode = choosePacking(split.values[2]);
					var pwdMode = choosePacking(split.values[3]);
					writer.u8(ufragMode | (pwdMode << 2) | (tokenMode << 4) | (plainName ? 64 : 0));
					writer.u64(split.values[0]);
					if (!plainName) {
						writeOriginName(writer, split.values[1]);
					}
					writeString(writer, split.values[2], ufragMode);
					writeString(writer, split.values[3], pwdMode);
					writer.raw(fingerprint);
				}
				if (hasToken) {
					writeString(writer, token, tokenMode);
				}
			}
			if (streamID) {
				writer.text(streamID);
			}
			packCandidatesDense(writer, payload.candidates);
			return asBytes ? writer.done() : MAGIC + toBase30000(writer.done());
		}

		var encoded;
		if (mode !== SDP_MODE_LINES) {
			encoded = (mode === SDP_MODE_RAW ? deflate(payload.sdp) : Promise.resolve(null)).then(function (compressed) {
				return assemble(mode, compressed);
			});
		} else if (asBytes) {
			// LoRa's line codec also works on browsers without CompressionStream.
			encoded = Promise.resolve(assemble(SDP_MODE_LINES, null));
		} else {
			// A line-encoded skeleton is usually far smaller than a compressed
			// one, but an SDP full of lines we do not know is not, so try both and
			// keep whichever won.
			var viaLines = assemble(SDP_MODE_LINES, null);
			encoded = Promise.resolve()
				.then(function () {
					// Compression is optional here; both ends of the codec must be supported.
					new DecompressionStream("deflate-raw");
					return deflate(split.skeleton);
				})
				.then(function (compressed) {
					var viaDeflate = assemble(SDP_MODE_SKELETON, compressed);
					return viaLines.length <= viaDeflate.length ? viaLines : viaDeflate;
				}, function () {
					return viaLines;
				});
		}

		return encoded;
	}

	function encodeBlob(payload) {
		return encodeBlobUnchecked(payload).then(function (text) {
			var limit = payload.role === "answer" ? ANSWER_LIMIT : OFFER_LIMIT;
			if (text.length > limit) {
				throw new Error("The connection data is " + text.length + " characters and cannot fit the " + limit + "-character limit.");
			}
			return text;
		});
	}

	/* LoRa carries ASCII packets, not the QR alphabet's multi-byte glyphs.
	 * Records are ordered; fragments and duplicates can arrive in any order.
	 * The receiver belongs to one exchange and is discarded on Start over. */
	var LORA_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
	var LORA_LIMIT = 140;
	var LORA_HEADER = 21;

	function toBase32(bytes) {
		var output = "";
		var value = 0;
		var bits = 0;
		for (var index = 0; index < bytes.length; index++) {
			value = (value << 8) | bytes[index];
			bits += 8;
			while (bits >= 5) {
				bits -= 5;
				output += LORA_ALPHABET.charAt((value >> bits) & 31);
			}
			value &= (1 << bits) - 1;
		}
		if (bits) {
			output += LORA_ALPHABET.charAt((value << (5 - bits)) & 31);
		}
		return output;
	}

	function fromBase32(text) {
		var bytes = [];
		var value = 0;
		var bits = 0;
		for (var index = 0; index < text.length; index++) {
			var digit = LORA_ALPHABET.indexOf(text.charAt(index));
			if (digit < 0) {
				throw new Error("That LoRa message contains an unsupported character.");
			}
			value = (value << 5) | digit;
			bits += 5;
			if (bits >= 8) {
				bits -= 8;
				bytes.push((value >> bits) & 255);
			}
			value &= (1 << bits) - 1;
		}
		if (bits >= 5 || value) {
			throw new Error("That LoRa message has invalid padding.");
		}
		return new Uint8Array(bytes);
	}

	function loRaNumber(value, length) {
		var text = "";
		while (length--) {
			text = LORA_ALPHABET.charAt(value & 31) + text;
			value >>>= 5;
		}
		return text;
	}

	function loRaChecksum(text) {
		// CRC-16 detects damaged copy/paste or radio text; DTLS authenticates peers.
		var crc = 65535;
		for (var index = 0; index < text.length; index++) {
			crc ^= text.charCodeAt(index) << 8;
			for (var bit = 0; bit < 8; bit++) {
				crc = ((crc << 1) ^ (crc & 32768 ? 4129 : 0)) & 65535;
			}
		}
		return loRaNumber(crc, 4);
	}

	function loRaPackets(bytes, role, id, sequence, budget) {
		var text = toBase32(bytes);
		var capacity = budget - LORA_HEADER;
		var count = Math.ceil(text.length / capacity);
		if (budget < 40 || budget > LORA_LIMIT || count < 1 || count > 32 || sequence > MAX_CANDIDATES) {
			throw new Error("This connection needs too many LoRa message parts. Use a larger message limit or start over.");
		}
		var packets = [];
		for (var index = 0; index < count; index++) {
			var header = "L1" + (role === "offer" ? "O" : "A") + id + loRaNumber(budget, 2) + loRaNumber(sequence, 2) + loRaNumber(index, 1) + loRaNumber(count - 1, 1);
			var body = text.slice(index * capacity, (index + 1) * capacity);
			packets.push(header + loRaChecksum(header + body) + body);
		}
		return packets;
	}

	function readLoRaPacket(text) {
		var code = extractConnectCode(text).toUpperCase();
		if (!/^L1[OA][A-Z2-7]+$/.test(code) || code.length <= LORA_HEADER || code.length > LORA_LIMIT) {
			throw new Error("Use a complete LoRa message of at most 140 ASCII characters.");
		}
		var sequence = LORA_ALPHABET.indexOf(code.charAt(13)) * 32 + LORA_ALPHABET.indexOf(code.charAt(14));
		var budget = LORA_ALPHABET.indexOf(code.charAt(11)) * 32 + LORA_ALPHABET.indexOf(code.charAt(12));
		var part = LORA_ALPHABET.indexOf(code.charAt(15));
		var count = LORA_ALPHABET.indexOf(code.charAt(16)) + 1;
		if (budget < 40 || budget > LORA_LIMIT || code.length > budget || part >= count || sequence > MAX_CANDIDATES || code.slice(17, 21) !== loRaChecksum(code.slice(0, 17) + code.slice(21))) {
			throw new Error("That LoRa message is damaged or incomplete. Copy it again.");
		}
		return { code: code, id: code.slice(3, 11), budget: budget, role: code.charAt(2) === "O" ? "offer" : "answer", sequence: sequence, part: part, count: count, body: code.slice(21) };
	}

	function receiveLoRaPacket(state, text) {
		var operation = (state.chain || Promise.resolve()).then(function () {
			var packet = readLoRaPacket(text);
			if ((state.id && packet.id !== state.id) || (state.role && packet.role !== state.role)) {
				throw new Error("That LoRa message belongs to another connection or is your own outgoing message.");
			}
			if ((state.budget && packet.budget !== state.budget) || (state.maxBudget && packet.budget > state.maxBudget)) {
				throw new Error("That LoRa message uses a different message limit. Use the replies from this connection.");
			}
			state.id = packet.id;
			state.role = packet.role;
			state.budget = packet.budget;
			state.records = state.records || {};
			state.next = state.next || 0;
			state.highest = Math.max(state.highest || 0, packet.sequence);
			var record = state.records[packet.sequence];
			if (!record) {
				record = { parts: [], count: packet.count, received: 0 };
				state.records[packet.sequence] = record;
			}
			if (record.count !== packet.count || (record.parts[packet.part] && record.parts[packet.part] !== packet.body)) {
				throw new Error("Conflicting LoRa message parts. Use the messages from the same connection.");
			}
			var duplicate = !!record.parts[packet.part];
			if (!duplicate) {
				record.parts[packet.part] = packet.body;
				record.received++;
			}
			var payloads = [];
			var start = state.next;
			var previousPayload = state.payload;
			var previousCount = state.candidateCount;
			function readNext() {
				var next = state.records[state.next];
				if (!next || next.received !== next.count) {
					return Promise.resolve({ payloads: payloads, duplicate: duplicate, next: state.next, pending: state.highest >= state.next });
				}
				var bytes = fromBase32(next.parts.join(""));
				var decoded;
				if (state.next === 0) {
					decoded = decodeDenseBytes(bytes);
				} else {
					var reader = new Reader(bytes);
					var ufrag = /^a=ice-ufrag:(\S+)/m.exec(state.payload.sdp);
					var candidates = unpackCandidatesDense(reader, ufrag ? ufrag[1] : "", state.candidateCount);
					if (reader.at !== bytes.length || !candidates.length || state.candidateCount + candidates.length > MAX_CANDIDATES) {
						throw new Error("That LoRa message contains invalid network routes.");
					}
					decoded = Promise.resolve({ role: state.role, session: state.payload.session, candidates: candidates });
				}
				return decoded.then(function (payload) {
					if (payload.role !== state.role) {
						throw new Error("That LoRa description has the wrong role.");
					}
					if (state.next === 0) {
						state.payload = payload;
						state.candidateCount = 0;
					}
					payload.loraID = state.id;
					payload.loraBudget = state.budget;
					state.candidateCount += payload.candidates.length;
					state.next++;
					payloads.push(payload);
					return readNext();
				});
			}
			return Promise.resolve()
				.then(readNext)
				.catch(function (error) {
					// A malformed later record must not consume an undelivered offer.
					delete state.records[state.next];
					state.next = start;
					state.payload = previousPayload;
					state.candidateCount = previousCount;
					throw error;
				});
		});
		state.chain = operation.catch(function () {});
		return operation;
	}

	function hasConnectMagic(code) {
		return /^L1[OA]/i.test(code) || code.slice(0, MAGIC.length) === MAGIC || code.slice(0, BASE2048_MAGIC.length) === BASE2048_MAGIC || code.slice(0, BASE512_MAGIC.length) === BASE512_MAGIC || code.slice(0, LEGACY_MAGIC.length) === LEGACY_MAGIC;
	}

	function stripChatPunctuation(text) {
		return text.replace(/^[("'[{<]+/, "").replace(/[)"'\]}>.,!?;:]+$/, "");
	}

	function extractConnectCode(text) {
		var submitted = String(text).trim();
		if (!submitted) {
			return "";
		}
		if (submitted.length > MAX_CODE_CHARACTERS) {
			throw new Error("That connect code is too large.");
		}
		var hash = submitted.lastIndexOf("#");
		if (hash >= 0) {
			submitted = submitted.slice(hash + 1).split(/\s/)[0];
		} else {
			var query = /[?&](?:c|code)=([^&#\s]+)/i.exec(submitted);
			if (query) {
				submitted = query[1];
			} else if (/\s/.test(submitted)) {
				var best = "";
				submitted.split(/\s+/).forEach(function (part) {
					var candidate = stripChatPunctuation(part);
					try {
						candidate = decodeURIComponent(candidate);
					} catch (error) {}
					if (hasConnectMagic(candidate) && candidate.length > best.length) {
						best = candidate;
					}
				});
				if (best) {
					submitted = best;
				}
			}
		}
		try {
			submitted = decodeURIComponent(submitted);
		} catch (error) {
			throw new Error("That connect code contains invalid URL encoding.");
		}
		var code = stripChatPunctuation(submitted).replace(/\s+/g, "");
		if (code.length > MAX_CODE_CHARACTERS) {
			throw new Error("That connect code is too large.");
		}
		return code;
	}

	function isCode(text) {
		try {
			var code = extractConnectCode(text);
			return hasConnectMagic(code);
		} catch (error) {
			return false;
		}
	}

	function decodeLegacyBytes(bytes) {
		var reader = new Reader(bytes);
		var header = reader.u8();
		if (header >> 6 !== FORMAT) {
			throw new Error("That code was made by a different version of this page.");
		}
		var role = (header >> 5) & 1 ? "answer" : "offer";
		var mode = (header >> 3) & 3;
		var setup = SETUPS[(header >> 1) & 3];
		var hasStreamID = header & 1;

		var skeleton;
		if (mode === SDP_MODE_KNOWN) {
			var known = reader.u8();
			if (SKELETONS[known] === undefined) {
				throw new Error("That code uses a format this page does not know.");
			}
			skeleton = Promise.resolve(SKELETONS[known]);
		} else if (mode === SDP_MODE_LINES) {
			skeleton = Promise.resolve(unpackLines(reader));
		} else {
			skeleton = inflate(reader.blob(MAX_COMPRESSED_SDP_BYTES));
		}

		return skeleton.then(function (shape) {
			if (new TextEncoder().encode(shape).length > MAX_SDP_BYTES) {
				throw new Error("That connection description is too large.");
			}
			var packed = reader.u8();
			var sdp;
			var ufrag = "";
			if (mode === SDP_MODE_RAW) {
				sdp = shape;
				var found = /^a=ice-ufrag:(\S+)\r?$/m.exec(sdp);
				ufrag = found ? found[1] : "";
			} else {
				var origin = reader.u64();
				var username = packed & 64 ? "-" : readOriginName(reader);
				ufrag = readString(reader, packed & 3);
				var pwd = readString(reader, (packed >> 2) & 3);
				var fingerprint = unpackHex(reader.raw(32));
				sdp = joinSDP(shape, [origin, username, ufrag, pwd, fingerprint, setup]);
			}
			var token = readString(reader, (packed >> 4) & 3);
			var streamID = hasStreamID ? reader.text() : DEFAULT_STREAM_ID;
			var candidates = unpackCandidates(reader, ufrag);
			if (reader.at !== reader.bytes.length) {
				throw new Error("That connect code contains unexpected trailing data.");
			}
			return {
				role: role,
				streamID: streamID,
				session: token,
				sdp: sdp,
				candidates: candidates
			};
		});
	}

	function decodeDenseBytes(bytes) {
		var reader = new Reader(bytes);
		var header = reader.u8();
		var role = header & 128 ? "answer" : "offer";
		var mode = (header >> 5) & 3;
		var hasStreamID = !!(header & 16);
		var fast = !!(header & 8);
		var hasToken = !!(header & 4);
		var auxiliary = header & 3;
		var known = mode === SDP_MODE_KNOWN ? auxiliary : -1;
		var setup;
		if (mode === SDP_MODE_KNOWN) {
			if (SKELETONS[known] === undefined) {
				throw new Error("That code uses a format this page does not know.");
			}
			setup = fast ? defaultSetup(role) : SETUPS[reader.u8()];
		} else {
			if (fast) {
				throw new Error("That code contains invalid compact SDP fields.");
			}
			setup = SETUPS[auxiliary];
		}
		if (!setup) {
			throw new Error("That code contains an invalid SDP setup mode.");
		}

		var skeleton;
		if (mode === SDP_MODE_KNOWN) {
			skeleton = Promise.resolve(SKELETONS[known]);
		} else if (mode === SDP_MODE_LINES) {
			skeleton = Promise.resolve(unpackLines(reader));
		} else {
			skeleton = inflate(reader.blob(MAX_COMPRESSED_SDP_BYTES));
		}

		return skeleton.then(function (shape) {
			if (new TextEncoder().encode(shape).length > MAX_SDP_BYTES) {
				throw new Error("That connection description is too large.");
			}
			var sdp;
			var ufrag = "";
			var token = "";
			if (fast) {
				var spec = knownFieldSpec(known);
				if (!spec) {
					throw new Error("That code uses unknown compact SDP fields.");
				}
				var packedUfrag = reader.raw(Math.ceil((spec.ufragLength * (spec.ufragMode === PACK_HEX ? 4 : 6)) / 8));
				var packedPwd = reader.raw(Math.ceil((spec.pwdLength * (spec.pwdMode === PACK_HEX ? 4 : 6)) / 8));
				ufrag = spec.ufragMode === PACK_HEX ? unpackFourBit(packedUfrag, spec.ufragLength) : unpackSixBit(packedUfrag, spec.ufragLength);
				var pwd = spec.pwdMode === PACK_HEX ? unpackFourBit(packedPwd, spec.pwdLength) : unpackSixBit(packedPwd, spec.pwdLength);
				var fingerprintBytes = reader.raw(32);
				var fingerprint = unpackHex(fingerprintBytes);
				sdp = joinSDP(shape, [derivedOrigin(fingerprintBytes), "-", ufrag, pwd, fingerprint, setup]);
				if (hasToken) {
					token = unpackSixBit(reader.raw(8), 10);
				} else if (role === "offer") {
					token = derivedSession(fingerprintBytes);
				}
			} else {
				var packed = reader.u8();
				if (mode === SDP_MODE_RAW) {
					sdp = shape;
					var found = /^a=ice-ufrag:(\S+)\r?$/m.exec(sdp);
					ufrag = found ? found[1] : "";
				} else {
					var genericOrigin = reader.u64();
					var username = packed & 64 ? "-" : readOriginName(reader);
					ufrag = readString(reader, packed & 3);
					var genericPwd = readString(reader, (packed >> 2) & 3);
					var genericFingerprint = unpackHex(reader.raw(32));
					sdp = joinSDP(shape, [genericOrigin, username, ufrag, genericPwd, genericFingerprint, setup]);
				}
				if (hasToken) {
					token = readString(reader, (packed >> 4) & 3);
				}
			}
			var streamID = hasStreamID ? reader.text() : DEFAULT_STREAM_ID;
			var candidates = unpackCandidatesDense(reader, ufrag);
			if (reader.at !== reader.bytes.length) {
				throw new Error("That connect code contains unexpected trailing data.");
			}
			return {
				role: role,
				streamID: streamID,
				session: token,
				sdp: sdp,
				candidates: candidates
			};
		});
	}

	function decodeBlob(text) {
		return Promise.resolve().then(function () {
			var code = extractConnectCode(text);
			if (code.slice(0, MAGIC.length) === MAGIC) {
				return decodeDenseBytes(fromBase30000(code.slice(MAGIC.length)));
			}
			if (code.slice(0, BASE2048_MAGIC.length) === BASE2048_MAGIC) {
				return decodeDenseBytes(fromBase2048(code.slice(BASE2048_MAGIC.length)));
			}
			if (code.slice(0, BASE512_MAGIC.length) === BASE512_MAGIC) {
				return decodeLegacyBytes(fromBase512(code.slice(BASE512_MAGIC.length)));
			}
			if (code.slice(0, LEGACY_MAGIC.length) === LEGACY_MAGIC) {
				return decodeLegacyBytes(fromBase64url(code.slice(LEGACY_MAGIC.length)));
			}
			throw new Error("That is not a VDO.Ninja connect code.");
		});
	}

	// Rebuild the pair of signalling messages VDO.Ninja originally emitted.
	function toMessages(payload) {
		var fromSlot = payload.role === "offer" ? SLOT_OFFER : SLOT_ANSWER;
		var toSlot = payload.role === "offer" ? SLOT_ANSWER : SLOT_OFFER;
		var description = {
			UUID: toSlot,
			from: fromSlot,
			description: { type: payload.role, sdp: payload.sdp }
		};
		if (payload.session) {
			description.session = payload.session;
		}
		if (payload.role === "offer") {
			description.streamID = payload.streamID;
		}
		var messages = [description];
		if (payload.candidates.length) {
			messages.push({
				UUID: toSlot,
				from: fromSlot,
				type: payload.role === "offer" ? "local" : "remote",
				session: payload.session || undefined,
				candidates: payload.candidates
			});
		}
		return messages;
	}

	/* ------------------------------------------------------------------ *
	 * Session
	 * ------------------------------------------------------------------ */

	function Session(options) {
		options = options || {};
		this.role = options.role;
		this.iframe = options.iframe;
		this.vdoBase = options.vdoBase || "../";
		this.extraParams = options.extraParams || "";
		this.streamID = options.streamID || DEFAULT_STREAM_ID;
		var hardLimit = this.role === "share" ? OFFER_LIMIT : ANSWER_LIMIT;
		var requestedBudget = Number(options.qrBudget);
		this.qrBudget = requestedBudget > 0 ? Math.min(requestedBudget, hardLimit) : hardLimit;
		this.lora = !!options.lora;
		if (this.lora) {
			this.loraBudget = Math.max(40, Math.min(LORA_LIMIT, Math.floor(Number(options.loraBudget) || LORA_LIMIT)));
			this.loraID = options.loraID || toBase32(crypto.getRandomValues(new Uint8Array(5)));
			if (!/^[A-Z2-7]{8}$/.test(this.loraID)) {
				throw new Error("That LoRa connection ID is invalid.");
			}
			this.loraSequence = 0;
			this.loraCandidateKeys = {};
			this.loraCandidateCount = 0;
			this.loraSendChain = Promise.resolve();
		}

		// There is only one code, so everything has to be in it. Local addresses
		// all arrive at once, but a TURN allocation is a round trip to the relay,
		// which on a phone over cellular can easily land a second or two after
		// the rest - so quiet alone is not proof that gathering has finished.
		this.gatherQuiet = options.gatherQuiet || 1500;
		this.gatherRelay = options.gatherRelay || 5000;
		this.gatherMax = options.gatherMax || 9000;
		this.iframeTimeout = options.iframeTimeout || 60000;

		this.slot = this.role === "share" ? SLOT_OFFER : SLOT_ANSWER;
		this.peerSlot = this.role === "share" ? SLOT_ANSWER : SLOT_OFFER;
		this.realUUID = null;
		this.localStreamID = this.role === "join" ? "qrc" + randomID(12) : this.streamID;
		this.connected = false;
		this.vdoConnected = false;
		this.vdoConnections = {};
		this.returnMediaStarted = false;
		this.returnMediaConnected = false;
		this.returnMediaTimer = null;
		this.returnMediaTimeout = options.returnMediaTimeout || 20000;
		this.sidecarConnected = false;
		this.sidecarStarted = false;
		this.sidecarPC = null;
		this.sidecarChannel = null;
		this.sidecarCandidates = [];
		this.sidecarLocalCandidates = [];
		this.sidecarRemoteCandidateKeys = {};
		this.sidecarSignalChain = Promise.resolve();
		this.peerConfiguration = options.peerConfiguration || null;
		this.sidecarTimeout = options.sidecarTimeout || 20000;
		this.dropped = [];

		this.queue = [];
		this.collecting = false;
		this.collected = [];
		this.sawRelay = false;
		this.listeners = {};

		var self = this;
		this.onWindowMessage = function (event) {
			if (!self.iframe || event.source !== self.iframe.contentWindow) {
				return;
			}
			self.handleMessage(event.data);
		};
		global.addEventListener("message", this.onWindowMessage);
	}

	Session.prototype.on = function (name, handler) {
		(this.listeners[name] = this.listeners[name] || []).push(handler);
		return this;
	};

	Session.prototype.emit = function (name, value) {
		if (this.destroyed) {
			return;
		}
		(this.listeners[name] || []).forEach(function (handler) {
			try {
				handler(value);
			} catch (e) {
				console.error(e);
			}
		});
	};

	Session.prototype.updateConnection = function () {
		var connected = !!(this.vdoConnected || this.sidecarConnected);
		if (connected === this.connected) {
			return;
		}
		this.connected = connected;
		this.emit("connected", connected);
	};

	Session.prototype.url = function () {
		// &bypass swaps the WebSocket for postMessage; &password=false keeps the
		// SDP unencrypted so it still packs down; &vd=0&ad=0 publishes nothing at
		// first, which is what keeps the bootstrap offer to a datachannel.
		// Keep the mixer active on the publishing-only bootstrap side too;
		// its default windowed self-preview otherwise hides incoming media.
		// Keep later SDP/ICE on the same alias-translating path as the QR bootstrap.
		var params = "&bypass&bypasssignaling&password=false&cleanoutput&minipreview";
		if (this.role === "share") {
			params = "?push=" + encodeURIComponent(this.streamID) + params + "&vd=0&ad=0&autostart";
		} else {
			params = "?view=" + encodeURIComponent(this.streamID) + "&push=" + encodeURIComponent(this.localStreamID) + params + "&vd=0&ad=0&autostart";
		}
		return this.vdoBase + params + this.extraParams;
	};

	Session.prototype.start = function () {
		if (this.destroyed) {
			return;
		}
		this.iframe.src = this.url();
		this.emit("state", this.role === "share" ? "Starting up..." : "Connecting...");
	};

	Session.prototype.handleMessage = function (data) {
		if (!data || typeof data !== "object") {
			return;
		}
		if (data.cib && ("stats" in data || "deviceList" in data)) {
			this.emit("response", data);
		}
		if ("bypass" in data) {
			this.handleSignal(data.bypass);
			return;
		}
		if ("dataReceived" in data) {
			if (data.dataReceived && data.dataReceived.qrconnect) {
				// Late signalling arriving through the peer's tunnel.
				this.inject(data.dataReceived.qrconnect);
			} else if (data.dataReceived && data.dataReceived.qrsidecar) {
				this.handleSidecarSignal(data.dataReceived.qrsidecar);
			} else {
				// Application data shares the established peer channel, but is
				// kept separate from the signalling namespace above.
				this.emit("data", {
					data: data.dataReceived,
					UUID: data.UUID || ""
				});
			}
			return;
		}
		if ("chat" in data) {
			// Preserve VDO.Ninja's native chat event for wrappers that want it.
			this.emit("chat", data.chat);
			return;
		}
		if ("deviceList" in data) {
			this.emit("devices", Array.isArray(data.deviceList) ? data.deviceList : []);
			return;
		}
		if (!data.action) {
			return;
		}
		if (data.action === "push-connection" || data.action === "view-connection") {
			var connectionKey = data.action + ":" + (data.UUID || "peer");
			if (data.value) {
				this.vdoConnections[connectionKey] = true;
			} else {
				delete this.vdoConnections[connectionKey];
			}
			this.vdoConnected = Object.keys(this.vdoConnections).length > 0;
			this.updateConnection();
			if (data.value && !this.sidecarStarted && this.role === "share" && data.action === "push-connection") {
				this.startSidecar();
			}
			if (this.role === "join" && this.returnMediaStarted && data.action === "push-connection") {
				this.returnMediaConnected = !!data.value;
				if (this.returnMediaConnected) {
					clearTimeout(this.returnMediaTimer);
					this.returnMediaTimer = null;
				}
				this.emit("return-media", this.returnMediaConnected ? "connected" : "disconnected");
			}
		}
		this.emit("event", data);
	};

	// Outbound signalling from our iframe, still addressed with our real UUID.
	Session.prototype.handleSignal = function (raw) {
		var message;
		try {
			message = JSON.parse(raw);
		} catch (e) {
			return;
		}
		if (message.request === "seed" && message.streamID) {
			this.localStreamID = message.streamID;
			if (this.sidecarConnected && this.role === "join" && !this.returnMediaStarted) {
				this.startReturnMedia();
			}
		}
		if (message.from) {
			if (!this.realUUID) {
				this.realUUID = message.from;
				this.flushQueue();
			}
			if (message.from === this.realUUID) {
				message.from = this.slot;
			}
		}
		if (this.connected) {
			this.relaySignal(message);
			return;
		}
		if (this.lora && this.loraLocalPayload && message.candidates) {
			this.sendLoRaCandidates(message);
			return;
		}
		if (this.collecting && (message.description || message.candidates)) {
			this.collect(message);
		}
	};

	// Once the datachannel is up there is no out-of-band channel left, so any
	// further signalling rides a peer datachannel.
	Session.prototype.relaySignal = function (message) {
		if (message.description && message.description.sdp && this.localOriginAlias) {
			var aliases = compactAliases(message.description.sdp);
			var originAlias = aliases ? aliases.origin : this.localOriginAlias;
			message.description.sdp = message.description.sdp.replace(/^(o=)\S+ \d+( )/m, "$1- " + originAlias + "$2");
		}
		if ("session" in message && this.localSessionToken && this.wireSessionToken && message.session === this.localSessionToken) {
			message.session = this.wireSessionToken;
		}
		this.sendPeerData({ qrconnect: message });
	};

	Session.prototype.post = function (message) {
		if (this.destroyed) {
			return;
		}
		try {
			this.iframe.contentWindow.postMessage(message, "*");
		} catch (e) {
			console.error(e);
		}
	};

	Session.prototype.getSidecarConfiguration = function () {
		if (this.peerConfiguration) {
			return this.peerConfiguration;
		}
		var config = {};
		try {
			var child = this.iframe && this.iframe.contentWindow;
			var source = child && child.session && child.session.configuration;
			if (source && source.iceServers) {
				config.iceServers = JSON.parse(JSON.stringify(source.iceServers));
			}
			if (source && source.iceTransportPolicy) {
				config.iceTransportPolicy = source.iceTransportPolicy;
			}
		} catch (e) {
			// A cross-origin iframe cannot expose its configuration. Integrators
			// can supply peerConfiguration explicitly in that case.
		}
		return config;
	};

	Session.prototype.sendBootstrapData = function (data) {
		if (!this.iframe || !this.iframe.contentWindow) {
			return false;
		}
		this.post({ sendData: data });
		return true;
	};

	Session.prototype.sendPeerData = function (data) {
		if (this.sidecarChannel && this.sidecarChannel.readyState === "open") {
			try {
				this.sidecarChannel.send(JSON.stringify(data));
				return true;
			} catch (e) {
				// The original VDO.Ninja channel may still be alive while a
				// sidecar is closing, so fall through to it.
			}
		}
		return this.sendBootstrapData(data);
	};

	Session.prototype.sendData = function (data) {
		if (!this.connected) {
			return false;
		}
		return this.sendPeerData(data);
	};

	Session.prototype.startReturnMedia = function () {
		if (this.destroyed) {
			return false;
		}
		if (this.role !== "join" || this.returnMediaStarted) {
			return this.returnMediaStarted;
		}
		if (!this.sidecarConnected || !this.localStreamID) {
			return false;
		}
		this.returnMediaStarted = true;
		this.emit("return-media", "starting");
		var self = this;
		this.returnMediaTimer = setTimeout(function () {
			if (!self.returnMediaConnected) {
				self.emit("return-media", "failed");
			}
		}, this.returnMediaTimeout);
		this.inject({
			request: "play",
			streamID: this.localStreamID,
			from: this.peerSlot
		});
		return true;
	};

	Session.prototype.setSidecarChannel = function (channel) {
		var self = this;
		if (!channel) {
			return;
		}
		if (self.destroyed) {
			channel.close();
			return;
		}
		self.sidecarChannel = channel;
		channel.onopen = function () {
			if (self.destroyed) {
				channel.close();
				return;
			}
			clearTimeout(self.sidecarTimer);
			clearInterval(self.sidecarDescriptionTimer);
			self.sidecarConnected = true;
			self.updateConnection();
			self.emit("channel", true);
			if (self.role === "join") {
				self.startReturnMedia();
			}
		};
		channel.onmessage = function (event) {
			var data;
			try {
				data = JSON.parse(event.data);
			} catch (e) {
				return;
			}
			if (data && data.qrconnect) {
				self.inject(data.qrconnect);
			} else {
				self.emit("data", {
					data: data,
					UUID: "sidecar"
				});
			}
		};
		channel.onclose = function () {
			clearTimeout(self.sidecarTimer);
			self.sidecarConnected = false;
			self.updateConnection();
			self.emit("channel", false);
		};
	};

	Session.prototype.createSidecar = function (offerer) {
		if (this.sidecarPC) {
			return this.sidecarPC;
		}
		var self = this;
		var pc = new RTCPeerConnection(self.getSidecarConfiguration());
		self.sidecarPC = pc;
		pc.onicecandidate = function (event) {
			if (self.destroyed || !event.candidate) {
				return;
			}
			var candidate = {
				candidate: event.candidate.candidate,
				sdpMid: event.candidate.sdpMid,
				sdpMLineIndex: event.candidate.sdpMLineIndex,
				usernameFragment: event.candidate.usernameFragment || null
			};
			self.sidecarLocalCandidates.push(candidate);
			self.sendBootstrapData({ qrsidecar: { candidate: candidate } });
		};
		pc.ondatachannel = function (event) {
			self.setSidecarChannel(event.channel);
		};
		if (offerer) {
			self.setSidecarChannel(pc.createDataChannel("qrconnect-sidecar", { ordered: true }));
		}
		return pc;
	};

	Session.prototype.flushSidecarCandidates = function () {
		var self = this;
		var candidates = self.sidecarCandidates;
		self.sidecarCandidates = [];
		return Promise.all(
			candidates.map(function (candidate) {
				return self.sidecarPC.addIceCandidate(candidate).catch(function () {
					// One unusable route must not prevent the remaining direct or
					// relay candidates from connecting.
				});
			})
		);
	};

	Session.prototype.sendSidecarDescription = function () {
		var description = this.sidecarPC && this.sidecarPC.localDescription;
		if (!description) {
			return false;
		}
		return this.sendBootstrapData({
			qrsidecar: {
				description: {
					type: description.type,
					sdp: description.sdp
				}
			}
		});
	};

	Session.prototype.repeatSidecarDescription = function () {
		var self = this;
		if (self.destroyed) {
			return;
		}
		clearInterval(self.sidecarDescriptionTimer);
		if (!self.sendSidecarDescription()) {
			throw new Error("The bootstrap channel closed before peer chat was ready.");
		}
		self.sidecarDescriptionTimer = setInterval(function () {
			if (self.sidecarConnected) {
				clearInterval(self.sidecarDescriptionTimer);
				return;
			}
			self.sendSidecarDescription();
			self.sidecarLocalCandidates.forEach(function (candidate) {
				self.sendBootstrapData({ qrsidecar: { candidate: candidate } });
			});
		}, 1000);
	};

	Session.prototype.failSidecar = function (error) {
		clearTimeout(this.sidecarTimer);
		clearInterval(this.sidecarDescriptionTimer);
		this.sidecarError = error instanceof Error ? error : new Error(String(error || "The peer chat channel failed."));
		this.emit("channel-error", this.sidecarError);
	};

	Session.prototype.startSidecar = function () {
		var self = this;
		if (self.sidecarStarted) {
			return;
		}
		self.sidecarStarted = true;
		self.sidecarTimer = setTimeout(function () {
			if (!self.sidecarConnected) {
				self.failSidecar(new Error("The peer chat channel timed out."));
			}
		}, self.sidecarTimeout);
		try {
			var pc = self.createSidecar(true);
			pc.createOffer()
				.then(function (description) {
					return pc.setLocalDescription(description);
				})
				.then(function () {
					self.repeatSidecarDescription();
				})
				.catch(function (error) {
					self.failSidecar(error);
				});
		} catch (error) {
			self.failSidecar(error);
		}
	};

	Session.prototype.handleSidecarSignal = function (signal) {
		var self = this;
		self.sidecarSignalChain = self.sidecarSignalChain
			.then(function () {
				if (self.destroyed) {
					return;
				}
				if (signal.description) {
					var offer = signal.description.type === "offer";
					if (!self.sidecarStarted) {
						self.sidecarStarted = true;
						self.sidecarTimer = setTimeout(function () {
							if (!self.sidecarConnected) {
								self.failSidecar(new Error("The peer chat channel timed out."));
							}
						}, self.sidecarTimeout);
					}
					var pc = self.createSidecar(false);
					if (pc.remoteDescription && pc.remoteDescription.type === signal.description.type) {
						if (offer && pc.localDescription && pc.localDescription.type === "answer") {
							self.repeatSidecarDescription();
						}
						return;
					}
					return pc
						.setRemoteDescription(signal.description)
						.then(function () {
							return self.flushSidecarCandidates();
						})
						.then(function () {
							if (!offer) {
								return;
							}
							return pc
								.createAnswer()
								.then(function (description) {
									return pc.setLocalDescription(description);
								})
								.then(function () {
									self.repeatSidecarDescription();
								});
						});
				}
				if (signal.candidate) {
					var key = signal.candidate.candidate + "|" + signal.candidate.sdpMid + "|" + signal.candidate.sdpMLineIndex;
					if (self.sidecarRemoteCandidateKeys[key]) {
						return;
					}
					self.sidecarRemoteCandidateKeys[key] = true;
					if (!self.sidecarPC || !self.sidecarPC.remoteDescription) {
						self.sidecarCandidates.push(signal.candidate);
						return;
					}
					return self.sidecarPC.addIceCandidate(signal.candidate).catch(function () {
						// The peer may advertise a route this browser cannot use.
					});
				}
			})
			.catch(function (error) {
				self.failSidecar(error);
			});
	};

	// Inbound signalling, re-addressed to whatever UUID our iframe picked.
	Session.prototype.inject = function (message) {
		if (this.destroyed) {
			return;
		}
		if (!this.realUUID) {
			this.queue.push(message);
			return;
		}
		var copy = {};
		for (var key in message) {
			if (message[key] !== undefined) {
				copy[key] = message[key];
			}
		}
		if (copy.UUID === this.slot) {
			copy.UUID = this.realUUID;
		}
		if ("session" in copy && this.localSessionToken && this.wireSessionToken && copy.session === this.wireSessionToken) {
			copy.session = this.localSessionToken;
		}
		this.post({ function: "routeMessage", value: JSON.stringify(copy) });
	};

	Session.prototype.flushQueue = function () {
		var queued = this.queue;
		this.queue = [];
		queued.forEach(this.inject, this);
	};

	Session.prototype.beginCollecting = function () {
		var self = this;
		self.collecting = true;
		self.collected = [];
		self.sawRelay = false;
		self.gatherStart = Date.now();
		clearTimeout(self.hardTimer);
		self.hardTimer = setTimeout(function () {
			self.finishCollecting(true);
		}, self.gatherMax);
	};

	Session.prototype.collect = function (message) {
		var self = this;
		self.collected.push(message);
		(message.candidates || []).forEach(function (candidate) {
			if (candidate && / typ relay/i.test(candidate.candidate || "")) {
				self.sawRelay = true;
			}
		});
		clearTimeout(self.quietTimer);
		self.quietTimer = setTimeout(function () {
			self.finishCollecting();
		}, self.gatherQuiet);
		var count = self.collected.reduce(function (total, entry) {
			return total + (entry.candidates ? entry.candidates.length : 0);
		}, 0);
		self.emit("state", "Found " + count + " network route" + (count === 1 ? "" : "s") + "...");
	};

	Session.prototype.finishCollecting = function (force) {
		var self = this;
		if (!self.collecting) {
			return;
		}
		// Quiet, but no relay candidate yet: hold the door open a little longer
		// rather than shipping a code that cannot cross a carrier-grade NAT.
		// Not worth waiting once the peer is already up, though - browsers
		// abandon pending TURN allocations the moment ICE connects, so on a LAN
		// the relay candidate we are waiting for is never going to arrive.
		if (!force && !self.connected && !self.sawRelay && Date.now() - self.gatherStart < self.gatherRelay) {
			self.emit("state", "Waiting for a relay route...");
			return self.keepGathering();
		}

		var description = null;
		var candidates = [];
		self.collected.forEach(function (message) {
			if (message.description) {
				description = message;
			}
			if (message.candidates) {
				// Firefox signals end-of-gathering with an empty candidate.
				// There is nothing to trickle here, so it is pure overhead.
				candidates = candidates.concat(
					message.candidates.filter(function (candidate) {
						return candidate && candidate.candidate;
					})
				);
			}
		});
		if (!description) {
			self.collecting = false;
			clearTimeout(self.quietTimer);
			clearTimeout(self.hardTimer);
			self.emit("error", new Error("VDO.Ninja did not produce an SDP. Check that the iframe loaded."));
			return;
		}
		if (self.lora) {
			// Late candidates join this chain while the first packet is encoding.
			self.stopGathering();
			self.loraSendChain = self
				.buildBlob(description, candidates)
				.then(function (result) {
					if (self.destroyed) {
						return;
					}
					self.publishLoRaPackets(result.packets);
					self.publishLoRaCandidates(result.remaining);
				})
				.catch(function (error) {
					self.emit("error", error);
				});
			return;
		}

		self.buildBlob(description, candidates).then(
			function (result) {
				self.stopGathering();
				self.emit("blob", result);
			},
			function (error) {
				self.stopGathering();
				self.emit("error", error);
			}
		);
	};

	Session.prototype.keepGathering = function () {
		var self = this;
		clearTimeout(self.quietTimer);
		self.quietTimer = setTimeout(function () {
			self.finishCollecting();
		}, self.gatherQuiet);
	};

	Session.prototype.stopGathering = function () {
		this.collecting = false;
		clearTimeout(this.quietTimer);
		clearTimeout(this.hardTimer);
	};

	// Remove redundant routes before every encode. The budget is a hard limit:
	// an essential payload that still does not fit is rejected rather than
	// emitted oversized.
	Session.prototype.buildBlob = function (description, candidates) {
		var self = this;
		var role = self.role === "share" ? "offer" : "answer";
		var sdp = description.description.sdp;
		var split = splitSDP(sdp);
		var known = split ? SKELETONS.indexOf(split.skeleton) : -1;
		var fast = !!fastKnownData(role, known, split);
		var aliases = fast ? compactAliases(sdp) : null;
		if (aliases) {
			self.localOriginAlias = aliases.origin;
		}
		if (role === "offer") {
			self.localSessionToken = description.session || "";
			self.wireSessionToken = aliases ? aliases.session : self.localSessionToken;
		}
		var payload = {
			role: role,
			streamID: description.streamID || self.streamID,
			// The answer's session token is the same token the offerer generated
			// and already owns. Omitting it also omits the optional session check
			// on the initial answer; subsequent tunneled signalling still carries
			// the original token learned from the offer.
			session: role === "offer" ? description.session || "" : "",
			sdp: sdp,
			candidates: candidates.slice(),
			deriveSession: role === "offer" && !!aliases
		};
		if (self.lora) {
			return self.buildLoRaBlob(payload);
		}
		var hardLimit = payload.role === "offer" ? OFFER_LIMIT : ANSWER_LIMIT;
		self.qrBudget = Number(self.qrBudget) > 0 ? Math.min(Number(self.qrBudget), hardLimit) : hardLimit;
		self.dropped = [];

		COMPACT_ORDER.forEach(function (rule) {
			var kept = preserveCandidateTypes(payload.candidates, rule.apply(payload.candidates));
			if (kept.length && kept.length < payload.candidates.length) {
				payload.candidates = kept;
				self.dropped.push(rule.label);
			}
		});

		return encodeBlobUnchecked(payload).then(function (text) {
			if (self.qrBudget && text.length > self.qrBudget) {
				throw new Error("The essential connection data is " + text.length + " characters and cannot fit the " + self.qrBudget + "-character limit.");
			}
			return {
				text: text,
				candidates: payload.candidates.length,
				dropped: self.dropped.slice(),
				oversized: false
			};
		});
	};

	Session.prototype.takeLoRaCandidates = function (candidates) {
		var kept = [];
		var ufrag = /^a=ice-ufrag:(\S+)/m.exec(this.loraLocalPayload.sdp);
		for (var index = 0; index < candidates.length; index++) {
			var candidate = candidates[index];
			if (!candidate || !candidate.candidate || (candidate.usernameFragment && ufrag && candidate.usernameFragment !== ufrag[1])) {
				continue;
			}
			var key = candidate.sdpMid + ":" + candidate.sdpMLineIndex + ":" + candidate.candidate;
			if (this.loraCandidateKeys[key]) {
				continue;
			}
			if (this.loraCandidateCount >= MAX_CANDIDATES) {
				throw new Error("Too many network routes for this LoRa connection.");
			}
			this.loraCandidateKeys[key] = true;
			this.loraCandidateCount++;
			kept.push(candidate);
		}
		return kept;
	};

	Session.prototype.buildLoRaBlob = function (payload) {
		var self = this;
		self.loraLocalPayload = payload;
		var candidates = self.takeLoRaCandidates(payload.candidates);
		// Give the first message useful Internet routes before local-only routes.
		candidates.sort(function (left, right) {
			var leftRank = 4;
			var rightRank = 4;
			if (isType(left, "srflx")) {
				leftRank = 0;
			} else if (isType(left, "relay")) {
				leftRank = 2;
			}
			if (isType(right, "srflx")) {
				rightRank = 0;
			} else if (isType(right, "relay")) {
				rightRank = 2;
			}
			return leftRank + (isIPv6(left) ? 1 : 0) - rightRank - (isIPv6(right) ? 1 : 0);
		});
		payload.candidates = [];
		var remaining = [];
		var at = 0;
		return encodeBlobUnchecked(payload, true).then(function (bytes) {
			var best = bytes;
			function fitNext() {
				if (at === candidates.length) {
					var packets = loRaPackets(best, payload.role, self.loraID, 0, self.loraBudget);
					self.loraSequence = 1;
					return { packets: packets, remaining: remaining };
				}
				var candidate = candidates[at++];
				payload.candidates.push(candidate);
				return encodeBlobUnchecked(payload, true).then(function (trial) {
					if (Math.ceil((trial.length * 8) / 5) + LORA_HEADER <= self.loraBudget) {
						best = trial;
					} else {
						payload.candidates.pop();
						remaining.push(candidate);
					}
					return fitNext();
				});
			}
			return fitNext();
		});
	};

	Session.prototype.publishLoRaPackets = function (packets) {
		if (this.destroyed || this.connected) {
			return;
		}
		for (var index = 0; index < packets.length; index++) {
			this.emit("packet", { text: packets[index], budget: this.loraBudget });
		}
	};

	Session.prototype.publishLoRaCandidates = function (candidates) {
		var at = 0;
		while (at < candidates.length && !this.destroyed && !this.connected) {
			var batch = [];
			var best;
			while (at < candidates.length) {
				batch.push(candidates[at]);
				var writer = new Writer();
				packCandidatesDense(writer, batch);
				var trial = writer.done();
				if (batch.length > 1 && Math.ceil((trial.length * 8) / 5) + LORA_HEADER > this.loraBudget) {
					break;
				}
				best = trial;
				at++;
			}
			var packets = loRaPackets(best, this.loraLocalPayload.role, this.loraID, this.loraSequence, this.loraBudget);
			this.loraSequence++;
			this.publishLoRaPackets(packets);
		}
	};

	Session.prototype.sendLoRaCandidates = function (message) {
		var self = this;
		if (message.UUID !== self.peerSlot || (message.session && message.session !== self.localSessionToken)) {
			return;
		}
		self.loraSendChain = self.loraSendChain
			.then(function () {
				if (!self.destroyed && !self.connected) {
					self.publishLoRaCandidates(self.takeLoRaCandidates(message.candidates));
				}
			})
			.catch(function (error) {
				self.emit("error", error);
			});
	};

	Session.prototype.acceptLoRaCandidates = function (payload) {
		if (!this.lora || payload.loraID !== this.loraID || payload.role !== (this.role === "share" ? "answer" : "offer")) {
			throw new Error("Those network routes belong to another LoRa connection.");
		}
		var message = {};
		message.UUID = this.slot;
		message.from = this.peerSlot;
		message.type = this.role === "share" ? "remote" : "local";
		message.session = this.wireSessionToken;
		message.candidates = payload.candidates;
		this.inject(message);
	};

	/* -------------------- role-specific entry points -------------------- *
	 *
	 * The sharer has nobody to talk to yet, so it feeds its own iframe the play
	 * request a viewer would normally have sent through the server. VDO.Ninja
	 * then builds a peer connection for a slot that does not exist yet and hands
	 * us the offer.
	 */

	Session.prototype.createOffer = function () {
		var self = this;
		self.emit("state", "Building an offer...");
		self.waitForIframe(function () {
			self.beginCollecting();
			self.inject({ request: "play", streamID: self.streamID, from: SLOT_ANSWER });
		});
	};

	Session.prototype.acceptOffer = function (payload) {
		var self = this;
		self.localSessionToken = payload.session || "";
		self.wireSessionToken = payload.session || "";
		self.emit("state", "Answering...");
		self.waitForIframe(function () {
			self.beginCollecting();
			toMessages(payload).forEach(function (message) {
				self.inject(message);
			});
		});
	};

	Session.prototype.acceptAnswer = function (payload) {
		var self = this;
		self.emit("state", "Answer received, connecting...");
		toMessages(payload).forEach(function (message) {
			self.inject(message);
		});
	};

	/*
	 * The iframe announces itself with a seed or play request as soon as its
	 * signalling stub comes up, which is also how we learn its real UUID. On a
	 * healthy load that is well under a second, so this deadline costs a working
	 * connection nothing - it only bounds how long a broken one takes to say so.
	 *
	 * It is generous because fifteen seconds was not. VDO.Ninja start-up can
	 * stall on a slow or hostile origin - it was seen taking longer than fifteen
	 * seconds on Safari served over plain http - and the old limit turned that
	 * into a hard error for a page that was about to work. The exact cause was
	 * never pinned down; hiding navigator.mediaDevices reproduces the start-up
	 * exception but not the stall, so the obvious explanation is not the right
	 * one.
	 */
	Session.prototype.waitForIframe = function (callback) {
		var self = this;
		if (self.destroyed) {
			return;
		}
		if (self.realUUID) {
			callback();
			return;
		}
		var waited = 0;
		clearInterval(self.iframeTimer);
		self.iframeTimer = setInterval(function () {
			waited += 100;
			if (self.destroyed) {
				clearInterval(self.iframeTimer);
			} else if (self.realUUID) {
				clearInterval(self.iframeTimer);
				callback();
			} else if (waited === 12000) {
				self.emit("state", "Still starting up...");
			} else if (waited >= self.iframeTimeout) {
				clearInterval(self.iframeTimer);
				self.emit("error", new Error("VDO.Ninja did not start inside the iframe. On a slow connection it can take a while; reload to try again."));
			}
		}, 100);
	};

	Session.prototype.destroy = function () {
		if (this.destroyed) {
			return;
		}
		this.destroyed = true;
		global.removeEventListener("message", this.onWindowMessage);
		clearTimeout(this.quietTimer);
		clearTimeout(this.hardTimer);
		clearTimeout(this.sidecarTimer);
		clearTimeout(this.returnMediaTimer);
		clearInterval(this.sidecarDescriptionTimer);
		clearInterval(this.iframeTimer);
		if (this.sidecarChannel) {
			try {
				this.sidecarChannel.close();
			} catch (e) {}
		}
		if (this.sidecarPC) {
			try {
				this.sidecarPC.close();
			} catch (e) {}
		}
		this.connected = false;
		this.sidecarConnected = false;
		this.returnMediaConnected = false;
		this.queue = [];
		this.listeners = {};
		// Unload the media owner as well as closing the wrapper's data channel.
		if (this.iframe) {
			this.iframe.src = "about:blank";
		}
	};

	global.QRConnect = {
		Session: Session,
		encodeBlob: encodeBlob,
		decodeBlob: decodeBlob,
		readLoRaPacket: readLoRaPacket,
		receiveLoRaPacket: receiveLoRaPacket,
		LORA_LIMIT: LORA_LIMIT,
		toMessages: toMessages,
		randomID: randomID,
		MAGIC: MAGIC,
		BASE2048_MAGIC: BASE2048_MAGIC,
		BASE512_MAGIC: BASE512_MAGIC,
		LEGACY_MAGIC: LEGACY_MAGIC,
		isCode: isCode,
		extractCode: extractConnectCode,
		OFFER_LIMIT: OFFER_LIMIT,
		ANSWER_LIMIT: ANSWER_LIMIT,
		DEFAULT_STREAM_ID: DEFAULT_STREAM_ID,
		SLOT_OFFER: SLOT_OFFER,
		SLOT_ANSWER: SLOT_ANSWER
	};
})(window);
