# NetWiz (luci-app-netwiz) 🚀

**NetWiz**网络设置向导-极简，开箱即用，「纯净 · 安全 · 零破坏」。化繁为简，聚焦三大高频接入场景，实现高效完成配置与最小干预部署。

![OpenWrt](https://img.shields.io/badge/OpenWrt-23.05_|_25.x+-blue.svg) ![ImmortalWrt](https://img.shields.io/badge/ImmortalWrt-Supported-orange.svg) ![License](https://img.shields.io/badge/License-GPL--3.0-green.svg) ![Build](https://img.shields.io/badge/Build-Passing-brightgreen.svg)

[English](#english) | [简体中文](#简体中文)

---

## English

```bash
wget -qO- https://raw.githubusercontent.com/huchd0/luci-app-netwiz/master/install.sh | sh
```

### Description
**Netwiz(luci-app-netwiz)** is a minimalist, safe, and non-destructive network configuration interface for OpenWrt/ImmortalWrt. 

It is designed to be highly user-friendly for novices setting up secondary routers (DHCP/Static IP) or bypass routers.

### 🌟 Key Features

**🛡️ Enterprise-Grade Fail-Safes**
* **Persistent Power-Loss Recovery:** Backups are written to non-volatile flash (`/etc/config`). An early-boot `init.d` script guarantees an automatic network restoration even if the router loses power mid-test.
* **Smart Concurrency Radar (LAN Auto-Defuse):** The 120-second rollback bomb uses `netstat` to count concurrent connections, accurately distinguishing true browser access from background IoT probes to prevent false-positive defusals.
* **Smart WAN Auto-Detect (Anti-Jitter):** Features a time-based debounce algorithm that requires 3 continuous down-cycles to confirm a physical cable unplug, safely ignoring temporary software interface bounces.
* **Flash-Friendly Safe Logging:** Includes a persistent, auto-trimming logging system (`/etc/netwiz.log`) that survives reboots but strictly caps file size to protect the router's flash memory lifespan.

**⚙️ Core Architecture & Security**
* **Zero-Zombie `procd` Daemon:** Replaces unreliable `hotplug` tricks with a single, ultra-lightweight native OpenWrt daemon (`netwiz-monitor`) that reads `ubus` states with near 0% CPU footprint.
* **Strict ACL:** The frontend has zero direct write access to UCI. All modifications are safely encapsulated and validated within the backend `rpcd` script.
* **Safe Configuration:** Strictly prevents routing loops and network conflicts (e.g., actively stops users from putting WAN and LAN in the same subnet).

**🚀 Smooth UX & Frontend**
* **Pure CSR Architecture:** Built with modern Client-Side Rendering for a blazing-fast, app-like experience.
* **Asynchronous UI & Hot-Reload:** Eliminates traditional blind wait times. The UI asynchronously "knocks" on the new IP with a real-time stopwatch. The backend applies changes via `reload` instead of a full `restart` to prevent Wi-Fi dropouts.
* **Bypass Router Mode:** One-click deployment that auto-configures complex DHCP, DNS, and gateway settings flawlessly.
* **Multi-language:** Native built-in i18n support, automatically adapting to English, zh-Hans, and zh-Hant.

### Installation
* You can compile it directly via the OpenWrt SDK or download the pre-compiled `.apk` / `.ipk` from the [Releases](../../releases) page.
Core Supported Modules

### Breadcrumb Trail
* 👉 **System -> Network Wizard**。
  
🌐 **Secondary Router Mode (DHCP / Static IP)**
   * Use Case: When the upstream modem (ONT) already handles PPPoE dialing, or an existing primary router is present. This device operates as a secondary router or segmented subnet router.
   * Behavior: Supports both dynamic IP assignment (DHCP) and static IP configuration. Automatically provisions WAN interface settings and performs intelligent subnet validation to prevent routing loops or address conflicts.

🔌 **Broadband Dial-Up (PPPoE)**
   * Use Case: When the modem is configured in full bridge mode and this router is responsible for establishing the PPPoE connection, acting as the primary network gateway.
   * Behavior: Accurately applies PPPoE credentials (username and password), removes residual gateway configurations, and safely restarts the underlying dialer process to ensure a clean connection.

🏠 **LAN Configuration (Primary / Bypass Router Switching)**
   * Use Case: For modifying the device’s LAN management IP, or when a primary router already exists and this device functions as an auxiliary gateway (bypass router).
   * Behavior: One-click activation of “Bypass Router Mode” automatically disables the local DHCP service and enforces manual configuration of the upstream gateway. In primary router mode, safeguards ensure the gateway field remains empty, preventing disruption to the existing LAN topology.

   A bypass router lets you add advanced features without touching the main network. The primary router keeps handling DHCP and NAT, while the bypass router processes selected traffic for tasks like policy routing or proxies. This keeps the network stable while giving you more control.

**A simple, common example:**
   
   * You have a main router providing Wi-Fi and DHCP for your home. You add a bypass router and set only your laptop’s gateway to it. Now, your laptop’s traffic goes through the bypass router (e.g., for proxy or special routing), while all other devices continue using the main router normally. This way, you get advanced control on one device without affecting the rest of the network.
---

## 简体中文

### 📖简介 | [English](#english)

**NetWiz(网络设置向导)** 是一款专为 OpenWrt / ImmortalWrt 设计的极简、安全且“零破坏”的网络配置界面。

它极其适合新手用户，能够一键安全地配置二级路由（动态/静态 IP）以及旁路由环境。对于刚装完系统的玩家，需要网络设置才能上网，但自带的设置隐藏比较深，且容易配置错误，无脑和暴力重置整个网络配置文件，清空路由的已配置清单，会导致精心设置的网桥（Bridge）、VLAN 和物理网卡绑定瞬间崩溃或引发**莫名其妙**的网络断流。**NetWiz 专为解决此痛点而生。**

## ✨ 核心特性与优势

### 🛡️ 独家安全机制 (拒绝失联)
* **120秒安全回退机制：** 配置错误导致无法连接后台？不用怕！应用新配置后会启动 120 秒安全倒计时。如果期间无法确认为本人真实访问新 IP，系统将自动恢复到修改前的配置，即使**意外断电重启依然有效**。
* **旁路由自动排雷：** 自动处理旁路由模式下的网关与 DHCP 冲突问题。智能指引配置，轻松上手，彻底告别“一顿操作猛如虎，全屋设备连不上网”的尴尬。
* **智能防呆校验：** 严格的前端输入验证，精准拦截诸如“WAN口与LAN口设置在同网段”等高危操作，从源头防止路由死循环。

### ⚡ 极致的无感体验
* **智能 WAN 口检测与切换：** 敏锐识别网线的物理插拔状态，并完美过滤由拨号失败、软件重启等引起的“假性掉线”。更换网线或切换接口时，系统自动感知并智能适配，无需繁琐的手动排查。
* **自动探活，秒级跳转：** 修改 IP 后，前端会静默探测新地址，网络一旦连通立刻瞬间跳转，体验丝滑流畅。
* **热重载，不掉线：** 摒弃粗暴的“重启整个网络服务”，采用平滑的配置文件热重载 (Reload)。在应用部分网络设置时，Wi-Fi 保持稳定不断开，不干扰其他设备的正常上网。

### 💻 现代化前端架构
* **纯前端渲染 (CSR)：** 采用现代化的响应式架构构建，告别传统路由器后台卡顿的页面刷新，极速加载，操作响应极其迅速。
* **严格的权限隔离：** 界面操作与底层系统权限彻底分离。前端不具备直接修改底层配置的权限，所有变更均由受信任的沙箱代理安全执行。
* **原生多语言支持：** 根据您的系统环境，完美自动适配简体中文、繁体中文及英文界面。

### 安装方法
您可以通过 OpenWrt 官方 SDK 编译此插件，或者直接前往 [Releases](../../releases) 页面下载编译好的 `.apk` 或 `.ipk` 安装包，并在路由器后台上传安装，即可在👉 **系统 (System) -> 网络向导**找到。

### 导航路径
👉 **系统 (System) -> 网络向导**。

---


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


## 一、🚀 极速安装 (推荐)

我们提供了一键智能安装脚本。无论你是老系统还是新系统，只需在 SSH 终端中直接复制并执行以下单行命令，即可自动完成 **【判断系统架构 -> 下载对应格式 -> 安装 -> 修复权限与清理缓存】** 的全流程：

```bash
wget -qO- https://raw.githubusercontent.com/huchd0/luci-app-netwiz/master/install.sh | sh
```

💡 **提示**：如果你的网络无法直接访问 GitHub Raw，可以在链接前加上代理加速，例如：
```bash
wget -qO- https://ghproxy.net/https://raw.githubusercontent.com/huchd0/luci-app-netwiz/master/install.sh | sh
```

---

## 二、🛠️ 手动安装 (离线包)

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
**使用 SSH（例如 PuTTY、Xshell 或 macOS/Linux 的 Terminal）登录，可以使用以下命令查看 Netwiz 专属日志：**

📁 **1、查看 Netwiz 专属日志 (/etc/netwiz.log)**

⚡ **实时监控：**
```bash
tail -f /etc/netwiz.log
```

**普通查看**
```bash
cat /etc/netwiz.log
```

```bash
grep "断电" /etc/netwiz.log
```

```bash
grep "失败" /etc/netwiz.log
```

🌐 2. 查看 OpenWrt 全局系统日志

**为了方便在系统层面预警，还会进入 OpenWrt 的全局系统日志。**

**只过滤查看 Netwiz 相关的系统日志：**
```bash
logread | grep Netwiz
```

⚡ **实时监控全局系统日志：**
```bash
logread -f
```

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

## 📸 界面预览
<img width="680" alt="Image" src="https://github.com/user-attachments/assets/40905f7e-fa8b-4bc6-8bc8-846f81b3673c" />
<img width="680" alt="Image" src="https://github.com/user-attachments/assets/7d056b14-9a88-4d0e-a0ea-2fae7a5f8233" />
<img width="680" alt="Image" src="https://github.com/user-attachments/assets/2254dffb-bd82-40e0-9d58-0c9f90d60512" />
<img width="680" alt="Image" src="https://github.com/user-attachments/assets/f2bd9091-2a1d-4b37-9104-3071dbf9d71a" />
<img width="680" alt="Image" src="https://github.com/user-attachments/assets/01bbdd3a-ab4c-493f-adbd-09a5087f2de4" />
<img width="680" alt="Image" src="https://github.com/user-attachments/assets/e02aefe9-51f8-4c15-8a93-932b48e4594d" />
<img width="680" alt="Image" src="https://github.com/user-attachments/assets/52e42b52-11e3-4c61-87e6-17a689451be7" />
<img width="680" alt="Image" src="https://github.com/user-attachments/assets/d55ff995-4e19-4fca-9059-60779777c4d9" />
<img width="680" alt="Image" src="https://github.com/user-attachments/assets/a1593cdb-1384-4b78-af35-107fa7ed4f60" />
<img width="680" alt="Image" src="https://github.com/user-attachments/assets/6b3b6aeb-8ed0-4612-a187-c7d8a40b0d67" />

---

## 📄 协议与鸣谢

本项目基于 GPL-3.0 license 开源。

特别感谢 **OpenWrt 开源社区**、**LuCI 框架** 以及 **ImmortalWrt 团队** 提供坚实的基础架构支撑。

---

## ☕ 赞助与支持

如果您觉得这个插件让您的网络配置体验变得更加优雅、省心，欢迎请作者喝杯咖啡，这将是我持续维护与更新的最大动力！❤️

<img src="https://github.com/huchd0/openwrt-x86-64-build/blob/master/.github/Donate.jpg" width="680" alt="Donate">

---

[返回顶部](#top)
