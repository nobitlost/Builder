// Copyright (c) 2016-2017 Electric Imp
// This file is licensed under the MIT License
// http://opensource.org/licenses/MIT

'use strict';

require('jasmine-expect');

const init = require('./init')('main');
const Machine = require('../../src/Machine');
const fs = require('fs');

describe('FileCache', () => {
  let machine;

  beforeEach(() => {
    machine = init.createMachine();
    machine.fileCache.cacheDir = './test-cache';
  });

  afterEach(() => {
    if (fs.existsSync(machine.fileCache.cacheDir)) {
      machine.clearCache();
    }
  });

  it('should clear cache', () => {
    const link = 'github:test/test1/test.txt';
    machine.fileCache._cacheFile(link, 'hello');
    expect(machine.fileCache._findFile(link) ? true : false).toEqual(true);
    machine.clearCache();
    expect(machine.fileCache._findFile(link) ? true : false).toEqual(false);
  });

  it('should cache files', () => {
    const link = 'github:test/test1/test.txt';
    const ghRes = machine.fileCache._getCachedPath(link);
    machine.fileCache._cacheFile(link, 'hello');
    expect(fs.existsSync(ghRes)).toEqual(true);
  });

  it('should cache files in machine', () => {
    let linkName = 'github:electricimp/Builder/spec/fixtures/sample-11/LineBrakeSample.nut';
    machine.useCache = true;
    machine.execute(`@include '${linkName}'`);
    expect(machine.fileCache._findFile(linkName) ? true : false).toEqual(true);
    linkName = 'https://raw.githubusercontent.com/nobitlost/Builder/develop/spec/Builder.spec.js';
    machine.execute(`@include '${linkName}'`);
    expect(machine.fileCache._findFile(linkName) ? true : false).toEqual(true);
  });

  it('should exclude files from cache', () => {
    machine.useCache = true;
    let linkName = 'github:electricimp/Builder/spec/fixtures/sample-11/LineBrakeSample.nut';
    expect(machine.fileCache._findFile(linkName)).toEqual(false);
    machine.excludeList = __dirname + '/../fixtures/config/exclude-all.exclude';
    machine.execute(`@include '${linkName}'`);
    expect(machine.fileCache._findFile(linkName)).toEqual(false);
    linkName = 'https://raw.githubusercontent.com/nobitlost/Builder/develop/spec/Builder.spec.js';
    machine.execute(`@include '${linkName}'`);
    expect(machine.fileCache._findFile(linkName)).toEqual(false);
  });

  it('should shorten filenames if they are longer then 256 symbols', () => {
    const longUrl = 'https://longlonglonglongurl.com/longlonglonglongurl/'
    + 'longlonglonglongurl/longlonglonglongurl/longlonglonglongurl/longlonglonglongurl/'
    + 'longlonglonglongurl/longlonglonglongurl/longlonglonglongurl/longlonglonglongurl/'
    + 'longlonglonglongurl/longlonglonglongurl/longlonglonglongurl/longlonglonglongurl/'
    + 'longlonglonglongurl/longlonglonglongurl/longesturl.js';
    expect(longUrl.length > 256).toEqual(true);
    expect(machine.fileCache._getCachedPath(longUrl).length < 256).toEqual(true);
  });

  it('should generate unique paths for different github links', () => {
    const linksSet = new Set();
    const links = ['github:a/b/c.js',
                   'github:b/a/c.js',
                   'github:a/b/c.js@a',
                   'github:a/b/c.j@s',
                   'github:a/b/a-b-c.js',
                   'github:a/b-c_js/c.js',
                   'github:a/b/c_js.js',
                   'github:a/b/c/js'
                  ];
    links.forEach(link => {
      const path = machine.fileCache._getCachedPath(link);
      expect(linksSet.has(path)).toEqual(false);
      linksSet.add(path);
    });
  });

  it('should generate unique paths for different url links', () => {
    const linksSet = new Set();
    const links = ['http://a/b/c.js',
                   'http://a/b/c.js?1',
                   'http://a/b/c.js?2',
                   'http://a/b/c.js?t=12',
                   'https://a/b/c.js',
                   'http://b/a/c.js',
                   'http://a.b/c.js',
                   'http://a.b/c.j?s=2',
                   'http://a/b/a-b-c.js',
                   'http://a/b-c_js/c.js',
                   'http://a/b/c_js.js',
                   'http://a/b/c/js',
                   'http://a.b.c/js'
                  ];
    links.forEach(link => {
      const path = machine.fileCache._getCachedPath(link);
      expect(linksSet.has(path)).toEqual(false);
      linksSet.add(path);
    });
  });

});
