#!/bin/sh
# Copyright (C) 2026 huchd0 <https://github.com/huchd0/luci-app-netwiz>
# Licensed under the GNU General Public License v3.0

LOCK_FILE="/var/run/netwiz_autodetect.lock"
BAK_FILE="/etc/config/network.netwiz_bak"

# 1. Concurrency lock to prevent multiple instances during rapid plug/unplug
if [ -f "$LOCK_FILE" ]; then
    exit 0
fi
touch "$LOCK_FILE"
trap "rm -f $LOCK_FILE" EXIT INT TERM

check_internet() {
    ping -c 2 -W 2 223.5.5.5 >/dev/null 2>&1
    return $?
}

wait_for_ip() {
    local max_wait=10
    local i=0
    while [ $i -lt $max_wait ]; do
        carrier=$(cat /sys/class/net/eth0/carrier 2>/dev/null)
        if [ "$carrier" = "0" ]; then
            return 1 # Cable unplugged
        fi
        if ifconfig eth0 | grep -q "inet addr"; then
            sleep 2
            return 0
        fi
        sleep 1
        i=$((i+1))
    done
    return 1
}

# 2. Initial state check
sleep 3
if check_internet; then
    rm -f "$LOCK_FILE"
    exit 0
fi

# 3. Power-loss fail-safe: Backup the current network configuration
cp /etc/config/network "$BAK_FILE"
sync

ORIG_PROTO=$(uci -q get network.wan.proto)
HAS_PPPOE_USER=$(uci -q get network.wan.username)

success=0

# 4. Attempt A: Switch to DHCP
if [ "$ORIG_PROTO" != "dhcp" ]; then
    uci set network.wan.proto='dhcp'
    uci commit network
    /etc/init.d/network restart
    
    if wait_for_ip; then
        if check_internet; then
            success=1
        fi
    fi
fi

# 5. Attempt B: Switch to PPPoE (if credentials exist)
if [ "$success" -eq 0 ] && [ "$ORIG_PROTO" != "pppoe" ] && [ -n "$HAS_PPPOE_USER" ]; then
    cp "$BAK_FILE" /etc/config/network
    uci set network.wan.proto='pppoe'
    uci commit network
    /etc/init.d/network restart
    
    sleep 10
    if check_internet; then
        success=1
    fi
fi

# 6. Ultimate fallback mechanism
if [ "$success" -eq 1 ]; then
    # Detection successful, clean up backup
    rm -f "$BAK_FILE"
else
    # Detection failed, restore original config
    cp "$BAK_FILE" /etc/config/network
    rm -f "$BAK_FILE"
    /etc/init.d/network restart
fi

exit 0
