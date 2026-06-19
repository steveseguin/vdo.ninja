import { storage } from './utils/storage.js';
import { randomSessionId, formatTime, safeHtml } from './utils/helpers.js';
import { EmoteManager } from './utils/emoteManager.js';
import { YoutubePlugin } from './plugins/youtubePlugin.js';

import { YoutubeStreamingPlugin } from './plugins/youtubeStreamingPlugin.js';
import { TwitchPlugin } from './plugins/twitchPlugin.js';
import { KickPlugin } from './plugins/kickPlugin.js';
import { SocialStreamWebSocketPlugin } from './plugins/socialStreamWebSocketPlugin.js';

const overlayToggleDefs = [
  { key: 'transparent', id: 'session-opt-transparent', params: ['transparent'] },
  { key: 'noavatar', id: 'session-opt-noavatar', params: ['noavatar'] },
  { key: 'reverse', id: 'session-opt-reverse', params: ['reverse'] }
];

function normalizeActivityProfile(profile) {
  const normalized = (profile || '').trim().toLowerCase();
  if (!normalized) {
    return null;
  }
  if (['compact', 'dense', 'small', 'slim'].includes(normalized)) {
    return 'compact';
  }
  if (['cozy', 'comfortable', 'large', 'big'].includes(normalized)) {
    return 'cozy';
  }
  if (['minimal', 'clean', 'simple'].includes(normalized)) {
    return 'minimal';
  }
  if (['default', 'standard', 'balanced', 'normal'].includes(normalized)) {
    return 'default';
  }
  return null;
}

function normalizeActivityPosition(position) {
  const normalized = (position || '').trim().toLowerCase().replace(/[_\s]+/g, '-');
  if (!normalized) {
    return null;
  }

  const aliases = {
    tl: 'top-left',
    tr: 'top-right',
    bl: 'bottom-left',
    br: 'bottom-right',
    ml: 'middle-left',
    mr: 'middle-right',
    top: 'top-center',
    bottom: 'bottom-center',
    left: 'middle-left',
    right: 'middle-right',
    center: 'middle-center',
    middle: 'middle-center',
    mid: 'middle-center',
    topleft: 'top-left',
    topright: 'top-right',
    bottomleft: 'bottom-left',
    bottomright: 'bottom-right',
    leftmiddle: 'middle-left',
    rightmiddle: 'middle-right',
    centerleft: 'middle-left',
    centerright: 'middle-right'
  };

  const canonical = aliases[normalized] || normalized;
  const [vertical, horizontal] = canonical.split('-');
  if (!vertical || !horizontal) {
    return null;
  }
  if (!['top', 'middle', 'bottom'].includes(vertical)) {
    return null;
  }
  if (!['left', 'center', 'right'].includes(horizontal)) {
    return null;
  }
  return {
    token: `${vertical}-${horizontal}`,
    vertical,
    horizontal
  };
}

function parseActivityLimit(value) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) {
    return null;
  }
  return Math.min(400, Math.max(5, parsed));
}

const isObsDockView = typeof window !== 'undefined' && Boolean(window.obsstudio);

const url = new URL(window.location.href);
const focusParam = (url.searchParams.get('focus') || '').trim().toLowerCase();
const liteViewParam = (url.searchParams.get('view') || url.searchParams.get('liteView') || '').trim().toLowerCase();
const scopeParam = (url.searchParams.get('syncscope') || '').trim();
const hasOpener = typeof window !== 'undefined' && Boolean(window.opener);
const isActivityPopoutView = liteViewParam === 'activity' || (!liteViewParam && focusParam === 'activity' && hasOpener);
const transparentParam = (url.searchParams.get('transparent') || '').trim().toLowerCase();
const noAvatarParam = (url.searchParams.get('noavatar') || '').trim().toLowerCase();
const reverseParam = (url.searchParams.get('reverse') || '').trim().toLowerCase();
const profileParam = (url.searchParams.get('profile') || '').trim().toLowerCase();
const positionParam = (url.searchParams.get('position') || '').trim().toLowerCase();
const activityLimitParam = parseActivityLimit(url.searchParams.get('max') || '');
const isTransparentView = url.searchParams.has('transparent') && !['0', 'false', 'off', 'no'].includes(transparentParam);
const noAvatarView = url.searchParams.has('noavatar') && !['0', 'false', 'off', 'no'].includes(noAvatarParam);
const reverseActivityView = url.searchParams.has('reverse') && !['0', 'false', 'off', 'no'].includes(reverseParam);
const activityProfileView = normalizeActivityProfile(profileParam);
const activityPositionView = normalizeActivityPosition(positionParam);

const elements = {
  sessionInput: document.getElementById('session-id'),
  sessionApply: document.getElementById('session-apply'),
  sessionCopy: document.getElementById('session-copy'),
  sessionTest: document.getElementById('session-test'),
  sessionToggle: document.getElementById('session-options-toggle'),
  sessionAdvanced: document.getElementById('session-advanced'),
  sessionIndicator: document.getElementById('session-indicator'),
  sessionOpen: document.getElementById('session-open'),
  sessionStatus: document.getElementById('session-status'),
  sourceList: document.getElementById('source-list'),
  activitySection: document.getElementById('activity'),
  activityLog: document.getElementById('activity-log'),
  activityClear: document.getElementById('activity-clear'),
  activityFullscreen: document.getElementById('activity-fullscreen'),
  activityFilterDonations: document.getElementById('activity-filter-donations'),
  activityToggleTts: document.getElementById('activity-toggle-tts'),
  activityMenuToggle: document.getElementById('activity-menu-toggle'),
  activityMenu: document.getElementById('activity-menu'),
  activityPopout: document.getElementById('activity-popout'),
  mobileNavButtons: Array.from(document.querySelectorAll('[data-mobile-nav-target]'))
};

if (isObsDockView) {
  applyObsDockLayout();
}

if (isActivityPopoutView) {
  applyActivityPopoutLayout();
}

const overlayToggleInputs = overlayToggleDefs.reduce((acc, def) => {
  acc[def.key] = document.getElementById(def.id);
  return acc;
}, {});

const sessionKey = scopeParam ? `session.currentId.${scopeParam}` : 'session.currentId';
const overlayToggleStorageKey = 'session.overlayOptions';
const youtubeStreamingStorageKey = 'youtube.useStreaming';
const debugPreferenceKey = 'debug.enabled';
const activityLimit = activityLimitParam ?? 80;
const relayStorageKey = 'ssn-lite-relay-event';

class LocalMessenger {
  constructor({ onMessage = null, onDebug = null, debug = false } = {}) {
    this.sessionId = null;
    this.onMessage = typeof onMessage === 'function' ? onMessage : null;
    this.onDebug = typeof onDebug === 'function' ? onDebug : null;
    this.debug = Boolean(debug);
    this.channel = null;
    this.channelId = Math.random().toString(36).slice(2);
    this.handleStorageRelay = this.handleStorageRelay.bind(this);

    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel('ssn-lite-relay');
        this.channel.addEventListener('message', (event) => {
          const payload = event?.data || {};
          if (!payload || payload.origin === this.channelId) {
            return;
          }
          if (payload.type !== 'relay') {
            return;
          }
          if (!this.sessionId || payload.sessionId !== this.sessionId) {
            return;
          }
          this.notifyMessage(payload.message, { external: true });
        });
      } catch (err) {
        this.channel = null;
      }
    }

    if (!this.channel && typeof window !== 'undefined' && window.addEventListener) {
      window.addEventListener('storage', this.handleStorageRelay, false);
    }
  }

  debugLog(message, detail) {
    if (!this.debug) {
      return;
    }
    if (detail !== undefined) {
      console.debug('[LocalMessenger]', message, detail);
    } else {
      console.debug('[LocalMessenger]', message);
    }
    if (this.onDebug) {
      this.onDebug({
        plugin: 'system',
        message: `[debug] ${message}`,
        detail,
        timestamp: Date.now()
      });
    }
  }

  setSessionId(sessionId) {
    const trimmed = (sessionId || '').trim();
    this.sessionId = trimmed || null;
    this.debugLog('Updated session id', { sessionId: this.sessionId });
  }

  getSessionId() {
    return this.sessionId;
  }

  send(message) {
    if (!this.sessionId) {
      throw new Error('Cannot send message without an active session.');
    }
    this.notifyMessage(message);
    if (this.channel) {
      try {
        this.channel.postMessage({
          type: 'relay',
          origin: this.channelId,
          sessionId: this.sessionId,
          message
        });
      } catch (err) {
        this.debugLog('BroadcastChannel relay failed', { error: err?.message || err });
      }
    } else {
      this.broadcastViaStorage(message);
    }
  }

  broadcastViaStorage(message) {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }
    const payload = {
      type: 'relay',
      origin: this.channelId,
      sessionId: this.sessionId,
      message,
      timestamp: Date.now(),
      nonce: Math.random().toString(36).slice(2)
    };
    try {
      localStorage.setItem(relayStorageKey, JSON.stringify(payload));
      localStorage.removeItem(relayStorageKey);
    } catch (err) {
      this.debugLog('Storage relay failed', { error: err?.message || err });
    }
  }

  handleStorageRelay(event) {
    if (!event || event.key !== relayStorageKey || !event.newValue) {
      return;
    }
    let payload = null;
    try {
      payload = JSON.parse(event.newValue);
    } catch (err) {
      return;
    }
    if (!payload || payload.origin === this.channelId || payload.type !== 'relay') {
      return;
    }
    if (!this.sessionId || payload.sessionId !== this.sessionId) {
      return;
    }
    this.notifyMessage(payload.message, { external: true, relay: 'storage' });
  }

  notifyMessage(message, meta = {}) {
    if (!this.onMessage) {
      return;
    }
    this.onMessage({
      message,
      sessionId: this.sessionId,
      meta
    });
  }
}

const overlayToggleDefaults = overlayToggleDefs.reduce((acc, def) => {
  acc[def.key] = false;
  return acc;
}, {});

