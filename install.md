Deploying this code. A guide. 

### PREFACE

The code is obvious enough already that someone experienced with NGINX webservers or with basic site deployments should have no problem getting things running.

I'm concerned at times that less experienced users will be deploying the code without really understanding why or properly how to.  There are few cases a person needs to deploy any code. Those reasons are:  wanting custom branding; contributing as a developer to the codebase; deploying a private TURN server; or running VDO.Ninja without internet on a private LAN.

There may be misconceptions that deploying the website code will make the service faster; it will not. The service is video peer-to-peer based, so deploying webservers servers will not make it faster. Deploying a TURN server may help in some cases, although using a VPN, a cloud VM (for OBS), or disabling any symmetrical firewall will often provide a better end result than a private TURN server.

For those looking for a brand-free experience already with a different domain name, I offer https://rtc.ninja, and as well as other alternate domain names, such as:

- https://invite.cam (via URL obfuscation option)
- https://backup.vdo.ninja (fully backup hosted)
- https://rtc.ninja (de-branded version of vdo.ninja)

There's also the Github-hosted version, which mirrors the master branch of the code repo. https://steveseguin.github.io/vdo.ninja/  You can use this hosted version or fork VDO.Ninja and host it yourself in the same way via Github Pages; it's free and can be done within minutes.

For those wanting a private TURN server setup, you can load the settings for those via the URL parameters. If infrequently needing a private TURN, this is a great solution.  You can also use URL forwarding services to load up a customized link to VDO.Ninja, with URL parameters already included, such as https://invite.mypersonaldomain.com , which might secretly resolve to https://vdo.ninja/?room=myRoom&hash=3423&label or such.

VDO.Ninja also supports IFRAMES, so you can embed VDO.Ninja into your website and customize it via both URL parameters, but also via the IFRAME API.  You can insert custom CSS styles with this method, giving VDO.Ninja quite a bit of flare.

See more on IFRAMES here: https://docs.vdo.ninja/guides/iframe-api-documentation

Understanding clearly why you need to deploy any code or server is important. Maintaining updated deployed code can be quite hard, as VDO.Ninja updates frequently, so there are good reasons to consider an IFRAME approach instead. Feature requests there are welcomed.

That all aside, please continue for instructions for hosting on your own webserver, turn relay server, and more.

### Deplying website on an NGINX web server

There's a community-created video tutorial on setting up here; https://youtu.be/8sDMwBIlgwE  Otherwise, read on.

