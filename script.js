// script.js - Theme Switcher Logic

// Elements
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const icon = themeToggle.querySelector('.icon');
const copyButton = document.querySelector('.copy-code');
const codeTabs = document.querySelectorAll('.code-tab');
const toast = document.getElementById('toast');

// Theme Management
function toggleTheme() {
    const isDarkMode = body.classList.toggle('dark-mode');
    
    // Update icon
    icon.textContent = isDarkMode ? '☀️' : '🌙';
    
    // Save preference
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    
    // Show toast notification
    showToast(`Switched to ${isDarkMode ? 'dark' : 'light'} mode`);
    
    // Update button rotation animation
    animateThemeToggle();
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    let isDarkMode = false;
    
    // Priority: saved preference > system preference
    if (savedTheme) {
        isDarkMode = savedTheme === 'dark';
    } else {
        isDarkMode = prefersDark;
    }
    
    // Apply theme
    if (isDarkMode) {
        body.classList.add('dark-mode');
        icon.textContent = '☀️';
    }
}

function detectSystemTheme() {
    if (!localStorage.getItem('theme')) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
            body.classList.add('dark-mode');
            icon.textContent = '☀️';
        }
    }
}

// UI Animations
function animateThemeToggle() {
    themeToggle.style.transform = 'rotate(360deg)';
    setTimeout(() => {
        themeToggle.style.transform = '';
    }, 300);
}

function showToast(message) {
    const toastContent = toast.querySelector('span');
    toastContent.textContent = message;
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Copy Code Functionality
function setupCopyButton() {
    if (!copyButton) return;
    
    copyButton.addEventListener('click', async () => {
        const code = document.querySelector('code').textContent;
        
        try {
            await navigator.clipboard.writeText(code);
            
            // Update button state
            const originalHTML = copyButton.innerHTML;
            copyButton.innerHTML = '<i class="fas fa-check"></i> Copied!';
            copyButton.style.background = 'var(--success)';
            copyButton.style.color = 'white';
            copyButton.style.borderColor = 'var(--success)';
            
            // Reset button after 2 seconds
            setTimeout(() => {
                copyButton.innerHTML = originalHTML;
                copyButton.style.background = '';
                copyButton.style.color = '';
                copyButton.style.borderColor = '';
            }, 2000);
            
        } catch (err) {
            console.error('Failed to copy:', err);
            showToast('Failed to copy code');
        }
    });
}

// Code Tabs Functionality
function setupCodeTabs() {
    codeTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            codeTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Update code content based on tab
            if (tab.textContent === 'CSS') {
                updateCodeToCSS();
            } else {
                updateCodeToJS();
            }
        });
    });
}

function updateCodeToCSS() {
    const codeBlock = document.querySelector('code');
    codeBlock.textContent = `/* CSS Variables for Theme Switching */
:root {
    --bg-primary: #ffffff;
    --text-primary: #1e293b;
    --accent: #3b82f6;
}

body.dark-mode {
    --bg-primary: #0f172a;
    --text-primary: #f1f5f9;
    --accent: #60a5fa;
}

* {
    transition: background-color 0.3s ease, 
                color 0.3s ease;
}

body {
    background: var(--bg-primary);
    color: var(--text-primary);
}`;
}

function updateCodeToJS() {
    const codeBlock = document.querySelector('code');
    codeBlock.textContent = `// Theme switching logic
const toggleTheme = () => {
    const isDark = document.body.classList.toggle('dark-mode');
    
    // Save preference
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    // Update UI
    updateThemeUI(isDark);
};

// Load saved theme
const loadTheme = () => {
    const saved = localStorage.getItem('theme');
    const isDark = saved === 'dark' || 
        (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    if (isDark) document.body.classList.add('dark-mode');
};`;
}

// Keyboard Shortcuts
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + D to toggle theme
        if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
            e.preventDefault();
            toggleTheme();
        }
        
        // Ctrl/Cmd + T to toggle theme (alternative)
        if ((e.ctrlKey || e.metaKey) && e.key === 't') {
            e.preventDefault();
            toggleTheme();
        }
    });
}

// System Theme Detection
function setupSystemThemeListener() {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    mediaQuery.addEventListener('change', (e) => {
        // Only update if user hasn't set a preference
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                body.classList.add('dark-mode');
                icon.textContent = '☀️';
            } else {
                body.classList.remove('dark-mode');
                icon.textContent = '🌙';
            }
        }
    });
}

// Initialize everything
function init() {
    // Load saved theme
    loadTheme();
    
    // Detect system theme if no preference saved
    detectSystemTheme();
    
    // Setup event listeners
    themeToggle.addEventListener('click', toggleTheme);
    
    // Setup UI functionality
    setupCopyButton();
    setupCodeTabs();
    setupKeyboardShortcuts();
    setupSystemThemeListener();
    
    console.log('ThemeSwitcher initialized');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}