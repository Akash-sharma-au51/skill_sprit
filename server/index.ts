import express from "express";
import connectDB from "./db.config";
import userRoutes from "./Routes/userRoutes";
import dotenv from "dotenv";
import postRoutes from "./Routes/postRoutes";

const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Connect to the database
connectDB();

// Routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
  });   
