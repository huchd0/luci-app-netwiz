/*
 * Copyright (C) 2026 huchd0 <https://github.com/huchd0/luci-app-netwiz>
 * Licensed under the GNU General Public License v3.0
 */
'use strict';
'require view';
'require dom';
'require rpc';
'require ui';
'require uci';
'require poll';

var CURRENT_VERSION = 'v1.0.0';

var callNetSetup = rpc.declare({
    object: 'netwiz',
    method: 'set_network',
    params: ['mode', 'arg1', 'arg2', 'arg3', 'arg4'],
    expect: { result: 0 }
});

// 使用万能通配符，防止数据异常导致页面崩溃
var getWanStatus = rpc.declare({
    object: 'network.interface',
    method: 'dump',
    expect: { '': {} } 
});

// 自动语言检测与记忆
var savedLang = localStorage.getItem('nw_lang_override');
var curLang = 'zh-cn';

if (savedLang && (savedLang === 'zh-cn' || savedLang === 'zh-tw' || savedLang === 'en')) {
    curLang = savedLang;
} else {
    var userLang = (navigator.language || navigator.userLanguage || 'zh-CN').toLowerCase();
    if (userLang.indexOf('zh-tw') !== -1 || userLang.indexOf('zh-hk') !== -1 || userLang.indexOf('zh-mo') !== -1) curLang = 'zh-tw';
    else if (userLang.indexOf('zh') === -1) curLang = 'en';
}

