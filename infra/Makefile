include .env
export

.PHONY: build-deploy-bucket
build-deploy-bucket:
	(cd deploy_bucket && terraform apply -auto-approve)


.PHONY: deploy-app
deploy: build-deploy-bucket
	./deploy.sh


.PHONY: build-server
build-server:
	terraform apply -auto-approve
