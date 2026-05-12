/*
 * Copyright (C) 2026 huchd0 <https://github.com/huchd0/luci-app-netwiz>
 * Licensed under the GNU General Public License v3.0
 */
'use strict';
'require view';
'require dom';
'require rpc';

var T = {
    'NW_TITLE': _('Netwiz NETWORK SETUP'),
    'NW_SUBTITLE': _('Pure · Secure · Non-destructive Minimalist Config'),
    'BTN_HOME': _('Back to Home'),
    'DEV_TITLE': _('Device Network Manager'),
    'DEV_SUBTITLE': _('Terminal Device Monitoring & Static IP Management'),
    'BTN_RESCAN': _('Rescan Network'),
    'BTN_REFRESH': _('Refresh'),
    'TXT_LOADING_RADAR': _('Syncing underlying network data...'),
    'TAB_ALL': _('All'),
    'TAB_MOBILE': _('Mobile/Tablet'),
    'TAB_PC': _('PC/Work'),
    'TAB_IOT': _('Smart Home'),
    'TAB_OTHER': _('Others'),
    'LBL_ROW_TYPE_SMART': _('Device Type (By IP)'),
    'LBL_ROW_TYPE_NAME': _('Device Type (Built-in)'),
    'LBL_ROW_CUSTOM': _('Custom Groups'),
    'TAB_DEPT_OTHER': _('Uncategorized'),
    'LBL_SMART_FILTER': _('Filter by IP Subnet'),
    'TIP_SMART_FILTER': _('Checked: Classify device types by IP subnet') + '\n' + _('Unchecked: Classify device types by built-in names'),
    'PH_DEPT_NAME': _('Group Name'),
    'TXT_GROUP_PREFIX': _('Group '),
    'ERR_SAVE_RPC': _('❌ Save Failed!') + '\n' + _('Reason: RPC interface unresponsive ({err})') + '\n' + _('Please run this command in router SSH to restart the service: /etc/init.d/rpcd restart'),
    'LBL_SELECT_ALL': _('Select all available devices'),
    'TXT_SELECTED': _('Selected'),
    'TXT_ITEMS': _('items'),
    'BTN_BATCH_UNBIND': _('Batch Unbind'),
    'BTN_BATCH_BIND': _('Batch Assign'),
    'LBL_DEV_ALIAS': _('Device Alias'),
    'PH_DEV_ALIAS': _('e.g., John\'s PC'),
    'LBL_QUICK_STRAT': _('Quick Assign Strategy (Click to auto-fill)'),
    'STRAT_KEEP': _('Keep Original IP'),
    'STRAT_SMART': _('Smart Categorization'),
    'STRAT_SEQ': _('Sequential Memory'),
    'LBL_ASSIGN_IP': _('Assign Static IP (Auto anti-conflict)'),
    'PH_IP': _('e.g., 192.168.1.50'),
    'LBL_SEL_STRAT': _('Select Assign Strategy'),
    'STRAT_KEEP_TITLE': _('Keep Current IP (Recommended)'),
    'STRAT_KEEP_DESC': _('Convert the device\'s current random IP to a permanent static IP'),
    'STRAT_SMART_TITLE': _('Smart Subnet (By Device Type)'),
    'STRAT_SMART_DESC': _('Auto-identify mobile/PC, assign to exclusive subnets'),
    'STRAT_SEQ_TITLE': _('Specify Starting IP (Sequential)'),
    'STRAT_SEQ_DESC': _('Enter starting suffix, sequentially assign to all selected devices'),
    'LBL_START_IP': _('Starting IP'),
    'LBL_OTHERS': _('Others:'),
    'LBL_MOBILE': _('Mobile/Tablet:'),
    'LBL_PC': _('PC/Work:'),
    'LBL_IOT': _('Smart Home:'),
    'BTN_CANCEL': _('Cancel'),
    'BTN_OK': _('OK'),
    'MSG_EMPTY_CAT': _('No device records in this category'),
    'BDG_ONLINE': _('Online'),
    'BDG_OFFLINE': _('Offline'),
    'BDG_STATIC': _('Static'),
    'BDG_GW': _('Upstream Gateway'),
    'BDG_LOCAL': _('Local System'),
    'BDG_VISITOR': _('Visiting'),
    'TXT_SYS_ROUTE': _('System Core Route'),
    'TXT_SYS_RESERVED': _('System Reserved Device'),
    'BTN_EDIT': _('Edit'),
    'BTN_UNBIND': _('Unbind'),
    'BTN_QUICK_BIND': _('Quick Bind'),
    'TXT_UNKNOWN_DEV': _('Unknown Device'),
    'TXT_UNKNOWN_IP': _('Unknown IP'),
    'BDG_ADDR_IP': _('Terminal Addressed IP'),
    'BDG_PENDING': _('Pending'),
    'TIT_EDIT_DEV': _('Edit Device Info'),
    'TIT_QUICK_BIND': _('Quick Bind IP'),
    'TXT_CONFIG_MAC': _('Configuring MAC: '),
    'BTN_SAVE': _('Save Changes'),
    'BTN_BIND_DEV': _('Bind Device'),
    'MSG_WRITING': _('Safely writing and restarting services...'),
    'TIT_UNBIND': _('Unbind IP'),
    'MSG_UNBIND_CONFIRM': _('Are you sure you want to unbind the static IP for device (<b>{mac}</b>)?'),
    'BTN_CONFIRM_UNBIND': _('Confirm Unbind'),
    'MSG_RELEASING': _('Releasing static binding...'),
    'TIT_BATCH_UNBIND': _('Batch Unbind Devices'),
    'MSG_BATCH_UNBIND_CONFIRM': _('Among the {total} selected devices, <b>{valid}</b> have fixed IPs.<br><br>Are you sure you want to unbind them?'),
    'MSG_BATCH_RELEASING': _('Batch releasing IPs, please wait...'),
    'TIT_BATCH_BIND': _('Batch Assign Settings'),
    'TXT_SEL_STRAT_COUNT': _('Select Assign Strategy <span style="font-weight:normal; font-size:13.5px; color:#64748b;">(Selected <b style="color:#3b82f6;">{count}</b> devices)</span>'),
    'BTN_START_ASSIGN': _('Start Assign'),
    'MSG_RADAR_AVOID': _('Avoiding conflicts and silently writing rules...'),
    'MSG_NO_DEVS': _('No device records found in current LAN'),
    'MSG_SCAN_FAIL': _('❌ Scan failed: Cannot retrieve underlying data'),
    'ERR_POOL_FULL': _('❌ The IP pool for this type is full. Please expand the range or choose another strategy!'),
    'ERR_IP_EMPTY': _('IP address cannot be empty!'),
    'ERR_IP_CONFLICT': _('❌ IP Conflict Blocked!') + '\n\n' + _('The IP [{ip}] is occupied by device [{name}].') + '\n' + _('Please modify the strategy or enter a free IP!'),
    'TIP_NO_CHANGE': _('💡 Tip: The device is already fixed at this IP. No changes needed!'),
    'TIP_ALL_UNBOUND': _('💡 Tip: The {count} selected devices are all [Unbound]. No unbind action needed!'),
    'ERR_SUF_RANGE': _('Starting suffix must be between 2 and 254!'),
    'ERR_POOL_INSUFF': _('❌ IP pool insufficient!') + '\n' + _('Only {avail} IPs left from .{suf}, but {count} devices selected.'),
    'ERR_CAT_FAIL': _('❌ [{name}] assignment failed!') + '\n' + _('Selected {req} devices, but only {avail} IPs available in the preset range.') + '\n' + _('Please expand the IP range for this category!'),
    'TIP_BATCH_NO_CHANGE': _('💡 Smart block: According to your strategy, the {count} selected devices are already fixed with unchanged IPs. No need to rewrite rules!'),
    'TXT_INFINITE': _('Infinite'),
    'TXT_EXPIRED': _('Expired'),
    'STRAT_DEPT': _('Group IP Pool'),
    'STRAT_DEPT_TITLE': _('Group Pool (Auto Assign)'),
    'STRAT_DEPT_DESC': _('Assign free IPs automatically from the selected Target Group\'s specific IP range'),
    'TIT_MGR_DEPTS': _('Department Network Segments'),
    'BTN_ADD_DEPT': _('+ Add New Department'),
    'ERR_DEPT_OVERLAP': _('❌ Subnet Conflict: IP ranges between groups cannot overlap!') + '\n' + _('Conflicting groups: {groups}'),
    'ERR_DEPT_NAME_DUP': _('❌ Save Failed: Group names cannot be duplicated!') + '\n' + _('Duplicate name: {name}'),
    'ERR_DEPT_INVALID': _('❌ Save Failed: IPs must be between 2-254 and format must be valid!'),
    'ERR_DEPT_POOL_FULL': _('❌ IP pool reached the end (254). Cannot auto-append. Please arrange subnets manually!'),
    'ERR_DEPT_FULL': _('❌ The IP pool for the selected department is full! Please expand the range.'),
    'LBL_TARGET_GROUP': _('Assign to Group (Optional)'),
    'OPT_NO_GROUP': _('-- Uncategorized (None) --'),
    'ERR_DEPT_NOT_SEL': _('❌ Strategy Error: Please select a Target Group first to allocate IPs from its pool!'),
    'TIT_FW_CONTROL': _('Firewall & Access Control'),
    'BDG_FW_BLK': _('Net Blocked'),
    'BDG_FW_ISO': _('Isolated'),
    'BDG_FW_DMZ': _('DMZ Host'),
    'LBL_SHOW_CONNS': _('Live Connections'),
    'TIP_SHOW_CONNS': _('Monitor real-time connections (Auto turn off in 3 mins)'),
    'LBL_CONN_COUNT': _('Conns'),
    'TXT_FW_PANEL_TITLE': _('Manage device network access anytime, anywhere'),
    'LBL_FW_BLK_TITLE': _('⛔ Block Internet (WAN)'),
    'LBL_FW_BLK_DESC': _('Instantly cut off internet access. LAN communication remains normal.'),
    'LBL_FW_ISO_TITLE': _('🛡️ LAN Isolation (Anti-snooping)'),
    'LBL_FW_ISO_DESC': _('Block internal network access for this device to prevent scanning and privacy leaks.'),
    'LBL_FW_DMZ_TITLE': _('🚀 DMZ Host (Expose to WAN)'),
    'LBL_FW_DMZ_DESC': _('Forward all WAN ports to this device. Only one device allowed.'),
    'TIP_MAC_CTRL': _('Click to control access'),
    'ERR_DMZ_NO_IP': _('❌ Cannot enable DMZ: Device has no valid IP or is offline!'),
    'ERR_DMZ_OCCUPIED_1': _('❌ Denied! Only one DMZ host allowed.') + '\n\n' + _('Device [ '),
    'ERR_DMZ_OCCUPIED_2': _(' ] is currently the DMZ.') + '\n' + _('Please disable its DMZ first!'),
    'ERR_FW_SAVE_FAIL': _('❌ Save failed!') + '\n\n' + _('Reason: RPC Error ({err}).') + '\n' + _('Please run `/etc/init.d/rpcd restart` in SSH and try again!'),
    'ERR_SAVE_FAIL_SHORT': _('❌ Save failed!') + '\n' + _('Reason: {err}') + '\n' + _('Please run `/etc/init.d/rpcd restart` in SSH'),
    'ERR_IP_FORMAT': _('❌ Invalid IP format! Please enter a valid IPv4 address (e.g., 192.168.1.50)'),
    'TIP_V6_COPY': _('Public IPv6 (Click to copy):'),
    'MSG_V6_COPIED': _('IPv6 address copied successfully:'),
    'BTN_EXPORT_DEPTS': _('Export Config'),
    'BTN_IMPORT_DEPTS': _('Import Config'),
    'MSG_IMPORT_SUCCESS': _('✅ Import successful!') + '\n' + _('Please verify and click [Save] below to apply.'),
    'ERR_IMPORT_FAIL': _('❌ Import failed!') + '\n' + _('Invalid or corrupted file format. Please select a valid JSON backup file.'),
    'BDG_NEW_UNKNOWN': _('Suspected Spoofed Device'),
    'BTN_RESET_ALL': _('Factory Reset'),
    'TIT_RESET_ALL': _('⚠️ Danger: Restore Default Network'),
    'MSG_RESET_CONFIRM': _('Are you sure you want to clear all static IPs and firewall rules set by Netwiz?<br><br><span style="color:#ef4444; font-weight:bold;">This operation will delete all groups, blacklists, isolations, and DMZ settings, and restart network services.</span>'),
    'MSG_RESETTING': _('Cleaning up and restarting network services...'),
    'TIT_CONN_RADAR': _('⚡ Connection Radar Analysis'),
    'MSG_DIVE_KERNEL': _('Diving into system kernel to capture connection records...'),
    'LBL_CONN_WEB': _('Web/HTTPS'),
    'LBL_CONN_DNS': _('DNS/NTP'),
    'LBL_CONN_UDP': _('UDP Stream/Game'),
    'LBL_CONN_P2P': _('P2P/High Ports'),
    'LBL_CONN_OTH': _('Others/Unknown'),
    'MSG_CONN_TOTAL': _('# Successfully parsed {total} source connection records...'),
    'MSG_CONN_CMD': _('root@OpenWrt:~# cat /proc/net/nf_conntrack | awk \'...\' # (Filtering src={ip})'),
    'MSG_CONN_EMPTY': _('[ No active connection records ]'),
    'MSG_CONN_TRUNC': _('... (First 50 records shown for performance) ...'),
    'MSG_CONN_ANALYZE_FAIL': _('Analysis failed: {err}')
};

var callDeviceList = rpc.declare({ object: 'netwiz_dev', method: 'get_list', params: ['show_conns'], expect: { '': {} } });
var callFwSet = rpc.declare({ object: 'netwiz_dev', method: 'fw_set', params: ['mac', 'ip', 'blk_en', 'iso_en', 'dmz_en'], expect: { result: 0 } });
var callDeviceBind = rpc.declare({ object: 'netwiz_dev', method: 'bind', params: ['mac', 'ip', 'name', 'dept', 'no_reload'], expect: { result: 0 } });
var callDeviceUnbind = rpc.declare({ object: 'netwiz_dev', method: 'unbind', params: ['mac', 'no_reload'], expect: { result: 0 } });
var callApplyDhcp = rpc.declare({ object: 'netwiz_dev', method: 'apply_dhcp', expect: { result: 0 } });
var callGetDepts = rpc.declare({ object: 'netwiz_dev', method: 'get_depts', expect: { depts: [] } });
var callSaveDepts = rpc.declare({ object: 'netwiz_dev', method: 'save_depts', params: ['data'], expect: { result: 0 } });
var callV6KeepAlive = rpc.declare({ object: 'netwiz_dev', method: 'v6_keep_alive', params: ['mac'], expect: { result: 0 } });

