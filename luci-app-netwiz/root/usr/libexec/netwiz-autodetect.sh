#!/bin/sh
# Copyright (C) 2026 huchd0 <https://github.com/huchd0/luci-app-netwiz>
# Licensed under the GNU General Public License v3.0

LOG_FILE="/tmp/netwiz.log"

log() {
    echo "$(date '+%F %T') [Engine] $1" >> "$LOG_FILE"
}

LOCK_FILE="/var/run/netwiz_autodetect.lock"
BAK_FILE="/etc/config/network.netwiz_bak"

if [ -f "$LOCK_FILE" ]; then exit 0; fi
touch "$LOCK_FILE"
trap "rm -f $LOCK_FILE" EXIT INT TERM

WAN_DEV=$(uci -q get network.wan.device)
[ -z "$WAN_DEV" ] && WAN_DEV=$(uci -q get network.wan.ifname)
[ -z "$WAN_DEV" ] && WAN_DEV="eth0"

wait_for_internet() {
    local max_wait=20
    local i=0
    while [ $i -lt $max_wait ]; do
        # 探测途中发现网线被拔，直接中止
        if ! ubus call network.device status "{\"name\":\"$WAN_DEV\"}" 2>/dev/null | grep -q '"carrier": true'; then
            log "Cable unplugged during detection. Aborting."
            return 1
        fi
        if ping -c 1 -W 1 223.5.5.5 >/dev/null 2>&1; then return 0; fi
        sleep 2
        i=$((i+1))
    done
    return 1
}

log "Starting detection sequence..."
sleep 5
if wait_for_internet; then 
    log "Current config is working fine. Exiting."
    exit 0
fi

log "Current config has no internet. Preparing to switch."
cp /etc/config/network "$BAK_FILE"
sync

ORIG_PROTO=$(uci -q get network.wan.proto)
HAS_PPPOE_USER=$(uci -q get network.wan.username)
success=0

if [ "$ORIG_PROTO" != "dhcp" ]; then
    log "Switching to DHCP..."
    uci set network.wan.proto='dhcp'
    uci commit network
    /etc/init.d/network restart
    if wait_for_internet; then success=1; fi
fi

if [ "$success" -eq 0 ] && [ "$ORIG_PROTO" != "pppoe" ] && [ -n "$HAS_PPPOE_USER" ]; then
    log "Switching to PPPoE..."
    cp "$BAK_FILE" /etc/config/network
    uci set network.wan.proto='pppoe'
    uci commit network
    /etc/init.d/network restart
    if wait_for_internet; then success=1; fi
fi

if [ "$success" -eq 1 ]; then
    log "Protocol switched successfully."
    rm -f "$BAK_FILE"
else
    log "All protocols failed. Rolling back to original."
    cp "$BAK_FILE" /etc/config/network
    rm -f "$BAK_FILE"
    /etc/init.d/network restart
fi
exit 0
