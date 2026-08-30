const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed process...');
  
  // Read seed data from backend/prisma/seed-data.json or fallback to DOCS/seed-data.json
  let seedDataPath = path.resolve(__dirname, 'seed-data.json');
  if (!fs.existsSync(seedDataPath)) {
    seedDataPath = path.resolve(__dirname, '../../DOCS/seed-data.json');
  }
  const rawData = fs.readFileSync(seedDataPath, 'utf8');
  const { products, reviews, wishlist } = JSON.parse(rawData);

  // Clear existing data in reverse order of foreign keys
  await prisma.wishlistItem.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.product.deleteMany({});

  console.log(`Clearing existing records complete.`);

  // Insert products
  for (const p of products) {
    await prisma.product.create({
      data: {
        id: p.id,
        name: p.name,
        brand: p.brand,
        category: p.category,
        subcategory: p.subcategory || null,
        gender: p.gender || null,
        description: p.description,
        images: JSON.stringify(p.images),
        mrp: p.mrp,
        discountPercent: p.discountPercent,
        finalPrice: p.finalPrice,
        sizes: JSON.stringify(p.sizes),
        color: p.color || null,
        material: p.material || null,
        fit: p.fit || null,
        rating: p.rating || 0,
        reviewCount: p.reviewCount || 0,
        fitTight: p.fitTight || 0,
        fitJustRight: p.fitJustRight || 0,
        fitLoose: p.fitLoose || 0,
        lengthShort: p.lengthShort || 0,
        lengthJustRight: p.lengthJustRight || 0,
        lengthLong: p.lengthLong || 0,
        aiTags: p.aiTags ? JSON.stringify(p.aiTags) : null,
        applicableBadges: JSON.stringify(p.applicableBadges)
      }
    });
  }
  console.log(`Seeded ${products.length} products.`);

  // Insert reviews
  for (const r of reviews) {
    await prisma.review.create({
      data: {
        id: r.id,
        productId: r.productId,
        userName: r.userName,
        rating: r.rating,
        text: r.text || null,
        sizeBought: r.sizeBought || null,
        badgeAuthenticity: r.badgeAuthenticity || null,
        badgeFit: r.badgeFit || null,
        badgePhotoMatch: r.badgePhotoMatch || null,
        badgeFabricFeel: r.badgeFabricFeel || null,
        badgeComfortFeel: r.badgeComfortFeel || null,
        badgeMaterialFeel: r.badgeMaterialFeel || null,
        badgeFinishDurability: r.badgeFinishDurability || null,
        badgeShadeMatch: r.badgeShadeMatch || null,
        badgeOverallSatisfaction: r.badgeOverallSatisfaction || null,
        createdAt: r.createdAt ? new Date(r.createdAt) : new Date()
      }
    });
  }
  console.log(`Seeded ${reviews.length} reviews.`);

  // Insert wishlist items
  for (const w of wishlist) {
    await prisma.wishlistItem.create({
      data: {
        id: w.id,
        productId: w.productId,
        addedAt: w.addedAt ? new Date(w.addedAt) : new Date()
      }
    });
  }
  console.log(`Seeded ${wishlist.length} wishlist items.`);

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
