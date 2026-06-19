#!/bin/bash
set -euo pipefail

# VDO.Ninja TURN Server Setup Script
# Usage:
#   ./turnsetup.sh          - Full installation
#   ./turnsetup.sh --verify - Health check on existing server
#   ./turnsetup.sh --fix    - Fix missing configs on existing server

if [ "$EUID" -ne 0 ]; then
    echo "Please run as root or with sudo"
    exit 1
fi

# Minimum required buffer sizes (16MB)
REQUIRED_RMEM_MAX=16777216
REQUIRED_WMEM_MAX=16777216

# Health check function - verifies server configuration
verify_server() {
    echo "=========================================="
    echo "TURN Server Health Check"
    echo "=========================================="
    local ERRORS=0

    # Check UDP buffer sizes
    echo -n "Checking UDP buffers... "
    RMEM=$(sysctl -n net.core.rmem_max 2>/dev/null)
    WMEM=$(sysctl -n net.core.wmem_max 2>/dev/null)
    if [ "$RMEM" -lt "$REQUIRED_RMEM_MAX" ] 2>/dev/null || [ "$WMEM" -lt "$REQUIRED_WMEM_MAX" ] 2>/dev/null; then
        echo "FAIL (rmem_max=$RMEM, wmem_max=$WMEM, need $REQUIRED_RMEM_MAX)"
        ERRORS=$((ERRORS + 1))
    else
        echo "OK (rmem_max=$RMEM, wmem_max=$WMEM)"
    fi

    # Check for buffer errors
    echo -n "Checking for UDP buffer errors... "
    SNMP=$(cat /proc/net/snmp 2>/dev/null | grep -A1 "^Udp:" | tail -1)
    RCVBUF_ERR=$(echo "$SNMP" | awk '{print $6}')
    SNDBUF_ERR=$(echo "$SNMP" | awk '{print $7}')
    if [ "$RCVBUF_ERR" -gt 1000 ] 2>/dev/null || [ "$SNDBUF_ERR" -gt 1000 ] 2>/dev/null; then
        echo "WARNING (RcvbufErrors=$RCVBUF_ERR, SndbufErrors=$SNDBUF_ERR)"
        echo "  -> High buffer errors indicate packet loss. Consider restarting coturn."
    else
        echo "OK (RcvbufErrors=$RCVBUF_ERR, SndbufErrors=$SNDBUF_ERR)"
    fi

    # Check coturn status
    echo -n "Checking coturn service... "
    if systemctl is-active coturn >/dev/null 2>&1; then
        echo "OK (running)"
    else
        echo "FAIL (not running)"
        ERRORS=$((ERRORS + 1))
    fi

    # Check fail2ban
    echo -n "Checking fail2ban... "
    if systemctl is-active fail2ban >/dev/null 2>&1; then
        echo "OK (running)"
    else
        echo "WARNING (not running)"
    fi

    # Check sysctl config file
    echo -n "Checking /etc/sysctl.d/99-turn-buffers.conf... "
    if [ -f /etc/sysctl.d/99-turn-buffers.conf ]; then
        echo "OK (exists)"
    else
        echo "MISSING"
        ERRORS=$((ERRORS + 1))
    fi

    # Check swap
    echo -n "Checking swap... "
    SWAP=$(swapon --show 2>/dev/null | wc -l)
    if [ "$SWAP" -gt 0 ]; then
        echo "OK"
    else
        echo "WARNING (no swap configured)"
    fi

    # Check disk cleanup cron
    echo -n "Checking disk cleanup cron... "
    if [ -f /etc/cron.weekly/turn-cleanup ]; then
        echo "OK"
    else
        echo "WARNING (missing)"
    fi

    # Check SSL cert expiry
    echo -n "Checking SSL certificates... "
    if [ -f /etc/coturn/certs/fullchain.pem ]; then
        EXPIRY=$(openssl x509 -enddate -noout -in /etc/coturn/certs/fullchain.pem 2>/dev/null | cut -d= -f2)
        EXPIRY_EPOCH=$(date -d "$EXPIRY" +%s 2>/dev/null)
        NOW_EPOCH=$(date +%s)
        DAYS_LEFT=$(( (EXPIRY_EPOCH - NOW_EPOCH) / 86400 ))
        if [ "$DAYS_LEFT" -lt 14 ]; then
            echo "WARNING (expires in $DAYS_LEFT days: $EXPIRY)"
        else
            echo "OK (expires in $DAYS_LEFT days)"
        fi
    else
        echo "N/A (no SSL configured)"
    fi

    echo "=========================================="
    if [ "$ERRORS" -gt 0 ]; then
        echo "Health check completed with $ERRORS error(s)"
        echo "Run './turnsetup.sh --fix' to repair missing configs"
        return 1
    else
        echo "Health check passed!"
        return 0
    fi
}