var i18n = {
    'en': {
        'TITLE': 'NETWORK SETUP',
        'SUBTITLE': 'Pure · Secure · Non-destructive Minimalist Config',
        'MODE_ROUTER_TITLE': 'Secondary Router Mode',
        'MODE_ROUTER_DESC': 'Upstream network dials up, this device acts as a secondary router.',
        'MODE_PPPOE_TITLE': 'PPPoE Dial-up',
        'MODE_PPPOE_DESC': 'Dial up directly using account and password on this device.',
        'MODE_LAN_TITLE': 'LAN Settings',
        'MODE_LAN_DESC': 'Change device LAN IP, or switch to Bypass Router mode.',
        'LOADING_CONFIG': 'Reading underlying config...',
        'BTN_HOME': 'Back to Home',
        'TITLE_WAN': 'Configure WAN',
        'LBL_CONN_TYPE': 'Connection Type',
        'OPT_DHCP': 'DHCP (Auto)',
        'OPT_STATIC': 'Static IP',
        'LBL_IP': 'Static IP',
        'LBL_GW': 'Gateway',
        'PH_IP': 'e.g., 192.168.1.2',
        'PH_GW': 'e.g., 192.168.1.1',
        'TITLE_PPPOE': 'PPPoE Credentials',
        'LBL_USER': 'PPPoE Username',
        'PH_USER': 'Enter PPPoE username',
        'LBL_PASS': 'PPPoE Password',
        'PH_PASS': 'Enter PPPoE password',
        'TITLE_LAN': 'Configure LAN',
        'LBL_BYPASS': 'Enable Bypass Mode',
        'WARN_BYPASS': '<b style="font-size: 16px;">Bypass Mode Enabled:</b><br>1. DHCP will be disabled. <b style="color: #059669;">Devices must use static IPs or get IPs from upstream.</b><br>2. Gateway MUST be the upstream router IP.<br>3. If LAN IP changes, ensure your client is in the same subnet to avoid <b style="color: #059669;">losing access</b>.',
        'WARN_MAIN': '<b style="font-size: 16px;">Main Router Mode Enabled:</b><br>1. DHCP will be enabled. This device assigns IPs.<br>2. Gateway is usually left blank.<br>3. If LAN IP changes, ensure your client is in the same subnet to avoid <b style="color: #dc2626;">losing access</b>.',
        'LBL_LAN_IP': 'Device LAN IP',
        'LBL_LAN_GW': 'LAN Gateway',
        'PH_LAN_GW': 'Blank for Main, required for Bypass',
        'BTN_BACK': 'Back',
        'BTN_NEXT': 'Next',
        'BTN_EDIT': 'Back to Edit',
        'TITLE_CONFIRM': 'Confirm Configuration',
        'DESC_CONFIRM': 'The following settings will be applied, please verify:',
        'NOTE_TITLE': 'Application Notes:',
        'NOTE_1': 'After confirmation, the network will restart and apply new settings.',
        'NOTE_2': 'The system will auto-refresh or redirect in 15 seconds.',
        'BTN_APPLY': 'Apply Settings',
        'STAT_BYPASS': 'Bypass Mode',
        'STAT_MAIN_PPPOE': 'Main Router (PPPoE)',
        'STAT_SEC_DHCP': 'Secondary Router (DHCP)',
        'STAT_SEC_STATIC': 'Secondary Router (Static IP)',
        'STAT_LAN': 'LAN Mode',
        'TXT_DEV_IP': 'Device IP: ',
        'TXT_UP_GW': 'Upstream GW: ',
        'TXT_PUB_IP': 'Public IP: ',
        'TXT_REM_GW': 'Remote GW: ',
        'TXT_LAN_IP': 'LAN IP: ',
        'TXT_STATUS': 'Status: ',
        'TXT_WAIT_REM': 'Waiting for remote response',
        'TXT_WAN_IP': 'WAN IP: ',
        'TXT_GET_IP': 'Getting IP...',
        'TXT_DHCP_SRV': 'DHCP Service: ',
        'TXT_ON': 'Enabled',
        'TXT_OFF': 'Disabled',
        'BDG_SUCC': 'Connected',
        'BDG_DIAL': 'Dialing / Disconnected',
        'BDG_GOT': 'IP Acquired',
        'BDG_WAIT': 'Waiting for IP...',
        'BDG_CONN': 'Interface Connected',
        'BDG_UNPLUG': 'Cable Unplugged',
        'TXT_GETTING': 'Getting...',
        'TXT_NOT_GOT': 'Not acquired',
        'TXT_NOT_SET': 'Not set',
        'ERR_RD_SYS': 'System read error, anti-freeze triggered',
        'ERR_CRASH': 'Underlying crash intercepted, please force refresh',
        'ERR_TIMEOUT': 'Reading config... (Anti-freeze active)',
        'ERR_REQ': 'Requesting data... (Please wait)',
        'M_INC_TIT': 'Incomplete info',
        'M_INC_IP': 'Device IP cannot be empty.',
        'M_INC_WAN': 'Static IP and Gateway cannot be empty.',
        'M_INC_PPPOE': 'PPPoE username and password cannot be empty.',
        'M_FMT_TIT': 'Format Error',
        'M_FMT_IP': 'The device IP is invalid, please check!',
        'M_FMT_WAN': 'WAN IP is invalid, please check!',
        'M_FMT_GW': 'Gateway IP is invalid, please check!',
        'M_LOGIC_TIT': 'Logic Error',
        'M_LOGIC_BYP': 'Bypass mode requires an upstream gateway IP.',
        'M_SAME_GW': 'WAN Static IP MUST NOT be the same as the gateway!',
        'M_SAME_BYP': 'The Bypass Device IP MUST NOT be the same as the Gateway!',
        'M_NO_MOD_TIT': 'No Changes Needed',
        'M_NO_MOD_MSG': 'Your settings match the current router config exactly.',
        'M_EXIT': 'Exit to Home',
        'M_CFLT_TIT': 'Conflict Blocked',
        'M_CFLT_IP1': 'The WAN IP cannot be the same as the current LAN IP (',
        'M_CFLT_IP2': ')!',
        'M_CFLT_SUB1': 'The WAN port cannot be in the same subnet as the LAN (',
        'M_CFLT_SUB2': ')!<br>This causes a routing loop.',
        'M_SUB_ERR_TIT': 'Subnet Error',
        'M_SUB_ERR_WAN': 'The WAN Static IP must be in the same subnet as the Gateway!<br>e.g., if gateway is ',
        'M_SUB_ERR_WAN2': ', the IP must be ',
        'M_SUB_ERR_BYP': 'The Bypass Device IP must be in the same subnet as the Gateway!',
        'M_CFLT_LAN_IP1': 'LAN IP cannot be the same as the existing WAN IP (',
        'M_CFLT_LAN_SUB1': 'LAN cannot be in the same subnet as WAN (',
        'M_WARN_TIT': 'Config Warning',
        'M_WARN_MSG': 'You selected [Main Router Mode] but filled in the [Gateway].<br><br><b>For a standard main router, the gateway must be blank.</b> Entering a gateway may cause the device to fail at distributing network, leading to a total outage!<br><br>Are you sure you want to do this?',
        'M_WARN_BTN': 'Force Apply',
        'M_SYS_ERR': 'System Exception',
        'M_SYS_MSG': 'Cannot read underlying config for validation, please refresh.',
        'M_APP_TIT': 'Applying Config',
        'M_APP_MSG': 'Writing request, please wait...',
        'M_SUCC_TIT': 'Config Applied',
        'M_SUCC_MSG1': 'Since the IP has changed to <b style="color:#3b82f6;">',
        'M_SUCC_MSG2': '</b>,<br>the system will attempt to redirect to the new address in 15 seconds.<br><br><small>Note: You will need to log in again.</small>',
        'M_RST_TIT': 'Applying Configuration',
        'M_RST_MSG': 'Underlying network is resetting, please wait...<br><br><span style="font-size: 14px; color: #555;">(If it does not automatically return in 15s, manually refresh)</span>',
        'M_FAIL_TIT': '❌ Write Failed',
        'M_FAIL_MSG': 'Underlying call exception, please try logging in again.<br><small>Error code: ',
        'M_CLOSE': 'Close',
        'M_ACCT': 'Account',
        'M_PWD': 'Password',
        'M_HIDDEN': 'Hidden',
        'M_IP_GW': 'IP & Gateway',
        'M_AUTO_UP': 'Auto-assigned by upstream router',
        'U_NEW': 'New version ',
        'U_READY': 'Update Ready (',
        'U_BTN_NOW': 'Update Now',
        'U_BTN_LATER': 'Not Now',
        'U_INST': 'Installing rapidly',
        'U_INST_MSG': 'Deploying new version...<br><br><span style="font-size:13px; color:#10b981; font-weight:bold;">For security, re-login is required after install.</span><br><br><span style="font-size:12px; color:#666;">(Auto-redirect in 12s. If frozen, press Ctrl+F5)</span>'
    },
    'zh-tw': {
        'TITLE': '網 路 設 置 精 靈',
        'SUBTITLE': '「 純淨 · 安全 · 零破壞 」的極簡網路配置',
        'MODE_ROUTER_TITLE': '二級路由模式',
        'MODE_ROUTER_DESC': '上級網路撥號，本設備作為二級路由。',
        'MODE_PPPOE_TITLE': '寬頻撥號 (PPPoE)',
        'MODE_PPPOE_DESC': '由本設備直接輸入帳號密碼撥號上網。',
        'MODE_LAN_TITLE': '區域網路設定',
        'MODE_LAN_DESC': '修改設備內網 IP，或切換旁路由模式。',
        'LOADING_CONFIG': '讀取底層配置中...',
        'BTN_HOME': '返回首頁',
        'TITLE_WAN': '配置 WAN 埠網路',
        'LBL_CONN_TYPE': '接入方式',
        'OPT_DHCP': '動態獲取 (DHCP)',
        'OPT_STATIC': '靜態 IP',
        'LBL_IP': '靜態 IP',
        'LBL_GW': '閘道器',
        'PH_IP': '例: 192.168.1.2',
        'PH_GW': '例: 192.168.1.1',
        'TITLE_PPPOE': '寬頻帳號資訊',
        'LBL_USER': '寬頻帳號',
        'PH_USER': '請輸入電信商提供的寬頻帳號',
        'LBL_PASS': '寬頻密碼',
        'PH_PASS': '請輸入寬頻密碼',
        'TITLE_LAN': '配置 LAN 埠網路',
        'LBL_BYPASS': '啟用旁路由模式',
        'WARN_BYPASS': '<b style="font-size: 16px;">旁路由模式開啟：</b><br>1、DHCP 將會關閉，設備無法從本機獲取 IP，<b style="color: #059669;">設備需要手動設定靜態IP或上級路由分配IP</b>。<br>2、閘道器必須填寫上級主路由 IP。<br>3、本機 IP 如有變更，請確保訪問端與修改後 IP 處於同一網段，否則將<b style="color: #059669;">無法訪問本路由器</b>！',
        'WARN_MAIN': '<b style="font-size: 16px;">主路由模式開啟：</b><br>1、DHCP 將會開啟，本機負責分配 IP。<br>2、主路由閘道器通常留空。<br>3、本機 IP 如有變更，請確保訪問端與修改後 IP 處於同一網段，否則將<b style="color: #dc2626;">無法訪問本路由器</b>！',
        'LBL_LAN_IP': '本機區域網路 IP',
        'LBL_LAN_GW': '區域網路閘道器',
        'PH_LAN_GW': '主路由留空，旁路由必填',
        'BTN_BACK': '返回',
        'BTN_NEXT': '下一步',
        'BTN_EDIT': '返回修改',
        'TITLE_CONFIRM': '網 路 配 置 確 認',
        'DESC_CONFIRM': '即將應用以下網路配置，請核對：',
        'NOTE_TITLE': '配置生效說明：',
        'NOTE_1': '點擊確認後，底層網路將自動重啟並應用新配置。',
        'NOTE_2': '系統將在 15 秒後為您自動刷新或跳轉。',
        'BTN_APPLY': '確認應用',
        'STAT_BYPASS': '旁路由模式',
        'STAT_MAIN_PPPOE': '主路由 (寬頻撥號)',
        'STAT_SEC_DHCP': '二級路由 (動態 DHCP)',
        'STAT_SEC_STATIC': '二級路由 (靜態 IP)',
        'STAT_LAN': '區域網路模式',
        'TXT_DEV_IP': '本機 IP: ',
        'TXT_UP_GW': '上級閘道器: ',
        'TXT_PUB_IP': '公網 IP: ',
        'TXT_REM_GW': '遠端閘道器: ',
        'TXT_LAN_IP': '區域網路 IP: ',
        'TXT_STATUS': '狀態: ',
        'TXT_WAIT_REM': '等待遠端響應',
        'TXT_WAN_IP': 'WAN IP: ',
        'TXT_GET_IP': '獲取 IP 中',
        'TXT_DHCP_SRV': 'DHCP 服務: ',
        'TXT_ON': '開啟',
        'TXT_OFF': '關閉',
        'BDG_SUCC': '撥號成功',
        'BDG_DIAL': '撥號中 / 未連接',
        'BDG_GOT': '已獲取 IP',
        'BDG_WAIT': '等待分配...',
        'BDG_CONN': '介面已連接',
        'BDG_UNPLUG': '未插入網路線',
        'TXT_GETTING': '獲取中...',
        'TXT_NOT_GOT': '未獲取',
        'TXT_NOT_SET': '未設置',
        'ERR_RD_SYS': '系統讀取異常，防卡死已觸發',
        'ERR_CRASH': '底層崩潰被攔截，請強制刷新',
        'ERR_TIMEOUT': '讀取底層配置中... (防卡死機制生效中)',
        'ERR_REQ': '正在請求資料... (請稍候)',
        'M_INC_TIT': '資訊不完整',
        'M_INC_IP': '本機 IP 不能為空。',
        'M_INC_WAN': '靜態 IP 和閘道器均不能為空。',
        'M_INC_PPPOE': '寬頻帳號和密碼均不能為空。',
        'M_FMT_TIT': '格式錯誤',
        'M_FMT_IP': '您填寫的本機 IP 不合法，請檢查！',
        'M_FMT_WAN': 'WAN 埠 IP 不合法，請檢查！',
        'M_FMT_GW': '您填寫的閘道器 IP 不合法，請檢查！',
        'M_LOGIC_TIT': '邏輯錯誤',
        'M_LOGIC_BYP': '開啟旁路由模式必須填寫上級閘道器 IP。',
        'M_SAME_GW': 'WAN 埠靜態 IP 絕不能與閘道器相同！',
        'M_SAME_BYP': '旁路由的【本機 IP】絕不能與【閘道器】相同！',
        'M_NO_MOD_TIT': '無需修改',
        'M_NO_MOD_MSG': '您的設定與當前路由器底層配置完全一致。',
        'M_EXIT': '退出首頁',
        'M_CFLT_TIT': '衝突攔截',
        'M_CFLT_IP1': '您填寫的 WAN 埠 IP 不能與本機現有的區域網路 IP (',
        'M_CFLT_IP2': ') 相同！',
        'M_CFLT_SUB1': '您填寫的 WAN 埠不能與區域網路 (',
        'M_CFLT_SUB2': ') 處於同一網段！<br>這會導致路由器死循環，請更換網段。',
        'M_SUB_ERR_TIT': '網段錯誤',
        'M_SUB_ERR_WAN': 'WAN 埠的【靜態 IP】必須與上級【閘道器】處於同一網段！<br>例如：閘道器是 ',
        'M_SUB_ERR_WAN2': '，那 IP 必須是 ',
        'M_SUB_ERR_BYP': '旁路由的【本機 IP】必須與【閘道器】處於同一網段！',
        'M_CFLT_LAN_IP1': '區域網路 IP 不能與現有的 WAN 埠 IP (',
        'M_CFLT_LAN_SUB1': '區域網路不能與 WAN 埠 (',
        'M_WARN_TIT': '主路由配置警告',
        'M_WARN_MSG': '檢測到您選擇了【主路由模式】，卻強行填寫了【閘道器】。<br><br><b>在標準主路由下，閘道器必須留空。</b>亂填閘道器會導致設備無法正常分發網路，進而導致全屋斷網！<br><br>您確定要這麼做嗎？',
        'M_WARN_BTN': '強行應用',
        'M_SYS_ERR': '系統異常',
        'M_SYS_MSG': '無法讀取底層配置進行校驗，請刷新網頁重試。',
        'M_APP_TIT': '正在下发配置',
        'M_APP_MSG': '請求寫入中，請稍候...',
        'M_SUCC_TIT': '配置已生效',
        'M_SUCC_MSG1': '由於 IP 已變更為 <b style="color:#3b82f6;">',
        'M_SUCC_MSG2': '</b>，<br>系統將在 15 秒後嘗試跳轉到新地址。<br><br><small>註：跳轉後需重新登入。</small>',
        'M_RST_TIT': '正在應用配置',
        'M_RST_MSG': '底層網路正在重置，請稍候...<br><br><span style="font-size: 14px; color: #555;">(若 15 秒後未自動返回，請手動刷新頁面)</span>',
        'M_FAIL_TIT': '❌ 寫入失敗',
        'M_FAIL_MSG': '底層調用異常，請嘗試重新登入後台或檢查權限配置。<br><small>錯誤碼：',
        'M_CLOSE': '關閉',
        'M_ACCT': '帳號',
        'M_PWD': '密碼',
        'M_HIDDEN': '已隱藏',
        'M_IP_GW': 'IP及閘道器',
        'M_AUTO_UP': '由上級路由自動分配',
        'U_NEW': '新版本 ',
        'U_READY': '升級準備就绪 (',
        'U_BTN_NOW': '立即更新',
        'U_BTN_LATER': '暫不更新',
        'U_INST': '正在极速安装',
        'U_INST_MSG': '新版本部署中，底層權限系統正在重置...<br><br><span style="font-size:13px; color:#10b981; font-weight:bold;">安裝完成後，為確保安全，系統將要求您重新登入。</span><br><br><span style="font-size:12px; color:#666;">(網頁將在 15 秒後自動跳轉，若卡住請按 Ctrl+F5)</span>'
    },
    'zh-cn': {
        'TITLE': '网 络 设 置 向 导',
        'SUBTITLE': '「 纯净 · 安全 · 零破坏 」的极简网络配置',
        'MODE_ROUTER_TITLE': '二级路由模式',
        'MODE_ROUTER_DESC': '上级网络拨号，本设备作为二级路由。',
        'MODE_PPPOE_TITLE': '宽带拨号 (PPPoE)',
        'MODE_PPPOE_DESC': '由本设备直接输入账号密码拨号上网。',
        'MODE_LAN_TITLE': '局域网设置',
        'MODE_LAN_DESC': '修改设备内网 IP，或切换旁路由模式。',
        'LOADING_CONFIG': '读取底层配置中...',
        'BTN_HOME': '返回首页',
        'TITLE_WAN': '配置 WAN 口网络',
        'LBL_CONN_TYPE': '接入方式',
        'OPT_DHCP': '动态获取 (DHCP)',
        'OPT_STATIC': '静态 IP',
        'LBL_IP': '静态 IP',
        'LBL_GW': '网关',
        'PH_IP': '例: 192.168.1.2',
        'PH_GW': '例: 192.168.1.1',
        'TITLE_PPPOE': '宽带账号信息',
        'LBL_USER': '宽带账号',
        'PH_USER': '请输入运营商提供的宽带账号',
        'LBL_PASS': '宽带密码',
        'PH_PASS': '请输入宽带密码',
        'TITLE_LAN': '配置 LAN 口网络',
        'LBL_BYPASS': '启用旁路由模式',
        'WARN_BYPASS': '<b style="font-size: 16px;">旁路由模式开启：</b><br>1、DHCP 将会关闭，设备无法从本机获取 IP，<b style="color: #059669;">设备需要手动设置静态IP或上级路由分配IP</b>。<br>2、网关必须填写上级主路由 IP。<br>3、本机 IP 如有变更，请确保访问端与修改后 IP 处于同一网段，否则将<b style="color: #059669;">无法访问本路由器</b>！',
        'WARN_MAIN': '<b style="font-size: 16px;">主路由模式开启：</b><br>1、DHCP 将会开启，本机负责分配 IP。<br>2、主路由网关通常留空。<br>3、本机 IP 如有变更，请确保访问端与修改后 IP 处于同一网段，否则将<b style="color: #dc2626;">无法访问本路由器</b>！',
        'LBL_LAN_IP': '本机局域网 IP',
        'LBL_LAN_GW': '局域网网关',
        'PH_LAN_GW': '主路由留空，旁路由必填',
        'BTN_BACK': '返回',
        'BTN_NEXT': '下一步',
        'BTN_EDIT': '返回修改',
        'TITLE_CONFIRM': '网 络 配 置 确 认',
        'DESC_CONFIRM': '即将应用以下网络配置，请核对：',
        'NOTE_TITLE': '配置生效说明：',
        'NOTE_1': '点击确认后，底层网络将自动重启并应用新配置。',
        'NOTE_2': '系统将在 15 秒后为您自动刷新或跳转。',
        'BTN_APPLY': '确认应用',
        'STAT_BYPASS': '旁路由模式',
        'STAT_MAIN_PPPOE': '主路由 (宽带拨号)',
        'STAT_SEC_DHCP': '二级路由 (动态 DHCP)',
        'STAT_SEC_STATIC': '二级路由 (静态 IP)',
        'STAT_LAN': '局域网模式',
        'TXT_DEV_IP': '本机 IP: ',
        'TXT_UP_GW': '上级网关: ',
        'TXT_PUB_IP': '公网 IP: ',
        'TXT_REM_GW': '远端网关: ',
        'TXT_LAN_IP': '局域网 IP: ',
        'TXT_STATUS': '状态: ',
        'TXT_WAIT_REM': '等待远端响应',
        'TXT_WAN_IP': 'WAN IP: ',
        'TXT_GET_IP': '获取 IP 中',
        'TXT_DHCP_SRV': 'DHCP 服务: ',
        'TXT_ON': '开启',
        'TXT_OFF': '关闭',
        'BDG_SUCC': '拨号成功',
        'BDG_DIAL': '拨号中 / 未连接',
        'BDG_GOT': '已获取 IP',
        'BDG_WAIT': '等待分配...',
        'BDG_CONN': '接口已连接',
        'BDG_UNPLUG': '未插入网线',
        'TXT_GETTING': '获取中...',
        'TXT_NOT_GOT': '未获取',
        'TXT_NOT_SET': '未设置',
        'ERR_RD_SYS': '系统读取异常，防卡死已触发',
        'ERR_CRASH': '底层崩溃被拦截，请强制刷新',
        'ERR_TIMEOUT': '读取底层配置中... (防卡死机制生效中)',
        'ERR_REQ': '正在请求数据... (请稍候)',
        'M_INC_TIT': '信息不完整',
        'M_INC_IP': '本机 IP 不能为空。',
        'M_INC_WAN': '静态 IP 和网关均不能为空。',
        'M_INC_PPPOE': '宽带账号和密码均不能为空。',
        'M_FMT_TIT': '格式错误',
        'M_FMT_IP': '您填写的本机 IP 不合法，请检查！',
        'M_FMT_WAN': 'WAN 口 IP 不合法，请检查！',
        'M_FMT_GW': '您填写的网关 IP 不合法，请检查！',
        'M_LOGIC_TIT': '逻辑错误',
        'M_LOGIC_BYP': '开启旁路由模式必须填写上级网关 IP。',
        'M_SAME_GW': 'WAN 口静态 IP 绝不能与网关相同！',
        'M_SAME_BYP': '旁路由的【本机 IP】绝不能与【网关】相同！',
        'M_NO_MOD_TIT': '无需修改',
        'M_NO_MOD_MSG': '您的设置与当前路由器底层配置完全一致。',
        'M_EXIT': '退出首页',
        'M_CFLT_TIT': '冲突拦截',
        'M_CFLT_IP1': '您填写的 WAN 口 IP 不能与本机现有的局域网 IP (',
        'M_CFLT_IP2': ') 相同！',
        'M_CFLT_SUB1': '您填写的 WAN 口不能与局域网 (',
        'M_CFLT_SUB2': ') 处于同一网段！<br>这会导致路由器死循环，请更换网段。',
        'M_SUB_ERR_TIT': '网段错误',
        'M_SUB_ERR_WAN': 'WAN 口的【静态 IP】必须与上级【网关】处于同一网段！<br>例如：网关是 ',
        'M_SUB_ERR_WAN2': '，那 IP 必须是 ',
        'M_SUB_ERR_BYP': '旁路由的【本机 IP】必须与【网关】处于同一网段！',
        'M_CFLT_LAN_IP1': '局域网 IP 不能与现有的 WAN 口 IP (',
        'M_CFLT_LAN_SUB1': '局域网不能与 WAN 口 (',
        'M_WARN_TIT': '主路由配置警告',
        'M_WARN_MSG': '检测到您选择了【主路由模式】，却强行填写了【网关】。<br><br><b>在标准主路由下，网关必须留空。</b>乱填网关会导致设备无法正常分发网络，进而导致全屋断网！<br><br>您确定要这么做吗？',
        'M_WARN_BTN': '强行应用',
        'M_SYS_ERR': '系统异常',
        'M_SYS_MSG': '无法读取底层配置进行校验，请刷新网页重试。',
        'M_APP_TIT': '正在下发配置',
        'M_APP_MSG': '请求写入中，请稍候...',
        'M_SUCC_TIT': '配置已生效',
        'M_SUCC_MSG1': '由于 IP 已变更为 <b style="color:#3b82f6;">',
        'M_SUCC_MSG2': '</b>，<br>系统将在 15 秒后尝试跳转到新地址。<br><br><small>注：跳转后需重新登录。</small>',
        'M_RST_TIT': '正在应用配置',
        'M_RST_MSG': '底层网络正在重置，请稍候...<br><br><span style="font-size: 14px; color: #555;">(若 15 秒后未自动返回，请手动刷新页面)</span>',
        'M_FAIL_TIT': '❌ 写入失败',
        'M_FAIL_MSG': '底层调用异常，请尝试重新登录后台或检查权限配置。<br><small>错误码：',
        'M_CLOSE': '关闭',
        'M_ACCT': '账号',
        'M_PWD': '密码',
        'M_HIDDEN': '已隐藏',
        'M_IP_GW': 'IP及网关',
        'M_AUTO_UP': '由上级路由自动分配',
        'U_NEW': '发现新版本 ',
        'U_READY': '升级准备就绪 (',
        'U_BTN_NOW': '立即更新',
        'U_BTN_LATER': '暂不更新',
        'U_INST': '正在极速安装',
        'U_INST_MSG': '新版本部署中，底层权限系统正在重置...<br><br><span style="font-size:13px; color:#10b981; font-weight:bold;">安装完成后，为确保安全，系统将要求您重新登录。</span><br><br><span style="font-size:12px; color:#666;">(网页将在 12 秒后自动跳转，若卡住请按 Ctrl+F5)</span>'
    }
};

