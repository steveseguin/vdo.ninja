Deploying this code. A guide.  (INITIAL DRAFT VERSION)

### PREFACE

The code is obvious enough already that someone experienced with the NGINX webserver or with basic site deployments should have no problem getting things running.

I'm concerned at times that less experienced users will be deploying the code without really understanding why or properly how to.  There are few cases a person needs to deploy any code.  

Those reasons are:  wanting custom branding; contributing as a developer to the codebase; or deploying a private TURN server.

For a subset of those users even, they might still have better options available.

I offer https://rtc.ninja for those looking for a brand-free experience already. You can also point your domain to the OBS.Ninja IP address (provided on request), which will also rebrand the site automatically to match your domain name.

For those wanting a private TURN server setup, you can load the settings for those via the URL parameters. If infrequently needing a private TURN, this is a great solution.

There are also misconceptions. Deploying the website code will NOT make the service faster. The service is peer-to-peer based, so deploying servers will not make it faster in nearly all cases. Even deploying a TURN server is often not advisable, as using a VPN, cloud VM for OBS, or disabling any symmetrical firewall will often provide a better end result.

### SETUP

I use Cloudflare with Flexible SSL enabled and HTTP Rewrites. If you do not use Cloudflare, you will need to deploy SSL certificates onto  your website.  Have Cloudflare point the domain name to the IP address of your webserver.

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

        server_name obs.ninja;

        root /var/www/html/obs.ninja;
        index index.html;


        location ~ ^/([^/]+)/([^/?]+)$ {
                root /var/www/html/obs.ninja;
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
You'll want to deploy (copy) the GitHub OBS.Ninja files into your NGINX web folder, that is specified in your NGINX config file. Update the NGINX config file to match your domain and and folder, etc.


As for the TURN server, it can run on a single or dual-core computer. It doesn't take much to host many users -- it mainly just needs a good internet connection

A guide and sample config file are here:
https://github.com/steveseguin/obsninja/blob/master/turnserver.md

If deploying to GCP or AWS, you might need to make some tweaks to the IP address values to include the internet local IP as well as the external.  

Once you have your TURN server setup, you can update the index.html of the OBS.Ninja code. You want to uncomment the lines see below, adjusting the default values to your liking and updating the location and credentials for your TURN server.  Unless your TURN server also provides STUN capabilities, you will want to also use the Google STUN servers, so uncomment that stuff too.

https://github.com/steveseguin/obsninja/blob/df6c147311b9e7d19659ddbb1799d6598f59aa0d/index.html#L644

The deployment will work without any changes to the index.html file, at least for some months.  The code needs to be constantly kept up to date, as after a few months it may become deprecated and stop working.  This is the reality of deploying OBS.Ninja -- you will need to update it every few months for it to continue to function well. Keep this in mind that when making changes to the OBS.Ninja source code, as heavy custom changes will make updating harder to do.

My suggestion? Limit changes to images and perhaps the translation files (maybe add a new one); these are good starting points. If making changes to the main.css style sheet or index.html file, you should be mostly okay as well, since these files are designed to be changed. I try to keep that in mind when updating the code at least. Making changes to other files though is strongly not recommend and in some cases discouraged. If you find a bug or need a change to other files, it might be best to make a Pull Request with the desired changes, so it can be adopted into the main code base for everyone.
