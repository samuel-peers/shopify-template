.PHONY: build-deploy-bucket
build-deploy-bucket:
	(cd deploy_bucket && terraform apply -auto-approve)


.PHONY: deploy
deploy: build-deploy-bucket
	./deploy.sh


.PHONY: build-server
build-server: deploy
	terraform apply -auto-approve
