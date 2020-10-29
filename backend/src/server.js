const http = require('http');
const createApp = require('./business/app');

const frontendPath = '../../../dist/secure';

const app = createApp(frontendPath);

const server = http.createServer(app);
let currentApp = app;

server.listen(3000);

if (module.hot) {
  module.hot.accept('./app', () => {
    server.removeListener('request', currentApp);
    server.on('request', app);
    currentApp = app;
  });
}
