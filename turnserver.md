# TURN relay server deployment guide

A TURN server relays traffic when two peers cannot connect directly. It is bandwidth-heavy infrastructure: relay-port capacity, firewall rules, certificate renewal and load distribution matter more than CPU.

This setup was validated on Ubuntu 26.04 with Coturn 4.6.1. Adjust commands and paths for other distributions. To use the finished server, see [Use the server with VDO.Ninja](#use-the-server-with-vdoninja).

## Sample files in this repository

The website does not run these optional examples. They are simpler than this guide, so review them before use:

- `turnserver_basic.conf`: minimal non-TLS config on port 3478 with a static username and password.
- `turnserver_install.sh.sample`: interactive installer for Coturn, fail2ban, optional Certbot TLS on 443, buffers, swap and log limits. It binds port 443 with `setcap` rather than the systemd override below, and sets `fs.file-max=65535`.
- `turn-credentials-php.sample`: returns time-limited credentials for Coturn's `use-auth-secret` mode.

Both config samples use `alt-listening-port=0` without `no-rfc5780`, which leaves ports 3479 and 444 open (see [Ports](#ports)).

## Before installation

- Assign a stable public IPv4 address, and point an `A` record (such as `turn-example.vdo.ninja`) directly at it.
- Publish an `AAAA` record only after you have tested the full IPv6 path and firewall rules.
- Open the ports below in the provider firewall too. A host firewall cannot override it.
- Use unique TURN and SSH credentials, and never commit them to a repository.

## Ports

| Port | Protocol | Purpose | Required |
| --- | --- | --- | --- |
| 22 | TCP | SSH administration | Yes; rate-limit or restrict by source |
| 80 | TCP | Certbot standalone HTTP validation | When using Certbot as below |
| 3478 | UDP | Preferred TURN/STUN transport | Yes |
| 3478 | TCP | Non-TLS TURN fallback | Optional but useful |
| 443 | TCP | TURN over TLS for restrictive networks | Strongly recommended |
| 443 | UDP | TURN over DTLS | Optional |
| 49152-65535 | UDP | Allocated media relay ports | Yes |

- Clients using TURN over TCP or TLS still normally get a UDP relay allocation, so the relay range does not need TCP unless you use RFC 6062 TCP relays.
- The range holds 16,384 ports, one per allocation. A server can run out of relay ports while CPU, memory and network look healthy, so monitor it.
- `alt-listening-port=0` does **not** disable the alternative listener; it means "primary port plus one" (3479 and 444). If you do not need RFC 5780 NAT discovery, set `no-rfc5780` and check those ports are closed.

## Install packages

```bash
sudo apt-get update
sudo apt-get install -y coturn certbot fail2ban
sudo systemctl enable coturn certbot.timer fail2ban
```

Enable Coturn in `/etc/default/coturn`:

```text
TURNSERVER_ENABLED=1
```

## Coturn configuration

Create `/etc/turnserver.conf` with mode `0640`, owned by `root:turnserver`. Coturn runs as `turnserver`, so it cannot read a root-owned `0600` file.

```text
listening-port=3478
tls-listening-port=443

# Recommended on a host where the public address is assigned directly.
listening-ip=203.0.113.10
relay-ip=203.0.113.10

min-port=49152
max-port=65535

fingerprint
lt-cred-mech
user=TURN_USERNAME:TURN_PASSWORD
realm=turn-example.vdo.ninja
server-name=turn-example.vdo.ninja
stale-nonce=600

no-multicast-peers
no-loopback-peers
no-rfc5780
no-cli
no-tlsv1
no-tlsv1_1
no-stdout-log

cert=/etc/coturn/certs/fullchain.pem
pkey=/etc/coturn/certs/privkey.pem
```

- Replace the example address, domain, username and password.
- Behind NAT, use `external-ip=PUBLIC_IP/PRIVATE_IP` instead of the two address lines.
- `listening-ip` and `relay-ip` stop Coturn binding loopback, unused IPv6 or unexpected interfaces. Set them only once you know the stable address.
- Config changes need a restart, so apply them before the server takes traffic, or drain it first. The certificate-reload signal reloads nothing else.

## Binding port 443 safely

Coturn needs permission to bind port 443 but should not keep running as root. This override starts it as root and drops to `turnserver`:

```ini
# /etc/systemd/system/coturn.service.d/30-start-root-drop-privileges.conf
[Service]
User=root
Group=root
ExecStart=
ExecStart=/usr/bin/turnserver -c /etc/turnserver.conf --pidfile= --proc-user=turnserver --proc-group=turnserver
```

This override stops Coturn starting before the public address exists after a reboot:

```ini
# /etc/systemd/system/coturn.service.d/10-wait-for-ipv4.conf
[Unit]
Wants=network-online.target
After=network-online.target systemd-networkd-wait-online.service

[Service]
ExecStartPre=/bin/sh -c 'stable=0; for i in $(seq 1 90); do if ip -4 -o addr show dev ens3 scope global up | grep -Fq "inet 203.0.113.10/" && ip -4 route show default | grep -Fq "dev ens3"; then stable=$((stable+1)); [ "$stable" -ge 3 ] && exit 0; else stable=0; fi; sleep 1; done; echo "Stable public IPv4 203.0.113.10 was not available before coturn start" >&2; exit 1'
```

Replace the address and interface (`ens3`). Do not check for "any global IPv4": during a network restart the old address can pass the check and vanish while Coturn lists interfaces. Coturn then listens only on loopback or IPv6 and never adds the address. Requiring the exact address and its default route three times in a row prevents this, and explicit `listening-ip` / `relay-ip` entries fail closed as a second safeguard.

## Capacity and socket limits

Set explicit systemd limits so package defaults cannot reduce capacity:

```ini
# /etc/systemd/system/coturn.service.d/40-limits.conf
[Service]
LimitNOFILE=524288
LimitNPROC=65535
```

Kernel settings for a medium-sized node:

```text
# /etc/sysctl.d/99-turn-buffers.conf
net.core.rmem_max=16777216
net.core.wmem_max=16777216
net.core.rmem_default=4194304
net.core.wmem_default=4194304
net.core.netdev_max_backlog=16384
net.core.somaxconn=8192
net.ipv4.udp_rmem_min=65536
net.ipv4.udp_wmem_min=65536
net.ipv4.tcp_keepalive_time=300
net.ipv4.tcp_keepalive_intvl=30
net.ipv4.tcp_keepalive_probes=5
net.netfilter.nf_conntrack_max=524288
fs.file-max=1048576
```

If UFW uses connection tracking, load the module before the sysctl settings:

```text
# /etc/modules-load.d/turn-conntrack.conf
nf_conntrack
```

Apply the settings:

```bash
sudo modprobe nf_conntrack
sudo sysctl -p /etc/sysctl.d/99-turn-buffers.conf
sudo systemctl daemon-reload
```

A large `LimitNOFILE` cannot make up for a small system-wide `fs.file-max`.

## Firewall

Add the SSH rule before enabling UFW, and mirror these ports in any provider firewall:

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw limit 22/tcp comment SSH
sudo ufw allow 80/tcp comment Certbot
sudo ufw allow 3478/udp comment TURN-UDP
sudo ufw allow 3478/tcp comment TURN-TCP
sudo ufw allow 443/tcp comment TURN-TLS
sudo ufw allow 443/udp comment TURN-DTLS
sudo ufw allow 49152:65535/udp comment TURN-relays
sudo ufw --force enable
sudo ufw status verbose
```

## TLS certificate and automatic renewal

1. Get the certificate while TCP port 80 is reachable:

   ```bash
   sudo certbot certonly --standalone --preferred-challenges http -d turn-example.vdo.ninja
   sudo systemctl enable --now certbot.timer
   ```

2. Coturn cannot read Let's Encrypt's private directories. Copy the certificate to its own directory rather than loosening permissions on `/etc/letsencrypt`:

   ```bash
   sudo install -d -o turnserver -g turnserver -m 0750 /etc/coturn/certs
   sudo install -o turnserver -g turnserver -m 0600 /etc/letsencrypt/live/turn-example.vdo.ninja/fullchain.pem /etc/coturn/certs/fullchain.pem
   sudo install -o turnserver -g turnserver -m 0600 /etc/letsencrypt/live/turn-example.vdo.ninja/privkey.pem /etc/coturn/certs/privkey.pem
   ```

3. Install this deploy hook as `/etc/letsencrypt/renewal-hooks/deploy/coturn-reload` with mode `0755`. Temporary files and atomic renames mean Coturn never reads a half-copied certificate, and `SIGUSR2` reloads it without a restart or dropped allocations.

   ```sh
   #!/bin/sh
   set -eu

   source_dir="/etc/letsencrypt/live/turn-example.vdo.ninja"
   target_dir="/etc/coturn/certs"
   cert_tmp="$(mktemp "${target_dir}/.fullchain.XXXXXX")"
   key_tmp="$(mktemp "${target_dir}/.privkey.XXXXXX")"

   cleanup() {
   	rm -f "$cert_tmp" "$key_tmp"
   }
   trap cleanup EXIT HUP INT TERM

   install -o turnserver -g turnserver -m 0600 "$source_dir/fullchain.pem" "$cert_tmp"
   install -o turnserver -g turnserver -m 0600 "$source_dir/privkey.pem" "$key_tmp"
   mv -f "$cert_tmp" "$target_dir/fullchain.pem"
   mv -f "$key_tmp" "$target_dir/privkey.pem"
   trap - EXIT HUP INT TERM

   if systemctl is-active --quiet coturn; then
   	systemctl kill --kill-whom=main --signal=SIGUSR2 coturn
   fi
   ```

4. Test renewal. Dry runs do not normally run deploy hooks, so also run the hook directly and check the Coturn PID does not change:

   ```bash
   sudo certbot renew --dry-run --no-random-sleep-on-renew
   pid_before="$(systemctl show coturn -p MainPID --value)"
   sudo /etc/letsencrypt/renewal-hooks/deploy/coturn-reload
   pid_after="$(systemctl show coturn -p MainPID --value)"
   test "$pid_before" = "$pid_after" && echo "Certificate reload kept the Coturn PID"
   ```

## Initial activation

Before routing traffic to the server, apply `turnserver.conf` and the systemd changes with one restart. Later renewals use the reload-only hook.

```bash
sudo systemctl daemon-reload
sudo systemctl enable coturn
sudo systemctl restart coturn
sudo systemctl status coturn --no-pager
```

## Validation

Check service state, listeners, limits, firewall and certificate:

```bash
systemctl is-enabled coturn
systemctl is-active coturn
systemctl show coturn -p MainPID -p NRestarts -p LimitNOFILE
sudo ss -lntup
sudo ufw status verbose
openssl x509 -in /etc/coturn/certs/fullchain.pem -noout -subject -dates
```

Coturn should listen on UDP/TCP 3478 and 443 on the public IPv4, not only loopback or IPv6, and nothing should listen on 3479 or 444. An active unit does not prove this:

```bash
PUBLIC_IPV4=203.0.113.10
sudo ss -Hlnutp | grep -F "${PUBLIC_IPV4}:3478"
sudo ss -Hlnutp | grep -F "${PUBLIC_IPV4}:443"
```

Use the [WebRTC Trickle ICE sample](https://webrtc.github.io/samples/src/content/peerconnection/trickle-ice/) to confirm both URLs produce relay candidates:

```text
turn:turn-example.vdo.ninja:3478?transport=udp
turns:turn-example.vdo.ninja:443?transport=tcp
```

A relay candidate proves allocation and authentication, not that media crosses the relay range. Before production, open a relay-only WebRTC connection or data channel and pass data both ways over each transport. Check that the selected candidate is a relay address with a port inside the range.

## Monitoring and load distribution

On every node, monitor:

- service state and restart count;
- successful UDP 3478 and TLS 443 allocations, and relayed data both ways;
- UDP sockets in use inside `49152-65535`;
- allocation, bind, file-descriptor and connection-tracking errors;
- TCP/TLS clients, throughput, CPU and free memory;
- an alert when Coturn is active but an expected public listener is missing.

Count relay sockets in use:

```bash
sudo ss -Huan | awk '{ port=$4; sub(/^.*:/, "", port); if (port >= 49152 && port <= 65535) used++ } END { print used + 0 }'
```

Suggested relay-port alerts for a 16,384-port range: warning at 70% for two checks in a row; critical at 85% or on any allocation or bind error; recovered below 60% with passing probes. Port exhaustion can cause very low bitrate and long ICE delays while CPU and memory look idle.

Spread traffic randomly across servers in the same region instead of always picking the first. Add a node to your routing only after its UDP, TLS, renewal, firewall and relayed-data checks pass.

## Use the server with VDO.Ninja

**On any link**, add [`&turn`](https://docs.vdo.ninja/general-settings/turn) as `username;password;url`, for example `&turn=TURN_USERNAME;TURN_PASSWORD;turns:turn-example.vdo.ninja:443`.

- Repeat `&turn` to add servers. They replace VDO.Ninja's default TURN servers; STUN stays.
- Add [`&relay`](https://docs.vdo.ninja/advanced-settings/turn-and-stun-parameters/and-privacy) (or `&privacy`) on both publisher and viewer links to force relaying, which hides your IP address from peers.
- `&turn=false` removes all TURN servers; `&turn=nostun` removes STUN and TURN.
- Anyone with the link can read its credentials, so use time-limited credentials for public links.

**On your own deployment**, edit the settings near the bottom of `index.html`:

- Static credentials: uncomment the "Custom basic TURN SETUP" section.
- Time-limited credentials: set Coturn's `use-auth-secret` and `static-auth-secret` instead of `user=`, deploy the PHP sample as `turn-credentials.php` with the same secret, and uncomment the "Alternative custom TURN SETUP" section. VDO.Ninja waits for the credentials before connecting.
- Always relay: uncomment `session.configuration.iceTransportPolicy = "relay";`.

See [install.md](install.md) for hosting the website.
