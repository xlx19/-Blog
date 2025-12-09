// 获取页面元素
const homeView = document.getElementById('home-view');
const articleView = document.getElementById('article-view');
const postsContainer = document.getElementById('posts-container');
const emptyState = document.getElementById('empty-state');
const themeToggleBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

// 初始化
function init() {
    initTheme(); // 初始化主题
    renderPosts(blogPosts); // 默认显示所有文章
    
    // 浏览器后退处理
    window.onpopstate = function(event) {
        if (event.state && event.state.page === 'article') {
            openArticle(event.state.id, false);
        } else {
            showHome(false);
        }
    };
}

// === 主题切换逻辑 ===
function initTheme() {
    // 检查本地存储或系统偏好
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        document.documentElement.classList.remove('dark');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
}

themeToggleBtn.addEventListener('click', () => {
    // 切换 dark 类
    document.documentElement.classList.toggle('dark');
    
    // 更新图标和本地存储
    if (document.documentElement.classList.contains('dark')) {
        localStorage.theme = 'dark';
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        localStorage.theme = 'light';
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
});

// === 筛选文章函数 ===
function filterPosts(category, btnElement) {
    // 1. 重置所有按钮样式
    const buttons = document.querySelectorAll('.filter-btn');
    const inactiveClasses = ['bg-white', 'text-gray-600', 'border-gray-200', 'hover:bg-gray-50', 'dark:bg-gray-800', 'dark:border-gray-700', 'dark:text-gray-300', 'dark:hover:bg-gray-700'];
    const activeClasses = ['bg-blue-100', 'text-blue-700', 'border-transparent', 'dark:bg-blue-900', 'dark:text-blue-200'];

    buttons.forEach(btn => {
        btn.classList.remove('active', ...activeClasses);
        btn.classList.add(...inactiveClasses);
    });

    // 2. 激活当前点击的按钮
    btnElement.classList.remove(...inactiveClasses);
    btnElement.classList.add('active', ...activeClasses);

    // 3. 筛选数据
    if (category === '全部') {
        renderPosts(blogPosts);
    } else {
        const filtered = blogPosts.filter(post => post.category === category);
        renderPosts(filtered);
    }
}

// === 渲染文章卡片 (适配夜间模式) ===
function renderPosts(posts) {
    if (posts.length === 0) {
        postsContainer.innerHTML = '';
        postsContainer.classList.add('hidden');
        emptyState.classList.remove('hidden');
        return;
    }

    postsContainer.classList.remove('hidden');
    emptyState.classList.add('hidden');

    postsContainer.innerHTML = posts.map(post => `
        <div onclick="openArticle(${post.id})" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition cursor-pointer border border-gray-100 dark:border-gray-700 overflow-hidden group flex flex-col h-full">
            <div class="p-6 flex flex-col flex-grow">
                <div class="flex items-center justify-between mb-3">
                    <span class="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-full">${post.category}</span>
                    <span class="text-xs text-gray-400">${post.date}</span>
                </div>
                <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">${post.title}</h3>
                <p class="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4 flex-grow">${post.summary}</p>
                <div class="text-blue-600 dark:text-blue-400 text-sm font-medium mt-auto group-hover:translate-x-1 transition-transform inline-block">
                    阅读全文 <i class="fa-solid fa-arrow-right ml-1"></i>
                </div>
            </div>
        </div>
    `).join('');
}

// 打开文章详情
function openArticle(id, pushState = true) {
    const post = blogPosts.find(p => p.id === id);
    if (!post) return;

    document.getElementById('article-title').innerText = post.title;
    document.getElementById('article-date').innerHTML = `<i class="far fa-calendar-alt mr-1"></i> ${post.date}`;
    document.getElementById('article-category').innerText = post.category;
    document.getElementById('article-content').innerHTML = post.content;

    homeView.classList.add('hidden');
    articleView.classList.remove('hidden');
    window.scrollTo(0, 0);

    if (pushState) {
        try {
            history.pushState({ page: 'article', id: id }, null, `?p=${id}`);
        } catch (e) { console.log("预览模式不更新 URL"); }
    }
}

// 返回首页
function showHome(pushState = true) {
    articleView.classList.add('hidden');
    homeView.classList.remove('hidden');
    window.scrollTo(0, 0);

    if (pushState) {
        try {
            history.pushState({ page: 'home' }, null, window.location.pathname);
        } catch (e) { console.log("预览模式不更新 URL"); }
    }
}

// 检查 URL 参数
try {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('p')) openArticle(parseInt(urlParams.get('p')), false);
} catch (e) {}

// 启动程序
init();