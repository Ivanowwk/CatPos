; Inno Setup script to package the built site files
; Define a version from the command line with /DMyAppVersion=1.0.0
#define MyAppVersion "1.0.0"

[Setup]
AppName=CatPos
AppVersion={#MyAppVersion}
DefaultDirName={pf}\CatPos
DefaultGroupName=CatPos
OutputBaseFilename=CatPos-Setup-{#MyAppVersion}
Compression=lzma2
SolidCompression=yes

; Source directory is prepared by MakeInstaller.ps1 (installer_build\app)
#define SourceDir "installer_build\\app"

[Files]
Source: "{#SourceDir}\\*"; DestDir: "{app}"; Flags: recursesubdirs createallsubdirs

[Icons]
Name: "{group}\CatPos"; Filename: "{app}\index.html"; WorkingDir: "{app}"
Name: "{commondesktop}\CatPos"; Filename: "{app}\index.html"; WorkingDir: "{app}"
