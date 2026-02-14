# getLoudness

General Option! ([`&push`](../../source-settings/push.md), [`&view`](../../advanced-settings/view-parameters/view.md), [`&scene`](../../advanced-settings/view-parameters/scene.md))

## Options

| Value | Description |
| ----- | ----------- |
| true  | Enables loudness monitoring and subscribes to updates. Returns an immediate snapshot. |
| false | Disables loudness monitoring updates. |

## Notes

- Loudness push is opt-in and off by default.
- You only need to call `getLoudness: true` once to start continuous updates.
- Updates are delivered via `postMessage` with `action: "loudness"`.
- The initial response is `mode: "snapshot"`; ongoing events are `mode: "update"`.
- `&pushloudness` (or `&getloudness`) in the iframe URL auto-enables loudness updates.
- `cib` is echoed back only if you provide `cib` when enabling loudness.
- Do not poll `getLoudness` repeatedly.

### Example

```javascript
// Subscribe once
iframe.contentWindow.postMessage({
	getLoudness: true,
	cib: "loudness-subscription"
}, "*");

// Listen for snapshot + updates
window.addEventListener("message", function (e) {
	if (!e.data || !e.data.loudness) return;
	if (e.data.action !== "loudness") return;
	// e.data.mode is "snapshot" or "update"
	console.log(e.data.loudness, e.data.mode);
});

// Stop updates
iframe.contentWindow.postMessage({
	getLoudness: false
}, "*");
```