I use Cloudflare with Flexible SSL enabled and HTTP Rewrites. If you do not use Cloudflare, you will need to deploy SSL certificates onto your website.  You will also have to have Cloudflare or whatever DNS provider you have, point your domain name to the IP address of your webserver. VDO.Ninja REQUIRES a domain name and SSL, unless you modify all  browsers being used to support otherwise. (More on this in the [Internet-free section](#internet-free-deployments) below)

For webservers, I use NGINX on a Ubuntu server; smaller the better. I rely on Cloudflare to provide caching and SSL, so my installation of NGINX is pretty simple. 
```
sudo apt-get update 
apt-get install nginx -y
sudo vi /etc/nginx/sites-available/default
sudo systemctl restart nginx
```

An example NGINX config file that "hides" the file extensions is as follows.  Update the file as needed and 

```server {
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
You'll want to deploy (copy/clone) the GitHub VDO.Ninja files into your NGINX web folder, that is specified in your NGINX config file. Update the NGINX config file to match your domain and and folder, etc. Restart NGINX after.

### Deploying your own media relay TURN Server

As for the TURN relay server, it can run on a single or dual-core computer. It doesn't take much to host many users -- it mainly just needs a good internet connection.  Most users will not need a TURN server, but since VDO.Ninja handles many different types of users, the TURN server is there as a failsafe for those occasional problem users. I'm assuming you know why you need and want a TURN server -- if not, you may not actually need one.

A guide and sample config file for the turn server is here:
https://github.com/steveseguin/vdo.ninja/blob/master/turnserver.md

If deploying to GCP or AWS, you might need to make some tweaks to the IP address values to include the internet local IP as well as the external. Please see online guides no setting up a TURN server for your particular setup. Setups will vary.

Once you have your TURN server setup, you can update the index.html of the VDO.Ninja code. Nightly or official releases should be fine to pull. You probably will want to uncomment the lines linked below once deployed, adjusting the default values to your liking and updating the server location address and credentials of your TURN server (if you deployed one that is).  Unless your TURN server also provides STUN capabilities, you may want to also use the Google STUN servers, so uncomment that stuff too.  

https://github.com/steveseguin/vdo.ninja/blob/df6c147311b9e7d19659ddbb1799d6598f59aa0d/index.html#L644

Also note: There are third-party providers offering TURN services, if you would like a managed third party provider, although they are often quite expensive.

### Further customization of the website code

A new deployment of VDO.Ninja should work without any changes to the index.html file, although you'll want to change it to support your own TURN server and perhaps branding. The VDO.Ninja code needs to be constantly kept up to date though; this is the reality of deploying VDO.Ninja -- you should update it every few months at the very least. As a result, keep this in mind when making changes to the VDO.Ninja source code, as heavy custom changes will make updating harder to do. The fewer the changes the better.

My suggestion to extensive editing? Limit changes to images and perhaps the translation files (maybe add a new one); these are good starting points. If making changes to the main.css style sheet or index.html file, you should be mostly okay too, since these files are designed to be changed; I try to keep that in mind when updating the code at least. Making changes to other files though is strongly not recommend and in some cases discouraged. If you find a bug or need to make a change to other files, it might be best to make a Pull Request with the desired changes and hope it gets adopted into the main codebase.

### Internet-free deployments 

For those looking to deploy a completely Internet-free or fully-isolated hosting option, you'll need to deploy your own handshake server, and you may also need to deploy your own STUN/TURN service. STUN/TURN might not be needed on a Local Area Network, and TURN might not be needed at all if you have control over each participant connecting, but adding one isn't too hard and can help with firewall and mobile network issues.

As of this writing, VDO.Ninja uses Google's public STUN servers, but most TURN-servers also offer optional STUN server functionality as well. Details on deploying a TURN server are mentioned previously in this article, so following those instructions should suffice if you wish to have a combined STUN/TURN service.

#### Dealing with no SSL scenarios

Internet-free deployments will also need to deal with private SSL certificates and any DNS secure context issues that may arise. VDO.Ninja relies on SSL for security, but if you can't figure out how to do private SSL issuance, these SSL restrictions can be somewhat disabled at the browser's command-line or for localhost via the Chrome://flags settings. VDO.Ninja may complain about the lack of security if you take this approach though, but you can edit out those lines of code which trigger those warnings as needed. You may still need to issue an SSL certificate, self-signed or what not, but with these flags enabled it doesn't at least need to be valid.

Setting it via command line on Windows,
```
"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --ignore-certificate-errors
```
and on macOS
```
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --ignore-certificate-errors --ignore-urlfetcher-cert-requests &> /dev/null
```
and if you intend to only access it as a localhost,
```
chrome://flags/#allow-insecure-localhost
```
### Hand-shake server deployment

Finally, there is a handshake server hosting option available; advanced users can host their own personal handshake server, which is useful for air-gapped private deployments of the service. Some basic documentation with instructions on setting it up are included here: https://github.com/steveseguin/websocket_server.  Just be sure that your SSL-certifcates are valid or that you modify your browser to support invalid SSL certificates, else it will not work. From there, you just need to modify a couple ilnes in the index.html file of VDO.Ninja to configure things.

Please note that despite how simple the provided handshake server appears, it does work quite well. VDO.Ninja was designed to be as serverless and agnostic as possible, so it will work with 3rd-party signaling services as well, such as piesocket.com, and even certain blockchain networks, IRC, and more (with a bit of added tweaking at course).

WebRTC is very prickly about security, so if you run into issues with things not working, double check your SSL settings first.

Regards,
Steve
