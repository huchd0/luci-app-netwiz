/*

# 📡 Netwiz Probe (IPv6 Watchdog) - Cloudflare Edition
# 📡 Netwiz Probe (IPv6 保活探针) - Cloudflare 版
# 📡 Netwiz Probe (IPv6 保活探針) - Cloudflare 版

Developed specifically to address the instability of IPv6 direct-connected devices. Leveraging Cloudflare's global edge network, it allows you to deploy quickly with zero cost and zero configuration.
专门针对 IPv6 直连设备时不稳定的痛点开发，借助 Cloudflare 覆盖全球的边缘节点网络优势，让您可以零成本、免配置地快速部署。
專門針對 IPv6 直連設備時不穩定的痛點開發，借助 Cloudflare 覆蓋全球的邊緣節點網路優勢，讓您可以零成本、免配置地快速部署。

### Perfectly integrates with the router's `luci-app-netwiz` to achieve enterprise-grade IPv6 direct connection keep-alive and self-healing.
### 完美配合路由器的 `luci-app-netwiz`，实现企业级的 IPv6 直联设备保活与故障自愈。
### 完美配合路由器的 `luci-app-netwiz`，實現企業級的 IPv6 直聯設備保活與故障自癒。

---

## ✨ Core Features | 核心特性

- **🎉 Free | 免费 | 免費**: Hosted on Cloudflare Workers, providing up to 100,000 free probe requests per day, which is more than enough for home or normal usage.
  基于 Cloudflare Workers 托管，每天提供高达 10 万次的免费探测额度，足够家庭或正常用户使用。
  基於 Cloudflare Workers 託管，每天提供高達 10 萬次的免費探測額度，足夠家庭或正常用戶使用。

- **⚡ Native IPv6 Ultra-fast Response | 原生 IPv6 极速响应 | 原生 IPv6 極速響應**: Utilizes Cloudflare's massive global IPv6 backbone network for precise and fast connections.
  利用 Cloudflare 全球最庞大的 IPv6 骨干网进行精准连接。
  利用 Cloudflare 全球最龐大的 IPv6 骨幹網進行精準連接。

- **🛡️ Privacy & Anti-abuse | 隐私与防滥用 | 隱私與防濫用**: Pure probing logic with no user data collection. Built-in strict LAN IP protection (SSRF interception) to eliminate the risk of malicious scanning.
  纯净探测逻辑，不收集任何用户隐私数据，内置严格的局域网 IP 防护（SSRF 拦截），杜绝被恶意扫描的风险。
  純淨探測邏輯，不收集任何用戶隱私數據，內置嚴格的區域網 IP 防護（SSRF 攔截），杜絕被惡意掃描的風險。

---

## 🚀 Deployment Guide | 部署指南

No complex local environment needed. You can build your exclusive probe directly through your browser.
无需复杂的本地环境，通过浏览器即可完成专属探针的搭建。
無需複雜的本地環境，透過瀏覽器即可完成專屬探針的搭建。

### Step 1: Get the Probe Source Code | 第一步：获取探针源码 | 第一步：獲取探針源碼
Copy all the code inside the `worker.js` file in this project to use in the next step.
复制本项目中的 `worker.js` 里的全部代码，准备在下一步使用。
複製本項目中的 `worker.js` 裡的全部代碼，準備在下一步使用。

### Step 2: One-click Deployment to Cloudflare | 第二步：一键部署到 Cloudflare | 第二步：一鍵部署到 Cloudflare
1. Visit the **[Cloudflare Dashboard](https://dash.cloudflare.com/)** and log in to your account.
   访问 **[Cloudflare 控制台](https://dash.cloudflare.com/)** 并登录您的账号。
   訪問 **[Cloudflare 控制台](https://dash.cloudflare.com/)** 並登入您的帳號。
2. Find and click on **`Workers & Pages`** in the left navigation bar.
   在左侧导航栏找到并点击 **`Workers 和 Pages`**。
   在左側導航列找到並點擊 **`Workers 和 Pages`**。
3. Click **`Create application`**, then click **`Create Worker`**.
   点击 **`创建应用程序 (Create application)`**，然后点击 **`创建 Worker (Create Worker)`**。
   點擊 **`創建應用程式 (Create application)`**，然後點擊 **`創建 Worker (Create Worker)`**。
4. Give your probe a name (e.g., `netwiz-probe`) and click **`Deploy`**.
   为您的探针起一个名字（例如：`netwiz-probe`），点击 **`部署 (Deploy)`**。
   為您的探針起一個名字（例如：`netwiz-probe`），點擊 **`部署 (Deploy)`**。
5. Once deployed successfully, click **`Edit code`**.
   部署成功后，点击 **`编辑代码 (Edit code)`**。
   部署成功後，點擊 **`編輯代碼 (Edit code)`**。
6. Delete all default code in the input box, **select all and paste the entire content of `worker.js`** into it.
   将原来输入框里默认的代码全部删除，**全选并复制当前文件全部内容**粘贴进去。
   將原來輸入框裡預設的代碼全部刪除，**全選並複製當前文件全部內容**貼上進去。
7. Click **`Save and deploy`** in the top right corner.
   点击右上角的 **`保存并部署 (Save and deploy)`**。
   點擊右上角的 **`保存並部署 (Save and deploy)`**。
8. Note down the exclusive probe domain assigned to you by Cloudflare (e.g., `netwiz-probe.yourusername.workers.dev`).
   记录下 Cloudflare 为您分配的专属探针域名（例如：`netwiz-probe.您的用户名.workers.dev`）。
   記錄下 Cloudflare 為您分配的專屬探針域名（例如：`netwiz-probe.您的用戶名.workers.dev`）。

### Step 3: Configure the Router Dashboard | 第三步：配置路由器后台 | 第三步：配置路由器後台
1. Copy the **probe base domain** you just obtained (e.g., `netwiz-probe.xxxx.workers.dev`).
   复制刚刚获取的**探针基础域名**（例如：`netwiz-probe.xxxx.workers.dev`）。
   複製剛剛獲取的**探針基礎域名**（例如：`netwiz-probe.xxxx.workers.dev`）。
2. Log in to your router dashboard and navigate to the **Netwiz** advanced settings panel.
   登录您的路由器后台，进入 **Netwiz 插件设置**高级面板。
   登入您的路由器後台，進入 **Netwiz 外掛設定**高級面板。
3. Enable the **"📡 IPv6 Watchdog"** feature.
   开启 **“📡 IPv6 深度保活 (IPv6 Watchdog)”** 功能。
   開啟 **「📡 IPv6 深度保活 (IPv6 Watchdog)」** 功能。
4. Paste the copied domain directly into the **"Probe Target URL"** input box.
   将复制的域名直接粘贴到 **“探测源目标网址 (Probe Target URL)”** 输入框中。
   將複製的域名直接貼到 **「探測源目標網址 (Probe Target URL)」** 輸入框中。
5. Click **Save & Apply**.
   点击**保存并应用**。
   點擊**保存並應用**。

🎉 **All done!** Your router is now equipped with self-healing capabilities for IPv6 direct connections!
🎉 **大功告成！** 您的路由器现在已经具备了 IPv6 直联的自愈能力！
🎉 **大功告成！** 您的路由器現在已經具備了 IPv6 直聯的自癒能力！

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
