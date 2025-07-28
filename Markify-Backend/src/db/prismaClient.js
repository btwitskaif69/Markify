// Change this line:
// const { PrismaClient } = require("@prisma/client");

// To this:
const { PrismaClient } = require("../../generated/prisma");

// ... rest of your file
const prisma = new PrismaClient();
module.exports = prisma;