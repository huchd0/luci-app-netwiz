#!/bin/sh
LOG_FILE="/tmp/netwiz.log"
LOCK_FILE="/var/run/netwiz_autodetect.lock"

log() {
    echo "$(date '+%F %T') [Monitor] $1" >> "$LOG_FILE"
}

WAN_DEV=$(uci -q get network.wan.device)
[ -z "$WAN_DEV" ] && WAN_DEV=$(uci -q get network.wan.ifname)
[ -z "$WAN_DEV" ] && WAN_DEV="eth0"

check_wan_link() {
    if ubus call network.device status "{\"name\":\"$WAN_DEV\"}" 2>/dev/null | grep -q '"carrier": true'; then
        echo "up"
    else
        echo "down"
    fi
}

LAST_WAN_STATE=$(check_wan_link)
log "Service started. Monitoring WAN ($WAN_DEV) and LAN rollback timer."

while true; do
    # ---------------- 1. WAN 盲插监听 ----------------
    CURRENT_WAN_STATE=$(check_wan_link)
    
    # 不重复触发！
    if [ -f "$LOCK_FILE" ]; then
        LAST_WAN_STATE="$CURRENT_WAN_STATE"
    else
        if [ "$LAST_WAN_STATE" = "down" ] && [ "$CURRENT_WAN_STATE" = "up" ]; then
            log "WAN cable plug-in detected! Waking up autodetect engine."
            /usr/libexec/netwiz-autodetect.sh >/dev/null 2>&1 </dev/null &
        fi
        LAST_WAN_STATE="$CURRENT_WAN_STATE"
    fi

    # ---------------- 2. LAN 防失联雷达与炸弹 ----------------
    if [ -f /tmp/netwiz_rollback_time ]; then
        TARGET_IP=$(uci -q get network.lan.ipaddr | cut -d/ -f1)
        
        # 后台扫描到有浏览器连上了新 IP 的 80/443 端口
        if netstat -tn 2>/dev/null | grep -E "(^|[ \t:])${TARGET_IP}:(80|443)[ \t]+.*ESTABLISHED" >/dev/null; then
            log "SUCCESS: Radar detected browser access on $TARGET_IP. Defusing bomb autonomously."
            rm -f /tmp/netwiz_rollback_time /tmp/network.netwiz_bak /tmp/dhcp.netwiz_bak
        else
            # 超时引爆判定
            TARGET_TIME=$(cat /tmp/netwiz_rollback_time)
            CURRENT_TIME=$(date +%s)
            if [ "$CURRENT_TIME" -ge "$TARGET_TIME" ]; then
                log "Time is up (120s)! No browser access detected. BOOM!"
                rm -f /tmp/netwiz_rollback_time
                if [ -f /tmp/network.netwiz_bak ]; then
                    log "Restoring original network config..."
                    cp /tmp/network.netwiz_bak /etc/config/network
                    cp /tmp/dhcp.netwiz_bak /etc/config/dhcp
                    rm -f /tmp/network.netwiz_bak /tmp/dhcp.netwiz_bak
                    /etc/init.d/network restart
                    log "Rollback successfully completed."
                fi
            fi
        fi
    fi

    sleep 3
done
