export function guestLabelText(label) {
	// Decode sanitizeLabel's escapes once; use the result as text, never HTML.
	return String(label || "").replace(/&lt;|&gt;|&quot;/g, function (entity) {
		if (entity === "&lt;") return "<";
		if (entity === "&gt;") return ">";
		return "\"";
	});
}
