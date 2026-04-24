#!/bin/sh
# 定义日志和锁定文件路径
LOG_FILE="/tmp/netwiz.log"
LOCK_FILE="/var/run/netwiz_autodetect.lock"

# 写日志的函数
log() {
    echo "$(date '+%F %T') [Monitor] $1" >> "$LOG_FILE"
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

    # --- 2. LAN 接口防失联雷达与炸弹 (方案 B：持久化版) ---
    if [ -f /tmp/netwiz_rollback_time ] && [ -f /tmp/netwiz_target_ip ]; then
        # 获取目标 IP
        TARGET_IP=$(cat /tmp/netwiz_target_ip)
        
        # 统计当前的浏览器并发连接数
        CONN_COUNT=$(netstat -tn 2>/dev/null | grep -E "(^|[ \t:])${TARGET_IP}:(80|443)[ \t]+.*ESTABLISHED" | wc -l)
        
        # 如果连接数大于等于 2，认为是真实浏览器访问，自动拆弹
        if [ "$CONN_COUNT" -ge 2 ]; then
            log "成功：雷达检测到浏览器访问，自动拆除炸弹"
            # 清理所有临时标志和闪存中的备份
            rm -f /tmp/netwiz_rollback_time /tmp/netwiz_target_ip /etc/config/network.netwiz_bak /etc/config/dhcp.netwiz_bak
        else
            # 如果只有 1 个连接，记录一下但不拆弹
            if [ "$CONN_COUNT" -eq 1 ]; then
                log "忽略单个后台探测连接，等待真实浏览器访问"
            fi
            
            # 检查时间是否到期
            TARGET_TIME=$(cat /tmp/netwiz_rollback_time)
            CURRENT_TIME=$(date +%s)
            
            if [ "$CURRENT_TIME" -ge "$TARGET_TIME" ]; then
                log "时间到！未检测到有效连接，开始执行回退"
                rm -f /tmp/netwiz_rollback_time /tmp/netwiz_target_ip
                
                # 从闪存 (/etc/config/) 中恢复之前的备份
                if [ -f /etc/config/network.netwiz_bak ]; then
                    log "正在从闪存恢复原始配置"
                    cp /etc/config/network.netwiz_bak /etc/config/network
                    cp /etc/config/dhcp.netwiz_bak /etc/config/dhcp
                    rm -f /etc/config/network.netwiz_bak /etc/config/dhcp.netwiz_bak
                    
                    # 在后台重启所有网络相关服务
                    (
                        exec >/dev/null 2>&1 </dev/null
                        /etc/init.d/network restart
                        /etc/init.d/dnsmasq restart
                        /etc/init.d/uhttpd restart
                        sleep 3
                        echo "$(date '+%F %T') [Monitor] 回退操作已全部完成" >> /tmp/netwiz.log
                    ) &
                fi
            fi
        fi
    fi

    # 每 3 秒执行一次检查
    sleep 3
done
