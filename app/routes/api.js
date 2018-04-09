const express 		= require('express');
const router  		= express.Router();

const categories	= require('../controllers/categories');
const provinces		= require('../controllers/provinces');

// provinces
router.get('/provinces/', (req, res, next) => {
	provinces.index(req.query, (result) => { res.status(result.status_code).json(result); });
});
router.get('/provinces/:id', (req, res, next) => {
	provinces.show(req.params.id, (result) => { res.status(result.status_code).json(result); });
});
// router.post('/provinces/', (req, res, next) => {
// 	provinces.store(req.body, (result) => { res.status(result.status_code).json(result); });
// });
// router.put('/provinces/:id', (req, res, next) => {
// 	provinces.update(req.params.id, req.body, (result) => { res.status(result.status_code).json(result); });
// });
// router.delete('/provinces/:id', (req, res, next) => {
// 	provinces.destroy(req.params.id, req.body, (result) => { res.status(result.status_code).json(result); });
// });

// categories
router.get('/categories/', (req, res, next) => {
	categories.index(req.query, (result) => { res.status(result.status_code).json(result); });
});
router.get('/categories/:id', (req, res, next) => {
	categories.show(req.params.id, (result) => { res.status(result.status_code).json(result); });
});
router.post('/categories/', (req, res, next) => {
	categories.store(req.body, (result) => { res.status(result.status_code).json(result); });
});
router.put('/categories/:id', (req, res, next) => {
	categories.update(req.params.id, req.body, (result) => { res.status(result.status_code).json(result); });
});
router.delete('/categories/:id', (req, res, next) => {
	categories.destroy(req.params.id, req.body, (result) => { res.status(result.status_code).json(result); });
});



module.exports = router;
