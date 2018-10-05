var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', ensureAuthenticated, function(req, res, next) {
  res.render('index', { title: 'Members' });
});

router.get('/admin', ensureAuthenticated, function(req, res, next) {
  res.render('admin', { title: 'admin' });
});

router.get('/accounts', ensureAuthenticated, function(req, res, next) {
  res.render('accounts', { title: 'accounts' });
});
router.get('/sales', ensureAuthenticated, function(req, res, next) {
  res.render('sales', { title: 'sales' });
});


function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/users/login');
}

module.exports = router;