let overlayToggleState = { ...overlayToggleDefaults };
const storedOverlayToggleState = storage.get(overlayToggleStorageKey, null);
if (storedOverlayToggleState && typeof storedOverlayToggleState === 'object' && !Array.isArray(storedOverlayToggleState)) {
  overlayToggleState = { ...overlayToggleState, ...storedOverlayToggleState };
}


let youtubeStreamingEnabled = Boolean(storage.get(youtubeStreamingStorageKey, false));

const debugParam = url.searchParams.get('debug');
const storedDebugPreference = storage.get(debugPreferenceKey, null);
const debugEnabled = (() => {
  if (debugParam !== null) {
    const normalized = (debugParam || '').trim().toLowerCase();
    if (!normalized) {
      storage.set(debugPreferenceKey, true);
      return true;
    }
    const next = !['0', 'false', 'off', 'no'].includes(normalized);
    storage.set(debugPreferenceKey, next);
    return next;
  }
  if (typeof storedDebugPreference === 'boolean') {
    return storedDebugPreference;
  }
  return false;
})();
if (debugEnabled) {
  console.info('Social Stream Lite debug logging enabled. Add ?debug=0 to the URL or call window.SocialStreamLiteDebug.disable() to turn it off.');
} else {
  console.info('Social Stream Lite debug logging disabled. Add ?debug=1 to the URL or call window.SocialStreamLiteDebug.enable() to turn it on.');
}

window.SocialStreamLiteDebug = Object.freeze({
  enable() {
    storage.set(debugPreferenceKey, true);
    const next = new URL(window.location.href);
    next.searchParams.set('debug', '1');
    window.location.assign(next.toString());
  },
  disable() {
    storage.set(debugPreferenceKey, false);
    const next = new URL(window.location.href);
    next.searchParams.set('debug', '0');
    window.location.assign(next.toString());
  },
  clear() {
    storage.remove(debugPreferenceKey);
    const next = new URL(window.location.href);
    next.searchParams.delete('debug');
    window.location.assign(next.toString());
  },
  status() {
    return {
      param: new URL(window.location.href).searchParams.get('debug'),
      stored: storage.get(debugPreferenceKey, null),
      active: debugEnabled
    };
  }
});

const messenger = new LocalMessenger({
  debug: debugEnabled,
  onDebug: debugEnabled ? addActivity : null,
  onMessage: ({ message }) => handleRelayMessage(message)
});
const emotes = new EmoteManager();
let plugins = [];

const pluginMap = new Map();
const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function debugActivityTrace(label, detail) {
  if (!debugEnabled) {
    return;
  }
  if (detail !== undefined) {
    console.info(`[Lite] ${label}`, detail);
  } else {
    console.info(`[Lite] ${label}`);
  }
}

function sanitizePayloadForDebug(payload) {
  if (!debugEnabled) {
    return payload;
  }
  if (!payload || typeof payload !== 'object') {
    return payload;
  }
  if (Array.isArray(payload)) {
    return payload.map((item) => sanitizePayloadForDebug(item));
  }
  const snapshot = { ...payload };
  if (Object.prototype.hasOwnProperty.call(snapshot, 'raw')) {
    snapshot.raw = '[omitted in debug log]';
  }
  if (snapshot.payload && typeof snapshot.payload === 'object') {
    snapshot.payload = sanitizePayloadForDebug(snapshot.payload);
  }
  if (snapshot.detail && typeof snapshot.detail === 'object') {
    snapshot.detail = sanitizePayloadForDebug(snapshot.detail);
  }
  return snapshot;
}

function snapshotActivityEntryForDebug(entry) {
  if (!debugEnabled) {
    return entry;
  }
  if (!entry || typeof entry !== 'object') {
    return entry;
  }
  if (Array.isArray(entry)) {
    return entry.map((item) => snapshotActivityEntryForDebug(item));
  }
  const snapshot = { ...entry };
  if (snapshot.payload && typeof snapshot.payload === 'object') {
    snapshot.payload = sanitizePayloadForDebug(snapshot.payload);
  }
  if (snapshot.detail && typeof snapshot.detail === 'object') {
    snapshot.detail = sanitizePayloadForDebug(snapshot.detail);
  }
  return snapshot;
}

const testMessagePresets = [
  () => ({
    type: 'youtube',
    chatname: 'Friendly Viewer',
    chatmessage: 'Thanks for keeping the stream fun tonight!',
    chatimg: '',
    chatbadges: []
  }),
  () => ({
    type: 'youtube',
    chatname: 'Generous Donor',
    chatmessage: 'hi doctor I unsubscribe on all your Youtubers old friends.they women',
    chatimg: 'https://yt4.ggpht.com/ytc/AIdro_lasYSs3mDnqKHgeUiaEgd69ZZBlwVe12Jmyv3DBtWMviA=s256-c-k-c0x00ffffff-no-rj',
    hasDonation: 'US$5.00',
    sourceName: 'DrDisRespect',
    sourceImg: 'https://yt3.ggpht.com/_0_SuenjzMocr2OTOHbGjEin5FcHOy-vRroLcEZtj0WfUMEQXVQqbtEuRaa-tIewyjbAkffR=s88-c-k-c0x00ffffff-no-rj',
    title: 'DONATION'
  }),
  () => ({
    type: 'youtube',
    chatname: 'Helpful Person',
    chatmessage: 'Appreciate the stream! Have a coffee on me ☕',
    chatimg: '',
    hasDonation: '$5.00',
    donationAmount: '$5.00',
    donationCurrency: 'USD'
  }),
  () => ({
    type: 'youtube',
    chatname: 'Longtime Member',
    nameColor: '#107516',
    chatbadges: ['https://yt3.ggpht.com/OIRwLP2qDr_Xgwr0qn2JBs-ZDDmy12_-DQ1LCKF-iFYE8DewzfcRWjGZy0FQ9n2DtxzpXp3e=s32-c-k'],
    chatmessage: '@Shredda HAHAHAH',
    chatimg: 'https://yt4.ggpht.com/XgKdw8fR3PAQpBoilC3V02G0ovthMxU6xaTVF3_iVr7x7XWmqBzTNeVws1yXRpTXucgpnDHniHE=s256-c-k-c0x00ffffff-no-rj',
    membership: 'MEMBERSHIP',
    sourceName: 'DrDisRespect',
    sourceImg: 'https://yt3.ggpht.com/_0_SuenjzMocr2OTOHbGjEin5FcHOy-vRroLcEZtj0WfUMEQXVQqbtEuRaa-tIewyjbAkffR=s88-c-k-c0x00ffffff-no-rj'
  }),
  () => ({
    type: 'youtube',
    chatname: 'Green Monkey',
    nameColor: '#107516',
    chatbadges: ['https://yt3.ggpht.com/VmHr8SQigQsXa4xw7pZLzxnzaOoWY8aLqBUdD0ohSTQZYA5n3ZeODIA6h9OkxN4UupD-xMGAQw=s32-c-k'],
    chatmessage: '<img class="regular-emote" src="https://yt3.ggpht.com/mOH-VvA-bB3wVX1xm0QpO61O9aqHJvpzrciu6kX_PdYCasFevfeDINFTn0yw5EvkSeysj_AzuA=w48-h48-c-k-nd" alt="stare" title="stare"><img class="regular-emote" src="https://yt3.ggpht.com/mOH-VvA-bB3wVX1xm0QpO61O9aqHJvpzrciu6kX_PdYCasFevfeDINFTn0yw5EvkSeysj_AzuA=w48-h48-c-k-nd" alt="stare" title="stare"><img class="regular-emote" src="https://yt3.ggpht.com/mOH-VvA-bB3wVX1xm0QpO61O9aqHJvpzrciu6kX_PdYCasFevfeDINFTn0yw5EvkSeysj_AzuA=w48-h48-c-k-nd" alt="stare" title="stare">',
    chatimg: 'https://yt4.ggpht.com/tNDmCXDa_lp98-5guXBtMwuiRM-DLER44mcLbfOcguZjHffkHAMsmpimbyzjN7mBj7QH9XmiPA=s256-c-k-c0x00ffffff-no-rj',
    membership: 'MEMBERSHIP',
    sourceName: 'DrDisRespect',
    sourceImg: 'https://yt3.ggpht.com/_0_SuenjzMocr2OTOHbGjEin5FcHOy-vRroLcEZtj0WfUMEQXVQqbtEuRaa-tIewyjbAkffR=s88-c-k-c0x00ffffff-no-rj'
  }),
  () => ({
    type: 'youtube',
    chatname: 'Gift Giver',
    chatmessage: '<i>Sent 10 TheBurntPeanut gift memberships</i>',
    chatimg: 'https://yt4.ggpht.com/ytc/AIdro_n6ZBBa_3wssvZ-3uYejR-pYif7bZ3F-sJr33JSyktwwYCCLRkkFCHIjZW7Up1yAzVU4w=s256-c-k-c0x00ffffff-no-rj',
    hasDonation: '10 Gifted',
    donoValue: 50,
    membership: 'SPONSORSHIP',
    event: 'sponsorship',
    title: 'DONATION',
    sourceName: 'TheBurntPeanut',
    sourceImg: 'https://yt3.ggpht.com/VKb63ulooe-XLiGFOnqqQiPO-dUflrqgLioSyERPyuBTqQ4_m5H1_-9JfhtoM7_sPkYBqqKQjQ=s88-c-k-c0x00ffffff-no-rj'
  }),
  () => ({
    type: 'youtube',
    chatname: 'Gift Recipient',
    chatmessage: '<i>received a gift membership by Ali G</i>',
    chatimg: 'https://yt4.ggpht.com/471qNrf01DUBIQEQHh4Hlny3JXyawMroXqaOPzBmtrvUHhwiJ2L26LbFxAPOeNUpIvOHB4Y0_w=s256-c-k-c0x00ffffff-no-rj',
    event: 'giftredemption',
    sourceName: 'TheBurntPeanut',
    sourceImg: 'https://yt3.ggpht.com/VKb63ulooe-XLiGFOnqqQiPO-dUflrqgLioSyERPyuBTqQ4_m5H1_-9JfhtoM7_sPkYBqqKQjQ=s88-c-k-c0x00ffffff-no-rj'
  }),
  () => ({
    type: 'youtube',
    chatname: 'Board Member',
    nameColor: '#107516',
    chatbadges: ['https://yt3.ggpht.com/xMtfL2zCOJLIkmWzToUm1Ol_-_b0RhhC5UqxYHdO3UOflOSveKOADd1PD9PBWyNvpsVwNqxN8YM=s32-c-k'],
    chatmessage: 'thank you mr bungus for all the silly dreams',
    chatimg: 'https://yt4.ggpht.com/ytc/AIdro_lbsPbvnSYefsc_2CWUuszhQuD2YW4sx4fTSQUD0n8BNaS1=s256-c-k-c0x00ffffff-no-rj',
    membership: 'Bungulator Board Member',
    subtitle: '2 months',
    sourceName: 'TheBurntPeanut',
    sourceImg: 'https://yt3.ggpht.com/VKb63ulooe-XLiGFOnqqQiPO-dUflrqgLioSyERPyuBTqQ4_m5H1_-9JfhtoM7_sPkYBqqKQjQ=s88-c-k-c0x00ffffff-no-rj'
  }),
  () => ({
    type: 'youtube',
    chatname: 'Road Tripper',
    chatmessage: 'Thank you for providing prime content during prime gaming time while i drive home from a camping trip. Love u fatass',
    chatimg: 'https://yt4.ggpht.com/ytc/AIdro_kx7LRXG9JxEQPwGG5Y-3-amHKIcX2nDJF5PElO758mf4e-_81WiP_1aIdW3MoO0j1Pgg=s256-c-k-c0x00ffffff-no-rj',
    hasDonation: 'US$4.99',
    sourceName: 'TheBurntPeanut',
    sourceImg: 'https://yt3.ggpht.com/VKb63ulooe-XLiGFOnqqQiPO-dUflrqgLioSyERPyuBTqQ4_m5H1_-9JfhtoM7_sPkYBqqKQjQ=s88-c-k-c0x00ffffff-no-rj',
    title: 'DONATION'
  }),
  () => ({
    type: 'twitch',
    chatname: 'BobTheBuilder',
    chatmessage: 'Thanks for the stream! Here are some bits ✨',
    chatimg: 'https://static-cdn.jtvnw.net/jtv_user_pictures/52f459a5-7f13-4430-8684-b6b43d1e6bba-profile_image-50x50.png',
    badges: { moderator: '1' },
    chatbadges: ['https://socialstream.ninja/icons/announcement.png'],
    bits: 500,
    isModerator: true
  }),
  () => ({
    type: 'twitch',
    chatname: 'VDO.Ninja',
    chatmessage: '<img src="https://github.com/steveseguin/social_stream/raw/main/icons/icon-128.png" alt="icon"> 😁 🇨🇦 https://vdo.ninja/',
    chatimg: 'https://socialstream.ninja/media/sampleavatar.png',
    vip: true,
    chatbadges: ['https://socialstream.ninja/icons/bot.png', 'https://socialstream.ninja/icons/announcement.png']
  }),
  () => ({
    type: 'kick',
    chatname: `KickSubscriber${Math.floor(Math.random() * 900) + 100}`,
    chatmessage: 'Loving the overlay tonight, keep the games coming!',
    chatimg: 'https://files.kick.com/profile-images/default-avatar.png',
    chatbadges: ['https://files.kick.com/badges/subscriber.png']
  }),
  () => ({
    type: 'kick',
    chatname: 'KickSupporter',
    chatmessage: 'Dropped a few Kicks to keep the hype rolling!',
    chatimg: '',
    hasDonation: '25 Kicks',
    event: 'supporter'
  })
];

