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
    'TXT_LOADING_RADAR': _('Starting 3D radar detection...'),
    'TAB_ALL': _('All'),
    'TAB_MOBILE': _('Mobile/Tablet'),
    'TAB_PC': _('PC/Work'),
    'TAB_IOT': _('Smart Home'),
    'TAB_OTHER': _('Others'),
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
    'BDG_VISITOR': _('Managing'),
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
    'ERR_IP_CONFLICT': _('❌ IP Conflict Blocked!\n\nThe IP [{ip}] is occupied by device [{name}].\nPlease modify the strategy or enter a free IP!'),
    'TIP_NO_CHANGE': _('💡 Tip: The device is already fixed at this IP. No changes needed!'),
    'TIP_ALL_UNBOUND': _('💡 Tip: The {count} selected devices are all [Unbound]. No unbind action needed!'),
    'ERR_SUF_RANGE': _('Starting suffix must be between 2 and 254!'),
    'ERR_POOL_INSUFF': _('❌ IP pool insufficient!\nOnly {avail} IPs left from .{suf}, but {count} devices selected.'),
    'ERR_CAT_FAIL': _('❌ [{name}] assignment failed!\nSelected {req} devices, but only {avail} IPs available in the preset range.\nPlease expand the IP range for this category!'),
    'TIP_BATCH_NO_CHANGE': _('💡 Smart block: According to your strategy, the {count} selected devices are already fixed with unchanged IPs. No need to rewrite rules!'),
    'TXT_INFINITE': _('Infinite'),
    'TXT_EXPIRED': _('Expired')
};

