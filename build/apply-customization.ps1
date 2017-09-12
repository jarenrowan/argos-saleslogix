Param
(
    [Parameter(Mandatory = $true)]
    [String]$path
)
$exclude = @('README*', 'package.json', 'Gruntfile.js', '.git', 'gitignore', 'deploy');

Copy-Item -Path $path\* -Destination .\wwwroot -Recurse -Exclude $exclude -Force

(Get-Content .\index.aspx).replace('<!--{{modules}}-->', (Get-Content $path\module-fragment.html)) | Set-Content .\wwwroot\index.aspx
(Get-Content .\index-head.ascx).replace('//custom-namespace', (Get-Content $path\namespace.json)) | Set-Content .\wwwroot\index-head.ascx
