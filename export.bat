@echo off
title [convert excel to json]
echo start converting ....
cd %~dp0
node index.js --export
echo convert over!
@pause