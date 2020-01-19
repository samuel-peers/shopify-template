#### Requirements

- Remove the `sample` part of the filename `.sample.env` and fill in values

- An AWS Lambda function + API Gateway (iac to come) (with lambda name `magnet-lambda-function-[STAGE]`)

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
```

Pushing to remote also triggers `deploy.sh`.

Add the `--no-verify` flag to skip deployment:

```
git push --no-verify origin [branch]
```

`deploy.sh` will deploy to the following lambda functions based on the current branch:

- `master = magnet-lambda-function-release`
- `develop = magnet-lambda-function-dev`
- `release/* = magnet-lambda-function-staging`
- `feature/* = magnet-lambda-function-test`

#### Customize Vue configuration

See [Configuration Reference](https://cli.vuejs.org/config/)

#### Helpful stuff

Vue [devtools](https://github.com/vuejs/vue-devtools)
