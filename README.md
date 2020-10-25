Most of the scaffolding needed for making a Shopify app using Vue, Express, GraphQL, and AWS Lambda.

#### Requirements

- `aws-cli` (`sudo apt install awscli`) (more installation options [here](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html))

#### Backend development

Remove the `sample` part of the filename `.sample.env` and fill in values.

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
https://[hostname provided by ngrok]/install

# Allowed redirection URL(s)
https://[hostname provided by ngrok]/auth/callback
```

6. Create your `.env` file: `cp .sample.env .env`

7. Copy the `API key` from the Shopify dashboard to `SHOPIPY_API_KEY`

8. Copy the `API secret key` from the Shopify dashboard to `SHOPIPY_API_SECRET_KEY`

7. Click `Test your app` and install the app on your test store

#### Infrastructure:

Uses terraform, run `cd infra`.

1. Remove the `sample` part of the filename `.sample.env` and fill in values
2. Create values for the terraform `variables.tf`
3. `make build-deploy-bucket` to create an S3 bucket to store the build artifact
4. `make deploy` to bundle the backend and push to the S3 bucket
5. `make build-server` to create the API Gateway and Lambda function

The `url` output of `make build-server` can be used when setting up the app in `partners.shopify.com`.

#### Customize Vue configuration

See [Configuration Reference](https://cli.vuejs.org/config/)

#### Helpful stuff

Vue [devtools](https://github.com/vuejs/vue-devtools)
