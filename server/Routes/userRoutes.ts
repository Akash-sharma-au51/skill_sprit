import express from "express";
import {registerUser,loginUser,logoutUser } from "../controller/userController"
import asyncHandler from 'express-async-handler';

const router = express.Router();

router.post("/register", asyncHandler(registerUser));
router.post("/login", asyncHandler(loginUser));
router.get("/logout", asyncHandler(logoutUser));

export default router;
