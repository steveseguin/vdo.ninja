# TURN relay server deployment guide

A TURN server provides a fallback path when a direct WebRTC connection cannot be established. It should be treated as bandwidth-intensive network infrastructure: relay-port capacity, firewall rules, certificate renewal, and load distribution matter more than CPU under most workloads.

The configuration below reflects the production setup validated on Ubuntu 26.04 with Coturn 4.6.1. Adjust package commands and paths for other distributions.

## Before installation

- Assign a stable public IPv4 address.
- Create an `A` record such as `turn-example.vdo.ninja` pointing directly to that address.
- If publishing an `AAAA` record, validate the complete IPv6 path and firewall rules. Do not publish an untested IPv6 address.
- Ensure the provider firewall permits the ports listed below. A host firewall cannot override a blocked provider firewall.
- Use unique TURN and SSH credentials. Do not commit them to this repository.

## Recommended ports

| Port | Protocol | Purpose | Required |
| --- | --- | --- | --- |
| 22 | TCP | SSH administration | Yes; rate-limit or source-restrict it |
| 80 | TCP | Certbot standalone HTTP validation | Required when using the Certbot configuration below |
| 3478 | UDP | Preferred TURN/STUN client transport | Yes |
| 3478 | TCP | Non-TLS TURN fallback | Optional but useful |
| 443 | TCP | TURN over TLS for restrictive networks | Strongly recommended |
| 443 | UDP | TURN over DTLS | Optional |
| 49152-65535 | UDP | Allocated media relay ports | Yes |

WebRTC clients using TURN over TCP or TLS normally still receive a UDP relay allocation. Opening the high relay range over TCP is unnecessary unless TCP relay support from RFC 6062 is deliberately being used.

The `49152-65535` range contains 16,384 ports. Each active allocation consumes relay-port capacity, so a server can run out of relay ports while CPU, memory, and network usage still appear healthy. Monitor this range and distribute traffic before it fills.

Coturn's `alt-listening-port=0` does **not** disable the alternative listener. Zero means the primary port plus one, which normally exposes 3479 and 444. If RFC 5780 NAT discovery is not required, use `no-rfc5780` and verify the additional ports are no longer listening.

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

Production server deployment code is maintained separately from this frontend repository. The included `turnserver_basic.conf`, `turnserver_install.sh.sample`, and `turn-credentials-php.sample` are optional self-hosting examples, not active website components. Review and adapt them before use; the guidance below describes the relay setup and validation requirements.

## Coturn configuration

Create `/etc/turnserver.conf` with permissions `0640`, owned by `root:turnserver`. Coturn normally starts as the `turnserver` account, so a root-owned `0600` file prevents it from reading its configuration:

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

Replace the example address, domain, username, and password. If the server is behind NAT, use Coturn's `external-ip=PUBLIC_IP/PRIVATE_IP` mapping rather than copying the directly assigned address example.

Explicit `listening-ip` and `relay-ip` values prevent Coturn from binding loopback, unused IPv6, or unexpected interfaces. Do not add them until the correct stable address is known.

General configuration changes require a Coturn restart. Apply them before adding the server to production routing, or drain the server first. Signals used for certificate reloads do not reload arbitrary settings from `turnserver.conf`.

## Binding port 443 safely

Coturn needs permission to bind the privileged port 443, but the relay process should not remain root. A systemd override can start Coturn as root and immediately drop it to the `turnserver` account:

```ini
# /etc/systemd/system/coturn.service.d/30-start-root-drop-privileges.conf
[Service]
User=root
Group=root
ExecStart=
ExecStart=/usr/bin/turnserver -c /etc/turnserver.conf --pidfile= --proc-user=turnserver --proc-group=turnserver
```

Do not simply run Coturn permanently as root.

To avoid Coturn starting before the public address exists after a reboot:

```ini
# /etc/systemd/system/coturn.service.d/10-wait-for-ipv4.conf
[Unit]
Wants=network-online.target
After=network-online.target systemd-networkd-wait-online.service

[Service]
ExecStartPre=/bin/sh -c 'stable=0; for i in $(seq 1 90); do if ip -4 -o addr show dev ens3 scope global up | grep -Fq "inet 203.0.113.10/" && ip -4 route show default | grep -Fq "dev ens3"; then stable=$((stable+1)); [ "$stable" -ge 3 ] && exit 0; else stable=0; fi; sleep 1; done; echo "Stable public IPv4 203.0.113.10 was not available before coturn start" >&2; exit 1'
```

Replace both the example address and interface. Checking merely for “any global IPv4” is unsafe: during a network-service restart the old address can briefly satisfy the check, disappear while Coturn enumerates interfaces, and return immediately afterward. Coturn will remain active but listen only on loopback/IPv6 because it does not dynamically add the later IPv4. Requiring the exact address plus its default route for three consecutive checks closes that race. Explicit `listening-ip` and `relay-ip` entries provide a second fail-closed safeguard.

Every new node must pass all of these checks before it is added to the selector:

- `listening-ip` and `relay-ip` match an address currently assigned to the intended interface.
- The systemd guard names that exact address and requires multiple consecutive successful checks.
- `ss -lntup` shows the public IPv4 on both 3478 and 443 when TLS is enabled—not only loopback or IPv6.
- External browser tests allocate and pass bidirectional relay-only data over UDP and TLS.
- Monitoring alerts when Coturn is active but any expected public listener is missing.

## Capacity and socket limits

Use explicit systemd limits so package or distribution defaults cannot silently reduce capacity:

