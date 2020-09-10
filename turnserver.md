This install script and config file was used with a standard virtual machine server loaded with Ubuntu 20.  GCP/AWS servers might need slightly different settings.

```
sudo apt-get update
 
sudo apt-get install coturn -y
sudo add-apt-repository ppa:certbot/certbot
sudo apt-get install certbot -y

sudo vi /etc/default/coturn
```
...and we uncomment the line:
#TURNSERVER_ENABLED=1
….leaving it like this:
TURNSERVER_ENABLED=1

Next make sure you have the DNS pointing to your IP address for this next step (ipv4 + ipv6 if possible). You will need to validate that in the next step.
```
sudo certbot certonly --standalone
```
Replace turn.obs.ninja with the domain name you registered certbot with. If the file is not found, things did not work.
```
sudo ls /etc/letsencrypt/live/turn.obs.ninja/fullchain.pem

sudo apt install net-tools
```
note: If you run into error 701 issues with your TURN server, check that the coturn service has access to your new SSL certificates:
see this issue with coturn: https://github.com/coturn/coturn/issues/268

Next, we are going to open up some ports... just in case they are blocked by default. Which exactly? well, these are default ports. TCP may not be needed?
```
sudo ufw allow 49000:65535/tcp
sudo ufw allow 49000:65535/udp
```
Update turnserver.conf with passwords, domain names, and whatever else that needs changing.  Example contents are provided below.  Once you have updated it, start the TURN server and ensure it started correctly.
```
sudo vi /etc/turnserver.conf

sudo systemctl restart coturn
sudo systemctl status coturn
sudo systemctl enable coturn
```

The follwoing are the contents of an example /etc/turnserver.conf file from above
```
## sudo vi /etc/turnserver.conf

listening-port=3478
## TLS needs an SSL certificate and domain, but enables TCP
tls-listening-port=443

# min-port=49000
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

## bypass the letsencrypt bug; easier than modifying the service, but higher risk of being hacked.
proc-user=root
proc-group=root

```

You can validate here: https://webrtc.github.io/samples/src/content/peerconnection/trickle-ice/

Setting this all up is easier said then done. good luck!