const AVATAR_FALLBACK_SRC = './sources/images/unknown.png';

let lastTestMessageSignature = null;

const PLATFORM_ICON_MAP = {
  youtube: './sources/images/youtube.png',
  youtubeshorts: './sources/images/youtubeshorts.png',
  twitch: './sources/images/twitch.png',
  tiktok: './sources/images/tiktok.png',
  kick: './sources/images/kick.png',
  discord: './sources/images/discord.png',
  facebook: './sources/images/facebook.png',
  zoom: './sources/images/zoom.png',
  slack: './sources/images/slack.png',
  socialstream: './sources/images/socialstream.png',
  default: './sources/images/default.png'
};

const PLATFORM_LABEL_MAP = {
  youtube: 'YouTube',
  youtubeshorts: 'YouTube Shorts',
  twitch: 'Twitch',
  tiktok: 'TikTok',
  kick: 'Kick',
  discord: 'Discord',
  facebook: 'Facebook',
  zoom: 'Zoom',
  slack: 'Slack'
};

const BADGE_FLAG_LABELS = {
  moderator: 'Moderator',
  mod: 'Moderator',
  vip: 'VIP',
  subscriber: 'Subscriber',
  founder: 'Founder',
  broadcaster: 'Host',
  staff: 'Staff'
};
const ALLOWED_ACTIVITY_TAGS = new Set(['a', 'b', 'strong', 'i', 'em', 'u', 's', 'br', 'span', 'small', 'code', 'img']);
const ALLOWED_ACTIVITY_ATTRS = {
  a: new Set(['href', 'target', 'rel', 'title']),
  img: new Set(['src', 'alt', 'title', 'class', 'loading', 'decoding']),
  span: new Set(['class']),
  b: new Set(['class']),
  strong: new Set(['class']),
  i: new Set(['class']),
  em: new Set(['class']),
  u: new Set(['class']),
  s: new Set(['class']),
  small: new Set(['class']),
  code: new Set(['class'])
};

const activityEntries = [];
const activityById = new Map();

const activityState = {
  filters: {
    donationsOnly: false
  },
  ttsEnabled: false,
  fallbackFullscreen: false,
  lastSpokenId: null
};

const speechSupported = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
const donationsFilterKey = 'activity.filter.donationsOnly';
const ttsEnabledKey = 'activity.tts.enabled';
const storagePrefix = 'ssn-lite::';
const ttsEnabledStorageKey = `${storagePrefix}${ttsEnabledKey}`;

function sanitizeRenderableUrl(value, { allowDataImage = false, allowRelative = false } = {}) {
  const raw = String(value || '').trim();
  if (!raw) {
    return '';
  }

  if (allowRelative && /^(?:\/|\.\/|\.\.\/)/.test(raw)) {
    return raw;
  }

  if (allowDataImage && /^data:image\/(?:png|jpe?g|gif|webp|avif);base64,[a-z0-9+/=\s]+$/i.test(raw)) {
    return raw.replace(/\s+/g, '');
  }

  try {
    const parsed = new URL(raw, window.location.href);
    const protocol = (parsed.protocol || '').toLowerCase();
    if (protocol === 'http:' || protocol === 'https:') {
      return parsed.href;
    }
  } catch (err) {
    return '';
  }
  return '';
}

function sanitizeClassValue(value) {
  if (!value) {
    return '';
  }
  return String(value)
    .split(/\s+/)
    .filter((token) => /^[a-z0-9_-]+$/i.test(token))
    .join(' ');
}

function sanitizeActivityHtml(input) {
  if (input === null || input === undefined) {
    return '';
  }
  const html = String(input);
  if (!html.trim()) {
    return '';
  }

  const template = document.createElement('template');
  template.innerHTML = html;

  const sanitizeNode = (root) => {
    const children = Array.from(root.childNodes);
    children.forEach((node) => {
      if (node.nodeType === Node.COMMENT_NODE) {
        node.remove();
        return;
      }
      if (node.nodeType !== Node.ELEMENT_NODE) {
        return;
      }

      const tag = node.tagName.toLowerCase();
      if (!ALLOWED_ACTIVITY_TAGS.has(tag)) {
        const replacement = document.createTextNode(node.textContent || '');
        node.replaceWith(replacement);
        return;
      }

      const allowedAttrs = ALLOWED_ACTIVITY_ATTRS[tag] || new Set();
      Array.from(node.attributes).forEach((attr) => {
        const name = attr.name.toLowerCase();
        const value = attr.value || '';

        if (!allowedAttrs.has(name) || name.startsWith('on') || name === 'style' || name === 'srcdoc') {
          node.removeAttribute(attr.name);
          return;
        }

        if (name === 'href') {
          const safeHref = sanitizeRenderableUrl(value, { allowRelative: true });
          if (!safeHref) {
            node.removeAttribute('href');
          } else {
            node.setAttribute('href', safeHref);
          }
          return;
        }

        if (name === 'src') {
          const safeSrc = sanitizeRenderableUrl(value, { allowDataImage: true, allowRelative: true });
          if (!safeSrc) {
            node.removeAttribute('src');
          } else {
            node.setAttribute('src', safeSrc);
          }
          return;
        }

        if (name === 'target') {
          const normalizedTarget = value.toLowerCase();
          node.setAttribute('target', normalizedTarget === '_blank' ? '_blank' : '_self');
          return;
        }

        if (name === 'class') {
          const safeClass = sanitizeClassValue(value);
          if (safeClass) {
            node.setAttribute('class', safeClass);
          } else {
            node.removeAttribute('class');
          }
          return;
        }

        if (name === 'loading') {
          const normalizedLoading = value.toLowerCase();
          if (!['lazy', 'eager', 'auto'].includes(normalizedLoading)) {
            node.removeAttribute('loading');
          }
          return;
        }

        if (name === 'decoding') {
          const normalizedDecoding = value.toLowerCase();
          if (!['sync', 'async', 'auto'].includes(normalizedDecoding)) {
            node.removeAttribute('decoding');
          }
        }
      });

      if (tag === 'a') {
        const target = (node.getAttribute('target') || '').toLowerCase();
        if (target === '_blank') {
          node.setAttribute('rel', 'noopener noreferrer');
        } else {
          node.removeAttribute('rel');
        }
      }

      if (tag === 'img' && !node.getAttribute('src')) {
        node.remove();
        return;
      }

      sanitizeNode(node);
    });
  };

  sanitizeNode(template.content);
  return template.innerHTML;
}

