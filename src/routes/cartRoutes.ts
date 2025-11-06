import { Router } from "express";
import {
  getCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
} from "../controllers/cartControl.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);

router.get("/", getCart);

router.post("/", addItemToCart);

router.put("/items/:cartItemId", updateCartItem);

router.delete("/items/:cartItemId", removeCartItem);

export default router;
