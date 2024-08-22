class MeterProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        this._rms = 0;
        this._smoothingFactor = 0.980;
    }

    process(inputs, outputs, parameters) {
        const input = inputs[0];
        if (input.length > 0) {
            const channelData = input[0];
            let sum = 0;
            for (let i = 0; i < channelData.length; ++i) {
                sum += channelData[i] * channelData[i];
            }
            const rms = Math.sqrt(sum / channelData.length)*1.2;
            this._rms = Math.max(rms, this._rms * this._smoothingFactor);
            this.port.postMessage(this._rms);
        }
        return true;
    }
}

registerProcessor('meter', MeterProcessor);
