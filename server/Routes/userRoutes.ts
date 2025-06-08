import express from "express";
import { registerUser, loginUser, logoutUser } from "../controller/userController"
import errorhandler from 'express-async-handler'


const router = express.Router();

router.post("/register", errorhandler(registerUser));
router.post("/login", errorhandler(loginUser));
router.get("/logout", errorhandler(logoutUser));


export default router;