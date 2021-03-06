const path		= require('path');
const express	= require('express');

const router	= express.Router();

/* index. */
router.get('/', (req, res, next) => { res.sendFile('dashboard.html', { root: path.join(__dirname, '../../views') }); });
router.get('/admin', (req, res, next) => { res.sendFile('admin/index.html', { root: path.join(__dirname, '../../views') }); });

module.exports = router;
