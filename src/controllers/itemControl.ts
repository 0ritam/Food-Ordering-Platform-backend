import { type Request, type Response } from "express";
import { PrismaClient } from "../generated/prisma/client.js";

const prisma = new PrismaClient();

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany();
    res.status(200).json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllItems = async (req: Request, res: Response) => {
  try {
    const { category: categoryName } = req.query;

    const queryOptions: any = {
      include: { category: true },
      where: {},
    };

    if (categoryName) {
      queryOptions.where = { category: { name: categoryName as string } };
    }

    const items = await prisma.item.findMany(queryOptions);

    res.status(200).json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getItemById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ error: "Item ID is required" });
      return;
    }

    const item = await prisma.item.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!item) {
      res.status(404).json({ error: "Item not found" });
      return;
    }

    res.status(200).json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
