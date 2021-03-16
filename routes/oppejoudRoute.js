const express = require('express');
const router = express.Router();

const { getAll, getByID, post, deleteByID, patchByID } = require('../controllers/oppejoudController');
const { checkLogin, checkAdmin } = require('../middleware');

router
  .use(checkLogin)
  .get('', getAll)
  .get('/:id', getByID)
  .use(checkAdmin)
  .post('', post)
  .delete('/:id', deleteByID)
  .patch('/:id', patchByID);

module.exports = router;