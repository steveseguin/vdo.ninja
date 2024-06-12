Deploying this code. A guide. 

### PREFACE

The code is obvious enough already that someone experienced with NGINX webservers or with basic site deployments should have no problem getting things running.

I'm concerned at times that less experienced users will be deploying the code without really understanding why or properly how to.  There are few cases a person needs to deploy any code. Those reasons are:  wanting custom branding; contributing as a developer to the codebase; deploying a private TURN server; or running VDO.Ninja without internet on a private LAN.

There may be misconceptions that deploying the website code will make the service faster; it will not. The service is video peer-to-peer based, so deploying webservers servers will not make it faster. Deploying a TURN server may help in some cases, although using a VPN, a cloud VM (for OBS), or disabling any symmetrical firewall will often provide a better end result than a private TURN server.

For those looking for a brand-free experience already with a different domain name, I offer https://rtc.ninja, and as well as other alternate domain names, such as:

- https://invite.cam (via URL obfuscation option)
- https://backup.vdo.ninja (fully backup hosted)

There's also the Github-hosted version, which mirrors the master branch of the code repo. https://steveseguin.github.io/vdo.ninja/  You can use this hosted version or fork VDO.Ninja and host it yourself in the same way via Github Pages; it's free and can be done within minutes. I provide a video guide on how to do this here, https://www.youtube.com/watch?v=uYLKkX2_flY, and it's what I recommend for most users looking to deploy their own version of VDO.Ninja.

For those wanting a private TURN server setup, you can load the settings for those via the URL parameters. If infrequently needing a private TURN, this is a great solution.  You can also use URL forwarding services to load up a customized link to VDO.Ninja, with URL parameters already included, such as https://invite.mypersonaldomain.com , which might secretly resolve to https://vdo.ninja/?room=myRoom&hash=3423&label or such.

VDO.Ninja also supports IFRAMES, so you can embed VDO.Ninja into your website and customize it via both URL parameters, but also via the IFRAME API.  You can insert custom CSS styles with this method, giving VDO.Ninja quite a bit of flare.

See more on IFRAMES here: https://docs.vdo.ninja/guides/iframe-api-documentation

Understanding clearly why you need to deploy any code or server is important. Maintaining updated deployed code can be quite hard, as VDO.Ninja updates frequently, so there are good reasons to consider an IFRAME approach instead. Feature requests there are welcomed.

That all aside, please continue for instructions for hosting on your own webserver, turn relay server, and more.

### Deploy to GitHub pages: the quick and simple method

For a very simple method on how to deploy VDO.Ninja, there's a detailed video guide here: https://www.youtube.com/watch?v=uYLKkX2_flY 

Most users might find the Github Pages deployment option easiest and quickest. 

### Deploying to a NGINX web server

For advanced users, NGINX might be more appropriate than using Github Pages, so find written directions below. There's also a community-created video tutorial on setting up on AWS + Nginx here; https://youtu.be/8sDMwBIlgwE, but it's not an official install guide.

Please consider the below directions just loose guidelines; you may need to change things up depending on factors like firewalls, operating system versions, and other factors.  This NGINX install guide makes some assumptions that you know the basics of NGINX, running Linux servers, domain name setup, and code deployments. Most users getting stuck do because of the SSL requirement, or because of overly complicated firewall/VPS setups.

