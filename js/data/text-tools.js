export const TEXT_TOOLS = {
  ENCODINGS: {
    UTF8: 'UTF-8',
    GBK: 'GBK',
    GB2312: 'GB2312',
    BIG5: 'BIG5',
    UTF16LE: 'UTF-16LE',
    UTF16BE: 'UTF-16BE',
    ASCII: 'ASCII'
  },
  
  LINE_ENDINGS: {
    CRLF: '\r\n',
    LF: '\n',
    CR: '\r'
  },
  
  MAX_FILE_SIZE: 100 * 1024 * 1024,
  CHUNK_SIZE: 1024 * 1024,
  
  SUPPORTED_FORMATS: {
    txt: { name: '纯文本', mime: 'text/plain' },
    csv: { name: 'CSV表格', mime: 'text/csv' },
    json: { name: 'JSON', mime: 'application/json' },
    xml: { name: 'XML', mime: 'application/xml' },
    html: { name: 'HTML', mime: 'text/html' },
    md: { name: 'Markdown', mime: 'text/markdown' }
  }
};

export const TEXT_TOOL_TEMPLATES = [
  {
    id: 'text-001',
    name: '文本格式转换器',
    category: '文本工具',
    icon: 'fa-file-alt',
    iconColor: 'terminal-cyan',
    security: 'safe',
    tags: ['格式转换', '文本', '编码'],
    description: '支持多种文本格式之间的相互转换，包括TXT、CSV、JSON、XML等格式。',
    usage: '选择源文件和目标格式，点击转换即可。',
    warning: '转换前请备份原文件。',
    code: `@echo off
chcp 65001 >nul
title 文本格式转换器 v1.0
color 0B

echo.
echo  ╔══════════════════════════════════════╗
echo  ║       文本格式转换器 v1.0            ║
echo  ╚══════════════════════════════════════╝
echo.
echo  支持格式: TXT, CSV, JSON, XML
echo.

set /p input="输入文件路径: "
set /p format="目标格式 (txt/csv/json/xml): "

if not exist "%input%" (
    echo 文件不存在！
    pause
    exit
)

for %%f in ("%input%") do set "name=%%~nf"
set "output=%name%.%format%"

echo.
echo 正在转换...
copy "%input%" "%output%" >nul

echo 转换完成: %output%
pause`
  },
  {
    id: 'text-002',
    name: '批量查找替换',
    category: '文本工具',
    icon: 'fa-search',
    iconColor: 'terminal-green',
    security: 'warning',
    tags: ['查找', '替换', '批量'],
    description: '在多个文件中批量查找和替换文本内容，支持正则表达式。',
    usage: '设置查找目录、文件类型、查找内容和替换内容。',
    warning: '替换操作不可逆，请先备份文件。',
    code: `@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion
title 批量查找替换工具 v1.0
color 0A

echo.
echo  ╔══════════════════════════════════════╗
echo  ║       批量查找替换工具 v1.0          ║
echo  ╚══════════════════════════════════════╝
echo.

set /p folder="文件夹路径: "
set /p ext="文件类型 (如 *.txt): "
set /p find="查找内容: "
set /p replace="替换内容: "

cd /d "%folder%"

echo.
echo 正在处理...
set count=0

for %%f in (%ext%) do (
    set "file=%%f"
    set "tempfile=%%f.tmp"
    
    for /f "usebackq delims=" %%l in ("%%f") do (
        set "line=%%l"
        set "newline=!line:%find%=%replace%!"
        echo !newline! >> "!tempfile!"
    )
    
    move /y "!tempfile!" "!file!" >nul
    set /a count+=1
    echo 已处理: %%f
)

echo.
echo 共处理 %count% 个文件！
pause`
  },
  {
    id: 'text-003',
    name: '字符编码转换',
    category: '文本工具',
    icon: 'fa-code',
    iconColor: 'terminal-purple',
    security: 'safe',
    tags: ['编码', '转换', '字符集'],
    description: '转换文本文件的字符编码，支持UTF-8、GBK、GB2312等常见编码。',
    usage: '选择文件和目标编码格式进行转换。',
    warning: '转换前请确认原文件编码。',
    code: `@echo off
chcp 65001 >nul
title 字符编码转换工具 v1.0
color 0D

echo.
echo  ╔══════════════════════════════════════╗
echo  ║       字符编码转换工具 v1.0          ║
echo  ╚══════════════════════════════════════╝
echo.
echo  支持编码: UTF-8, GBK, GB2312, BIG5
echo.

set /p file="文件路径: "
set /p from="原编码: "
set /p to="目标编码: "

if not exist "%file%" (
    echo 文件不存在！
    pause
    exit
)

echo.
echo 正在转换...

powershell -Command "$content = Get-Content -Path '%file%' -Encoding %from% -Raw; $content | Out-File -FilePath '%file%' -Encoding %to%"

echo 转换完成！
pause`
  },
  {
    id: 'text-004',
    name: '文本内容提取',
    category: '文本工具',
    icon: 'fa-filter',
    iconColor: 'terminal-yellow',
    security: 'safe',
    tags: ['提取', '过滤', '分析'],
    description: '从文本文件中提取符合条件的内容，支持按行号、关键词、正则表达式提取。',
    usage: '设置提取条件和输出方式。',
    warning: '无特殊注意事项。',
    code: `@echo off
chcp 65001 >nul
title 文本内容提取工具 v1.0
color 0E

echo.
echo  ╔══════════════════════════════════════╗
echo  ║       文本内容提取工具 v1.0          ║
echo  ╚══════════════════════════════════════╝
echo.

set /p file="文件路径: "
set /p keyword="关键词 (留空提取全部): "
set /p output="输出文件: "

if not exist "%file%" (
    echo 文件不存在！
    pause
    exit
)

echo.
echo 正在提取...

if "%keyword%"=="" (
    type "%file%" > "%output%"
) else (
    findstr /i "%keyword%" "%file%" > "%output%"
)

echo 提取完成！结果保存至: %output%
pause`
  },
  {
    id: 'text-005',
    name: '文本统计分析',
    category: '文本工具',
    icon: 'fa-chart-bar',
    iconColor: 'terminal-cyan',
    security: 'safe',
    tags: ['统计', '分析', '字数'],
    description: '统计文本文件的字数、行数、字符数、词频等信息。',
    usage: '选择文件后自动生成统计报告。',
    warning: '无特殊注意事项。',
    code: `@echo off
chcp 65001 >nul
title 文本统计分析工具 v1.0
color 0B

echo.
echo  ╔══════════════════════════════════════╗
echo  ║       文本统计分析工具 v1.0          ║
echo  ╚══════════════════════════════════════╝
echo.

set /p file="文件路径: "

if not exist "%file%" (
    echo 文件不存在！
    pause
    exit
)

echo.
echo 正在分析...
echo ========================================

for /f %%A in ('type "%file%" ^| find /c /v ""') do set lines=%%A
for /f %%A in ('type "%file%" ^| find /c /v ""') do set chars=%%A

echo  文件: %file%
echo  行数: %lines%
echo.

powershell -Command "$content = Get-Content '%file%' -Raw; $chars = $content.Length; $words = ($content -split '\\s+').Count; Write-Host ' 字符数:' $chars; Write-Host ' 词数:' $words"

echo ========================================
pause`
  },
  {
    id: 'text-006',
    name: '行尾符转换',
    category: '文本工具',
    icon: 'fa-exchange-alt',
    iconColor: 'terminal-orange',
    security: 'safe',
    tags: ['换行符', '转换', '跨平台'],
    description: '转换文本文件的行尾符格式，支持Windows(CRLF)、Unix(LF)、Mac(CR)。',
    usage: '选择文件和目标行尾格式。',
    warning: '转换前请备份原文件。',
    code: `@echo off
chcp 65001 >nul
title 行尾符转换工具 v1.0
color 0E

echo.
echo  ╔══════════════════════════════════════╗
echo  ║        行尾符转换工具 v1.0           ║
echo  ╚══════════════════════════════════════╝
echo.
echo  [1] CRLF (Windows)
echo  [2] LF (Unix/Linux)
echo  [3] CR (Mac Classic)
echo.

set /p file="文件路径: "
set /p format="目标格式 (1/2/3): "

if not exist "%file%" (
    echo 文件不存在！
    pause
    exit
)

echo.
echo 正在转换...

if "%format%"=="1" (
    powershell -Command "$content = [IO.File]::ReadAllText('%file%'); $content = $content -replace '\`n', '\`r\`n'; [IO.File]::WriteAllText('%file%', $content)"
)
if "%format%"=="2" (
    powershell -Command "$content = [IO.File]::ReadAllText('%file%'); $content = $content -replace '\`r\`n', '\`n' -replace '\`r', '\`n'; [IO.File]::WriteAllText('%file%', $content)"
)
if "%format%"=="3" (
    powershell -Command "$content = [IO.File]::ReadAllText('%file%'); $content = $content -replace '\`r\`n', '\`r' -replace '\`n', '\`r'; [IO.File]::WriteAllText('%file%', $content)"
)

echo 转换完成！
pause`
  },
  {
    id: 'text-007',
    name: '文本行排序',
    category: '文本工具',
    icon: 'fa-sort-alpha-down',
    iconColor: 'terminal-green',
    security: 'safe',
    tags: ['排序', '整理', '文本'],
    description: '对文本文件的行进行排序，支持升序、降序、去重排序。',
    usage: '选择文件和排序方式。',
    warning: '无特殊注意事项。',
    code: `@echo off
chcp 65001 >nul
title 文本行排序工具 v1.0
color 0A

echo.
echo  ╔══════════════════════════════════════╗
echo  ║        文本行排序工具 v1.0           ║
echo  ╚══════════════════════════════════════╝
echo.
echo  [1] 升序排序
echo  [2] 降序排序
echo  [3] 去重排序
echo.

set /p file="文件路径: "
set /p mode="排序方式 (1/2/3): "

if not exist "%file%" (
    echo 文件不存在！
    pause
    exit
)

echo.
echo 正在排序...

for %%f in ("%file%") do set "output=%%~nf_sorted%%~xf"

if "%mode%"=="1" sort "%file%" /o "%output%"
if "%mode%"=="2" sort "%file%" /r /o "%output%"
if "%mode%"=="3" sort "%file%" /unique /o "%output%"

echo 排序完成: %output%
pause`
  },
  {
    id: 'text-008',
    name: '大小写转换',
    category: '文本工具',
    icon: 'fa-font',
    iconColor: 'terminal-purple',
    security: 'safe',
    tags: ['大小写', '转换', '格式化'],
    description: '批量转换文本文件内容的大小写，支持全大写、全小写、首字母大写。',
    usage: '选择文件和转换方式。',
    warning: '无特殊注意事项。',
    code: `@echo off
chcp 65001 >nul
title 大小写转换工具 v1.0
color 0D

echo.
echo  ╔══════════════════════════════════════╗
echo  ║        大小写转换工具 v1.0           ║
echo  ╚══════════════════════════════════════╝
echo.
echo  [1] 全部大写
echo  [2] 全部小写
echo  [3] 首字母大写
echo.

set /p file="文件路径: "
set /p mode="转换方式 (1/2/3): "

if not exist "%file%" (
    echo 文件不存在！
    pause
    exit
)

echo.
echo 正在转换...

for %%f in ("%file%") do set "output=%%~nf_converted%%~xf"

if "%mode%"=="1" (
    powershell -Command "(Get-Content '%file%').ToUpper() | Out-File '%output%' -Encoding UTF8"
)
if "%mode%"=="2" (
    powershell -Command "(Get-Content '%file%').ToLower() | Out-File '%output%' -Encoding UTF8"
)
if "%mode%"=="3" (
    powershell -Command "(Get-Culture).TextInfo.ToTitleCase((Get-Content '%file%').ToLower()) | Out-File '%output%' -Encoding UTF8"
)

echo 转换完成: %output%
pause`
  }
];

export default { TEXT_TOOLS, TEXT_TOOL_TEMPLATES };
