const { param, body } = require('express-validator');
const { Utils } = require('../utils/utils');
const { UrlService } = require('../services/url.service');

class UrlController {
  urlService = new UrlService();

  getSavedUrl() {
    return [
      // Request param validators
      param('urlId').isAlphanumeric().isLength({ min: 16, max: 16 }),
      // Error handler for request params
      Utils.validatorHandler(),
      // Actual Request handler
      async (req, res, next) => {
        try {
          const url = this.urlService.getSavedUrl(req.params.urlId);
          return url ? res.send(url) : res.status(404).send(`No url matches with ID: ${req.params.urlId}`);
        } catch (error) {
          next(error);
        }
      },
      // Error handler
      Utils.errorHandler('Could not get saved url..'),
    ];
  }

  saveUrl() {
    return [
      // Request param validators
      body('url').isString(),
      // Error handler for request params
      Utils.validatorHandler(),
      // Actual Request handler
      async (req, res, next) => {
        try {
          const createdUrlId = this.urlService.saveUrl(req.body.url);
          console.log(`${process.env.API_HOST_ADDRESS}${process.env.API_PORT}`);
          if (createdUrlId) {
            return res.send(`${process.env.API_HOST_ADDRESS}:${process.env.API_PORT}/${createdUrlId}`);
          }

          res.status(500).send('Could not save new url..');
        } catch (error) {
          next(error);
        }
      },
      // Error handler
      Utils.errorHandler('Could not save new url..'),
    ];
  }
}

exports.UrlController = UrlController;
