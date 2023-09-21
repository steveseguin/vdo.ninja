var trans = {
  "titles": {
    "join-by-room-name-here": "Enter a room name to quick join",
    "join-room": "Join room",
    "enable-the-chrome-experimental-features-flag-to-use-chrome-flags-enable-experimental-web-platform-features": "Enable the Chrome experimental features flag to use: chrome://flags/#enable-experimental-web-platform-features"
  },
  "innerHTML": {
    "mute-guest": "Mute Guest",
    "logo-header": "\n<font id=\"qos\" style=\"color: white;\">V</font>DO.Ninja \n",
    "start": "START",
    "update-your-device": "We've detected that you are using an old version of Apple iOS, which is known to have many issues.<br><br>Please consider updating.",
    "publish-via-whip": "Publish via WHIP",
    "share-whepsrc": "Share via WHEP",
    "enter-the-whep-URL-you-wish-to-share": "Enter the WHEP URL you wish to share."
  },
  "placeholders": {
    "join-by-room-name-here": "Join by Room Name here",
    "enter-chat-message-to-send-here": "Enter chat message to send here",
    "enter-your-message-here": "Enter your message here",
    "-whip-url-to-publish-to-goes-here": "➡️ WHIP URL to publish to goes here",
    "-authentication-bearer-token-optional-": "🗝️ Authentication Bearer Token (optional)"
  },
  "miscellaneous": {
    "start": "START",
    "new-display-name": "Enter a new Display Name for this stream",
    "this-is-you": "This is you, a co-director.<br />You are also a performer.",
    "preview-meshcast-disabled": "You can't adjust the preview bitrate for Meshcast-based streams"
  }
};

function getAllContentNodes(element) { // takes an element.
	if (!element.childNodes || !element.childNodes.length){
		element.textContent =  pigLatin(element.textContent) || "";
	}
	element.childNodes.forEach(node=>{
		if (node.childNodes.length){
			getAllContentNodes(node)
		} else if ((node.nodeType === 3) && (node.textContent.trim().length > 0)){
			node.textContent = pigLatin(node.textContent) || "";
		}
	});
}

function pigLatin(input) { // should be safe for line breaks, etc.
	var vowels = ["a", "e", "i", "o", "u"];
	var translated = "";
	var cluster = "";
	if (vowels.includes(input[0])){
		translated = input + "way";
	} else {
		for (var i = 0; i < input.length; i++) {
			if (!vowels.includes(input[i])){
				cluster += input[i];
			} else {
				translated = input.substring(i) + cluster + "ay";
				break;
			}
			translated = input + "ay";
		}
	}
	return translated;
}

var xx = document.createElement("span");

Object.keys(trans).forEach(main=>{
	Object.keys(trans[main]).forEach(key=>{
		xx.innerHTML = trans[main][key];
		getAllContentNodes(xx);
		trans[main][key] = xx.innerHTML;
	});
});

console.log(JSON.stringify(trans)); // clean up and use.