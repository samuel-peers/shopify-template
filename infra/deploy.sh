(cd ../backend && npm run build)

(cd ../frontend && npm run build)

(cd ../dist && zip -r lambda-build.zip lambda-build.js secure/*)

aws s3 cp \
	../dist/lambda-build.zip \
	"s3://$TF_VAR_deploy_bucket_name/$TF_VAR_app_version/lambda-build.zip"
