const jwt = require("jsonwebtoken");
const secretKey = "Netskdlkfgdkngkbgnl;dngdfncvlhmlkmndfgfdjkngfdj"; // Replace with a secure key in production

const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Authorization token is missing" });
    }
    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded; // Attach the user info to the request
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

module.exports = { authenticateToken, secretKey };
