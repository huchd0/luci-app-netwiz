#!/bin/sh

echo "🚀 开始极速安装/升级 NetWiz 网络设置向导 (含多语言包)..."

# 0. 提前创建自定义插件保险箱目录
mkdir -p /etc/netwiz/custom_pkgs/
# 当前正在运行的脚本，直接复制一份到保险箱中备用
cp -f "$0" /etc/netwiz/custom_pkgs/install.sh 2>/dev/null

# 1. 判定包管理器并强制卸载旧版主程序与语言包 (UI)
echo "🧹 正在清理系统旧版本..."
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

# 🚨 注意：这里不再提前删除保险箱里的本地包，作为断网兜底！

# 2. 批量下载主程序与语言包
echo "⬇️ 正在从云端尝试获取最新版本 (${PKG_TYPE} 格式)..."

FILES="luci-app-netwiz luci-i18n-netwiz-zh-cn luci-i18n-netwiz-zh-tw"
DOWNLOAD_SUCCESS=0

for FILE in $FILES; do
    TARGET_FILE="${PKG_TYPE}_${FILE}.${PKG_TYPE}"
    URL_DIRECT="https://github.com/huchd0/luci-app-netwiz/releases/latest/download/${TARGET_FILE}"
    PROXY_1="https://ghp.ci/${URL_DIRECT}"
    PROXY_2="https://ghproxy.net/${URL_DIRECT}"
    PROXY_3="https://github.moeyy.xyz/${URL_DIRECT}"

    echo "正在拉取: ${TARGET_FILE} ..."
    
    # 尝试直连 (先下载到暂存区 /tmp )
    wget -qO "/tmp/${TARGET_FILE}" --no-check-certificate -T 10 "$URL_DIRECT"
    
    if [ "$?" -ne 0 ] || [ ! -s "/tmp/${TARGET_FILE}" ]; then
        wget -qO "/tmp/${TARGET_FILE}" --no-check-certificate -T 10 "$PROXY_1"
    fi
    if [ "$?" -ne 0 ] || [ ! -s "/tmp/${TARGET_FILE}" ]; then
        wget -qO "/tmp/${TARGET_FILE}" --no-check-certificate -T 10 "$PROXY_2"
    fi

    FILE_SIZE=$(ls -l "/tmp/${TARGET_FILE}" 2>/dev/null | awk '{print $5}')
    if [ -s "/tmp/${TARGET_FILE}" ] && [ "$FILE_SIZE" -gt 1000 ]; then
        DOWNLOAD_SUCCESS=$((DOWNLOAD_SUCCESS + 1))
        echo "✅ ${TARGET_FILE} 获取成功，已更新至保险箱！"
        # 成功，覆盖到保险箱
        mv -f "/tmp/${TARGET_FILE}" "/etc/netwiz/custom_pkgs/${TARGET_FILE}"
    else
        rm -f "/tmp/${TARGET_FILE}" # 清理损坏的临时文件
    fi
done

# === 离线兜底核心机制 ===
if [ "$DOWNLOAD_SUCCESS" -lt 3 ]; then
    echo "⚠️ 无法从云端完整获取最新安装包，网络可能异常！"
    echo "🔍 正在检查本地保险箱是否存在历史备份..."
    
    LOCAL_PKG_COUNT=$(ls /etc/netwiz/custom_pkgs/*luci-*netwiz*.${PKG_TYPE} 2>/dev/null | wc -l)
    
    if [ "$LOCAL_PKG_COUNT" -gt 0 ]; then
        echo "👉 ✅ 发现 ${LOCAL_PKG_COUNT} 个本地历史安装包，启用【离线恢复模式】！"
    else
        echo "❌ 彻底失败：云端下载失败，且本地保险箱无可用备份，安装终止！"
        exit 1
    fi
fi

# 3. 部署新版本 / 离线版本
echo "⚙️ 正在执行批量覆盖安装..."
if [ "$PKG_TYPE" = "apk" ]; then
    apk add --allow-untrusted --force-overwrite /etc/netwiz/custom_pkgs/*luci-*netwiz*.apk 2>/dev/null
else
    opkg install /etc/netwiz/custom_pkgs/*luci-*netwiz*.ipk --force-reinstall --force-overwrite 2>/dev/null
fi

# 4. 清理缓存
echo "正在重建 LuCI 缓存并清理当前登录会话..."
rm -rf /tmp/luci-indexcache /tmp/luci-modulecache/ /var/run/luci-indexcache /var/run/luci-modulecache/ 2>/dev/null
rm -rf /tmp/luci-sessions/* /var/run/luci-sessions/* 2>/dev/null
/etc/init.d/rpcd reload 2>/dev/null

if [ -f "/etc/init.d/uhttpd" ]; then
    /etc/init.d/uhttpd restart 2>/dev/null
elif [ -f "/etc/init.d/nginx" ]; then
    /etc/init.d/nginx restart 2>/dev/null
fi

echo -e "\n👉 👉 👉  NetWiz 核心程序部署完成！✅"
echo -e "💡 登录状态已安全重置，请返回浏览器按下 【F5】 刷新即可看到新菜单！"

# 5. 匿名安装量统计 (基础硬件环境信息)
(
    if [ -f /etc/openwrt_release ]; then
        . /etc/openwrt_release
        OW_VER=${DISTRIB_RELEASE:-"unknown"}
        OW_ARCH=${DISTRIB_TARGET:-"unknown"}
    else
        OW_VER="unknown"
        OW_ARCH=$(uname -m 2>/dev/null || echo "unknown")
    fi
    API_URL="https://netwiz-tracker.vercel.app/api/track"
    REQ_URL="${API_URL}?app=netwiz&ver=${OW_VER}&arch=${OW_ARCH}"
    
    if command -v curl >/dev/null 2>&1; then
        curl -s -m 3 "$REQ_URL" >/dev/null 2>&1
    else
        wget -qO- -T 3 "$REQ_URL" >/dev/null 2>&1
    fi
) &

exit 0
