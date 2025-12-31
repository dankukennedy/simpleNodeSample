import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import type { IUser } from '../type/userTypes.ts';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
// 1. Extend the Request interface locally
interface AuthenticatedRequest extends Request {
    user?: IUser | undefined; // You can replace 'any' with your User type/interface
}
// 2. Use the extended interface in the function signature
export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    // Check for the "Bearer <token>" pattern
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Access token required' });
    }
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
         // 3. Attach the decoded payload to the request object
        req.user = decoded as IUser; 
        return next();
    });
    return;
};
// 3. Use the extended interface in the function signature Admin only
export const authorizeAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // 1. Check if user was attached by the previous authenticateToken middleware
    if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
    }
    // 2. Check for admin role
    if (req.user.role !== 'admin') {
        console.warn(`[SECURITY] Unauthorized admin access attempt by: ${req.user.username}`);
        return res.status(403).json({ message: "Access denied: Admins only" });
    }
    // 3. If everything is fine, proceed
    return next();
};