'use strict';
'require view';
'require dom';
'require rpc';
'require ui';

var callNetSetup = rpc.declare({
    object: 'netwiz',
    method: 'set_network',
    params: ['mode', 'arg1', 'arg2'],
    expect: { result: 0 }
});

return view.extend({
    render: function () {
        var container = dom.create('div', { class: 'cbi-map', id: 'netwiz-container' });

        var htmlTemplate = [
            '<style>',
            '.nw-wrapper { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 55vh; padding-bottom: 10vh; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }',
            '.nw-header { text-align: center; margin-bottom: 40px; background-color: #5e72e4; padding: 25px; margin-top: -35px; border-bottom-left-radius: 15px; border-bottom-right-radius: 15px;}',
            /* 替换原生 h2，免疫主题干扰 */
            '.nw-main-title { font-size: 45px; font-weight: 600; margin-bottom: 10px; color: #ffffff; letter-spacing: 1px; }',
            '.nw-header p { color: #ffffff; font-size: 18px; }',
            '.nw-step { width: 100%; max-width: 750px; text-align: center; animation: slideUp 0.4s ease-out; }',
            '@keyframes slideUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }',
            '.nw-card-group { display: flex; gap: 40px; justify-content: center; flex-wrap: wrap; margin-top: 20px; }',

            /* 卡片基础样式：保留毛玻璃 */
            '.nw-card { width: 210px; padding: 40px 20px; border-radius: 16px; cursor: pointer; backdrop-filter: blur(12px); border: 1px solid rgba(0, 0, 0, 0.03); box-shadow: 0px 0px 15px 2px #b7b7b7; transition: all 0.25s ease; display: flex; flex-direction: column; align-items: center; box-sizing: border-box; }',

            /* 第一步彩色框恢复：三种独立半透明底色 */
            '.nw-card[data-mode="dhcp"] { background: rgba(079, 150, 101, 0.85); }',
            '.nw-card[data-mode="dhcp"]:hover { transform: translateY(-5px);  box-shadow: 0 12px 30px rgba(0, 153, 255, 0.15); border-color: rgba(0, 153, 255, 0.3); }',

            '.nw-card[data-mode="pppoe"] { background: rgba(80, 0, 183, 0.85); }',
            '.nw-card[data-mode="pppoe"]:hover { transform: translateY(-5px); box-shadow: 0 12px 30px rgba(153, 102, 255, 0.15); border-color: rgba(153, 102, 255, 0.3); }',

            '.nw-card[data-mode="bypass"] { background: rgba(253, 0, 115, 0.85); }',
            '.nw-card[data-mode="bypass"]:hover { transform: translateY(-5px); box-shadow: 0 12px 30px rgba(0, 204, 153, 0.15); border-color: rgba(0, 204, 153, 0.3); }',

            /* 无乱码徽标 */
            '.nw-badge { width: 54px; height: 54px; line-height: 54px; border-radius: 50%; font-size: 20px; font-weight: bold; margin-bottom: 20px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }',
            '.nw-badge-dhcp { background: #e0f2fe; color: #0284c7; }',
            '.nw-badge-pppoe { background: #f3e8ff; color: #9333ea; }',
            '.nw-badge-bypass { background: #d1fae5; color: #059669; }',

            /* 替换原生 h3，免疫主题干扰 */
            '.nw-card-title { font-size: 20px; margin: 0 0 10px 0; color: #ffffff; font-weight: 600; }',
            '.nw-card span { font-size: 16px; color: #ffffff; line-height: 1.5; }',

            /* 第二、三步：恢复为清爽的浅色半透明背景 */
            '.nw-form-area, .nw-confirm-board { max-width: 460px; margin: 0 auto; text-align: left; padding: 40px; border-radius: 16px; background-color: rgba(255, 255, 255, 0.88); backdrop-filter: blur(15px); box-shadow: 0 10px 30px rgba(0,0,0,0.06); border: 1px solid rgba(0, 0, 0, 0.04); }',

            /* 表单与确认框标题 */
            '.nw-step-title { text-align: center; margin-bottom: 30px; color: #111; font-weight: 600; font-size: 20px; background: transparent !important; padding: 0 !important; }',

            /* 表单左侧对齐与浅色模式输入框 */
            '.nw-form-area .cbi-value { border: none; padding: 12px 0; display: flex; flex-direction: column; align-items: flex-start; width: 100%; background: transparent; }',
            '.nw-form-area .cbi-value-title { text-align: left; font-weight: 600; color: #222; font-size: 16px; margin-bottom: 10px; letter-spacing: 0.5px; }',
            '.nw-form-area .cbi-value-field { width: 100%; }',

            '.nw-form-area input[type="text"], .nw-form-area input[type="password"] { width: 100%; box-sizing: border-box; padding: 12px 16px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 15px; outline: none; transition: all 0.25s ease; background: #f9fafb; color: #333; }',
            '.nw-form-area input[type="text"]:focus, .nw-form-area input[type="password"]:focus { border-color: #3b82f6; background: #fff; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15); }',
            '.nw-form-area input::placeholder { color: #9ca3af; }',

            /* 确认页文本 */
            '.nw-confirm-board p { font-size: 15px; line-height: 1.6; color: #444; }',
            '.nw-highlight { color: #fff; font-weight: bold; font-size: 18px; margin: 20px 0; text-align: center; background: #3b82f6; padding: 12px; border-radius: 10px; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3); border: none; }',

            /* 按钮恢复浅色风格 */
            '.nw-actions { margin-top: 35px; display: flex; justify-content: center; gap: 15px; }',
            '.nw-actions .cbi-button { border-radius: 8px; padding: 10px 24px; font-weight: 500; font-size: 15px; cursor: pointer; transition: all 0.2s; }',
            '.nw-actions .cbi-button-apply { background: #10b981; border: none; color: white; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.2); }',
            '.nw-actions .cbi-button-apply:hover { background: #059669; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(16, 185, 129, 0.3); }',
            '.nw-actions .cbi-button-reset { background: #f5365c; color: #fffff; border: 1px solid #e5e7eb; }',
            '.nw-actions .cbi-button-reset:hover { background: #e5e7eb; color: #000000;}',
            '</style>',
            '<div class="nw-wrapper">',
            '  <div class="nw-header">',
            '    <div class="nw-main-title">网 络 设 置 向 导</div>',
            '    <p>纯净 · 安全 · 零破坏 —— 精准修改底层配置</p>',
            '  </div>',
            '  <div id="step-1" class="nw-step">',
            '    <div class="nw-card-group">',
            '      <div class="nw-card" data-mode="dhcp"><div class="nw-badge nw-badge-dhcp">IP</div><div class="nw-card-title">动态 IP (DHCP)</div><span>适用于光猫已经拨号，路由器作为二级路由接入的场景。</span></div>',
            '      <div class="nw-card" data-mode="pppoe"><div class="nw-badge nw-badge-pppoe">拨号</div><div class="nw-card-title">宽带拨号 (PPPoE)</div><span>适用于光猫为桥接模式，由本路由器直接进行拨号上网。</span></div>',
            '      <div class="nw-card" data-mode="bypass"><div class="nw-badge nw-badge-bypass">旁路</div><div class="nw-card-title">旁路由模式</div><span>将本设备作为局域网内的辅助网关，不改变现有网络拓扑。</span></div>',
            '    </div>',
            '  </div>',
            '  <div id="step-2" class="nw-step" style="display: none;">',
            '    <div class="nw-form-area">',
            '      <div id="fields-pppoe" style="display: none;">',
            '        <div class="nw-step-title">请输入宽带账号信息</div>',
            '        <div class="cbi-value"><label class="cbi-value-title">宽带账号</label><div class="cbi-value-field"><input type="text" id="pppoe-user" class="cbi-input-text" placeholder="请输入运营商提供的账号"></div></div>',
            '        <div class="cbi-value"><label class="cbi-value-title">宽带密码</label><div class="cbi-value-field"><input type="password" id="pppoe-pass" class="cbi-input-password" placeholder="请输入密码"></div></div>',
            '      </div>',
            '      <div id="fields-bypass" style="display: none;">',
            '        <div class="nw-step-title">配置局域网参数</div>',
            '        <div class="cbi-value"><label class="cbi-value-title">本级静态 IP</label><div class="cbi-value-field"><input type="text" id="bypass-ip" class="cbi-input-text" placeholder="例: 192.168.1.2"></div></div>',
            '        <div class="cbi-value"><label class="cbi-value-title">主路由网关</label><div class="cbi-value-field"><input type="text" id="bypass-gw" class="cbi-input-text" placeholder="例: 192.168.1.1"></div></div>',
            '      </div>',
            '    </div>',
            '    <div class="nw-actions"><button id="btn-back-1" class="cbi-button cbi-button-reset">返回重选</button><button id="btn-next-2" class="cbi-button cbi-button-action">下一步</button></div>',
            '  </div>',
            '  <div id="step-3" class="nw-step" style="display: none;">',
            '    <div class="nw-confirm-board">',
            '      <div class="nw-step-title">配置确认</div>',
            '      <p>即将把联网模式切换为：</p>',
            '      <div id="confirm-mode-text" class="nw-highlight">未知模式</div>',
            '      <p style="color:#666; font-size: 13px; margin-top: 15px; border-top: 1px solid #eaeaea; padding-top: 15px;">安全提示： 保存后仅覆盖接口协议，物理网卡绑定配置将被完全保留。网络会短暂重启。</p>',
            '    </div>',
            '    <div class="nw-actions"><button id="btn-back-2" class="cbi-button cbi-button-reset">返回修改</button><button id="btn-apply" class="cbi-button cbi-button-apply">确认并写入</button></div>',
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
        var selectedMode = '';

        var cards = container.querySelectorAll('.nw-card');
        cards.forEach(function (card) {
            card.addEventListener('click', function () {
                selectedMode = this.getAttribute('data-mode');
                step1.style.display = 'none';

                if (selectedMode === 'dhcp') {
                    confirmText.innerText = "动态获取 (DHCP)";
                    step3.style.display = 'block';
                } else {
                    container.querySelector('#fields-pppoe').style.display = (selectedMode === 'pppoe') ? 'block' : 'none';
                    container.querySelector('#fields-bypass').style.display = (selectedMode === 'bypass') ? 'block' : 'none';
                    step2.style.display = 'block';
                }
            });
        });

        container.querySelector('#btn-back-1').addEventListener('click', function () {
            step2.style.display = 'none'; step1.style.display = 'block';
        });

        container.querySelector('#btn-next-2').addEventListener('click', function () {
            if (selectedMode === 'pppoe') confirmText.innerText = "宽带拨号 (PPPoE)";
            if (selectedMode === 'bypass') confirmText.innerText = "旁路由接入";
            step2.style.display = 'none'; step3.style.display = 'block';
        });

        container.querySelector('#btn-back-2').addEventListener('click', function () {
            step3.style.display = 'none';
            if (selectedMode === 'dhcp') {
                step1.style.display = 'block';
            } else {
                step2.style.display = 'block';
            }
        });

        container.querySelector('#btn-apply').addEventListener('click', function () {
            var arg1 = '', arg2 = '';
            if (selectedMode === 'pppoe') {
                arg1 = container.querySelector('#pppoe-user').value;
                arg2 = container.querySelector('#pppoe-pass').value;
                if (!arg1 || !arg2) { ui.addNotification(null, dom.create('p', '账号密码不能为空'), 'danger'); return; }
            } else if (selectedMode === 'bypass') {
                arg1 = container.querySelector('#bypass-ip').value;
                arg2 = container.querySelector('#bypass-gw').value;
                if (!arg1 || !arg2) { ui.addNotification(null, dom.create('p', 'IP和网关不能为空'), 'danger'); return; }
            }

            ui.showModal('配置下发中', [dom.create('p', { class: 'spinning' }, '底层配置写入中，请勿断电...')]);

            callNetSetup(selectedMode, arg1, arg2).then(function () {
                ui.hideModal();
                ui.addNotification(null, dom.create('p', '配置成功！若改了网段，请重新获取IP访问。'), 'success');
            }).catch(function (e) {
                ui.hideModal();
                ui.addNotification(null, dom.create('p', '出错: ' + e.message), 'danger');
            });
        });
    }
});
