const jwt = require('jsonwebtoken');
const blacklist = new Set();

const verifyToken = (req, res, next) => {
    req.token = req.headers.authorization?.split(" ")[1];

    if (!req.token) return res.status(401).json({ message: "Access denied. No token provided." });

    try {
        const decoded = jwt.verify(req.token, 'SECRET');
        req.user = decoded;
        checkBlacklist(req, res, next)
    }
    catch (err) {
        res.status(400).json({ message: "Invalid token." });
    }
};

const checkBlacklist = (req, res, next) => {
    if (blacklist.has(req.token)) {
        return res.status(401).send('Token revoked');
    }
    next();
};

addToBlacklist = (token) => {
    blacklist.add(token);
};

module.exports = {
    verifyToken,
    checkBlacklist,
    addToBlacklist
} 
