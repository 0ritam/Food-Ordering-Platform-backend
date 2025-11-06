import { type Request, type Response } from "express";
import { PrismaClient, Prisma } from "../generated/prisma/client.js";

const prisma = new PrismaClient();

export const createCheckout = async (req: any, res: Response) => {
  const userId = req.user.id;

  try {
    const newOrder = await prisma.$transaction(
      async (tx) => {
        const cart = await tx.cart.findUnique({
          where: { userId },
          include: {
            items: {
              include: {
                item: true,
              },
            },
          },
        });

        if (!cart || cart.items.length === 0) {
          throw new Error("Your cart is empty.");
        }

        let totalAmount = 0;
        const orderItemsData: Prisma.OrderItemCreateManyOrderInput[] = [];

        for (const cartItem of cart.items) {
          const item = cartItem.item;

          if (cartItem.quantity > item.stock) {
            throw new Error(`Not enough stock for ${item.name}.`);
          }

          totalAmount += item.price.toNumber() * cartItem.quantity;
          orderItemsData.push({
            itemId: item.id,
            quantity: cartItem.quantity,
            priceAtPurchase: item.price,
          });
        }

        const order = await tx.order.create({
          data: {
            userId: userId,
            totalAmount: totalAmount,
            status: "PENDING",
            items: {
              createMany: {
                data: orderItemsData,
              },
            },
          },
        });

        const stockUpdatePromises = cart.items.map((cartItem) => {
          return tx.item.update({
            where: { id: cartItem.item.id },
            data: {
              stock: {
                decrement: cartItem.quantity,
              },
            },
          });
        });
        await Promise.all(stockUpdatePromises);

        await tx.cartItem.deleteMany({
          where: { cartId: cart.id },
        });

        return order;
      },
      {
        maxWait: 5000, // Maximum time to wait for a transaction slot (ms)
        timeout: 10000, // Maximum time the transaction can run (ms)
      }
    );

    res.status(201).json(newOrder);
  } catch (error: any) {
    if (
      error.message.startsWith("Your cart is empty") ||
      error.message.startsWith("Not enough stock")
    ) {
      res.status(400).json({ error: error.message });
      return;
    }
    console.error(error);
    res.status(500).json({ error: "Checkout failed. Please try again." });
  }
};

export const getOrderHistory = async (req: any, res: Response) => {
  const userId = req.user.id;

  try {
    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            item: true,
          },
        },
      },
    });

    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not fetch order history." });
  }
};
