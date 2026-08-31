const express = require('express');
const prisma = require('../prisma');
const { computeBadgeAggregates, formatProduct, safeJsonParse } = require('../utils/badgeHelper');

const router = express.Router();

// GET /api/wishlist — get wishlist items with re-engagement prompts (Part C)
router.get('/', async (req, res, next) => {
  try {
    const items = await prisma.wishlistItem.findMany({
      orderBy: { addedAt: 'desc' },
      include: {
        product: {
          include: {
            reviews: true
          }
        }
      }
    });

    const now = new Date();

    const formatted = items
      .filter((item) => item.product != null)
      .map((item) => {
        const p = item.product;
        const applicable = safeJsonParse(p.applicableBadges, []);
        const aggregates = computeBadgeAggregates(p.reviews || [], applicable);

        // Compute days since wishlisted
        const addedDate = new Date(item.addedAt);
        const diffTime = Math.abs(now - addedDate);
        const daysStalled = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        // Build re-engagement message
        const badgeHighlights = [];
        let deepLinkFilter = 'all';

        // Check all available aggregate keys
        for (const [key, agg] of Object.entries(aggregates)) {
          if (agg.total > 0) {
            badgeHighlights.push({
              label: agg.displayLabel,
              percent: agg.percentPositive,
              total: agg.total,
              positiveCount: agg.positiveCount,
              belowThreshold: agg.belowThreshold,
              badgeKey: key
            });
            if (deepLinkFilter === 'all' && (key === 'authenticity' || key === 'fit' || key === 'photoMatch')) {
              deepLinkFilter = key;
            }
          }
        }

        let message = null;
        if (badgeHighlights.length > 0) {
          const primary = badgeHighlights[0];
          const secondary = badgeHighlights[1];

          if (!primary.belowThreshold) {
            if (secondary && !secondary.belowThreshold) {
              message = `Based on ${(p.reviews || []).length} reviews: ${primary.percent}% confirm it ${primary.label.toLowerCase()}, and ${secondary.percent}% say it ${secondary.label.toLowerCase()}.`;
            } else {
              message = `Based on ${(p.reviews || []).length} reviews: ${primary.percent}% of buyers confirm it ${primary.label.toLowerCase()}.`;
            }
          } else {
            message = `${primary.positiveCount} of ${primary.total} reviewers confirm it ${primary.label.toLowerCase()}.`;
          }
        }

        const reengagement = {
          hasData: badgeHighlights.length > 0,
          daysStalled,
          badgeHighlights,
          deepLinkFilter,
          message
        };

        const { reviews, ...productWithoutReviews } = p;

        return {
          id: item.id,
          productId: item.productId,
          addedAt: item.addedAt,
          daysStalled,
          reengagement,
          product: formatProduct(productWithoutReviews, aggregates)
        };
      });

    res.json(formatted);
  } catch (err) {
    next(err);
  }
});

// POST /api/wishlist/:productId — add product to wishlist
router.post('/:productId', async (req, res, next) => {
  try {
    const { productId } = req.params;
    const sanitizedId = String(productId).slice(0, 50);

    const product = await prisma.product.findUnique({
      where: { id: sanitizedId }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const item = await prisma.wishlistItem.upsert({
      where: { productId: sanitizedId },
      update: { addedAt: new Date() },
      create: { productId: sanitizedId, addedAt: new Date() }
    });

    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/wishlist/:productId — remove product from wishlist
router.delete('/:productId', async (req, res, next) => {
  try {
    const { productId } = req.params;
    const sanitizedId = String(productId).slice(0, 50);

    await prisma.wishlistItem.deleteMany({
      where: { productId: sanitizedId }
    });

    res.json({ success: true, removedProductId: sanitizedId });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