```ini
# /etc/systemd/system/coturn.service.d/40-limits.conf
[Service]
LimitNOFILE=524288
LimitNPROC=65535
```

Recommended kernel settings for a medium-sized TURN node:

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

If connection tracking is used by UFW, ensure the module loads before the sysctl settings:

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

The system-wide `fs.file-max` must not be lower than the service's practical requirements. A large per-process `LimitNOFILE` cannot compensate for a small system-wide file-handle limit.

## Firewall

The following UFW policy exposes only the supported service paths:

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

Add the SSH rule before enabling UFW. If the VPS provider also has a network firewall, mirror the same public TURN and certificate ports there.

## TLS certificate and automatic renewal

Obtain the certificate while TCP port 80 is reachable:

```bash
sudo certbot certonly --standalone --preferred-challenges http -d turn-example.vdo.ninja
sudo systemctl enable --now certbot.timer
```

Let's Encrypt's private directories are intentionally inaccessible to the unprivileged Coturn process. Copy the active certificate into a dedicated directory instead of weakening the permissions on `/etc/letsencrypt`:

```bash
sudo install -d -o turnserver -g turnserver -m 0750 /etc/coturn/certs
sudo install -o turnserver -g turnserver -m 0600 /etc/letsencrypt/live/turn-example.vdo.ninja/fullchain.pem /etc/coturn/certs/fullchain.pem
sudo install -o turnserver -g turnserver -m 0600 /etc/letsencrypt/live/turn-example.vdo.ninja/privkey.pem /etc/coturn/certs/privkey.pem
```

Install this deploy hook as `/etc/letsencrypt/renewal-hooks/deploy/coturn-reload` with mode `0755`:

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

`SIGUSR2` makes Coturn reload its TLS certificate without restarting the process or intentionally disconnecting active allocations. The hook uses temporary files and atomic renames so Coturn never reads a partially copied certificate.

Validate the ACME renewal path:

```bash
sudo certbot renew --dry-run --no-random-sleep-on-renew
```

Certbot dry-runs do not normally execute deploy hooks. To validate reload behavior without installing a staging certificate, run the deploy hook against the current production certificate and confirm the PID remains unchanged:

```bash
pid_before="$(systemctl show coturn -p MainPID --value)"
sudo /etc/letsencrypt/renewal-hooks/deploy/coturn-reload
pid_after="$(systemctl show coturn -p MainPID --value)"
test "$pid_before" = "$pid_after" && echo "Certificate reload kept the Coturn PID"
```

## Initial activation

After configuration is complete and before production traffic is routed to the server:

```bash
sudo systemctl daemon-reload
sudo systemctl enable coturn
sudo systemctl restart coturn
sudo systemctl status coturn --no-pager
```

This initial restart applies `turnserver.conf` and systemd changes. Future certificate renewals should use the reload-only hook.

## Validation

Check service state, listeners, limits, firewall, and certificate:

```bash
systemctl is-enabled coturn
systemctl is-active coturn
systemctl show coturn -p MainPID -p NRestarts -p LimitNOFILE
sudo ss -lntup
sudo ufw status verbose
openssl x509 -in /etc/coturn/certs/fullchain.pem -noout -subject -dates
```

Expected public Coturn listeners are UDP/TCP 3478 and UDP/TCP 443. With the configuration above, 3479 and 444 should not be listening.

Do not treat an active systemd unit as proof that TURN is reachable. Validate each expected public address explicitly, for example:

```bash
PUBLIC_IPV4=203.0.113.10
sudo ss -Hlnutp | grep -F "${PUBLIC_IPV4}:3478"
sudo ss -Hlnutp | grep -F "${PUBLIC_IPV4}:443"
```

Use the [WebRTC Trickle ICE sample](https://webrtc.github.io/samples/src/content/peerconnection/trickle-ice/) to confirm that both of these URLs produce relay candidates:

```text
turn:turn-example.vdo.ninja:3478?transport=udp
turns:turn-example.vdo.ninja:443?transport=tcp
```

A relay candidate proves allocation and authentication, but it does not prove that media can traverse the high relay-port range. Before production, also establish a relay-only WebRTC peer connection or data channel and pass bidirectional data through each advertised transport. Confirm the selected candidate is a relay address, its allocated port falls inside the configured range, and TLS reports the expected relay transport.

## Monitoring and load distribution

Monitor these signals on every TURN node:

- Coturn service state and restart count.
- Successful UDP 3478 and TLS 443 allocations.
- Successful bidirectional relay data, not just candidate gathering.
- UDP sockets allocated inside `49152-65535`.
- Allocation, bind, file-descriptor, and connection-tracking errors.
- Established TCP/TLS clients, network throughput, CPU, and available memory.

One simple relay-socket count for the configured range is:

```bash
sudo ss -Huan | awk '{ port=$4; sub(/^.*:/, "", port); if (port >= 49152 && port <= 65535) used++ } END { print used + 0 }'
```

Suggested relay-port alerts for a 16,384-port range:

- Warning at 70% utilization for two consecutive checks.
- Critical at 85% utilization or on allocation/bind errors.
- Recovery after utilization falls below 60% and active probes succeed.

CPU and memory are secondary signals. Port exhaustion can cause very poor bitrate and long ICE fallback delays while the machine otherwise looks idle.

Distribute equal-region traffic randomly rather than always selecting the first equal-distance server. Add a new node to the routing list only after UDP, TLS, certificate renewal, firewall, and relayed-data validation pass.
