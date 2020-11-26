const fs = require('fs');
const path = require('path');
const cryptoRandomString = require('crypto-random-string');

// Could be slitted to multiple files or abrtractions if more functionality.
// Made easy solution with plain json file. Could be any database solution, e.g. Sqlite (no need for installation).
// With real database would use some sort of ORM or simillar package. E.g. Sequelize or Knex
class DatabaseService {
  getSavedUrl(urlId) {
    const db = this._readDatabase();
    const foundEntry = db.find(entry => entry.id === urlId);

    if (foundEntry) {
      if (new Date().toISOString() > foundEntry.expiresAt) {
        console.log(`Entry has expired, removing from database. Entry: `, foundEntry);
        const updatedDb = db.filter(entry => entry.id !== foundEntry.id);
        this._saveDatabase(updatedDb);
        return null;
      }
      return foundEntry;
    }
    return null;
  }

  saveUrl(url) {
    const db = this._readDatabase();
    const now = Date.now();
    const expirationTime = new Date(now + 7 * 24 * 60 * 60 * 1000);
    const id = this._generateUniqueId(db);
    db.push({ id, url, createdAt: new Date(now).toISOString(), expiresAt: expirationTime.toISOString() });
    this._saveDatabase(db);
    return id;
  }

  _generateUniqueId(database) {
    while (true) {
      const id = cryptoRandomString({
        length: 16,
        type: 'alphanumeric',
      }).toLowerCase();
      const entry = database.find(entry => entry.id === id);
      if (!entry) {
        return id;
      }
      console.log('ID already exists.. Generating new ID..');
    }
  }

  _readDatabase() {
    try {
      return JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'database', 'database.json')).toString());
    } catch (error) {
      // Don't continue request and code execution if error while reading database occurs,
      // because could lead to json-file-database corruption
      console.error(`Error while reading database.`);
      console.error(error);
      throw new Error(`Error while reading database.`);
    }
  }

  _saveDatabase(updatedDatabase) {
    try {
      fs.writeFileSync(path.join(__dirname, '..', 'database', 'database.json'), JSON.stringify(updatedDatabase));
    } catch (error) {
      // Don't continue request and code execution if error while reading database occurs,
      // because could lead to json-file-database corruption
      console.error(`Error while writing database.`);
      console.error(error);
      throw new Error(`Error while writing database.`);
    }
  }
}

exports.DatabaseService = DatabaseService;
