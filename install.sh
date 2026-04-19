#!/bin/sh

case "$1" in
    list)
        echo '{ "set_network": { "mode": "string", "arg1": "string", "arg2": "string", "arg3": "string", "arg4": "string" }, "do_update": {} }'
        exit 0
        ;;
    call)
        case "$2" in
            set_network)
                # ... 这里是你原本的网络设置代码，保持不变 ...
                echo '{"result":0}'
                ( sleep 3; /etc/init.d/network restart; /etc/init.d/dnsmasq restart ) >/dev/null 2>&1 &
                exit 0
                ;;
            
            do_update)
                echo '{"result":0}'
                # 💡 稳如泰山的更新机制：写入临时脚本并脱离父进程
                cat << 'EOF' > /tmp/nw_do_update.sh
#!/bin/sh
sleep 3
# 调用上面写好的 GitHub install.sh
wget -qO- --no-check-certificate https://ghproxy.net/https://raw.githubusercontent.com/huchd0/luci-app-netwiz/master/install.sh | sh
rm -f /tmp/nw_do_update.sh
EOF
                chmod +x /tmp/nw_do_update.sh
                # 💡 关键：加入 </dev/null 切断输入流，防止 rpcd 挂起等待卡死前端！
                /tmp/nw_do_update.sh </dev/null >/tmp/nw_update_debug.log 2>&1 &
                exit 0
                ;;
        esac
        ;;
esac
exit 1
