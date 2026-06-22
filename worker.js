/*

# 📡 Netwiz Probe (IPv6 保活探针) - Cloudflare 边缘节点版

这是一个专为路由器 IPv6 直联自愈机制设计的**无服务器（Serverless）网络探针**。依托于 Cloudflare 强大的全球边缘网络，您可以将它零成本、免配置地部署在云端。
配合路由器的 Netwiz 插件，实现企业级的 IPv6 自动保活与故障自愈。

## ✨ 核心特性

- **🆓 永久免费**：基于 Cloudflare Workers 托管，每天提供高达 10 万次的免费探测额度，足够家庭或正常用户使用。
- **⚡ 原生 IPv6 极速响应**：利用 Cloudflare 全球最庞大的 IPv6 骨干网进行精准连接。
- **🛡️ 隐私与防滥用**：纯净探测逻辑，不收集任何用户隐私数据，内置严格的局域网 IP 防护（SSRF 拦截），杜绝被恶意扫描的风险。

---

## 🚀 极简部署指南 (3 分钟上线)

无需复杂的本地环境，通过浏览器即可完成专属探针的搭建。

### 第一步：获取探针源码
复制本项目中的 `worker.js` 里的全部代码，准备在下一步使用。

### 第二步：一键部署到 Cloudflare
1. 访问 **[Cloudflare 控制台](https://dash.cloudflare.com/)** 并登录您的账号。
2. 在左侧导航栏找到并点击 **`Workers 和 Pages`**。
3. 点击 **`创建应用程序 (Create application)`**，然后点击 **`创建 Worker (Create Worker)`**。
4. 为您的探针起一个名字（例如：`netwiz-probe`），点击 **`部署 (Deploy)`**。
5. 部署成功后，点击 **`编辑代码 (Edit code)`**。
6. 将原来输入框里默认的代码全部删除，**粘贴**您在第一步复制的探针源码。
7. 点击右上角的 **`保存并部署 (Save and deploy)`**。
8. 记录下 Cloudflare 为您分配的专属探针域名（例如：`netwiz-probe.您的用户名.workers.dev`）。

### 第三步：配置路由器后台
1. 复制刚刚获取的**探针基础域名**（例如：`netwiz-probe.xxxx.workers.dev`）。
2. 登录您的路由器后台，进入 **Netwiz 插件设置**高级面板。
3. 开启 **“IPv6 保活探针 (IPv6 Watchdog)”** 功能。
4. 将复制的域名直接粘贴到 **“探测源目标网址 (Probe Target URL)”** 输入框中。
5. 点击**保存并应用**。

🎉 **大功告成！** 您的路由器现在已经具备了 IPv6 直联的自愈能力！

---

 */


// ==========================================
// 核心引擎 (通用探測版)
// ==========================================
async function runProbe(rawTarget) {
    if (!rawTarget) return "MISSING_TARGET";

    // 1. 协议补全与斜杠修复
    // 修复可能被浏览器或代理压缩的斜杠，例如把 http:/[2408...] 还原成 http://[2408...]
    let target = rawTarget.replace(/^(https?):\/+/i, '$1://');

    let fetchUrl = target;
    // 如果用户没自带协议，默认补上 http://
    if (!fetchUrl.startsWith('http://') && !fetchUrl.startsWith('https://')) {
        fetchUrl = 'http://' + fetchUrl;
    }

    // 2. 提取 Hostname 进行局域网 IP 防护
    let parsedUrl;
    try {
        parsedUrl = new URL(fetchUrl);
    } catch (e) {
        return "FAIL_INVALID_URL";
    }

    // 防呆：拦截私有局域网 IP
    const privateIPRegex = /^(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.|127\.|0\.|\[?fd[0-9a-f]{2}:)/i;
    // 使用 parsedUrl.hostname 进行检测，比单纯测字符串更精准
    if (privateIPRegex.test(parsedUrl.hostname)) return "FAIL_PRIVATE_IP_BLOCKED";

    // 3. 发起真实探测
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);

        const response = await fetch(fetchUrl, { signal: controller.signal });
        clearTimeout(timeoutId);

        // 状态码为 200~299，或 401/403 (密码拦截) 均视为网络畅通
        if (response.ok || response.status === 401 || response.status === 403) {
            return "OK";
        } else {
            return "FAIL_HTTP_" + response.status;
        }
    } catch (err) {
        return "FAIL_NETWORK_CF: " + err.message + " | " + err.name;
    }
}


// 以下Cloudflare的「专属接头」，可以更换成其它平台的接头：

// ==========================================
// Cloudflare 专属接头
// ==========================================
export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);

        // 提取域名后面的路径（不包含最前面的 '/'）
        let targetPath = url.pathname.substring(1);

        if (!targetPath) return new Response("MISSING_TARGET");

        // 防止 IPv6 的方括号 [] 等特殊字符被 URL 编码导致解析失败
        try {
            targetPath = decodeURIComponent(targetPath);
        } catch (e) {
            // 忽略解码错误
        }

        return new Response(await runProbe(targetPath));
    }
};
// ===   结束  ===
