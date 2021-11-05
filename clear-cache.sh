#!/usr/bin/env bash

removeFolders() {
    echo $(rm -rf ./node_modules)
    echo $(rm -rf ./ios/Pods)
    echo $(rm -rf ./ios/DerivedData)
}

clearWatchman() {
    echo $(watchman watch-del-all)
}

init() {
    removeFolders
    clearWatchman
}

init
