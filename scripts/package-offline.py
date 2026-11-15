from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
root = Path(__file__).resolve().parent.parent
dist = root / 'dist'
out = root.parent / 'output'
out.mkdir(exist_ok=True)
target = out / 'For宣-免安装学习包-v1.zip'
with ZipFile(target, 'w', ZIP_DEFLATED) as z:
    for file in sorted(dist.rglob('*')):
        if file.is_file():
            z.write(file, Path('For宣') / file.relative_to(dist))
    z.writestr('For宣/一键打开.cmd', '@echo off\r\nstart "" "%~dp0index.html"\r\n')
    z.writestr('For宣/使用说明.txt', 'For宣 · 免安装学习包\n\n请先解压整个文件夹，再双击 index.html，或双击 一键打开.cmd。\n无需安装软件，电脑离线也可做题、查看解析与互动图象。\n请勿直接在压缩包内打开，以免资源缺失。\n\n记录保存在当前浏览器。更换设备或移动文件夹前，请在“复习与成长”导出记录。\n手机访问与二维码需要联网打开线上网站；手机与电脑记录可用 JSON 导入合并。\n网站：https://fivefingersmountain.github.io/for-xuan-liaoning-2026/\n\n证明题以纸上作答和清单自评为主，网站不自动批改手写证明。\n')
print(str(target))
