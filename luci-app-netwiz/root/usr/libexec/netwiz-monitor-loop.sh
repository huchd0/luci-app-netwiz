#!/bin/sh
# Copyright (C) 2026 huchd0 <https://github.com/huchd0/luci-app-netwiz>
# Licensed under the GNU General Public License v3.0
# 日志路存放在 /etc/ 下
LOG_FILE="/etc/netwiz.log"
LOCK_FILE="/var/run/netwiz_autodetect.lock"

# 定义最大保留500行
MAX_LINES=500

log() {
    # 写入新日志
    echo "$(date '+%F %T') [Monitor] $1" >> "$LOG_FILE"
    
    # 自动删除
    # 日志超过 600 行时，自动删除，只保留最新的 500 行
    if [ $(wc -l < "$LOG_FILE" 2>/dev/null || echo 0) -gt 600 ]; then
        tail -n $MAX_LINES "$LOG_FILE" > "$LOG_FILE.tmp"
        mv "$LOG_FILE.tmp" "$LOG_FILE"
    fi
}

# 获取当前的 WAN 网卡名称
WAN_DEV=$(uci -q get network.wan.device)
[ -z "$WAN_DEV" ] && WAN_DEV=$(uci -q get network.wan.ifname)
[ -z "$WAN_DEV" ] && WAN_DEV="eth0"

# 检查 WAN 口物理连接状态
check_wan_link() {
    if ubus call network.device status "{\"name\":\"$WAN_DEV\"}" 2>/dev/null | grep -q '"carrier": true'; then
        echo "up"
    else
        echo "down"
    fi
}

LAST_WAN_STATE=$(check_wan_link)
# 记录连续断开的次数，用于防抖
DOWN_COUNT=0

log "服务已启动，正在监控 WAN 插拔和 LAN 回退定时器"

while true; do
    # --- 1. WAN 接口插拔监控 (带防抖逻辑) ---
    CURRENT_WAN_STATE=$(check_wan_link)
    
    # 如果自动探测引擎没有在运行，才执行监控
    if [ ! -f "$LOCK_FILE" ]; then
        if [ "$CURRENT_WAN_STATE" = "down" ]; then
            # 发现断开，累加次数
            DOWN_COUNT=$((DOWN_COUNT+1))
        else
            # 发现连通，检查之前是否真的拔出过
            if [ "$LAST_WAN_STATE" = "down" ]; then
                # 只有断开超过 3 个周期 (约 9 秒)，才认为是人工插拔
                if [ "$DOWN_COUNT" -ge 3 ]; then
                    log "确认 WAN 口物理插拔，正在启动探测引擎"
                    /usr/libexec/netwiz-autodetect.sh >/dev/null 2>&1 </dev/null &
                else
                    log "忽略短时间的软件网络波动"
                fi
            fi
            DOWN_COUNT=0
        fi
        LAST_WAN_STATE="$CURRENT_WAN_STATE"
    fi

    # --- 2. LAN 接口防失联雷达与炸弹 ---
    if [ -f /tmp/netwiz_rollback_time ] && [ -f /tmp/netwiz_target_ip ]; then
        # 获取我们刚刚修改的最新目标 IP
        TARGET_IP=$(cat /tmp/netwiz_target_ip 2>/dev/null)
        
        # 彻底排除局域网设备访问外网产生的 NAT 干扰
        conns=$(netstat -nt 2>/dev/null | grep "ESTABLISHED" | awk '{print $4}' | grep -E "(${TARGET_IP}:80$|${TARGET_IP}:443$)" | wc -l)

        # 阈值设为 1：因为前端已经不再发探针，现在能建立连接的只有真实网页！
        if [ "$conns" -ge 1 ]; then
            log "成功：雷达检测到真实浏览器访问新 IP ($TARGET_IP)，自动拆除炸弹"
            rm -f /tmp/netwiz_rollback_time /tmp/netwiz_target_ip /etc/config/network.netwiz_bak /etc/config/dhcp.netwiz_bak
        else
            log "等待用户浏览器跳转中... (目标连接数: $conns)"
            
            # 🌟 绝对安全的读取时间方式：剔除任何可能的空行或隐藏符号
            TARGET_TIME=$(cat /tmp/netwiz_rollback_time 2>/dev/null | tr -cd '0-9')
            CURRENT_TIME=$(date +%s)
            
            # 只有读到了纯数字时间，且当前时间大于目标时间，才执行回退
            if [ -n "$TARGET_TIME" ] && [ "$CURRENT_TIME" -ge "$TARGET_TIME" ]; then
                log "时间到！未检测到任何浏览器访问，确认为失联，开始执行断电级别回退"
                rm -f /tmp/netwiz_rollback_time /tmp/netwiz_target_ip
                
                if [ -f /etc/config/network.netwiz_bak ]; then
                    log "正在从闪存恢复原始配置"
                    cp /etc/config/network.netwiz_bak /etc/config/network
                    cp /etc/config/dhcp.netwiz_bak /etc/config/dhcp
                    rm -f /etc/config/network.netwiz_bak /etc/config/dhcp.netwiz_bak
                    
                    (
                        exec >/dev/null 2>&1 </dev/null
                        /etc/init.d/network restart
                        /etc/init.d/dnsmasq restart
                        /etc/init.d/uhttpd restart
                        sleep 3
                        echo "$(date '+%F %T') [Monitor] 回退操作已全部完成" >> /etc/netwiz.log
                    ) &
                fi
            fi
        fi
    fi

    # 每 3 秒执行一次检查
    sleep 3
done
