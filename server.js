const express = require('express');
const { ApiRoutes } = require('./routes/api.routes');
const cors = require('cors');

class Server {
  constructor(port = 8080, hostAddress = 'http://localhost') {
    this.server = express();
    this.port = port;
    // Not the best way, but fine for this app
    process.env.API_PORT = port;
    process.env.API_HOST_ADDRESS = hostAddress;
    this.initMiddlewares();
    this.initRoutes();
  }

  run() {
    this.server.listen(this.port, () => {
      console.log(`App is running on the port ${this.port}`);
    });
  }

  initMiddlewares() {
    // Cors enabled fully for any client from any origin to use this rest api. Could be changed to meet requirements.
    this.server.use(cors());
    this.server.use(express.json());
    // Should think about application security. E.g. Helmet package with different options.
  }

  initRoutes() {
    // Could use many routers if a lot of different routes.
    this.server.use('', new ApiRoutes().router);
  }
}

exports.Server = Server;
