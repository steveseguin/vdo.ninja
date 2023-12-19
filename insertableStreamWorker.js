'use strict';

var cryptoKey = false; // 'aabbccddeeff00112233445566778899';
const IV_LENGTH = 16; // AES-CBC requires a 16-byte IV

var lyraCodecModule = false;

var EncryptionFailedMessage = null;
async function encodeFunction(encodedFrame, controller) {
	if (cryptoKey){
		try {
			const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
			encodedFrame.data = await encryptAES(encodedFrame.data, cryptoKey, iv);
			if (EncryptionFailedMessage){
				console.error("👍 e2e encryption is now working! whew.");
				DecryptionFailedMessage = false;
			}
		} catch(e){
			if (!EncryptionFailedMessage){
				EncryptionFailedMessage = true;
				console.error("😢 e2e encryption failed");  // didn't encode. we'll just send it anyways. Insecure or user friendly? :|
			}
		}
	}
	controller.enqueue(encodedFrame);
}

var DecryptionFailedMessage = null;
async function decodeFunction(encodedFrame, controller) {
	if (cryptoKey){
		try {
			const iv = new Uint8Array(encodedFrame.data.slice(0, IV_LENGTH));
			const encryptedData = new Uint8Array(encodedFrame.data.slice(IV_LENGTH));
			encodedFrame.data = await decryptAES(encryptedData, cryptoKey, iv);
			if (DecryptionFailedMessage){
				console.error("👍 Decryption is now working");
				DecryptionFailedMessage = false;
			}
		} catch(e){
			if (!DecryptionFailedMessage){
				DecryptionFailedMessage = true;
				console.error("😢 Decryption failed. Will try without E2EE."); // lets try playing it, just in case it wasn't encoded. Insecure or user friendly? :|
			}
		}
	}
	controller.enqueue(encodedFrame); 
}

async function encryptAES(data, key, iv) {
	const encodedKey = new TextEncoder().encode(key);
	const importedKey = await crypto.subtle.importKey(
		'raw',
		encodedKey,
		'AES-CBC',
		false,
		['encrypt']
	);

	const encryptedData = await crypto.subtle.encrypt(
		{ name: 'AES-CBC', iv: iv },
		importedKey,
		data
	);

	const encryptedBytes = new Uint8Array(encryptedData);
	return new Uint8Array([...iv, ...encryptedBytes]).buffer;
}

async function decryptAES(encryptedData, key, iv) {
	const encodedKey = new TextEncoder().encode(key);
	const importedKey = await crypto.subtle.importKey(
		'raw',
		encodedKey,
		'AES-CBC',
		false,
		['decrypt']
	);

	return await crypto.subtle.decrypt(
		{ name: 'AES-CBC', iv: iv },
		importedKey,
		encryptedData
	);
}

function lyraEncodeFunction(encodedFrame, controller) { // Snippet is Apache 2.0 licenced. Source: https://github.com/Flash-Meeting/lyra-webrtc
	const inputDataArray = new Uint8Array(encodedFrame.data);

	const inputBufferPtr = lyraCodecModule._malloc(encodedFrame.data.byteLength);
	const encodedBufferPtr = lyraCodecModule._malloc(1024);

	lyraCodecModule.HEAPU8.set(inputDataArray, inputBufferPtr);
	const length = lyraCodecModule.encode(inputBufferPtr, inputDataArray.length, 16000, encodedBufferPtr);

	const newData = new ArrayBuffer(length);
	if (length > 0){
		const newDataArray = new Uint8Array(newData);
		newDataArray.set(lyraCodecModule.HEAPU8.subarray(encodedBufferPtr, encodedBufferPtr + length));
	}
	lyraCodecModule._free(inputBufferPtr);
	lyraCodecModule._free(encodedBufferPtr);
	encodedFrame.data = newData;
	controller.enqueue(encodedFrame);
}
function lyraDecodeFunction(encodedFrame, controller) { // Apache 2.0 licenced. Source: https://github.com/Flash-Meeting/lyra-webrtc
	const newData = new ArrayBuffer(16000 * 0.02 * 2);
	if (encodedFrame.data.byteLength > 0) {
		const inputDataArray = new Uint8Array(encodedFrame.data);
		const inputBufferPtr = lyraCodecModule._malloc(encodedFrame.data.byteLength);
		const outputBufferPtr = lyraCodecModule._malloc(2048);
		lyraCodecModule.HEAPU8.set(inputDataArray, inputBufferPtr);
		const length = lyraCodecModule.decode(inputBufferPtr,
			inputDataArray.length, 16000,
			outputBufferPtr);
		const newDataArray = new Uint8Array(newData);
		newDataArray.set(lyraCodecModule.HEAPU8.subarray(outputBufferPtr, outputBufferPtr + length));
		lyraCodecModule._free(inputBufferPtr);
		lyraCodecModule._free(outputBufferPtr);
	}
	encodedFrame.data = newData;
	controller.enqueue(encodedFrame);
}

