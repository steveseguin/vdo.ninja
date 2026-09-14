"use strict";

class VDOChunkedAudioCaptureProcessor extends AudioWorkletProcessor {
	process(inputs) {
		var input = inputs && inputs[0];
		if (!input || !input.length || !input[0] || !input[0].length) {
			return true;
		}
		var channels = [];
		var transfers = [];
		for (var channelIndex = 0; channelIndex < input.length; channelIndex++) {
			var copy = new Float32Array(input[channelIndex].length);
			copy.set(input[channelIndex]);
			channels.push(copy.buffer);
			transfers.push(copy.buffer);
		}
		this.port.postMessage({
			channels: channels,
			frames: input[0].length
		}, transfers);
		return true;
	}
}

registerProcessor("vdo-chunked-audio-capture", VDOChunkedAudioCaptureProcessor);
