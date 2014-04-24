module.exports = function(app, passport) {


    //Products Routes
    var products = require('../app/controllers/products');
    app.get('/api/v1/products', products.index);
    app.post('/api/v1/product', auth.requiresLogin, products.create)
    app.post('/api/v1/products', products.searchIndex);
    app.get('/api/v1/product/:id', auth.requiresLogin, auth.product.hasAuthorization, products.show);

    var categories = require('../app/controllers/categories');

    app.get('/api/v1/categories', categories.index);
    app.post('/api/v1/categories', categories.create);

    //Finish with setting up the articleId param
    app.param('productId', products.product);

};