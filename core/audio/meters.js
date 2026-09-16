import { levelBus } from '../events/level-bus.js?v=20260911.1';

const loadedWorklets = new WeakSet();
const DEFAULT_WORKLET_URL = new URL('./meter.worklet.js?v=20260911.1', import.meta.url).toString();

async function ensureWorkletModule(audioContext, workletUrl = DEFAULT_WORKLET_URL) {
  if (loadedWorklets.has(audioContext)) {
    return;
  }
  await audioContext.audioWorklet.addModule(workletUrl);
  loadedWorklets.add(audioContext);
}

function createSource(audioContext, track) {
  if (window.MediaStreamTrackAudioSourceNode) {
    try {
      return new MediaStreamTrackAudioSourceNode(audioContext, { track });
    } catch (error) {
      console.warn('Falling back to MediaStream source', error);
    }
  }
  const stream = new MediaStream([track]);
  return audioContext.createMediaStreamSource(stream);
}

const DEFAULT_ANALYSER_OPTIONS = {
  fftSize: 512,
  minDecibels: -110,
  maxDecibels: -10,
  smoothingTimeConstant: 0.75,
};

export async function monitorTrackLevel(audioContext, track, { uuid, trackType = 'audio', metadata = {} } = {}) {
  if (!track || track.kind !== 'audio') {
    throw new Error('monitorTrackLevel expects an audio MediaStreamTrack.');
  }
  await ensureWorkletModule(audioContext);
  const source = createSource(audioContext, track);
  const workletNode = new AudioWorkletNode(audioContext, 'podcast-meter');
  const analyser = audioContext.createAnalyser();
  analyser.fftSize = DEFAULT_ANALYSER_OPTIONS.fftSize;
  analyser.minDecibels = DEFAULT_ANALYSER_OPTIONS.minDecibels;
  analyser.maxDecibels = DEFAULT_ANALYSER_OPTIONS.maxDecibels;
  analyser.smoothingTimeConstant = DEFAULT_ANALYSER_OPTIONS.smoothingTimeConstant;
  const silentSink = new GainNode(audioContext, { gain: 0 });
  source.connect(workletNode);
  source.connect(analyser);
  workletNode.connect(silentSink);
  analyser.connect(silentSink);
  silentSink.connect(audioContext.destination);
  workletNode.port.onmessage = (event) => {
    levelBus.publishLevel?.({
      uuid,
      trackType,
      metadata,
      ...event.data,
    });
  };
  return {
    node: workletNode,
    analyser,
    source,
    sink: silentSink,
    disconnect: (options = {}) => {
      try {
        workletNode.port.onmessage = null;
        workletNode.disconnect();
        analyser.disconnect();
        silentSink.disconnect();
      } catch (error) {
        console.warn('Failed to disconnect meter worklet node', error);
      }
      try {
        source.disconnect();
      } catch (error) {
        console.warn('Failed to disconnect meter source', error);
      }
      if (options.stopTrack) {
        track.stop();
      }
    },
  };
}
