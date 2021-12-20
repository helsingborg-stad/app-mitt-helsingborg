#!/usr/bin/env bash

if command -v git &> /dev/null
then
    GIT_COMMIT_HASH=$(git rev-parse HEAD)

    if [ -f ".env" ] && grep -q "^GIT_COMMIT_HASH=" .env
    then
        echo "updating git hash to .env: $GIT_COMMIT_HASH"
        cat .env | sed "s/^GIT_COMMIT_HASH=.*/GIT_COMMIT_HASH=$GIT_COMMIT_HASH/" > .env.temp
        cat .env.temp > .env
        rm .env.temp
    else

        echo "adding git hash to .env: $GIT_COMMIT_HASH"
        echo -e "\nGIT_COMMIT_HASH=$GIT_COMMIT_HASH" >> .env
    fi
else
    echo "git not found - skipping commit hash update"
fi
