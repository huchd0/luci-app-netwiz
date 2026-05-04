/*
 * Copyright (C) 2026 huchd0 <https://github.com/huchd0/luci-app-netwiz>
 * Licensed under the GNU General Public License v3.0
 */
'use strict';
'require view';
'require dom';
'require rpc';
'require uci';

var T = {
    'Network_Wizard': _('Network Wizard'),
    'TITLE': _('Netwiz NETWORK SETUP'),
    'SUBTITLE': _('Pure · Secure · Non-destructive Minimalist Config'),
    'APP_VERSION': 'v1.4.0', 
    'MODE_ROUTER_TITLE': _('Secondary Router Mode'),
    'MODE_ROUTER_DESC': _('Upstream network dials up, this device acts as a secondary router.'),
    'MODE_PPPOE_TITLE': _('PPPoE Dial-up'),
    'MODE_PPPOE_DESC': _('Dial up directly using account and password on this device.'),
    'MODE_LAN_TITLE': _('LAN Settings'),
    'MODE_LAN_DESC': _('Change device LAN IP, or switch to AP Wired Relay mode.'),
    'MODE_WIFI_TITLE': _('Wi-Fi Settings'),
    'MODE_WIFI_DESC': _('Configure wireless network, SSID, and password.'),
    'TITLE_WIFI': _('Configure Wi-Fi'),
    'LBL_SMART_CONN': _('Smart Connect (All Bands)'),
    'LBL_WIFI_SWITCH': _('Enable Wi-Fi'),
    'LBL_WIFI_2G_EN': _('Enable 2.4G Wi-Fi'),
    'LBL_WIFI_5G_EN': _('Enable 5G Wi-Fi'),
    'LBL_SSID': _('Network Name (SSID)'),
    'LBL_WIFI_PASS': _('Wi-Fi Password'),
    'LBL_WIFI_ENC': _('Encryption'),
    'LBL_ADVANCED': _('Advanced Settings'),
    'LBL_ADVANCED_CLOSE': _('Hide Advanced'),
    'LBL_HIDE_SSID': _('Hide Wi-Fi Name (SSID)'),
    'LBL_CHANNEL': _('Channel'),
    'LBL_BANDWIDTH': _('Channel Width'),
    'LBL_MODE': _('Wireless Mode'),
    'OPT_AUTO': _('Auto'),
    'LBL_LEGACY_B': _('Enable 802.11b (Legacy Mode)'),
    'DESC_LEGACY_B': _('Only enable if very old IoT devices cannot connect.'),
    'OPT_NONE': _('No Password (Open)'),
    'OPT_PSK2': _('WPA2-PSK (Stable)'),
    'OPT_SAE': _('WPA3-SAE (Secure)'),
    'OPT_PSK2SAE': _('WPA2/WPA3 Mixed (Recommended)'),
    'TAB_2G': _('2.4G Wi-Fi'),
    'TAB_5G': _('5G Wi-Fi'),
    'M_INC_WIFI': _('SSID cannot be empty.'),
    'M_PWD_SHORT': _('Wi-Fi password must be at least 8 characters.'),
    'ACT_WIFI': _('Applying Wi-Fi Settings'),
    'M_MODE_WARN_TIT': _('⚠️ Severe Warning'),
    'M_MODE_WARN_MSG': _('Forcibly modifying the wireless physical mode may cause the hardware driver to crash or the Wi-Fi to disappear permanently if the chip does not support it! It is highly recommended to keep it on [Auto].<br><br>Are you absolutely sure you want to change this?'),
    'LOADING_CONFIG': _('Reading underlying config...'),
    'BTN_HOME': _('Back to Home'),
    'TITLE_WAN': _('Configure WAN'),
    'LBL_CONN_TYPE': _('Connection Type'),
    'OPT_DHCP': _('DHCP (Auto)'),
    'OPT_STATIC': _('Static IP'),
    'LBL_IP': _('Static IP'),
    'LBL_GW': _('Gateway'),
    'PH_IP': _('e.g., 192.168.1.2'),
    'PH_GW': _('e.g., 192.168.1.1'),
    'TITLE_PPPOE': _('PPPoE Credentials'),
    'LBL_USER': _('PPPoE Username'),
    'PH_USER': _('Enter PPPoE username'),
    'LBL_PASS': _('PPPoE Password'),
    'PH_PASS': _('Enter PPPoE password'),
    'TITLE_LAN': _('Configure LAN'),
    'LBL_IPV6': _('Enable IPv6 (DHCPv6)'),
    'LBL_FORCE_APPLY': _('Safe Mode (Recommended ON)'),
    'DESC_FORCE_APPLY': _('If enabled, the system will auto-revert if you lose connection within 120s.'),
    'MSG_SAFE_OFF': _('Safe mode disabled. Applying immediately without rollback protection...'),
    'LBL_BYPASS': _('Enable AP Wired Relay'),
    'WARN_BYPASS': _('<b style="font-size: 16px;">AP Wired Relay Enabled:</b><br>1. DHCP will be disabled. <b style="color: #059669;">Devices must use static IPs or get IPs from upstream.</b><br>2. If LAN IP changes, ensure your client is in the same subnet to avoid <b style="color: #059669;">losing access</b>.'),
    'WARN_MAIN': _('<b style="font-size: 16px;">Main Router Mode Enabled:</b><br>1. DHCP will be enabled. This device assigns IPs.<br>2. If LAN IP changes, ensure your client is in the same subnet to avoid <b style="color: #ef4444;">losing access</b>.'),
    'LBL_LAN_IP': _('Device LAN IP'),
    'LBL_LAN_GW': _('LAN Gateway'),
    'PH_LAN_GW': _('Blank for Main, required for AP Wired Relay'),
    'BTN_BACK': _('Back'),
    'BTN_NEXT': _('Next Step'),
    'BTN_EDIT': _('Back to Edit'),
    'TITLE_CONFIRM': _('Confirm Configuration'),
    'DESC_CONFIRM': _('The following settings will be applied, please verify:'),
    'NOTE_TITLE': _('Application Notes:'),
    'NOTE_1': _('After confirmation, the network will restart and apply new settings.'),
    'NOTE_2': _('The system will auto-refresh or redirect in 15 seconds.'),
    'BTN_APPLY': _('Apply Settings'),
    'STAT_BYPASS': _('AP Wired Relay'),
    'STAT_MAIN_PPPOE': _('Main Router (PPPoE)'),
    'STAT_SEC_DHCP': _('Secondary Router (DHCP)'),
    'STAT_SEC_STATIC': _('Secondary Router (Static IP)'),
    'STAT_LAN': _('LAN Mode'),
    'TXT_DEV_IP': _('Device IP:'),
    'TXT_UP_GW': _('Upstream GW:'),
    'TXT_PUB_IP': _('Public IP:'),
    'TXT_REM_GW': _('Remote GW:'),
    'TXT_LAN_IP': _('LAN IP:'),
    'TXT_STATUS': _('Status:'),
    'TXT_WAIT_REM': _('Waiting for remote response'),
    'TXT_WAN_IP': _('WAN IP:'),
    'TXT_GET_IP': _('Getting IP...'),
    'TXT_DHCP_SRV': _('DHCP Service:'),
    'TXT_ON': _('Enabled'),
    'TXT_OFF': _('Disabled'),
    'BDG_SUCC': _('Dial Success'),
    'BDG_DIAL': _('Dialing / Disconnected'),
    'BDG_GOT': _('IP Acquired'),
    'BDG_WAIT': _('Waiting for IP...'),
    'BDG_CONN': _('Interface Connected'),
    'BDG_UNPLUG': _('Cable Unplugged'),
    'TXT_GETTING': _('Getting...'),
    'TXT_NOT_GOT': _('Not acquired'),
    'TXT_NOT_SET': _('Not set'),
    'M_INC_TIT': _('Incomplete info'),
    'M_INC_IP': _('Device IP cannot be empty.'),
    'M_INC_WAN': _('Static IP and Gateway cannot be empty.'),
    'M_INC_PPPOE': _('PPPoE username and password cannot be empty.'),
    'M_FMT_TIT': _('Format Error'),
    'M_FMT_IP': _('The device IP is invalid, please check!'),
    'M_FMT_WAN': _('WAN IP is invalid, please check!'),
    'M_FMT_GW': _('Gateway IP is invalid, please check!'),
    'M_LOGIC_TIT': _('Logic Error'),
    'M_LOGIC_BYP': _('AP Wired Relay requires an upstream gateway IP.'),
    'M_SAME_GW': _('WAN Static IP MUST NOT be the same as the gateway!'),
    'M_SAME_BYP': _('The AP Wired Relay Device IP MUST NOT be the same as the Gateway!'),
    'M_NO_MOD_TIT': _('No Changes Needed'),
    'M_NO_MOD_MSG': _('Your settings match the current router config exactly.'),
    'M_EXIT': _('Exit to Home'),
    'M_CFLT_TIT': _('Conflict Blocked'),
    'M_CFLT_IP': _('The WAN IP cannot be the same as the current LAN IP ({ip})!'),
    'M_CFLT_SUB1': _('The WAN port cannot be in the same subnet as the LAN ({ip})!'),
    'M_CFLT_SUB2': _('This causes a routing loop.'),
    'M_CFLT_SUGGEST': _('Suggestion: Your upstream network uses the same IP subnet. Please go to [LAN Settings] first and change your Device LAN IP (e.g. to 192.168.10.1) to prevent network crash.'),
    'M_SUB_ERR_TIT': _('Subnet Error'),
    'M_SUB_ERR_WAN1': _('The WAN Static IP must be in the same subnet as the Gateway!'),
    'M_SUB_ERR_WAN2': _('e.g., if gateway is {gw}, the IP must be {ip}.x'),
    'M_SUB_ERR_BYP': _('The AP Wired Relay Device IP must be in the same subnet as the Gateway!'),
    'M_WARN_TIT': _('Config Warning'),
    'M_WARN_MSG': _('You selected [Main Router Mode] but filled in the [Gateway].<br><br><b>For a standard main router, the gateway must be blank.</b> Entering a gateway may cause the device to fail at distributing network, leading to a total outage!<br><br>Are you sure you want to do this?'),
    'M_WARN_BTN': _('Force Apply'),
    'M_SYS_ERR': _('System Exception'),
    'M_SYS_MSG': _('Cannot read underlying config for validation, please refresh.'),
    'M_APP_MSG': _('Writing request, please wait...'),
    'M_RST_TIT': _('Applying Configuration'),
    'M_CLOSE': _('Close'),
    'M_ACCT': _('Account'),
    'M_PWD': _('Password'),
    'M_IP_GW': _('IP & Gateway'),
    'M_AUTO_UP': _('Auto-assigned by upstream router'),
    'LBL_TARGET': _('Target:'),
    'ACT_LAN': _('Modifying LAN IP'),
    'ACT_BYPASS': _('Switching to AP Wired Relay'),
    'ACT_WAN_DHCP': _('Switching WAN to DHCP'),
    'ACT_WAN_STATIC': _('Switching WAN to Static IP'),
    'ACT_PPPOE': _('Applying PPPoE Dial-up'),
    'MSG_WRITING': _('Writing configuration to system, please do not close the page...'),
    'MSG_KNOCKING': _('Connecting to new IP... Config will auto-rollback upon timeout.'),
    'MSG_WAIT_NET': _('Waiting for network service to restart... Elapsed: {sec}s'),
    'MSG_WAIT_OLD': _('Waiting for router to safely restore... Elapsed: {sec}s'),
    'MSG_TIMER': _('Rollback countdown: <b style="color:#f59e0b;">{sec}</b> / {total} s'),
    'MSG_MANUAL_VISIT': _('If IP changed, please update PC IP. Auto-redirecting when connected...'),
    'MSG_ABANDONING': _('Waiting for router to abort changes and restore network...'),
    'TXT_WIFI_STATUS': _('Wi-Fi Status'),
    'TXT_5G_ACCT': _('5G Wi-Fi Account'),
    'TXT_2G_ACCT': _('2.4G Wi-Fi Account'),
    'TXT_NO_PASS': _('No Password'),
    // 中继功能词条
    'LBL_WISP_EN': _('Enable Wireless Relay (WISP)'),
    'DESC_WISP': _('Receive upstream Wi-Fi and broadcast your own network.'),
    'BTN_SCAN': '🔄 ' + _('Scan Nearby Wi-Fi'),
    'MODAL_WISP_TITLE': _('Select Upstream Network'),
    'WISP_PWD_PROMPT': _('Password for upstream:'),
    'TXT_WISP_ON': _('WISP Enabled'),
    // 扫描与错误提示词条
    'TXT_SCANNING': '⏳ ' + _('Scanning...'),
    'TXT_NO_NETWORKS': _('No networks found.'),
    'TXT_SCAN_FAILED': _('Scan failed. Driver might be busy.'),
    'LBL_ROAMING': _('802.11k/v/r Fast Roaming'),
    'DESC_ROAMING': _('Enable seamless roaming between routers with one click (Prerequisite: Same SSID, password, and LAN). Note: May cause connection issues with older smart home (IoT) devices.'),
    'TXT_TARGET_SSID': _('Target Wi-Fi'),
    'PH_WISP_PWD': _('Upstream Wi-Fi Password'),
    'TXT_ROAM_DIRTY': _('⚠️ Manual Configuration Warning'),
    'DESC_ROAM_DIRTY': _('Underlying parameter mismatch detected, which may cause roaming failures. Please toggle this switch off and on again, then save to apply the standard seamless roaming profile.'),
    'TXT_ROAMING': _('Roaming'),
    'TXT_ROAMING_ON': _('Roaming Enabled'),
    'TXT_CLICK_FIX': _('Click to Fix'),
    'TXT_CLICK_GOTO': _('Click to Settings'),
    'MSG_WAN_AUTODETECT': _('WAN Blind-Switch: Unplug the WAN cable for 10 seconds and reconnect to auto-detect and switch the connection type (takes about 2 mins).'),
    'TXT_NEW_MOD': _('New Config'),
    'TXT_MODIFIED': _('Modified'),
    'M_OPEN_WARN_TIT': _('Security Warning'),
    'M_OPEN_WARN_MSG': _('You are setting up an Open Wi-Fi network without a password. Anyone nearby will be able to connect and access your network.<br><br>Are you sure you want to continue?'),
// ===== 向导词条 =====
    'WIZ_TITLE': _('✨ Quick Setup Wizard'),
    'WIZ_WAN': _('Step 1: Internet Setup'),
    'WIZ_WIFI': _('Step 2: Wi-Fi Setup'),
    'WIZ_WIFI_DESC': _('Set your wireless network name and password.'),
    'WIZ_CONFIRM': _('Step 3: Confirm & Apply'),
    'WIZ_SKIP': _('Skip this time'),
    'WIZ_HIDE': _("Don't show this again"),
    'WIZ_REOPEN': _('✨ Reopen Wizard'),
    'WIZ_SKIP_WIFI': _('Skip Wi-Fi Setup (Keep current)'),
    'TXT_NOT_CONFIGURED': _('Not configured (Keep current)'),
    'TXT_UNSET': _('Not set'),
    'TXT_NO_PWD_OPEN': _('No Password (Open)'),
};

var callNetSetup = rpc.declare({ object: 'netwiz', method: 'set_network', params: ['mode', 'arg1', 'arg2', 'arg3', 'arg4', 'arg5', 'arg6'], expect: { result: 0 } });
var callNetDefuse = rpc.declare({ object: 'netwiz', method: 'confirm', expect: { result: 0 } });
// 调用系统底层 iwinfo 扫描 Wi-Fi
var callIwinfoScan = rpc.declare({ object: 'iwinfo', method: 'scan', params: ['device'], expect: { results: [] } });
var getWanStatus = rpc.declare({ object: 'network.interface', method: 'dump', expect: { '': {} } });
var callNetCheckWifi = rpc.declare({ object: 'netwiz', method: 'check_wifi', expect: { has_wifi: false } });
var callSystemBoard = rpc.declare({ object: 'system', method: 'board', expect: { '': {} } });

