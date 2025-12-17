/**
 * 薛某博客 Hexo 主题专用逻辑脚本
 * 负责：夜间模式切换、分类筛选（显隐逻辑）、代码块高级控件
 */

// ============================================
// 1. 夜间模式逻辑 (Dark Mode)
// ============================================
const themeToggleBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

function initTheme() {
    // 读取本地存储或系统偏好
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
        if(themeIcon) themeIcon.classList.replace('fa-moon', 'fa-sun');
    } else {
        document.documentElement.classList.remove('dark');
        if(themeIcon) themeIcon.classList.replace('fa-sun', 'fa-moon');
    }
}

// 绑定点击事件
if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
        // 保存用户选择
        if (document.documentElement.classList.contains('dark')) {
            localStorage.theme = 'dark';
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        } else {
            localStorage.theme = 'light';
            themeIcon.classList.replace('fa-sun', 'fa-moon');
        }
    });
}

// ============================================
// 2. 分类筛选逻辑 (Category Filter)
// ============================================
// 必须绑定到 window 对象，否则 HTML 里的 onclick 找不到它
window.filterPosts = function(category, btnElement) {
    
    // A. 按钮样式切换 (Visual Feedback)
    const buttons = document.querySelectorAll('.filter-btn');
    // 定义非激活状态的类名
    const inactiveClasses = ['bg-white', 'text-gray-600', 'border-gray-200', 'hover:bg-gray-50', 'dark:bg-gray-800', 'dark:border-gray-700', 'dark:text-gray-300', 'dark:hover:bg-gray-700'];
    // 定义激活状态的类名
    const activeClasses = ['bg-blue-100', 'text-blue-700', 'border-transparent', 'dark:bg-blue-900', 'dark:text-blue-200'];

    // 重置所有按钮
    buttons.forEach(btn => {
        btn.classList.remove('active', ...activeClasses);
        btn.classList.add(...inactiveClasses);
    });
    
    // 激活当前按钮
    if(btnElement) {
        btnElement.classList.remove(...inactiveClasses);
        btnElement.classList.add('active', ...activeClasses);
    }

    // B. 文章卡片显示/隐藏 (Show/Hide Logic)
    const posts = document.querySelectorAll('.post-card');
    let hasContent = false;

    posts.forEach(post => {
        const postCategory = post.getAttribute('data-category');
        // 如果选的是“全部” 或者 卡片分类匹配
        if (category === '全部' || postCategory === category) {
            post.classList.remove('hidden'); // 显示
            // 添加一个淡入动画效果
            post.style.animation = 'none';
            post.offsetHeight; /* trigger reflow */
            post.style.animation = 'fadeIn 0.5s ease-in-out';
            hasContent = true;
        } else {
            post.classList.add('hidden'); // 隐藏
        }
    });

    // C. 空状态提示 (Empty State)
    const emptyState = document.getElementById('empty-state');
    const postsContainer = document.getElementById('posts-container');
    
    if (emptyState && postsContainer) {
        if (hasContent) {
            emptyState.classList.add('hidden');
            postsContainer.classList.remove('hidden');
        } else {
            emptyState.classList.remove('hidden');
            postsContainer.classList.add('hidden');
        }
    }
}

// ============================================
// 3. 代码块高级控件 (复制、全屏、行号) ✨
// ============================================
function initCodeControls() {
    // 找到所有 Hexo 生成的代码块容器 (figure.highlight)
    const highlightBlocks = document.querySelectorAll('figure.highlight');

    highlightBlocks.forEach(block => {
        // 如果已经初始化过，跳过
        if (block.querySelector('.code-controls')) return;

        // 创建右上角的按钮容器
        const controls = document.createElement('div');
        controls.className = 'code-controls';

        // --- 按钮 1: 行号开关 ---
        const lineNumBtn = createControlBtn('fa-solid fa-list-ol', '显示/隐藏行号');
        lineNumBtn.addEventListener('click', () => {
            block.classList.toggle('no-gutter');
        });

        // --- 按钮 2: 全屏显示 ---
        const fullscreenBtn = createControlBtn('fa-solid fa-expand', '全屏显示');
        fullscreenBtn.addEventListener('click', () => {
            block.classList.toggle('fullscreen');
            
            // 切换图标并处理背景滚动
            if (block.classList.contains('fullscreen')) {
                fullscreenBtn.innerHTML = '<i class="fa-solid fa-compress"></i>'; // 变成退出图标
                document.body.style.overflow = 'hidden'; // 禁止背景滚动
            } else {
                fullscreenBtn.innerHTML = '<i class="fa-solid fa-expand"></i>'; // 变回全屏图标
                document.body.style.overflow = ''; // 恢复滚动
            }
        });

        // --- 按钮 3: 复制代码 ---
        const copyBtn = createControlBtn('fa-regular fa-copy', '复制代码');
        copyBtn.addEventListener('click', () => {
            // Hexo 的代码通常在 .code pre 里面，或者直接是 table 里的文本
            let codeText = '';
            const codeContainer = block.querySelector('.code pre');
            
            if (codeContainer) {
                codeText = codeContainer.innerText;
            } else {
                // 兼容其他可能的结构
                codeText = block.innerText;
            }
            
            navigator.clipboard.writeText(codeText).then(() => {
                // 复制成功反馈
                copyBtn.innerHTML = '<i class="fa-solid fa-check"></i>'; // 变成对号
                copyBtn.classList.add('copied');
                
                // 2秒后恢复
                setTimeout(() => {
                    copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i>';
                    copyBtn.classList.remove('copied');
                }, 2000);
            }).catch(err => {
                console.error('Copy failed:', err);
                copyBtn.title = '复制失败';
            });
        });

        // 将三个按钮添加到容器 (注意顺序：从左到右)
        controls.appendChild(lineNumBtn);
        controls.appendChild(fullscreenBtn);
        controls.appendChild(copyBtn);

        // 将容器添加到代码块里
        block.appendChild(controls);
    });
}

// 辅助函数：快速创建带图标的按钮
function createControlBtn(iconClass, title) {
    const btn = document.createElement('div');
    btn.className = 'control-btn';
    btn.title = title; // 鼠标悬停提示
    btn.innerHTML = `<i class="${iconClass}"></i>`;
    return btn;
}

// ============================================
// 4. 初始化入口
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initTheme();       // 初始化主题
    initCodeControls(); // 初始化代码块控件
});

// 立即执行一次主题初始化，防止页面闪烁
initTheme();