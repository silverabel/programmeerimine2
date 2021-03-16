const express = require('express');
const router = express.Router();

const { getAll, getByID, create, login, deleteByID, patchByID } = require('../controllers/kasutajadController');
const { checkLogin, checkAdmin } = require('../middleware');

router
  .post('', create)
  .post('/login', login)
  .use(checkLogin, checkAdmin)
  .get('', getAll)
  .get('/:id', getByID)
  .delete('/:id', deleteByID)
  .patch('/:id', patchByID);

module.exports = router;