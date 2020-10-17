Most of the scaffolding needed for making a Shopify app using Vue, Express, GraphQL, and AWS Lambda.

#### Requirements

- Remove the `sample` part of the filename `.sample.env` and fill in values

- An AWS Lambda function + API Gateway (iac to come) (with lambda name `magnet-lambda-function-[STAGE]`)

- An AWS user with Lambda policy to deploy

- `aws-cli` (`pip3 install awscli --upgrade --user`) (more installation options [here](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html))

#### Backend development

```
cd backend
npm install
npm start
// Listening on localhost:3000
```

#### Frontend development:

```
cd frontend
npm install
npm start
// Listening on localhost:8081
```

#### Shopify App Development

To start working on this app in Shopify:

1. `cd backend && npm start` to the start the dev server on port `3000`

2. `npm install -g ngrok && ngrok http 3000` to expose the server to the outside world

3. Login to `partners.shopify.com`

4. `Apps` > `Create App`

5. Name your app and set:

```
# App Url
https://[hostname provided by ngrok]/authenticate

# Allowed redirection URL(s)
https://[hostname provided by ngrok]/auth/callback
```

6. Create your `.env` file: `cp .sample.env .env`

7. Copy the `API key` from the Shopify dashboard to `SHOPIPY_API_KEY`

8. Copy the `API secret key` from the Shopify dashboard to `SHOPIPY_API_SECRET_KEY`

7. Click `Test your app` and install the app on your test store

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