Please note, VDO.Ninja REQUIRES a domain name and SSL, unless you modify all browsers being used to support otherwise. (More on this in the [Internet-free section](#internet-free-deployments) below)  As a result, getting VDO.Ninja working can be quite challenging, as setting up domain names and SSL can be tricky for some. 

The following commands will setup NGINX, assuming you are running on a standard Ubuntu server. 
```
sudo apt-get update 
apt-get install nginx -y
sudo vi /etc/nginx/sites-available/default
sudo systemctl restart nginx
```

If you need to download the code for VDO.Ninja, the basic idea is something like this:

```
sudo apt-get install git -y
cd /var/www/html
git clone https://github.com/steveseguin/vdo.ninja
```

To keep things easy, Steve generally recommends using Cloudflare to provide caching and SSL, but you can google `Certbot` for another free SSL option. The below NGINX config assumes you are using Cloudflare's flexible SSL option, which is the simpliest way to get started.  You'll need to also add the VDO.Ninja code to the /var/www/html/vdo.ninja folder (or whatever you set it to) and modify the port/SSL/domain-name settings as needed.

```
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

`sudo systemctl reload nginx` will reload the settings after making changes.

At this point, if you've managed to make it this far, you should have VDO.Ninja's web code hosted and accessible via your domain name.

You can find many settings for VDO.Ninja at the bottom of the `index.html` file, including settings for specifiying TURN servers and default values.


### Deploying your own media relay TURN Server

As for the TURN relay server, a basic one can run on a single or dual-core computer; 2GB of RAM or more recommended though. It doesn't take much of a server to host a few users -- it mainly just needs a good internet connection.  Most users will not need a TURN server, but since VDO.Ninja handles many different types of users, the TURN server is there as a failsafe for those occasional problem users. I'm assuming you know why you need and want a TURN server -- if not, you may not actually need one.

A guide and sample config file for the turn server is here:
https://github.com/steveseguin/vdo.ninja/blob/master/turnserver.md

If deploying to GCP or AWS, you might need to make some tweaks to the IP address values to include the internet local IP as well as the external. Please see online guides no setting up a TURN server for your particular setup. Setups will vary, especially if you need a TURN server that has TLS, IPv6 support, or token-based auth support.

Once you have your TURN server setup, you can update the index.html of the VDO.Ninja code (near the bottom) with your TURN/STUN settings.

https://github.com/steveseguin/vdo.ninja/blob/df6c147311b9e7d19659ddbb1799d6598f59aa0d/index.html#L644

Also note: There are third-party providers offering TURN services, if you would like a managed third party provider, although they are often quite expensive. Some example code on using Twillio as a TURN provider, with auth logic, can be found in the main.js file. 

### Further customization of the website code

A new deployment of VDO.Ninja should work without any changes to the index.html file, although you'll want to change it to support your own TURN server and perhaps branding. The VDO.Ninja code needs to be constantly kept up to date though; this is the reality of deploying VDO.Ninja -- you should update it every few months at the very least. As a result, keep this in mind when making changes to the VDO.Ninja source code, as heavy custom changes will make updating harder to do. The fewer the changes the better.

My suggestion to extensive editing? Limit changes to images and perhaps the translation files (maybe add a new one); these are good starting points. If making changes to any style sheets in the ./css folder or index.html file, you should be mostly okay too, since these files are designed to be changed; I try to keep that in mind when updating the code at least. Making changes to other files though is strongly not recommend and in some cases discouraged. If you find a bug or need to make a change to other files, it might be best to make a Pull Request with the desired changes and hope it gets adopted into the main codebase.

### Internet-free deployments 

For those looking to deploy a completely Internet-free or fully-isolated hosting option, you'll need to deploy your own handshake server. You may not need to deploy a TURN / STUN server if using things just on a LAN.

I've created an install script, and also am providing a Raspberry Pi image, for those looking for a simple working example of how to do it all.
See it here: https://github.com/steveseguin/offline_deployment

Note, if doing things yourself, since you will be using a private handshake server, don't forget that you'll need to specify that in the VDO.Ninja index.html file.

Lastly, SSL self-signed certificates will be a haunting issue for those not experienced. See below for a bit of direction on options there.

#### Dealing with no SSL scenarios

Internet-free deployments will also need to deal with private SSL certificates and any DNS secure context issues that may arise. VDO.Ninja relies on SSL for security, but without Internet, you'll need to create and use a private ceriticate that get added to your system's trusted certificate key chain.

On Mac, you open the Keychain Access and add the cert to the Certificates section, allowing it always. It's a bit more work on PC, but Google is your friend there. There's also plenty of guides on using openssl to create a self-signed certiificates als.

If you can't figure out how to do private SSL issuance, these SSL restrictions can be somewhat disabled at the browser's command-line or for localhost via the Chrome://flags settings. VDO.Ninja may complain about the lack of security if you take this approach though, but you can edit out those lines of code which trigger those warnings as needed. You may still need to issue an SSL certificate, self-signed or what not, but with these flags enabled it doesn't at least need to be valid.

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
