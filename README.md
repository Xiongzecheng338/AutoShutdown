# autushowdown
# Windows 自动化开关机程序

一个功能强大、界面友好的 Windows 批处理脚本，旨在通过命令行界面轻松管理系统的电源选项。支持定时关机、重启、休眠、注销以及通过任务计划程序实现每日自动化任务。

![Version](https://img.shields.io/badge/Version-2.0-green?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)
![Platform](https://img.shields.io/badge/Platform-Windows-lightgrey?style=flat-square)
![Language](https://img.shields.io/badge/Language-Batch-orange?style=flat-square)

---

## 目录

- [项目简介](#项目简介)
- [功能特性](#功能特性)
- [快速开始](#快速开始)
- [详细使用指南](#详细使用指南)
- [常见问题 (FAQ)](#常见问题-faq)
- [贡献指南](#贡献指南)
- [许可证](#许可证)

---

## 项目简介

`AutoShutdown.bat` 是一个原生 Windows 批处理脚本，无需安装任何第三方软件即可运行。它封装了 Windows 系统底层的 `shutdown`、`schtasks` 和 `powercfg` 命令，提供直观的菜单交互界面，让用户无需记忆复杂的命令行参数即可完成复杂的电源管理操作。

无论是想要在下载完成后自动关机，还是每天定时重启服务器，这个脚本都能轻松胜任。

---

## 功能特性

### 核心功能
- **定时关机/重启**：支持秒级倒计时和指定具体时间（HH:MM）两种模式。
- **休眠与睡眠**：快速进入休眠或睡眠模式，节省电力同时保留工作状态。
- **用户注销**：支持立即注销或定时注销当前用户。
- **任务取消**：一键取消所有待执行的关机或重启任务。

### 高级功能
- **每日计划任务**：集成 `schtasks`，可创建每天固定时间执行的关机/重启任务。
- **系统信息显示**：快速查看计算机名、运行时间、内存状态等关键信息。
- **权限自动检测**：脚本启动时自动检测管理员权限，若权限不足会自动请求提升。

### 用户体验
- **原生运行**：无需安装 Python、Node.js 等运行环境，Windows 原生支持。
- **界面友好**：采用 UTF-8 编码，支持中文显示，界面清晰美观。
- **操作安全**：关键操作前均有确认提示，防止误操作。

---

## 快速开始

### 使用方法

1.  **下载脚本**
    点击项目页面右上角的 `Code` 按钮，选择 `Download ZIP`，解压后找到 `AutoShutdown.bat`。

2.  **运行脚本**
    右键点击 `AutoShutdown.bat`，选择 **"以管理员身份运行"**。
    > 注意：虽然普通权限也可运行部分功能，但建议使用管理员权限以获得完整功能体验。

3.  **选择功能**
    在弹出的命令行窗口中，根据菜单提示输入对应的数字并回车即可。

---

## 详细使用指南

### 主菜单概览

