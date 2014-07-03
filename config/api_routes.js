module.exports = function(app, passport) {

    // Users Routes
    var users = require('../app/controllers/users');
    app.post('/api/v1/register', users.register);
    app.post('/api/v1/login', users.login);
    app.post('/api/v1/profile', users.profile);
    app.put('/api/v1/user', users.update);
    app.post('/api/v1/seller/clickchic', users.clickchic);

    // Products Routes
    var products = require('../app/controllers/products');
    app.post('/api/v1/product', products.create);
    app.post('/api/v1/products', products.index);
    app.route('/api/v1/product/:id')
        .post(products.show)
        .delete(products.deleteProduct);
    app.post('/api/v1/product/:id/comment', products.newComment);
    app.post('/api/v1/product/:id/like', products.changeLike);

    // Categories Routes
    var categories = require('../app/controllers/categories');
    app.get('/api/v1/categories', categories.index);
    app.post('/api/v1/category', categories.create);
    app.delete('/api/v1/category/:id', categories.deleteCategory);
};