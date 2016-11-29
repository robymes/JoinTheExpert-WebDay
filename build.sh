#!bin/bash
set -e
dotnet restore
rm -rf $PWD/publish/web
dotnet publish project.json -c release -o $PWD/publish/web