# NetWiz (luci-app-netwiz) 🚀

**NetWiz**专属OpenWrt网络设置向导-极简，开箱即用，是一款逻辑严谨缜密，搭载企业级Lan口防失联机制，WAN口上网方式智能切换（间隔10秒接入WAN口启动），智能防错校验，智能WiFi满血释放（无硬件时自动隐藏）、一键开启IPV6、智能IP、网关、WAN口、Lan口冲突排雷，全方位的守护，NetWiz不仅提供直观的 UI，大小屏极致的丝滑体验，更深入系统内核，提供企业级的一键批量绑定静态IP策略组、网络管控体验——从终端流量透视、IP 智能分组，到一键防火墙控制与灾备级全自动配置管理。

**NetWiz(NetWiz Network Wizard)** — minimalist and ready out of the box. Built with rigorous, well-structured logic, it features an enterprise-grade LAN fail-safe mechanism, intelligent WAN mode switching (Auto-detect will be triggered only when the WAN cable is reinserted after a 10-second disconnection), smart validation and error prevention, and full-performance WiFi with automatic hiding when hardware is unavailable. It also enables one-click IPv6 activation, proactively resolves IP, gateway, WAN, and LAN conflicts, and delivers comprehensive protection with a seamless, intuitive experience across both large and small screens.

