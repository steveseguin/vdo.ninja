This was used with OVH loaded onto a VM with Ubuntu 20

```
# sudo apt-get update
# 
# sudo apt-get install coturn
# set TURNSERVER_ENABLED=1
# 
# sudo add-apt-repository ppa:certbot/certbot
# sudo apt-get install certbot
# sudo certbot certonly --standalone
# 
# sudo ls /etc/letsencrypt/live/turn3.obs.ninja/fullchain.pem
# 
# sudo apt install net-tools
# ifconfig
# 
# sudo ufw allow 60000:62000/tcp ## can be whatever port range you want I guess
# sudo ufw allow 60000:62000/udp ## default needed is like 40000 to 65000 or so
#
# sudo vi /etc/turnserver.conf
#
# sudo systemctl restart coturn
# sudo systemctl status coturn
#
##
```
```
## turnserver.conf

listening-port=3478
tls-listening-port=443

external-ip = 111.222.333.444      ## external IPv4 address
external-ip = 1111:3333:555:3333::9999  ## External ipv6 address.  Add to DNS server as well

min-port=60000 ## ufw is needed to open these ports
max-port=62000 ## default is like 49000 to 60000 or so?

realm=turn3.obs.ninja	## Domain name is needed; OVH provides one, but you can add a novelty one for cheap yourself.
server-name=turn3.obs.ninja

#lt-cred-mech
#userdb=/etc/turnuserdb.conf  ## For server-based credentials, if you want some added security

fingerprint ## security
stale-nonce ## security

no-multicast-peers
no-stun  ## you might want this on actually

#oauth
lt-cred-mech
user=USERNAME:PASSWORD ## Change as desired

# max-bps=650000 # Just over 5mbps limit ; use to prevernt DDoS attacks?

no-loopback-peers

# use real-valid certificate/privatekey files
cert=/etc/letsencrypt/live/turn.obs.ninja/fullchain.pem ## update as per certbot
pkey=/etc/letsencrypt/live/turn.obs.ninja/privkey.pem

#verbose
no-stdout-log
```
