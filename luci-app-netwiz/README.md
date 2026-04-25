# NetWiz (luci-app-netwiz) 🚀

![OpenWrt](https://img.shields.io/badge/OpenWrt-23.05_|_25.x+-blue.svg) ![ImmortalWrt](https://img.shields.io/badge/ImmortalWrt-Supported-orange.svg) ![License](https://img.shields.io/badge/License-GPL--3.0-green.svg) ![Build](https://img.shields.io/badge/Build-Passing-brightgreen.svg)

---
### Description
`luci-app-netwiz` (Network Wizard) is a minimalist, safe, and non-destructive network configuration interface for OpenWrt/ImmortalWrt. 

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

### 💡 Execution Permissions Requirement (For GitHub Actions / Documentation)**

**Required Executable Permissions (chmod +x):**

To ensure the backend daemons and RPC interfaces function correctly, the following files must have executable permissions assigned before building the package:

```bash
chmod +x luci-app-netwiz/root/usr/libexec/rpcd/netwiz
chmod +x luci-app-netwiz/root/usr/libexec/netwiz-autodetect.sh
chmod +x luci-app-netwiz/root/usr/libexec/netwiz-monitor-loop.sh
chmod +x luci-app-netwiz/root/etc/init.d/netwiz-monitor
chmod +x luci-app-netwiz/root/etc/init.d/netwiz-recovery
```
---

```bash
luci-app-netwiz/
├── Makefile                                 # OpenWrt standard Makefile (package definition, dependencies)
├── LICENSE                                  # Open-source license (declares code usage rights)
├── Makefile                                 # OpenWrt/ImmortalWrt standard Makefile (package definition, dependencies)
├── htdocs/
│   └── luci-static/
│       └── resources/
│           └── view/
│               └── netwiz.js                # Frontend UI (Async radar, dynamic stopwatch, JS logic)
├── po/
│   ├── zh_Hans/
│   │   └── netwiz.po                        # Simplified Chinese translation dictionary
│   └── zh_Hant/
│       └── netwiz.po                        # Traditional Chinese translation dictionary
└── root/
    ├── etc/
    │   ├── init.d/
    │   │   ├── netwiz-monitor               # Background daemon service for the monitor loop
    │   │   └── netwiz-recovery              # Power-loss auto-recovery service (START=15)
    │   └── share/
    │       └── rpcd/
    │           └── acl.d/
    │               └── luci-app-netwiz.json # RPC Access Control List (CRITICAL for frontend permissions)
    └── usr/
        ├── libexec/
        │   ├── netwiz-autodetect.sh         # WAN protocol auto-detection engine (DHCP/PPPoE)
        │   ├── netwiz-monitor-loop.sh       # Core monitor daemon (Debounce, connection radar, rollback)
        │   └── rpcd/
        │       └── netwiz                   # Backend RPC interface (receives UI commands, writes configs)
        └── share/
            └── luci/
                └── menu.d/
                    └── luci-app-netwiz.json # System menu definition (places Netwiz under "System")
```
---

### 📊 Monitoring & Logging

The plugin features a flash-friendly, persistent logging system (`/etc/netwiz.log`) equipped with a strict 600-line auto-trimming safety valve. This ensures complete observability across reboots without risking router flash memory degradation.

You can monitor the system state and trace execution events via SSH:

**1. Watch the Netwiz Exclusive Safe-Log:**

```bash
# Real-time monitoring (tracks Monitor, Engine, RPC, and Recovery events)
tail -f /etc/netwiz.log
```
```bash
# View the full log history
cat /etc/netwiz.log
```

**2. Check System-Level Alerts:**
Filter OpenWrt global system logs for Netwiz emergency alerts (e.g., Power-loss recovery triggers)

```bash
logread | grep Netwiz
```

<img width="680" alt="Image" src="https://github.com/user-attachments/assets/cce37944-d90a-4653-923c-d957812d8f37" />
<img width="680" alt="Image" src="https://github.com/user-attachments/assets/f0bd7bf8-16b7-4955-9a83-55673a7bf66e" />
<img width="680" alt="Image" src="https://github.com/user-attachments/assets/ea664013-9f76-49e3-b10f-8307dbb6fc24" />
<img width="680" alt="Image" src="https://github.com/user-attachments/assets/5c0370fc-efd9-4e51-be3c-ed35233786d6" />
<img width="680" alt="Image" src="https://github.com/user-attachments/assets/bd4afb47-0dec-4606-91a3-da47e99ca6e0" />
<img width="680" alt="Image" src="https://github.com/user-attachments/assets/51c10c7b-85df-4f69-b456-ea7523696ae5" />
<img width="680" alt="Image" src="https://github.com/user-attachments/assets/8603b708-59c6-4a6d-b953-a83a26b00ef9" />

---
