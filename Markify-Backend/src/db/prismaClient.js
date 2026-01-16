const { PrismaClient } = require("@prisma/client");

// Create Prisma client with connection retry for Neon's serverless/sleeping databases
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
    // Log queries in development
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
});

// Handle connection errors gracefully (Neon databases may sleep on free tier)
prisma.$connect().catch((err) => {
    console.warn("Initial Prisma connection warning (Neon may be waking up):", err.message);
});

module.exports = prisma;