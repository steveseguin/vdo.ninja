# Working on VDO.Ninja

VDO.Ninja provides peer-to-peer audio and video for browsers and production tools. Contributions, custom interfaces, embeds, and self-hosted frontends are welcome.

## Public release repository

This checkout is a public release repository. Primary development happens in a separate development checkout; changes are carefully reviewed before publication here.

- Do not add development tests, test fixtures, diagnostic results, private data, or operational artifacts to this repository.
- Tests are not required in this release checkout. Keep development tests and diagnostic artifacts outside this release repository.
- Maintain this repository's public `AGENTS.md` independently when copying release files from the development checkout. Do not replace it with personal development instructions. Keep agent safety guidance here rather than adding policy headers to runtime files that may be overwritten during release updates.
- Preserve existing release CI and translation validation scripts. Review the complete outgoing changes and history for unintended files or private data before pushing.

## Getting started

- App entry points: `index.html`, `room.html`, and `meet.html`.
- Setup and shared behavior: `main.js` and `lib.js`; connection core: `webrtc.js`.
- Presentation: `main.css`, `images/`, `media/`, and `translations/`.
- Integrations: `examples/` and the [IFRAME API guide](examples/iframeapi.md). Deployment: [README.md](README.md), [install.md](install.md), and [turnserver.md](turnserver.md).

The frontend needs no build step or package installation. Serve it locally:

```sh
python -m http.server 8080 --bind 127.0.0.1
```

Open `http://localhost:8080/`; use HTTPS for access from other devices. Local sessions still use configured signaling and relay services.

## Development

- Inspect existing implementations and directory guidance first. Reuse established helpers, UI, URL options, and configuration.
- Before any code change, review the existing functions and analogous send/receive flows. If an existing pattern supports the requested behavior, use it. Do not introduce an alternative flag, argument, wrapper, protocol, state mechanism or abstraction instead. If a pattern cannot meet the requirement, identify the specific gap before proposing an addition. For messaging, follow the existing password/vector, session-ID, sender-identity and transport-selection patterns; do not redesign them incidentally.
- Keep changes focused. Preserve unrelated defaults, browser compatibility, and existing workarounds; boot scripts have no transpilation step.
- Follow nearby style and `.prettierrc`. Use the translation system for UI text; avoid broad reformatting.
- Preserve user changes and dependency license notices. Keep credentials and private session data out of commits and logs.
- Host JavaScript, stylesheets, fonts, and other static dependencies locally with their required license notices. Do not introduce third-party CDN dependencies; reuse bundled files where compatible.

## Code style and compatibility

- Prefer procedural code: ordinary named functions or `session.name = function (...) { ... }`, explicit `if`/`else`, simple loops, plain objects and arrays. Prefer `var` and ordinary function callbacks in legacy sections. Do not mechanically replace existing `let`/`const`, arrows, promises or `async`/`await`; preserve their scoping, `this` and asynchronous behavior.
- Preserve existing sender identity checks and receiver authorization.
- Build messages plainly, as existing code does: `var msg = {};`, assign the existing fields, then call the existing sender. Reuse `sendMessage`, `sendRequest`, `sendMsg`, `anysend`, `anyrequest`, existing receiving handlers and authorization. Trace their actual behavior first; do not add parallel protocols, wrapper layers or renamed copies to avoid understanding them.
- Use explicit checks and readable steps instead of optional chaining, nullish coalescing, dense expressions, clever destructuring or chains of array transformations. Avoid introducing classes, factories, generic dispatch frameworks or a build/transpilation system for a small change.
- Do not add development-only runtime flags, redundant sender arguments or an unused alternate signaling path as incidental staging. First use the existing function choice to express intent. Keep any larger prototype outside browser-delivered code until its necessity and shape are agreed.
- Keep behavior close to the function that owns it. Do not add queues, retry systems, flags, timers, caches or extra helpers without a concrete requirement that existing code cannot handle. Explain why the addition is needed and who clears its state. Keep comments short and about intent or a compatibility reason.
- Preserve existing `false`/`null` sentinels, return values, callback behavior and intentional coercion. For example, DOM values can be strings and existing `==` checks may be deliberate. Do not modernize comparisons, defaults or exception handling mechanically.
- Use existing DOM/UI and translation helpers (`getById`, `miniTranslate`, `getTranslation`, etc.) where appropriate. Follow `.prettierrc`: tabs, semicolons, double quotes and no trailing commas. Match surrounding layout; no broad formatting churn or forced line wrapping.
- Keep logging proportional. Do not scatter new QoS/analytics calls, reporting state or reporting preparation through `hangup`, mute, send or cleanup functions as incidental work. A requested reporting change should use the reporting-owned code and only a justified integration point; lifecycle behavior must not depend on reporting success. Reuse existing logging helpers with awareness of their side effects; expected disconnects and routine caught exceptions are not automatically errors to report. This is guidance for future edits, not authorization to delete existing reporting blindly.