function handleTransform(operation, readable, writable) {
	if (operation === 'encode') {
		const transformStream = new TransformStream({
			transform: encodeFunction,
		});
		readable.pipeThrough(transformStream).pipeTo(writable);
	} else if (operation === 'decode') {
		const transformStream = new TransformStream({
			transform: decodeFunction,
		});
		readable.pipeThrough(transformStream).pipeTo(writable);
		
	} else if (operation === 'lyradecode') {
		const transformStream = new TransformStream({
			transform: lyraDecodeFunction,
		});
		readable.pipeThrough(transformStream).pipeTo(writable);	
	} else if (operation === 'lyraencode') {
		const transformStream = new TransformStream({
			transform: lyraEncodeFunction,
		});
		readable.pipeThrough(transformStream).pipeTo(writable);	
	} else if (operation === 'redencode') {
        const transformStream = new TransformStream({
            transform: (chunk, controller) => {
				controller.enqueue(chunk);
				/* const clonedChunk = new EncodedAudioChunk({
				  type: chunk.type,
				  timestamp: chunk.timestamp,
				  // .. i need a way to clone the binary data here
				  data: cloneChunkData(chunk)
				});
				controller.enqueue(clonedChunk); */
            },
        });
        readable.pipeThrough(transformStream).pipeTo(writable);
    } else if (operation === 'reddecode') {
        const receivedChunks = new Set();
        const transformStream = new TransformStream({
            transform: (chunk, controller) => {
                const chunkId = chunk.timestamp;
                if (receivedChunks.has(chunkId)) {
                    // If it's a duplicate, ignore it
                    return;
                }
                receivedChunks.add(chunkId);
                controller.enqueue(chunk);
            },
        });
        readable.pipeThrough(transformStream).pipeTo(writable);
		
    } else if (operation === 'pass') {
        const transformStream = new TransformStream({
            transform: (chunk, controller) => {
                controller.enqueue(chunk);
            },
        });
        readable.pipeThrough(transformStream).pipeTo(writable);
    } 
}

if (self.RTCTransformEvent) {
	self.onrtctransform = (event) => {
		const transformer = event.transformer;
		handleTransform(transformer.options.operation, transformer.readable, transformer.writable);
	};
}
onmessage = async (event) => {
	if (event.data.cryptoKey) {
		cryptoKey = event.data.cryptoKey;
		if (cryptoKey){
			self.postMessage('crypto key Loaded. e2ee will be used where possible');
		} else {
			self.postMessage('crypto key Un-loaded. ?');
		}
	} else if (event.data.cryptoPhrase) {
		try {
		const encoder = new TextEncoder();
			const data = encoder.encode(event.data.cryptoPhrase);
			const hashBuffer = await crypto.subtle.digest('SHA-256', data);
			const keyBytes = new Uint8Array(hashBuffer, 0, IV_LENGTH);
			cryptoKey = Array.from(keyBytes).map(byte => byte.toString(16).padStart(2, '0')).join('');
		} catch(e){
			console.error(e);
			cryptoKey = false;
		}
		if (cryptoKey){
			self.postMessage('crypto key Generated from a password. e2ee will be used where possible');
		} else {
			self.postMessage('WARNING: crypto key could Not be generated');
		}
	} else if (event.data.lyraCodecModule) {
		lyraCodecModule = event.data.lyraCodecModule;
	}
	if (event.data.operation) {
		return handleTransform(event.data.operation, event.data.readable, event.data.writable);
	}
};

self.postMessage('insertableStreamWorkerLoaded');
