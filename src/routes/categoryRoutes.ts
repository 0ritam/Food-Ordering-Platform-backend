import { Router } from "express";
import { getAllCategories } from "../controllers/itemControl.js";

const router = Router();

router.get("/", getAllCategories);

export default router;
