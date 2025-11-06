import { Router } from "express";
import { createCheckout, getOrderHistory } from "../controllers/orderControl.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);

router.post("/checkout", createCheckout);

router.get("/history", getOrderHistory);

export default router;
