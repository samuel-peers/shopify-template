./.env &&
npm run build &&
zip -r output.zip backend/dist/lambda-build.js frontend/dist/* -x node_modules/* &&
aws lambda update-function-code --function-name $LAMBDA_FUNCTION_NAME --zip-file fileb://output.zip