const asynchandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const tokenBlacklist = require('../tokenBlacklist')
const validateToken = asynchandler(async (req, res, next) => {
    let token;
    //splitting token from request
    let authHeader = req.headers.Authorization || req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({ msg: "User token is missing" });
        throw new Error("User token is missing")
    }
    if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1]; 
        if (tokenBlacklist.has(token)) {
            console.log("inside invalid token")
            res.status(401)
            throw new Error("User is not authorized");
        }

        jwt.verify(token, process.env.ACCESS_TOKEN_SECERT, (err, decoded) => {
            if (err) {
                res.status(401);
                throw new Error("User is not authorized");
            }
            req.user = decoded.user;
            next()
        });
    }
})
module.exports = validateToken