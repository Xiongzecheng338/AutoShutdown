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
text
┌──────────────────────────────────────────────────────┐
│ [1] 定时关机 [6] 每日定时关机 │
│ [2] 定时重启 [7] 每日定时重启 │
│ [3] 系统休眠 [8] 取消所有任务 │
│ [4] 系统睡眠 [9] 查看计划任务 │
│ [5] 用户注销 [10] 系统信息 │
│ │
│ [0] 退出程序 │
└──────────────────────────────────────────────────────┘


### 功能详解

#### 1. 定时关机 / 重启
- **倒计时模式**：输入秒数（例如 `3600` 表示一小时后），系统将立即设置倒计时。
- **指定时间模式**：输入 24 小时制时间（例如 `23:30`），系统将在该时间执行操作。

#### 2. 每日定时任务
利用 Windows 任务计划程序实现。
- 输入执行时间（如 `22:00`）。
- 输入任务名称（可直接回车使用默认名称）。
- 任务创建后，即使重启电脑也会在每天指定时间生效。

#### 3. 取消任务
- **取消倒计时**：执行 `shutdown /a` 中止正在倒计时的任务。
- **删除计划任务**：从系统中移除通过本脚本创建的每日任务。

#### 4. 系统休眠 vs 睡眠
- **睡眠**：电脑保持极低功耗，唤醒速度快，但断电会丢失未保存数据。
- **休眠**：将内存数据写入硬盘后完全断电，唤醒速度较慢，但断电不影响数据。

---

## 常见问题 (FAQ)

<details>
<summary><b>Q: 为什么运行后窗口一闪而过？</b></summary>
<br>
A: 这通常是因为没有以管理员身份运行。请右键点击脚本，选择 "以管理员身份运行"。如果仍然闪退，请在 CMD 中手动运行脚本查看报错信息。
</details>

<details>
<summary><b>Q: 为什么休眠功能不可用？</b></summary>
<br>
A: 部分系统默认关闭了休眠功能。请以管理员身份打开 CMD，运行以下命令开启：
<br>
<code>powercfg /hibernate on</code>
</details>

<details>
<summary><b>Q: 如何彻底删除每日定时任务？</b></summary>
<br>
A: 可以在脚本中选择 [8] 取消所有任务，或者打开系统 "任务计划程序" (Task Scheduler)，在任务计划程序库中找到对应名称的任务手动删除。
</details>

<details>
<summary><b>Q: 支持哪些 Windows 版本？</b></summary>
<br>
A: 理论上支持 Windows 7/8/10/11 以及 Windows Server 等所有主流 Windows 版本。
</details>

---

## 贡献指南

欢迎提交 Issue 报告 Bug 或提出新功能建议。

如果您想贡献代码：
1. Fork 本仓库。
2. 创建新的分支 (`git checkout -b feature/AmazingFeature`)。
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)。
4. 推送到分支 (`git push origin feature/AmazingFeature`)。
5. 提交 Pull Request。

---

## 许可证

本项目基于 [MIT](LICENSE) 许可证开源。

这意味着您可以自由地使用、复制、修改、合并、出版发行、散布、再授权及贩售软件的副本，但需保留原作者的版权声明。

---

## 联系方式

如有问题或建议，欢迎通过以下方式联系：

