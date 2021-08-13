require('@babel/register')({});
require('core-js/stable');
require('regenerator-runtime/runtime');

const server = require('./server');

// It will valid in production mode
let PORT = parseInt(process.env.PORT);
if (!PORT) {
  // Development setup
  PORT = parseInt(process.env.DEV_PORT || 4000) + 1;
}

server.default.listen(PORT, () => {
  console.info('Server is listening on', PORT);
});
