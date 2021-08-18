Deploying this code. A guide. 

### PREFACE

The code is obvious enough already that someone experienced with NGINX webservers or with basic site deployments should have no problem getting things running.

I'm concerned at times that less experienced users will be deploying the code without really understanding why or properly how to.  There are few cases a person needs to deploy any code. Those reasons are:  wanting custom branding; contributing as a developer to the codebase; or deploying a private TURN server.

There may be misconceptions that deploying the website code will make the service faster; it will not. The service is video peer-to-peer based, so deploying webservers servers will not make it faster. Deploying a TURN server may help in some cases, although using a VPN, a cloud VM (for OBS), or disabling any symmetrical firewall will often provide a better end result than a private TURN server.

For those looking for a brand-free experience already with a different domain name, I offer https://rtc.ninja, and as well as other alternate domain names, such as:

- https://invite.cam (via URL obfuscation option)
- https://ltt.ninja
- https://rtc.ninja
- https://vmix.ninja
- https://auxiliary.live (backup hosted)
- https://backup.vdo.ninja (fully backup hosted)

There is also an isolated version specificly designed for use in mainland China, hosted at https://insecure.cam in Hong Kong AWS.

You can also point your domain to the VDO.Ninja IP address (provided on request), which will also rebrand the site automatically to match your domain name. (Requires Cloudflare as DNS server and proxy, Flexible SSL cert on, and HTTPs always on - all free.) 

For those wanting a private TURN server setup, you can load the settings for those via the URL parameters. If infrequently needing a private TURN, this is a great solution.  You can also use URL forwarding services to load up a customized link to VDO.Ninja, with URL parameters already included, such as https://invite.mypersonaldomain.com , which might secretly resolve to https://vdo.ninja/?room=myRoom&hash=3423&label or such.

VDO.Ninja also supports IFRAMES, so you can embed VDO.Ninja into your website and customize it via both URL parameters, but also via the IFRAME API.  You can insert custom CSS styles with this method, giving VDO.Ninja quite a bit of flare.

See more on IFRAMES here: https://github.com/steveseguin/vdo.ninja/blob/master/IFRAME.md

Understanding clearly why you need to deploy any code or server is important. Maintaining updated deployed code can be quite hard, as VDO.Ninja updates frequently, so there are good reasons to consider an IFRAME approach instead. Feature requests there are welcomed.

That all aside, please continue:

### SETUP

There's a community-created video tutorial on setting up here; https://youtu.be/8sDMwBIlgwE  Otherwise, read on.

I use Cloudflare with Flexible SSL enabled and HTTP Rewrites. If you do not use Cloudflare, you will need to deploy SSL certificates onto your website.  You will also have to have Cloudflare or whatever DNS provider you have, point your domain name to the IP address of your webserver. VDO.Ninja REQUIRES a domain name and SSL.

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


As for the TURN server, it can run on a single or dual-core computer. It doesn't take much to host many users -- it mainly just needs a good internet connection.  Most users will not need a TURN server, but since VDO.Ninja handles many different types of users, the TURN server is there as a failsafe for those occasional problem users. I'm assuming you know why you need and want a TURN server -- if not, you may not actually need one.

A guide and sample config file for the turn server is here:
https://github.com/steveseguin/vdo.ninja/blob/master/turnserver.md

If deploying to GCP or AWS, you might need to make some tweaks to the IP address values to include the internet local IP as well as the external. Please see online guides no setting up a TURN server for your particular setup. Setups will vary.

Once you have your TURN server setup, you can update the index.html of the VDO.Ninja code. Nightly or official releases should be fine to pull. You probably will want to uncomment the lines linked below once deployed, adjusting the default values to your liking and updating the server location address and credentials of your TURN server (if you deployed one that is).  Unless your TURN server also provides STUN capabilities, you may want to also use the Google STUN servers, so uncomment that stuff too.  

https://github.com/steveseguin/vdo.ninja/blob/df6c147311b9e7d19659ddbb1799d6598f59aa0d/index.html#L644

A newly deployed code deployment should work without any changes to the index.html file. The code needs to be constantly kept up to date though, as after a few months it may become deprecated and stop working. This is the reality of deploying VDO.Ninja -- you will need to update it every few months for it to continue to function well. Keep this in mind when making changes to the VDO.Ninja source code, as heavy custom changes will make updating harder to do. The fewer the changes the better.

My suggestion? Limit changes to images and perhaps the translation files (maybe add a new one); these are good starting points. If making changes to the main.css style sheet or index.html file, you should be mostly okay too, since these files are designed to be changed; I try to keep that in mind when updating the code at least. Making changes to other files though is strongly not recommend and in some cases discouraged. If you find a bug or need to make a change to other files, it might be best to make a Pull Request with the desired changes and hope it gets adopted into the main codebase.

### Internet-free deployments

For those looking to deploy a completely Internet-free or fully-isolated option, you'll need to deploy your own STUN services and a handshake server as well.

Details on how to deploy your own private STUN server can be Googled online; it's rather out of the scope of this guide's goals though.  As of this writing, VDO.Ninja uses Google's public STUN servers, but most TURN-servers offers STUN server functionality as well; just takes some added configuration. 

Internet-free deployments will also need to deal with private SSL certificates and any DNS secure context issues that may arise. VDO.Ninja relies on SSL for security, but if you can't figure out how to do private SSL issuance, these SSL restrictions can be disabled via the Chrome browser's command-line. VDO.Ninja may complain about the lack of security if you take this approach though.

Finally, there is an experimental handshake server option that lets advanced users use a basic/generic websocket service as a personal handshake server; useful for air-gapped private deployments of the service.  A simple socket server has been developed that can be used as a personal handshake server. Documentation with installation instructions are included here: https://github.com/steveseguin/websocket_server

Just on a side note, support for piesocket.com has also been added as a third-party handshake-server service option, which demonstrates and offers a cheap alternative to a managed hosted alternative of the official handshake service. If using piesocket, you can just do &pie=APKKEY to use that service, without deploying any code or servers yourself. The free tier is quite generous and I have no affiliation with them, but you'll need the Internet to make use of their service.

Regards,
Steve
