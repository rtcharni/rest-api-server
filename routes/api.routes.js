const Router = require('express');
const { UrlController } = require('../controllers/url.controller');

// Could be splitted to many routers-files if many routes. Now no need to split anything.
class ApiRoutes {
  constructor() {
    this.router = Router();
    this.initUrlRoutes();
  }

  initUrlRoutes() {
    const urlController = new UrlController();
    this.router.use('', Router().get('/:urlId', urlController.getSavedUrl()).post('/', urlController.saveUrl()));
  }
}

exports.ApiRoutes = ApiRoutes;
