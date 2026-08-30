# Touchpoint Content Map — v2 Reference Card

> **Source:** newproblemstatement.md Section 8
> **Guiding principle:** The further a touchpoint is from the buying decision, the more curated/positive the signal. The closer to the decision (Product page), the more complete and honest the data.
> This is the "detail scales with intent" pattern.

---

## 2. Touchpoint Content Matrix

| # | Touchpoint | Trigger & Surface | Badge Selection Logic | Detail Shown | Shows Negative / Mixed Stats? | Deep-Link Destination |
|---|---|---|---|---|:---:|---|
| **1a** | **Notifications (Single Item)** | Stalled wishlist item crosses 50 threshold | Single strongest positive stat | 1 stat | ❌ Positive-only | Product Page (`/product/:id?filter=...`) |
| **1b** | **Notifications (Multi Item)** | 2+ wishlisted items have positive stats | Multi-item summary statement | Multi-item overview | ❌ Positive-only | Wishlist Page (`/wishlist`) |
| **2a** | **Homepage (1 Item)** | Exactly 1 wishlisted item qualifying | Single strongest positive stat | 1 stat shelf card | ❌ Positive-only | Product Page (`/product/:id?filter=...`) |
| **2b** | **Homepage (2+ Items)** | 2+ wishlisted items qualifying | Multi-item trust milestone overview | Multi-item scroll shelf | ❌ Positive-only | Wishlist Page (`/wishlist`) |
| **3** | **Search & Category Results** | Keyword / category match on actual results grid | Inline tile marker | Thumbnail + name ONLY (no stats) | N/A — No stat shown | Product Page (`/product/:id`) |
| **4** | **Wishlist Page** | Stalled item grid & re-engagement | Top 1–2 strongest positive stats | 1–2 stats per card | ❌ Positive-only | Product Page (`/product/:id?filter=...`) |
| **5** | **Product Detail Page (PDP)** | User lands on product due diligence | Complete aggregate panel | All badges + full state % breakdown | ✅ **Full transparency (all states)** | Add to Bag / Buy Now |

---

## Per-Touchpoint Implementation Rules

### 1. Notifications (Part C — simulated in MVP)
- **Trigger:** Item crosses 50-submission threshold while still in user's wishlist
- **Content:** Single strongest positive stat (e.g., "87% confirm this matches photos")
- **Cap:** 1 badge notification per item, sent once
- **Priority:** If price/discount notification would fire same day → price wins
- **Format:** Aggregate only, no individual reviewer named, no monetary language
- **Deep-link:** To the specific product's PDP, scrolled to Part B summary

### 2. Homepage (`HomePage.jsx` & `ProductCard.jsx`)
- **Resolved 3-Way State Resolution Matrix:**
  - **Case 0 (0 qualifying items with positive stats):** Nothing shown (positive-only rule, shelf is hidden).
  - **Case 1 (Exactly 1 qualifying item with positive stats):** Single-item stat card → taps through **directly to Product Page** (`/product/:id?filter=...`), mirroring the single-item Product notification.
  - **Case 2 (2 or more qualifying items with positive stats):** Multi-item summary shelf (`"X Saved Items with Trust Milestones"`) → taps through **to Wishlist Page** (`/wishlist`), pulling the user into the Wishlist midpoint.
- **General Product Cards:** Display single strongest positive stat tag (`93% Feels Genuine`).

### 3. Search & Category Results (`SearchOverlay.jsx`)
- **Type-Ahead Stage:** Unchanged, native Myntra keyword suggestions (zero wishlist intrusion while typing).
- **Results Grid Stage:** Matching wishlisted items receive an **inline tile marker** (`[🤍 Wishlisted]` pill) on their product card tile.
- **Content Shown:** Per Section 8 — thumbnail + name + price only (NO trust stats shown on search discovery).
- **Cap & Tiebreak:** Irrelevant / not needed, as markers appear naturally on matching tiles within Myntra's standard results grid.

### 4. Wishlist Page (`WishlistCard.jsx`, `ReengagementCard.jsx`)
- **Trigger:** Product is in user's wishlist and has badge data
- **Content:** Top 1–2 strongest positive stats per item
- **UI goal:** Remind user why they wishlisted without overwhelming — curated positive-leaning summary
- **Message format:** "Based on X reviews: Y% confirm it [positive label]"
- **Deep-link CTA:** "SEE REVIEWS" → PDP with badge filter pre-applied

### 5. Product Page (`BadgeAggregates.jsx`, full review section)
- **Trigger:** Always shown if any badge data exists
- **Content:** FULL panel — every badge the product has data for, with complete state-by-state percentage breakdowns
- **Shows negative:** ✅ YES — this is the point of full transparency
- **UI:** All aggregate cards visible, filter chips for each badge type, review cards show individual badge pills
- **This is the conversion point** — user does final due diligence before Add to Bag → Checkout

---

## Low-Sample Threshold Rules (Section 7)

| Submission Count | What's Shown | Copy Style |
|---|---|---|
| **0** | No badge/stat shown at all | — |
| **1–49** | Raw count OR "gaining traction" momentum copy | `"X of Y reviewers confirm..."` or `"Gaining traction — X reviews so far"` |
| **50+** | Full percentage breakdown | `"87% Matches Photos"` |

> **Threshold = 50** (raised from v1's 5). This protects against small-sample misrepresentation but means long-tail products may never show percentages. Conscious trade-off.

---

## Open Items (from Section 8 & 16)

1. **Exact copy variants** for 1–49 range + trigger rule for raw count vs. momentum phrasing — TBD
2. **Search/Category display order** when multiple wishlisted items match — TBD
3. **Homepage/Notification dedupe** logic to avoid showing same line twice — TBD
4. **Below-threshold momentum copy:** Currently using `"X of Y reviewers confirm..."` as placeholder — finalize before launch
