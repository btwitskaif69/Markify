import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.blogPost.deleteMany({
    where: { published: false }
  });
  console.log(`Deleted ${result.count} unpublished blogs.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
