#!/bin/bash 

RELEASE_BRANCH="master"
DEV_BRANCH="develop"
RELEASE_STAGE="release"
STAGING_STAGE="staging"
DEV_STAGE="dev"
TEST_STAGE="test"

LAMBDA_FUNCTION_NAME="magnet-lambda-function"

CURR_BRANCH=$(git symbolic-ref --short HEAD 2>/dev/null)

STAGE=

if [[ $CURR_BRANCH == *"feature/"* ]]
then
    STAGE=$TEST_STAGE
fi

if [[ $CURR_BRANCH == *"release/"* ]]
then
    STAGE=$STAGING_STAGE
fi

if [ $CURR_BRANCH = $RELEASE_BRANCH ]
then
    STAGE=$RELEASE_STAGE
fi

if [ $CURR_BRANCH = $DEV_BRANCH ]
then
    STAGE=$DEV_STAGE
fi

if [ -z $STAGE ]
then
    echo "No stage found for branch $CURR_BRANCH"
    echo "Supported branches:"
    echo $' - master\n - develop\n - feature/*\n - release/*'
else
    LAMBDA_FUNCTION_NAME="$LAMBDA_FUNCTION_NAME-$STAGE"

    exec < /dev/tty

    read -p "Release to $LAMBDA_FUNCTION_NAME? (Y/N): " confirm

    if [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]]
    then
        npm run build &&
        zip -r output.zip backend/dist/lambda-build.js frontend/dist/* -x node_modules/* &&
        aws lambda update-function-code --function-name $LAMBDA_FUNCTION_NAME --zip-file fileb://output.zip
    fi
fi