var callDeviceList = rpc.declare({ object: 'netwiz_dev', method: 'get_list', expect: { '': {} } });
var callDeviceBind = rpc.declare({ object: 'netwiz_dev', method: 'bind', params: ['mac', 'ip', 'name', 'no_reload'], expect: { result: 0 } });
var callDeviceUnbind = rpc.declare({ object: 'netwiz_dev', method: 'unbind', params: ['mac', 'no_reload'], expect: { result: 0 } });
var callApplyDhcp = rpc.declare({ object: 'netwiz_dev', method: 'apply_dhcp', expect: { result: 0 } });

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
            '  .nd-cb-back svg { width: 22px; height: 22px; }',
            '  .nd-cb-refresh svg { width: 15px; height: 15px; }',
            '  .nd-card-name svg { width: 18px; height: 18px; margin-right: 2px; vertical-align: sub; }',
            '  .nd-lease-info svg { width: 12px; height: 12px; margin-right: 2px; vertical-align: baseline; }',
            '  .btn-bind svg { width: 15px; height: 15px; margin-right: 4px; vertical-align: sub; }',
            '  .nd-batch-bar { padding-right: 55px !important; }',
            '  .nd-batch-close-btn { position: absolute; right: 10px; top: 30%; transform: translateY(-50%); font-size: 32px; color: #94a3b8; cursor: pointer; line-height: 1; z-index: 100; transition: color 0.2s; user-select: none; font-family: Arial, sans-serif; font-weight: normal; }',
            '  .nd-batch-close-btn:hover { color: #ef4444; }',
            '  @media screen and (max-width: 768px) {',
            '    .nd-batch-bar.show { padding-right: 15px !important; }',
            '    .nd-batch-close-btn { top: 2px; right: 15px; transform: none; font-size: 36px; }',
            '  }',
            '</style>',
            '<div class="nw-wrapper">',
            '   <div class="nw-header">',
            '      <div class="nw-title-wrap">',
            '         <div class="nw-main-title">{{NW_TITLE}}</div>',
            '         <div class="nw-version-tag">v1.4.0 <div class="nw-version-dot" style="display: none;"></div></div>',
            '      </div>',
            '      <p>{{NW_SUBTITLE}}</p>',
            '   </div>',

            '   <div class="nd-control-bar">',
            '      <div class="nd-cb-back" id="dev-back" title="{{BTN_HOME}}">',
            '         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>',
            '      </div>',
            '      <div class="nd-cb-title-wrap">',
            '          <div class="nd-cb-title">{{DEV_TITLE}}</div>',
            '          <p class="nd-cb-sub">{{DEV_SUBTITLE}}</p>',
            '      </div>',
            '      <div class="nd-cb-refresh" id="dev-refresh" title="{{BTN_RESCAN}}">',
            '         <svg class="nd-refresh-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 2v6h-6"></path><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path></svg> {{BTN_REFRESH}}',
            '      </div>',
            '   </div>',

            '   <div id="nd-loading" style="display:flex; flex-direction:column; align-items:center; padding:50px 0; gap:15px; color:#64748b; font-weight:bold; width: 100%;">',
            '      <div class="nd-spinner"></div>',
            '      <span id="nd-loading-text">{{TXT_LOADING_RADAR}}</span>',
            '   </div>',
            
            '   <div id="nd-category-tabs" class="nd-category-tabs" style="display:none;">',
            '       <button class="nd-cat-btn active" data-cat="all">{{TAB_ALL}} (<span id="cnt-all">0</span>)</button>',
            '       <button class="nd-cat-btn" data-cat="mobile">📱 {{TAB_MOBILE}} (<span id="cnt-mobile">0</span>)</button>',
            '       <button class="nd-cat-btn" data-cat="pc">💻 {{TAB_PC}} (<span id="cnt-pc">0</span>)</button>',
            '       <button class="nd-cat-btn" data-cat="iot">💡 {{TAB_IOT}} (<span id="cnt-iot">0</span>)</button>',
            '       <button class="nd-cat-btn" data-cat="other">🏷️ {{TAB_OTHER}} (<span id="cnt-other">0</span>)</button>',
            '   </div>',

            '   <div id="nd-list-header" class="nd-list-header" style="display:none;">',
            '       <label class="nw-wiz-cb-wrap"><input type="checkbox" id="cb-select-all"><span class="nw-wiz-checkmark"></span> <span style="font-size:14.5px; font-weight:bold; color:#5e72e4;">{{LBL_SELECT_ALL}}</span></label>',
            '   </div>',

            '   <div id="nd-list-container" class="nd-list" style="display: none;"></div>',
            
            '   <div id="nd-batch-bar" class="nd-batch-bar">',
            '       <div id="nd-batch-close" class="nd-batch-close-btn" title="取消選擇">&times;</div>',
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
            '       <div id="nd-m-form" style="display:none;">',
            '           <div id="nd-m-normal-fields">',
            '               <div class="nd-input-group">',
            '                   <label class="nd-input-label">{{LBL_DEV_ALIAS}}</label>',
            '                   <input type="text" id="nd-inp-name" class="nd-input" placeholder="{{PH_DEV_ALIAS}}" autocomplete="off">',
            '               </div>',
            '               <div class="nd-input-group" id="nd-single-strategy-group" style="display:none;">',
            '                   <label class="nd-input-label">{{LBL_QUICK_STRAT}}</label>',
            '                   <div class="nw-radio-group" style="flex-direction: row; flex-wrap: wrap; gap: 8px;">',
            '                       <label class="nw-radio-btn" style="flex: 1 1 30%;"><input type="radio" name="single_strategy" value="keep" checked> <span class="nw-radio-btn-text" style="padding: 6px 4px; font-size: 12.5px;">🛡️ {{STRAT_KEEP}}</span></label>',
            '                       <label class="nw-radio-btn" style="flex: 1 1 30%;"><input type="radio" name="single_strategy" value="smart"> <span class="nw-radio-btn-text" style="padding: 6px 4px; font-size: 12.5px;">🧠 {{STRAT_SMART}}</span></label>',
            '                       <label class="nw-radio-btn" style="flex: 1 1 30%;"><input type="radio" name="single_strategy" value="seq"> <span class="nw-radio-btn-text" style="padding: 6px 4px; font-size: 12.5px;">🔢 {{STRAT_SEQ}}</span></label>',
            '                   </div>',
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
            '                           <div style="font-size:15px;">🛡️ {{STRAT_KEEP_TITLE}}</div>',
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
            '                   </div>',
            '               </div>',
            '               <div class="nd-input-group" id="nd-batch-ip-group" style="display:none;">',
            '                   <label class="nd-input-label">{{LBL_START_IP}}</label>',
            '                   <div style="display:flex; align-items:center; background:#f8fafc; border:1px solid #cbd5e1; border-radius:8px; overflow:hidden; transition:all 0.2s;">',
            '                       <span id="nd-batch-prefix" style="padding:12px 0 12px 14px; font-family:monospace; color:#64748b; font-size:15px; font-weight:bold;">192.168.1.</span>',
            '                       <input type="number" id="nd-batch-suffix" style="flex:1; border:none; background:transparent; padding:12px 14px 12px 2px; font-size:15px; font-family:monospace; outline:none; font-weight:bold; color:#0f172a;" placeholder="50" min="2" max="254">',
            '                   </div>',
            '               </div>',
            '               <div id="nd-batch-smart-desc" style="display:none; font-size:13px; color:#64748b; background:#f8fafc; padding:0 3px; border-radius:10px; margin-bottom:5px; border:1px dashed #cbd5e1;">',
            '                   <div class="nd-smart-row"><div class="nd-smart-label">🏷️ {{LBL_OTHERS}}</div> <div class="nd-smart-inputs"><span class="nd-ip-prefix"></span><input type="number" id="sm-oth-s" class="nd-input-sm" value="50"> <span class="nd-smart-dash">-</span> <input type="number" id="sm-oth-e" class="nd-input-sm" value="99"></div></div>',
            '                   <div class="nd-smart-row"><div class="nd-smart-label">📱 {{LBL_MOBILE}}</div> <div class="nd-smart-inputs"><span class="nd-ip-prefix"></span><input type="number" id="sm-mob-s" class="nd-input-sm" value="100"> <span class="nd-smart-dash">-</span> <input type="number" id="sm-mob-e" class="nd-input-sm" value="149"></div></div>',
            '                   <div class="nd-smart-row"><div class="nd-smart-label">💻 {{LBL_PC}}</div> <div class="nd-smart-inputs"><span class="nd-ip-prefix"></span><input type="number" id="sm-pc-s" class="nd-input-sm" value="150"> <span class="nd-smart-dash">-</span> <input type="number" id="sm-pc-e" class="nd-input-sm" value="199"></div></div>',
            '                   <div class="nd-smart-row" style="margin-bottom:0; border-bottom:none; padding-bottom:0;"><div class="nd-smart-label">💡 {{LBL_IOT}}</div> <div class="nd-smart-inputs"><span class="nd-ip-prefix"></span><input type="number" id="sm-iot-s" class="nd-input-sm" value="200"> <span class="nd-smart-dash">-</span> <input type="number" id="sm-iot-e" class="nd-input-sm" value="250"></div></div>',
            '               </div>',
            '           </div>',
            '       </div>',
            '       <div style="display:flex; gap:15px; width:100%; margin-top:8px;">',
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
        var mNormalFields = container.querySelector('#nd-m-normal-fields');
        var mBatchFields = container.querySelector('#nd-m-batch-fields');
        var mInpName = container.querySelector('#nd-inp-name');
        var mInpIp = container.querySelector('#nd-inp-ip');
        
        var mSingleStrategyGroup = container.querySelector('#nd-single-strategy-group');
        var singleRadios = container.querySelectorAll('input[name="single_strategy"]');
        var currentSingleDev = null;
        var currentOriginalIp = "";

        var strategyCards = container.querySelectorAll('.nd-strategy-card');
        var batchIpGroup = container.querySelector('#nd-batch-ip-group');
        var batchSmartDesc = container.querySelector('#nd-batch-smart-desc');
        var batchSuffixInput = container.querySelector('#nd-batch-suffix');

        var mBtnOk = container.querySelector('#nd-m-ok');
        var mBtnCancel = container.querySelector('#nd-m-cancel');

        if (modalOverlay) { document.body.appendChild(modalOverlay); }
        
        // ==============================================================
        // 动态计算悬浮高度
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
                if (topOffset > 0) topOffset -= 1; // 向上咬合 1px

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
            
            // 自动校准
            window.addEventListener('scroll', function() {
                if (lastHeight <= 0) adjustStickyTop();
            }, { passive: true });
            window.addEventListener('resize', adjustStickyTop);
        }
        // ==============================================================

        var savedStrategy = localStorage.getItem('nw_batch_strategy') || 'keep';
        var savedRanges = JSON.parse(localStorage.getItem('nw_smart_ranges') || '{"os":50,"oe":99,"ms":100,"me":149,"ps":150,"pe":199,"is":200,"ie":250}');
        var basePrefix = '192.168.1.';

        var rangeInputs = [
            {s: '#sm-oth-s', e: '#sm-oth-e'},
            {s: '#sm-mob-s', e: '#sm-mob-e'},
            {s: '#sm-pc-s', e: '#sm-pc-e'},
            {s: '#sm-iot-s', e: '#sm-iot-e'}
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
            return 'other';
        }

        singleRadios.forEach(function(radio) {
            radio.addEventListener('change', function() {
                if(!currentSingleDev) return;
                var val = this.value;
                var usedIps = globalDevices.map(function(d){return d.ip;});
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
                } else if (val === 'seq') {
                    var lastIp = localStorage.getItem('nw_last_ip');
                    if (!lastIp || lastIp.substring(0, lastIp.lastIndexOf('.') + 1) !== basePrefix) {
                        lastIp = basePrefix + "50"; 
                    }
                    var nextIp = getNextAvailableIp(lastIp, usedIps);
                    mInpIp.value = nextIp;
                }
            });
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
            
            if (options.showForm) { 
                mForm.style.display = 'block'; 
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
                    } else {
                        mSingleStrategyGroup.style.display = 'none';
                        mInpIp.value = options.defIp || ''; 
                    }
                }
            } else { 
                mForm.style.display = 'none'; 
            }
            
            mBtnOk.className = 'nd-btn ' + (options.danger ? 'nd-btn-red' : 'nd-btn-blue');
            mBtnOk.innerText = options.okText || T['BTN_OK'];
            
            mBtnOk.onclick = function() { 
                if (options.showForm) {
                    if (options.isBatchBind) {
                        var activeStrategy = modalOverlay.querySelector('.nd-strategy-card.active').getAttribute('data-val');
                        if (activeStrategy === 'smart') {
                            autoCascadeRanges(); 
                            var nr = {
                                os: parseInt(modalOverlay.querySelector('#sm-oth-s').value), oe: parseInt(modalOverlay.querySelector('#sm-oth-e').value),
                                ms: parseInt(modalOverlay.querySelector('#sm-mob-s').value), me: parseInt(modalOverlay.querySelector('#sm-mob-e').value),
                                ps: parseInt(modalOverlay.querySelector('#sm-pc-s').value), pe: parseInt(modalOverlay.querySelector('#sm-pc-e').value),
                                is: parseInt(modalOverlay.querySelector('#sm-iot-s').value), ie: parseInt(modalOverlay.querySelector('#sm-iot-e').value)
                            };
                            localStorage.setItem('nw_smart_ranges', JSON.stringify(nr));
                            savedRanges = nr;
                        }
                        var resBatch = { strategy: activeStrategy, startSuffix: batchSuffixInput.value.trim(), ranges: savedRanges };
                        if (options.onOk) options.onOk(resBatch);
                        modalOverlay.style.display = 'none';
                        if (floatBar) floatBar.style.removeProperty('display'); 
                    } else {
                        var submitIp = mInpIp.value.trim();
                        if (!submitIp) { alert(T['ERR_IP_EMPTY']); return; }

                        var conflictDev = globalDevices.find(function(d) {
                            return d.ip === submitIp && d.mac !== options.targetMac;
                        });
                        
                        if (conflictDev) {
                            var cName = conflictDev.name === 'Unknown' ? conflictDev.mac.toUpperCase() : conflictDev.name;
                            alert(T['ERR_IP_CONFLICT'].replace('{ip}', submitIp).replace('{name}', cName));
                            return; 
                        }

                        var newName = mInpName.value.trim();
                        var isCurrentlyStatic = currentSingleDev.is_static === true || currentSingleDev.is_static === 'true';
                        
                        if (isCurrentlyStatic && submitIp === currentOriginalIp && newName === options.defName) {
                            alert(T['TIP_NO_CHANGE']);
                            return;
                        }
                        
                        var resSingle = { name: newName, ip: submitIp };
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

        function isSelectable(dev) {
            var isSys = dev.is_gw === 'true' || dev.is_gw === true || dev.is_local === 'true' || dev.is_local === true;
            var isVisitor = dev.is_visitor === 'true' || dev.is_visitor === true;
            
            // 系统保留设备，或者当前设备，不能被选中
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

        container.querySelectorAll('.nd-cat-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                container.querySelectorAll('.nd-cat-btn').forEach(function(b){ b.classList.remove('active'); });
                this.classList.add('active');
                currentFilter = this.getAttribute('data-cat');
                selectedDevices = []; 
                filterAndRender();
            });
        });

        function filterAndRender() {
            if (currentFilter === 'all') {
                filteredDevices = globalDevices;
            } else {
                filteredDevices = globalDevices.filter(function(d) { return getDeviceType(d) === currentFilter; });
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

                var statusBadgesHtml = isOnline 
                    ? '<span class="nd-status-badge nd-status-online"><span class="nd-dot-online"></span>' + T['BDG_ONLINE'] + '</span>' 
                    : '<span class="nd-status-badge nd-status-offline"><span class="nd-dot-offline"></span>' + T['BDG_OFFLINE'] + '</span>';

                if (isPending) {
                    statusBadgesHtml += '<span class="nd-badge nd-badge-pending">⏳ ' + (T['BDG_PENDING'] || 'Pending') + '</span>';
                } else if (isStatic) {
                    statusBadgesHtml += '<span class="nd-badge nd-badge-static">🔒 ' + T['BDG_STATIC'] + '</span>';
                }
                if (isGw) statusBadgesHtml += '<span class="nd-badge nd-badge-gw">🌐 ' + T['BDG_GW'] + '</span>';
                if (isGw) statusBadgesHtml += '<span class="nd-badge nd-badge-gw">🌐 ' + T['BDG_GW'] + '</span>';
                if (isLocal) statusBadgesHtml += '<span class="nd-badge nd-badge-local">💻 ' + T['BDG_LOCAL'] + '</span>';
                if (isVisitor) statusBadgesHtml += '<span class="nd-badge nd-badge-visitor">👤 ' + (T['BDG_VISITOR'] || '当前设备') + '</span>';

                var leaseText = dev.lease || '-';
                if (leaseText === 'Static' || leaseText === 'Infinite' || (isStatic && leaseText === '-')) {
                    leaseText = T['TXT_INFINITE'];
                } else if (leaseText === 'Expired') {
                    leaseText = T['TXT_EXPIRED'];
                } else if (leaseText === 'Device Addressed IP') {
                    leaseText = T['BDG_ADDR_IP'];
                }
                
                if (isGw || isLocal) leaseText = T['TXT_SYS_ROUTE'];

                var actions = "";
                if (isGw || isLocal) {
                    actions = '<span style="color:#94a3b8; font-size:12.5px; font-weight:bold; padding: 10px;">' + T['TXT_SYS_RESERVED'] + '</span>';
                } else if (isStatic) {
                    actions = '<button class="nd-btn nd-btn-gray btn-edit" data-mac="'+dev.mac+'" data-ip="'+dev.ip+'" data-name="'+dev.name+'">' + T['BTN_EDIT'] + '</button>' +
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
                    // 划掉旧 IP ➜ 橙色的新 IP
                    ipText = '<span style="text-decoration:line-through; color:#94a3b8; font-size:12.5px; margin-right:5px;">' + dev.ip + '</span><span style="color:#d97706; font-weight:bold;">➜ ' + dev.bound_ip + '</span>';
                }

                html += '<div class="nd-card"><div class="nd-card-left"><div style="display:flex; align-items:center;">';
                
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
                    '       <div class="nd-card-mac" style="margin-left:50px;">' + (dev.mac).toUpperCase() + '</div>',
                    '   </div>',
                    '   <div class="nd-card-mid">',
                    '       <div class="nd-card-ip">' + ipText + '</div>',
                    '       <div class="nd-lease-info"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> ' + leaseText + '</div>',
                    '   </div>',
                    '   <div class="nd-card-right">' + actions + '</div>',
                    '</div>'
                ].join('\n');
            });

            listEl.innerHTML = html;
            
            container.querySelectorAll('.nd-card-checkbox input').forEach(function(cb) {
                cb.addEventListener('change', function() { 
                    var mac = this.getAttribute('data-mac');
                    var dev = globalDevices.find(function(d){ return d.mac === mac; });
                    toggleSelection(dev, this.checked); 
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
                            
                            callDeviceBind(mac, data.ip, data.name, false).then(function() {
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

        function runSequential(tasks) {
            var result = Promise.resolve();
            tasks.forEach(function(task) {
                result = result.then(function() { return task(); });
            });
            return result;
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

                    runSequential(tasks).then(function() {
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
                    var usedIps = globalDevices.map(function(d) { return d.ip; });
                    
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
                        var reqCounts = { mobile: 0, pc: 0, iot: 0, other: 0 };
                        selectedDevices.forEach(function(d) { reqCounts[getDeviceType(d)]++; });
                        var rg = data.ranges;
                        var zones = {
                            mobile: { s: rg.ms, e: rg.me, name: T['TAB_MOBILE'] },
                            pc: { s: rg.ps, e: rg.pe, name: T['TAB_PC'] },
                            iot: { s: rg.is, e: rg.ie, name: T['TAB_IOT'] },
                            other: { s: rg.os, e: rg.oe, name: T['TAB_OTHER'] }
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
                    }

                    var tasks = [];
                    var currentIp = strategy === 'seq' ? (basePrefix + parseInt(data.startSuffix, 10)) : null;
                    var lastAssignedGlobal = null;
                    var skippedCount = 0;

                    selectedDevices.forEach(function(dev) {
                        var assignIp = dev.ip; 

                        if (strategy === 'keep') {
                            var devPrefix = assignIp.substring(0, assignIp.lastIndexOf('.') + 1);
                            if (devPrefix !== basePrefix) {
                                assignIp = getAvailableIpInRange(basePrefix, 50, 250, usedIps);
                                usedIps.push(assignIp);
                            }
                        } else if (strategy === 'seq') {
                            assignIp = getNextAvailableIp(currentIp, usedIps);
                            usedIps.push(assignIp); 
                            currentIp = getNextAvailableIp(assignIp, usedIps); 
                        } else if (strategy === 'smart') {
                            var devType = getDeviceType(dev);
                            var sStart = data.ranges.os, sEnd = data.ranges.oe;
                            if (devType === 'mobile') { sStart = data.ranges.ms; sEnd = data.ranges.me; }
                            else if (devType === 'pc') { sStart = data.ranges.ps; sEnd = data.ranges.pe; }
                            else if (devType === 'iot') { sStart = data.ranges.is; sEnd = data.ranges.ie; }
                            
                            var smartIp = getAvailableIpInRange(basePrefix, sStart, sEnd, usedIps);
                            if (smartIp) {
                                assignIp = smartIp;
                                usedIps.push(assignIp);
                            }
                        }

                        var isCurrentlyStatic = dev.is_static === true || dev.is_static === 'true';
                        if (isCurrentlyStatic && assignIp === dev.ip) {
                            skippedCount++;
                            return; 
                        }

                        lastAssignedGlobal = assignIp;
                        var safeName = dev.name === "Unknown" ? "" : dev.name;
                        tasks.push(function() {
                            return callDeviceBind(dev.mac, assignIp, safeName, true);
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

                    runSequential(tasks).then(function() {
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
            
            callDeviceList().then(function(res) {
                loadingEl.style.display = 'none';
                
                var devices = [];
                if (res && Array.isArray(res.devices)) {
                    devices = res.devices;
                } else if (res && typeof res[''] === 'string') {
                    try { devices = JSON.parse(res['']).devices || []; } catch(e){}
                } else if (res && typeof res === 'string') {
                    try { devices = JSON.parse(res).devices || []; } catch(e){}
                }
                
                var currentHostIp = window.location.hostname;
                devices.forEach(function(d) {
                    if (d.ip === currentHostIp) d.is_local = true;
                });

                globalDevices = devices;
                
                var gwDev = globalDevices.find(function(d) { return d.is_gw === 'true' || d.is_local === 'true'; });
                var baseIp = gwDev ? gwDev.ip : (globalDevices.length > 0 ? globalDevices[0].ip : '192.168.1.1');
                basePrefix = baseIp.substring(0, baseIp.lastIndexOf('.') + 1);
                var preEl = container.querySelector('#nd-batch-prefix');
                if (preEl) preEl.innerText = basePrefix;

                var cMob=0, cPc=0, cIot=0, cOth=0;
                globalDevices.forEach(function(d) {
                    var t = getDeviceType(d);
                    if(t==='mobile') cMob++; else if(t==='pc') cPc++; else if(t==='iot') cIot++; else cOth++;
                });
                container.querySelector('#cnt-all').innerText = globalDevices.length;
                container.querySelector('#cnt-mobile').innerText = cMob;
                container.querySelector('#cnt-pc').innerText = cPc;
                container.querySelector('#cnt-iot').innerText = cIot;
                container.querySelector('#cnt-other').innerText = cOth;

                // ==============================================================
                // 设备排序
                devices.sort(function(a, b) {
                    var getWeight = function(d) {
                        // 1. 系統设备
                        if (d.is_gw === true || d.is_gw === 'true') return 100;
                        if (d.is_local === true || d.is_local === 'true') return 90;
                        if (d.is_visitor === true || d.is_visitor === 'true') return 80;
                        
                        // 2. 已绑 IP
                        if (d.is_static === true || d.is_static === 'true') return 70;
                        
                        var isOnline = (d.online === true || d.online === 'true');
                        var isUnknown = (d.name === 'Unknown' || d.ip === 'Unknown IP');
                        
                        // 3. 常规
                        if (isOnline && !isUnknown) return 60;  // 在线 + 活跃设备
                        if (isOnline && isUnknown) return 50;   // 在线 + 未知设备
                        if (!isOnline && isUnknown) return 40;  // 离线 + 未知设备
                        return 30;                              // 离线 + 已知设备
                    };

                    var weightA = getWeight(a);
                    var weightB = getWeight(b);

                    if (weightA !== weightB) {
                        return weightB - weightA; 
                    }
                    
                    return a.ip.localeCompare(b.ip, undefined, {numeric: true, sensitivity: 'base'});
                });
                // ==============================================================

                if (devices.length === 0) {
                    listEl.innerHTML = '<div style="text-align:center; padding:60px 20px; color:#64748b; background:#fff; border-radius:16px; border:1px dashed #cbd5e1; width:100%;">' + T['MSG_NO_DEVS'] + '</div>';
                    listEl.style.display = 'flex';
                    return;
                }

                catTabs.style.display = 'flex';
                listHeader.style.display = 'flex';
                filterAndRender();

            }).catch(function(e) {
                loadingEl.style.display = 'none';
                listHeader.style.display = 'none';
                catTabs.style.display = 'none';
                listEl.style.display = 'block';
                listEl.innerHTML = '<div class="nd-empty" style="color:#ef4444;">' + T['MSG_SCAN_FAIL'] + ' ('+e+')</div>';
            });
        };

        refreshBtn.addEventListener('click', function() {
            var icon = this.querySelector('.nd-refresh-icon');
            icon.style.transform = 'rotate(360deg)';
            setTimeout(function(){ icon.style.transform = 'none'; }, 800);
            loadDevices();
        });

        loadDevices();
    }
});
