#!/bin/bash

set -e

if [ -z "$1" ]; then
    BRANCH="release"
else
    BRANCH=$1
fi

rm -rf srv
mkdir -p srv/{data,modules/js-module}

curl -s https://cdn.altv.mp/server/$BRANCH/x64_win32/altv-server.exe --output srv/altv-server.exe
curl -s https://cdn.altv.mp/server/$BRANCH/x64_linux/altv-server --output srv/altv-server

curl -s https://cdn.altv.mp/server/$BRANCH/x64_linux/data/vehmodels.bin --output srv/data/vehmodels.bin
curl -s https://cdn.altv.mp/server/$BRANCH/x64_linux/data/vehmods.bin --output srv/data/vehmods.bin
curl -s https://cdn.altv.mp/server/$BRANCH/x64_linux/data/clothes.bin --output srv/data/clothes.bin

curl -s https://cdn.altv.mp/js-module/$BRANCH/x64_win32/modules/js-module/libnode.dll --output srv/modules/js-module/libnode.dll
curl -s https://cdn.altv.mp/js-module/$BRANCH/x64_win32/modules/js-module/js-module.dll --output srv/modules/js-module/js-module.dll
curl -s https://cdn.altv.mp/js-module/$BRANCH/x64_linux/modules/js-module/libnode.so.72 --output srv/modules/js-module/libnode.so.72
curl -s https://cdn.altv.mp/js-module/$BRANCH/x64_linux/modules/js-module/libjs-module.so --output srv/modules/js-module/libjs-module.so
