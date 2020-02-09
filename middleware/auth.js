const jwt = require('jsonwebtoken');

const { JWT_SECRET } = require('../config')

function auth(req, res, next) {
    const token = req.header('x-auth-token');

    // Check for token
    if (!token)
        return res.status(401).json({ isTokenError: true, message: 'No token, authorizaton denied' });

    try {
        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);
        // Add user from payload
        req.user = decoded;
        next();
    } catch (e) {
        res.status(400).json({ isTokenError: true, message: 'Token is not valid' });
    }
}

module.exports = auth;