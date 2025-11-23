

export const roleMiddleware = (allowedRoles) => (req, res, next) => {
    // console.log("user  is =======>", req.user)
    // console.log("role is =======>", req.user.role)
    if (!req.user || !req.user.role) {
        return res.status(403).json({ error: 'Access Denied: No user role found' });
    }

    if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Access Denied: Insufficient permissions' });
    }

    next();
};
