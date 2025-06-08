import express from 'express';
import {
  createPost,
  getAllPosts,
  getPostById,
  deletePost,
  updatePost
} from '../controller/postController';
import multer from 'multer';
import {
  authenticateUser,
  isAdmin,
  isAuthorOrAdmin
} from '../middlewares/auth';

const router = express.Router();

// Utility to wrap async route handlers
const asyncHandler = (fn: any) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (_req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage: storage });

// Create a new post (protected)
router.post(
  '/',
  authenticateUser,
  isAuthorOrAdmin,
  isAdmin,
  upload.single('image'),
  asyncHandler(createPost)
);

// Get all posts (public)
router.get('/', asyncHandler(getAllPosts));

// Get a single post by ID (protected)
router.get(
  '/:id',
  authenticateUser,
  isAdmin,
  asyncHandler(getPostById)
);

// Update a post by ID (protected)
router.put(
  '/:id',
  authenticateUser,
  isAuthorOrAdmin,
  isAdmin,
  upload.single('image'),
  asyncHandler(updatePost)
);

// Delete a post by ID (protected)
router.delete(
  '/:id',
  authenticateUser,
  isAuthorOrAdmin,
  isAdmin,
  asyncHandler(deletePost)
);

export default router;
