const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { POSITIVE_VALUES, NEGATIVE_VALUES } = require('../utils/badgeHelper');

const router = express.Router();
const prisma = new PrismaClient();

const BADGE_FIELD_MAP = {
  authenticity: 'badgeAuthenticity',
  fit: 'badgeFit',
  photoMatch: 'badgePhotoMatch',
  fabricFeel: 'badgeFabricFeel',
  comfortFeel: 'badgeComfortFeel',
  materialFeel: 'badgeMaterialFeel',
  finishDurability: 'badgeFinishDurability',
  shadeMatch: 'badgeShadeMatch',
  overallSatisfaction: 'badgeOverallSatisfaction'
};

// GET /api/products/:id/reviews — get filtered reviews for a product
router.get('/:id/reviews', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { badge, value, disagreeOnly, rating, sort } = req.query;

    const where = { productId: id };

    // Star rating filter
    if (rating && !isNaN(Number(rating))) {
      where.rating = Number(rating);
    }

    // Badge filter
    if (badge && BADGE_FIELD_MAP[badge]) {
      const fieldName = BADGE_FIELD_MAP[badge];

      if (disagreeOnly === 'true') {
        const negativeVals = NEGATIVE_VALUES[badge] || [];
        where[fieldName] = { in: negativeVals };
      } else if (value) {
        where[fieldName] = value;
      } else {
        // Filter by positive value by default if badge is selected without specific value
        const positiveVal = POSITIVE_VALUES[badge];
        if (positiveVal) {
          where[fieldName] = positiveVal;
        }
      }
    }

    // Sort order
    let orderBy = [{ createdAt: 'desc' }];
    if (sort === 'rating_asc') {
      orderBy = [{ rating: 'asc' }, { createdAt: 'desc' }];
    } else if (sort === 'rating_desc') {
      orderBy = [{ rating: 'desc' }, { createdAt: 'desc' }];
    }

    const reviews = await prisma.review.findMany({
      where,
      orderBy
    });

    res.json(reviews);
  } catch (err) {
    next(err);
  }
});

// POST /api/products/:id/reviews — submit review with badges
router.post('/:id/reviews', async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      userName,
      rating,
      text,
      sizeBought,
      badgeAuthenticity,
      badgeFit,
      badgePhotoMatch,
      badgeFabricFeel,
      badgeComfortFeel,
      badgeMaterialFeel,
      badgeFinishDurability,
      badgeShadeMatch,
      badgeOverallSatisfaction
    } = req.body;

    const numericRating = Number(rating);
    if (!rating || isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ error: 'Valid star rating (1-5) is required' });
    }

    const sanitizedRating = Math.max(1, Math.min(5, Math.floor(numericRating)));
    const sanitizedUserName = typeof userName === 'string' && userName.trim() 
      ? userName.trim().slice(0, 80) 
      : 'Verified Buyer';
    const sanitizedText = typeof text === 'string' && text.trim() 
      ? text.trim().slice(0, 4000) 
      : null;
    const sanitizedSize = typeof sizeBought === 'string' && sizeBought.trim() 
      ? sizeBought.trim().slice(0, 30) 
      : null;

    const product = await prisma.product.findUnique({
      where: { id }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Create the review record
    const newReview = await prisma.review.create({
      data: {
        productId: id,
        userName: sanitizedUserName,
        rating: sanitizedRating,
        text: sanitizedText,
        sizeBought: sanitizedSize,
        badgeAuthenticity: typeof badgeAuthenticity === 'string' ? badgeAuthenticity.slice(0, 50) : null,
        badgeFit: typeof badgeFit === 'string' ? badgeFit.slice(0, 50) : null,
        badgePhotoMatch: typeof badgePhotoMatch === 'string' ? badgePhotoMatch.slice(0, 50) : null,
        badgeFabricFeel: typeof badgeFabricFeel === 'string' ? badgeFabricFeel.slice(0, 50) : null,
        badgeComfortFeel: typeof badgeComfortFeel === 'string' ? badgeComfortFeel.slice(0, 50) : null,
        badgeMaterialFeel: typeof badgeMaterialFeel === 'string' ? badgeMaterialFeel.slice(0, 50) : null,
        badgeFinishDurability: typeof badgeFinishDurability === 'string' ? badgeFinishDurability.slice(0, 50) : null,
        badgeShadeMatch: typeof badgeShadeMatch === 'string' ? badgeShadeMatch.slice(0, 50) : null,
        badgeOverallSatisfaction: typeof badgeOverallSatisfaction === 'string' ? badgeOverallSatisfaction.slice(0, 50) : null
      }
    });

    // Update product rating and reviewCount
    const allReviews = await prisma.review.findMany({
      where: { productId: id },
      select: { rating: true }
    });

    const totalCount = allReviews.length;
    const avgRating = totalCount > 0
      ? Number((allReviews.reduce((sum, r) => sum + r.rating, 0) / totalCount).toFixed(1))
      : 0;

    await prisma.product.update({
      where: { id },
      data: {
        rating: avgRating,
        reviewCount: totalCount
      }
    });

    res.status(201).json(newReview);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
