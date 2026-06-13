#!/bin/sh

echo "🚀 开始极速安装/升级/修复 NetWiz 网络设置向导 (智能双模式)..."

# ==========================================
# 0. 环境初始化与版本识别
# ==========================================
PKG_TYPE="ipk"
if command -v apk >/dev/null 2>&1; then
    PKG_TYPE="apk"
elif command -v opkg >/dev/null 2>&1; then
    PKG_TYPE="ipk"
else
    echo "❌ 找不到支持的软件包管理器 (未找到 apk 或 opkg)！"
    exit 1
fi

# 函数：获取当前系统中已安装的版本
get_installed_version() {
    if [ "$PKG_TYPE" = "apk" ]; then
        apk info -v luci-app-netwiz 2>/dev/null | grep "^luci-app-netwiz-" | awk '{print $1}' | sed 's/luci-app-netwiz-//'
    else
        opkg status luci-app-netwiz 2>/dev/null | grep -i "^Version:" | awk '{print $2}'
    fi
}

# 函数：获取本地保险箱中安装包的版本
get_local_version() {
    local file="$1"
    local ver=""
    mkdir -p /tmp/nw_ver_check
    if [ "$PKG_TYPE" = "apk" ]; then
        tar -xzf "$file" -C /tmp/nw_ver_check .PKGINFO 2>/dev/null
        [ -f /tmp/nw_ver_check/.PKGINFO ] && ver=$(grep "^pkgver =" /tmp/nw_ver_check/.PKGINFO | cut -d'=' -f2 | tr -d ' ')
    else
        tar -xzf "$file" -C /tmp/nw_ver_check ./control.tar.gz 2>/dev/null
        [ -f /tmp/nw_ver_check/control.tar.gz ] && tar -xzf /tmp/nw_ver_check/control.tar.gz -C /tmp/nw_ver_check ./control 2>/dev/null
        [ -f /tmp/nw_ver_check/control ] && ver=$(grep -i "^Version:" /tmp/nw_ver_check/control | awk '{print $2}')
    fi
    rm -rf /tmp/nw_ver_check
    echo "$ver"
}

# 函数：版本对比算法 (v1 >= v2 返回 0，否则返回 1)
version_ge() {
    awk -v v1="$1" -v v2="$2" '
    function split_ver(v, a) {
        gsub(/^[vV]/, "", v); gsub(/-.*/, "", v);
        return split(v, a, ".");
    }
    BEGIN {
        if (v1 == "" && v2 == "") exit 0;
        if (v1 == "") exit 1;
        if (v2 == "") exit 0;
        n1 = split_ver(v1, a1); n2 = split_ver(v2, a2);
        max = (n1 > n2) ? n1 : n2;
        for (i=1; i<=max; i++) {
            if (a1[i]+0 > a2[i]+0) exit 0;
            if (a1[i]+0 < a2[i]+0) exit 1;
        }
        exit 0;
    }'
}

INSTALLED_VER=$(get_installed_version)
echo "🔍 当前系统架构: $PKG_TYPE"
echo "📦 当前运行版本: ${INSTALLED_VER:-未安装 (或已被精简)}"

# ==========================================
# 1. 备份脚本自身，离线可用
# ==========================================
mkdir -p /etc/netwiz/custom_pkgs/
cp -f "$0" /etc/netwiz/custom_pkgs/install.sh 2>/dev/null

# ==========================================
# 2. 尝试从云端拉取最新版
# ==========================================
echo "⬇️ 正在从云端尝试获取最新版本..."
FILES="luci-app-netwiz luci-i18n-netwiz-zh-cn luci-i18n-netwiz-zh-tw"
DOWNLOAD_SUCCESS=0

for FILE in $FILES; do
    TARGET_FILE="${PKG_TYPE}_${FILE}.${PKG_TYPE}"
    URL_DIRECT="https://github.com/huchd0/luci-app-netwiz/releases/latest/download/${TARGET_FILE}"
    PROXY_1="https://ghp.ci/${URL_DIRECT}"
    PROXY_2="https://ghproxy.net/${URL_DIRECT}"
    PROXY_3="https://github.moeyy.xyz/${URL_DIRECT}"

    echo "正在拉取: ${TARGET_FILE} ..."
    wget -qO "/tmp/${TARGET_FILE}" --no-check-certificate -T 10 "$URL_DIRECT"
    [ "$?" -ne 0 ] || [ ! -s "/tmp/${TARGET_FILE}" ] && wget -qO "/tmp/${TARGET_FILE}" --no-check-certificate -T 10 "$PROXY_1"
    [ "$?" -ne 0 ] || [ ! -s "/tmp/${TARGET_FILE}" ] && wget -qO "/tmp/${TARGET_FILE}" --no-check-certificate -T 10 "$PROXY_2"

    FILE_SIZE=$(ls -l "/tmp/${TARGET_FILE}" 2>/dev/null | awk '{print $5}')
    if [ -s "/tmp/${TARGET_FILE}" ] && [ "$FILE_SIZE" -gt 1000 ]; then
        DOWNLOAD_SUCCESS=$((DOWNLOAD_SUCCESS + 1))
        echo "✅ ${TARGET_FILE} 获取成功，暂存备用！"
    else
        rm -f "/tmp/${TARGET_FILE}"
    fi
