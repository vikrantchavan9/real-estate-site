const authMiddleware = (req, res, next) => {
    console.log("Auth Middleware Triggered");

    if (!req.user) {
        console.log("Unauthorized - No User Found");
        return res.status(401).json({ message: "Unauthorized" });
    }

    console.log("User Authenticated:", req.user);
    next();
};

module.exports = authMiddleware;
