const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        res.status(401).json({ message: "Authentication failed , Token missing" });
    }
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decode
        next();
    } catch (err) {
        res.status(500).json({ message: 'Authentication failed. Invalid token.' })
    }
}

module.exports = auth