const express 		= require('express');
const router  		= express.Router();

const categories	= require('../controllers/categories');
const provinces		= require('../controllers/provinces');
const reports		= require('../controllers/reports');
const users			= require('../controllers/users');
const chart			= require('../controllers/chart');

// charts
router.get('/cat', (req, res, next) => {
	chart.categories(req.query, (result) => { res.status(result.status_code).json(result); });
});
router.get('/map/:prov_id?', (req, res, next) => {
	chart.map(req.params.prov_id, req.query, (result) => { res.status(result.status_code).json(result); });
});
router.get('/treemap', (req, res, next) => {
	chart.treemap(req.query, (result) => { res.status(result.status_code).json(result); });
});
router.get('/volume', (req, res, next) => {
	chart.volume(req.query, (result) => { res.status(result.status_code).json(result); });
});
router.get('/keywords', (req, res, next) => {
	chart.keywords(req.query, (result) => { res.status(result.status_code).json(result); });
});
router.get('/bipartite', (req, res, next) => {
	chart.bipartite(req.query, (result) => { res.status(result.status_code).json(result); });
});
router.get('/raw', (req, res, next) => {
	chart.raw(req.query, (result) => { res.status(result.status_code).json(result); });
});

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

// reports
router.get('/reports/', (req, res, next) => {
	reports.index(req.query, (result) => { res.status(result.status_code).json(result); });
});
router.get('/reports/:id', (req, res, next) => {
	reports.show(req.params.id, (result) => { res.status(result.status_code).json(result); });
});
router.post('/reports/', (req, res, next) => {
	reports.store(req.body, (result) => { res.status(result.status_code).json(result); });
});
router.put('/reports/:id', (req, res, next) => {
	reports.update(req.params.id, req.body, (result) => { res.status(result.status_code).json(result); });
});
router.delete('/reports/:id', (req, res, next) => {
	reports.destroy(req.params.id, req.body, (result) => { res.status(result.status_code).json(result); });
});

// users
router.get('/users/', (req, res, next) => {
	users.index(req.query, (result) => { res.status(result.status_code).json(result); });
});
router.get('/users/:id', (req, res, next) => {
	users.show(req.params.id, (result) => { res.status(result.status_code).json(result); });
});
router.post('/users/', (req, res, next) => {
	users.store(req.body, (result) => { res.status(result.status_code).json(result); });
});
router.put('/users/:id', (req, res, next) => {
	users.update(req.params.id, req.body, (result) => { res.status(result.status_code).json(result); });
});
router.delete('/users/:id', (req, res, next) => {
	users.destroy(req.params.id, req.body, (result) => { res.status(result.status_code).json(result); });
});
router.post('/auth/', (req, res, next) => {
	users.auth(req.body, (result) => { res.status(result.status_code).json(result); });
});

module.exports = router;
