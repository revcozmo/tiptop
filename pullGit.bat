@echo off
if %1!==! goto noURL

git pull %1

goto ende

:noURL
echo URL fehlt
goto ende

:ende