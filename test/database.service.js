const path = require('path');
const chai = require('chai');
const expect = chai.expect;

// Testing could be more complex and just include more test for different methods/function and different scenarios.
// Tests could / should also include testing for api requests / endpoints
// Should be splitted to many files if bigger app

const { DatabaseService } = require('../services/database.service');

describe('Database Service', () => {
  let databaseService;
  let databasePathBroken;

  before(() => {
    databaseService = new DatabaseService();
    databaseService.databasePath = path.join(__dirname, 'database', 'database.json');
    databasePathBroken = path.join(__dirname, 'database', 'database-broken.json');

    // Silence the console, not best option, but wanted not to pollute terminal and results when running tests
    console.log = () => {};
    console.error = () => {};
  });

  after(() => {
    // Restore console
    delete console.log;
    delete console.error;
  });

  describe('_readDatabase()', () => {
    it('should read database file and be array', () => {
      const file = databaseService._readDatabase(databaseService.databasePath);
      const result = Array.isArray(file);
      expect(result).to.be.true;
    });

    it('should have database with two entries', () => {
      const result = databaseService._readDatabase(databaseService.databasePath);
      expect(result).to.have.lengthOf(2);
    });

    it('should throw error when reading database file', () => {
      expect(() => {
        databaseService._readDatabase(databasePathBroken);
      }).to.throw();
    });
  });

  describe('getSavedUrlById()', () => {
    it('should get entry without being null', () => {
      let result = databaseService.getSavedUrlById('0123456789123456');
      expect(result).to.be.not.null;
    });

    it('should get entry with ID of 0123456789123456', () => {
      let result = databaseService.getSavedUrlById('0123456789123456');
      expect(result.id).to.equal('0123456789123456');
    });

    it('should not found entry and have value of null', () => {
      let result = databaseService.getSavedUrlById('notExistsInDatabase');
      expect(result).to.be.null;
    });

    it('should found entry but return null because of entry has expired', () => {
      let result = databaseService.getSavedUrlById('qwertyuiopasdfgh');
      expect(result).to.be.null;
    });
  });
});
