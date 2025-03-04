const jwt = require('jsonwebtoken');

function authenticateToken ( req, res, next ) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).send("Unauthorized");

    jwt.verify(token, process.env.ACCESS_SECRET_TOKEN, (err, user) => {
        if (err) return res.status(403).send("Forbidden");
        req.user = user;
        next();
    });
}

module.exports = {
    authenticateToken
};