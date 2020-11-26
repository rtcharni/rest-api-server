const { Server } = require('./server');

const server = new Server(process.env.API_PORT, process.env.API_HOST_ADDRESS);
server.run();