function updateSessionStatus(message, tone = 'info', { html = false } = {}) {
  const target = elements.sessionStatus;
  if (!target) return;
  if (!message) {
    target.hidden = true;
    target.removeAttribute('data-tone');
    target.innerHTML = '';
    return;
  }

  target.hidden = false;
  if (html) {
    target.innerHTML = message;
  } else {
    target.textContent = message;
  }
  target.dataset.tone = tone;
}

function sessionUrl(sessionId, toggleState = overlayToggleState) {
  if (!sessionId) {
    return '#';
  }
  const url = new URL('./index.html', window.location.href);
  url.searchParams.set('view', 'activity');
  url.searchParams.set('embed', '1');
  url.searchParams.set('session', sessionId);
  if (scopeParam) {
    url.searchParams.set('syncscope', scopeParam);
  }
  if (!toggleState || toggleState.transparent) {
    url.searchParams.set('transparent', '1');
  }
  if (activityProfileView) {
    url.searchParams.set('profile', activityProfileView);
  }
  if (activityPositionView) {
    url.searchParams.set('position', activityPositionView.token);
  }
  if (activityLimitParam !== null) {
    url.searchParams.set('max', String(activityLimit));
  }
  if (toggleState) {
    overlayToggleDefs.forEach(({ key, params }) => {
      if (toggleState[key]) {
        params.forEach((entry) => {
          if (!entry) {
            return;
          }
          const [name, value = ''] = entry.split('=');
          url.searchParams.set(name, value);
        });
      }
    });
  }
  return url.toString();
}

function updateSessionLink(sessionId) {
  if (!elements.sessionOpen) {
    return;
  }
  const effectiveSession = sessionId || messenger.getSessionId() || (elements.sessionInput?.value || '').trim();
  if (!effectiveSession) {
    elements.sessionOpen.href = '#';
    delete elements.sessionOpen.dataset.sessionId;
    return;
  }
  const dockLink = sessionUrl(effectiveSession);
  elements.sessionOpen.href = dockLink;
  elements.sessionOpen.dataset.sessionId = effectiveSession;
}

function handleOverlayToggleChange(key, checked) {
  overlayToggleState = { ...overlayToggleState, [key]: Boolean(checked) };
  storage.set(overlayToggleStorageKey, overlayToggleState);
  updateSessionLink();
}

function initOverlayToggleControls() {
  overlayToggleDefs.forEach(({ key }) => {
    const input = overlayToggleInputs[key];
    if (!input) {
      return;
    }
    input.checked = Boolean(overlayToggleState[key]);
    input.addEventListener('change', (event) => {
      handleOverlayToggleChange(key, event?.target?.checked);
    });
  });
}

function setSessionIndicator(state, label) {
  const indicator = elements.sessionIndicator;
  if (!indicator) return;
  indicator.dataset.state = state || 'idle';
  const sr = indicator.querySelector('.sr-only');
  if (sr) {
    sr.textContent = label || `Session ${state || 'idle'}`;
  }
}

function startSession(sessionId) {
  let value = (sessionId || elements.sessionInput.value || '').trim();
  if (!value) {
    value = randomSessionId();
    if (elements.sessionInput) {
      elements.sessionInput.value = value;
    }
  }

  const previous = messenger.getSessionId();

  storage.set(sessionKey, value);
  messenger.setSessionId(value);

  if (elements.sessionTest) {
    elements.sessionTest.disabled = !value;
  }

  updateSessionLink(value);

  setSessionIndicator('ready', 'Overlay link ready');
  updateSessionStatus('');

  const sessionChanged = !previous || previous !== value;

  if (sessionChanged) {
    addActivity({
      plugin: 'system',
      message: `Session set to ${safeHtml(value)}`,
      timestamp: Date.now()
    });
  }

  if (sessionChanged) {
    notifyPluginsOfSession(value);
  }
}

function handleCopyLink() {
  const sessionId = messenger.getSessionId() || (elements.sessionInput.value || '').trim();
  if (!sessionId) {
    updateSessionStatus('Start a session before copying the overlay link.', 'warn');
    return;
  }
  const url = sessionUrl(sessionId);
  const safeLink = safeHtml(url);
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url)
      .then(() => {
        updateSessionStatus(
          `Overlay link copied. <a href="${safeLink}" target="_blank" rel="noopener">Open chat overlay</a>.`,
          'success',
          { html: true }
        );
      })
      .catch(() => {
        updateSessionStatus(
          `Clipboard copy failed. Use this link instead: <a href="${safeLink}" target="_blank" rel="noopener">${safeLink}</a>`,
          'warn',
          { html: true }
        );
      });
  } else {
    updateSessionStatus(
      `Copy this link manually: <a href="${safeLink}" target="_blank" rel="noopener">${safeLink}</a>`,
      'info',
      { html: true }
    );
  }
}

function addActivity(entry) {
  const normalized = normalizeActivityEntry(entry);
  if (!normalized) {
    debugActivityTrace('Activity entry dropped', { entry: snapshotActivityEntryForDebug(entry) });
    return;
  }

  debugActivityTrace('Activity entry accepted', snapshotActivityEntryForDebug(normalized));

  if (normalized.id && activityById.has(normalized.id)) {
    const existingIndex = activityEntries.findIndex((item) => item.id === normalized.id);
    if (existingIndex >= 0) {
      activityEntries.splice(existingIndex, 1);
    }
    activityById.delete(normalized.id);
  }

  if (normalized.deleted) {
    renderActivity();
    return;
  }

  activityEntries.unshift(normalized);
  if (normalized.id) {
    activityById.set(normalized.id, normalized);
  }

  while (activityEntries.length > activityLimit) {
    const removed = activityEntries.pop();
    if (removed && removed.id) {
      activityById.delete(removed.id);
    }
  }

  renderActivity();

  if (normalized.kind === 'event') {
    maybeSpeak(normalized);
  }
}

function normalizeActivityEntry(entry) {
  if (!entry) {
    debugActivityTrace('normalizeActivityEntry: empty entry', entry);
    return null;
  }

  const timestamp = entry.timestamp || Date.now();
  const kind = entry.kind || inferEntryKind(entry);

  if (kind === 'event') {
    const payload = entry.payload || entry.messageData || entry.detail || entry;
    if (!payload || typeof payload !== 'object') {
      debugActivityTrace('normalizeActivityEntry: invalid event payload', { entry: snapshotActivityEntryForDebug(entry) });
      return null;
    }
    const isDeleteEvent = isDeletionEvent(payload);
    if (!debugEnabled && !isDeleteEvent && !isDisplayableMessage(payload)) {
      return null;
    }
    if (debugEnabled && !isDeleteEvent && !isDisplayableMessage(payload)) {
      debugActivityTrace(
        'normalizeActivityEntry: payload filtered (not displayable)',
        { entry: snapshotActivityEntryForDebug(entry), payload: sanitizePayloadForDebug(payload) }
      );
      return null;
    }

    const incomingId = entry.id || payload.id || payload.messageId || payload.msgId || '';
    if (isDeleteEvent && !incomingId) {
      debugActivityTrace('normalizeActivityEntry: deletion payload dropped (missing id)', {
        entry: snapshotActivityEntryForDebug(entry),
        payload: sanitizePayloadForDebug(payload)
      });
      return null;
    }

    const id = incomingId || `event-${timestamp}-${Math.floor(Math.random() * 1000)}`;
    const normalizedPayload = { ...payload };
    if (!normalizedPayload.timestamp) {
      normalizedPayload.timestamp = timestamp;
    }

    return {
      id,
      kind: 'event',
      plugin: normalizePlugin(entry.plugin, normalizedPayload.type),
      timestamp,
      deleted: isDeleteEvent,
      payload: normalizedPayload
    };
  }

  const message = entry.message || '';
  const detail = entry.detail;
  const isDebugEntry = kind === 'debug' || (message && message.includes('[debug]'));

  const entryKind = isDebugEntry ? 'debug' : (kind === 'error' ? 'error' : 'status');

  if (!debugEnabled && entryKind === 'debug') {
    return null;
  }
  if (!debugEnabled && entryKind === 'status') {
    return null;
  }

  if (entryKind === 'debug' && debugEnabled) {
    debugActivityTrace('normalizeActivityEntry: debug entry accepted', { entry: snapshotActivityEntryForDebug(entry) });
  }

  const id = entry.id || `log-${timestamp}-${Math.floor(Math.random() * 1000)}`;
  return {
    id,
    kind: entryKind,
    plugin: entry.plugin || 'system',
    timestamp,
    message,
    detail
  };
}

function inferEntryKind(entry) {
  if (!entry) {
    return 'status';
  }
  if (entry.kind) {
    return entry.kind;
  }
  if (entry.payload || entry.messageData) {
    return 'event';
  }
  if (entry.message && entry.message.includes('[debug]')) {
    return 'debug';
  }
  return 'status';
}

function normalizePlugin(plugin, type) {
  if (plugin) {
    return plugin;
  }
  if (type) {
    return String(type).toLowerCase();
  }
  return 'system';
}

function shouldDisplayEntry(entry) {
  if (!entry) {
    return false;
  }
  if (entry.kind === 'event') {
    if (activityState.filters.donationsOnly && !eventHasDonation(entry.payload)) {
      return false;
    }
    return true;
  }
  if (entry.kind === 'error') {
    return true;
  }
  return debugEnabled;
}