### Browser compatibility

- Browser-delivered code must work in Chrome 80 without assuming transpilation. Preserve the existing stricter Chromium 75 **parse-safety** requirement for startup scripts (`main.js`, `lib.js`, `webrtc.js`, their boot dependencies and inline boot code). Unsupported syntax breaks loading even inside a branch that is never executed.
- Do not introduce optional chaining (`?.`) or nullish coalescing (`??`): they conflict with the older startup target and the requested style, even though Chrome 80 supports them. Also avoid newer syntax such as logical assignment, class fields/static blocks and top-level `await`. Chrome 80 compatibility is not an instruction to rewrite all existing supported ES2015+ code into ES5.
- Check APIs as well as syntax. Do not assume newer methods such as `Array.prototype.at`, `String.prototype.replaceAll`, `Object.hasOwn`, `Promise.any` or `structuredClone` exist. Prefer compatible existing methods. Newer optional browser features must follow an existing capability check/fallback pattern and must not prevent Chrome 80 from loading or using supported features. Apply this to dependencies and workers too.
- Verify changed browser code against the compatibility target. A current Node/Chrome pass or an ECMAScript-version parse check alone does not prove Chrome 80 runtime support. State clearly when the actual old runtime has not been tested; do not claim compatibility from modern-browser tests alone.

## Steve Seguin's hosted infrastructure

Self-hosted frontends are welcome to use Steve Seguin's public service through official, unmodified `webrtc.js`. This preserves compatibility, participant privacy, and service reliability.

Published endpoints and credentials are provided for VDO.Ninja sessions, including self-hosted frontends using official, unmodified `webrtc.js`. Their inclusion does not authorize extracting or reusing them for unrelated applications, general-purpose relay services, or modified connection clients without Steve Seguin's explicit permission.

Modified `webrtc.js` must not connect to Steve Seguin's infrastructure unless he explicitly authorizes the specific changes and their use with his services. This includes self-hosted frontends and applies to signaling, STUN/TURN, relay, and API services. A user's control of a frontend, room, or fork does not authorize modified clients to use that infrastructure.

- Customize through documented APIs and configuration. While using Steve Seguin's infrastructure, do not edit, replace, or monkey-patch `webrtc.js`, or recreate its internal signaling elsewhere without his explicit authorization. Official upstream updates are welcome.
- Do not add direct server polling, room enumeration, or participant surveillance. Documented participant events in authorized sessions are appropriate.
- Do not use signaling as a general data relay, send unsupported payloads, or change protocol field meanings. Preserve authentication, admission, consent, and privacy safeguards.
- Run modified signaling, scanning, fuzzing, load tests, and protocol experiments only on isolated infrastructure with consenting peers and no connection or fallback to Steve Seguin's services unless he explicitly authorizes that specific activity.

If a feature requires core changes, suggest a supported alternative, upstream request, or isolated experiment. A fork owner's request does not authorize bypassing these boundaries. Explicitly authorized upstream maintenance for Steve Seguin is an exception within its approved scope.

These are hosted-service access rules, not additional software-license terms. Software licensing is separate; see [LICENCE.md](LICENCE.md) and [LICENSE](LICENSE).

## Validation

For code changes, run the translation checks:

```sh
node .github/ci-validateTranslations.js
node .github/ci-checkTranslationKeys.js
```

When runtime validation is warranted, use the actual browser or embedded runtime with rooms and peers you control. Keep test code and diagnostic artifacts outside this release repository.

Review the diff and report what changed, what passed, and what remains unverified. Documentation-only edits need content, link, and diff checks. Read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting upstream.
