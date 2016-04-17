/**
 * Local file reader
 * @author Mikhail Yurasov <me@yurasov.me>
 */

'use strict';

const fs = require('fs');
const path = require('path');
const AbstractReader = require('./AbstractReader');

class FileReader extends AbstractReader {

  constructor() {
    super();
    this.searchDirs = [
      path.resolve('.')
    ];
  }

  /**
   * Read local file
   * @param {string} filePath
   * @return {string}
   */
  read(filePath) {
    // iterate through the search dirs
    for (const dir of this.searchDirs) {
      const sourcePath = dir + '/' + filePath;

      if (fs.existsSync(sourcePath)) {
        this.logger.debug(`Reading local file "${sourcePath}"`);
        return fs.readFileSync(sourcePath, 'utf-8');
      }
    }

    throw new AbstractReader.Errors.NotFoundError('Local file "' + filePath + '" not found');
  }

  // <editor-fold desc="Accessors" defaultstate="collapsed">

  get searchDirs() {
    return this._searchDirs || [];
  }

  set searchDirs(value) {
    this._searchDirs = value;
  }

  // </editor-fold>
}

module.exports = FileReader;
