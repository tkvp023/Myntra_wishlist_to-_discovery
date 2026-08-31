const express = require('express');
const prisma = require('../prisma');
const { computeBadgeAggregates, formatProduct, safeJsonParse } = require('../utils/badgeHelper');

const router = express.Router();

// GET /api/products — list all products with optional ?category=, ?subcategory=, and ?gender= filter
router.get('/', async (req, res, next) => {
  try {
    const { category, subcategory, gender } = req.query;
    const where = {};

    // 1. Gender / Division filtering
    if (gender && gender !== 'all') {
      const g = String(gender).toLowerCase().slice(0, 30);
      if (g === 'beauty') {
        where.category = { in: ['makeup', 'skincare', 'fragrance', 'appliances'] };
      } else if (g === 'men') {
        where.gender = { in: ['men', 'unisex'] };
      } else if (g === 'women') {
        where.gender = { in: ['women', 'unisex'] };
      } else if (g === 'kids') {
        where.gender = 'kids';
      }
    }

    // 2. Specific Category filtering
    if (category && category !== 'all') {
      const c = String(category).toLowerCase().slice(0, 30);
      if (c === 'beauty') {
        where.category = { in: ['makeup', 'skincare', 'fragrance', 'appliances'] };
      } else if (c === 'men') {
        where.gender = { in: ['men', 'unisex'] };
      } else if (c === 'women') {
        where.gender = { in: ['women', 'unisex'] };
      } else if (c === 'kids') {
        where.gender = 'kids';
      } else {
        where.category = c;
      }
    }

    // 3. Subcategory filtering (Sarees, Lehengas, Kurtis, T-Shirts, Trousers, etc.)
    if (subcategory && subcategory !== 'all') {
      const sub = String(subcategory).toLowerCase().slice(0, 40);
      if (sub === 'sarees' || sub === 'saree') {
        where.subcategory = 'Sarees';
      } else if (sub === 'lehenga' || sub === 'lehengas' || sub === 'lehenga choli') {
        where.subcategory = 'Lehenga Choli';
      } else if (sub === 'kurtis' || sub === 'kurti' || sub === 'kurta' || sub === 'kurtas') {
        where.subcategory = { in: ['Kurtis', 'Kurta Sets', 'Ethnic Wear'] };
      } else if (sub === 'tshirts' || sub === 't-shirts' || sub === 'tshirt') {
        where.subcategory = { in: ['T-Shirts', 'Polos'] };
      } else if (sub === 'shirts' || sub === 'shirt') {
        where.subcategory = 'Shirts';
      } else if (sub === 'trousers' || sub === 'pants' || sub === 'cargos' || sub === 'chinos') {
        where.subcategory = { in: ['Trousers', 'Pants', 'Jeans'] };
      } else if (sub === 'dresses' || sub === 'dress') {
        where.subcategory = 'Dresses';
      } else if (sub === 'jackets' || sub === 'jacket') {
        where.subcategory = { in: ['Jackets', 'Sweatshirts'] };
      } else {
        where.subcategory = subcategory;
      }
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'asc' },
      include: {
        reviews: {
          select: {
            rating: true,
            badgeAuthenticity: true,
            badgeFit: true,
            badgePhotoMatch: true,
            badgeFabricFeel: true,
            badgeComfortFeel: true,
            badgeMaterialFeel: true,
            badgeFinishDurability: true,
            badgeShadeMatch: true,
            badgeOverallSatisfaction: true
          }
        }
      }
    });

    const formatted = products.map((p) => {
      const applicable = safeJsonParse(p.applicableBadges, []);
      const aggregates = computeBadgeAggregates(p.reviews, applicable);
      
      // Calculate top badge summary for product card
      let badgeSummary = null;
      if (aggregates.authenticity && !aggregates.authenticity.belowThreshold) {
        badgeSummary = `${aggregates.authenticity.percentPositive}% Feels Genuine`;
      } else if (aggregates.fit && !aggregates.fit.belowThreshold) {
        badgeSummary = `${aggregates.fit.percentPositive}% Fits as Expected`;
      } else if (aggregates.photoMatch && !aggregates.photoMatch.belowThreshold) {
        badgeSummary = `${aggregates.photoMatch.percentPositive}% Photo Match`;
      } else if (aggregates.overallSatisfaction && !aggregates.overallSatisfaction.belowThreshold) {
        badgeSummary = `${aggregates.overallSatisfaction.percentPositive}% Satisfied`;
      }

      // Remove reviews array from list response to keep payload lightweight
      const { reviews, ...productData } = p;
      return {
        ...formatProduct(productData),
        badgeSummary,
        badgeAggregates: aggregates
      };
    });

    res.json(formatted);
  } catch (err) {
    next(err);
  }
});

// GET /api/products/:id — get product detail + badge aggregates + fit data
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const sanitizedId = String(id).slice(0, 50);

    const product = await prisma.product.findUnique({
      where: { id: sanitizedId },
      include: {
        reviews: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const allProductReviews = await prisma.review.findMany({
      where: { productId: sanitizedId }
    });

    const applicable = safeJsonParse(product.applicableBadges, []);
    const badgeAggregates = computeBadgeAggregates(allProductReviews, applicable);

    // Compute live average rating and reviewCount
    const totalReviews = allProductReviews.length;
    const avgRating = totalReviews > 0
      ? Number((allProductReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1))
      : 0;

    const formatted = formatProduct(
      {
        ...product,
        rating: avgRating,
        reviewCount: totalReviews
      },
      badgeAggregates
    );

    res.json(formatted);
  } catch (err) {
    next(err);
  }
});

// GET /api/products/:id/badge-aggregates — badge aggregates specifically
router.get('/:id/badge-aggregates', async (req, res, next) => {
  try {
    const { id } = req.params;
    const sanitizedId = String(id).slice(0, 50);

    const product = await prisma.product.findUnique({
      where: { id: sanitizedId },
      select: { applicableBadges: true }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const reviews = await prisma.review.findMany({
      where: { productId: sanitizedId }
    });

    const applicable = safeJsonParse(product.applicableBadges, []);
    const aggregates = computeBadgeAggregates(reviews, applicable);
    res.json(aggregates);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
