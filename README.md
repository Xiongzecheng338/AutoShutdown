<div align="center">

# 🚀 AutoBat

**Windows 批处理脚本专业下载中心**

[![Version](https://img.shields.io/badge/version-3.0-blue.svg)](https://github.com/yourusername/autobat)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Stars](https://img.shields.io/github/stars/yourusername/autobat?style=social)](https://github.com/yourusername/autobat)
[![Forks](https://img.shields.io/github/forks/yourusername/autobat?style=social)](https://github.com/yourusername/autobat)

<img src="https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white" alt="HTML5"/>
<img src="https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white" alt="CSS3"/>
<img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black" alt="JavaScript"/>
<img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white" alt="Tailwind CSS"/>

[在线演示](https://yourusername.github.io/autobat) · [功能特性](#-功能特性) · [快速开始](#-快速开始) · [贡献指南](#-贡献指南)

</div>

---

## 📸 项目预览

<div align="center">
  <img src="https://via.placeholder.com/800x450?text=AutoBat+Preview" alt="AutoBat Preview" width="80%"/>
</div>

> 🎮 **新增游戏模块**：飞机大战、扫雷游戏已上线！
> 
> � **新增文本工具**：文本格式转换、批量查找替换等8款实用工具！

---

## ✨ 功能特性

### � 批处理脚本库 (45+)

| 分类 | 数量 | 代表脚本 |
|------|------|----------|
| 系统管理 | 8个 | 定时关机、进程管理、服务管理 |
| 文件操作 | 12个 | 批量重命名、文件复制、空文件夹清理 |
| 网络工具 | 6个 | 网络诊断、IP切换、WiFi密码查看 |
| 系统优化 | 5个 | 垃圾清理、磁盘分析、启动项管理 |
| 安全工具 | 2个 | 文件夹加密、文件粉碎 |
| 备份恢复 | 4个 | 文件备份、注册表备份、驱动备份 |
| 开发工具 | 1个 | 环境变量管理 |
| 多媒体工具 | 3个 | 屏幕截图、图片转换、水印添加 |
| 文本工具 | 8个 | 格式转换、查找替换、编码转换 |

### 🎮 游戏模块

- **飞机大战** - 经典射击游戏，支持键盘/触屏操作
  - 多种敌机类型
  - 道具系统（快速射击、散射、护盾）
  - 难度递进机制
  - 本地高分榜

- **扫雷** - 经典益智游戏
  - 三种难度（简单/普通/困难）
  - 计时器功能
  - 右键标记地雷
  - 游戏状态保存

### 🛡️ 安全等级系统

| 等级 | 标识 | 含义 |
|------|------|------|
| 🟢 安全 | `safe` | 只读操作，可放心使用 |
| � 注意 | `warning` | 会修改系统，需谨慎 |
| � 危险 | `danger` | 可能导致数据丢失，务必备份 |

### 🎨 界面特性

- 🌓 **深色/浅色主题** - 一键切换，护眼设计
- � **响应式布局** - 完美适配移动端和桌面端
- � **智能搜索** - 支持关键词搜索和多维度筛选
- ⭐ **收藏功能** - 本地存储收藏列表
- � **代码高亮** - Highlight.js 语法高亮

---

## 🏗️ 项目架构

```
AutoBat/
├── index.html              # 主页面
├── css/
│   └── styles.css          # 样式文件
├── js/
│   ├── app.js              # 主入口文件
│   ├── core/               # 核心模块
│   │   ├── config.js       # 配置常量
│   │   ├── state.js        # 状态管理
│   │   ├── events.js       # 事件总线
│   │   ├── utils.js        # 工具函数
│   │   ├── api.js          # API接口
│   │   └── plugin.js       # 插件系统
│   ├── data/               # 数据模块
│   │   ├── scripts-data.js # 脚本数据
│   │   ├── categories.js   # 分类配置
│   │   ├── faq.js          # FAQ数据
│   │   └── text-tools.js   # 文本工具数据
│   ├── modules/            # 功能模块
│   │   ├── theme.js        # 主题切换
│   │   ├── search.js       # 搜索功能
│   │   ├── filter.js       # 筛选功能
│   │   ├── render.js       # UI渲染
│   │   ├── modal.js        # 模态框
│   │   ├── toast.js        # 消息提示
│   │   ├── scroll.js       # 滚动效果
│   │   ├── mobile-menu.js  # 移动端菜单
│   │   └── game-ui.js      # 游戏UI
│   └── games/              # 游戏模块
│       ├── game-base.js    # 游戏基类
│       ├── airplane-game.js# 飞机游戏
│       ├── minesweeper-game.js # 扫雷游戏
│       └── index.js        # 游戏管理器
└── README.md
```

### 模块依赖关系

```
┌─────────────────────────────────────────────────────────────┐
│                        app.js (主入口)                        │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│  Core Modules │    │ Data Modules  │    │Feature Modules│
├───────────────┤    ├───────────────┤    ├───────────────┤
│ • config      │    │ • scripts     │    │ • theme       │
│ • state       │    │ • categories  │    │ • search      │
│ • events      │    │ • faq         │    │ • filter      │
│ • utils       │    │ • text-tools  │    │ • render      │
│ • api         │    └───────────────┘    │ • modal       │
│ • plugin      │                         │ • toast       │
└───────────────┘                         │ • game-ui     │
                                          └───────────────┘
```

---

## 🚀 快速开始

### 在线访问

直接访问 [GitHub Pages](https://yourusername.github.io/autobat) 即可使用。

### 本地运行

```bash
# 克隆仓库
git clone https://github.com/yourusername/autobat.git

# 进入目录
cd autobat

# 启动本地服务器 (Python)
python -m http.server 8080

# 或使用 Node.js
npx serve .

# 访问 http://localhost:8080
```

### 使用脚本

1. **浏览脚本** - 在主页浏览或搜索需要的脚本
2. **查看代码** - 点击"查看"按钮查看完整源代码
3. **下载脚本** - 点击"下载"按钮获取 .bat 文件
4. **运行脚本** - 双击下载的 .bat 文件运行
5. **管理员权限** - 部分脚本需要右键"以管理员身份运行"

---

## 🛠️ 开发指南

### 添加新脚本

在 `js/data/scripts-data.js` 中添加新对象：

```javascript
{
  id: 46,
  name: "新脚本名称",
  category: "系统管理",
  icon: "fa-cog",
  iconColor: "terminal-cyan",
  security: "safe",
  tags: ["标签1", "标签2"],
  description: "脚本描述",
  usage: "使用方法",
  warning: "注意事项",
  code: `@echo off\n...`
}
```

### 添加新游戏

1. 创建游戏类继承 `GameBase`
2. 实现 `init()`, `update()`, `render()` 方法
3. 在 `js/games/index.js` 中注册游戏

```javascript
import { GameBase } from './game-base.js';

class MyGame extends GameBase {
  constructor(canvasId) {
    super(canvasId);
  }
  
  init() {
    super.init();
    // 初始化游戏
  }
  
  update(dt) {
    // 更新游戏逻辑
  }
  
  render() {
    // 渲染游戏画面
  }
}
```

### 插件开发

```javascript
const myPlugin = {
  name: 'my-plugin',
  version: '1.0.0',
  description: '插件描述',
  init() {
    console.log('插件初始化');
  },
  hooks: {
    'script:view': (script) => {
      console.log('查看脚本:', script.name);
    }
  }
};
```

---

## 📋 路线图

### v3.0 (当前版本)
- [x] 模块化重构
- [x] ES6 模块系统
- [x] 状态管理
- [x] 事件总线
- [x] 插件系统
- [x] 游戏模块（飞机大战、扫雷）
- [x] 文本工具模块

### v3.1 (计划中)
- [ ] 更多游戏类型（贪吃蛇、俄罗斯方块）
- [ ] 用户系统（登录/注册）
- [ ] 脚本评论功能
- [ ] 脚本评分系统

### v4.0 (未来规划)
- [ ] 后端 API 支持
- [ ] 脚本在线编辑器
- [ ] 脚本分享社区
- [ ] 多语言支持

---

## 🤝 贡献指南

我们欢迎所有形式的贡献！

### 如何贡献

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

### 贡献类型

- 🐛 报告 Bug
- 💡 提出新功能建议
- 📝 改进文档
- 🔧 提交代码修复
- 🎨 设计新的脚本图标

---

## � 许可证

本项目采用 [MIT License](LICENSE) 开源协议。

---

## � 致谢

- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [Font Awesome](https://fontawesome.com/) - 图标库
- [Highlight.js](https://highlightjs.org/) - 代码高亮
- [Google Fonts](https://fonts.google.com/) - 字体服务

---

<div align="center">

**如果这个项目对你有帮助，请给一个 ⭐ Star 支持一下！**

Made with ❤️ by AutoBat Team

</div>
