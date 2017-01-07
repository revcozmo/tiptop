@echo off
if %1!==! goto noMessage

git add *
git commit -m"%1"
git push --force

goto ende

:noMessage
echo Kommentar fehlt
goto ende

:ende