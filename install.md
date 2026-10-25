# Deploying VDO.Ninja

This guide covers hosting the VDO.Ninja website yourself, plus the optional TURN and handshake (signaling) servers.

## Do you need to deploy?

You usually need your own deployment only to:

- use custom branding;
- develop or test code changes;
- hard-code a private TURN server;
- run VDO.Ninja on a private LAN without internet.

Hosting the website yourself does not make video faster, because video flows peer to peer, not through the web server. If you are considering a TURN server for quality, a VPN, a cloud VM for OBS, or removing a symmetric firewall often works better.

Alternatives that need no deployment:

- **Other hosted domains:** https://rtc.ninja (brand-free), https://invite.cam (URL obfuscation) and https://backup.vdo.ninja (a fully separate backup host).
- **A private TURN server on the hosted site:** pass it with [`&turn`](https://docs.vdo.ninja/general-settings/turn), for example `&turn=user;password;turn:turn.example.com:3478`.
- **A custom link:** use a URL-forwarding service so that, for example, `https://invite.example.com` redirects to `https://vdo.ninja/?room=myRoom&label`.
- **Embedding:** put VDO.Ninja in an IFRAME on your own site and control it with URL parameters, custom CSS and the IFRAME API. See [IFRAME.md](IFRAME.md) and the [IFRAME API guide](https://docs.vdo.ninja/guides/iframe-api-documentation).

VDO.Ninja changes often, and you must keep a deployment updated yourself. Embedding avoids that work.

## Option 1: GitHub Pages

This is the quickest option and is free. Fork the repository and publish it with GitHub Pages. Steve's video guide shows the steps: https://www.youtube.com/watch?v=uYLKkX2_flY

The repository includes a Pages workflow (`.github/workflows/static.yml`) that deploys the `develop` branch. It publishes https://steveseguin.github.io/vdo.ninja/.

## Option 2: NGINX on Ubuntu

These steps assume you know the basics of Linux servers, NGINX and DNS. Treat them as a starting point; firewalls, OS versions and hosting providers vary. Most problems come from TLS (HTTPS) or complicated firewall setups. A community video shows an AWS + NGINX setup (not an official guide): https://youtu.be/8sDMwBIlgwE

Other devices need HTTPS with a valid certificate. On the same computer, `http://localhost` works without TLS.

1. Install NGINX and Git, and download the code:

   ```sh
   sudo apt-get update
   sudo apt-get install -y nginx git
   cd /var/www/html
   sudo git clone https://github.com/steveseguin/vdo.ninja
   ```

2. Edit `/etc/nginx/sites-available/default`. The example below assumes Cloudflare provides HTTPS and caching with its Flexible SSL mode, so NGINX listens on port 80. To terminate TLS on the server instead, get a certificate with Certbot and add a TLS listener. Change `server_name` and `root` to match your setup.

   ```nginx
   server {
           listen 80;
           listen [::]:80;

           server_name vdo.ninja;

           root /var/www/html/vdo.ninja;
           index index.html;


           location ~ ^/([^/]+)/([^/?]+)$ {
                   root /var/www/html/vdo.ninja;
                   try_files /$1/$2 /$1/$2.html /$1/$2/ /$2 /$2/ /$1/index.html;
                   add_header Access-Control-Allow-Origin *;
           }

           location / {
                   if ($request_uri ~ ^/(.*)\.html$) {
                           return 302 /$1;
                   }
                   try_files $uri $uri.html $uri/ /index.html;
                   add_header Access-Control-Allow-Origin *;
           }
   }
   ```

   This serves pages without the `.html` extension (for example, `/mixer` loads `mixer.html`) and redirects `.html` addresses to the shorter form.

3. Reload NGINX: `sudo systemctl reload nginx`

The site should now load from your domain.

## Configure your deployment

A new deployment works without changes. The settings block near the bottom of `index.html` holds the options you are most likely to change:

| Setting | Use |
| --- | --- |
| `session.defaultPassword` | Change it on your own deployment for added privacy. |
| `session.stunServers` | STUN servers. Google and Cloudflare are the defaults. |
| TURN setup sections | Add your own TURN servers, or load time-limited credentials from `turn-credentials.php` (see [turnserver.md](turnserver.md)). |
| `session.configuration.iceTransportPolicy = "relay"` | Always relay through TURN, like `&relay`. |
| `session.wss` and `session.customWSS` | Use your own handshake server. |
| `session.apiserver`, `session.whipServerURL`, `session.mediamtx` | Your own API, WHIP or MediaMTX services. |
| Other `session.*` lines | Defaults for many URL parameters, such as bitrate, codec, language and dark mode. |

Keep changes small. Update your deployment every few months at least; heavy changes make updates harder to merge. For branding, start with images, the translation files, `main.css` and `index.html`. For changes to shared behavior, consider a pull request so the fix is maintained upstream.

## TURN server

Most users do not need a TURN server. It is a fallback for users whose networks block direct connections. A small server with one or two CPU cores and 2 GB of RAM can serve a few users; the network connection matters most.

See [turnserver.md](turnserver.md) for a Coturn setup and the included sample files. On GCP or AWS the server often sits behind NAT, so you may need to map its public and private addresses. TLS, IPv6 and token authentication each add setup steps.

Third-party TURN providers exist but are often expensive. `main.js` includes a sample that loads Twilio TURN credentials from a backend when a link uses `&turn=twilio`. Its request URL is a placeholder (`https://turn.example.com:443/twilio`), so replace it with your own credential service.

## Handshake server

To run without VDO.Ninja's signaling servers, deploy your own handshake server from https://github.com/steveseguin/websocket_server. Then either:

- set `session.wss` in `index.html` (add `session.customWSS = true` for the basic fanout servers); or
- add it to each link: `&wss=` for the basic fanout servers, or `&wss2=` for the advanced routing server (`vdoninja_advanced.js`). Use the same option on both publisher and viewer links.

The server needs a valid TLS certificate, or browsers set to accept invalid certificates. WebRTC is strict about security, so check TLS first when connections fail.

## Internet-free deployments

A fully isolated setup needs its own website, handshake server and certificates. On a LAN you may not need TURN or STUN. The [offline_deployment](https://github.com/steveseguin/offline_deployment) project provides an install script and a Raspberry Pi image, and configures the website for its local handshake server. If you build it yourself, remember to point `index.html` at your handshake server.

### Certificates without internet

Browsers allow camera and microphone access only on HTTPS or `localhost`. Over plain HTTP, VDO.Ninja logs a console warning and capture is blocked.

The reliable fix is a private certificate authority. Issue the server certificate from it, then install the CA's public root certificate on every client device and mark it as trusted. On macOS, add it in Keychain Access and set it to "Always Trust". The [offline_deployment certificate guide](https://github.com/steveseguin/offline_deployment/blob/main/docs/certificates.md) covers browsers, OBS and native apps.

As a last resort for testing, Chrome can ignore certificate errors. You still need a certificate, but it does not need to be valid.

Windows (older installs use `Program Files (x86)`):

```
"C:\Program Files\Google\Chrome\Application\chrome.exe" --ignore-certificate-errors
```

macOS:

```
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --ignore-certificate-errors --ignore-urlfetcher-cert-requests &> /dev/null
```

For HTTPS on `localhost` only, enable `chrome://flags/#allow-insecure-localhost`.

VDO.Ninja's signaling is not tied to one server. It has worked with third-party signaling services such as PieSocket (`&pie`, now deprecated), and other transports are possible with code changes.