![Build](https://img.shields.io/badge/Build-Passing-brightgreen.svg) ![OpenWrt](https://img.shields.io/badge/OpenWrt-23.05_|_25.x+-blue.svg) ![ImmortalWrt](https://img.shields.io/badge/ImmortalWrt-Supported-orange.svg) ![Downloads](https://img.shields.io/github/downloads/huchd0/luci-app-netwiz/total.svg?logo=github) ![Views](https://komarev.com/ghpvc/?username=huchd0-luci-app-netwiz&label=Views&color=blue&style=flat) ![License](https://img.shields.io/badge/License-GPL--3.0-green.svg)

[English](#english) | [简体中文](#简体中文)

---

## English

### Description
**Netwiz(luci-app-netwiz)** is a minimalist, safe, and non-destructive network configuration interface for OpenWrt/ImmortalWrt. 

It is designed to be highly user-friendly for novices setting up secondary routers (DHCP/Static IP) or bypass routers.

### Installation Methods

**1**、  [Use the one-click command for quick installation.](#install)

```bash
wget -qO- https://raw.githubusercontent.com/huchd0/luci-app-netwiz/master/install.sh | sh
```

**2**、Go to the  [Releases](../../releases)  page to download the precompiled .apk or .ipk package, then upload and install it via the router’s web interface.

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

### 📶 Powerful Smart Wi-Fi Engine（Auto-hide when Wi-Fi is unavailable）
* **Infinite Chip Array Detection:** Breaks the rigid limits of traditional single/dual-chip plugins. Automatically scans and takes over all physical wireless adapters in the system. Perfectly adapts to single-band, dual-band, tri-band, or even multi-band routers, ensuring no hardware is left idle.
* **Ultimate Low-Level Override:** Designed for incomplete, conflicting, or misconfigured underlying settings (e.g., a single chip stuck in 5G mode). Features an exclusive "Will Override Rule" that ignores residual hardware history, forcibly cleansing and rewriting the correct physical protocols and channels to guarantee a 100% successful application.
* **Smart Bandwidth Unleashed:** Say goodbye to crippled networks! When applying configurations, it intelligently identifies hardware limits and silently maximizes channel width (e.g., boosting 2.4G to HT40 and 5G to VHT80). It safely preserves existing Wi-Fi 6 (HE) configurations, ensuring effortless gigabit speeds.
* **Seamless Two-Way Data Sync:** When switching between "Smart Connect" and "Separate Bands", Wi-Fi passwords and SSIDs are intelligently synced back and forth, eliminating repetitive typing. Features historical config memory—retrieve your old password instantly even after disabling and re-enabling Wi-Fi.

### Installation
* You can compile it directly via the OpenWrt SDK or download the pre-compiled `.apk` / `.ipk` from the [Releases](../../releases) page.
Core Supported Modules

### Breadcrumb Trail
* 👉 **A primary menu entry appearing right before “Logout -> Network Wizard**。
  
   (Placing the Network Setup Wizard immediately before “Logout” is a deliberate UI decision that benefits both beginners and users seeking quick configuration. It offers a highly visible, easily accessible entry point, eliminating the need to navigate complex OpenWrt menus. Moreover, this layout aligns with the polished, user-centric design conventions adopted by established router brands such as ASUS, TP-Link, and Xiaomi.)
  
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

📶 **Wi-Fi Settings（Auto-hide when Wi-Fi is unavailable）**
* **Use Case**: Initial wireless network setup, or modifying the SSID, password, and encryption protocols for your whole-home network.
* **Behavior**: Intelligently detects the number of underlying physical chips to dynamically render the UI. Supports one-click "Smart Connect (All Bands)" to build a seamless roaming network, or splits into independent 2.4G/5G networks. Perfectly backwards compatible with legacy 802.11b IoT devices.

---

## 简体中文

### 📖简介 | [English](#english)

**NetWiz(网络设置向导)** 是一款专为 OpenWrt / ImmortalWrt 设计的极简、安全且“零破坏”的网络配置界面。

它极其适合新手用户，能够一键安全地配置二级路由（动态/静态 IP）以及旁路由(AP有线中继)环境。对于刚装完系统的玩家，需要网络设置才能上网，但自带的设置隐藏比较深，且容易配置错误，无脑和暴力重置整个网络配置文件，**清空路由的已配置清单**，导致精心设置的网桥（Bridge）、VLAN 和物理网卡绑定**瞬间崩溃或引发莫名其妙**的问题。**NetWiz 专为解决此痛点而生。**

## 🤝 兼容性说明
* **固件支持：** OpenWrt 23.05 及以上版本、ImmortalWrt 23.05 及以上版本（支持 25.x+ 新分支，兼容 nftables 环境）。
* **架构支持：** 全架构通用 (x86_64, aarch64, ramips/mt7621 等)。
* **NetWiz实现了真正的‘零外部依赖’，无任何 C/C++/Go 编译件或第三方模块。凭借极其严谨的底层兜底机制，使其在不同分支和各类魔改固件中展现出了极致的兼容性。无论是老旧系统，还是 23.05 之后的新一代 fw4/DSA 架构，皆能完美适配，稳定运行。**

## ✨ 核心特性与优势

### 💻 现代化架构
* **极速加载不卡顿：** 采用最新响应式、弹性架构，告别的简陋与卡顿，完美适配电脑和手机屏幕，操作如丝般顺滑。
* **严格的权限隔离：** 界面操作与底层系统权限彻底分离。前端不具备直接修改底层配置的权限，所有变更均由受信任的沙箱代理安全执行。
* **原生多语言支持：** 根据您的系统环境，自动切换简体中文、繁体中文或英文界面。
* **兼容众多品牌硬件：** 智能适配多芯片频段硬件，最大化挖掘硬件性能，满血释放WiFi信号。

### 🛡️ 全方位的守护
* **安全回退机制：** 配置错误导致无法连接后台？不用怕！应用新配置后会启动 120 秒安全倒计时。LAN 口配置后若无真实的新 IP 访问连接，系统将自动恢复到修改前的配置 **（意外断电重启依然优雅恢复）**。
* **智能防错校验：** 严格并精准拦截诸如“比如各种冲突、信息填错”等各种高危操作，从源头防止路由死循环。
* **旁路由(AP有线中继)自动排雷：** 一键安全切换旁路由(AP有线中继)模式，系统会自动帮您关掉冲突的服务，智能指引配置，引导您正确填写信息，不破坏现有的家庭网络，新手轻松设置。
* **设备综合大盘：** 掌握所有在线/离线/静态设备的实时动态。
* **流量分析探针：** 悬停即可查看该设备的 P2P 与 Web 连接数分布。
* **全链路灾备：** 随时回滚或导入外部配置文件。

### ⚡ 极致的无感体验
* **WAN口上网方式智能切换：** WAN 口识别网线的物理插拔状态，系统智能适配，完美过滤由拨号失败、软件重启引起的“假性掉线” **（拔除网线间隔十秒再接入WAN 口，智能检测上网方式切换机制开启）**。
* **自动探活，秒级跳转：** 修改 IP 后，前端会静默探测新地址，网络一旦连通立刻瞬间跳转，体验丝滑流畅。
* **改设置不断网：** 在应用部分网络设置时，Wi-Fi 保持稳定不断开，不干扰其他设备的正常上网。
* **双向数据无缝同步：** 在“多频合一”与“分频独立”模式间切换时，Wi-Fi 密码与 SSID 智能双向传递，彻底告别重复输入的烦恼。自带历史配置记忆。
* **一键开启ipv6：** 一键智能下发ipv6地址，告别晦涩难懂的 DHCPv6、SLAAC 和中继设置。轻轻一点，系统即可为设备自动下发 IPv6 地址。
* **一键开启路由器间WiFi的无缝切换：** 一键开启无缝漫游，用户无需专业技术，仅需满足两项条件即可拥有多路由器间WiFi的自动“丝滑”跳转功能：WiFi名称、密码一致，设备处于同一局域网。 （注意：环境中请勿存在多个 DHCP 服务；若路由器摆放距离较近，建议错开信道，避免同频信号互相干扰。）
* **快速启用无线中继 (WISP)：** 输入上级 Wi-Fi 帐号密码接收信号，并广播您自己的专属 wifi 网络。


### 📶 强大的无线智控WiFi
* **自动适配所有硬件：** 自动接管系统内所有物理无线网卡，无论是单频、双频还是三频（甚至多频）路由器，均能完美适配。
* **修复隐藏故障：** 针对各种残缺、冲突或被带偏的底层配置，自动清理系统中遗留的错误 Wi-Fi 配置，纠正被卡死的网络状态，让无线的表现更稳定。
* **智能频宽满血释放：** 告别残血网络！在保存配置时，智能识别硬件极限，静默优化并提升 Wi-Fi 频宽，轻松跑满带宽。


### 快捷导航
👉 **在 LuCI 一级菜单的最后面（“退出”按钮的前一个）直接找到👉网络向导**。

---

### 🚀 核心支持的四大模块：

1. 🔌 **宽带拨号 (PPPoE)**
   * **适用场景**：光猫为纯桥接模式，由本路由器直接进行宽带拨号上网，承担全屋网络枢纽。
   * **行为**：精准写入宽带账号与密码，剥离多余网关遗留，安全重启底层拨号进程。

2. 📶 **Wi-Fi 设置（无硬件时自动隐藏）**
   * **适用场景**：首次配置无线网络，或需要修改全屋 Wi-Fi 名称、密码及加密安全协议。
   * **行为**：智能探测底层物理芯片数量并动态渲染界面。支持一键“多频合一”组建全屋智能漫游网，或拆分为独立的 2.4G/5G 网络；完美兼容旧版 802.11b 物联设备。
     
3. 🌐 **二级路由模式 (DHCP / 静态 IP)**
   * **适用场景**：光猫已经负责拨号，或者上级有主路由，本设备作为二级路由或子网段路由接入。
   * **行为**：可自由选择“动态获取”或“静态绑定”，自动接管 WAN 口配置，智能校验网段避免死循环。

4. 🏠 **局域网设置 (主路由 / 旁路由(AP有线中继)切换)**
   * **适用场景**：仅需修改设备内网管理 IP；或者网络内已有主路由，本设备仅作为辅助网关/旁路由(AP有线中继)。
   * **行为**：一键开启“旁路由(AP有线中继)模式”，系统将自动关闭本机 DHCP 服务，并要求必须填写主路由网关；若为主路由，则防呆提示网关留空，绝不破坏现有局域网拓扑。

---

## ✨ 设备管理专家核心特性

### ⚡ 终端雷达 & 内核级流量透视 (Connection Radar)
* **实时连接追踪**：深入解析网络连接状态的核心模块，实时捕获终端设备的底层网络连接。
* **智能流量分类**：自动将流量精准分类为 Web/HTTPS、DNS/NTP、UDP 媒体、P2P 高端口下载，并以**直观的动态圆饼图**展示。
* **异常终端预警**：自动识别跨网段设备与疑似伪装 MAC 设备。

### 🏷️ 智能 IP 分组与批量绑定固定IP (Smart IP Assignment)
* **全自动分类**：精准识别 Mobile（手机/平板）、PC（电脑/工作站）、IoT（智能家居）。
* **多策略批量下发**：支持选择多个设备，一键执行**顺序分配**、**按设备类型智能分配专属网段**，或分配至**自定义部门/房间**。
* **安全防冲突**：内置智能防冲突算法，IP 冲突时自动顺延，杜绝网络瘫痪。

### 🌐 纯血 IPv6 深度支持
* **无感解析**：自动过滤本地链路地址（fe80），精准提取公网 IPv6。
* **PC 存活保活机制**：独创的 `v6pc_` 活跃时间戳机制，防止 PC 设备的 IPv6 地址频繁变动导致失联。

### 🛡️ 一键防火墙与访问控制 (Firewall Control)
* **⛔ 断网 (Block)**：一键阻断设备访问外网，保留局域网通信，秒级生效。
* **🛡️ 局域网隔离 (Isolate)**：一键禁止设备访问内网其他设备（防旁路由嗅探、防智能家居隐私泄露）。
* **🚀 DMZ 主机**：一键将特定设备的全部端口暴露至公网（自动互斥校验，防止冲突）。
* **🔌 局域网唤醒 (WOL)**：深度集成，设备离线时自动显示唤醒按钮。

### 📦 灾备级配置管理 (Auto-Backup & Disaster Recovery)
* **无损自动备份**：当网络拓扑发生改变时（如修改 DHCP、防火墙），后台自动计算核心配置文件的 MD5，并在变动时自动生成 `.tar.gz` 备份存档。
* **一键导入/导出**：支持将当前所有的静态 IP、黑名单、隔离规则打包下载到电脑，或在刷机后一键从云端/本地恢复，恢复后自动唤醒所有高级代理与 DNS 插件。

---

<span id="install"></span>
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

## 💡 常见问题 (FAQ)

**Q：安装后点击菜单提示 `HTTP 404` 或 `Object not found (-32000)`？**
A：这是 OpenWrt 系统的权限通行证 (ACL) 和前端缓存机制未更新所致。请在 SSH 中执行彻底清理命令：
```bash
rm -f /tmp/luci-indexcache /tmp/luci-modulecache/* && /etc/init.d/rpcd restart
```
**做完后，请务必点击网页右上角“退出登录”，重新输入密码进入后台即可解决。**

**Q：在局域网设置里修改了 IP 后，为什么一直在转圈，打不开网页了？**
A：如果您修改了本机的局域网 IP，点击“确认应用”后底层网络会立刻重置。系统会在几秒后尝试为您自动跳转，如果由于浏览器安全策略未跳转成功，原有的旧 IP 网页将失效。请直接在浏览器地址栏手动输入您新设置的 IP 地址即可恢复访问。

**Q：切换上网方式后无法打开网页，打不开网页了？**
A：通常是因为操作系统的 DNS 缓存没清，请尝试断开电脑/手机的 Wi-Fi 重新连接，或在电脑执行：ipconfig /flushdns。

**Q：🆘 救援指南：进不去后台怎么办**

检查网络连接与手动指定 IP（如果电脑无法自动获取 IP 地址），导致浏览器打不开后台：
* 请确保网线插在路由器的 **LAN 口** 上。
* 将电脑网卡的 IP 获取方式改为“手动/静态 IP”。
* IP 地址设置为：`192.168.100.2`（与路由器同网段的其他地址）。
* 子网掩码设置为：`255.255.255.0`。
* 设置完成后，再次尝试访问路由器后台 `192.168.100.1`。

## Q：🆘 救援指南：构建固件时内置Netwiz，刷后进不去后台怎么办？

如果在刷入固件后遇到无法连接、向导界面异常或无法进入管理后台的情况，请不要紧张，按照以下步骤进行排查与救援：

### 1. 触发隐藏的紧急救援通道 (Netwiz 防卡死机)
如果您已经连接上路由器的网络，但遇到了前端白屏、向导无限循环或界面卡死的问题，可以利用系统内置的防劫持救援通道：
* 请在浏览器中直接输入并访问：`http://192.168.100.1/cgi-bin/luci/rescue`（请将 IP 替换为您的实际路由器默认 IP）。
* 此操作会触发底层的紧急释放指令，强制解除向导的网关劫持，并将您安全地送回官方原生的 LuCI 登录页面。

### 2. SSH 后台命令修复
如果您依然可以通过 SSH 连接路由器（默认端口 `22`），您可以通过命令行手动解除向导锁定并重启网络：
```bash
# 解除向导锁定并恢复原生 LuCI 入口
uci set netwiz.global.configured='1'
uci commit netwiz
[ -f /www/cgi-bin/luci.bak ] && mv -f /www/cgi-bin/luci.bak /www/cgi-bin/luci

# 重启网页服务器与网络服务
/etc/init.d/uhttpd restart
/etc/init.d/network restart
```
---

## 📸 界面预览
<img width="680" alt="Image" src="https://github.com/user-attachments/assets/40905f7e-fa8b-4bc6-8bc8-846f81b3673c" />
<img width="680" alt="Image" src="https://github.com/user-attachments/assets/6bb6a808-901a-4911-9769-a27ad5700508" />
<img width="680" alt="Image" src="https://github.com/user-attachments/assets/66a9e97b-c2d1-431f-8981-995f4358b4fa" />
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
