import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client.js';

// Initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Clear existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.item.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  console.log('Cleared existing data');

  // Create Categories
  const category1 = await prisma.category.create({
    data: { name: 'Fruits' },
  });

  const category2 = await prisma.category.create({
    data: { name: 'Vegetables' },
  });

  const category3 = await prisma.category.create({
    data: { name: 'Breads' },
  });
  
  const category4 = await prisma.category.create({
    data: { name: 'Non-Veg' },
  });

  console.log('Created categories:', { category1, category2, category3, category4 });

  // Create Items with Real Food Images
  await prisma.item.create({
    data: {
      name: 'Apple',
      description: 'A crisp, sweet red apple.',
      price: 0.5,
      imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&h=400&fit=crop',
      stock: 100,
      categoryId: category1.id,
    },
  });

  await prisma.item.create({
    data: {
      name: 'Banana',
      description: 'A ripe yellow banana.',
      price: 0.3,
      imageUrl: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=600&h=400&fit=crop',
      stock: 150,
      categoryId: category1.id,
    },
  });

  await prisma.item.create({
    data: {
      name: 'Carrot',
      description: 'A fresh orange carrot.',
      price: 0.2,
      imageUrl: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600&h=400&fit=crop',
      stock: 200,
      categoryId: category2.id,
    },
  });
  
  await prisma.item.create({
    data: {
      name: 'Broccoli',
      description: 'A head of green broccoli.',
      price: 1.2,
      imageUrl: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=600&h=400&fit=crop',
      stock: 80,
      categoryId: category2.id,
    },
  });

  await prisma.item.create({
    data: {
      name: 'Baguette',
      description: 'A crusty French baguette.',
      price: 2.5,
      imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=400&fit=crop',
      stock: 50,
      categoryId: category3.id,
    },
  });

  await prisma.item.create({
    data: {
      name: 'Chicken Breast',
      description: 'Fresh, skinless chicken breast.',
      price: 5.0,
      imageUrl: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=600&h=400&fit=crop',
      stock: 30,
      categoryId: category4.id,
    },
  });

  await prisma.item.create({
    data: {
      name: 'Mangoes',
      description: 'Sweet and juicy tropical mangoes.',
      price: 1.5,
      imageUrl: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&h=400&fit=crop',
      stock: 4,
      categoryId: category1.id,
    },
  });

  await prisma.item.create({
    data: {
      name: 'Fish',
      description: 'Fresh catch of the day.',
      price: 8.0,
      imageUrl: 'https://images.unsplash.com/photo-1534482421-64566f976cfa?w=600&h=400&fit=crop',
      stock: 10,
      categoryId: category4.id,
    },
  });

  console.log('Created items.');
  console.log('Seed completed successfully!');
}

// Run the seed script
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Close the Prisma Client
    await prisma.$disconnect();
  });