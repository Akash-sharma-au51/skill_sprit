import express from 'express';
import { createPost, getAllPosts, getPostById,deletePost,updatePost } from '../controller/postController';
import multer from 'multer';
import path from 'path';
import { isAdmin,isAuthenticated,isAuthorOrAdmin, } from '../middlewares/auth';


const router = express.Router();
// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directory to store uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
    },
});
const upload = multer({ storage: storage });

// Create a new post
router.post('/', isAuthenticated, isAuthorOrAdmin,isAdmin, upload.single('image'), createPost);

// Get all posts
router.get('/', isAuthenticated, getAllPosts);

// Get a single post by ID
router.get('/:id', isAdmin, getPostById);

// Update a post by ID
router.put('/:id', isAuthenticated, isAuthorOrAdmin, isAdmin, upload.single('image'), updatePost);

// Delete a post by ID
router.delete('/:id', isAuthenticated, isAuthorOrAdmin, isAdmin, deletePost);

export default router;