var callGetSmartRanges = rpc.declare({ object: 'netwiz_dev', method: 'get_smart_ranges', expect: { ranges: {} } });
var callSaveSmartRanges = rpc.declare({ object: 'netwiz_dev', method: 'save_smart_ranges', params: ['data'], expect: { result: 0 } });
var callResetAll = rpc.declare({ object: 'netwiz_dev', method: 'reset_all', expect: { result: 0 } });
var callAnalyzeConns = rpc.declare({ object: 'netwiz_dev', method: 'analyze_conns', params: ['ip'], expect: { '': {} } });

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

        var container = dom.create('div', { id: 'netwiz-dev-container' });

        var htmlTemplate = [
            '<link rel="stylesheet" type="text/css" href="' + L.resource('view/netwiz.css') + '?v=' + Date.now() + '">',
            '<style>',
            '  .nd-card-name svg { width: 18px; height: 18px; margin-right: 2px; vertical-align: sub; }',
            '  .nd-lease-info svg { width: 12px; height: 12px; margin-right: 2px; vertical-align: baseline; }',
            '  .btn-bind svg { width: 15px; height: 15px; margin-right: 4px; vertical-align: sub; }',
            '  .nd-batch-close-btn:hover { color: #ef4444; }',
            '  .dept-color::-webkit-color-swatch-wrapper { padding: 0; }',
            '  .dept-color::-webkit-color-swatch { border: none; border-radius: 4px; }',
            '  .nd-ip-num::-webkit-outer-spin-button, .nd-ip-num::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }',
            '  .nd-ip-num { -moz-appearance: textfield; }',
            '  .nd-dept-row-inner { display: flex; align-items: center; gap: 10px; width: 100%; }',
            '  .nd-dept-col-name { display: flex; flex: 1 1 160px; gap: 6px; }', 
            '  .nd-dept-col-ip { display: flex; align-items: center; justify-content: center; background: #fff; border-radius: 6px; padding: 2px 8px; flex: 0 0 auto; }',
            '  .nd-dept-col-actions { display: flex; align-items: center; gap: 8px; flex: 0 0 auto; }',

            '  @media screen and (max-width: 768px) {',
            '    .nd-batch-bar.show { padding-right: 15px !important; }',
            '    .nd-batch-close-btn { top: 2px; right: 15px; transform: none; font-size: 36px; }',
            '    .nd-dept-row-inner { display: grid; grid-template-columns: 1fr auto; gap: 10px; }',
            '    .nd-dept-col-name { grid-column: 1 / 2; grid-row: 1 / 2; }',
            '    .nd-dept-col-actions { grid-column: 2 / 3; grid-row: 1 / 2; }',
            '    .nd-dept-col-ip { grid-column: 1 / 3; grid-row: 2 / 3; width: 100%; box-sizing: border-box; }',
            '    .nd-dept-ctrl-bar { flex-direction: row !important; align-items: center !important; gap: 5px !important; padding-top: 0; padding-bottom: 10px !important; justify-content: space-between !important; }',
            '    .nd-dept-io-group { width: auto !important; justify-content: flex-start !important; gap: 5px !important; flex: 2; }',
            '    .nd-dept-io-group .nd-btn { flex: 1; min-width: 0 !important; padding: 10px 2px !important; font-size: 13px !important; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }',
            '    .nd-dept-ctrl-bar #btn-add-dept { width: auto !important; flex: 1.2; padding: 10px 2px !important; font-size: 14px !important; align-self: center !important; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }',
            '    .dept-row { padding: 8px 10px !important; margin-bottom: 8px !important; }',
            '    .nd-dept-row-inner { gap: 6px !important; }',
            '    .dept-row .nd-input { min-height: 36px !important; padding: 2px 8px !important; font-size: 13.5px !important; }',
            '    .nd-dept-col-ip { padding: 0px 4px !important; }',
            '    .nd-dept-col-actions .d-color, .nd-dept-col-actions .d-del { height: 36px !important; width: 36px !important; flex: 0 0 36px !important; min-width: 36px !important; max-width: 36px !important; }',
            '  }',
            '</style>',
            '<div class="nw-wrapper">',
            '   <div class="nw-header">',
            '      <div class="nw-title-wrap">',
            '         <div class="nw-main-title">{{NW_TITLE}}</div>',
            '         <div class="nw-version-tag">{{APP_VERSION}} <div class="nw-version-dot" style="display: none;"></div></div>',
            '      </div>',
            '      <p>{{NW_SUBTITLE}}</p>',
            '   </div>',

            '   <div class="nd-control-bar">',
            '      <div class="nd-cb-back" id="dev-back" title="{{BTN_HOME}}">',
            '         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width: 22px; height: 22px;"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>',
            '      </div>',
            '      <div class="nd-cb-title-wrap">',
            '          <div class="nd-cb-title">{{DEV_TITLE}}</div>',
            '          <p class="nd-cb-sub">{{DEV_SUBTITLE}}</p>',
            '      </div>',
            '      <div style="display:flex; align-items:center; gap:12px;">',
            '          <label class="nw-switch" title="{{TIP_SHOW_CONNS}}" style="display:flex; align-items:center; cursor:pointer; margin:0;">',
            '              <span style="font-size:13px; font-weight:bold; color:#fff; margin-right:8px; white-space:nowrap;">{{LBL_SHOW_CONNS}}</span>',
            '              <div style="position:relative; width:42px; height:22px; flex-shrink:0;">',
            '                  <input type="checkbox" id="cb-show-conns" style="opacity:0; width:0; height:0; margin:0; position:absolute;">',
            '                  <span class="nw-slider" style="position:absolute; top:0; left:0; right:0; bottom:0; border-radius:24px; transition:0.3s; background-color:rgba(255,255,255,0.3);"></span>',
            '              </div>',
            '          </label>',
            '          <div class="nd-cb-refresh" id="dev-refresh" title="{{BTN_RESCAN}}">',
            '             <svg class="nd-refresh-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width: 15px; height: 15px;"><path d="M21 2v6h-6"></path><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path></svg> <span class="nd-refresh-txt">{{BTN_REFRESH}}</span>',
            '          </div>',
            '      </div>',
            '   </div>',

            '   <div id="nd-loading" style="display:flex; flex-direction:column; align-items:center; padding:50px 0; gap:15px; color:#64748b; font-weight:bold; width: 100%;">',
            '      <div class="nd-spinner"></div>',
            '      <span id="nd-loading-text">{{TXT_LOADING_RADAR}}</span>',
            '   </div>',
            
            '   <div id="nd-category-tabs" class="nd-category-tabs" style="display:none; overflow-x:auto; white-space:nowrap; padding-bottom:5px;">',
            '   </div>',

            '   <div id="nd-list-header" class="nd-list-header" style="display:none; justify-content: space-between; align-items: center;">',
            '       <label class="nw-wiz-cb-wrap" style="margin:0;"><input type="checkbox" id="cb-select-all"><span class="nw-wiz-checkmark"></span> <span style="font-size:14.5px; font-weight:bold; color:#5e72e4;">{{LBL_SELECT_ALL}}</span></label>',
            '       <label class="nw-wiz-cb-wrap" style="margin:0 5px 0 0;" title="{{TIP_SMART_FILTER}}"><input type="checkbox" id="cb-smart-filter"><span class="nw-wiz-checkmark"></span> <span style="font-size:13px; font-weight:bold; color:#64748b;">{{LBL_SMART_FILTER}}</span></label>',
            '   </div>',

            '   <div id="nd-list-container" class="nd-list" style="display: none;"></div>',
            
            '   <div id="nd-batch-bar" class="nd-batch-bar" style="padding-right: 55px;">',
            '       <div id="nd-batch-close" class="nd-batch-close-btn" title="{{BTN_CANCEL}}" style="position: absolute; right: 10px; top: 30%; transform: translateY(-50%); font-size: 32px; color: #94a3b8; cursor: pointer; line-height: 1; z-index: 100; transition: color 0.2s; user-select: none; font-family: Arial, sans-serif; font-weight: normal;">&times;</div>',
            '       <div class="nd-batch-info">{{TXT_SELECTED}} <span id="nd-batch-count" style="color:#3b82f6;">0</span> {{TXT_ITEMS}}</div>',
            '       <div class="nd-batch-actions">',
            '           <button id="btn-batch-unbind" class="nd-btn nd-btn-red nd-btn-sm">{{BTN_BATCH_UNBIND}}</button>',
            '           <button id="btn-batch-bind" class="nd-btn nd-btn-blue nd-btn-sm">{{BTN_BATCH_BIND}}</button>',
            '       </div>',
            '   </div>',
            '</div>', 

            '<div id="nd-modal-overlay">',
            '   <div class="nd-modal-box">',
            '       <div id="nd-m-title" class="nd-modal-title"></div>',
            '       <div id="nd-m-content" style="color:#475569; font-size:15px; margin-bottom:10px; text-align:left; line-height:1.2;"></div>',
            
            '       <div id="nd-m-dept-mgr" class="nd-dept-mgr-wrap" style="display:none; max-height: 400px; overflow-y: auto; overflow-x: hidden; padding: 5px 5px 10px 0;">',
            '           <div class="nd-dept-ctrl-bar" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding: 5px 5px 12px 5px; margin-top: -6px; border-bottom: 1px dashed #cbd5e1; position: sticky; top: -6px; background: #fff; z-index: 10; gap: 10px;">',
            '               <div class="nd-dept-io-group" style="display: flex; gap: 10px;">',
            '                   <button id="btn-import-depts" class="nd-btn nd-btn-gray" style="padding: 6px 12px; font-size: 13px; border-radius: 6px; display: flex; align-items: center; justify-content: center;">📂 {{BTN_IMPORT_DEPTS}}</button>',
            '                   <button id="btn-export-depts" class="nd-btn nd-btn-gray" style="padding: 6px 12px; font-size: 13px; border-radius: 6px; display: flex; align-items: center; justify-content: center;">💾 {{BTN_EXPORT_DEPTS}}</button>',
            '               </div>',
            '               <button id="btn-add-dept" class="nd-btn nd-btn-blue" style="padding: 6px 12px; font-size: 13px; border-radius: 6px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(59,130,246,0.2);">+ {{BTN_ADD_DEPT}}</button>',
            '           </div>',
            '           <div id="dept-list-container"></div>',
            '       </div>',

            '       <div id="nd-m-fw-panel" style="display:none; text-align:left;">',
            '           <div style="display:flex; justify-content:center; align-items:center; margin-bottom:15px; position:relative;">',
            '               <p style="font-size:15px; font-weight:bold; color:#64748b; margin:0;">{{TXT_FW_PANEL_TITLE}}</p>',
            '               <div id="fw-reset-gear" title="{{TIT_RESET_ALL}}" style="position:absolute; right:10px; cursor:pointer; font-size:18px; filter:grayscale(100%); opacity:0.4; transition:all 0.3s;" onmouseover="this.style.filter=\'none\'; this.style.opacity=1; this.style.transform=\'rotate(90deg)\'" onmouseout="this.style.filter=\'grayscale(100%)\'; this.style.opacity=0.4; this.style.transform=\'none\'">⚙️</div>',
            '           </div>',
            '           <div style="background:#f8fafc; margin:10px;  padding:15px; border-radius:12px; border:1px solid #e2e8f0; margin-bottom:15px;">',
            '               <label class="nw-switch-row-padded" style="cursor:pointer; display:flex; align-items:center; justify-content:space-between; border-bottom:1px dashed #cbd5e1; padding-bottom:15px; margin-bottom:15px;">',
            '                   <div style="flex:1; padding-right:15px;">',
            '                       <div style="font-size:15.5px; font-weight:bold; color:#ef4444; margin-bottom:5px;">{{LBL_FW_BLK_TITLE}}</div>',
            '                       <div style="font-size:13px; color:#64748b; line-height:1.4;">{{LBL_FW_BLK_DESC}}</div>',
            '                   </div>',
            '                   <div class="nw-switch" style="width:42px; height:22px; flex-shrink:0;"><input type="checkbox" id="fw-blk-en"><span class="nw-slider"></span></div>',
            '               </label>',
            '               <label class="nw-switch-row-padded" style="cursor:pointer; display:flex; align-items:center; justify-content:space-between; border-bottom:1px dashed #cbd5e1; padding-bottom:15px; margin-bottom:15px;">',
            '                   <div style="flex:1; padding-right:15px;">',
            '                       <div style="font-size:15.5px; font-weight:bold; color:#d97706; margin-bottom:5px;">{{LBL_FW_ISO_TITLE}}</div>',
            '                       <div style="font-size:13px; color:#64748b; line-height:1.4;">{{LBL_FW_ISO_DESC}}</div>',
            '                   </div>',
            '                   <div class="nw-switch" style="width:42px; height:22px; flex-shrink:0;"><input type="checkbox" id="fw-iso-en"><span class="nw-slider"></span></div>',
            '               </label>',
            '               <label class="nw-switch-row-padded" style="cursor:pointer; display:flex; align-items:center; justify-content:space-between; border:none; padding-bottom:0; margin-bottom:0;">',
            '                   <div style="flex:1; padding-right:15px;">',
            '                       <div style="font-size:15.5px; font-weight:bold; color:#8b5cf6; margin-bottom:5px;">{{LBL_FW_DMZ_TITLE}}</div>',
            '                       <div style="font-size:13px; color:#64748b; line-height:1.4;">{{LBL_FW_DMZ_DESC}}</div>',
            '                   </div>',
            '                   <div class="nw-switch" style="width:42px; height:22px; flex-shrink:0;"><input type="checkbox" id="fw-dmz-en"><span class="nw-slider"></span></div>',
            '               </label>',
            '           </div>',
            '       </div>',

            '       <div id="nd-m-form" style="display:none;">',
            '           <div id="nd-m-normal-fields">',
            '               <div class="nd-input-group">',
            '                   <label class="nd-input-label">{{LBL_DEV_ALIAS}}</label>',
            '                   <input type="text" id="nd-inp-name" class="nd-input" placeholder="{{PH_DEV_ALIAS}}" autocomplete="off">',
            '               </div>',
            '               <div class="nd-input-group" id="nd-single-strategy-group" style="display:none;">',
            '                   <label class="nd-input-label">{{LBL_QUICK_STRAT}}</label>',
            '                   <div class="nw-radio-group" style="flex-direction: row; flex-wrap: wrap; gap: 8px;">',
            '                       <label class="nw-radio-btn" style="flex: 1 1 30%;"><input type="radio" name="single_strategy" value="keep" checked> <span class="nw-radio-btn-text" style="padding: 12px 4px; font-size: 14.5px;">🛡️ {{STRAT_KEEP}}</span></label>',
            '                       <label class="nw-radio-btn" style="flex: 1 1 30%;"><input type="radio" name="single_strategy" value="smart"> <span class="nw-radio-btn-text" style="padding: 12px 4px; font-size: 14.5px;">🧠 {{STRAT_SMART}}</span></label>',
            '                       <label class="nw-radio-btn" style="flex: 1 1 30%;"><input type="radio" name="single_strategy" value="seq"> <span class="nw-radio-btn-text" style="padding: 12px 4px; font-size: 14.5px;">🔢 {{STRAT_SEQ}}</span></label>',
            '                       <label class="nw-radio-btn" style="flex: 1 1 30%;"><input type="radio" name="single_strategy" value="dept"> <span class="nw-radio-btn-text" style="padding: 10px 4px; font-size: 15.5px;">🏢 {{STRAT_DEPT}}</span></label>',
            '                   </div>',
            '               </div>',
            // 目标组选项
            '               <div class="nd-input-group">',
            '                   <label class="nd-input-label">{{LBL_TARGET_GROUP}}</label>',
            '                   <select id="nd-single-tag-select" class="nd-input"></select>',
            '               </div>',
            '               <div class="nd-input-group">',
            '                   <label class="nd-input-label">{{LBL_ASSIGN_IP}}</label>',
            '                   <input type="text" id="nd-inp-ip" class="nd-input" placeholder="{{PH_IP}}" autocomplete="off">',
            '               </div>',
            '           </div>',
            '           <div id="nd-m-batch-fields" style="display:none;">',
            '               <div class="nd-input-group">',
            '                   <label class="nd-input-label">{{LBL_SEL_STRAT}}</label>',
            '                   <div class="nd-strategy-grid" style="display:grid; grid-template-columns:1fr; gap:12px;">',
            '                       <div class="nd-strategy-card active" data-val="keep">',
            '                       <div style="font-size:15px;">🛡️ {{STRAT_KEEP_TITLE}}</div>',
            '                           <div style="font-size:12.5px; font-weight:normal; opacity:0.8;">{{STRAT_KEEP_DESC}}</div>',
            '                       </div>',
            '                       <div class="nd-strategy-card" data-val="smart">',
            '                           <div style="font-size:15px;">🧠 {{STRAT_SMART_TITLE}}</div>',
            '                           <div style="font-size:12.5px; font-weight:normal; opacity:0.8;">{{STRAT_SMART_DESC}}</div>',
            '                       </div>',
            '                       <div class="nd-strategy-card" data-val="seq">',
            '                           <div style="font-size:15px;">🔢 {{STRAT_SEQ_TITLE}}</div>',
            '                           <div style="font-size:12.5px; font-weight:normal; opacity:0.8;">{{STRAT_SEQ_DESC}}</div>',
            '                       </div>',
            '                       <div class="nd-strategy-card" data-val="dept">',
            '                           <div style="font-size:15px;">🏢 {{STRAT_DEPT_TITLE}}</div>',
            '                           <div style="font-size:12.5px; font-weight:normal; opacity:0.8;">{{STRAT_DEPT_DESC}}</div>',
            '                       </div>',
            '                   </div>',
            '               </div>',
            // 目标组选项
            '               <div class="nd-input-group">',
            '                   <label class="nd-input-label">{{LBL_TARGET_GROUP}}</label>',
            '                   <select id="nd-batch-tag-select" class="nd-input"></select>',
            '               </div>',
            '               <div class="nd-input-group" id="nd-batch-ip-group" style="display:none;">',
            '                   <label class="nd-input-label">{{LBL_START_IP}}</label>',
            '                   <div style="display:flex; align-items:center; background:#f8fafc; border:1px solid #cbd5e1; border-radius:8px; overflow:hidden; transition:all 0.2s;">',
            '                       <span id="nd-batch-prefix" style="padding:12px 0 12px 14px; font-family:monospace; color:#64748b; font-size:15px; font-weight:bold;">192.168.1.</span>',
            '                       <input type="number" id="nd-batch-suffix" style="flex:1; border:none !important; background:transparent !important; box-shadow:none !important; -webkit-appearance:none !important; appearance:none !important; outline:none !important; border-radius:0 !important; padding:12px 14px 12px 2px; font-size:15px; font-family:monospace; font-weight:bold; color:#0f172a;" placeholder="50" min="2" max="254">',
            '                   </div>',
            '               </div>',
            '               <div id="nd-batch-smart-desc" style="display:none; font-size:13px; color:#64748b; background:#f8fafc; padding:0 3px; border-radius:10px; margin-bottom:5px; border:1px dashed #cbd5e1;">',
            '                   <div class="nd-smart-row"><div class="nd-smart-label">📱 {{LBL_MOBILE}}</div> <div class="nd-smart-inputs"><span class="nd-ip-prefix"></span><input type="number" id="sm-mob-s" class="nd-input-sm" value="30"> <span class="nd-smart-dash">-</span> <input type="number" id="sm-mob-e" class="nd-input-sm" value="69"></div></div>',
            '                   <div class="nd-smart-row"><div class="nd-smart-label">💻 {{LBL_PC}}</div> <div class="nd-smart-inputs"><span class="nd-ip-prefix"></span><input type="number" id="sm-pc-s" class="nd-input-sm" value="70"> <span class="nd-smart-dash">-</span> <input type="number" id="sm-pc-e" class="nd-input-sm" value="109"></div></div>',
            '                   <div class="nd-smart-row"><div class="nd-smart-label">💡 {{LBL_IOT}}</div> <div class="nd-smart-inputs"><span class="nd-ip-prefix"></span><input type="number" id="sm-iot-s" class="nd-input-sm" value="110"> <span class="nd-smart-dash">-</span> <input type="number" id="sm-iot-e" class="nd-input-sm" value="149"></div></div>',
            '                   <div class="nd-smart-row" style="margin-bottom:0; border-bottom:none; padding-bottom:0;"><div class="nd-smart-label">🏷️ {{LBL_OTHERS}}</div> <div class="nd-smart-inputs"><span class="nd-ip-prefix"></span><input type="number" id="sm-oth-s" class="nd-input-sm" value="150"> <span class="nd-smart-dash">-</span> <input type="number" id="sm-oth-e" class="nd-input-sm" value="199"></div></div>',
            '               </div>',
            '           </div>',
            '       </div>',
            '       <div class="nd-modal-actions" style="display: flex; gap: 15px; width: 100%; margin-top: 25px; padding-top: 15px; border-top: 1px solid #f1f5f9;">',
            '           <button id="nd-m-cancel" class="nd-btn nd-btn-gray" style="flex:1;">{{BTN_CANCEL}}</button>',
            '           <button id="nd-m-ok" class="nd-btn nd-btn-blue" style="flex:1;">{{BTN_OK}}</button>',
            '       </div>',
            '   </div>',
            '</div>'
        ].join('\n');

        for (var k in T) { htmlTemplate = htmlTemplate.split('{{' + k + '}}').join(T[k]); }
        container.innerHTML = htmlTemplate;
        this.bindEvents(container);
        return container;
    },

    bindEvents: function(container) {
        container.querySelector('#dev-back').addEventListener('click', function(e) {
            e.preventDefault(); 
            var wrap = document.querySelector('.nw-wrapper');
            if (wrap) wrap.classList.add('page-leaving');
            
            setTimeout(function() {
                window.location.href = window.location.pathname.replace('/netwiz_dev', '/netwiz');
            }, 350); 
        });

        var modalOverlay = container.querySelector('#nd-modal-overlay');
        var mTitle = container.querySelector('#nd-m-title');
        var mContent = container.querySelector('#nd-m-content');
        var mForm = container.querySelector('#nd-m-form');
        var mDeptMgr = container.querySelector('#nd-m-dept-mgr');
        var mNormalFields = container.querySelector('#nd-m-normal-fields');
        var mBatchFields = container.querySelector('#nd-m-batch-fields');
        var mInpName = container.querySelector('#nd-inp-name');
        var mInpIp = container.querySelector('#nd-inp-ip');
        
        var mSingleStrategyGroup = container.querySelector('#nd-single-strategy-group');
        var mSingleTagSelect = container.querySelector('#nd-single-tag-select');
        var singleRadios = container.querySelectorAll('input[name="single_strategy"]');
        var currentSingleDev = null;
        var currentOriginalIp = "";

        var strategyCards = container.querySelectorAll('.nd-strategy-card');
        var batchIpGroup = container.querySelector('#nd-batch-ip-group');
        var batchSmartDesc = container.querySelector('#nd-batch-smart-desc');
        var batchTagSelect = container.querySelector('#nd-batch-tag-select');
        var batchSuffixInput = container.querySelector('#nd-batch-suffix');

        var mBtnOk = container.querySelector('#nd-m-ok');
        var mBtnCancel = container.querySelector('#nd-m-cancel');

        if (modalOverlay) { document.body.appendChild(modalOverlay); }
        
        var controlBar = container.querySelector('.nd-control-bar');
        if (controlBar) {
            var lastHeight = -1;
            var adjustStickyTop = function() {
                var validBottoms = [0];
                var headers = document.querySelectorAll('header, .navbar, .main-top, #header, .topbar');
                for (var i = 0; i < headers.length; i++) {
                    var style = window.getComputedStyle(headers[i]);
                    if (style.position === 'fixed' || style.position === 'sticky') {
                        var rect = headers[i].getBoundingClientRect();

                        if (rect.top <= 5 && rect.height >= 35 && rect.height <= 90) {
                            validBottoms.push(rect.bottom);
                        }
                    }
                }
                
                var topOffset = 0;
                var realBottoms = validBottoms.filter(function(b) { return b > 0; });
                if (realBottoms.length > 0) topOffset = Math.min.apply(null, realBottoms);
                if (topOffset > 0) topOffset -= 3;

                if (topOffset !== lastHeight) {
                    controlBar.style.setProperty('top', topOffset + 'px', 'important');
                    lastHeight = topOffset;
                }
            };
            
            var startTime = Date.now();
            var fastCheck = function() {
                adjustStickyTop();
                if (Date.now() - startTime < 2000) {
                    window.requestAnimationFrame(fastCheck);
                }
            };
            window.requestAnimationFrame(fastCheck);
            
            window.addEventListener('scroll', function() {
                if (lastHeight <= 0) adjustStickyTop();
            }, { passive: true });
            window.addEventListener('resize', adjustStickyTop);
        }

        var savedStrategy = localStorage.getItem('nw_batch_strategy') || 'keep';
        var defaultSmartRanges = {ms:30, me:69, ps:70, pe:109, is:110, ie:149, os:150, oe:199};
        var cachedRangesStr = localStorage.getItem('nw_smart_ranges');
        var savedRanges = cachedRangesStr ? JSON.parse(cachedRangesStr) : JSON.parse(JSON.stringify(defaultSmartRanges));
        var needFetchSmart = !cachedRangesStr;
        var basePrefix = '192.168.1.';
        
        var smartFilterByIp = localStorage.getItem('nw_smart_filter') !== 'false'; 
        
        var cbSmartFilter = container.querySelector('#cb-smart-filter');
        if (cbSmartFilter) {
            cbSmartFilter.checked = smartFilterByIp;
            cbSmartFilter.addEventListener('change', function() {
                smartFilterByIp = this.checked;
                localStorage.setItem('nw_smart_filter', smartFilterByIp);
                selectedDevices = []; 
                updateTabsAndFilter();
            });
        }

        var rangeInputs = [
            {s: '#sm-mob-s', e: '#sm-mob-e'},
            {s: '#sm-pc-s', e: '#sm-pc-e'},
            {s: '#sm-iot-s', e: '#sm-iot-e'},
            {s: '#sm-oth-s', e: '#sm-oth-e'}
        ];
        function autoCascadeRanges() {
            var prevEnd = 1; 
            for (var i = 0; i < rangeInputs.length; i++) {
                var elS = modalOverlay.querySelector(rangeInputs[i].s);
                var elE = modalOverlay.querySelector(rangeInputs[i].e);
                var valS = parseInt(elS.value) || 2;
                var valE = parseInt(elE.value) || 2;

                if (valS <= prevEnd) valS = prevEnd + 1;
                if (valE < valS) valE = valS + 10;
                if (valE > 254) valE = 254;
                if (valS > 254) valS = 253;

                elS.value = valS;
                elE.value = valE;
                prevEnd = valE;
            }
        }
        rangeInputs.forEach(function(ri) {
            modalOverlay.querySelector(ri.s).addEventListener('change', autoCascadeRanges);
            modalOverlay.querySelector(ri.e).addEventListener('change', autoCascadeRanges);
        });

        var globalDepartments = [];

        function getDeviceDept(dev) {
            if (dev.dept && dev.dept !== 'none' && dev.dept !== '') {
                return globalDepartments.find(function(d){ return d.id === dev.dept; }) || null;
            }
            return null;
        }

        function populateTagSelects() {
            var html = '<option value="none">' + T['OPT_NO_GROUP'] + '</option>';
            globalDepartments.forEach(function(d) {
                html += '<option value="'+d.id+'">' + d.icon + ' ' + d.name + '</option>';
            });
            if(mSingleTagSelect) mSingleTagSelect.innerHTML = html;
            if(batchTagSelect) batchTagSelect.innerHTML = html;
        }

        function renderDeptManager(overrideDepts) {
            var c = modalOverlay.querySelector('#dept-list-container');
            c.innerHTML = '';
            var tempDepts = overrideDepts ? overrideDepts : JSON.parse(JSON.stringify(globalDepartments));
            
            function renderRow(d, idx) {
                var el = document.createElement('div');
                el.className = 'dept-row';
                el.style.cssText = 'background:#f8fafc; padding:10px; border-radius:8px; border:1px solid #e2e8f0; margin-bottom:10px;';
                el.innerHTML = 
                    '<div class="nd-dept-row-inner">' +
                        '<div class="nd-dept-col-name">' +
                            '<input type="text" class="nd-input d-icon" style="flex: 0 0 35px !important; width:35px !important; max-width:35px !important; text-align:center; padding:8px 0 !important;" value="'+(d.icon||'📁')+'" title="Icon">' +
                            '<input type="text" class="nd-input d-name" style="flex:1; min-width:80px; padding:8px;" value="'+(d.name||'')+'" placeholder="'+T['PH_DEPT_NAME']+'">' +
                        '</div>' +
                        '<div class="nd-dept-col-ip">' +
                            '<span style="font-family:monospace; color:#64748b; font-size:12px; font-weight:bold;">'+basePrefix.split('.')[0]+'.'+basePrefix.split('.')[1]+'.'+basePrefix.split('.')[2]+'.</span>' +
                            '<input type="number" class="nd-input nd-ip-num d-start" style="flex: 0 0 45px !important; width:45px !important; border:none; box-shadow:none; background:transparent; padding:6px 0 !important; text-align:center; font-family:monospace; font-weight:bold; font-size:14px; color:#0f172a;" value="'+d.start+'" min="2" max="254">' +
                            '<span style="color:#94a3b8; font-weight:bold; margin:0 4px;">-</span>' +
                            '<input type="number" class="nd-input nd-ip-num d-end" style="flex: 0 0 45px !important; width:45px !important; border:none; box-shadow:none; background:transparent; padding:6px 0 !important; text-align:center; font-family:monospace; font-weight:bold; font-size:14px; color:#0f172a;" value="'+d.end+'" min="2" max="254">' +
                        '</div>' +
                        '<div class="nd-dept-col-actions">' +
                            '<input type="color" class="d-color dept-color" value="'+(d.color||'#3b82f6')+'" style="flex: 0 0 25px !important; width:34px !important; height:34px !important; cursor:pointer; padding:0; border:1px solid #cbd5e1; border-radius:4px;">' +
                            '<button class="nd-btn nd-btn-red d-del" style="flex: 0 0 34px !important; width: 34px !important; min-width: 34px !important; max-width: 34px !important; height: 34px !important; padding: 0 !important; margin: 0 !important; display: flex; align-items: center; justify-content: center; font-size: 22px; line-height: 1;">&times;</button>' +
                        '</div>' +
                    '</div>';
                
                el.querySelector('.d-del').onclick = function() { el.remove(); };
                
                var inpS = el.querySelector('.d-start');
                var inpE = el.querySelector('.d-end');
                var enforceLimits = function() {
                    var s = parseInt(inpS.value);
                    var e = parseInt(inpE.value);
                    if (isNaN(s)) s = 2;
                    if (isNaN(e)) e = 2;
                    if (s < 2) s = 2; if (s > 254) s = 254;
                    if (e < 2) e = 2; if (e > 254) e = 254;
                    if (s > e) e = s; 
                    inpS.value = s;
                    inpE.value = e;
                };
                inpS.addEventListener('blur', enforceLimits);
                inpE.addEventListener('blur', enforceLimits);

                return el;
            }

            tempDepts.forEach(function(d, i) { c.appendChild(renderRow(d, i)); });
            
            if (tempDepts.length === 0) {
                var newId = 'dept_' + Math.random().toString(36).substring(2,8);
                c.appendChild(renderRow({id: newId, icon: '🏷️', name: '', start: 50, end: 80, color: '#3b82f6'}, 0));
            }

            modalOverlay.querySelector('#btn-add-dept').onclick = function() {
                var currentRows = c.querySelectorAll('.dept-row');
                var maxEnd = 49; 
                currentRows.forEach(function(r) {
                    var eVal = parseInt(r.querySelector('.d-end').value);
                    if (!isNaN(eVal) && eVal > maxEnd) maxEnd = eVal;
                });

                var newStart = maxEnd + 1;
                if (newStart > 254) {
                    alert(T['ERR_DEPT_POOL_FULL']);
                    return;
                }

                var newEnd = newStart + 30;
                if (newEnd > 254) newEnd = 254;

                var newId = 'dept_' + Math.random().toString(36).substring(2,8);
                var newRow = renderRow({id: newId, icon: '🏷️', name: '', start: newStart, end: newEnd, color: '#64748b'}, currentRows.length);
                if (c.firstChild) {
                    c.insertBefore(newRow, c.firstChild);
                } else {
                    c.appendChild(newRow);
                }
                c.scrollTop = 0;
            };

            // ================= 导入导出 =================
            modalOverlay.querySelector('#btn-export-depts').onclick = function() {
                var currentData = saveDepartmentsFromDOM();
                if (currentData === false) return; // 如果有错误（重叠或留空），退出
                
                var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentData, null, 2));
                var dlNode = document.createElement('a');
                dlNode.setAttribute("href", dataStr);
                var dateStr = new Date().toISOString().slice(0,10).replace(/-/g,"");
                dlNode.setAttribute("download", "netwiz_groups_" + dateStr + ".json");
                
                document.body.appendChild(dlNode);
                dlNode.click();
                document.body.removeChild(dlNode);
            };

            modalOverlay.querySelector('#btn-import-depts').onclick = function() {
                var fileInput = document.createElement('input');
                fileInput.type = 'file';
                fileInput.accept = '.json';
                fileInput.style.display = 'none'; // 保持隐藏
                
                fileInput.onchange = function(e) {
                    var file = e.target.files[0];
                    if (!file) return;
                    
                    var reader = new FileReader();
                    reader.onload = function(evt) {
                        try {
                            var importedData = JSON.parse(evt.target.result);
                            if (!Array.isArray(importedData)) throw new Error('Not an array');
                            
                            // 导入成功
                            renderDeptManager(importedData);
                            alert(T['MSG_IMPORT_SUCCESS']);
                        } catch (err) {
                            alert(T['ERR_IMPORT_FAIL']);
                        }
                    };
                    reader.readAsText(file);
                };
                
                document.body.appendChild(fileInput); 
                fileInput.click(); 
                document.body.removeChild(fileInput);
            };
            // ================================================================

        }

        function saveDepartmentsFromDOM() {
            var rows = modalOverlay.querySelectorAll('.dept-row');
            var newDepts = [];
            var nameSet = {};

            for(var idx=0; idx<rows.length; idx++) {
                var r = rows[idx];
                var rawName = r.querySelector('.d-name').value.trim() || T['TXT_GROUP_PREFIX'] + (idx+1);
                var d = {
                    id: 'd_' + idx,
                    icon: r.querySelector('.d-icon').value.trim() || '📁',
                    name: rawName,
                    start: parseInt(r.querySelector('.d-start').value),
                    end: parseInt(r.querySelector('.d-end').value),
                    color: r.querySelector('.d-color').value
                };

                if (isNaN(d.start) || isNaN(d.end) || d.start < 2 || d.end > 254 || d.start > d.end) {
                    alert(T['ERR_DEPT_INVALID']);
                    return false;
                }
                
                if (nameSet[d.name]) {
                    alert(T['ERR_DEPT_NAME_DUP'].replace('{name}', '[' + d.name + ']'));
                    return false;
                }
                nameSet[d.name] = true;

                newDepts.push(d);
            }
            
            for(var i=0; i<newDepts.length; i++) {
                for(var j=i+1; j<newDepts.length; j++) {
                    if (Math.max(newDepts[i].start, newDepts[j].start) <= Math.min(newDepts[i].end, newDepts[j].end)) {
                        alert(T['ERR_DEPT_OVERLAP'].replace('{groups}', '[' + newDepts[i].name + '] & [' + newDepts[j].name + ']'));
                        return false; 
                    }
                }
            }
            
            return newDepts;
        }

        function ipToLong(ip) { return ip.split('.').reduce(function(ipInt, octet) { return (ipInt<<8) + parseInt(octet, 10)}, 0) >>> 0; }
        function longToIp(long) { return [ (long >>> 24), (long >> 16 & 255), (long >> 8 & 255), (long & 255) ].join('.'); }
        
        function getAvailableIpInRange(bPrefix, startSuffix, endSuffix, usedIps) {
            for (var i = startSuffix; i <= endSuffix; i++) {
                var testIp = bPrefix + i;
                if (usedIps.indexOf(testIp) === -1) return testIp;
            }
            return null;
        }

        function getNextAvailableIp(startIp, usedIps) {
            var num = ipToLong(startIp);
            while(usedIps.indexOf(longToIp(num)) !== -1) { num++; }
            return longToIp(num);
        }

        function getDeviceType(dev) {
            var n = (dev.name || '').toLowerCase(); 
            if (n.match(/iphone|ipad|ios|android|galaxy|huawei|xiaomi|redmi|vivo|oppo|realme|oneplus|phone|pad|tablet|honor|meizu/)) return 'mobile';        
            if (n.match(/win|windows|desktop|laptop|pc|macbook|imac|macmini|thinkpad|dell|hp|lenovo|asus|acer|ubuntu|linux|debian|ds|nas/)) return 'pc';
            if (n.match(/router|ap|wifi|mesh|tplink|tenda|asus_router|netgear|phicomm|zte|ruijie|mercury|xiaomi_router|camera|plug|socket|switch|light|lamp|bulb|printer|tv|soundbox|iot|smart|miap|lumi|viomi|aqara|cam|speaker|audio|watch|jdc/)) return 'iot';       
            return 'type_other';
        }

        var updateSingleIpByStrategy = function() {
            if(!currentSingleDev) return;
            var activeRadio = modalOverlay.querySelector('input[name="single_strategy"]:checked');
            if(!activeRadio) return;
            var val = activeRadio.value;
            
            var usedIps = [];
            globalDevices.forEach(function(d) {
                if (d.mac === currentSingleDev.mac) return; 
                if (d.ip && d.ip !== 'Unknown IP') usedIps.push(d.ip);
                if (d.bound_ip && d.bound_ip !== 'Unknown IP') usedIps.push(d.bound_ip);
            });

            if (val === 'keep') {
                mInpIp.value = currentOriginalIp;
            } else if (val === 'smart') {
                var devType = getDeviceType(currentSingleDev);
                var sStart = savedRanges.os, sEnd = savedRanges.oe;
                if (devType === 'mobile') { sStart = savedRanges.ms; sEnd = savedRanges.me; }
                else if (devType === 'pc') { sStart = savedRanges.ps; sEnd = savedRanges.pe; }
                else if (devType === 'iot') { sStart = savedRanges.is; sEnd = savedRanges.ie; }
                var smartIp = getAvailableIpInRange(basePrefix, sStart, sEnd, usedIps);
                if(smartIp) {
                    mInpIp.value = smartIp;
                } else {
                    mInpIp.value = '';
                    alert(T['ERR_POOL_FULL']);
                }
            } else if (val === 'dept') {
                var dId = mSingleTagSelect.value;
                if (dId === 'none') {
                    mInpIp.value = '';
                } else {
                    var tgt = globalDepartments.find(function(d){ return d.id === dId; });
                    if(tgt) {
                        var dip = getAvailableIpInRange(basePrefix, tgt.start, tgt.end, usedIps);
                        mInpIp.value = dip || '';
                        if(!dip) alert(T['ERR_DEPT_FULL']);
                    }
                }
            } else if (val === 'seq') {
                var lastIp = localStorage.getItem('nw_last_ip');
                if (!lastIp || lastIp.substring(0, lastIp.lastIndexOf('.') + 1) !== basePrefix) {
                    lastIp = basePrefix + "50"; 
                }
                mInpIp.value = getNextAvailableIp(lastIp, usedIps);
            }
        };

        singleRadios.forEach(function(radio) {
            radio.addEventListener('change', updateSingleIpByStrategy);
        });

        mSingleTagSelect.addEventListener('change', function() {
            var activeRadio = modalOverlay.querySelector('input[name="single_strategy"]:checked');
            if (activeRadio && activeRadio.value === 'dept') {
                updateSingleIpByStrategy();
            }
        });

        function applyStrategyUI(val) {
            strategyCards.forEach(function(c) { c.classList.remove('active'); });
            var targetCard = modalOverlay.querySelector('.nd-strategy-card[data-val="'+val+'"]');
            if (targetCard) targetCard.classList.add('active');

            if (val === 'seq') {
                batchIpGroup.style.display = 'block';
                batchSmartDesc.style.display = 'none';
                setTimeout(function(){ batchSuffixInput.focus(); }, 100);
            } else if (val === 'smart') {
                batchIpGroup.style.display = 'none';
                batchSmartDesc.style.display = 'block';
                modalOverlay.querySelectorAll('.nd-ip-prefix').forEach(function(el) { el.innerText = basePrefix; });
                modalOverlay.querySelector('#sm-oth-s').value = savedRanges.os; 
                modalOverlay.querySelector('#sm-oth-e').value = savedRanges.oe;
                modalOverlay.querySelector('#sm-mob-s').value = savedRanges.ms; 
                modalOverlay.querySelector('#sm-mob-e').value = savedRanges.me;
                modalOverlay.querySelector('#sm-pc-s').value = savedRanges.ps; 
                modalOverlay.querySelector('#sm-pc-e').value = savedRanges.pe;
                modalOverlay.querySelector('#sm-iot-s').value = savedRanges.is; 
                modalOverlay.querySelector('#sm-iot-e').value = savedRanges.ie;
                autoCascadeRanges(); 
            } else {
                batchIpGroup.style.display = 'none';
                batchSmartDesc.style.display = 'none';
            }
        }

        strategyCards.forEach(function(card) {
            card.addEventListener('click', function() {
                var val = this.getAttribute('data-val');
                localStorage.setItem('nw_batch_strategy', val);
                applyStrategyUI(val);
            });
        });

        batchSuffixInput.addEventListener('focus', function() { this.parentElement.style.borderColor = '#3b82f6'; this.parentElement.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.15)'; });
        batchSuffixInput.addEventListener('blur', function() { this.parentElement.style.borderColor = '#cbd5e1'; this.parentElement.style.boxShadow = 'none'; });

        var openModal = function(options) {
            var floatBar = document.querySelector('#nd-batch-bar');
            if (floatBar) floatBar.style.setProperty('display', 'none', 'important');

            mTitle.innerText = options.title || '';
            if (options.content) { mContent.innerHTML = options.content; mContent.style.display = 'block'; } else { mContent.style.display = 'none'; }
            
            var mFwPanel = modalOverlay.querySelector('#nd-m-fw-panel');
            var fwCurrentMac = options.targetMac || "";
            var fwCurrentIp = options.targetIp || "";

            mForm.style.display = 'none';
            mDeptMgr.style.display = 'none';
            if (mFwPanel) mFwPanel.style.display = 'none';

            if (options.isDeptMgr) {
                mDeptMgr.style.display = 'block';
                renderDeptManager();
            } else if (options.isFwPanel) {
                if (mFwPanel) mFwPanel.style.display = 'block';
                var d = options.targetDev;
                var chkBlk = modalOverlay.querySelector('#fw-blk-en');
                var chkIso = modalOverlay.querySelector('#fw-iso-en');
                var chkDmz = modalOverlay.querySelector('#fw-dmz-en');
                if (chkBlk) chkBlk.checked = (d.fw_block === 'true' || d.fw_block === true);
                if (chkIso) chkIso.checked = (d.fw_isolate === 'true' || d.fw_isolate === true);
                if (chkDmz) {
                    chkDmz.checked = (d.fw_dmz === 'true' || d.fw_dmz === true);
                    chkDmz.dataset.orig = chkDmz.checked; // 记住初始状态
                }
            } else if (options.showForm) {
                mForm.style.display = 'block'; 
                populateTagSelects();
                
                if (options.isBatchBind) {
                    mNormalFields.style.display = 'none';
                    mBatchFields.style.display = 'block';
                    applyStrategyUI(savedStrategy);
                } else {
                    mBatchFields.style.display = 'none';
                    mNormalFields.style.display = 'block';
                    mInpName.value = options.defName || ''; 
                    
                    if (options.showSingleStrategy) {
                        mSingleStrategyGroup.style.display = 'block';
                        // 预选部门
                        if (currentSingleDev && currentSingleDev.dept) {
                            mSingleTagSelect.value = currentSingleDev.dept;
                        } else {
                            mSingleTagSelect.value = 'none';
                        }
                    } else {
                        mSingleStrategyGroup.style.display = 'none';
                        mInpIp.value = options.defIp || ''; 
                    }
                }
            }
            
            mBtnOk.className = 'nd-btn ' + (options.danger ? 'nd-btn-red' : 'nd-btn-blue');
            mBtnOk.innerText = options.okText || T['BTN_OK'];
            mBtnCancel.style.display = options.hideCancel ? 'none' : '';
            
            mBtnOk.onclick = function() {
                if (options.isDeptMgr) {
                    var finalDepts = saveDepartmentsFromDOM();
                    if(finalDepts !== false) {
                        if (options.onOk) options.onOk(finalDepts);
                        modalOverlay.style.display = 'none';
                    }
                } else if (options.isFwPanel) {
                    var blkEn = modalOverlay.querySelector('#fw-blk-en') ? modalOverlay.querySelector('#fw-blk-en').checked : false;
                    var isoEn = modalOverlay.querySelector('#fw-iso-en') ? modalOverlay.querySelector('#fw-iso-en').checked : false;
                    var dmzEl = modalOverlay.querySelector('#fw-dmz-en');
                    var dmzEn = dmzEl ? dmzEl.checked : false;
                    
                    // DMZ校验
                    if (dmzEn && dmzEl.dataset.orig !== 'true') {
                        if (!fwCurrentIp || fwCurrentIp === 'Unknown IP') {
                            alert(T['ERR_DMZ_NO_IP']); return;
                        }
                        var otherDmz = globalDevices.find(function(d){ return (d.fw_dmz === 'true' || d.fw_dmz === true) && d.mac !== fwCurrentMac; });
                        if (otherDmz) {
                            alert(T['ERR_DMZ_OCCUPIED_1'] + (otherDmz.name||otherDmz.mac) + T['ERR_DMZ_OCCUPIED_2']);
                            return;
                        }
                    }

                    if (options.onOk) options.onOk({ mac: fwCurrentMac, ip: fwCurrentIp, blk_en: blkEn, iso_en: isoEn, dmz_en: dmzEn });
                    modalOverlay.style.display = 'none';
                    if (typeof floatBar !== 'undefined' && floatBar) floatBar.style.removeProperty('display');
                } else if (options.showForm) {
                    if (options.isBatchBind) {
                        var activeStrategy = modalOverlay.querySelector('.nd-strategy-card.active').getAttribute('data-val');
                        var batchDeptId = batchTagSelect.value;
                        
                        if (activeStrategy === 'dept' && batchDeptId === 'none') {
                            alert(T['ERR_DEPT_NOT_SEL']);
                            return;
                        }

                        if (activeStrategy === 'smart') {
                            autoCascadeRanges(); 
                            var nr = {
                                ms: parseInt(modalOverlay.querySelector('#sm-mob-s').value), me: parseInt(modalOverlay.querySelector('#sm-mob-e').value),
                                ps: parseInt(modalOverlay.querySelector('#sm-pc-s').value), pe: parseInt(modalOverlay.querySelector('#sm-pc-e').value),
                                is: parseInt(modalOverlay.querySelector('#sm-iot-s').value), ie: parseInt(modalOverlay.querySelector('#sm-iot-e').value),
                                os: parseInt(modalOverlay.querySelector('#sm-oth-s').value), oe: parseInt(modalOverlay.querySelector('#sm-oth-e').value)
                            };
                            
                            if (JSON.stringify(nr) !== JSON.stringify(savedRanges)) {
                                savedRanges = nr;
                                localStorage.setItem('nw_smart_ranges', JSON.stringify(nr)); 
                                needFetchSmart = false; 

                                var dataToSend = (JSON.stringify(nr) === JSON.stringify(defaultSmartRanges)) ? "{}" : JSON.stringify(nr);
                                callSaveSmartRanges(dataToSend).catch(function(e){ console.error('Save smart ranges fail', e); });
                            }
                        }
                        var resBatch = { strategy: activeStrategy, startSuffix: batchSuffixInput.value.trim(), ranges: savedRanges, dept: batchDeptId };
                        if (options.onOk) options.onOk(resBatch);
                        modalOverlay.style.display = 'none';
                        if (floatBar) floatBar.style.removeProperty('display'); 
                    } else {
                        var submitIp = mInpIp.value.trim();
                        var singleDeptId = mSingleTagSelect.value;
                        var activeSingleRadio = modalOverlay.querySelector('input[name="single_strategy"]:checked');
                        
                        if (activeSingleRadio && activeSingleRadio.value === 'dept' && singleDeptId === 'none') {
                            alert(T['ERR_DEPT_NOT_SEL']);
                            return;
                        }

                        if (!submitIp) { alert(T['ERR_IP_EMPTY']); return; }

                        var ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
                        if (!ipRegex.test(submitIp)) {
                            alert(T['ERR_IP_FORMAT']); 
                            return; 
                        }

                        var conflictDev = globalDevices.find(function(d) {
                            return (d.bound_ip === submitIp || d.ip === submitIp) && d.mac !== options.targetMac;
                        });
                        
                        if (conflictDev) {
                            var cName = conflictDev.name === 'Unknown' ? conflictDev.mac.toUpperCase() : conflictDev.name;
                            alert(T['ERR_IP_CONFLICT'].replace('{ip}', submitIp).replace('{name}', cName));
                            return; 
                        }

                        var newName = mInpName.value.trim();
                        var isCurrentlyStatic = currentSingleDev.is_static === true || currentSingleDev.is_static === 'true';
                        var oldDeptId = currentSingleDev.dept || 'none';
                        
                        if (isCurrentlyStatic && submitIp === currentOriginalIp && newName === options.defName && singleDeptId === oldDeptId) {
                            alert(T['TIP_NO_CHANGE']);
                            return;
                        }
                        
                        var resSingle = { name: newName, ip: submitIp, dept: singleDeptId };
                        if(resSingle.ip) localStorage.setItem('nw_last_ip', resSingle.ip);
                        
                        if (options.onOk) options.onOk(resSingle);
                        modalOverlay.style.display = 'none';
                        if (floatBar) floatBar.style.removeProperty('display'); 
                    }
                } else {
                    if (options.onOk) options.onOk(true);
                    modalOverlay.style.display = 'none';
                    if (floatBar) floatBar.style.removeProperty('display'); 
                }
            };
            mBtnCancel.onclick = function() { 
                modalOverlay.style.display = 'none'; 
                if (floatBar) floatBar.style.removeProperty('display'); 
            };
            modalOverlay.style.display = 'flex';
        };

        var loadingEl = container.querySelector('#nd-loading');
        var loadingText = container.querySelector('#nd-loading-text');
        var listHeader = container.querySelector('#nd-list-header');
        var listEl = container.querySelector('#nd-list-container');
        var catTabs = container.querySelector('#nd-category-tabs');
        var refreshBtn = container.querySelector('#dev-refresh');
        
        var selectAllCb = container.querySelector('#cb-select-all');
        var batchBar = container.querySelector('#nd-batch-bar');
        
        if (batchBar) { document.body.appendChild(batchBar); }
        
        var batchCount = batchBar.querySelector('#nd-batch-count');
        var btnBatchBind = batchBar.querySelector('#btn-batch-bind');
        var btnBatchUnbind = batchBar.querySelector('#btn-batch-unbind');
        var btnBatchClose = batchBar.querySelector('#nd-batch-close');
        if (btnBatchClose) {
            btnBatchClose.addEventListener('click', function() {
                batchBar.classList.remove('show');
            });
        }

        var globalDevices = [];
        var filteredDevices = [];
        var selectedDevices = [];
        var currentFilter = 'all';

        // 全局并发控制
        window.nwKeepAliveQueue = window.nwKeepAliveQueue || [];
        window.nwActiveCount = window.nwActiveCount || 0; // 当前正在执行的任务数
        var MAX_CONCURRENT = 10; // 并发数：10

        function processKeepAliveQueue() {
            // 如果队列空了，或者并发数已经达到上限，就退出等待
            if (window.nwKeepAliveQueue.length === 0 || window.nwActiveCount >= MAX_CONCURRENT) return;

            // 没到并发上限，且队列里还有任务，执行
            while (window.nwKeepAliveQueue.length > 0 && window.nwActiveCount < MAX_CONCURRENT) {
                window.nwActiveCount++; // 占位：活跃任务数 +1
                var mac = window.nwKeepAliveQueue.shift(); // 取出 MAC

                // 锁定当前的 mac，防止污染
                (function(currentMac) {
                    callV6KeepAlive(currentMac).then(function() {
                        sessionStorage.setItem('nw_v6_hb_' + currentMac, 'sent'); 
                    }).catch(function() {
                        // 失败忽略
                    }).finally(function() {
                        // 延时 200 毫秒后释放槽位
                        setTimeout(function() {
                            window.nwActiveCount--; // 释放活跃任务数 -1
                            processKeepAliveQueue(); // 继续
                        }, 200); 
                    });
                })(mac);
            }
        }

        function isSelectable(dev) {
            var isSys = dev.is_gw === 'true' || dev.is_gw === true || dev.is_local === 'true' || dev.is_local === true;
            var isVisitor = dev.is_visitor === 'true' || dev.is_visitor === true;
            
            if (isSys || isVisitor) return false;
            return true; 
        }

        function updateBatchBar() {
            batchCount.innerText = selectedDevices.length;
            if (selectedDevices.length >= 2) {
                batchBar.classList.add('show');
            } else {
                batchBar.classList.remove('show');
            }
            var selectableInView = filteredDevices.filter(isSelectable);
            if (selectableInView.length > 0 && selectedDevices.length === selectableInView.length) {
                selectAllCb.checked = true;
            } else {
                selectAllCb.checked = false;
            }
        }

        function toggleSelection(dev, isChecked) {
            var idx = selectedDevices.findIndex(function(d) { return d.mac === dev.mac; });
            if (isChecked) {
                if (idx === -1 && isSelectable(dev)) selectedDevices.push(dev);
            } else {
                if (idx !== -1) selectedDevices.splice(idx, 1);
            }
            updateBatchBar();
        }

        selectAllCb.addEventListener('change', function() {
            var checked = this.checked;
            selectedDevices = [];
            if(checked) {
                filteredDevices.forEach(function(dev) {
                    if (isSelectable(dev)) selectedDevices.push(dev);
                });
            }
            renderListHTML(); 
            updateBatchBar();
        });

        function updateTabsAndFilter() {
            var cAll = globalDevices.length;
            
            var cMob = 0, cPc = 0, cIot = 0, cTypeOth = 0;
            
            var deptCounts = {};
            var cDeptOth = 0;
            globalDepartments.forEach(function(d) { deptCounts[d.id] = 0; });

            globalDevices.forEach(function(d) {
                var dept = getDeviceDept(d);
                if (dept) {
                    deptCounts[dept.id]++;
                } else {
                    cDeptOth++; 
                }

                var smartCat = 'type_other';
                if (smartFilterByIp) {
                    var ip = d.bound_ip || d.ip;
                    if (ip && ip !== 'Unknown IP' && ip.substring(0, basePrefix.length) === basePrefix) {
                        var suffix = parseInt(ip.split('.').pop());
                        if (!isNaN(suffix)) {
                            if (suffix >= savedRanges.ms && suffix <= savedRanges.me) smartCat = 'mobile';
                            else if (suffix >= savedRanges.ps && suffix <= savedRanges.pe) smartCat = 'pc';
                            else if (suffix >= savedRanges.is && suffix <= savedRanges.ie) smartCat = 'iot';
                        }
                    }
                } else {
                    var rawType = getDeviceType(d);
                    if (['mobile', 'pc', 'iot'].includes(rawType)) smartCat = rawType;
                }

                if (smartCat === 'mobile') cMob++;
                else if (smartCat === 'pc') cPc++;
                else if (smartCat === 'iot') cIot++;
                else cTypeOth++; 
            });

            if (currentFilter === 'mobile' && cMob === 0) currentFilter = 'all';
            else if (currentFilter === 'pc' && cPc === 0) currentFilter = 'all';
            else if (currentFilter === 'iot' && cIot === 0) currentFilter = 'all';
            else if (currentFilter === 'type_other' && cTypeOth === 0) currentFilter = 'all';
            else if (currentFilter === 'dept_other' && cDeptOth === 0) currentFilter = 'all';
            else if (currentFilter.startsWith('d_') && deptCounts[currentFilter] === 0) currentFilter = 'all';

            var btnAll = '<button class="nd-cat-btn '+(currentFilter==='all'?'active':'')+'" data-cat="all" style="'+(cAll===0?'display:none;':'')+'">'+T['TAB_ALL']+' (<span id="cnt-all">'+cAll+'</span>)</button>';
            var btnMob = '<button class="nd-cat-btn '+(currentFilter==='mobile'?'active':'')+'" data-cat="mobile" style="'+(cMob===0?'display:none;':'')+'">📱 '+T['TAB_MOBILE']+' (<span id="cnt-mobile">'+cMob+'</span>)</button>';
            var btnPc = '<button class="nd-cat-btn '+(currentFilter==='pc'?'active':'')+'" data-cat="pc" style="'+(cPc===0?'display:none;':'')+'">💻 '+T['TAB_PC']+' (<span id="cnt-pc">'+cPc+'</span>)</button>';
            var btnIot = '<button class="nd-cat-btn '+(currentFilter==='iot'?'active':'')+'" data-cat="iot" style="'+(cIot===0?'display:none;':'')+'">💡 '+T['TAB_IOT']+' (<span id="cnt-iot">'+cIot+'</span>)</button>';
            var btnTypeOth = '<button class="nd-cat-btn '+(currentFilter==='type_other'?'active':'')+'" data-cat="type_other" style="'+(cTypeOth===0?'display:none;':'')+'">🏷️ '+T['TAB_OTHER']+' (<span id="cnt-type-other">'+cTypeOth+'</span>)</button>';
            
            var deptBtns = '';
            globalDepartments.forEach(function(d) {
                var count = deptCounts[d.id];
                var activeStyle = currentFilter === d.id ? 'background:'+d.color+'15;' : '';
                var displayStyle = count === 0 ? 'display:none;' : '';
                deptBtns += '<button class="nd-cat-btn '+(currentFilter===d.id?'active':'')+'" data-cat="'+d.id+'" style="color:'+d.color+'; border-color:'+d.color+'40; '+activeStyle+displayStyle+'">'+d.icon+' '+d.name+' ('+count+')</button>';
            });
            var btnDeptOth = '<button class="nd-cat-btn '+(currentFilter==='dept_other'?'active':'')+'" data-cat="dept_other" style="border-color:#cbd5e1; color:#64748b; '+(cDeptOth===0?'display:none;':'')+'">❔ '+T['TAB_DEPT_OTHER']+' (<span id="cnt-dept-other">'+cDeptOth+'</span>)</button>';
            var btnMgr = '<button class="nd-cat-btn" id="btn-manage-depts" style="border-style:dashed; border-color:#cbd5e1; color:#64748b;">⚙️ '+ T['LBL_ROW_CUSTOM'] +'</button>';

            var tabsHtml = '';
            
            var row1Title = smartFilterByIp ? T['LBL_ROW_TYPE_SMART'] : T['LBL_ROW_TYPE_NAME'];
            tabsHtml += '<div style="display:flex; gap:8px; width:max-content; align-items:center; margin-bottom:10px;">';
            tabsHtml += '<div style="font-size:14px; font-weight:bold; color:#3b82f6 ; background:#f1f5f9; padding:5px 10px; border-radius:6px; margin-right:4px; border: 1px solid #3b82f6;">' + row1Title + '</div>';
            tabsHtml += btnAll + btnMob + btnPc + btnIot + btnTypeOth;
            tabsHtml += '</div>';

            tabsHtml += '<div style="display:flex; gap:8px; width:max-content; align-items:center;">';

            tabsHtml += deptBtns + btnDeptOth + btnMgr;
            tabsHtml += '</div>';
            
            catTabs.innerHTML = tabsHtml;

            catTabs.querySelectorAll('.nd-cat-btn').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    if (this.id === 'btn-manage-depts') {
                        openModal({
                            title: T['TIT_MGR_DEPTS'],
                            isDeptMgr: true,
                            okText: T['BTN_SAVE'],
                            onOk: function(newDepts) {
                                loadingEl.style.display = 'flex';
                                listEl.style.display = 'none';
                                catTabs.style.display = 'none';
                                callSaveDepts(JSON.stringify(newDepts)).then(function() { setTimeout(loadDevices, 800); })
                                .catch(function(e) { 
                                    alert(T['ERR_FW_SAVE_FAIL'].replace('{err}', e));
                                    setTimeout(loadDevices, 1000); 
                                });
                            }
                        });
                        return;
                    }
                    catTabs.querySelectorAll('.nd-cat-btn').forEach(function(b){ b.classList.remove('active'); b.style.background = ''; });
                    this.classList.add('active');
                    if (this.hasAttribute('style') && this.style.color) {
                        this.style.background = this.style.color.replace('rgb', 'rgba').replace(')', ', 0.15)');
                    }
                    currentFilter = this.getAttribute('data-cat');
                    selectedDevices = []; 
                    filterAndRender();
                });
            });

            filterAndRender();
        }

        function filterAndRender() {
            if (currentFilter === 'all') {
                filteredDevices = globalDevices;
            } else if (['mobile', 'pc', 'iot', 'type_other'].includes(currentFilter)) {
                filteredDevices = globalDevices.filter(function(d) {
                    var smartCat = 'type_other';
                    if (smartFilterByIp) {
                        var ip = d.bound_ip || d.ip;
                        if (ip && ip !== 'Unknown IP' && ip.substring(0, basePrefix.length) === basePrefix) {
                            var suffix = parseInt(ip.split('.').pop());
                            if (!isNaN(suffix)) {
                                if (suffix >= savedRanges.ms && suffix <= savedRanges.me) smartCat = 'mobile';
                                else if (suffix >= savedRanges.ps && suffix <= savedRanges.pe) smartCat = 'pc';
                                else if (suffix >= savedRanges.is && suffix <= savedRanges.ie) smartCat = 'iot';
                            }
                        }
                    } else {
                        var rawType = getDeviceType(d);
                        if (['mobile', 'pc', 'iot'].includes(rawType)) smartCat = rawType;
                    }
                    return smartCat === currentFilter;
                });
            } else if (currentFilter === 'dept_other') {
                filteredDevices = globalDevices.filter(function(d) {
                    return getDeviceDept(d) === null;
                });
            } else {
                filteredDevices = globalDevices.filter(function(d) {
                    var dept = getDeviceDept(d);
                    return dept && dept.id === currentFilter;
                });
            }
            selectAllCb.checked = false; 
            renderListHTML();
            updateBatchBar();
        }

        function renderListHTML() {
            listEl.style.display = 'flex';

            if (filteredDevices.length === 0) {
                listEl.innerHTML = '<div class="nd-empty">' + T['MSG_EMPTY_CAT'] + '</div>';
                return;
            }

            var html = "";
            filteredDevices.forEach(function(dev) {
                var isOnline = (dev.online === true || dev.online === 'true');
                var isStatic = (dev.is_static === true || dev.is_static === 'true');
                var isGw = (dev.is_gw === true || dev.is_gw === 'true');
                var isLocal = (dev.is_local === true || dev.is_local === 'true');
                var isVisitor = (dev.is_visitor === true || dev.is_visitor === 'true');
                var isPending = (isStatic && dev.bound_ip && dev.ip && dev.ip !== 'Unknown IP' && dev.ip !== dev.bound_ip);

                var isBlk = (dev.fw_block === 'true' || dev.fw_block === true);
                var isIso = (dev.fw_isolate === 'true' || dev.fw_isolate === true);
                var isDmz = (dev.fw_dmz === 'true' || dev.fw_dmz === true);

                var statusBadgesHtml = isOnline 
                    ? '<span class="nd-status-badge nd-status-online"><span class="nd-dot-online"></span>' + T['BDG_ONLINE'] + '</span>' 
                    : '<span class="nd-status-badge nd-status-offline"><span class="nd-dot-offline"></span>' + T['BDG_OFFLINE'] + '</span>';

                if (isBlk) statusBadgesHtml += '<span class="nd-badge" style="background:#fef2f2; color:#ef4444; border-color:#fecaca;">⛔ ' + T['BDG_FW_BLK'] + '</span>';
                if (isIso) statusBadgesHtml += '<span class="nd-badge" style="background:#fffbeb; color:#d97706; border-color:#fde68a;">🛡️ ' + T['BDG_FW_ISO'] + '</span>';
                if (isDmz) statusBadgesHtml += '<span class="nd-badge" style="background:#ede9fe; color:#8b5cf6; border-color:#ddd6fe;">🚀 ' + T['BDG_FW_DMZ'] + '</span>';

                if (isPending) {
                    statusBadgesHtml += '<span class="nd-badge nd-badge-pending">⏳ ' + (T['BDG_PENDING'] || 'Pending') + '</span>';
                } else if (isStatic) {
                    statusBadgesHtml += '<span class="nd-badge nd-badge-static">🔒 ' + T['BDG_STATIC'] + '</span>';
                }
                
                var dept = getDeviceDept(dev);
                if (dept) {
                    statusBadgesHtml += '<span class="nd-badge" style="background:'+dept.color+'15; color:'+dept.color+'; border-color:'+dept.color+'40;">' + dept.icon + ' ' + dept.name + '</span>';
                }

                if (isGw) statusBadgesHtml += '<span class="nd-badge nd-badge-gw">🌐 ' + T['BDG_GW'] + '</span>';
                if (isLocal) statusBadgesHtml += '<span class="nd-badge nd-badge-local">💻 ' + T['BDG_LOCAL'] + '</span>';
                if (isVisitor) statusBadgesHtml += '<span class="nd-badge nd-badge-visitor">👤 ' + (T['BDG_VISITOR'] || 'Visiting') + '</span>';

                var leaseText = dev.lease || '-';
                if (leaseText === 'Static' || leaseText === 'Infinite' || (isStatic && leaseText === '-')) {
                    leaseText = T['TXT_INFINITE'];
                } else if (leaseText === 'Expired') {
                    leaseText = T['TXT_EXPIRED'];
                } else if (leaseText === 'Device Addressed IP') {
                    leaseText = T['BDG_ADDR_IP'];
                }
                
                if (isGw || isLocal) leaseText = T['TXT_SYS_ROUTE'];

                var showConnsCbEl = container.querySelector('#cb-show-conns');
                var showConns = showConnsCbEl ? showConnsCbEl.checked : false;
                var connHtml = '';
                if (showConns && dev.conn_count !== undefined) {
                    var connColor = dev.conn_count > 500 ? '#ef4444' : '#3b82f6';
                    var safeName = (dev.name || '').replace(/(<([^>]+)>)/gi, "").replace(/"/g, '&quot;');
                    
                    var t = dev.conn_count;
                    var pWeb = t ? (dev.conn_web / t * 100) : 0;
                    var pDns = t ? (dev.conn_dns / t * 100) : 0;
                    var pUdp = t ? (dev.conn_udp / t * 100) : 0;
                    var pP2p = t ? (dev.conn_p2p / t * 100) : 0;
                    
                    // 圆饼图
                    var deg1 = pWeb, deg2 = deg1 + pDns, deg3 = deg2 + pUdp, deg4 = deg3 + pP2p;
                    var gradient = t ? 'conic-gradient(#3b82f6 0% '+deg1+'%, #10b981 '+deg1+'% '+deg2+'%, #8b5cf6 '+deg2+'% '+deg3+'%, #ef4444 '+deg3+'% '+deg4+'%, #64748b '+deg4+'% 100%)' : 'conic-gradient(#64748b 0% 100%)';
                    
                    var tooltipHtml = '<div class="nd-conn-tooltip">' +
                        '<div class="nd-pie-chart" style="background: '+gradient+';"></div>';

                    if (dev.conn_web > 0) {
                        tooltipHtml += '<div class="nd-legend-item"><span style="color:#94a3b8;"><span class="nd-legend-color" style="background:#3b82f6;"></span>' + T['LBL_CONN_WEB'] + '</span> <b>' + dev.conn_web + '</b></div>';
                    }
                    if (dev.conn_dns > 0) {
                        tooltipHtml += '<div class="nd-legend-item"><span style="color:#94a3b8;"><span class="nd-legend-color" style="background:#10b981;"></span>' + T['LBL_CONN_DNS'] + '</span> <b>' + dev.conn_dns + '</b></div>';
                    }
                    if (dev.conn_udp > 0) {
                        tooltipHtml += '<div class="nd-legend-item"><span style="color:#94a3b8;"><span class="nd-legend-color" style="background:#8b5cf6;"></span>' + T['LBL_CONN_UDP'] + '</span> <b>' + dev.conn_udp + '</b></div>';
                    }
                    if (dev.conn_p2p > 0) {
                        // P2P  > 50 時显示数字
                        var p2pValStyle = dev.conn_p2p > 50 ? 'color:#ef4444;' : '#f8fafc';
                        tooltipHtml += '<div class="nd-legend-item"><span style="color:#94a3b8;"><span class="nd-legend-color" style="background:#ef4444;"></span>' + T['LBL_CONN_P2P'] + '</span> <b style="color:' + p2pValStyle + '">' + dev.conn_p2p + '</b></div>';
                    }
                    if (dev.conn_oth > 0) {
                        tooltipHtml += '<div class="nd-legend-item"><span style="color:#94a3b8;"><span class="nd-legend-color" style="background:#64748b;"></span>' + T['LBL_CONN_OTH'] + '</span> <b>' + dev.conn_oth + '</b></div>';
                    }

                    if (t === 0) {
                        tooltipHtml += '<div style="text-align:center; color:#64748b; font-size:11.5px;">' + T['MSG_CONN_EMPTY'] + '</div>';
                    }

                    tooltipHtml += '</div>';

                    connHtml = '<div class="nd-conn-badge" data-ip="'+dev.ip+'" data-name="'+safeName+'" style="font-size:12px; color:'+connColor+'; font-family:monospace; margin-top:2px; font-weight:bold; cursor:pointer; padding:2px 6px; border-radius:6px; border:1px solid '+connColor+'50; background:'+connColor+'10; display:inline-block; transition:all 0.2s;" onmouseover="this.style.background=\''+connColor+'25\'" onmouseout="this.style.background=\''+connColor+'10\'">⚡' + dev.conn_count + ' ' + T['LBL_CONN_COUNT'] + tooltipHtml + '</div>';
                }

                // 只保留 2 或 3 开头的公网 IP，屏蔽 fd/fe 等内网 IP
                var ipv6Html = '';
                if (dev.ipv6 && dev.ipv6.trim() !== '') {
                    var v6List = dev.ipv6.trim().split(' ');
                    var publicV6List = v6List.filter(function(v) { 
                        var firstChar = v.charAt(0).toLowerCase();
                        return firstChar === '2' || firstChar === '3'; 
                    });

                    // 显示徽章
                    if (publicV6List.length > 0) {
                        var memKey = 'nw_v6_mem_' + dev.mac; // L1 记忆钥匙
                        var hbKey = 'nw_v6_hb_' + dev.mac;   // Session 心跳钥匙
                        var currentPrefix = publicV6List[0].split(':').slice(0, 4).join(':'); // 提取真实前缀
                        
                        var radarShortV6 = publicV6List.find(function(v) { return v.indexOf('::') !== -1 && v.length < 25; });
                        var localShortV6 = localStorage.getItem(memKey);
                        var isBackendPc = (dev.is_pc_v6 === true || dev.is_pc_v6 === 'true');

                        // 全局队列
                        var triggerKeepAlive = function() {
                            var hasSent = sessionStorage.getItem(hbKey);
                            // 只要这个会话没发过，且没在排队
                            if (!hasSent && window.nwKeepAliveQueue.indexOf(dev.mac) === -1) { 
                                sessionStorage.setItem(hbKey, 'pending'); // 占位
                                window.nwKeepAliveQueue.push(dev.mac);    // 进排队
                                processKeepAliveQueue();                  // 处理
                            }
                        };

                        // 真实 > L1缓存 > L2预测拼凑
                        if (radarShortV6) {
                            localStorage.setItem(memKey, radarShortV6);
                            triggerKeepAlive();
                            
                        } else if (localShortV6 && localShortV6.indexOf(currentPrefix) === 0) {
                            publicV6List.unshift(localShortV6); 
                            triggerKeepAlive();
                            
                        } else if (isBackendPc) {
                            var ipToUse = (dev.bound_ip && dev.bound_ip !== 'Unknown IP') ? dev.bound_ip : ((dev.ip !== 'Unknown IP') ? dev.ip : '');
                            if (ipToUse) {
                                var ipv4Suffix = ipToUse.split('.').pop(); 
                                var predictedV6 = currentPrefix + '::' + parseInt(ipv4Suffix, 10); 
                                
                                publicV6List.unshift(predictedV6); 
                                localStorage.setItem(memKey, predictedV6); 
                                triggerKeepAlive(); 
                            }
                        }

                        // 展示
                        var showV6 = publicV6List.find(function(v) { return v.indexOf('::') !== -1 && v.length < 25; }) || publicV6List[0];
                        var moreV6 = publicV6List.length >= 2 ? (' +' + publicV6List.length) : '';
                        
                        var allV6Str = publicV6List.join('\n');
                        var titleStr = T['TIP_V6_COPY'] + '\n' + allV6Str;
                        
                        // 复制ipv6
                        ipv6Html = '<div class="nd-ipv6-badge" data-v6="' + showV6 + '" title="' + titleStr + '" style="font-size:11px; color:#64748b; font-family:monospace; margin-top:3px; display:flex; align-items:center; gap:4px; cursor:pointer;"><span style="background:#10b981; padding:4px 5px; border-radius:4px; font-weight:bold; color:#fff; border:1px solid #e2e8f0; line-height:1;">IPv6</span> <span style="overflow:hidden; text-overflow:ellipsis; max-width:120px; white-space:nowrap;">' + showV6 + '</span><span style="color:#3b82f6; font-weight:bold;">' + moreV6 + '</span></div>';
                    }
                }

                var actions = "";
                if (isGw || isLocal) {
                    actions = '<span style="color:#f00; font-size:16.5px; font-weight:bold; padding: 10px;">' + T['TXT_SYS_RESERVED'] + '</span>';
                } else if (isStatic) {
                    actions = '<button class="nd-btn nd-btn-gray btn-edit" data-mac="'+dev.mac+'" data-ip="'+(dev.bound_ip || dev.ip)+'" data-name="'+dev.name+'">' + T['BTN_EDIT'] + '</button>' +
                              '<button class="nd-btn nd-btn-red btn-unbind" data-mac="'+dev.mac+'">' + T['BTN_UNBIND'] + '</button>';
                } else {
                    actions = '<button class="nd-btn nd-btn-green btn-bind" data-mac="'+dev.mac+'" data-ip="'+dev.ip+'" data-name="'+dev.name+'"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg> ' + T['BTN_QUICK_BIND'] + '</button>';
                }

                var displayName = dev.name === 'Unknown' ? '<i style="color:#94a3b8; font-weight:normal;">' + T['TXT_UNKNOWN_DEV'] + '</i>' : dev.name;
                var isChecked = selectedDevices.findIndex(function(d){ return d.mac === dev.mac; }) !== -1;

                var isSys = isGw || isLocal;
                var noCheckbox = isSys || isVisitor;
                var crossSubnetWarn = "";

                var isValidIp = (dev.ip && dev.ip !== 'Unknown IP' && dev.ip.substring(0, dev.ip.lastIndexOf('.') + 1) === basePrefix);
                if (!isSys && !isValidIp) {
                    crossSubnetWarn = '<span style="font-size:11px; color:#ef4444; margin-left:8px; border:1px solid #fca5a5; padding:1px 4px; border-radius:4px; vertical-align: middle;">' + T['BDG_ADDR_IP'] + '</span>';
                }

                var ipText = dev.ip === 'Unknown IP' ? T['TXT_UNKNOWN_IP'] : dev.ip;
                if (isPending) {
                    ipText = '<span style="text-decoration:line-through; color:#94a3b8; font-size:12.5px; margin-right:5px;">' + dev.ip + '</span><span style="color:#d97706; font-weight:bold;">➜ ' + dev.bound_ip + '</span>';
                }

                // 时间是否过期
                var isNewUnknown = (dev.is_new_unknown === 'true' || dev.is_new_unknown === true);
                var cardClass = isNewUnknown ? "nd-card nd-card-warning" : "nd-card";
                
                var warningBadge = '';
                var handStyle = 'font-size:1.5em; color:#94a3b8; margin-left:4px; vertical-align:middle; animation:blink-warning 0.6s infinite;';
                
                if (isNewUnknown) {
                    warningBadge = '<div style="position:absolute; top:-12px; left:16px; background-color:#ff4d4f; color:white; font-size:12px; font-weight:bold; padding:2px 8px; border-radius:12px; z-index:10;">⚠️ ' + (T['BDG_NEW_UNKNOWN'] || '疑似伪装新设备') + '</div>';
                    
                    // 小手
                    handStyle = 'font-size:1.5em; color:#ff4d4f; margin-left:4px; vertical-align:middle; animation:blink-warning 0.6s infinite;';
                }
                
                html += '<div class="' + cardClass + '" style="position:relative;">' + warningBadge + '<div class="nd-card-left"><div style="display:flex; align-items:center;">';

                if (noCheckbox) {
                    html += '<div style="width: 33px; flex-shrink: 0; margin-right: 15px;"></div>';
                } else {
                    html += '<label class="nw-wiz-cb-wrap nd-card-checkbox"><input type="checkbox" data-mac="'+dev.mac+'" '+(isChecked?'checked':'')+'><span class="nw-wiz-checkmark"></span></label>';
                }

                html += [
                    '           <div class="nd-card-name"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg> ',
                    '               <span style="word-break:break-all;">' + displayName + crossSubnetWarn + '</span>',
                    '               ' + statusBadgesHtml, 
                    '           </div>',
                    '       </div>',
                    '       <div class="nd-card-mac btn-fw-mac" title="' + T['TIP_MAC_CTRL'] + '" data-mac="'+dev.mac+'" data-ip="'+(dev.bound_ip || dev.ip)+'" style="margin-left:50px; display:flex; align-items:center; cursor:pointer;">' + (dev.mac).toUpperCase() + ' <span style="' + handStyle + '">👈</span></div>',
                    '   </div>',
                    '   <div class="nd-card-mid">',
                    '       <div style="display:flex; flex-direction:column; align-items:flex-start; min-width:0;">',
                    '           <div class="nd-card-ip">' + ipText + '</div>',
                    '           ' + ipv6Html,
                    '       </div>',
                    '       <div style="display:flex; flex-direction:column; align-items:flex-end;">',
                    '           <div class="nd-lease-info"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> ' + leaseText + '</div>',
                    '           ' + connHtml,
                    '       </div>',
                    '   </div>',
                    '   <div class="nd-card-right">' + actions + '</div>',
                    '</div>'
                ].join('\n');
            });

            listEl.innerHTML = html;

            // 綁定分析面板点击事件
            container.querySelectorAll('.nd-conn-badge').forEach(function(badge) {
    badge.addEventListener('click', function(e) {
        e.stopPropagation();
        var ip = this.getAttribute('data-ip');
        var name = this.getAttribute('data-name');
        if (!ip || ip === 'Unknown IP') return;
        
        // 1. 彈出 Loading 畫面 (使用變量)
        openModal({ 
            title: T['TIT_CONN_RADAR'] + ' - NetWiz',
            content: '<div style="text-align:center; padding:30px 0; color:#64748b;"><div class="nd-spinner" style="margin:0 auto 15px auto;"></div>' + T['MSG_DIVE_KERNEL'] + '</div>', 
            okText: T['BTN_OK'], // 通常使用統一的“確定”或“關閉”
            hideCancel: true
        });
        
        // 2. 呼叫後端執行抓包
        callAnalyzeConns(ip).then(function(res) {
            var s = res.stats || {};
            var pctWeb = s.total ? (s.web / s.total * 100).toFixed(1) : 0;
            var pctDns = s.total ? (s.dns / s.total * 100).toFixed(1) : 0;
            var pctUdp = s.total ? (s.udp_media / s.total * 100).toFixed(1) : 0;
            var pctP2p = s.total ? (s.p2p / s.total * 100).toFixed(1) : 0;
            var pctOth = s.total ? (s.other / s.total * 100).toFixed(1) : 0;
            
            var p2pStyle = s.p2p > 50 ? 'color:#ef4444; font-weight:bold; background:#fef2f2; padding:2px 4px; border-radius:4px;' : '';

            // 3. 拼裝統計面板 (使用分類變量)
            var html = '<div style="margin-bottom:15px; font-size:13.5px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:12px;">' +
                '<div style="display:flex; justify-content:space-between; margin-bottom:8px; border-bottom:1px dashed #cbd5e1; padding-bottom:8px;">' +
                    '<span><span style="color:#3b82f6;">🌐 ' + T['LBL_CONN_WEB'] + ':</span> <b>'+s.web+'</b> <span style="font-size:11px;color:#94a3b8;">('+pctWeb+'%)</span></span>' +
                    '<span><span style="color:#10b981;">🔍 ' + T['LBL_CONN_DNS'] + ':</span> <b>'+s.dns+'</b> <span style="font-size:11px;color:#94a3b8;">('+pctDns+'%)</span></span>' +
                '</div>' +
                '<div style="display:flex; justify-content:space-between; margin-bottom:8px; border-bottom:1px dashed #cbd5e1; padding-bottom:8px;">' +
                    '<span><span style="color:#8b5cf6;">🎮 ' + T['LBL_CONN_UDP'] + ':</span> <b>'+s.udp_media+'</b> <span style="font-size:11px;color:#94a3b8;">('+pctUdp+'%)</span></span>' +
                    '<span style="'+p2pStyle+'"><span style="color:#ef4444;">🚀 ' + T['LBL_CONN_P2P'] + ':</span> <b>'+s.p2p+'</b> <span style="font-size:11px;">('+pctP2p+'%)</span></span>' +
                '</div>' +
                '<div style="display:flex; justify-content:space-between;">' +
                    '<span><span style="color:#64748b;">🏷️ ' + T['LBL_CONN_OTH'] + ':</span> <b>'+s.other+'</b> <span style="font-size:11px;color:#94a3b8;">('+pctOth+'%)</span></span>' +
                '</div>' +
            '</div>';
                
            // 4. 終端機黑框 (使用帶佔位符的變量)
            html += '<div style="background:#0f172a; color:#10b981; font-family:monospace; font-size:11px; line-height:1.4; padding:12px; border-radius:8px; max-height:280px; min-height:60px; overflow-y:auto; white-space:pre-wrap; word-break:break-all; box-shadow:inset 0 0 10px rgba(0,0,0,0.5);">';
            
            // 替換總數佔位符 {total}
            var msgTotal = T['MSG_CONN_TOTAL'].replace('{total}', s.total || 0);
            html += '<span style="color:#94a3b8;">' + msgTotal + '</span>\n';
            
            // 替換命令行中的 IP 佔位符 {ip}
            var msgCmd = T['MSG_CONN_CMD'].replace('{ip}', ip);
            html += '<span style="color:#fbbf24;">' + msgCmd + '</span>\n\n';
            
            if (res.raw && res.raw.length > 0) {
                html += res.raw.join('\n');
                if (s.total > 50) {
                    html += '\n\n<span style="color:#64748b;">' + T['MSG_CONN_TRUNC'] + '</span>';
                }
            } else {
                html += '<span style="color:#64748b;">' + T['MSG_CONN_EMPTY'] + '</span>';
            }
            html += '</div>';
            
            // 替換彈窗內容
            var contentEl = document.querySelector('#nd-m-content');
            if (contentEl) contentEl.innerHTML = html;
        }).catch(function(e) {
            var contentEl = document.querySelector('#nd-m-content');
            // 替換錯誤信息佔位符 {err}
            var msgFail = T['MSG_CONN_ANALYZE_FAIL'].replace('{err}', e);
            if (contentEl) contentEl.innerHTML = '<div style="color:#ef4444; text-align:center; padding:20px;">' + msgFail + '</div>';
        });
    });
});      


            container.querySelectorAll('.nd-ipv6-badge').forEach(function(badge) {
                badge.addEventListener('click', function(e) {
                    e.stopPropagation(); // 阻止点击事件穿透
                    var v6text = this.getAttribute('data-v6');
                    
                    if (navigator.clipboard && window.isSecureContext) {
                        navigator.clipboard.writeText(v6text).then(function() {
                            alert('✅ ' + T['MSG_V6_COPIED'] + '\n\n' + v6text);
                        });
                    } else {
                        var textArea = document.createElement("textarea");
                        textArea.value = v6text;
                        textArea.style.position = "fixed";
                        document.body.appendChild(textArea);
                        textArea.focus();
                        textArea.select();
                        try { document.execCommand('copy'); alert('✅ ' + T['MSG_V6_COPIED'] + '\n\n' + v6text); } catch (err) {}
                        document.body.removeChild(textArea);
                    }
                });
            });

            container.querySelectorAll('.nd-card-checkbox input').forEach(function(cb) {
                cb.addEventListener('change', function() { 
                    var mac = this.getAttribute('data-mac');
                    var dev = globalDevices.find(function(d){ return d.mac === mac; });
                    toggleSelection(dev, this.checked); 
                });
            });

            container.querySelectorAll('.btn-fw-mac').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    var mac = this.getAttribute('data-mac');
                    var ip = this.getAttribute('data-ip');
                    var dev = globalDevices.find(function(d){ return d.mac === mac; });
                    if (dev.is_gw === 'true' || dev.is_gw === true || dev.is_local === 'true' || dev.is_local === true) return; // 系统设备不可点
                    
                    var dName = dev.name === 'Unknown' ? mac.toUpperCase() : dev.name;
                    openModal({
                        title: T['TIT_FW_CONTROL'] + ' - ' + dName,
                        isFwPanel: true, targetMac: mac, targetIp: ip, targetDev: dev, okText: T['BTN_SAVE'],
                        onOk: function(data) {
                            loadingEl.style.display = 'flex';
                            listEl.style.display = 'none'; catTabs.style.display = 'none';
                            callFwSet(data.mac, data.ip, data.blk_en, data.iso_en, data.dmz_en)
                            .then(function() { setTimeout(loadDevices, 1000); })
                            .catch(function(e) { 
                                alert(T['ERR_SAVE_FAIL_SHORT'].replace('{err}', e));
                                setTimeout(loadDevices, 1000); 
                            });
                        }
                    });
                });
            });

            container.querySelectorAll('.btn-bind, .btn-edit').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    var mac = this.getAttribute('data-mac');
                    var ip = this.getAttribute('data-ip');
                    var rawName = this.getAttribute('data-name');
                    var isEdit = this.classList.contains('btn-edit');
                    
                    currentSingleDev = globalDevices.find(function(d){ return d.mac === mac; });
                    currentOriginalIp = ip;
                    var isValidIp = (ip && ip !== 'Unknown IP' && ip.substring(0, ip.lastIndexOf('.') + 1) === basePrefix);
                    
                    var initStrategy = isValidIp ? 'keep' : 'smart';
                    
                    modalOverlay.querySelector('input[name="single_strategy"][value="'+initStrategy+'"]').checked = true;
                    
                    var keepRadio = modalOverlay.querySelector('input[name="single_strategy"][value="keep"]');
                    if (!isValidIp) {
                        keepRadio.parentElement.style.opacity = '0.4';
                        keepRadio.disabled = true;
                    } else {
                        keepRadio.parentElement.style.opacity = '1';
                        keepRadio.disabled = false;
                    }

                    openModal({
                        title: isEdit ? T['TIT_EDIT_DEV'] : T['TIT_QUICK_BIND'],
                        content: T['TXT_CONFIG_MAC'] + '<span style="font-family:monospace; color:#3b82f6; font-weight:bold;">' + mac.toUpperCase() + '</span>',
                        showForm: true,
                        showSingleStrategy: true,
                        targetMac: mac,
                        defName: rawName === 'Unknown' ? '' : rawName,
                        defIp: '', 
                        okText: isEdit ? T['BTN_SAVE'] : T['BTN_BIND_DEV'],
                        onOk: function(data) {
                            listHeader.style.display = 'none';
                            listEl.style.display = 'none';
                            catTabs.style.display = 'none';
                            if (batchBar) batchBar.classList.remove('show');
                            loadingEl.style.display = 'flex';
                            loadingText.innerText = T['MSG_WRITING'];
                            
                            callDeviceBind(mac, data.ip, data.name, data.dept, false).then(function() {
                                setTimeout(loadDevices, 1000);
                            }).catch(function() { setTimeout(loadDevices, 1000); });
                        }
                    });
                    
                    modalOverlay.querySelector('input[name="single_strategy"][value="'+initStrategy+'"]').dispatchEvent(new Event('change'));
                });
            });

            container.querySelectorAll('.btn-unbind').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    var mac = this.getAttribute('data-mac');
                    
                    openModal({
                        title: T['TIT_UNBIND'],
                        content: T['MSG_UNBIND_CONFIRM'].replace('{mac}', mac.toUpperCase()),
                        danger: true,
                        okText: T['BTN_CONFIRM_UNBIND'],
                        onOk: function() {
                            listHeader.style.display = 'none';
                            listEl.style.display = 'none';
                            catTabs.style.display = 'none';
                            if (batchBar) batchBar.classList.remove('show');
                            loadingEl.style.display = 'flex';
                            loadingText.innerText = T['MSG_RELEASING'];
                            callDeviceUnbind(mac, false).then(function() {
                                setTimeout(loadDevices, 1000);
                            }).catch(function() { setTimeout(loadDevices, 1000); });
                        }
                    });
                });
            });
        }

        // 并发任务池
        function runWithConcurrency(tasks, limit) {
            return new Promise(function(resolve, reject) {
                if (tasks.length === 0) return resolve();
                var index = 0;
                var activeCount = 0;

                function next() {
                    // 所有任务发完，且没执行的任务，结束
                    if (index >= tasks.length && activeCount === 0) {
                        resolve();
                        return;
                    }
                    // 有任务，继续
                    while (activeCount < limit && index < tasks.length) {
                        activeCount++;
                        var task = tasks[index++];
                        task().then(function() {
                            activeCount--;
                            next(); // 完成一個，上一個
                        }).catch(function(err) {
                            activeCount--;
                            next(); // 即使失败下一個
                        });
                    }
                }
                next();
            });
        }

        btnBatchUnbind.addEventListener('click', function() {
            var validUnbinds = selectedDevices.filter(function(d) {
                return d.is_static === true || d.is_static === 'true';
            });

            if (validUnbinds.length === 0) {
                alert(T['TIP_ALL_UNBOUND'].replace('{count}', selectedDevices.length));
                return;
            }

            openModal({
                title: T['TIT_BATCH_UNBIND'],
                content: T['MSG_BATCH_UNBIND_CONFIRM'].replace('{total}', selectedDevices.length).replace('{valid}', validUnbinds.length),
                danger: true,
                okText: T['BTN_CONFIRM_UNBIND'],
                onOk: function() {
                    listHeader.style.display = 'none';
                    listEl.style.display = 'none';
                    catTabs.style.display = 'none';
                    if (batchBar) batchBar.classList.remove('show');
                    loadingEl.style.display = 'flex';
                    loadingText.innerText = T['MSG_BATCH_RELEASING'];
                    
                    var tasks = validUnbinds.map(function(dev) {
                        return function() { return callDeviceUnbind(dev.mac, true); };
                    });

                    runWithConcurrency(tasks, 10).then(function() {  // 批量释放并发数：10
                        return callApplyDhcp(); 
                    }).then(function() {
                        setTimeout(loadDevices, 1500);
                    }).catch(function() { setTimeout(loadDevices, 1500); });
                }
            });
        });

        btnBatchBind.addEventListener('click', function() {
            var strategyLabel = modalOverlay.querySelector('#nd-m-batch-fields .nd-input-label');
            if(strategyLabel) {
                strategyLabel.innerHTML = T['TXT_SEL_STRAT_COUNT'].replace('{count}', selectedDevices.length);
            }

            openModal({
                title: T['TIT_BATCH_BIND'],
                content: '', 
                showForm: true,
                isBatchBind: true,
                okText: T['BTN_START_ASSIGN'],
                onOk: function(data) {
                    var strategy = data.strategy;
                    var dept_id = data.dept;
                    
                    var usedIps = [];
                    var selectedMacs = selectedDevices.map(function(d) { return d.mac; });
                    globalDevices.forEach(function(d) {
                        if (selectedMacs.indexOf(d.mac) === -1) { 
                            if (d.ip && d.ip !== 'Unknown IP') usedIps.push(d.ip);
                            if (d.bound_ip && d.bound_ip !== 'Unknown IP') usedIps.push(d.bound_ip);
                        }
                    });
                    
                    if (strategy === 'seq') {
                        var suf = parseInt(data.startSuffix, 10);
                        if (isNaN(suf) || suf < 2 || suf > 254) { alert(T['ERR_SUF_RANGE']); return; }
                        
                        var availSeq = 0;
                        for (var i = suf; i <= 254; i++) { if (usedIps.indexOf(basePrefix + i) === -1) availSeq++; }
                        if (selectedDevices.length > availSeq) {
                            alert(T['ERR_POOL_INSUFF'].replace('{suf}', suf).replace('{avail}', availSeq).replace('{count}', selectedDevices.length));
                            return;
                        }
                    } else if (strategy === 'smart') {
                        var reqCounts = { mobile: 0, pc: 0, iot: 0, type_other: 0 };
                        selectedDevices.forEach(function(d) { 
                            var t = getDeviceType(d);
                            if (['mobile','pc','iot'].includes(t)) reqCounts[t]++;
                            else reqCounts['type_other']++;
                        });
                        var rg = data.ranges;
                        var zones = {
                            mobile: { s: rg.ms, e: rg.me, name: T['TAB_MOBILE'] },
                            pc: { s: rg.ps, e: rg.pe, name: T['TAB_PC'] },
                            iot: { s: rg.is, e: rg.ie, name: T['TAB_IOT'] },
                            type_other: { s: rg.os, e: rg.oe, name: T['TAB_OTHER'] }
                        };
                        for (var k in reqCounts) {
                            if (reqCounts[k] > 0) {
                                var availSmart = 0;
                                for (var i = zones[k].s; i <= zones[k].e; i++) { if (usedIps.indexOf(basePrefix + i) === -1) availSmart++; }
                                if (reqCounts[k] > availSmart) {
                                    alert(T['ERR_CAT_FAIL'].replace('{name}', zones[k].name).replace('{req}', reqCounts[k]).replace('{avail}', availSmart));
                                    return;
                                }
                            }
                        }
                    } else if (strategy === 'dept') {
                        var tgt = globalDepartments.find(function(d){ return d.id === dept_id; });
                        if(tgt) {
                            var availDept = 0;
                            for (var j = tgt.start; j <= tgt.end; j++) { if (usedIps.indexOf(basePrefix + j) === -1) availDept++; }
                            if (selectedDevices.length > availDept) {
                                alert(T['ERR_POOL_INSUFF'].replace('{suf}', tgt.start).replace('{avail}', availDept).replace('{count}', selectedDevices.length));
                                return;
                            }
                        }
                    }

                    var tasks = [];
                    var currentIp = strategy === 'seq' ? (basePrefix + parseInt(data.startSuffix, 10)) : null;
                    var lastAssignedGlobal = null;
                    var skippedCount = 0;

                    selectedDevices.forEach(function(dev) {
                        var assignIp = dev.bound_ip || dev.ip; 
                        var existingIp = dev.bound_ip || dev.ip;
                        var exSuf = -1;
                        if (existingIp && existingIp !== 'Unknown IP' && existingIp.indexOf(basePrefix) === 0) {
                            exSuf = parseInt(existingIp.split('.').pop(), 10);
                        }

                        if (strategy === 'keep') {
                            var devPrefix = assignIp.substring(0, assignIp.lastIndexOf('.') + 1);
                            if (devPrefix !== basePrefix || usedIps.indexOf(assignIp) !== -1) {
                                assignIp = getAvailableIpInRange(basePrefix, 50, 250, usedIps);
                            }
                        } else if (strategy === 'seq') {
                            assignIp = getNextAvailableIp(currentIp, usedIps);
                            currentIp = getNextAvailableIp(assignIp, usedIps); 
                        } else if (strategy === 'smart') {
                            var devType = getDeviceType(dev);
                            var sStart = data.ranges.os, sEnd = data.ranges.oe;
                            if (devType === 'mobile') { sStart = data.ranges.ms; sEnd = data.ranges.me; }
                            else if (devType === 'pc') { sStart = data.ranges.ps; sEnd = data.ranges.pe; }
                            else if (devType === 'iot') { sStart = data.ranges.is; sEnd = data.ranges.ie; }
                            
                            // 原 IP 已经处于该分类的目标网段，且未被抢占，保留
                            if (exSuf >= sStart && exSuf <= sEnd && usedIps.indexOf(existingIp) === -1) {
                                assignIp = existingIp; 
                            } else {
                                var smartIp = getAvailableIpInRange(basePrefix, sStart, sEnd, usedIps);
                                if (smartIp) assignIp = smartIp;
                            }
                        } else if (strategy === 'dept') {
                            var tgt2 = globalDepartments.find(function(d){ return d.id === dept_id; });
                            if (tgt2) {
                                // 原 IP 若在自定义组网段内，保留
                                if (exSuf >= tgt2.start && exSuf <= tgt2.end && usedIps.indexOf(existingIp) === -1) {
                                    assignIp = existingIp;
                                } else {
                                    var dip = getAvailableIpInRange(basePrefix, tgt2.start, tgt2.end, usedIps);
                                    if (dip) assignIp = dip;
                                }
                            }
                        }

                        if (assignIp && usedIps.indexOf(assignIp) === -1) {
                            usedIps.push(assignIp);
                        }

                        var isCurrentlyStatic = dev.is_static === true || dev.is_static === 'true';
                        var oldDeptId = dev.dept || 'none';
                        if (isCurrentlyStatic && assignIp === (dev.bound_ip || dev.ip) && dept_id === oldDeptId) {
                            skippedCount++;
                            return; 
                        }

                        lastAssignedGlobal = assignIp;
                        var safeName = dev.name === "Unknown" ? "" : dev.name;
                        tasks.push(function() {
                            return callDeviceBind(dev.mac, assignIp, safeName, dept_id, true);
                        });
                    });

                    if (tasks.length === 0) {
                        alert(T['TIP_BATCH_NO_CHANGE'].replace('{count}', selectedDevices.length));
                        return; 
                    }

                    listHeader.style.display = 'none';
                    listEl.style.display = 'none';
                    catTabs.style.display = 'none';
                    if (batchBar) batchBar.classList.remove('show');
                    loadingEl.style.display = 'flex';
                    loadingText.innerText = T['MSG_RADAR_AVOID'];

                    if (lastAssignedGlobal) localStorage.setItem('nw_last_ip', lastAssignedGlobal);

                    runWithConcurrency(tasks, 10).then(function() {  // 批量绑定并发数：10
                        return callApplyDhcp(); 
                    }).then(function() {
                        setTimeout(loadDevices, 1500);
                    }).catch(function() { setTimeout(loadDevices, 1500); });
                }
            });
        });

        var loadDevices = function() {
            loadingEl.style.display = 'flex';
            loadingText.innerText = T['TXT_LOADING_RADAR'];
            listHeader.style.display = 'none';
            listEl.style.display = 'none';
            catTabs.style.display = 'none';
            selectedDevices = []; 
            selectAllCb.checked = false;
            updateBatchBar();
            
            var showConnsCbEl = container.querySelector('#cb-show-conns');
            var isShowConns = showConnsCbEl ? showConnsCbEl.checked : false;

            // 本地有缓存，直接返回
            var pSmart = needFetchSmart ? callGetSmartRanges() : Promise.resolve(null);

            Promise.all([callDeviceList(isShowConns), callGetDepts(), pSmart]).then(function(results) {
                loadingEl.style.display = 'none';
                
                var resList = results[0];
                var resDepts = results[1];
                var resSmart = results[2];

                // 发起请求且拿到了数据，写入本地缓存
                if (resSmart && resSmart.ranges) {
                    var parsedR = typeof resSmart.ranges === 'string' ? JSON.parse(resSmart.ranges || '{}') : resSmart.ranges;
                    if (parsedR && Object.keys(parsedR).length > 0) {
                        savedRanges = parsedR;
                    } else {
                        // 为空，使用默认值
                        savedRanges = JSON.parse(JSON.stringify(defaultSmartRanges));
                    }
                    localStorage.setItem('nw_smart_ranges', JSON.stringify(savedRanges)); 
                    needFetchSmart = false; 
                }

                globalDepartments = [];
                if (Array.isArray(resDepts)) {
                    globalDepartments = resDepts;
                } else if (resDepts && resDepts.depts) {
                    var dData = typeof resDepts.depts === 'string' ? JSON.parse(resDepts.depts || '[]') : resDepts.depts;
                    globalDepartments = Array.isArray(dData) ? dData : [];
                } else if (typeof resDepts === 'string') {
                    try { globalDepartments = JSON.parse(resDepts || '[]'); } catch(e) {}
                }

                var devices = [];
                if (resList && Array.isArray(resList.devices)) {
                    devices = resList.devices;
                } else if (resList && typeof resList[''] === 'string') {
                    try { devices = JSON.parse(resList['']).devices || []; } catch(e){}
                } else if (resList && typeof resList === 'string') {
                    try { devices = JSON.parse(resList).devices || []; } catch(e){}
                }
                
                var currentHostIp = window.location.hostname;
                var nowTs = Date.now();
                devices.forEach(function(d) {
                    if (d.ip === currentHostIp) d.is_local = true;
                    
                    if (d.is_new_unknown === 'true' || d.is_new_unknown === true) {
                        var ts = localStorage.getItem('nw_unk_ts_' + d.mac);
                        // 记录时间
                        if (!ts) {
                            ts = nowTs;
                            localStorage.setItem('nw_unk_ts_' + d.mac, ts);
                        }
                        d.unk_ts = parseInt(ts, 10);
                        
                        // 超24 小時
                        if (nowTs - d.unk_ts > 86400000) {
                            d.is_new_unknown = false;
                        }
                    }
                });

                globalDevices = devices;
                
                var gwDev = globalDevices.find(function(d) { return d.is_gw === 'true' || d.is_local === 'true'; });
                var baseIp = gwDev ? gwDev.ip : (globalDevices.length > 0 ? globalDevices[0].ip : '192.168.1.1');
                basePrefix = baseIp.substring(0, baseIp.lastIndexOf('.') + 1);
                var preEl = container.querySelector('#nd-batch-prefix');
                if (preEl) preEl.innerText = basePrefix;

                globalDevices.sort(function(a, b) {
                    var getWeight = function(d) {

                        if (d.is_new_unknown === 'true' || d.is_new_unknown === true) return 200;
                        
                        if (d.is_gw === true || d.is_gw === 'true') return 100;
                        if (d.is_local === true || d.is_local === 'true') return 90;
                        if (d.is_visitor === true || d.is_visitor === 'true') return 80;
                        if (d.is_static === true || d.is_static === 'true') return 70;
                        
                        var isOnline = (d.online === true || d.online === 'true');
                        var isUnknown = (d.name === 'Unknown' || d.ip === 'Unknown IP');
                        
                        if (isOnline && !isUnknown) return 60; 
                        if (isOnline && isUnknown) return 50;  
                        if (!isOnline && isUnknown) return 40; 
                        return 30;                             
                    };

                    var weightA = getWeight(a);
                    var weightB = getWeight(b);
                    if (weightA !== weightB) { return weightB - weightA; }
                    
                    return a.ip.localeCompare(b.ip, undefined, {numeric: true, sensitivity: 'base'});
                });

                if (globalDevices.length === 0) {
                    listEl.innerHTML = '<div style="text-align:center; padding:60px 20px; color:#64748b; background:#fff; border-radius:16px; border:1px dashed #cbd5e1; width:100%;">' + T['MSG_NO_DEVS'] + '</div>';
                    listEl.style.display = 'flex';
                    return;
                }

                catTabs.style.display = 'block'; 
                listHeader.style.display = 'flex';
                
                updateTabsAndFilter();

            }).catch(function(e) {
                loadingEl.style.display = 'none';
                listHeader.style.display = 'none';
                catTabs.style.display = 'none';
                listEl.style.display = 'block';
                listEl.innerHTML = '<div class="nd-empty" style="color:#ef4444;">' + T['MSG_SCAN_FAIL'] + ' ('+e+')</div>';
            });
        };

        var showConnsCbEl = container.querySelector('#cb-show-conns');
        if (showConnsCbEl) {
            // 页面加载读取绝对时间戳
            var expTime = localStorage.getItem('nw_conns_exp');
            if (expTime && Date.now() < parseInt(expTime)) {
                showConnsCbEl.checked = true;
            } else {
                localStorage.removeItem('nw_conns_exp');
                showConnsCbEl.checked = false;
            }

            // 每 3 秒检查一次
            setInterval(function() {
                var exp = localStorage.getItem('nw_conns_exp');
                if (exp && Date.now() > parseInt(exp)) {
                    localStorage.removeItem('nw_conns_exp');
                    var cb = container.querySelector('#cb-show-conns');
                    if (cb && cb.checked) {
                        cb.checked = false;
                        loadDevices();
                    }
                }
            }, 3000);

            showConnsCbEl.addEventListener('change', function() {
                var icon = refreshBtn.querySelector('.nd-refresh-icon');
                if(icon) { icon.style.transform = 'rotate(360deg)'; setTimeout(function(){ icon.style.transform = 'none'; }, 800); }
                
                if (this.checked) {
                    // 本地浏览器记录 3 分钟过期时间戳
                    localStorage.setItem('nw_conns_exp', Date.now() + 3 * 60 * 1000);
                } else {
                    localStorage.removeItem('nw_conns_exp');
                }
                loadDevices();
            });
        }

        refreshBtn.addEventListener('click', function() {
            var icon = this.querySelector('.nd-refresh-icon');
            if(icon) { icon.style.transform = 'rotate(360deg)'; setTimeout(function(){ icon.style.transform = 'none'; }, 800); }
            loadDevices();
        });

        var fwResetGear = modalOverlay.querySelector('#fw-reset-gear');
        if (fwResetGear) {
            fwResetGear.addEventListener('click', function() {
                openModal({
                    title: T['TIT_RESET_ALL'],
                    content: T['MSG_RESET_CONFIRM'],
                    danger: true,
                    okText: T['BTN_RESET_ALL'],
                    onOk: function() {
                        listHeader.style.display = 'none';
                        listEl.style.display = 'none';
                        catTabs.style.display = 'none';
                        if (batchBar) batchBar.classList.remove('show');
                        loadingEl.style.display = 'flex';
                        loadingText.innerText = T['MSG_RESETTING'];
                        
                        callResetAll().then(function() {
                            setTimeout(loadDevices, 2000);
                        }).catch(function(e) {
                            alert(T['ERR_SAVE_FAIL_SHORT'].replace('{err}', e));
                            setTimeout(loadDevices, 2000);
                        });
                    }
                });
            });
        }

        loadDevices();
    }
});
