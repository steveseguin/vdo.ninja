## Install and setup guide for a TURN Relay Server

#### why? You may want to deploy one to ensure high compatiblity with remote guests. If you try to use the official VDO.Ninja TURN servers for a private deployment, you may find yourself getting kicked off.

This install script and config file was used with a standard virtual machine server loaded with Ubuntu 20.  GCP/AWS servers might need slightly different settings.

```
sudo apt-get update # update package lists
 
sudo apt-get install coturn -y # install coturn, the implementation of the TURN server
sudo vi /etc/default/coturn # open the coturn configuration in Vim (you can also use nano or any other editor)
```
...and we uncomment the line:
```
#TURNSERVER_ENABLED=1
```
….leaving it like this:
```
TURNSERVER_ENABLED=1
```
If we want to support TCP / TLS, we need an SSL certificate installed. Certbot has lots of issues to work around, but it's free. If you buy a cert some where else, you may need to convert your certificate to one that's compatible with coturn. Either way, adding TCP/TLS is a pain that isn't needed for 99% of the users out there.
```
sudo add-apt-repository ppa:certbot/certbot # Add the certbot repository
sudo apt-get install certbot -y # Install certbot required for the HTTPS certificate
sudo certbot certonly --standalone # only generate the HTTPS certificate without actually changing any configs
```
If you want to setup a firewall or configure an existing firewall, you can see the below setup and configurations.  This can often be skipped for new Ubuntu installations, but I'll leave that up to you
```
sudo apt install net-tools
sudo ufw allow 3478/tcp # The default coturn TCP port
sudo ufw allow 3478/udp # The default coturn UDP port
sudo ufw allow 443/tcp # The HTTPS TCP port
sudo ufw allow 443/udp # The HTTPS UDP port
sudo ufw allow 49152:65535/tcp
sudo ufw allow 49152:65535/udp
```
If we expect heavy usage of this server, like hundreds of connections, you might want to ensure your system supports enough open sockets. I'm not sure if this actually works or is needed, but you can see this article for example on how to increase the number of available sockets on Ubuntu: https://medium.com/@muhammadtriwibowo/set-permanently-ulimit-n-open-files-in-ubuntu-4d61064429a 

If you do want to increase the connection limit, for larger systems, it's as follows:
```
ulimit -n 65535
sudo vim /etc/sysctl.conf
```
Add the following line to the file anywhere (with vim, press i to insert new text and :wq to save and exit)
```
fs.file-max = 65535
```
Once saved, you can apply the changes
```
sudo sysctl -p
```
And that should have set the connection limit to be higher now.

Next, update turnserver.conf with passwords, domain names, and whatever else that needs changing.  Example contents are provided below.  Once you have updated it, start the TURN server and ensure it started correctly.  At the bottom of this page is a sample conf file; I personally use `turnserver3.conf` (https://github.com/steveseguin/vdo.ninja/blob/master/turnserver3.conf), which is hosted in the main repo, for quick TURN deployments.

```
sudo vi /etc/turnserver.conf
```
Tip: For those doing their own LAN-deployment, you might want to add STUN-support to the TURN server while at it. Refer to the co-turn documentation for help there though.

Next, once we have all the settings and configs setup, we can enable the system service for co-turn to auto-start on boot.

This is our service file; it should exist.
```
sudo vi /usr/lib/systemd/system/coturn.service
```
To ensure it's enabled, try this:
```
sudo systemctl daemon-reload
sudo systemctl enable coturn
```

To start the co-turn service and to see if it had any errors:
```
sudo systemctl restart coturn
sudo systemctl status coturn
```
You can then validate that things are working at the following site:

https://webrtc.github.io/samples/src/content/peerconnection/trickle-ice/

An example URL is `turn:turnserver.mydomain.com:3478`
or for TCP/TLS, try `turns:turnTLS.mydomain.com:443`

note: If you run into error 701 issues with your TURN server, check that the coturn service has access to your new SSL certificates:
see this issue with coturn: https://github.com/coturn/coturn/issues/268

You might also want to consider buying a better certificiate, as not all Google-related projects properly support certbot certificates, including libwebrtc. see [this issue ticket](https://github.com/coturn/coturn/issues/240#issuecomment-648550885).  If you go this route, see [turnserver2.conf](https://github.com/steveseguin/vdo.ninja/blob/master/turnserver2.conf) for an example config.

Next, we may want to update the User and Group values in our service file to be "root". This seems to be a quick hacky fix for the issue with Lets Encrypt. ..  I welcome a better solution tho.  If you move the certs somewhere else, or buy proper certificates, then the default turnserver user/group will work.

Ultimately though, if you are still getting the 701 error -- just test to see if the TURN service works; if it does, the error can probably be ignored.


The following are the contents of an example /etc/turnserver.conf file from above
```
## sudo vi /etc/turnserver.conf

listening-port=3478
## TLS needs an SSL certificate and domain, but enables TCP
tls-listening-port=443

# min-port=49152
# max-port=65535

realm=turn.obs.ninja
server-name=turn.obs.ninja

## webrtc likes to use this
fingerprint

## Lets just use Google since its more reliable
no-stun

lt-cred-mech
user=SOMESUERNAME:SOMEPASSWQORD

stale-nonce=600

## depreciated in newer coturn
# no-loopback-peers

## prevents hackers from hacking
no-multicast-peers

## 1-gbps/100 users = ~ 1-mbps each with this setting then
total-quota=100

cert=/etc/letsencrypt/live/turn.obs.ninja/fullchain.pem
pkey=/etc/letsencrypt/live/turn.obs.ninja/privkey.pem

## Tweaks to fix some lets encrypt errors
cipher-list="ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-SHA384"
no-sslv3
no-tlsv1
no-tlsv1_1
# no-tlsv1_2
dh2066

# no-udp
# no-tcp

# verbose
no-stdout-log

## optional
proc-user=root
proc-group=root

```

Setting this all up is easier said then done. good luck!