return view.extend({
    handleSaveApply: null,
    handleSave: null,
    handleReset: null,

    render: function () {
        if (!document.querySelector('meta[name="viewport"]')) {
            var meta = document.createElement('meta');
            meta.name = 'viewport';
            meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0';
            document.head.appendChild(meta);
        }

        var container = dom.create('div', { id: 'netwiz-container' });

        var htmlTemplate = [
            '<style>',
            '/* ====== Netwiz Elegant UI Styles ====== */',
            '/* --- 1. Base & Layout --- */',
            ' header { margin: -5px -5px 0; }',
            '#maincontent, .main-right { overflow-y: auto !important; overflow-x: hidden !important; }', 
            '#netwiz-container { display: block !important; width: 100% !important; min-height: 101vh !important; padding: 0 !important; margin: 0 auto !important; box-sizing: border-box !important; color: #64748b; font-size: 14px;}',
            '.nw-wrapper { display: flex !important; flex-direction: column !important; align-items: center !important; justify-content: flex-start !important; width: 100% !important; max-width: 900px !important; margin: 0 auto !important; padding-bottom: 10vh; font-family: -apple-system, BlinkMacSystemFont, sans-serif; box-sizing: border-box !important; }',
            '.nw-header { display: block !important; width: 100% !important; max-width: 750px !important; margin: 0 auto 30px auto !important; text-align: center; background-color: #5e72e4; padding: 15px; border-radius: 16px; position: relative; box-sizing: border-box; box-shadow: 0 10px 25px rgba(94, 114, 228, 0.15); z-index: 20; }',
            '.nw-step { width: 100% !important; max-width: 800px !important; text-align: center; animation: slideUp 0.4s ease-out; margin: 0 auto !important; }',
            '.nw-form-area, .nw-confirm-board { position: relative; max-width: 460px; margin: 0 auto; text-align: left; padding: 40px; border-radius: 16px; background-color: rgba(255, 255, 255, 0.88); box-shadow: 0 10px 30px rgba(0,0,0,0.06); box-sizing: border-box; display: block !important; }',

            '/* --- 2. Shared Flex Rows --- */',
            '.nw-setting-row, .nw-setting-row-alt, .nw-switch-row-padded, .nw-adv-setting-row, .nw-roam-row, .nw-roam-row-alt, .nw-split-header-row, .nw-legacy-row, .nw-wisp-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px; }',
            '.nw-setting-row { padding: 15px 0; border-bottom: 1px solid #f1f5f9; }',
            '.nw-setting-row-alt { padding: 0 0 15px 0; border-bottom: 1px solid #f1f5f9; }',
            '.nw-switch-row-padded { padding: 10px 0 15px 0; border-bottom: 1px dashed #e2e8f0; }',
            '.nw-adv-setting-row { padding: 5px 0 15px 0; border-bottom: 1px dashed #cbd5e1; animation: fadeIn 1s ease; }',
            '.nw-roam-row { padding: 5px 0 15px 0; border-bottom: 1px dashed #cbd5e1; }',
            '.nw-roam-row-alt { padding: 15px 0 5px 0; border-top: 1px dashed #cbd5e1; margin-top: 10px; margin-bottom: 0; }',
            '.nw-split-header-row { }',
            '.nw-legacy-row { padding: 15px 0 0 0; border-top: 1px solid #f1f5f9; margin-top: 15px; }',
            '.nw-wisp-header { margin: 10px; 0 5px 0 }',

            '/* --- 3. Header & Typography --- */',
            '.nw-main-title { font-size: 35px; font-weight: 600; margin-bottom: 10px; color: #ffffff; letter-spacing: 2px; }',
            '.nw-header p { color: #ffffff; font-size: 16px; opacity: 0.9; margin: 10px; letter-spacing: 1px; }',
            '.nw-title-wrap { position: relative; display: inline-block; cursor: pointer; }',
            '.nw-version-tag { position: absolute; top: 15px; left: 100%; margin-left: 1px; background: rgba(255, 255, 255, 0.15); color: #fff; font-size: 13px; font-weight: bold; padding: 3px 10px; border-radius: 8px; font-family: monospace; z-index: 50; border: 1px solid rgba(255, 255, 255, 0.3); white-space: nowrap; box-shadow: 0 4px 12px rgba(0,0,0,0.08); opacity: 0; pointer-events: none; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); transform: translateY(0px); }',
            '.nw-title-wrap:hover .nw-version-tag { opacity: 1; top: -7px; transform: translateY(-5px); }',
            '.nw-version-dot { position: absolute; top: -3px; right: -3px; width: 8px; height: 8px; background-color: #ef4444; border-radius: 50%; box-shadow: 0 0 0 2px rgba(15, 23, 42, 0.9); display: block; }',
            '.nw-step-title { text-align: center; margin-bottom: 30px; color: #111; font-weight: 600; font-size: 20px; }',
            '.nw-setting-row-label, .nw-wisp-title { font-weight: 600; font-size: 16px; }',
            '.nw-setting-row-label { color: #222; }',
            '.nw-wisp-title { color: #059669; }',
            '.nw-desc-title { font-weight: 600; color: #222; font-size: 15px; word-break: break-word; line-height: 1.3; }',

            '/* --- 4. Cards & Badges --- */',
            '.nw-card-group { display: flex; gap: 25px; justify-content: center; flex-wrap: wrap; margin-top: 20px; width: 100%; box-sizing: border-box; }',
            '.nw-card { flex: 1; min-width: 170px; max-width: 220px; padding: 35px 20px; border-radius: 16px; cursor: pointer; backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.5); box-shadow: 0px 0px 15px 2px #b7b7b7; transition: all 0.25s ease; display: flex; flex-direction: column; align-items: center; box-sizing: border-box; }',
            '.nw-card:hover { transform: translateY(-5px); }',
            '.nw-card[data-mode="pppoe"] { background: rgba(79, 150, 101, 0.85); }',
            '.nw-card[data-mode="wifi"] { background: rgba(245, 54, 92, 0.85); }', 
            '.nw-card[data-mode="router"] { background: rgba(80, 0, 183, 0.85); }',
            '.nw-card[data-mode="lan"] { background: rgba(245, 158, 11, 0.85); }',
            '.nw-card-title { font-size: 19px; margin: 0 0 10px 0; color: #ffffff; font-weight: 600; line-height: 1.2; }',
            '.nw-card span { font-size: 14.5px; color: #ffffff; line-height: 1.5; opacity: 0.9; }',
            '.nw-badge { width: 54px; height: 54px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; }',
            '.nw-badge svg { width: 26px; height: 26px; }',
            '.nw-badge-pppoe { background: #fef3c7; color: #059669; }',
            '.nw-badge-wifi { background: #f3e8ff; color: #0284c7; }', 
            '.nw-badge-dhcp { background: #e0f2fe; color: #9333ea; }',
            '.nw-badge-bypass { background: #d1fae5; color: #d97706; }',

            '/* --- 5. Forms & Inputs --- */',
            '.nw-value { border: none !important; padding-bottom: 12px !important; display: flex !important; flex-direction: column !important; width: 100% !important; margin: 0 !important; background: transparent !important; }',
            '.nw-value-title { text-align: left !important; font-weight: 600 !important; color: #334155 !important; font-size: 14.5px !important; margin: 10px 0 10px 4px !important; line-height: 1.2 !important; display: block !important; padding: 0 !important; width: auto !important; float: none !important; }',
            '.nw-value-field { width: 100% !important; margin: 0 !important; padding: 0 !important; display: block !important; float: none !important; }',
            '.nw-form-area input[type="text"], .nw-form-area input[type="password"], .nw-form-area select, .nw-form-area textarea, .nw-wiz-modal-box input[type="text"], .nw-wiz-modal-box textarea { appearance: none !important; width: 100% !important; box-sizing: border-box !important; padding: 14px 16px !important; border: 1px solid #cbd5e1 !important; border-radius: 8px !important; font-size: 15px !important; outline: none !important; background: #f8fafc !important; color: #0f172a !important; height: auto !important; min-height: 48px !important; line-height: 1.5 !important; box-shadow: inset 0 1px 2px rgba(0,0,0,0.02) !important; margin: 0 !important; transition: all 0.2s ease !important; display: block !important; font-family: inherit; resize: none; word-break: break-all; }',
            '.nw-form-area input::placeholder, .nw-form-area textarea::placeholder, .nw-wiz-modal-box input::placeholder, .nw-wiz-modal-box textarea::placeholder { color: #94a3b8 !important; opacity: 1 !important; }',
            '.nw-form-area input:focus, .nw-form-area select:focus, .nw-form-area textarea:focus, .nw-wiz-modal-box input:focus, .nw-wiz-modal-box textarea:focus { border-color: #3b82f6 !important; background: #ffffff !important; box-shadow: 0 0 0 3px rgba(59,130,246,0.15) !important; }',

            '/* --- 自定义复选框 --- */',
            '.nw-wiz-cb-wrap { display: inline-flex; align-items: center; cursor: pointer; user-select: none; }',
            '.nw-wiz-cb-wrap input { position: absolute; opacity: 0; cursor: pointer; height: 0; width: 0; }',
            '.nw-wiz-checkmark { height: 18px; width: 18px; background-color: #fff; border: 2px solid #cbd5e1; border-radius: 4px; margin-right: 10px; position: relative; transition: all 0.2s ease; display: inline-block; flex-shrink: 0; vertical-align: middle; }',
            '.nw-wiz-cb-wrap:hover input ~ .nw-wiz-checkmark { border-color: #3b82f6; }',
            '.nw-wiz-cb-wrap input:checked ~ .nw-wiz-checkmark { background-color: #3b82f6; border-color: #3b82f6; }',
            '.nw-wiz-checkmark:after { content: ""; position: absolute; display: none; left: 4px; top: 0px; width: 5px; height: 10px; border: solid white; border-width: 0 2px 2px 0; transform: rotate(45deg); }',
            '.nw-wiz-cb-wrap input:checked ~ .nw-wiz-checkmark:after { display: block; }',

            '/* --- 6. Custom Controls (Radio & Switch) --- */',
            '.nw-radio-group { display: flex; gap: 15px; align-items: stretch; margin: 0; padding: 0; width: 100%; }',
            '.nw-radio-btn { cursor: pointer; position: relative; display: block; flex: 1; margin: 0 !important; padding: 0 !important; }',
            '.nw-radio-btn input[type="radio"] { position: absolute; opacity: 0; width: 0; height: 0; margin: 0; }',
            '.nw-radio-btn-text { display: flex; align-items: center; justify-content: center; height: 100%; padding: 12px 8px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14.5px; color: #475569; background: #fff; transition: all 0.25s ease; position: relative; overflow: hidden; font-weight: normal; box-sizing: border-box; line-height: 1.3; text-align: center; }',
            '.nw-radio-btn:hover .nw-radio-btn-text { border-color: #3b82f6; color: #3b82f6; background: #f8fafc; }',
            '.nw-radio-btn input[type="radio"]:checked + .nw-radio-btn-text { border-color: #3b82f6; color: #ef4444; font-weight: 600; box-shadow: 0 0 0 1px #3b82f6; background: #eff6ff; }',
            '.nw-radio-btn-text::after { content: ""; position: absolute; right: 0; bottom: 0; width: 0; height: 0; border-bottom: 24px solid #3b82f6; border-left: 24px solid transparent; opacity: 0; transition: opacity 0.2s ease; }',
            '.nw-radio-btn-text::before { content: ""; position: absolute; right: 5px; bottom: 5px; width: 4px; height: 9px; border: solid white; border-width: 0 2px 2px 0; transform: rotate(45deg); opacity: 0; transition: opacity 0.2s ease; z-index: 2; }',
            '.nw-radio-btn input[type="radio"]:checked + .nw-radio-btn-text::after, .nw-radio-btn input[type="radio"]:checked + .nw-radio-btn-text::before { opacity: 1; }',
            '.nw-switch { position: relative; display: inline-block; width: 46px; height: 24px; margin: 0; }',
            '.nw-switch input { opacity: 0; width: 0; height: 0; }',
            '.nw-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #cbd5e1; transition: background-color 0.3s ease; border-radius: 24px; -webkit-tap-highlight-color: transparent; -webkit-transform: translateZ(0); transform: translateZ(0); }',
            '.nw-slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1); border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.2); -webkit-transform: translate3d(0,0,0); transform: translate3d(0,0,0); }',
            'input:checked + .nw-slider { background-color: #10b981; }',
            'input.is-dirty:checked + .nw-slider { background-color: #ea580c; }',
            'input:checked + .nw-slider:before { -webkit-transform: translate3d(22px, 0, 0); transform: translate3d(22px, 0, 0); }',

            '/* --- 7. Unified Button UI Kit --- */',
            '/* 主面板底部 */',
            '.nw-actions { margin-top: 35px; display: flex; justify-content: center; gap: 20px; width: 100%; box-sizing: border-box; }',
            '/* 弹窗/向导底部 */',
            '.nw-modal-btn-wrap { display: flex; justify-content: center; gap: 15px; width: 100%; margin-top: 25px; box-sizing: border-box; }',
            '/* 基础按钮 */',
            '.nw-u-btn { appearance: none !important; border-radius: 8px !important; padding: 12px 30px !important; font-weight: 600 !important; font-size: 15px !important; cursor: pointer !important; border: none !important; outline: none !important; height: auto !important; line-height: normal !important; margin: 0 !important; transition: all 0.25s ease !important; display: inline-flex; align-items: center; justify-content: center; box-sizing: border-box; min-width: 130px; letter-spacing: 1px; }',
            '/* 向导内的按钮 */',
            '.nw-modal-btn-wrap .nw-u-btn { flex: 1; }',
            
            '/* 颜色定义区 */',
            '.nw-u-btn-green { background: #10b981 !important; color: white !important; }',
            '.nw-u-btn-green:hover { background: #059669 !important; transform: translateY(-2px) !important; box-shadow: 0 6px 15px rgba(16, 185, 129, 0.35) !important; }',
            '.nw-u-btn-blue { background: #3b82f6 !important; color: white !important; }',
            '.nw-u-btn-blue:hover { background: #2563eb !important; transform: translateY(-2px) !important; box-shadow: 0 6px 15px rgba(59, 130, 246, 0.35) !important; }',
            '.nw-u-btn-red { background: #ef4444 !important; color: white !important; }',
            '.nw-u-btn-red:hover { background: #dc2626 !important; transform: translateY(-2px) !important; box-shadow: 0 6px 15px rgba(239, 68, 68, 0.35) !important; }',
            '.nw-u-btn-gray { background: #f1f5f9 !important; color: #475569 !important; }',
            '.nw-u-btn-gray:hover { background: #e2e8f0 !important; transform: translateY(-2px) !important; box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1) !important; }',

            '/* 特殊悬浮按钮和文字按钮 */',
            '.nw-top-back { position: absolute; top: 20px; left: 20px; width: 36px; height: 36px; border-radius: 50%; background: #f1f5f9; color: #64748b; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s ease; z-index: 10; }',
            '.nw-top-back:hover { background: #e2e8f0; color: #0f172a; transform: translateX(-3px); box-shadow: 2px 2px 8px rgba(0,0,0,0.05); }',
            '.nw-top-back svg { width: 20px; height: 20px; }',
            '.nw-adv-btn { text-align: center; margin: 15px; cursor: pointer; color: #64748b; font-size: 14px; font-weight: bold; user-select: none; transition: color 0.25s ease; }',
            '.nw-adv-btn:hover { color: #3b82f6; }',

            '/* --- 8. Modals & Overlays --- */',
            '#nw-global-modal, .nw-wisp-modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.65); z-index: 2000000; display: flex; align-items: center; justify-content: center; }',
            '#nw-wizard-modal { backdrop-filter: blur(8px); z-index: 1000000; }',
            '#nw-global-modal .nw-modal-box, .nw-wisp-modal-box, .nw-wiz-modal-box { background: #fff; width: 90%; border-radius: 16px; overflow: hidden; display: flex; flex-direction: column; }',
            '#nw-global-modal .nw-modal-box { padding: 40px; text-align: center; max-width: 420px; }',
            '.nw-wisp-modal-box { max-width: 400px; max-height: 80vh; }',
            '.nw-wiz-modal-box { max-width: 480px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4); animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }',
            '#nw-global-modal h3 { font-size: 22px; color: #fff ;background: rgba(0, 0, 0, 0.65); border-radius: 10px; margin-bottom: 15px; border:none; }',
            '#nw-global-modal p, #nw-global-msg div { font-size: 15px; color: #475569; line-height: 1.6; margin: 0; word-break: break-all; }',
            '.nw-modal-btn-wrap { display: flex; gap: 15px; width: 100%; margin-top: 25px; }',
            '.nw-modal-btn-ok, .nw-modal-btn-cancel, .nw-modal-btn-danger { border: none !important; padding: 12px 30px !important; border-radius: 8px !important; font-size: 15px !important; cursor: pointer !important; flex: 1 !important; transition: all 0.25s ease !important; height: auto !important; margin: 0 !important; }',
            '.nw-modal-btn-ok { background: #3b82f6 !important; color: white !important; }',
            '.nw-modal-btn-ok:hover { background: #2563eb !important; transform: translateY(-2px) !important; box-shadow: 0 6px 15px rgba(59, 130, 246, 0.35) !important; }',
            '.nw-modal-btn-danger { background: #ef4444 !important; color: white !important; }',
            '.nw-modal-btn-danger:hover { background: #ef4444 !important; transform: translateY(-2px) !important; box-shadow: 0 6px 15px rgba(239, 68, 68, 0.35) !important; }',
            '.nw-modal-btn-cancel { background: #f1f5f9 !important; color: #475569 !important; }',
            '.nw-modal-btn-cancel:hover { background: #e2e8f0 !important; transform: translateY(-2px) !important; box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1) !important; }',

            '/* --- 9. Alerts, Notes & Specific Panels --- */',
            '.nw-roam-title { font-weight: 600; color: #0f172a; font-size: 16px; margin-bottom: 4px; }',
            '.nw-roam-desc { font-size: 14.5px; color: #64748b; line-height: 1.5; word-break: break-word; }',
            '.nw-roam-warn { font-size: 14px; color: #ef4444; margin-top: 6px; font-weight: 600; background: #fef2f2; padding: 6px 10px; border-radius: 6px; border: 1px solid #fecaca; line-height: 1.4; }',
            '.nw-warn-bypass, .nw-warn-main { padding: 12px; border-radius: 8px; font-size: 14px; margin-bottom: 15px; border: 1px solid; line-height: 1.7; font-weight: bolder; }',
            '.nw-warn-bypass { background: #fef2f2; color: #ef4444; border-color: #fecaca; }',
            '.nw-warn-main { background: #f0fdf4; color: #059669; border-color: #bbf7d0; }',
            '.nw-adv-panel { background: rgba(241, 245, 249, 0.5); border-radius: 12px; padding: 20px; margin-top: 15px; border: 1px solid #e2e8f0; box-shadow: inset 0 2px 5px rgba(0,0,0,0.02); }',
            '.nw-note-box { background-color: #f8fafc; padding: 15px; font-size: 13.5px; margin-top: 20px; border: 1px solid #e2e8f0; line-height: 1.7; color: #475569; border-radius: 12px; }',
            '.nw-note-title { font-weight: bold; color: #0f172a; margin-bottom: 8px; font-size: 14.5px; }',
            '.nw-confirm-mode-text { color: #fff; background: #0055bb; padding: 20px; border-radius: 12px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.1); margin-top: 15px; }',
            '.nw-current-mode-display { margin-top: 35px; background: #5e72e4; padding: 20px 35px; border-radius: 12px; display: inline-block; box-shadow: 0 8px 20px rgba(94, 114, 228, 0.3); text-align: center; min-width: 320px; }',
            /* ===== 向导头部响应式排版 (PC端默认布局) ===== */
            '.nw-wiz-header-responsive { display: flex; justify-content: space-between; align-items: center; padding: 15px 10px; }',
            '.nw-wiz-step-wrap { flex: 1; display: flex; justify-content: flex-start; order: 1; }',
            '.nw-wiz-title-responsive { flex: 2; margin: 0; padding: 0; text-align: center; font-size: 18px; letter-spacing: 0.5px; white-space: nowrap; color: #fff; order: 2; }',
            '.nw-wiz-close-wrap { flex: 1; display: flex; justify-content: flex-end; order: 3; }',
            '.nw-wisp-modal-title, .nw-wiz-modal-title { margin: 0 20px; font-size: 16px; color: #eee; background: #0f172a; text-align: center; border-radius: 12px; }',
            '.nw-wiz-modal-title { background: transparent; font-size: 19px; font-weight: 600; margin: 0; padding: 0; letter-spacing: 0.5px; }',
            '.nw-wisp-ui-panel { flex-direction: column; align-items: center; background: #f8fafc; padding: 10px; border-radius: 8px; border: 1px solid #e2e8f0; }',
            '.nw-wisp-target-input { background: #e2e8f0 !important; color: #475569 !important; }',
            '.nw-wifi-tabs { display: flex; gap: 10px; margin-bottom: 15px; }',
            '.nw-tab-btn { flex: 1; padding: 10px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; transition: all 0.2s; }',

            '/* --- 10. Utilities & Animations --- */',
            '.nw-hl { color: #facc15; font-weight: bold; margin-left: 6px; }',
            '.nw-flex-1 { flex: 1; padding-right: 15px; min-width: 0; }',
            '.nw-flex-shrink-0 { flex-shrink: 0; }',
            '.nw-scale-switch { transform: scale(0.9); transform-origin: left; }',
            '.nw-m0 { margin: 0 !important; }',
            '.nw-pointer { cursor: pointer; }',
            '.nw-spinner { width: 50px; height: 50px; border: 4px solid #f1f5f9; border-top: 4px solid #3b82f6; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 25px; }',
            '@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }',
            '@keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }',
            '@keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); } 70% { box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); } 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); } }',
            '#btn-reopen-wizard:hover { background: rgba(255,255,255,0.25) !important; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }',

            '/* --- 11. Mobile Adaption --- */',
            '@media screen and (max-width: 768px) {',
            '  .nw-wrapper { padding-top: 3vh; padding-bottom: 5vh; }',
            '  .nw-header { margin: -10px auto 15px !important; padding: 20px 15px !important; width: 100% !important; max-width: 320px !important; box-sizing: border-box !important; border-radius: 12px; }',
            '  .nw-main-title { font-size: 22px; line-height: 1.3; }',
            '  .nw-header p { font-size: 14px; }',
            '  .nw-card-group { flex-direction: column; align-items: center; gap: 15px; margin-top: 0; }',
            '  .nw-card { width: 100% !important; max-width: 320px !important; padding: 25px 20px !important; text-align: center; box-sizing: border-box !important; margin: 0 auto !important; }',
            '  .nw-badge { margin-bottom: 15px; width: 48px; height: 48px; }',
            '  .nw-form-area, .nw-confirm-board { width: 100% !important; max-width: 320px !important; margin: 0 auto !important; padding: 25px 20px !important; box-sizing: border-box !important; }',
            '  .nw-top-back { top: 12px; left: 12px; width: 32px; height: 32px; }',
            '  .nw-step-title { font-size: 18px; margin-top: 15px; margin-bottom: 20px; }',
            '  .nw-current-mode-display { width: 100% !important; max-width: 320px !important; min-width: 0 !important; margin: 20px auto 0 !important; padding: 15px !important; box-sizing: border-box !important; display: block !important; }',
            '  .nw-actions { width: 100% !important; max-width: 320px !important; margin: 20px auto 0 !important; display: flex !important; flex-direction: row !important; gap: 12px !important; box-sizing: border-box !important; }',
            '  .nw-actions button { flex: 1 !important; padding: 12px 0 !important; font-size: 15px !important; margin: 0 !important; min-width: 0 !important; box-sizing: border-box !important; }',
            '  #nw-global-modal .nw-modal-box { padding: 25px 20px; width: 85%; box-sizing: border-box !important; }',
            '  .nw-wiz-modal-box { width: 95%; max-height: 90vh; }',
            '  .nw-modal-btn-wrap { flex-direction: row; gap: 12px; }',
            '  .nw-modal-btn-wrap button { flex: 1; padding: 12px 0 !important; margin: 0 !important; }',
            '  .nw-radio-group { flex-wrap: wrap; gap: 12px; }',
            '  .nw-form-area input::placeholder, .nw-form-area textarea::placeholder, .nw-wiz-modal-box input::placeholder { font-size: 13px; }',
            '  .nw-version-tag {display: none; }',
            /* ===== 手机端 Header 自动换行及重新排序 ===== */
            '  .nw-wiz-header-responsive { flex-wrap: wrap; padding: 12px 15px !important; }',
            '  .nw-wiz-title-responsive { flex: 1; text-align: center; font-size: 17px; order: 1; }',
            '  .nw-wiz-close-wrap { flex: 0 0 auto; order: 2; }',
            '  .nw-wiz-step-wrap { flex: 0 0 100%; justify-content: center; margin-top: 5px; order: 3; }',
            '}',
            '</style>',
            
            '  <div class="nw-header">',
            '    <div class="nw-title-wrap">',
            '      <div class="nw-main-title">{{TITLE}}</div>',
            '      <div class="nw-version-tag">{{APP_VERSION}} <div class="nw-version-dot" style="display: none;"></div></div>',
            '    </div>',
            '    <p>{{SUBTITLE}}</p>',
            '    <div id="btn-reopen-wizard" style="margin-top: 10px; display: inline-flex; align-items: center; justify-content: center; gap: 5px; cursor: pointer; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.2); padding: 6px 18px; border-radius: 20px; font-size: 13.5px; font-weight: 500; color: #fff; transition: all 0.25s ease;">{{WIZ_REOPEN}}</div>',
            '  </div>',
            '  <div id="nw-global-modal" style="display:none;">',
            '    <div class="nw-modal-box">',
            '      <div id="nw-global-spinner" class="nw-spinner" style="display:none;"></div>',
            '      <h3 id="nw-global-title"></h3>',
            '      <p id="nw-global-msg"></p>',
            '      <div id="nw-global-btn-wrap" class="nw-modal-btn-wrap" style="display:none;">',
            '        <button id="nw-global-btn-cancel" class="nw-u-btn nw-u-btn-gray" style="display:none;"></button>',
            '        <button id="nw-global-btn-ok" class="nw-u-btn nw-u-btn-blue" style="display:none;"></button>',
            '      </div>',
            '    </div>',
            '  </div>',
            // WISP 扫描结果
            '  <div id="wisp-scan-modal" class="nw-wisp-modal" style="display:none;">',
            '    <div class="nw-wisp-modal-box">',
            '      <div style="display:flex; justify-content:space-between; align-items:center; padding:15px 20px; background:#5e72e4;">',
            '         <div style="flex:1;"></div>',
            '         <h3 style="flex:2; margin:0; padding:0; text-align:center; font-size:16px; font-weight:600; color:#fff; background:transparent;">{{MODAL_WISP_TITLE}}</h3>',
            '         <!-- 关闭按钮 -->',
            '         <div style="flex:1; display:flex; justify-content:flex-end;">',
            '            <span id="wisp-modal-close" class="nw-pointer" style="font-size:40px; cursor:pointer; color:#fff; line-height:1;">&times;</span>',
            '         </div>',
            '      </div>',
            '      <div style="padding:0; overflow-y:auto; flex:1;">',
            '         <ul id="wisp-scan-list" style="list-style:none; padding:0; margin:0;"></ul>',
            '      </div>',
            '    </div>',
            '  </div>',
            
            // ===== 快速向导悬浮层 =====
            '  <div id="nw-wizard-modal" class="nw-wisp-modal" style="display:none;">',
            '    <div class="nw-wiz-modal-box">',
            '      <div class="nw-wiz-modal-header nw-wiz-header-responsive" style="background:#5e72e4;">',
            '         <!-- 1 ➔ 2 ➔ 3 指示器 -->',
            '         <div class="nw-wiz-step-wrap">',
            '            <div id="wiz-step-indicator" style="display: flex; align-items: center; gap: 2px;">',
            '               <div class="nw-step-dot" style="width:22px; height:22px; border-radius:50%; font-size:12px; font-weight:bold; display:flex; align-items:center; justify-content:center; transition:all 0.3s; box-sizing:border-box;">1</div>',
            '               <div class="nw-step-line" style="display:flex; align-items:center; justify-content:center; margin:0 2px; transition:all 0.3s;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:16px; height:16px; display:block; background: transparent !important;"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></div>',
            '               <div class="nw-step-dot" style="width:22px; height:22px; border-radius:50%; font-size:12px; font-weight:bold; display:flex; align-items:center; justify-content:center; transition:all 0.3s; box-sizing:border-box;">2</div>',
            '               <div class="nw-step-line" style="display:flex; align-items:center; justify-content:center; margin:0 2px; transition:all 0.3s;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:16px; height:16px; display:block; background: transparent !important;"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></div>',
            '               <div class="nw-step-dot" style="width:22px; height:22px; border-radius:50%; font-size:12px; font-weight:bold; display:flex; align-items:center; justify-content:center; transition:all 0.3s; box-sizing:border-box;">3</div>',
            '            </div>',
            '         </div>',
            '         <!-- 大标题 -->',
            '         <h3 class="nw-wiz-modal-title nw-wiz-title-responsive">{{WIZ_TITLE}}</h3>',
            '         <!-- 关闭按钮 -->',
            '         <div class="nw-wiz-close-wrap">',
            '            <span id="wiz-modal-close" class="nw-pointer" style="color: #fff; font-size: 40px; opacity: 0.8; line-height: 1;">&times;</span>',
            '         </div>',
            '      </div>',
            '      <div style="padding: 30px 25px 15px; overflow-y: auto;">',
            '         <!-- Step 1: WAN -->',
            '         <div id="wiz-step-1-area">',
            '            <div class="nw-step-title" style="margin-bottom: 20px; font-size: 19px;">{{WIZ_WAN}}</div>',
            '            <div style="width: 100%; margin-bottom: 15px;">',
            '              <div class="nw-radio-group">',
            '                <label class="nw-radio-btn"><input type="radio" name="wiz_wan_type" value="dhcp"> <span class="nw-radio-btn-text">{{OPT_DHCP}}</span></label>',
            '                <label class="nw-radio-btn"><input type="radio" name="wiz_wan_type" value="pppoe" checked> <span class="nw-radio-btn-text">{{MODE_PPPOE_TITLE}}</span></label>',
            '              </div>',
            '            </div>',
            '            <div id="wiz-pppoe-fields" style="display:block; margin-top: 15px;">',
            '               <div class="nw-value"><label class="nw-value-title">{{LBL_USER}}</label><div class="nw-value-field"><textarea id="wiz-pppoe-user" placeholder="{{PH_USER}}" rows="2"></textarea></div></div>',
            '               <div class="nw-value"><label class="nw-value-title">{{LBL_PASS}}</label><div class="nw-value-field"><input type="text" id="wiz-pppoe-pass" placeholder="{{PH_PASS}}"></div></div>',
            '            </div>',
            '         </div>',
            '         <!-- Step 2: Wi-Fi -->',
            '         <div id="wiz-step-2-area" style="display:none;">',
            '            <div class="nw-step-title" style="margin-bottom: 20px; font-size: 19px;">{{WIZ_WIFI}}</div>',
            '            <p style="color: #64748b; font-size: 14.5px; margin: 0 0 20px 0; text-align: center;">{{WIZ_WIFI_DESC}}</p>',
            '            <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 15px; padding: 10px; background: #f8fafc; border-radius: 8px; border: 1px dashed #cbd5e1;">',
            '               <label class="nw-wiz-cb-wrap" style="font-size: 14.5px; color: #3b82f6; font-weight: bold; margin: 0;">',
            '                  <input type="checkbox" id="wiz-skip-wifi-checkbox">',
            '                  <span class="nw-wiz-checkmark"></span>',
            '                  <span style="line-height: 1;">{{WIZ_SKIP_WIFI}}</span>',
            '               </label>',
            '            </div>',
            '            <div id="wiz-wifi-input-area">',
            '               <div class="nw-value"><label class="nw-value-title">{{LBL_SSID}}</label><div class="nw-value-field"><input type="text" id="wiz-wifi-ssid" placeholder="My_WiFi"></div></div>',
            '               <div class="nw-value"><label class="nw-value-title">{{LBL_WIFI_PASS}}</label><div class="nw-value-field"><input type="text" id="wiz-wifi-key" placeholder="{{M_PWD_SHORT}}"></div></div>',
            '            </div>',
            '         </div>',
            '         <!-- Step 3: Confirm -->',
            '         <div id="wiz-step-3-area" style="display:none;">',
            '            <div class="nw-step-title" style="margin-bottom: 20px; font-size: 19px;">{{WIZ_CONFIRM}}</div>',
            '            <div id="wiz-confirm-text" class="nw-confirm-mode-text" style="margin-top: 0; padding: 20px; background: #0f172a;"></div>',
            '            <div class="nw-warn-main" style="margin-top: 15px; margin-bottom: 0;">{{NOTE_1}}</div>',
            '         </div>',
            '      </div>',
            '      <div style="padding: 15px 25px 25px; border-top: 1px solid #f1f5f9; background: #f8fafc;">',
            '         <div class="nw-modal-btn-wrap" style="margin-top: 0;">',
            '            <button id="wiz-btn-prev" class="nw-u-btn nw-u-btn-red" style="display:none;">{{BTN_BACK}}</button>',
            '            <button id="wiz-btn-next" class="nw-u-btn nw-u-btn-green">{{BTN_NEXT}}</button>',
            '            <button id="wiz-btn-apply" class="nw-u-btn nw-u-btn-green" style="display:none;">{{BTN_APPLY}}</button>',
            '         </div>',
            '         <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 20px;">',
            '            <label class="nw-wiz-cb-wrap" style="font-size: 13.5px; color: #64748b; font-weight: 500; margin: 0;">',
            '               <input type="checkbox" id="wiz-hide-checkbox" checked>',
            '               <span class="nw-wiz-checkmark"></span>',
            '               <span style="line-height: 1;">{{WIZ_HIDE}}</span>',
            '            </label>',
            '            <span id="wiz-btn-skip" style="font-size: 13.5px; color: #94a3b8; cursor: pointer; text-decoration: underline;">{{WIZ_SKIP}}</span>',
            '         </div>',
            '      </div>',
            '    </div>',
            '  </div>',
            // ===================================
            
            '  <div id="step-1" class="nw-step">',
            '    <div class="nw-card-group">',
            
            // 1. PPPoE拔号
            '      <div class="nw-card" data-mode="pppoe"><div class="nw-badge nw-badge-pppoe"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg></div>',
            '        <div class="nw-card-title">{{MODE_PPPOE_TITLE}}</div><span>{{MODE_PPPOE_DESC}}</span></div>',

            // 2. Wi-Fi设置
            '      <div class="nw-card" id="card-wifi" data-mode="wifi" style="display: none;"><div class="nw-badge nw-badge-wifi"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg></div>', 
            '        <div class="nw-card-title">{{MODE_WIFI_TITLE}}</div><span>{{MODE_WIFI_DESC}}</span></div>',

            // 3. 二級路由模式
            '      <div class="nw-card" data-mode="router"><div class="nw-badge nw-badge-dhcp"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg></div>',
            '        <div class="nw-card-title">{{MODE_ROUTER_TITLE}}</div><span>{{MODE_ROUTER_DESC}}</span></div>',

            // 4. 局域网设置
            '      <div class="nw-card" data-mode="lan"><div class="nw-badge nw-badge-bypass"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg></div>',
            '        <div class="nw-card-title">{{MODE_LAN_TITLE}}</div><span>{{MODE_LAN_DESC}}</span></div>',
            
            '    </div>',
            '    <div id="current-mode-display" class="nw-current-mode-display">',
            '       <div id="current-mode-text" style="color: #fff;"><div class="nw-spinner" style="width:30px; height:30px; border-width:3px; margin: 0 auto; border-top-color: #fff;"></div><div style="margin-top:10px; font-size:15px; font-weight:bold; color:#fff;">{{LOADING_CONFIG}}</div></div>',
            '    </div>',
            '  </div>',
            '  <div id="step-2" class="nw-step" style="display: none;">',
            '    <div class="nw-form-area">',
            '      <div class="nw-top-back" id="top-back-1" title="{{BTN_HOME}}">',
            '         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>',
            '      </div>',
            '      <div id="fields-router" style="display: none;">',
            '        <div class="nw-step-title">{{TITLE_WAN}}</div>',
            '        <div class="nw-radio-group-wrap">',
            '          <div class="nw-value-title nw-radio-title">{{LBL_CONN_TYPE}}</div>',
            '          <div class="nw-radio-group">',
            '            <label class="nw-radio-btn"><input type="radio" name="router_type" value="dhcp" checked> <span class="nw-radio-btn-text">{{OPT_DHCP}}</span></label>',
            '            <label class="nw-radio-btn"><input type="radio" name="router_type" value="static"> <span class="nw-radio-btn-text">{{OPT_STATIC}}</span></label>',
            '          </div>',
            '        </div>',
            '        <div id="router-static-fields" class="nw-router-static-fields" style="display: none;">',
            '          <div class="nw-value"><label class="nw-value-title">{{LBL_IP}}</label><div class="nw-value-field"><input type="text" id="router-ip" placeholder="{{PH_IP}}"></div></div>',
            '          <div class="nw-value"><label class="nw-value-title">{{LBL_GW}}</label><div class="nw-value-field"><input type="text" id="router-gw" placeholder="{{PH_GW}}"></div></div>',
            '        </div>',
            '      </div>',
            '      <div id="fields-pppoe" style="display: none;">',
            '        <div class="nw-step-title">{{TITLE_PPPOE}}</div>',
            '        <div class="nw-value"><label class="nw-value-title">{{LBL_USER}}</label><div class="nw-value-field"><textarea id="pppoe-user" placeholder="{{PH_USER}}" rows="2"></textarea></div></div>',
            '        <div class="nw-value"><label class="nw-value-title">{{LBL_PASS}}</label><div class="nw-value-field"><input type="text" id="pppoe-pass" placeholder="{{PH_PASS}}"></div></div>',
            '        <div class="nw-warn-text">{{MSG_WAN_AUTODETECT}}</div>',
            '      </div>',
            '      <div id="fields-wifi" style="display: none;">',
            '        <div class="nw-step-title">{{TITLE_WIFI}}</div>',
            '        <div id="wifi-smart-row" class="nw-setting-row">',
            '           <div class="nw-setting-row-label">{{LBL_SMART_CONN}}</div>',
            '           <label class="nw-switch"><input type="checkbox" id="wifi-smart-toggle"><span class="nw-slider"></span></label>',
            '        </div>',
            '        <div id="wifi-smart-ui" style="display: none;">',
            '          <div class="nw-switch-row-padded">',
            '             <label class="nw-value-title nw-m0">{{LBL_WIFI_SWITCH}}</label>',
            '             <label class="nw-switch nw-flex-shrink-0"><input type="checkbox" id="wifi-smart-en" checked><span class="nw-slider"></span></label>',
            '          </div>',
            '          <div class="nw-value"><label class="nw-value-title">{{LBL_SSID}}</label><div class="nw-value-field"><input type="text" id="wifi-smart-ssid" placeholder="My_WiFi"></div></div>',
            '          <div class="nw-value"><label class="nw-value-title">{{LBL_WIFI_PASS}}</label><div class="nw-value-field"><input type="text" id="wifi-smart-key" placeholder="min 8 chars"></div></div>',
            '          <div class="nw-adv-btn">▼ {{LBL_ADVANCED}}</div>',
            '          <div class="nw-adv-panel" style="display:none;">',
            '             <div class="nw-adv-setting-row">',
            '                <label class="nw-value-title nw-m0">{{LBL_HIDE_SSID}}</label>',
            '                <label class="nw-switch nw-flex-shrink-0"><input type="checkbox" id="wifi-smart-hidden"><span class="nw-slider"></span></label>',
            '             </div>',
            '             <div class="nw-value"><label class="nw-value-title">{{LBL_WIFI_ENC}}</label><div class="nw-value-field">',
            '               <select id="wifi-smart-enc"><option value="psk2+sae">{{OPT_PSK2SAE}}</option><option value="psk2">{{OPT_PSK2}}</option><option value="sae">{{OPT_SAE}}</option><option value="none">{{OPT_NONE}}</option></select>',
            '             </div></div>',
            '             <div class="nw-roam-row">',
            '                <div class="nw-flex-1">',
            '                   <div class="nw-roam-title">{{LBL_ROAMING}}</div>',
            '                   <div class="nw-roam-desc">{{DESC_ROAMING}}</div>',
            '                   <div id="roam-warn-smart" class="nw-roam-warn" style="display:none;">{{DESC_ROAM_DIRTY}}</div>',
            '                </div>',
            '                <label class="nw-switch nw-flex-shrink-0"><input type="checkbox" id="wifi-smart-roaming" checked><span class="nw-slider"></span></label>',
            '             </div>',
            '          </div>',
            '        </div>',
            '        <div id="wifi-split-ui" style="display: block;">',
            '           <div class="nw-split-header-row" style="display: flex; margin-bottom: 10px;">',
            '              <div class="nw-split-header-item" style="display: flex; align-items: center; justify-content: center; gap: 5px;">',
            '                 <label class="nw-switch nw-flex-shrink-0 nw-scale-switch" style="margin: 0;"><input type="checkbox" id="wifi-2g-en" checked><span class="nw-slider"></span></label>',
            '                 <label class="nw-value-title nw-m0 nw-pointer" style="display: inline-block !important; margin: 0 !important; line-height: 1 !important;">{{LBL_WIFI_2G_EN}}</label>',
            '              </div>',
            '              <div class="nw-split-header-item" style="display: flex; align-items: center; justify-content: center; gap: 2px;">',
            '                 <label class="nw-switch nw-flex-shrink-0 nw-scale-switch" style="margin: 0;"><input type="checkbox" id="wifi-5g-en" checked><span class="nw-slider"></span></label>',
            '                 <label class="nw-value-title nw-m0 nw-pointer" style="display: inline-block !important; margin: 0 !important; line-height: 1 !important;">{{LBL_WIFI_5G_EN}}</label>',
            '              </div>',
            '           </div>',
            '           <div id="wifi-tab-buttons" class="nw-wifi-tabs">',
            '              <button id="tab-2g" class="nw-tab-btn" style="background:#3b82f6; color:#fff;">{{TAB_2G}}</button>',
            '              <button id="tab-5g" class="nw-tab-btn" style="background:#f1f5f9; color:#475569;">{{TAB_5G}}</button>',
            '           </div>',
            '           <div id="wifi-2g-form">',
            '              <div class="nw-value"><label class="nw-value-title">{{LBL_SSID}} (2.4G{{M_ACCT}})</label><div class="nw-value-field"><input type="text" id="wifi-2g-ssid"></div></div>',
            '              <div class="nw-value"><label class="nw-value-title">{{LBL_WIFI_PASS}} (2.4G)</label><div class="nw-value-field"><input type="text" id="wifi-2g-key"></div></div>',
            '              <div class="nw-adv-btn">▼ {{LBL_ADVANCED}}</div>',
            '              <div class="nw-adv-panel" style="display:none;">',
            '                 <div class="nw-adv-setting-row">',
            '                    <label class="nw-value-title nw-m0">{{LBL_HIDE_SSID}}</label>',
            '                    <label class="nw-switch nw-flex-shrink-0"><input type="checkbox" id="wifi-2g-hidden"><span class="nw-slider"></span></label>',
            '                 </div>',
            '                 <div class="nw-value"><label class="nw-value-title">{{LBL_WIFI_ENC}}</label><div class="nw-value-field">',
            '                    <select id="wifi-2g-enc"><option value="psk2+sae">{{OPT_PSK2SAE}}</option><option value="psk2">{{OPT_PSK2}}</option><option value="sae">{{OPT_SAE}}</option><option value="none">{{OPT_NONE}}</option></select>',
            '                 </div></div>',
            '                 <div class="nw-value"><label class="nw-value-title">{{LBL_MODE}}</label><div class="nw-value-field">',
            '                    <select id="wifi-2g-mode" data-prev="auto"><option value="auto">{{OPT_AUTO}}</option><option value="11be">11be (Wi-Fi 7)</option><option value="11ax">11ax (Wi-Fi 6)</option><option value="11g">11g (Wi-Fi 4/3)</option><option value="11b">11b (Legacy)</option></select>',
            '                 </div></div>',
            '                 <div class="nw-value"><label class="nw-value-title">{{LBL_CHANNEL}}</label><div class="nw-value-field">',
            '                    <select id="wifi-2g-chan"><option value="auto">{{OPT_AUTO}}</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option><option value="11">11</option><option value="12">12</option><option value="13">13</option></select>',
            '                 </div></div>',
            '                 <div class="nw-value"><label class="nw-value-title">{{LBL_BANDWIDTH}}</label><div class="nw-value-field">',
            '                    <select id="wifi-2g-bw"><option value="auto">{{OPT_AUTO}}</option><option value="20">20 MHz</option><option value="40">40 MHz</option></select>',
            '                 </div></div>',
            '                 <div class="nw-legacy-row">',
            '                    <div class="nw-flex-1">',
            '                        <div class="nw-desc-title">{{LBL_LEGACY_B}}</div>',
            '                        <div class="nw-legacy-desc">{{DESC_LEGACY_B}}</div>',
            '                    </div>',
            '                    <label class="nw-switch nw-flex-shrink-0"><input type="checkbox" id="legacy-b-toggle"><span class="nw-slider"></span></label>',
            '                 </div>',
            '                 <div class="nw-roam-row-alt">',
            '                    <div class="nw-flex-1">',
            '                       <div class="nw-roam-title nw-desc-title">{{LBL_ROAMING}}</div>',
            '                       <div class="nw-roam-desc">{{DESC_ROAMING}}</div>',
            '                       <div id="roam-warn-2g" class="nw-roam-warn" style="display:none;">{{DESC_ROAM_DIRTY}}</div>',
            '                    </div>',
            '                    <label class="nw-switch nw-flex-shrink-0"><input type="checkbox" id="wifi-2g-roaming"><span class="nw-slider"></span></label>',
            '                 </div>',
            '              </div>',
            '           </div>',
            '           <div id="wifi-5g-form" style="display:none;">',
            '              <div class="nw-value"><label class="nw-value-title">{{LBL_SSID}} (5G{{M_ACCT}})</label><div class="nw-value-field"><input type="text" id="wifi-5g-ssid"></div></div>',
            '              <div class="nw-value"><label class="nw-value-title">{{LBL_WIFI_PASS}} (5G)</label><div class="nw-value-field"><input type="text" id="wifi-5g-key"></div></div>',
            '              <div class="nw-adv-btn">▼ {{LBL_ADVANCED}}</div>',
            '              <div class="nw-adv-panel" style="display:none;">',
            '                 <div class="nw-adv-setting-row">',
            '                    <label class="nw-value-title nw-m0">{{LBL_HIDE_SSID}}</label>',
            '                    <label class="nw-switch nw-flex-shrink-0"><input type="checkbox" id="wifi-5g-hidden"><span class="nw-slider"></span></label>',
            '                 </div>',
            '                 <div class="nw-value"><label class="nw-value-title">{{LBL_WIFI_ENC}}</label><div class="nw-value-field">',
            '                    <select id="wifi-5g-enc"><option value="psk2+sae">{{OPT_PSK2SAE}}</option><option value="psk2">{{OPT_PSK2}}</option><option value="sae">{{OPT_SAE}}</option><option value="none">{{OPT_NONE}}</option></select>',
            '                 </div></div>',
            '                 <div class="nw-value"><label class="nw-value-title">{{LBL_MODE}}</label><div class="nw-value-field">',
            '                    <select id="wifi-5g-mode" data-prev="auto"><option value="auto">{{OPT_AUTO}}</option><option value="11be">11be (Wi-Fi 7)</option><option value="11ax">11ax (Wi-Fi 6)</option><option value="11ac">11ac (Wi-Fi 5)</option><option value="11a">11a (Wi-Fi 4)</option></select>',
            '                 </div></div>',
            '                 <div class="nw-value"><label class="nw-value-title">{{LBL_CHANNEL}}</label><div class="nw-value-field">',
            '                    <select id="wifi-5g-chan"><option value="auto">{{OPT_AUTO}}</option><option value="36">36</option><option value="40">40</option><option value="44">44</option><option value="48">48</option><option value="149">149</option><option value="153">153</option><option value="157">157</option><option value="161">161</option></select>',
            '                 </div></div>',
            '                 <div class="nw-value"><label class="nw-value-title">{{LBL_BANDWIDTH}}</label><div class="nw-value-field">',
            '                    <select id="wifi-5g-bw"><option value="auto">{{OPT_AUTO}}</option><option value="20">20 MHz</option><option value="40">40 MHz</option><option value="80">80 MHz</option><option value="160">160 MHz</option></select>',
            '                 </div></div>',
            '                 <div class="nw-roam-row-alt">',
            '                    <div class="nw-flex-1">',
            '                       <div class="nw-roam-title">{{LBL_ROAMING}}</div>',
            '                       <div class="nw-roam-desc">{{DESC_ROAMING}}</div>',
            '                       <div id="roam-warn-5g" class="nw-roam-warn" style="display:none;">{{DESC_ROAM_DIRTY}}</div>',
            '                    </div>',
            '                    <label class="nw-switch nw-flex-shrink-0"><input type="checkbox" id="wifi-5g-roaming" checked><span class="nw-slider"></span></label>',
            '                 </div>',
            '              </div>',
            '           </div>',
            '        </div>',
            '        <div class="nw-wisp-section">',
            '           <div class="nw-wisp-header">',
            '              <div class="nw-wisp-title">{{LBL_WISP_EN}}</div>',
            '              <label class="nw-switch"><input type="checkbox" id="wisp-toggle"><span class="nw-slider"></span></label>',
            '           </div>',
            '           <div class="nw-wisp-desc" style="padding:5px 0;">{{DESC_WISP}}</div>',
            '           <div id="wisp-ui-panel" class="nw-wisp-ui-panel" style="display:none;">',
            '              <button id="btn-wisp-scan" class="nw-u-btn nw-u-btn-blue" style="width: 100%;">{{BTN_SCAN}}</button>',
            '              <div id="wisp-selected-info" style="display:none; width: 100%;">',
            '                 <div class="nw-value"><label class="nw-value-title">{{TXT_TARGET_SSID}}</label><div class="nw-value-field"><input type="text" id="wisp-target-ssid" readonly class="nw-wisp-target-input"></div></div>',
            '                 <div class="nw-value"><label class="nw-value-title">{{WISP_PWD_PROMPT}}</label><div class="nw-value-field"><input type="text" id="wisp-target-key" placeholder="{{PH_WISP_PWD}}"></div></div>',
            '                 <input type="hidden" id="wisp-target-enc" value="psk2">',
            '                 <input type="hidden" id="wisp-target-device" value="radio0">',
            '                 <input type="hidden" id="wisp-target-bssid" value=""></input>',
            '              </div>',
            '           </div>',
            '        </div>',
            '      </div>',
            '      <div id="fields-lan" style="display: none;">',
            '        <div class="nw-step-title">{{TITLE_LAN}}</div>',
            '        <div class="nw-setting-row-alt">',
            '           <div class="nw-setting-row-label">{{LBL_IPV6}}</div>',
            '           <label class="nw-switch"><input type="checkbox" id="lan-ipv6-toggle" checked><span class="nw-slider"></span></label>',
            '        </div>',
            '        <div class="nw-setting-row">',
            '           <div class="nw-setting-row-label">{{LBL_BYPASS}}</div>',
            '           <label class="nw-switch"><input type="checkbox" id="lan-bypass-toggle"><span class="nw-slider"></span></label>',
            '        </div>',
            '        <div id="lan-bypass-warning" class="nw-warn-bypass" style="display:none;">{{WARN_BYPASS}}</div>',
            '        <div id="lan-main-warning" class="nw-warn-main">{{WARN_MAIN}}</div>',
            '        <div class="nw-value"><label class="nw-value-title">{{LBL_LAN_IP}}</label><div class="nw-value-field"><input type="text" id="lan-ip" placeholder="{{PH_IP}}"></div></div>',
            '        <div class="nw-value"><label class="nw-value-title">{{LBL_LAN_GW}}</label><div class="nw-value-field"><input type="text" id="lan-gw" placeholder="{{PH_LAN_GW}}"></div></div>',
            '        <div class="nw-legacy-row">',
            '           <div class="nw-flex-1">',
            '               <div class="nw-desc-title">{{LBL_FORCE_APPLY}}</div>',
            '               <div style="font-size: 14px; color: #64748b; margin-top: 4px; word-break: break-word; line-height: 1.4;">{{DESC_FORCE_APPLY}}</div>',
            '           </div>',
            '           <label class="nw-switch nw-flex-shrink-0"><input type="checkbox" id="lan-safe-toggle" checked><span class="nw-slider"></span></label>',
            '        </div>',
            '      </div>',
            '    </div>',
            '    <div class="nw-actions"><button id="btn-back-1" class="nw-u-btn nw-u-btn-red">{{BTN_BACK}}</button><button id="btn-next-2" class="nw-u-btn nw-u-btn-green">{{BTN_NEXT}}</button></div>',
            '  </div>',
            '  <div id="step-3" class="nw-step" style="display: none;">',
            '    <div class="nw-confirm-board">',
            '      <div class="nw-top-back" id="top-back-2" title="{{BTN_EDIT}}">',
            '         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>',
            '      </div>',
            '      <div class="nw-step-title">{{TITLE_CONFIRM}}</div>',
            '      <p class="nw-confirm-desc">{{DESC_CONFIRM}}</p>',
            '      <div id="confirm-mode-text" class="nw-confirm-mode-text"></div>',
            '      <div class="nw-note-box">',
            '        <div class="nw-note-title">{{NOTE_TITLE}}</div>',
            '        <div class="nw-note-item"><span style="color:#3b82f6;">•</span> <span>{{NOTE_1}}</span></div>',
            '        <div class="nw-note-item"><span style="color:#10b981;">•</span> <span>{{NOTE_2}}</span></div>',
            '      </div>',
            '    </div>',
            '    <div class="nw-actions"><button id="btn-back-2" class="nw-u-btn nw-u-btn-red">{{BTN_BACK}}</button><button id="btn-apply" class="nw-u-btn nw-u-btn-green">{{BTN_APPLY}}</button></div>',
            '  </div>',
            '</div>'
        ].join('');

        for (var k in T) {
            htmlTemplate = htmlTemplate.split('{{' + k + '}}').join(T[k]);
        }
        container.innerHTML = htmlTemplate;
        this.bindEvents(container);
        return container;
    },

    bindEvents: function (container) {
        // ==================  安全XSS 字符转义  ==================
        var escapeHTML = function(str) {
            if (!str) return '';
            return String(str).replace(/[&<>'"]/g, function(tag) {
                var charsToReplace = { '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' };
                return charsToReplace[tag] || tag;
            });
        };
        // ==============================================================

        // ================== 向导状态后端静默保存 ==================
        var silentSaveWizardState = function(state) {
            // 如果状态一样，返回空 Promise
            if (window._currentWizState === String(state)) return Promise.resolve();
            window._currentWizState = String(state);
            
            // 后端 Lua 接口，后端在底层改文件
            return callNetSetup('set_wizard', String(state), '', '', '', '', '').catch(function(e){});
        };
        // ==============================================================

        var step1 = container.querySelector('#step-1'), step2 = container.querySelector('#step-2'), step3 = container.querySelector('#step-3');
        var confirmText = container.querySelector('#confirm-mode-text'), modeTextEl = container.querySelector('#current-mode-text');
        var selectedMode = '';
        window._isSingleChip = false;

        // ===== 快速开机向导流 =====
        var wizModal = container.querySelector('#nw-wizard-modal');
        var wArea1 = container.querySelector('#wiz-step-1-area'), wArea2 = container.querySelector('#wiz-step-2-area'), wArea3 = container.querySelector('#wiz-step-3-area');
        var wBtnPrev = container.querySelector('#wiz-btn-prev'), wBtnNext = container.querySelector('#wiz-btn-next'), wBtnApply = container.querySelector('#wiz-btn-apply');
        var wizHideCb = container.querySelector('#wiz-hide-checkbox');
        var currentWizStep = 1;

        // 向导高亮
        var updateWizSteps = function(step) {
            var dots = container.querySelectorAll('.nw-step-dot');
            dots.forEach(function(d, i) {
                if (i + 1 === step) {
                    // 1. 当前进行中的步骤
                    d.style.background = '#ffffff';
                    d.style.color = '#5e72e4';
                    d.style.border = 'none';
                    d.style.transform = 'scale(1.2)';
                    d.style.boxShadow = '0 0 8px rgba(255,255,255,0.6)';
                    d.style.opacity = '1';
                } else if (i + 1 < step) {
                    // 2. 已经完成的步骤
                    d.style.background = 'rgba(255,255,255,0.25)';
                    d.style.color = '#ffffff';
                    d.style.border = 'none';
                    d.style.transform = 'scale(1)';
                    d.style.boxShadow = 'none';
                    d.style.opacity = '1';
                } else {
                    // 3. 未来的步骤
                    d.style.background = 'transparent';
                    d.style.color = 'rgba(255,255,255,0.6)';
                    d.style.border = '1px solid rgba(255,255,255,0.4)';
                    d.style.transform = 'scale(1)';
                    d.style.boxShadow = 'none';
                    d.style.opacity = '0.8';
                }
            });
            var lines = container.querySelectorAll('.nw-step-line');
            lines.forEach(function(l, i) {
                l.style.setProperty('background', 'transparent', 'important'); 
                l.style.color = (i + 1 < step) ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.3)';
            });
        };
        // 初始化界面时渲染一次
        updateWizSteps(currentWizStep);

        // 1. 退出(X) 按钮此时勾选了“不再提示”，就执行静默写入。
        var closeWizard = function() {
            if (wizHideCb && wizHideCb.checked) {
                silentSaveWizardState('0'); 
            }
            wizModal.style.display = 'none';
        };
        container.querySelector('#wiz-modal-close').addEventListener('click', closeWizard);

        // 跳过本次引导，UI 隐藏
        container.querySelector('#wiz-btn-skip').addEventListener('click', function() {
            wizModal.style.display = 'none'; 
        });

        // 1.5 首页按钮重新打开向导逻辑
        var btnReopenWiz = container.querySelector('#btn-reopen-wizard');
        if (btnReopenWiz) {
            btnReopenWiz.addEventListener('click', function() {
                silentSaveWizardState('1'); // 调用静默武器！
                
                // 2. 状态重置归零：回到第一步
                currentWizStep = 1;
                updateWizSteps(1); // 【更新点阵】
                wArea1.style.display = 'block';
                wArea2.style.display = 'none';
                wArea3.style.display = 'none';
                wBtnPrev.style.display = 'none';
                wBtnNext.style.display = 'block';
                wBtnApply.style.display = 'none';
                
                // 3. 复选框状态清洗
                if (wizHideCb) wizHideCb.checked = true;
                var skipWifiCb = container.querySelector('#wiz-skip-wifi-checkbox');
                if (skipWifiCb) {
                    skipWifiCb.checked = false;
                    skipWifiCb.dispatchEvent(new Event('change')); // 触发联动，解开 Wi-Fi 密码框的置灰锁定
                }
                
                // 4. 重新召唤向导！
                wizModal.style.display = 'flex';
            });
        }

        // 2. WAN 类型切换监听
        container.querySelectorAll('input[name="wiz_wan_type"]').forEach(function(r) {
            r.addEventListener('change', function() { container.querySelector('#wiz-pppoe-fields').style.display = (this.value === 'pppoe') ? 'block' : 'none'; });
        });

        // 3 监听跳过 Wi-Fi 勾选框
        var skipWifiCb = container.querySelector('#wiz-skip-wifi-checkbox');
        var wifiInputArea = container.querySelector('#wiz-wifi-input-area');
        if (skipWifiCb && wifiInputArea) {
            skipWifiCb.addEventListener('change', function() {
                wifiInputArea.style.opacity = this.checked ? '0.3' : '1';
                wifiInputArea.style.pointerEvents = this.checked ? 'none' : 'auto';
            });
        }

        // 4. 下一步逻辑
        wBtnNext.addEventListener('click', function() {
            if (currentWizStep === 1) {
                var wType = container.querySelector('input[name="wiz_wan_type"]:checked').value;
                if (wType === 'pppoe' && (!container.querySelector('#wiz-pppoe-user').value.replace(/[\r\n\s]+/g, '') || !container.querySelector('#wiz-pppoe-pass').value.trim())) {
                    openModal({ title: T['M_INC_TIT'], msg: T['M_INC_PPPOE'], okText: T['M_CLOSE'] }); 
                    return; 
                }
                wArea1.style.display = 'none'; wArea2.style.display = 'block'; wBtnPrev.style.display = 'block'; wArea1.style.display = 'none'; wArea2.style.display = 'block'; wBtnPrev.style.display = 'block'; currentWizStep = 2; updateWizSteps(2); // 【更新点阵】
            } else if (currentWizStep === 2) {
                var isSkipWifi = skipWifiCb ? skipWifiCb.checked : false;
                var ssid = container.querySelector('#wiz-wifi-ssid').value.trim();
                var key = container.querySelector('#wiz-wifi-key').value;
                
                var proceedToStep3 = function() {
                    // 渲染最终确认视图
                    var wType2 = container.querySelector('input[name="wiz_wan_type"]:checked').value;
                    var htmlConfirm = "<div style='text-align:left; font-size:15px; color: #fff;'>";
                    
                    // --- 1. WAN  ---
                    if (wType2 === 'pppoe') {
                        var pppoeUser = container.querySelector('#wiz-pppoe-user').value.replace(/[\r\n\s]+/g, '');
                        var pppoePass = container.querySelector('#wiz-pppoe-pass').value;
                        htmlConfirm += "<div style='margin-bottom:8px; display:flex; align-items:center;'><b style='color:#facc15; margin-right:8px; flex-shrink:0;'>WAN:</b> <span>" + T['MODE_PPPOE_TITLE'] + "</span></div>";
                        htmlConfirm += "<div style='margin-bottom:8px; display:flex; align-items:center;'><b style='color:#fde047; margin-right:8px; white-space:nowrap; flex-shrink:0;'>"+ T['M_ACCT'] +":</b> <span style='word-break:break-all; opacity:0.9;'>" + escapeHTML(pppoeUser) + "</span></div>";
                        htmlConfirm += "<div style='margin-bottom:12px; display:flex; align-items:center;'><b style='color:#fde047; margin-right:8px; white-space:nowrap; flex-shrink:0;'>"+ T['M_PWD'] +":</b> <span style='word-break:break-all; opacity:0.9;'>" + escapeHTML(pppoePass) + "</span></div>";
                    } else {
                        htmlConfirm += "<div style='margin-bottom:12px; display:flex; align-items:center;'><b style='color:#facc15; margin-right:8px; flex-shrink:0;'>WAN:</b> <span>" + T['OPT_DHCP'] + "</span></div>";
                    }
                    
                    // --- 2. Wi-Fi  ---
                    if (isSkipWifi) {
                        htmlConfirm += "<div style='margin-bottom:0; display:flex; align-items:center;'><b style='color:#67e8f9; margin-right:8px; flex-shrink:0;'>Wi-Fi:</b> <span style='color:#94a3b8; font-style:italic;'>" + T['TXT_NOT_CONFIGURED'] + "</span></div>";
                    } else {
                        htmlConfirm += "<div style='margin-bottom:8px; display:flex; align-items:center;'><b style='color:#67e8f9; margin-right:8px; flex-shrink:0;'>Wi-Fi:</b> <span style='word-break:break-all;'>" + (ssid ? escapeHTML(ssid) : "<i>" + T['TXT_UNSET'] + "</i>") + "</span></div>";
                        htmlConfirm += "<div style='margin-bottom:0; display:flex; align-items:center;'><b style='color:#a7f3d0; margin-right:8px; white-space:nowrap; flex-shrink:0;'>"+ T['M_PWD'] +":</b> <span style='word-break:break-all;'>" + (key ? escapeHTML(key) : "<i>" + T['TXT_NO_PWD_OPEN'] + "</i>") + "</span></div>";
                    }
                    
                    htmlConfirm += "</div>";
                    container.querySelector('#wiz-confirm-text').innerHTML = htmlConfirm;

                    wArea2.style.display = 'none'; wArea3.style.display = 'block'; wBtnNext.style.display = 'none'; wBtnApply.style.display = 'block'; wArea2.style.display = 'none'; wArea3.style.display = 'block'; wBtnNext.style.display = 'none'; wBtnApply.style.display = 'block'; currentWizStep = 3; updateWizSteps(3); // 【更新点阵】
                };

                if (!isSkipWifi) {
                    if (!ssid) { openModal({ title: T['M_INC_TIT'], msg: T['M_INC_WIFI'], okText: T['M_CLOSE'] }); return; }
                    if (key && key.length < 8) { openModal({ title: T['M_FMT_TIT'], msg: T['M_PWD_SHORT'], okText: T['M_CLOSE'] }); return; }
                    if (key.length === 0) { 
                        // 拦截无密码
                        openModal({
                            title: T['M_OPEN_WARN_TIT'] || '⚠️ 无密码警告', 
                            msg: T['M_OPEN_WARN_MSG'] || '您正在设置无密码的开放 Wi-Fi，确定要继续吗？', 
                            cancelText: T['M_CLOSE'], 
                            okText: T['BTN_NEXT'] || '继续', 
                            isDanger: true,
                            onCancel: function() { container.querySelector('#nw-global-modal').style.display = 'none'; },
                            onOk: function() { 
                                container.querySelector('#nw-global-modal').style.display = 'none'; 
                                proceedToStep3(); 
                            }
                        });
                        return; 
                    }
                }
                proceedToStep3();
            }
        });

        // 5. 返回逻辑
        wBtnPrev.addEventListener('click', function() {
            if (currentWizStep === 2) { 
                wArea2.style.display = 'none'; wArea1.style.display = 'block'; wBtnPrev.style.display = 'none'; currentWizStep = 1; updateWizSteps(1); // 【新增更新点阵】
            } else if (currentWizStep === 3) { 
                wArea3.style.display = 'none'; wArea2.style.display = 'block'; wBtnApply.style.display = 'none'; wBtnNext.style.display = 'block'; currentWizStep = 2; updateWizSteps(2); // 【新增更新点阵】
            }
        });

        // 6. 一键合并提交，分流双通道与单通道
        wBtnApply.addEventListener('click', function() {
            var wType = container.querySelector('input[name="wiz_wan_type"]:checked').value;
            var isSkipWifi = skipWifiCb ? skipWifiCb.checked : false;

            // 验证底层 IPv6 状态是否已真实加载完毕！
            if (typeof window._trueIpv6State === 'undefined' || window._trueIpv6State === null) {
                openModal({ title: T['M_SYS_ERR'] || '系统异常', msg: '底层网络状态尚未加载完毕，请等待页面初始化完成后再提交，以防覆盖丢失配置。', okText: T['M_CLOSE'] });
                return;
            }
            var keepIpv6 = window._trueIpv6State;

            wizModal.style.display = 'none';
            openModal({ title: T['WIZ_TITLE'] || '向导配置中', msg: '<div style="color: #64748b; font-size: 16px; font-weight:bold;">' + T['MSG_WRITING'] + '</div>', spin: true });

            // 状态安全，再执行耗时的网络配置，排除并发 UCI 锁死
            silentSaveWizardState('0').then(function() {
                var applyPromise;

                if (isSkipWifi) {
                    if (wType === 'pppoe') {
                        var u = container.querySelector('#wiz-pppoe-user').value.replace(/[\r\n\s]+/g, '');
                        var p = container.querySelector('#wiz-pppoe-pass').value;
                        applyPromise = callNetSetup('pppoe', u, p, '', '', '1', keepIpv6);
                    } else {
                        applyPromise = callNetSetup('wan_dhcp', '', '', '', '', '1', keepIpv6);
                    }
                } else {
                    var arg1Obj = { wan_type: wType };
                    if (wType === 'pppoe') {
                        // 账号，剔除所有换行和不可见空格
                        arg1Obj.user = container.querySelector('#wiz-pppoe-user').value.replace(/[\r\n\s]+/g, '');
                        arg1Obj.pass = container.querySelector('#wiz-pppoe-pass').value; 
                    }
                    
                    var ssid = container.querySelector('#wiz-wifi-ssid').value.trim();
                    var key = container.querySelector('#wiz-wifi-key').value;
                    var enc = (key.length === 0) ? 'none' : 'sae-mixed';

                    var arg2Obj = {};
                    if (window._isSingleChip) {
                        arg2Obj = {
                            smart: "true",
                            merged: { enabled: "1", ssid: ssid, key: key, encryption: enc, hidden: "0", roaming: "0" }
                        };
                    } else {
                        arg2Obj = {
                            smart: "false",
                            radio_2g: { enabled: "1", ssid: ssid, key: key, encryption: enc, hidden: "0", roaming: "0", mode: "auto", channel: "auto", bandwidth: "auto" },
                            radio_5g: { enabled: "1", ssid: ssid, key: key, encryption: enc, hidden: "0", roaming: "1", mode: "auto", channel: "auto", bandwidth: "auto" }
                        };
                    }
                    var arg2Str = JSON.stringify(arg2Obj);
                    
                    applyPromise = callNetSetup('wizard', JSON.stringify(arg1Obj), arg2Str, '', '', '1', keepIpv6);
                }

                // 统一处理底层的回调与跳转
                applyPromise.then(function() {
                    var sec = 0, h = window.location.hostname;
                    var checkSameTimer = setInterval(function() { 
                        sec += 3; 
                        document.getElementById('nw-global-msg').innerHTML = '<div style="color: #059669; font-size: 16px; font-weight: bold;">' + T['MSG_WAIT_NET'].replace('{sec}', sec) + '</div>'; 
                        fetchProbe('http://' + h + '/cgi-bin/luci/?v=' + Date.now(), 2000).then(function() { 
                            clearInterval(checkSameTimer); window.location.reload(); 
                        }).catch(function() {}); 
                    }, 3000);
                }).catch(function(err) { 
                    openModal({ title: T['M_SYS_ERR'], msg: T['M_ERR_WIZ_FAILED'] + ': ' + err, okText: T['M_CLOSE'] });
                });
            }); // 结束 Promise 链
        });
        // ==========================================

        // ===== 自定义动画滚动 =====
        var smoothScrollToTop = function(duration) {
            // 兼容 Argon、Bootstrap 等各种 OpenWrt
            var scroller = document.querySelector('#maincontent') || document.querySelector('.main-right') || document.scrollingElement || document.documentElement;
            var start = scroller.scrollTop;
            if (start === 0 && window.pageYOffset > 0) { scroller = window; start = window.pageYOffset; }
            if (start <= 0) return; // 已经在顶部就不滚了

            var startTime = null;
            // 先加速后减速 (Ease-In-Out)
            var easeInOutQuad = function (t, b, c, d) {
                t /= d/2;
                if (t < 1) return c/2*t*t + b;
                t--;
                return -c/2 * (t*(t-2) - 1) + b;
            };

            var animateScroll = function(timestamp) {
                if (!startTime) startTime = timestamp;
                var progress = timestamp - startTime;
                var nextStep = easeInOutQuad(progress, start, -start, duration);
                
                if (scroller === window) window.scrollTo(0, nextStep);
                else scroller.scrollTop = nextStep;

                if (progress < duration) window.requestAnimationFrame(animateScroll);
                else {
                    if (scroller === window) window.scrollTo(0, 0);
                    else scroller.scrollTop = 0;
                }
            };
            window.requestAnimationFrame(animateScroll);
        };
        // ========================================================

        // ===== 提取当前状态快照 =====
        function getWifiSnapshot() {
            var sT = container.querySelector('#wifi-smart-toggle').checked;
            var snap = {
                sT: sT,
                lB: container.querySelector('#legacy-b-toggle').checked,
                wt: container.querySelector('#wisp-toggle') ? container.querySelector('#wisp-toggle').checked : false,
                ws: container.querySelector('#wisp-target-ssid') ? container.querySelector('#wisp-target-ssid').value : '',
                wk: container.querySelector('#wisp-target-key') ? container.querySelector('#wisp-target-key').value : '',
                we: container.querySelector('#wisp-target-enc') ? container.querySelector('#wisp-target-enc').value : '',
                wd: container.querySelector('#wisp-target-device') ? container.querySelector('#wisp-target-device').value : '',
                wb: container.querySelector('#wisp-target-bssid') ? container.querySelector('#wisp-target-bssid').value : ''
            };
            if (sT) {
                // 如果是多频合一，只记录合一面板的数据
                snap.es = container.querySelector('#wifi-smart-en').checked;
                snap.ss = container.querySelector('#wifi-smart-ssid').value;
                snap.ks = container.querySelector('#wifi-smart-key').value;
                snap.ecs = container.querySelector('#wifi-smart-enc').value;
                snap.hs = container.querySelector('#wifi-smart-hidden').checked;
                snap.rs = container.querySelector('#wifi-smart-roaming') ? container.querySelector('#wifi-smart-roaming').checked : false;
            } else {
                // 如果是分开模式，记录独立的面板数据
                snap.e2 = container.querySelector('#wifi-2g-en').checked;
                snap.s2 = container.querySelector('#wifi-2g-ssid').value;
                snap.k2 = container.querySelector('#wifi-2g-key').value;
                snap.ec2 = container.querySelector('#wifi-2g-enc').value;
                snap.h2 = container.querySelector('#wifi-2g-hidden').checked;
                snap.m2 = container.querySelector('#wifi-2g-mode').value;
                snap.c2 = container.querySelector('#wifi-2g-chan').value;
                snap.b2 = container.querySelector('#wifi-2g-bw').value;
                snap.r2 = container.querySelector('#wifi-2g-roaming') ? container.querySelector('#wifi-2g-roaming').checked : false;
                
                snap.e5 = container.querySelector('#wifi-5g-en').checked;
                snap.s5 = container.querySelector('#wifi-5g-ssid').value;
                snap.k5 = container.querySelector('#wifi-5g-key').value;
                snap.ec5 = container.querySelector('#wifi-5g-enc').value;
                snap.h5 = container.querySelector('#wifi-5g-hidden').checked;
                snap.m5 = container.querySelector('#wifi-5g-mode').value;
                snap.c5 = container.querySelector('#wifi-5g-chan').value;
                snap.b5 = container.querySelector('#wifi-5g-bw').value;
                snap.r5 = container.querySelector('#wifi-5g-roaming') ? container.querySelector('#wifi-5g-roaming').checked : false;
            }
            return JSON.stringify(snap);
        }
        // ========================================================

        function safePromise(p, f) { return new Promise(function(r) { var t = setTimeout(function() { r(f); }, 3000); if (!p || !p.then) { clearTimeout(t); return r(f); } p.then(function(res) { clearTimeout(t); r(res); }).catch(function() { clearTimeout(t); r(f); }); }); }
        function safeUciGet(c, s, o, d) { try { var v = uci.get(c, s, o); return (v === null || v === undefined) ? d : String(v).trim(); } catch(e) { return d; } }

        // SSID 后缀转换
        // 去除 _2.4G, -5G, 2.4G, 5G, 甚至 2.4, 5 等冗余后缀
        function cleanSsidSuffix(ssid) {
            if (!ssid) return '';
            // 正则匹配：结尾的可选下划线/横杠/空格 + 2.4或5 + 可选的G或g
            return ssid.replace(/[_\-\s]?(2\.4|5)[gG]?$/i, '');
        }

        // 生成纯净的目标名称
        function smartConvertSsid(ssid, targetBand) {
            var base = cleanSsidSuffix(ssid);
            if (!base) base = 'OpenWrt';
            return targetBand === '2g' ? base + '_2.4G' : base + '_5G';
}

        Promise.all([
            callNetCheckWifi(),
            safePromise(callSystemBoard(), {}),
            safePromise(uci.load('netwiz'), null) // 1. 恢复加载 netwiz 配置
        ]).then(function(results) {
            var wifiRes = results[0];
            var boardRes = results[1] || {};
            var modelName = (boardRes.model || '').toLowerCase();
            
            var hasWifi = (wifiRes === true || (typeof wifiRes === 'object' && wifiRes && wifiRes.has_wifi === true));
            var isUnknownDevice = (modelName.indexOf('generic') !== -1 && modelName.indexOf('unknown') !== -1);

            // 2. 恢复读取 netwiz 的标志位
            var wizardEnable = safeUciGet('netwiz', 'main', 'wizard_enable', '1');
            window._currentWizState = wizardEnable;

            var wizModal = container.querySelector('#nw-wizard-modal');
            var btnReopenWiz = container.querySelector('#btn-reopen-wizard');

            if (hasWifi && !isUnknownDevice) {
                var wifiCard = container.querySelector('#card-wifi');
                if (wifiCard) wifiCard.style.display = 'flex';
                
                // 3. 只有值为 '1' 才弹出
                if (wizardEnable === '1' && wizModal) {
                    wizModal.style.display = 'flex';
                }
            } else {
                console.warn("[Netwiz] 警告: 未检测到 Wi-Fi 硬件，已彻底隐藏向导相关入口。");
                if (wizModal) wizModal.style.display = 'none';
                if (btnReopenWiz) btnReopenWiz.style.display = 'none'; // 彻底隐藏首页的“重新打开向导”按钮
            }
        }).catch(function(err) {});

        function updateStatusDisplay(isSilent) {
            try {
                if (modeTextEl && !isSilent) modeTextEl.innerHTML = "<div class='nw-spinner' style='width:30px; height:30px; border-width:3px; margin: 0 auto; border-top-color: #fff;'></div><div style='margin-top:10px; font-size:15px; font-weight:bold; color:#fff;'>" + T['LOADING_CONFIG'] + "</div>";
                try { uci.unload('network'); uci.unload('dhcp'); uci.unload('wireless'); } catch(e) {}
                
                Promise.all([ safePromise(uci.load('network'), null), safePromise(uci.load('dhcp'), null), safePromise(uci.load('wireless'), null), safePromise(getWanStatus(), {}) ]).then(function(results) {
                    var rawIfaces = results[3] || {}, ifaces = Array.isArray(rawIfaces.interface) ? rawIfaces.interface : (Array.isArray(rawIfaces) ? rawIfaces : []);
                    var wProto = safeUciGet('network', 'wan', 'proto', '').toLowerCase();
                    var activeWan = ifaces.find(function(i) { return i && (i.interface === 'wan' || i.proto === wProto || i.device === 'eth0' || i.device === 'wan'); }) || {};
                    var liveWanIp = ((activeWan['ipv4-address'] && activeWan['ipv4-address'][0]) ? activeWan['ipv4-address'][0].address : '').split('/')[0];
                    window._liveWanIp = liveWanIp;
                    var liveGw = activeWan.nexthop || '';
                    if (!liveGw && Array.isArray(activeWan.route)) { var defaultRoute = activeWan.route.find(function(r) { return r.target === '0.0.0.0'; }); if (defaultRoute) liveGw = defaultRoute.nexthop; }
                    if (!liveGw && activeWan['ipv4-address'] && activeWan['ipv4-address'][0]) liveGw = activeWan['ipv4-address'][0].ptpaddress || '';
                    liveGw = liveGw || T['TXT_GETTING'];
                    var wIp = safeUciGet('network', 'wan', 'ipaddr', T['TXT_NOT_GOT']).split('/')[0], wGw = safeUciGet('network', 'wan', 'gateway', T['TXT_NOT_SET']); 
                    var lIp = safeUciGet('network', 'lan', 'ipaddr', window.location.hostname).split('/')[0], lGw = safeUciGet('network', 'lan', 'gateway', T['TXT_NOT_SET']), lIgnore = safeUciGet('dhcp', 'lan', 'ignore', ''), isBypass = (lIgnore === '1' || lIgnore === 'true' || lIgnore === 'on' || lIgnore === 'yes');
                    if (container.querySelector('#pppoe-user')) container.querySelector('#pppoe-user').value = safeUciGet('network', 'wan', 'username', '');
                    if (container.querySelector('#pppoe-pass')) container.querySelector('#pppoe-pass').value = safeUciGet('network', 'wan', 'password', '');
                    if (container.querySelector('#router-ip')) container.querySelector('#router-ip').value = (wIp !== T['TXT_NOT_GOT']) ? wIp : '';
                    if (container.querySelector('#router-gw')) container.querySelector('#router-gw').value = (wGw !== T['TXT_NOT_SET']) ? wGw : '';
                    if (container.querySelector('#lan-ip')) container.querySelector('#lan-ip').value = lIp;
                    if (container.querySelector('#lan-gw')) container.querySelector('#lan-gw').value = (lGw !== T['TXT_NOT_SET']) ? lGw : '';
                    
                    var bypassToggle = container.querySelector('#lan-bypass-toggle');
                    if (bypassToggle) { bypassToggle.checked = isBypass; container.querySelector('#lan-bypass-warning').style.display = isBypass ? 'block' : 'none'; container.querySelector('#lan-main-warning').style.display = isBypass ? 'none' : 'block'; }

                    var wispToggleEl = container.querySelector('#wisp-toggle');
                    if (wispToggleEl) {
                        var wispIface = uci.sections('wireless', 'wifi-iface').find(function(i) { return i.network === 'wwan' && i.mode === 'sta'; });
                        wispToggleEl.checked = !!wispIface;
                        var wispUi = container.querySelector('#wisp-ui-panel');
                        
                        if (wispUi) {
                            wispUi.style.display = 'none';
                            
                            if (wispIface) {
                                var ssidInput = container.querySelector('#wisp-target-ssid');
                                if (ssidInput) ssidInput.value = wispIface.ssid || '';
                                
                                var keyInput = container.querySelector('#wisp-target-key');
                                if (keyInput) keyInput.value = wispIface.key || '';
                                
                                var encInput = container.querySelector('#wisp-target-enc');
                                if (encInput) encInput.value = wispIface.encryption || 'psk2';
                                
                                var devInput = container.querySelector('#wisp-target-device');
                                if (devInput) devInput.value = wispIface.device || 'radio0';
                                
                                var bssidInput = container.querySelector('#wisp-target-bssid');
                                if (bssidInput) bssidInput.value = wispIface.bssid || '';
                            }
                        }
                    }

                    var ipv6Mode = safeUciGet('dhcp', 'lan', 'dhcpv6', '');
                    // 记录系统真实的 IPv6 状态到全局变量
                    window._trueIpv6State = (ipv6Mode === 'server' || ipv6Mode === 'relay') ? '1' : '0';
                    
                    var ipv6Toggle = container.querySelector('#lan-ipv6-toggle');
                    if (ipv6Toggle) ipv6Toggle.checked = (window._trueIpv6State === '1');

                    if (!window._wifiLoaded) {
                        try {
                            var wDevs = uci.sections('wireless', 'wifi-device') || [];
                            var wIfaces = uci.sections('wireless', 'wifi-iface') || [];

                                    // ===== Netwiz硬件嗅探日志 =====
                                    console.log("============== [Netwiz 硬件嗅探] ==============");
                                    console.log("检测到物理射频芯片数量:", wDevs.length);
                                    if (wDevs.length === 1) {
                                        console.log("架构判断: 【单芯片处理中心】 (Single-Chip)");
                                        console.log("目标核心:", wDevs[0]['.name']);
                                    } else if (wDevs.length > 1) {
                                        console.log("架构判断: 【多芯片独立阵列】 (Multi-Chip)");
                                        var dNames = [];
                                        for(var _i=0; _i<wDevs.length; _i++) dNames.push(wDevs[_i]['.name']);
                                        console.log("阵列核心:", dNames.join(', '));
                                    } else {
                                        console.log("架构判断: 未检测到 Wi-Fi 芯片");
                                    }
                                    console.log("===============================================");
                                    // ==================================

                            var smartToggle = container.querySelector('#wifi-smart-toggle');
                            var legacyToggle = container.querySelector('#legacy-b-toggle');

                            if (wDevs.length > 0) {
                                function findMainIfaceForDev(devName) {
                                    var validIfaces = wIfaces.filter(function(i) { return i.device === devName; });
                                    if (validIfaces.length === 0) return {};
                                    var best = validIfaces.find(function(i) { return i.disabled !== '1' && i.ssid && i.mode === 'ap'; });
                                    if (!best) best = validIfaces.find(function(i) { return i.ssid && i.mode === 'ap'; });
                                    if (!best) best = validIfaces.find(function(i) { return i.disabled !== '1'; });
                                    if (!best) best = validIfaces[0];
                                    return best;
                                }

                                if (wDevs.length === 1) {
                                    window._isSingleChip = true;
                                    var theDev = wDevs[0];
                                    
                                    smartToggle.closest('#wifi-smart-row').style.display = 'none';
                                    container.querySelector('#wifi-smart-ui').style.display = 'none';
                                    container.querySelector('#wifi-split-ui').style.display = 'block';

                                    var is5G = false;
                                    var ch = parseInt(theDev.channel);
                                    var bd = (theDev.band || '').toLowerCase();
                                    var ht = (theDev.htmode || '').toLowerCase();
                                    var hm = (theDev.hwmode || '').toLowerCase();

                                    if (bd === '5g' || bd === '6g') { is5G = true; }
                                    else if (bd === '2g') { is5G = false; }
                                    else if (!isNaN(ch) && ch >= 36) { is5G = true; }
                                    else if (!isNaN(ch) && ch > 0 && ch <= 14) { is5G = false; }
                                    else if (ht.indexOf('80') !== -1 || ht.indexOf('160') !== -1 || ht.indexOf('320') !== -1) { is5G = true; }
                                    else if (hm === '11a' || hm === '11ac') { is5G = true; }
                                    else if (hm === '11g' || hm === '11b') { is5G = false; }
                                    else { is5G = (theDev['.name'] === 'radio0'); }

                                    var isLegacy = (hm === '11b');

                                    var allIfaces = wIfaces.filter(function(i) { return i.device === theDev['.name']; });
                                    var activeIface = allIfaces.find(function(i) { return i.disabled !== '1' && i.mode === 'ap'; }) || allIfaces[0];
                                    var inactiveIface = activeIface ? allIfaces.find(function(i) { return i['.name'] !== activeIface['.name'] && i.mode === 'ap'; }) : null;

                                    var actSsid = activeIface ? (activeIface.ssid || '') : '';
                                    var actKey = activeIface ? (activeIface.key || '') : '';
                                    var actEnc = activeIface ? (activeIface.encryption || 'psk2+sae') : 'psk2+sae';
                                    if (actEnc === 'sae-mixed') actEnc = 'psk2+sae';
                                    var actHidden = activeIface ? (activeIface.hidden === '1') : false;
                                    var actDisabled = activeIface ? (activeIface.disabled === '1' || theDev.disabled === '1') : true;

                                    var inactSsid = inactiveIface ? (inactiveIface.ssid || '') : '';
                                    var inactKey = inactiveIface ? (inactiveIface.key || '') : '';
                                    var inactEnc = inactiveIface ? (inactiveIface.encryption || 'psk2+sae') : 'psk2+sae';
                                    if (inactEnc === 'sae-mixed') inactEnc = 'psk2+sae';
                                    var inactHidden = inactiveIface ? (inactiveIface.hidden === '1') : false;

                                    var chan = theDev.channel || 'auto';
                                    var bwMatch = ht.match(/\d+/);
                                    var bw = bwMatch ? bwMatch[0] : 'auto';
                                    
                                    var pMode = 'auto';
                                    if (ht.indexOf('eht') !== -1) pMode = '11be';
                                    else if (ht.indexOf('he') !== -1) pMode = '11ax';
                                    else if (ht.indexOf('vht') !== -1) pMode = '11ac';
                                    else if (ht.indexOf('ht') !== -1) pMode = (hm.indexOf('a') !== -1 || is5G) ? '11a' : '11g';
                                    else if (hm === '11b') pMode = '11b';

                                    if (is5G) {
                                        container.querySelector('#wifi-5g-en').checked = !actDisabled;
                                        container.querySelector('#wifi-5g-ssid').value = actSsid;
                                        container.querySelector('#wifi-5g-key').value = actKey;
                                        var enc5gEl = container.querySelector('#wifi-5g-enc'); if(enc5gEl.querySelector('option[value="'+actEnc+'"]')) enc5gEl.value = actEnc;
                                        container.querySelector('#wifi-5g-hidden').checked = actHidden;
                                        var chanEl = container.querySelector('#wifi-5g-chan'); if(chanEl.querySelector('option[value="'+chan+'"]')) chanEl.value = chan;
                                        var bwEl = container.querySelector('#wifi-5g-bw'); if(bwEl.querySelector('option[value="'+bw+'"]')) bwEl.value = bw;
                                        var mEl = container.querySelector('#wifi-5g-mode'); if(mEl.querySelector('option[value="'+pMode+'"]')) mEl.value = pMode;
                                        legacyToggle.checked = false;

                                        container.querySelector('#wifi-2g-en').checked = false;
                                        if (inactiveIface && inactSsid) {
                                            container.querySelector('#wifi-2g-ssid').value = (inactSsid === actSsid) ? smartConvertSsid(actSsid, '2g') : inactSsid;
                                            container.querySelector('#wifi-2g-key').value = inactKey;
                                            var enc2gEl = container.querySelector('#wifi-2g-enc'); if(enc2gEl.querySelector('option[value="'+inactEnc+'"]')) enc2gEl.value = inactEnc;
                                            container.querySelector('#wifi-2g-hidden').checked = inactHidden;
                                        } else {
                                            container.querySelector('#wifi-2g-ssid').value = smartConvertSsid(actSsid, '2g');
                                            container.querySelector('#wifi-2g-key').value = actKey;
                                            var enc2gEl = container.querySelector('#wifi-2g-enc'); if(enc2gEl.querySelector('option[value="'+actEnc+'"]')) enc2gEl.value = actEnc;
                                            container.querySelector('#wifi-2g-hidden').checked = false;
                                        }
                                        setTimeout(function(){ container.querySelector('#tab-5g').click(); }, 50);
                                    } else {
                                        container.querySelector('#wifi-2g-en').checked = !actDisabled;
                                        container.querySelector('#wifi-2g-ssid').value = actSsid;
                                        container.querySelector('#wifi-2g-key').value = actKey;
                                        var enc2gEl = container.querySelector('#wifi-2g-enc'); if(enc2gEl.querySelector('option[value="'+actEnc+'"]')) enc2gEl.value = actEnc;
                                        container.querySelector('#wifi-2g-hidden').checked = actHidden;
                                        var chanEl = container.querySelector('#wifi-2g-chan'); if(chanEl.querySelector('option[value="'+chan+'"]')) chanEl.value = chan;
                                        var bwEl = container.querySelector('#wifi-2g-bw'); if(bwEl.querySelector('option[value="'+bw+'"]')) bwEl.value = bw;
                                        var mEl = container.querySelector('#wifi-2g-mode'); if(mEl.querySelector('option[value="'+pMode+'"]')) mEl.value = pMode;
                                        legacyToggle.checked = isLegacy;

                                        container.querySelector('#wifi-5g-en').checked = false;
                                        if (inactiveIface && inactSsid) {
                                            container.querySelector('#wifi-5g-ssid').value = (inactSsid === actSsid) ? smartConvertSsid(actSsid, '5g') : inactSsid;
                                            container.querySelector('#wifi-5g-key').value = inactKey;
                                            var enc5gEl = container.querySelector('#wifi-5g-enc'); if(enc5gEl.querySelector('option[value="'+inactEnc+'"]')) enc5gEl.value = inactEnc;
                                            container.querySelector('#wifi-5g-hidden').checked = inactHidden;
                                        } else {
                                            container.querySelector('#wifi-5g-ssid').value = smartConvertSsid(actSsid, '5g');
                                            container.querySelector('#wifi-5g-key').value = actKey;
                                            var enc5gEl = container.querySelector('#wifi-5g-enc'); if(enc5gEl.querySelector('option[value="'+actEnc+'"]')) enc5gEl.value = actEnc;
                                            container.querySelector('#wifi-5g-hidden').checked = false;
                                        }
                                        setTimeout(function(){ container.querySelector('#tab-2g').click(); }, 50);
                                    }
                                } else {
                                    window._isSingleChip = false;
                                    var dev2g = null, dev5g = null;
                                    
                                    wDevs.forEach(function(d) {
                                        var bd = (d.band || '').toLowerCase();
                                        var ht = (d.htmode || '').toLowerCase();
                                        var hm = (d.hwmode || '').toLowerCase();
                                        var path = (d.path || '').toLowerCase();
                                        var ch = parseInt(d.channel);
                                        var is_5g_chip = false;
                                        
                                        if (bd === '5g' || bd === '6g') { is_5g_chip = true; }
                                        else if (bd === '2g') { is_5g_chip = false; }
                                        else if (!isNaN(ch) && ch >= 36) { is_5g_chip = true; }
                                        else if (ht.indexOf('80') !== -1 || ht.indexOf('160') !== -1 || ht.indexOf('320') !== -1) { is_5g_chip = true; }
                                        else if (hm === '11a' || hm === '11ac') { is_5g_chip = true; }
                                        else if (hm === '11ax' || hm === '11be') { 
                                            if (d['.name'] === 'radio0' || d['.name'] === 'radio1' || d['.name'] === 'radio2') is_5g_chip = true; 
                                        }
                                        else if (hm === '11g' || hm === '11b') { is_5g_chip = false; }
                                        else if (d.path && (d.path.indexOf('pcie1') !== -1 || d.path.indexOf('pcie2') !== -1)) { is_5g_chip = true; }

                                        if (is_5g_chip) { if (!dev5g) dev5g = d; } 
                                        else { if (!dev2g) dev2g = d; }
                                    });
                                    
                                    if(!dev2g && wDevs.length > 0) dev2g = wDevs[0];
                                    if(!dev5g && wDevs.length > 1) dev5g = wDevs.find(d => d['.name'] !== dev2g['.name']);
                                    if(dev2g && dev5g && dev2g['.name'] === dev5g['.name']) {
                                        dev5g = wDevs.find(d => d['.name'] !== dev2g['.name']);
                                    }
                                    
                                    var i2g = findMainIfaceForDev(dev2g ? dev2g['.name'] : 'none');
                                    var i5g = findMainIfaceForDev(dev5g ? dev5g['.name'] : 'none');

                                    var isLegacy = dev2g && dev2g.hwmode === '11b';
                                    
                                    var s2 = i2g.ssid || '', k2 = i2g.key || '';
                                    var e2 = i2g.encryption || 'psk2+sae'; if (e2 === 'sae-mixed') e2 = 'psk2+sae';
                                    var h2 = i2g.hidden === '1';
                                    var d2 = (i2g.disabled === '1' || (dev2g && dev2g.disabled === '1'));

                                    var s5 = i5g.ssid || '', k5 = i5g.key || '';
                                    var e5 = i5g.encryption || 'psk2+sae'; if (e5 === 'sae-mixed') e5 = 'psk2+sae';
                                    var h5 = i5g.hidden === '1';
                                    var d5 = (i5g.disabled === '1' || (dev5g && dev5g.disabled === '1'));
                                    
                                    var isSmart = (!isLegacy && s2 && s5 && s2 === s5 && k2 === k5 && e2 === e5);
                                    if (!s2 && !s5 && !d2 && !d5) isSmart = true;

                                    legacyToggle.checked = isLegacy;
                                    smartToggle.checked = isSmart;

                                    if (isSmart) {
                                        container.querySelector('#wifi-smart-en').checked = (!d2 && !d5);
                                        container.querySelector('#wifi-smart-ssid').value = s2;
                                        container.querySelector('#wifi-smart-key').value = k2;
                                        container.querySelector('#wifi-smart-enc').value = e2;
                                        container.querySelector('#wifi-smart-hidden').checked = h2;
                                    } else {
                                        container.querySelector('#wifi-2g-en').checked = !d2;
                                        container.querySelector('#wifi-2g-ssid').value = s2;
                                        container.querySelector('#wifi-2g-key').value = k2;
                                        container.querySelector('#wifi-2g-enc').value = e2;
                                        container.querySelector('#wifi-2g-hidden').checked = h2;
                                        if (dev2g) {
                                            var chanEl2 = container.querySelector('#wifi-2g-chan'); if(chanEl2.querySelector('option[value="'+(dev2g.channel||'auto')+'"]')) chanEl2.value = (dev2g.channel||'auto');
                                            var bwM2 = (dev2g.htmode||'').match(/\d+/); var bw2 = bwM2 ? bwM2[0] : 'auto';
                                            var bwEl2 = container.querySelector('#wifi-2g-bw'); if(bwEl2.querySelector('option[value="'+bw2+'"]')) bwEl2.value = bw2;
                                            
                                            var ht2 = (dev2g.htmode||'').toLowerCase(), hm2 = (dev2g.hwmode||'').toLowerCase(), md2 = 'auto';
                                            if(ht2.indexOf('eht') !== -1) md2 = '11be'; else if(ht2.indexOf('he') !== -1) md2 = '11ax'; else if(ht2.indexOf('vht') !== -1) md2 = '11ac'; else if(ht2.indexOf('ht') !== -1) md2 = '11g'; else if(hm2 === '11b') md2 = '11b';
                                            var mEl2 = container.querySelector('#wifi-2g-mode'); if(mEl2.querySelector('option[value="'+md2+'"]')) mEl2.value = md2;
                                        }

                                        container.querySelector('#wifi-5g-en').checked = !d5;
                                        container.querySelector('#wifi-5g-ssid').value = s5;
                                        container.querySelector('#wifi-5g-key').value = k5;
                                        container.querySelector('#wifi-5g-enc').value = e5;
                                        container.querySelector('#wifi-5g-hidden').checked = h5;
                                        if (dev5g) {
                                            var chanEl5 = container.querySelector('#wifi-5g-chan'); if(chanEl5.querySelector('option[value="'+(dev5g.channel||'auto')+'"]')) chanEl5.value = (dev5g.channel||'auto');
                                            var bwM5 = (dev5g.htmode||'').match(/\d+/); var bw5 = bwM5 ? bwM5[0] : 'auto';
                                            var bwEl5 = container.querySelector('#wifi-5g-bw'); if(bwEl5.querySelector('option[value="'+bw5+'"]')) bwEl5.value = bw5;
                                            
                                            var ht5 = (dev5g.htmode||'').toLowerCase(), hm5 = (dev5g.hwmode||'').toLowerCase(), md5 = 'auto';
                                            if(ht5.indexOf('eht') !== -1) md5 = '11be'; else if(ht5.indexOf('he') !== -1) md5 = '11ax'; else if(ht5.indexOf('vht') !== -1) md5 = '11ac'; else if(ht5.indexOf('ht') !== -1) md5 = '11a';
                                            var mEl5 = container.querySelector('#wifi-5g-mode'); if(mEl5.querySelector('option[value="'+md5+'"]')) mEl5.value = md5;
                                        }
                                    }
                                    smartToggle.dispatchEvent(new Event('change'));
                                }
                            }

                            function syncRoamUI(ifaceList, devName, targetBand, encId, togId, warnId) {
                                var iface = null;
                                if (window._isSingleChip) {
                                    iface = ifaceList.find(function(i) { return i.device === devName && i.mode === 'ap' && (i['.name'].indexOf(targetBand) !== -1); });
                                    if (!iface) {
                                        var apIfaces = ifaceList.filter(function(i) { return i.device === devName && i.mode === 'ap'; });
                                        iface = (targetBand === '2g') ? apIfaces[0] : (apIfaces[1] || apIfaces[0]);
                                    }
                                } else {
                                    iface = ifaceList.find(function(i) { return i.device === devName && i.mode === 'ap' && i.disabled !== '1'; });
                                    if (!iface) iface = ifaceList.find(function(i) { return i.device === devName && i.mode === 'ap'; });
                                }

                                if (!iface) return;
                                var tog = container.querySelector(togId);
                                var warn = container.querySelector(warnId);
                                var encEl = container.querySelector(encId);
                                if (!tog) return;
                                
                                var rOn = (iface.ieee80211r === '1');
                                tog.checked = rOn;
                                
                                var encVal = encEl ? encEl.value : (iface.encryption || 'psk2');
                                var isDirty = rOn && (iface.mobility_domain !== 'e4d1' || (encVal !== 'psk2+sae' && encVal !== 'sae-mixed'));
                                
                                if (isDirty) {
                                    tog.classList.add('is-dirty'); 
                                    if (warn) warn.style.display = 'block'; 
                                } else {
                                    tog.classList.remove('is-dirty');
                                    if (warn) warn.style.display = 'none';
                                }

                                var keyId = togId.replace('-roaming', '-key'); 
                                var pwdInput = container.querySelector(keyId);
                                var pwdRow = pwdInput ? pwdInput.closest('.nw-value') : null;

                                if (pwdRow) {
                                    var statRow = pwdRow.nextElementSibling;
                                    var isExist = statRow && statRow.classList.contains('nw-roam-status-row');

                                    if (!isExist) {
                                        statRow = document.createElement('div');
                                        statRow.className = 'nw-roam-status-row';
                                        statRow.style.cssText = 'margin-top: 5px; margin-bottom: 15px; ';
                                        pwdRow.parentNode.insertBefore(statRow, pwdRow.nextSibling);
                                    }

                                    if (rOn) {
                                        if (isDirty) {
                                            statRow.innerHTML = "<span title='" + T['DESC_ROAM_DIRTY'] + "' style='display:inline-flex; align-items:center; justify-content:center; background:rgba(16, 185, 129, 0.15); color:#10b981; border: 1px solid #10b981; font-size:14px; padding:6px 10px; border-radius:8px; font-family:sans-serif; cursor:pointer; font-weight:bold; white-space:nowrap; transition:all 0.25s ease; margin:0 auto;'>" + T['TXT_ROAMING_ON'] + "<b style='display:inline-flex; align-items:center; justify-content:center; background:#ef4444; color:#ffffff; width:18px; height:18px; border-radius:50%; font-size:14px; font-family:Arial,sans-serif; font-weight:900; margin-left:6px; line-height:1;'>!</b> <span style='font-size:14px; font-weight:bold; color:#ef4444; margin-left:5px; text-decoration:underline;'>" + T['TXT_CLICK_FIX'] + "</span></span>";
                                        } else {
                                            statRow.innerHTML = "<span style='display:inline-flex; align-items:center; justify-content:center; background:rgba(16, 185, 129, 0.15); color:#10b981; border: 1px solid #10b981; font-size:14px; padding:6px 16px; border-radius:8px; font-family:sans-serif; font-weight:bold; white-space:nowrap; cursor:pointer; transition:all 0.25s ease; margin:0 auto;'>" + T['TXT_ROAMING_ON'] + "</span>";
                                        }

                                        // 悬浮动画增强
                                        var badgeSpan = statRow.querySelector('span');
                                        badgeSpan.onmouseover = function() { this.style.transform = 'translateY(-2px)'; this.style.boxShadow = '0 4px 12px rgba(16,185,129,0.25)'; };
                                        badgeSpan.onmouseout = function() { this.style.transform = 'none'; this.style.boxShadow = 'none'; };
                                        
                                        badgeSpan.onclick = function(e) {
                                            e.stopPropagation();
                                            if (isDirty) alert(T['DESC_ROAM_DIRTY']);
                                            var advPanel = tog.closest('.nw-adv-panel');
                                            var advBtn = advPanel ? advPanel.previousElementSibling : null;
                                            if (advPanel && advPanel.style.display === 'none' && advBtn) {
                                                advBtn.click();
                                            }
                                            setTimeout(function() {
                                                tog.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                                var targetRow = tog.closest('div'); 
                                                if (targetRow) {
                                                    var oldBg = targetRow.style.backgroundColor || 'transparent';
                                                    targetRow.style.transition = 'background-color 0.4s ease';
                                                    targetRow.style.backgroundColor = 'rgba(16, 185, 129, 0.25)';
                                                    targetRow.style.borderRadius = '8px';
                                                    setTimeout(function() {
                                                        targetRow.style.backgroundColor = oldBg;
                                                        setTimeout(function() { targetRow.style.transition = ''; }, 400);
                                                    }, 800); 
                                                }
                                            }, 80); 
                                        };
                                    } else {
                                        statRow.innerHTML = "";
                                    }
                                }
                            }

                            if (window._isSingleChip && wDevs[0]) {
                                syncRoamUI(wIfaces, wDevs[0]['.name'], '2g', '#wifi-2g-enc', '#wifi-2g-roaming', '#roam-warn-2g');
                                syncRoamUI(wIfaces, wDevs[0]['.name'], '5g', '#wifi-5g-enc', '#wifi-5g-roaming', '#roam-warn-5g');
                            } else {
                                if (dev2g) syncRoamUI(wIfaces, dev2g['.name'], '2g', '#wifi-2g-enc', '#wifi-2g-roaming', '#roam-warn-2g');
                                if (dev5g) {
                                    syncRoamUI(wIfaces, dev5g['.name'], '5g', '#wifi-5g-enc', '#wifi-5g-roaming', '#roam-warn-5g');
                                    syncRoamUI(wIfaces, dev5g['.name'], 'smart', '#wifi-smart-enc', '#wifi-smart-roaming', '#roam-warn-smart');
                                }
                            }

                            window._origWifiState = getWifiSnapshot();
                            
                            window._wifiLoaded = true;
                        } catch(ex) { }
                    }

                    var mkB = function(bg, txt) { return "<span style='font-size:14px; background:" + bg + "; color:#fff; padding:5px 10px; border-radius:12px; white-space:nowrap;'>" + txt + "</span>"; };
                    var mkD = function(l1, v1, l2, v2) { return "<span style='white-space:nowrap; margin: 0 10px;'>" + l1 + " <span class='nw-hl'>" + v1 + "</span></span><span style='white-space:nowrap; margin: 0 10px;'>" + l2 + " <span class='nw-hl'>" + v2 + "</span></span>"; };
                    var sTitle = "", sDetails = "", statusBadge = "";
                    
                    if (isBypass) { sTitle = T['STAT_BYPASS']; sDetails = mkD(T['TXT_DEV_IP'], lIp, T['TXT_UP_GW'], lGw); } 
                    else if (wProto === 'pppoe') { sTitle = T['STAT_MAIN_PPPOE']; if (activeWan.up && liveWanIp) { statusBadge = mkB('#10b981', T['BDG_SUCC']); sDetails = mkD(T['TXT_PUB_IP'], liveWanIp, T['TXT_REM_GW'], liveGw); } else { statusBadge = mkB('#ef4444', T['BDG_DIAL']); sDetails = mkD(T['TXT_LAN_IP'], lIp, T['TXT_STATUS'], T['TXT_WAIT_REM']); } } 
                    else if (wProto === 'dhcp') { sTitle = T['STAT_SEC_DHCP']; if (activeWan.up && liveWanIp) { statusBadge = mkB('#10b981', T['BDG_GOT']); sDetails = mkD(T['TXT_WAN_IP'], liveWanIp, T['TXT_UP_GW'], liveGw); } else { statusBadge = mkB('#f59e0b', T['BDG_WAIT']); sDetails = mkD(T['TXT_LAN_IP'], lIp, T['TXT_STATUS'], T['TXT_GET_IP']); } } 
                    else if (wProto === 'static') { sTitle = T['STAT_SEC_STATIC']; statusBadge = activeWan.up ? mkB('#10b981', T['BDG_CONN']) : mkB('#ef4444', T['BDG_UNPLUG']); sDetails = mkD(T['TXT_WAN_IP'], wIp, T['TXT_UP_GW'], wGw); } 
                    else { sTitle = T['STAT_LAN']; sDetails = mkD(T['TXT_LAN_IP'], lIp, T['TXT_DHCP_SRV'], T['TXT_ON']); }
                    
                    window._gotoRoam = function(band, isDirty) {
                        var box = document.getElementById('netwiz-container');
                        if (!box) return;
                        if (isDirty && typeof T !== 'undefined') alert(T['DESC_ROAM_DIRTY']);
                        
                        selectedMode = 'wifi'; 
                        var s1 = box.querySelector('#step-1'), s2 = box.querySelector('#step-2'), s3 = box.querySelector('#step-3');
                        if (s1) s1.style.display = 'none';
                        if (s3) s3.style.display = 'none';
                        if (s2) s2.style.display = 'block';
                        
                        var fRouter = box.querySelector('#fields-router'); if(fRouter) fRouter.style.display = 'none';
                        var fPppoe = box.querySelector('#fields-pppoe'); if(fPppoe) fPppoe.style.display = 'none';
                        var fLan = box.querySelector('#fields-lan'); if(fLan) fLan.style.display = 'none';
                        var fWifi = box.querySelector('#fields-wifi'); if(fWifi) fWifi.style.display = 'block';
                        
                        setTimeout(function() {
                            var isSmart = box.querySelector('#wifi-smart-toggle').checked && !window._isSingleChip;
                            var targetTogId = isSmart ? '#wifi-smart-roaming' : '#wifi-' + band + '-roaming';
                            
                            if (!isSmart) {
                                var tabBtn = box.querySelector('#tab-' + band);
                                if (tabBtn) tabBtn.click(); 
                            }
                            
                            setTimeout(function() {
                                var tog = box.querySelector(targetTogId);
                                if (!tog) return;
                                
                                var advPanel = tog.closest('.nw-adv-panel');
                                var advBtn = advPanel ? advPanel.previousElementSibling : null;
                                if (advPanel && advPanel.style.display === 'none' && advBtn) {
                                    advBtn.click(); 
                                }
                                
                                setTimeout(function() {
                                    tog.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                    var targetRow = tog.closest('div');
                                    if (targetRow) {
                                        var oldBg = targetRow.style.backgroundColor || 'transparent';
                                        targetRow.style.transition = 'background-color 0.4s ease';
                                        targetRow.style.backgroundColor = 'rgba(16, 185, 129, 0.3)';
                                        targetRow.style.borderRadius = '8px';
                                        
                                        setTimeout(function() {
                                            targetRow.style.backgroundColor = oldBg;
                                            setTimeout(function() { targetRow.style.transition = ''; }, 400);
                                        }, 1000); 
                                    }
                                }, 150);
                            }, 100);
                        }, 100);
                    };

                    var ipv6Label = (ipv6Mode === 'server' || ipv6Mode === 'relay') ? '<b style="color:#10b981; padding: 3px 10px; background: #fff; border-radius: 10px;">' + T['TXT_ON'] + '</b>' : '<b style="color:#ef4444; padding: 3px 10px; background: #fff; border-radius: 10px;">' + T['TXT_OFF'] + '</b>';
                    
                    var wDevsList = uci.sections('wireless', 'wifi-device') || [];
                    var wIfacesList = uci.sections('wireless', 'wifi-iface') || [];
                    var activeIfaces = wIfacesList.filter(function(i) { return i.disabled !== '1' && (i.mode === 'ap' || i.mode === 'sta') && i.ssid; });
                    var wifiLines = [];
                    
                    if (activeIfaces.length === 0) {
                        wifiLines.push("<div><span>" + T['TXT_WIFI_STATUS'] + ": </span><b style='color:#ef4444;'>" + T['TXT_OFF'] + "</b></div>");
                    } else {
                        var apIfaces = activeIfaces.filter(function(i) { return i.mode === 'ap'; });
                        var staIfaces = activeIfaces.filter(function(i) { return i.mode === 'sta'; });
                        
                        // 1. 中继网络 (STA) 照常独立显示
                        staIfaces.forEach(function(i) {
                            var sName = escapeHTML(i.ssid);
                            var tLbl = "<b style='color:#10b981; padding:8px 10px; background:#ffffff; border-radius:8px; font-size:14.5px; white-space:nowrap; box-shadow:0 2px 4px rgba(0,0,0,0.1);'>" + T['TXT_WISP_ON'] + "</b>";
                            wifiLines.push("<div style='display:flex; flex-wrap:wrap; align-items:center; justify-content:center; gap:8px 12px; margin-bottom:8px; width:100%; box-sizing:border-box;'><span style='display:inline-flex; flex-wrap:wrap; align-items:center; justify-content:center; max-width:100%;'>" + tLbl + "<span style='font-size:15.5px; opacity:0.9; font-weight:600; margin:0 6px;'>:</span><span class='nw-hl' style='font-size:16.5px; letter-spacing:0.5px; word-break:break-all; white-space:normal; text-align:center;'>" + sName + "</span></span></div>");
                        });

                        // 2. 判断 AP 是否应该合并为“多频合一”显示
                        var isSmartGrouped = false;
                        if (apIfaces.length > 1) {
                            var first = apIfaces[0];
                            isSmartGrouped = apIfaces.every(function(i) {
                                return i.ssid === first.ssid && i.key === first.key;
                            });
                        }

                        if (isSmartGrouped) {
                            // 渲染合并后的单行 UI
                            var i = apIfaces[0];
                            var sName = escapeHTML(i.ssid);
                            var kTxt = i.key ? escapeHTML(i.key) : "<span style='color:#ef4444;'>" + T['TXT_NO_PASS'] + "</span>"; 
                            var tLbl = "<b style='color:#7e22ce; background:#ffffff; padding:8px 10px; border-radius:8px; font-size:14.5px; white-space:nowrap; box-shadow:0 2px 4px rgba(0,0,0,0.1);'>" + T['LBL_SMART_CONN'] + "</b>";
                            var bandStr = 'smart';
                            
                            var rOn = apIfaces.some(function(x) { return x.ieee80211r === '1'; });
                            var isDirty = apIfaces.some(function(x) {
                                var enc = (x.encryption || '').toLowerCase();
                                var md = (x.mobility_domain || '').toLowerCase(); // 增加大小写容错
                                return x.ieee80211r === '1' && (md !== 'e4d1' || (enc !== 'psk2+sae' && enc !== 'sae-mixed'));
                            });
                            
                            var roamBadge = "";
                            if (rOn) {
                                var clickFn = "if(window._gotoRoam){ window._gotoRoam('" + bandStr + "', " + isDirty + "); }";
                                var hoverStyle = "onmouseover=\"this.style.transform='translateY(-2px)'; this.style.boxShadow='0 3px 6px rgba(16,185,129,0.3)'\" onmouseout=\"this.style.transform='none'; this.style.boxShadow='none'\"";
                                if (isDirty) {
                                    roamBadge = "<span title='" + T['DESC_ROAM_DIRTY'] + " - " + T['TXT_CLICK_FIX'] + "' onclick=\"" + clickFn + "\" " + hoverStyle + " style='display:inline-block; white-space:nowrap; background:rgba(16, 185, 129, 0.2); color:#a7f3d0; border: 1px solid #10b981; font-size:11px; padding:2px 6px; border-radius:4px; margin-left:8px; vertical-align:text-bottom; font-family:sans-serif; cursor:pointer; transition:all 0.2s ease;'>" + T['TXT_ROAMING'] + "<b style='display:inline-block; background:#ef4444; color:#ffffff; width:15px; height:15px; line-height:15px; text-align:center; border-radius:50%; font-size:12px; font-family:Arial,sans-serif; font-weight:bold; margin-left:4px;'>!</b></span>";
                                } else {
                                    roamBadge = "<span title='" + T['TXT_CLICK_GOTO'] + "' onclick=\"" + clickFn + "\" " + hoverStyle + " style='display:inline-block; white-space:nowrap; background:rgba(16, 185, 129, 0.2); color:#a7f3d0; border: 1px solid #10b981; font-size:11px; padding:2px 6px; border-radius:4px; margin-left:8px; vertical-align:text-bottom; font-family:sans-serif; cursor:pointer; transition:all 0.2s ease;'>" + T['TXT_ROAMING'] + "</span>";
                                }
                            }
                            wifiLines.push("<div style='display:flex; flex-wrap:wrap; align-items:center; justify-content:center; gap:8px 12px; margin-bottom:8px; width:100%; box-sizing:border-box;'><span style='display:inline-flex; flex-wrap:wrap; align-items:center; justify-content:center; max-width:100%;'><span style='font-size:15.5px; opacity:0.9; font-weight:600; white-space:nowrap;'>" + tLbl + ":</span><span class='nw-hl' style='font-size:16.5px; letter-spacing:0.5px; display:inline-flex; flex-wrap:wrap; justify-content:center; align-items:center; margin-left:6px; word-break:break-all; white-space:normal; text-align:center;'>" + sName + roamBadge + "</span></span><span style='color:#ffffff; font-size:15px; font-weight:600; white-space:nowrap;'>(" + T['M_PWD'] + ": " + kTxt + ")</span></div>");
                        } else {
                            // 3. 渲染独立频段 UI
                            apIfaces.forEach(function(i) {
                                var sName = escapeHTML(i.ssid);
                                var kTxt = i.key ? escapeHTML(i.key) : "<span style='color:#ef4444;'>" + T['TXT_NO_PASS'] + "</span>";
                                var tLbl = "Wi-Fi";
                                var bandStr = '2g';
                                var dObj = wDevsList.find(function(x) { return x['.name'] === i.device; });
                                if (dObj) {
                                    var hw = (dObj.hwmode||'').toLowerCase();
                                    var bd = (dObj.band||'').toLowerCase();
                                    var path = (dObj.path||'').toLowerCase();
                                    if (hw.indexOf('a') !== -1 || bd === '5g' || path.indexOf('pcie1') !== -1 || path.indexOf('pcie2') !== -1) {
                                        tLbl = "<b style='color:#fff;'>" + T['TXT_5G_ACCT'] + "</b>";
                                        bandStr = '5g';
                                    } else {
                                        tLbl = "<b style='color:#fff;'>" + T['TXT_2G_ACCT'] + "</b>";
                                        bandStr = '2g';
                                    }
                                }
                                
                                var rOn = (i.ieee80211r === '1');
                                var enc = (i.encryption || '').toLowerCase();
                                var isDirty = rOn && (i.mobility_domain !== 'e4d1' || (enc !== 'psk2+sae' && enc !== 'sae-mixed'));
                                
                                var roamBadge = "";
                                if (rOn) {
                                    var clickFn = "if(window._gotoRoam){ window._gotoRoam('" + bandStr + "', " + isDirty + "); }";
                                    var hoverStyle = "onmouseover=\"this.style.transform='translateY(-2px)'; this.style.boxShadow='0 3px 6px rgba(16,185,129,0.3)'\" onmouseout=\"this.style.transform='none'; this.style.boxShadow='none'\"";
                                    
                                    if (isDirty) {
                                        roamBadge = "<span title='" + T['DESC_ROAM_DIRTY'] + " - " + T['TXT_CLICK_FIX'] + "' onclick=\"" + clickFn + "\" " + hoverStyle + " style='display:inline-block; white-space:nowrap; background:rgba(16, 185, 129, 0.2); color:#a7f3d0; border: 1px solid #10b981; font-size:11px; padding:2px 6px; border-radius:4px; margin-left:8px; vertical-align:text-bottom; font-family:sans-serif; cursor:pointer; transition:all 0.2s ease;'>" + T['TXT_ROAMING'] + "<b style='display:inline-block; background:#ef4444; color:#ffffff; width:15px; height:15px; line-height:15px; text-align:center; border-radius:50%; font-size:12px; font-family:Arial,sans-serif; font-weight:bold; margin-left:4px;'>!</b></span>";
                                    } else {
                                        roamBadge = "<span title='" + T['TXT_CLICK_GOTO'] + "' onclick=\"" + clickFn + "\" " + hoverStyle + " style='display:inline-block; white-space:nowrap; background:rgba(16, 185, 129, 0.2); color:#a7f3d0; border: 1px solid #10b981; font-size:11px; padding:2px 6px; border-radius:4px; margin-left:8px; vertical-align:text-bottom; font-family:sans-serif; cursor:pointer; transition:all 0.2s ease;'>" + T['TXT_ROAMING'] + "</span>";
                                    }
                                }
                                
                                wifiLines.push("<div style='display:flex; flex-wrap:wrap; align-items:center; justify-content:center; gap:8px 12px; margin-bottom:8px; width:100%; box-sizing:border-box;'><span style='display:inline-flex; flex-wrap:wrap; align-items:center; justify-content:center; max-width:100%;'><span style='font-size:15.5px; opacity:0.9; font-weight:600; white-space:nowrap;'>" + tLbl + ":</span><span class='nw-hl' style='font-size:16.5px; letter-spacing:0.5px; display:inline-flex; flex-wrap:wrap; justify-content:center; align-items:center; margin-left:6px; word-break:break-all; white-space:normal; text-align:center;'>" + sName + roamBadge + "</span></span><span style='color:#ffffff; font-size:15px; font-weight:600; white-space:nowrap;'>(" + T['M_PWD'] + ": " + kTxt + ")</span></div>");
                            });
                        }
                    }
                    
                    var ipv6Html = "<div style='font-size:15.5px; font-weight:bold; color:#ffffff; font-family:monospace; letter-spacing:0.5px; display:flex; flex-wrap:wrap; justify-content:center; align-items:center; line-height: 1.8; margin-top: 6px;'><span style='font-weight: 900; margin-right: 8px;'>IPv6 (DHCPv6): </span>" + ipv6Label + "</div>";
                    var extraInfo = "<div style='margin-top: 16px; padding-top: 18px; border-top: 1px dashed rgba(255,255,255,0.6); font-size:15.5px; color:#ffffff; font-weight: 600; font-family:monospace; display:flex; flex-direction:column; gap:12px; align-items:center;'>";
                    extraInfo += wifiLines.join('');
                    extraInfo += "</div>";

                    if (modeTextEl) modeTextEl.innerHTML = "<div style='font-size:17px; font-weight:600; margin-bottom:12px; color:#ffffff; font-family: monospace; display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 8px;'><span style='white-space:nowrap;'>" + sTitle + "</span>" + statusBadge + "</div>" + "<div style='font-size:15.5px; font-weight:bold; color:#ffffff; font-family:monospace; letter-spacing:0.5px; display:flex; flex-wrap:wrap; justify-content:center; line-height: 1.8;'>" + sDetails + "</div>" + ipv6Html + extraInfo;

                }).catch(function() {});
            } catch(e) {}
        }

        updateStatusDisplay(false);
        setInterval(function() { if (step1.style.display !== 'none' && container.querySelector('#nw-global-modal').style.display === 'none') updateStatusDisplay(true); }, 5000);

        function calculateNetmask(ip) { if (!ip) return '255.255.255.0'; var b = parseInt(ip.split('.')[0], 10); if (b >= 1 && b <= 126) return '255.0.0.0'; if (b >= 128 && b <= 191) return '255.255.0.0'; return '255.255.255.0'; }
        function isValidIP(ip) { if (!ip) return false; var p = ip.split('.'); if (p.length !== 4) return false; for (var i = 0; i < 4; i++) { var n = parseInt(p[i], 10); if (isNaN(n) || n < 0 || n > 255 || String(n) !== p[i]) return false; } if (p[0] === '0' || p[0] === '127') return false; var l = parseInt(p[3], 10); return (l !== 0 && l !== 255); }
        function isSameSubnet(ip1, ip2) { if (!ip1 || !ip2) return false; var p1 = ip1.split('.'), p2 = ip2.split('.'); return (p1.length === 4 && p2.length === 4 && p1[0] === p2[0] && p1[1] === p2[1] && p1[2] === p2[2]); }
        
        function openModal(o) { 
            var m = container.querySelector('#nw-global-modal'); 
            container.querySelector('#nw-global-title').innerHTML = o.title || ''; 
            container.querySelector('#nw-global-msg').innerHTML = o.msg || ''; 
            container.querySelector('#nw-global-spinner').style.display = o.spin ? 'block' : 'none'; 
            var w = container.querySelector('#nw-global-btn-wrap'), ok = container.querySelector('#nw-global-btn-ok'), can = container.querySelector('#nw-global-btn-cancel'); 
            w.style.display = (o.okText || o.cancelText) ? 'flex' : 'none'; 
            if (o.okText) { ok.style.display = 'block'; ok.innerText = o.okText; ok.className = 'nw-u-btn ' + (o.isDanger ? 'nw-u-btn-red' : 'nw-u-btn-blue'); ok.onclick = function() { if (o.onOk) o.onOk(); else m.style.display = 'none'; }; } else ok.style.display = 'none'; 
            if (o.cancelText) { can.style.display = 'block'; can.innerText = o.cancelText; can.onclick = function() { if (o.onCancel) o.onCancel(); else m.style.display = 'none'; }; } else can.style.display = 'none'; 
            m.style.display = 'flex'; 
        }
        
        function returnToStep1() { container.querySelector('#nw-global-modal').style.display = 'none'; step3.style.display = 'none'; step2.style.display = 'none'; step1.style.display = 'block'; }
        
        container.querySelectorAll('.nw-adv-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var panel = this.nextElementSibling;
                if (panel.style.display === 'none') {
                    panel.style.display = 'block';
                    this.innerHTML = '▲ ' + T['LBL_ADVANCED_CLOSE'];
                } else {
                    panel.style.display = 'none';
                    this.innerHTML = '▼ ' + T['LBL_ADVANCED'];
                }
            });
        });

        var modeWarnHandler = function(e) {
            var el = e.target;
            if (el.value !== 'auto') {
                openModal({
                    title: T['M_MODE_WARN_TIT'],
                    msg: T['M_MODE_WARN_MSG'],
                    cancelText: T['M_CLOSE'],
                    okText: T['M_WARN_BTN'],
                    isDanger: true,
                    onCancel: function() { el.value = 'auto'; container.querySelector('#nw-global-modal').style.display = 'none'; },
                    onOk: function() { container.querySelector('#nw-global-modal').style.display = 'none'; }
                });
            }
        };
        container.querySelector('#wifi-2g-mode').addEventListener('change', modeWarnHandler);
        container.querySelector('#wifi-5g-mode').addEventListener('change', modeWarnHandler);

        container.querySelectorAll('input[name="router_type"]').forEach(function(r) { r.addEventListener('change', function() { container.querySelector('#router-static-fields').style.display = (this.value === 'static') ? 'block' : 'none'; }); });
        
        var bypassToggle = container.querySelector('#lan-bypass-toggle');
        bypassToggle.addEventListener('change', function() { container.querySelector('#lan-bypass-warning').style.display = this.checked ? 'block' : 'none'; container.querySelector('#lan-main-warning').style.display = this.checked ? 'none' : 'block'; });
        
        var smartToggle = container.querySelector('#wifi-smart-toggle');
        var legacyToggle = container.querySelector('#legacy-b-toggle');
        var en2g = container.querySelector('#wifi-2g-en');
        var en5g = container.querySelector('#wifi-5g-en');

        // ===== 动态刷新漫游状态徽章 =====
        var updateRoamBadge = function(togId) {
            var tog = container.querySelector(togId);
            if (!tog) return;
            var keyId = togId.replace('-roaming', '-key'); 
            var pwdInput = container.querySelector(keyId);
            var pwdRow = pwdInput ? pwdInput.closest('.nw-value') : null;

            if (pwdRow) {
                var statRow = pwdRow.nextElementSibling;
                // 如果没有框，创建一个
                if (!statRow || !statRow.classList.contains('nw-roam-status-row')) {
                    statRow = document.createElement('div');
                    statRow.className = 'nw-roam-status-row';
                    statRow.style.cssText = 'margin-top: 5px; margin-bottom: 15px; ';
                    pwdRow.parentNode.insertBefore(statRow, pwdRow.nextSibling);
                }

                if (tog.checked) {
                    var isDirty = tog.classList.contains('is-dirty');
                    if (isDirty) {
                        statRow.innerHTML = "<span title='" + (T['DESC_ROAM_DIRTY']||'') + "' style='display:inline-flex; align-items:center; justify-content:center; background:rgba(16, 185, 129, 0.15); color:#10b981; border: 1px solid #10b981; font-size:14px; padding:6px 10px; border-radius:8px; font-family:sans-serif; cursor:pointer; font-weight:bold; white-space:nowrap; transition:all 0.25s ease; margin:0 auto;'>" + (T['TXT_ROAMING_ON']||'已开通漫游') + "<b style='display:inline-flex; align-items:center; justify-content:center; background:#ef4444; color:#ffffff; width:18px; height:18px; border-radius:50%; font-size:14px; font-family:Arial,sans-serif; font-weight:900; margin-left:6px; line-height:1;'>!</b> <span style='font-size:14px; font-weight:bold; color:#ef4444; margin-left:5px; text-decoration:underline;'>" + (T['TXT_CLICK_FIX']||'点击修复') + "</span></span>";
                    } else {
                        statRow.innerHTML = "<span style='display:inline-flex; align-items:center; justify-content:center; background:rgba(16, 185, 129, 0.15); color:#10b981; border: 1px solid #10b981; font-size:14px; padding:6px 16px; border-radius:8px; font-family:sans-serif; font-weight:bold; white-space:nowrap; cursor:pointer; transition:all 0.25s ease; margin:0 auto;'>" + (T['TXT_ROAMING_ON']||'已开通漫游') + "</span>";
                    }

                    var badgeSpan = statRow.querySelector('span');
                    badgeSpan.onmouseover = function() { this.style.transform = 'translateY(-2px)'; this.style.boxShadow = '0 4px 12px rgba(16,185,129,0.25)'; };
                    badgeSpan.onmouseout = function() { this.style.transform = 'none'; this.style.boxShadow = 'none'; };
                    
                    badgeSpan.onclick = function(e) {
                        e.stopPropagation();
                        if (isDirty) alert(T['DESC_ROAM_DIRTY']);
                        var advPanel = tog.closest('.nw-adv-panel');
                        var advBtn = advPanel ? advPanel.previousElementSibling : null;
                        if (advPanel && advPanel.style.display === 'none' && advBtn) advBtn.click();
                        setTimeout(function() {
                            tog.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            var targetRow = tog.closest('div'); 
                            if (targetRow) {
                                var oldBg = targetRow.style.backgroundColor || 'transparent';
                                targetRow.style.transition = 'background-color 0.4s ease';
                                targetRow.style.backgroundColor = 'rgba(16, 185, 129, 0.25)';
                                targetRow.style.borderRadius = '8px';
                                setTimeout(function() {
                                    targetRow.style.backgroundColor = oldBg;
                                    setTimeout(function() { targetRow.style.transition = ''; }, 400);
                                }, 800); 
                            }
                        }, 80); 
                    };
                    statRow.style.display = 'block'; // 显示徽章
                } else {
                    statRow.innerHTML = "";
                    statRow.style.display = 'none'; // 彻底隐藏徽章
                }
            }
        };
        // ==========================================

        // ===== 密码与加密方式双向联动 =====
        var syncEncryption = function(keyInputId, encSelectId) {
            var keyEl = container.querySelector(keyInputId);
            var encEl = container.querySelector(encSelectId);
            if (keyEl && encEl) {
                // 1. 密码框输入 -> 影响下拉框
                keyEl.addEventListener('input', function() {
                    if (this.value.length > 0 && encEl.value === 'none') {
                        encEl.value = 'psk2+sae'; 
                    } else if (this.value.length === 0 && encEl.value !== 'none') {
                        encEl.value = 'none'; 
                    }
                });
                // 2. 下拉框选择 -> 影响密码框
                encEl.addEventListener('change', function() {
                    if (this.value === 'none') {
                        keyEl.value = ''; // 如果手动选了无密码，强行清空密码框，防止数据残留
                    }
                });
            }
        };
        
        // 绑定三个面板的密码输入框和加密下拉框
        syncEncryption('#wifi-smart-key', '#wifi-smart-enc');
        syncEncryption('#wifi-2g-key', '#wifi-2g-enc');
        syncEncryption('#wifi-5g-key', '#wifi-5g-enc');
        // ===== 结束 =====

        // 联动与自动切换标签页
        en2g.addEventListener('change', function() { 
            container.querySelector('#tab-2g').click(); 
            
            if (this.checked && window._isSingleChip) {
                en5g.checked = false; 
                var s2El = container.querySelector('#wifi-2g-ssid');
                var s5 = container.querySelector('#wifi-5g-ssid').value;
                // 不仅为空时推断，名字一样，强制加后缀拆分
                if ((!s2El.value || s2El.value === s5) && s5) {
                    s2El.value = smartConvertSsid(s5, '2g');
                    if (!container.querySelector('#wifi-2g-key').value) container.querySelector('#wifi-2g-key').value = container.querySelector('#wifi-5g-key').value;
                    container.querySelector('#wifi-2g-enc').value = container.querySelector('#wifi-5g-enc').value;
                }
            }
        });
        
        en5g.addEventListener('change', function() { 
            container.querySelector('#tab-5g').click(); 
            
            if (this.checked && window._isSingleChip) {
                en2g.checked = false; 
                var s5El = container.querySelector('#wifi-5g-ssid');
                var s2 = container.querySelector('#wifi-2g-ssid').value;
                // 不仅为空时推断，名字一样，强制加后缀拆分
                if ((!s5El.value || s5El.value === s2) && s2) {
                    s5El.value = smartConvertSsid(s2, '5g');
                    if (!container.querySelector('#wifi-5g-key').value) container.querySelector('#wifi-5g-key').value = container.querySelector('#wifi-2g-key').value;
                    container.querySelector('#wifi-5g-enc').value = container.querySelector('#wifi-2g-enc').value;
                }
            }
        });

        smartToggle.addEventListener('change', function(e) {
            var isSmart = this.checked;
            var smartUi = container.querySelector('#wifi-smart-ui');
            var splitUi = container.querySelector('#wifi-split-ui');
            
            if (isSmart) {
                // 切换为多频合一
                smartUi.style.display = 'block';
                splitUi.style.display = 'none';

                // 防止系统自动触发时覆盖数据
                if (!e.isTrusted) return;

                // 备份现有的独立账号密码及漫游状态
                var roam2gEl = container.querySelector('#wifi-2g-roaming');
                var roam5gEl = container.querySelector('#wifi-5g-roaming');
                window._backupSplit = {
                    s2: container.querySelector('#wifi-2g-ssid').value,
                    k2: container.querySelector('#wifi-2g-key').value,
                    e2: container.querySelector('#wifi-2g-enc').value,
                    r2: roam2gEl ? roam2gEl.checked : false, // 备份 2.4G 漫游状态
                    s5: container.querySelector('#wifi-5g-ssid').value,
                    k5: container.querySelector('#wifi-5g-key').value,
                    e5: container.querySelector('#wifi-5g-enc').value,
                    r5: roam5gEl ? roam5gEl.checked : true   // 备份 5G 漫游状态
                };

                // 获取已开启频段的信息优先5G
                var en2 = container.querySelector('#wifi-2g-en').checked;
                var en5 = container.querySelector('#wifi-5g-en').checked;
                var pickBand = (en5 || !en2) ? '5g' : '2g'; 
                
                var pickSsid = container.querySelector('#wifi-' + pickBand + '-ssid').value;
                var pickKey = container.querySelector('#wifi-' + pickBand + '-key').value;
                var pickEnc = container.querySelector('#wifi-' + pickBand + '-enc').value;
                
                // 去除后缀并回填数据
                var smartSsidEl = container.querySelector('#wifi-smart-ssid');
                if (pickSsid && !smartSsidEl.dataset.initialized) {
                    smartSsidEl.value = cleanSsidSuffix(pickSsid);
                    container.querySelector('#wifi-smart-key').value = pickKey;
                    container.querySelector('#wifi-smart-enc').value = pickEnc;
                    smartSsidEl.dataset.initialized = 'true'; 
                }
                // 切换为合一模式时，强行开启漫游开关，并同步清理报警
                var rSmartEl = container.querySelector('#wifi-smart-roaming');
                if (rSmartEl) { 
                    rSmartEl.checked = true; 
                    rSmartEl.dispatchEvent(new Event('change')); 
                }

            } else {
                // 切换为独立频段
                smartUi.style.display = 'none';
                splitUi.style.display = 'block';

                // 防止系统加载时覆盖底层数据
                if (!e.isTrusted) return;

                // 恢复之前备份的独立账号密码及漫游状态
                var targetRoam2g = false; // 2.4G 漫游默认安全关闭
                var targetRoam5g = true;  // 5G 漫游默认开启
                
                if (window._backupSplit && (window._backupSplit.s2 || window._backupSplit.s5)) {
                    container.querySelector('#wifi-2g-ssid').value = window._backupSplit.s2;
                    container.querySelector('#wifi-2g-key').value = window._backupSplit.k2;
                    container.querySelector('#wifi-2g-enc').value = window._backupSplit.e2;
                    // targetRoam2g = window._backupSplit.r2; // 强制使用默认值 false
                    
                    container.querySelector('#wifi-5g-ssid').value = window._backupSplit.s5;
                    container.querySelector('#wifi-5g-key').value = window._backupSplit.k5;
                    container.querySelector('#wifi-5g-enc').value = window._backupSplit.e5;
                    // targetRoam5g = window._backupSplit.r5; // 强制使用默认值 true
                } else {
                    // 无备份时自动生成独立名称
                    var baseSsid = container.querySelector('#wifi-smart-ssid').value;
                    var baseKey = container.querySelector('#wifi-smart-key').value;
                    var baseEnc = container.querySelector('#wifi-smart-enc').value;
                    
                    container.querySelector('#wifi-2g-ssid').value = smartConvertSsid(baseSsid, '2g');
                    container.querySelector('#wifi-2g-key').value = baseKey;
                    container.querySelector('#wifi-2g-enc').value = baseEnc;
                    
                    container.querySelector('#wifi-5g-ssid').value = smartConvertSsid(baseSsid, '5g');
                    container.querySelector('#wifi-5g-key').value = baseKey;
                    container.querySelector('#wifi-5g-enc').value = baseEnc;
                }
                
                // 应用漫游开关状态，并触发 change 事件以同步 UI (比如加密方式的降级警告)
                var r2gEl = container.querySelector('#wifi-2g-roaming');
                if (r2gEl) { r2gEl.checked = targetRoam2g; r2gEl.dispatchEvent(new Event('change')); }
                var r5gEl = container.querySelector('#wifi-5g-roaming');
                if (r5gEl) { r5gEl.checked = targetRoam5g; r5gEl.dispatchEvent(new Event('change')); }
            }
        });

        legacyToggle.addEventListener('change', function() {
            if (this.checked && smartToggle.checked) {
                smartToggle.checked = false;
                smartToggle.dispatchEvent(new Event('change'));
            }
        });
        
        container.querySelector('#tab-2g').addEventListener('click', function() {
            this.style.background = '#3b82f6'; this.style.color = '#fff';
            container.querySelector('#tab-5g').style.background = '#f1f5f9'; container.querySelector('#tab-5g').style.color = '#475569';
            container.querySelector('#wifi-2g-form').style.display = 'block';
            container.querySelector('#wifi-5g-form').style.display = 'none';
            
            var s2El = container.querySelector('#wifi-2g-ssid');
            var s5 = container.querySelector('#wifi-5g-ssid').value;
            // 为空或者同名时触发后缀保护
            if ((!s2El.value || s2El.value === s5) && s5) {
                s2El.value = smartConvertSsid(s5, '2g');
                if(!container.querySelector('#wifi-2g-key').value) container.querySelector('#wifi-2g-key').value = container.querySelector('#wifi-5g-key').value;
            }
        });
        
        container.querySelector('#tab-5g').addEventListener('click', function() {
            this.style.background = '#3b82f6'; this.style.color = '#fff';
            container.querySelector('#tab-2g').style.background = '#f1f5f9'; container.querySelector('#tab-2g').style.color = '#475569';
            container.querySelector('#wifi-5g-form').style.display = 'block';
            container.querySelector('#wifi-2g-form').style.display = 'none';
            
            var s5El = container.querySelector('#wifi-5g-ssid');
            var s2 = container.querySelector('#wifi-2g-ssid').value;
            // 为空或者同名时触发后缀保护
            if ((!s5El.value || s5El.value === s2) && s2) {
                s5El.value = smartConvertSsid(s2, '5g');
                if(!container.querySelector('#wifi-5g-key').value) container.querySelector('#wifi-5g-key').value = container.querySelector('#wifi-2g-key').value;
            }
        });

        // ===== 漫游与加密方式联动 =====
        // 1. 多频合一面板联动
        var smartRoamingToggle = container.querySelector('#wifi-smart-roaming');
        if (smartRoamingToggle) {
            smartRoamingToggle.addEventListener('change', function(e) {
                // 移除 isTrusted 限制，允许程序自动切换时触发联动修复
                if (this.classList.contains('is-dirty')) {
                    this.classList.remove('is-dirty'); 
                    window._forceWifiSubmit = true; 
                }
                var warn = container.querySelector('#roam-warn-smart');
                if (warn) warn.style.display = 'none'; 
                
                if (this.checked) {
                    var encSelect = container.querySelector('#wifi-smart-enc');
                    if (encSelect && encSelect.value !== 'psk2+sae') encSelect.value = 'psk2+sae';
                }
                updateRoamBadge('#wifi-smart-roaming');
            });
        }

        // 2. 2.4G 独立面板联动
        var r2gToggle = container.querySelector('#wifi-2g-roaming');
        if (r2gToggle) {
            r2gToggle.addEventListener('change', function(e) {
                if (this.classList.contains('is-dirty')) {
                    this.classList.remove('is-dirty');
                    window._forceWifiSubmit = true;
                }
                var warn = container.querySelector('#roam-warn-2g');
                if (warn) warn.style.display = 'none';

                if (this.checked) {
                    var encSelect = container.querySelector('#wifi-2g-enc');
                    if (encSelect && encSelect.value !== 'psk2+sae') encSelect.value = 'psk2+sae';
                }
                updateRoamBadge('#wifi-2g-roaming');
            });
        }

        // 3. 5G 独立面板联动
        var r5gToggle = container.querySelector('#wifi-5g-roaming');
        if (r5gToggle) {
            r5gToggle.addEventListener('change', function(e) {
                if (this.classList.contains('is-dirty')) {
                    this.classList.remove('is-dirty');
                    window._forceWifiSubmit = true;
                }
                var warn = container.querySelector('#roam-warn-5g');
                if (warn) warn.style.display = 'none';

                if (this.checked) {
                    var encSelect = container.querySelector('#wifi-5g-enc');
                    if (encSelect && encSelect.value !== 'psk2+sae') encSelect.value = 'psk2+sae';
                }
                updateRoamBadge('#wifi-5g-roaming');
            });
        }
        // ==================================

        // WISP 交互与扫描逻辑
        var wispToggle = container.querySelector('#wisp-toggle');
        var wispUiPanel = container.querySelector('#wisp-ui-panel');
        var scanBtn = container.querySelector('#btn-wisp-scan');
        var wispModal = container.querySelector('#wisp-scan-modal');
        
        if (wispToggle) {
            wispToggle.addEventListener('change', function(e) {
                wispUiPanel.style.display = this.checked ? 'flex' : 'none';
                
                // 鼠标真实点击，且打开开关时才触发重置
                if (e && e.isTrusted && this.checked) {
                    
                    // ==== 恢复扫描按钮 ====
                    var btnScanLive = container.querySelector('#btn-wisp-scan');
                    if (btnScanLive) {
                        btnScanLive.style.display = 'block';
                    }
                    
                    // 隐藏密码输入框
                    var selectedInfo = container.querySelector('#wisp-selected-info');
                    if (selectedInfo) selectedInfo.style.display = 'none';
                }
            });
            container.querySelector('#wisp-modal-close').addEventListener('click', function() { wispModal.style.display = 'none'; });

            scanBtn.addEventListener('click', function(e) {
                e.preventDefault();
                scanBtn.innerText = T['TXT_SCANNING'];
                scanBtn.disabled = true;
                
                // 单芯片用 radio0，多芯片若 5G 有开則优先用 radio1 异频中继)
                var scanDevice = 'radio0'; 
                if (!window._isSingleChip && container.querySelector('#wifi-5g-en').checked) scanDevice = 'radio1'; 
                
                callIwinfoScan(scanDevice).then(function(res) {
                    scanBtn.innerText = T['BTN_SCAN'];
                    scanBtn.disabled = false;

                    var ul = container.querySelector('#wisp-scan-list');
                    ul.innerHTML = '';
                    var list = res || [];
                    // 排序信号
                    list.sort(function(a, b) { return (b.signal || -100) - (a.signal || -100); });

                    if (list.length === 0) {
                        ul.innerHTML = '<li style="padding:20px; text-align:center; color:#64748b;">' + T['TXT_NO_NETWORKS'] + '</li>';
                    } else {
                        var uniqueSsids = {};
                        list.forEach(function(net) {
                            if (!net.ssid || uniqueSsids[net.ssid]) return; 
                            uniqueSsids[net.ssid] = true;
                            
                            var li = document.createElement('li');
                            li.style.cssText = 'padding:15px 20px; border-bottom:1px solid #f1f5f9; cursor:pointer; display:flex; justify-content:space-between; align-items:center; transition:background 0.2s;';
                            li.innerHTML = '<span style="font-weight:600; color:#334155; word-break:break-all; white-space:normal; margin-right:10px; flex:1;">' + net.ssid + '</span><span style="font-size:12px; color:#94a3b8; background:#f1f5f9; padding:2px 8px; border-radius:10px; white-space:nowrap; flex-shrink:0;">' + net.signal + ' dBm</span>';
                            
                            li.onmouseover = function() { this.style.background = '#f8fafc'; };
                            li.onmouseout = function() { this.style.background = 'transparent'; };
                            
                            li.onclick = function(e) {
                                if (e) { e.preventDefault(); e.stopPropagation(); }
                                
                                try {
                                    // 1. 填入 SSID
                                    container.querySelector('#wisp-target-ssid').value = net.ssid || '';
                                    
                                    var encVal = 'none'; // 默认无密码
                                    if (net.encryption) {
                                        // 容错处理：获取完整的描述字符串
                                        var desc = typeof net.encryption === 'string' ? net.encryption : (net.encryption.description || JSON.stringify(net.encryption));
                                        desc = desc.toLowerCase();
                                        
                                        // 强制判定为有密码！
                                        var isExplicitNone = (net.encryption.enabled === false || desc === 'none' || desc === '{"enabled":false}');
                                        
                                        if (!isExplicitNone) {
                                            if (desc.indexOf('wpa3') !== -1 || desc.indexOf('sae') !== -1) {
                                                encVal = 'sae-mixed';
                                            } else {
                                                encVal = 'psk2'; // 绝大多数带密码的网络直接走 WPA2
                                            }
                                        }
                                    }
                                    container.querySelector('#wisp-target-enc').value = encVal;
                                    container.querySelector('#wisp-target-device').value = scanDevice; 
                                    container.querySelector('#wisp-target-bssid').value = net.bssid || '';
                                    
                                    // 3. 界面切换：显示填写面板，隐藏弹窗
                                    container.querySelector('#wisp-selected-info').style.display = 'block';
                                    wispModal.style.display = 'none'; 

                                    var pwdInput = container.querySelector('#wisp-target-key');
                                    var pwdRow = pwdInput ? pwdInput.closest('.nw-value') : null;
                                    
                                    if (encVal === 'none') {
                                        // 如果是开放网络，直接隐藏密码行，并清空历史密码
                                        if (pwdRow) pwdRow.style.display = 'none';
                                        if (pwdInput) pwdInput.value = '';
                                    } else {
                                        // 如果有加密，显示密码行并自动对焦
                                        if (pwdRow) pwdRow.style.display = 'flex';
                                        if (pwdInput) {
                                            setTimeout(function() {
                                                pwdInput.focus();
                                                pwdInput.select();
                                            }, 150);
                                        }
                                    }
                                } catch(err) {
                                    console.error("选取 Wi-Fi 时发生错误:", err);
                                }
                            };
                            
                            ul.appendChild(li);
                        });
                    }
                    wispModal.style.display = 'flex';
                }).catch(function(err) {
                scanBtn.innerText = T['BTN_SCAN'];
                scanBtn.disabled = false;
                    alert(T['TXT_SCAN_FAILED']);
                });
            });
        }
       // 結束

        // 页面切换+置顶函数
        var switchStep = function(hideEl, showEl) {
            hideEl.style.display = 'none'; 
            showEl.style.display = 'block';
            setTimeout(function() {
                smoothScrollToTop(650); // 毫秒自定义动画
            }, 20); // 给浏览器留20ms的重绘时间
        };

        container.querySelectorAll('.nw-card').forEach(function (card) { card.addEventListener('click', function () { 
            selectedMode = card.getAttribute('data-mode'); 
            container.querySelector('#fields-router').style.display = (selectedMode === 'router') ? 'block' : 'none'; 
            container.querySelector('#fields-pppoe').style.display = (selectedMode === 'pppoe') ? 'block' : 'none'; 
            container.querySelector('#fields-lan').style.display = (selectedMode === 'lan') ? 'block' : 'none'; 
            container.querySelector('#fields-wifi').style.display = (selectedMode === 'wifi') ? 'block' : 'none'; 
            switchStep(step1, step2); // 切换并置顶
        }); });
        container.querySelector('#btn-back-1').addEventListener('click', function () { switchStep(step2, step1); });
        container.querySelector('#top-back-1').addEventListener('click', function () { switchStep(step2, step1); });
        container.querySelector('#btn-back-2').addEventListener('click', function () { switchStep(step3, step2); });
        container.querySelector('#top-back-2').addEventListener('click', function () { switchStep(step3, step2); });

        container.querySelector('#btn-next-2').addEventListener('click', function () {
            try {
                var rTypeEl = container.querySelector('input[name="router_type"]:checked');
                var rType = rTypeEl ? rTypeEl.value : 'dhcp';
                var targetIp = '', targetGw = '', isBypass = false;
                
                if (selectedMode === 'lan') { 
                    targetIp = container.querySelector('#lan-ip').value.trim(); 
                    targetGw = container.querySelector('#lan-gw').value.trim(); 
                    isBypass = bypassToggle.checked;
                    if (!targetIp) { openModal({title: T['M_INC_TIT'], msg: T['M_INC_IP'], okText:T['BTN_EDIT']}); return; }
                    if (!isValidIP(targetIp)) { openModal({title:T['M_FMT_TIT'], msg:T['M_FMT_IP'], okText:T['BTN_EDIT']}); return; }
                    if (isBypass) {
                        if (!targetGw) { openModal({title: T['M_LOGIC_TIT'], msg: T['M_LOGIC_BYP'], okText:T['BTN_EDIT']}); return; }
                        if (!isValidIP(targetGw)) { openModal({title: T['M_FMT_TIT'], msg: T['M_FMT_GW'], okText:T['BTN_EDIT']}); return; }
                        if (targetIp === targetGw) { openModal({title: T['M_LOGIC_TIT'], msg: T['M_SAME_BYP'], okText:T['BTN_EDIT']}); return; }
                        if (!isSameSubnet(targetIp, targetGw)) { openModal({title: T['M_SUB_ERR_TIT'], msg: T['M_SUB_ERR_BYP'], okText:T['BTN_EDIT']}); return; }
                    }
                } else if (selectedMode === 'router' && rType === 'static') { 
                    targetIp = container.querySelector('#router-ip').value.trim(); 
                    targetGw = container.querySelector('#router-gw').value.trim();
                    if (!targetIp || !targetGw) { openModal({title:T['M_INC_TIT'], msg:T['M_INC_WAN'], okText:T['BTN_EDIT']}); return; }
                    if (!isValidIP(targetIp) || !isValidIP(targetGw)) { openModal({title:T['M_FMT_TIT'], msg:(!isValidIP(targetIp)?T['M_FMT_WAN']:T['M_FMT_GW']), okText:T['BTN_EDIT']}); return; }
                    if (targetIp === targetGw) { openModal({title: T['M_LOGIC_TIT'], msg: T['M_SAME_GW'], okText:T['BTN_EDIT']}); return; }
                    if (!isSameSubnet(targetIp, targetGw)) { openModal({title: T['M_SUB_ERR_TIT'], msg: T['M_SUB_ERR_WAN1'] + '<br>' + T['M_SUB_ERR_WAN2'].replace('{gw}', targetGw).replace('{ip}', targetGw.substring(0, targetGw.lastIndexOf('.'))), okText:T['BTN_EDIT']}); return; }
                } else if (selectedMode === 'pppoe') { 
                    if (!container.querySelector('#pppoe-user').value.trim() || !container.querySelector('#pppoe-pass').value.trim()) { openModal({title: T['M_INC_TIT'], msg: T['M_INC_PPPOE'], okText: T['BTN_EDIT']}); return; } 
                } else if (selectedMode === 'wifi') {
                    var isSmart = container.querySelector('#wifi-smart-toggle').checked && !window._isSingleChip;
                    if (isSmart) {
                        if (container.querySelector('#wifi-smart-en').checked) {
                            if (!container.querySelector('#wifi-smart-ssid').value.trim()) { openModal({title: T['M_INC_TIT'], msg: T['M_INC_WIFI'], okText: T['BTN_EDIT']}); return; }
                            var k = container.querySelector('#wifi-smart-key').value;
                            var e = container.querySelector('#wifi-smart-enc').value;
                            if (e !== 'none' && (!k || k.length < 8)) { openModal({title: T['M_FMT_TIT'], msg: T['M_PWD_SHORT'], okText: T['BTN_EDIT']}); return; }
                        }
                    } else {
                        if (container.querySelector('#wifi-2g-en').checked) {
                            if (!container.querySelector('#wifi-2g-ssid').value.trim()) { openModal({title: T['M_INC_TIT'], msg: T['M_INC_WIFI'], okText: T['BTN_EDIT']}); return; }
                            var k2 = container.querySelector('#wifi-2g-key').value;
                            var e2 = container.querySelector('#wifi-2g-enc').value;
                            if (e2 !== 'none' && (!k2 || k2.length < 8)) { openModal({title: T['M_FMT_TIT'], msg: T['M_PWD_SHORT'], okText: T['BTN_EDIT']}); return; }
                        }
                        if (container.querySelector('#wifi-5g-en').checked) {
                            if (!container.querySelector('#wifi-5g-ssid').value.trim()) { openModal({title: T['M_INC_TIT'], msg: T['M_INC_WIFI'], okText: T['BTN_EDIT']}); return; }
                            var k5 = container.querySelector('#wifi-5g-key').value;
                            var e5 = container.querySelector('#wifi-5g-enc').value;
                            if (e5 !== 'none' && (!k5 || k5.length < 8)) { openModal({title: T['M_FMT_TIT'], msg: T['M_PWD_SHORT'], okText: T['BTN_EDIT']}); return; }
                        }
                    }
                    // WISP 密码校验
                    var wispTog = container.querySelector('#wisp-toggle');
                    if (wispTog && wispTog.checked) {
                        var wispSsid = container.querySelector('#wisp-target-ssid').value.trim();
                        if (!wispSsid) {
                            openModal({title: T['M_INC_TIT'], msg: T['MODAL_WISP_TITLE'], okText: T['BTN_EDIT']});
                            return;
                        }
                        var wispEnc = container.querySelector('#wisp-target-enc').value;
                        var wispKey = container.querySelector('#wisp-target-key').value;
                        if (wispEnc !== 'none' && (!wispKey || wispKey.length < 8)) {
                            openModal({title: T['M_FMT_TIT'], msg: T['M_PWD_SHORT'], okText: T['BTN_EDIT']});
                            return;
                        }
                    }
                }
                
                uci.load('network').then(function() {
                    try {
                        var currentLanIp = safeUciGet('network', 'lan', 'ipaddr', window.location.hostname).split('/')[0];
                        var currentLanGw = safeUciGet('network', 'lan', 'gateway', '');
                        var currentWanProto = safeUciGet('network', 'wan', 'proto', '').toLowerCase();
                        var currentWanIp = (currentWanProto === 'static') ? safeUciGet('network', 'wan', 'ipaddr', '').split('/')[0] : (window._liveWanIp || '');
                        var currentWanGw = safeUciGet('network', 'wan', 'gateway', '');
                        
                        var currentBypass = (safeUciGet('dhcp', 'lan', 'ignore', '') === '1' ? '1' : '0');
                        var newBypass = bypassToggle.checked ? '1' : '0';

                        var currentDhcpv6 = safeUciGet('dhcp', 'lan', 'dhcpv6', '');
                        var currentIpv6 = (currentDhcpv6 === 'server' || currentDhcpv6 === 'relay') ? '1' : '0';
                        var ipv6El = container.querySelector('#lan-ipv6-toggle');
                        var newIpv6 = (ipv6El && ipv6El.checked) ? '1' : '0';

                        var currentWifiState = getWifiSnapshot();

                        var checkWanIp = (selectedMode === 'router' && rType === 'static') ? targetIp : currentWanIp;
                        var checkLanIp = (selectedMode === 'lan') ? targetIp : currentLanIp;

                        if (checkWanIp && checkLanIp && isSameSubnet(checkWanIp, checkLanIp)) {
                            var cfltMsg = T['M_CFLT_SUB1'].replace('{ip}', checkLanIp) + '<br>' + T['M_CFLT_SUB2'];
                            if (selectedMode === 'router' && rType === 'dhcp') {
                                cfltMsg += '<br><br><span style="color:#ef4444; font-weight:bold;">' + T['M_CFLT_SUGGEST'] + '</span>';
                            }
                            openModal({title: T['M_CFLT_TIT'], msg: cfltMsg, okText: T['BTN_EDIT']});
                            return;
                        }

                        var isNoMod = false;
                        if (selectedMode === 'lan' && targetIp === currentLanIp && targetGw === currentLanGw && newBypass === currentBypass && newIpv6 === currentIpv6) isNoMod = true;
                        if (selectedMode === 'router' && rType === 'static' && targetIp === currentWanIp && targetGw === currentWanGw) isNoMod = true;
                        if (selectedMode === 'router' && rType === 'dhcp' && currentWanProto === 'dhcp') isNoMod = true;
                        if (selectedMode === 'pppoe' && container.querySelector('#pppoe-user').value === safeUciGet('network', 'wan', 'username', '') && container.querySelector('#pppoe-pass').value === safeUciGet('network', 'wan', 'password', '')) isNoMod = true;
                        // 只要相关快照完全一致，且没有提交标记，弹窗拦截
                        if (selectedMode === 'wifi') {
                            if (window._forceWifiSubmit) {
                                isNoMod = false;
                            } else if (window._origWifiState && currentWifiState === window._origWifiState) {
                                isNoMod = true; 
                            }
                        }

                        if (isNoMod) { openModal({title: T['M_NO_MOD_TIT'], msg: T['M_NO_MOD_MSG'], okText: T['M_EXIT'], onOk: returnToStep1 }); return; }
                        
                        var b = function(t, p) { var h = "<div style='text-align:center; font-size:18px; margin-bottom:15px;'>" + t + "</div><div style='background:rgba(0,0,0,0.15); border-radius:8px; padding:10px 15px; font-size:14.5px;'>"; for (var i=0; i < p.length; i++) h += "<div style='display:flex; justify-content:space-between; align-items:flex-start; padding:8px 0; border-bottom:1px solid rgba(255,255,255,0.1); gap:10px;'><span style='opacity:0.8; flex-shrink:0; max-width:45%; word-break:break-word; line-height:1.4;'>" + p[i][0] + "</span><span style='font-family:monospace; word-break:break-word; text-align:right; flex:1; min-width:0;'>" + p[i][1] + "</span></div>"; return h + "</div>"; };

                        // === Diff 高亮渲染带新旧对比助手函数 ===
                        var mkDiff = function(label, newVal, oldVal) {
                            var sNew = String(newVal).trim();
                            var sOld = (oldVal !== undefined && oldVal !== null) ? String(oldVal).trim() : '';
                            
                            // 提取纯文本进行判断
                            var rawOld = sOld.replace(/<[^>]+>/g, '').trim();
                            var isActuallyNew = (rawOld === '' || rawOld === 'undefined' || rawOld === 'null');
                            var isChanged = (sNew !== sOld) && !isActuallyNew;
                            
                            // div 独立成行
                            var highlightBadge = function(txt) {
                                return "<div style='margin-top: 4px;'><span style='font-size: 14px; background: #10b981; color: #fff; padding: 2px 6px; border-radius: 6px; font-weight: bold; box-shadow: 0 2px 4px rgba(16,185,129,0.3); animation: pulse 2s infinite; white-space: nowrap;'>" + txt + "</span></div>";
                            };

                            if (isActuallyNew) {
                                // 文字在上，徽章在下
                                var newHtml = "<div style='display:flex; flex-direction:column; align-items:flex-end; justify-content:center;'>" +
                                                "<div>" + sNew + "</div>" +
                                                highlightBadge(T['TXT_NEW_MOD'] || 'NEW') +
                                              "</div>";
                                return [label, newHtml];
                            } else if (isChanged) {
                                // 旧值 -> 新值 -> 徽章独立在一行
                                var diffHtml = "<div style='display:flex; flex-direction:column; align-items:flex-end; gap:2px; margin-top:2px;'>" +
                                                 "<div style='font-size:14px; text-decoration:line-through; opacity: 0.5;'>" + sOld + "</div>" +
                                                 "<div style='display:flex; align-items:flex-start; justify-content:flex-end; text-align:right;'>" +
                                                   "<span style='color:#10b981; font-weight:bold; margin-right:6px; font-size:16px; line-height:1.2;'>↳</span>" +
                                                   "<div>" + sNew + "</div>" +
                                                 "</div>" +
                                                 highlightBadge(T['TXT_MODIFIED'] || 'OK') +
                                               "</div>";
                                return [label, diffHtml];
                            } else {
                                var dimStyle = "opacity: 0.7; color: rgba(255, 255, 255, 0.85);";
                                return ["<span style='" + dimStyle + "'>" + label + "</span>", "<span style='" + dimStyle + "'>" + sNew + "</span>"];
                            }
                        };
                        // =============================

                        if (selectedMode === 'lan') {
                            confirmText.innerHTML = b(isBypass ? T['MODE_LAN_TITLE']+" - "+T['STAT_BYPASS'] : T['MODE_LAN_TITLE']+" - "+T['STAT_LAN'], [
                                mkDiff(T['TXT_DEV_IP'].replace(':',''), targetIp, currentLanIp), 
                                mkDiff(T['LBL_GW'], targetGw || T['TXT_NOT_SET'], currentLanGw || T['TXT_NOT_SET']), 
                                mkDiff("DHCP", isBypass ? T['TXT_OFF'] : T['TXT_ON'], currentBypass === '1' ? T['TXT_OFF'] : T['TXT_ON']),
                                mkDiff("IPv6 (DHCPv6)", newIpv6 === '1' ? T['TXT_ON'] : T['TXT_OFF'], currentIpv6 === '1' ? T['TXT_ON'] : T['TXT_OFF'])
                            ]);
                        } else if (selectedMode === 'router') {
                            if (rType === 'static') {
                                confirmText.innerHTML = b(T['STAT_SEC_STATIC'], [
                                    mkDiff(T['TXT_WAN_IP'].replace(':',''), targetIp, currentWanIp), 
                                    mkDiff(T['TXT_UP_GW'].replace(':',''), targetGw, currentWanGw)
                                ]);
                            } else {
                                confirmText.innerHTML = b(T['STAT_SEC_DHCP'], [
                                    mkDiff(T['LBL_CONN_TYPE'], T['OPT_DHCP'], currentWanProto === 'dhcp' ? T['OPT_DHCP'] : ''), 
                                    mkDiff(T['M_IP_GW'], T['M_AUTO_UP'], currentWanProto === 'dhcp' ? T['M_AUTO_UP'] : '')
                                ]);
                            }
                        } else if (selectedMode === 'wifi') {
                            var confirmList = [];
                            var sTog = container.querySelector('#wifi-smart-toggle').checked && !window._isSingleChip;
                            var getSelTxt = function(id) { 
                                var e = container.querySelector(id); 
                                return (e && e.options && e.selectedIndex >= 0) ? e.options[e.selectedIndex].text : (e ? e.value : ''); 
                            };
                            
                            // 解析旧状态对象以便对比
                            var oldS = window._origWifiState ? JSON.parse(window._origWifiState) : {};
                            
                            // 兜底，防止多频合一和分开模式互相切换时产生 undefined 污染
                            oldS.s2 = oldS.s2 || ''; oldS.ec2 = oldS.ec2 || '';
                            oldS.s5 = oldS.s5 || ''; oldS.ec5 = oldS.ec5 || '';
                            oldS.ss = oldS.ss || ''; oldS.ecs = oldS.ecs || '';
                            oldS.ws = oldS.ws || '';
                            
                            if (sTog) {
                                var isEn = container.querySelector('#wifi-smart-en').checked;
                                confirmList.push(mkDiff(T['LBL_SMART_CONN'], isEn ? '<b style="color:#10b981;">' + T['TXT_ON'] + '</b>' : '<b style="color:#ef4444;">' + T['TXT_OFF'] + '</b>', oldS.es ? '<b style="color:#10b981;">' + T['TXT_ON'] + '</b>' : '<b style="color:#ef4444;">' + T['TXT_OFF'] + '</b>'));
                                if (isEn) {
                                    confirmList.push(mkDiff('<span style="color:#ffffff; font-weight:500;">SSID</span>', '<span style="font-weight:bold; color:#ffffff;">' + container.querySelector('#wifi-smart-ssid').value + '</span>', '<span style="font-weight:bold; color:#ffffff;">' + oldS.ss + '</span>'));
                                    confirmList.push(mkDiff('<span style="color:#ffffff; font-weight:500;">' + T['LBL_WIFI_ENC'] + '</span>', '<span style="color:#ffffff;">' + getSelTxt('#wifi-smart-enc') + '</span>', '<span style="color:#ffffff;">' + (container.querySelector('#wifi-smart-enc').querySelector('option[value="'+oldS.ecs+'"]') ? container.querySelector('#wifi-smart-enc').querySelector('option[value="'+oldS.ecs+'"]').text : oldS.ecs) + '</span>'));
                                    
                                    var roamNew = container.querySelector('#wifi-smart-roaming').checked;
                                    var roamOld = oldS.rs;
                                    if (roamNew || roamOld) {
                                        confirmList.push(mkDiff('<span style="color:#ffffff; font-weight:500;">' + T['LBL_ROAMING'] + '</span>', roamNew ? '<span style="color:#10b981; font-weight:bold;">' + T['TXT_ON'] + '</span>' : '<span style="color:#ef4444; font-weight:bold;">' + T['TXT_OFF'] + '</span>', roamOld ? '<span style="color:#10b981; font-weight:bold;">' + T['TXT_ON'] + '</span>' : '<span style="color:#ef4444; font-weight:bold;">' + T['TXT_OFF'] + '</span>'));
                                    }
                                    
                                    var hidNew = container.querySelector('#wifi-smart-hidden').checked;
                                    var hidOld = oldS.hs;
                                    if (hidNew || hidOld) {
                                        confirmList.push(mkDiff('<span style="color:#ffffff; font-weight:500;">' + T['LBL_HIDE_SSID'] + '</span>', hidNew ? '<span style="color:#ffffff; font-weight:bold;">' + T['TXT_ON'] + '</span>' : '<span style="color:#ef4444; font-weight:bold;">' + T['TXT_OFF'] + '</span>', hidOld ? '<span style="color:#ffffff; font-weight:bold;">' + T['TXT_ON'] + '</span>' : '<span style="color:#ef4444; font-weight:bold;">' + T['TXT_OFF'] + '</span>'));
                                    }
                                }
                            } else {
                                var en2g = container.querySelector('#wifi-2g-en').checked;
                                confirmList.push(mkDiff('<b style="color:#fde047; font-size:15px;">' + T['TAB_2G'] + '</b>', en2g ? '<b style="color:#10b981;">' + T['TXT_ON'] + '</b>' : '<b style="color:#ef4444;">' + T['TXT_OFF'] + '</b>', oldS.e2 ? '<b style="color:#10b981;">' + T['TXT_ON'] + '</b>' : '<b style="color:#ef4444;">' + T['TXT_OFF'] + '</b>'));
                                if (en2g) {
                                    confirmList.push(mkDiff('<span style="padding-left:12px; color:#ffffff; font-weight:500; opacity:0.95;">└ SSID</span>', '<span style="font-weight:bold; color:#ffffff;">' + container.querySelector('#wifi-2g-ssid').value + '</span>', '<span style="font-weight:bold; color:#ffffff;">' + oldS.s2 + '</span>'));
                                    confirmList.push(mkDiff('<span style="padding-left:12px; color:#ffffff; font-weight:500; opacity:0.95;">└ ' + T['LBL_WIFI_ENC'] + '</span>', '<span style="color:#ffffff;">' + getSelTxt('#wifi-2g-enc') + '</span>', '<span style="color:#ffffff;">' + (container.querySelector('#wifi-2g-enc').querySelector('option[value="'+oldS.ec2+'"]') ? container.querySelector('#wifi-2g-enc').querySelector('option[value="'+oldS.ec2+'"]').text : oldS.ec2) + '</span>'));
                                    
                                    var r2New = container.querySelector('#wifi-2g-roaming').checked;
                                    var r2Old = oldS.r2;
                                    if (r2New || r2Old) {
                                        confirmList.push(mkDiff('<span style="padding-left:12px; color:#ffffff; font-weight:500; opacity:0.95;">└ ' + T['LBL_ROAMING'] + '</span>', r2New ? '<span style="color:#10b981; font-weight:bold;">' + T['TXT_ON'] + '</span>' : '<span style="color:#ef4444; font-weight:bold;">' + T['TXT_OFF'] + '</span>', r2Old ? '<span style="color:#10b981; font-weight:bold;">' + T['TXT_ON'] + '</span>' : '<span style="color:#ef4444; font-weight:bold;">' + T['TXT_OFF'] + '</span>'));
                                    }
                                }
                                
                                var en5g = container.querySelector('#wifi-5g-en').checked;
                                confirmList.push(mkDiff('<b style="color:#67e8f9; font-size:15px;">' + T['TAB_5G'] + '</b>', en5g ? '<b style="color:#10b981;">' + T['TXT_ON'] + '</b>' : '<b style="color:#ef4444;">' + T['TXT_OFF'] + '</b>', oldS.e5 ? '<b style="color:#10b981;">' + T['TXT_ON'] + '</b>' : '<b style="color:#ef4444;">' + T['TXT_OFF'] + '</b>'));
                                if (en5g) {
                                    confirmList.push(mkDiff('<span style="padding-left:12px; color:#ffffff; font-weight:500; opacity:0.95;">└ SSID</span>', '<span style="font-weight:bold; color:#ffffff;">' + container.querySelector('#wifi-5g-ssid').value + '</span>', '<span style="font-weight:bold; color:#ffffff;">' + oldS.s5 + '</span>'));
                                    confirmList.push(mkDiff('<span style="padding-left:12px; color:#ffffff; font-weight:500; opacity:0.95;">└ ' + T['LBL_WIFI_ENC'] + '</span>', '<span style="color:#ffffff;">' + getSelTxt('#wifi-5g-enc') + '</span>', '<span style="color:#ffffff;">' + (container.querySelector('#wifi-5g-enc').querySelector('option[value="'+oldS.ec5+'"]') ? container.querySelector('#wifi-5g-enc').querySelector('option[value="'+oldS.ec5+'"]').text : oldS.ec5) + '</span>'));
                                    
                                    var r5New = container.querySelector('#wifi-5g-roaming').checked;
                                    var r5Old = oldS.r5;
                                    if (r5New || r5Old) {
                                        confirmList.push(mkDiff('<span style="padding-left:12px; color:#ffffff; font-weight:500; opacity:0.95;">└ ' + T['LBL_ROAMING'] + '</span>', r5New ? '<span style="color:#10b981; font-weight:bold;">' + T['TXT_ON'] + '</span>' : '<span style="color:#ef4444; font-weight:bold;">' + T['TXT_OFF'] + '</span>', r5Old ? '<span style="color:#10b981; font-weight:bold;">' + T['TXT_ON'] + '</span>' : '<span style="color:#ef4444; font-weight:bold;">' + T['TXT_OFF'] + '</span>'));
                                    }
                                }
                            }
                            
                            // 中继 (WISP) 的确认信息展示
                            var wTogConfirm = container.querySelector('#wisp-toggle');
                            if (wTogConfirm) {
                                var wNew = wTogConfirm.checked;
                                var wOld = oldS.wt;
                                    if (wNew || wOld) {
                                        confirmList.push(mkDiff('<b style="color:#ffffff; font-size:15px;">🌐 ' + T['LBL_WISP_EN'] + '</b>', wNew ? '<b style="color:#10b981;">' + T['TXT_ON'] + '</b>' : '<b style="color:#ef4444;">' + T['TXT_OFF'] + '</b>', wOld ? '<b style="color:#10b981;">' + T['TXT_ON'] + '</b>' : '<b style="color:#ef4444;">' + T['TXT_OFF'] + '</b>'));
                                        if (wNew) {
                                        confirmList.push(mkDiff('<span style="padding-left:12px; color:#ffffff; font-weight:500; opacity:0.95;">└ ' + T['TXT_TARGET_SSID'] + '</span>', '<span style="font-weight:bold; color:#facc15;">' + container.querySelector('#wisp-target-ssid').value + '</span>', '<span style="font-weight:bold; color:#facc15;">' + oldS.ws + '</span>'));
                                    }
                                }
                            }
                            
                            confirmText.innerHTML = b(T['MODE_WIFI_TITLE'], confirmList);
                        } else {
                            var oldPppoeUser = safeUciGet('network', 'wan', 'username', '');
                            var oldPppoePass = safeUciGet('network', 'wan', 'password', '');
                            confirmText.innerHTML = b(T['MODE_PPPOE_TITLE'], [
                                mkDiff(T['M_ACCT'], container.querySelector('#pppoe-user').value, oldPppoeUser), 
                                mkDiff(T['M_PWD'], container.querySelector('#pppoe-pass').value, oldPppoePass)
                            ]);
                        }
                        
                        if (selectedMode === 'lan' && !isBypass && targetGw !== '') { openModal({ title: T['M_WARN_TIT'], msg: T['M_WARN_MSG'], cancelText: T['BTN_EDIT'], okText: T['M_WARN_BTN'], isDanger: true, onOk: function() { container.querySelector('#nw-global-modal').style.display = 'none'; step2.style.display = 'none'; step3.style.display = 'block'; setTimeout(function(){ smoothScrollToTop(650); }, 20); } }); return; }
                        
                        // ===== Wi-Fi 无密码拦截 =====
                        var hasOpenWifi = false;
                        if (selectedMode === 'wifi') {
                            var checkSmart = container.querySelector('#wifi-smart-toggle').checked && !window._isSingleChip;
                            if (checkSmart) {
                                if (container.querySelector('#wifi-smart-en').checked && container.querySelector('#wifi-smart-enc').value === 'none') hasOpenWifi = true;
                            } else {
                                if (container.querySelector('#wifi-2g-en').checked && container.querySelector('#wifi-2g-enc').value === 'none') hasOpenWifi = true;
                                if (container.querySelector('#wifi-5g-en').checked && container.querySelector('#wifi-5g-enc').value === 'none') hasOpenWifi = true;
                            }
                        }

                        if (hasOpenWifi) {
                            openModal({ 
                                title: T['M_OPEN_WARN_TIT'] || '⚠️ 无密码警告', 
                                msg: T['M_OPEN_WARN_MSG'] || '您正在设置无密码的开放 Wi-Fi，附近任何人都可以随意连接并访问您的网络。<br><br>确定要继续吗？', 
                                cancelText: T['BTN_EDIT'], 
                                okText: T['M_WARN_BTN'], 
                                isDanger: true, 
                                onOk: function() { 
                                    container.querySelector('#nw-global-modal').style.display = 'none'; 
                                    step2.style.display = 'none'; 
                                    step3.style.display = 'block'; 
                                    setTimeout(function(){ smoothScrollToTop(650); }, 20); 
                                } 
                            }); 
                            return; 
                        }
                        // ======================================

                        step2.style.display = 'none'; step3.style.display = 'block';
                        setTimeout(function(){ smoothScrollToTop(650); }, 20);
                    } catch (err) {
                        openModal({ title: T['M_SYS_ERR'], msg: T['M_ERR_DATA_PROC'] + ': ' + err, okText: T['M_CLOSE'] });
                    }
                }).catch(function(e) {
                    openModal({ title: T['M_SYS_ERR'], msg: T['M_SYS_MSG'], okText: T['M_CLOSE'] });
                });
            } catch (err) {
                openModal({ title: T['M_SYS_ERR'], msg: T['M_ERR_VALIDATE'] + ': ' + err, okText: T['M_CLOSE'] });
            }
        });

        var fetchProbe = function(url, ms) {
            return Promise.race([
                fetch(url, { mode: 'no-cors', cache: 'no-store' }),
                new Promise(function(resolve, reject) { setTimeout(function(){ reject(new Error('timeout')); }, ms); })
            ]);
        };

        container.querySelector('#btn-apply').addEventListener('click', function () {
            try {
                var rTypeEl = container.querySelector('input[name="router_type"]:checked');
                var rType = rTypeEl ? rTypeEl.value : 'dhcp';
                var mode = selectedMode, a1 = '', a2 = '', a3 = '', a4 = '', a5 = '1', a6 = '0';
                var actionDetail = "";
                var mTitle = "";
                
                if (selectedMode === 'lan') { 
                    a1 = container.querySelector('#lan-ip').value.trim(); 
                    a2 = container.querySelector('#lan-gw').value.trim(); 
                    a3 = calculateNetmask(a1); 
                    a4 = bypassToggle.checked ? '1' : '0'; 
                    var safeEl = container.querySelector('#lan-safe-toggle'); 
                    a5 = (safeEl && safeEl.checked) ? '1' : '0';
                    var ipv6El = container.querySelector('#lan-ipv6-toggle');
                    a6 = (ipv6El && ipv6El.checked) ? '1' : '0';
                    actionDetail = '<b style="color:#3b82f6;">' + a1 + '</b>';
                    mTitle = bypassToggle.checked ? T['ACT_BYPASS'] : (a1 !== window.location.hostname ? T['ACT_LAN'] : T['M_RST_TIT']);
                } else if (selectedMode === 'router') { 
                    mode = (rType === 'dhcp') ? 'wan_dhcp' : 'wan_static'; 
                    if(rType === 'static') { a1 = container.querySelector('#router-ip').value.trim(); a2 = container.querySelector('#router-gw').value.trim(); a3 = calculateNetmask(a1); actionDetail = '<b style="color:#3b82f6;">' + a1 + '</b>'; }
                    else { actionDetail = '<b style="color:#10b981;">' + T['OPT_DHCP'] + '</b>'; }
                    mTitle = rType === 'dhcp' ? T['ACT_WAN_DHCP'] : T['ACT_WAN_STATIC'];
                } else if (selectedMode === 'pppoe') { 
                    a1 = container.querySelector('#pppoe-user').value.replace(/[\r\n\s]+/g, '');
                    a2 = container.querySelector('#pppoe-pass').value; 
                    actionDetail = '<b style="color:#3b82f6;">' + a1 + '</b>';
                    mTitle = T['ACT_PPPOE'];
                } else if (selectedMode === 'wifi') {
                    var isSmart = container.querySelector('#wifi-smart-toggle').checked && !window._isSingleChip;
                    var legacyB = container.querySelector('#legacy-b-toggle').checked ? '1' : '0';
                    var payload = { smart: isSmart ? "true" : "false" };

                    if (isSmart) {
                        payload.merged = {
                            enabled: container.querySelector('#wifi-smart-en').checked ? "1" : "0",
                            ssid: container.querySelector('#wifi-smart-ssid').value.trim(),
                            key: container.querySelector('#wifi-smart-key').value,
                            encryption: container.querySelector('#wifi-smart-enc').value,
                            hidden: container.querySelector('#wifi-smart-hidden').checked ? "1" : "0",
                            roaming: container.querySelector('#wifi-smart-roaming').checked ? "1" : "0"
                        };
                    } else {
                        payload.radio_2g = {
                            enabled: container.querySelector('#wifi-2g-en').checked ? "1" : "0",
                            ssid: container.querySelector('#wifi-2g-ssid').value.trim(),
                            key: container.querySelector('#wifi-2g-key').value,
                            encryption: container.querySelector('#wifi-2g-enc').value,
                            hidden: container.querySelector('#wifi-2g-hidden').checked ? "1" : "0",
                            mode: container.querySelector('#wifi-2g-mode').value,
                            channel: container.querySelector('#wifi-2g-chan').value,
                            bandwidth: container.querySelector('#wifi-2g-bw').value,
                            roaming: container.querySelector('#wifi-2g-roaming').checked ? "1" : "0"
                        };
                        payload.radio_5g = {
                            enabled: container.querySelector('#wifi-5g-en').checked ? "1" : "0",
                            ssid: container.querySelector('#wifi-5g-ssid').value.trim(),
                            key: container.querySelector('#wifi-5g-key').value,
                            encryption: container.querySelector('#wifi-5g-enc').value,
                            hidden: container.querySelector('#wifi-5g-hidden').checked ? "1" : "0",
                            mode: container.querySelector('#wifi-5g-mode').value,
                            channel: container.querySelector('#wifi-5g-chan').value,
                            bandwidth: container.querySelector('#wifi-5g-bw').value,
                            roaming: container.querySelector('#wifi-5g-roaming').checked ? "1" : "0"
                        };
                    }
                    // WISP 参数打包
                    var wispTog = container.querySelector('#wisp-toggle');
                    if (wispTog) {
                        var targetEnc = container.querySelector('#wisp-target-enc').value;
                        payload.wisp = {
                            enabled: wispTog.checked ? "1" : "0",
                            ssid: container.querySelector('#wisp-target-ssid').value,
                            // none，强制密码传空，防止残留脏数据导致连接失败
                            key: (targetEnc === 'none') ? '' : container.querySelector('#wisp-target-key').value,
                            encryption: targetEnc,
                            device: container.querySelector('#wisp-target-device').value,
                            bssid: container.querySelector('#wisp-target-bssid').value
                        };
                    }
                    // 結束
                    a1 = JSON.stringify(payload);
                    a4 = legacyB;
                    actionDetail = '<b style="color:#10b981;">' + T['MODE_WIFI_TITLE'] + '</b>';
                    mTitle = T['ACT_WIFI'];
                }
                
                openModal({ title: mTitle, msg: '<div style="font-size: 16px; margin-bottom: 10px;">' + T['LBL_TARGET'] + ' ' + actionDetail + '</div><div style="color: #64748b; font-size: 16px;">' + T['MSG_WRITING'] + '</div>', spin: true });
                
                var succ = function() {
                    var h = window.location.hostname, sec = 0;
                    if (selectedMode === 'lan' && a1 && a1 !== h) { 
                        if (a5 === '1') {
                            var countdownTimer = setInterval(function() {
                                sec += 3;
                                if (sec <= 120) {
                                    document.getElementById('nw-global-msg').innerHTML = '<div style="font-size: 16px; margin-bottom: 12px;">' + T['LBL_TARGET'] + ' <b style="color:#3b82f6; font-size: 18px;">' + a1 + '</b></div><div style="color: #64748b; font-size: 14px; font-weight: bold;">' + T['MSG_TIMER'].replace('{sec}', sec).replace('{total}', 120) + '</div>';
                                    if (sec >= 8) { 
                                        fetchProbe('http://' + a1 + '/luci-static/resources/view/netwiz.js?v=' + Date.now(), 2000)
                                        .then(function() { 
                                            clearInterval(countdownTimer); 
                                            var jumpUrl = 'http://' + a1 + '/cgi-bin/luci/admin/netwiz';
                                            var doJump = function() { window.location.href = jumpUrl; };
                                            callNetDefuse().then(doJump).catch(doJump); 
                                            setTimeout(doJump, 1000);
                                        }).catch(function() {}); 
                                    }
                                } else {
                                    clearInterval(countdownTimer); 
                                    var rollbackSec = 0;
                                    var checkOldIpTimer = setInterval(function() { 
                                        rollbackSec += 3; 
                                        document.getElementById('nw-global-msg').innerHTML = '<div style="color:#10b981; font-weight:bold; font-size:15px; margin-top:20px; margin-bottom:10px;">' + T['MSG_WAIT_OLD'].replace('{sec}', rollbackSec) + '</div><div style="color:#64748b; font-size:14px;">' + T['MSG_ABANDONING'] + '</div>'; 
                                        fetchProbe('http://' + h + '/cgi-bin/luci/?v=' + Date.now(), 2000)
                                        .then(function() { 
                                            clearInterval(checkOldIpTimer); 
                                            window.location.href = 'http://' + h + '/cgi-bin/luci/admin/netwiz'; 
                                        }).catch(function() {}); 
                                    }, 3000);
                                }
                            }, 3000);
                        } else {
                            var probeNewTimer = setInterval(function() { 
                                document.getElementById('nw-global-msg').innerHTML = '<div style="color: #ef4444; font-size: 16px; font-weight: bold; margin-top:20px;">' + T['MSG_SAFE_OFF'] + '</div><div style="color:#64748b; font-size:14px; line-height:1.6; margin-top:10px;">' + T['MSG_MANUAL_VISIT'] + '<br><br><a href="http://' + a1 + '/cgi-bin/luci/admin/netwiz" style="color:#10b981; font-weight:bold; font-size:16px;">http://' + a1 + '</a></div>'; 
                                fetchProbe('http://' + a1 + '/luci-static/resources/view/netwiz.js?v=' + Date.now(), 2000)
                                .then(function() { 
                                    clearInterval(probeNewTimer); 
                                    window.location.href = 'http://' + a1 + '/cgi-bin/luci/admin/netwiz'; 
                                }).catch(function() {}); 
                            }, 3000);
                        }
                    } else { 
                        var checkSameTimer = setInterval(function() { 
                            sec += 3; 
                            document.getElementById('nw-global-msg').innerHTML = '<div style="font-size: 16px; margin-bottom: 10px;">' + T['LBL_TARGET'] + ' ' + actionDetail + '</div><div style="color: #059669; font-size: 16px; font-weight: bold;">' + T['MSG_WAIT_NET'].replace('{sec}', sec) + '</div>'; 
                            fetchProbe('http://' + h + '/cgi-bin/luci/?v=' + Date.now(), 2000)
                            .then(function() { 
                                clearInterval(checkSameTimer); 
                                window.location.reload(); 
                            }).catch(function() {}); 
                        }, 3000);
                    }
                };
                callNetSetup(mode, a1, a2, a3, a4, a5, a6).then(function() { succ(); }).catch(function() { succ(); });
            } catch (err) {
                openModal({ title: T['M_SYS_ERR'], msg: 'Application failed: ' + err, okText: T['M_CLOSE'] });
            }
        });
    }
});
