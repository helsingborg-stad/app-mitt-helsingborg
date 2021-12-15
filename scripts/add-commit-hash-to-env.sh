if [ -f ".env" ]
then
    GIT_COMMIT_HASH=$(git rev-parse HEAD)

    if grep -q "^GIT_COMMIT_HASH=" .env
    then
        echo "updating git hash to .env: $GIT_COMMIT_HASH"
        cat .env | sed "s/^GIT_COMMIT_HASH=.*/GIT_COMMIT_HASH=$GIT_COMMIT_HASH/" > .env.temp
        cat .env.temp > .env
        rm .env.temp
    else

        echo "adding git hash to .env: $GIT_COMMIT_HASH"
        echo "GIT_COMMIT_HASH=$GIT_COMMIT_HASH" >> .env
    fi
else
    echo ".env not found! pwd is $(pwd)"
    exit 1
fi
