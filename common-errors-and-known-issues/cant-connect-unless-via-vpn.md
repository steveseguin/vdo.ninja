# Can't connect unless via VPN

Here's a concise list of things to check if a user can't connect to VDO.Ninja:

### Connectivity Troubleshooting Checklist

#### WebSocket Connection Issues

Check if you can connect to websocket server, and if not:

* Try proxy mode via `proxy.vdo.ninja` or `vdo.ninja/?proxy`
* Use backup server at `https://backup.vdo.ninja`
* Try alternate websocket client: `vhttps://vdo.ninja/?wss2=wss.socialstream.ninja&push=LNZFxhQ`
* Consider using your own websocket server with `vdo.ninja/?wss=serverhere.com`

#### WebRTC Connection Issues

* Check for cellular connection issues (UDP throttling/blocking)
* Try a different browser (Firefox, Chrome, Edge)
* Use incognito mode to test without extensions
* Disable browser extensions or security options blocking WebRTC
* Allow IP leaking in browser settings
* Ensure WebRTC is enabled
* Avoid de-Googled or highly secured/privacy browsers
* For Safari: ensure microphone permissions are granted

#### Network/Firewall Issues

* Check corporate firewalls blocking WebRTC/UDP
* Modify pfSense firewall settings to allow WebRTC/UDP traffic
* Check for symmetrical firewalls (contact ISP)
* Try a VPN service like Speedify
* Enable TCP encapsulation mode if UDP throttling occurs
* Run diagnostics at `vdo.ninja/speedtest`, `vdo.ninja/check`, or `vdo.ninja/browsercheck`
* Add `&stats` to VDO.Ninja URL to check connection stats
* Check for network configuration issues (double NAT setups)
* Ensure ports TCP 443, UDP 3478, and UDP 49152-65535 are open

#### Quick Solutions

* Restart all devices, including WiFi Router
* Update browser to latest version
* Try different network (WiFi vs cellular)
* Restart your [winsock ](../guides/how-to-restart-your-winsock.md)if on Windows
* Use [https://proxy.vdo.ninja](https://proxy.vdo.ninja/) to access VDO.Ninja via a hosted Cloudflare proxy
* Use a version of VDO.NInja hosted in Hong Kong instead of in North America: [https://china.vdo.ninja/alpha/](https://china.vdo.ninja/alpha/)
* For persistent issues, use an older version like `vdo.ninja/v27.4`
