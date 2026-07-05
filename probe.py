# ==============================================================
# 📡 IPv6 Watchdog - (VPS Edition) | 📡 IPv6 深度保活 - (VPS 版)
# ==============================================================
# 【环境要求】
# 1. 极致轻量：使用 Linux 自带的 Python 3（当然也可以使用 Node.js、Docker 或 Nginx 等庞大环境）。
# 2. VPS 必须具备 IPv6 网络出口能力。
#
# 【原生守护】
# 采用 systemd 进程守护，开机自启、崩溃秒级自愈。
#
# 【极致轻量部署步骤】
# 1. 保存文件：
#    将此代码保存到 VPS 的 /root/probe.py
#
# 2. 创建守护服务：
#    在终端执行命令: nano /etc/systemd/system/netwiz-probe.service
#    将下方虚线内的内容贴入并保存 (Ctrl+O, Enter, Ctrl+X)：
#    ----------------------------------
#    [Unit]
#    Description=Netwiz IPv6 Probe Service
#    After=network.target
#
#    [Service]
#    Type=simple
#    User=root
#    ExecStart=/usr/bin/python3 /root/probe.py
#    Restart=always
#    RestartSec=3
#
#    [Install]
#    WantedBy=multi-user.target
#    ----------------------------------
#
# 3. 激活并启动探针（依次执行）：
#    systemctl daemon-reload
#    systemctl enable netwiz-probe
#    systemctl start netwiz-probe
#
# 4. 插件填写：
#    在 Netwiz 高级实用设置的 <📡 IPv6 深度保活> 设置中，直接填写：http://您的VPS_IP:18080
#    (注：请确保 VPS 防火墙与云服务商安全组已放行 18080 端口)
#
# 【常用管理命令】
# 查看状态: systemctl status netwiz-probe
# 重启探针: systemctl restart netwiz-probe
# 实时日志: journalctl -u netwiz-probe -f
# ============================ 结束 ============================

# 基础配置 (可随意修改)
LISTEN_PORT = 18080  # 绑定您要求的端口，可随时更改

import urllib.request
import urllib.error
import urllib.parse
import socket
import re
from http.server import HTTPServer, BaseHTTPRequestHandler

# 强制绑定双栈 (支持 IPv6 和 IPv4)
class HTTPServerV6(HTTPServer):
    address_family = socket.AF_INET6
    allow_reuse_address = True  # 允许端口复用，防止重启时报 Address already in use 错误

class ProbeHandler(BaseHTTPRequestHandler):
    # 屏蔽默认的终端日志输出，保持清爽
    def log_message(self, format, *args):
        pass

    def do_GET(self):
        # 统一返回 200 状态码和纯文本
        self.send_response(200)
        self.send_header('Content-type', 'text/plain')
        self.end_headers()

        # 检测到当前系统没有 IPv6 网络出口，返回提示
        try:
            # 创建 UDP 套接字，探测本地是否有 IPv6 路由
            s = socket.socket(socket.AF_INET6, socket.SOCK_DGRAM)
            s.connect(('2404:6800:4005:805::200e', 80))
            s.close()
        except Exception:
            self.wfile.write(b"FAIL_VPS_NO_IPV6_SUPPORT")
            return

        # 1. 解码 URL (防止 IPv6 的方括号被浏览器转义为 %5B 和 %5D)
        decoded_path = urllib.parse.unquote(self.path)

        # 2. 解析探针目标: 直接剥离掉最前面的 '/' 即可，不再需要任何前缀
        target = decoded_path.lstrip('/')

        # 没带目标时，返回提示
        if not target:
            self.wfile.write(b"MISSING_TARGET")
            return

        # 3. 协议补全 (默认补上 http://)
        if not target.startswith('http://') and not target.startswith('https://'):
            target = 'http://' + target

        # 4. 提取 Hostname 
        parsed_url = urllib.parse.urlparse(target)
        hostname = parsed_url.hostname or ''

        # 5. 终极防呆：拦截私有局域网 IP
        private_ip_regex = r'^(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.|127\.|0\.|\[?fd[0-9a-f]{2}:)'
        if re.match(private_ip_regex, hostname, re.I):
            self.wfile.write(b"FAIL_PRIVATE_IP_BLOCKED")
            return

        # 6. 发起真实探测
        try:
            req = urllib.request.Request(target)
            # 设定 6 秒超时 (与 CF Worker 代码保持一致)
            with urllib.request.urlopen(req, timeout=6) as res:
                self.wfile.write(b"OK")
        except urllib.error.HTTPError as e:
            # 收到密码拦截 (401/403) 也视为网络畅通
            if e.code in [401, 403]:
                self.wfile.write(b"OK")
            else:
                self.wfile.write(f"FAIL_HTTP_{e.code}".encode('utf-8'))
        except Exception as e:
            # 连接超时、拒绝连接、无法解析等网络层错误
            self.wfile.write(f"FAIL_NETWORK_VPS: {str(e)}".encode('utf-8'))

if __name__ == '__main__':
    print(f"Netwiz Probe 正在运行 (监听端口: {LISTEN_PORT})...")
    # 启动监听
    server = HTTPServerV6(('::', LISTEN_PORT), ProbeHandler)
    server.serve_forever()
