const { SQLPool } = require('../sql');

describe('Services', function() {
  require('./api/services.test');
});

describe('Controllers', function() {
  describe('kasutajadController', function() {
    require('./api/controllers/kasutajadController.test');
  });

  describe('oppejoudController', function() {
    require('./api/controllers/oppejoudController.test');
  });

  describe('oppeainedController', function() {
    require('./api/controllers/oppeainedController.test');
  });

  describe('kursusedController', function() {
    require('./api/controllers/kursusedController.test');
  });

  describe('loengudController', function() {
    require('./api/controllers/loengudController.test');
  });
});

after(function() {
  SQLPool.end(function() {console.log('Pool closed');});
});