function renderActivity() {
  if (!elements.activityLog) return;
  elements.activityLog.innerHTML = '';

  const visibleEntries = activityEntries.filter(shouldDisplayEntry);
  if (!reverseActivityView) {
    visibleEntries.reverse();
  }

  if (!visibleEntries.length) {
    const empty = document.createElement('p');
    empty.className = 'activity-empty';
    empty.textContent = 'No activity yet.';
    elements.activityLog.appendChild(empty);
    return;
  }

  const fragment = document.createDocumentFragment();
  visibleEntries.forEach((entry) => {
    if (entry.kind === 'event') {
      fragment.appendChild(buildActivityNode(entry));
    } else {
      fragment.appendChild(buildStatusNode(entry));
    }
  });

  elements.activityLog.appendChild(fragment);
}

function buildActivityNode(entry) {
  const payload = entry.payload || {};
  const platformIcon = getPlatformIcon(payload.type);
  const platformLabel = getPlatformLabel(payload.type);

  const card = document.createElement('article');
  card.className = 'activity-item';
  card.dataset.platform = (payload.type || 'unknown').toLowerCase();
  card.dataset.eventType = (payload.event || 'message').toLowerCase();

  if (payload.highlightColor) {
    card.style.setProperty('--activity-accent', payload.highlightColor);
  }

  const avatar = createAvatarNode(payload, platformIcon);
  card.appendChild(avatar);

  const body = document.createElement('div');
  body.className = 'activity-item__body';

  const meta = document.createElement('div');
  meta.className = 'activity-item__meta';

  const iconImg = document.createElement('img');
  iconImg.className = 'activity-item__platform-icon';
  iconImg.src = platformIcon;
  iconImg.alt = `${platformLabel} icon`;
  iconImg.loading = 'lazy';
  iconImg.decoding = 'async';
  meta.appendChild(iconImg);

  const platformSpan = document.createElement('span');
  platformSpan.className = 'activity-item__platform';
  platformSpan.textContent = platformLabel;
  meta.appendChild(platformSpan);

  const timeSpan = document.createElement('time');
  timeSpan.className = 'activity-item__time';
  timeSpan.dateTime = new Date(entry.timestamp).toISOString();
  timeSpan.textContent = formatTime(entry.timestamp);
  meta.appendChild(timeSpan);

  body.appendChild(meta);

  const headline = document.createElement('div');
  headline.className = 'activity-item__headline';

  const name = document.createElement('span');
  name.className = 'activity-item__name';
  name.textContent = payload.chatname || 'Unknown';
  if (payload.nameColor) {
    name.style.color = payload.nameColor;
  }
  headline.appendChild(name);

  const badgeContainer = renderBadgeElements(payload);
  if (badgeContainer) {
    headline.appendChild(badgeContainer);
  }

  body.appendChild(headline);

  if (payload.subtitle) {
    const subtitle = document.createElement('div');
    subtitle.className = 'activity-item__subtitle';
    subtitle.textContent = payload.subtitle;
    body.appendChild(subtitle);
  }

  const chips = buildChipRow(payload);
  if (chips) {
    body.appendChild(chips);
  }

  if (payload.chatmessage) {
    const messageEl = document.createElement('div');
    messageEl.className = 'activity-item__message';
    if (payload.textColor) {
      messageEl.style.color = payload.textColor;
    }
    if (payload.backgroundColor) {
      messageEl.style.background = payload.backgroundColor;
    }
    messageEl.innerHTML = sanitizeActivityHtml(payload.chatmessage);
    body.appendChild(messageEl);
  }

  if (payload.contentimg) {
    const safeMediaSrc = sanitizeRenderableUrl(payload.contentimg, { allowDataImage: true, allowRelative: true });
    if (safeMediaSrc) {
      const media = document.createElement('img');
      media.className = 'activity-item__media';
      media.src = safeMediaSrc;
      media.alt = payload.chatname ? `${payload.chatname} shared content` : 'Shared content';
      media.loading = 'lazy';
      media.decoding = 'async';
      body.appendChild(media);
    }
  }

  card.appendChild(body);
  return card;
}

function buildStatusNode(entry) {
  const row = document.createElement('div');
  const classes = ['activity-status'];
  if (entry.kind === 'error') {
    classes.push('activity-status--error');
    row.setAttribute('role', 'alert');
  } else if (entry.kind === 'debug') {
    classes.push('activity-status--debug');
  }
  row.className = classes.join(' ');

  const meta = document.createElement('div');
  meta.className = 'activity-status__meta';
  meta.textContent = `${formatTime(entry.timestamp)} · ${entry.plugin || 'system'}`;
  row.appendChild(meta);

  const message = document.createElement('div');
  message.className = 'activity-status__message';
  message.textContent = entry.message || '';
  row.appendChild(message);

  if (entry.detail !== undefined) {
    const detail = document.createElement('pre');
    detail.className = 'activity-status__detail';
    detail.textContent = typeof entry.detail === 'string' ? entry.detail : JSON.stringify(entry.detail, null, 2);
    row.appendChild(detail);
  }

  return row;
}

function createAvatarNode(payload, fallbackIcon) {
  const wrapper = document.createElement('div');
  wrapper.className = 'activity-item__avatar';

  const safeAvatarSrc = sanitizeRenderableUrl(payload.chatimg, { allowDataImage: true, allowRelative: true });
  if (safeAvatarSrc) {
    const img = document.createElement('img');
    img.alt = payload.chatname ? `${payload.chatname} avatar` : 'Avatar';
    img.loading = 'lazy';
    img.decoding = 'async';
    img.onerror = () => {
      img.onerror = null;
      wrapper.classList.add('activity-item__avatar--fallback');
      img.src = AVATAR_FALLBACK_SRC;
    };
    img.src = safeAvatarSrc;
    wrapper.appendChild(img);
    return wrapper;
  }

  const name = (payload.chatname || '').trim();
  if (name) {
    const initial = document.createElement('span');
    initial.className = 'activity-item__avatar-initial';
    initial.textContent = name[0].toUpperCase();
    wrapper.appendChild(initial);
    return wrapper;
  }

  const icon = document.createElement('img');
  icon.src = fallbackIcon;
  icon.alt = 'Platform';
  icon.loading = 'lazy';
  icon.decoding = 'async';
  wrapper.classList.add('activity-item__avatar--fallback');
  wrapper.appendChild(icon);
  return wrapper;
}

function renderBadgeElements(payload) {
  const nodes = [];

  if (Array.isArray(payload.chatbadges)) {
    payload.chatbadges.forEach((badge) => {
      const node = createBadgeNode(badge);
      if (node) {
        nodes.push(node);
      }
    });
  }

  const flags = [];
  if (payload.badges && typeof payload.badges === 'object') {
    Object.keys(payload.badges).forEach((flag) => flags.push(flag));
  }
  if (payload.vip) {
    flags.push('vip');
  }

  const uniqueFlags = Array.from(new Set(flags));
  uniqueFlags.forEach((flag) => {
    const label = BADGE_FLAG_LABELS[flag];
    if (label) {
      const flagChip = document.createElement('span');
      flagChip.className = 'activity-item__badge-flag';
      flagChip.textContent = label;
      nodes.push(flagChip);
    }
  });

  if (!nodes.length) {
    return null;
  }

  const container = document.createElement('div');
  container.className = 'activity-item__badges';
  nodes.forEach((node) => container.appendChild(node));
  return container;
}

function createBadgeNode(badge) {
  if (!badge) {
    return null;
  }

  if (typeof badge === 'string') {
    const safeBadgeSrc = sanitizeRenderableUrl(badge, { allowDataImage: true, allowRelative: true });
    if (!safeBadgeSrc) {
      return null;
    }
    const img = document.createElement('img');
    img.className = 'activity-item__badge';
    img.src = safeBadgeSrc;
    img.alt = 'Badge';
    img.loading = 'lazy';
    img.decoding = 'async';
    return img;
  }

  if (typeof badge === 'object') {
    if (badge.url || badge.image) {
      const safeBadgeSrc = sanitizeRenderableUrl(badge.url || badge.image, { allowDataImage: true, allowRelative: true });
      if (!safeBadgeSrc) {
        return null;
      }
      const img = document.createElement('img');
      img.className = 'activity-item__badge';
      img.src = safeBadgeSrc;
      img.alt = badge.alt || 'Badge';
      img.loading = 'lazy';
      img.decoding = 'async';
      return img;
    }
    if (badge.type === 'svg' && badge.html) {
      return null;
    }
  }

  return null;
}

function buildChipRow(payload) {
  const chips = [];

  if (payload.hasDonation) {
    chips.push({ className: 'activity-chip activity-chip--donation', label: payload.hasDonation });
  } else if (payload.donationAmount) {
    const amount = payload.donationCurrency ? `${payload.donationAmount} ${payload.donationCurrency}` : payload.donationAmount;
    chips.push({ className: 'activity-chip activity-chip--donation', label: amount });
  }

  if (payload.bits) {
    chips.push({ className: 'activity-chip activity-chip--bits', label: `${payload.bits} bits` });
  }

  if (payload.membership) {
    chips.push({ className: 'activity-chip activity-chip--membership', label: payload.membership });
  }

  const eventLabel = formatEventLabel(payload.event);
  if (eventLabel && eventLabel !== 'Message' && !chips.some((chip) => chip.label === eventLabel)) {
    chips.push({ className: 'activity-chip activity-chip--event', label: eventLabel });
  }

  if (payload.question) {
    chips.push({ className: 'activity-chip activity-chip--flag', label: 'Question' });
  }

  if (payload.private) {
    chips.push({ className: 'activity-chip activity-chip--flag', label: 'Private' });
  }

  if (payload.vip && !chips.some((chip) => chip.label === 'VIP')) {
    chips.push({ className: 'activity-chip activity-chip--flag', label: 'VIP' });
  }

  if (payload.badges && typeof payload.badges === 'object') {
    Object.keys(payload.badges).forEach((flag) => {
      const label = BADGE_FLAG_LABELS[flag];
      if (label && !chips.some((chip) => chip.label === label)) {
        chips.push({ className: 'activity-chip activity-chip--flag', label });
      }
    });
  }

  if (!chips.length) {
    return null;
  }

  const container = document.createElement('div');
  container.className = 'activity-item__chips';
  chips.forEach(({ className, label }) => {
    const span = document.createElement('span');
    span.className = className || 'activity-chip';
    span.textContent = label;
    container.appendChild(span);
  });
  return container;
}

