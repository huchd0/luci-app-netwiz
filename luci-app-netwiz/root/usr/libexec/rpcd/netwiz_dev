/*
 * Copyright (C) 2026 huchd0 <https://github.com/huchd0/luci-app-netwiz>
 * Licensed under the GNU General Public License v3.0
 */
'use strict';
'require view';
'require dom';
'require rpc';

var callDeviceList = rpc.declare({ object: 'netwiz_dev', method: 'get_list', expect: { '': {} } });
var callDeviceBind = rpc.declare({ object: 'netwiz_dev', method: 'bind', params: ['mac', 'ip', 'name'], expect: { result: 0 } });
var callDeviceUnbind = rpc.declare({ object: 'netwiz_dev', method: 'unbind', params: ['mac'], expect: { result: 0 } });

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
            '</style>',
            '<div class="nw-wrapper">',
            '   <div class="nw-header">',
            '      <div class="nw-title-wrap">',
            '         <div class="nw-main-title">Netwiz 网络设置向导</div>',
            '         <div class="nw-version-tag">v1.4.0 <div class="nw-version-dot" style="display: none;"></div></div>',
            '      </div>',
            '      <p>纯粹 · 安全 · 无损的极简配置</p>',
            '   </div>',

            '   <div class="nd-control-bar">',
            '      <div class="nd-cb-back" id="dev-back" title="返回主界面">',
            '         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>',
            '      </div>',
            '      <div class="nd-cb-title-wrap">',
            '          <div class="nd-cb-title">设备网络管家</div>',
            '          <p class="nd-cb-sub">终端设备状态监控与固定 IP 管理</p>',
            '      </div>',
            '      <div class="nd-cb-refresh" id="dev-refresh" title="重新扫描网络">',
            '         <svg class="nd-refresh-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 2v6h-6"></path><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path></svg> 刷新',
            '      </div>',
            '   </div>',

            '   <div id="nd-loading" style="display:flex; flex-direction:column; align-items:center; padding:50px 0; gap:15px; color:#64748b; font-weight:bold; width: 100%;">',
            '      <div class="nd-spinner"></div>',
            '      <span id="nd-loading-text">正在启动三维雷达探测...</span>',
            '   </div>',

            '   <div id="nd-list-container" class="nd-list" style="display: none;"></div>',
            '</div>', 

            '<div id="nd-modal-overlay">',
            '   <div class="nd-modal-box">',
            '       <div id="nd-m-title" class="nd-modal-title"></div>',
            '       <div id="nd-m-content" style="color:#475569; font-size:15px; margin-bottom:20px; text-align:left; line-height:1.5;"></div>',
            '       <div id="nd-m-form" style="display:none;">',
            '           <div class="nd-input-group">',
            '               <label class="nd-input-label">设备备注名</label>',
            '               <input type="text" id="nd-inp-name" class="nd-input" placeholder="例如: 小明的电脑" autocomplete="off">',
            '           </div>',
            '           <div class="nd-input-group">',
            '               <label class="nd-input-label">分配固定 IP</label>',
            '               <input type="text" id="nd-inp-ip" class="nd-input" placeholder="例如: 192.168.1.50" autocomplete="off">',
            '           </div>',
            '       </div>',
            '       <div style="display:flex; gap:15px; width:100%;">',
            '           <button id="nd-m-cancel" class="nd-btn nd-btn-gray" style="flex:1;">取消</button>',
            '           <button id="nd-m-ok" class="nd-btn nd-btn-blue" style="flex:1;">确定</button>',
            '       </div>',
            '   </div>',
            '</div>'
        ].join('\n');

        container.innerHTML = htmlTemplate;
        this.bindEvents(container);
        return container;
    },

    bindEvents: function(container) {
        container.querySelector('#dev-back').addEventListener('click', function() {
            window.location.href = window.location.pathname.replace('/netwiz_dev', '/netwiz');
        });

        var modalOverlay = container.querySelector('#nd-modal-overlay');
        var mTitle = container.querySelector('#nd-m-title');
        var mContent = container.querySelector('#nd-m-content');
        var mForm = container.querySelector('#nd-m-form');
        var mInpName = container.querySelector('#nd-inp-name');
        var mInpIp = container.querySelector('#nd-inp-ip');
        var mBtnOk = container.querySelector('#nd-m-ok');
        var mBtnCancel = container.querySelector('#nd-m-cancel');

        var openModal = function(options) {
            mTitle.innerText = options.title || '';
            if (options.content) { mContent.innerHTML = options.content; mContent.style.display = 'block'; } else { mContent.style.display = 'none'; }
            if (options.showForm) { mForm.style.display = 'block'; mInpName.value = options.defName || ''; mInpIp.value = options.defIp || ''; } else { mForm.style.display = 'none'; }
            mBtnOk.className = 'nd-btn ' + (options.danger ? 'nd-btn-red' : 'nd-btn-blue');
            mBtnOk.innerText = options.okText || '确定';
            mBtnOk.onclick = function() { var res = options.showForm ? { name: mInpName.value.trim(), ip: mInpIp.value.trim() } : true; if (options.onOk) options.onOk(res); modalOverlay.style.display = 'none'; };
            mBtnCancel.onclick = function() { modalOverlay.style.display = 'none'; };
            modalOverlay.style.display = 'flex';
            if (options.showForm) setTimeout(function(){ mInpName.focus(); }, 100);
        };

        var loadingEl = container.querySelector('#nd-loading');
        var loadingText = container.querySelector('#nd-loading-text');
        var listEl = container.querySelector('#nd-list-container');
        var refreshBtn = container.querySelector('#dev-refresh');

        var loadDevices = function() {
            loadingEl.style.display = 'flex';
            loadingText.innerText = "正在启动三维雷达探测...";
            listEl.style.display = 'none';
            
            callDeviceList().then(function(res) {
                loadingEl.style.display = 'none';
                listEl.style.display = 'flex';
                
                var devices = (res && Array.isArray(res.devices)) ? res.devices : [];
                
                devices.sort(function(a, b) {
                    var aGw = (a.is_gw === true || a.is_gw === 'true');
                    var bGw = (b.is_gw === true || b.is_gw === 'true');
                    var aLocal = (a.is_local === true || a.is_local === 'true');
                    var bLocal = (b.is_local === true || b.is_local === 'true');
                    var aStatic = (a.is_static === true || a.is_static === 'true');
                    var bStatic = (b.is_static === true || b.is_static === 'true');
                    var aOnline = (a.online === true || a.online === 'true');
                    var bOnline = (b.online === true || b.online === 'true');

                    if (aGw !== bGw) return aGw ? -1 : 1;
                    if (aLocal !== bLocal) return aLocal ? -1 : 1;
                    if (aStatic !== bStatic) return aStatic ? -1 : 1;
                    if (aOnline !== bOnline) return aOnline ? -1 : 1;
                    return a.ip.localeCompare(b.ip, undefined, {numeric: true, sensitivity: 'base'});
                });

                if (devices.length === 0) {
                    listEl.innerHTML = '<div style="text-align:center; padding:60px 20px; color:#64748b; background:#fff; border-radius:16px; border:1px dashed #cbd5e1; width:100%;">当前局域网内未发现任何设备记录</div>';
                    return;
                }

                var html = "";
                devices.forEach(function(dev) {
                    var isOnline = (dev.online === true || dev.online === 'true');
                    var isStatic = (dev.is_static === true || dev.is_static === 'true');
                    var isGw = (dev.is_gw === true || dev.is_gw === 'true');
                    var isLocal = (dev.is_local === true || dev.is_local === 'true');
                    
                    var statusBadgesHtml = isOnline 
                        ? '<span class="nd-status-badge nd-status-online"><span class="nd-dot-online"></span>在线</span>' 
                        : '<span class="nd-status-badge nd-status-offline"><span class="nd-dot-offline"></span>离线</span>';
                        
                    if (isStatic) statusBadgesHtml += '<span class="nd-badge nd-badge-static">🔒 静态</span>';
                    if (isGw) statusBadgesHtml += '<span class="nd-badge nd-badge-gw">🌐 上级网关</span>';
                    if (isLocal) statusBadgesHtml += '<span class="nd-badge nd-badge-local">💻 本机系统</span>';

                    var leaseText = dev.lease || '-';
                    if (isStatic && leaseText === '-') leaseText = '静态分配 (Static)';
                    if (isGw) leaseText = '系统网关路由';

                    var actions = "";
                    if (isStatic) {
                        actions = '<button class="nd-btn nd-btn-gray btn-edit" data-mac="'+dev.mac+'" data-ip="'+dev.ip+'" data-name="'+dev.name+'">修改</button>' +
                                  '<button class="nd-btn nd-btn-red btn-unbind" data-mac="'+dev.mac+'">解绑</button>';
                    } else {
                        actions = '<button class="nd-btn nd-btn-green btn-bind" data-mac="'+dev.mac+'" data-ip="'+dev.ip+'" data-name="'+dev.name+'"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg> 一键固定</button>';
                    }

                    var displayName = dev.name === 'Unknown' ? '<i style="color:#94a3b8; font-weight:normal;">未知设备</i>' : dev.name;

                    html += [
                        '<div class="nd-card">',
                        '   <div class="nd-card-left">',
                        '       <div class="nd-card-name"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg> ',
                        '           <span style="word-break:break-all;">' + displayName + '</span>',
                        '           ' + statusBadgesHtml, 
                        '       </div>',
                        '       <div class="nd-card-mac">' + (dev.mac).toUpperCase() + '</div>',
                        '   </div>',
                        
                        '   <div class="nd-card-mid">',
                        '       <div class="nd-card-ip">' + dev.ip + '</div>',
                        '       <div class="nd-lease-info"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> ' + leaseText + '</div>',
                        '   </div>',
                        
                        '   <div class="nd-card-right">',
                        '       ' + actions,
                        '   </div>',
                        '</div>'
                    ].join('\n');
                });

                listEl.innerHTML = html;
                
                container.querySelectorAll('.btn-bind, .btn-edit').forEach(function(btn) {
                    btn.addEventListener('click', function() {
                        var mac = this.getAttribute('data-mac');
                        var ip = this.getAttribute('data-ip');
                        var rawName = this.getAttribute('data-name');
                        var isEdit = this.classList.contains('btn-edit');
                        
                        openModal({
                            title: isEdit ? '修改设备信息' : '一键固定 IP',
                            content: '正在为 MAC: <span style="font-family:monospace; color:#3b82f6; font-weight:bold;">' + mac.toUpperCase() + '</span> 进行配置。',
                            showForm: true,
                            defName: rawName === 'Unknown' ? '' : rawName,
                            defIp: ip,
                            okText: isEdit ? '保存修改' : '绑定此设备',
                            onOk: function(data) {
                                if (!data.ip) { alert("IP 地址不能为空！"); return; }
                                listEl.style.display = 'none';
                                loadingEl.style.display = 'flex';
                                loadingText.innerText = "正在安全写入并无感重启服务...";
                                
                                callDeviceBind(mac, data.ip, data.name).then(function() {
                                    setTimeout(loadDevices, 1000);
                                }).catch(function() { setTimeout(loadDevices, 1000); });
                            }
                        });
                    });
                });

                container.querySelectorAll('.btn-unbind').forEach(function(btn) {
                    btn.addEventListener('click', function() {
                        var mac = this.getAttribute('data-mac');
                        openModal({
                            title: '解除 IP 绑定',
                            content: '确定要解除对该设备 (<b style="font-family:monospace;">'+mac.toUpperCase()+'</b>) 的静态 IP 绑定吗？<br><br>解除后它将在下次请求网络时重新获取随机 IP。',
                            danger: true,
                            okText: '确认解绑',
                            onOk: function() {
                                listEl.style.display = 'none';
                                loadingEl.style.display = 'flex';
                                loadingText.innerText = "正在释放静态绑定...";
                                callDeviceUnbind(mac).then(function() {
                                    setTimeout(loadDevices, 1000);
                                }).catch(function() { setTimeout(loadDevices, 1000); });
                            }
                        });
                    });
                });

            }).catch(function(e) {
                loadingEl.style.display = 'none';
                listEl.style.display = 'block';
                listEl.innerHTML = '<div class="nd-empty" style="color:#ef4444;">❌ 扫描失败：无法获取底层数据 ('+e+')</div>';
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
