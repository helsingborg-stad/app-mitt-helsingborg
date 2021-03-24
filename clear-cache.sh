#!/usr/bin/env bash

removeFolders() {
    echo $(rm -rf ./node_modules)
    echo $(rm -rf ./ios/Pods)
    echo $(rm -rf ./ios/DerivedData)
}

clearWatchman() {
    echo $(watchman watch-del-all)
}

install() {
    echo $(yarn install)
    echo $(cd ios;pod install)
}

init() {
    removeFolders
    clearWatchman
    install
}

init
