# NetWiz (luci-app-netwiz) 🚀

**NetWiz** 开箱即用，「纯净 · 安全 · 零破坏」极简网络配置向导。化繁为简，聚焦三大高频接入场景，实现一键化配置与最小干预部署。

![OpenWrt](https://img.shields.io/badge/OpenWrt-23.05_|_25.x+-blue.svg) ![License](https://img.shields.io/badge/License-MIT-green.svg) ![Build](https://img.shields.io/badge/Build-Passing-brightgreen.svg)

## ✨ 核心特性

对于刚装完系统的玩家，都是需要网络设置才能上网，但系统自带的设置隐藏比较深，且容易配置错误，现有的网络向导往往会无脑和暴力重置整个网络配置文件，清空路由的已配置清单，导致精心设置的网桥（Bridge）、VLAN 和物理网卡绑定瞬间崩溃或引发**莫名其妙**的网络断流。**NetWiz 专为解决此痛点而生。**

* 🛡️ **底层安全锁 (Safe-Write)**：精准覆盖 WAN/LAN 接口的协议层核心参数，**绝对不破坏**原有的 `br-lan` 物理网卡绑定关系及高级定制规则。
* 📦 **跨世代兼容**：完美兼容 OpenWrt 23.05 及更早系统 (`.ipk`) 与 OpenWrt 25.x 新系统 (`.apk`)。
* 🎨 **次世代 UI 体验**：告别原生的枯燥表单，采用现代化的悬浮卡片与全息数据面板设计，支持色彩流转与优雅的动画交互。
* ⚡ **极速场景切换**：化繁为简，提炼三大最高频网络接入场景，点击即用，自带防呆校验（如网段冲突拦截、网关校验...），免去繁杂排错。
* 🧹 **零乱码架构**：彻底重构前端资源加载逻辑与文件编码格式，完美适配最新版 LuCI 引擎，告别 404 与 ACL 权限缓存报错。

---

## 🚀 极速安装 (推荐)

我们提供了一键智能安装脚本。无论你是老系统还是新系统，只需在 SSH 终端中直接复制并执行以下单行命令，即可自动完成 **【判断系统架构 -> 下载对应格式 -> 安装 -> 修复权限与清理缓存】** 的全流程：

```bash
wget -qO- https://raw.githubusercontent.com/huchd0/luci-app-netwiz/master/install.sh | sh
```

💡 **提示**：如果你的网络无法直接访问 GitHub Raw，可以在链接前加上代理加速，例如：
```bash
wget -qO- https://ghproxy.net/https://raw.githubusercontent.com/huchd0/luci-app-netwiz/master/install.sh | sh
```

---

## 🛠️ 手动安装 (离线包)

如果你习惯手动操作，请前往 [Releases 页面] 下载最新的安装包，并使用 WinSCP 将其上传至路由器的 `/tmp/` 目录。

**对于 OpenWrt 25.x 及最新快照版 (`.apk` 格式)：**
上传至 `/tmp/` 目录后，运行以下命令（注意：新版 25.x 由于签名限制，网页直接上传会报 `Error 99`，请务必使用下方的命令行安装）：
```bash
apk add --allow-untrusted /tmp/luci-app-netwiz.apk
rm -f /tmp/luci-indexcache /tmp/luci-modulecache/* && /etc/init.d/rpcd restart
```

**对于 OpenWrt 23.05 及更早系统 (`.ipk` 格式)：**
以下两种方式任选其一：
1. 网页端：在系统后台使用 “系统 -> 软件包 -> 上传软件包” 正常安装。
2. 命令行：上传至 `/tmp/` 目录后，运行以下命令：
```bash
opkg install /tmp/luci-app-netwiz.ipk
rm -f /tmp/luci-indexcache /tmp/luci-modulecache/* && /etc/init.d/rpcd restart
```

---

## 📸 界面预览
<img width="600" alt="Image" src="https://github.com/user-attachments/assets/1b58d43e-861b-4d21-84c7-21b01f0e066f" />
<img width="600" alt="Image" src="https://github.com/user-attachments/assets/965c533e-d0ea-4133-899f-f5ad4aacb279" />
<img width="600" alt="Image" src="https://github.com/user-attachments/assets/84047484-7a63-4f6d-b38e-ed2c10008fa3" />
<img width="600" alt="Image" src="https://github.com/user-attachments/assets/d7bdcc3f-3771-4c4d-88da-05ce49af98c2" />
<img width="600" alt="Image" src="https://github.com/user-attachments/assets/31c47e9e-3f45-41ef-b3a2-10515b3d631b" />
<img width="600" alt="Image" src="https://github.com/user-attachments/assets/4a7213c9-76ad-4cf0-8b34-6755d87c2e20" />
<img width="600" alt="Image" src="https://github.com/user-attachments/assets/5ea50518-1f03-4047-b318-a6ef9955590c" />

---

## 📖 使用说明

安装完成后，刷新路由器后台网页（建议使用 `Ctrl + F5` 强制刷新或在无痕模式下打开），即可在导航栏找到对应入口：
👉 **系统 (System) -> 网络向导**

### 核心支持的三大模块：

1. 🌐 **二级路由模式 (DHCP / 静态 IP)**
   * **适用场景**：光猫已经负责拨号，或者上级有主路由，本设备作为二级路由或子网段路由接入。
   * **行为**：可自由选择“动态获取”或“静态绑定”，自动接管 WAN 口配置，智能校验网段避免死循环。

2. 🔌 **宽带拨号 (PPPoE)**
   * **适用场景**：光猫为纯桥接模式，由本路由器直接进行宽带拨号上网，承担全屋网络枢纽。
   * **行为**：精准写入宽带账号与密码，剥离多余网关遗留，安全重启底层拨号进程。

3. 🏠 **局域网设置 (主路由 / 旁路由切换)**
   * **适用场景**：仅需修改设备内网管理 IP；或者网络内已有主路由，本设备仅作为辅助网关。
   * **行为**：一键开启“旁路由模式”，系统将自动关闭本机 DHCP 服务，并要求必须填写主路由网关；若为主路由，则防呆提示网关留空，绝不破坏现有局域网拓扑。

---

## 💡 常见问题 (FAQ)

**Q：安装后点击菜单提示 `HTTP 404` 或 `Object not found (-32000)`？**
A：这是 OpenWrt 系统的权限通行证 (ACL) 和前端缓存机制未更新所致。请在 SSH 中执行彻底清理命令：
```bash
rm -f /tmp/luci-indexcache /tmp/luci-modulecache/* && /etc/init.d/rpcd restart
```
**做完后，请务必点击网页右上角“退出登录”，重新输入密码进入后台即可解决。**

**Q：在局域网设置里修改了 IP 后，为什么一直在转圈，打不开网页了？**
A：如果您修改了本机的局域网 IP，点击“确认应用”后底层网络会立刻重置。系统会在几秒后尝试为您自动跳转，如果由于浏览器安全策略未跳转成功，原有的旧 IP 网页将失效。请直接在浏览器地址栏手动输入您新设置的 IP 地址即可恢复访问。

---

## 📄 协议与鸣谢

本项目基于 MIT License 开源。

特别感谢 **OpenWrt 开源社区**、**LuCI 框架** 以及 **ImmortalWrt 团队** 提供坚实的基础架构支撑。

---

## ☕ 赞助与支持

如果您觉得这个插件让您的网络配置体验变得更加优雅、省心，欢迎请作者喝杯咖啡，这将是我持续维护与更新的最大动力！❤️

<img src="https://github.com/huchd0/openwrt-x86-64-build/blob/master/.github/Donate.jpg" width="680" alt="Donate">
