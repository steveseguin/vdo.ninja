var tmi = (() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // (disabled):node_modules/ws/index.js
  var require_ws = __commonJS({
    "(disabled):node_modules/ws/index.js"() {
    }
  });

  // lib/EventEmitter.js
  var require_EventEmitter = __commonJS({
    "lib/EventEmitter.js"(exports, module) {
      var EventEmitter = class {
        constructor() {
          this._events = /* @__PURE__ */ new Map();
          this._maxListeners = 0;
        }
        setMaxListeners(n) {
          this._maxListeners = n;
          return this;
        }
        emit(eventType, ...args) {
          if (eventType === "error" && (!this._events.has("error") || !this._events.get("error").length)) {
            if (args[0] instanceof Error) {
              throw args[0];
            }
            throw TypeError('Uncaught, unspecified "error" event.');
          }
          const listeners = this._events.get(eventType);
          if (!listeners) {
            return false;
          }
          listeners.forEach((listener) => listener.apply(this, args));
          return true;
        }
        emits(types, values) {
          for (let i = 0; i < types.length; i++) {
            const val = i < values.length ? values[i] : values[values.length - 1];
            this.emit(types[i], ...val);
          }
        }
        on(eventType, listener) {
          if (!this._events.has(eventType)) {
            this._events.set(eventType, []);
          }
          const listeners = this._events.get(eventType);
          if (this._maxListeners && listeners.length >= this._maxListeners) {
            throw Error(`Max listeners exceeded for event '${eventType}'`);
          }
          listeners.push(listener);
          return this;
        }
        once(eventType, listener) {
          const onceListener = (...args) => {
            this.removeListener(eventType, onceListener);
            listener(...args);
          };
          return this.on(eventType, onceListener);
        }
        off(eventType, listener) {
          const listeners = this._events.get(eventType);
          if (!listeners) {
            return this;
          }
          const index = listeners.indexOf(listener);
          if (index === -1) {
            return this;
          }
          listeners.splice(index, 1);
          if (listeners.length === 0) {
            this._events.delete(eventType);
          }
          return this;
        }
        removeAllListeners(eventType) {
          if (!eventType) {
            this._events.clear();
          } else {
            this._events.delete(eventType);
          }
          return this;
        }
        listeners(eventType) {
          return this._events.get(eventType) || [];
        }
        listenerCount(eventType) {
          return this._events.get(eventType) ? this._events.get(eventType).length : 0;
        }
      };
      EventEmitter.prototype.addListener = EventEmitter.prototype.on;
      EventEmitter.prototype.removeListener = EventEmitter.prototype.off;
      EventEmitter.EventEmitter = EventEmitter;
      EventEmitter.defaultMaxListeners = 10;
      module.exports = EventEmitter;
    }
  });

  // lib/Logger.js
  var require_Logger = __commonJS({
    "lib/Logger.js"(exports, module) {
      var Logger = class {
        constructor() {
          this._levels = { trace: 0, debug: 1, info: 2, warn: 3, error: 4, fatal: 5 };
          this._currentLevel = "error";
        }
        _log(level, message) {
          if (this._levels[level] < this._levels[this._currentLevel]) {
            return;
          }
          const date = new Date();
          const h = date.getHours();
          const m = date.getMinutes();
          const dateFormatted = `${(h < 10 ? "0" : "") + h}:${(m < 10 ? "0" : "") + m}`;
          console.log(`[${dateFormatted}] ${level}: ${message}`);
        }
        setLevel(level) {
          this._currentLevel = level;
        }
        getLevel() {
          return this._currentLevel;
        }
        trace(message) {
          this._log("trace", message);
        }
        debug(message) {
          this._log("debug", message);
        }
        info(message) {
          this._log("info", message);
        }
        warn(message) {
          this._log("warn", message);
        }
        error(message) {
          this._log("error", message);
        }
        fatal(message) {
          this._log("fatal", message);
        }
      };
      module.exports = Logger;
    }
  });

  // lib/utils.js
  var require_utils = __commonJS({
    "lib/utils.js"(exports, module) {
      var actionMessageRegex = /^\u0001ACTION ([^\u0001]+)\u0001$/;
      var justinFanRegex = /^(justinfan)(\d+$)/;
      var unescapeIRCRegex = /\\([sn:r\\])/g;
      var escapeIRCRegex = /([ \n;\r\\])/g;
      var tokenRegex = /^oauth:/i;
      var ircEscapedChars = { s: " ", n: "", ":": ";", r: "" };
      var ircUnescapedChars = { " ": "s", "\n": "n", ";": ":", "\r": "r" };
      var _ = module.exports = {
        hasOwn: (obj, key) => ({}).hasOwnProperty.call(obj, key),
        promiseDelay: (time) => new Promise((resolve) => setTimeout(resolve, time)),
        isInteger(input) {
          if (typeof input !== "string" && typeof input !== "number") {
            return false;
          }
          return !isNaN(Math.round(input));
        },
        justinfan: () => `justinfan${Math.floor(Math.random() * 8e4 + 1e3)}`,
        isJustinfan: (username) => justinFanRegex.test(username),
        channel(str) {
          const channel = (str ? str : "").toLowerCase();
          return channel[0] === "#" ? channel : `#${channel}`;
        },
        username(str) {
          const username = (str ? str : "").toLowerCase();
          return username[0] === "#" ? username.slice(1) : username;
        },
        token: (str) => str ? str.replace(tokenRegex, "") : "",
        password(str) {
          const token = _.token(str);
          return token ? `oauth:${token}` : "";
        },
        actionMessage: (msg) => msg.match(actionMessageRegex),
        unescapeHtml: (safe) => safe.replace(/\\&amp\\;/g, "&").replace(/\\&lt\\;/g, "<").replace(/\\&gt\\;/g, ">").replace(/\\&quot\\;/g, '"').replace(/\\&#039\\;/g, "'"),
        unescapeIRC(msg) {
          if (!msg || typeof msg !== "string" || !msg.includes("\\")) {
            return msg;
          }
          return msg.replace(unescapeIRCRegex, (m, p) => p in ircEscapedChars ? ircEscapedChars[p] : p);
        },
        escapeIRC(msg) {
          if (!msg || typeof msg !== "string") {
            return msg;
          }
          return msg.replace(escapeIRCRegex, (m, p) => p in ircUnescapedChars ? `\\${ircUnescapedChars[p]}` : p);
        },
        inherits(ctor, superCtor) {
          ctor.super_ = superCtor;
          const TempCtor = function() {
          };
          TempCtor.prototype = superCtor.prototype;
          ctor.prototype = new TempCtor();
          ctor.prototype.constructor = ctor;
        }
      };
    }
  });

  // lib/parser.js
  var require_parser = __commonJS({
    "lib/parser.js"(exports, module) {
      var _ = require_utils();
      var nonspaceRegex = /\S+/g;
      function parseComplexTag(tags, tagKey, splA = ",", splB = "/", splC) {
        const raw = tags[tagKey];
        if (raw === void 0) {
          return tags;
        }
        const tagIsString = typeof raw === "string";
        tags[`${tagKey}-raw`] = tagIsString ? raw : null;
        if (raw === true) {
          tags[tagKey] = null;
          return tags;
        }
        tags[tagKey] = {};
        if (tagIsString) {
          const spl = raw.split(splA);
          for (let i = 0; i < spl.length; i++) {
            const parts = spl[i].split(splB);
            let [, val] = parts;
            if (splC !== void 0 && val) {
              val = val.split(splC);
            }
            tags[tagKey][parts[0]] = val || null;
          }
        }
        return tags;
      }
      module.exports = {
        badges: (tags) => parseComplexTag(tags, "badges"),
        badgeInfo: (tags) => parseComplexTag(tags, "badge-info"),
        emotes: (tags) => parseComplexTag(tags, "emotes", "/", ":", ","),
        emoteRegex(msg, code, id, obj) {
          nonspaceRegex.lastIndex = 0;
          const regex = new RegExp(`(\\b|^|\\s)${_.unescapeHtml(code)}(\\b|$|\\s)`);
          let match;
          while ((match = nonspaceRegex.exec(msg)) !== null) {
            if (regex.test(match[0])) {
              obj[id] = obj[id] || [];
              obj[id].push([match.index, nonspaceRegex.lastIndex - 1]);
            }
          }
        },
        emoteString(msg, code, id, obj) {
          nonspaceRegex.lastIndex = 0;
          let match;
          while ((match = nonspaceRegex.exec(msg)) !== null) {
            if (match[0] === _.unescapeHtml(code)) {
              obj[id] = obj[id] || [];
              obj[id].push([match.index, nonspaceRegex.lastIndex - 1]);
            }
          }
        },
        transformEmotes(emotes) {
          let transformed = "";
          Object.keys(emotes).forEach((id) => {
            transformed = `${transformed}${id}:`;
            emotes[id].forEach((index) => transformed = `${transformed}${index.join("-")},`);
            transformed = `${transformed.slice(0, -1)}/`;
          });
          return transformed.slice(0, -1);
        },
        formTags(tags = {}) {
          const result = Object.entries(tags).map(([k, v]) => `${_.escapeIRC(k)}=${_.escapeIRC(v)}`);
          return !result.length ? null : `@${result.join(";")}`;
        },
        msg(data) {
          const message = {
            raw: data,
            tags: {},
            prefix: null,
            command: null,
            params: []
          };
          let position = 0;
          let nextspace = 0;
          if (data.charCodeAt(0) === 64) {
            nextspace = data.indexOf(" ");
            if (nextspace === -1) {
              return null;
            }
            const rawTags = data.slice(1, nextspace).split(";");
            for (let i = 0; i < rawTags.length; i++) {
              const tag = rawTags[i];
              const pair = tag.split("=");
              message.tags[pair[0]] = tag.slice(tag.indexOf("=") + 1) || true;
            }
            position = nextspace + 1;
          }
          while (data.charCodeAt(position) === 32) {
            position++;
          }
          if (data.charCodeAt(position) === 58) {
            nextspace = data.indexOf(" ", position);
            if (nextspace === -1) {
              return null;
            }
            message.prefix = data.slice(position + 1, nextspace);
            position = nextspace + 1;
            while (data.charCodeAt(position) === 32) {
              position++;
            }
          }
          nextspace = data.indexOf(" ", position);
          if (nextspace === -1) {
            if (data.length > position) {
              message.command = data.slice(position);
              return message;
            }
            return null;
          }
          message.command = data.slice(position, nextspace);
          position = nextspace + 1;
          while (data.charCodeAt(position) === 32) {
            position++;
          }
          while (position < data.length) {
            nextspace = data.indexOf(" ", position);
            if (data.charCodeAt(position) === 58) {
              message.params.push(data.slice(position + 1));
              break;
            }
            if (nextspace !== -1) {
              message.params.push(data.slice(position, nextspace));
              position = nextspace + 1;
              while (data.charCodeAt(position) === 32) {
                position++;
              }
              continue;
            }
            if (nextspace === -1) {
              message.params.push(data.slice(position));
              break;
            }
          }
          return message;
        }
      };
    }
  });

  // lib/Queue.js
  var require_Queue = __commonJS({
    "lib/Queue.js"(exports, module) {
      var Queue = class {
        constructor(defaultDelay) {
          this.queue = [];
          this.index = 0;
          this.defaultDelay = defaultDelay === void 0 ? 3e3 : defaultDelay;
        }
        add(fn, delay) {
          this.queue.push({ fn, delay });
        }
        next() {
          const i = this.index++;
          const at = this.queue[i];
          if (!at) {
            return;
          }
          const next = this.queue[this.index];
          at.fn();
          if (next) {
            const delay = next.delay === void 0 ? this.defaultDelay : next.delay;
            setTimeout(() => this.next(), delay);
          }
        }
      };
      module.exports = Queue;
    }
  });

  // lib/ClientBase.js
  var require_ClientBase = __commonJS({
    "lib/ClientBase.js"(exports, module) {
      var _global = typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : {};
      var _a;
      var _WebSocket = (_a = _global.WebSocket) != null ? _a : require_ws();
      var EventEmitter = require_EventEmitter();
      var Logger = require_Logger();
      var parser = require_parser();
      var Queue = require_Queue();
      var _ = require_utils();
      var ClientBase = class extends EventEmitter {
        constructor(opts) {
          var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n;
          super();
          this.opts = opts != null ? opts : {};
          this.opts.channels = (_a2 = this.opts.channels) != null ? _a2 : [];
          this.opts.connection = (_b = this.opts.connection) != null ? _b : {};
          this.opts.identity = (_c = this.opts.identity) != null ? _c : {};
          this.opts.options = (_d = this.opts.options) != null ? _d : {};
          this.clientId = (_e = this.opts.options.clientId) != null ? _e : null;
          this._globalDefaultChannel = _.channel((_f = this.opts.options.globalDefaultChannel) != null ? _f : "#tmijs");
          this._skipMembership = (_g = this.opts.options.skipMembership) != null ? _g : false;
          this.maxReconnectAttempts = (_h = this.opts.connection.maxReconnectAttempts) != null ? _h : Infinity;
          this.maxReconnectInterval = (_i = this.opts.connection.maxReconnectInterval) != null ? _i : 3e4;
          this.reconnect = (_j = this.opts.connection.reconnect) != null ? _j : true;
          this.reconnectDecay = (_k = this.opts.connection.reconnectDecay) != null ? _k : 1.5;
          this.reconnectInterval = (_l = this.opts.connection.reconnectInterval) != null ? _l : 1e3;
          this.reconnecting = false;
          this.reconnections = 0;
          this.reconnectTimer = this.reconnectInterval;
          this.currentLatency = 0;
          this.latency = new Date();
          this.secure = (_m = this.opts.connection.secure) != null ? _m : !this.opts.connection.server && !this.opts.connection.port;
          this.pingLoop = null;
          this.pingTimeout = null;
          this.wasCloseCalled = false;
          this.reason = "";
          this.ws = null;
          this.emotes = "";
          this.emotesets = {};
          this.username = "";
          this.channels = [];
          this.globaluserstate = {};
          this.userstate = {};
          this.lastJoined = "";
          this.moderators = {};
          this.log = (_n = this.opts.logger) != null ? _n : new Logger();
          try {
            this.log.setLevel(this.opts.options.debug ? "info" : "error");
          } catch (err) {
          }
          this.opts.channels.forEach((part, index, theArray) => theArray[index] = _.channel(part));
          this.setMaxListeners(0);
        }
        api() {
          throw new Error("The Client.api() method has been removed.");
        }
        handleMessage(message) {
          var _a2, _b, _c, _d, _e, _f, _g, _h;
          if (!message) {
            return;
          }
          if (this.listenerCount("raw_message")) {
            this.emit("raw_message", JSON.parse(JSON.stringify(message)), message);
          }
          const channel = _.channel((_a2 = message.params[0]) != null ? _a2 : null);
          const msg = (_b = message.params[1]) != null ? _b : null;
          const msgid = (_c = message.tags["msg-id"]) != null ? _c : null;
          const tags = message.tags = parser.badges(parser.badgeInfo(parser.emotes(message.tags)));
          for (const key in tags) {
            if (key === "emote-sets" || key === "ban-duration" || key === "bits") {
              continue;
            }
            let value = tags[key];
            if (typeof value === "boolean") {
              value = null;
            } else if (value === "1") {
              value = true;
            } else if (value === "0") {
              value = false;
            } else if (typeof value === "string") {
              value = _.unescapeIRC(value);
            }
            tags[key] = value;
          }
          if (message.prefix === null) {
            switch (message.command) {
              case "PING":
                this.emit("ping");
                if (this._isConnected()) {
                  this.ws.send("PONG");
                }
                break;
              case "PONG": {
                this.currentLatency = (new Date().getTime() - this.latency.getTime()) / 1e3;
                this.emits(["pong", "_promisePing"], [[this.currentLatency]]);
                clearTimeout(this.pingTimeout);
                break;
              }
              default:
                this.log.warn(`Could not parse message with no prefix:
${JSON.stringify(message, null, 4)}`);
                break;
            }
          } else if (message.prefix === "tmi.twitch.tv") {
            switch (message.command) {
              case "002":
              case "003":
              case "004":
              case "372":
              case "375":
              case "CAP":
                break;
              case "001":
                [this.username] = message.params;
                break;
              case "376": {
                this.log.info("Connected to server.");
                this.userstate[this._globalDefaultChannel] = {};
                this.emits(["connected", "_promiseConnect"], [[this.server, this.port], [null]]);
                this.reconnections = 0;
                this.reconnectTimer = this.reconnectInterval;
                this.pingLoop = setInterval(() => {
                  var _a3;
                  if (this._isConnected()) {
                    this.ws.send("PING");
                  }
                  this.latency = new Date();
                  this.pingTimeout = setTimeout(() => {
                    if (this.ws !== null) {
                      this.wasCloseCalled = false;
                      this.log.error("Ping timeout.");
                      this.ws.close();
                      clearInterval(this.pingLoop);
                      clearTimeout(this.pingTimeout);
                    }
                  }, (_a3 = this.opts.connection.timeout) != null ? _a3 : 9999);
                }, 6e4);
                let joinInterval = (_d = this.opts.options.joinInterval) != null ? _d : 2e3;
                if (joinInterval < 300) {
                  joinInterval = 300;
                }
                const joinQueue = new Queue(joinInterval);
                const joinChannels = [.../* @__PURE__ */ new Set([...this.opts.channels, ...this.channels])];
                this.channels = [];
                for (let i = 0; i < joinChannels.length; i++) {
                  const channel2 = joinChannels[i];
                  joinQueue.add(() => {
                    if (this._isConnected()) {
                      this.join(channel2).catch((err) => this.log.error(err));
                    }
                  });
                }
                joinQueue.next();
                break;
              }
              case "NOTICE": {
                const nullArr = [null];
                const noticeArr = [channel, msgid, msg];
                const msgidArr = [msgid];
                const channelTrueArr = [channel, true];
                const channelFalseArr = [channel, false];
                const noticeAndNull = [noticeArr, nullArr];
                const noticeAndMsgid = [noticeArr, msgidArr];
                const basicLog = `[${channel}] ${msg}`;
                switch (msgid) {
                  case "subs_on":
                    this.log.info(`[${channel}] This room is now in subscribers-only mode.`);
                    this.emits(["subscriber", "subscribers", "_promiseSubscribers"], [channelTrueArr, channelTrueArr, nullArr]);
                    break;
                  case "subs_off":
                    this.log.info(`[${channel}] This room is no longer in subscribers-only mode.`);
                    this.emits(["subscriber", "subscribers", "_promiseSubscribersoff"], [channelFalseArr, channelFalseArr, nullArr]);
                    break;
                  case "emote_only_on":
                    this.log.info(`[${channel}] This room is now in emote-only mode.`);
                    this.emits(["emoteonly", "_promiseEmoteonly"], [channelTrueArr, nullArr]);
                    break;
                  case "emote_only_off":
                    this.log.info(`[${channel}] This room is no longer in emote-only mode.`);
                    this.emits(["emoteonly", "_promiseEmoteonlyoff"], [channelFalseArr, nullArr]);
                    break;
                  case "slow_on":
                  case "slow_off":
                    break;
                  case "followers_on_zero":
                  case "followers_on":
                  case "followers_off":
                    break;
                  case "r9k_on":
                    this.log.info(`[${channel}] This room is now in r9k mode.`);
                    this.emits(["r9kmode", "r9kbeta", "_promiseR9kbeta"], [channelTrueArr, channelTrueArr, nullArr]);
                    break;
                  case "r9k_off":
                    this.log.info(`[${channel}] This room is no longer in r9k mode.`);
                    this.emits(["r9kmode", "r9kbeta", "_promiseR9kbetaoff"], [channelFalseArr, channelFalseArr, nullArr]);
                    break;
                  case "room_mods": {
                    const listSplit = msg.split(": ");
                    const mods = (listSplit.length > 1 ? listSplit[1] : "").toLowerCase().split(", ").filter((n) => n);
                    this.emits(["_promiseMods", "mods"], [[null, mods], [channel, mods]]);
                    break;
                  }
                  case "no_mods":
                    this.emits(["_promiseMods", "mods"], [[null, []], [channel, []]]);
                    break;
                  case "vips_success": {
                    const listSplit = (msg.endsWith(".") ? msg.slice(0, -1) : msg).split(": ");
                    const vips = (listSplit.length > 1 ? listSplit[1] : "").toLowerCase().split(", ").filter((n) => n);
                    this.emits(["_promiseVips", "vips"], [[null, vips], [channel, vips]]);
                    break;
                  }
                  case "no_vips":
                    this.emits(["_promiseVips", "vips"], [[null, []], [channel, []]]);
                    break;
                  case "already_banned":
                  case "bad_ban_admin":
                  case "bad_ban_anon":
                  case "bad_ban_broadcaster":
                  case "bad_ban_global_mod":
                  case "bad_ban_mod":
                  case "bad_ban_self":
                  case "bad_ban_staff":
                  case "usage_ban":
                    this.log.info(basicLog);
                    this.emits(["notice", "_promiseBan"], noticeAndMsgid);
                    break;
                  case "ban_success":
                    this.log.info(basicLog);
                    this.emits(["notice", "_promiseBan"], noticeAndNull);
                    break;
                  case "usage_clear":
                    this.log.info(basicLog);
                    this.emits(["notice", "_promiseClear"], noticeAndMsgid);
                    break;
                  case "usage_mods":
                    this.log.info(basicLog);
                    this.emits(["notice", "_promiseMods"], [noticeArr, [msgid, []]]);
                    break;
                  case "mod_success":
                    this.log.info(basicLog);
                    this.emits(["notice", "_promiseMod"], noticeAndNull);
                    break;
                  case "usage_vips":
                    this.log.info(basicLog);
                    this.emits(["notice", "_promiseVips"], [noticeArr, [msgid, []]]);
                    break;
                  case "usage_vip":
                  case "bad_vip_grantee_banned":
                  case "bad_vip_grantee_already_vip":
                  case "bad_vip_max_vips_reached":
                  case "bad_vip_achievement_incomplete":
                    this.log.info(basicLog);
                    this.emits(["notice", "_promiseVip"], [noticeArr, [msgid, []]]);
                    break;
                  case "vip_success":
                    this.log.info(basicLog);
                    this.emits(["notice", "_promiseVip"], noticeAndNull);
                    break;
                  case "usage_mod":
                  case "bad_mod_banned":
                  case "bad_mod_mod":
                    this.log.info(basicLog);
                    this.emits(["notice", "_promiseMod"], noticeAndMsgid);
                    break;
                  case "unmod_success":
                    this.log.info(basicLog);
                    this.emits(["notice", "_promiseUnmod"], noticeAndNull);
                    break;
                  case "unvip_success":
                    this.log.info(basicLog);
                    this.emits(["notice", "_promiseUnvip"], noticeAndNull);
                    break;
                  case "usage_unmod":
                  case "bad_unmod_mod":
                    this.log.info(basicLog);
                    this.emits(["notice", "_promiseUnmod"], noticeAndMsgid);
                    break;
                  case "usage_unvip":
                  case "bad_unvip_grantee_not_vip":
                    this.log.info(basicLog);
                    this.emits(["notice", "_promiseUnvip"], noticeAndMsgid);
                    break;
                  case "color_changed":
                    this.log.info(basicLog);
                    this.emits(["notice", "_promiseColor"], noticeAndNull);
                    break;
                  case "usage_color":
                  case "turbo_only_color":
                    this.log.info(basicLog);
                    this.emits(["notice", "_promiseColor"], noticeAndMsgid);
                    break;
                  case "commercial_success":
                    this.log.info(basicLog);
                    this.emits(["notice", "_promiseCommercial"], noticeAndNull);
                    break;
                  case "usage_commercial":
                  case "bad_commercial_error":
                    this.log.info(basicLog);
                    this.emits(["notice", "_promiseCommercial"], noticeAndMsgid);
                    break;
                  case "hosts_remaining": {
                    this.log.info(basicLog);
                    const remainingHost = !isNaN(msg[0]) ? parseInt(msg[0]) : 0;
                    this.emits(["notice", "_promiseHost"], [noticeArr, [null, ~~remainingHost]]);
                    break;
                  }
                  case "bad_host_hosting":
                  case "bad_host_rate_exceeded":
                  case "bad_host_error":
                  case "usage_host":
                    this.log.info(basicLog);
                    this.emits(["notice", "_promiseHost"], [noticeArr, [msgid, null]]);
                    break;
                  case "already_r9k_on":
                  case "usage_r9k_on":
                    this.log.info(basicLog);
                    this.emits(["notice", "_promiseR9kbeta"], noticeAndMsgid);
                    break;
                  case "already_r9k_off":
                  case "usage_r9k_off":
                    this.log.info(basicLog);
                    this.emits(["notice", "_promiseR9kbetaoff"], noticeAndMsgid);
                    break;
                  case "timeout_success":
                    this.log.info(basicLog);
                    this.emits(["notice", "_promiseTimeout"], noticeAndNull);
                    break;
                  case "delete_message_success":
                    this.log.info(`[${channel} ${msg}]`);
                    this.emits(["notice", "_promiseDeletemessage"], noticeAndNull);
                    break;
                  case "already_subs_off":
                  case "usage_subs_off":
                    this.log.info(basicLog);
                    this.emits(["notice", "_promiseSubscribersoff"], noticeAndMsgid);
                    break;
                  case "already_subs_on":
                  case "usage_subs_on":
                    this.log.info(basicLog);
                    this.emits(["notice", "_promiseSubscribers"], noticeAndMsgid);
                    break;
                  case "already_emote_only_off":
                  case "usage_emote_only_off":
                    this.log.info(basicLog);
                    this.emits(["notice", "_promiseEmoteonlyoff"], noticeAndMsgid);
                    break;
                  case "already_emote_only_on":
                  case "usage_emote_only_on":
                    this.log.info(basicLog);
                    this.emits(["notice", "_promiseEmoteonly"], noticeAndMsgid);
                    break;
                  case "usage_slow_on":
                    this.log.info(basicLog);
                    this.emits(["notice", "_promiseSlow"], noticeAndMsgid);
                    break;
                  case "usage_slow_off":
                    this.log.info(basicLog);
                    this.emits(["notice", "_promiseSlowoff"], noticeAndMsgid);
                    break;
                  case "usage_timeout":
                  case "bad_timeout_admin":
                  case "bad_timeout_anon":
                  case "bad_timeout_broadcaster":
                  case "bad_timeout_duration":
                  case "bad_timeout_global_mod":
                  case "bad_timeout_mod":
                  case "bad_timeout_self":
                  case "bad_timeout_staff":
                    this.log.info(basicLog);
                    this.emits(["notice", "_promiseTimeout"], noticeAndMsgid);
                    break;
                  case "untimeout_success":
                  case "unban_success":
                    this.log.info(basicLog);
                    this.emits(["notice", "_promiseUnban"], noticeAndNull);
                    break;
                  case "usage_unban":
                  case "bad_unban_no_ban":
                    this.log.info(basicLog);
                    this.emits(["notice", "_promiseUnban"], noticeAndMsgid);
                    break;
                  case "usage_delete":
                  case "bad_delete_message_error":
                  case "bad_delete_message_broadcaster":
                  case "bad_delete_message_mod":
                    this.log.info(basicLog);
                    this.emits(["notice", "_promiseDeletemessage"], noticeAndMsgid);
                    break;
                  case "usage_unhost":
                  case "not_hosting":
                    this.log.info(basicLog);
                    this.emits(["notice", "_promiseUnhost"], noticeAndMsgid);
                    break;
                  case "whisper_invalid_login":
                  case "whisper_invalid_self":
                  case "whisper_limit_per_min":
                  case "whisper_limit_per_sec":
                  case "whisper_restricted":
                  case "whisper_restricted_recipient":
                    this.log.info(basicLog);
                    this.emits(["notice", "_promiseWhisper"], noticeAndMsgid);
                    break;
                  case "no_permission":
                  case "msg_banned":
                  case "msg_room_not_found":
                  case "msg_channel_suspended":
                  case "tos_ban":
                  case "invalid_user":
                    this.log.info(basicLog);
                    this.emits([
                      "notice",
                      "_promiseBan",
                      "_promiseClear",
                      "_promiseUnban",
                      "_promiseTimeout",
                      "_promiseDeletemessage",
                      "_promiseMods",
                      "_promiseMod",
                      "_promiseUnmod",
                      "_promiseVips",
                      "_promiseVip",
                      "_promiseUnvip",
                      "_promiseCommercial",
                      "_promiseHost",
                      "_promiseUnhost",
                      "_promiseJoin",
                      "_promisePart",
                      "_promiseR9kbeta",
                      "_promiseR9kbetaoff",
                      "_promiseSlow",
                      "_promiseSlowoff",
                      "_promiseFollowers",
                      "_promiseFollowersoff",
                      "_promiseSubscribers",
                      "_promiseSubscribersoff",
                      "_promiseEmoteonly",
                      "_promiseEmoteonlyoff",
                      "_promiseWhisper"
                    ], [noticeArr, [msgid, channel]]);
                    break;
                  case "msg_rejected":
                  case "msg_rejected_mandatory":
                    this.log.info(basicLog);
                    this.emit("automod", channel, msgid, msg);
                    break;
                  case "unrecognized_cmd":
                    this.log.info(basicLog);
                    this.emit("notice", channel, msgid, msg);
                    break;
                  case "cmds_available":
                  case "host_target_went_offline":
                  case "msg_censored_broadcaster":
                  case "msg_duplicate":
                  case "msg_emoteonly":
                  case "msg_verified_email":
                  case "msg_ratelimit":
                  case "msg_subsonly":
                  case "msg_timedout":
                  case "msg_bad_characters":
                  case "msg_channel_blocked":
                  case "msg_facebook":
                  case "msg_followersonly":
                  case "msg_followersonly_followed":
                  case "msg_followersonly_zero":
                  case "msg_slowmode":
                  case "msg_suspended":
                  case "no_help":
                  case "usage_disconnect":
                  case "usage_help":
                  case "usage_me":
                  case "unavailable_command":
                    this.log.info(basicLog);
                    this.emit("notice", channel, msgid, msg);
                    break;
                  case "host_on":
                  case "host_off":
                    break;
                  default:
                    if (msg.includes("Login unsuccessful") || msg.includes("Login authentication failed")) {
                      this.wasCloseCalled = false;
                      this.reconnect = false;
                      this.reason = msg;
                      this.log.error(this.reason);
                      this.ws.close();
                    } else if (msg.includes("Error logging in") || msg.includes("Improperly formatted auth")) {
                      this.wasCloseCalled = false;
                      this.reconnect = false;
                      this.reason = msg;
                      this.log.error(this.reason);
                      this.ws.close();
                    } else if (msg.includes("Invalid NICK")) {
                      this.wasCloseCalled = false;
                      this.reconnect = false;
                      this.reason = "Invalid NICK.";
                      this.log.error(this.reason);
                      this.ws.close();
                    } else {
                      this.log.warn(`Could not parse NOTICE from tmi.twitch.tv:
${JSON.stringify(message, null, 4)}`);
                      this.emit("notice", channel, msgid, msg);
                    }
                    break;
                }
                break;
              }
              case "USERNOTICE": {
                const username = tags["display-name"] || tags["login"];
                const plan = (_e = tags["msg-param-sub-plan"]) != null ? _e : "";
                const planName = _.unescapeIRC((_f = tags["msg-param-sub-plan-name"]) != null ? _f : "") || null;
                const prime = plan.includes("Prime");
                const methods = { prime, plan, planName };
                const streakMonths = ~~(tags["msg-param-streak-months"] || 0);
                const recipient = tags["msg-param-recipient-display-name"] || tags["msg-param-recipient-user-name"];
                const giftSubCount = ~~tags["msg-param-mass-gift-count"];
                tags["message-type"] = msgid;
                switch (msgid) {
                  case "resub":
                    this.emits(["resub", "subanniversary"], [
                      [channel, username, streakMonths, msg, tags, methods]
                    ]);
                    break;
                  case "sub":
                    this.emits(["subscription", "sub"], [
                      [channel, username, methods, msg, tags]
                    ]);
                    break;
                  case "subgift":
                    this.emit("subgift", channel, username, streakMonths, recipient, methods, tags);
                    break;
                  case "anonsubgift":
                    this.emit("anonsubgift", channel, streakMonths, recipient, methods, tags);
                    break;
                  case "submysterygift":
                    this.emit("submysterygift", channel, username, giftSubCount, methods, tags);
                    break;
                  case "anonsubmysterygift":
                    this.emit("anonsubmysterygift", channel, giftSubCount, methods, tags);
                    break;
                  case "primepaidupgrade":
                    this.emit("primepaidupgrade", channel, username, methods, tags);
                    break;
                  case "giftpaidupgrade": {
                    const sender = tags["msg-param-sender-name"] || tags["msg-param-sender-login"];
                    this.emit("giftpaidupgrade", channel, username, sender, tags);
                    break;
                  }
                  case "anongiftpaidupgrade":
                    this.emit("anongiftpaidupgrade", channel, username, tags);
                    break;
                  case "announcement": {
                    const color = tags["msg-param-color"];
                    this.emit("announcement", channel, tags, msg, false, color);
                    break;
                  }
                  case "raid": {
                    const username2 = tags["msg-param-displayName"] || tags["msg-param-login"];
                    const viewers = +tags["msg-param-viewerCount"];
                    this.emit("raided", channel, username2, viewers, tags);
                    break;
                  }
                  default:
                    this.emit("usernotice", msgid, channel, tags, msg);
                    break;
                }
                break;
              }
              case "HOSTTARGET": {
                const msgSplit = msg.split(" ");
                const viewers = ~~msgSplit[1] || 0;
                if (msgSplit[0] === "-") {
                  this.log.info(`[${channel}] Exited host mode.`);
                  this.emits(["unhost", "_promiseUnhost"], [[channel, viewers], [null]]);
                } else {
                  this.log.info(`[${channel}] Now hosting ${msgSplit[0]} for ${viewers} viewer(s).`);
                  this.emit("hosting", channel, msgSplit[0], viewers);
                }
                break;
              }
              case "CLEARCHAT":
                if (message.params.length > 1) {
                  const duration = (_g = message.tags["ban-duration"]) != null ? _g : null;
                  if (duration === null) {
                    this.log.info(`[${channel}] ${msg} has been banned.`);
                    this.emit("ban", channel, msg, null, message.tags);
                  } else {
                    this.log.info(`[${channel}] ${msg} has been timed out for ${duration} seconds.`);
                    this.emit("timeout", channel, msg, null, ~~duration, message.tags);
                  }
                } else {
                  this.log.info(`[${channel}] Chat was cleared by a moderator.`);
                  this.emits(["clearchat", "_promiseClear"], [[channel], [null]]);
                }
                break;
              case "CLEARMSG":
                if (message.params.length > 1) {
                  const deletedMessage = msg;
                  const username = tags["login"];
                  tags["message-type"] = "messagedeleted";
                  this.log.info(`[${channel}] ${username}'s message has been deleted.`);
                  this.emit("messagedeleted", channel, username, deletedMessage, tags);
                }
                break;
              case "RECONNECT":
                this.log.info("Received RECONNECT request from Twitch..");
                this.log.info(`Disconnecting and reconnecting in ${Math.round(this.reconnectTimer / 1e3)} seconds..`);
                this.disconnect().catch((err) => this.log.error(err));
                setTimeout(() => this.connect().catch((err) => this.log.error(err)), this.reconnectTimer);
                break;
              case "USERSTATE":
                message.tags.username = this.username;
                if (message.tags["user-type"] === "mod") {
                  if (!this.moderators[channel]) {
                    this.moderators[channel] = [];
                  }
                  if (!this.moderators[channel].includes(this.username)) {
                    this.moderators[channel].push(this.username);
                  }
                }
                if (!_.isJustinfan(this.getUsername()) && !this.userstate[channel]) {
                  this.userstate[channel] = tags;
                  this.lastJoined = channel;
                  this.channels.push(channel);
                  this.log.info(`Joined ${channel}`);
                  this.emit("join", channel, _.username(this.getUsername()), true);
                }
                if (message.tags["emote-sets"] !== this.emotes) {
                  this.emotes = message.tags["emote-sets"];
                  this.emit("emotesets", this.emotes, null);
                }
                this.userstate[channel] = tags;
                break;
              case "GLOBALUSERSTATE":
                this.globaluserstate = tags;
                this.emit("globaluserstate", tags);
                if (message.tags["emote-sets"] !== void 0 && message.tags["emote-sets"] !== this.emotes) {
                  this.emotes = message.tags["emote-sets"];
                  this.emit("emotesets", this.emotes, null);
                }
                break;
              case "ROOMSTATE":
                if (_.channel(this.lastJoined) === channel) {
                  this.emit("_promiseJoin", null, channel);
                }
                message.tags.channel = channel;
                this.emit("roomstate", channel, message.tags);
                if (!_.hasOwn(message.tags, "subs-only")) {
                  if (_.hasOwn(message.tags, "slow")) {
                    if (typeof message.tags.slow === "boolean" && !message.tags.slow) {
                      const disabled = [channel, false, 0];
                      this.log.info(`[${channel}] This room is no longer in slow mode.`);
                      this.emits(["slow", "slowmode", "_promiseSlowoff"], [disabled, disabled, [null]]);
                    } else {
                      const seconds = ~~message.tags.slow;
                      const enabled = [channel, true, seconds];
                      this.log.info(`[${channel}] This room is now in slow mode.`);
                      this.emits(["slow", "slowmode", "_promiseSlow"], [enabled, enabled, [null]]);
                    }
                  }
                  if (_.hasOwn(message.tags, "followers-only")) {
                    if (message.tags["followers-only"] === "-1") {
                      const disabled = [channel, false, 0];
                      this.log.info(`[${channel}] This room is no longer in followers-only mode.`);
                      this.emits(["followersonly", "followersmode", "_promiseFollowersoff"], [disabled, disabled, [null]]);
                    } else {
                      const minutes = ~~message.tags["followers-only"];
                      const enabled = [channel, true, minutes];
                      this.log.info(`[${channel}] This room is now in follower-only mode.`);
                      this.emits(["followersonly", "followersmode", "_promiseFollowers"], [enabled, enabled, [null]]);
                    }
                  }
                }
                break;
              case "SERVERCHANGE":
                break;
              default:
                this.log.warn(`Could not parse message from tmi.twitch.tv:
${JSON.stringify(message, null, 4)}`);
                break;
            }
          } else if (message.prefix === "jtv") {
            switch (message.command) {
              case "MODE":
                if (msg === "+o") {
                  if (!this.moderators[channel]) {
                    this.moderators[channel] = [];
                  }
                  if (!this.moderators[channel].includes(message.params[2])) {
                    this.moderators[channel].push(message.params[2]);
                  }
                  this.emit("mod", channel, message.params[2]);
                } else if (msg === "-o") {
                  if (!this.moderators[channel]) {
                    this.moderators[channel] = [];
                  }
                  this.moderators[channel].filter((value) => value !== message.params[2]);
                  this.emit("unmod", channel, message.params[2]);
                }
                break;
              default:
                this.log.warn(`Could not parse message from jtv:
${JSON.stringify(message, null, 4)}`);
                break;
            }
          } else {
            switch (message.command) {
              case "353":
                this.emit("names", message.params[2], message.params[3].split(" "));
                break;
              case "366":
                break;
              case "JOIN": {
                const [nick] = message.prefix.split("!");
                const matchesUsername = this.username === nick;
                const isSelfAnon = matchesUsername && _.isJustinfan(this.getUsername());
                if (isSelfAnon) {
                  this.lastJoined = channel;
                  this.channels.push(channel);
                  this.log.info(`Joined ${channel}`);
                  this.emit("join", channel, nick, true);
                } else if (!matchesUsername) {
                  this.emit("join", channel, nick, false);
                }
                break;
              }
              case "PART": {
                const [nick] = message.prefix.split("!");
                const isSelf = this.username === nick;
                if (isSelf) {
                  if (this.userstate[channel]) {
                    delete this.userstate[channel];
                  }
                  let index = this.channels.indexOf(channel);
                  if (index !== -1) {
                    this.channels.splice(index, 1);
                  }
                  index = this.opts.channels.indexOf(channel);
                  if (index !== -1) {
                    this.opts.channels.splice(index, 1);
                  }
                  this.log.info(`Left ${channel}`);
                  this.emit("_promisePart", null);
                }
                this.emit("part", channel, nick, isSelf);
                break;
              }
              case "WHISPER": {
                const [nick] = message.prefix.split("!");
                this.log.info(`[WHISPER] <${nick}>: ${msg}`);
                if (!_.hasOwn(message.tags, "username")) {
                  message.tags.username = nick;
                }
                message.tags["message-type"] = "whisper";
                const from = _.channel(message.tags.username);
                this.emits(["whisper", "message"], [
                  [from, message.tags, msg, false]
                ]);
                break;
              }
              case "PRIVMSG":
                [message.tags.username] = message.prefix.split("!");
                if (message.tags.username === "jtv") {
                  const name = _.username(msg.split(" ")[0]);
                  const autohost = msg.includes("auto");
                  if (msg.includes("hosting you for")) {
                    let count = 0;
                    const parts = msg.split(" ");
                    for (let i = 0; i < parts.length; i++) {
                      if (_.isInteger(parts[i])) {
                        count = ~~parts[i];
                        break;
                      }
                    }
                    this.emit("hosted", channel, name, count, autohost);
                  } else if (msg.includes("hosting you")) {
                    this.emit("hosted", channel, name, 0, autohost);
                  }
                } else {
                  const messagesLogLevel = (_h = this.opts.options.messagesLogLevel) != null ? _h : "info";
                  const isActionMessage = _.actionMessage(msg);
                  message.tags["message-type"] = isActionMessage ? "action" : "chat";
                  const cleanedMsg = isActionMessage ? isActionMessage[1] : msg;
                  if (_.hasOwn(message.tags, "bits")) {
                    this.emit("cheer", channel, message.tags, cleanedMsg);
                  } else {
                    if (_.hasOwn(message.tags, "msg-id")) {
                      if (message.tags["msg-id"] === "highlighted-message") {
                        const rewardtype = message.tags["msg-id"];
                        this.emit("redeem", channel, message.tags.username, rewardtype, message.tags, cleanedMsg);
                      } else if (message.tags["msg-id"] === "skip-subs-mode-message") {
                        const rewardtype = message.tags["msg-id"];
                        this.emit("redeem", channel, message.tags.username, rewardtype, message.tags, cleanedMsg);
                      }
                    } else if (_.hasOwn(message.tags, "custom-reward-id")) {
                      const rewardtype = message.tags["custom-reward-id"];
                      this.emit("redeem", channel, message.tags.username, rewardtype, message.tags, cleanedMsg);
                    }
                    if (isActionMessage) {
                      this.log[messagesLogLevel](`[${channel}] *<${message.tags.username}>: ${cleanedMsg}`);
                      this.emits(["action", "message"], [
                        [channel, message.tags, cleanedMsg, false]
                      ]);
                    } else {
                      this.log[messagesLogLevel](`[${channel}] <${message.tags.username}>: ${cleanedMsg}`);
                      this.emits(["chat", "message"], [
                        [channel, message.tags, cleanedMsg, false]
                      ]);
                    }
                  }
                }
                break;
              default:
                this.log.warn(`Could not parse message:
${JSON.stringify(message, null, 4)}`);
                break;
            }
          }
        }
        connect() {
          return new Promise((resolve, reject) => {
            var _a2, _b;
            this.server = (_a2 = this.opts.connection.server) != null ? _a2 : "irc-ws.chat.twitch.tv";
            this.port = (_b = this.opts.connection.port) != null ? _b : 80;
            if (this.secure) {
              this.port = 443;
            }
            if (this.port === 443) {
              this.secure = true;
            }
            this.reconnectTimer = this.reconnectTimer * this.reconnectDecay;
            if (this.reconnectTimer >= this.maxReconnectInterval) {
              this.reconnectTimer = this.maxReconnectInterval;
            }
            this._openConnection();
            this.once("_promiseConnect", (err) => {
              if (!err) {
                resolve([this.server, ~~this.port]);
              } else {
                reject(err);
              }
            });
          });
        }
        _openConnection() {
          const url = `${this.secure ? "wss" : "ws"}://${this.server}:${this.port}/`;
          const connectionOptions = {};
          if ("agent" in this.opts.connection) {
            connectionOptions.agent = this.opts.connection.agent;
          }
          this.ws = new _WebSocket(url, "irc", connectionOptions);
          this.ws.onmessage = this._onMessage.bind(this);
          this.ws.onerror = this._onError.bind(this);
          this.ws.onclose = this._onClose.bind(this);
          this.ws.onopen = this._onOpen.bind(this);
        }
        _onOpen() {
          var _a2;
          if (!this._isConnected()) {
            return;
          }
          this.log.info(`Connecting to ${this.server} on port ${this.port}..`);
          this.emit("connecting", this.server, ~~this.port);
          this.username = _.username((_a2 = this.opts.identity.username) != null ? _a2 : _.justinfan());
          this._getToken().then((token) => {
            const password = _.password(token);
            this.log.info("Sending authentication to server..");
            this.emit("logon");
            let caps = "twitch.tv/tags twitch.tv/commands";
            if (!this._skipMembership) {
              caps += " twitch.tv/membership";
            }
            this.ws.send(`CAP REQ :${caps}`);
            if (password) {
              this.ws.send(`PASS ${password}`);
            } else if (_.isJustinfan(this.username)) {
              this.ws.send("PASS SCHMOOPIIE");
            }
            this.ws.send(`NICK ${this.username}`);
          }).catch((err) => {
            this.emits(["_promiseConnect", "disconnected"], [[err], ["Could not get a token."]]);
          });
        }
        _getToken() {
          const passwordOption = this.opts.identity.password;
          const password = typeof passwordOption === "function" ? passwordOption() : passwordOption;
          return Promise.resolve(password);
        }
        _onMessage(event) {
          const parts = event.data.trim().split("\r\n");
          parts.forEach((str) => {
            const msg = parser.msg(str);
            if (msg) {
              this.handleMessage(msg);
            }
          });
        }
        _onError() {
          this.moderators = {};
          this.userstate = {};
          this.globaluserstate = {};
          clearInterval(this.pingLoop);
          clearTimeout(this.pingTimeout);
          this.reason = this.ws === null ? "Connection closed." : "Unable to connect.";
          this.emits(["_promiseConnect", "disconnected"], [[this.reason]]);
          if (this.reconnect && this.reconnections === this.maxReconnectAttempts) {
            this.emit("maxreconnect");
            this.log.error("Maximum reconnection attempts reached.");
          }
          if (this.reconnect && !this.reconnecting && this.reconnections <= this.maxReconnectAttempts - 1) {
            this.reconnecting = true;
            this.reconnections++;
            this.log.error(`Reconnecting in ${Math.round(this.reconnectTimer / 1e3)} seconds..`);
            this.emit("reconnect");
            setTimeout(() => {
              this.reconnecting = false;
              this.connect().catch((err) => this.log.error(err));
            }, this.reconnectTimer);
          }
          this.ws = null;
        }
        _onClose() {
          this.moderators = {};
          this.userstate = {};
          this.globaluserstate = {};
          clearInterval(this.pingLoop);
          clearTimeout(this.pingTimeout);
          if (this.wasCloseCalled) {
            this.wasCloseCalled = false;
            this.reason = "Connection closed.";
            this.log.info(this.reason);
            this.emits(["_promiseConnect", "_promiseDisconnect", "disconnected"], [[this.reason], [null], [this.reason]]);
          } else {
            this.emits(["_promiseConnect", "disconnected"], [[this.reason]]);
            if (!this.wasCloseCalled && this.reconnect && this.reconnections === this.maxReconnectAttempts) {
              this.emit("maxreconnect");
              this.log.error("Maximum reconnection attempts reached.");
            }
            if (!this.wasCloseCalled && this.reconnect && !this.reconnecting && this.reconnections <= this.maxReconnectAttempts - 1) {
              this.reconnecting = true;
              this.reconnections++;
              this.log.error(`Could not connect to server. Reconnecting in ${Math.round(this.reconnectTimer / 1e3)} seconds..`);
              this.emit("reconnect");
              setTimeout(() => {
                this.reconnecting = false;
                this.connect().catch((err) => this.log.error(err));
              }, this.reconnectTimer);
            }
          }
          this.ws = null;
        }
        _getPromiseDelay() {
          return Math.max(600, this.currentLatency * 1e3 + 100);
        }
        _sendCommand({ delay, channel, command, tags }, fn) {
          return new Promise((resolve, reject) => {
            if (!this._isConnected()) {
              return reject("Not connected to server.");
            } else if (delay === null || typeof delay === "number") {
              if (delay === null) {
                delay = this._getPromiseDelay();
              }
              _.promiseDelay(delay).then(() => reject("No response from Twitch."));
            }
            const formedTags = parser.formTags(tags);
            if (typeof channel === "string") {
              const chan = _.channel(channel);
              this.log.info(`[${chan}] Executing command: ${command}`);
              this.ws.send(`${formedTags ? `${formedTags} ` : ""}PRIVMSG ${chan} :${command}`);
            } else {
              this.log.info(`Executing command: ${command}`);
              this.ws.send(`${formedTags ? `${formedTags} ` : ""}${command}`);
            }
            if (typeof fn === "function") {
              fn(resolve, reject);
            } else {
              resolve();
            }
          });
        }
        _sendMessage({ channel, message, tags }, fn) {
          return new Promise((resolve, reject) => {
            var _a2;
            if (!this._isConnected()) {
              return reject("Not connected to server.");
            } else if (_.isJustinfan(this.getUsername())) {
              return reject("Cannot send anonymous messages.");
            }
            const chan = _.channel(channel);
            if (!this.userstate[chan]) {
              this.userstate[chan] = {};
            }
            if (message.length > 500) {
              const maxLength = 500;
              const msg = message;
              let lastSpace = msg.slice(0, maxLength).lastIndexOf(" ");
              if (lastSpace === -1) {
                lastSpace = maxLength;
              }
              message = msg.slice(0, lastSpace);
              setTimeout(() => this._sendMessage({ channel, message: msg.slice(lastSpace), tags }), 350);
            }
            const formedTags = parser.formTags(tags);
            this.ws.send(`${formedTags ? `${formedTags} ` : ""}PRIVMSG ${chan} :${message}`);
            const userstate = Object.assign({}, this.userstate[chan], { emotes: null });
            const messagesLogLevel = (_a2 = this.opts.options.messagesLogLevel) != null ? _a2 : "info";
            const actionMessage = _.actionMessage(message);
            if (actionMessage) {
              userstate["message-type"] = "action";
              this.log[messagesLogLevel](`[${chan}] *<${this.getUsername()}>: ${actionMessage[1]}`);
              this.emits(["action", "message"], [
                [chan, userstate, actionMessage[1], true]
              ]);
            } else {
              userstate["message-type"] = "chat";
              this.log[messagesLogLevel](`[${chan}] <${this.getUsername()}>: ${message}`);
              this.emits(["chat", "message"], [
                [chan, userstate, message, true]
              ]);
            }
            if (typeof fn === "function") {
              fn(resolve, reject);
            } else {
              resolve();
            }
          });
        }
        getUsername() {
          return this.username;
        }
        getOptions() {
          return this.opts;
        }
        getChannels() {
          return this.channels;
        }
        isMod(channel, username) {
          const chan = _.channel(channel);
          if (!this.moderators[chan]) {
            this.moderators[chan] = [];
          }
          return this.moderators[chan].includes(_.username(username));
        }
        readyState() {
          if (this.ws === null) {
            return "CLOSED";
          }
          return ["CONNECTING", "OPEN", "CLOSING", "CLOSED"][this.ws.readyState];
        }
        _isConnected() {
          return this.ws !== null && this.ws.readyState === 1;
        }
        disconnect() {
          return new Promise((resolve, reject) => {
            if (this.ws !== null && this.ws.readyState !== 3) {
              this.wasCloseCalled = true;
              this.log.info("Disconnecting from server..");
              this.ws.close();
              this.once("_promiseDisconnect", () => resolve([this.server, ~~this.port]));
            } else {
              this.log.error("Cannot disconnect from server. Socket is not opened or connection is already closing.");
              reject("Cannot disconnect from server. Socket is not opened or connection is already closing.");
            }
          });
        }
      };
      module.exports = ClientBase;
    }
  });

  // lib/Client.js
  var require_Client = __commonJS({
    "lib/Client.js"(exports, module) {
      var ClientBase = require_ClientBase();
      var _ = require_utils();
      var Client = class extends ClientBase {
        action(channel, message, tags) {
          message = `ACTION ${message}`;
          return this._sendMessage({ channel, message, tags }, (res, _rej) => res([_.channel(channel), message]));
        }
        announce(channel, message) {
          return this._sendMessage({ channel, message: `/announce ${message}` }, (res, _rej) => res([_.channel(channel), message]));
        }
        ban(channel, username, reason) {
          username = _.username(username);
          reason = reason != null ? reason : "";
          return this._sendCommand({ channel, command: `/ban ${username} ${reason}` }, (res, rej) => this.once("_promiseBan", (err) => !err ? res([_.channel(channel), username, reason]) : rej(err)));
        }
        clear(channel) {
          return this._sendCommand({ channel, command: "/clear" }, (res, rej) => this.once("_promiseClear", (err) => !err ? res([_.channel(channel)]) : rej(err)));
        }
        color(newColor, _oldNewColor) {
          newColor = _oldNewColor != null ? _oldNewColor : newColor;
          return this._sendCommand({ channel: this._globalDefaultChannel, command: `/color ${newColor}` }, (res, rej) => this.once("_promiseColor", (err) => !err ? res([newColor]) : rej(err)));
        }
        commercial(channel, seconds) {
          seconds = seconds != null ? seconds : 30;
          return this._sendCommand({ channel, command: `/commercial ${seconds}` }, (res, rej) => this.once("_promiseCommercial", (err) => !err ? res([_.channel(channel), ~~seconds]) : rej(err)));
        }
        deletemessage(channel, messageUUID) {
          return this._sendCommand({ channel, command: `/delete ${messageUUID}` }, (res, rej) => this.once("_promiseDeletemessage", (err) => !err ? res([_.channel(channel)]) : rej(err)));
        }
        emoteonly(channel) {
          return this._sendCommand({ channel, command: "/emoteonly" }, (res, rej) => this.once("_promiseEmoteonly", (err) => !err ? res([_.channel(channel)]) : rej(err)));
        }
        emoteonlyoff(channel) {
          return this._sendCommand({ channel, command: "/emoteonlyoff" }, (res, rej) => this.once("_promiseEmoteonlyoff", (err) => !err ? res([_.channel(channel)]) : rej(err)));
        }
        followersonly(channel, minutes) {
          minutes = minutes != null ? minutes : 30;
          return this._sendCommand({ channel, command: `/followers ${minutes}` }, (res, rej) => this.once("_promiseFollowers", (err) => !err ? res([_.channel(channel), ~~minutes]) : rej(err)));
        }
        followersonlyoff(channel) {
          return this._sendCommand({ channel, command: "/followersoff" }, (res, rej) => this.once("_promiseFollowersoff", (err) => !err ? res([_.channel(channel)]) : rej(err)));
        }
        host(channel, target) {
          target = _.username(target);
          return this._sendCommand({ delay: 2e3, channel, command: `/host ${target}` }, (res, rej) => this.once("_promiseHost", (err, remaining) => !err ? res([_.channel(channel), target, ~~remaining]) : rej(err)));
        }
        join(channel) {
          channel = _.channel(channel);
          return this._sendCommand({ delay: void 0, channel: null, command: `JOIN ${channel}` }, (res, rej) => {
            const eventName = "_promiseJoin";
            let hasFulfilled = false;
            const listener = (err, joinedChannel) => {
              if (channel === _.channel(joinedChannel)) {
                this.removeListener(eventName, listener);
                hasFulfilled = true;
                !err ? res([channel]) : rej(err);
              }
            };
            this.on(eventName, listener);
            const delay = this._getPromiseDelay();
            _.promiseDelay(delay).then(() => {
              if (!hasFulfilled) {
                this.emit(eventName, "No response from Twitch.", channel);
              }
            });
          });
        }
        mod(channel, username) {
          username = _.username(username);
          return this._sendCommand({ channel, command: `/mod ${username}` }, (res, rej) => this.once("_promiseMod", (err) => !err ? res([_.channel(channel), username]) : rej(err)));
        }
        mods(channel) {
          channel = _.channel(channel);
          return this._sendCommand({ channel, command: "/mods" }, (resolve, reject) => {
            this.once("_promiseMods", (err, mods) => {
              if (!err) {
                mods.forEach((username) => {
                  if (!this.moderators[channel]) {
                    this.moderators[channel] = [];
                  }
                  if (!this.moderators[channel].includes(username)) {
                    this.moderators[channel].push(username);
                  }
                });
                resolve(mods);
              } else {
                reject(err);
              }
            });
          });
        }
        part(channel) {
          return this._sendCommand({ delay: null, channel: null, command: `PART ${channel}` }, (res, rej) => this.once("_promisePart", (err) => !err ? res([_.channel(channel)]) : rej(err)));
        }
        ping() {
          return this._sendCommand({ delay: null, command: "PING" }, (res, _rej) => {
            var _a;
            this.latency = new Date();
            this.pingTimeout = setTimeout(() => {
              if (this.ws !== null) {
                this.wasCloseCalled = false;
                this.log.error("Ping timeout.");
                this.ws.close();
                clearInterval(this.pingLoop);
                clearTimeout(this.pingTimeout);
              }
            }, (_a = this.opts.connection.timeout) != null ? _a : 9999);
            this.once("_promisePing", (latency) => res([parseFloat(latency)]));
          });
        }
        r9kbeta(channel) {
          return this._sendCommand({ channel, command: "/r9kbeta" }, (res, rej) => this.once("_promiseR9kbeta", (err) => !err ? res([_.channel(channel)]) : rej(err)));
        }
        r9kbetaoff(channel) {
          return this._sendCommand({ channel, command: "/r9kbetaoff" }, (res, rej) => this.once("_promiseR9kbetaoff", (err) => !err ? res([_.channel(channel)]) : rej(err)));
        }
        raw(command, tags) {
          return this._sendCommand({ channel: null, command, tags }, (res, _rej) => res([command]));
        }
        reply(channel, message, replyParentMsgId, tags = {}) {
          if (typeof replyParentMsgId === "object") {
            replyParentMsgId = replyParentMsgId.id;
          }
          if (!replyParentMsgId || typeof replyParentMsgId !== "string") {
            throw new Error("replyParentMsgId is required.");
          }
          return this.say(channel, message, { ...tags, "reply-parent-msg-id": replyParentMsgId });
        }
        say(channel, message, tags) {
          channel = _.channel(channel);
          if (message.startsWith(".") && !message.startsWith("..") || message.startsWith("/") || message.startsWith("\\")) {
            if (message.slice(1, 4) === "me ") {
              return this.action(channel, message.slice(4));
            } else {
              return this._sendCommand({ channel, command: message, tags }, (res, _rej) => res([channel, message]));
            }
          }
          return this._sendMessage({ channel, message, tags }, (res, _rej) => res([channel, message]));
        }
        slow(channel, seconds) {
          seconds = seconds != null ? seconds : 300;
          return this._sendCommand({ channel, command: `/slow ${seconds}` }, (res, rej) => this.once("_promiseSlow", (err) => !err ? res([_.channel(channel), ~~seconds]) : rej(err)));
        }
        slowoff(channel) {
          return this._sendCommand({ channel, command: "/slowoff" }, (res, rej) => this.once("_promiseSlowoff", (err) => !err ? res([_.channel(channel)]) : rej(err)));
        }
        subscribers(channel) {
          return this._sendCommand({ channel, command: "/subscribers" }, (res, rej) => this.once("_promiseSubscribers", (err) => !err ? res([_.channel(channel)]) : rej(err)));
        }
        subscribersoff(channel) {
          return this._sendCommand({ channel, command: "/subscribersoff" }, (res, rej) => this.once("_promiseSubscribersoff", (err) => !err ? res([_.channel(channel)]) : rej(err)));
        }
        timeout(channel, username, seconds, reason) {
          username = _.username(username);
          if ((seconds != null ? seconds : false) && !_.isInteger(seconds)) {
            reason = seconds;
            seconds = 300;
          }
          seconds = seconds != null ? seconds : 300;
          reason = reason != null ? reason : "";
          return this._sendCommand({ channel, command: `/timeout ${username} ${seconds} ${reason}` }, (res, rej) => this.once("_promiseTimeout", (err) => !err ? res([_.channel(channel), username, ~~seconds, reason]) : rej(err)));
        }
        unban(channel, username) {
          username = _.username(username);
          return this._sendCommand({ channel, command: `/unban ${username}` }, (res, rej) => this.once("_promiseUnban", (err) => !err ? res([_.channel(channel), username]) : rej(err)));
        }
        unhost(channel) {
          return this._sendCommand({ delay: 2e3, channel, command: "/unhost" }, (res, rej) => this.once("_promiseUnhost", (err) => !err ? res([_.channel(channel)]) : rej(err)));
        }
        unmod(channel, username) {
          username = _.username(username);
          return this._sendCommand({ channel, command: `/unmod ${username}` }, (res, rej) => this.once("_promiseUnmod", (err) => !err ? res([_.channel(channel), username]) : rej(err)));
        }
        unvip(channel, username) {
          username = _.username(username);
          return this._sendCommand({ channel, command: `/unvip ${username}` }, (res, rej) => this.once("_promiseUnvip", (err) => !err ? res([_.channel(channel), username]) : rej(err)));
        }
        vip(channel, username) {
          username = _.username(username);
          return this._sendCommand({ channel, command: `/vip ${username}` }, (res, rej) => this.once("_promiseVip", (err) => !err ? res([_.channel(channel), username]) : rej(err)));
        }
        vips(channel) {
          return this._sendCommand({ channel, command: "/vips" }, (res, rej) => this.once("_promiseVips", (err, vips) => !err ? res(vips) : rej(err)));
        }
        whisper(username, message) {
          username = _.username(username);
          if (username === this.getUsername()) {
            return Promise.reject("Cannot send a whisper to the same account.");
          }
          return this._sendCommand({ delay: null, channel: this._globalDefaultChannel, command: `/w ${username} ${message}` }, (_res, rej) => this.once("_promiseWhisper", (err) => err && rej(err))).catch((err) => {
            if (err && typeof err === "string" && err.indexOf("No response from Twitch.") !== 0) {
              throw err;
            }
            const from = _.channel(username);
            const userstate = Object.assign({
              "message-type": "whisper",
              "message-id": null,
              "thread-id": null,
              username: this.getUsername()
            }, this.globaluserstate);
            this.emits(["whisper", "message"], [
              [from, userstate, message, true]
            ]);
            return [username, message];
          });
        }
      };
      Client.prototype.followersmode = Client.prototype.followersonly;
      Client.prototype.followersmodeoff = Client.prototype.followersonlyoff;
      Client.prototype.leave = Client.prototype.part;
      Client.prototype.slowmode = Client.prototype.slow;
      Client.prototype.r9kmode = Client.prototype.r9kbeta;
      Client.prototype.uniquechat = Client.prototype.r9kbeta;
      Client.prototype.r9kmodeoff = Client.prototype.r9kbetaoff;
      Client.prototype.uniquechatoff = Client.prototype.r9kbeta;
      Client.prototype.slowmodeoff = Client.prototype.slowoff;
      module.exports = Client;
    }
  });

  // index.js
  var require_tmi = __commonJS({
    "index.js"(exports, module) {
      var Client = require_Client();
      module.exports = {
        client: Client,
        Client
      };
    }
  });
  return require_tmi();
})();
