#!/bin/sh

echo "🚀 开始极速安装/升级 NetWiz 网络设置向导..."

# ---------------------------------------------------------
# 💡 1. 判定包管理器并强制卸载旧版 (斩断卡死根源)
# ---------------------------------------------------------
echo "🧹 正在清理旧版本与系统残留..."
if command -v apk >/dev/null 2>&1; then
    PKG_TYPE="apk"
    apk del luci-app-netwiz >/dev/null 2>&1
elif command -v opkg >/dev/null 2>&1; then
    PKG_TYPE="ipk"
    opkg remove luci-app-netwiz --force-remove >/dev/null 2>&1
else
    echo "❌ 找不到支持的软件包管理器 (未找到 apk 或 opkg)！"
    exit 1
fi

# ---------------------------------------------------------
# 💡 2. 使用“无版本号”的固定链接下载
# ---------------------------------------------------------
echo "⬇️ 正在从云端下载最新版本 (${PKG_TYPE})..."

# GitHub 官方固定链接 (永远指向最新正式版，无需版本号)
URL_DIRECT="https://github.com/huchd0/luci-app-netwiz/releases/latest/download/luci-app-netwiz.${PKG_TYPE}"
# 国内加速代理链接
URL_PROXY="https://ghproxy.net/${URL_DIRECT}"

echo "尝试使用官方节点下载..."
# -T 15 代表超时 15 秒就放弃，防止死锁卡住
wget -qO "/tmp/luci-app-netwiz.${PKG_TYPE}" --no-check-certificate -T 15 "$URL_DIRECT"

# 如果官方节点下载失败，或者下载下来的文件是空的 (0kb)
if [ "$?" -ne 0 ] || [ ! -s "/tmp/luci-app-netwiz.${PKG_TYPE}" ]; then
    echo "⚠️ 官方节点连接失败，自动切换至加速节点..."
    wget -qO "/tmp/luci-app-netwiz.${PKG_TYPE}" --no-check-certificate -T 15 "$URL_PROXY"
fi

# 最终核验下载结果
if [ ! -s "/tmp/luci-app-netwiz.${PKG_TYPE}" ]; then
    echo "❌ 下载彻底失败！"
    echo "💡 提示 1: 请检查路由器的网络连通性。"
    echo "💡 提示 2: 请确认你在 GitHub 发布时，【没有】勾选 Pre-release (预发布)！"
    rm -f "/tmp/luci-app-netwiz.${PKG_TYPE}"
    exit 1
fi

# ---------------------------------------------------------
# 💡 3. 强制部署新版本
# ---------------------------------------------------------
echo "⚙️ 正在部署新版本..."
if [ "$PKG_TYPE" = "apk" ]; then
    # APK 模式：允许未信任证书，并强制覆写现有文件
    apk add --allow-untrusted --force-overwrite "/tmp/luci-app-netwiz.apk"
else
    # IPK 模式：强制重新安装，强制覆写
    opkg install "/tmp/luci-app-netwiz.ipk" --force-reinstall --force-overwrite
fi

# ---------------------------------------------------------
# 💡 4. 清理缓存，确保前端 UI 立刻刷新
# ---------------------------------------------------------
echo "♻️ 正在重建 LuCI 缓存..."
rm -f /tmp/luci-indexcache /tmp/luci-modulecache/* /tmp/luci-app-netwiz.*

echo "✅ NetWiz 更新与部署完成！"
exit 0
