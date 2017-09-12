
if (Test-Path .\deploy) {
	Remove-Item -Path .\deploy -Recurse -Force
}

New-Item .\deploy\content\javascript -ItemType Directory
New-Item .\deploy\scripts -ItemType Directory

grunt clean:css clean:js less
yarn run build
grunt argos-deps
grunt uglify

Copy-Item index.html .\deploy
Copy-Item index.aspx .\deploy
Copy-Item index-nocache.html .\deploy
Copy-Item index-nocache.aspx .\deploy
Copy-Item unsupported.html .\deploy
Copy-Item manifest.appcache .\deploy
Copy-Item web.config .\deploy
Copy-Item ping.gif .\deploy
Copy-Item index.aspx.cs .\deploy
Copy-Item index-head.ascx .\deploy
Copy-Item index-body.ascx .\deploy
Copy-Item index-body.ascx.cs .\deploy
Copy-Item index.manifest .\deploy
Copy-Item index.manifest.ashx .\deploy
Copy-Item Global.asax .\deploy
Copy-Item template.manifest .\deploy
Copy-Item .\build\iis.ps1 .\deploy\scripts
Copy-Item .\localization .\deploy -Recurse -Container -Filter "*.js" # TODO clean up: this is creating empty folders as well
Copy-Item .\localization\locales .\deploy\localization\ -Recurse -Container -Filter "*.l20n" -Force
Copy-Item .\localization\saleslogix .\deploy\localization\ -Recurse -Container -Filter "*.js" -Force
Copy-Item .\content\images .\deploy\content\ -Recurse -Container
Copy-Item .\min\css .\deploy\content\ -Recurse -Container -Filter "*.css"
Copy-Item .\configuration .\deploy\ -Recurse -Container -Filter "*.js"
Copy-Item .\help .\deploy\ -Recurse -Container -Filter "*.html"
Copy-Item .\bin .\deploy\ -Recurse -Container -Filter "*.dll"
Copy-Item .\App_Code .\deploy\ -Recurse -Container -Filter "*.cs"
Copy-Item .\content\clippy.swf .\deploy\content

if (Test-Path ..\wwwroot\) {
    Remove-Item -Path ..\wwwroot\ -Recurse
}
Copy-Item -Path .\deploy -Destination ..\wwwroot -Recurse -Force
Copy-Item -Path ..\..\argos-sdk\deploy\* -Destination ..\wwwroot -Recurse -Force