function eventHasDonation(payload) {
  if (!payload) {
    return false;
  }
  if (payload.hasDonation && String(payload.hasDonation).trim()) {
    return true;
  }
  if (payload.donationAmount && String(payload.donationAmount).trim()) {
    return true;
  }
  if (payload.donationCurrency && String(payload.donationCurrency).trim()) {
    return true;
  }
  const bits = Number(payload.bits || 0);
  if (!Number.isNaN(bits) && bits > 0) {
    return true;
  }
  if (payload.membership && String(payload.membership).trim()) {
    return true;
  }
  return false;
}

function isDisplayableMessage(payload) {
  if (!payload || typeof payload !== 'object') {
    return false;
  }
  return Boolean(
    (payload.chatname && payload.chatname.toString().trim()) ||
    (payload.chatmessage && payload.chatmessage.toString().trim()) ||
    (payload.contentimg && payload.contentimg.toString().trim()) ||
    eventHasDonation(payload) ||
    (payload.subtitle && payload.subtitle.toString().trim()) ||
    (payload.question === true) ||
    (payload.vip === true)
  );
}

function formatEventLabel(value) {
  if (!value) {
    return '';
  }
  const normalized = String(value).toLowerCase();
  const map = {
    donation: 'Donation',
    bits: 'Cheer',
    cheer: 'Cheer',
    raid: 'Raid',
    host: 'Host',
    follow: 'Follow',
    subscription: 'Subscription',
    resubscription: 'Resub',
    gifted: 'Gift',
    gift: 'Gift',
    like: 'Like',
    join: 'Join',
    test: 'Test',
    message: 'Message'
  };
  if (map[normalized]) {
    return map[normalized];
  }
  return normalized.replace(/[_-]+/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

function getPlatformIcon(type) {
  const key = String(type || '').toLowerCase();
  return PLATFORM_ICON_MAP[key] || PLATFORM_ICON_MAP.default;
}

function getPlatformLabel(type) {
  const key = String(type || '').toLowerCase();
  if (PLATFORM_LABEL_MAP[key]) {
    return PLATFORM_LABEL_MAP[key];
  }
  if (!key) {
    return 'Unknown';
  }
  return key.replace(/[_-]+/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

function toPlainText(value) {
  if (!value) {
    return '';
  }
  const div = document.createElement('div');
  div.innerHTML = value;
  return div.textContent || div.innerText || '';
}

function maybeSpeak(entry) {
  if (!activityState.ttsEnabled || !speechSupported) {
    return;
  }
  if (!entry || entry.kind !== 'event') {
    return;
  }
  if (activityState.lastSpokenId === entry.id) {
    return;
  }

  const text = buildSpeechText(entry.payload);
  if (!text) {
    return;
  }

  try {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
    activityState.lastSpokenId = entry.id;
  } catch (err) {
    console.warn('Speech synthesis failed', err);
  }
}

function buildSpeechText(payload) {
  if (!payload) {
    return '';
  }
  const name = payload.chatname || 'Someone';
  if (payload.hasDonation) {
    return `${name} sent a donation: ${payload.hasDonation}.`;
  }
  if (payload.donationAmount) {
    const amount = payload.donationCurrency ? `${payload.donationAmount} ${payload.donationCurrency}` : payload.donationAmount;
    return `${name} sent a donation of ${amount}.`;
  }
  const bits = Number(payload.bits || 0);
  if (!Number.isNaN(bits) && bits > 0) {
    return `${name} cheered ${bits} bits.`;
  }
  if (payload.membership) {
    return `${name} membership: ${payload.membership}.`;
  }
  if (payload.chatmessage) {
    const message = toPlainText(payload.chatmessage).trim();
    if (message) {
      return `${name} said: ${message}`;
    }
  }
  if (payload.contentimg) {
    return `${name} shared an image.`;
  }
  const eventLabel = formatEventLabel(payload.event);
  if (eventLabel && eventLabel !== 'Message') {
    return `${name} triggered ${eventLabel}.`;
  }
  return '';
}

function clearActivity() {
  activityEntries.length = 0;
  activityById.clear();
  activityState.lastSpokenId = null;
  if (speechSupported) {
    try {
      window.speechSynthesis.cancel();
    } catch (err) {
      console.warn('Failed to cancel speech synthesis', err);
    }
  }
  renderActivity();
}

function setDonationsOnly(enabled, { persist = true } = {}) {
  activityState.filters.donationsOnly = Boolean(enabled);
  if (persist) {
    storage.set(donationsFilterKey, activityState.filters.donationsOnly);
  }
  if (elements.activityFilterDonations) {
    elements.activityFilterDonations.checked = activityState.filters.donationsOnly;
  }
  renderActivity();
}

function setTtsEnabled(enabled, { persist = true } = {}) {
  const intended = Boolean(enabled);
  if (!speechSupported) {
    activityState.ttsEnabled = false;
    if (elements.activityToggleTts) {
      elements.activityToggleTts.checked = false;
      elements.activityToggleTts.disabled = true;
    }
    if (persist) {
      storage.set(ttsEnabledKey, false);
    }
    return;
  }

  activityState.ttsEnabled = intended;
  if (!activityState.ttsEnabled) {
    activityState.lastSpokenId = null;
    try {
      window.speechSynthesis.cancel();
    } catch (err) {
      console.warn('Speech synthesis cancel failed', err);
    }
  }
  if (elements.activityToggleTts) {
    elements.activityToggleTts.checked = activityState.ttsEnabled;
  }
  if (persist) {
    storage.set(ttsEnabledKey, activityState.ttsEnabled);
  }
}

function isDeletionEvent(payload) {
  if (!payload || typeof payload !== 'object') {
    return false;
  }

  if (payload.deleted === true || payload.isDeleted === true || payload.remove === true) {
    return true;
  }

  const eventValue = String(payload.event || payload.action || '').toLowerCase();
  if (eventValue && ['delete', 'deleted', 'remove', 'removed', 'message_deleted', 'message-deleted'].includes(eventValue)) {
    return true;
  }

  return false;
}

function parseStoredBoolean(rawValue, fallback = false) {
  if (typeof rawValue === 'boolean') {
    return rawValue;
  }
  if (typeof rawValue === 'string') {
    const trimmed = rawValue.trim();
    if (!trimmed) {
      return fallback;
    }
    try {
      return Boolean(JSON.parse(trimmed));
    } catch (_) {
      const normalized = trimmed.toLowerCase();
      if (['1', 'true', 'on', 'yes'].includes(normalized)) {
        return true;
      }
      if (['0', 'false', 'off', 'no'].includes(normalized)) {
        return false;
      }
    }
    return fallback;
  }
  if (rawValue === null || rawValue === undefined) {
    return fallback;
  }
  return Boolean(rawValue);
}

function handleTtsStorageSync(event) {
  if (!event || event.key !== ttsEnabledStorageKey) {
    return;
  }
  const nextValue = parseStoredBoolean(event.newValue, false);
  setTtsEnabled(nextValue, { persist: false });
}

function toggleActivityMenu(forceState) {
  if (!elements.activityMenuToggle || !elements.activityMenu) {
    return;
  }
  const expanded = elements.activityMenuToggle.getAttribute('aria-expanded') === 'true';
  const next = typeof forceState === 'boolean' ? forceState : !expanded;
  elements.activityMenuToggle.setAttribute('aria-expanded', String(next));
  elements.activityMenu.hidden = !next;

  if (next) {
    document.addEventListener('mousedown', handleGlobalMenuClose, { capture: true });
    document.addEventListener('keydown', handleMenuKeydown);
    const firstItem = elements.activityMenu.querySelector('[role="menuitem"]');
    const focusTarget = firstItem || elements.activityMenu;
    focusTarget?.focus({ preventScroll: true });
  } else {
    document.removeEventListener('mousedown', handleGlobalMenuClose, { capture: true });
    document.removeEventListener('keydown', handleMenuKeydown);
  }
}

function handleGlobalMenuClose(event) {
  if (!elements.activityMenu || !elements.activityMenuToggle) {
    return;
  }
  if (elements.activityMenu.contains(event.target) || elements.activityMenuToggle.contains(event.target)) {
    return;
  }
  toggleActivityMenu(false);
}

function handleMenuKeydown(event) {
  if (event.key === 'Escape' && elements.activityMenuToggle?.getAttribute('aria-expanded') === 'true') {
    event.preventDefault();
    toggleActivityMenu(false);
    elements.activityMenuToggle?.focus({ preventScroll: true });
  }
}

function isFullscreenActive() {
  if (document.fullscreenElement) {
    return document.fullscreenElement === elements.activitySection;
  }
  return Boolean(activityState.fallbackFullscreen);
}

function updateFullscreenControl() {
  const target = elements.activityFullscreen;
  if (!target) {
    return;
  }
  const active = isFullscreenActive();
  target.setAttribute('aria-pressed', String(active));
  target.dataset.state = active ? 'exit' : 'enter';
  target.textContent = active ? 'Exit full screen' : 'Full screen';
}

async function toggleActivityFullscreen() {
  const section = elements.activitySection;
  if (!section) {
    return;
  }

  if (document.fullscreenElement === section) {
    try {
      await document.exitFullscreen();
    } catch (err) {
      console.warn('Exit fullscreen failed', err);
    }
    return;
  }

  if (!document.fullscreenElement && section.requestFullscreen) {
    try {
      await section.requestFullscreen({ navigationUI: 'hide' });
      return;
    } catch (err) {
      console.warn('Fullscreen request failed', err);
    }
  }

  activityState.fallbackFullscreen = !activityState.fallbackFullscreen;
  section.classList.toggle('activity--expanded', activityState.fallbackFullscreen);
  document.body.classList.toggle('activity-fallback-fullscreen', activityState.fallbackFullscreen);
  updateFullscreenControl();
}

function handleFullscreenChange() {
  if (!elements.activitySection) {
    return;
  }

  if (document.fullscreenElement === elements.activitySection) {
    activityState.fallbackFullscreen = false;
    document.body.classList.remove('activity-fallback-fullscreen');
    elements.activitySection.classList.add('activity--expanded');
  } else if (!document.fullscreenElement) {
    activityState.fallbackFullscreen = false;
    document.body.classList.remove('activity-fallback-fullscreen');
    elements.activitySection.classList.remove('activity--expanded');
  }
  updateFullscreenControl();
}

function openActivityPopout() {
  try {
    const popupUrl = new URL(window.location.href);
    popupUrl.searchParams.set('focus', 'activity');
    popupUrl.searchParams.set('view', 'activity');
    window.open(popupUrl.toString(), '_blank', 'width=480,height=720,resizable=yes,scrollbars=yes');
  } catch (err) {
    console.warn('Unable to open activity pop-out', err);
  }
  toggleActivityMenu(false);
}

function applyObsDockLayout() {
  if (!document || !document.body) {
    return;
  }
  document.body.classList.add('obs-dock');

  const hideSelectors = ['.masthead', '.mobile-nav'];
  hideSelectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((node) => {
      node.setAttribute('aria-hidden', 'true');
      node.hidden = true;
    });
  });

  if (elements.sessionToggle) {
    elements.sessionToggle.hidden = true;
    elements.sessionToggle.setAttribute('aria-hidden', 'true');
  }
  if (elements.sessionAdvanced) {
    elements.sessionAdvanced.hidden = true;
  }

  const sourcesFootnote = document.querySelector('.sources__footnote');
  if (sourcesFootnote) {
    sourcesFootnote.hidden = true;
    sourcesFootnote.setAttribute('aria-hidden', 'true');
  }
}

function updateAdaptiveActivityLayout() {
  if (!document || !document.body) {
    return;
  }

  const shouldAutoAdapt = isActivityPopoutView && !activityProfileView;
  const viewportHeight = window.innerHeight || document.documentElement?.clientHeight || 0;
  const cardWidth = elements.activitySection?.clientWidth || window.innerWidth || 0;
  const compact = shouldAutoAdapt && (viewportHeight <= 760 || cardWidth <= 520);
  const inline = compact && cardWidth >= 440;

  document.body.classList.toggle('activity-auto-compact', compact);
  document.body.classList.toggle('activity-auto-inline', inline);
}

function applyActivityPopoutLayout() {
  if (!document || !document.body) {
    return;
  }
  document.body.classList.add('activity-popout');
  if (isTransparentView) {
    document.body.classList.add('activity-transparent');
  }
  if (noAvatarView) {
    document.body.classList.add('activity-noavatar');
  }
  if (activityProfileView) {
    document.body.classList.add(`activity-profile-${activityProfileView}`);
  }
  if (activityPositionView) {
    document.body.classList.add('activity-positioned');
    document.body.classList.add(`activity-position-v-${activityPositionView.vertical}`);
    document.body.classList.add(`activity-position-h-${activityPositionView.horizontal}`);
  }

  ['.masthead', '#session', '#sources', '.mobile-nav'].forEach((selector) => {
    document.querySelectorAll(selector).forEach((node) => {
      node.setAttribute('aria-hidden', 'true');
      node.hidden = true;
    });
  });

  if (elements.activityPopout) {
    elements.activityPopout.hidden = true;
    elements.activityPopout.setAttribute('aria-hidden', 'true');
  }
  if (elements.activityMenuToggle) {
    elements.activityMenuToggle.hidden = true;
    elements.activityMenuToggle.setAttribute('aria-hidden', 'true');
  }
  if (elements.activityMenu) {
    elements.activityMenu.hidden = true;
  }

  const layout = document.querySelector('main.layout');
  if (layout) {
    layout.setAttribute('data-view', 'activity');
  }

  const heading = document.getElementById('activity-heading');
  if (heading) {
    heading.textContent = 'Activity Feed';
  }

  document.title = 'Social Stream Ninja Lite - Activity Feed';
  updateAdaptiveActivityLayout();
  window.addEventListener('resize', updateAdaptiveActivityLayout, { passive: true });
}

function pickRandom(list) {
  if (!Array.isArray(list) || !list.length) {
    return null;
  }
  return list[Math.floor(Math.random() * list.length)];
}

function createTestMessage() {
  const now = Date.now();
  let attempts = 0;
  let candidate = null;
  do {
    const presetFactory = pickRandom(testMessagePresets);
    candidate = typeof presetFactory === 'function' ? presetFactory() : null;
    attempts += 1;
  } while (
    attempts < 4 &&
    candidate &&
    lastTestMessageSignature === `${candidate.type || candidate.platform || 'twitch'}|${candidate.chatname}|${candidate.chatmessage || candidate.contentimg || ''}`
  );

  const fallbackCandidate = {
    type: 'twitch',
    chatname: 'Test User',
    chatmessage: 'Hello from Social Stream test message!',
    event: 'message'
  };

  const source = candidate && typeof candidate === 'object' ? { ...candidate } : {};
  const baseCandidate = Object.keys(source).length ? source : fallbackCandidate;
  const type = baseCandidate.type || baseCandidate.platform || 'twitch';
  lastTestMessageSignature = `${type}|${baseCandidate.chatname}|${baseCandidate.chatmessage || baseCandidate.contentimg || ''}`;

  const bits = baseCandidate.bits ? Number(baseCandidate.bits) : 0;
  const donationText =
    typeof baseCandidate.hasDonation === 'string'
      ? baseCandidate.hasDonation
      : baseCandidate.hasDonation
        ? baseCandidate.donationAmount || ''
        : '';
  const event = baseCandidate.event || (bits ? 'bits' : donationText ? 'donation' : 'message');

  const rawData = {
    ...(baseCandidate.raw && typeof baseCandidate.raw === 'object' ? baseCandidate.raw : {}),
    test: true
  };

  const message = {
    ...baseCandidate,
    id: baseCandidate.id || `test-${now}-${Math.floor(Math.random() * 1000)}`,
    type,
    platform: baseCandidate.platform || type,
    chatname: baseCandidate.chatname || 'Test User',
    chatmessage: baseCandidate.chatmessage || '',
    chatimg: baseCandidate.chatimg || '',
    timestamp: now,
    event,
    textonly: Boolean(baseCandidate.textonly),
    raw: rawData
  };

  if (bits) {
    message.bits = bits;
  }
  if (donationText) {
    message.hasDonation = donationText;
  }
  if (baseCandidate.donationAmount) {
    message.donationAmount = baseCandidate.donationAmount;
  }
  if (baseCandidate.donationCurrency) {
    message.donationCurrency = baseCandidate.donationCurrency;
  }
  if (baseCandidate.membership) {
    message.membership = baseCandidate.membership;
  }
  if (baseCandidate.badges && typeof baseCandidate.badges === 'object') {
    message.badges = baseCandidate.badges;
  }
  if (Array.isArray(baseCandidate.chatbadges) && baseCandidate.chatbadges.length) {
    message.chatbadges = [...baseCandidate.chatbadges];
  }
  if (baseCandidate.nameColor) {
    message.nameColor = baseCandidate.nameColor;
  }
  if (baseCandidate.backgroundColor) {
    message.backgroundColor = baseCandidate.backgroundColor;
  }
  if (baseCandidate.highlightColor) {
    message.highlightColor = baseCandidate.highlightColor;
  }
  if (baseCandidate.subtitle) {
    message.subtitle = baseCandidate.subtitle;
  }
  if (baseCandidate.contentimg) {
    message.contentimg = baseCandidate.contentimg;
  }
  if (baseCandidate.private) {
    message.private = true;
  }
  if (baseCandidate.question) {
    message.question = true;
  }
  if (baseCandidate.vip) {
    message.vip = true;
  }
  if (baseCandidate.isModerator) {
    message.isModerator = true;
  }
  if (baseCandidate.sourceName) {
    message.sourceName = baseCandidate.sourceName;
  }
  if (baseCandidate.sourceImg) {
    message.sourceImg = baseCandidate.sourceImg;
  }
  if (baseCandidate.title) {
    message.title = baseCandidate.title;
  }
  if (baseCandidate.donoValue) {
    message.donoValue = baseCandidate.donoValue;
  }

  return message;
}

function collectRelayPayloads(input) {
  if (input === null || input === undefined) {
    return [];
  }
  if (Array.isArray(input)) {
    const merged = [];
    input.forEach((item) => {
      const results = collectRelayPayloads(item);
      if (results && results.length) {
        merged.push(...results);
      }
    });
    return merged;
  }
  if (typeof input !== 'object') {
    return [];
  }

  if ('overlayNinja' in input) {
    return collectRelayPayloads(input.overlayNinja);
  }
  if ('dataReceived' in input) {
    return collectRelayPayloads(input.dataReceived);
  }
  if ('contents' in input) {
    return collectRelayPayloads(input.contents);
  }
  if ('detail' in input) {
    const detailPayloads = collectRelayPayloads(input.detail);
    if (detailPayloads.length) {
      return detailPayloads;
    }
  }

  return [input];
}

function handleRelayMessage(message) {
  const payloads = collectRelayPayloads(message);
  if (!payloads.length) {
    return;
  }

  payloads.forEach((payload) => {
    if (!payload || typeof payload !== 'object') {
      return;
    }

    debugActivityTrace('Relay payload received', sanitizePayloadForDebug(payload));

    addActivity({
      kind: 'event',
      plugin: payload.type || payload.platform || 'system',
      payload,
      timestamp: payload.timestamp || Date.now(),
      id: payload.id
    });
  });
}

function handleSendTestMessage() {
  if (!messenger.getSessionId()) {
    updateSessionStatus('Start a session before sending a test message.', 'warn');
    return;
  }

	const message = createTestMessage();
	messenger.send(message);

	addActivity({
    plugin: 'system',
    message: `Sent test message (${message.type || 'test'})`,
    detail: message,
    timestamp: Date.now()
  });

  updateSessionStatus('Test message sent to the chat overlay.', 'success');
}

function notifyPluginsOfSession(sessionId) {
  plugins.forEach((plugin) => {
    if (typeof plugin.handleSessionStarted === 'function') {
      plugin.handleSessionStarted(sessionId);
    }
  });
}


function handleYoutubeStreamingPreferenceChange(useStreaming) {
  const nextValue = Boolean(useStreaming);
  if (nextValue === youtubeStreamingEnabled) {
    return;
  }

  youtubeStreamingEnabled = nextValue;
  storage.set(youtubeStreamingStorageKey, nextValue);
  swapYoutubePlugin(nextValue);
}

function createYoutubePluginInstance(useStreaming) {
  const PluginCtor = useStreaming ? YoutubeStreamingPlugin : YoutubePlugin;
  return new PluginCtor({
    messenger,
    emotes,
    icon: './sources/images/youtube.png',
    debug: debugEnabled,
    onActivity: addActivity,
    onStatus: ({ kind = 'debug', plugin, state }) => addActivity({ kind, plugin, message: `Status changed: ${state}`, timestamp: Date.now() }),
    autoConnect: true,
    controls: { connect: false, disconnect: true },
    useStreaming,
    onStreamingPreferenceChange: handleYoutubeStreamingPreferenceChange
  });
}

function rebuildPluginMap() {
  pluginMap.clear();
  plugins.forEach((plugin) => {
    pluginMap.set(plugin.id, plugin);
  });
}

function mountAllPlugins() {
  rebuildPluginMap();
  if (!elements.sourceList) {
    return;
  }
  elements.sourceList.innerHTML = '';
  plugins.forEach((plugin) => {
    plugin.mount(elements.sourceList);
  });
}

function swapYoutubePlugin(useStreaming) {
  const previous = pluginMap.get('youtube');
  const sessionId = messenger.getSessionId();

  if (previous) {
    try {
      previous.handleDisconnect();
    } catch (err) {
      console.error('Failed to disconnect YouTube plugin', err);
    }
  }

  const remaining = plugins.filter((plugin) => plugin.id !== 'youtube');
  const next = createYoutubePluginInstance(useStreaming);

  plugins = [next, ...remaining];
  mountAllPlugins();

  addActivity({
    plugin: 'youtube',
    message: useStreaming ? 'YouTube streaming API enabled.' : 'YouTube polling API enabled.',
    timestamp: Date.now()
  });

  if (sessionId) {
    notifyPluginsOfSession(sessionId);
  }
}

function initMobileNav() {
  const buttons = elements.mobileNavButtons || [];
  if (!buttons.length) return;

  const sections = new Map();
  let activeId = null;

  const setActive = (id) => {
    if (!id || activeId === id) return;
    activeId = id;
    buttons.forEach((button) => {
      const match = button.dataset.mobileNavTarget === id;
      button.classList.toggle('is-active', match);
      button.setAttribute('aria-pressed', String(match));
      if (match) {
        button.setAttribute('aria-current', 'page');
      } else {
        button.removeAttribute('aria-current');
      }
    });
  };

  buttons.forEach((button) => {
    const targetId = button.dataset.mobileNavTarget;
    if (!targetId) return;
    const section = document.getElementById(targetId);
    if (!section) return;
    sections.set(targetId, section);

    button.addEventListener('click', () => {
      setActive(targetId);
      section.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start'
      });
    });
  });

  if (!sections.size) return;

  const defaultTarget = buttons.find((button) => sections.has(button.dataset.mobileNavTarget));
  if (defaultTarget) {
    setActive(defaultTarget.dataset.mobileNavTarget);
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.target.id) {
          setActive(entry.target.id);
        }
      });
    }, {
      rootMargin: '-20% 0px -55% 0px',
      threshold: 0.25
    });

    sections.forEach((section) => observer.observe(section));
  }
}

