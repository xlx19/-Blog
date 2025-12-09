// ==========================================
//        👇 在这里修改你的文章数据 👇
// ==========================================
const blogPosts = [
    {
        id: 1,
        title: "Hello World: 成功将博客部署到 Cloudflare Pages",
        date: "2024-05-20",
        category: "技术笔记", 
        summary: "终于完成了博客的迁移！使用 Cloudflare Pages 托管静态网站简直太方便了。",
        content: `
            <p>大家好！这是我的第一篇博客文章。</p>
            <p>当你看到这个页面时，说明我已经成功学会了如何使用 GitHub 和 Cloudflare Pages 来搭建网站。</p>
        `
    },
    {
        id: 2,
        title: "Cloudflare 部署避坑指南",
        date: "2024-05-21",
        category: "技术笔记",
        summary: "Framework preset 到底选什么？这篇文章告诉你答案。",
        content: `
            <p>关键点：手写 HTML 静态页面时，<b>Framework preset</b> 选 None，<b>Output directory</b> 留空。</p>
        `
    },
    {
        id: 3,
        title: "我的未来学习计划",
        date: "2024-05-22",
        category: "生活随笔",
        summary: "立个 Flag，通过这个平台督促自己坚持学习。",
        content: `
            <p>接下来计划学习：HTML5, CSS3, JavaScript 基础。</p>
        `
    },
    {
        id: 4,
        title: "HTML 实验室：跑马灯测试",
        date: "2024-05-23",
        category: "HTML实验室", 
        summary: "复古的 Marquee 标签测试。",
        content: `
            <p>欢迎来到 HTML 实验室！</p>
            <div style="background: #000; color: #0f0; padding: 10px; border-radius: 5px; font-family: monospace;">
                <marquee>系统启动中... Loading HTML Lab... 进度 99%</marquee>
            </div>
        `
    }
];