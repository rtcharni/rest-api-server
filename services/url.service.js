const { DatabaseService } = require('./database.service');

// Here could be more logic and other functionality related to Url-topics
// Service could use other services and utilities also. Real app could have multiple services and service helpers.

// Maybe redundant service in this app scope,
// but very necessary in larger apps to make code more and better divided and easier to read and understand.

class UrlService {
  databaseService = new DatabaseService();

  getSavedUrl(urlId) {
    const savedUrlObj = this.databaseService.getSavedUrlById(urlId);
    return savedUrlObj ? savedUrlObj.url : null;
  }

  saveUrl(url) {
    // Here could check that URL is actually valid url. Now possible to save any string.
    // E.g with node fetch package or axios
    return this.databaseService.saveUrl(url);
  }
}

exports.UrlService = UrlService;
