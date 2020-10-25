(cd ../backend && npm run build)

zip lambda-build.zip ../backend/dist/lambda-build.js

aws s3 cp \
	lambda-build.zip \
	"s3://$TF_VAR_deploy_bucket_name/$TF_VAR_app_version/lambda-build.zip"
