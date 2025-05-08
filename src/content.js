const DEBUG_MODE = true; 

function debugLog(...args) {
  if (DEBUG_MODE) console.log('[快捷复制]', ...args);
}

function showStatus(color, text) {
  const mark = document.createElement('div');
  mark.style = `position:fixed;top:10px;left:10px;background:${color};
               color:white;padding:6px 10px;z-index:99999;font-family:sans-serif;`;
  mark.textContent = `快捷复制: ${text}`;
  document.body.appendChild(mark);
  setTimeout(() => mark.remove(), 1500);
}

async function copyToClipboard(text) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (e) {
    console.warn('现代API复制失败，尝试回退方案');
  }

  // 回退方案
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  document.body.appendChild(textarea);
  textarea.select();
  
  try {
    return document.execCommand('copy');
  } catch (e) {
    console.error('所有复制方法均失败:', e);
    return false;
  } finally {
    document.body.removeChild(textarea);
  }
}

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action !== "QUICK_COPY") return;

  const { url, fallbackText } = request;
  
  // 方法1：DOM搜索（加强版） 
  try {
    const normalizedUrl = url.replace(/\/+$/, ''); // 标准化URL
    const links = document.querySelectorAll('a[href]');
    
    for (const link of links) {
      const linkUrl = link.href.replace(/\/+$/, '');
      if (linkUrl === normalizedUrl) {
        const text = link.textContent.trim();
        if (text && !/^https?:\/\//i.test(text)) {
          const success = await copyToClipboard(`${text}\n${url}`);
          if (success) {
            showStatus('#2196F3', 'DOM复制成功');
            debugLog('DOM文本:', text);
            return;
          }
        }
      }
    }
  } catch (e) {
    debugLog('DOM搜索异常:', e);
  }

  // 方法2：原生后备文本
  if (fallbackText && !/^https?:\/\/|^\W*www\./i.test(fallbackText)) {
    const success = await copyToClipboard(`${fallbackText}\n${url}`);
    if (success) {
      showStatus('#FFC107', '使用原生文本');
      debugLog('后备文本:', fallbackText);
      return;
    }
  }

  // 最终回退
  await copyToClipboard(url);
  showStatus('#F44336', '仅复制URL');
  debugLog('回退到URL复制');
});
