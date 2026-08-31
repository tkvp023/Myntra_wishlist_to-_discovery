const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateDb() {
  try {
    const result = await prisma.review.updateMany({
      where: {
        OR: [
          { userName: { contains: 'Tharun' } },
          { userName: { contains: 'Pallela' } }
        ]
      },
      data: {
        userName: 'Aarav Sharma'
      }
    });
    console.log('Successfully updated reviews in database:', result.count);
  } catch (err) {
    console.error('Error updating database:', err);
  } finally {
    await prisma.$disconnect();
  }
}

updateDb();