- **GitHub Issues**: (https://github.com/Xiongzecheng338/AutoShutdown/))
- **Email**:x18825407105@outlook.com

---

<p align="center">
  Made with ❤️ for Windows Users
</p>



# AutoShutdown
# Windows Automated Shutdown Program

A powerful and user-friendly Windows batch script designed to easily manage system power options through a command-line interface. Supports scheduled shutdown, restart, hibernate, logoff, and daily automated tasks via Task Scheduler.

![Version](https://img.shields.io/badge/Version-2.0-green?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)
![Platform](https://img.shields.io/badge/Platform-Windows-lightgrey?style=flat-square)
![Language](https://img.shields.io/badge/Language-Batch-orange?style=flat-square)

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Quick Start](#quick-start)
- [Detailed Usage Guide](#detailed-usage-guide)
- [Frequently Asked Questions (FAQ)](#frequently-asked-questions-faq)
- [Contributing](#contributing)
- [License](#license)

---

## Project Overview

`AutoShutdown.bat` is a native Windows batch script that runs without requiring any third-party software installation. It encapsulates Windows system-level commands such as `shutdown`, `schtasks`, and `powercfg`, providing an intuitive menu-driven interface that allows users to complete complex power management operations without memorizing complicated command-line parameters.

Whether you want to automatically shut down after downloads complete, or restart a server at a fixed time every day, this script can handle it with ease.

---

## Features

### Core Functions
- **Scheduled Shutdown/Restart**: Supports both second-level countdown and specific time (HH:MM) modes.
- **Hibernate & Sleep**: Quickly enter hibernate or sleep mode to save power while preserving work state.
- **User Logoff**: Supports immediate or scheduled logoff for the current user.
- **Task Cancellation**: One-click cancellation of all pending shutdown or restart tasks.

### Advanced Functions
- **Daily Scheduled Tasks**: Integrated with `schtasks` to create shutdown/restart tasks that execute at a fixed time every day.
- **System Information Display**: Quickly view key information such as computer name, uptime, memory status, etc.
- **Automatic Permission Detection**: Automatically detects administrator privileges at script startup and requests elevation if insufficient.

### User Experience
- **Native Execution**: No need to install runtime environments like Python or Node.js; natively supported by Windows.
- **User-Friendly Interface**: Uses UTF-8 encoding, supports Chinese display, with a clear and attractive interface.
- **Operation Safety**: Confirmation prompts before critical operations to prevent accidental actions.

---

## Quick Start

### How to Use

1.  **Download the Script**
    Click the `Code` button in the top right corner of the project page, select `Download ZIP`, extract it, and locate `AutoShutdown.bat`.

2.  **Run the Script**
    Right-click on `AutoShutdown.bat` and select **"Run as administrator"**.
    > Note: While some functions can run with standard permissions, administrator privileges are recommended for full functionality.

3.  **Select Function**
    In the command-line window that appears, enter the corresponding number according to the menu prompts and press Enter.

---

## Detailed Usage Guide

### Main Menu Overview
```
┌──────────────────────────────────────────────────────┐
│ [1] Scheduled Shutdown    [6] Daily Scheduled Shutdown │
│ [2] Scheduled Restart     [7] Daily Scheduled Restart  │
│ [3] System Hibernate      [8] Cancel All Tasks         │
│ [4] System Sleep          [9] View Scheduled Tasks     │
│ [5] User Logoff           [10] System Information      │
│                                                      │
│ [0] Exit Program                                     │
└──────────────────────────────────────────────────────┘
```

### Function Details

#### 1. Scheduled Shutdown / Restart
- **Countdown Mode**: Enter seconds (e.g., `3600` for one hour later), and the system will immediately set the countdown.
- **Specific Time Mode**: Enter 24-hour format time (e.g., `23:30`), and the system will execute the operation at that time.

#### 2. Daily Scheduled Tasks
Utilizes Windows Task Scheduler.
- Enter the execution time (e.g., `22:00`).
- Enter the task name (press Enter to use the default name).
- Once created, the task will take effect at the specified time every day, even after computer restart.

#### 3. Cancel Tasks
- **Cancel Countdown**: Execute `shutdown /a` to abort a countdown task in progress.
- **Delete Scheduled Tasks**: Remove daily tasks created through this script from the system.

#### 4. System Hibernate vs. Sleep
- **Sleep**: Computer maintains ultra-low power consumption, fast wake-up, but power loss will cause unsaved data loss.
- **Hibernate**: Writes memory data to disk before complete power-off, slower wake-up, but power loss does not affect data.

---

## Frequently Asked Questions (FAQ)









---

## Contributing

Issues reporting bugs or suggesting new features are welcome.

If you want to contribute code:
1. Fork this repository.
2. Create a new branch (`git checkout -b feature/AmazingFeature`).
3. Commit changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Submit a Pull Request.

---

## License

This project is open-sourced under the [MIT](LICENSE) License.

This means you are free to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the software, but you must retain the original author's copyright notice.

---

## Contact

For questions or suggestions, feel free to contact through the following methods:

- **GitHub Issues**:(https://github.com/Xiongzecheng338/AutoShutdown/)
- **Email**:x18825407105@outlook.com

---


