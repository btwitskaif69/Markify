const { PrismaClient } = require("@prisma/client"); // Use the standard import path

const prisma = new PrismaClient();

module.exports = prisma;