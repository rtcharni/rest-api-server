const fs = require('fs');
const path = require('path');
const cryptoRandomString = require('crypto-random-string');

// Could be slitted to multiple files or abrtractions if more functionality.
// Made easy solution with plain json file that comes with application.
// Could be any database solution, e.g. Sqlite (no need for installation), on cloud or locally on machine.
// With real database would use some sort of ORM or simillar package. E.g. Sequelize or Knex.
// Could use also DATABASE_PATH for using other database file location

class DatabaseService {
  databasePath = path.join(__dirname, '..', 'database', 'database.json');

  getSavedUrlById(urlId) {
    const db = this._readDatabase(this.databasePath);
    const foundEntry = db.find(entry => entry.id === urlId);

    if (foundEntry) {
      if (new Date().toISOString() > foundEntry.expiresAt) {
        console.log(`Entry has expired. Entry: `, foundEntry);

        // Could remove expired entries from database. Leaving for statistics purposes.
        // const updatedDb = this._removeExpiredEntry(foundEntry.id);
        // this._saveDatabase(updatedDb, this.databasePath);
        return null;
      }
      return foundEntry;
    }
    return null;
  }

  saveUrl(url) {
    const db = this._readDatabase(this.databasePath);
    const now = Date.now();
    const expirationTime = new Date(now + 7 * 24 * 60 * 60 * 1000);
    const id = this._generateUniqueId(db);
    db.push({ id, url, createdAt: new Date(now).toISOString(), expiresAt: expirationTime.toISOString() });
    this._saveDatabase(db, this.databasePath);
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

  _readDatabase(path) {
    try {
      // Could check here that file exists, if not then could create new empty database file.
      return JSON.parse(fs.readFileSync(path).toString());
    } catch (error) {
      // Don't continue request and code execution if error while reading database occurs,
      // because could lead to json-file-database corruption
      console.error(`Error while reading database.`);
      console.error(error);
      throw new Error(`Error while reading database.`);
    }
  }

  _saveDatabase(updatedDatabase, path) {
    try {
      fs.writeFileSync(path, JSON.stringify(updatedDatabase));
    } catch (error) {
      // Don't continue request and code execution if error while reading database occurs,
      // because could lead to json-file-database corruption
      console.error(`Error while writing database.`);
      console.error(error);
      throw new Error(`Error while writing database.`);
    }
  }

  _removeExpiredEntry(expiredEntryId, database) {
    console.log(`Removing entry from database with ID of ${expiredEntryId}`);
    return database.filter(entry => entry.id !== expiredEntryId);
  }
}

exports.DatabaseService = DatabaseService;
