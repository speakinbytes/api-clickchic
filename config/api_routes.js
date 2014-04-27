module.exports = function(app) {

    // Products Routes
    var products = require('../app/controllers/products');
    app.get('/api/v1/products', products.index);
    app.post('/api/v1/product', products.create);
    app.post('/api/v1/products', products.searchIndex);
    app.route('/api/v1/product/:id')
        .get(products.show)
        .delete(products.deleteProduct);

    // Categories Routes
    var categories = require('../app/controllers/categories');
    app.route('/api/v1/categories')
        .get(categories.index)
        .post(categories.create);
    app.delete('/api/v1/category/:id', categories.deleteCategory);
};