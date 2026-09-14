class MeterProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this._peak = 0;
    this._rms = 0;
    this._clipped = 0;
    this._frame = 0;
    this._silentFrames = 0;
    this._updateInterval = Math.round(sampleRate * 0.032);
  }

  process(inputs) {
    const input = inputs[0];
    if (!input || !input.length) {
      this._frame += 128;
      this._silentFrames += 1;
      return true;
    }

    const channelData = input[0];
    if (!channelData) {
      this._frame += 128;
      this._silentFrames += 1;
      return true;
    }

    let peak = this._peak;
    let sumSquares = 0;
    let clipped = this._clipped;

    for (let i = 0; i < channelData.length; i++) {
      const sample = channelData[i];
      const absSample = Math.abs(sample);
      if (absSample > peak) {
        peak = absSample;
      }
      if (absSample >= 0.89) {
        clipped += 1;
      }
      sumSquares += sample * sample;
    }

    this._frame += channelData.length;
    this._peak = peak;
    this._clipped = clipped;
    this._rms += sumSquares;

    if (this._frame >= this._updateInterval) {
      const rms = Math.sqrt(this._rms / this._frame);
      const payload = {
        peak,
        rms,
        clipped,
        silent: rms <= 0.001,
        timestamp: currentTime,
      };
      this.port.postMessage(payload);
      this._peak = 0;
      this._rms = 0;
      this._clipped = 0;
      this._frame = 0;
      this._silentFrames = payload.silent ? this._silentFrames + 1 : 0;
    }

    return true;
  }
}

registerProcessor('podcast-meter', MeterProcessor);
