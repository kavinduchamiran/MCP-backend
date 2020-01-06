const jwt = require("jsonwebtoken");
const authKey = 'kavindu';
const userKey = 'kavindu';

const authTokenMiddleware = (req, res, next) => {
    // todo check logic. not sure
    //get the token from the header if present
    const authToken = req.headers["x-auth-token"];

    //if no token found, return response (without going to the next middelware)
    if (!authToken)
        return res.status(401).send("Access denied. No auth token provided.");

    try {
        //if can verify the token, set req.user and pass to next middleware
        req.user = jwt.verify(authToken, authKey);
        next();
    } catch (ex) {
        //if invalid token
        res.status(400).send("Invalid token.");
    }
};

const userTokenMiddleware = (req, res, next) => {
    //get the token from the header if present
    const userToken = req.headers["x-user-token"] ;

    //if no token found, return response (without going to the next middelware)
    if (!userToken)
        return res.status(401).send("Access denied. No user token provided.");

    try {
        //if can verify the token, set req.user and pass to next middleware
        req.user = jwt.verify(userToken, userKey);
        next();
    } catch (ex) {
        //if invalid token
        res.status(400).send("Invalid token.");
    }
};

module.exports = {
    authTokenMiddleware,
    userTokenMiddleware
}
