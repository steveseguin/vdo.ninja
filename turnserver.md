This install script and config file was used with OVH loaded onto a VM with Ubuntu 20. 

```
sudo apt-get update
 
sudo apt-get install coturn -y
set TURNSERVER_ENABLED=1

sudo add-apt-repository ppa:certbot/certbot
sudo apt-get install certbot -y
```
Make sure you have the DNS pointing to your IP address for this next step (ipv4 + ipv6 if possible). You will need to validate that in the next step.
```
sudo certbot certonly --standalone
```
Replace turn.obs.ninja with the domain name you registered certbot with. If the file is not found, things did not work.
```
sudo ls /etc/letsencrypt/live/turn.obs.ninja/fullchain.pem

sudo apt install net-tools
```
We are going to open up some ports.
```
sudo ufw allow 60000:62000/tcp 
sudo ufw allow 60000:62000/udp
```
Update turnserver.conf with passwords, domain names, and whatever else that needs changing.  Example contents are provided below.  Once you have updated it, start the TURN server and ensure it started correctly.
```
sudo vi /etc/turnserver.conf
sudo systemctl restart coturn
sudo systemctl status coturn

```

The follwoing are the contents of an example /etc/turnserver.conf file.
```
## sudo vi /etc/turnserver.conf

listening-port=3478
tls-listening-port=443


## Update IP addresses; IPv4 is at least needed
external-ip=51.195.41.188
external-ip=2001:41d0:701:1100::287a

min-port=60000
max-port=62000

## Update domain name
realm=turn.obs.ninja
server-name=turn.obs.ninja

# lt-cred-mech
# userdb=/etc/turnuserdb.conf

fingerprint
stale-nonce

no-multicast-peers
no-stun

# oauth
lt-cred-mech

## Update your credentials
user=steve:setupYourOwnPlease

# max-bps=650000

no-loopback-peers

## use real-valid certificate/privatekey files. Update the location
cert=/etc/letsencrypt/live/turn.obs.ninja/fullchain.pem
pkey=/etc/letsencrypt/live/turn.obs.ninja/privkey.pem

verbose
#no-stdout-log

```


