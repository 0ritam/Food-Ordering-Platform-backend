# Food Ordering Platform - Backend

A Node.js/Express backend API with authentication, cart management, and order processing.

## What's Inside

- JWT authentication with bcrypt
- Shopping cart functionality
- Order processing with Prisma transactions
- PostgreSQL database with Prisma ORM
- TypeScript with ES modules

## Tech Stack

- Node.js + Express v5
- TypeScript
- PostgreSQL (Neon)
- Prisma ORM
- JWT + bcryptjs

## Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL database (Neon account or local)

### Installation

1. Clone and install:
```bash
git clone https://github.com/0ritam/Food-Ordering-Platform.git
cd Food-Ordering-Platform/server
npm install
```

2. Create `.env` file:
```env
DATABASE_URL="your-postgresql-connection-string"
JWT_SECRET="your-secret-key"
PORT=8080
```

**Get your database URL from [Neon Console](https://console.neon.tech/)**

3. Set up database:
```bash
npm run db:generate
npx prisma migrate dev --name init
npm run seed  # Optional: adds sample data
```

4. Run the server:
```bash
npm run dev
```

Server runs on `http://localhost:8080`

## API Routes

### Auth
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login

### Items & Categories
- `GET /api/categories` - List categories
- `GET /api/items` - List all items
- `GET /api/items/:id` - Get single item

### Cart (requires auth)
- `GET /api/cart` - View cart
- `POST /api/cart` - Add item
- `PUT /api/cart/:itemId` - Update quantity
- `DELETE /api/cart/:itemId` - Remove item

### Orders (requires auth)
- `POST /api/order/checkout` - Create order
- `GET /api/order/history` - View past orders

## Project Structure

```
server/
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.ts          # Sample data
├── src/
│   ├── controllers/     # Business logic
│   ├── middleware/      # Auth & error handling
│   ├── routes/          # API routes
│   └── index.ts         # Server setup
├── .env                 # Config (don't commit!)
└── package.json
```

## Available Scripts

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm start            # Run production server
npm run seed         # Add sample data
npm run db:studio    # Open database GUI
```

## Common Issues

**Database connection fails?**
- Check your `DATABASE_URL` in `.env`
- Make sure your Neon database is active

**Port already in use?**
- Change `PORT` in `.env` to another number

**Prisma errors?**
- Run `npm run db:generate` to regenerate client

**Build errors?**
- Delete `dist` folder and run `npm run build` again

## Sample Request

```bash
# Register
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get items (with token)
curl http://localhost:8080/api/items \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Database Schema

The app uses 8 models:
- User, Category, Item
- Cart, CartItem
- Order, OrderItem, OrderStatus

Check `prisma/schema.prisma` for full schema.

## Security Notes

- Never commit `.env` file
- Use strong JWT secrets
- Passwords are hashed with bcrypt
- Use HTTPS in production

