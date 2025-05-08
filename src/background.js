chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "quick-copy-link",
    title: "快捷复制链接及文字 ★",
    contexts: ["link"],
    documentUrlPatterns: ["<all_urls>"]
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (!tab?.id) return;
  
  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['src/content.js']
    });
    
    await chrome.tabs.sendMessage(tab.id, {
      action: "QUICK_COPY",
      url: info.linkUrl,
      fallbackText: info.linkText || ''
    });
  } catch (err) {
    console.error('复制失败:', err);
  }
});