# Fix missing configurations on existing server
fix_server() {
    echo "Fixing missing configurations..."

    # Fix UDP buffers if needed
    RMEM=$(sysctl -n net.core.rmem_max 2>/dev/null)
    if [ "$RMEM" -lt "$REQUIRED_RMEM_MAX" ] 2>/dev/null; then
        echo "Fixing UDP buffer configuration..."
        configure_buffers
    fi

    # Add swap if missing
    if ! swapon --show 2>/dev/null | grep -q swap; then
        echo "Setting up swap..."
        setup_swap
    fi

    # Add cleanup cron if missing
    if [ ! -f /etc/cron.weekly/turn-cleanup ]; then
        echo "Setting up cleanup cron..."
        setup_cleanup_cron
    fi

    # Install fail2ban if missing
    if ! systemctl is-active fail2ban >/dev/null 2>&1; then
        echo "Installing fail2ban..."
        apt-get install fail2ban -y
        configure_fail2ban
    fi

    echo "Fix complete. Run './turnsetup.sh --verify' to confirm."
}

# Configure UDP buffer sizes and TCP keepalive
configure_buffers() {
    # Create dedicated sysctl config file (overwrites if exists for idempotency)
    cat > /etc/sysctl.d/99-turn-buffers.conf << EOL
# Network buffer sizes for TURN server
# Prevents UDP packet drops under load
net.core.rmem_max=16777216
net.core.wmem_max=16777216
net.core.rmem_default=4194304
net.core.wmem_default=4194304
net.ipv4.udp_rmem_min=65536
net.ipv4.udp_wmem_min=65536
# File descriptor limit
fs.file-max=65535
# TCP keepalive - detect dead connections in 5 min instead of 2 hours
net.ipv4.tcp_keepalive_time=300
net.ipv4.tcp_keepalive_intvl=30
net.ipv4.tcp_keepalive_probes=5
EOL

    # Apply immediately
    sysctl -p /etc/sysctl.d/99-turn-buffers.conf

    # Verify applied
    RMEM=$(sysctl -n net.core.rmem_max)
    if [ "$RMEM" -ge "$REQUIRED_RMEM_MAX" ]; then
        echo "Buffer configuration applied successfully (rmem_max=$RMEM)"
    else
        echo "WARNING: Buffer configuration may not have applied correctly"
    fi
}

# Configure fail2ban
configure_fail2ban() {
    cat > /etc/fail2ban/jail.local << EOL
[DEFAULT]
bantime = 24h
findtime = 10m
maxretry = 3

[sshd]
enabled = true
maxretry = 3
bantime = 24h
EOL
    systemctl enable fail2ban
    systemctl start fail2ban
}

# Setup swap file
setup_swap() {
    if [ -f /swapfile ]; then
        swapoff /swapfile 2>/dev/null || true
        rm /swapfile
    fi
    fallocate -l 2G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    if ! grep -q '/swapfile none swap sw 0 0' /etc/fstab; then
        echo '/swapfile none swap sw 0 0' >> /etc/fstab
    fi
}

# Setup cleanup cron jobs
setup_cleanup_cron() {
    cat > /etc/cron.weekly/turn-cleanup << 'EOL'
#!/bin/bash
# Clear btmp if over 10MB (failed login attempts can grow huge)
if [ -f /var/log/btmp ]; then
    SIZE=$(stat -c%s /var/log/btmp 2>/dev/null || echo 0)
    if [ $SIZE -gt 10485760 ]; then
        > /var/log/btmp
        logger "btmp cleared by turn-cleanup"
    fi
fi
# Clear old tmp files
find /tmp -type f -mtime +7 -delete 2>/dev/null
# Clear old journal logs
journalctl --vacuum-time=7d 2>/dev/null
EOL
    chmod +x /etc/cron.weekly/turn-cleanup

    cat > /etc/cron.daily/disk-alert << 'EOL'
#!/bin/bash
USAGE=$(df / | tail -1 | awk '{print $5}' | tr -d '%')
if [ $USAGE -gt 85 ]; then
    echo "ALERT: Disk usage at ${USAGE}% on $(hostname)" | logger -t disk-alert
fi
EOL
    chmod +x /etc/cron.daily/disk-alert
}

