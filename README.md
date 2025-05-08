# 快捷复制 (Quick Copy) ✂️🚀

一个高效复制链接及对应文字的浏览器扩展，告别手动拼接链接和文本的烦恼！

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/LazzyFatty/quick-copy/pulls)

## 功能特性 ✨

- 右键点击链接 → 自动复制「链接文字 + URL」组合格式
- 智能识别真实文本（自动过滤广告链接、统计代码等干扰元素）
- 三重保障机制（DOM搜索 → 后备文本 → 纯URL回退）
- 可视化操作反馈（彩色状态提示）
- 纯本地运行，无需网络权限

## 安装方法 📦

### Chrome 商店安装
暂未发布

### 手动安装
1. 下载代码：
   ```bash
   git clone https://github.com/yourname/quick-copy.git
   ```
2. 浏览器访问：
   ```
   chrome://extensions/
   ```
3. 开启「开发者模式」→ 「加载已解压的扩展程序」→ 选择项目文件夹

## 开发指南 👨‍💻

### 项目结构
```
quick-copy/
├── icons/               # 扩展图标
├── src/
│   ├── background.js    # 后台服务
│   └── content.js       # 页面脚本
├── manifest.json        # 扩展配置
└── README.md
```

### 构建方法
```bash
# 生产打包 (需预先安装 webpack)
npm run build
```

## 技术细节 🔧

### 核心机制
1. **三层复制策略**：
   - 第一层：DOM精确匹配（通过`querySelectorAll`+URL标准化）
   - 第二层：上下文菜单文本过滤（排除URL-like文本）
   - 第三层：纯URL保底复制

2. **安全增强**：
   ```javascript
   // 采用 Content Security Policy (CSP)
   "content_security_policy": {
     "extension_pages": "script-src 'self'; object-src 'self'"
   }
   ```

3. **剪贴板兼容方案**：
   - 优先使用现代API：`navigator.clipboard.writeText()`
   - 自动降级到`document.execCommand('copy')`
   - 错误边界处理（Promise + try-catch双保险）

### 性能优化
- **零延迟注入**：通过`chrome.scripting.executeScript`实现按需注入
- **轻量DOM操作**：使用`textContent`替代`innerHTML`解析
- **防内存泄漏**：动态创建的DOM元素自动移除超时器

## 贡献指南 🤝

### 如何参与
1. 提交Issue报告BUG或建议功能
2. Fork项目并创建特性分支：
   ```bash
   git checkout -b feature/your-feature
   ```
3. 提交Pull Request（请包含测试用例）

### 开发规范
- 代码风格：遵循Standard JS规范
- 注释要求：复杂逻辑必须包含流程图伪代码
- 测试覆盖：所有新增功能需补充测试用例
   ```javascript
   // 示例测试用例
   it('should sanitize URLs correctly', () => {
     assert.equal(sanitizeUrl('https://example.com//'), 'https://example.com')
   })
   ```

## 开源协议 📜

```text
MIT License
Copyright (c) 2025 [LazzyFatty]

## 鸣谢 🫶
- **代码核心开发**：[DeepSeek-V3](https://deepseek.com) 提供算法与实现方案
- **图标设计**：由[ChatGPT DALL·E](https://chat.openai.com)生成并优化

## 常见问题 ❓

### Q: 为什么无法复制某些网站的链接文本？
A: 这些网站可能：
   - 使用了动态加载（SPA架构）→ 尝试刷新页面后操作
   - 实施了内容保护（建议尊重版权）
   - 包含违规DOM结构（欢迎提交Issue附带网址）

### Q: 如何自定义复制格式？
当前版本支持通过修改代码第42行调整格式：
```javascript
// 修改此行即可（默认格式：文本 + 换行 + URL）
await copyToClipboard(`${text}\n${url}`);
```

---

<div align="center">
  <sub>❤️ 请给这个项目点个Star支持我们！</sub>
</div>
```
