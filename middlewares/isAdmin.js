const User = require('../models/user.model');

const isAdmin = async (req, res, next) => {
    const user = await User.findById(req.user.id);
    if (user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Access denied: Admins only' });
    }
    next();
};

module.exports = isAdmin;
