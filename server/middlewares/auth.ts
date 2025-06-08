import Users from "../models/userModal";
import Posts from "../models/postModel";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// Middleware to authenticate user
export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as jwt.Secret);
        req.user = decoded;
        next();
    } catch (error) {
        console.error("Error verifying token:", error);
        res.status(401).json({ message: "Unauthorized" });
    }
};
// Middleware to check if user is admin
export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?._id;
    const user = await Users.findById(userId);
    if (!user || user.role !== "admin") {
        return res.status(403).json({ message: "Forbidden" });
    }
    next();
};

// Middleware to check if user is author of the post
export const isAuthor = async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.id;
    const userId = req.user?._id;

    const post = await Posts.findById(postId);
    if (!post || post.author.toString() !== userId) {
        return res.status(403).json({ message: "Forbidden" });
    }
    next();
};
// Middleware to check if user is the post author or an admin
export const isAuthorOrAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.id;
    const userId = req.user?._id;

    const post = await Posts.findById(postId);
    const user = await Users.findById(userId);
    if (!post || !user || user.role !== "admin") {
        return res.status(403).json({ message: "Forbidden" });
    }
    next();
};
// Middleware to check if user is authenticated
export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as jwt.Secret);
        req.user = decoded;
        next();
    } catch (error) {
        console.error("Error verifying token:", error);
        res.status(401).json({ message: "Unauthorized" });
    }
}
// Middleware to check if user is the post author
export const isPostAuthor = async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.id;
    const userId = req.user?._id;

    const post = await Posts.findById(postId);
    if (!post || post.author.toString() !== userId) {
        return res.status(403).json({ message: "Forbidden" });
    }
    next();
};
