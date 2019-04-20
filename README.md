#### Requirements

- A `.env` file with the following format:

```bash
export LAMBDA_FUNCTION_NAME='xxxx'
export BASE_URL='xxxx'
export SHOPIFY_API_KEY='xxxx'
export SHOPIFY_API_SECRET_KEY='xxxx'
export SECRET_KEY='xxxx'
```

- An AWS Lambda function + API Gateway (iac to come) (with name `LAMBDA_FUNCTION_NAME`)

- An AWS user with Lambda policy to deploy

- Git flow (`sudo apt-get install git-flow`)

- `aws-cli` (`pip3 install awscli --upgrade --user`) (more installation options [here](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html))

#### Install

```
npm install
```

#### Compile and hotload frontend:

```
npm run run-frontend
// Go to localhost:8080
```

#### Compile and watch backend:

```
npm run watch-backend
// Go to localhost:3000
```

#### Run backend server:

```
npm run run-backend
// Go to localhost:3000
```

#### Compile frontend and backend server

```
npm run build
```

#### To run all the above steps in tmux sessions:

```
source tmux.sh
```

#### Deploy:

```
source deploy.sh
// uses $LAMBDA_FUNCTION_NAME
```

#### Customize Vue configuration

See [Configuration Reference](https://cli.vuejs.org/config/)

#### Helpful stuff

Vue [devtools](https://github.com/vuejs/vue-devtools)
