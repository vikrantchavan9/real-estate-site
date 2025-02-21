const adminMiddleware = (req, res, next) => {
    console.log("Admin Middleware Triggered");

    if (!req.user || req.user.role !== 'admin') {
        console.log("Unauthorized - Not an Admin");
        return res.status(403).json({ message: "Forbidden: Admins only" });
    }

    console.log("Admin Verified:", req.user);
    next();
};

module.exports = adminMiddleware;
