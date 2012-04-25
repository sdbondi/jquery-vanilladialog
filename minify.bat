@echo off

echo. Minifying JavaScript...

call yui-compressor.bat jquery-vanilladialog.js > jquery-vanilladialog.min.js
     
echo "done."