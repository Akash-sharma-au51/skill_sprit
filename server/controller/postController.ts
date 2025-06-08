import Posts from "../models/postModel";
import { Request, Response } from "express";
import { Types } from "mongoose";
import multer from "multer";
import path from "path";
// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); 
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); 
    },
    });
const upload = multer({ storage: storage });

// Create a new post
export const createPost = async (req: Request, res: Response) => {
    try {
        const { title, content } = req.body;
        const author = req.user?._id; 
        const image = req.file?.path; 

        if (!title || !content || !author) {
            return res.status(400).json({ message: "Title, content, and author are required." });
        }

        const newPost = new Posts({
            title,
            content,
            image,
            author,
        });

        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
// Get all posts
export const getAllPosts = async (req: Request, res: Response) => {
    try {
        const posts = await Posts.find().populate("author", "name profilePicture");
        res.status(200).json(posts);
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
// Get a single post by ID
export const getPostById = async (req: Request, res: Response) => {
    try {
        const postId = req.params.id;
        const post = await Posts.findById(postId).populate("author", "name profilePicture");
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        res.status(200).json(post);
    } catch (error) {
        console.error("Error fetching post:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
// Update a post by ID
export const updatePost = async (req: Request, res: Response) => {
    try {
        const postId = req.params.id;
        const { title, content } = req.body;
        const image = req.file?.path; 

        const updatedPost = await Posts.findByIdAndUpdate(
            postId,
            { title, content, image },
            { new: true }
        ).populate("author", "name profilePicture");

        if (!updatedPost) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.status(200).json(updatedPost);
    } catch (error) {
        console.error("Error updating post:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
// Delete a post by ID
export const deletePost = async (req: Request, res: Response) => {
    try {
        const postId = req.params.id;
        const deletedPost = await Posts.findByIdAndDelete(postId);

        if (!deletedPost) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
// Middleware to handle file uploads
export const uploadPostImage = upload.single("image");
// Middleware to handle file uploads for multiple images
export const uploadMultiplePostImages = upload.array("images", 10); 



export default {
    uploadPostImage,
    uploadMultiplePostImages
};

