# v2 Changelog — What Changed from v1 and Why

> Quick-reference diff for anyone picking up the codebase. For full context, see [newproblemstatement.md](file:///c:/Users/THARUN/Videos/Graduation_project_mvp/newproblemstatement.md).

---

## Badge Taxonomy Changes

### New: Fit Badge (Clothing & Footwear only)
- **States:** Not Sure Yet (default) → Fits as Expected → Doesn't Fit as Expected
- **Why:** Sizing/fit surfaced independently across interviews (Prashant 6'3", Arun, Dhanush shoe fit). Fit is a distinct recurring doubt separate from fabric/authenticity — not a subset.
- **DB field:** `badgeFit`
- **Icon:** Ruler (lucide-react)

### Changed: Overall Satisfaction No Longer Universal
- **Was:** Universal — every category
- **Now:** Every category **except** Clothing and Footwear
- **Why:** Clothing & Footwear — the two highest-volume categories — rely on Fit + Fabric Feel/Comfort + Photo Match + Authenticity to triangulate satisfaction indirectly, rather than a direct catch-all. Deliberate trade-off: more specific signal over one vague one.

### Updated Category → Badge Mappings

| Category | v1 Badges | v2 Badges | What Changed |
|---|---|---|---|
| **Clothing** | authenticity, photoMatch, fabricFeel, overallSatisfaction | authenticity, photoMatch, **fit**, fabricFeel | +fit, −overallSatisfaction |
| **Footwear** | authenticity, photoMatch, comfortFeel, overallSatisfaction | authenticity, photoMatch, **fit**, comfortFeel | +fit, −overallSatisfaction |
| **Bags** | authenticity, photoMatch, materialFeel, overallSatisfaction | authenticity, photoMatch, overallSatisfaction, materialFeel | Reordered only |
| **Jewelry** | authenticity, photoMatch, finishDurability, overallSatisfaction | authenticity, photoMatch, overallSatisfaction, finishDurability | Reordered only |
| **Makeup** | authenticity, shadeMatch, overallSatisfaction | authenticity, overallSatisfaction, shadeMatch | Reordered only |
| Skincare/Haircare/Fragrance/Appliances | No change | No change | — |

---

## Threshold Change

- **Was:** 5 submissions → show percentage
- **Now:** **50 submissions** → show percentage
- **Why:** Protects against Amazon's documented small-sample-misrepresentation failure mode. Cost: long-tail products may never cross 50. Conscious bet on statistical confidence over broad coverage.

### New 3-tier display logic:
| Count | Display |
|---|---|
| 0 | Nothing shown |
| 1–49 | Raw count or "gaining traction" copy |
| 50+ | Full percentage breakdown |

---

## New Sections in Problem Statement (not in v1)

### Section 5: Core User Journey (Funnel)
```
Entry points → WISHLIST PAGE → PRODUCT PAGE → Add to Bag → Checkout
```
The entire solution exists to move users through this one path. Every touchpoint serves this funnel.

### Section 7: Low-Sample Data Handling (updated)
Detailed threshold rules and trade-off rationale.

### Section 8: Touchpoint Content Map
### Section 8: Touchpoint Content Map (Updated)
Different surfaces show different slices of badge data:
- **Notifications:**
  - *Product-Page Notification (1 item):* 1 stat, positive-only → deep-links to Product page (capped 1 per item, ever).
  - *Wishlist-Bound Notification (2+ items):* Multi-item summary, positive-only → deep-links to Wishlist page (repeatable).
- **Homepage:**
  - *1 qualifying item:* Single-item stat → taps through to Product page.
  - *2+ qualifying items:* Multi-item trust updates shelf → taps through to Wishlist page.
  - *0 qualifying items:* Nothing shown.
- **Search/Category:**
  - Native type-ahead suggestion list stays completely unmodified.
  - Wishlist reminder appears only after tapping a suggestion and landing on results grid.
  - Shown as an inline marker on the matching product tile (thumbnail + name only, no stats).
- **Wishlist page:** 1–2 stats per saved item, positive-only.
- **Product page:** Full transparent panel, all badges with state-by-state % breakdown (unfiltered due diligence).

See [touchpoint-content-map.md](file:///c:/Users/THARUN/Videos/Graduation_project_mvp/DOCS/touchpoint-content-map.md) for full reference.

### Section 9: Notification Rules (Two-Type Split)
- Product-page vs. Wishlist-bound split based on item count.
- Equal priority with price/discount notifications (staggered with minimum gap).

---

## Files Impacted by v2

| File | Change |
|---|---|
| `backend/prisma/schema.prisma` | Added `badgeFit String?` and `gender String?` |
| `backend/src/utils/badgeHelper.js` | Threshold 5→50, added fit to mappings |
| `backend/src/routes/reviews.js` | Added `fit: 'badgeFit'` to BADGE_FIELD_MAP |
| `backend/src/routes/products.js` | Added `badgeFit: true`, `gender`, and `beauty` filtering |
| `backend/prisma/seed.js` | Added `badgeFit` & `gender` to review/product seed data |
| `frontend/src/utils/badgeConfig.js` | Added fit badge type, updated CATEGORY_BADGES |
| `frontend/src/components/pdp/ReviewCard.jsx` | Added fit to badgeFieldList |
| `frontend/src/components/notifications/NotificationDrawer.jsx` | Implemented two-notification-type system |
| `frontend/src/components/search/SearchOverlay.jsx` | Inline thumbnail + name only search touchpoint |
| `frontend/src/pages/HomePage.jsx` | Added MEN, WOMEN, BEAUTY, KIDS tabs and Wishlist Trust Updates shelf |
| `DOCS/seed-data.json` | 15 products across 8 categories, 136 reviews |
| `DOCS/problemstatement.md` | Synchronized with v2 taxonomy, threshold, funnel, and notification/search splits |
| `DOCS/touchpoint-content-map.md` | Section 8 & 9 reference map |

---

## Known Gaps Carried Forward (Open Items — Section 10)

1. Notification stagger gap value (e.g., 2 hours vs. 4 hours)
2. Homepage/Notification dedupe logic
3. Copy variants for 1–49 submission range
4. Appliances/Electronics functional-quality badge gap
5. Category taxonomy validation against Myntra's real tree
6. Real-time vs. batch aggregation at threshold crossing
7. Badge-text mismatch handling
8. Matched-cohort pilot measurement design + event logging spec
