import { Router } from "express";
import {
  getAllCategories,
  getAllItems,
  getItemById,
} from "../controllers/itemControl.js";

const router = Router();

router.get("/", getAllItems);

router.get("/:id", getItemById);

export default router;
