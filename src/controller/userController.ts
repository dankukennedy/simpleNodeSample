import type { Request, Response,NextFunction} from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type{ IUserPayload  } from '../type/userTypes.js';
import { asyncHandler } from '../util/asyncHandler.ts';

// In-memory database (Move this to a separate file like userDatabase.ts if preferred)
let users: IUserPayload [] = []; 
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

// --- GET ALL USERS ---
export const getAllUsers = asyncHandler(async(req: Request, res: Response,) => {
    console.log(`[DB] Fetching all users. Count: ${users.length}`);
    res.json(users.map(u => ({ id: u.id, username: u.username, email: u.email })));
});

// --- SIGNUP ---
export const signupUser = asyncHandler(async (req: Request, res: Response, ) => {
    const { username, password, email, role } = req.body;
    const missingFields = [];
    if (!username?.trim()) missingFields.push("username");
    if (!password?.trim()) missingFields.push("password");
    if (!email?.trim()) missingFields.push("email");
    if (!role?.trim()) missingFields.push("role");

    if (missingFields.length > 0) {
    return res.status(400).json({
        message: `The following fields are required: ${missingFields.join(", ")}`
    });
}
    const userExists = users.find(user => user.username === username || user.email === email);
    if (userExists) {
        return res.status(409).json({ message: "Username or Email already exists" });
    }

    const hashPass = await bcrypt.hash(password, 10);
    const newUser: IUserPayload  = {
        id: users.length + 1,
        username,
        email,
        role:(role?.toLowerCase() ==='admin') ? 'admin':'user',
        password: hashPass
    };
    users.push(newUser);
    console.log(`[AUTH] New user registered: ${username}`);
   return res.status(201).json({ message: "User created successfully", userId: newUser.id });
});

// --- LOGIN ---
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);

    if (!user || !(await bcrypt.compare(password, user.password))) {
        console.warn(`[AUTH] Failed login attempt for: ${username}`);
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, username: user.username, role:user.role }, JWT_SECRET, { expiresIn: '1h' });

    console.log(`[AUTH] User logged in: ${username}`);
    return res.json({ message: "Login successful", token ,role:user.role });

});

// --- DELETE ONE ---
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "User ID is required" });
    }
    const initialLength = users.length;
    users = users.filter(user => user.id !== parseInt(id));

    if (users.length === initialLength) {
        return res.status(404).json({ message: "User not found" });
    }
    console.log(`[DB] Deleted user ID: ${id}`);
    return res.json({ message: "User deleted successfully" });
});

// --- DELETE ALL ---
export const deleteAllUsers = asyncHandler(async (req: Request, res: Response) => {
    users = [];
    console.log(`[DB] Cleared all users`);
    return res.json({ message: "All users deleted successfully" });
});