# Handle command line arguments
if [ "${1:-}" = "--verify" ]; then
    verify_server
    exit $?
elif [ "${1:-}" = "--fix" ]; then
    fix_server
    exit $?
fi

setup_permissions() {
    local DOMAIN=$1
    
    # Create secure directory for coturn certs
    mkdir -p /etc/coturn/certs
    
    # Copy certificates with proper permissions
    cp "/etc/letsencrypt/live/${DOMAIN}/fullchain.pem" /etc/coturn/certs/
    cp "/etc/letsencrypt/live/${DOMAIN}/privkey.pem" /etc/coturn/certs/
    
    # Set proper ownership and permissions
    chown -R turnserver:turnserver /etc/coturn/certs
    chmod 600 /etc/coturn/certs/*.pem
}

wait_for_apt() {
    while fuser /var/lib/dpkg/lock >/dev/null 2>&1 || fuser /var/lib/apt/lists/lock >/dev/null 2>&1 || fuser /var/cache/apt/archives/lock >/dev/null 2>&1 || fuser /var/lib/dpkg/lock-frontend >/dev/null 2>&1; do
        echo "Waiting for other apt processes to finish..."
        sleep 5
    done
}

domain_has_dns_record() {
    local domain=$1
    dig +short "$domain" | grep -q '.'
}

configure_ssl() {
    local DOMAIN=$1
    
    # Check if port 80 is in use
    if netstat -tuln | grep ':80 '; then
        echo "Warning: Port 80 is in use. Stopping potentially conflicting services..."
        systemctl stop nginx 2>/dev/null || true
        systemctl stop apache2 2>/dev/null || true
    fi
    
    # Install certbot if needed
    if ! command -v certbot >/dev/null; then
        echo "Installing certbot..."
        wait_for_apt
        apt-get install certbot -y
    fi
    
    # Verify domain points to this server
    LOCAL_IP=$(curl -s https://api.ipify.org)
    DOMAIN_IP=$(dig +short "$DOMAIN" | head -n 1)
    
    echo "Verifying domain configuration..."
    echo "Server IP: $LOCAL_IP"
    echo "Domain IP: $DOMAIN_IP"
    
    if [ "$LOCAL_IP" != "$DOMAIN_IP" ]; then
        echo "Warning: Domain $DOMAIN does not point to this server's IP ($LOCAL_IP)"
        read -p "Continue anyway? (y/N): " CONTINUE
        if [ "${CONTINUE,,}" != "y" ]; then
            return 1
        fi
    fi
    
    # Try to get the cert
    if ! certbot certonly --standalone --preferred-challenges http -d "$DOMAIN"; then
        echo "Failed to obtain SSL certificate. Trying alternative method..."
        if ! certbot certonly --standalone --preferred-challenges tls-alpn-01 -d "$DOMAIN"; then
            return 1
        fi
    fi
    
    # Update turnserver.conf with SSL settings; remove old lines first for idempotency
    touch /etc/turnserver.conf
    chmod 600 /etc/turnserver.conf
    sed -i \
        -e '/^cert=\/etc\/coturn\/certs\/fullchain\.pem$/d' \
        -e '/^pkey=\/etc\/coturn\/certs\/privkey\.pem$/d' \
        -e '/^tls-listening-port=443$/d' \
        /etc/turnserver.conf

    cat >> /etc/turnserver.conf << 'EOL'
cert=/etc/coturn/certs/fullchain.pem
pkey=/etc/coturn/certs/privkey.pem
tls-listening-port=443
EOL
    chmod 600 /etc/turnserver.conf
    
    # Setup permissions after getting certificates
    setup_permissions "$DOMAIN"
    
    # Update the renewal hook to copy new certs
    mkdir -p /etc/letsencrypt/renewal-hooks/deploy
    cat > /etc/letsencrypt/renewal-hooks/deploy/coturn-reload << EOL
#!/bin/bash
cp "/etc/letsencrypt/live/${DOMAIN}/fullchain.pem" /etc/coturn/certs/
cp "/etc/letsencrypt/live/${DOMAIN}/privkey.pem" /etc/coturn/certs/
chown turnserver:turnserver /etc/coturn/certs/*.pem
chmod 600 /etc/coturn/certs/*.pem
systemctl --signal=SIGUSR2 kill coturn
EOL
    chmod +x /etc/letsencrypt/renewal-hooks/deploy/coturn-reload
    
    # Restart coturn to apply SSL configuration
    systemctl restart coturn
    
    return 0
}

# Main installation function
install_coturn() {
    local DOMAIN=$1
    local USERNAME=$2
    local PASSWORD=$3

    # Install required packages
    apt-get update
    apt-get install coturn curl dnsutils fail2ban -y

    # Configure fail2ban for SSH protection
    configure_fail2ban

    # Configure network buffer sizes (CRITICAL for high-traffic TURN)
    echo "Configuring UDP buffer sizes..."
    configure_buffers

    # Add permanent ulimit settings (only if not already present)
    if ! grep -q "soft nofile 65535" /etc/security/limits.conf 2>/dev/null; then
        echo "* soft nofile 65535" >> /etc/security/limits.conf
        echo "* hard nofile 65535" >> /etc/security/limits.conf
        echo "root soft nofile 65535" >> /etc/security/limits.conf
        echo "root hard nofile 65535" >> /etc/security/limits.conf
    fi
    
    # Enable TURN server
    echo "TURNSERVER_ENABLED=1" > /etc/default/coturn
    
    # Generate base turnserver configuration
    cat > /etc/turnserver.conf << EOL
listening-port=3478
alt-listening-port=0
fingerprint
lt-cred-mech
min-port=49152
max-port=65535
user=${USERNAME}:${PASSWORD}
stale-nonce=600
realm=${DOMAIN}
server-name=${DOMAIN}
no-multicast-peers
no-stdout-log
EOL
    chmod 600 /etc/turnserver.conf
    
    # Set proper permissions for binding to privileged ports
    setcap cap_net_bind_service=+ep /usr/bin/turnserver
    
    # Configure journald log limits
    mkdir -p /etc/systemd/journald.conf.d/
    cat > /etc/systemd/journald.conf.d/coturn.conf << EOL
[Journal]
SystemMaxUse=100M
SystemKeepFree=500M
MaxFileSec=1week
EOL

    # Restart journald to apply changes
    systemctl restart systemd-journald

    # Configure logrotate for coturn logs
    cat > /etc/logrotate.d/coturn << EOL
/var/log/coturn/*.log /var/log/turn*.log {
    daily
    rotate 3
    compress
    delaycompress
    missingok
    notifempty
    size 50M
    postrotate
        systemctl kill -s USR1 coturn 2>/dev/null || true
    endscript
}
EOL

    # Start services
    systemctl daemon-reload
    systemctl enable coturn
    systemctl start coturn
}

# Swap setup - 2GB is sufficient for most TURN servers
echo "Setting up 2GB swap..."
setup_swap

# Disk protection - auto-cleanup to prevent disk full issues
echo "Setting up disk protection..."
setup_cleanup_cron

# Main script execution
echo "TURN Server Installation and Configuration"
echo "----------------------------------------"

# Get or verify domain
while true; do
    read -p "Enter your domain (e.g., turn.example.com): " DOMAIN
    echo "Verifying domain..."
    if domain_has_dns_record "$DOMAIN"; then
        break
    else
        echo "Warning: Domain $DOMAIN does not appear to be configured. Please verify DNS settings."
        read -p "Try a different domain? (Y/n): " RETRY
        if [ "${RETRY,,}" = "n" ]; then
            break
        fi
    fi
done

read -p "Enter username for TURN: " USERNAME
read -s -p "Enter password for TURN: " PASSWORD
echo

# Install base TURN server
install_coturn "$DOMAIN" "$USERNAME" "$PASSWORD"

# Configure SSL if desired
read -p "Do you want to enable SSL/TLS support? (y/N): " ENABLE_SSL
if [ "${ENABLE_SSL,,}" = "y" ]; then
    if ! configure_ssl "$DOMAIN"; then
        echo "SSL configuration failed. You can retry SSL setup later by running:"
        echo "certbot delete"
        echo "certbot certonly --standalone -d $DOMAIN"
        echo "Then restart coturn: systemctl restart coturn"
    fi
fi

# Display status
systemctl status coturn

echo "Installation complete!"
echo "----------------------------------------"
echo "Domain: $DOMAIN"
echo "Username: $USERNAME"
echo "STUN/TURN ports: 3478 (default)"
if [ "${ENABLE_SSL,,}" = "y" ]; then
    echo "TLS enabled on port 443"
    echo "SSL certificates will automatically renew via certbot"
fi

# Final verification
echo ""
echo "Running post-install verification..."
verify_server
