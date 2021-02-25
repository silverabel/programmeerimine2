const express = require('express');
const router = express.Router();

const { getAll, getByID, post, deleteByID, patchByID } = require('../controllers/oppeainedController');

router.get('', getAll);
router.get('/:id', getByID);
router.post('', post);
router.delete('/:id', deleteByID);
router.patch('/:id', patchByID);

module.exports = router;