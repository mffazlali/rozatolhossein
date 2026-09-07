/**
 * Inline script to prevent theme flash (FOUC)
 * این اسکریپت قبل از رندر React اجرا میشه تا flash تم رخ نده
 * 
 * @param defaultTheme - تم پیش‌فرض از API (dark یا light)
 */
export const getThemeScript = (defaultTheme: 'dark' | 'light' = 'light') => `
  (function() {
    try {
      var theme = localStorage.getItem('theme');
      if (theme === 'light' || theme === 'dark') {
        document.documentElement.classList.add(theme);
      } else {
        document.documentElement.classList.add('${defaultTheme}');
      }
    } catch (e) {
      document.documentElement.classList.add('${defaultTheme}');
    }
  })();
`;

// برای backward compatibility
export const themeScript = getThemeScript('light');
