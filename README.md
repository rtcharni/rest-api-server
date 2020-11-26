# Node REST API Server

## How to use

- Install node ( >= 10) on machine. Run `index.js` file in rest-api-server root folder with command `node index.js`. Or,
- Install and require rest-api-server package as node depedency. Create new server object and invoke server run method. Port and server host address can also be assigned when creating server object with two parameters.

```javascript
const api = require('rest-api-server');
const server = new api.Server(); // || new api.Server(1234, 'https://myawesomesite.com)
server.run();
```

## Options

Application uses two different environment variables `API_PORT` & `API_HOST_ADDRESS`.

- Select on which port api server runs with `API_PORT` - default `8080`.
- Tell to application what is the host address with `API_HOST_ADDRESS` - default `http://localhost`.
