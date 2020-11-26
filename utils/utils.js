const { validationResult } = require('express-validator');

// Could have multiple utils / helpers files / classes for different purposes.
class Utils {
  static validatorHandler() {
    return (req, res, next) => {
      const errors = validationResult(req);

      if (errors.mapped().urlId) {
        return res.status(422).send('Invalid Url ID. Please use only alphanumeric characters, and length of 16.');
      } else if (errors.mapped().url) {
        return res.status(422).send('There is no url property in request body. Please enter it and try again.');
      }

      next();
    };
  }

  static errorHandler(message) {
    return (err, req, res, next) => {
      console.error(err);
      // Sending just 500 on every fail / error. Could / should be implemented with different cases.
      // E.g. status == 4XX / 5XX or others. Depending on possible errors.
      return res.status(500).send(message);
    };
  }
}

exports.Utils = Utils;