async function processOAuthCallback(pluginMap) {
  const handleParams = async (params) => {
    const state = params.get('state') || '';
    const provider = state.split(':')[0];
    const plugin = provider ? pluginMap.get(provider) : null;

    if (!plugin) {
      updateSessionStatus('Received OAuth response for unknown provider.', 'warn');
      return true;
    }

    try {
      await plugin.handleOAuthCallback(params);
      addActivity({
        plugin: provider,
        message: 'OAuth authorization completed.',
        timestamp: Date.now()
      });
    } catch (err) {
      console.error('OAuth handling failed', err);
      updateSessionStatus(err.message || 'OAuth handling failed.', 'warn');
    }

    return true;
  };

  if (window.location.search) {
    const searchParams = new URLSearchParams(window.location.search.slice(1));
    if (searchParams.has('code') && searchParams.has('state')) {
      await handleParams(searchParams);
      const url = new URL(window.location.href);
      url.hash = '';
      ['code', 'scope', 'state'].forEach((key) => url.searchParams.delete(key));
      const remainingSearch = url.searchParams.toString();
      const newUrl = remainingSearch ? `${url.pathname}?${remainingSearch}` : url.pathname;
      history.replaceState(null, '', newUrl);
      return;
    }
  }

  if (!window.location.hash) return;
  const params = new URLSearchParams(window.location.hash.slice(1));
  if (!params.has('access_token')) return;

  await handleParams(params);
  history.replaceState(null, '', window.location.pathname + window.location.search);
}

