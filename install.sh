#!/bin/sh

echo "🚀 开始极速安装/升级 NetWiz 网络设置向导 (含多语言包)..."

# 1. 判定包管理器并强制卸载旧版主程序与语言包
echo "🧹 正在清理旧版本与系统残留..."
if command -v apk >/dev/null 2>&1; then
    PKG_TYPE="apk"
    apk del luci-app-netwiz luci-i18n-netwiz-zh-cn luci-i18n-netwiz-zh-tw >/dev/null 2>&1
elif command -v opkg >/dev/null 2>&1; then
    PKG_TYPE="ipk"
    opkg remove luci-app-netwiz luci-i18n-netwiz-zh-cn luci-i18n-netwiz-zh-tw --force-remove >/dev/null 2>&1
else
    echo "❌ 找不到支持的软件包管理器 (未找到 apk 或 opkg)！"
    exit 1
fi

rm -f /tmp/luci-*.${PKG_TYPE} 2>/dev/null

# 2. 批量下载主程序与语言包
echo "⬇️ 正在从云端下载最新版本 (${PKG_TYPE} 格式)..."

FILES="luci-app-netwiz luci-i18n-netwiz-zh-cn luci-i18n-netwiz-zh-tw"
DOWNLOAD_SUCCESS=0

for FILE in $FILES; do
    # 完美匹配您的文件名格式：前缀_包名.后缀 (例如 apk_luci-app-netwiz.apk)
    TARGET_FILE="${PKG_TYPE}_${FILE}.${PKG_TYPE}"
    URL_DIRECT="https://github.com/huchd0/luci-app-netwiz/releases/latest/download/${TARGET_FILE}"
    
    # 🌟 代理池：引入目前国内最稳定的三个加速节点，防止单一节点失效
    PROXY_1="https://ghp.ci/${URL_DIRECT}"
    PROXY_2="https://ghproxy.net/${URL_DIRECT}"
    PROXY_3="https://github.moeyy.xyz/${URL_DIRECT}"

    echo "👉 正在拉取: ${TARGET_FILE} ..."
    
    # 尝试直连
    wget -qO "/tmp/${TARGET_FILE}" --no-check-certificate -T 10 "$URL_DIRECT"
    
    # 直连失败，尝试代理 1
    if [ "$?" -ne 0 ] || [ ! -s "/tmp/${TARGET_FILE}" ]; then
        echo "⚠️ 直连超时，尝试加速节点 1 (ghp.ci)..."
        wget -qO "/tmp/${TARGET_FILE}" --no-check-certificate -T 10 "$PROXY_1"
    fi
    
    # 代理 1 失败，尝试代理 2
    if [ "$?" -ne 0 ] || [ ! -s "/tmp/${TARGET_FILE}" ]; then
        echo "⚠️ 节点 1 超时，尝试加速节点 2 (ghproxy.net)..."
        wget -qO "/tmp/${TARGET_FILE}" --no-check-certificate -T 10 "$PROXY_2"
    fi

    # 校验是否最终下载成功 (大于1KB才算真正的包，防止下载到含有 404 报错的 HTML 文件)
    FILE_SIZE=$(ls -l "/tmp/${TARGET_FILE}" 2>/dev/null | awk '{print $5}')
    if [ -s "/tmp/${TARGET_FILE}" ] && [ "$FILE_SIZE" -gt 1000 ]; then
        DOWNLOAD_SUCCESS=$((DOWNLOAD_SUCCESS + 1))
        echo "✅ ${TARGET_FILE} 下载成功！"
    else
        echo "❌ 警告: ${TARGET_FILE} 下载失败！"
        rm -f "/tmp/${TARGET_FILE}" # 删除损坏的空文件
    fi
done

if [ "$DOWNLOAD_SUCCESS" -eq 0 ]; then
    echo "❌ 所有文件下载彻底失败！请检查路由器的网络连接。"
    exit 1
fi

# 3. 部署新版本
echo "⚙️ 正在执行批量覆盖安装..."
if [ "$PKG_TYPE" = "apk" ]; then
    apk add --allow-untrusted --force-overwrite /tmp/*luci-*.apk 2>/dev/null
else
    opkg install /tmp/*luci-*.ipk --force-reinstall --force-overwrite 2>/dev/null
fi

# 4. 清理缓存
echo "♻️ 正在重建 LuCI 缓存并清理当前登录会话..."

# 4.1 清理所有的菜单与编译缓存
rm -rf /tmp/luci-indexcache /tmp/luci-modulecache/ /var/run/luci-indexcache /var/run/luci-modulecache/ 2>/dev/null

# 4.2 清除安装包残留文件
rm -f /tmp/*luci-* 2>/dev/null

# 4.3 删除当前所有的登录 Session！确保菜单刷新！
rm -rf /tmp/luci-sessions/* /var/run/luci-sessions/* 2>/dev/null

# 4.4 重载 RPC 守护进程
/etc/init.d/rpcd reload 2>/dev/null

echo -e "\n🎉 NetWiz 核心程序及多语言包更新与部署完成！"
echo -e "💡 登录状态已安全重置，请返回浏览器按下 【F5】 刷新，重新登录即可看到新菜单！"
exit 0
