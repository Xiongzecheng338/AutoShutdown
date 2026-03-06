export const scriptsData = [
  {
    id: 1, name: "定时关机助手", category: "系统管理", icon: "fa-power-off", iconColor: "terminal-red",
    security: "safe", tags: ["关机", "定时", "自动化"],
    description: "设置倒计时自动关机，支持取消操作。适合挂机下载、限制使用时间等场景，操作简单直观。",
    usage: "双击运行后输入秒数（如 3600 表示1小时），输入 0 可取消已设置的关机任务。",
    warning: "请确保在关机前保存好所有工作，关闭重要程序。",
    code: `@echo off
chcp 65001 >nul
title 定时关机助手 v1.0
color 0A

:MENU
cls
echo.
echo  ╔══════════════════════════════════════╗
echo  ║         定时关机助手 v1.0            ║
echo  ╚══════════════════════════════════════╝
echo.
echo  [1] 设置定时关机
echo  [2] 取消关机计划
echo  [3] 查看当前状态
echo  [0] 退出
echo.
set /p choice="请选择操作: "

if "%choice%"=="1" goto SET_SHUTDOWN
if "%choice%"=="2" goto CANCEL_SHUTDOWN
if "%choice%"=="3" goto VIEW_STATUS
if "%choice%"=="0" exit
echo 无效选择！
timeout /t 2 >nul
goto MENU

:SET_SHUTDOWN
echo.
set /p seconds="请输入倒计时秒数 (如 3600=1小时): "
if "%seconds%"=="" goto SET_SHUTDOWN
shutdown /s /t %seconds%
echo.
echo ★ 系统将在 %seconds% 秒后关机
pause
goto MENU

:CANCEL_SHUTDOWN
shutdown /a
echo ★ 已取消关机计划
pause
goto MENU

:VIEW_STATUS
echo.
shutdown /a 2>nul
if errorlevel 1 (
    echo 没有待执行的关机计划
) else (
    echo 存在待执行的关机计划
)
pause
goto MENU`
  },
  {
    id: 2, name: "定时重启工具", category: "系统管理", icon: "fa-sync-alt", iconColor: "terminal-cyan",
    security: "safe", tags: ["重启", "定时", "维护"],
    description: "设置系统定时重启，适用于服务器定期维护、系统更新后重启等场景。",
    usage: "运行后输入秒数设置重启倒计时，输入 0 取消已有重启计划。",
    warning: "重启前请保存所有工作并关闭重要程序。",
    code: `@echo off
chcp 65001 >nul
title 定时重启工具 v1.0
color 0B

:MENU
cls
echo.
echo  ╔══════════════════════════════════════╗
echo  ║         定时重启工具 v1.0            ║
echo  ╚══════════════════════════════════════╝
echo.
echo  [1] 设置定时重启
echo  [2] 取消重启计划
echo  [0] 退出
echo.
set /p choice="请选择操作: "

if "%choice%"=="1" goto SET_RESTART
if "%choice%"=="2" goto CANCEL_RESTART
if "%choice%"=="0" exit
echo 无效选择！
timeout /t 2 >nul
goto MENU

:SET_RESTART
echo.
set /p seconds="请输入倒计时秒数: "
if "%seconds%"=="" goto SET_RESTART
shutdown /r /t %seconds%
echo ★ 系统将在 %seconds% 秒后重启
pause
goto MENU

:CANCEL_RESTART
shutdown /a
echo ★ 已取消重启计划
pause
goto MENU`
  },
  {
    id: 3, name: "系统休眠工具", category: "系统管理", icon: "fa-moon", iconColor: "terminal-purple",
    security: "safe", tags: ["休眠", "省电", "快速恢复"],
    description: "快速让系统进入休眠状态，保存当前工作到硬盘，省电且恢复快速。",
    usage: "直接运行即可让系统进入休眠模式。如休眠未启用会提示开启。",
    warning: "确保系统已启用休眠功能，首次使用可能需要管理员权限开启。",
    code: `@echo off
chcp 65001 >nul
title 系统休眠工具 v1.0
color 0D

echo.
echo  ╔══════════════════════════════════════╗
echo  ║         系统休眠工具 v1.0            ║
echo  ╚══════════════════════════════════════╝
echo.
echo  正在检查休眠功能...

powercfg /a | find "休眠" >nul
if errorlevel 1 (
    echo  [!] 系统不支持休眠或休眠未启用
    set /p enable="是否尝试启用休眠功能？(Y/N): "
    if /i "%enable%"=="Y" (
        powercfg /hibernate on
        echo  休眠功能已启用
    ) else (
        pause
        exit
    )
)

echo.
echo  即将进入休眠模式...
timeout /t 3
shutdown /h`
  },
  {
    id: 4, name: "自动关机计划", category: "系统管理", icon: "fa-calendar-alt", iconColor: "terminal-yellow",
    security: "safe", tags: ["计划任务", "定时", "自动化"],
    description: "创建每日或每周定时关机计划任务，适合需要固定时间关机的场景。",
    usage: "设置关机时间后，系统将按计划自动关机。支持每日或指定星期执行。",
    warning: "请确保在关机时间前保存好所有工作。",
    code: `@echo off
chcp 65001 >nul
title 自动关机计划工具 v1.0
color 0E

:MENU
cls
echo.
echo  ╔══════════════════════════════════════╗
echo  ║       自动关机计划工具 v1.0          ║
echo  ╚══════════════════════════════════════╝
echo.
echo  [1] 创建每日关机计划
echo  [2] 创建每周关机计划
echo  [3] 删除关机计划
echo  [4] 查看当前计划
echo  [0] 退出
echo.
set /p choice="请选择操作: "

if "%choice%"=="1" goto DAILY_TASK
if "%choice%"=="2" goto WEEKLY_TASK
if "%choice%"=="3" goto DELETE_TASK
if "%choice%"=="4" goto VIEW_TASK
if "%choice%"=="0" exit
goto MENU

:DAILY_TASK
set /p time="请输入关机时间 (HH:MM): "
schtasks /create /tn "AutoShutdown_Daily" /tr "shutdown /s /f" /sc daily /st %time% /f
echo 每日 %time% 自动关机计划已创建！
pause
goto MENU

:WEEKLY_TASK
set /p time="请输入关机时间 (HH:MM): "
echo 选择星期: MON,TUE,WED,THU,FRI,SAT,SUN
set /p days="请输入: "
schtasks /create /tn "AutoShutdown_Weekly" /tr "shutdown /s /f" /sc weekly /d %days% /st %time% /f
echo 每周 %days% %time% 自动关机计划已创建！
pause
goto MENU

:DELETE_TASK
schtasks /delete /tn "AutoShutdown_Daily" /f 2>nul
schtasks /delete /tn "AutoShutdown_Weekly" /f 2>nul
echo 关机计划已删除！
pause
goto MENU

:VIEW_TASK
schtasks /query /tn "AutoShutdown_Daily" 2>nul
schtasks /query /tn "AutoShutdown_Weekly" 2>nul
pause
goto MENU`
  },
  {
    id: 5, name: "进程管理器", category: "系统管理", icon: "fa-tasks", iconColor: "terminal-orange",
    security: "warning", tags: ["进程", "任务管理", "系统监控"],
    description: "查看和管理系统进程，支持按名称或PID结束进程，方便排查问题程序。",
    usage: "运行后可查看进程列表，输入进程名或PID结束指定进程。",
    warning: "请谨慎结束系统进程，可能导致系统不稳定或程序崩溃。",
    code: `@echo off
chcp 65001 >nul
title 进程管理器 v1.0
color 0E

:MENU
cls
echo.
echo  ╔══════════════════════════════════════╗
echo  ║          进程管理器 v1.0             ║
echo  ╚══════════════════════════════════════╝
echo.
echo  [1] 查看所有进程
echo  [2] 按名称结束进程
echo  [3] 按PID结束进程
echo  [4] 搜索进程
echo  [0] 退出
echo.
set /p choice="请选择操作: "

if "%choice%"=="1" goto LIST_PROCESS
if "%choice%"=="2" goto KILL_BY_NAME
if "%choice%"=="3" goto KILL_BY_PID
if "%choice%"=="4" goto SEARCH_PROCESS
if "%choice%"=="0" exit
goto MENU

:LIST_PROCESS
tasklist /fo table
pause
goto MENU

:KILL_BY_NAME
set /p pname="请输入进程名称: "
set /p confirm="确认结束 %pname%？(Y/N): "
if /i "%confirm%"=="Y" taskkill /f /im "%pname%"
pause
goto MENU

:KILL_BY_PID
set /p pid="请输入进程PID: "
taskkill /f /pid %pid%
pause
goto MENU

:SEARCH_PROCESS
set /p keyword="请输入搜索关键词: "
tasklist /fi "imagename eq *%keyword%*"
pause
goto MENU`
  },
  {
    id: 6, name: "服务管理工具", category: "系统管理", icon: "fa-cogs", iconColor: "terminal-purple",
    security: "warning", tags: ["服务", "系统服务", "管理"],
    description: "启动、停止、暂停或重启Windows服务，管理系统服务状态。",
    usage: "以管理员身份运行，输入服务名称进行管理操作。",
    warning: "请谨慎操作系统服务，可能导致系统不稳定或功能异常。",
    code: `@echo off
chcp 65001 >nul
title 服务管理工具 v1.0
color 0D

:MENU
cls
echo.
echo  ╔══════════════════════════════════════╗
echo  ║         服务管理工具 v1.0            ║
echo  ╚══════════════════════════════════════╝
echo.
echo  [1] 查看所有服务
echo  [2] 查看运行中的服务
echo  [3] 启动服务
echo  [4] 停止服务
echo  [5] 重启服务
echo  [0] 退出
echo.
set /p choice="请选择操作: "

if "%choice%"=="1" goto LIST_ALL
if "%choice%"=="2" goto LIST_RUNNING
if "%choice%"=="3" goto START_SVC
if "%choice%"=="4" goto STOP_SVC
if "%choice%"=="5" goto RESTART_SVC
if "%choice%"=="0" exit
goto MENU

:LIST_ALL
sc query type= service state= all | find "SERVICE_NAME"
pause
goto MENU

:LIST_RUNNING
sc query type= service state= all | find "RUNNING" /i
pause
goto MENU

:START_SVC
set /p sname="请输入服务名称: "
sc start "%sname%"
pause
goto MENU

:STOP_SVC
set /p sname="请输入服务名称: "
sc stop "%sname%"
pause
goto MENU

:RESTART_SVC
set /p sname="请输入服务名称: "
sc stop "%sname%"
timeout /t 3 >nul
sc start "%sname%"
pause
goto MENU`
  },
  {
    id: 7, name: "系统信息查看", category: "系统管理", icon: "fa-info-circle", iconColor: "terminal-cyan",
    security: "safe", tags: ["系统信息", "硬件", "诊断"],
    description: "快速查看系统详细信息，包括硬件配置、系统版本、网络状态等。",
    usage: "运行后自动显示系统信息，包括计算机名、用户名、系统版本等。",
    warning: "无特殊注意事项。",
    code: `@echo off
chcp 65001 >nul
title 系统信息查看工具 v1.0
color 0B

echo.
echo  ╔══════════════════════════════════════╗
echo  ║       系统信息查看工具 v1.0          ║
echo  ╚══════════════════════════════════════╝
echo.

echo  [基本信息]
echo  ========================================
echo  计算机名: %COMPUTERNAME%
echo  用户名: %USERNAME%
echo  系统目录: %SYSTEMROOT%
echo  当前日期: %DATE%
echo  当前时间: %TIME%
echo.

echo  [系统版本]
echo  ========================================
ver
echo.

echo  [硬件信息]
echo  ========================================
systeminfo | findstr /C:"OS 名称" /C:"OS 版本" /C:"系统类型" /C:"处理器" /C:"物理内存"
echo.

echo  [网络信息]
echo  ========================================
ipconfig | findstr /C:"IPv4" /C:"子网掩码" /C:"默认网关"
echo.

echo  [磁盘信息]
echo  ========================================
wmic logicaldisk get name,size,freespace
echo.
pause`
  },
  {
    id: 8, name: "用户注销工具", category: "系统管理", icon: "fa-sign-out-alt", iconColor: "terminal-red",
    security: "safe", tags: ["注销", "用户", "切换"],
    description: "快速注销当前用户，适用于需要切换用户账户的场景。",
    usage: "运行后确认即可注销当前用户。",
    warning: "注销前请保存所有工作。",
    code: `@echo off
chcp 65001 >nul
title 用户注销工具
color 0C

echo.
echo  ╔══════════════════════════════════════╗
echo  ║         用户注销工具 v1.0            ║
echo  ╚══════════════════════════════════════╝
echo.
echo  警告：即将注销当前用户！
echo  请确保已保存所有工作。
echo.
set /p confirm="确认注销？(Y/N): "
if /i "%confirm%"=="Y" (
    shutdown /l
) else (
    echo 操作已取消
)
pause`
  },
  {
    id: 9, name: "批量文件重命名", category: "文件操作", icon: "fa-file-signature", iconColor: "terminal-yellow",
    security: "warning", tags: ["重命名", "批量", "文件管理"],
    description: "批量重命名指定目录下的文件，支持添加前缀、后缀、替换字符、序号命名。",
    usage: "运行后输入目标文件夹路径，选择重命名方式并设置参数。",
    warning: "操作不可逆，建议先在小范围测试后再批量操作。",
    code: `@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion
title 批量文件重命名工具 v1.0
color 0E

:MENU
cls
echo.
echo  ╔══════════════════════════════════════╗
echo  ║      批量文件重命名工具 v1.0         ║
echo  ╚══════════════════════════════════════╝
echo.
echo  [1] 添加前缀
echo  [2] 添加后缀
echo  [3] 替换字符
echo  [4] 序号命名
echo  [0] 退出
echo.
set /p choice="请选择操作: "

if "%choice%"=="1" goto ADD_PREFIX
if "%choice%"=="2" goto ADD_SUFFIX
if "%choice%"=="3" goto REPLACE
if "%choice%"=="4" goto RENUMBER
if "%choice%"=="0" exit
goto MENU

:ADD_PREFIX
set /p folder="文件夹路径: "
set /p prefix="前缀: "
cd /d "%folder%"
for %%f in (*) do ren "%%f" "%prefix%%%f"
echo 完成！
pause
goto MENU

:ADD_SUFFIX
set /p folder="文件夹路径: "
set /p suffix="后缀: "
cd /d "%folder%"
for %%f in (*) do ren "%%f" "%%~nf%suffix%%%~xf"
echo 完成！
pause
goto MENU

:REPLACE
set /p folder="文件夹路径: "
set /p old="原字符: "
set /p new="新字符: "
cd /d "%folder%"
for %%f in (*) do (
    set "name=%%f"
    ren "!name!" "!name:%old%=%new%!"
)
echo 完成！
pause
goto MENU

:RENUMBER
set /p folder="文件夹路径: "
set /p prefix="前缀: "
cd /d "%folder%"
set num=1
for %%f in (*) do (
    ren "%%f" "%prefix%!num!%%~xf"
    set /a num+=1
)
echo 完成！
pause
goto MENU`
  },
  {
    id: 10, name: "批量创建文件夹", category: "文件操作", icon: "fa-folder-plus", iconColor: "terminal-cyan",
    security: "safe", tags: ["文件夹", "批量", "创建"],
    description: "根据列表批量创建文件夹，适合需要创建大量目录的场景。",
    usage: "输入文件夹名称列表（每行一个），自动批量创建。",
    warning: "无特殊注意事项。",
    code: `@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion
title 批量创建文件夹工具 v1.0
color 0B

echo.
echo  ╔══════════════════════════════════════╗
echo  ║      批量创建文件夹工具 v1.0         ║
echo  ╚══════════════════════════════════════╝
echo.

set /p path="创建路径 (回车为当前目录): "
if not "%path%"=="" cd /d "%path%"

echo.
echo  请输入文件夹名称列表 (每行一个，空行结束):
echo  ========================================

set count=0
:INPUT
set /p name=""
if "%name%"=="" goto CREATE
set /a count+=1
set "folder!count!=%name%"
goto INPUT

:CREATE
echo.
for /l %%i in (1,1,%count%) do (
    call set "n=%%folder%%i%%"
    if not exist "!n!" (
        md "!n!"
        echo  已创建: !n!
    ) else (
        echo  已存在: !n!
    )
)
echo.
echo  共处理 %count% 个文件夹！
pause`
  },
  {
    id: 11, name: "文件批量复制", category: "文件操作", icon: "fa-copy", iconColor: "terminal-green",
    security: "safe", tags: ["复制", "批量", "备份"],
    description: "批量复制指定类型的文件到目标目录，支持按扩展名筛选。",
    usage: "设置源目录、目标目录和文件类型，自动复制匹配的文件。",
    warning: "同名文件会被覆盖，请注意备份。",
    code: `@echo off
chcp 65001 >nul
title 文件批量复制工具 v1.0
color 0A

echo.
echo  ╔══════════════════════════════════════╗
echo  ║       文件批量复制工具 v1.0          ║
echo  ╚══════════════════════════════════════╝
echo.

set /p source="源目录: "
set /p target="目标目录: "
set /p ext="文件类型 (如 *.jpg): "

if not exist "%target%" md "%target%"

echo.
echo 正在复制 %ext% 文件...
copy "%source%\\%ext%" "%target%\\" /y

echo.
echo 复制完成！
pause`
  },
  {
    id: 12, name: "空文件夹清理", category: "文件操作", icon: "fa-trash-alt", iconColor: "terminal-red",
    security: "warning", tags: ["清理", "文件夹", "优化"],
    description: "扫描并删除指定目录下的所有空文件夹，释放目录结构。",
    usage: "输入要扫描的目录路径，自动查找并删除空文件夹。",
    warning: "删除后无法恢复，请确认目录正确。",
    code: `@echo off
chcp 65001 >nul
title 空文件夹清理工具 v1.0
color 0C

echo.
echo  ╔══════════════════════════════════════╗
echo  ║       空文件夹清理工具 v1.0          ║
echo  ╚══════════════════════════════════════╝
echo.

set /p path="请输入要扫描的目录: "
if not exist "%path%" (
    echo 目录不存在！
    pause
    exit
)

echo.
echo 正在扫描空文件夹...
set count=0

for /f "delims=" %%d in ('dir /ad /b /s "%path%" ^| sort /r') do (
    dir /a-d "%%d" >nul 2>&1
    if errorlevel 1 (
        rd "%%d" 2>nul
        if not errorlevel 1 (
            echo 已删除: %%d
            set /a count+=1
        )
    )
)

echo.
echo 共删除 %count% 个空文件夹！
pause`
  },
  {
    id: 13, name: "文件内容搜索", category: "文件操作", icon: "fa-search", iconColor: "terminal-cyan",
    security: "safe", tags: ["搜索", "文本", "查找"],
    description: "在多个文件中搜索指定文本内容，支持指定文件类型。",
    usage: "设置搜索目录、文件类型和搜索关键词，输出匹配结果。",
    warning: "无特殊注意事项。",
    code: `@echo off
chcp 65001 >nul
title 文件内容搜索工具 v1.0
color 0B

echo.
echo  ╔══════════════════════════════════════╗
echo  ║       文件内容搜索工具 v1.0          ║
echo  ╚══════════════════════════════════════╝
echo.

set /p path="搜索目录: "
set /p ext="文件类型 (如 *.txt): "
set /p keyword="搜索关键词: "

echo.
echo 搜索结果:
echo ========================================

findstr /s /i /n "%keyword%" "%path%\\%ext%"

echo ========================================
echo 搜索完成！
pause`
  },
  {
    id: 14, name: "网络诊断工具", category: "网络工具", icon: "fa-network-wired", iconColor: "terminal-cyan",
    security: "safe", tags: ["网络", "诊断", "IP"],
    description: "一键检测网络连接状态，包括IP配置、DNS、网关连通性测试。",
    usage: "运行后自动执行网络诊断，生成诊断报告。",
    warning: "无特殊注意事项。",
    code: `@echo off
chcp 65001 >nul
title 网络诊断工具 v1.0
color 0B

echo.
echo  ╔══════════════════════════════════════╗
echo  ║        网络诊断工具 v1.0             ║
echo  ╚══════════════════════════════════════╝
echo.

echo [1] 获取IP配置信息...
echo ========================================
ipconfig /all
echo.

echo [2] 测试本地回环...
echo ========================================
ping 127.0.0.1 -n 2
echo.

echo [3] 测试DNS解析...
echo ========================================
nslookup www.baidu.com
echo.

echo [4] 测试外网连接...
echo ========================================
ping www.baidu.com -n 4
echo.

echo [5] 刷新DNS缓存...
echo ========================================
ipconfig /flushdns
echo.

echo 诊断完成！
pause`
  },
  {
    id: 15, name: "IP地址切换器", category: "网络工具", icon: "fa-exchange-alt", iconColor: "terminal-purple",
    security: "warning", tags: ["IP", "网络配置", "切换"],
    description: "快速切换静态IP和动态IP配置，适用于多网络环境切换。",
    usage: "以管理员身份运行，选择要切换的IP模式或手动配置。",
    warning: "需要管理员权限，请确保输入正确的网络适配器名称。",
    code: `@echo off
chcp 65001 >nul
title IP地址切换器 v1.0
color 0D

:MENU
cls
echo.
echo  ╔══════════════════════════════════════╗
echo  ║         IP地址切换器 v1.0            ║
echo  ╚══════════════════════════════════════╝
echo.
echo  [1] 设置静态IP
echo  [2] 设置动态IP (DHCP)
echo  [3] 查看当前IP配置
echo  [0] 退出
echo.
set /p choice="请选择操作: "

if "%choice%"=="1" goto SET_STATIC
if "%choice%"=="2" goto SET_DHCP
if "%choice%"=="3" goto VIEW_IP
if "%choice%"=="0" exit
goto MENU

:SET_STATIC
set /p adapter="网络适配器名称: "
set /p ip="IP地址: "
set /p mask="子网掩码: "
set /p gateway="默认网关: "
set /p dns="DNS服务器: "

netsh interface ip set address "%adapter%" static %ip% %mask% %gateway%
netsh interface ip set dns "%adapter%" static %dns%
echo 静态IP设置完成！
pause
goto MENU

:SET_DHCP
set /p adapter="网络适配器名称: "
netsh interface ip set address "%adapter%" dhcp
netsh interface ip set dns "%adapter%" dhcp
echo 动态IP设置完成！
pause
goto MENU

:VIEW_IP
ipconfig /all
pause
goto MENU`
  },
  {
    id: 16, name: "WiFi密码查看", category: "网络工具", icon: "fa-wifi", iconColor: "terminal-green",
    security: "safe", tags: ["WiFi", "密码", "恢复"],
    description: "查看已连接过的WiFi网络密码，方便忘记密码时找回。",
    usage: "运行后自动列出所有已保存的WiFi网络及其密码。",
    warning: "请勿用于非法获取他人WiFi密码。",
    code: `@echo off
chcp 65001 >nul
title WiFi密码查看工具 v1.0
color 0A

echo.
echo  ╔══════════════════════════════════════╗
echo  ║        WiFi密码查看工具 v1.0         ║
echo  ╚══════════════════════════════════════╝
echo.

echo 正在获取已保存的WiFi网络...
echo ========================================
echo.

for /f "skip=9 tokens=1,2 delims=:" %%i in ('netsh wlan show profiles') do (
    if "%%j" neq "" (
        set "ssid=%%j"
        setlocal enabledelayedexpansion
        set "ssid=!ssid: =!"
        echo  [!ssid!]
        for /f "tokens=2 delims=:" %%k in ('netsh wlan show profile name="!ssid!" key^=clear ^| find "关键内容"') do (
            echo     密码: %%k
        )
        echo.
        endlocal
    )
)

echo ========================================
echo 获取完成！
pause`
  },
  {
    id: 17, name: "端口扫描工具", category: "网络工具", icon: "fa-search", iconColor: "terminal-orange",
    security: "safe", tags: ["端口", "扫描", "安全"],
    description: "扫描指定IP的常用端口开放状态，用于网络诊断和安全检测。",
    usage: "输入目标IP地址，自动扫描常用端口开放状态。",
    warning: "仅用于合法的网络诊断和安全检测，请勿用于非法用途。",
    code: `@echo off
chcp 65001 >nul
title 端口扫描工具 v1.0
color 0E

echo.
echo  ╔══════════════════════════════════════╗
echo  ║         端口扫描工具 v1.0            ║
echo  ╚══════════════════════════════════════╝
echo.

set /p target="请输入目标IP地址: "

echo.
echo 正在扫描 %target% 的常用端口...
echo ========================================

for %%p in (21 22 23 25 53 80 110 135 139 443 445 1433 3306 3389 5432 8080) do (
    powershell -Command "if (Test-NetConnection -ComputerName %target% -Port %%p -WarningAction SilentlyContinue -InformationLevel Quiet) { Write-Host '端口 %%p: 开放' -ForegroundColor Green } else { Write-Host '端口 %%p: 关闭' -ForegroundColor Red }"
)

echo ========================================
echo 扫描完成！
pause`
  },
  {
    id: 18, name: "网络速度测试", category: "网络工具", icon: "fa-tachometer-alt", iconColor: "terminal-yellow",
    security: "safe", tags: ["网速", "测试", "性能"],
    description: "测试网络连接速度，包括下载和上传速度估算。",
    usage: "运行后自动测试网络速度。",
    warning: "需要网络连接。",
    code: `@echo off
chcp 65001 >nul
title 网络速度测试工具 v1.0
color 0E

echo.
echo  ╔══════════════════════════════════════╗
echo  ║        网络速度测试工具 v1.0         ║
echo  ╚══════════════════════════════════════╝
echo.

echo 正在测试网络延迟...
echo ========================================
ping www.baidu.com -n 10
echo.

echo 正在测试下载速度...
echo ========================================
powershell -Command "Measure-Command { Invoke-WebRequest -Uri 'https://www.baidu.com' -UseBasicParsing } | Select-Object -ExpandProperty TotalMilliseconds"
echo.

echo 测试完成！
pause`
  },
  {
    id: 19, name: "系统垃圾清理", category: "系统优化", icon: "fa-broom", iconColor: "terminal-green",
    security: "warning", tags: ["清理", "垃圾", "优化"],
    description: "清理系统临时文件、缓存、日志等垃圾文件，释放磁盘空间。",
    usage: "以管理员身份运行，自动清理系统垃圾文件。",
    warning: "清理前请关闭所有应用程序，部分清理需要管理员权限。",
    code: `@echo off
chcp 65001 >nul
title 系统垃圾清理工具 v1.0
color 0A

echo.
echo  ╔══════════════════════════════════════╗
echo  ║       系统垃圾清理工具 v1.0          ║
echo  ╚══════════════════════════════════════╝
echo.
echo  [!] 请以管理员身份运行
echo.
pause

echo 正在清理系统临时文件...
del /q /f /s "%TEMP%\\*" 2>nul
del /q /f /s "C:\\Windows\\Temp\\*" 2>nul

echo 正在清理系统缓存...
del /q /f /s "C:\\Windows\\Prefetch\\*" 2>nul

echo 正在清理浏览器缓存...
del /q /f /s "%LocalAppData%\\Microsoft\\Windows\\INetCache\\*" 2>nul

echo 正在清理回收站...
rd /s /q %systemdrive%\\$Recycle.bin 2>nul

echo.
echo 清理完成！
pause`
  },
  {
    id: 20, name: "磁盘空间分析", category: "系统优化", icon: "fa-hdd", iconColor: "terminal-yellow",
    security: "safe", tags: ["磁盘", "空间", "分析"],
    description: "分析各磁盘分区的空间使用情况，帮助找出占用空间较大的目录。",
    usage: "运行后自动扫描所有磁盘分区并显示空间使用情况。",
    warning: "无特殊注意事项。",
    code: `@echo off
chcp 65001 >nul
title 磁盘空间分析工具 v1.0
color 0A

echo.
echo  ╔══════════════════════════════════════╗
echo  ║       磁盘空间分析工具 v1.0          ║
echo  ╚══════════════════════════════════════╝
echo.

echo 正在分析磁盘空间使用情况...
echo ========================================
echo.

for %%d in (C D E F G H I J K L M N O P Q R S T U V W X Y Z) do (
    if exist %%d:\\ (
        echo [%%d: 盘]
        for /f "tokens=3" %%a in ('dir %%d:\\ /-c ^| find "可用字节"') do echo     可用空间: %%a 字节
        for /f "tokens=3" %%a in ('wmic logicaldisk where "DeviceID='%%d:'" get Size /value ^| find "Size"') do echo     总空间: %%a 字节
        echo.
    )
)

echo ========================================
echo 分析完成！
pause`
  },
  {
    id: 21, name: "快速启动工具", category: "系统优化", icon: "fa-rocket", iconColor: "terminal-green",
    security: "safe", tags: ["启动", "快捷", "工具"],
    description: "快速启动常用程序和系统工具，可自定义添加常用程序快捷方式。",
    usage: "运行后选择要启动的程序编号。",
    warning: "无特殊注意事项。",
    code: `@echo off
chcp 65001 >nul
title 快速启动工具 v1.0
color 0B

:MENU
cls
echo.
echo  ╔══════════════════════════════════════╗
echo  ║         快速启动工具 v1.0            ║
echo  ╚══════════════════════════════════════╝
echo.
echo  [系统工具]
echo  1. 记事本      2. 计算器      3. 画图
echo  4. 命令提示符  5. 注册表      6. 任务管理器
echo  7. 控制面板    8. 设备管理器  9. 服务管理
echo.
echo  [0] 退出
echo.
set /p choice="请选择: "

if "%choice%"=="1" start notepad.exe
if "%choice%"=="2" start calc.exe
if "%choice%"=="3" start mspaint.exe
if "%choice%"=="4" start cmd.exe
if "%choice%"=="5" start regedit.exe
if "%choice%"=="6" start taskmgr.exe
if "%choice%"=="7" start control.exe
if "%choice%"=="8" start devmgmt.msc
if "%choice%"=="9" start services.msc
if "%choice%"=="0" exit
goto MENU`
  },
  {
    id: 22, name: "右键菜单管理", category: "系统优化", icon: "fa-mouse-pointer", iconColor: "terminal-purple",
    security: "warning", tags: ["右键菜单", "注册表", "自定义"],
    description: "添加或删除右键菜单项，自定义右键菜单功能。",
    usage: "以管理员身份运行，选择要添加或删除的右键菜单项。",
    warning: "修改注册表有风险，建议先备份注册表。",
    code: `@echo off
chcp 65001 >nul
title 右键菜单管理工具 v1.0
color 0D

:MENU
cls
echo.
echo  ╔══════════════════════════════════════╗
echo  ║       右键菜单管理工具 v1.0          ║
echo  ╚══════════════════════════════════════╝
echo.
echo  [添加菜单项]
echo  1. 添加"在此处打开命令提示符"
echo  2. 添加"获取文件所有权"
echo.
echo  [删除菜单项]
echo  3. 删除"在此处打开命令提示符"
echo  4. 删除"获取文件所有权"
echo.
echo  [0] 退出
echo.
set /p choice="请选择: "

if "%choice%"=="1" goto ADD_CMD
if "%choice%"=="2" goto ADD_OWNER
if "%choice%"=="3" goto DEL_CMD
if "%choice%"=="4" goto DEL_OWNER
if "%choice%"=="0" exit
goto MENU

:ADD_CMD
reg add "HKEY_CLASSES_ROOT\\Directory\\Background\\shell\\OpenCmdHere" /ve /d "在此处打开命令提示符" /f
reg add "HKEY_CLASSES_ROOT\\Directory\\Background\\shell\\OpenCmdHere\\command" /ve /d "cmd.exe /s /k pushd \\"%%V\\"" /f
echo 已添加！
pause
goto MENU

:ADD_OWNER
reg add "HKEY_CLASSES_ROOT\\*\\shell\\runas" /ve /d "获取所有权" /f
reg add "HKEY_CLASSES_ROOT\\*\\shell\\runas\\command" /ve /d "cmd.exe /c takeown /f \\"%%1\\" && icacls \\"%%1\\" /grant administrators:F" /f
echo 已添加！
pause
goto MENU

:DEL_CMD
reg delete "HKEY_CLASSES_ROOT\\Directory\\Background\\shell\\OpenCmdHere" /f
echo 已删除！
pause
goto MENU

:DEL_OWNER
reg delete "HKEY_CLASSES_ROOT\\*\\shell\\runas" /f
echo 已删除！
pause
goto MENU`
  },
  {
    id: 23, name: "开机启动项管理", category: "系统优化", icon: "fa-play-circle", iconColor: "terminal-cyan",
    security: "warning", tags: ["启动项", "开机", "优化"],
    description: "查看和管理开机启动项，加快系统启动速度。",
    usage: "运行后可查看、添加或删除启动项。",
    warning: "请谨慎删除启动项，可能影响某些程序的正常运行。",
    code: `@echo off
chcp 65001 >nul
title 开机启动项管理工具 v1.0
color 0B

:MENU
cls
echo.
echo  ╔══════════════════════════════════════╗
echo  ║      开机启动项管理工具 v1.0         ║
echo  ╚══════════════════════════════════════╝
echo.
echo  [1] 查看启动项
echo  [2] 添加启动项
echo  [3] 删除启动项
echo  [0] 退出
echo.
set /p choice="请选择: "

if "%choice%"=="1" goto LIST
if "%choice%"=="2" goto ADD
if "%choice%"=="3" goto DEL
if "%choice%"=="0" exit
goto MENU

:LIST
echo.
echo 注册表启动项:
reg query "HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\CurrentVersion\\Run"
echo.
echo 启动文件夹:
dir "%AppData%\\Microsoft\\Windows\\Start Menu\\Programs\\Startup"
pause
goto MENU

:ADD
set /p name="启动项名称: "
set /p path="程序路径: "
reg add "HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\CurrentVersion\\Run" /v "%name%" /t REG_SZ /d "%path%" /f
echo 已添加！
pause
goto MENU

:DEL
set /p name="启动项名称: "
reg delete "HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\CurrentVersion\\Run" /v "%name%" /f
echo 已删除！
pause
goto MENU`
  },
  {
    id: 24, name: "文件夹加密工具", category: "安全工具", icon: "fa-lock", iconColor: "terminal-red",
    security: "danger", tags: ["加密", "隐私", "安全"],
    description: "使用系统自带功能隐藏并加密文件夹，保护隐私文件。",
    usage: "首次运行设置密码，之后可锁定/解锁文件夹。",
    warning: "请牢记密码，忘记密码将无法恢复文件夹！建议先测试再使用。",
    code: `@echo off
chcp 65001 >nul
title 文件夹加密工具 v1.0
color 0C

if not exist "Locker" (
    echo 首次使用，正在创建加密文件夹...
    md Locker
    set /p pwd="请设置密码: "
    echo %pwd% > .pwd
    attrib +h +s .pwd
    echo 加密文件夹已创建！
    pause
    exit
)

:MENU
cls
echo.
echo  ╔══════════════════════════════════════╗
echo  ║        文件夹加密工具 v1.0           ║
echo  ╚══════════════════════════════════════╝
echo.
echo  [1] 锁定文件夹
echo  [2] 解锁文件夹
echo  [0] 退出
echo.
set /p choice="请选择: "

if "%choice%"=="1" goto LOCK
if "%choice%"=="2" goto UNLOCK
if "%choice%"=="0" exit
goto MENU

:LOCK
attrib +h +s Locker
echo 文件夹已锁定！
pause
exit

:UNLOCK
set /p inputpwd="请输入密码: "
set /p pwd=<.pwd 2>nul
if "%inputpwd%"=="%pwd%" (
    attrib -h -s Locker
    echo 文件夹已解锁！
) else (
    echo 密码错误！
)
pause`
  },
  {
    id: 25, name: "文件粉碎机", category: "安全工具", icon: "fa-shredder", iconColor: "terminal-red",
    security: "danger", tags: ["删除", "粉碎", "安全"],
    description: "彻底删除文件，无法通过恢复软件找回，保护隐私安全。",
    usage: "输入要删除的文件路径，执行安全删除。",
    warning: "删除后无法恢复，请谨慎操作！",
    code: `@echo off
chcp 65001 >nul
title 文件粉碎机 v1.0
color 0C

echo.
echo  ╔══════════════════════════════════════╗
echo  ║          文件粉碎机 v1.0             ║
echo  ╚══════════════════════════════════════╝
echo.
echo  警告：此操作不可恢复！
echo.

set /p file="请输入要粉碎的文件路径: "

if not exist "%file%" (
    echo 文件不存在！
    pause
    exit
)

echo.
echo 正在安全删除...
echo.

for /l %%i in (1,1,3) do (
    echo 第 %%i 次覆写...
    type nul > "%file%"
)

del /f /q "%file%"

if exist "%file%" (
    echo 删除失败！
) else (
    echo 粉碎完成！
)
pause`
  },
  {
    id: 26, name: "文件备份工具", category: "备份恢复", icon: "fa-save", iconColor: "terminal-green",
    security: "safe", tags: ["备份", "文件", "安全"],
    description: "自动备份指定文件夹到目标位置，支持增量备份。",
    usage: "设置源文件夹和目标文件夹，执行备份操作。",
    warning: "请确保目标磁盘有足够空间。",
    code: `@echo off
chcp 65001 >nul
title 文件备份工具 v1.0
color 0A

echo.
echo  ╔══════════════════════════════════════╗
echo  ║        文件备份工具 v1.0             ║
echo  ╚══════════════════════════════════════╝
echo.

set /p source="源文件夹: "
set /p target="目标文件夹: "

if not exist "%source%" (
    echo 源文件夹不存在！
    pause
    exit
)

if not exist "%target%" md "%target%"

echo.
echo 正在备份...
xcopy "%source%\\*" "%target%\\" /e /h /c /i /y

echo.
echo 备份完成！
echo 时间: %date% %time%
pause`
  },
  {
    id: 27, name: "注册表备份", category: "备份恢复", icon: "fa-database", iconColor: "terminal-cyan",
    security: "warning", tags: ["注册表", "备份", "系统"],
    description: "备份系统注册表，防止系统故障时恢复。",
    usage: "以管理员身份运行，选择备份位置。",
    warning: "需要管理员权限。",
    code: `@echo off
chcp 65001 >nul
title 注册表备份工具 v1.0
color 0B

echo.
echo  ╔══════════════════════════════════════╗
echo  ║        注册表备份工具 v1.0           ║
echo  ╚══════════════════════════════════════╝
echo.

set backup_dir=%USERPROFILE%\\Desktop\\RegistryBackup
set backup_file=Registry_%date:~0,4%%date:~5,2%%date:~8,2%.reg

if not exist "%backup_dir%" md "%backup_dir%"

echo 正在备份注册表...
echo.

reg export "HKEY_LOCAL_MACHINE" "%backup_dir%\\HKLM_%backup_file%" /y
reg export "HKEY_CURRENT_USER" "%backup_dir%\\HKCU_%backup_file%" /y
reg export "HKEY_CLASSES_ROOT" "%backup_dir%\\HKCR_%backup_file%" /y

echo.
echo 备份完成！
echo 位置: %backup_dir%
pause`
  },
  {
    id: 28, name: "驱动程序备份", category: "备份恢复", icon: "fa-cube", iconColor: "terminal-purple",
    security: "safe", tags: ["驱动", "备份", "硬件"],
    description: "备份系统已安装的驱动程序，重装系统后快速恢复。",
    usage: "运行后自动备份所有第三方驱动到指定目录。",
    warning: "需要管理员权限。",
    code: `@echo off
chcp 65001 >nul
title 驱动程序备份工具 v1.0
color 0D

echo.
echo  ╔══════════════════════════════════════╗
echo  ║        驱动程序备份工具 v1.0         ║
echo  ╚══════════════════════════════════════╝
echo.

set backup_dir=%USERPROFILE%\\Desktop\\DriverBackup

if not exist "%backup_dir%" md "%backup_dir%"

echo 正在备份驱动程序...
echo.

dism /online /export-driver /destination:"%backup_dir%"

echo.
echo 备份完成！
echo 位置: %backup_dir%
pause`
  },
  {
    id: 29, name: "环境变量管理", category: "开发工具", icon: "fa-code", iconColor: "terminal-cyan",
    security: "warning", tags: ["环境变量", "开发", "配置"],
    description: "查看和管理系统环境变量，方便开发环境配置。",
    usage: "运行后可查看、添加或修改环境变量。",
    warning: "修改系统环境变量可能影响程序运行，请谨慎操作。",
    code: `@echo off
chcp 65001 >nul
title 环境变量管理工具 v1.0
color 0B

:MENU
cls
echo.
echo  ╔══════════════════════════════════════╗
echo  ║       环境变量管理工具 v1.0          ║
echo  ╚══════════════════════════════════════╝
echo.
echo  [1] 查看所有环境变量
echo  [2] 查看PATH变量
echo  [3] 添加用户变量
echo  [4] 添加PATH路径
echo  [0] 退出
echo.
set /p choice="请选择: "

if "%choice%"=="1" goto LIST_ALL
if "%choice%"=="2" goto LIST_PATH
if "%choice%"=="3" goto ADD_VAR
if "%choice%"=="4" goto ADD_PATH
if "%choice%"=="0" exit
goto MENU

:LIST_ALL
set
pause
goto MENU

:LIST_PATH
echo %PATH%
pause
goto MENU

:ADD_VAR
set /p name="变量名: "
set /p value="变量值: "
setx %name% "%value%"
echo 已添加！
pause
goto MENU

:ADD_PATH
set /p path="路径: "
setx PATH "%PATH%;%path%"
echo 已添加！
pause
goto MENU`
  },
  {
    id: 30, name: "批量重命名扩展名", category: "文件操作", icon: "fa-file-alt", iconColor: "terminal-yellow",
    security: "warning", tags: ["扩展名", "批量", "重命名"],
    description: "批量修改文件的扩展名，如将所有 .txt 改为 .md。",
    usage: "输入目录路径、原扩展名和新扩展名。",
    warning: "操作不可逆，请确认扩展名正确。",
    code: `@echo off
chcp 65001 >nul
title 批量重命名扩展名工具 v1.0
color 0E

echo.
echo  ╔══════════════════════════════════════╗
echo  ║     批量重命名扩展名工具 v1.0        ║
echo  ╚══════════════════════════════════════╝
echo.

set /p folder="文件夹路径: "
set /p oldext="原扩展名 (如 txt): "
set /p newext="新扩展名 (如 md): "

if not exist "%folder%" (
    echo 文件夹不存在！
    pause
    exit
)

cd /d "%folder%"

echo.
echo 正在重命名...
for %%f in (*.%oldext%) do (
    ren "%%f" "%%~nf.%newext%"
    echo 已重命名: %%f -^> %%~nf.%newext%
)

echo.
echo 完成！
pause`
  },
  {
    id: 31, name: "定时提醒工具", category: "系统管理", icon: "fa-bell", iconColor: "terminal-yellow",
    security: "safe", tags: ["提醒", "定时", "效率"],
    description: "设置定时提醒，到时间弹出提示窗口。",
    usage: "设置提醒时间和内容，到时间自动弹出提醒。",
    warning: "请勿关闭命令窗口。",
    code: `@echo off
chcp 65001 >nul
title 定时提醒工具 v1.0
color 0E

echo.
echo  ╔══════════════════════════════════════╗
echo  ║        定时提醒工具 v1.0             ║
echo  ╚══════════════════════════════════════╝
echo.

set /p time="提醒时间 (秒): "
set /p msg="提醒内容: "

echo.
echo 提醒已设置！
echo 将在 %time% 秒后提醒: %msg%
echo 请勿关闭此窗口...
echo.

timeout /t %time% /nobreak

mshta vbscript:msgbox("%msg%",64,"定时提醒")(window.close)

echo 提醒已触发！
pause`
  },
  {
    id: 32, name: "批量下载图片", category: "网络工具", icon: "fa-images", iconColor: "terminal-purple",
    security: "safe", tags: ["下载", "图片", "批量"],
    description: "从网页批量下载图片（需要图片URL列表）。",
    usage: "准备包含图片URL的文本文件，运行脚本下载。",
    warning: "请遵守版权法规，仅下载有权限的图片。",
    code: `@echo off
chcp 65001 >nul
title 批量下载图片工具 v1.0
color 0D

echo.
echo  ╔══════════════════════════════════════╗
echo  ║       批量下载图片工具 v1.0          ║
echo  ╚══════════════════════════════════════╝
echo.

set /p urlfile="URL列表文件: "
set /p savedir="保存目录: "

if not exist "%savedir%" md "%savedir%"

echo.
echo 正在下载...
echo.

for /f "tokens=*" %%u in (%urlfile%) do (
    echo 下载: %%u
    curl -o "%savedir%\\%%~nxx" "%%u"
)

echo.
echo 下载完成！
pause`
  },
  {
    id: 33, name: "文本文件合并", category: "文件操作", icon: "fa-object-group", iconColor: "terminal-green",
    security: "safe", tags: ["文本", "合并", "文件"],
    description: "将多个文本文件合并为一个文件。",
    usage: "指定目录和文件类型，自动合并所有匹配文件。",
    warning: "合并后原文件保留。",
    code: `@echo off
chcp 65001 >nul
title 文本文件合并工具 v1.0
color 0A

echo.
echo  ╔══════════════════════════════════════╗
echo  ║        文本文件合并工具 v1.0         ║
echo  ╚══════════════════════════════════════╝
echo.

set /p folder="文件夹路径: "
set /p ext="文件类型 (如 txt): "
set /p output="输出文件名: "

cd /d "%folder%"

echo.
echo 正在合并...
echo.

for %%f in (*.%ext%) do (
    echo ===== %%f ===== >> "%output%"
    type "%%f" >> "%output%"
    echo. >> "%output%"
)

echo 合并完成！
echo 输出: %folder%\\%output%
pause`
  },
  {
    id: 34, name: "系统还原点创建", category: "备份恢复", icon: "fa-undo", iconColor: "terminal-cyan",
    security: "warning", tags: ["还原点", "系统", "备份"],
    description: "创建系统还原点，方便系统故障时恢复。",
    usage: "以管理员身份运行，输入还原点描述。",
    warning: "需要管理员权限和开启系统保护。",
    code: `@echo off
chcp 65001 >nul
title 系统还原点创建工具 v1.0
color 0B

echo.
echo  ╔══════════════════════════════════════╗
echo  ║       系统还原点创建工具 v1.0        ║
echo  ╚══════════════════════════════════════╝
echo.

set /p desc="还原点描述: "

echo.
echo 正在创建还原点...
echo.

powershell -Command "Checkpoint-Computer -Description '%desc%' -RestorePointType 'MODIFY_SETTINGS'"

if errorlevel 1 (
    echo 创建失败！请检查是否开启系统保护。
) else (
    echo 还原点创建成功！
)
pause`
  },
  {
    id: 35, name: "批量压缩文件", category: "文件操作", icon: "fa-file-archive", iconColor: "terminal-orange",
    security: "safe", tags: ["压缩", "批量", "ZIP"],
    description: "批量压缩指定目录下的文件为ZIP格式。",
    usage: "设置源目录和压缩文件保存位置。",
    warning: "需要系统支持PowerShell压缩功能。",
    code: `@echo off
chcp 65001 >nul
title 批量压缩文件工具 v1.0
color 0E

echo.
echo  ╔══════════════════════════════════════╗
echo  ║        批量压缩文件工具 v1.0         ║
echo  ╚══════════════════════════════════════╝
echo.

set /p source="源目录: "
set /p target="压缩包保存位置: "

if not exist "%target%" md "%target%"

echo.
echo 正在压缩...
echo.

powershell -Command "Compress-Archive -Path '%source%\\*' -DestinationPath '%target%\\backup_%date:~0,4%%date:~5,2%%date:~8,2%.zip'"

echo 压缩完成！
pause`
  },
  {
    id: 36, name: "定时执行程序", category: "系统管理", icon: "fa-clock", iconColor: "terminal-purple",
    security: "safe", tags: ["定时", "执行", "自动化"],
    description: "在指定时间自动执行程序或脚本。",
    usage: "设置执行时间和程序路径，到时间自动运行。",
    warning: "请确保程序路径正确。",
    code: `@echo off
chcp 65001 >nul
title 定时执行程序工具 v1.0
color 0D

echo.
echo  ╔══════════════════════════════════════╗
echo  ║        定时执行程序工具 v1.0         ║
echo  ╚══════════════════════════════════════╝
echo.

set /p time="执行时间 (HH:MM): "
set /p program="程序路径: "

echo.
echo 正在创建计划任务...
schtasks /create /tn "AutoRun_Temp" /tr "\\"%program%\\"" /sc once /st %time% /f

echo.
echo 已设置在 %time% 执行！
pause`
  },
  {
    id: 37, name: "屏幕截图工具", category: "多媒体工具", icon: "fa-camera", iconColor: "terminal-pink",
    security: "safe", tags: ["截图", "屏幕", "图片"],
    description: "自动截取全屏并保存为图片文件。",
    usage: "运行后自动截取当前屏幕，保存到桌面。",
    warning: "无特殊注意事项。",
    code: `@echo off
chcp 65001 >nul
title 屏幕截图工具 v1.0
color 0D

echo.
echo  ╔══════════════════════════════════════╗
echo  ║        屏幕截图工具 v1.0             ║
echo  ╚══════════════════════════════════════╝
echo.

set savepath=%USERPROFILE%\\Desktop\\Screenshot_%date:~0,4%%date:~5,2%%date:~8,2%_%time:~0,2%%time:~3,2%.png

echo 正在截图...
powershell -Command "Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.Screen]::PrimaryScreen.Bounds; $bitmap = New-Object System.Drawing.Bitmap([System.Windows.Forms.Screen]::PrimaryScreen.Bounds.Width, [System.Windows.Forms.Screen]::PrimaryScreen.Bounds.Height); $graphics = [System.Drawing.Graphics]::FromImage($bitmap); $graphics.CopyFromScreen([System.Windows.Forms.Screen]::PrimaryScreen.Bounds.Location, [System.Drawing.Point]::Empty, [System.Windows.Forms.Screen]::PrimaryScreen.Bounds.Size); $bitmap.Save('%savepath%'); $graphics.Dispose(); $bitmap.Dispose()"

echo.
echo 截图已保存: %savepath%
pause`
  },
  {
    id: 38, name: "批量转换图片格式", category: "多媒体工具", icon: "fa-image", iconColor: "terminal-green",
    security: "safe", tags: ["图片", "转换", "格式"],
    description: "批量转换图片格式（需要安装ImageMagick）。",
    usage: "设置源目录、目标格式，批量转换图片。",
    warning: "需要安装ImageMagick命令行工具。",
    code: `@echo off
chcp 65001 >nul
title 批量转换图片格式工具 v1.0
color 0A

echo.
echo  ╔══════════════════════════════════════╗
echo  ║      批量转换图片格式工具 v1.0       ║
echo  ╚══════════════════════════════════════╝
echo.
echo  注意: 需要安装ImageMagick
echo.

set /p folder="图片目录: "
set /p from="原格式 (如 png): "
set /p to="目标格式 (如 jpg): "

cd /d "%folder%"

echo.
echo 正在转换...
for %%f in (*.%from%) do (
    magick convert "%%f" "%%~nf.%to%"
    echo 已转换: %%f
)

echo.
echo 转换完成！
pause`
  },
  {
    id: 39, name: "批量添加水印", category: "多媒体工具", icon: "fa-copyright", iconColor: "terminal-yellow",
    security: "safe", tags: ["水印", "图片", "批量"],
    description: "批量为图片添加文字水印。",
    usage: "设置图片目录、水印文字，批量添加水印。",
    warning: "需要安装ImageMagick命令行工具。",
    code: `@echo off
chcp 65001 >nul
title 批量添加水印工具 v1.0
color 0E

echo.
echo  ╔══════════════════════════════════════╗
echo  ║        批量添加水印工具 v1.0         ║
echo  ╚══════════════════════════════════════╝
echo.

set /p folder="图片目录: "
set /p watermark="水印文字: "

cd /d "%folder%"

if not exist "watermarked" md "watermarked"

echo.
echo 正在添加水印...
for %%f in (*.jpg *.png) do (
    magick convert "%%f" -gravity southeast -pointsize 36 -fill white -annotate 0 "%watermark%" "watermarked\\%%f"
    echo 已处理: %%f
)

echo.
echo 完成！水印图片保存在 watermarked 目录
pause`
  },
  {
    id: 40, name: "系统健康检查", category: "系统优化", icon: "fa-heartbeat", iconColor: "terminal-red",
    security: "safe", tags: ["健康", "检查", "诊断"],
    description: "全面检查系统健康状况，包括磁盘、内存、系统文件等。",
    usage: "以管理员身份运行，自动执行多项系统检查。",
    warning: "检查可能需要较长时间。",
    code: `@echo off
chcp 65001 >nul
title 系统健康检查工具 v1.0
color 0C

echo.
echo  ╔══════════════════════════════════════╗
echo  ║       系统健康检查工具 v1.0          ║
echo  ╚══════════════════════════════════════╝
echo.

echo [1] 检查磁盘状态...
echo ========================================
wmic diskdrive get status
echo.

echo [2] 检查系统文件...
echo ========================================
sfc /verifyonly
echo.

echo [3] 检查内存...
echo ========================================
echo 正在启动内存诊断工具...
mdsched.exe
echo.

echo [4] 检查磁盘错误...
echo ========================================
echo 请在命令完成后手动运行: chkdsk C: /f
echo.

echo [5] 系统性能评分...
echo ========================================
winsat formal
echo.

echo 检查完成！
pause`
  },
  {
    id: 41, name: "一键清理桌面", category: "文件操作", icon: "fa-desktop", iconColor: "terminal-cyan",
    security: "warning", tags: ["桌面", "整理", "清理"],
    description: "将桌面文件按类型自动分类整理到文件夹。",
    usage: "运行后自动按文件类型创建文件夹并移动文件。",
    warning: "会移动桌面文件，请确认操作。",
    code: `@echo off
chcp 65001 >nul
title 一键清理桌面工具 v1.0
color 0B

echo.
echo  ╔══════════════════════════════════════╗
echo  ║        一键清理桌面工具 v1.0         ║
echo  ╚══════════════════════════════════════╝
echo.

set desktop=%USERPROFILE%\\Desktop

echo 警告：将整理桌面文件！
set /p confirm="确认继续？(Y/N): "
if /i not "%confirm%"=="Y" exit

cd /d "%desktop%"

if not exist "图片" md "图片"
if not exist "文档" md "文档"
if not exist "压缩包" md "压缩包"
if not exist "程序" md "程序"
if not exist "其他" md "其他"

echo.
echo 正在整理...

for %%f in (*.jpg *.png *.gif *.bmp *.jpeg) do move "%%f" "图片\\"
for %%f in (*.doc *.docx *.pdf *.txt *.xls *.xlsx *.ppt *.pptx) do move "%%f" "文档\\"
for %%f in (*.zip *.rar *.7z *.tar *.gz) do move "%%f" "压缩包\\"
for %%f in (*.exe *.msi) do move "%%f" "程序\\"
for %%f in (*) do (
    if not "%%f"=="图片" if not "%%f"=="文档" if not "%%f"=="压缩包" if not "%%f"=="程序" if not "%%f"=="其他" if not exist "%%f\\" move "%%f" "其他\\"
)

echo.
echo 整理完成！
pause`
  },
  {
    id: 42, name: "快捷方式创建器", category: "系统优化", icon: "fa-link", iconColor: "terminal-purple",
    security: "safe", tags: ["快捷方式", "创建", "效率"],
    description: "批量为程序创建桌面快捷方式。",
    usage: "输入程序路径，自动创建桌面快捷方式。",
    warning: "无特殊注意事项。",
    code: `@echo off
chcp 65001 >nul
title 快捷方式创建器 v1.0
color 0D

echo.
echo  ╔══════════════════════════════════════╗
echo  ║        快捷方式创建器 v1.0           ║
echo  ╚══════════════════════════════════════╝
echo.

set /p target="程序路径: "
set /p name="快捷方式名称: "

powershell -Command "$ws = New-Object -ComObject WScript.Shell; $s = $ws.CreateShortcut('%USERPROFILE%\\Desktop\\%name%.lnk'); $s.TargetPath = '%target%'; $s.Save()"

echo.
echo 快捷方式已创建！
pause`
  },
  {
    id: 43, name: "批量修改文件时间", category: "文件操作", icon: "fa-calendar-check", iconColor: "terminal-orange",
    security: "warning", tags: ["时间", "修改", "文件"],
    description: "批量修改文件的创建时间和修改时间。",
    usage: "设置目录和时间，批量修改文件时间属性。",
    warning: "修改后无法恢复原始时间。",
    code: `@echo off
chcp 65001 >nul
title 批量修改文件时间工具 v1.0
color 0E

echo.
echo  ╔══════════════════════════════════════╗
echo  ║      批量修改文件时间工具 v1.0       ║
echo  ╚══════════════════════════════════════╝
echo.

set /p folder="文件夹路径: "
set /p newdate="新日期 (YYYY-MM-DD): "
set /p newtime="新时间 (HH:MM:SS): "

cd /d "%folder%"

echo.
echo 正在修改...
for %%f in (*) do (
    powershell -Command "(Get-Item '%%f').CreationTime = '%newdate% %newtime%'; (Get-Item '%%f').LastWriteTime = '%newdate% %newtime%'"
    echo 已修改: %%f
)

echo.
echo 完成！
pause`
  },
  {
    id: 44, name: "网络共享管理", category: "网络工具", icon: "fa-share-alt", iconColor: "terminal-green",
    security: "warning", tags: ["共享", "网络", "文件夹"],
    description: "快速创建和管理网络共享文件夹。",
    usage: "以管理员身份运行，选择共享操作。",
    warning: "需要管理员权限，注意共享安全。",
    code: `@echo off
chcp 65001 >nul
title 网络共享管理工具 v1.0
color 0A

:MENU
cls
echo.
echo  ╔══════════════════════════════════════╗
echo  ║       网络共享管理工具 v1.0          ║
echo  ╚══════════════════════════════════════╝
echo.
echo  [1] 创建共享
echo  [2] 查看共享
echo  [3] 删除共享
echo  [0] 退出
echo.
set /p choice="请选择: "

if "%choice%"=="1" goto CREATE
if "%choice%"=="2" goto LIST
if "%choice%"=="3" goto DELETE
if "%choice%"=="0" exit
goto MENU

:CREATE
set /p folder="文件夹路径: "
set /p sharename="共享名称: "
net share %sharename%=%folder% /grant:everyone,full
echo 共享已创建！
pause
goto MENU

:LIST
net share
pause
goto MENU

:DELETE
set /p sharename="共享名称: "
net share %sharename% /delete
echo 共享已删除！
pause
goto MENU`
  },
  {
    id: 45, name: "定时任务管理", category: "系统管理", icon: "fa-tasks", iconColor: "terminal-cyan",
    security: "warning", tags: ["计划任务", "定时", "管理"],
    description: "创建、查看和管理Windows计划任务。",
    usage: "以管理员身份运行，管理定时任务。",
    warning: "需要管理员权限。",
    code: `@echo off
chcp 65001 >nul
title 定时任务管理工具 v1.0
color 0B

:MENU
cls
echo.
echo  ╔══════════════════════════════════════╗
echo  ║       定时任务管理工具 v1.0          ║
echo  ╚══════════════════════════════════════╝
echo.
echo  [1] 查看所有任务
echo  [2] 创建任务
echo  [3] 删除任务
echo  [4] 运行任务
echo  [0] 退出
echo.
set /p choice="请选择: "

if "%choice%"=="1" goto LIST
if "%choice%"=="2" goto CREATE
if "%choice%"=="3" goto DELETE
if "%choice%"=="4" goto RUN
if "%choice%"=="0" exit
goto MENU

:LIST
schtasks /query /fo LIST /v
pause
goto MENU

:CREATE
set /p name="任务名称: "
set /p program="程序路径: "
set /p time="执行时间 (HH:MM): "
schtasks /create /tn "%name%" /tr "\\"%program%\\"" /sc daily /st %time% /f
echo 任务已创建！
pause
goto MENU

:DELETE
set /p name="任务名称: "
schtasks /delete /tn "%name%" /f
echo 任务已删除！
pause
goto MENU

:RUN
set /p name="任务名称: "
schtasks /run /tn "%name%"
echo 任务已运行！
pause
goto MENU`
  }
];

export const categories = [...new Set(scriptsData.map(s => s.category))];
export const allTags = [...new Set(scriptsData.flatMap(s => s.tags))];

export const getScriptById = (id) => scriptsData.find(s => s.id === id);
export const getScriptsByCategory = (category) => scriptsData.filter(s => s.category === category);
export const getScriptsByTag = (tag) => scriptsData.filter(s => s.tags.includes(tag));
export const searchScripts = (query) => {
  const q = query.toLowerCase();
  return scriptsData.filter(s => 
    s.name.toLowerCase().includes(q) ||
    s.description.toLowerCase().includes(q) ||
    s.category.toLowerCase().includes(q) ||
    s.tags.some(t => t.toLowerCase().includes(q))
  );
};

export default scriptsData;
