

import jwt from 'jsonwebtoken';

export const authMiddleware = async (req, res, next) => {
    try {
        const { accessToken } = req.cookies;

        console.log("'Access Token:'", accessToken);

        if (!accessToken) {
            return res.status(401).json({ error: 'Please Login First' });
        }

        const decodedToken = jwt.verify(accessToken, process.env.SECRET);

        if (!decodedToken || !decodedToken.id || !decodedToken.role) {
            return res.status(403).json({ error: 'Invalid token' });
        }

        req.user = { id: decodedToken.id, role: decodedToken.role }; // ✅ Fix: Store user details properly
        console.log("Decoded Token Role:", req.user.role);

        next();
    } catch (error) {
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
};
