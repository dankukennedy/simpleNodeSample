import { Router  } from "express";
import type{ NextFunction,Request,Response } from "express";
import { authenticateToken, authorizeAdmin } from "../middleware/auth.ts";
import { deleteAllUsers, deleteUser, getAllUsers, loginUser, signupUser } from "../controller/userController.ts";

const router = Router();

// Example user route
router.post("/signup",signupUser);
router.post("/login", loginUser);
router.get("/users", authenticateToken,authorizeAdmin,getAllUsers );
router.delete("/user", authenticateToken,authorizeAdmin, deleteUser);
router.delete("/users", authenticateToken, authorizeAdmin,deleteAllUsers );

export default router;
