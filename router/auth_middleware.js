const jwt = require("jsonwebtoken");
const secretKey = "Netskdlkfgdkngkbgnl;dngdfncvlhmlkmndfgfdjkngfdj"; 
const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Authorization token is missing" });
    }
    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

module.exports = { authenticateToken, secretKey };
