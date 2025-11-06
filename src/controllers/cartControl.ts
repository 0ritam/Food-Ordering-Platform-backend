import { type Request, type Response } from "express";
import { PrismaClient } from "../generated/prisma/client.js";

const prisma = new PrismaClient();

export const getCart = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            item: true,
          },
        },
      },
    });

    if (!cart) {
      res.status(404).json({ error: "Cart not found" });
      return;
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const addItemToCart = async (req: any, res: Response) => {
  const userId = req.user.id;
  const { itemId, quantity } = req.body;

  try {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!cart) {
      res.status(404).json({ error: "Cart not found" });
      return;
    }

    const existingCartItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, itemId: itemId },
    });

    if (existingCartItem) {
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + quantity },
      });
      res.status(200).json(updatedItem);
      return;
    }

    const newCartItem = await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        itemId: itemId,
        quantity: quantity,
      },
    });

    res.status(201).json(newCartItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateCartItem = async (req: any, res: Response) => {
  const { cartItemId } = req.params;
  const { quantity } = req.body;

  try {
    if (quantity <= 0) {
      await prisma.cartItem.delete({ where: { id: cartItemId } });
      res.status(204).send();
      return;
    }

    const updatedItem = await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity: quantity },
    });

    res.status(200).json(updatedItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const removeCartItem = async (req: any, res: Response) => {
  const { cartItemId } = req.params;

  try {
    await prisma.cartItem.delete({ where: { id: cartItemId } });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
