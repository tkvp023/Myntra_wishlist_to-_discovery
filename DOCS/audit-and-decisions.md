# System Audit & Architecture Decisions — v2 Implementation

> **Comprehensive resolution of all open items, decisions, and system capabilities across Categories A, B, C, D, and E.**

---

## 📌 Category A: Previously Unbuilt / Newly Added Features

### 1. Two-Notification-Type System (Built & Active)
Implemented in [**`NotificationDrawer.jsx`**](frontend/src/components/notifications/NotificationDrawer.jsx) and [**`InAppNotificationToast.jsx`**](frontend/src/components/notifications/InAppNotificationToast.jsx):
- **Type 1: Wishlist-Bound Milestone Alert:**
  - *Trigger:* A stalled saved item crosses the 50-submission threshold while in the user's wishlist.
  - *Content:* Curated single strongest positive stat (e.g. *"93% confirm Roadster Shirt feels genuine"*).
  - *Deep-Link:* Pulls user to the Wishlist midpoint or directly to the filtered PDP.
- **Type 2: Direct Product Trust Confirmation Alert:**
  - *Trigger:* Ambient trust milestone confirmation on viewed items.
  - *Deep-Link:* Direct to the PDP review section with filter pre-applied.
- **Priority Enforcement:** If a price drop alert and a trust badge alert occur on the same day, the **Price Drop alert takes precedence** (simulated via high-priority tag at top of notification drawer).
- **Staggering Rule:** Minimum **2-hour (120 min) gap** enforced between same-day notifications.

### 2. Appliances / Electronics (8th Category Added)
- **Taxonomy:** Added `appliances` with `applicableBadges: ["authenticity", "overallSatisfaction"]` (2 badges per Section 6).
- **Seed SKU:** Added `prod_13` (Philips Heated Hair Straightening Brush BHH880) with authentic reviews.
- **UI Integration:** Added to `CATEGORY_BUBBLES` on Homepage, `CategoriesPage`, and image resolver in `imageHelper.js`.

### 3. Search / Category Display Cap & Multi-Match Rule
Implemented in [**`SearchOverlay.jsx`**](frontend/src/components/search/SearchOverlay.jsx):
- **Strict Cap:** Capped at **2–3 wishlisted items maximum** when multiple items match a search query.
- **Section 8 Rule:** Renders **Thumbnail + Product Name ONLY** (**NO trust stats**, preventing visual clutter during search discovery).
- **Tiebreak Logic:**
  1. Most recently wishlisted (`addedAt` desc)
  2. Highest trust confirmation percentage
  3. Review volume / best seller

### 4. Homepage / Notification Dedupe Logic
- When a wishlisted product's trust stat is actively featured in an unread push alert, the Homepage displays a dedicated **"Wishlist Trust Updates" (Funnel Entry Ramp)** shelf rather than repeating duplicate inline banners across multiple surfaces in the same session.

### 5. Notification Staggering Gap Value
- **Standardized Value:** **2 hours (120 minutes)** minimum interval between same-day push sends for a single user.

---

## 📌 Category B: Scope Clarifications & Standardization

### 1. Homepage Trust-Pill Scope (Two-Tier Model)
- **Tier 1 (Personalized Funnel Entry Ramp):** A dedicated, soft-tinted **"Trust Milestone on Saved Items"** shelf appears at the top of the Homepage when the user has wishlisted items that have verified trust data. This serves as the explicit funnel entry ramp into the Wishlist/PDP journey.
- **Tier 2 (General Catalog Products):** Standard product cards display a single strongest positive trust summary pill (e.g. `93% Feels Genuine`) to preview trust verification during general browsing.

### 2. Category Taxonomy Scope Standardization
- Standardized `bags` to **"Bags & Accessories"** across `CategoriesPage.jsx`, `HomePage.jsx`, and all documentation to accurately reflect totes, backpacks, and accessories.

---

## 📌 Category C: Concrete Content & Copy Rules

### 1. Low-Sample Submission Copy Rules (1–49 Range)
| Range | Display Rule | Copy Phrasing |
|---|---|---|
| **0 submissions** | Hidden | No card / stat rendered |
| **1–9 submissions** | Raw Count Format | `"X of Y verified buyers confirm [Stat]"` (e.g. *"4 of 5 buyers confirm Fits as Expected"*) |
| **10–49 submissions** | Momentum Format | `"Gaining traction — X buyers confirm [Stat]"` (e.g. *"Gaining traction — 18 buyers confirm Fits as Expected"*) |
| **50+ submissions** | Full Percentage | `"85% Fits as Expected"` (+ progress bar) |

### 2. Search / Category Tiebreak Order
When multiple wishlisted products qualify on a search query:
1. `addedAt` timestamp (most recently saved first)
2. `percentPositive` (highest confirmed trust score first)
3. Total review volume / rating

---

## 📌 Category D: Engineering & Data Architecture

### 1. Prisma Schema & Notification Tracking
The schema supports:
- 9 distinct badge fields on `Review` model (`badgeAuthenticity`, `badgeFit`, `badgePhotoMatch`, `badgeFabricFeel`, `badgeComfortFeel`, `badgeMaterialFeel`, `badgeFinishDurability`, `badgeShadeMatch`, `badgeOverallSatisfaction`).
- `WishlistItem` with `addedAt` timestamp to compute `daysStalled` and trigger re-engagement.

### 2. Real-Time vs. Batch Aggregation
- **MVP Implementation:** Aggregates are computed dynamically in real-time in `badgeHelper.js` during API request processing.
- **Production Architecture:** At high scale, when review count crosses 50, a background worker (e.g., Redis Queue / BullMQ) materializes the aggregate JSON into `product.cachedBadgeAggregates` and triggers the one-time notification webhook.

### 3. Badge-Text Mismatch Handling
- **Principle:** Accepted as natural user sentiment nuance. A buyer may award 5★ overall because they love the style, but tap "Doesn't Fit as Expected" because it ran small. This multi-dimensional nuance is the core reason structured badges provide higher value than a single star rating.

---

## 📌 Category E: Measurement & Experimentation (Production Roadmap)

### 1. Matched-Cohort / Holdout Pilot Design
To avoid confounding product popularity with the badge effect:
- **Design:** Holdout A/B testing on matched product pairs within the same price band, brand tier, and traffic velocity.
  - *Group A (Control):* Standard Myntra PDP (Star rating + text reviews only).
  - *Group B (Test):* Trust Badges + Part B Dashboard + Part C Wishlist Re-engagement.
- **Primary Metric:** Wishlist-to-Cart Conversion Rate and 7-day Return Rate reduction.

### 2. Event Logging Schema
Events to track across the purchase funnel:
- `review_badge_tapped`: `{ badge_type, selected_state, product_id }`
- `threshold_crossed`: `{ product_id, timestamp, review_count: 50 }`
- `notification_sent`: `{ user_id, product_id, notif_type, stat_shown }`
- `notification_clicked`: `{ user_id, product_id, deep_link_filter }`
- `pdp_badge_filter_applied`: `{ product_id, filter_badge_key }`
- `add_to_bag_from_trust_pdp`: `{ product_id, pre_filtered: boolean }`
