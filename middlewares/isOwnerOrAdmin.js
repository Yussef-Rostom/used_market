const User = require('../models/user.model');
const Product = require('../models/product.model');

const isAdmin = async (req, res, next) => {
    const user = await User.findById(req.user.id);
    const product = await Product.findById(req.params.id);
    if (user.role == 'ADMIN' || JSON.stringify(user._id) === JSON.stringify(product.createdBy)) return next();
    res.status(403).json({ message: 'Access denied: Admins only' });
};

module.exports = isAdmin;
