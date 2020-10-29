import awsServerlessExpress from 'aws-serverless-express';
import createApp from './business/app';

const frontendPath = './secure';

const app = createApp(frontendPath);

const binaryMimeTypes = ['image/png'];

const server = awsServerlessExpress.createServer(app, null, binaryMimeTypes);

exports.handler = (event, context) => {
  awsServerlessExpress.proxy(server, event, context);
};
