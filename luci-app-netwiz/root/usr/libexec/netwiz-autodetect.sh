#!/bin/sh
# Copyright (C) 2026 huchd0 <https://github.com/huchd0/luci-app-netwiz>
# Licensed under the GNU General Public License v3.0

LOG_FILE="/tmp/netwiz.log"

log() {
    echo "$(date '+%F %T') [Engine] $1" >> "$LOG_FILE"
    # 超过 600 行自动清理，保留最新 500 行
    if [ $(wc -l < "$LOG_FILE" 2>/dev/null || echo 0) -gt 600 ]; then
        tail -n 500 "$LOG_FILE" > "$LOG_FILE.tmp"
        mv "$LOG_FILE.tmp" "$LOG_FILE"
    fi
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
    local offline_strikes=0
    
    while [ $i -lt $max_wait ]; do
        # 允许网络服务重启时的短暂断电。只有连续 3 次（6秒）没信号，才认定是真拔了网线！
        if ! ubus call network.device status "{\"name\":\"$WAN_DEV\"}" 2>/dev/null | grep -q '"carrier": true'; then
            offline_strikes=$((offline_strikes+1))
        else
            offline_strikes=0
        fi
        
        if [ $offline_strikes -ge 3 ]; then
            log "检测到网线已物理拔出 (连续 3 次无信号)，终止探测"
            return 1
        fi
        
        if ping -c 1 -W 1 223.5.5.5 >/dev/null 2>&1; then return 0; fi
        sleep 2
        i=$((i+1))
    done
    return 1
}

log "检测到 WAN 口网线插入，启动自动探测引擎..."
sleep 5
if wait_for_internet; then 
    log "当前配置网络正常，无需切换协议"
    exit 0
fi

log "当前配置无法连通互联网，准备进行协议切换探测"
cp /etc/config/network "$BAK_FILE"
sync

ORIG_PROTO=$(uci -q get network.wan.proto)
HAS_PPPOE_USER=$(uci -q get network.wan.username)
success=0

if [ "$ORIG_PROTO" != "dhcp" ]; then
    log "正在尝试通过 DHCP 自动获取 IP 地址..."
    uci set network.wan.proto='dhcp'
    uci commit network
    
    # 热重载代替完全重启，极其丝滑！
    /etc/init.d/network reload
    
    # 进入探测循环，循环里面本来就有 2 秒一次的 ping
    if wait_for_internet; then success=1; fi
fi

if [ "$success" -eq 0 ] && [ "$ORIG_PROTO" != "pppoe" ] && [ -n "$HAS_PPPOE_USER" ]; then
    log "未获取到 DHCP，正在探测 PPPoE (光猫桥接) 服务器..."
    cp "$BAK_FILE" /etc/config/network
    uci set network.wan.proto='pppoe'
    uci commit network
    
    # 使用热重载
    /etc/init.d/network reload
    if wait_for_internet; then success=1; fi
fi

if [ "$success" -eq 1 ]; then
    log "新协议探测连通成功，已保存配置"
    rm -f "$BAK_FILE"
else
    log "未检测到有效的网络协议，正在回退到原始配置"
    cp "$BAK_FILE" /etc/config/network
    rm -f "$BAK_FILE"

    /etc/init.d/network reload
fi
exit 0
