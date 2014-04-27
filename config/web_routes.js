module.exports = function(app) {

    // root
    app.get('/', function(req, res) {
        res.render('index.html');
    });
    app.get('/index', function(req, res) {
        res.render('index.html');
    });

    // show api
    app.get('/api', function(req, res) {
        res.redirect('http://docs.clickchicapi.apiary.io/');
    });

    // Products Routes
    var products = require('../app/controllers/products');
    app.get('/products', products.web_index);
    app.get('/products/new', products.web_new_product);

    // Shop routes
    app.get('/shops', products.web_shops);
    app.get('/shop/:id', products.web_shop);


};