import { waitForLegacySession } from './session-bridge.js?v=20260911.1';
import { levelBus } from '../events/level-bus.js?v=20260911.1';

const DEFAULT_INTERVAL_MS = 120;
const SILENCE_THRESHOLD = 2; // matches legacy behaviour where values < 2 are ignored

function normaliseLoudness(value) {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return null;
  }
  const constrained = Math.max(0, value);
  const peak = Math.min(1, constrained / 120);
  const rms = Math.min(1, constrained / 160);
  return { peak, rms, raw: constrained };
}

export async function bridgeLegacyMeters(options = {}) {
  const { intervalMs = DEFAULT_INTERVAL_MS } = options;
  const session = await waitForLegacySession({ timeoutMs: 15000 });
  const lastValues = new Map();

  function publish(uuid, loudness, metadata) {
    if (typeof loudness !== 'number' || loudness < SILENCE_THRESHOLD) {
      return;
    }
    const key = `${uuid}`;
    if (lastValues.get(key) === loudness) {
      return;
    }
    lastValues.set(key, loudness);
    const values = normaliseLoudness(loudness);
    if (!values) {
      return;
    }
    levelBus.publishLevel({
      uuid,
      trackType: 'audio',
      peak: values.peak,
      rms: values.rms,
      raw: values.raw,
      source: 'legacy-meter',
      timestamp: performance.now(),
      metadata,
    });
  }

  function poll() {
    if (session.stats && typeof session.stats.Audio_Loudness === 'number') {
      publish('local', session.stats.Audio_Loudness, { kind: 'local' });
    }

    Object.entries(session.rpcs || {}).forEach(([uuid, peer]) => {
      if (!peer || !peer.stats) {
        return;
      }
      const loudness = peer.stats.Audio_Loudness;
      if (typeof loudness !== 'number') {
        return;
      }
      publish(uuid, loudness, {
        kind: 'remote',
        streamID: peer.streamID,
        label: peer.label,
      });
    });
  }

  const timer = setInterval(poll, intervalMs);
  poll();

  return () => {
    clearInterval(timer);
    lastValues.clear();
  };
}
