import Users from "../models/userModal";
import Posts from "../models/postModel";
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// Extend Express Request interface to include 'user'
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & { _id?: string };
    }
  }
}

// Helper function to extract token and verify it
const verifyToken = (req: Request, res: Response): JwtPayload & { _id?: string } | null => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthorized: No token provided" });
    return null;
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload & { _id?: string };
    return decoded;
  } catch (err) {
    res.status(401).json({ message: "Unauthorized: Invalid token" });
    return null;
  }
};

// Middleware to authenticate user
export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const decoded = verifyToken(req, res);
  if (!decoded) return;
  req.user = decoded;
  next();
};

// Middleware to check if user is admin
export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userId = req.user?._id;
  const user = await Users.findById(userId);

  if (!user || user.role !== "admin") {
    res.status(403).json({ message: "Forbidden: Admins only" });
    return;
  }

  next();
};

// Middleware to check if user is the post author
export const isAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const postId = req.params.id;
  const userId = req.user?._id;

  const post = await Posts.findById(postId);
  if (!post || post.author.toString() !== userId) {
    res.status(403).json({ message: "Forbidden: Not the post author" });
    return;
  }

  next();
};

// Middleware to check if user is author or admin
export const isAuthorOrAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const postId = req.params.id;
  const userId = req.user?._id;

  const post = await Posts.findById(postId);
  const user = await Users.findById(userId);

  if (!post || !user || (post.author.toString() !== userId && user.role !== "admin")) {
    res.status(403).json({ message: "Forbidden: Not author or admin" });
    return;
  }

  next();
};
