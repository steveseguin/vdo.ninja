// This file is Apache 2.0 Licenced
// See README.md in this location for licencing details and credits

var _scriptDir = ".";
var lyraCodecModule = function(Module) {
	Module = Module || {};

	function GROWABLE_HEAP_I8() {
		if (wasmMemory.buffer != buffer) {
			updateGlobalBufferAndViews(wasmMemory.buffer)
		}
		return HEAP8
	}

	function GROWABLE_HEAP_U8() {
		if (wasmMemory.buffer != buffer) {
			updateGlobalBufferAndViews(wasmMemory.buffer)
		}
		return HEAPU8
	}

	function GROWABLE_HEAP_I16() {
		if (wasmMemory.buffer != buffer) {
			updateGlobalBufferAndViews(wasmMemory.buffer)
		}
		return HEAP16
	}

	function GROWABLE_HEAP_U16() {
		if (wasmMemory.buffer != buffer) {
			updateGlobalBufferAndViews(wasmMemory.buffer)
		}
		return HEAPU16
	}

	function GROWABLE_HEAP_I32() {
		if (wasmMemory.buffer != buffer) {
			updateGlobalBufferAndViews(wasmMemory.buffer)
		}
		return HEAP32
	}

	function GROWABLE_HEAP_U32() {
		if (wasmMemory.buffer != buffer) {
			updateGlobalBufferAndViews(wasmMemory.buffer)
		}
		return HEAPU32
	}

	function GROWABLE_HEAP_F32() {
		if (wasmMemory.buffer != buffer) {
			updateGlobalBufferAndViews(wasmMemory.buffer)
		}
		return HEAPF32
	}

	function GROWABLE_HEAP_F64() {
		if (wasmMemory.buffer != buffer) {
			updateGlobalBufferAndViews(wasmMemory.buffer)
		}
		return HEAPF64
	}
	var Module = typeof Module !== "undefined" ? Module : {};
	var readyPromiseResolve, readyPromiseReject;
	Module["ready"] = new Promise(function(resolve, reject) {
		readyPromiseResolve = resolve;
		readyPromiseReject = reject
	});
	var moduleOverrides = {};
	var key;
	for (key in Module) {
		if (Module.hasOwnProperty(key)) {
			moduleOverrides[key] = Module[key]
		}
	}
	var arguments_ = [];
	var thisProgram = "./this.program";
	var quit_ = function(status, toThrow) {
		throw toThrow
	};
	var ENVIRONMENT_IS_WEB = typeof window === "object";
	var ENVIRONMENT_IS_WORKER = typeof importScripts === "function";
	var ENVIRONMENT_IS_NODE = typeof process === "object" && typeof process.versions === "object" && typeof process.versions.node === "string";
	var ENVIRONMENT_IS_PTHREAD = Module["ENVIRONMENT_IS_PTHREAD"] || false;
	var scriptDirectory = "";

	function locateFile(path) {
		if (Module["locateFile"]) {
			return Module["locateFile"](path, scriptDirectory)
		}
		return scriptDirectory + path
	}
	var read_, readAsync, readBinary, setWindowTitle;

	function logExceptionOnExit(e) {
		if (e instanceof ExitStatus) return;
		var toLog = e;
		err("exiting due to exception: " + toLog)
	}
	var nodeFS;
	var nodePath;
	if (ENVIRONMENT_IS_NODE) {
		if (ENVIRONMENT_IS_WORKER) {
			scriptDirectory = require("path").dirname(scriptDirectory) + "/"
		} else {
			scriptDirectory = __dirname + "/"
		}
		read_ = function shell_read(filename, binary) {
			if (!nodeFS) nodeFS = require("fs");
			if (!nodePath) nodePath = require("path");
			filename = nodePath["normalize"](filename);
			return nodeFS["readFileSync"](filename, binary ? null : "utf8")
		};
		readBinary = function readBinary(filename) {
			var ret = read_(filename, true);
			if (!ret.buffer) {
				ret = new Uint8Array(ret)
			}
			assert(ret.buffer);
			return ret
		};
		readAsync = function readAsync(filename, onload, onerror) {
			if (!nodeFS) nodeFS = require("fs");
			if (!nodePath) nodePath = require("path");
			filename = nodePath["normalize"](filename);
			nodeFS["readFile"](filename, function(err, data) {
				if (err) onerror(err);
				else onload(data.buffer)
			})
		};
		if (process["argv"].length > 1) {
			thisProgram = process["argv"][1].replace(/\\/g, "/")
		}
		arguments_ = process["argv"].slice(2);
		process["on"]("uncaughtException", function(ex) {
			if (!(ex instanceof ExitStatus)) {
				throw ex
			}
		});
		process["on"]("unhandledRejection", function(reason) {
			throw reason
		});
		quit_ = function(status, toThrow) {
			if (keepRuntimeAlive()) {
				process["exitCode"] = status;
				throw toThrow
			}
			logExceptionOnExit(toThrow);
			process["exit"](status)
		};
		Module["inspect"] = function() {
			return "[Emscripten Module object]"
		};
		var nodeWorkerThreads;
		try {
			nodeWorkerThreads = require("worker_threads")
		} catch (e) {
			console.error('The "worker_threads" module is not supported in this node.js build - perhaps a newer version is needed?');
			throw e
		}
		global.Worker = nodeWorkerThreads.Worker
	} else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
		if (ENVIRONMENT_IS_WORKER) {
			scriptDirectory = self.location.href
		} else if (typeof document !== "undefined" && document.currentScript) {
			scriptDirectory = document.currentScript.src
		}
		if (_scriptDir) {
			scriptDirectory = _scriptDir
		}
		if (scriptDirectory.indexOf("blob:") !== 0) {
			scriptDirectory = scriptDirectory.substr(0, scriptDirectory.replace(/[?#].*/, "").lastIndexOf("/") + 1)
		} else {
			scriptDirectory = ""
		}
		if (ENVIRONMENT_IS_NODE) {
			read_ = function shell_read(filename, binary) {
				if (!nodeFS) nodeFS = require("fs");
				if (!nodePath) nodePath = require("path");
				filename = nodePath["normalize"](filename);
				return nodeFS["readFileSync"](filename, binary ? null : "utf8")
			};
			readBinary = function readBinary(filename) {
				var ret = read_(filename, true);
				if (!ret.buffer) {
					ret = new Uint8Array(ret)
				}
				assert(ret.buffer);
				return ret
			};
			readAsync = function readAsync(filename, onload, onerror) {
				if (!nodeFS) nodeFS = require("fs");
				if (!nodePath) nodePath = require("path");
				filename = nodePath["normalize"](filename);
				nodeFS["readFile"](filename, function(err, data) {
					if (err) onerror(err);
					else onload(data.buffer)
				})
			}
		} else {
			read_ = function(url) {
				var xhr = new XMLHttpRequest;
				xhr.open("GET", url, false);
				xhr.send(null);
				return xhr.responseText
			};
			if (ENVIRONMENT_IS_WORKER) {
				readBinary = function(url) {
					var xhr = new XMLHttpRequest;
					xhr.open("GET", url, false);
					xhr.responseType = "arraybuffer";
					xhr.send(null);
					return new Uint8Array(xhr.response)
				}
			}
			readAsync = function(url, onload, onerror) {
				var xhr = new XMLHttpRequest;
				xhr.open("GET", url, true);
				xhr.responseType = "arraybuffer";
				xhr.onload = function() {
					if (xhr.status == 200 || xhr.status == 0 && xhr.response) {
						onload(xhr.response);
						return
					}
					onerror()
				};
				xhr.onerror = onerror;
				xhr.send(null)
			}
		}
		setWindowTitle = function(title) {
			document.title = title
		}
	} else {}
	if (ENVIRONMENT_IS_NODE) {
		if (typeof performance === "undefined") {
			global.performance = require("perf_hooks").performance
		}
	}
	var out = Module["print"] || console.log.bind(console);
	var err = Module["printErr"] || console.warn.bind(console);
	for (key in moduleOverrides) {
		if (moduleOverrides.hasOwnProperty(key)) {
			Module[key] = moduleOverrides[key]
		}
	}
	moduleOverrides = null;
	if (Module["arguments"]) arguments_ = Module["arguments"];
	if (Module["thisProgram"]) thisProgram = Module["thisProgram"];
	if (Module["quit"]) quit_ = Module["quit"];

	function warnOnce(text) {
		if (!warnOnce.shown) warnOnce.shown = {};
		if (!warnOnce.shown[text]) {
			warnOnce.shown[text] = 1;
			err(text)
		}
	}
	var tempRet0 = 0;
	var setTempRet0 = function(value) {
		tempRet0 = value
	};
	var Atomics_load = Atomics.load;
	var Atomics_store = Atomics.store;
	var Atomics_compareExchange = Atomics.compareExchange;
	var wasmBinary;
	if (Module["wasmBinary"]) wasmBinary = Module["wasmBinary"];
	var noExitRuntime = Module["noExitRuntime"] || true;
	if (typeof WebAssembly !== "object") {
		abort("no native wasm support detected")
	}
	var wasmMemory;
	var wasmModule;
	var ABORT = false;
	var EXITSTATUS;

	function assert(condition, text) {
		if (!condition) {
			abort("Assertion failed: " + text)
		}
	}

	function TextDecoderWrapper(encoding) {
		var textDecoder = new TextDecoder(encoding);
		this.decode = function(data) {
			if (data.buffer instanceof SharedArrayBuffer) {
				data = new Uint8Array(data)
			}
			return textDecoder.decode.call(textDecoder, data)
		}
	}
	var UTF8Decoder = typeof TextDecoder !== "undefined" ? new TextDecoderWrapper("utf8") : undefined;

	function UTF8ArrayToString(heap, idx, maxBytesToRead) {
		var endIdx = idx + maxBytesToRead;
		var endPtr = idx;
		while (heap[endPtr] && !(endPtr >= endIdx)) ++endPtr;
		if (endPtr - idx > 16 && heap.subarray && UTF8Decoder) {
			return UTF8Decoder.decode(heap.subarray(idx, endPtr))
		} else {
			var str = "";
			while (idx < endPtr) {
				var u0 = heap[idx++];
				if (!(u0 & 128)) {
					str += String.fromCharCode(u0);
					continue
				}
				var u1 = heap[idx++] & 63;
				if ((u0 & 224) == 192) {
					str += String.fromCharCode((u0 & 31) << 6 | u1);
					continue
				}
				var u2 = heap[idx++] & 63;
				if ((u0 & 240) == 224) {
					u0 = (u0 & 15) << 12 | u1 << 6 | u2
				} else {
					u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | heap[idx++] & 63
				}
				if (u0 < 65536) {
					str += String.fromCharCode(u0)
				} else {
					var ch = u0 - 65536;
					str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023)
				}
			}
		}
		return str
	}

	function UTF8ToString(ptr, maxBytesToRead) {
		return ptr ? UTF8ArrayToString(GROWABLE_HEAP_U8(), ptr, maxBytesToRead) : ""
	}

	function stringToUTF8Array(str, heap, outIdx, maxBytesToWrite) {
		if (!(maxBytesToWrite > 0)) return 0;
		var startIdx = outIdx;
		var endIdx = outIdx + maxBytesToWrite - 1;
		for (var i = 0; i < str.length; ++i) {
			var u = str.charCodeAt(i);
			if (u >= 55296 && u <= 57343) {
				var u1 = str.charCodeAt(++i);
				u = 65536 + ((u & 1023) << 10) | u1 & 1023
			}
			if (u <= 127) {
				if (outIdx >= endIdx) break;
				heap[outIdx++] = u
			} else if (u <= 2047) {
				if (outIdx + 1 >= endIdx) break;
				heap[outIdx++] = 192 | u >> 6;
				heap[outIdx++] = 128 | u & 63
			} else if (u <= 65535) {
				if (outIdx + 2 >= endIdx) break;
				heap[outIdx++] = 224 | u >> 12;
				heap[outIdx++] = 128 | u >> 6 & 63;
				heap[outIdx++] = 128 | u & 63
			} else {
				if (outIdx + 3 >= endIdx) break;
				heap[outIdx++] = 240 | u >> 18;
				heap[outIdx++] = 128 | u >> 12 & 63;
				heap[outIdx++] = 128 | u >> 6 & 63;
				heap[outIdx++] = 128 | u & 63
			}
		}
		heap[outIdx] = 0;
		return outIdx - startIdx
	}

	function stringToUTF8(str, outPtr, maxBytesToWrite) {
		return stringToUTF8Array(str, GROWABLE_HEAP_U8(), outPtr, maxBytesToWrite)
	}

	function lengthBytesUTF8(str) {
		var len = 0;
		for (var i = 0; i < str.length; ++i) {
			var u = str.charCodeAt(i);
			if (u >= 55296 && u <= 57343) u = 65536 + ((u & 1023) << 10) | str.charCodeAt(++i) & 1023;
			if (u <= 127) ++len;
			else if (u <= 2047) len += 2;
			else if (u <= 65535) len += 3;
			else len += 4
		}
		return len
	}
	var UTF16Decoder = typeof TextDecoder !== "undefined" ? new TextDecoderWrapper("utf-16le") : undefined;

	function UTF16ToString(ptr, maxBytesToRead) {
		var endPtr = ptr;
		var idx = endPtr >> 1;
		var maxIdx = idx + maxBytesToRead / 2;
		while (!(idx >= maxIdx) && GROWABLE_HEAP_U16()[idx]) ++idx;
		endPtr = idx << 1;
		if (endPtr - ptr > 32 && UTF16Decoder) {
			return UTF16Decoder.decode(GROWABLE_HEAP_U8().subarray(ptr, endPtr))
		} else {
			var str = "";
			for (var i = 0; !(i >= maxBytesToRead / 2); ++i) {
				var codeUnit = GROWABLE_HEAP_I16()[ptr + i * 2 >> 1];
				if (codeUnit == 0) break;
				str += String.fromCharCode(codeUnit)
			}
			return str
		}
	}

	function stringToUTF16(str, outPtr, maxBytesToWrite) {
		if (maxBytesToWrite === undefined) {
			maxBytesToWrite = 2147483647
		}
		if (maxBytesToWrite < 2) return 0;
		maxBytesToWrite -= 2;
		var startPtr = outPtr;
		var numCharsToWrite = maxBytesToWrite < str.length * 2 ? maxBytesToWrite / 2 : str.length;
		for (var i = 0; i < numCharsToWrite; ++i) {
			var codeUnit = str.charCodeAt(i);
			GROWABLE_HEAP_I16()[outPtr >> 1] = codeUnit;
			outPtr += 2
		}
		GROWABLE_HEAP_I16()[outPtr >> 1] = 0;
		return outPtr - startPtr
	}

	function lengthBytesUTF16(str) {
		return str.length * 2
	}

	function UTF32ToString(ptr, maxBytesToRead) {
		var i = 0;
		var str = "";
		while (!(i >= maxBytesToRead / 4)) {
			var utf32 = GROWABLE_HEAP_I32()[ptr + i * 4 >> 2];
			if (utf32 == 0) break;
			++i;
			if (utf32 >= 65536) {
				var ch = utf32 - 65536;
				str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023)
			} else {
				str += String.fromCharCode(utf32)
			}
		}
		return str
	}

	function stringToUTF32(str, outPtr, maxBytesToWrite) {
		if (maxBytesToWrite === undefined) {
			maxBytesToWrite = 2147483647
		}
		if (maxBytesToWrite < 4) return 0;
		var startPtr = outPtr;
		var endPtr = startPtr + maxBytesToWrite - 4;
		for (var i = 0; i < str.length; ++i) {
			var codeUnit = str.charCodeAt(i);
			if (codeUnit >= 55296 && codeUnit <= 57343) {
				var trailSurrogate = str.charCodeAt(++i);
				codeUnit = 65536 + ((codeUnit & 1023) << 10) | trailSurrogate & 1023
			}
			GROWABLE_HEAP_I32()[outPtr >> 2] = codeUnit;
			outPtr += 4;
			if (outPtr + 4 > endPtr) break
		}
		GROWABLE_HEAP_I32()[outPtr >> 2] = 0;
		return outPtr - startPtr
	}

	function lengthBytesUTF32(str) {
		var len = 0;
		for (var i = 0; i < str.length; ++i) {
			var codeUnit = str.charCodeAt(i);
			if (codeUnit >= 55296 && codeUnit <= 57343) ++i;
			len += 4
		}
		return len
	}

	function allocateUTF8OnStack(str) {
		var size = lengthBytesUTF8(str) + 1;
		var ret = stackAlloc(size);
		stringToUTF8Array(str, GROWABLE_HEAP_I8(), ret, size);
		return ret
	}

	function writeArrayToMemory(array, buffer) {
		GROWABLE_HEAP_I8().set(array, buffer)
	}

	function writeAsciiToMemory(str, buffer, dontAddNull) {
		for (var i = 0; i < str.length; ++i) {
			GROWABLE_HEAP_I8()[buffer++ >> 0] = str.charCodeAt(i)
		}
		if (!dontAddNull) GROWABLE_HEAP_I8()[buffer >> 0] = 0
	}

	function alignUp(x, multiple) {
		if (x % multiple > 0) {
			x += multiple - x % multiple
		}
		return x
	}
	var buffer, HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;
	if (ENVIRONMENT_IS_PTHREAD) {
		buffer = Module["buffer"]
	}

	function updateGlobalBufferAndViews(buf) {
		buffer = buf;
		Module["HEAP8"] = HEAP8 = new Int8Array(buf);
		Module["HEAP16"] = HEAP16 = new Int16Array(buf);
		Module["HEAP32"] = HEAP32 = new Int32Array(buf);
		Module["HEAPU8"] = HEAPU8 = new Uint8Array(buf);
		Module["HEAPU16"] = HEAPU16 = new Uint16Array(buf);
		Module["HEAPU32"] = HEAPU32 = new Uint32Array(buf);
		Module["HEAPF32"] = HEAPF32 = new Float32Array(buf);
		Module["HEAPF64"] = HEAPF64 = new Float64Array(buf)
	}
	var INITIAL_MEMORY = Module["INITIAL_MEMORY"] || 16777216;
	if (ENVIRONMENT_IS_PTHREAD) {
		wasmMemory = Module["wasmMemory"];
		buffer = Module["buffer"]
	} else {
		if (Module["wasmMemory"]) {
			wasmMemory = Module["wasmMemory"]
		} else {
			wasmMemory = new WebAssembly.Memory({
				"initial": INITIAL_MEMORY / 65536,
				"maximum": 2147483648 / 65536,
				"shared": true
			});
			if (!(wasmMemory.buffer instanceof SharedArrayBuffer)) {
				err("requested a shared WebAssembly.Memory but the returned buffer is not a SharedArrayBuffer, indicating that while the browser has SharedArrayBuffer it does not have WebAssembly threads support - you may need to set a flag");
				if (ENVIRONMENT_IS_NODE) {
					console.log("(on node you may need: --experimental-wasm-threads --experimental-wasm-bulk-memory and also use a recent version)")
				}
				throw Error("bad memory")
			}
		}
	}
	if (wasmMemory) {
		buffer = wasmMemory.buffer
	}
	INITIAL_MEMORY = buffer.byteLength;
	updateGlobalBufferAndViews(buffer);
	var wasmTable;
	var __ATPRERUN__ = [];
	var __ATINIT__ = [];
	var __ATMAIN__ = [];
	var __ATEXIT__ = [];
	var __ATPOSTRUN__ = [];
	var runtimeInitialized = false;
	var runtimeExited = false;
	var runtimeKeepaliveCounter = 0;

	function keepRuntimeAlive() {
		return noExitRuntime || runtimeKeepaliveCounter > 0
	}

	function preRun() {
		if (ENVIRONMENT_IS_PTHREAD) return;
		if (Module["preRun"]) {
			if (typeof Module["preRun"] == "function") Module["preRun"] = [Module["preRun"]];
			while (Module["preRun"].length) {
				addOnPreRun(Module["preRun"].shift())
			}
		}
		callRuntimeCallbacks(__ATPRERUN__)
	}

	function initRuntime() {
		runtimeInitialized = true;
		if (ENVIRONMENT_IS_PTHREAD) return;
		if (!Module["noFSInit"] && !FS.init.initialized) FS.init();
		FS.ignorePermissions = false;
		TTY.init();
		callRuntimeCallbacks(__ATINIT__)
	}

	function preMain() {
		if (ENVIRONMENT_IS_PTHREAD) return;
		callRuntimeCallbacks(__ATMAIN__)
	}

	function exitRuntime() {
		if (ENVIRONMENT_IS_PTHREAD) return;
		PThread.terminateAllThreads();
		runtimeExited = true
	}

	function postRun() {
		if (ENVIRONMENT_IS_PTHREAD) return;
		if (Module["postRun"]) {
			if (typeof Module["postRun"] == "function") Module["postRun"] = [Module["postRun"]];
			while (Module["postRun"].length) {
				addOnPostRun(Module["postRun"].shift())
			}
		}
		callRuntimeCallbacks(__ATPOSTRUN__)
	}

	function addOnPreRun(cb) {
		__ATPRERUN__.unshift(cb)
	}

	function addOnInit(cb) {
		__ATINIT__.unshift(cb)
	}

	function addOnPostRun(cb) {
		__ATPOSTRUN__.unshift(cb)
	}
	var runDependencies = 0;
	var runDependencyWatcher = null;
	var dependenciesFulfilled = null;

	function getUniqueRunDependency(id) {
		return id
	}

	function addRunDependency(id) {
		runDependencies++;
		if (Module["monitorRunDependencies"]) {
			Module["monitorRunDependencies"](runDependencies)
		}
	}

	function removeRunDependency(id) {
		runDependencies--;
		if (Module["monitorRunDependencies"]) {
			Module["monitorRunDependencies"](runDependencies)
		}
		if (runDependencies == 0) {
			if (runDependencyWatcher !== null) {
				clearInterval(runDependencyWatcher);
				runDependencyWatcher = null
			}
			if (dependenciesFulfilled) {
				var callback = dependenciesFulfilled;
				dependenciesFulfilled = null;
				callback()
			}
		}
	}
	Module["preloadedImages"] = {};
	Module["preloadedAudios"] = {};

	function abort(what) {
		if (ENVIRONMENT_IS_PTHREAD) {
			postMessage({
				"cmd": "onAbort",
				"arg": what
			})
		} else {
			if (Module["onAbort"]) {
				Module["onAbort"](what)
			}
		}
		what = "Aborted(" + what + ")";
		err(what);
		ABORT = true;
		EXITSTATUS = 1;
		what += ". Build with -s ASSERTIONS=1 for more info.";
		var e = new WebAssembly.RuntimeError(what);
		readyPromiseReject(e);
		throw e
	}
	var dataURIPrefix = "data:application/octet-stream;base64,";

	function isDataURI(filename) {
		return filename.startsWith(dataURIPrefix)
	}

	function isFileURI(filename) {
		return filename.startsWith("file://")
	}
	var wasmBinaryFile = "./thirdparty/lyra/webassembly_codec_wrapper.wasm";

	function getBinary(file) {
		try {
			if (file == wasmBinaryFile && wasmBinary) {
				return new Uint8Array(wasmBinary)
			}
			if (readBinary) {
				return readBinary(file)
			} else {
				throw "both async and sync fetching of the wasm failed"
			}
		} catch (err) {
			abort(err)
		}
	}

	function getBinaryPromise() {
		if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER)) {
			if (typeof fetch === "function" && !isFileURI(wasmBinaryFile)) {
				return fetch(wasmBinaryFile, {
					credentials: "same-origin"
				}).then(function(response) {
					if (!response["ok"]) {
						throw "failed to load wasm binary file at '" + wasmBinaryFile + "'"
					}
					return response["arrayBuffer"]()
				}).catch(function() {
					return getBinary(wasmBinaryFile)
				})
			} else {
				if (readAsync) {
					return new Promise(function(resolve, reject) {
						readAsync(wasmBinaryFile, function(response) {
							resolve(new Uint8Array(response))
						}, reject)
					})
				}
			}
		}
		return Promise.resolve().then(function() {
			return getBinary(wasmBinaryFile)
		})
	}

	function createWasm() {
		var info = {
			"a": asmLibraryArg
		};

		function receiveInstance(instance, module) {
			var exports = instance.exports;
			Module["asm"] = exports;
			registerTlsInit(Module["asm"]["ka"]);
			wasmTable = Module["asm"]["fa"];
			addOnInit(Module["asm"]["da"]);
			wasmModule = module;
			if (!ENVIRONMENT_IS_PTHREAD) {
				removeRunDependency("wasm-instantiate")
			}
		}
		if (!ENVIRONMENT_IS_PTHREAD) {
			addRunDependency("wasm-instantiate")
		}

		function receiveInstantiationResult(result) {
			receiveInstance(result["instance"], result["module"])
		}

		function instantiateArrayBuffer(receiver) {
			return getBinaryPromise().then(function(binary) {
				return WebAssembly.instantiate(binary, info)
			}).then(function(instance) {
				return instance
			}).then(receiver, function(reason) {
				err("failed to asynchronously prepare wasm: " + reason);
				abort(reason)
			})
		}

		function instantiateAsync() {
			if (!wasmBinary && typeof WebAssembly.instantiateStreaming === "function" && !isDataURI(wasmBinaryFile) && !isFileURI(wasmBinaryFile) && typeof fetch === "function") {
				return fetch(wasmBinaryFile, {
					credentials: "same-origin"
				}).then(function(response) {
					var result = WebAssembly.instantiateStreaming(response, info);
					return result.then(receiveInstantiationResult, function(reason) {
						err("wasm streaming compile failed: " + reason);
						err("falling back to ArrayBuffer instantiation");
						return instantiateArrayBuffer(receiveInstantiationResult)
					})
				})
			} else {
				return instantiateArrayBuffer(receiveInstantiationResult)
			}
		}
		if (Module["instantiateWasm"]) {
			try {
				var exports = Module["instantiateWasm"](info, receiveInstance);
				return exports
			} catch (e) {
				err("Module.instantiateWasm callback failed with error: " + e);
				return false
			}
		}
		instantiateAsync().catch(readyPromiseReject);
		return {}
	}
	var tempDouble;
	var tempI64;
	var ASM_CONSTS = {
		196044: function() {
			return typeof wasmOffsetConverter !== "undefined"
		}
	};

	function callRuntimeCallbacks(callbacks) {
		while (callbacks.length > 0) {
			var callback = callbacks.shift();
			if (typeof callback == "function") {
				callback(Module);
				continue
			}
			var func = callback.func;
			if (typeof func === "number") {
				if (callback.arg === undefined) {
					wasmTable.get(func)()
				} else {
					wasmTable.get(func)(callback.arg)
				}
			} else {
				func(callback.arg === undefined ? null : callback.arg)
			}
		}
	}
	Module["callRuntimeCallbacks"] = callRuntimeCallbacks;

	function demangle(func) {
		return func
	}
	Module["demangle"] = demangle;

	function demangleAll(text) {
		var regex = /\b_Z[\w\d_]+/g;
		return text.replace(regex, function(x) {
			var y = demangle(x);
			return x === y ? x : y + " [" + x + "]"
		})
	}
	Module["demangleAll"] = demangleAll;

	function _emscripten_futex_wake(addr, count) {
		if (addr <= 0 || addr > GROWABLE_HEAP_I8().length || addr & 3 != 0 || count < 0) return -28;
		if (count == 0) return 0;
		if (count >= 2147483647) count = Infinity;
		var mainThreadWaitAddress = Atomics.load(GROWABLE_HEAP_I32(), __emscripten_main_thread_futex >> 2);
		var mainThreadWoken = 0;
		if (mainThreadWaitAddress == addr) {
			var loadedAddr = Atomics.compareExchange(GROWABLE_HEAP_I32(), __emscripten_main_thread_futex >> 2, mainThreadWaitAddress, 0);
			if (loadedAddr == mainThreadWaitAddress) {
				--count;
				mainThreadWoken = 1;
				if (count <= 0) return 1
			}
		}
		var ret = Atomics.notify(GROWABLE_HEAP_I32(), addr >> 2, count);
		if (ret >= 0) return ret + mainThreadWoken;
		throw "Atomics.notify returned an unexpected value " + ret
	}
	Module["_emscripten_futex_wake"] = _emscripten_futex_wake;

	function killThread(pthread_ptr) {
		GROWABLE_HEAP_I32()[pthread_ptr + 8 >> 2] = 0;
		var pthread = PThread.pthreads[pthread_ptr];
		delete PThread.pthreads[pthread_ptr];
		pthread.worker.terminate();
		freeThreadData(pthread);
		PThread.runningWorkers.splice(PThread.runningWorkers.indexOf(pthread.worker), 1);
		pthread.worker.pthread = undefined
	}
	Module["killThread"] = killThread;

	function cancelThread(pthread_ptr) {
		var pthread = PThread.pthreads[pthread_ptr];
		pthread.worker.postMessage({
			"cmd": "cancel"
		})
	}
	Module["cancelThread"] = cancelThread;

	function cleanupThread(pthread_ptr) {
		var pthread = PThread.pthreads[pthread_ptr];
		if (pthread) {
			GROWABLE_HEAP_I32()[pthread_ptr + 8 >> 2] = 0;
			var worker = pthread.worker;
			PThread.returnWorkerToPool(worker)
		}
	}
	Module["cleanupThread"] = cleanupThread;

	function freeThreadData(pthread) {
		if (!pthread) return;
		if (pthread.threadInfoStruct) {
			_free(pthread.threadInfoStruct)
		}
		pthread.threadInfoStruct = 0;
		if (pthread.allocatedOwnStack && pthread.stackBase) _free(pthread.stackBase);
		pthread.stackBase = 0;
		if (pthread.worker) pthread.worker.pthread = null
	}
	Module["freeThreadData"] = freeThreadData;

	function _exit(status) {
		exit(status)
	}
	Module["_exit"] = _exit;

	function handleException(e) {
		if (e instanceof ExitStatus || e == "unwind") {
			return EXITSTATUS
		}
		quit_(1, e)
	}
	Module["handleException"] = handleException;
	var PThread = {
		unusedWorkers: [],
		runningWorkers: [],
		tlsInitFunctions: [],
		initMainThreadBlock: function() {},
		initWorker: function() {},
		pthreads: {},
		threadExitHandlers: [],
		setExitStatus: function(status) {
			EXITSTATUS = status
		},
		terminateAllThreads: function() {
			for (var t in PThread.pthreads) {
				var pthread = PThread.pthreads[t];
				if (pthread && pthread.worker) {
					PThread.returnWorkerToPool(pthread.worker)
				}
			}
			for (var i = 0; i < PThread.unusedWorkers.length; ++i) {
				var worker = PThread.unusedWorkers[i];
				worker.terminate()
			}
			PThread.unusedWorkers = []
		},
		returnWorkerToPool: function(worker) {
			PThread.runWithoutMainThreadQueuedCalls(function() {
				delete PThread.pthreads[worker.pthread.threadInfoStruct];
				PThread.unusedWorkers.push(worker);
				PThread.runningWorkers.splice(PThread.runningWorkers.indexOf(worker), 1);
				freeThreadData(worker.pthread);
				worker.pthread = undefined
			})
		},
		runWithoutMainThreadQueuedCalls: function(func) {
			GROWABLE_HEAP_I32()[__emscripten_allow_main_runtime_queued_calls >> 2] = 0;
			try {
				func()
			} finally {
				GROWABLE_HEAP_I32()[__emscripten_allow_main_runtime_queued_calls >> 2] = 1
			}
		},
		receiveObjectTransfer: function(data) {},
		threadInit: function() {
			for (var i in PThread.tlsInitFunctions) {
				PThread.tlsInitFunctions[i]()
			}
		},
		loadWasmModuleToWorker: function(worker, onFinishedLoading) {
			worker.onmessage = function(e) {
				var d = e["data"];
				var cmd = d["cmd"];
				if (worker.pthread) PThread.currentProxiedOperationCallerThread = worker.pthread.threadInfoStruct;
				if (d["targetThread"] && d["targetThread"] != _pthread_self()) {
					var thread = PThread.pthreads[d.targetThread];
					if (thread) {
						thread.worker.postMessage(d, d["transferList"])
					} else {
						err('Internal error! Worker sent a message "' + cmd + '" to target pthread ' + d["targetThread"] + ", but that thread no longer exists!")
					}
					PThread.currentProxiedOperationCallerThread = undefined;
					return
				}
				if (cmd === "processQueuedMainThreadWork") {
					_emscripten_main_thread_process_queued_calls()
				} else if (cmd === "spawnThread") {
					spawnThread(d)
				} else if (cmd === "cleanupThread") {
					cleanupThread(d["thread"])
				} else if (cmd === "killThread") {
					killThread(d["thread"])
				} else if (cmd === "cancelThread") {
					cancelThread(d["thread"])
				} else if (cmd === "loaded") {
					worker.loaded = true;
					if (onFinishedLoading) onFinishedLoading(worker);
					if (worker.runPthread) {
						worker.runPthread();
						delete worker.runPthread
					}
				} else if (cmd === "print") {
					out("Thread " + d["threadId"] + ": " + d["text"])
				} else if (cmd === "printErr") {
					err("Thread " + d["threadId"] + ": " + d["text"])
				} else if (cmd === "alert") {
					alert("Thread " + d["threadId"] + ": " + d["text"])
				} else if (cmd === "detachedExit") {
					PThread.returnWorkerToPool(worker)
				} else if (cmd === "cancelDone") {
					PThread.returnWorkerToPool(worker)
				} else if (d.target === "setimmediate") {
					worker.postMessage(d)
				} else if (cmd === "onAbort") {
					if (Module["onAbort"]) {
						Module["onAbort"](d["arg"])
					}
				} else {
					err("worker sent an unknown command " + cmd)
				}
				PThread.currentProxiedOperationCallerThread = undefined
			};
			worker.onerror = function(e) {
				err("pthread sent an error! " + e.filename + ":" + e.lineno + ": " + e.message);
				throw e
			};
			if (ENVIRONMENT_IS_NODE) {
				worker.on("message", function(data) {
					worker.onmessage({
						data: data
					})
				});
				worker.on("error", function(e) {
					worker.onerror(e)
				});
				worker.on("detachedExit", function() {})
			}
			worker.postMessage({
				"cmd": "load",
				"urlOrBlob": Module["mainScriptUrlOrBlob"],
				"wasmMemory": wasmMemory,
				"wasmModule": wasmModule
			})
		},
		allocateUnusedWorker: function() {
			if (!Module["locateFile"]) {
				PThread.unusedWorkers.push(new Worker("webassembly_codec_wrapper.worker.js"));
				return
			}
			var pthreadMainJs = locateFile("webassembly_codec_wrapper.worker.js");
			PThread.unusedWorkers.push(new Worker(pthreadMainJs))
		},
		getNewWorker: function() {
			if (PThread.unusedWorkers.length == 0) {
				PThread.allocateUnusedWorker();
				PThread.loadWasmModuleToWorker(PThread.unusedWorkers[0])
			}
			return PThread.unusedWorkers.pop()
		}
	};
	Module["PThread"] = PThread;

	function establishStackSpace(stackTop, stackMax) {
		_emscripten_stack_set_limits(stackTop, stackMax);
		stackRestore(stackTop)
	}
	Module["establishStackSpace"] = establishStackSpace;

	function exitOnMainThread(returnCode) {
		if (ENVIRONMENT_IS_PTHREAD) return _emscripten_proxy_to_main_thread_js(1, 0, returnCode);
		try {
			_exit(returnCode)
		} catch (e) {
			handleException(e)
		}
	}
	Module["exitOnMainThread"] = exitOnMainThread;

	function invokeEntryPoint(ptr, arg) {
		return wasmTable.get(ptr)(arg)
	}
	Module["invokeEntryPoint"] = invokeEntryPoint;

	function jsStackTrace() {
		var error = new Error;
		if (!error.stack) {
			try {
				throw new Error
			} catch (e) {
				error = e
			}
			if (!error.stack) {
				return "(no stack trace available)"
			}
		}
		return error.stack.toString()
	}
	Module["jsStackTrace"] = jsStackTrace;

	function registerTlsInit(tlsInitFunc, moduleExports, metadata) {
		PThread.tlsInitFunctions.push(tlsInitFunc)
	}
	Module["registerTlsInit"] = registerTlsInit;

	function stackTrace() {
		var js = jsStackTrace();
		if (Module["extraStackTrace"]) js += "\n" + Module["extraStackTrace"]();
		return demangleAll(js)
	}
	Module["stackTrace"] = stackTrace;

	function ___assert_fail(condition, filename, line, func) {
		abort("Assertion failed: " + UTF8ToString(condition) + ", at: " + [filename ? UTF8ToString(filename) : "unknown filename", line, func ? UTF8ToString(func) : "unknown function"])
	}
	Module["___assert_fail"] = ___assert_fail;
	var _emscripten_get_now;
	if (ENVIRONMENT_IS_NODE) {
		_emscripten_get_now = function() {
			var t = process["hrtime"]();
			return t[0] * 1e3 + t[1] / 1e6
		}
	} else if (ENVIRONMENT_IS_PTHREAD) {
		_emscripten_get_now = function() {
			return performance.now() - Module["__performance_now_clock_drift"]
		}
	} else _emscripten_get_now = function() {
		return performance.now()
	};
	Module["_emscripten_get_now"] = _emscripten_get_now;
	var _emscripten_get_now_is_monotonic = true;
	Module["_emscripten_get_now_is_monotonic"] = _emscripten_get_now_is_monotonic;

	function setErrNo(value) {
		GROWABLE_HEAP_I32()[___errno_location() >> 2] = value;
		return value
	}
	Module["setErrNo"] = setErrNo;

	function _clock_gettime(clk_id, tp) {
		var now;
		if (clk_id === 0) {
			now = Date.now()
		} else if ((clk_id === 1 || clk_id === 4) && _emscripten_get_now_is_monotonic) {
			now = _emscripten_get_now()
		} else {
			setErrNo(28);
			return -1
		}
		GROWABLE_HEAP_I32()[tp >> 2] = now / 1e3 | 0;
		GROWABLE_HEAP_I32()[tp + 4 >> 2] = now % 1e3 * 1e3 * 1e3 | 0;
		return 0
	}
	Module["_clock_gettime"] = _clock_gettime;

	function ___clock_gettime(a0, a1) {
		return _clock_gettime(a0, a1)
	}
	Module["___clock_gettime"] = ___clock_gettime;

	function _atexit(func, arg) {
		if (ENVIRONMENT_IS_PTHREAD) return _emscripten_proxy_to_main_thread_js(2, 1, func, arg)
	}
	Module["_atexit"] = _atexit;

	function ___cxa_atexit(a0, a1) {
		return _atexit(a0, a1)
	}
	Module["___cxa_atexit"] = ___cxa_atexit;

	function ___cxa_thread_atexit(routine, arg) {
		PThread.threadExitHandlers.push(function() {
			wasmTable.get(routine)(arg)
		})
	}
	Module["___cxa_thread_atexit"] = ___cxa_thread_atexit;

	function ___emscripten_init_main_thread_js(tb) {
		__emscripten_thread_init(tb, !ENVIRONMENT_IS_WORKER, 1);
		PThread.threadInit()
	}
	Module["___emscripten_init_main_thread_js"] = ___emscripten_init_main_thread_js;

	function spawnThread(threadParams) {
		var worker = PThread.getNewWorker();
		if (!worker) {
			return 6
		}
		PThread.runningWorkers.push(worker);
		var stackHigh = threadParams.stackBase + threadParams.stackSize;
		var pthread = PThread.pthreads[threadParams.pthread_ptr] = {
			worker: worker,
			stackBase: threadParams.stackBase,
			stackSize: threadParams.stackSize,
			allocatedOwnStack: threadParams.allocatedOwnStack,
			threadInfoStruct: threadParams.pthread_ptr
		};
		var tis = pthread.threadInfoStruct >> 2;
		Atomics.store(GROWABLE_HEAP_U32(), tis + (60 >> 2), threadParams.detached);
		Atomics.store(GROWABLE_HEAP_U32(), tis + (76 >> 2), threadParams.stackSize);
		Atomics.store(GROWABLE_HEAP_U32(), tis + (72 >> 2), stackHigh);
		Atomics.store(GROWABLE_HEAP_U32(), tis + (100 >> 2), threadParams.stackSize);
		Atomics.store(GROWABLE_HEAP_U32(), tis + (100 + 8 >> 2), stackHigh);
		Atomics.store(GROWABLE_HEAP_U32(), tis + (100 + 12 >> 2), threadParams.detached);
		worker.pthread = pthread;
		var msg = {
			"cmd": "run",
			"start_routine": threadParams.startRoutine,
			"arg": threadParams.arg,
			"threadInfoStruct": threadParams.pthread_ptr,
			"stackBase": threadParams.stackBase,
			"stackSize": threadParams.stackSize
		};
		worker.runPthread = function() {
			msg.time = performance.now();
			worker.postMessage(msg, threadParams.transferList)
		};
		if (worker.loaded) {
			worker.runPthread();
			delete worker.runPthread
		}
		return 0
	}
	Module["spawnThread"] = spawnThread;

	function ___pthread_create_js(pthread_ptr, attr, start_routine, arg) {
		if (typeof SharedArrayBuffer === "undefined") {
			err("Current environment does not support SharedArrayBuffer, pthreads are not available!");
			return 6
		}
		var transferList = [];
		var error = 0;
		if (ENVIRONMENT_IS_PTHREAD && (transferList.length === 0 || error)) {
			return _emscripten_sync_run_in_main_thread_4(687865856, pthread_ptr, attr, start_routine, arg)
		}
		if (error) return error;
		var stackSize = 0;
		var stackBase = 0;
		var detached = 0;
		if (attr && attr != -1) {
			stackSize = GROWABLE_HEAP_I32()[attr >> 2];
			stackSize += 2097152;
			stackBase = GROWABLE_HEAP_I32()[attr + 8 >> 2];
			detached = GROWABLE_HEAP_I32()[attr + 12 >> 2] !== 0
		} else {
			stackSize = 2097152
		}
		var allocatedOwnStack = stackBase == 0;
		if (allocatedOwnStack) {
			stackBase = _memalign(16, stackSize)
		} else {
			stackBase -= stackSize;
			assert(stackBase > 0)
		}
		var threadParams = {
			stackBase: stackBase,
			stackSize: stackSize,
			allocatedOwnStack: allocatedOwnStack,
			detached: detached,
			startRoutine: start_routine,
			pthread_ptr: pthread_ptr,
			arg: arg,
			transferList: transferList
		};
		if (ENVIRONMENT_IS_PTHREAD) {
			threadParams.cmd = "spawnThread";
			postMessage(threadParams, transferList);
			return 0
		}
		return spawnThread(threadParams)
	}
	Module["___pthread_create_js"] = ___pthread_create_js;

	function ___pthread_detached_exit() {
		postMessage({
			"cmd": "detachedExit"
		})
	}
	Module["___pthread_detached_exit"] = ___pthread_detached_exit;

	function ___pthread_exit_run_handlers(status) {
		while (PThread.threadExitHandlers.length > 0) {
			PThread.threadExitHandlers.pop()()
		}
	}
	Module["___pthread_exit_run_handlers"] = ___pthread_exit_run_handlers;

	function _emscripten_futex_wait(addr, val, timeout) {
		if (addr <= 0 || addr > GROWABLE_HEAP_I8().length || addr & 3 != 0) return -28;
		if (!ENVIRONMENT_IS_WEB) {
			var ret = Atomics.wait(GROWABLE_HEAP_I32(), addr >> 2, val, timeout);
			if (ret === "timed-out") return -73;
			if (ret === "not-equal") return -6;
			if (ret === "ok") return 0;
			throw "Atomics.wait returned an unexpected value " + ret
		} else {
			if (Atomics.load(GROWABLE_HEAP_I32(), addr >> 2) != val) {
				return -6
			}
			var tNow = performance.now();
			var tEnd = tNow + timeout;
			var lastAddr = Atomics.exchange(GROWABLE_HEAP_I32(), __emscripten_main_thread_futex >> 2, addr);
			while (1) {
				tNow = performance.now();
				if (tNow > tEnd) {
					lastAddr = Atomics.exchange(GROWABLE_HEAP_I32(), __emscripten_main_thread_futex >> 2, 0);
					return -73
				}
				lastAddr = Atomics.exchange(GROWABLE_HEAP_I32(), __emscripten_main_thread_futex >> 2, 0);
				if (lastAddr == 0) {
					break
				}
				_emscripten_main_thread_process_queued_calls();
				if (Atomics.load(GROWABLE_HEAP_I32(), addr >> 2) != val) {
					return -6
				}
				lastAddr = Atomics.exchange(GROWABLE_HEAP_I32(), __emscripten_main_thread_futex >> 2, addr)
			}
			return 0
		}
	}
	Module["_emscripten_futex_wait"] = _emscripten_futex_wait;

	function _emscripten_check_blocking_allowed() {
		if (ENVIRONMENT_IS_NODE) return;
		if (ENVIRONMENT_IS_WORKER) return;
		warnOnce("Blocking on the main thread is very dangerous, see https://emscripten.org/docs/porting/pthreads.html#blocking-on-the-main-browser-thread")
	}
	Module["_emscripten_check_blocking_allowed"] = _emscripten_check_blocking_allowed;

	function __emscripten_do_pthread_join(thread, status, block) {
		if (!thread) {
			err("pthread_join attempted on a null thread pointer!");
			return 71
		}
		if (ENVIRONMENT_IS_PTHREAD && _pthread_self() == thread) {
			err("PThread " + thread + " is attempting to join to itself!");
			return 16
		} else if (!ENVIRONMENT_IS_PTHREAD && _emscripten_main_browser_thread_id() == thread) {
			err("Main thread " + thread + " is attempting to join to itself!");
			return 16
		}
		var self = GROWABLE_HEAP_I32()[thread + 8 >> 2];
		if (self !== thread) {
			err("pthread_join attempted on thread " + thread + ", which does not point to a valid thread, or does not exist anymore!");
			return 71
		}
		var detached = Atomics.load(GROWABLE_HEAP_U32(), thread + 60 >> 2);
		if (detached) {
			err("Attempted to join thread " + thread + ", which was already detached!");
			return 28
		}
		if (block) {
			_emscripten_check_blocking_allowed()
		}
		for (;;) {
			var threadStatus = Atomics.load(GROWABLE_HEAP_U32(), thread + 0 >> 2);
			if (threadStatus == 1) {
				if (status) {
					var result = Atomics.load(GROWABLE_HEAP_U32(), thread + 88 >> 2);
					GROWABLE_HEAP_I32()[status >> 2] = result
				}
				Atomics.store(GROWABLE_HEAP_U32(), thread + 60 >> 2, 1);
				if (!ENVIRONMENT_IS_PTHREAD) cleanupThread(thread);
				else postMessage({
					"cmd": "cleanupThread",
					"thread": thread
				});
				return 0
			}
			if (!block) {
				return 10
			}
			_pthread_testcancel();
			if (!ENVIRONMENT_IS_PTHREAD) _emscripten_main_thread_process_queued_calls();
			_emscripten_futex_wait(thread + 0, threadStatus, ENVIRONMENT_IS_PTHREAD ? 100 : 1)
		}
	}
	Module["__emscripten_do_pthread_join"] = __emscripten_do_pthread_join;

	function ___pthread_join_js(thread, status) {
		return __emscripten_do_pthread_join(thread, status, true)
	}
	Module["___pthread_join_js"] = ___pthread_join_js;
	var PATH = {
		splitPath: function(filename) {
			var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
			return splitPathRe.exec(filename).slice(1)
		},
		normalizeArray: function(parts, allowAboveRoot) {
			var up = 0;
			for (var i = parts.length - 1; i >= 0; i--) {
				var last = parts[i];
				if (last === ".") {
					parts.splice(i, 1)
				} else if (last === "..") {
					parts.splice(i, 1);
					up++
				} else if (up) {
					parts.splice(i, 1);
					up--
				}
			}
			if (allowAboveRoot) {
				for (; up; up--) {
					parts.unshift("..")
				}
			}
			return parts
		},
		normalize: function(path) {
			var isAbsolute = path.charAt(0) === "/",
				trailingSlash = path.substr(-1) === "/";
			path = PATH.normalizeArray(path.split("/").filter(function(p) {
				return !!p
			}), !isAbsolute).join("/");
			if (!path && !isAbsolute) {
				path = "."
			}
			if (path && trailingSlash) {
				path += "/"
			}
			return (isAbsolute ? "/" : "") + path
		},
		dirname: function(path) {
			var result = PATH.splitPath(path),
				root = result[0],
				dir = result[1];
			if (!root && !dir) {
				return "."
			}
			if (dir) {
				dir = dir.substr(0, dir.length - 1)
			}
			return root + dir
		},
		basename: function(path) {
			if (path === "/") return "/";
			path = PATH.normalize(path);
			path = path.replace(/\/$/, "");
			var lastSlash = path.lastIndexOf("/");
			if (lastSlash === -1) return path;
			return path.substr(lastSlash + 1)
		},
		extname: function(path) {
			return PATH.splitPath(path)[3]
		},
		join: function() {
			var paths = Array.prototype.slice.call(arguments, 0);
			return PATH.normalize(paths.join("/"))
		},
		join2: function(l, r) {
			return PATH.normalize(l + "/" + r)
		}
	};
	Module["PATH"] = PATH;

	function getRandomDevice() {
		if (typeof crypto === "object" && typeof crypto["getRandomValues"] === "function") {
			var randomBuffer = new Uint8Array(1);
			return function() {
				crypto.getRandomValues(randomBuffer);
				return randomBuffer[0]
			}
		} else if (ENVIRONMENT_IS_NODE) {
			try {
				var crypto_module = require("crypto");
				return function() {
					return crypto_module["randomBytes"](1)[0]
				}
			} catch (e) {}
		}
		return function() {
			abort("randomDevice")
		}
	}
	Module["getRandomDevice"] = getRandomDevice;
	var PATH_FS = {
		resolve: function() {
			var resolvedPath = "",
				resolvedAbsolute = false;
			for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
				var path = i >= 0 ? arguments[i] : FS.cwd();
				if (typeof path !== "string") {
					throw new TypeError("Arguments to path.resolve must be strings")
				} else if (!path) {
					return ""
				}
				resolvedPath = path + "/" + resolvedPath;
				resolvedAbsolute = path.charAt(0) === "/"
			}
			resolvedPath = PATH.normalizeArray(resolvedPath.split("/").filter(function(p) {
				return !!p
			}), !resolvedAbsolute).join("/");
			return (resolvedAbsolute ? "/" : "") + resolvedPath || "."
		},
		relative: function(from, to) {
			from = PATH_FS.resolve(from).substr(1);
			to = PATH_FS.resolve(to).substr(1);

			function trim(arr) {
				var start = 0;
				for (; start < arr.length; start++) {
					if (arr[start] !== "") break
				}
				var end = arr.length - 1;
				for (; end >= 0; end--) {
					if (arr[end] !== "") break
				}
				if (start > end) return [];
				return arr.slice(start, end - start + 1)
			}
			var fromParts = trim(from.split("/"));
			var toParts = trim(to.split("/"));
			var length = Math.min(fromParts.length, toParts.length);
			var samePartsLength = length;
			for (var i = 0; i < length; i++) {
				if (fromParts[i] !== toParts[i]) {
					samePartsLength = i;
					break
				}
			}
			var outputParts = [];
			for (var i = samePartsLength; i < fromParts.length; i++) {
				outputParts.push("..")
			}
			outputParts = outputParts.concat(toParts.slice(samePartsLength));
			return outputParts.join("/")
		}
	};
	Module["PATH_FS"] = PATH_FS;
	var TTY = {
		ttys: [],
		init: function() {},
		shutdown: function() {},
		register: function(dev, ops) {
			TTY.ttys[dev] = {
				input: [],
				output: [],
				ops: ops
			};
			FS.registerDevice(dev, TTY.stream_ops)
		},
		stream_ops: {
			open: function(stream) {
				var tty = TTY.ttys[stream.node.rdev];
				if (!tty) {
					throw new FS.ErrnoError(43)
				}
				stream.tty = tty;
				stream.seekable = false
			},
			close: function(stream) {
				stream.tty.ops.flush(stream.tty)
			},
			flush: function(stream) {
				stream.tty.ops.flush(stream.tty)
			},
			read: function(stream, buffer, offset, length, pos) {
				if (!stream.tty || !stream.tty.ops.get_char) {
					throw new FS.ErrnoError(60)
				}
				var bytesRead = 0;
				for (var i = 0; i < length; i++) {
					var result;
					try {
						result = stream.tty.ops.get_char(stream.tty)
					} catch (e) {
						throw new FS.ErrnoError(29)
					}
					if (result === undefined && bytesRead === 0) {
						throw new FS.ErrnoError(6)
					}
					if (result === null || result === undefined) break;
					bytesRead++;
					buffer[offset + i] = result
				}
				if (bytesRead) {
					stream.node.timestamp = Date.now()
				}
				return bytesRead
			},
			write: function(stream, buffer, offset, length, pos) {
				if (!stream.tty || !stream.tty.ops.put_char) {
					throw new FS.ErrnoError(60)
				}
				try {
					for (var i = 0; i < length; i++) {
						stream.tty.ops.put_char(stream.tty, buffer[offset + i])
					}
				} catch (e) {
					throw new FS.ErrnoError(29)
				}
				if (length) {
					stream.node.timestamp = Date.now()
				}
				return i
			}
		},
		default_tty_ops: {
			get_char: function(tty) {
				if (!tty.input.length) {
					var result = null;
					if (ENVIRONMENT_IS_NODE) {
						var BUFSIZE = 256;
						var buf = Buffer.alloc(BUFSIZE);
						var bytesRead = 0;
						try {
							bytesRead = nodeFS.readSync(process.stdin.fd, buf, 0, BUFSIZE, null)
						} catch (e) {
							if (e.toString().includes("EOF")) bytesRead = 0;
							else throw e
						}
						if (bytesRead > 0) {
							result = buf.slice(0, bytesRead).toString("utf-8")
						} else {
							result = null
						}
					} else if (typeof window != "undefined" && typeof window.prompt == "function") {
						result = window.prompt("Input: ");
						if (result !== null) {
							result += "\n"
						}
					} else if (typeof readline == "function") {
						result = readline();
						if (result !== null) {
							result += "\n"
						}
					}
					if (!result) {
						return null
					}
					tty.input = intArrayFromString(result, true)
				}
				return tty.input.shift()
			},
			put_char: function(tty, val) {
				if (val === null || val === 10) {
					out(UTF8ArrayToString(tty.output, 0));
					tty.output = []
				} else {
					if (val != 0) tty.output.push(val)
				}
			},
			flush: function(tty) {
				if (tty.output && tty.output.length > 0) {
					out(UTF8ArrayToString(tty.output, 0));
					tty.output = []
				}
			}
		},
		default_tty1_ops: {
			put_char: function(tty, val) {
				if (val === null || val === 10) {
					err(UTF8ArrayToString(tty.output, 0));
					tty.output = []
				} else {
					if (val != 0) tty.output.push(val)
				}
			},
			flush: function(tty) {
				if (tty.output && tty.output.length > 0) {
					err(UTF8ArrayToString(tty.output, 0));
					tty.output = []
				}
			}
		}
	};
	Module["TTY"] = TTY;

	function zeroMemory(address, size) {
		GROWABLE_HEAP_U8().fill(0, address, address + size)
	}
	Module["zeroMemory"] = zeroMemory;

	function alignMemory(size, alignment) {
		return Math.ceil(size / alignment) * alignment
	}
	Module["alignMemory"] = alignMemory;

	function mmapAlloc(size) {
		size = alignMemory(size, 65536);
		var ptr = _memalign(65536, size);
		if (!ptr) return 0;
		zeroMemory(ptr, size);
		return ptr
	}
	Module["mmapAlloc"] = mmapAlloc;
	var MEMFS = {
		ops_table: null,
		mount: function(mount) {
			return MEMFS.createNode(null, "/", 16384 | 511, 0)
		},
		createNode: function(parent, name, mode, dev) {
			if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
				throw new FS.ErrnoError(63)
			}
			if (!MEMFS.ops_table) {
				MEMFS.ops_table = {
					dir: {
						node: {
							getattr: MEMFS.node_ops.getattr,
							setattr: MEMFS.node_ops.setattr,
							lookup: MEMFS.node_ops.lookup,
							mknod: MEMFS.node_ops.mknod,
							rename: MEMFS.node_ops.rename,
							unlink: MEMFS.node_ops.unlink,
							rmdir: MEMFS.node_ops.rmdir,
							readdir: MEMFS.node_ops.readdir,
							symlink: MEMFS.node_ops.symlink
						},
						stream: {
							llseek: MEMFS.stream_ops.llseek
						}
					},
					file: {
						node: {
							getattr: MEMFS.node_ops.getattr,
							setattr: MEMFS.node_ops.setattr
						},
						stream: {
							llseek: MEMFS.stream_ops.llseek,
							read: MEMFS.stream_ops.read,
							write: MEMFS.stream_ops.write,
							allocate: MEMFS.stream_ops.allocate,
							mmap: MEMFS.stream_ops.mmap,
							msync: MEMFS.stream_ops.msync
						}
					},
					link: {
						node: {
							getattr: MEMFS.node_ops.getattr,
							setattr: MEMFS.node_ops.setattr,
							readlink: MEMFS.node_ops.readlink
						},
						stream: {}
					},
					chrdev: {
						node: {
							getattr: MEMFS.node_ops.getattr,
							setattr: MEMFS.node_ops.setattr
						},
						stream: FS.chrdev_stream_ops
					}
				}
			}
			var node = FS.createNode(parent, name, mode, dev);
			if (FS.isDir(node.mode)) {
				node.node_ops = MEMFS.ops_table.dir.node;
				node.stream_ops = MEMFS.ops_table.dir.stream;
				node.contents = {}
			} else if (FS.isFile(node.mode)) {
				node.node_ops = MEMFS.ops_table.file.node;
				node.stream_ops = MEMFS.ops_table.file.stream;
				node.usedBytes = 0;
				node.contents = null
			} else if (FS.isLink(node.mode)) {
				node.node_ops = MEMFS.ops_table.link.node;
				node.stream_ops = MEMFS.ops_table.link.stream
			} else if (FS.isChrdev(node.mode)) {
				node.node_ops = MEMFS.ops_table.chrdev.node;
				node.stream_ops = MEMFS.ops_table.chrdev.stream
			}
			node.timestamp = Date.now();
			if (parent) {
				parent.contents[name] = node;
				parent.timestamp = node.timestamp
			}
			return node
		},
		getFileDataAsTypedArray: function(node) {
			if (!node.contents) return new Uint8Array(0);
			if (node.contents.subarray) return node.contents.subarray(0, node.usedBytes);
			return new Uint8Array(node.contents)
		},
		expandFileStorage: function(node, newCapacity) {
			var prevCapacity = node.contents ? node.contents.length : 0;
			if (prevCapacity >= newCapacity) return;
			var CAPACITY_DOUBLING_MAX = 1024 * 1024;
			newCapacity = Math.max(newCapacity, prevCapacity * (prevCapacity < CAPACITY_DOUBLING_MAX ? 2 : 1.125) >>> 0);
			if (prevCapacity != 0) newCapacity = Math.max(newCapacity, 256);
			var oldContents = node.contents;
			node.contents = new Uint8Array(newCapacity);
			if (node.usedBytes > 0) node.contents.set(oldContents.subarray(0, node.usedBytes), 0)
		},
		resizeFileStorage: function(node, newSize) {
			if (node.usedBytes == newSize) return;
			if (newSize == 0) {
				node.contents = null;
				node.usedBytes = 0
			} else {
				var oldContents = node.contents;
				node.contents = new Uint8Array(newSize);
				if (oldContents) {
					node.contents.set(oldContents.subarray(0, Math.min(newSize, node.usedBytes)))
				}
				node.usedBytes = newSize
			}
		},
		node_ops: {
			getattr: function(node) {
				var attr = {};
				attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
				attr.ino = node.id;
				attr.mode = node.mode;
				attr.nlink = 1;
				attr.uid = 0;
				attr.gid = 0;
				attr.rdev = node.rdev;
				if (FS.isDir(node.mode)) {
					attr.size = 4096
				} else if (FS.isFile(node.mode)) {
					attr.size = node.usedBytes
				} else if (FS.isLink(node.mode)) {
					attr.size = node.link.length
				} else {
					attr.size = 0
				}
				attr.atime = new Date(node.timestamp);
				attr.mtime = new Date(node.timestamp);
				attr.ctime = new Date(node.timestamp);
				attr.blksize = 4096;
				attr.blocks = Math.ceil(attr.size / attr.blksize);
				return attr
			},
			setattr: function(node, attr) {
				if (attr.mode !== undefined) {
					node.mode = attr.mode
				}
				if (attr.timestamp !== undefined) {
					node.timestamp = attr.timestamp
				}
				if (attr.size !== undefined) {
					MEMFS.resizeFileStorage(node, attr.size)
				}
			},
			lookup: function(parent, name) {
				throw FS.genericErrors[44]
			},
			mknod: function(parent, name, mode, dev) {
				return MEMFS.createNode(parent, name, mode, dev)
			},
			rename: function(old_node, new_dir, new_name) {
				if (FS.isDir(old_node.mode)) {
					var new_node;
					try {
						new_node = FS.lookupNode(new_dir, new_name)
					} catch (e) {}
					if (new_node) {
						for (var i in new_node.contents) {
							throw new FS.ErrnoError(55)
						}
					}
				}
				delete old_node.parent.contents[old_node.name];
				old_node.parent.timestamp = Date.now();
				old_node.name = new_name;
				new_dir.contents[new_name] = old_node;
				new_dir.timestamp = old_node.parent.timestamp;
				old_node.parent = new_dir
			},
			unlink: function(parent, name) {
				delete parent.contents[name];
				parent.timestamp = Date.now()
			},
			rmdir: function(parent, name) {
				var node = FS.lookupNode(parent, name);
				for (var i in node.contents) {
					throw new FS.ErrnoError(55)
				}
				delete parent.contents[name];
				parent.timestamp = Date.now()
			},
			readdir: function(node) {
				var entries = [".", ".."];
				for (var key in node.contents) {
					if (!node.contents.hasOwnProperty(key)) {
						continue
					}
					entries.push(key)
				}
				return entries
			},
			symlink: function(parent, newname, oldpath) {
				var node = MEMFS.createNode(parent, newname, 511 | 40960, 0);
				node.link = oldpath;
				return node
			},
			readlink: function(node) {
				if (!FS.isLink(node.mode)) {
					throw new FS.ErrnoError(28)
				}
				return node.link
			}
		},
		stream_ops: {
			read: function(stream, buffer, offset, length, position) {
				var contents = stream.node.contents;
				if (position >= stream.node.usedBytes) return 0;
				var size = Math.min(stream.node.usedBytes - position, length);
				if (size > 8 && contents.subarray) {
					buffer.set(contents.subarray(position, position + size), offset)
				} else {
					for (var i = 0; i < size; i++) buffer[offset + i] = contents[position + i]
				}
				return size
			},
			write: function(stream, buffer, offset, length, position, canOwn) {
				if (buffer.buffer === GROWABLE_HEAP_I8().buffer) {
					canOwn = false
				}
				if (!length) return 0;
				var node = stream.node;
				node.timestamp = Date.now();
				if (buffer.subarray && (!node.contents || node.contents.subarray)) {
					if (canOwn) {
						node.contents = buffer.subarray(offset, offset + length);
						node.usedBytes = length;
						return length
					} else if (node.usedBytes === 0 && position === 0) {
						node.contents = buffer.slice(offset, offset + length);
						node.usedBytes = length;
						return length
					} else if (position + length <= node.usedBytes) {
						node.contents.set(buffer.subarray(offset, offset + length), position);
						return length
					}
				}
				MEMFS.expandFileStorage(node, position + length);
				if (node.contents.subarray && buffer.subarray) {
					node.contents.set(buffer.subarray(offset, offset + length), position)
				} else {
					for (var i = 0; i < length; i++) {
						node.contents[position + i] = buffer[offset + i]
					}
				}
				node.usedBytes = Math.max(node.usedBytes, position + length);
				return length
			},
			llseek: function(stream, offset, whence) {
				var position = offset;
				if (whence === 1) {
					position += stream.position
				} else if (whence === 2) {
					if (FS.isFile(stream.node.mode)) {
						position += stream.node.usedBytes
					}
				}
				if (position < 0) {
					throw new FS.ErrnoError(28)
				}
				return position
			},
			allocate: function(stream, offset, length) {
				MEMFS.expandFileStorage(stream.node, offset + length);
				stream.node.usedBytes = Math.max(stream.node.usedBytes, offset + length)
			},
			mmap: function(stream, address, length, position, prot, flags) {
				if (address !== 0) {
					throw new FS.ErrnoError(28)
				}
				if (!FS.isFile(stream.node.mode)) {
					throw new FS.ErrnoError(43)
				}
				var ptr;
				var allocated;
				var contents = stream.node.contents;
				if (!(flags & 2) && contents.buffer === buffer) {
					allocated = false;
					ptr = contents.byteOffset
				} else {
					if (position > 0 || position + length < contents.length) {
						if (contents.subarray) {
							contents = contents.subarray(position, position + length)
						} else {
							contents = Array.prototype.slice.call(contents, position, position + length)
						}
					}
					allocated = true;
					ptr = mmapAlloc(length);
					if (!ptr) {
						throw new FS.ErrnoError(48)
					}
					GROWABLE_HEAP_I8().set(contents, ptr)
				}
				return {
					ptr: ptr,
					allocated: allocated
				}
			},
			msync: function(stream, buffer, offset, length, mmapFlags) {
				if (!FS.isFile(stream.node.mode)) {
					throw new FS.ErrnoError(43)
				}
				if (mmapFlags & 2) {
					return 0
				}
				var bytesWritten = MEMFS.stream_ops.write(stream, buffer, 0, length, offset, false);
				return 0
			}
		}
	};
	Module["MEMFS"] = MEMFS;

	function asyncLoad(url, onload, onerror, noRunDep) {
		var dep = !noRunDep ? getUniqueRunDependency("al " + url) : "";
		readAsync(url, function(arrayBuffer) {
			assert(arrayBuffer, 'Loading data file "' + url + '" failed (no arrayBuffer).');
			onload(new Uint8Array(arrayBuffer));
			if (dep) removeRunDependency(dep)
		}, function(event) {
			if (onerror) {
				onerror()
			} else {
				throw 'Loading data file "' + url + '" failed.'
			}
		});
		if (dep) addRunDependency(dep)
	}
	Module["asyncLoad"] = asyncLoad;
	var FS = {
		root: null,
		mounts: [],
		devices: {},
		streams: [],
		nextInode: 1,
		nameTable: null,
		currentPath: "/",
		initialized: false,
		ignorePermissions: true,
		ErrnoError: null,
		genericErrors: {},
		filesystems: null,
		syncFSRequests: 0,
		lookupPath: function(path, opts) {
			path = PATH_FS.resolve(FS.cwd(), path);
			opts = opts || {};
			if (!path) return {
				path: "",
				node: null
			};
			var defaults = {
				follow_mount: true,
				recurse_count: 0
			};
			for (var key in defaults) {
				if (opts[key] === undefined) {
					opts[key] = defaults[key]
				}
			}
			if (opts.recurse_count > 8) {
				throw new FS.ErrnoError(32)
			}
			var parts = PATH.normalizeArray(path.split("/").filter(function(p) {
				return !!p
			}), false);
			var current = FS.root;
			var current_path = "/";
			for (var i = 0; i < parts.length; i++) {
				var islast = i === parts.length - 1;
				if (islast && opts.parent) {
					break
				}
				current = FS.lookupNode(current, parts[i]);
				current_path = PATH.join2(current_path, parts[i]);
				if (FS.isMountpoint(current)) {
					if (!islast || islast && opts.follow_mount) {
						current = current.mounted.root
					}
				}
				if (!islast || opts.follow) {
					var count = 0;
					while (FS.isLink(current.mode)) {
						var link = FS.readlink(current_path);
						current_path = PATH_FS.resolve(PATH.dirname(current_path), link);
						var lookup = FS.lookupPath(current_path, {
							recurse_count: opts.recurse_count
						});
						current = lookup.node;
						if (count++ > 40) {
							throw new FS.ErrnoError(32)
						}
					}
				}
			}
			return {
				path: current_path,
				node: current
			}
		},
		getPath: function(node) {
			var path;
			while (true) {
				if (FS.isRoot(node)) {
					var mount = node.mount.mountpoint;
					if (!path) return mount;
					return mount[mount.length - 1] !== "/" ? mount + "/" + path : mount + path
				}
				path = path ? node.name + "/" + path : node.name;
				node = node.parent
			}
		},
		hashName: function(parentid, name) {
			var hash = 0;
			for (var i = 0; i < name.length; i++) {
				hash = (hash << 5) - hash + name.charCodeAt(i) | 0
			}
			return (parentid + hash >>> 0) % FS.nameTable.length
		},
		hashAddNode: function(node) {
			var hash = FS.hashName(node.parent.id, node.name);
			node.name_next = FS.nameTable[hash];
			FS.nameTable[hash] = node
		},
		hashRemoveNode: function(node) {
			var hash = FS.hashName(node.parent.id, node.name);
			if (FS.nameTable[hash] === node) {
				FS.nameTable[hash] = node.name_next
			} else {
				var current = FS.nameTable[hash];
				while (current) {
					if (current.name_next === node) {
						current.name_next = node.name_next;
						break
					}
					current = current.name_next
				}
			}
		},
		lookupNode: function(parent, name) {
			var errCode = FS.mayLookup(parent);
			if (errCode) {
				throw new FS.ErrnoError(errCode, parent)
			}
			var hash = FS.hashName(parent.id, name);
			for (var node = FS.nameTable[hash]; node; node = node.name_next) {
				var nodeName = node.name;
				if (node.parent.id === parent.id && nodeName === name) {
					return node
				}
			}
			return FS.lookup(parent, name)
		},
		createNode: function(parent, name, mode, rdev) {
			var node = new FS.FSNode(parent, name, mode, rdev);
			FS.hashAddNode(node);
			return node
		},
		destroyNode: function(node) {
			FS.hashRemoveNode(node)
		},
		isRoot: function(node) {
			return node === node.parent
		},
		isMountpoint: function(node) {
			return !!node.mounted
		},
		isFile: function(mode) {
			return (mode & 61440) === 32768
		},
		isDir: function(mode) {
			return (mode & 61440) === 16384
		},
		isLink: function(mode) {
			return (mode & 61440) === 40960
		},
		isChrdev: function(mode) {
			return (mode & 61440) === 8192
		},
		isBlkdev: function(mode) {
			return (mode & 61440) === 24576
		},
		isFIFO: function(mode) {
			return (mode & 61440) === 4096
		},
		isSocket: function(mode) {
			return (mode & 49152) === 49152
		},
		flagModes: {
			"r": 0,
			"r+": 2,
			"w": 577,
			"w+": 578,
			"a": 1089,
			"a+": 1090
		},
		modeStringToFlags: function(str) {
			var flags = FS.flagModes[str];
			if (typeof flags === "undefined") {
				throw new Error("Unknown file open mode: " + str)
			}
			return flags
		},
		flagsToPermissionString: function(flag) {
			var perms = ["r", "w", "rw"][flag & 3];
			if (flag & 512) {
				perms += "w"
			}
			return perms
		},
		nodePermissions: function(node, perms) {
			if (FS.ignorePermissions) {
				return 0
			}
			if (perms.includes("r") && !(node.mode & 292)) {
				return 2
			} else if (perms.includes("w") && !(node.mode & 146)) {
				return 2
			} else if (perms.includes("x") && !(node.mode & 73)) {
				return 2
			}
			return 0
		},
		mayLookup: function(dir) {
			var errCode = FS.nodePermissions(dir, "x");
			if (errCode) return errCode;
			if (!dir.node_ops.lookup) return 2;
			return 0
		},
		mayCreate: function(dir, name) {
			try {
				var node = FS.lookupNode(dir, name);
				return 20
			} catch (e) {}
			return FS.nodePermissions(dir, "wx")
		},
		mayDelete: function(dir, name, isdir) {
			var node;
			try {
				node = FS.lookupNode(dir, name)
			} catch (e) {
				return e.errno
			}
			var errCode = FS.nodePermissions(dir, "wx");
			if (errCode) {
				return errCode
			}
			if (isdir) {
				if (!FS.isDir(node.mode)) {
					return 54
				}
				if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
					return 10
				}
			} else {
				if (FS.isDir(node.mode)) {
					return 31
				}
			}
			return 0
		},
		mayOpen: function(node, flags) {
			if (!node) {
				return 44
			}
			if (FS.isLink(node.mode)) {
				return 32
			} else if (FS.isDir(node.mode)) {
				if (FS.flagsToPermissionString(flags) !== "r" || flags & 512) {
					return 31
				}
			}
			return FS.nodePermissions(node, FS.flagsToPermissionString(flags))
		},
		MAX_OPEN_FDS: 4096,
		nextfd: function(fd_start, fd_end) {
			fd_start = fd_start || 0;
			fd_end = fd_end || FS.MAX_OPEN_FDS;
			for (var fd = fd_start; fd <= fd_end; fd++) {
				if (!FS.streams[fd]) {
					return fd
				}
			}
			throw new FS.ErrnoError(33)
		},
		getStream: function(fd) {
			return FS.streams[fd]
		},
		createStream: function(stream, fd_start, fd_end) {
			if (!FS.FSStream) {
				FS.FSStream = function() {};
				FS.FSStream.prototype = {
					object: {
						get: function() {
							return this.node
						},
						set: function(val) {
							this.node = val
						}
					},
					isRead: {
						get: function() {
							return (this.flags & 2097155) !== 1
						}
					},
					isWrite: {
						get: function() {
							return (this.flags & 2097155) !== 0
						}
					},
					isAppend: {
						get: function() {
							return this.flags & 1024
						}
					}
				}
			}
			var newStream = new FS.FSStream;
			for (var p in stream) {
				newStream[p] = stream[p]
			}
			stream = newStream;
			var fd = FS.nextfd(fd_start, fd_end);
			stream.fd = fd;
			FS.streams[fd] = stream;
			return stream
		},
		closeStream: function(fd) {
			FS.streams[fd] = null
		},
		chrdev_stream_ops: {
			open: function(stream) {
				var device = FS.getDevice(stream.node.rdev);
				stream.stream_ops = device.stream_ops;
				if (stream.stream_ops.open) {
					stream.stream_ops.open(stream)
				}
			},
			llseek: function() {
				throw new FS.ErrnoError(70)
			}
		},
		major: function(dev) {
			return dev >> 8
		},
		minor: function(dev) {
			return dev & 255
		},
		makedev: function(ma, mi) {
			return ma << 8 | mi
		},
		registerDevice: function(dev, ops) {
			FS.devices[dev] = {
				stream_ops: ops
			}
		},
		getDevice: function(dev) {
			return FS.devices[dev]
		},
		getMounts: function(mount) {
			var mounts = [];
			var check = [mount];
			while (check.length) {
				var m = check.pop();
				mounts.push(m);
				check.push.apply(check, m.mounts)
			}
			return mounts
		},
		syncfs: function(populate, callback) {
			if (typeof populate === "function") {
				callback = populate;
				populate = false
			}
			FS.syncFSRequests++;
			if (FS.syncFSRequests > 1) {
				err("warning: " + FS.syncFSRequests + " FS.syncfs operations in flight at once, probably just doing extra work")
			}
			var mounts = FS.getMounts(FS.root.mount);
			var completed = 0;

			function doCallback(errCode) {
				FS.syncFSRequests--;
				return callback(errCode)
			}

			function done(errCode) {
				if (errCode) {
					if (!done.errored) {
						done.errored = true;
						return doCallback(errCode)
					}
					return
				}
				if (++completed >= mounts.length) {
					doCallback(null)
				}
			}
			mounts.forEach(function(mount) {
				if (!mount.type.syncfs) {
					return done(null)
				}
				mount.type.syncfs(mount, populate, done)
			})
		},
		mount: function(type, opts, mountpoint) {
			var root = mountpoint === "/";
			var pseudo = !mountpoint;
			var node;
			if (root && FS.root) {
				throw new FS.ErrnoError(10)
			} else if (!root && !pseudo) {
				var lookup = FS.lookupPath(mountpoint, {
					follow_mount: false
				});
				mountpoint = lookup.path;
				node = lookup.node;
				if (FS.isMountpoint(node)) {
					throw new FS.ErrnoError(10)
				}
				if (!FS.isDir(node.mode)) {
					throw new FS.ErrnoError(54)
				}
			}
			var mount = {
				type: type,
				opts: opts,
				mountpoint: mountpoint,
				mounts: []
			};
			var mountRoot = type.mount(mount);
			mountRoot.mount = mount;
			mount.root = mountRoot;
			if (root) {
				FS.root = mountRoot
			} else if (node) {
				node.mounted = mount;
				if (node.mount) {
					node.mount.mounts.push(mount)
				}
			}
			return mountRoot
		},
		unmount: function(mountpoint) {
			var lookup = FS.lookupPath(mountpoint, {
				follow_mount: false
			});
			if (!FS.isMountpoint(lookup.node)) {
				throw new FS.ErrnoError(28)
			}
			var node = lookup.node;
			var mount = node.mounted;
			var mounts = FS.getMounts(mount);
			Object.keys(FS.nameTable).forEach(function(hash) {
				var current = FS.nameTable[hash];
				while (current) {
					var next = current.name_next;
					if (mounts.includes(current.mount)) {
						FS.destroyNode(current)
					}
					current = next
				}
			});
			node.mounted = null;
			var idx = node.mount.mounts.indexOf(mount);
			node.mount.mounts.splice(idx, 1)
		},
		lookup: function(parent, name) {
			return parent.node_ops.lookup(parent, name)
		},
		mknod: function(path, mode, dev) {
			var lookup = FS.lookupPath(path, {
				parent: true
			});
			var parent = lookup.node;
			var name = PATH.basename(path);
			if (!name || name === "." || name === "..") {
				throw new FS.ErrnoError(28)
			}
			var errCode = FS.mayCreate(parent, name);
			if (errCode) {
				throw new FS.ErrnoError(errCode)
			}
			if (!parent.node_ops.mknod) {
				throw new FS.ErrnoError(63)
			}
			return parent.node_ops.mknod(parent, name, mode, dev)
		},
		create: function(path, mode) {
			mode = mode !== undefined ? mode : 438;
			mode &= 4095;
			mode |= 32768;
			return FS.mknod(path, mode, 0)
		},
		mkdir: function(path, mode) {
			mode = mode !== undefined ? mode : 511;
			mode &= 511 | 512;
			mode |= 16384;
			return FS.mknod(path, mode, 0)
		},
		mkdirTree: function(path, mode) {
			var dirs = path.split("/");
			var d = "";
			for (var i = 0; i < dirs.length; ++i) {
				if (!dirs[i]) continue;
				d += "/" + dirs[i];
				try {
					FS.mkdir(d, mode)
				} catch (e) {
					if (e.errno != 20) throw e
				}
			}
		},
		mkdev: function(path, mode, dev) {
			if (typeof dev === "undefined") {
				dev = mode;
				mode = 438
			}
			mode |= 8192;
			return FS.mknod(path, mode, dev)
		},
		symlink: function(oldpath, newpath) {
			if (!PATH_FS.resolve(oldpath)) {
				throw new FS.ErrnoError(44)
			}
			var lookup = FS.lookupPath(newpath, {
				parent: true
			});
			var parent = lookup.node;
			if (!parent) {
				throw new FS.ErrnoError(44)
			}
			var newname = PATH.basename(newpath);
			var errCode = FS.mayCreate(parent, newname);
			if (errCode) {
				throw new FS.ErrnoError(errCode)
			}
			if (!parent.node_ops.symlink) {
				throw new FS.ErrnoError(63)
			}
			return parent.node_ops.symlink(parent, newname, oldpath)
		},
		rename: function(old_path, new_path) {
			var old_dirname = PATH.dirname(old_path);
			var new_dirname = PATH.dirname(new_path);
			var old_name = PATH.basename(old_path);
			var new_name = PATH.basename(new_path);
			var lookup, old_dir, new_dir;
			lookup = FS.lookupPath(old_path, {
				parent: true
			});
			old_dir = lookup.node;
			lookup = FS.lookupPath(new_path, {
				parent: true
			});
			new_dir = lookup.node;
			if (!old_dir || !new_dir) throw new FS.ErrnoError(44);
			if (old_dir.mount !== new_dir.mount) {
				throw new FS.ErrnoError(75)
			}
			var old_node = FS.lookupNode(old_dir, old_name);
			var relative = PATH_FS.relative(old_path, new_dirname);
			if (relative.charAt(0) !== ".") {
				throw new FS.ErrnoError(28)
			}
			relative = PATH_FS.relative(new_path, old_dirname);
			if (relative.charAt(0) !== ".") {
				throw new FS.ErrnoError(55)
			}
			var new_node;
			try {
				new_node = FS.lookupNode(new_dir, new_name)
			} catch (e) {}
			if (old_node === new_node) {
				return
			}
			var isdir = FS.isDir(old_node.mode);
			var errCode = FS.mayDelete(old_dir, old_name, isdir);
			if (errCode) {
				throw new FS.ErrnoError(errCode)
			}
			errCode = new_node ? FS.mayDelete(new_dir, new_name, isdir) : FS.mayCreate(new_dir, new_name);
			if (errCode) {
				throw new FS.ErrnoError(errCode)
			}
			if (!old_dir.node_ops.rename) {
				throw new FS.ErrnoError(63)
			}
			if (FS.isMountpoint(old_node) || new_node && FS.isMountpoint(new_node)) {
				throw new FS.ErrnoError(10)
			}
			if (new_dir !== old_dir) {
				errCode = FS.nodePermissions(old_dir, "w");
				if (errCode) {
					throw new FS.ErrnoError(errCode)
				}
			}
			FS.hashRemoveNode(old_node);
			try {
				old_dir.node_ops.rename(old_node, new_dir, new_name)
			} catch (e) {
				throw e
			} finally {
				FS.hashAddNode(old_node)
			}
		},
		rmdir: function(path) {
			var lookup = FS.lookupPath(path, {
				parent: true
			});
			var parent = lookup.node;
			var name = PATH.basename(path);
			var node = FS.lookupNode(parent, name);
			var errCode = FS.mayDelete(parent, name, true);
			if (errCode) {
				throw new FS.ErrnoError(errCode)
			}
			if (!parent.node_ops.rmdir) {
				throw new FS.ErrnoError(63)
			}
			if (FS.isMountpoint(node)) {
				throw new FS.ErrnoError(10)
			}
			parent.node_ops.rmdir(parent, name);
			FS.destroyNode(node)
		},
		readdir: function(path) {
			var lookup = FS.lookupPath(path, {
				follow: true
			});
			var node = lookup.node;
			if (!node.node_ops.readdir) {
				throw new FS.ErrnoError(54)
			}
			return node.node_ops.readdir(node)
		},
		unlink: function(path) {
			var lookup = FS.lookupPath(path, {
				parent: true
			});
			var parent = lookup.node;
			var name = PATH.basename(path);
			var node = FS.lookupNode(parent, name);
			var errCode = FS.mayDelete(parent, name, false);
			if (errCode) {
				throw new FS.ErrnoError(errCode)
			}
			if (!parent.node_ops.unlink) {
				throw new FS.ErrnoError(63)
			}
			if (FS.isMountpoint(node)) {
				throw new FS.ErrnoError(10)
			}
			parent.node_ops.unlink(parent, name);
			FS.destroyNode(node)
		},
		readlink: function(path) {
			var lookup = FS.lookupPath(path);
			var link = lookup.node;
			if (!link) {
				throw new FS.ErrnoError(44)
			}
			if (!link.node_ops.readlink) {
				throw new FS.ErrnoError(28)
			}
			return PATH_FS.resolve(FS.getPath(link.parent), link.node_ops.readlink(link))
		},
		stat: function(path, dontFollow) {
			var lookup = FS.lookupPath(path, {
				follow: !dontFollow
			});
			var node = lookup.node;
			if (!node) {
				throw new FS.ErrnoError(44)
			}
			if (!node.node_ops.getattr) {
				throw new FS.ErrnoError(63)
			}
			return node.node_ops.getattr(node)
		},
		lstat: function(path) {
			return FS.stat(path, true)
		},
		chmod: function(path, mode, dontFollow) {
			var node;
			if (typeof path === "string") {
				var lookup = FS.lookupPath(path, {
					follow: !dontFollow
				});
				node = lookup.node
			} else {
				node = path
			}
			if (!node.node_ops.setattr) {
				throw new FS.ErrnoError(63)
			}
			node.node_ops.setattr(node, {
				mode: mode & 4095 | node.mode & ~4095,
				timestamp: Date.now()
			})
		},
		lchmod: function(path, mode) {
			FS.chmod(path, mode, true)
		},
		fchmod: function(fd, mode) {
			var stream = FS.getStream(fd);
			if (!stream) {
				throw new FS.ErrnoError(8)
			}
			FS.chmod(stream.node, mode)
		},
		chown: function(path, uid, gid, dontFollow) {
			var node;
			if (typeof path === "string") {
				var lookup = FS.lookupPath(path, {
					follow: !dontFollow
				});
				node = lookup.node
			} else {
				node = path
			}
			if (!node.node_ops.setattr) {
				throw new FS.ErrnoError(63)
			}
			node.node_ops.setattr(node, {
				timestamp: Date.now()
			})
		},
		lchown: function(path, uid, gid) {
			FS.chown(path, uid, gid, true)
		},
		fchown: function(fd, uid, gid) {
			var stream = FS.getStream(fd);
			if (!stream) {
				throw new FS.ErrnoError(8)
			}
			FS.chown(stream.node, uid, gid)
		},
		truncate: function(path, len) {
			if (len < 0) {
				throw new FS.ErrnoError(28)
			}
			var node;
			if (typeof path === "string") {
				var lookup = FS.lookupPath(path, {
					follow: true
				});
				node = lookup.node
			} else {
				node = path
			}
			if (!node.node_ops.setattr) {
				throw new FS.ErrnoError(63)
			}
			if (FS.isDir(node.mode)) {
				throw new FS.ErrnoError(31)
			}
			if (!FS.isFile(node.mode)) {
				throw new FS.ErrnoError(28)
			}
			var errCode = FS.nodePermissions(node, "w");
			if (errCode) {
				throw new FS.ErrnoError(errCode)
			}
			node.node_ops.setattr(node, {
				size: len,
				timestamp: Date.now()
			})
		},
		ftruncate: function(fd, len) {
			var stream = FS.getStream(fd);
			if (!stream) {
				throw new FS.ErrnoError(8)
			}
			if ((stream.flags & 2097155) === 0) {
				throw new FS.ErrnoError(28)
			}
			FS.truncate(stream.node, len)
		},
		utime: function(path, atime, mtime) {
			var lookup = FS.lookupPath(path, {
				follow: true
			});
			var node = lookup.node;
			node.node_ops.setattr(node, {
				timestamp: Math.max(atime, mtime)
			})
		},
		open: function(path, flags, mode, fd_start, fd_end) {
			if (path === "") {
				throw new FS.ErrnoError(44)
			}
			flags = typeof flags === "string" ? FS.modeStringToFlags(flags) : flags;
			mode = typeof mode === "undefined" ? 438 : mode;
			if (flags & 64) {
				mode = mode & 4095 | 32768
			} else {
				mode = 0
			}
			var node;
			if (typeof path === "object") {
				node = path
			} else {
				path = PATH.normalize(path);
				try {
					var lookup = FS.lookupPath(path, {
						follow: !(flags & 131072)
					});
					node = lookup.node
				} catch (e) {}
			}
			var created = false;
			if (flags & 64) {
				if (node) {
					if (flags & 128) {
						throw new FS.ErrnoError(20)
					}
				} else {
					node = FS.mknod(path, mode, 0);
					created = true
				}
			}
			if (!node) {
				throw new FS.ErrnoError(44)
			}
			if (FS.isChrdev(node.mode)) {
				flags &= ~512
			}
			if (flags & 65536 && !FS.isDir(node.mode)) {
				throw new FS.ErrnoError(54)
			}
			if (!created) {
				var errCode = FS.mayOpen(node, flags);
				if (errCode) {
					throw new FS.ErrnoError(errCode)
				}
			}
			if (flags & 512) {
				FS.truncate(node, 0)
			}
			flags &= ~(128 | 512 | 131072);
			var stream = FS.createStream({
				node: node,
				path: FS.getPath(node),
				flags: flags,
				seekable: true,
				position: 0,
				stream_ops: node.stream_ops,
				ungotten: [],
				error: false
			}, fd_start, fd_end);
			if (stream.stream_ops.open) {
				stream.stream_ops.open(stream)
			}
			if (Module["logReadFiles"] && !(flags & 1)) {
				if (!FS.readFiles) FS.readFiles = {};
				if (!(path in FS.readFiles)) {
					FS.readFiles[path] = 1
				}
			}
			return stream
		},
		close: function(stream) {
			if (FS.isClosed(stream)) {
				throw new FS.ErrnoError(8)
			}
			if (stream.getdents) stream.getdents = null;
			try {
				if (stream.stream_ops.close) {
					stream.stream_ops.close(stream)
				}
			} catch (e) {
				throw e
			} finally {
				FS.closeStream(stream.fd)
			}
			stream.fd = null
		},
		isClosed: function(stream) {
			return stream.fd === null
		},
		llseek: function(stream, offset, whence) {
			if (FS.isClosed(stream)) {
				throw new FS.ErrnoError(8)
			}
			if (!stream.seekable || !stream.stream_ops.llseek) {
				throw new FS.ErrnoError(70)
			}
			if (whence != 0 && whence != 1 && whence != 2) {
				throw new FS.ErrnoError(28)
			}
			stream.position = stream.stream_ops.llseek(stream, offset, whence);
			stream.ungotten = [];
			return stream.position
		},
		read: function(stream, buffer, offset, length, position) {
			if (length < 0 || position < 0) {
				throw new FS.ErrnoError(28)
			}
			if (FS.isClosed(stream)) {
				throw new FS.ErrnoError(8)
			}
			if ((stream.flags & 2097155) === 1) {
				throw new FS.ErrnoError(8)
			}
			if (FS.isDir(stream.node.mode)) {
				throw new FS.ErrnoError(31)
			}
			if (!stream.stream_ops.read) {
				throw new FS.ErrnoError(28)
			}
			var seeking = typeof position !== "undefined";
			if (!seeking) {
				position = stream.position
			} else if (!stream.seekable) {
				throw new FS.ErrnoError(70)
			}
			var bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position);
			if (!seeking) stream.position += bytesRead;
			return bytesRead
		},
		write: function(stream, buffer, offset, length, position, canOwn) {
			if (length < 0 || position < 0) {
				throw new FS.ErrnoError(28)
			}
			if (FS.isClosed(stream)) {
				throw new FS.ErrnoError(8)
			}
			if ((stream.flags & 2097155) === 0) {
				throw new FS.ErrnoError(8)
			}
			if (FS.isDir(stream.node.mode)) {
				throw new FS.ErrnoError(31)
			}
			if (!stream.stream_ops.write) {
				throw new FS.ErrnoError(28)
			}
			if (stream.seekable && stream.flags & 1024) {
				FS.llseek(stream, 0, 2)
			}
			var seeking = typeof position !== "undefined";
			if (!seeking) {
				position = stream.position
			} else if (!stream.seekable) {
				throw new FS.ErrnoError(70)
			}
			var bytesWritten = stream.stream_ops.write(stream, buffer, offset, length, position, canOwn);
			if (!seeking) stream.position += bytesWritten;
			return bytesWritten
		},
		allocate: function(stream, offset, length) {
			if (FS.isClosed(stream)) {
				throw new FS.ErrnoError(8)
			}
			if (offset < 0 || length <= 0) {
				throw new FS.ErrnoError(28)
			}
			if ((stream.flags & 2097155) === 0) {
				throw new FS.ErrnoError(8)
			}
			if (!FS.isFile(stream.node.mode) && !FS.isDir(stream.node.mode)) {
				throw new FS.ErrnoError(43)
			}
			if (!stream.stream_ops.allocate) {
				throw new FS.ErrnoError(138)
			}
			stream.stream_ops.allocate(stream, offset, length)
		},
		mmap: function(stream, address, length, position, prot, flags) {
			if ((prot & 2) !== 0 && (flags & 2) === 0 && (stream.flags & 2097155) !== 2) {
				throw new FS.ErrnoError(2)
			}
			if ((stream.flags & 2097155) === 1) {
				throw new FS.ErrnoError(2)
			}
			if (!stream.stream_ops.mmap) {
				throw new FS.ErrnoError(43)
			}
			return stream.stream_ops.mmap(stream, address, length, position, prot, flags)
		},
		msync: function(stream, buffer, offset, length, mmapFlags) {
			if (!stream || !stream.stream_ops.msync) {
				return 0
			}
			return stream.stream_ops.msync(stream, buffer, offset, length, mmapFlags)
		},
		munmap: function(stream) {
			return 0
		},
		ioctl: function(stream, cmd, arg) {
			if (!stream.stream_ops.ioctl) {
				throw new FS.ErrnoError(59)
			}
			return stream.stream_ops.ioctl(stream, cmd, arg)
		},
		readFile: function(path, opts) {
			opts = opts || {};
			opts.flags = opts.flags || 0;
			opts.encoding = opts.encoding || "binary";
			if (opts.encoding !== "utf8" && opts.encoding !== "binary") {
				throw new Error('Invalid encoding type "' + opts.encoding + '"')
			}
			var ret;
			var stream = FS.open(path, opts.flags);
			var stat = FS.stat(path);
			var length = stat.size;
			var buf = new Uint8Array(length);
			FS.read(stream, buf, 0, length, 0);
			if (opts.encoding === "utf8") {
				ret = UTF8ArrayToString(buf, 0)
			} else if (opts.encoding === "binary") {
				ret = buf
			}
			FS.close(stream);
			return ret
		},
		writeFile: function(path, data, opts) {
			opts = opts || {};
			opts.flags = opts.flags || 577;
			var stream = FS.open(path, opts.flags, opts.mode);
			if (typeof data === "string") {
				var buf = new Uint8Array(lengthBytesUTF8(data) + 1);
				var actualNumBytes = stringToUTF8Array(data, buf, 0, buf.length);
				FS.write(stream, buf, 0, actualNumBytes, undefined, opts.canOwn)
			} else if (ArrayBuffer.isView(data)) {
				FS.write(stream, data, 0, data.byteLength, undefined, opts.canOwn)
			} else {
				throw new Error("Unsupported data type")
			}
			FS.close(stream)
		},
		cwd: function() {
			return FS.currentPath
		},
		chdir: function(path) {
			var lookup = FS.lookupPath(path, {
				follow: true
			});
			if (lookup.node === null) {
				throw new FS.ErrnoError(44)
			}
			if (!FS.isDir(lookup.node.mode)) {
				throw new FS.ErrnoError(54)
			}
			var errCode = FS.nodePermissions(lookup.node, "x");
			if (errCode) {
				throw new FS.ErrnoError(errCode)
			}
			FS.currentPath = lookup.path
		},
		createDefaultDirectories: function() {
			FS.mkdir("/tmp");
			FS.mkdir("/home");
			FS.mkdir("/home/web_user")
		},
		createDefaultDevices: function() {
			FS.mkdir("/dev");
			FS.registerDevice(FS.makedev(1, 3), {
				read: function() {
					return 0
				},
				write: function(stream, buffer, offset, length, pos) {
					return length
				}
			});
			FS.mkdev("/dev/null", FS.makedev(1, 3));
			TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
			TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
			FS.mkdev("/dev/tty", FS.makedev(5, 0));
			FS.mkdev("/dev/tty1", FS.makedev(6, 0));
			var random_device = getRandomDevice();
			FS.createDevice("/dev", "random", random_device);
			FS.createDevice("/dev", "urandom", random_device);
			FS.mkdir("/dev/shm");
			FS.mkdir("/dev/shm/tmp")
		},
		createSpecialDirectories: function() {
			FS.mkdir("/proc");
			var proc_self = FS.mkdir("/proc/self");
			FS.mkdir("/proc/self/fd");
			FS.mount({
				mount: function() {
					var node = FS.createNode(proc_self, "fd", 16384 | 511, 73);
					node.node_ops = {
						lookup: function(parent, name) {
							var fd = +name;
							var stream = FS.getStream(fd);
							if (!stream) throw new FS.ErrnoError(8);
							var ret = {
								parent: null,
								mount: {
									mountpoint: "fake"
								},
								node_ops: {
									readlink: function() {
										return stream.path
									}
								}
							};
							ret.parent = ret;
							return ret
						}
					};
					return node
				}
			}, {}, "/proc/self/fd")
		},
		createStandardStreams: function() {
			if (Module["stdin"]) {
				FS.createDevice("/dev", "stdin", Module["stdin"])
			} else {
				FS.symlink("/dev/tty", "/dev/stdin")
			}
			if (Module["stdout"]) {
				FS.createDevice("/dev", "stdout", null, Module["stdout"])
			} else {
				FS.symlink("/dev/tty", "/dev/stdout")
			}
			if (Module["stderr"]) {
				FS.createDevice("/dev", "stderr", null, Module["stderr"])
			} else {
				FS.symlink("/dev/tty1", "/dev/stderr")
			}
			var stdin = FS.open("/dev/stdin", 0);
			var stdout = FS.open("/dev/stdout", 1);
			var stderr = FS.open("/dev/stderr", 1)
		},
		ensureErrnoError: function() {
			if (FS.ErrnoError) return;
			FS.ErrnoError = function ErrnoError(errno, node) {
				this.node = node;
				this.setErrno = function(errno) {
					this.errno = errno
				};
				this.setErrno(errno);
				this.message = "FS error"
			};
			FS.ErrnoError.prototype = new Error;
			FS.ErrnoError.prototype.constructor = FS.ErrnoError;
			[44].forEach(function(code) {
				FS.genericErrors[code] = new FS.ErrnoError(code);
				FS.genericErrors[code].stack = "<generic error, no stack>"
			})
		},
		staticInit: function() {
			FS.ensureErrnoError();
			FS.nameTable = new Array(4096);
			FS.mount(MEMFS, {}, "/");
			FS.createDefaultDirectories();
			FS.createDefaultDevices();
			FS.createSpecialDirectories();
			FS.filesystems = {
				"MEMFS": MEMFS
			}
		},
		init: function(input, output, error) {
			FS.init.initialized = true;
			FS.ensureErrnoError();
			Module["stdin"] = input || Module["stdin"];
			Module["stdout"] = output || Module["stdout"];
			Module["stderr"] = error || Module["stderr"];
			FS.createStandardStreams()
		},
		quit: function() {
			FS.init.initialized = false;
			var fflush = Module["_fflush"];
			if (fflush) fflush(0);
			for (var i = 0; i < FS.streams.length; i++) {
				var stream = FS.streams[i];
				if (!stream) {
					continue
				}
				FS.close(stream)
			}
		},
		getMode: function(canRead, canWrite) {
			var mode = 0;
			if (canRead) mode |= 292 | 73;
			if (canWrite) mode |= 146;
			return mode
		},
		findObject: function(path, dontResolveLastLink) {
			var ret = FS.analyzePath(path, dontResolveLastLink);
			if (ret.exists) {
				return ret.object
			} else {
				return null
			}
		},
		analyzePath: function(path, dontResolveLastLink) {
			try {
				var lookup = FS.lookupPath(path, {
					follow: !dontResolveLastLink
				});
				path = lookup.path
			} catch (e) {}
			var ret = {
				isRoot: false,
				exists: false,
				error: 0,
				name: null,
				path: null,
				object: null,
				parentExists: false,
				parentPath: null,
				parentObject: null
			};
			try {
				var lookup = FS.lookupPath(path, {
					parent: true
				});
				ret.parentExists = true;
				ret.parentPath = lookup.path;
				ret.parentObject = lookup.node;
				ret.name = PATH.basename(path);
				lookup = FS.lookupPath(path, {
					follow: !dontResolveLastLink
				});
				ret.exists = true;
				ret.path = lookup.path;
				ret.object = lookup.node;
				ret.name = lookup.node.name;
				ret.isRoot = lookup.path === "/"
			} catch (e) {
				ret.error = e.errno
			}
			return ret
		},
		createPath: function(parent, path, canRead, canWrite) {
			parent = typeof parent === "string" ? parent : FS.getPath(parent);
			var parts = path.split("/").reverse();
			while (parts.length) {
				var part = parts.pop();
				if (!part) continue;
				var current = PATH.join2(parent, part);
				try {
					FS.mkdir(current)
				} catch (e) {}
				parent = current
			}
			return current
		},
		createFile: function(parent, name, properties, canRead, canWrite) {
			var path = PATH.join2(typeof parent === "string" ? parent : FS.getPath(parent), name);
			var mode = FS.getMode(canRead, canWrite);
			return FS.create(path, mode)
		},
		createDataFile: function(parent, name, data, canRead, canWrite, canOwn) {
			var path = name ? PATH.join2(typeof parent === "string" ? parent : FS.getPath(parent), name) : parent;
			var mode = FS.getMode(canRead, canWrite);
			var node = FS.create(path, mode);
			if (data) {
				if (typeof data === "string") {
					var arr = new Array(data.length);
					for (var i = 0, len = data.length; i < len; ++i) arr[i] = data.charCodeAt(i);
					data = arr
				}
				FS.chmod(node, mode | 146);
				var stream = FS.open(node, 577);
				FS.write(stream, data, 0, data.length, 0, canOwn);
				FS.close(stream);
				FS.chmod(node, mode)
			}
			return node
		},
		createDevice: function(parent, name, input, output) {
			var path = PATH.join2(typeof parent === "string" ? parent : FS.getPath(parent), name);
			var mode = FS.getMode(!!input, !!output);
			if (!FS.createDevice.major) FS.createDevice.major = 64;
			var dev = FS.makedev(FS.createDevice.major++, 0);
			FS.registerDevice(dev, {
				open: function(stream) {
					stream.seekable = false
				},
				close: function(stream) {
					if (output && output.buffer && output.buffer.length) {
						output(10)
					}
				},
				read: function(stream, buffer, offset, length, pos) {
					var bytesRead = 0;
					for (var i = 0; i < length; i++) {
						var result;
						try {
							result = input()
						} catch (e) {
							throw new FS.ErrnoError(29)
						}
						if (result === undefined && bytesRead === 0) {
							throw new FS.ErrnoError(6)
						}
						if (result === null || result === undefined) break;
						bytesRead++;
						buffer[offset + i] = result
					}
					if (bytesRead) {
						stream.node.timestamp = Date.now()
					}
					return bytesRead
				},
				write: function(stream, buffer, offset, length, pos) {
					for (var i = 0; i < length; i++) {
						try {
							output(buffer[offset + i])
						} catch (e) {
							throw new FS.ErrnoError(29)
						}
					}
					if (length) {
						stream.node.timestamp = Date.now()
					}
					return i
				}
			});
			return FS.mkdev(path, mode, dev)
		},
		forceLoadFile: function(obj) {
			if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
			if (typeof XMLHttpRequest !== "undefined") {
				throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.")
			} else if (read_) {
				try {
					obj.contents = intArrayFromString(read_(obj.url), true);
					obj.usedBytes = obj.contents.length
				} catch (e) {
					throw new FS.ErrnoError(29)
				}
			} else {
				throw new Error("Cannot load without read() or XMLHttpRequest.")
			}
		},
		createLazyFile: function(parent, name, url, canRead, canWrite) {
			function LazyUint8Array() {
				this.lengthKnown = false;
				this.chunks = []
			}
			LazyUint8Array.prototype.get = function LazyUint8Array_get(idx) {
				if (idx > this.length - 1 || idx < 0) {
					return undefined
				}
				var chunkOffset = idx % this.chunkSize;
				var chunkNum = idx / this.chunkSize | 0;
				return this.getter(chunkNum)[chunkOffset]
			};
			LazyUint8Array.prototype.setDataGetter = function LazyUint8Array_setDataGetter(getter) {
				this.getter = getter
			};
			LazyUint8Array.prototype.cacheLength = function LazyUint8Array_cacheLength() {
				var xhr = new XMLHttpRequest;
				xhr.open("HEAD", url, false);
				xhr.send(null);
				if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
				var datalength = Number(xhr.getResponseHeader("Content-length"));
				var header;
				var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
				var usesGzip = (header = xhr.getResponseHeader("Content-Encoding")) && header === "gzip";
				var chunkSize = 1024 * 1024;
				if (!hasByteServing) chunkSize = datalength;
				var doXHR = function(from, to) {
					if (from > to) throw new Error("invalid range (" + from + ", " + to + ") or no bytes requested!");
					if (to > datalength - 1) throw new Error("only " + datalength + " bytes available! programmer error!");
					var xhr = new XMLHttpRequest;
					xhr.open("GET", url, false);
					if (datalength !== chunkSize) xhr.setRequestHeader("Range", "bytes=" + from + "-" + to);
					if (typeof Uint8Array != "undefined") xhr.responseType = "arraybuffer";
					if (xhr.overrideMimeType) {
						xhr.overrideMimeType("text/plain; charset=x-user-defined")
					}
					xhr.send(null);
					if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
					if (xhr.response !== undefined) {
						return new Uint8Array(xhr.response || [])
					} else {
						return intArrayFromString(xhr.responseText || "", true)
					}
				};
				var lazyArray = this;
				lazyArray.setDataGetter(function(chunkNum) {
					var start = chunkNum * chunkSize;
					var end = (chunkNum + 1) * chunkSize - 1;
					end = Math.min(end, datalength - 1);
					if (typeof lazyArray.chunks[chunkNum] === "undefined") {
						lazyArray.chunks[chunkNum] = doXHR(start, end)
					}
					if (typeof lazyArray.chunks[chunkNum] === "undefined") throw new Error("doXHR failed!");
					return lazyArray.chunks[chunkNum]
				});
				if (usesGzip || !datalength) {
					chunkSize = datalength = 1;
					datalength = this.getter(0).length;
					chunkSize = datalength;
					out("LazyFiles on gzip forces download of the whole file when length is accessed")
				}
				this._length = datalength;
				this._chunkSize = chunkSize;
				this.lengthKnown = true
			};
			if (typeof XMLHttpRequest !== "undefined") {
				if (!ENVIRONMENT_IS_WORKER) throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
				var lazyArray = new LazyUint8Array;
				Object.defineProperties(lazyArray, {
					length: {
						get: function() {
							if (!this.lengthKnown) {
								this.cacheLength()
							}
							return this._length
						}
					},
					chunkSize: {
						get: function() {
							if (!this.lengthKnown) {
								this.cacheLength()
							}
							return this._chunkSize
						}
					}
				});
				var properties = {
					isDevice: false,
					contents: lazyArray
				}
			} else {
				var properties = {
					isDevice: false,
					url: url
				}
			}
			var node = FS.createFile(parent, name, properties, canRead, canWrite);
			if (properties.contents) {
				node.contents = properties.contents
			} else if (properties.url) {
				node.contents = null;
				node.url = properties.url
			}
			Object.defineProperties(node, {
				usedBytes: {
					get: function() {
						return this.contents.length
					}
				}
			});
			var stream_ops = {};
			var keys = Object.keys(node.stream_ops);
			keys.forEach(function(key) {
				var fn = node.stream_ops[key];
				stream_ops[key] = function forceLoadLazyFile() {
					FS.forceLoadFile(node);
					return fn.apply(null, arguments)
				}
			});
			stream_ops.read = function stream_ops_read(stream, buffer, offset, length, position) {
				FS.forceLoadFile(node);
				var contents = stream.node.contents;
				if (position >= contents.length) return 0;
				var size = Math.min(contents.length - position, length);
				if (contents.slice) {
					for (var i = 0; i < size; i++) {
						buffer[offset + i] = contents[position + i]
					}
				} else {
					for (var i = 0; i < size; i++) {
						buffer[offset + i] = contents.get(position + i)
					}
				}
				return size
			};
			node.stream_ops = stream_ops;
			return node
		},
		createPreloadedFile: function(parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn, preFinish) {
			Browser.init();
			var fullname = name ? PATH_FS.resolve(PATH.join2(parent, name)) : parent;
			var dep = getUniqueRunDependency("cp " + fullname);

			function processData(byteArray) {
				function finish(byteArray) {
					if (preFinish) preFinish();
					if (!dontCreateFile) {
						FS.createDataFile(parent, name, byteArray, canRead, canWrite, canOwn)
					}
					if (onload) onload();
					removeRunDependency(dep)
				}
				var handled = false;
				Module["preloadPlugins"].forEach(function(plugin) {
					if (handled) return;
					if (plugin["canHandle"](fullname)) {
						plugin["handle"](byteArray, fullname, finish, function() {
							if (onerror) onerror();
							removeRunDependency(dep)
						});
						handled = true
					}
				});
				if (!handled) finish(byteArray)
			}
			addRunDependency(dep);
			if (typeof url == "string") {
				asyncLoad(url, function(byteArray) {
					processData(byteArray)
				}, onerror)
			} else {
				processData(url)
			}
		},
		indexedDB: function() {
			return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB
		},
		DB_NAME: function() {
			return "EM_FS_" + window.location.pathname
		},
		DB_VERSION: 20,
		DB_STORE_NAME: "FILE_DATA",
		saveFilesToDB: function(paths, onload, onerror) {
			onload = onload || function() {};
			onerror = onerror || function() {};
			var indexedDB = FS.indexedDB();
			try {
				var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION)
			} catch (e) {
				return onerror(e)
			}
			openRequest.onupgradeneeded = function openRequest_onupgradeneeded() {
				out("creating db");
				var db = openRequest.result;
				db.createObjectStore(FS.DB_STORE_NAME)
			};
			openRequest.onsuccess = function openRequest_onsuccess() {
				var db = openRequest.result;
				var transaction = db.transaction([FS.DB_STORE_NAME], "readwrite");
				var files = transaction.objectStore(FS.DB_STORE_NAME);
				var ok = 0,
					fail = 0,
					total = paths.length;

				function finish() {
					if (fail == 0) onload();
					else onerror()
				}
				paths.forEach(function(path) {
					var putRequest = files.put(FS.analyzePath(path).object.contents, path);
					putRequest.onsuccess = function putRequest_onsuccess() {
						ok++;
						if (ok + fail == total) finish()
					};
					putRequest.onerror = function putRequest_onerror() {
						fail++;
						if (ok + fail == total) finish()
					}
				});
				transaction.onerror = onerror
			};
			openRequest.onerror = onerror
		},
		loadFilesFromDB: function(paths, onload, onerror) {
			onload = onload || function() {};
			onerror = onerror || function() {};
			var indexedDB = FS.indexedDB();
			try {
				var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION)
			} catch (e) {
				return onerror(e)
			}
			openRequest.onupgradeneeded = onerror;
			openRequest.onsuccess = function openRequest_onsuccess() {
				var db = openRequest.result;
				try {
					var transaction = db.transaction([FS.DB_STORE_NAME], "readonly")
				} catch (e) {
					onerror(e);
					return
				}
				var files = transaction.objectStore(FS.DB_STORE_NAME);
				var ok = 0,
					fail = 0,
					total = paths.length;

				function finish() {
					if (fail == 0) onload();
					else onerror()
				}
				paths.forEach(function(path) {
					var getRequest = files.get(path);
					getRequest.onsuccess = function getRequest_onsuccess() {
						if (FS.analyzePath(path).exists) {
							FS.unlink(path)
						}
						FS.createDataFile(PATH.dirname(path), PATH.basename(path), getRequest.result, true, true, true);
						ok++;
						if (ok + fail == total) finish()
					};
					getRequest.onerror = function getRequest_onerror() {
						fail++;
						if (ok + fail == total) finish()
					}
				});
				transaction.onerror = onerror
			};
			openRequest.onerror = onerror
		}
	};
	Module["FS"] = FS;
	var SYSCALLS = {
		mappings: {},
		DEFAULT_POLLMASK: 5,
		umask: 511,
		calculateAt: function(dirfd, path, allowEmpty) {
			if (path[0] === "/") {
				return path
			}
			var dir;
			if (dirfd === -100) {
				dir = FS.cwd()
			} else {
				var dirstream = FS.getStream(dirfd);
				if (!dirstream) throw new FS.ErrnoError(8);
				dir = dirstream.path
			}
			if (path.length == 0) {
				if (!allowEmpty) {
					throw new FS.ErrnoError(44)
				}
				return dir
			}
			return PATH.join2(dir, path)
		},
		doStat: function(func, path, buf) {
			try {
				var stat = func(path)
			} catch (e) {
				if (e && e.node && PATH.normalize(path) !== PATH.normalize(FS.getPath(e.node))) {
					return -54
				}
				throw e
			}
			GROWABLE_HEAP_I32()[buf >> 2] = stat.dev;
			GROWABLE_HEAP_I32()[buf + 4 >> 2] = 0;
			GROWABLE_HEAP_I32()[buf + 8 >> 2] = stat.ino;
			GROWABLE_HEAP_I32()[buf + 12 >> 2] = stat.mode;
			GROWABLE_HEAP_I32()[buf + 16 >> 2] = stat.nlink;
			GROWABLE_HEAP_I32()[buf + 20 >> 2] = stat.uid;
			GROWABLE_HEAP_I32()[buf + 24 >> 2] = stat.gid;
			GROWABLE_HEAP_I32()[buf + 28 >> 2] = stat.rdev;
			GROWABLE_HEAP_I32()[buf + 32 >> 2] = 0;
			tempI64 = [stat.size >>> 0, (tempDouble = stat.size, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math.min(+Math.floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], GROWABLE_HEAP_I32()[buf + 40 >> 2] = tempI64[0], GROWABLE_HEAP_I32()[buf + 44 >> 2] = tempI64[1];
			GROWABLE_HEAP_I32()[buf + 48 >> 2] = 4096;
			GROWABLE_HEAP_I32()[buf + 52 >> 2] = stat.blocks;
			GROWABLE_HEAP_I32()[buf + 56 >> 2] = stat.atime.getTime() / 1e3 | 0;
			GROWABLE_HEAP_I32()[buf + 60 >> 2] = 0;
			GROWABLE_HEAP_I32()[buf + 64 >> 2] = stat.mtime.getTime() / 1e3 | 0;
			GROWABLE_HEAP_I32()[buf + 68 >> 2] = 0;
			GROWABLE_HEAP_I32()[buf + 72 >> 2] = stat.ctime.getTime() / 1e3 | 0;
			GROWABLE_HEAP_I32()[buf + 76 >> 2] = 0;
			tempI64 = [stat.ino >>> 0, (tempDouble = stat.ino, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math.min(+Math.floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], GROWABLE_HEAP_I32()[buf + 80 >> 2] = tempI64[0], GROWABLE_HEAP_I32()[buf + 84 >> 2] = tempI64[1];
			return 0
		},
		doMsync: function(addr, stream, len, flags, offset) {
			var buffer = GROWABLE_HEAP_U8().slice(addr, addr + len);
			FS.msync(stream, buffer, offset, len, flags)
		},
		doMkdir: function(path, mode) {
			path = PATH.normalize(path);
			if (path[path.length - 1] === "/") path = path.substr(0, path.length - 1);
			FS.mkdir(path, mode, 0);
			return 0
		},
		doMknod: function(path, mode, dev) {
			switch (mode & 61440) {
				case 32768:
				case 8192:
				case 24576:
				case 4096:
				case 49152:
					break;
				default:
					return -28
			}
			FS.mknod(path, mode, dev);
			return 0
		},
		doReadlink: function(path, buf, bufsize) {
			if (bufsize <= 0) return -28;
			var ret = FS.readlink(path);
			var len = Math.min(bufsize, lengthBytesUTF8(ret));
			var endChar = GROWABLE_HEAP_I8()[buf + len];
			stringToUTF8(ret, buf, bufsize + 1);
			GROWABLE_HEAP_I8()[buf + len] = endChar;
			return len
		},
		doAccess: function(path, amode) {
			if (amode & ~7) {
				return -28
			}
			var node;
			var lookup = FS.lookupPath(path, {
				follow: true
			});
			node = lookup.node;
			if (!node) {
				return -44
			}
			var perms = "";
			if (amode & 4) perms += "r";
			if (amode & 2) perms += "w";
			if (amode & 1) perms += "x";
			if (perms && FS.nodePermissions(node, perms)) {
				return -2
			}
			return 0
		},
		doDup: function(path, flags, suggestFD) {
			var suggest = FS.getStream(suggestFD);
			if (suggest) FS.close(suggest);
			return FS.open(path, flags, 0, suggestFD, suggestFD).fd
		},
		doReadv: function(stream, iov, iovcnt, offset) {
			var ret = 0;
			for (var i = 0; i < iovcnt; i++) {
				var ptr = GROWABLE_HEAP_I32()[iov + i * 8 >> 2];
				var len = GROWABLE_HEAP_I32()[iov + (i * 8 + 4) >> 2];
				var curr = FS.read(stream, GROWABLE_HEAP_I8(), ptr, len, offset);
				if (curr < 0) return -1;
				ret += curr;
				if (curr < len) break
			}
			return ret
		},
		doWritev: function(stream, iov, iovcnt, offset) {
			var ret = 0;
			for (var i = 0; i < iovcnt; i++) {
				var ptr = GROWABLE_HEAP_I32()[iov + i * 8 >> 2];
				var len = GROWABLE_HEAP_I32()[iov + (i * 8 + 4) >> 2];
				var curr = FS.write(stream, GROWABLE_HEAP_I8(), ptr, len, offset);
				if (curr < 0) return -1;
				ret += curr
			}
			return ret
		},
		varargs: undefined,
		get: function() {
			SYSCALLS.varargs += 4;
			var ret = GROWABLE_HEAP_I32()[SYSCALLS.varargs - 4 >> 2];
			return ret
		},
		getStr: function(ptr) {
			var ret = UTF8ToString(ptr);
			return ret
		},
		getStreamFromFD: function(fd) {
			var stream = FS.getStream(fd);
			if (!stream) throw new FS.ErrnoError(8);
			return stream
		},
		get64: function(low, high) {
			return low
		}
	};
	Module["SYSCALLS"] = SYSCALLS;

	function syscallMmap2(addr, len, prot, flags, fd, off) {
		off <<= 12;
		var ptr;
		var allocated = false;
		if ((flags & 16) !== 0 && addr % 65536 !== 0) {
			return -28
		}
		if ((flags & 32) !== 0) {
			ptr = mmapAlloc(len);
			if (!ptr) return -48;
			allocated = true
		} else {
			var info = FS.getStream(fd);
			if (!info) return -8;
			var res = FS.mmap(info, addr, len, off, prot, flags);
			ptr = res.ptr;
			allocated = res.allocated
		}
		SYSCALLS.mappings[ptr] = {
			malloc: ptr,
			len: len,
			allocated: allocated,
			fd: fd,
			prot: prot,
			flags: flags,
			offset: off
		};
		return ptr
	}
	Module["syscallMmap2"] = syscallMmap2;

	function ___sys_mmap2(addr, len, prot, flags, fd, off) {
		if (ENVIRONMENT_IS_PTHREAD) return _emscripten_proxy_to_main_thread_js(3, 1, addr, len, prot, flags, fd, off);
		try {
			return syscallMmap2(addr, len, prot, flags, fd, off)
		} catch (e) {
			if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
			return -e.errno
		}
	}
	Module["___sys_mmap2"] = ___sys_mmap2;

	function syscallMunmap(addr, len) {
		var info = SYSCALLS.mappings[addr];
		if (len === 0 || !info) {
			return -28
		}
		if (len === info.len) {
			var stream = FS.getStream(info.fd);
			if (stream) {
				if (info.prot & 2) {
					SYSCALLS.doMsync(addr, stream, len, info.flags, info.offset)
				}
				FS.munmap(stream)
			}
			SYSCALLS.mappings[addr] = null;
			if (info.allocated) {
				_free(info.malloc)
			}
		}
		return 0
	}
	Module["syscallMunmap"] = syscallMunmap;

	function ___sys_munmap(addr, len) {
		if (ENVIRONMENT_IS_PTHREAD) return _emscripten_proxy_to_main_thread_js(4, 1, addr, len);
		try {
			return syscallMunmap(addr, len)
		} catch (e) {
			if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
			return -e.errno
		}
	}
	Module["___sys_munmap"] = ___sys_munmap;

	function ___sys_open(path, flags, varargs) {
		if (ENVIRONMENT_IS_PTHREAD) return _emscripten_proxy_to_main_thread_js(5, 1, path, flags, varargs);
		SYSCALLS.varargs = varargs;
		try {
			var pathname = SYSCALLS.getStr(path);
			var mode = varargs ? SYSCALLS.get() : 0;
			var stream = FS.open(pathname, flags, mode);
			return stream.fd
		} catch (e) {
			if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
			return -e.errno
		}
	}
	Module["___sys_open"] = ___sys_open;

	function __dlopen_js(filename, flag) {
		abort("To use dlopen, you need to use Emscripten's linking support, see https://github.com/emscripten-core/emscripten/wiki/Linking")
	}
	Module["__dlopen_js"] = __dlopen_js;

	function __dlsym_js(handle, symbol) {
		abort("To use dlopen, you need to use Emscripten's linking support, see https://github.com/emscripten-core/emscripten/wiki/Linking")
	}
	Module["__dlsym_js"] = __dlsym_js;

	function __embind_register_bigint(primitiveType, name, size, minRange, maxRange) {}
	Module["__embind_register_bigint"] = __embind_register_bigint;

	function getShiftFromSize(size) {
		switch (size) {
			case 1:
				return 0;
			case 2:
				return 1;
			case 4:
				return 2;
			case 8:
				return 3;
			default:
				throw new TypeError("Unknown type size: " + size)
		}
	}
	Module["getShiftFromSize"] = getShiftFromSize;

	function embind_init_charCodes() {
		var codes = new Array(256);
		for (var i = 0; i < 256; ++i) {
			codes[i] = String.fromCharCode(i)
		}
		embind_charCodes = codes
	}
	Module["embind_init_charCodes"] = embind_init_charCodes;
	var embind_charCodes = undefined;
	Module["embind_charCodes"] = embind_charCodes;

	function readLatin1String(ptr) {
		var ret = "";
		var c = ptr;
		while (GROWABLE_HEAP_U8()[c]) {
			ret += embind_charCodes[GROWABLE_HEAP_U8()[c++]]
		}
		return ret
	}
	Module["readLatin1String"] = readLatin1String;
	var awaitingDependencies = {};
	Module["awaitingDependencies"] = awaitingDependencies;
	var registeredTypes = {};
	Module["registeredTypes"] = registeredTypes;
	var typeDependencies = {};
	Module["typeDependencies"] = typeDependencies;
	var char_0 = 48;
	Module["char_0"] = char_0;
	var char_9 = 57;
	Module["char_9"] = char_9;

	function makeLegalFunctionName(name) {
		if (undefined === name) {
			return "_unknown"
		}
		name = name.replace(/[^a-zA-Z0-9_]/g, "$");
		var f = name.charCodeAt(0);
		if (f >= char_0 && f <= char_9) {
			return "_" + name
		} else {
			return name
		}
	}
	Module["makeLegalFunctionName"] = makeLegalFunctionName;

	function createNamedFunction(name, body) {
		name = makeLegalFunctionName(name);
		return new Function("body", "return function " + name + "() {\n" + '    "use strict";' + "    return body.apply(this, arguments);\n" + "};\n")(body)
	}
	Module["createNamedFunction"] = createNamedFunction;

	function extendError(baseErrorType, errorName) {
		var errorClass = createNamedFunction(errorName, function(message) {
			this.name = errorName;
			this.message = message;
			var stack = new Error(message).stack;
			if (stack !== undefined) {
				this.stack = this.toString() + "\n" + stack.replace(/^Error(:[^\n]*)?\n/, "")
			}
		});
		errorClass.prototype = Object.create(baseErrorType.prototype);
		errorClass.prototype.constructor = errorClass;
		errorClass.prototype.toString = function() {
			if (this.message === undefined) {
				return this.name
			} else {
				return this.name + ": " + this.message
			}
		};
		return errorClass
	}
	Module["extendError"] = extendError;
	var BindingError = undefined;
	Module["BindingError"] = BindingError;

	function throwBindingError(message) {
		throw new BindingError(message)
	}
	Module["throwBindingError"] = throwBindingError;
	var InternalError = undefined;
	Module["InternalError"] = InternalError;

	function throwInternalError(message) {
		throw new InternalError(message)
	}
	Module["throwInternalError"] = throwInternalError;

	function whenDependentTypesAreResolved(myTypes, dependentTypes, getTypeConverters) {
		myTypes.forEach(function(type) {
			typeDependencies[type] = dependentTypes
		});

		function onComplete(typeConverters) {
			var myTypeConverters = getTypeConverters(typeConverters);
			if (myTypeConverters.length !== myTypes.length) {
				throwInternalError("Mismatched type converter count")
			}
			for (var i = 0; i < myTypes.length; ++i) {
				registerType(myTypes[i], myTypeConverters[i])
			}
		}
		var typeConverters = new Array(dependentTypes.length);
		var unregisteredTypes = [];
		var registered = 0;
		dependentTypes.forEach(function(dt, i) {
			if (registeredTypes.hasOwnProperty(dt)) {
				typeConverters[i] = registeredTypes[dt]
			} else {
				unregisteredTypes.push(dt);
				if (!awaitingDependencies.hasOwnProperty(dt)) {
					awaitingDependencies[dt] = []
				}
				awaitingDependencies[dt].push(function() {
					typeConverters[i] = registeredTypes[dt];
					++registered;
					if (registered === unregisteredTypes.length) {
						onComplete(typeConverters)
					}
				})
			}
		});
		if (0 === unregisteredTypes.length) {
			onComplete(typeConverters)
		}
	}
	Module["whenDependentTypesAreResolved"] = whenDependentTypesAreResolved;

	function registerType(rawType, registeredInstance, options) {
		options = options || {};
		if (!("argPackAdvance" in registeredInstance)) {
			throw new TypeError("registerType registeredInstance requires argPackAdvance")
		}
		var name = registeredInstance.name;
		if (!rawType) {
			throwBindingError('type "' + name + '" must have a positive integer typeid pointer')
		}
		if (registeredTypes.hasOwnProperty(rawType)) {
			if (options.ignoreDuplicateRegistrations) {
				return
			} else {
				throwBindingError("Cannot register type '" + name + "' twice")
			}
		}
		registeredTypes[rawType] = registeredInstance;
		delete typeDependencies[rawType];
		if (awaitingDependencies.hasOwnProperty(rawType)) {
			var callbacks = awaitingDependencies[rawType];
			delete awaitingDependencies[rawType];
			callbacks.forEach(function(cb) {
				cb()
			})
		}
	}
	Module["registerType"] = registerType;

	function __embind_register_bool(rawType, name, size, trueValue, falseValue) {
		var shift = getShiftFromSize(size);
		name = readLatin1String(name);
		registerType(rawType, {
			name: name,
			"fromWireType": function(wt) {
				return !!wt
			},
			"toWireType": function(destructors, o) {
				return o ? trueValue : falseValue
			},
			"argPackAdvance": 8,
			"readValueFromPointer": function(pointer) {
				var heap;
				if (size === 1) {
					heap = GROWABLE_HEAP_I8()
				} else if (size === 2) {
					heap = GROWABLE_HEAP_I16()
				} else if (size === 4) {
					heap = GROWABLE_HEAP_I32()
				} else {
					throw new TypeError("Unknown boolean type size: " + name)
				}
				return this["fromWireType"](heap[pointer >> shift])
			},
			destructorFunction: null
		})
	}
	Module["__embind_register_bool"] = __embind_register_bool;
	var emval_free_list = [];
	Module["emval_free_list"] = emval_free_list;
	var emval_handle_array = [{}, {
		value: undefined
	}, {
		value: null
	}, {
		value: true
	}, {
		value: false
	}];
	Module["emval_handle_array"] = emval_handle_array;

	function __emval_decref(handle) {
		if (handle > 4 && 0 === --emval_handle_array[handle].refcount) {
			emval_handle_array[handle] = undefined;
			emval_free_list.push(handle)
		}
	}
	Module["__emval_decref"] = __emval_decref;

	function count_emval_handles() {
		var count = 0;
		for (var i = 5; i < emval_handle_array.length; ++i) {
			if (emval_handle_array[i] !== undefined) {
				++count
			}
		}
		return count
	}
	Module["count_emval_handles"] = count_emval_handles;

	function get_first_emval() {
		for (var i = 5; i < emval_handle_array.length; ++i) {
			if (emval_handle_array[i] !== undefined) {
				return emval_handle_array[i]
			}
		}
		return null
	}
	Module["get_first_emval"] = get_first_emval;

	function init_emval() {
		Module["count_emval_handles"] = count_emval_handles;
		Module["get_first_emval"] = get_first_emval
	}
	Module["init_emval"] = init_emval;

	function __emval_register(value) {
		switch (value) {
			case undefined: {
				return 1
			}
			case null: {
				return 2
			}
			case true: {
				return 3
			}
			case false: {
				return 4
			}
			default: {
				var handle = emval_free_list.length ? emval_free_list.pop() : emval_handle_array.length;
				emval_handle_array[handle] = {
					refcount: 1,
					value: value
				};
				return handle
			}
		}
	}
	Module["__emval_register"] = __emval_register;

	function simpleReadValueFromPointer(pointer) {
		return this["fromWireType"](GROWABLE_HEAP_U32()[pointer >> 2])
	}
	Module["simpleReadValueFromPointer"] = simpleReadValueFromPointer;

	function __embind_register_emval(rawType, name) {
		name = readLatin1String(name);
		registerType(rawType, {
			name: name,
			"fromWireType": function(handle) {
				var rv = emval_handle_array[handle].value;
				__emval_decref(handle);
				return rv
			},
			"toWireType": function(destructors, value) {
				return __emval_register(value)
			},
			"argPackAdvance": 8,
			"readValueFromPointer": simpleReadValueFromPointer,
			destructorFunction: null
		})
	}
	Module["__embind_register_emval"] = __embind_register_emval;

	function _embind_repr(v) {
		if (v === null) {
			return "null"
		}
		var t = typeof v;
		if (t === "object" || t === "array" || t === "function") {
			return v.toString()
		} else {
			return "" + v
		}
	}
	Module["_embind_repr"] = _embind_repr;

	function floatReadValueFromPointer(name, shift) {
		switch (shift) {
			case 2:
				return function(pointer) {
					return this["fromWireType"](GROWABLE_HEAP_F32()[pointer >> 2])
				};
			case 3:
				return function(pointer) {
					return this["fromWireType"](GROWABLE_HEAP_F64()[pointer >> 3])
				};
			default:
				throw new TypeError("Unknown float type: " + name)
		}
	}
	Module["floatReadValueFromPointer"] = floatReadValueFromPointer;

	function __embind_register_float(rawType, name, size) {
		var shift = getShiftFromSize(size);
		name = readLatin1String(name);
		registerType(rawType, {
			name: name,
			"fromWireType": function(value) {
				return value
			},
			"toWireType": function(destructors, value) {
				if (typeof value !== "number" && typeof value !== "boolean") {
					throw new TypeError('Cannot convert "' + _embind_repr(value) + '" to ' + this.name)
				}
				return value
			},
			"argPackAdvance": 8,
			"readValueFromPointer": floatReadValueFromPointer(name, shift),
			destructorFunction: null
		})
	}
	Module["__embind_register_float"] = __embind_register_float;

	function new_(constructor, argumentList) {
		if (!(constructor instanceof Function)) {
			throw new TypeError("new_ called with constructor type " + typeof constructor + " which is not a function")
		}
		var dummy = createNamedFunction(constructor.name || "unknownFunctionName", function() {});
		dummy.prototype = constructor.prototype;
		var obj = new dummy;
		var r = constructor.apply(obj, argumentList);
		return r instanceof Object ? r : obj
	}
	Module["new_"] = new_;

	function runDestructors(destructors) {
		while (destructors.length) {
			var ptr = destructors.pop();
			var del = destructors.pop();
			del(ptr)
		}
	}
	Module["runDestructors"] = runDestructors;

	function craftInvokerFunction(humanName, argTypes, classType, cppInvokerFunc, cppTargetFunc) {
		var argCount = argTypes.length;
		if (argCount < 2) {
			throwBindingError("argTypes array size mismatch! Must at least get return value and 'this' types!")
		}
		var isClassMethodFunc = argTypes[1] !== null && classType !== null;
		var needsDestructorStack = false;
		for (var i = 1; i < argTypes.length; ++i) {
			if (argTypes[i] !== null && argTypes[i].destructorFunction === undefined) {
				needsDestructorStack = true;
				break
			}
		}
		var returns = argTypes[0].name !== "void";
		var argsList = "";
		var argsListWired = "";
		for (var i = 0; i < argCount - 2; ++i) {
			argsList += (i !== 0 ? ", " : "") + "arg" + i;
			argsListWired += (i !== 0 ? ", " : "") + "arg" + i + "Wired"
		}
		var invokerFnBody = "return function " + makeLegalFunctionName(humanName) + "(" + argsList + ") {\n" + "if (arguments.length !== " + (argCount - 2) + ") {\n" + "throwBindingError('function " + humanName + " called with ' + arguments.length + ' arguments, expected " + (argCount - 2) + " args!');\n" + "}\n";
		if (needsDestructorStack) {
			invokerFnBody += "var destructors = [];\n"
		}
		var dtorStack = needsDestructorStack ? "destructors" : "null";
		var args1 = ["throwBindingError", "invoker", "fn", "runDestructors", "retType", "classParam"];
		var args2 = [throwBindingError, cppInvokerFunc, cppTargetFunc, runDestructors, argTypes[0], argTypes[1]];
		if (isClassMethodFunc) {
			invokerFnBody += "var thisWired = classParam.toWireType(" + dtorStack + ", this);\n"
		}
		for (var i = 0; i < argCount - 2; ++i) {
			invokerFnBody += "var arg" + i + "Wired = argType" + i + ".toWireType(" + dtorStack + ", arg" + i + "); // " + argTypes[i + 2].name + "\n";
			args1.push("argType" + i);
			args2.push(argTypes[i + 2])
		}
		if (isClassMethodFunc) {
			argsListWired = "thisWired" + (argsListWired.length > 0 ? ", " : "") + argsListWired
		}
		invokerFnBody += (returns ? "var rv = " : "") + "invoker(fn" + (argsListWired.length > 0 ? ", " : "") + argsListWired + ");\n";
		if (needsDestructorStack) {
			invokerFnBody += "runDestructors(destructors);\n"
		} else {
			for (var i = isClassMethodFunc ? 1 : 2; i < argTypes.length; ++i) {
				var paramName = i === 1 ? "thisWired" : "arg" + (i - 2) + "Wired";
				if (argTypes[i].destructorFunction !== null) {
					invokerFnBody += paramName + "_dtor(" + paramName + "); // " + argTypes[i].name + "\n";
					args1.push(paramName + "_dtor");
					args2.push(argTypes[i].destructorFunction)
				}
			}
		}
		if (returns) {
			invokerFnBody += "var ret = retType.fromWireType(rv);\n" + "return ret;\n"
		} else {}
		invokerFnBody += "}\n";
		args1.push(invokerFnBody);
		var invokerFunction = new_(Function, args1).apply(null, args2);
		return invokerFunction
	}
	Module["craftInvokerFunction"] = craftInvokerFunction;

	function ensureOverloadTable(proto, methodName, humanName) {
		if (undefined === proto[methodName].overloadTable) {
			var prevFunc = proto[methodName];
			proto[methodName] = function() {
				if (!proto[methodName].overloadTable.hasOwnProperty(arguments.length)) {
					throwBindingError("Function '" + humanName + "' called with an invalid number of arguments (" + arguments.length + ") - expects one of (" + proto[methodName].overloadTable + ")!")
				}
				return proto[methodName].overloadTable[arguments.length].apply(this, arguments)
			};
			proto[methodName].overloadTable = [];
			proto[methodName].overloadTable[prevFunc.argCount] = prevFunc
		}
	}
	Module["ensureOverloadTable"] = ensureOverloadTable;

	function exposePublicSymbol(name, value, numArguments) {
		if (Module.hasOwnProperty(name)) {
			if (undefined === numArguments || undefined !== Module[name].overloadTable && undefined !== Module[name].overloadTable[numArguments]) {
				throwBindingError("Cannot register public name '" + name + "' twice")
			}
			ensureOverloadTable(Module, name, name);
			if (Module.hasOwnProperty(numArguments)) {
				throwBindingError("Cannot register multiple overloads of a function with the same number of arguments (" + numArguments + ")!")
			}
			Module[name].overloadTable[numArguments] = value
		} else {
			Module[name] = value;
			if (undefined !== numArguments) {
				Module[name].numArguments = numArguments
			}
		}
	}
	Module["exposePublicSymbol"] = exposePublicSymbol;

	function heap32VectorToArray(count, firstElement) {
		var array = [];
		for (var i = 0; i < count; i++) {
			array.push(GROWABLE_HEAP_I32()[(firstElement >> 2) + i])
		}
		return array
	}
	Module["heap32VectorToArray"] = heap32VectorToArray;

	function replacePublicSymbol(name, value, numArguments) {
		if (!Module.hasOwnProperty(name)) {
			throwInternalError("Replacing nonexistant public symbol")
		}
		if (undefined !== Module[name].overloadTable && undefined !== numArguments) {
			Module[name].overloadTable[numArguments] = value
		} else {
			Module[name] = value;
			Module[name].argCount = numArguments
		}
	}
	Module["replacePublicSymbol"] = replacePublicSymbol;

	function dynCallLegacy(sig, ptr, args) {
		var f = Module["dynCall_" + sig];
		return args && args.length ? f.apply(null, [ptr].concat(args)) : f.call(null, ptr)
	}
	Module["dynCallLegacy"] = dynCallLegacy;

	function dynCall(sig, ptr, args) {
		if (sig.includes("j")) {
			return dynCallLegacy(sig, ptr, args)
		}
		return wasmTable.get(ptr).apply(null, args)
	}
	Module["dynCall"] = dynCall;

	function getDynCaller(sig, ptr) {
		var argCache = [];
		return function() {
			argCache.length = arguments.length;
			for (var i = 0; i < arguments.length; i++) {
				argCache[i] = arguments[i]
			}
			return dynCall(sig, ptr, argCache)
		}
	}
	Module["getDynCaller"] = getDynCaller;

	function embind__requireFunction(signature, rawFunction) {
		signature = readLatin1String(signature);

		function makeDynCaller() {
			if (signature.includes("j")) {
				return getDynCaller(signature, rawFunction)
			}
			return wasmTable.get(rawFunction)
		}
		var fp = makeDynCaller();
		if (typeof fp !== "function") {
			throwBindingError("unknown function pointer with signature " + signature + ": " + rawFunction)
		}
		return fp
	}
	Module["embind__requireFunction"] = embind__requireFunction;
	var UnboundTypeError = undefined;
	Module["UnboundTypeError"] = UnboundTypeError;

	function getTypeName(type) {
		var ptr = ___getTypeName(type);
		var rv = readLatin1String(ptr);
		_free(ptr);
		return rv
	}
	Module["getTypeName"] = getTypeName;

	function throwUnboundTypeError(message, types) {
		var unboundTypes = [];
		var seen = {};

		function visit(type) {
			if (seen[type]) {
				return
			}
			if (registeredTypes[type]) {
				return
			}
			if (typeDependencies[type]) {
				typeDependencies[type].forEach(visit);
				return
			}
			unboundTypes.push(type);
			seen[type] = true
		}
		types.forEach(visit);
		throw new UnboundTypeError(message + ": " + unboundTypes.map(getTypeName).join([", "]))
	}
	Module["throwUnboundTypeError"] = throwUnboundTypeError;

	function __embind_register_function(name, argCount, rawArgTypesAddr, signature, rawInvoker, fn) {
		var argTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
		name = readLatin1String(name);
		rawInvoker = embind__requireFunction(signature, rawInvoker);
		exposePublicSymbol(name, function() {
			throwUnboundTypeError("Cannot call " + name + " due to unbound types", argTypes)
		}, argCount - 1);
		whenDependentTypesAreResolved([], argTypes, function(argTypes) {
			var invokerArgsArray = [argTypes[0], null].concat(argTypes.slice(1));
			replacePublicSymbol(name, craftInvokerFunction(name, invokerArgsArray, null, rawInvoker, fn), argCount - 1);
			return []
		})
	}
	Module["__embind_register_function"] = __embind_register_function;

	function integerReadValueFromPointer(name, shift, signed) {
		switch (shift) {
			case 0:
				return signed ? function readS8FromPointer(pointer) {
					return GROWABLE_HEAP_I8()[pointer]
				} : function readU8FromPointer(pointer) {
					return GROWABLE_HEAP_U8()[pointer]
				};
			case 1:
				return signed ? function readS16FromPointer(pointer) {
					return GROWABLE_HEAP_I16()[pointer >> 1]
				} : function readU16FromPointer(pointer) {
					return GROWABLE_HEAP_U16()[pointer >> 1]
				};
			case 2:
				return signed ? function readS32FromPointer(pointer) {
					return GROWABLE_HEAP_I32()[pointer >> 2]
				} : function readU32FromPointer(pointer) {
					return GROWABLE_HEAP_U32()[pointer >> 2]
				};
			default:
				throw new TypeError("Unknown integer type: " + name)
		}
	}
	Module["integerReadValueFromPointer"] = integerReadValueFromPointer;

	function __embind_register_integer(primitiveType, name, size, minRange, maxRange) {
		name = readLatin1String(name);
		if (maxRange === -1) {
			maxRange = 4294967295
		}
		var shift = getShiftFromSize(size);
		var fromWireType = function(value) {
			return value
		};
		if (minRange === 0) {
			var bitshift = 32 - 8 * size;
			fromWireType = function(value) {
				return value << bitshift >>> bitshift
			}
		}
		var isUnsignedType = name.includes("unsigned");
		registerType(primitiveType, {
			name: name,
			"fromWireType": fromWireType,
			"toWireType": function(destructors, value) {
				if (typeof value !== "number" && typeof value !== "boolean") {
					throw new TypeError('Cannot convert "' + _embind_repr(value) + '" to ' + this.name)
				}
				if (value < minRange || value > maxRange) {
					throw new TypeError('Passing a number "' + _embind_repr(value) + '" from JS side to C/C++ side to an argument of type "' + name + '", which is outside the valid range [' + minRange + ", " + maxRange + "]!")
				}
				return isUnsignedType ? value >>> 0 : value | 0
			},
			"argPackAdvance": 8,
			"readValueFromPointer": integerReadValueFromPointer(name, shift, minRange !== 0),
			destructorFunction: null
		})
	}
	Module["__embind_register_integer"] = __embind_register_integer;

	function __embind_register_memory_view(rawType, dataTypeIndex, name) {
		var typeMapping = [Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array];
		var TA = typeMapping[dataTypeIndex];

		function decodeMemoryView(handle) {
			handle = handle >> 2;
			var heap = GROWABLE_HEAP_U32();
			var size = heap[handle];
			var data = heap[handle + 1];
			return new TA(buffer, data, size)
		}
		name = readLatin1String(name);
		registerType(rawType, {
			name: name,
			"fromWireType": decodeMemoryView,
			"argPackAdvance": 8,
			"readValueFromPointer": decodeMemoryView
		}, {
			ignoreDuplicateRegistrations: true
		})
	}
	Module["__embind_register_memory_view"] = __embind_register_memory_view;

	function __embind_register_std_string(rawType, name) {
		name = readLatin1String(name);
		var stdStringIsUTF8 = name === "std::string";
		registerType(rawType, {
			name: name,
			"fromWireType": function(value) {
				var length = GROWABLE_HEAP_U32()[value >> 2];
				var str;
				if (stdStringIsUTF8) {
					var decodeStartPtr = value + 4;
					for (var i = 0; i <= length; ++i) {
						var currentBytePtr = value + 4 + i;
						if (i == length || GROWABLE_HEAP_U8()[currentBytePtr] == 0) {
							var maxRead = currentBytePtr - decodeStartPtr;
							var stringSegment = UTF8ToString(decodeStartPtr, maxRead);
							if (str === undefined) {
								str = stringSegment
							} else {
								str += String.fromCharCode(0);
								str += stringSegment
							}
							decodeStartPtr = currentBytePtr + 1
						}
					}
				} else {
					var a = new Array(length);
					for (var i = 0; i < length; ++i) {
						a[i] = String.fromCharCode(GROWABLE_HEAP_U8()[value + 4 + i])
					}
					str = a.join("")
				}
				_free(value);
				return str
			},
			"toWireType": function(destructors, value) {
				if (value instanceof ArrayBuffer) {
					value = new Uint8Array(value)
				}
				var getLength;
				var valueIsOfTypeString = typeof value === "string";
				if (!(valueIsOfTypeString || value instanceof Uint8Array || value instanceof Uint8ClampedArray || value instanceof Int8Array)) {
					throwBindingError("Cannot pass non-string to std::string")
				}
				if (stdStringIsUTF8 && valueIsOfTypeString) {
					getLength = function() {
						return lengthBytesUTF8(value)
					}
				} else {
					getLength = function() {
						return value.length
					}
				}
				var length = getLength();
				var ptr = _malloc(4 + length + 1);
				GROWABLE_HEAP_U32()[ptr >> 2] = length;
				if (stdStringIsUTF8 && valueIsOfTypeString) {
					stringToUTF8(value, ptr + 4, length + 1)
				} else {
					if (valueIsOfTypeString) {
						for (var i = 0; i < length; ++i) {
							var charCode = value.charCodeAt(i);
							if (charCode > 255) {
								_free(ptr);
								throwBindingError("String has UTF-16 code units that do not fit in 8 bits")
							}
							GROWABLE_HEAP_U8()[ptr + 4 + i] = charCode
						}
					} else {
						for (var i = 0; i < length; ++i) {
							GROWABLE_HEAP_U8()[ptr + 4 + i] = value[i]
						}
					}
				}
				if (destructors !== null) {
					destructors.push(_free, ptr)
				}
				return ptr
			},
			"argPackAdvance": 8,
			"readValueFromPointer": simpleReadValueFromPointer,
			destructorFunction: function(ptr) {
				_free(ptr)
			}
		})
	}
	Module["__embind_register_std_string"] = __embind_register_std_string;

	function __embind_register_std_wstring(rawType, charSize, name) {
		name = readLatin1String(name);
		var decodeString, encodeString, getHeap, lengthBytesUTF, shift;
		if (charSize === 2) {
			decodeString = UTF16ToString;
			encodeString = stringToUTF16;
			lengthBytesUTF = lengthBytesUTF16;
			getHeap = function() {
				return GROWABLE_HEAP_U16()
			};
			shift = 1
		} else if (charSize === 4) {
			decodeString = UTF32ToString;
			encodeString = stringToUTF32;
			lengthBytesUTF = lengthBytesUTF32;
			getHeap = function() {
				return GROWABLE_HEAP_U32()
			};
			shift = 2
		}
		registerType(rawType, {
			name: name,
			"fromWireType": function(value) {
				var length = GROWABLE_HEAP_U32()[value >> 2];
				var HEAP = getHeap();
				var str;
				var decodeStartPtr = value + 4;
				for (var i = 0; i <= length; ++i) {
					var currentBytePtr = value + 4 + i * charSize;
					if (i == length || HEAP[currentBytePtr >> shift] == 0) {
						var maxReadBytes = currentBytePtr - decodeStartPtr;
						var stringSegment = decodeString(decodeStartPtr, maxReadBytes);
						if (str === undefined) {
							str = stringSegment
						} else {
							str += String.fromCharCode(0);
							str += stringSegment
						}
						decodeStartPtr = currentBytePtr + charSize
					}
				}
				_free(value);
				return str
			},
			"toWireType": function(destructors, value) {
				if (!(typeof value === "string")) {
					throwBindingError("Cannot pass non-string to C++ string type " + name)
				}
				var length = lengthBytesUTF(value);
				var ptr = _malloc(4 + length + charSize);
				GROWABLE_HEAP_U32()[ptr >> 2] = length >> shift;
				encodeString(value, ptr + 4, length + charSize);
				if (destructors !== null) {
					destructors.push(_free, ptr)
				}
				return ptr
			},
			"argPackAdvance": 8,
			"readValueFromPointer": simpleReadValueFromPointer,
			destructorFunction: function(ptr) {
				_free(ptr)
			}
		})
	}
	Module["__embind_register_std_wstring"] = __embind_register_std_wstring;

	function __embind_register_void(rawType, name) {
		name = readLatin1String(name);
		registerType(rawType, {
			isVoid: true,
			name: name,
			"argPackAdvance": 0,
			"fromWireType": function() {
				return undefined
			},
			"toWireType": function(destructors, o) {
				return undefined
			}
		})
	}
	Module["__embind_register_void"] = __embind_register_void;

	function __emscripten_fetch_free(id) {
		delete Fetch.xhrs[id - 1]
	}
	Module["__emscripten_fetch_free"] = __emscripten_fetch_free;

	function __emscripten_notify_thread_queue(targetThreadId, mainThreadId) {
		if (targetThreadId == mainThreadId) {
			postMessage({
				"cmd": "processQueuedMainThreadWork"
			})
		} else if (ENVIRONMENT_IS_PTHREAD) {
			postMessage({
				"targetThread": targetThreadId,
				"cmd": "processThreadQueue"
			})
		} else {
			var pthread = PThread.pthreads[targetThreadId];
			var worker = pthread && pthread.worker;
			if (!worker) {
				return
			}
			worker.postMessage({
				"cmd": "processThreadQueue"
			})
		}
		return 1
	}
	Module["__emscripten_notify_thread_queue"] = __emscripten_notify_thread_queue;

	function _abort() {
		abort("")
	}
	Module["_abort"] = _abort;
	var readAsmConstArgsArray = [];
	Module["readAsmConstArgsArray"] = readAsmConstArgsArray;

	function readAsmConstArgs(sigPtr, buf) {
		readAsmConstArgsArray.length = 0;
		var ch;
		buf >>= 2;
		while (ch = GROWABLE_HEAP_U8()[sigPtr++]) {
			var readAsmConstArgsDouble = ch < 105;
			if (readAsmConstArgsDouble && buf & 1) buf++;
			readAsmConstArgsArray.push(readAsmConstArgsDouble ? GROWABLE_HEAP_F64()[buf++ >> 1] : GROWABLE_HEAP_I32()[buf]);
			++buf
		}
		return readAsmConstArgsArray
	}
	Module["readAsmConstArgs"] = readAsmConstArgs;

	function _emscripten_asm_const_int(code, sigPtr, argbuf) {
		var args = readAsmConstArgs(sigPtr, argbuf);
		return ASM_CONSTS[code].apply(null, args)
	}
	Module["_emscripten_asm_const_int"] = _emscripten_asm_const_int;

	function _emscripten_conditional_set_current_thread_status_js(expectedStatus, newStatus) {}
	Module["_emscripten_conditional_set_current_thread_status_js"] = _emscripten_conditional_set_current_thread_status_js;

	function _emscripten_conditional_set_current_thread_status(expectedStatus, newStatus) {}
	Module["_emscripten_conditional_set_current_thread_status"] = _emscripten_conditional_set_current_thread_status;

	function _emscripten_get_heap_max() {
		return 2147483648
	}
	Module["_emscripten_get_heap_max"] = _emscripten_get_heap_max;

	function _emscripten_memcpy_big(dest, src, num) {
		GROWABLE_HEAP_U8().copyWithin(dest, src, src + num)
	}
	Module["_emscripten_memcpy_big"] = _emscripten_memcpy_big;

	function _emscripten_num_logical_cores() {
		if (ENVIRONMENT_IS_NODE) return require("os").cpus().length;
		return navigator["hardwareConcurrency"]
	}
	Module["_emscripten_num_logical_cores"] = _emscripten_num_logical_cores;

	function _emscripten_proxy_to_main_thread_js(index, sync) {
		var numCallArgs = arguments.length - 2;
		var stack = stackSave();
		var serializedNumCallArgs = numCallArgs;
		var args = stackAlloc(serializedNumCallArgs * 8);
		var b = args >> 3;
		for (var i = 0; i < numCallArgs; i++) {
			var arg = arguments[2 + i];
			GROWABLE_HEAP_F64()[b + i] = arg
		}
		var ret = _emscripten_run_in_main_runtime_thread_js(index, serializedNumCallArgs, args, sync);
		stackRestore(stack);
		return ret
	}
	Module["_emscripten_proxy_to_main_thread_js"] = _emscripten_proxy_to_main_thread_js;
	var _emscripten_receive_on_main_thread_js_callArgs = [];
	Module["_emscripten_receive_on_main_thread_js_callArgs"] = _emscripten_receive_on_main_thread_js_callArgs;

	function _emscripten_receive_on_main_thread_js(index, numCallArgs, args) {
		_emscripten_receive_on_main_thread_js_callArgs.length = numCallArgs;
		var b = args >> 3;
		for (var i = 0; i < numCallArgs; i++) {
			_emscripten_receive_on_main_thread_js_callArgs[i] = GROWABLE_HEAP_F64()[b + i]
		}
		var isEmAsmConst = index < 0;
		var func = !isEmAsmConst ? proxiedFunctionTable[index] : ASM_CONSTS[-index - 1];
		return func.apply(null, _emscripten_receive_on_main_thread_js_callArgs)
	}
	Module["_emscripten_receive_on_main_thread_js"] = _emscripten_receive_on_main_thread_js;

	function emscripten_realloc_buffer(size) {
		try {
			wasmMemory.grow(size - buffer.byteLength + 65535 >>> 16);
			updateGlobalBufferAndViews(wasmMemory.buffer);
			return 1
		} catch (e) {}
	}
	Module["emscripten_realloc_buffer"] = emscripten_realloc_buffer;

	function _emscripten_resize_heap(requestedSize) {
		var oldSize = GROWABLE_HEAP_U8().length;
		requestedSize = requestedSize >>> 0;
		if (requestedSize <= oldSize) {
			return false
		}
		var maxHeapSize = 2147483648;
		if (requestedSize > maxHeapSize) {
			return false
		}
		for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
			var overGrownHeapSize = oldSize * (1 + .2 / cutDown);
			overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296);
			var newSize = Math.min(maxHeapSize, alignUp(Math.max(requestedSize, overGrownHeapSize), 65536));
			var replacement = emscripten_realloc_buffer(newSize);
			if (replacement) {
				return true
			}
		}
		return false
	}
	Module["_emscripten_resize_heap"] = _emscripten_resize_heap;
	var JSEvents = {
		inEventHandler: 0,
		removeAllEventListeners: function() {
			for (var i = JSEvents.eventHandlers.length - 1; i >= 0; --i) {
				JSEvents._removeHandler(i)
			}
			JSEvents.eventHandlers = [];
			JSEvents.deferredCalls = []
		},
		registerRemoveEventListeners: function() {
			if (!JSEvents.removeEventListenersRegistered) {
				__ATEXIT__.push(JSEvents.removeAllEventListeners);
				JSEvents.removeEventListenersRegistered = true
			}
		},
		deferredCalls: [],
		deferCall: function(targetFunction, precedence, argsList) {
			function arraysHaveEqualContent(arrA, arrB) {
				if (arrA.length != arrB.length) return false;
				for (var i in arrA) {
					if (arrA[i] != arrB[i]) return false
				}
				return true
			}
			for (var i in JSEvents.deferredCalls) {
				var call = JSEvents.deferredCalls[i];
				if (call.targetFunction == targetFunction && arraysHaveEqualContent(call.argsList, argsList)) {
					return
				}
			}
			JSEvents.deferredCalls.push({
				targetFunction: targetFunction,
				precedence: precedence,
				argsList: argsList
			});
			JSEvents.deferredCalls.sort(function(x, y) {
				return x.precedence < y.precedence
			})
		},
		removeDeferredCalls: function(targetFunction) {
			for (var i = 0; i < JSEvents.deferredCalls.length; ++i) {
				if (JSEvents.deferredCalls[i].targetFunction == targetFunction) {
					JSEvents.deferredCalls.splice(i, 1);
					--i
				}
			}
		},
		canPerformEventHandlerRequests: function() {
			return JSEvents.inEventHandler && JSEvents.currentEventHandler.allowsDeferredCalls
		},
		runDeferredCalls: function() {
			if (!JSEvents.canPerformEventHandlerRequests()) {
				return
			}
			for (var i = 0; i < JSEvents.deferredCalls.length; ++i) {
				var call = JSEvents.deferredCalls[i];
				JSEvents.deferredCalls.splice(i, 1);
				--i;
				call.targetFunction.apply(null, call.argsList)
			}
		},
		eventHandlers: [],
		removeAllHandlersOnTarget: function(target, eventTypeString) {
			for (var i = 0; i < JSEvents.eventHandlers.length; ++i) {
				if (JSEvents.eventHandlers[i].target == target && (!eventTypeString || eventTypeString == JSEvents.eventHandlers[i].eventTypeString)) {
					JSEvents._removeHandler(i--)
				}
			}
		},
		_removeHandler: function(i) {
			var h = JSEvents.eventHandlers[i];
			h.target.removeEventListener(h.eventTypeString, h.eventListenerFunc, h.useCapture);
			JSEvents.eventHandlers.splice(i, 1)
		},
		registerOrRemoveHandler: function(eventHandler) {
			var jsEventHandler = function jsEventHandler(event) {
				++JSEvents.inEventHandler;
				JSEvents.currentEventHandler = eventHandler;
				JSEvents.runDeferredCalls();
				eventHandler.handlerFunc(event);
				JSEvents.runDeferredCalls();
				--JSEvents.inEventHandler
			};
			if (eventHandler.callbackfunc) {
				eventHandler.eventListenerFunc = jsEventHandler;
				eventHandler.target.addEventListener(eventHandler.eventTypeString, jsEventHandler, eventHandler.useCapture);
				JSEvents.eventHandlers.push(eventHandler);
				JSEvents.registerRemoveEventListeners()
			} else {
				for (var i = 0; i < JSEvents.eventHandlers.length; ++i) {
					if (JSEvents.eventHandlers[i].target == eventHandler.target && JSEvents.eventHandlers[i].eventTypeString == eventHandler.eventTypeString) {
						JSEvents._removeHandler(i--)
					}
				}
			}
		},
		queueEventHandlerOnThread_iiii: function(targetThread, eventHandlerFunc, eventTypeId, eventData, userData) {
			var stackTop = stackSave();
			var varargs = stackAlloc(12);
			GROWABLE_HEAP_I32()[varargs >> 2] = eventTypeId;
			GROWABLE_HEAP_I32()[varargs + 4 >> 2] = eventData;
			GROWABLE_HEAP_I32()[varargs + 8 >> 2] = userData;
			__emscripten_call_on_thread(0, targetThread, 637534208, eventHandlerFunc, eventData, varargs);
			stackRestore(stackTop)
		},
		getTargetThreadForEventCallback: function(targetThread) {
			switch (targetThread) {
				case 1:
					return 0;
				case 2:
					return PThread.currentProxiedOperationCallerThread;
				default:
					return targetThread
			}
		},
		getNodeNameForTarget: function(target) {
			if (!target) return "";
			if (target == window) return "#window";
			if (target == screen) return "#screen";
			return target && target.nodeName ? target.nodeName : ""
		},
		fullscreenEnabled: function() {
			return document.fullscreenEnabled || document.webkitFullscreenEnabled
		}
	};
	Module["JSEvents"] = JSEvents;

	function stringToNewUTF8(jsString) {
		var length = lengthBytesUTF8(jsString) + 1;
		var cString = _malloc(length);
		stringToUTF8(jsString, cString, length);
		return cString
	}
	Module["stringToNewUTF8"] = stringToNewUTF8;

	function _emscripten_set_offscreencanvas_size_on_target_thread_js(targetThread, targetCanvas, width, height) {
		var stackTop = stackSave();
		var varargs = stackAlloc(12);
		var targetCanvasPtr = 0;
		if (targetCanvas) {
			targetCanvasPtr = stringToNewUTF8(targetCanvas)
		}
		GROWABLE_HEAP_I32()[varargs >> 2] = targetCanvasPtr;
		GROWABLE_HEAP_I32()[varargs + 4 >> 2] = width;
		GROWABLE_HEAP_I32()[varargs + 8 >> 2] = height;
		__emscripten_call_on_thread(0, targetThread, 657457152, 0, targetCanvasPtr, varargs);
		stackRestore(stackTop)
	}
	Module["_emscripten_set_offscreencanvas_size_on_target_thread_js"] = _emscripten_set_offscreencanvas_size_on_target_thread_js;

	function _emscripten_set_offscreencanvas_size_on_target_thread(targetThread, targetCanvas, width, height) {
		targetCanvas = targetCanvas ? UTF8ToString(targetCanvas) : "";
		_emscripten_set_offscreencanvas_size_on_target_thread_js(targetThread, targetCanvas, width, height)
	}
	Module["_emscripten_set_offscreencanvas_size_on_target_thread"] = _emscripten_set_offscreencanvas_size_on_target_thread;

	function maybeCStringToJsString(cString) {
		return cString > 2 ? UTF8ToString(cString) : cString
	}
	Module["maybeCStringToJsString"] = maybeCStringToJsString;
	var specialHTMLTargets = [0, typeof document !== "undefined" ? document : 0, typeof window !== "undefined" ? window : 0];
	Module["specialHTMLTargets"] = specialHTMLTargets;

	function findEventTarget(target) {
		target = maybeCStringToJsString(target);
		var domElement = specialHTMLTargets[target] || (typeof document !== "undefined" ? document.querySelector(target) : undefined);
		return domElement
	}
	Module["findEventTarget"] = findEventTarget;

	function findCanvasEventTarget(target) {
		return findEventTarget(target)
	}
	Module["findCanvasEventTarget"] = findCanvasEventTarget;

	function _emscripten_set_canvas_element_size_calling_thread(target, width, height) {
		var canvas = findCanvasEventTarget(target);
		if (!canvas) return -4;
		if (canvas.canvasSharedPtr) {
			GROWABLE_HEAP_I32()[canvas.canvasSharedPtr >> 2] = width;
			GROWABLE_HEAP_I32()[canvas.canvasSharedPtr + 4 >> 2] = height
		}
		if (canvas.offscreenCanvas || !canvas.controlTransferredOffscreen) {
			if (canvas.offscreenCanvas) canvas = canvas.offscreenCanvas;
			var autoResizeViewport = false;
			if (canvas.GLctxObject && canvas.GLctxObject.GLctx) {
				var prevViewport = canvas.GLctxObject.GLctx.getParameter(2978);
				autoResizeViewport = prevViewport[0] === 0 && prevViewport[1] === 0 && prevViewport[2] === canvas.width && prevViewport[3] === canvas.height
			}
			canvas.width = width;
			canvas.height = height;
			if (autoResizeViewport) {
				canvas.GLctxObject.GLctx.viewport(0, 0, width, height)
			}
		} else if (canvas.canvasSharedPtr) {
			var targetThread = GROWABLE_HEAP_I32()[canvas.canvasSharedPtr + 8 >> 2];
			_emscripten_set_offscreencanvas_size_on_target_thread(targetThread, target, width, height);
			return 1
		} else {
			return -4
		}
		return 0
	}
	Module["_emscripten_set_canvas_element_size_calling_thread"] = _emscripten_set_canvas_element_size_calling_thread;

	function _emscripten_set_canvas_element_size_main_thread(target, width, height) {
		if (ENVIRONMENT_IS_PTHREAD) return _emscripten_proxy_to_main_thread_js(6, 1, target, width, height);
		return _emscripten_set_canvas_element_size_calling_thread(target, width, height)
	}
	Module["_emscripten_set_canvas_element_size_main_thread"] = _emscripten_set_canvas_element_size_main_thread;

	function _emscripten_set_canvas_element_size(target, width, height) {
		var canvas = findCanvasEventTarget(target);
		if (canvas) {
			return _emscripten_set_canvas_element_size_calling_thread(target, width, height)
		} else {
			return _emscripten_set_canvas_element_size_main_thread(target, width, height)
		}
	}
	Module["_emscripten_set_canvas_element_size"] = _emscripten_set_canvas_element_size;

	function _emscripten_set_current_thread_status_js(newStatus) {}
	Module["_emscripten_set_current_thread_status_js"] = _emscripten_set_current_thread_status_js;

	function _emscripten_set_current_thread_status(newStatus) {}
	Module["_emscripten_set_current_thread_status"] = _emscripten_set_current_thread_status;

	function maybeExit() {
		if (!keepRuntimeAlive()) {
			try {
				if (ENVIRONMENT_IS_PTHREAD) __emscripten_thread_exit(EXITSTATUS);
				else _exit(EXITSTATUS)
			} catch (e) {
				handleException(e)
			}
		}
	}
	Module["maybeExit"] = maybeExit;

	function callUserCallback(func, synchronous) {
		if (ABORT) {
			return
		}
		if (synchronous) {
			func();
			return
		}
		try {
			func();
			if (ENVIRONMENT_IS_PTHREAD) maybeExit()
		} catch (e) {
			handleException(e)
		}
	}
	Module["callUserCallback"] = callUserCallback;

	function runtimeKeepalivePush() {
		runtimeKeepaliveCounter += 1
	}
	Module["runtimeKeepalivePush"] = runtimeKeepalivePush;

	function runtimeKeepalivePop() {
		runtimeKeepaliveCounter -= 1
	}
	Module["runtimeKeepalivePop"] = runtimeKeepalivePop;

	function _emscripten_set_timeout(cb, msecs, userData) {
		runtimeKeepalivePush();
		return setTimeout(function() {
			runtimeKeepalivePop();
			callUserCallback(function() {
				wasmTable.get(cb)(userData)
			})
		}, msecs)
	}
	Module["_emscripten_set_timeout"] = _emscripten_set_timeout;

	function _emscripten_generate_pc(frame) {
		abort("Cannot use emscripten_generate_pc (needed by __builtin_return_address) without -s USE_OFFSET_CONVERTER")
	}
	Module["_emscripten_generate_pc"] = _emscripten_generate_pc;
	var UNWIND_CACHE = {};
	Module["UNWIND_CACHE"] = UNWIND_CACHE;

	function __emscripten_save_in_unwind_cache(callstack) {
		callstack.forEach(function(frame) {
			var pc = _emscripten_generate_pc(frame);
			if (pc) {
				UNWIND_CACHE[pc] = frame
			}
		})
	}
	Module["__emscripten_save_in_unwind_cache"] = __emscripten_save_in_unwind_cache;

	function _emscripten_stack_snapshot() {
		var callstack = (new Error).stack.split("\n");
		if (callstack[0] == "Error") {
			callstack.shift()
		}
		__emscripten_save_in_unwind_cache(callstack);
		UNWIND_CACHE.last_addr = _emscripten_generate_pc(callstack[2]);
		UNWIND_CACHE.last_stack = callstack;
		return UNWIND_CACHE.last_addr
	}
	Module["_emscripten_stack_snapshot"] = _emscripten_stack_snapshot;

	function _emscripten_stack_unwind_buffer(addr, buffer, count) {
		var stack;
		if (UNWIND_CACHE.last_addr == addr) {
			stack = UNWIND_CACHE.last_stack
		} else {
			stack = (new Error).stack.split("\n");
			if (stack[0] == "Error") {
				stack.shift()
			}
			__emscripten_save_in_unwind_cache(stack)
		}
		var offset = 2;
		while (stack[offset] && _emscripten_generate_pc(stack[offset]) != addr) {
			++offset
		}
		for (var i = 0; i < count && stack[i + offset]; ++i) {
			GROWABLE_HEAP_I32()[buffer + i * 4 >> 2] = _emscripten_generate_pc(stack[i + offset])
		}
		return i
	}
	Module["_emscripten_stack_unwind_buffer"] = _emscripten_stack_unwind_buffer;
	var Fetch = {
		xhrs: [],
		setu64: function(addr, val) {
			GROWABLE_HEAP_U32()[addr >> 2] = val;
			GROWABLE_HEAP_U32()[addr + 4 >> 2] = val / 4294967296 | 0
		},
		openDatabase: function(dbname, dbversion, onsuccess, onerror) {
			try {
				var openRequest = indexedDB.open(dbname, dbversion)
			} catch (e) {
				return onerror(e)
			}
			openRequest.onupgradeneeded = function(event) {
				var db = event.target.result;
				if (db.objectStoreNames.contains("FILES")) {
					db.deleteObjectStore("FILES")
				}
				db.createObjectStore("FILES")
			};
			openRequest.onsuccess = function(event) {
				onsuccess(event.target.result)
			};
			openRequest.onerror = function(error) {
				onerror(error)
			}
		},
		staticInit: function() {
			var isMainThread = true;
			var onsuccess = function(db) {
				Fetch.dbInstance = db;
				if (isMainThread) {
					removeRunDependency("library_fetch_init")
				}
			};
			var onerror = function() {
				Fetch.dbInstance = false;
				if (isMainThread) {
					removeRunDependency("library_fetch_init")
				}
			};
			Fetch.openDatabase("emscripten_filesystem", 1, onsuccess, onerror);
			if (typeof ENVIRONMENT_IS_FETCH_WORKER === "undefined" || !ENVIRONMENT_IS_FETCH_WORKER) addRunDependency("library_fetch_init")
		}
	};
	Module["Fetch"] = Fetch;

	function fetchXHR(fetch, onsuccess, onerror, onprogress, onreadystatechange) {
		var url = GROWABLE_HEAP_U32()[fetch + 8 >> 2];
		if (!url) {
			onerror(fetch, 0, "no url specified!");
			return
		}
		var url_ = UTF8ToString(url);
		var fetch_attr = fetch + 112;
		var requestMethod = UTF8ToString(fetch_attr);
		if (!requestMethod) requestMethod = "GET";
		var userData = GROWABLE_HEAP_U32()[fetch + 4 >> 2];
		var fetchAttributes = GROWABLE_HEAP_U32()[fetch_attr + 52 >> 2];
		var timeoutMsecs = GROWABLE_HEAP_U32()[fetch_attr + 56 >> 2];
		var withCredentials = !!GROWABLE_HEAP_U32()[fetch_attr + 60 >> 2];
		var destinationPath = GROWABLE_HEAP_U32()[fetch_attr + 64 >> 2];
		var userName = GROWABLE_HEAP_U32()[fetch_attr + 68 >> 2];
		var password = GROWABLE_HEAP_U32()[fetch_attr + 72 >> 2];
		var requestHeaders = GROWABLE_HEAP_U32()[fetch_attr + 76 >> 2];
		var overriddenMimeType = GROWABLE_HEAP_U32()[fetch_attr + 80 >> 2];
		var dataPtr = GROWABLE_HEAP_U32()[fetch_attr + 84 >> 2];
		var dataLength = GROWABLE_HEAP_U32()[fetch_attr + 88 >> 2];
		var fetchAttrLoadToMemory = !!(fetchAttributes & 1);
		var fetchAttrStreamData = !!(fetchAttributes & 2);
		var fetchAttrSynchronous = !!(fetchAttributes & 64);
		var userNameStr = userName ? UTF8ToString(userName) : undefined;
		var passwordStr = password ? UTF8ToString(password) : undefined;
		var overriddenMimeTypeStr = overriddenMimeType ? UTF8ToString(overriddenMimeType) : undefined;
		var xhr = new XMLHttpRequest;
		xhr.withCredentials = withCredentials;
		xhr.open(requestMethod, url_, !fetchAttrSynchronous, userNameStr, passwordStr);
		if (!fetchAttrSynchronous) xhr.timeout = timeoutMsecs;
		xhr.url_ = url_;
		xhr.responseType = "arraybuffer";
		if (overriddenMimeType) {
			xhr.overrideMimeType(overriddenMimeTypeStr)
		}
		if (requestHeaders) {
			for (;;) {
				var key = GROWABLE_HEAP_U32()[requestHeaders >> 2];
				if (!key) break;
				var value = GROWABLE_HEAP_U32()[requestHeaders + 4 >> 2];
				if (!value) break;
				requestHeaders += 8;
				var keyStr = UTF8ToString(key);
				var valueStr = UTF8ToString(value);
				xhr.setRequestHeader(keyStr, valueStr)
			}
		}
		Fetch.xhrs.push(xhr);
		var id = Fetch.xhrs.length;
		GROWABLE_HEAP_U32()[fetch + 0 >> 2] = id;
		var data = dataPtr && dataLength ? GROWABLE_HEAP_U8().slice(dataPtr, dataPtr + dataLength) : null;

		function saveResponse(condition) {
			var ptr = 0;
			var ptrLen = 0;
			if (condition) {
				ptrLen = xhr.response ? xhr.response.byteLength : 0;
				ptr = _malloc(ptrLen);
				GROWABLE_HEAP_U8().set(new Uint8Array(xhr.response), ptr)
			}
			GROWABLE_HEAP_U32()[fetch + 12 >> 2] = ptr;
			Fetch.setu64(fetch + 16, ptrLen)
		}
		xhr.onload = function(e) {
			saveResponse(fetchAttrLoadToMemory && !fetchAttrStreamData);
			var len = xhr.response ? xhr.response.byteLength : 0;
			Fetch.setu64(fetch + 24, 0);
			if (len) {
				Fetch.setu64(fetch + 32, len)
			}
			GROWABLE_HEAP_U16()[fetch + 40 >> 1] = xhr.readyState;
			GROWABLE_HEAP_U16()[fetch + 42 >> 1] = xhr.status;
			if (xhr.statusText) stringToUTF8(xhr.statusText, fetch + 44, 64);
			if (xhr.status >= 200 && xhr.status < 300) {
				if (onsuccess) onsuccess(fetch, xhr, e)
			} else {
				if (onerror) onerror(fetch, xhr, e)
			}
		};
		xhr.onerror = function(e) {
			saveResponse(fetchAttrLoadToMemory);
			var status = xhr.status;
			Fetch.setu64(fetch + 24, 0);
			Fetch.setu64(fetch + 32, xhr.response ? xhr.response.byteLength : 0);
			GROWABLE_HEAP_U16()[fetch + 40 >> 1] = xhr.readyState;
			GROWABLE_HEAP_U16()[fetch + 42 >> 1] = status;
			if (onerror) onerror(fetch, xhr, e)
		};
		xhr.ontimeout = function(e) {
			if (onerror) onerror(fetch, xhr, e)
		};
		xhr.onprogress = function(e) {
			var ptrLen = fetchAttrLoadToMemory && fetchAttrStreamData && xhr.response ? xhr.response.byteLength : 0;
			var ptr = 0;
			if (fetchAttrLoadToMemory && fetchAttrStreamData) {
				ptr = _malloc(ptrLen);
				GROWABLE_HEAP_U8().set(new Uint8Array(xhr.response), ptr)
			}
			GROWABLE_HEAP_U32()[fetch + 12 >> 2] = ptr;
			Fetch.setu64(fetch + 16, ptrLen);
			Fetch.setu64(fetch + 24, e.loaded - ptrLen);
			Fetch.setu64(fetch + 32, e.total);
			GROWABLE_HEAP_U16()[fetch + 40 >> 1] = xhr.readyState;
			if (xhr.readyState >= 3 && xhr.status === 0 && e.loaded > 0) xhr.status = 200;
			GROWABLE_HEAP_U16()[fetch + 42 >> 1] = xhr.status;
			if (xhr.statusText) stringToUTF8(xhr.statusText, fetch + 44, 64);
			if (onprogress) onprogress(fetch, xhr, e);
			if (ptr) {
				_free(ptr)
			}
		};
		xhr.onreadystatechange = function(e) {
			GROWABLE_HEAP_U16()[fetch + 40 >> 1] = xhr.readyState;
			if (xhr.readyState >= 2) {
				GROWABLE_HEAP_U16()[fetch + 42 >> 1] = xhr.status
			}
			if (onreadystatechange) onreadystatechange(fetch, xhr, e)
		};
		try {
			xhr.send(data)
		} catch (e) {
			if (onerror) onerror(fetch, xhr, e)
		}
	}
	Module["fetchXHR"] = fetchXHR;

	function fetchCacheData(db, fetch, data, onsuccess, onerror) {
		if (!db) {
			onerror(fetch, 0, "IndexedDB not available!");
			return
		}
		var fetch_attr = fetch + 112;
		var destinationPath = GROWABLE_HEAP_U32()[fetch_attr + 64 >> 2];
		if (!destinationPath) destinationPath = GROWABLE_HEAP_U32()[fetch + 8 >> 2];
		var destinationPathStr = UTF8ToString(destinationPath);
		try {
			var transaction = db.transaction(["FILES"], "readwrite");
			var packages = transaction.objectStore("FILES");
			var putRequest = packages.put(data, destinationPathStr);
			putRequest.onsuccess = function(event) {
				GROWABLE_HEAP_U16()[fetch + 40 >> 1] = 4;
				GROWABLE_HEAP_U16()[fetch + 42 >> 1] = 200;
				stringToUTF8("OK", fetch + 44, 64);
				onsuccess(fetch, 0, destinationPathStr)
			};
			putRequest.onerror = function(error) {
				GROWABLE_HEAP_U16()[fetch + 40 >> 1] = 4;
				GROWABLE_HEAP_U16()[fetch + 42 >> 1] = 413;
				stringToUTF8("Payload Too Large", fetch + 44, 64);
				onerror(fetch, 0, error)
			}
		} catch (e) {
			onerror(fetch, 0, e)
		}
	}
	Module["fetchCacheData"] = fetchCacheData;

	function fetchLoadCachedData(db, fetch, onsuccess, onerror) {
		if (!db) {
			onerror(fetch, 0, "IndexedDB not available!");
			return
		}
		var fetch_attr = fetch + 112;
		var path = GROWABLE_HEAP_U32()[fetch_attr + 64 >> 2];
		if (!path) path = GROWABLE_HEAP_U32()[fetch + 8 >> 2];
		var pathStr = UTF8ToString(path);
		try {
			var transaction = db.transaction(["FILES"], "readonly");
			var packages = transaction.objectStore("FILES");
			var getRequest = packages.get(pathStr);
			getRequest.onsuccess = function(event) {
				if (event.target.result) {
					var value = event.target.result;
					var len = value.byteLength || value.length;
					var ptr = _malloc(len);
					GROWABLE_HEAP_U8().set(new Uint8Array(value), ptr);
					GROWABLE_HEAP_U32()[fetch + 12 >> 2] = ptr;
					Fetch.setu64(fetch + 16, len);
					Fetch.setu64(fetch + 24, 0);
					Fetch.setu64(fetch + 32, len);
					GROWABLE_HEAP_U16()[fetch + 40 >> 1] = 4;
					GROWABLE_HEAP_U16()[fetch + 42 >> 1] = 200;
					stringToUTF8("OK", fetch + 44, 64);
					onsuccess(fetch, 0, value)
				} else {
					GROWABLE_HEAP_U16()[fetch + 40 >> 1] = 4;
					GROWABLE_HEAP_U16()[fetch + 42 >> 1] = 404;
					stringToUTF8("Not Found", fetch + 44, 64);
					onerror(fetch, 0, "no data")
				}
			};
			getRequest.onerror = function(error) {
				GROWABLE_HEAP_U16()[fetch + 40 >> 1] = 4;
				GROWABLE_HEAP_U16()[fetch + 42 >> 1] = 404;
				stringToUTF8("Not Found", fetch + 44, 64);
				onerror(fetch, 0, error)
			}
		} catch (e) {
			onerror(fetch, 0, e)
		}
	}
	Module["fetchLoadCachedData"] = fetchLoadCachedData;

	function fetchDeleteCachedData(db, fetch, onsuccess, onerror) {
		if (!db) {
			onerror(fetch, 0, "IndexedDB not available!");
			return
		}
		var fetch_attr = fetch + 112;
		var path = GROWABLE_HEAP_U32()[fetch_attr + 64 >> 2];
		if (!path) path = GROWABLE_HEAP_U32()[fetch + 8 >> 2];
		var pathStr = UTF8ToString(path);
		try {
			var transaction = db.transaction(["FILES"], "readwrite");
			var packages = transaction.objectStore("FILES");
			var request = packages.delete(pathStr);
			request.onsuccess = function(event) {
				var value = event.target.result;
				GROWABLE_HEAP_U32()[fetch + 12 >> 2] = 0;
				Fetch.setu64(fetch + 16, 0);
				Fetch.setu64(fetch + 24, 0);
				Fetch.setu64(fetch + 32, 0);
				GROWABLE_HEAP_U16()[fetch + 40 >> 1] = 4;
				GROWABLE_HEAP_U16()[fetch + 42 >> 1] = 200;
				stringToUTF8("OK", fetch + 44, 64);
				onsuccess(fetch, 0, value)
			};
			request.onerror = function(error) {
				GROWABLE_HEAP_U16()[fetch + 40 >> 1] = 4;
				GROWABLE_HEAP_U16()[fetch + 42 >> 1] = 404;
				stringToUTF8("Not Found", fetch + 44, 64);
				onerror(fetch, 0, error)
			}
		} catch (e) {
			onerror(fetch, 0, e)
		}
	}
	Module["fetchDeleteCachedData"] = fetchDeleteCachedData;

	function _emscripten_start_fetch(fetch, successcb, errorcb, progresscb, readystatechangecb) {
		runtimeKeepalivePush();
		var fetch_attr = fetch + 112;
		var requestMethod = UTF8ToString(fetch_attr);
		var onsuccess = GROWABLE_HEAP_U32()[fetch_attr + 36 >> 2];
		var onerror = GROWABLE_HEAP_U32()[fetch_attr + 40 >> 2];
		var onprogress = GROWABLE_HEAP_U32()[fetch_attr + 44 >> 2];
		var onreadystatechange = GROWABLE_HEAP_U32()[fetch_attr + 48 >> 2];
		var fetchAttributes = GROWABLE_HEAP_U32()[fetch_attr + 52 >> 2];
		var fetchAttrPersistFile = !!(fetchAttributes & 4);
		var fetchAttrNoDownload = !!(fetchAttributes & 32);
		var fetchAttrReplace = !!(fetchAttributes & 16);
		var fetchAttrSynchronous = !!(fetchAttributes & 64);
		var reportSuccess = function(fetch, xhr, e) {
			runtimeKeepalivePop();
			callUserCallback(function() {
				if (onsuccess) wasmTable.get(onsuccess)(fetch);
				else if (successcb) successcb(fetch)
			}, fetchAttrSynchronous)
		};
		var reportProgress = function(fetch, xhr, e) {
			callUserCallback(function() {
				if (onprogress) wasmTable.get(onprogress)(fetch);
				else if (progresscb) progresscb(fetch)
			}, fetchAttrSynchronous)
		};
		var reportError = function(fetch, xhr, e) {
			runtimeKeepalivePop();
			callUserCallback(function() {
				if (onerror) wasmTable.get(onerror)(fetch);
				else if (errorcb) errorcb(fetch)
			}, fetchAttrSynchronous)
		};
		var reportReadyStateChange = function(fetch, xhr, e) {
			callUserCallback(function() {
				if (onreadystatechange) wasmTable.get(onreadystatechange)(fetch);
				else if (readystatechangecb) readystatechangecb(fetch)
			}, fetchAttrSynchronous)
		};
		var performUncachedXhr = function(fetch, xhr, e) {
			fetchXHR(fetch, reportSuccess, reportError, reportProgress, reportReadyStateChange)
		};
		var cacheResultAndReportSuccess = function(fetch, xhr, e) {
			var storeSuccess = function(fetch, xhr, e) {
				runtimeKeepalivePop();
				callUserCallback(function() {
					if (onsuccess) wasmTable.get(onsuccess)(fetch);
					else if (successcb) successcb(fetch)
				}, fetchAttrSynchronous)
			};
			var storeError = function(fetch, xhr, e) {
				runtimeKeepalivePop();
				callUserCallback(function() {
					if (onsuccess) wasmTable.get(onsuccess)(fetch);
					else if (successcb) successcb(fetch)
				}, fetchAttrSynchronous)
			};
			fetchCacheData(Fetch.dbInstance, fetch, xhr.response, storeSuccess, storeError)
		};
		var performCachedXhr = function(fetch, xhr, e) {
			fetchXHR(fetch, cacheResultAndReportSuccess, reportError, reportProgress, reportReadyStateChange)
		};
		if (requestMethod === "EM_IDB_STORE") {
			var ptr = GROWABLE_HEAP_U32()[fetch_attr + 84 >> 2];
			fetchCacheData(Fetch.dbInstance, fetch, GROWABLE_HEAP_U8().slice(ptr, ptr + GROWABLE_HEAP_U32()[fetch_attr + 88 >> 2]), reportSuccess, reportError)
		} else if (requestMethod === "EM_IDB_DELETE") {
			fetchDeleteCachedData(Fetch.dbInstance, fetch, reportSuccess, reportError)
		} else if (!fetchAttrReplace) {
			fetchLoadCachedData(Fetch.dbInstance, fetch, reportSuccess, fetchAttrNoDownload ? reportError : fetchAttrPersistFile ? performCachedXhr : performUncachedXhr)
		} else if (!fetchAttrNoDownload) {
			fetchXHR(fetch, fetchAttrPersistFile ? cacheResultAndReportSuccess : reportSuccess, reportError, reportProgress, reportReadyStateChange)
		} else {
			return 0
		}
		return fetch
	}
	Module["_emscripten_start_fetch"] = _emscripten_start_fetch;

	function _emscripten_unwind_to_js_event_loop() {
		throw "unwind"
	}
	Module["_emscripten_unwind_to_js_event_loop"] = _emscripten_unwind_to_js_event_loop;

	function __webgl_enable_ANGLE_instanced_arrays(ctx) {
		var ext = ctx.getExtension("ANGLE_instanced_arrays");
		if (ext) {
			ctx["vertexAttribDivisor"] = function(index, divisor) {
				ext["vertexAttribDivisorANGLE"](index, divisor)
			};
			ctx["drawArraysInstanced"] = function(mode, first, count, primcount) {
				ext["drawArraysInstancedANGLE"](mode, first, count, primcount)
			};
			ctx["drawElementsInstanced"] = function(mode, count, type, indices, primcount) {
				ext["drawElementsInstancedANGLE"](mode, count, type, indices, primcount)
			};
			return 1
		}
	}
	Module["__webgl_enable_ANGLE_instanced_arrays"] = __webgl_enable_ANGLE_instanced_arrays;

	function __webgl_enable_OES_vertex_array_object(ctx) {
		var ext = ctx.getExtension("OES_vertex_array_object");
		if (ext) {
			ctx["createVertexArray"] = function() {
				return ext["createVertexArrayOES"]()
			};
			ctx["deleteVertexArray"] = function(vao) {
				ext["deleteVertexArrayOES"](vao)
			};
			ctx["bindVertexArray"] = function(vao) {
				ext["bindVertexArrayOES"](vao)
			};
			ctx["isVertexArray"] = function(vao) {
				return ext["isVertexArrayOES"](vao)
			};
			return 1
		}
	}
	Module["__webgl_enable_OES_vertex_array_object"] = __webgl_enable_OES_vertex_array_object;

	function __webgl_enable_WEBGL_draw_buffers(ctx) {
		var ext = ctx.getExtension("WEBGL_draw_buffers");
		if (ext) {
			ctx["drawBuffers"] = function(n, bufs) {
				ext["drawBuffersWEBGL"](n, bufs)
			};
			return 1
		}
	}
	Module["__webgl_enable_WEBGL_draw_buffers"] = __webgl_enable_WEBGL_draw_buffers;

	function __webgl_enable_WEBGL_multi_draw(ctx) {
		return !!(ctx.multiDrawWebgl = ctx.getExtension("WEBGL_multi_draw"))
	}
	Module["__webgl_enable_WEBGL_multi_draw"] = __webgl_enable_WEBGL_multi_draw;
	var GL = {
		counter: 1,
		buffers: [],
		programs: [],
		framebuffers: [],
		renderbuffers: [],
		textures: [],
		shaders: [],
		vaos: [],
		contexts: {},
		offscreenCanvases: {},
		queries: [],
		stringCache: {},
		unpackAlignment: 4,
		recordError: function recordError(errorCode) {
			if (!GL.lastError) {
				GL.lastError = errorCode
			}
		},
		getNewId: function(table) {
			var ret = GL.counter++;
			for (var i = table.length; i < ret; i++) {
				table[i] = null
			}
			return ret
		},
		getSource: function(shader, count, string, length) {
			var source = "";
			for (var i = 0; i < count; ++i) {
				var len = length ? GROWABLE_HEAP_I32()[length + i * 4 >> 2] : -1;
				source += UTF8ToString(GROWABLE_HEAP_I32()[string + i * 4 >> 2], len < 0 ? undefined : len)
			}
			return source
		},
		createContext: function(canvas, webGLContextAttributes) {
			if (!canvas.getContextSafariWebGL2Fixed) {
				canvas.getContextSafariWebGL2Fixed = canvas.getContext;
				canvas.getContext = function(ver, attrs) {
					var gl = canvas.getContextSafariWebGL2Fixed(ver, attrs);
					return ver == "webgl" == gl instanceof WebGLRenderingContext ? gl : null
				}
			}
			var ctx = canvas.getContext("webgl", webGLContextAttributes);
			if (!ctx) return 0;
			var handle = GL.registerContext(ctx, webGLContextAttributes);
			return handle
		},
		registerContext: function(ctx, webGLContextAttributes) {
			var handle = _malloc(8);
			GROWABLE_HEAP_I32()[handle + 4 >> 2] = _pthread_self();
			var context = {
				handle: handle,
				attributes: webGLContextAttributes,
				version: webGLContextAttributes.majorVersion,
				GLctx: ctx
			};
			if (ctx.canvas) ctx.canvas.GLctxObject = context;
			GL.contexts[handle] = context;
			if (typeof webGLContextAttributes.enableExtensionsByDefault === "undefined" || webGLContextAttributes.enableExtensionsByDefault) {
				GL.initExtensions(context)
			}
			return handle
		},
		makeContextCurrent: function(contextHandle) {
			GL.currentContext = GL.contexts[contextHandle];
			Module.ctx = GLctx = GL.currentContext && GL.currentContext.GLctx;
			return !(contextHandle && !GLctx)
		},
		getContext: function(contextHandle) {
			return GL.contexts[contextHandle]
		},
		deleteContext: function(contextHandle) {
			if (GL.currentContext === GL.contexts[contextHandle]) GL.currentContext = null;
			if (typeof JSEvents === "object") JSEvents.removeAllHandlersOnTarget(GL.contexts[contextHandle].GLctx.canvas);
			if (GL.contexts[contextHandle] && GL.contexts[contextHandle].GLctx.canvas) GL.contexts[contextHandle].GLctx.canvas.GLctxObject = undefined;
			_free(GL.contexts[contextHandle].handle);
			GL.contexts[contextHandle] = null
		},
		initExtensions: function(context) {
			if (!context) context = GL.currentContext;
			if (context.initExtensionsDone) return;
			context.initExtensionsDone = true;
			var GLctx = context.GLctx;
			__webgl_enable_ANGLE_instanced_arrays(GLctx);
			__webgl_enable_OES_vertex_array_object(GLctx);
			__webgl_enable_WEBGL_draw_buffers(GLctx); {
				GLctx.disjointTimerQueryExt = GLctx.getExtension("EXT_disjoint_timer_query")
			}
			__webgl_enable_WEBGL_multi_draw(GLctx);
			var exts = GLctx.getSupportedExtensions() || [];
			exts.forEach(function(ext) {
				if (!ext.includes("lose_context") && !ext.includes("debug")) {
					GLctx.getExtension(ext)
				}
			})
		}
	};
	Module["GL"] = GL;
	var __emscripten_webgl_power_preferences = ["default", "low-power", "high-performance"];
	Module["__emscripten_webgl_power_preferences"] = __emscripten_webgl_power_preferences;

	function _emscripten_webgl_do_create_context(target, attributes) {
		var a = attributes >> 2;
		var powerPreference = GROWABLE_HEAP_I32()[a + (24 >> 2)];
		var contextAttributes = {
			"alpha": !!GROWABLE_HEAP_I32()[a + (0 >> 2)],
			"depth": !!GROWABLE_HEAP_I32()[a + (4 >> 2)],
			"stencil": !!GROWABLE_HEAP_I32()[a + (8 >> 2)],
			"antialias": !!GROWABLE_HEAP_I32()[a + (12 >> 2)],
			"premultipliedAlpha": !!GROWABLE_HEAP_I32()[a + (16 >> 2)],
			"preserveDrawingBuffer": !!GROWABLE_HEAP_I32()[a + (20 >> 2)],
			"powerPreference": __emscripten_webgl_power_preferences[powerPreference],
			"failIfMajorPerformanceCaveat": !!GROWABLE_HEAP_I32()[a + (28 >> 2)],
			majorVersion: GROWABLE_HEAP_I32()[a + (32 >> 2)],
			minorVersion: GROWABLE_HEAP_I32()[a + (36 >> 2)],
			enableExtensionsByDefault: GROWABLE_HEAP_I32()[a + (40 >> 2)],
			explicitSwapControl: GROWABLE_HEAP_I32()[a + (44 >> 2)],
			proxyContextToMainThread: GROWABLE_HEAP_I32()[a + (48 >> 2)],
			renderViaOffscreenBackBuffer: GROWABLE_HEAP_I32()[a + (52 >> 2)]
		};
		var canvas = findCanvasEventTarget(target);
		if (!canvas) {
			return 0
		}
		if (contextAttributes.explicitSwapControl) {
			return 0
		}
		var contextHandle = GL.createContext(canvas, contextAttributes);
		return contextHandle
	}
	Module["_emscripten_webgl_do_create_context"] = _emscripten_webgl_do_create_context;

	function _emscripten_webgl_create_context(a0, a1) {
		return _emscripten_webgl_do_create_context(a0, a1)
	}
	Module["_emscripten_webgl_create_context"] = _emscripten_webgl_create_context;
	var ENV = {};
	Module["ENV"] = ENV;

	function getExecutableName() {
		return thisProgram || "./this.program"
	}
	Module["getExecutableName"] = getExecutableName;

	function getEnvStrings() {
		if (!getEnvStrings.strings) {
			var lang = (typeof navigator === "object" && navigator.languages && navigator.languages[0] || "C").replace("-", "_") + ".UTF-8";
			var env = {
				"USER": "web_user",
				"LOGNAME": "web_user",
				"PATH": "/",
				"PWD": "/",
				"HOME": "/home/web_user",
				"LANG": lang,
				"_": getExecutableName()
			};
			for (var x in ENV) {
				if (ENV[x] === undefined) delete env[x];
				else env[x] = ENV[x]
			}
			var strings = [];
			for (var x in env) {
				strings.push(x + "=" + env[x])
			}
			getEnvStrings.strings = strings
		}
		return getEnvStrings.strings
	}
	Module["getEnvStrings"] = getEnvStrings;

	function _environ_get(__environ, environ_buf) {
		if (ENVIRONMENT_IS_PTHREAD) return _emscripten_proxy_to_main_thread_js(7, 1, __environ, environ_buf);
		var bufSize = 0;
		getEnvStrings().forEach(function(string, i) {
			var ptr = environ_buf + bufSize;
			GROWABLE_HEAP_I32()[__environ + i * 4 >> 2] = ptr;
			writeAsciiToMemory(string, ptr);
			bufSize += string.length + 1
		});
		return 0
	}
	Module["_environ_get"] = _environ_get;

	function _environ_sizes_get(penviron_count, penviron_buf_size) {
		if (ENVIRONMENT_IS_PTHREAD) return _emscripten_proxy_to_main_thread_js(8, 1, penviron_count, penviron_buf_size);
		var strings = getEnvStrings();
		GROWABLE_HEAP_I32()[penviron_count >> 2] = strings.length;
		var bufSize = 0;
		strings.forEach(function(string) {
			bufSize += string.length + 1
		});
		GROWABLE_HEAP_I32()[penviron_buf_size >> 2] = bufSize;
		return 0
	}
	Module["_environ_sizes_get"] = _environ_sizes_get;

	function _fd_close(fd) {
		if (ENVIRONMENT_IS_PTHREAD) return _emscripten_proxy_to_main_thread_js(9, 1, fd);
		try {
			var stream = SYSCALLS.getStreamFromFD(fd);
			FS.close(stream);
			return 0
		} catch (e) {
			if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
			return e.errno
		}
	}
	Module["_fd_close"] = _fd_close;

	function _fd_read(fd, iov, iovcnt, pnum) {
		if (ENVIRONMENT_IS_PTHREAD) return _emscripten_proxy_to_main_thread_js(10, 1, fd, iov, iovcnt, pnum);
		try {
			var stream = SYSCALLS.getStreamFromFD(fd);
			var num = SYSCALLS.doReadv(stream, iov, iovcnt);
			GROWABLE_HEAP_I32()[pnum >> 2] = num;
			return 0
		} catch (e) {
			if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
			return e.errno
		}
	}
	Module["_fd_read"] = _fd_read;

	function _fd_seek(fd, offset_low, offset_high, whence, newOffset) {
		if (ENVIRONMENT_IS_PTHREAD) return _emscripten_proxy_to_main_thread_js(11, 1, fd, offset_low, offset_high, whence, newOffset);
		try {
			var stream = SYSCALLS.getStreamFromFD(fd);
			var HIGH_OFFSET = 4294967296;
			var offset = offset_high * HIGH_OFFSET + (offset_low >>> 0);
			var DOUBLE_LIMIT = 9007199254740992;
			if (offset <= -DOUBLE_LIMIT || offset >= DOUBLE_LIMIT) {
				return -61
			}
			FS.llseek(stream, offset, whence);
			tempI64 = [stream.position >>> 0, (tempDouble = stream.position, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math.min(+Math.floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], GROWABLE_HEAP_I32()[newOffset >> 2] = tempI64[0], GROWABLE_HEAP_I32()[newOffset + 4 >> 2] = tempI64[1];
			if (stream.getdents && offset === 0 && whence === 0) stream.getdents = null;
			return 0
		} catch (e) {
			if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
			return e.errno
		}
	}
	Module["_fd_seek"] = _fd_seek;

	function _fd_write(fd, iov, iovcnt, pnum) {
		if (ENVIRONMENT_IS_PTHREAD) return _emscripten_proxy_to_main_thread_js(12, 1, fd, iov, iovcnt, pnum);
		try {
			var stream = SYSCALLS.getStreamFromFD(fd);
			var num = SYSCALLS.doWritev(stream, iov, iovcnt);
			GROWABLE_HEAP_I32()[pnum >> 2] = num;
			return 0
		} catch (e) {
			if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
			return e.errno
		}
	}
	Module["_fd_write"] = _fd_write;

	function _getentropy(buffer, size) {
		if (!_getentropy.randomDevice) {
			_getentropy.randomDevice = getRandomDevice()
		}
		for (var i = 0; i < size; i++) {
			GROWABLE_HEAP_I8()[buffer + i >> 0] = _getentropy.randomDevice()
		}
		return 0
	}
	Module["_getentropy"] = _getentropy;

	function _setTempRet0(val) {
		setTempRet0(val)
	}
	Module["_setTempRet0"] = _setTempRet0;

	function __isLeapYear(year) {
		return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)
	}
	Module["__isLeapYear"] = __isLeapYear;

	function __arraySum(array, index) {
		var sum = 0;
		for (var i = 0; i <= index; sum += array[i++]) {}
		return sum
	}
	Module["__arraySum"] = __arraySum;
	var __MONTH_DAYS_LEAP = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	Module["__MONTH_DAYS_LEAP"] = __MONTH_DAYS_LEAP;
	var __MONTH_DAYS_REGULAR = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	Module["__MONTH_DAYS_REGULAR"] = __MONTH_DAYS_REGULAR;

	function __addDays(date, days) {
		var newDate = new Date(date.getTime());
		while (days > 0) {
			var leap = __isLeapYear(newDate.getFullYear());
			var currentMonth = newDate.getMonth();
			var daysInCurrentMonth = (leap ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR)[currentMonth];
			if (days > daysInCurrentMonth - newDate.getDate()) {
				days -= daysInCurrentMonth - newDate.getDate() + 1;
				newDate.setDate(1);
				if (currentMonth < 11) {
					newDate.setMonth(currentMonth + 1)
				} else {
					newDate.setMonth(0);
					newDate.setFullYear(newDate.getFullYear() + 1)
				}
			} else {
				newDate.setDate(newDate.getDate() + days);
				return newDate
			}
		}
		return newDate
	}
	Module["__addDays"] = __addDays;

	function _strftime(s, maxsize, format, tm) {
		var tm_zone = GROWABLE_HEAP_I32()[tm + 40 >> 2];
		var date = {
			tm_sec: GROWABLE_HEAP_I32()[tm >> 2],
			tm_min: GROWABLE_HEAP_I32()[tm + 4 >> 2],
			tm_hour: GROWABLE_HEAP_I32()[tm + 8 >> 2],
			tm_mday: GROWABLE_HEAP_I32()[tm + 12 >> 2],
			tm_mon: GROWABLE_HEAP_I32()[tm + 16 >> 2],
			tm_year: GROWABLE_HEAP_I32()[tm + 20 >> 2],
			tm_wday: GROWABLE_HEAP_I32()[tm + 24 >> 2],
			tm_yday: GROWABLE_HEAP_I32()[tm + 28 >> 2],
			tm_isdst: GROWABLE_HEAP_I32()[tm + 32 >> 2],
			tm_gmtoff: GROWABLE_HEAP_I32()[tm + 36 >> 2],
			tm_zone: tm_zone ? UTF8ToString(tm_zone) : ""
		};
		var pattern = UTF8ToString(format);
		var EXPANSION_RULES_1 = {
			"%c": "%a %b %d %H:%M:%S %Y",
			"%D": "%m/%d/%y",
			"%F": "%Y-%m-%d",
			"%h": "%b",
			"%r": "%I:%M:%S %p",
			"%R": "%H:%M",
			"%T": "%H:%M:%S",
			"%x": "%m/%d/%y",
			"%X": "%H:%M:%S",
			"%Ec": "%c",
			"%EC": "%C",
			"%Ex": "%m/%d/%y",
			"%EX": "%H:%M:%S",
			"%Ey": "%y",
			"%EY": "%Y",
			"%Od": "%d",
			"%Oe": "%e",
			"%OH": "%H",
			"%OI": "%I",
			"%Om": "%m",
			"%OM": "%M",
			"%OS": "%S",
			"%Ou": "%u",
			"%OU": "%U",
			"%OV": "%V",
			"%Ow": "%w",
			"%OW": "%W",
			"%Oy": "%y"
		};
		for (var rule in EXPANSION_RULES_1) {
			pattern = pattern.replace(new RegExp(rule, "g"), EXPANSION_RULES_1[rule])
		}
		var WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
		var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

		function leadingSomething(value, digits, character) {
			var str = typeof value === "number" ? value.toString() : value || "";
			while (str.length < digits) {
				str = character[0] + str
			}
			return str
		}

		function leadingNulls(value, digits) {
			return leadingSomething(value, digits, "0")
		}

		function compareByDay(date1, date2) {
			function sgn(value) {
				return value < 0 ? -1 : value > 0 ? 1 : 0
			}
			var compare;
			if ((compare = sgn(date1.getFullYear() - date2.getFullYear())) === 0) {
				if ((compare = sgn(date1.getMonth() - date2.getMonth())) === 0) {
					compare = sgn(date1.getDate() - date2.getDate())
				}
			}
			return compare
		}

		function getFirstWeekStartDate(janFourth) {
			switch (janFourth.getDay()) {
				case 0:
					return new Date(janFourth.getFullYear() - 1, 11, 29);
				case 1:
					return janFourth;
				case 2:
					return new Date(janFourth.getFullYear(), 0, 3);
				case 3:
					return new Date(janFourth.getFullYear(), 0, 2);
				case 4:
					return new Date(janFourth.getFullYear(), 0, 1);
				case 5:
					return new Date(janFourth.getFullYear() - 1, 11, 31);
				case 6:
					return new Date(janFourth.getFullYear() - 1, 11, 30)
			}
		}

		function getWeekBasedYear(date) {
			var thisDate = __addDays(new Date(date.tm_year + 1900, 0, 1), date.tm_yday);
			var janFourthThisYear = new Date(thisDate.getFullYear(), 0, 4);
			var janFourthNextYear = new Date(thisDate.getFullYear() + 1, 0, 4);
			var firstWeekStartThisYear = getFirstWeekStartDate(janFourthThisYear);
			var firstWeekStartNextYear = getFirstWeekStartDate(janFourthNextYear);
			if (compareByDay(firstWeekStartThisYear, thisDate) <= 0) {
				if (compareByDay(firstWeekStartNextYear, thisDate) <= 0) {
					return thisDate.getFullYear() + 1
				} else {
					return thisDate.getFullYear()
				}
			} else {
				return thisDate.getFullYear() - 1
			}
		}
		var EXPANSION_RULES_2 = {
			"%a": function(date) {
				return WEEKDAYS[date.tm_wday].substring(0, 3)
			},
			"%A": function(date) {
				return WEEKDAYS[date.tm_wday]
			},
			"%b": function(date) {
				return MONTHS[date.tm_mon].substring(0, 3)
			},
			"%B": function(date) {
				return MONTHS[date.tm_mon]
			},
			"%C": function(date) {
				var year = date.tm_year + 1900;
				return leadingNulls(year / 100 | 0, 2)
			},
			"%d": function(date) {
				return leadingNulls(date.tm_mday, 2)
			},
			"%e": function(date) {
				return leadingSomething(date.tm_mday, 2, " ")
			},
			"%g": function(date) {
				return getWeekBasedYear(date).toString().substring(2)
			},
			"%G": function(date) {
				return getWeekBasedYear(date)
			},
			"%H": function(date) {
				return leadingNulls(date.tm_hour, 2)
			},
			"%I": function(date) {
				var twelveHour = date.tm_hour;
				if (twelveHour == 0) twelveHour = 12;
				else if (twelveHour > 12) twelveHour -= 12;
				return leadingNulls(twelveHour, 2)
			},
			"%j": function(date) {
				return leadingNulls(date.tm_mday + __arraySum(__isLeapYear(date.tm_year + 1900) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, date.tm_mon - 1), 3)
			},
			"%m": function(date) {
				return leadingNulls(date.tm_mon + 1, 2)
			},
			"%M": function(date) {
				return leadingNulls(date.tm_min, 2)
			},
			"%n": function() {
				return "\n"
			},
			"%p": function(date) {
				if (date.tm_hour >= 0 && date.tm_hour < 12) {
					return "AM"
				} else {
					return "PM"
				}
			},
			"%S": function(date) {
				return leadingNulls(date.tm_sec, 2)
			},
			"%t": function() {
				return "\t"
			},
			"%u": function(date) {
				return date.tm_wday || 7
			},
			"%U": function(date) {
				var janFirst = new Date(date.tm_year + 1900, 0, 1);
				var firstSunday = janFirst.getDay() === 0 ? janFirst : __addDays(janFirst, 7 - janFirst.getDay());
				var endDate = new Date(date.tm_year + 1900, date.tm_mon, date.tm_mday);
				if (compareByDay(firstSunday, endDate) < 0) {
					var februaryFirstUntilEndMonth = __arraySum(__isLeapYear(endDate.getFullYear()) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, endDate.getMonth() - 1) - 31;
					var firstSundayUntilEndJanuary = 31 - firstSunday.getDate();
					var days = firstSundayUntilEndJanuary + februaryFirstUntilEndMonth + endDate.getDate();
					return leadingNulls(Math.ceil(days / 7), 2)
				}
				return compareByDay(firstSunday, janFirst) === 0 ? "01" : "00"
			},
			"%V": function(date) {
				var janFourthThisYear = new Date(date.tm_year + 1900, 0, 4);
				var janFourthNextYear = new Date(date.tm_year + 1901, 0, 4);
				var firstWeekStartThisYear = getFirstWeekStartDate(janFourthThisYear);
				var firstWeekStartNextYear = getFirstWeekStartDate(janFourthNextYear);
				var endDate = __addDays(new Date(date.tm_year + 1900, 0, 1), date.tm_yday);
				if (compareByDay(endDate, firstWeekStartThisYear) < 0) {
					return "53"
				}
				if (compareByDay(firstWeekStartNextYear, endDate) <= 0) {
					return "01"
				}
				var daysDifference;
				if (firstWeekStartThisYear.getFullYear() < date.tm_year + 1900) {
					daysDifference = date.tm_yday + 32 - firstWeekStartThisYear.getDate()
				} else {
					daysDifference = date.tm_yday + 1 - firstWeekStartThisYear.getDate()
				}
				return leadingNulls(Math.ceil(daysDifference / 7), 2)
			},
			"%w": function(date) {
				return date.tm_wday
			},
			"%W": function(date) {
				var janFirst = new Date(date.tm_year, 0, 1);
				var firstMonday = janFirst.getDay() === 1 ? janFirst : __addDays(janFirst, janFirst.getDay() === 0 ? 1 : 7 - janFirst.getDay() + 1);
				var endDate = new Date(date.tm_year + 1900, date.tm_mon, date.tm_mday);
				if (compareByDay(firstMonday, endDate) < 0) {
					var februaryFirstUntilEndMonth = __arraySum(__isLeapYear(endDate.getFullYear()) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, endDate.getMonth() - 1) - 31;
					var firstMondayUntilEndJanuary = 31 - firstMonday.getDate();
					var days = firstMondayUntilEndJanuary + februaryFirstUntilEndMonth + endDate.getDate();
					return leadingNulls(Math.ceil(days / 7), 2)
				}
				return compareByDay(firstMonday, janFirst) === 0 ? "01" : "00"
			},
			"%y": function(date) {
				return (date.tm_year + 1900).toString().substring(2)
			},
			"%Y": function(date) {
				return date.tm_year + 1900
			},
			"%z": function(date) {
				var off = date.tm_gmtoff;
				var ahead = off >= 0;
				off = Math.abs(off) / 60;
				off = off / 60 * 100 + off % 60;
				return (ahead ? "+" : "-") + String("0000" + off).slice(-4)
			},
			"%Z": function(date) {
				return date.tm_zone
			},
			"%%": function() {
				return "%"
			}
		};
		for (var rule in EXPANSION_RULES_2) {
			if (pattern.includes(rule)) {
				pattern = pattern.replace(new RegExp(rule, "g"), EXPANSION_RULES_2[rule](date))
			}
		}
		var bytes = intArrayFromString(pattern, false);
		if (bytes.length > maxsize) {
			return 0
		}
		writeArrayToMemory(bytes, s);
		return bytes.length - 1
	}
	Module["_strftime"] = _strftime;

	function _strftime_l(s, maxsize, format, tm) {
		return _strftime(s, maxsize, format, tm)
	}
	Module["_strftime_l"] = _strftime_l;
	if (!ENVIRONMENT_IS_PTHREAD) PThread.initMainThreadBlock();
	var FSNode = function(parent, name, mode, rdev) {
		if (!parent) {
			parent = this
		}
		this.parent = parent;
		this.mount = parent.mount;
		this.mounted = null;
		this.id = FS.nextInode++;
		this.name = name;
		this.mode = mode;
		this.node_ops = {};
		this.stream_ops = {};
		this.rdev = rdev
	};
	var readMode = 292 | 73;
	var writeMode = 146;
	Object.defineProperties(FSNode.prototype, {
		read: {
			get: function() {
				return (this.mode & readMode) === readMode
			},
			set: function(val) {
				val ? this.mode |= readMode : this.mode &= ~readMode
			}
		},
		write: {
			get: function() {
				return (this.mode & writeMode) === writeMode
			},
			set: function(val) {
				val ? this.mode |= writeMode : this.mode &= ~writeMode
			}
		},
		isFolder: {
			get: function() {
				return FS.isDir(this.mode)
			}
		},
		isDevice: {
			get: function() {
				return FS.isChrdev(this.mode)
			}
		}
	});
	FS.FSNode = FSNode;
	FS.staticInit();
	embind_init_charCodes();
	BindingError = Module["BindingError"] = extendError(Error, "BindingError");
	InternalError = Module["InternalError"] = extendError(Error, "InternalError");
	init_emval();
	UnboundTypeError = Module["UnboundTypeError"] = extendError(Error, "UnboundTypeError");
	if (!ENVIRONMENT_IS_PTHREAD) Fetch.staticInit();
	var GLctx;
	var proxiedFunctionTable = [null, exitOnMainThread, _atexit, ___sys_mmap2, ___sys_munmap, ___sys_open, _emscripten_set_canvas_element_size_main_thread, _environ_get, _environ_sizes_get, _fd_close, _fd_read, _fd_seek, _fd_write];

	function intArrayFromString(stringy, dontAddNull, length) {
		var len = length > 0 ? length : lengthBytesUTF8(stringy) + 1;
		var u8array = new Array(len);
		var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
		if (dontAddNull) u8array.length = numBytesWritten;
		return u8array
	}
	var asmLibraryArg = {
		"g": ___assert_fail,
		"K": ___clock_gettime,
		"Y": ___cxa_thread_atexit,
		"R": ___emscripten_init_main_thread_js,
		"t": ___pthread_create_js,
		"Q": ___pthread_detached_exit,
		"X": ___pthread_exit_run_handlers,
		"O": ___pthread_join_js,
		"J": ___sys_mmap2,
		"I": ___sys_munmap,
		"N": ___sys_open,
		"F": __dlopen_js,
		"E": __dlsym_js,
		"A": __embind_register_bigint,
		"_": __embind_register_bool,
		"Z": __embind_register_emval,
		"u": __embind_register_float,
		"l": __embind_register_function,
		"h": __embind_register_integer,
		"e": __embind_register_memory_view,
		"v": __embind_register_std_string,
		"n": __embind_register_std_wstring,
		"$": __embind_register_void,
		"aa": __emscripten_fetch_free,
		"W": __emscripten_notify_thread_queue,
		"b": _abort,
		"ca": _clock_gettime,
		"w": _emscripten_asm_const_int,
		"L": _emscripten_check_blocking_allowed,
		"k": _emscripten_conditional_set_current_thread_status,
		"f": _emscripten_futex_wait,
		"d": _emscripten_futex_wake,
		"M": _emscripten_get_heap_max,
		"i": _emscripten_get_now,
		"B": _emscripten_memcpy_big,
		"p": _emscripten_num_logical_cores,
		"T": _emscripten_receive_on_main_thread_js,
		"C": _emscripten_resize_heap,
		"U": _emscripten_set_canvas_element_size,
		"s": _emscripten_set_current_thread_status,
		"S": _emscripten_set_timeout,
		"y": _emscripten_stack_snapshot,
		"x": _emscripten_stack_unwind_buffer,
		"ba": _emscripten_start_fetch,
		"P": _emscripten_unwind_to_js_event_loop,
		"V": _emscripten_webgl_create_context,
		"G": _environ_get,
		"H": _environ_sizes_get,
		"c": _exit,
		"q": _fd_close,
		"o": _fd_read,
		"z": _fd_seek,
		"m": _fd_write,
		"r": _getentropy,
		"a": wasmMemory || Module["wasmMemory"],
		"j": _setTempRet0,
		"D": _strftime_l
	};
	var asm = createWasm();
	var ___wasm_call_ctors = Module["___wasm_call_ctors"] = function() {
		return (___wasm_call_ctors = Module["___wasm_call_ctors"] = Module["asm"]["da"]).apply(null, arguments)
	};
	var _main = Module["_main"] = function() {
		return (_main = Module["_main"] = Module["asm"]["ea"]).apply(null, arguments)
	};
	var ___errno_location = Module["___errno_location"] = function() {
		return (___errno_location = Module["___errno_location"] = Module["asm"]["ga"]).apply(null, arguments)
	};
	var _free = Module["_free"] = function() {
		return (_free = Module["_free"] = Module["asm"]["ha"]).apply(null, arguments)
	};
	var _malloc = Module["_malloc"] = function() {
		return (_malloc = Module["_malloc"] = Module["asm"]["ia"]).apply(null, arguments)
	};
	var _pthread_self = Module["_pthread_self"] = function() {
		return (_pthread_self = Module["_pthread_self"] = Module["asm"]["ja"]).apply(null, arguments)
	};
	var _emscripten_tls_init = Module["_emscripten_tls_init"] = function() {
		return (_emscripten_tls_init = Module["_emscripten_tls_init"] = Module["asm"]["ka"]).apply(null, arguments)
	};
	var ___getTypeName = Module["___getTypeName"] = function() {
		return (___getTypeName = Module["___getTypeName"] = Module["asm"]["la"]).apply(null, arguments)
	};
	var ___embind_register_native_and_builtin_types = Module["___embind_register_native_and_builtin_types"] = function() {
		return (___embind_register_native_and_builtin_types = Module["___embind_register_native_and_builtin_types"] = Module["asm"]["ma"]).apply(null, arguments)
	};
	var _emscripten_current_thread_process_queued_calls = Module["_emscripten_current_thread_process_queued_calls"] = function() {
		return (_emscripten_current_thread_process_queued_calls = Module["_emscripten_current_thread_process_queued_calls"] = Module["asm"]["na"]).apply(null, arguments)
	};
	var _emscripten_main_browser_thread_id = Module["_emscripten_main_browser_thread_id"] = function() {
		return (_emscripten_main_browser_thread_id = Module["_emscripten_main_browser_thread_id"] = Module["asm"]["oa"]).apply(null, arguments)
	};
	var _emscripten_sync_run_in_main_thread_2 = Module["_emscripten_sync_run_in_main_thread_2"] = function() {
		return (_emscripten_sync_run_in_main_thread_2 = Module["_emscripten_sync_run_in_main_thread_2"] = Module["asm"]["pa"]).apply(null, arguments)
	};
	var _emscripten_sync_run_in_main_thread_4 = Module["_emscripten_sync_run_in_main_thread_4"] = function() {
		return (_emscripten_sync_run_in_main_thread_4 = Module["_emscripten_sync_run_in_main_thread_4"] = Module["asm"]["qa"]).apply(null, arguments)
	};
	var _emscripten_main_thread_process_queued_calls = Module["_emscripten_main_thread_process_queued_calls"] = function() {
		return (_emscripten_main_thread_process_queued_calls = Module["_emscripten_main_thread_process_queued_calls"] = Module["asm"]["ra"]).apply(null, arguments)
	};
	var _emscripten_run_in_main_runtime_thread_js = Module["_emscripten_run_in_main_runtime_thread_js"] = function() {
		return (_emscripten_run_in_main_runtime_thread_js = Module["_emscripten_run_in_main_runtime_thread_js"] = Module["asm"]["sa"]).apply(null, arguments)
	};
	var __emscripten_call_on_thread = Module["__emscripten_call_on_thread"] = function() {
		return (__emscripten_call_on_thread = Module["__emscripten_call_on_thread"] = Module["asm"]["ta"]).apply(null, arguments)
	};
	var ___emscripten_init_main_thread = Module["___emscripten_init_main_thread"] = function() {
		return (___emscripten_init_main_thread = Module["___emscripten_init_main_thread"] = Module["asm"]["ua"]).apply(null, arguments)
	};
	var __emscripten_thread_exit = Module["__emscripten_thread_exit"] = function() {
		return (__emscripten_thread_exit = Module["__emscripten_thread_exit"] = Module["asm"]["va"]).apply(null, arguments)
	};
	var __emscripten_thread_init = Module["__emscripten_thread_init"] = function() {
		return (__emscripten_thread_init = Module["__emscripten_thread_init"] = Module["asm"]["wa"]).apply(null, arguments)
	};
	var _pthread_testcancel = Module["_pthread_testcancel"] = function() {
		return (_pthread_testcancel = Module["_pthread_testcancel"] = Module["asm"]["xa"]).apply(null, arguments)
	};
	var _emscripten_get_global_libc = Module["_emscripten_get_global_libc"] = function() {
		return (_emscripten_get_global_libc = Module["_emscripten_get_global_libc"] = Module["asm"]["ya"]).apply(null, arguments)
	};
	var ___dl_seterr = Module["___dl_seterr"] = function() {
		return (___dl_seterr = Module["___dl_seterr"] = Module["asm"]["za"]).apply(null, arguments)
	};
	var __get_tzname = Module["__get_tzname"] = function() {
		return (__get_tzname = Module["__get_tzname"] = Module["asm"]["Aa"]).apply(null, arguments)
	};
	var __get_daylight = Module["__get_daylight"] = function() {
		return (__get_daylight = Module["__get_daylight"] = Module["asm"]["Ba"]).apply(null, arguments)
	};
	var __get_timezone = Module["__get_timezone"] = function() {
		return (__get_timezone = Module["__get_timezone"] = Module["asm"]["Ca"]).apply(null, arguments)
	};
	var stackSave = Module["stackSave"] = function() {
		return (stackSave = Module["stackSave"] = Module["asm"]["Da"]).apply(null, arguments)
	};
	var stackRestore = Module["stackRestore"] = function() {
		return (stackRestore = Module["stackRestore"] = Module["asm"]["Ea"]).apply(null, arguments)
	};
	var stackAlloc = Module["stackAlloc"] = function() {
		return (stackAlloc = Module["stackAlloc"] = Module["asm"]["Fa"]).apply(null, arguments)
	};
	var _emscripten_stack_set_limits = Module["_emscripten_stack_set_limits"] = function() {
		return (_emscripten_stack_set_limits = Module["_emscripten_stack_set_limits"] = Module["asm"]["Ga"]).apply(null, arguments)
	};
	var _memalign = Module["_memalign"] = function() {
		return (_memalign = Module["_memalign"] = Module["asm"]["Ha"]).apply(null, arguments)
	};
	var dynCall_jii = Module["dynCall_jii"] = function() {
		return (dynCall_jii = Module["dynCall_jii"] = Module["asm"]["Ia"]).apply(null, arguments)
	};
	var dynCall_jjj = Module["dynCall_jjj"] = function() {
		return (dynCall_jjj = Module["dynCall_jjj"] = Module["asm"]["Ja"]).apply(null, arguments)
	};
	var dynCall_jiii = Module["dynCall_jiii"] = function() {
		return (dynCall_jiii = Module["dynCall_jiii"] = Module["asm"]["Ka"]).apply(null, arguments)
	};
	var dynCall_iiiijj = Module["dynCall_iiiijj"] = function() {
		return (dynCall_iiiijj = Module["dynCall_iiiijj"] = Module["asm"]["La"]).apply(null, arguments)
	};
	var dynCall_viijj = Module["dynCall_viijj"] = function() {
		return (dynCall_viijj = Module["dynCall_viijj"] = Module["asm"]["Ma"]).apply(null, arguments)
	};
	var dynCall_viiijjjj = Module["dynCall_viiijjjj"] = function() {
		return (dynCall_viiijjjj = Module["dynCall_viiijjjj"] = Module["asm"]["Na"]).apply(null, arguments)
	};
	var dynCall_viji = Module["dynCall_viji"] = function() {
		return (dynCall_viji = Module["dynCall_viji"] = Module["asm"]["Oa"]).apply(null, arguments)
	};
	var dynCall_ji = Module["dynCall_ji"] = function() {
		return (dynCall_ji = Module["dynCall_ji"] = Module["asm"]["Pa"]).apply(null, arguments)
	};
	var dynCall_vj = Module["dynCall_vj"] = function() {
		return (dynCall_vj = Module["dynCall_vj"] = Module["asm"]["Qa"]).apply(null, arguments)
	};
	var dynCall_viij = Module["dynCall_viij"] = function() {
		return (dynCall_viij = Module["dynCall_viij"] = Module["asm"]["Ra"]).apply(null, arguments)
	};
	var dynCall_vij = Module["dynCall_vij"] = function() {
		return (dynCall_vij = Module["dynCall_vij"] = Module["asm"]["Sa"]).apply(null, arguments)
	};
	var dynCall_iijjiiii = Module["dynCall_iijjiiii"] = function() {
		return (dynCall_iijjiiii = Module["dynCall_iijjiiii"] = Module["asm"]["Ta"]).apply(null, arguments)
	};
	var dynCall_jiji = Module["dynCall_jiji"] = function() {
		return (dynCall_jiji = Module["dynCall_jiji"] = Module["asm"]["Ua"]).apply(null, arguments)
	};
	var dynCall_iiiiij = Module["dynCall_iiiiij"] = function() {
		return (dynCall_iiiiij = Module["dynCall_iiiiij"] = Module["asm"]["Va"]).apply(null, arguments)
	};
	var dynCall_iiiiijj = Module["dynCall_iiiiijj"] = function() {
		return (dynCall_iiiiijj = Module["dynCall_iiiiijj"] = Module["asm"]["Wa"]).apply(null, arguments)
	};
	var dynCall_iiiiiijj = Module["dynCall_iiiiiijj"] = function() {
		return (dynCall_iiiiiijj = Module["dynCall_iiiiiijj"] = Module["asm"]["Xa"]).apply(null, arguments)
	};
	var dynCall_viijii = Module["dynCall_viijii"] = function() {
		return (dynCall_viijii = Module["dynCall_viijii"] = Module["asm"]["Ya"]).apply(null, arguments)
	};
	var __emscripten_allow_main_runtime_queued_calls = Module["__emscripten_allow_main_runtime_queued_calls"] = 195576;
	var __emscripten_main_thread_futex = Module["__emscripten_main_thread_futex"] = 206884;
	Module["keepRuntimeAlive"] = keepRuntimeAlive;
	Module["PThread"] = PThread;
	Module["PThread"] = PThread;
	Module["wasmMemory"] = wasmMemory;
	Module["ExitStatus"] = ExitStatus;
	var calledRun;

	function ExitStatus(status) {
		this.name = "ExitStatus";
		this.message = "Program terminated with exit(" + status + ")";
		this.status = status
	}
	var calledMain = false;
	dependenciesFulfilled = function runCaller() {
		if (!calledRun) run();
		if (!calledRun) dependenciesFulfilled = runCaller
	};

	function callMain(args) {
		var entryFunction = Module["_main"];
		args = args || [];
		var argc = args.length + 1;
		var argv = stackAlloc((argc + 1) * 4);
		GROWABLE_HEAP_I32()[argv >> 2] = allocateUTF8OnStack(thisProgram);
		for (var i = 1; i < argc; i++) {
			GROWABLE_HEAP_I32()[(argv >> 2) + i] = allocateUTF8OnStack(args[i - 1])
		}
		GROWABLE_HEAP_I32()[(argv >> 2) + argc] = 0;
		try {
			var ret = entryFunction(argc, argv);
			exit(ret, true);
			return ret
		} catch (e) {
			return handleException(e)
		} finally {
			calledMain = true
		}
	}

	function run(args) {
		args = args || arguments_;
		if (runDependencies > 0) {
			return
		}
		if (ENVIRONMENT_IS_PTHREAD) {
			readyPromiseResolve(Module);
			initRuntime();
			postMessage({
				"cmd": "loaded"
			});
			return
		}
		preRun();
		if (runDependencies > 0) {
			return
		}

		function doRun() {
			if (calledRun) return;
			calledRun = true;
			Module["calledRun"] = true;
			if (ABORT) return;
			initRuntime();
			preMain();
			readyPromiseResolve(Module);
			if (Module["onRuntimeInitialized"]) Module["onRuntimeInitialized"]();
			if (shouldRunNow) callMain(args);
			postRun()
		}
		if (Module["setStatus"]) {
			Module["setStatus"]("Running...");
			setTimeout(function() {
				setTimeout(function() {
					Module["setStatus"]("")
				}, 1);
				doRun()
			}, 1)
		} else {
			doRun()
		}
	}
	Module["run"] = run;

	function exit(status, implicit) {
		EXITSTATUS = status;
		if (!implicit) {
			if (ENVIRONMENT_IS_PTHREAD) {
				exitOnMainThread(status);
				throw "unwind"
			} else {}
		}
		if (keepRuntimeAlive()) {} else {
			exitRuntime()
		}
		procExit(status)
	}

	function procExit(code) {
		EXITSTATUS = code;
		if (!keepRuntimeAlive()) {
			PThread.terminateAllThreads();
			if (Module["onExit"]) Module["onExit"](code);
			ABORT = true
		}
		quit_(code, new ExitStatus(code))
	}
	if (Module["preInit"]) {
		if (typeof Module["preInit"] == "function") Module["preInit"] = [Module["preInit"]];
		while (Module["preInit"].length > 0) {
			Module["preInit"].pop()()
		}
	}
	var shouldRunNow = true;
	if (Module["noInitialRun"]) shouldRunNow = false;
	if (ENVIRONMENT_IS_PTHREAD) {
		noExitRuntime = false;
		PThread.initWorker()
	}
	run();


	return Module.ready
};