import express, { type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);


app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello World" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