function _t(key) {
    return (i18n[curLang] && i18n[curLang][key]) ? i18n[curLang][key] : (i18n['zh-cn'][key] || key);
}

return view.extend({
    render: function () {
        // 检查并执行强制刷新，解决升级或修改配置后需要手动刷新的问题
        if (sessionStorage.getItem('nw_force_refresh') === '1') {
            sessionStorage.removeItem('nw_force_refresh');
            window.location.reload(true);
            return dom.create('div', { id: 'netwiz-container' }, 'Reloading...');
        }

        var container = dom.create('div', { class: 'cbi-map', id: 'netwiz-container' });

        var htmlTemplate = [
            '<style>',
            'html, body { overflow-y: scroll !important; scrollbar-gutter: stable; }',
            '.nw-wrapper { display: flex; flex-direction: column; align-items: center; justify-content: flex-start; min-height: 80vh; padding-top: 10vh; padding-bottom: 10vh; font-family: -apple-system, BlinkMacSystemFont, sans-serif; }',
            '.nw-header { text-align: center; margin-bottom: 40px; background-color: #5e72e4; padding: 25px; margin-top: -100px; border-radius: 0 0 15px 15px; position: relative; }',
            '.nw-main-title { font-size: 35px; font-weight: 600; margin-bottom: 10px; color: #ffffff; letter-spacing: 2px; }',
            '.nw-header p { color: #ffffff; font-size: 16px; opacity: 0.9; margin: 0; letter-spacing: 1px; }',
            '#nw-lang-switch { position: absolute; top: -30px; right: 15px; z-index: 100; padding: 5px 10px; border-radius: 6px; background: rgba(255,255,255,0.15); color: #fff; border: 1px solid rgba(255,255,255,0.3); font-size: 13px; outline: none; cursor: pointer; backdrop-filter: blur(5px); transition: all 0.2s; }',
            '#nw-lang-switch:hover { background: rgba(255,255,255,0.25); }',
            '#nw-lang-switch option { color: #333; background: #fff; }',
            '#update-red-dot { display: none; position: absolute; top: -2px; right: -2px; width: 8px; height: 8px; background-color: #ef4444; border-radius: 50%; box-shadow: 0 0 4px rgba(239, 68, 68, 0.8); animation: pulse-dot 2s infinite; }',
            '@keyframes pulse-dot { 0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); } 70% { box-shadow: 0 0 0 6px rgba(239, 68, 68, 0); } 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); } }',
            '#update-tooltip { display: none; position: absolute; bottom: 120%; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.8); color: #fff; padding: 4px 8px; border-radius: 4px; font-size: 12px; white-space: nowrap; pointer-events: none; z-index: 100; }',
            '#version-wrapper:hover #update-tooltip.has-update { display: block; }',
            '.nw-step { width: 100%; max-width: 750px; text-align: center; animation: slideUp 0.4s ease-out; }',
            '@keyframes slideUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }',
            '.nw-card-group { display: flex; gap: 40px; justify-content: center; flex-wrap: wrap; margin-top: 20px; }',
            '.nw-card { width: 210px; padding: 40px 20px; border-radius: 16px; cursor: pointer; backdrop-filter: blur(12px); border: 1px solid rgba(0,0,0,0.03); box-shadow: 0px 0px 15px 2px #b7b7b7; transition: all 0.25s ease; display: flex; flex-direction: column; align-items: center; box-sizing: border-box; }',
            '.nw-card:hover { transform: translateY(-5px); }',
            '.nw-card[data-mode="router"] { background: rgba(79, 150, 101, 0.85); }',
            '.nw-card[data-mode="pppoe"] { background: rgba(80, 0, 183, 0.85); }',
            '.nw-card[data-mode="lan"] { background: rgba(245, 54, 92, 0.85); }',
            '.nw-badge { width: 54px; height: 54px; line-height: 54px; border-radius: 50%; font-size: 20px; font-weight: bold; margin-bottom: 20px; }',
            '.nw-badge-dhcp { background: #e0f2fe; color: #0284c7; }',
            '.nw-badge-pppoe { background: #f3e8ff; color: #9333ea; }',
            '.nw-badge-bypass { background: #d1fae5; color: #059669; }',
            '.nw-card-title { font-size: 20px; margin: 0 0 10px 0; color: #ffffff; font-weight: 600; }',
            '.nw-card span { font-size: 15px; color: #ffffff; line-height: 1.5; opacity: 0.9; }',
            '.nw-form-area, .nw-confirm-board { position: relative; max-width: 460px; margin: 0 auto; text-align: left; padding: 40px; border-radius: 16px; background-color: rgba(255, 255, 255, 0.88); box-shadow: 0 10px 30px rgba(0,0,0,0.06); }',
            '.nw-top-back { position: absolute; top: 20px; left: 20px; width: 36px; height: 36px; border-radius: 50%; background: #f1f5f9; color: #64748b; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s ease; z-index: 10; }',
            '.nw-top-back:hover { background: #e2e8f0; color: #0f172a; transform: translateX(-3px); box-shadow: 2px 2px 8px rgba(0,0,0,0.05); }',
            '.nw-top-back svg { width: 20px; height: 20px; }',
            '.nw-step-title { text-align: center; margin-bottom: 30px; color: #111; font-weight: 600; font-size: 20px; }',
            '.nw-form-area .cbi-value { border: none; padding: 6px 0; display: flex; flex-direction: column; width: 100%; }',
            '.nw-form-area .cbi-value-title { text-align: left; font-weight: 600; color: #222; font-size: 15px; margin-bottom: 10px; }',
            '.nw-form-area input[type="text"], .nw-form-area input[type="password"] { width: 100%; box-sizing: border-box; padding: 12px 16px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 15px; outline: none; background: #f9fafb; color: #333; transition: border-color 0.2s; }',
            '.nw-form-area input:focus { border-color: #3b82f6; }',
            'input:-webkit-autofill, input:-webkit-autofill:hover, input:-webkit-autofill:focus, input:-webkit-autofill:active { -webkit-box-shadow: 0 0 0 1000px #f9fafb inset !important; -webkit-text-fill-color: #333 !important; transition: background-color 5000s ease-in-out 0s; }',
            '.nw-actions { margin-top: 35px; display: flex; justify-content: center; gap: 15px; }',
            '.nw-actions button { border-radius: 8px; padding: 10px 24px; font-weight: 500; font-size: 15px; cursor: pointer; border: none; }',
            '.nw-actions .cbi-button-apply { background: #10b981; color: white; transition: background 0.2s; }',
            '.nw-actions .cbi-button-apply:hover { background: #059669; }',
            '.nw-actions .cbi-button-reset { background: #f5365c; color: #fff; transition: background 0.2s; }',
            '.nw-actions .cbi-button-reset:hover { background: red; }',
            '.nw-radio-group { display: flex; gap: 24px; font-size: 15px; color: #333; align-items: center; margin: 0; padding: 0; }',
            '.nw-radio-group label { cursor: pointer; display: flex; align-items: center; gap: 6px; margin: 0 !important; padding: 0 !important; height: 20px; line-height: 1 !important; font-weight: normal; }',
            '.nw-radio-group input[type="radio"] { margin: 0 !important; padding: 0 !important; cursor: pointer; width: 16px; height: 16px; position: relative; top: 0; }',
            '.nw-switch { position: relative; display: inline-block; width: 46px; height: 24px; margin: 0; }',
            '.nw-switch input { opacity: 0; width: 0; height: 0; }',
            '.nw-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #cbd5e1; transition: .3s; border-radius: 24px; }',
            '.nw-slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .3s; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.2); }',
            'input:checked + .nw-slider { background-color: #3b82f6; }',
            'input:checked + .nw-slider:before { transform: translateX(22px); }',
            '#nw-global-modal { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.65); z-index: 999999; display: flex; align-items: center; justify-content: center; }',
            '#nw-global-modal .nw-modal-box { background: #fff; padding: 40px; border-radius: 16px; text-align: center; max-width: 420px; width: 90%; }',
            '#nw-global-modal h3 { font-size: 22px; color: #1e293b; margin-bottom: 15px; border:none; }',
            '#nw-global-modal p { font-size: 15px; color: #475569; line-height: 1.6; margin: 0; }',
            '.nw-spinner { width: 50px; height: 50px; border: 4px solid #f1f5f9; border-top: 4px solid #3b82f6; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 25px; }',
            '@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }',
            '.nw-modal-btn-ok { background: #3b82f6; color: white; border: none; padding: 12px 30px; border-radius: 8px; font-size: 15px; cursor: pointer; flex: 1; transition: background 0.2s; }',
            '.nw-modal-btn-ok:hover { background: #2563eb; }',
            '.nw-modal-btn-cancel { background: #f1f5f9; color: #475569; border: none; padding: 12px 20px; border-radius: 8px; font-size: 15px; cursor: pointer; flex: 1; transition: background 0.2s; }',
            '.nw-modal-btn-cancel:hover { background: #e2e8f0; }',
            '.nw-modal-btn-danger { background: #ef4444; color: white; border: none; padding: 12px 30px; border-radius: 8px; font-size: 15px; cursor: pointer; flex: 1; transition: background 0.2s; }',
            '.nw-modal-btn-danger:hover { background: #dc2626; }',
            '.nw-hl { color: #facc15; font-weight: bold; }',

            '@media screen and (max-width: 768px) {',
            '  .nw-wrapper { padding-top: 3vh; padding-bottom: 5vh; }',
            '  .nw-header { margin-top: -30px; padding: 20px 15px; width: 92%; box-sizing: border-box; border-radius: 12px; }',
            '  .nw-main-title { font-size: 22px; }',
            '  .nw-header p { font-size: 13px; }',
            '  .nw-card-group { flex-direction: column; align-items: center; gap: 15px; margin-top: 15px; }',
            '  .nw-card { width: 100%; max-width: 320px; padding: 25px 20px; text-align: center; }',
            '  .nw-badge { margin-bottom: 15px; width: 48px; height: 48px; line-height: 48px; font-size: 18px; }',
            '  .nw-form-area, .nw-confirm-board { width: 92%; padding: 25px 20px; box-sizing: border-box; }',
            '  .nw-top-back { top: 12px; left: 12px; width: 32px; height: 32px; }',
            '  .nw-step-title { font-size: 18px; margin-top: 15px; margin-bottom: 20px; }',
            '  #current-mode-display { width: 92%; min-width: auto; padding: 15px; box-sizing: border-box; }',
            '  #nw-lang-switch { font-size: 12px; padding: 4px 8px; }',
            '  .nw-actions { width: 92%; margin: 20px auto 0; gap: 10px; }',
            '  .nw-actions button { padding: 12px 10px; font-size: 14px; flex: 1; }',
            '  #nw-global-modal .nw-modal-box { padding: 25px 20px; width: 85%; }',
            '  #nw-global-btn-wrap { flex-direction: column; gap: 10px; }',
            '  #nw-global-btn-wrap button { width: 100%; padding: 12px; }',
            '  #nw-update-badge { right: -30px; top: -40px;}',
            '  .nw-radio-group { flex-wrap: wrap; gap: 12px; }',
            '}',
            '</style>',

            '<div class="nw-wrapper">',
            '  <select id="nw-lang-switch">',
            '    <option value="zh-cn">简体中文</option>',
            '    <option value="zh-tw">繁體中文</option>',
            '    <option value="en">English</option>',
            '  </select>',
            '  <div class="nw-header">',
            '    <div id="nw-update-badge"></div>',
            '    <div class="nw-main-title">{{TITLE}} <span id="version-wrapper" style="position:relative; font-size:14px; background:#67A57B; padding:4px 10px; border-radius:6px; vertical-align:middle; transition: all 0.3s;">' + CURRENT_VERSION + '<span id="update-red-dot"></span><span id="update-tooltip"></span></span></div>',
            '    <p>{{SUBTITLE}}</p>',
            '  </div>',

            '  <div id="nw-global-modal" style="display:none;">',
            '    <div class="nw-modal-box">',
            '      <div id="nw-global-spinner" class="nw-spinner" style="display:none;"></div>',
            '      <h3 id="nw-global-title"></h3>',
            '      <p id="nw-global-msg"></p>',
            '      <div id="nw-global-btn-wrap" style="display:flex; gap:15px; width:100%; margin-top:25px;">',
            '        <button id="nw-global-btn-cancel" class="nw-modal-btn-cancel" style="display:none;"></button>',
            '        <button id="nw-global-btn-ok" class="nw-modal-btn-ok" style="display:none;"></button>',
            '      </div>',
            '    </div>',
            '  </div>',

            '  <div id="step-1" class="nw-step">',
            '    <div class="nw-card-group">',
            '      <div class="nw-card" data-mode="router"><div class="nw-badge nw-badge-dhcp">🌐</div>',
            '        <div class="nw-card-title">{{MODE_ROUTER_TITLE}}</div><span>{{MODE_ROUTER_DESC}}</span></div>',
            '      <div class="nw-card" data-mode="pppoe"><div class="nw-badge nw-badge-pppoe">🔑</div>',
            '        <div class="nw-card-title">{{MODE_PPPOE_TITLE}}</div><span>{{MODE_PPPOE_DESC}}</span></div>',
            '      <div class="nw-card" data-mode="lan"><div class="nw-badge nw-badge-bypass">💻</div>',
            '        <div class="nw-card-title">{{MODE_LAN_TITLE}}</div><span>{{MODE_LAN_DESC}}</span></div>',
            '    </div>',

            '    <div id="current-mode-display" style="margin-top: 45px; background: #5e72e4; padding: 20px 35px; border-radius: 12px; display: inline-block; box-shadow: 0 8px 20px rgba(94, 114, 228, 0.3); text-align: center; min-width: 320px;">',
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
            '        <div style="display: flex; align-items: center; width: 100%; padding: 15px 0;">',
            '          <div style="font-weight: 600; color: #222; font-size: 16px; margin-right: 35px; line-height: 1;">{{LBL_CONN_TYPE}}</div>',
            '          <div class="nw-radio-group">',
            '            <label><input type="radio" name="router_type" value="dhcp" checked> {{OPT_DHCP}}</label>',
            '            <label><input type="radio" name="router_type" value="static"> {{OPT_STATIC}}</label>',
            '          </div>',
            '        </div>',
            '        <div id="router-static-fields" style="display: none; margin-top: 10px; border-top: 1px dashed #e5e7eb; padding-top: 15px;">',
            '          <div class="cbi-value"><label class="cbi-value-title">{{LBL_IP}}</label><div class="cbi-value-field"><input type="text" id="router-ip" placeholder="{{PH_IP}}" autocomplete="new-password"></div></div>',
            '          <div class="cbi-value"><label class="cbi-value-title">{{LBL_GW}}</label><div class="cbi-value-field"><input type="text" id="router-gw" placeholder="{{PH_GW}}" autocomplete="new-password"></div></div>',
            '        </div>',
            '      </div>',
            '      <div id="fields-pppoe" style="display: none;">',
            '        <div class="nw-step-title">{{TITLE_PPPOE}}</div>',
            '        <div class="cbi-value"><label class="cbi-value-title">{{LBL_USER}}</label><div class="cbi-value-field"><input type="text" id="pppoe-user" placeholder="{{PH_USER}}" autocomplete="new-password"></div></div>',
            '        <div class="cbi-value"><label class="cbi-value-title">{{LBL_PASS}}</label><div class="cbi-value-field"><input type="password" id="pppoe-pass" placeholder="{{PH_PASS}}" autocomplete="new-password"></div></div>',
            '      </div>',
            '      <div id="fields-lan" style="display: none;">',
            '        <div class="nw-step-title">{{TITLE_LAN}}</div>',
            '        <div style="display: flex; align-items: center; justify-content: space-between; padding: 15px 0; border-bottom: 1px solid #f1f5f9; margin-bottom: 15px;">',
            '           <div style="font-weight: 600; color: #222; font-size: 16px;">{{LBL_BYPASS}}</div>',
            '           <label class="nw-switch"><input type="checkbox" id="lan-bypass-toggle"><span class="nw-slider"></span></label>',
            '        </div>',
            '        <div id="lan-bypass-warning" style="display:none; background: #fef2f2; color: #ef4444; padding: 12px; border-radius: 8px; font-size: 14px; margin-bottom: 15px; border: 1px solid #fecaca; line-height: 1.7; letter-spacing: 1px; font-weight: bolder;">{{WARN_BYPASS}}</div>',
            '        <div id="lan-main-warning" style="background: #f0fdf4; color: #059669; padding: 12px; border-radius: 8px; font-size: 14px; margin-bottom: 15px; border: 1px solid #bbf7d0; line-height: 1.7; letter-spacing: 1px; font-weight: bolder;">{{WARN_MAIN}}</div>',
            '        <div class="cbi-value"><label class="cbi-value-title">{{LBL_LAN_IP}}</label><div class="cbi-value-field"><input type="text" id="lan-ip" placeholder="{{PH_IP}}" autocomplete="new-password"></div></div>',
            '        <div class="cbi-value"><label class="cbi-value-title">{{LBL_LAN_GW}}</label><div class="cbi-value-field"><input type="text" id="lan-gw" placeholder="{{PH_LAN_GW}}" autocomplete="new-password"></div></div>',
            '      </div>',
            '    </div>',
            '    <div class="nw-actions"><button id="btn-back-1" class="cbi-button cbi-button-reset">{{BTN_BACK}}</button><button id="btn-next-2" class="cbi-button cbi-button-apply">{{BTN_NEXT}}</button></div>',
            '  </div>',

            '  <div id="step-3" class="nw-step" style="display: none;">',
            '    <div class="nw-confirm-board">',
            '      <div class="nw-top-back" id="top-back-2" title="{{BTN_EDIT}}">',
            '         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>',
            '      </div>',
            '      <div class="nw-step-title">{{TITLE_CONFIRM}}</div>',
            '      <p style="color:#555; text-align:center;">{{DESC_CONFIRM}}</p>',
            '      <div id="confirm-mode-text" style="color: #fff; background: #3b82f6; padding: 20px; border-radius: 12px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.1); margin-top: 15px;"></div>',
            '      <div style="background-color: #f8fafc; padding: 15px; font-size: 13.5px; margin-top: 20px; border: 1px solid #e2e8f0; line-height: 1.7; color: #475569; border-radius: 12px;">',
            '        <div style="font-weight: bold; color: #0f172a; margin-bottom: 8px; font-size: 14.5px;">{{NOTE_TITLE}}</div>',
            '        <div style="display: flex; gap: 8px;"><span style="color:#3b82f6;">•</span> <span>{{NOTE_1}}</span></div>',
            '        <div style="display: flex; gap: 8px;"><span style="color:#10b981;">•</span> <span>{{NOTE_2}}</span></div>',
            '      </div>',
            '    </div>',
            '    <div class="nw-actions"><button id="btn-back-2" class="cbi-button cbi-button-reset">{{BTN_BACK}}</button><button id="btn-apply" class="cbi-button cbi-button-apply">{{BTN_APPLY}}</button></div>',
            '  </div>',
            '</div>'
        ].join('');

        // 动态注入翻译文本
        for (var k in i18n['zh-cn']) {
            htmlTemplate = htmlTemplate.replace(new RegExp('\\{\\{' + k + '\\}\\}', 'g'), _t(k));
        }
        container.innerHTML = htmlTemplate;

        this.bindEvents(container);
        return container;
    },

    bindEvents: function (container) {
        var step1 = container.querySelector('#step-1');
        var step2 = container.querySelector('#step-2');
        var step3 = container.querySelector('#step-3');
        var confirmText = container.querySelector('#confirm-mode-text');
        var modeTextEl = container.querySelector('#current-mode-text');
        var selectedMode = '';

        // 绑定语言切换事件
        var langSwitch = container.querySelector('#nw-lang-switch');
        if (langSwitch) {
            langSwitch.value = curLang;
            langSwitch.addEventListener('change', function() {
                localStorage.setItem('nw_lang_override', this.value);
                window.location.reload(); 
            });
        }

        function compareVersions(v1, v2) {
            var p1 = String(v1).replace(/[^0-9\.]/g, '').split('.');
            var p2 = String(v2).replace(/[^0-9\.]/g, '').split('.');
            var len = Math.max(p1.length, p2.length);
            for (var i = 0; i < len; i++) {
                var n1 = parseInt(p1[i] || 0, 10);
                var n2 = parseInt(p2[i] || 0, 10);
                if (n1 > n2) return 1;
                if (n1 < n2) return -1;
            }
            return 0;
        }

        function doUpdateCheck() {
            var verWrapper = container.querySelector('#version-wrapper');
            var redDot = container.querySelector('#update-red-dot');
            var tooltip = container.querySelector('#update-tooltip');
            var now = Date.now();
            var cacheKey = 'nw_last_update_check';
            var cacheExpiry = 5 * 60 * 1000;
            var cached = JSON.parse(localStorage.getItem(cacheKey) || '{}');

            var showReadyBadge = function(latestVer, rawText) {
                var cleanText = rawText.split('---')[0].replace(/### ✨ 最新版发布/g, '').trim();
                
                redDot.style.display = 'block';
                tooltip.innerText = _t('U_NEW') + latestVer;
                tooltip.className = 'has-update';
                verWrapper.style.cursor = 'pointer';

                // 防止多次绑定点击事件
                var newWrapper = verWrapper.cloneNode(true);
                verWrapper.parentNode.replaceChild(newWrapper, verWrapper);
                verWrapper = newWrapper;

                verWrapper.addEventListener('click', function() {
                    openModal({
                        title: _t('U_READY') + latestVer + ')',
                        msg: '<b>' + _t('U_INST_MSG').split('<br><br>')[0] + '</b><br><br><div style="text-align:left; font-size:13px; background:#f1f5f9; padding:10px; margin-top:10px; border-radius:6px; max-height:150px; overflow-y:auto; border:1px solid #cbd5e1;">' + cleanText.replace(/\n/g, '<br>') + '</div>',
                        okText: _t('U_BTN_NOW'), cancelText: _t('U_BTN_LATER'),
                        onOk: function() {
                            try { poll.stop(); } catch(e) {}
                            
                            // 清理升级缓存，确保不会重复提示
                            localStorage.removeItem('nw_last_update_check');

                            openModal({ title: _t('U_INST'), msg: _t('U_INST_MSG'), spin: true });
                            var forceReload = function() { 
                                // 写入强制刷新标记，更新完毕重新加载时彻底击穿浏览器缓存
                                sessionStorage.setItem('nw_force_refresh', '1');
                                window.location.href = window.location.href.split('?')[0] + '?t=' + new Date().getTime(); 
                            };
                            callNetSetup('do_install').then(function() { setTimeout(forceReload, 12000); }).catch(function() { setTimeout(forceReload, 12000); });
                        }
                    });
                });
            };

            var triggerDownload = function(latestVer, rawText) {
                if (latestVer && compareVersions(latestVer, CURRENT_VERSION) > 0) {
                    callNetSetup('check_update', latestVer).then(function(res) {
                        if (res === 1) showReadyBadge(latestVer, rawText);
                        else {
                            callNetSetup('prepare_update', latestVer);
                            var pollCount = 0;
                            var pollStatus = setInterval(function() {
                                pollCount++;
                                if (pollCount > 15) { clearInterval(pollStatus); return; }
                                callNetSetup('check_update', latestVer).then(function(r) {
                                    if (r === 1) { clearInterval(pollStatus); showReadyBadge(latestVer, rawText); }
                                }).catch(function(){});
                            }, 4000);
                        }
                    }).catch(function(e) {});
                }
            };

            if (cached.time && (now - cached.time < cacheExpiry) && cached.version) {
                triggerDownload(cached.version, cached.body || ''); return; 
            }
            fetch('https://api.github.com/repos/huchd0/luci-app-netwiz/releases?t=' + now, { cache: 'no-store' }).then(function(res) { return res.json(); }).then(function(data) {
                if (data && data.length > 0) {
                    localStorage.setItem(cacheKey, JSON.stringify({ time: now, version: data[0].tag_name, body: data[0].body || '' }));
                    triggerDownload(data[0].tag_name, data[0].body || '');
                }
            }).catch(function(e) {});
        }
        setTimeout(doUpdateCheck, 1500);

        function safePromise(promise, fallback, timeoutMs) {
            return new Promise(function(resolve) {
                var timer = setTimeout(function() { resolve(fallback); }, timeoutMs || 3000);
                if (!promise || !promise.then) { clearTimeout(timer); return resolve(fallback); }
                promise.then(function(res) { clearTimeout(timer); resolve(res); }).catch(function() { clearTimeout(timer); resolve(fallback); });
            });
        }

        function safeUciGet(conf, sec, opt, def) {
            try { var val = uci.get(conf, sec, opt); return (val === null || val === undefined) ? def : String(val).trim(); } catch(e) { return def; }
        }

        function updateStatusDisplay(isSilent) {
            try {
                if (modeTextEl && !isSilent) {
                    modeTextEl.innerHTML = "<div class='nw-spinner' style='width:30px; height:30px; border-width:3px; margin: 0 auto; border-top-color: #fff;'></div><div style='margin-top:10px; font-size:15px; font-weight:bold; color:#fff;'>" + _t('LOADING_CONFIG') + "</div>";
                }
                try { uci.unload('network'); uci.unload('dhcp'); } catch(e) {}

                Promise.all([
                    safePromise(uci.load('network'), null, 3000), safePromise(uci.load('dhcp'), null, 3000), safePromise(getWanStatus(), {}, 3000)
                ]).then(function(results) {
                    var rawIfaces = results[2] || {};
                    var ifaces = Array.isArray(rawIfaces.interface) ? rawIfaces.interface : (Array.isArray(rawIfaces) ? rawIfaces : []);
                    var wProto = safeUciGet('network', 'wan', 'proto', '').toLowerCase();
                    
                    var activeWan = ifaces.find(function(i) { return i && (i.interface === 'wan' || i.proto === wProto || i.device === 'eth0' || i.device === 'wan'); }) || {};
                    var isWanUp = activeWan.up === true;
                    var liveWanIp = ((activeWan['ipv4-address'] && activeWan['ipv4-address'][0]) ? activeWan['ipv4-address'][0].address : '').split('/')[0];
                    var liveGw = activeWan.nexthop || (activeWan['ipv4-address'] && activeWan['ipv4-address'][0] ? activeWan['ipv4-address'][0].ptpaddress : '') || _t('TXT_GETTING');

                    var wIp = safeUciGet('network', 'wan', 'ipaddr', _t('TXT_NOT_GOT')).split('/')[0];
                    var wGw = safeUciGet('network', 'wan', 'gateway', _t('TXT_NOT_SET')); 
                    var lIp = safeUciGet('network', 'lan', 'ipaddr', window.location.hostname).split('/')[0];
                    var lGw = safeUciGet('network', 'lan', 'gateway', _t('TXT_NOT_SET'));
                    var lIgnore = safeUciGet('dhcp', 'lan', 'ignore', '');
                    var isBypass = (lIgnore === '1' || lIgnore === 'true' || lIgnore === 'on' || lIgnore === 'yes');

                    if (container.querySelector('#pppoe-user')) container.querySelector('#pppoe-user').value = safeUciGet('network', 'wan', 'username', '');
                    if (container.querySelector('#pppoe-pass')) container.querySelector('#pppoe-pass').value = safeUciGet('network', 'wan', 'password', '');
                    if (container.querySelector('#router-ip')) container.querySelector('#router-ip').value = (wIp !== _t('TXT_NOT_GOT')) ? wIp : '';
                    if (container.querySelector('#router-gw')) container.querySelector('#router-gw').value = (wGw !== _t('TXT_NOT_SET')) ? wGw : '';
                    if (container.querySelector('#lan-ip')) container.querySelector('#lan-ip').value = lIp;
                    if (container.querySelector('#lan-gw')) container.querySelector('#lan-gw').value = (lGw !== _t('TXT_NOT_SET')) ? lGw : '';
                    
                    var bypassToggle = container.querySelector('#lan-bypass-toggle');
                    if (bypassToggle) {
                        bypassToggle.checked = isBypass;
                        container.querySelector('#lan-bypass-warning').style.display = isBypass ? 'block' : 'none';
                        container.querySelector('#lan-main-warning').style.display = isBypass ? 'none' : 'block';
                    }

                    var sTitle = "", sDetails = "", statusBadge = "";

                    if (isBypass) {
                        sTitle = _t('STAT_BYPASS');
                        sDetails = _t('TXT_DEV_IP') + "<span class='nw-hl'>" + lIp + "</span>&nbsp;&nbsp;&nbsp;&nbsp;" + _t('TXT_UP_GW') + "<span class='nw-hl'>" + lGw + "</span>";
                    } else if (wProto === 'pppoe') {
                        sTitle = _t('STAT_MAIN_PPPOE');
                        if (isWanUp && liveWanIp) {
                            statusBadge = "<span style='font-size:12px; background:#10b981; color:#fff; padding:3px 8px; border-radius:12px; margin-left:12px; vertical-align:middle;'>" + _t('BDG_SUCC') + "</span>";
                            sDetails = _t('TXT_PUB_IP') + "<span class='nw-hl'>" + liveWanIp + "</span>&nbsp;&nbsp;&nbsp;&nbsp;" + _t('TXT_REM_GW') + "<span class='nw-hl'>" + liveGw + "</span>";
                        } else {
                            statusBadge = "<span style='font-size:12px; background:#ef4444; color:#fff; padding:3px 8px; border-radius:12px; margin-left:12px; vertical-align:middle;'>" + _t('BDG_DIAL') + "</span>";
                            sDetails = _t('TXT_LAN_IP') + "<span class='nw-hl'>" + lIp + "</span>&nbsp;&nbsp;&nbsp;&nbsp;" + _t('TXT_STATUS') + "<span class='nw-hl'>" + _t('TXT_WAIT_REM') + "</span>";
                        }
                    } else if (wProto === 'dhcp') {
                        sTitle = _t('STAT_SEC_DHCP');
                        if (isWanUp && liveWanIp) {
                            statusBadge = "<span style='font-size:12px; background:#10b981; color:#fff; padding:3px 8px; border-radius:12px; margin-left:12px; vertical-align:middle;'>" + _t('BDG_GOT') + "</span>";
                            sDetails = _t('TXT_WAN_IP') + "<span class='nw-hl'>" + liveWanIp + "</span>&nbsp;&nbsp;&nbsp;&nbsp;" + _t('TXT_UP_GW') + "<span class='nw-hl'>" + liveGw + "</span>";
                        } else {
                            statusBadge = "<span style='font-size:12px; background:#f59e0b; color:#fff; padding:3px 8px; border-radius:12px; margin-left:12px; vertical-align:middle;'>" + _t('BDG_WAIT') + "</span>";
                            sDetails = _t('TXT_LAN_IP') + "<span class='nw-hl'>" + lIp + "</span>&nbsp;&nbsp;&nbsp;&nbsp;" + _t('TXT_STATUS') + "<span class='nw-hl'>" + _t('TXT_GET_IP') + "</span>";
                        }
                    } else if (wProto === 'static') {
                        sTitle = _t('STAT_SEC_STATIC');
                        statusBadge = isWanUp ? "<span style='font-size:12px; background:#10b981; color:#fff; padding:3px 8px; border-radius:12px; margin-left:12px; vertical-align:middle;'>" + _t('BDG_CONN') + "</span>" : "<span style='font-size:12px; background:#ef4444; color:#fff; padding:3px 8px; border-radius:12px; margin-left:12px; vertical-align:middle;'>" + _t('BDG_UNPLUG') + "</span>";
                        sDetails = _t('TXT_WAN_IP') + "<span class='nw-hl'>" + wIp + "</span>&nbsp;&nbsp;&nbsp;&nbsp;" + _t('TXT_UP_GW') + "<span class='nw-hl'>" + wGw + "</span>";
                    } else {
                        sTitle = _t('STAT_LAN');
                        sDetails = _t('TXT_LAN_IP') + "<span class='nw-hl'>" + lIp + "</span>&nbsp;&nbsp;&nbsp;&nbsp;" + _t('TXT_DHCP_SRV') + "<span class='nw-hl'>" + _t('TXT_ON') + "</span>";
                    }

                    if (modeTextEl) {
                        modeTextEl.innerHTML = "<div style='font-size:17px; font-weight:600; margin-bottom:10px; color:#ffffff; font-family: monospace; display: flex; align-items: center; justify-content: center;'>" + sTitle + statusBadge + "</div>" +
                                               "<div style='font-size:15px; font-weight:bold; color:#ffffff; font-family:monospace; letter-spacing:0.5px;'>" + sDetails + "</div>";
                    }
                }).catch(function(err) {
                    if (modeTextEl) modeTextEl.innerHTML = "<div style='color:#ef4444; font-weight:bold;'>" + _t('ERR_RD_SYS') + "</div>";
                });
            } catch(fatalError) {
                if (modeTextEl) modeTextEl.innerHTML = "<div style='color:#ef4444; font-weight:bold;'>" + _t('ERR_CRASH') + "</div>";
            }
        }

        updateStatusDisplay(false);

        setInterval(function() {
            if (step1.style.display !== 'none' && container.querySelector('#nw-global-modal').style.display === 'none') {
                updateStatusDisplay(true);
            }
        }, 5000);

        function calculateNetmask(ip) {
            if (!ip) return '255.255.255.0';
            var firstByte = parseInt(ip.split('.')[0], 10);
            if (firstByte >= 1 && firstByte <= 126) return '255.0.0.0';       
            if (firstByte >= 128 && firstByte <= 191) return '255.255.0.0';     
            return '255.255.255.0'; 
        }

        function isValidIP(ip) {
            if (!ip) return false;
            var parts = ip.split('.');
            if (parts.length !== 4) return false;
            for (var i = 0; i < 4; i++) {
                var num = parseInt(parts[i], 10);
                if (isNaN(num) || num < 0 || num > 255 || String(num) !== parts[i]) return false;
            }
            if (parts[0] === '0' || parts[0] === '127') return false;
            var lastPart = parseInt(parts[3], 10);
            if (lastPart === 0 || lastPart === 255) return false;
            return true;
        }

        function isSameSubnet(ip1, ip2) {
            if (!ip1 || !ip2) return false;
            var p1 = ip1.split('.'), p2 = ip2.split('.');
            if (p1.length === 4 && p2.length === 4) return p1[0] === p2[0] && p1[1] === p2[1] && p1[2] === p2[2];
            return false;
        }

        function openModal(options) {
            var m = container.querySelector('#nw-global-modal');
            container.querySelector('#nw-global-title').innerHTML = options.title || '';
            container.querySelector('#nw-global-msg').innerHTML = options.msg || '';
            container.querySelector('#nw-global-spinner').style.display = options.spin ? 'block' : 'none';
            var btnWrap = container.querySelector('#nw-global-btn-wrap'), btnOk = container.querySelector('#nw-global-btn-ok'), btnCancel = container.querySelector('#nw-global-btn-cancel');
            btnWrap.style.display = (options.okText || options.cancelText) ? 'flex' : 'none';
            
            if (options.okText) { 
                btnOk.style.display = 'block'; btnOk.innerText = options.okText;
                btnOk.className = options.isDanger ? 'nw-modal-btn-danger' : 'nw-modal-btn-ok';
                btnOk.onclick = function() { if (options.onOk) options.onOk(); else m.style.display = 'none'; }; 
            } else btnOk.style.display = 'none';

            if (options.cancelText) { 
                btnCancel.style.display = 'block'; btnCancel.innerText = options.cancelText; 
                btnCancel.onclick = function() { if (options.onCancel) options.onCancel(); else m.style.display = 'none'; }; 
            } else btnCancel.style.display = 'none';
            m.style.display = 'flex';
        }

        function returnToStep1() { container.querySelector('#nw-global-modal').style.display = 'none'; step3.style.display = 'none'; step2.style.display = 'none'; step1.style.display = 'block'; }

        container.querySelectorAll('input[name="router_type"]').forEach(function(r) {
            r.addEventListener('change', function() { container.querySelector('#router-static-fields').style.display = (this.value === 'static') ? 'block' : 'none'; });
        });

        var bypassToggle = container.querySelector('#lan-bypass-toggle');
        bypassToggle.addEventListener('change', function() {
            container.querySelector('#lan-bypass-warning').style.display = this.checked ? 'block' : 'none';
            container.querySelector('#lan-main-warning').style.display = this.checked ? 'none' : 'block';
        });

        container.querySelectorAll('.nw-card').forEach(function (card) {
            card.addEventListener('click', function () {
                selectedMode = card.getAttribute('data-mode');
                step1.style.display = 'none';
                container.querySelector('#fields-router').style.display = (selectedMode === 'router') ? 'block' : 'none';
                container.querySelector('#fields-pppoe').style.display = (selectedMode === 'pppoe') ? 'block' : 'none';
                container.querySelector('#fields-lan').style.display = (selectedMode === 'lan') ? 'block' : 'none';
                step2.style.display = 'block';
            });
        });

        container.querySelector('#btn-back-1').addEventListener('click', function () { step2.style.display = 'none'; step1.style.display = 'block'; });
        container.querySelector('#top-back-1').addEventListener('click', function () { step2.style.display = 'none'; step1.style.display = 'block'; });
        container.querySelector('#btn-back-2').addEventListener('click', function () { step3.style.display = 'none'; step2.style.display = 'block'; });
        container.querySelector('#top-back-2').addEventListener('click', function () { step3.style.display = 'none'; step2.style.display = 'block'; });

        container.querySelector('#btn-next-2').addEventListener('click', function () {
            try {
                var rTypeEl = container.querySelector('input[name="router_type"]:checked');
                var rType = rTypeEl ? rTypeEl.value : 'dhcp';
                var targetIp = '', targetGw = '', isBypass = false;

                if (selectedMode === 'lan') {
                    targetIp = container.querySelector('#lan-ip').value.trim();
                    targetGw = container.querySelector('#lan-gw').value.trim();
                    isBypass = bypassToggle.checked;

                    if (!targetIp) { openModal({title: _t('M_INC_TIT'), msg: _t('M_INC_IP'), okText:_t('BTN_EDIT')}); return; }
                    if (!isValidIP(targetIp)) { openModal({title:_t('M_FMT_TIT'), msg:_t('M_FMT_IP'), okText:_t('BTN_EDIT')}); return; }
                    if (isBypass) {
                        if (!targetGw) { openModal({title:_t('M_LOGIC_TIT'), msg:_t('M_LOGIC_BYP'), okText:_t('BTN_EDIT')}); return; }
                        if (!isValidIP(targetGw)) { openModal({title:_t('M_FMT_TIT'), msg:_t('M_FMT_GW'), okText:_t('BTN_EDIT')}); return; }
                    } else if (targetGw && !isValidIP(targetGw)) { openModal({title:_t('M_FMT_TIT'), msg:_t('M_FMT_GW'), okText:_t('BTN_EDIT')}); return; }
                } else if (selectedMode === 'router' && rType === 'static') {
                    targetIp = container.querySelector('#router-ip').value.trim();
                    targetGw = container.querySelector('#router-gw').value.trim();

                    if (!targetIp || !targetGw) { openModal({title:_t('M_INC_TIT'), msg:_t('M_INC_WAN'), okText:_t('BTN_EDIT')}); return; }
                    if (!isValidIP(targetIp)) { openModal({title:_t('M_FMT_TIT'), msg:_t('M_FMT_WAN'), okText:_t('BTN_EDIT')}); return; }
                    if (!isValidIP(targetGw)) { openModal({title:_t('M_FMT_TIT'), msg:_t('M_FMT_GW'), okText:_t('BTN_EDIT')}); return; }
                } else if (selectedMode === 'pppoe') {
                    if (!(container.querySelector('#pppoe-user').value || '').trim() || !(container.querySelector('#pppoe-pass').value || '').trim()) { 
                        openModal({title: _t('M_INC_TIT'), msg: _t('M_INC_PPPOE'), okText: _t('BTN_EDIT')}); return; 
                    }
                }

                uci.load('network').then(function() {
                    var currentLanIp = safeUciGet('network', 'lan', 'ipaddr', window.location.hostname).split('/')[0].replace(/[^0-9\.]/g, '');
                    var currentLanGw = safeUciGet('network', 'lan', 'gateway', '').replace(/[^0-9\.]/g, '');
                    var currentWanProto = safeUciGet('network', 'wan', 'proto', '').toLowerCase();
                    var currentWanIp = (currentWanProto === 'static') ? safeUciGet('network', 'wan', 'ipaddr', '').split('/')[0].replace(/[^0-9\.]/g, '') : '';
                    var currentWanGw = safeUciGet('network', 'wan', 'gateway', '').replace(/[^0-9\.]/g, '');
                    var lDhcp = safeUciGet('dhcp', 'lan', 'ignore', '');
                    var currentBypass = (lDhcp === '1' || lDhcp === 'true' || lDhcp === 'on' || lDhcp === 'yes') ? '1' : '0';
                    var newBypass = bypassToggle.checked ? '1' : '0';

                    if ((selectedMode === 'lan' && targetIp === currentLanIp && targetGw === currentLanGw && newBypass === currentBypass) ||
                        (selectedMode === 'router' && rType === 'static' && targetIp === currentWanIp && targetGw === currentWanGw) ||
                        (selectedMode === 'router' && rType === 'dhcp' && currentWanProto === 'dhcp')) {
                         openModal({title: _t('M_NO_MOD_TIT'), msg: _t('M_NO_MOD_MSG'), okText: _t('M_EXIT'), onOk: returnToStep1 }); return;
                    }

                    if (selectedMode === 'router' && rType === 'static') {
                        if (targetIp === currentLanIp) { openModal({title:_t('M_CFLT_TIT'), msg:_t('M_CFLT_IP1')+currentLanIp+_t('M_CFLT_IP2'), okText:_t('BTN_EDIT')}); return; }
                        if (isSameSubnet(targetIp, currentLanIp)) { openModal({title:_t('M_CFLT_TIT'), msg:_t('M_CFLT_SUB1')+currentLanIp+_t('M_CFLT_SUB2'), okText:_t('BTN_EDIT')}); return; }
                        if (targetIp === targetGw) { openModal({title:_t('M_LOGIC_TIT'), msg:_t('M_SAME_GW'), okText:_t('BTN_EDIT')}); return; }
                        if (!isSameSubnet(targetIp, targetGw)) { openModal({title:_t('M_SUB_ERR_TIT'), msg:_t('M_SUB_ERR_WAN') + targetGw + _t('M_SUB_ERR_WAN2') + targetGw.substring(0, targetGw.lastIndexOf('.')) + '.x。', okText:_t('BTN_EDIT')}); return; }
                    }

                    if (selectedMode === 'lan') {
                        if (isBypass) {
                            if (targetIp === targetGw) { openModal({title:_t('M_LOGIC_TIT'), msg:_t('M_SAME_BYP'), okText:_t('BTN_EDIT')}); return; }
                            if (!isSameSubnet(targetIp, targetGw)) { openModal({title:_t('M_SUB_ERR_TIT'), msg:_t('M_SUB_ERR_BYP'), okText:_t('BTN_EDIT')}); return; }
                        }
                        if (currentWanIp && targetIp === currentWanIp) { openModal({title:_t('M_CFLT_TIT'), msg:_t('M_CFLT_LAN_IP1')+currentWanIp+_t('M_CFLT_IP2'), okText:_t('BTN_EDIT')}); return; }
                        if (currentWanIp && isSameSubnet(targetIp, currentWanIp)) { openModal({title:_t('M_CFLT_TIT'), msg:_t('M_CFLT_LAN_SUB1')+currentWanIp+_t('M_CFLT_SUB2'), okText:_t('BTN_EDIT')}); return; }
                    }

                    var buildDetailHtml = function(title, pairs) {
                        var h = "<div style='text-align:center; font-size:18px; margin-bottom:15px;'>" + title + "</div><div style='background:rgba(0,0,0,0.15); border-radius:8px; padding:10px 15px; font-size:14.5px;'>";
                        for (var i=0; i < pairs.length; i++) h += "<div style='display:flex; justify-content:space-between; padding:5px 0; border-bottom:1px solid rgba(255,255,255,0.1);'><span style='opacity:0.8;'>" + pairs[i][0] + "</span><span style='font-family:monospace;'>" + pairs[i][1] + "</span></div>";
                        return h + "</div>";
                    };

                    if (selectedMode === 'lan') {
                        confirmText.innerHTML = buildDetailHtml(isBypass ? _t('MODE_LAN_TITLE')+" - "+_t('STAT_BYPASS') : _t('MODE_LAN_TITLE')+" - "+_t('STAT_LAN'), [[_t('TXT_DEV_IP').replace(':',''), targetIp], [_t('LBL_GW'), targetGw || _t('TXT_NOT_SET')], ["DHCP", isBypass ? _t('TXT_OFF') : _t('TXT_ON')]]);
                    } else if (selectedMode === 'router') {
                        if (rType === 'static') confirmText.innerHTML = buildDetailHtml(_t('STAT_SEC_STATIC'), [[_t('TXT_WAN_IP').replace(':',''), targetIp], [_t('TXT_UP_GW').replace(':',''), targetGw]]);
                        else confirmText.innerHTML = buildDetailHtml(_t('STAT_SEC_DHCP'), [[_t('LBL_CONN_TYPE'), _t('OPT_DHCP')], [_t('M_IP_GW'), _t('M_AUTO_UP')]]);
                    } else if (selectedMode === 'pppoe') {
                        confirmText.innerHTML = buildDetailHtml(_t('MODE_PPPOE_TITLE'), [[_t('M_ACCT'), container.querySelector('#pppoe-user').value], [_t('M_PWD'), _t('M_HIDDEN')]]);
                    }
                    
                    if (selectedMode === 'lan' && !isBypass && targetGw !== '') {
                        openModal({
                            title: _t('M_WARN_TIT'), msg: _t('M_WARN_MSG'),
                            cancelText: _t('BTN_EDIT'), onCancel: closeModal,
                            okText: _t('M_WARN_BTN'), isDanger: true, onOk: function() { closeModal(); step2.style.display = 'none'; step3.style.display = 'block'; }
                        });
                        return;
                    }

                    step2.style.display = 'none'; step3.style.display = 'block';
                }).catch(function(e) {
                    openModal({title:_t('M_SYS_ERR'), msg:_t('M_SYS_MSG'), okText:_t('M_CLOSE')});
                });
            } catch (err) {
                openModal({title:_t('ERR_RD_SYS'), msg:_t('ERR_CRASH'), okText:_t('M_CLOSE')});
            }
        });

        container.querySelector('#btn-apply').addEventListener('click', function () {
            var actualMode = selectedMode, arg1 = '', arg2 = '', arg3 = '', arg4 = '';
            var rTypeEl = container.querySelector('input[name="router_type"]:checked');
            var rType = rTypeEl ? rTypeEl.value : 'dhcp';
            
            if (selectedMode === 'lan') {
                arg1 = container.querySelector('#lan-ip').value.trim();
                arg2 = container.querySelector('#lan-gw').value.trim();
                arg3 = calculateNetmask(arg1); // 计算掩码
                arg4 = bypassToggle.checked ? '1' : '0';
            } else if (selectedMode === 'router') {
                actualMode = (rType === 'dhcp') ? 'wan_dhcp' : 'wan_static';
                if(rType === 'static') {
                    arg1 = container.querySelector('#router-ip').value.trim();
                    arg2 = container.querySelector('#router-gw').value.trim();
                    arg3 = calculateNetmask(arg1); // 计算掩码
                }
            } else if (selectedMode === 'pppoe') {
                arg1 = container.querySelector('#pppoe-user').value;
                arg2 = container.querySelector('#pppoe-pass').value;
            }

            openModal({title:_t('M_APP_TIT'), msg:_t('M_APP_MSG'), spin:true});
            var startTime = Date.now(), rpcDone = false;
            
            var handleSuccess = function() {
                var currentHost = window.location.hostname, cleanUrl = window.location.href.split('?')[0], ts = new Date().getTime();
                
                // 写入强制刷新标记
                sessionStorage.setItem('nw_force_refresh', '1');

                if (selectedMode === 'lan' && arg1 && arg1 !== currentHost) {
                    openModal({ title: _t('M_SUCC_TIT'), msg: _t('M_SUCC_MSG1') + arg1 + _t('M_SUCC_MSG2'), spin: true });
                    setTimeout(function() { window.location.href = 'http://' + arg1 + '?v=' + ts; }, 15000);
                } else {
                    openModal({ title: _t('M_RST_TIT'), msg: _t('M_RST_MSG'), spin: true });
                    setTimeout(function() { window.location.href = cleanUrl + '?v=' + ts; }, 15000); 
                }
            };
            
            callNetSetup(actualMode, arg1, arg2, arg3, arg4).then(function() {
                rpcDone = true; handleSuccess();
            }).catch(function(e){
                if (Date.now() - startTime < 1500) {
                    rpcDone = true;
                    openModal({ title: _t('M_FAIL_TIT'), msg: _t('M_FAIL_MSG') + (e.message || 'Unknown') + '</small>', okText: _t('M_CLOSE'), isDanger: true });
                } else { rpcDone = true; handleSuccess(); }
            });
            setTimeout(function() { if (!rpcDone) handleSuccess(); }, 8000);
        });
    }
});
