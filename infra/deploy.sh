zip output.zip testy.js

aws s3 cp output.zip "s3://shopify-app-deploy-bucket/$TF_VAR_app_version/output.zip"
