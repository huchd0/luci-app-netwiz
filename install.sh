#!/bin/sh
# NetWiz 全自动一键安装脚本 (支持多平台识别)

echo "========================================="
echo "   正在开始安装 NetWiz 网络向导..."
echo "========================================="

# 你的 GitHub 仓库名
REPO="huchd0/luci-app-netwiz"

# 🔍 魔法步骤：偷看系统的“身份证”
OS_NAME="OpenWrt 类系统"
if [ -f /etc/os-release ]; then
    # 提取 NAME 字段 (例如 "ImmortalWrt" 或 "iStoreOS")
    DETECTED_NAME=$(awk -F '"' '/^NAME=/{print $2}' /etc/os-release)
    [ -n "$DETECTED_NAME" ] && OS_NAME="$DETECTED_NAME"
fi

# 智能判断包管理器
if command -v apk >/dev/null 2>&1; then
    echo "[环境检测] 成功！当前系统: ${OS_NAME} (采用全新 apk 架构)"
    echo "📥 正在拉取最新版 .apk 安装包..."
    wget -qO /tmp/luci-app-netwiz.apk "https://github.com/${REPO}/releases/download/latest/luci-app-netwiz.apk"
    
    echo "📦 正在执行免检安装..."
    apk add --allow-untrusted /tmp/luci-app-netwiz.apk

elif command -v opkg >/dev/null 2>&1; then
    echo "[环境检测] 成功！当前系统: ${OS_NAME} (采用经典 opkg 架构)"
    echo "📥 正在拉取最新版 .ipk 安装包..."
    wget -qO /tmp/luci-app-netwiz.ipk "https://github.com/${REPO}/releases/download/latest/luci-app-netwiz.ipk"
    
    echo "📦 正在执行常规安装..."
    opkg install /tmp/luci-app-netwiz.ipk

else
    echo "❌ 错误: 未知系统环境，找不到 apk 或 opkg 命令！"
    exit 1
fi

# 安装成功的收尾工作
echo "🧹 正在清理系统界面缓存..."
rm -f /tmp/luci-indexcache /tmp/luci-modulecache/*
/etc/init.d/rpcd restart

echo "========================================="
echo " 🎉 NetWiz 已成功安装在你的 ${OS_NAME} 上！"
echo " 👉 请刷新浏览器界面查看。"
echo "========================================="
