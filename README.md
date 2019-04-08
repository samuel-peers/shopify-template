#### Requirements

A `.env` file with the following the format:

```bash
export DYNAMO_REGION='xxxx'
export LOCAL='xxxx'
export SESSION_NAME='xxxx'
export SESSION_SECRET='xxxx'
export SHOPIFY_API_KEY='xxxx'
export SHOPIFY_API_SECRET_KEY='xxxx'
```

An AWS Lambda function (consumes output of `source zipper.sh`).

A Redis server (follow the setup guide [here](https://medium.com/@feliperohdee/installing-redis-to-an-aws-ec2-machine-2e2c4c443b68)).

#### Install

```
npm install
```

Known npm package issues: https://github.com/NodeRedis/node_redis/issues/790

#### Compile and hotload frontend:

```
npm run frontend-server
// Go to localhost:8080
```

#### Compile and run backend server (no hotloading yet):

```
npm run backend-server
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

#### Zip for cloud consumption:

```
source zipper.sh
```

#### Customize Vue configuration

See [Configuration Reference](https://cli.vuejs.org/config/)