done

# ==========================================
# 3. 云端全新安装 vs 离线智能对比
# ==========================================
if [ "$DOWNLOAD_SUCCESS" -eq 3 ]; then
    echo "🌐 云端下载完整！正在覆盖至本地保险箱..."
    for FILE in $FILES; do
        TARGET_FILE="${PKG_TYPE}_${FILE}.${PKG_TYPE}"
        mv -f "/tmp/${TARGET_FILE}" "/etc/netwiz/custom_pkgs/${TARGET_FILE}"
    done
    echo "👉 准备执行全新安装/升级！"
else
    echo "⚠️ 云端连接失败或文件不完整，转入【离线恢复模式】！"
    echo "🔍 正在检查本地保险箱状态..."
    
    # 查找本地包含 luci-app-netwiz 的主安装包
    LOCAL_MAIN=$(ls /etc/netwiz/custom_pkgs/*luci-app-netwiz*.${PKG_TYPE} 2>/dev/null | head -n 1)
    if [ -n "$LOCAL_MAIN" ] && [ -f "$LOCAL_MAIN" ]; then
        LOCAL_VER=$(get_local_version "$LOCAL_MAIN")
        echo "📦 发现本地储备版本: ${LOCAL_VER:-未知}"
        
        # 如果系统已安装，且能读出本地版本，执行严格的智能比对
        if [ -n "$INSTALLED_VER" ] && [ -n "$LOCAL_VER" ]; then
            if version_ge "$LOCAL_VER" "$INSTALLED_VER"; then
                echo "✅ 本地储备版 ($LOCAL_VER) >= 当前运行版 ($INSTALLED_VER)，允许覆盖恢复！"
            else
                echo "🚫 智能拦截：本地储备版 ($LOCAL_VER) 低于当前运行版 ($INSTALLED_VER)！"
                echo "💡 为保护系统，无需进行降级安装，已自动安全退出。"
                exit 0
            fi
        else
            # 未安装或发生异常，强制放行救砖
            echo "✅ 系统核心未挂载，允许执行离线急救部署！"
        fi
    else
        echo "❌ 致命错误：云端下载失败，且本地保险箱无可用急救包！"
        exit 1
    fi
fi

# ==========================================
# 4. 卸载旧版并注入新版 (安全顺序)
# ==========================================
echo "🧹 正在清理系统旧版本残留..."
if [ "$PKG_TYPE" = "apk" ]; then
    apk del luci-app-netwiz luci-i18n-netwiz-zh-cn luci-i18n-netwiz-zh-tw >/dev/null 2>&1
else
    opkg remove luci-app-netwiz luci-i18n-netwiz-zh-cn luci-i18n-netwiz-zh-tw --force-remove >/dev/null 2>&1
fi

echo "⚙️ 正在执行批量注入安装..."
if [ "$PKG_TYPE" = "apk" ]; then
    apk add --allow-untrusted --force-overwrite /etc/netwiz/custom_pkgs/*luci-*netwiz*.apk 2>/dev/null
else
    opkg install /etc/netwiz/custom_pkgs/*luci-*netwiz*.ipk --force-reinstall --force-overwrite 2>/dev/null
fi

# ==========================================
# 5. 重建缓存与唤醒服务
# ==========================================
echo "🔄 正在重建 LuCI 缓存并唤醒服务..."
rm -rf /tmp/luci-indexcache /tmp/luci-modulecache/ /var/run/luci-indexcache /var/run/luci-modulecache/ 2>/dev/null
rm -rf /tmp/luci-sessions/* /var/run/luci-sessions/* 2>/dev/null
/etc/init.d/rpcd reload 2>/dev/null

if [ -f "/etc/init.d/uhttpd" ]; then
    /etc/init.d/uhttpd restart 2>/dev/null
elif [ -f "/etc/init.d/nginx" ]; then
    /etc/init.d/nginx restart 2>/dev/null
fi

echo -e "\n🎉 NetWiz 核心程序部署圆满完成！"
echo -e "💡 登录状态已安全重置，请返回浏览器按下 【F5】 刷新即可看到新菜单！"

# 6. 匿名安装量统计 (静默运行)
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
