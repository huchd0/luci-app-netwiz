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
# 🌟 新增：记录连续断开的次数
DOWN_COUNT=0

log "Service started. Monitoring WAN ($WAN_DEV) and LAN rollback timer."

while true; do
    # ---------------- 1. WAN 盲插监听 (带时间防抖算法) ----------------
    CURRENT_WAN_STATE=$(check_wan_link)
    
    if [ ! -f "$LOCK_FILE" ]; then
        if [ "$CURRENT_WAN_STATE" = "down" ]; then
            DOWN_COUNT=$((DOWN_COUNT+1))
        else
            # 状态为 UP
            if [ "$LAST_WAN_STATE" = "down" ]; then
                # 🌟 核心防抖：只有断开时间超过 3 个周期（约 9 秒），才认定为人类物理拔插！
                if [ "$DOWN_COUNT" -ge 3 ]; then
                    log "Physical WAN plug-in confirmed (down for ${DOWN_COUNT} ticks). Waking up engine."
                    /usr/libexec/netwiz-autodetect.sh >/dev/null 2>&1 </dev/null &
                else
                    log "Ignored short software interface bounce (down for ${DOWN_COUNT} ticks)."
                fi
            fi
            DOWN_COUNT=0
        fi
        LAST_WAN_STATE="$CURRENT_WAN_STATE"
    fi

    # ---------------- 2. LAN 防失联雷达与炸弹 ----------------
    if [ -f /tmp/netwiz_rollback_time ] && [ -f /tmp/netwiz_target_ip ]; then
        # 🌟 终极雷达：只认死命令纸条上的 IP
        TARGET_IP=$(cat /tmp/netwiz_target_ip)
        
        if netstat -tn 2>/dev/null | grep -E "(^|[ \t:])${TARGET_IP}:(80|443)[ \t]+.*ESTABLISHED" >/dev/null; then
            log "SUCCESS: Radar detected browser access on $TARGET_IP. Defusing bomb autonomously."
            rm -f /tmp/netwiz_rollback_time /tmp/netwiz_target_ip /tmp/network.netwiz_bak /tmp/dhcp.netwiz_bak
        else
            TARGET_TIME=$(cat /tmp/netwiz_rollback_time)
            CURRENT_TIME=$(date +%s)
            if [ "$CURRENT_TIME" -ge "$TARGET_TIME" ]; then
                log "Time is up (120s)! No browser access to $TARGET_IP detected. BOOM!"
                rm -f /tmp/netwiz_rollback_time /tmp/netwiz_target_ip
                if [ -f /tmp/network.netwiz_bak ]; then
                    log "Restoring original network config..."
                    cp /tmp/network.netwiz_bak /etc/config/network
                    cp /tmp/dhcp.netwiz_bak /etc/config/dhcp
                    rm -f /tmp/network.netwiz_bak /tmp/dhcp.netwiz_bak
                    
                    (
                        exec >/dev/null 2>&1 </dev/null
                        /etc/init.d/network restart
                        /etc/init.d/dnsmasq restart
                        /etc/init.d/uhttpd restart
                        sleep 3
                        echo "$(date '+%F %T') [Monitor] Rollback completely finished. Services restarted." >> /tmp/netwiz.log
                    ) &
                fi
            fi
        fi
    fi

    sleep 3
done