function init() {
  setSessionIndicator('idle', 'Session idle');
  initOverlayToggleControls();
  document.addEventListener('fullscreenchange', handleFullscreenChange);

  elements.sessionInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      startSession();
    }
  });

  elements.sessionInput.addEventListener('change', () => startSession());
  elements.sessionApply.addEventListener('click', () => startSession());
  elements.sessionCopy.addEventListener('click', () => handleCopyLink());
  elements.sessionTest?.addEventListener('click', () => handleSendTestMessage());
  elements.activityClear.addEventListener('click', clearActivity);
  elements.activityFilterDonations?.addEventListener('change', (event) => {
    const target = event.target;
    setDonationsOnly(Boolean(target && target.checked));
  });
  elements.activityToggleTts?.addEventListener('change', (event) => {
    const target = event.target;
    setTtsEnabled(Boolean(target && target.checked));
  });
  elements.activityFullscreen?.addEventListener('click', () => toggleActivityFullscreen());
  elements.activityMenuToggle?.addEventListener('click', () => toggleActivityMenu());
  elements.activityPopout?.addEventListener('click', openActivityPopout);

  if (elements.sessionToggle && elements.sessionAdvanced) {
    elements.sessionToggle.addEventListener('click', () => {
      const expanded = elements.sessionToggle.getAttribute('aria-expanded') === 'true';
      const next = !expanded;
      elements.sessionToggle.setAttribute('aria-expanded', String(next));
      elements.sessionAdvanced.hidden = !next;
      if (next && elements.sessionInput) {
        window.requestAnimationFrame(() => {
          elements.sessionInput.focus();
          elements.sessionInput.select();
        });
      }
    });
  }

  const sessionFromUrl = (url.searchParams.get('session') || '').trim();
  const storedSession = sessionFromUrl || storage.get(sessionKey, '');
  if (sessionFromUrl) {
    storage.set(sessionKey, sessionFromUrl);
  }
  if (storedSession) {
    elements.sessionInput.value = storedSession;
  }

  if (elements.sessionTest) {
    elements.sessionTest.disabled = !storedSession;
  }

  const storedDonationsOnly = storage.get(donationsFilterKey, false);
  setDonationsOnly(Boolean(storedDonationsOnly), { persist: false });

  const storedTtsEnabled = parseStoredBoolean(storage.get(ttsEnabledKey, false), false);
  setTtsEnabled(Boolean(storedTtsEnabled), { persist: false });
  window.addEventListener('storage', handleTtsStorageSync);
  if (!speechSupported && elements.activityToggleTts) {
    elements.activityToggleTts.title = 'Text-to-speech is not supported in this browser.';
  }

  updateFullscreenControl();

  if (!isActivityPopoutView) {
    plugins = [
      createYoutubePluginInstance(youtubeStreamingEnabled),
      new TwitchPlugin({
        messenger,
        emotes,
        icon: './sources/images/twitch.png',
        debug: debugEnabled,
        onActivity: addActivity,
        onStatus: ({ kind = 'debug', plugin, state }) => addActivity({ kind, plugin, message: `Status changed: ${state}`, timestamp: Date.now() }),
        autoConnect: true,
        controls: { connect: false, disconnect: true }
      }),
      new KickPlugin({
        messenger,
        emotes,
        icon: './sources/images/kick.png',
        debug: debugEnabled,
        onActivity: addActivity,
        onStatus: ({ plugin, state }) => addActivity({ kind: 'debug', plugin, message: `Status changed: ${state}`, timestamp: Date.now() })
      }),
      new SocialStreamWebSocketPlugin({
        messenger,
        icon: './sources/images/socialstream.png',
        debug: debugEnabled,
        onActivity: addActivity,
        onStatus: ({ plugin, state }) => addActivity({ kind: 'debug', plugin, message: `Status changed: ${state}`, timestamp: Date.now() }),
        autoConnect: true
      })
    ];
    mountAllPlugins();
  } else {
    plugins = [];
  }

  startSession(storedSession);
  if (!isActivityPopoutView) {
    processOAuthCallback(pluginMap).catch((err) => {
      console.error('OAuth processing failed', err);
      updateSessionStatus(err.message || 'OAuth callback handling failed.', 'warn');
    });
  }
  initMobileNav();

  if (!isActivityPopoutView && focusParam === 'activity' && elements.activitySection) {
    window.setTimeout(() => {
      elements.activitySection.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start'
      });
    }, 150);
  }
}


init();
