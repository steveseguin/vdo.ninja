const DEFAULT_SAMPLE_RATE = 48000;

function writeString(view, offset, string) {
  for (let i = 0; i < string.length; i += 1) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

function padToEven(value) {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return value % 2 === 0 ? value : value + 1;
}

function sanitiseMarkerLabel(label, fallback = 'Marker') {
  if (!label) {
    return fallback;
  }
  if (typeof label !== 'string') {
    return fallback;
  }
  return label.replace(/\0/g, '').replace(/\r?\n/g, ' ').trim() || fallback;
}

function normaliseCueMarkers(markers, sampleRate, maxSampleOffset, trackStartOffsetSeconds = 0) {
  if (!Array.isArray(markers) || !markers.length || !Number.isFinite(sampleRate) || sampleRate <= 0) {
    return [];
  }

  const trackOffset = Number.isFinite(trackStartOffsetSeconds) ? Math.max(0, trackStartOffsetSeconds) : 0;

  const cueMarkers = [];
  for (let i = 0; i < markers.length; i += 1) {
    const marker = markers[i];
    if (!marker) {
      continue;
    }
    const rawTimeSeconds =
      marker.timeSeconds ??
      marker.time ??
      marker.seconds ??
      marker.t ??
      (typeof marker.timestamp === 'number' ? marker.timestamp : undefined);
    if (!Number.isFinite(rawTimeSeconds)) {
      continue;
    }
    // Adjust marker time relative to this track's start
    const adjustedSeconds = rawTimeSeconds - trackOffset;
    // Skip markers that occurred before this track started
    if (adjustedSeconds < 0) {
      continue;
    }
    let sampleOffset = Math.round(adjustedSeconds * sampleRate);
    if (Number.isFinite(maxSampleOffset)) {
      sampleOffset = Math.min(Math.max(0, sampleOffset), maxSampleOffset);
    } else {
      sampleOffset = Math.max(0, sampleOffset);
    }
    cueMarkers.push({
      timeSeconds: rawTimeSeconds,
      adjustedSeconds,
      sampleOffset,
      label: sanitiseMarkerLabel(marker.label, `Marker ${cueMarkers.length + 1}`),
    });
  }

  cueMarkers.sort((a, b) => a.sampleOffset - b.sampleOffset);

  return cueMarkers.map((marker, index) => ({
    ...marker,
    id: index + 1,
  }));
}

function buildCueChunk(cueMarkers) {
  if (!cueMarkers.length) {
    return null;
  }

  const cuePointsSize = 4 + cueMarkers.length * 24;
  const cueChunkSize = padToEven(cuePointsSize);
  const buffer = new ArrayBuffer(8 + cueChunkSize);
  const view = new DataView(buffer);

  writeString(view, 0, 'cue ');
  view.setUint32(4, cuePointsSize, true);
  view.setUint32(8, cueMarkers.length, true);

  let offset = 12;
  cueMarkers.forEach((marker) => {
    view.setUint32(offset, marker.id, true);
    offset += 4;
    view.setUint32(offset, marker.sampleOffset, true);
    offset += 4;
    writeString(view, offset, 'data');
    offset += 4;
    view.setUint32(offset, 0, true);
    offset += 4;
    view.setUint32(offset, 0, true);
    offset += 4;
    view.setUint32(offset, marker.sampleOffset, true);
    offset += 4;
  });

  return new Uint8Array(buffer);
}

function buildAdtlListChunk(cueMarkers) {
  if (!cueMarkers.length) {
    return null;
  }

  const encoder = typeof TextEncoder !== 'undefined' ? new TextEncoder() : null;
  if (!encoder) {
    return null;
  }

  const labels = cueMarkers.map((marker) => {
    const labelBytes = encoder.encode(sanitiseMarkerLabel(marker.label, `Marker ${marker.id}`));
    const dataSize = 4 + labelBytes.length + 1;
    return {
      id: marker.id,
      labelBytes,
      dataSize,
      paddedDataSize: padToEven(dataSize),
    };
  });

  const listDataSize = 4 + labels.reduce((total, entry) => total + 8 + entry.paddedDataSize, 0);
  const listChunkSize = padToEven(listDataSize);
  const buffer = new ArrayBuffer(8 + listChunkSize);
  const view = new DataView(buffer);
  const bytes = new Uint8Array(buffer);

  writeString(view, 0, 'LIST');
  view.setUint32(4, listDataSize, true);
  writeString(view, 8, 'adtl');

  let offset = 12;
  labels.forEach((entry) => {
    writeString(view, offset, 'labl');
    offset += 4;
    view.setUint32(offset, entry.dataSize, true);
    offset += 4;
    view.setUint32(offset, entry.id, true);
    offset += 4;
    bytes.set(entry.labelBytes, offset);
    offset += entry.labelBytes.length;
    bytes[offset] = 0;
    offset += 1;
    const padding = entry.paddedDataSize - entry.dataSize;
    offset += padding;
  });

  return new Uint8Array(buffer);
}

function interleaveChannels(channelData) {
  if (!channelData.length) {
    return new Float32Array();
  }
  const length = channelData[0].length;
  if (channelData.length === 1) {
    return new Float32Array(channelData[0]);
  }
  const interleaved = new Float32Array(length * channelData.length);
  let index = 0;
  for (let i = 0; i < length; i += 1) {
    for (let channel = 0; channel < channelData.length; channel += 1) {
      interleaved[index] = channelData[channel][i];
      index += 1;
    }
  }
  return interleaved;
}

function floatTo16BitPCM(view, offset, input) {
  for (let i = 0; i < input.length; i += 1, offset += 2) {
    let sample = input[i];
    sample = Math.max(-1, Math.min(1, sample));
    const converted = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
    view.setInt16(offset, converted, true);
  }
}

export function audioBufferToWav(audioBuffer, { float32 = false, markers = null, trackStartOffsetSeconds = 0 } = {}) {
  if (!audioBuffer) {
    throw new Error('audioBufferToWav expects an AudioBuffer.');
  }
  const numberOfChannels = audioBuffer.numberOfChannels || 1;
  const sampleRate = audioBuffer.sampleRate || DEFAULT_SAMPLE_RATE;
  const channelData = [];
  for (let i = 0; i < numberOfChannels; i += 1) {
    channelData.push(audioBuffer.getChannelData(i));
  }
  const interleaved = interleaveChannels(channelData);
  const bytesPerSample = float32 ? 4 : 2;
  const format = float32 ? 3 : 1;
  const dataLength = interleaved.length * bytesPerSample;

  const cueMarkers = normaliseCueMarkers(markers, sampleRate, audioBuffer.length ? Math.max(0, audioBuffer.length - 1) : 0, trackStartOffsetSeconds);
  const cueChunk = buildCueChunk(cueMarkers);
  const listChunk = buildAdtlListChunk(cueMarkers);

  const riffHeaderSize = 12;
  const fmtChunkTotal = 8 + 16;
  const dataChunkTotal = 8 + padToEven(dataLength);
  const cueChunkTotal = cueChunk ? cueChunk.length : 0;
  const listChunkTotal = listChunk ? listChunk.length : 0;

  const totalSize = riffHeaderSize + fmtChunkTotal + dataChunkTotal + cueChunkTotal + listChunkTotal;
  const buffer = new ArrayBuffer(totalSize);
  const view = new DataView(buffer);
  const bytes = new Uint8Array(buffer);

  writeString(view, 0, 'RIFF');
  view.setUint32(4, totalSize - 8, true);
  writeString(view, 8, 'WAVE');

  let offset = 12;

  writeString(view, offset, 'fmt ');
  view.setUint32(offset + 4, 16, true);
  view.setUint16(offset + 8, format, true);
  view.setUint16(offset + 10, numberOfChannels, true);
  view.setUint32(offset + 12, sampleRate, true);
  view.setUint32(offset + 16, sampleRate * numberOfChannels * bytesPerSample, true);
  view.setUint16(offset + 20, numberOfChannels * bytesPerSample, true);
  view.setUint16(offset + 22, bytesPerSample * 8, true);
  offset += fmtChunkTotal;

  writeString(view, offset, 'data');
  view.setUint32(offset + 4, dataLength, true);
  const dataOffset = offset + 8;

  if (float32) {
    const floatView = new Float32Array(buffer, dataOffset, interleaved.length);
    floatView.set(interleaved);
  } else {
    floatTo16BitPCM(view, dataOffset, interleaved);
  }

  offset += 8 + padToEven(dataLength);

  if (cueChunk) {
    bytes.set(cueChunk, offset);
    offset += cueChunk.length;
  }

  if (listChunk) {
    bytes.set(listChunk, offset);
    offset += listChunk.length;
  }

  return buffer;
}

async function resampleIfNeeded(audioBuffer, targetSampleRate) {
  if (!targetSampleRate || !audioBuffer) {
    return audioBuffer;
  }
  if (Math.abs(audioBuffer.sampleRate - targetSampleRate) < 1) {
    return audioBuffer;
  }
  if (typeof OfflineAudioContext === 'undefined') {
    return audioBuffer;
  }
  const length = Math.ceil(audioBuffer.duration * targetSampleRate);
  const offline = new OfflineAudioContext(audioBuffer.numberOfChannels, length, targetSampleRate);
  const source = offline.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(offline.destination);
  source.start(0);
  return offline.startRendering();
}

export async function convertBlobToWav(blob, { sampleRate = DEFAULT_SAMPLE_RATE, float32 = false, markers = null, trackStartOffsetSeconds = 0, audioContext = null } = {}) {
  if (!blob) {
    throw new Error('convertBlobToWav expects a Blob.');
  }
  if (typeof window === 'undefined') {
    throw new Error('convertBlobToWav requires a browser environment.');
  }

  const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
  if (!audioContext && !AudioContextCtor) {
    throw new Error('AudioContext not supported in this environment.');
  }

  const context = audioContext || new AudioContextCtor();
  const shouldCloseContext = !audioContext && typeof context.close === 'function';

  let audioBuffer;
  try {
    const arrayBuffer = await blob.arrayBuffer();
    const bufferCopy = arrayBuffer.slice(0);
    audioBuffer = await new Promise((resolve, reject) => {
      context.decodeAudioData(bufferCopy, resolve, reject);
    });
  } catch (error) {
    if (shouldCloseContext) {
      await context.close();
    }
    throw error;
  }

  if (shouldCloseContext) {
    await context.close();
  }

  let processedBuffer = audioBuffer;
  try {
    processedBuffer = await resampleIfNeeded(audioBuffer, sampleRate);
  } catch (error) {
    console.warn('Failed to resample audio buffer, using original sample rate', error);
  }

  const wavArrayBuffer = audioBufferToWav(processedBuffer, { float32, markers, trackStartOffsetSeconds });
  return new Blob([wavArrayBuffer], { type: 'audio/wav' });
}
