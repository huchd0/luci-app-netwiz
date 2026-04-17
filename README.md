# NetWiz (luci-app-netwiz) 🚀

开箱即用，「纯净 · 安全 · 零破坏」的网络配置向导。不改变原有 br-lan 物理绑定关系及高级自定义规则，化繁为简，聚焦三大高频接入场景，实现一键化配置与最小干预部署。

![OpenWrt](https://img.shields.io/badge/OpenWrt-23.05_|_25.x+-blue.svg) ![License](https://img.shields.io/badge/License-MIT-green.svg) ![Build](https://img.shields.io/badge/Build-Passing-brightgreen.svg)

## ✨ 核心特性

对于折腾物理机或软路由的进阶玩家来说，传统的网络向导往往会无脑重置整个网络配置文件，导致精心设置的网桥（Bridge）、VLAN 和物理网卡绑定瞬间崩溃。**NetWiz 专为解决此痛点而生。**

* 🛡️ **底层安全锁 (Safe-Write)**：精准覆盖 WAN/LAN 接口的协议层参数，**绝对不破坏**原有的 br-lan 物理网卡绑定关系及高级定制规则。
* 📦 **跨时代兼容**：完美兼容 OpenWrt 23.05 及更早系统 (.ipk) 与 OpenWrt 25.x 现代系统 (.apk)。
* 🎨 **次世代 UI 体验**：告别原生的枯燥表单，采用现代化的悬浮卡片设计，支持色彩流转与优雅的动画交互。
* ⚡ **极速场景切换**：化繁为简，提炼三大最高频网络接入场景，点击即走，免去繁杂的多余参数配置。
* 🧹 **零乱码架构**：彻底重构前端资源加载逻辑，抛弃容易引起语法冲突的符号，适配最新版 LuCI 引擎，告别 404 与缓存报错。

---

## 📸 界面预览


---

## 🚀 极速安装 (推荐)

我们提供了一键智能安装脚本。无论你是老系统还是新系统，只需在 SSH 终端中直接复制并执行以下单行命令，即可自动完成【判断系统 -> 下载 -> 安装 -> 清理缓存】的全流程：

```bash
wget -qO- https://raw.githubusercontent.com/huchd0/luci-app-netwiz/master/install.sh | sh
```

💡 提示：如果你的网络无法直接访问 GitHub Raw，可以在链接前加上镜像代理，例如：
```bash
wget -qO- https://ghproxy.net/https://raw.githubusercontent.com/huchd0/luci-app-netwiz/master/install.sh | sh
```

---

## 🛠️ 手动安装 (离线包)

如果你习惯手动操作，请前往 Releases 页面下载最新的安装包，并使用 WinSCP 将其上传至路由器的 /tmp/ 目录。

对于 OpenWrt 25.x 及最新快照版 (.apk 格式)上传至路由器的 /tmp/ 目录后，运行以命令 （注意：新版 25.x 的 .apk 系统由于签名限制，网页上传会报错失败99，请务必使用上述的命令行或一键脚本安装）：
```bash
apk add --allow-untrusted /tmp/luci-app-netwiz.apk
rm -f /tmp/luci-indexcache /tmp/luci-modulecache/* && /etc/init.d/rpcd restart
```

对于 OpenWrt 23.05 及更早系统 (.ipk 格式)，以下两种方式都可以：

1、使用 “系统 -> 软件包 -> 上传软件包” 安装 .ipk

2、上传至路由器的 /tmp/ 目录后，运行以命令：：
```bash
opkg install /tmp/luci-app-netwiz.ipk
rm -f /tmp/luci-indexcache /tmp/luci-modulecache/* && /etc/init.d/rpcd restart
```
---

## 📖 使用说明

安装完成后，刷新路由器后台网页（建议使用 Ctrl + F5 强制刷新或在无痕模式下打开），即可在左侧导航栏的最上方找到入口：
👉 系统 (System) -> 网络向导

### 支持的三大模式：
1. 🌐 动态 IP (DHCP)
   * 适用场景：光猫已经负责拨号，本路由器作为二级路由 / AP 接入。
   * 行为：自动配置 WAN 口为 DHCP 客户端，无需额外参数。

2. 🔌 宽带拨号 (PPPoE)
   * 适用场景：光猫为纯桥接模式，由本路由器直接进行拨号上网。
   * 行为：精准写入宽带账号与密码，安全重启拨号进程。

3. 🔀 旁路由模式 (Bypass)
   * 适用场景：局域网内已有主路由，本设备仅作为辅助网关（提供去广告、Clash 等网络服务）。
   * 行为：自动关闭本机 DHCP 服务，安全设置 LAN 口静态 IP、网关与 DNS，不改变现有局域网拓扑。

---

## 💡 常见问题 (FAQ)

Q：安装后点击菜单提示 HTTP 404 或 Object not found？

A：这是 OpenWrt 系统的前端缓存机制所致。请在 SSH 中执行彻底清理命令：
```bash
rm -f /tmp/luci-indexcache /tmp/luci-modulecache/* && /etc/init.d/rpcd restart
```
并在浏览器中使用无痕模式重新登录路由器即可。

Q：在旁路由模式切换 IP 后为什么打不开网页了？

A：如果您在“旁路由模式”中修改了本机的静态 IP，点击保存后路由器会自动应用新 IP。此时原有的网页地址已经失效，请在浏览器地址栏手动输入您新设置的 IP 地址进行访问。

---

## 📄 协议与鸣谢

本项目基于 MIT License 开源。

特别感谢 OpenWrt 开源社区、LuCI 框架以及 ImmortalWrt 团队。
