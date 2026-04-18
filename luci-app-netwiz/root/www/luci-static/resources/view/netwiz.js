'use strict';
'require view';
'require dom';
'require rpc';
'require ui';
'require uci';

var callNetSetup = rpc.declare({
    object: 'netwiz',
    method: 'set_network',
    params: ['mode', 'arg1', 'arg2', 'arg3', 'arg4'],
    expect: { result: 0 }
});

return view.extend({
    render: function () {
        var container = dom.create('div', { class: 'cbi-map', id: 'netwiz-container' });

        var htmlTemplate = [
            '<style>',
            'html, body { overflow-y: scroll !important; scrollbar-gutter: stable; }',
            '.nw-wrapper { display: flex; flex-direction: column; align-items: center; justify-content: flex-start; min-height: 80vh; padding-top: 10vh; padding-bottom: 10vh; font-family: -apple-system, BlinkMacSystemFont, sans-serif; }',
            '.nw-header { text-align: center; margin-bottom: 40px; background-color: #5e72e4; padding: 25px; margin-top: -100px; border-radius: 0 0 15px 15px; }',
            '.nw-main-title { font-size: 35px; font-weight: 600; margin-bottom: 10px; color: #ffffff; letter-spacing: 2px; }',
            '.nw-header p { color: #ffffff; font-size: 16px; opacity: 0.9; margin: 0; letter-spacing: 1px; }',
            '.nw-step { width: 100%; max-width: 750px; text-align: center; animation: slideUp 0.4s ease-out; }',
            '@keyframes slideUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }',
            '.nw-card-group { display: flex; gap: 40px; justify-content: center; flex-wrap: wrap; margin-top: 20px; }',
            '.nw-card { width: 210px; padding: 40px 20px; border-radius: 16px; cursor: pointer; backdrop-filter: blur(12px); border: 1px solid rgba(0,0,0,0.03); box-shadow: 0px 0px 15px 2px #b7b7b7; transition: all 0.25s ease; display: flex; flex-direction: column; align-items: center; box-sizing: border-box; }',
            '.nw-card:hover { transform: translateY(-5px); }',
            '.nw-card[data-mode="router"] { background: rgba(79, 150, 101, 0.85); }',
            '.nw-card[data-mode="pppoe"] { background: rgba(80, 0, 183, 0.85); }',
            '.nw-card[data-mode="lan"] { background: rgba(253, 0, 115, 0.85); }',
            '.nw-badge { width: 54px; height: 54px; line-height: 54px; border-radius: 50%; font-size: 20px; font-weight: bold; margin-bottom: 20px; }',
            '.nw-badge-dhcp { background: #e0f2fe; color: #0284c7; }',
            '.nw-badge-pppoe { background: #f3e8ff; color: #9333ea; }',
            '.nw-badge-bypass { background: #d1fae5; color: #059669; }',
            '.nw-card-title { font-size: 20px; margin: 0 0 10px 0; color: #ffffff; font-weight: 600; }',
            '.nw-card span { font-size: 15px; color: #ffffff; line-height: 1.5; opacity: 0.9; }',
            '.nw-form-area, .nw-confirm-board { max-width: 460px; margin: 0 auto; text-align: left; padding: 40px; border-radius: 16px; background-color: rgba(255, 255, 255, 0.88); box-shadow: 0 10px 30px rgba(0,0,0,0.06); }',
            '.nw-step-title { text-align: center; margin-bottom: 30px; color: #111; font-weight: 600; font-size: 20px; }',
            '.nw-form-area .cbi-value { border: none; padding: 6px 0; display: flex; flex-direction: column; width: 100%; }',
            '.nw-form-area .cbi-value-title { text-align: left; font-weight: 600; color: #222; font-size: 15px; margin-bottom: 10px; }',
            '.nw-form-area input[type="text"], .nw-form-area input[type="password"] { width: 100%; box-sizing: border-box; padding: 12px 16px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 15px; outline: none; background: #f9fafb; color: #333; transition: border-color 0.2s; }',
            '.nw-form-area input:focus { border-color: #3b82f6; }',
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
            '</style>',

            '<div class="nw-wrapper">',
            '  <div class="nw-header">',
            '    <div class="nw-main-title">网 络 设 置 向 导 <span style="font-size:14px; background:#10b981; padding:4px 10px; border-radius:6px; vertical-align:middle;">V1.01 正式版</span></div>',
            '    <p>「 纯净 · 简单 · 零破坏 」的极简网络配置</p>',
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
            '      <div class="nw-card" data-mode="router"><div class="nw-badge nw-badge-dhcp">路由</div>',
            '        <div class="nw-card-title">二级路由模式</div><span>上级网络拨号，本设备作为二级路由。</span></div>',
            '      <div class="nw-card" data-mode="pppoe"><div class="nw-badge nw-badge-pppoe">拨号</div>',
            '        <div class="nw-card-title">宽带拨号 (PPPoE)</div><span>由本设备直接输入账号密码拨号上网。</span></div>',
            '      <div class="nw-card" data-mode="lan"><div class="nw-badge nw-badge-bypass">局网</div>',
            '        <div class="nw-card-title">局域网设置</div><span>修改设备内网 IP，或切换旁路由模式。</span></div>',
            '    </div>',
            
            // 💡 更新：这里更换了背景色 #5e72e4，加了阴影，并且读取中状态的颜色也改为了白色
            '    <div id="current-mode-display" style="margin-top: 45px; background: #5e72e4; padding: 20px 35px; border-radius: 12px; display: inline-block; box-shadow: 0 8px 20px rgba(94, 114, 228, 0.3); text-align: center; min-width: 320px;">',
            '       <div id="current-mode-text" style="color: #fff;"><div class="nw-spinner" style="width:30px; height:30px; border-width:3px; margin: 0 auto; border-top-color: #fff;"></div><div style="margin-top:10px; font-size:15px; font-weight:bold; color:#fff;">读取底层配置中...</div></div>',
            '    </div>',
            '  </div>',

            '  <div id="step-2" class="nw-step" style="display: none;">',
            '    <div class="nw-form-area">',
            '      <div id="fields-router" style="display: none;">',
            '        <div class="nw-step-title">配置 WAN 口网络</div>',
            '        <div style="display: flex; align-items: center; width: 100%; padding: 15px 0;">',
            '          <div style="font-weight: 600; color: #222; font-size: 16px; margin-right: 35px; line-height: 1;">接入方式</div>',
            '          <div class="nw-radio-group">',
            '            <label><input type="radio" name="router_type" value="dhcp" checked> 动态获取 (DHCP)</label>',
            '            <label><input type="radio" name="router_type" value="static"> 静态 IP</label>',
            '          </div>',
            '        </div>',
            '        <div id="router-static-fields" style="display: none; margin-top: 10px; border-top: 1px dashed #e5e7eb; padding-top: 15px;">',
            '          <div class="cbi-value"><label class="cbi-value-title">静态 IP</label><div class="cbi-value-field"><input type="text" id="router-ip" placeholder="例: 192.168.1.2"></div></div>',
            '          <div class="cbi-value"><label class="cbi-value-title">网关</label><div class="cbi-value-field"><input type="text" id="router-gw" placeholder="例: 192.168.1.1"></div></div>',
            '        </div>',
            '      </div>',
            '      <div id="fields-pppoe" style="display: none;">',
            '        <div class="nw-step-title">宽带账号信息</div>',
            '        <div class="cbi-value"><label class="cbi-value-title">宽带账号</label><div class="cbi-value-field"><input type="text" id="pppoe-user" placeholder="请输入运营商提供的宽带账号"></div></div>',
            '        <div class="cbi-value"><label class="cbi-value-title">宽带密码</label><div class="cbi-value-field"><input type="password" id="pppoe-pass" placeholder="请输入宽带密码"></div></div>',
            '      </div>',
            '      <div id="fields-lan" style="display: none;">',
            '        <div class="nw-step-title">配置 LAN 口网络</div>',
            '        <div style="display: flex; align-items: center; justify-content: space-between; padding: 15px 0; border-bottom: 1px solid #f1f5f9; margin-bottom: 15px;">',
            '           <div style="font-weight: 600; color: #222; font-size: 16px;">启用旁路由模式</div>',
            '           <label class="nw-switch"><input type="checkbox" id="lan-bypass-toggle"><span class="nw-slider"></span></label>',
            '        </div>',
            '        <div id="lan-bypass-warning" style="display:none; background: #fef2f2; color: #ef4444; padding: 12px; border-radius: 8px; font-size: 14px; margin-bottom: 15px; border: 1px solid #fecaca; line-height: 1.7; letter-spacing: 1px;">',
            '           <b>旁路由模式开启：</b>本机的 DHCP 服务将被关闭。网关必须填写上级主路由 IP。如果本机IP改变，请确保与局域网同一网段，否则将<b style="color: #dc2626;">无法访问</b>本路由器。',
            '        </div>',
            '        <div id="lan-main-warning" style="background: #f0fdf4; color: #059669; padding: 12px; border-radius: 8px; font-size: 14px; margin-bottom: 15px; border: 1px solid #bbf7d0; line-height: 1.7; letter-spacing: 1px;">',
            '           <b>主路由模式开启：</b>DHCP 服务正常开启。网关留空。如果本机IP改变，请确保与局域网同一网段，否则将<b style="color: #dc2626;">无法访问</b>本路由器。',
            '        </div>',
            '        <div class="cbi-value"><label class="cbi-value-title">本机局域网 IP</label><div class="cbi-value-field"><input type="text" id="lan-ip" placeholder="例: 192.168.1.2"></div></div>',
            '        <div class="cbi-value"><label class="cbi-value-title">局域网网关</label><div class="cbi-value-field"><input type="text" id="lan-gw" placeholder="主路由留空，旁路由必填"></div></div>',
            '      </div>',
            '    </div>',
            '    <div class="nw-actions"><button id="btn-back-1" class="cbi-button cbi-button-reset">返回</button><button id="btn-next-2" class="cbi-button cbi-button-apply">下一步</button></div>',
            '  </div>',
            
            '  <div id="step-3" class="nw-step" style="display: none;">',
            '    <div class="nw-confirm-board">',
            '      <div class="nw-step-title">网 络 配 置 确 认</div>',
            '      <p style="color:#555; text-align:center;">即将应用以下网络配置，请核对：</p>',
            '      <div id="confirm-mode-text" style="color: #fff; background: #3b82f6; padding: 20px; border-radius: 12px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.1); margin-top: 15px;"></div>',
            '      <div style="background-color: #f8fafc; padding: 15px; font-size: 13.5px; margin-top: 20px; border: 1px solid #e2e8f0; line-height: 1.7; color: #475569; border-radius: 12px;">',
            '        <div style="font-weight: bold; color: #0f172a; margin-bottom: 8px; font-size: 14.5px;">配置生效说明：</div>',
            '        <div style="display: flex; gap: 8px;"><span style="color:#3b82f6;">•</span> <span>点击确认后，底层网络将自动重置并应用新配置。</span></div>',
            '        <div style="display: flex; gap: 8px;"><span style="color:#10b981;">•</span> <span>若修改了局域网 IP，系统将在几秒后自动为您跳转。</span></div>',
            '      </div>',
            '    </div>',
            '    <div class="nw-actions"><button id="btn-back-2" class="cbi-button cbi-button-reset">返回</button><button id="btn-apply" class="cbi-button cbi-button-apply">确认应用</button></div>',
            '  </div>',
            '</div>'
        ].join('');

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

        Promise.all([
            uci.load('network'),
            uci.load('dhcp').catch(function(){}) 
        ]).then(function() {
            var wProto = String(uci.get('network', 'wan', 'proto') || '').trim().toLowerCase();
            var wIp = String(uci.get('network', 'wan', 'ipaddr') || '未获取').trim();
            var wGw = String(uci.get('network', 'wan', 'gateway') || '未获取').trim();
            
            var lIp = String(uci.get('network', 'lan', 'ipaddr') || window.location.hostname).trim();
            var lGw = String(uci.get('network', 'lan', 'gateway') || '未设置').trim();
            var lIgnore = String(uci.get('dhcp', 'lan', 'ignore') || '').trim();
            var isBypass = (lIgnore === '1' || lIgnore === 'true' || lIgnore === 'on' || lIgnore === 'yes');

            var sTitle = "";
            var sDetails = "";

            if (isBypass) {
                sTitle = "旁路由模式";
                sDetails = "本机 IP: <span class='nw-hl'>" + lIp + "</span>&nbsp;&nbsp;&nbsp;&nbsp;网关: <span class='nw-hl'>" + lGw + "</span>";
            } else if (wProto === 'pppoe') {
                var pUser = String(uci.get('network', 'wan', 'username') || '未设置').trim();
                sTitle = "主路由 (宽带拨号)";
                sDetails = "局域网 IP: <span class='nw-hl'>" + lIp + "</span>&nbsp;&nbsp;&nbsp;&nbsp;拨号账号: <span class='nw-hl'>" + pUser + "</span>";
            } else if (wProto === 'static') {
                sTitle = "二级路由 (静态 IP)";
                sDetails = "局域网: <span class='nw-hl'>" + lIp + "</span>&nbsp;&nbsp;&nbsp;&nbsp;WAN IP: <span class='nw-hl'>" + wIp + "</span>&nbsp;&nbsp;&nbsp;&nbsp;网关: <span class='nw-hl'>" + wGw + "</span>";
            } else if (wProto === 'dhcp') {
                sTitle = "二级路由 (动态 DHCP)";
                sDetails = "局域网 IP: <span class='nw-hl'>" + lIp + "</span>&nbsp;&nbsp;&nbsp;&nbsp;WAN 状态: <span class='nw-hl'>自动获取中...</span>";
            } else {
                sTitle = "局域网模式";
                sDetails = "局域网 IP: <span class='nw-hl'>" + lIp + "</span>&nbsp;&nbsp;&nbsp;&nbsp;DHCP 服务: <span class='nw-hl'>正常开启</span>";
            }

            if (modeTextEl) {
                // 💡 更新：这里将子标题的字体改为 15px, 粗体，且颜色提亮为 #ffffff
                modeTextEl.innerHTML = "<div style='font-size:17px; font-weight:600; margin-bottom:10px; color:#ffffff;'>" + sTitle + "</div>" +
                                       "<div style='font-size:15px; font-weight:bold; color:#ffffff; font-family:monospace; letter-spacing:0.5px;'>" + sDetails + "</div>";
            }
        }).catch(function() {
            if (modeTextEl) modeTextEl.innerHTML = "<div style='color:#ef4444; font-weight:bold;'>无法读取系统底层配置</div>";
        });

        function calculateNetmask(ip) { return '255.255.255.0'; }

        function isSameSubnet(ip1, ip2) {
            if (!ip1 || !ip2) return false;
            var p1 = ip1.split('.');
            var p2 = ip2.split('.');
            if (p1.length === 4 && p2.length === 4) {
                return p1[0] === p2[0] && p1[1] === p2[1] && p1[2] === p2[2];
            }
            return false;
        }

        function openModal(options) {
            var m = container.querySelector('#nw-global-modal');
            var title = container.querySelector('#nw-global-title');
            var msg = container.querySelector('#nw-global-msg');
            var spinner = container.querySelector('#nw-global-spinner');
            var btnOk = container.querySelector('#nw-global-btn-ok');
            var btnCancel = container.querySelector('#nw-global-btn-cancel');
            var btnWrap = container.querySelector('#nw-global-btn-wrap');
            
            title.innerHTML = options.title || '';
            msg.innerHTML = options.msg || '';
            spinner.style.display = options.spin ? 'block' : 'none';
            btnWrap.style.display = (options.okText || options.cancelText) ? 'flex' : 'none';
            
            if (options.okText) { 
                btnOk.style.display = 'block'; 
                btnOk.innerText = options.okText;
                btnOk.className = options.isDanger ? 'nw-modal-btn-danger' : 'nw-modal-btn-ok';
                btnOk.onclick = function() {
                    if (options.onOk) options.onOk();
                    else m.style.display = 'none';
                }; 
            } else { btnOk.style.display = 'none'; }
            
            if (options.cancelText) { 
                btnCancel.style.display = 'block'; 
                btnCancel.innerText = options.cancelText; 
                btnCancel.onclick = function() {
                    if (options.onCancel) options.onCancel();
                    else m.style.display = 'none';
                }; 
            } else { btnCancel.style.display = 'none'; }
            
            m.style.display = 'flex';
        }

        function closeModal() {
            var m = container.querySelector('#nw-global-modal');
            if (m) m.style.display = 'none';
        }
        
        function returnToStep1() {
            closeModal();
            step3.style.display = 'none';
            step2.style.display = 'none';
            step1.style.display = 'block';
        }

        var rRadios = container.querySelectorAll('input[name="router_type"]');
        rRadios.forEach(function(r) {
            r.addEventListener('change', function() {
                container.querySelector('#router-static-fields').style.display = (this.value === 'static') ? 'block' : 'none';
            });
        });

        var bypassToggle = container.querySelector('#lan-bypass-toggle');
        bypassToggle.addEventListener('change', function() {
            var isOn = this.checked;
            container.querySelector('#lan-bypass-warning').style.display = isOn ? 'block' : 'none';
            container.querySelector('#lan-main-warning').style.display = isOn ? 'none' : 'block';
        });

        container.querySelectorAll('.nw-card').forEach(function (card) {
            card.addEventListener('click', function () {
                selectedMode = this.getAttribute('data-mode');
                step1.style.display = 'none';
                container.querySelector('#fields-router').style.display = (selectedMode === 'router') ? 'block' : 'none';
                container.querySelector('#fields-pppoe').style.display = (selectedMode === 'pppoe') ? 'block' : 'none';
                container.querySelector('#fields-lan').style.display = (selectedMode === 'lan') ? 'block' : 'none';
                step2.style.display = 'block';
            });
        });

        container.querySelector('#btn-back-1').addEventListener('click', function () { step2.style.display = 'none'; step1.style.display = 'block'; });
        container.querySelector('#btn-back-2').addEventListener('click', function () { step3.style.display = 'none'; step2.style.display = 'block'; });

        container.querySelector('#btn-next-2').addEventListener('click', function () {
            var rType = container.querySelector('input[name="router_type"]:checked').value;
            var targetIp = '', targetGw = '', isBypass = false;

            if (selectedMode === 'lan') {
                targetIp = container.querySelector('#lan-ip').value.replace(/[^0-9\.]/g, '');
                targetGw = container.querySelector('#lan-gw').value.replace(/[^0-9\.]/g, '');
                isBypass = bypassToggle.checked;
                
                if (!targetIp) { openModal({title:'信息不完整', msg:'本机 IP 不能为空。', okText:'返回修改'}); return; }
                
                if (isBypass) {
                    if (!targetGw) { openModal({title:'逻辑错误', msg:'开启【旁路由模式】时，必须填写上级主路由的【网关 IP】。', okText:'返回修改'}); return; }
                    if (targetIp === targetGw) { openModal({title:'致命错误', msg:'旁路由的【本机 IP】绝不能与【网关】相同，否则会导致局域网死循环！', okText:'返回修改'}); return; }
                    if (!isSameSubnet(targetIp, targetGw)) { openModal({title:'网段错误', msg:'旁路由的【本机 IP】必须与【网关】处于同一网段！<br>例如: IP 192.168.1.2，网关必须是 192.168.1.x。', okText:'返回修改'}); return; }
                }
                
            } else if (selectedMode === 'router' && rType === 'static') {
                targetIp = container.querySelector('#router-ip').value.replace(/[^0-9\.]/g, '');
                targetGw = container.querySelector('#router-gw').value.replace(/[^0-9\.]/g, '');
                
                if (!targetIp || !targetGw) { openModal({title:'信息不完整', msg:'WAN 口静态 IP 和网关均不能为空。', okText:'返回修改'}); return; }
                if (targetIp === targetGw) { openModal({title:'致命错误', msg:'WAN 口的【静态 IP】绝不能与上级【网关】相同！', okText:'返回修改'}); return; }
                if (!isSameSubnet(targetIp, targetGw)) { openModal({title:'网段错误', msg:'WAN 口的【静态 IP】必须与上级【网关】处于同一网段！<br>例如：网关是 192.168.1.1，那静态 IP 必须填写 192.168.1.x。', okText:'返回修改'}); return; }
                
            } else if (selectedMode === 'pppoe') {
                if (!(container.querySelector('#pppoe-user').value || '').trim() || !(container.querySelector('#pppoe-pass').value || '').trim()) { 
                    openModal({title: '信息不完整', msg: '宽带账号和密码均不能为空。', okText: '返回修改'}); return; 
                }
            }

            uci.unload('network');
            uci.unload('dhcp');

            Promise.all([
                uci.load('network'),
                uci.load('dhcp').catch(function(){}) 
            ]).then(function() {
                var wIp = String(uci.get('network', 'wan', 'ipaddr') || '').replace(/[^0-9\.]/g, '');
                var wProto = String(uci.get('network', 'wan', 'proto') || '').trim();
                var lIp = String(uci.get('network', 'lan', 'ipaddr') || '').replace(/[^0-9\.]/g, '');
                if(!lIp) lIp = window.location.hostname;

                var uniqueIps = [];
                var interfaces = uci.sections('network', 'interface');
                for (var i = 0; i < interfaces.length; i++) {
                    var ip = String(interfaces[i].ipaddr || '').replace(/[^0-9\.]/g, '');
                    if (ip && ip !== '127.0.0.1' && uniqueIps.indexOf(ip) === -1) {
                        uniqueIps.push(ip);
                    }
                }

                var lDhcp = String(uci.get('dhcp', 'lan', 'ignore') || '').trim();
                if (lDhcp === '1' || lDhcp === 'true' || lDhcp === 'on' || lDhcp === 'yes') lDhcp = '1'; else lDhcp = '0';
                var bypassStr = isBypass ? '1' : '0';

                if ((selectedMode === 'lan' && targetIp === lIp && targetGw === String(uci.get('network', 'lan', 'gateway') || '') && bypassStr === lDhcp) || 
                    (selectedMode === 'router' && rType === 'static' && targetIp === wIp && targetGw === String(uci.get('network', 'wan', 'gateway') || '')) ||
                    (selectedMode === 'router' && rType === 'dhcp' && wProto === 'dhcp')) {
                     openModal({title:'无需修改', msg:'您的设置与当前路由器配置完全一致。', okText:'退出首页', onOk: returnToStep1 }); 
                     return;
                }

                var otherIps = uniqueIps.filter(function(ip) {
                    if (selectedMode === 'lan' && ip === lIp) return false;
                    if (selectedMode === 'router' && rType === 'static' && ip === wIp) return false;
                    return true;
                });

                var conflictMsg = '';
                for (var k = 0; k < otherIps.length; k++) {
                    var existIp = otherIps[k];
                    if (targetIp === existIp) {
                        conflictMsg = '您填写的 IP ('+ targetIp +') 与路由器上的其他物理网口完全冲突！<br>请重新修改。';
                        break;
                    }
                    if (isSameSubnet(targetIp, existIp)) {
                        conflictMsg = '您填写的 IP 与路由器上的其他网口 (' + existIp + ') 处于同一网段 (' + existIp.substring(0, existIp.lastIndexOf('.')) + '.x)！<br>这会导致底层的路由死循环，请更换网段。';
                        break;
                    }
                }

                if (conflictMsg) { 
                    openModal({title: '网段冲突拦截', msg: conflictMsg, okText: '返回修改'}); return; 
                }

                var buildDetailHtml = function(title, pairs) {
                    var h = "<div style='text-align:center; font-size:18px; margin-bottom:15px; text-shadow: 0 1px 2px rgba(0,0,0,0.2);'>" + title + "</div>";
                    h += "<div style='background:rgba(0,0,0,0.15); border-radius:8px; padding:10px 15px; font-size:14.5px; text-align:left; font-weight:normal; line-height:1.8;'>";
                    for (var i=0; i < pairs.length; i++) {
                        h += "<div style='display:flex; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,0.1); padding:5px 0;'>" + 
                             "<span style='opacity:0.85;'>" + pairs[i][0] + "</span>" + 
                             "<span style='font-family:monospace; font-size:15px;'>" + pairs[i][1] + "</span></div>";
                    }
                    h += "</div>";
                    return h;
                };

                var goStep3 = function() {
                    var modeText = "";
                    if (selectedMode === 'lan') {
                        if (isBypass) {
                            modeText = buildDetailHtml("局域网 - 旁路由模式", [
                                ["设备 IP", targetIp],
                                ["子网掩码", "255.255.255.0"],
                                ["上级网关", targetGw],
                                ["DHCP 服务", "已关闭"]
                            ]);
                        } else {
                            modeText = buildDetailHtml("局域网 - 主路由模式", [
                                ["设备 IP", targetIp],
                                ["子网掩码", "255.255.255.0"],
                                ["本机网关", targetGw ? targetGw : "未填写 (推荐)"],
                                ["DHCP 服务", "正常开启"]
                            ]);
                        }
                    } else if (selectedMode === 'router') {
                        if (rType === 'static') {
                            modeText = buildDetailHtml("二级路由 (静态 IP)", [
                                ["WAN IP", targetIp],
                                ["子网掩码", "255.255.255.0"],
                                ["上级网关", targetGw]
                            ]);
                        } else {
                            modeText = buildDetailHtml("二级路由 (动态 DHCP)", [
                                ["获取方式", "自动获取 (DHCP)"],
                                ["IP及网关", "由上级路由自动分配"]
                            ]);
                        }
                    } else if (selectedMode === 'pppoe') {
                        var user = container.querySelector('#pppoe-user').value;
                        modeText = buildDetailHtml("宽带拨号 (PPPoE)", [
                            ["宽带账号", user],
                            ["宽带密码", "******"]
                        ]);
                    }
                    
                    confirmText.innerHTML = modeText;
                    step2.style.display = 'none'; 
                    step3.style.display = 'block';
                };

                if (selectedMode === 'lan' && !isBypass && targetGw !== '') {
                    openModal({
                        title: '主路由配置警告', 
                        msg: '检测到您选择了【主路由模式】，却强行填写了【网关】。<br><br><b>在标准主路由下，网关必须留空。</b>乱填网关会导致设备无法正常分发网络导致全屋断网！<br><br>您确定要这么做吗？', 
                        cancelText: '返回修改', onCancel: closeModal, 
                        okText: '强行应用', isDanger: true, onOk: function() { closeModal(); goStep3(); }
                    });
                    return;
                }

                goStep3();

            }).catch(function() {
                openModal({title:'状态读取异常', msg:'无法读取路由器底层配置，请刷新页面后重试。', okText:'好的'});
            });
        });

        container.querySelector('#btn-apply').addEventListener('click', function () {
            var actualMode = selectedMode, arg1 = '', arg2 = '', arg3 = '', arg4 = '';
            if (selectedMode === 'lan') {
                arg1 = container.querySelector('#lan-ip').value.replace(/[^0-9\.]/g, '');
                arg2 = container.querySelector('#lan-gw').value.replace(/[^0-9\.]/g, '');
                arg3 = calculateNetmask(arg1);
                arg4 = container.querySelector('#lan-bypass-toggle').checked ? '1' : '0';
            } else if (selectedMode === 'router') {
                var rType = container.querySelector('input[name="router_type"]:checked').value;
                actualMode = (rType === 'dhcp') ? 'wan_dhcp' : 'wan_static';
                if(rType === 'static') {
                    arg1 = container.querySelector('#router-ip').value.replace(/[^0-9\.]/g, '');
                    arg2 = container.querySelector('#router-gw').value.replace(/[^0-9\.]/g, '');
                    arg3 = calculateNetmask(arg1);
                }
            } else if (selectedMode === 'pppoe') {
                arg1 = container.querySelector('#pppoe-user').value;
                arg2 = container.querySelector('#pppoe-pass').value;
            }

            openModal({title:'正在下发指令', msg:'正在请求路由器写入底层配置...', spin:true});
            
            var startTime = Date.now();
            var rpcDone = false;
            
            var handleSuccess = function() {
                if (selectedMode === 'lan' && arg1) {
                    openModal({
                        title: '配置已生效', 
                        msg: '正在为您跳转至新管理地址：<br><b>' + arg1 + '</b>', 
                        spin: true
                    });
                    setTimeout(function() { window.location.href = 'http://' + arg1; }, 5000);
                } else {
                    openModal({title: '配置已生效', msg: '网络设置已成功更新。', okText: '完成', onOk: function(){ location.reload(); }});
                }
            };
            
            callNetSetup(actualMode, arg1, arg2, arg3, arg4).then(function() {
                rpcDone = true;
                handleSuccess();
            }).catch(function(e){
                var timePassed = Date.now() - startTime;
                if (timePassed < 1500) {
                    rpcDone = true;
                    openModal({
                        title: '❌ 写入失败', 
                        msg: '底层调用被拒绝！可能是系统插件权限 (ACL) 配置有误，请重新安装该插件或重新登录后台。<br><br><span style="font-size:12px; color:#888;">系统错误码: ' + (e.message || 'Permission Denied') + '</span>', 
                        okText: '关闭',
                        isDanger: true
                    });
                } else {
                    rpcDone = true;
                    handleSuccess();
                }
            });

            setTimeout(function() {
                if (!rpcDone) {
                    handleSuccess();
                }
            }, 4000);
        });
    }
});
