# Myntra Trust-Verified Architecture MVP: Step-by-Step System Guide

## Executive Overview

The **Myntra Trust-Verified Architecture MVP** addresses the primary friction points in online fashion e-commerce: **52.5% Quality Doubt hesitation** and the **84.4% Wishlist Drop-Off ("Wishlist Graveyard")** phenomenon. 

Rather than building an isolated, foreign tool, this system seamlessly integrates into **Myntra's existing post-purchase verified review pipeline** and **notification engine**, delivering structured, quantitative trust signals at the precise moment a shopper requires due-diligence validation.

---

## Complete Step-by-Step Walkthrough Guide

```
+-----------------------------------------------------------------------------------+
|                            6-STEP SHOPPER JOURNEY                                 |
|                                                                                   |
|  [Step 1] Push Notification  -->  [Step 2] Homepage Trust Shelf                   |
|         |                                 |                                       |
|         v                                 v                                       |
|  [Step 3] Search Markers     -->  [Step 4] Wishlist Intent Tags & Top-4 Stats     |
|         |                                 |                                       |
|         v                                 v                                       |
|  [Step 5] PDP Trust Metrics  -->  [Step 6] Review Filtering & Daylight UGC Proof  |
+-----------------------------------------------------------------------------------+
```

---

### Step 1: Trust Milestone Push Notification
*Re-engaging stalled intent through quality confirmation without commercial spam.*

```
+-----------------------------------------------------------------------------+
|  🔔 WISHLIST TRUST MILESTONE                                            [✕]  |
|  [👔] ROADSTER • Men Slim Fit Casual Checked Shirt                          |
|       "93% of verified buyers confirm this feels genuine"                   |
|       View Verified Reviews →                                               |
+-----------------------------------------------------------------------------+
```

#### 1. User Experience & Screen Action
- **What the User Sees:** An ambient in-app push notification banner appearing at the top of the mobile interface.
- **Copy:** Highlights a single high-confidence attribute: *"93% of verified buyers confirm this feels genuine"*.
- **Interactive Action:** Tapping the notification banner deep-links the shopper directly into the verified reviews section on that product's PDP with the `Authenticity` filter pre-selected.

#### 2. Architectural Rules & Research Rationale
- **Alternation with Existing Myntra Alerts:** Myntra already sends commercial notifications (Price Drops, Sale Reminders, Back-in-Stock alerts). Trust Milestone notifications do not increase total notification volume; they intelligently alternate within existing wishlist communication slots.
- **Priority Hierarchy:** If a price drop occurs on the same day as a milestone, the **Price Drop takes precedence**. On neutral days, Trust Milestones resolve quality hesitation without eroding profit margins through discount slashing.
- **Consensus Requirement:** Only stalled items that achieve positive buyer consensus qualify for push triggers.

---

### Step 2: Homepage Trust Milestones & Discovery Shelf
*Midpoint re-engagement using subtle visual isolation.*

```
+-----------------------------------------------------------------------------+
|  Saved Items with Trust Milestones                                  View All |
|  +---------------------------+   +---------------------------+               |
|  | [👔] Trending Pick        |   | [👟]                      |               |
|  | ROADSTER                  |   | PUMA                      |               |
|  | ₹649  62% OFF             |   | ₹2,199  45% OFF           |               |
|  | 🛡️ 93% Genuine · 85% Fits |   | 🛡️ 88% Genuine · 92% Fits |               |
|  | (Warm Coral Accent Border)|   | (Standard Border)         |               |
|  +---------------------------+   +---------------------------+               |
+-----------------------------------------------------------------------------+
```

#### 1. User Experience & Screen Action
- **What the User Sees:** A dedicated *"Saved Items with Trust Milestones"* carousel situated at the homepage midpoint.
- **Visual Isolation (Von Restorff Effect):** The #1 highest-confidence item (Roadster Shirt) features a subtle warm coral accent border (`#FF6B4A`) and a `"Trending pick"` label.
- **Interactive Action:** Tapping any product card opens its Product Detail Page (PDP).

#### 2. Architectural Rules & Research Rationale
- **Non-Intrusive Midpoint Discovery:** Re-engages shoppers browsing the home feed with saved items they previously hesitated on, without aggressive countdown timers or hard sales banners.
- **Compact Dual Metrics:** Displays two high-value metrics (e.g. `93% Genuine · 85% Fits`) at a glance to reduce initial cognitive load.
- **General Catalog Badges:** Category product cards across the home feed surface single strongest positive badges (e.g. `✓ 93% Feels Genuine`).

---

### Step 3: Search Discovery & Wishlist Tile Markers
*Zero-intrusion keyword discovery with detail scaling.*

```
+-----------------------------------------------------------------------------+
|  [🔍 Search "Shirts"                                                    ]   |
|  +---------------------------+   +---------------------------+               |
|  | [👔] 🤍 Wishlisted        |   | [👔]                      |               |
|  | ROADSTER Casual Shirt     |   | HIGHLANDER Casual Shirt   |               |
|  | ₹649                      |   | ₹799                      |               |
|  | (No Trust Stats Here)     |   | (Standard Result)         |               |
|  +---------------------------+   +---------------------------+               |
+-----------------------------------------------------------------------------+
```

#### 1. User Experience & Screen Action
- **What the User Sees:** Tapping the search bar provides native type-ahead keyword suggestions.
- **Results Grid:** Matching items that are already in the user's wishlist display an inline **`[🤍 Wishlisted]`** marker on the image tile with thumbnail and price only.
- **Interactive Action:** Searching for `"shirts"` highlights previously saved items directly within search results.

#### 2. Architectural Rules & Research Rationale
- **Zero Search Intrusion:** During typing, suggestions remain clean and native with no injected prompts or banner clutter.
- **Detail Scales with Intent:** Trust percentages are intentionally withheld on the search results grid to prevent visual exhaustion. Full metric dashboards are reserved for the PDP due-diligence stage.

---

### Step 4: Wishlist Trust Signals & Intent Tagging
*Organizing 1–3 month buying horizons and balanced information density.*

```
+-----------------------------------------------------------------------------+
|  WISHLIST (6 items)                                   [Collections ▾]        |
|  +---------------------------+   +---------------------------+               |
|  | Item 1 (Auto-Shown Stats) |   | Item 5 (On-Demand Toggle) |               |
|  | ROADSTER Casual Shirt     |   | MANGO Tailored Coat       |               |
|  | 🏷️ [💼 Workwear] [+ Tag]  |   | 🏷️ [+ Tag]                |               |
|  | 🛡️ 93% Feels Genuine     |   | [📊 View Trust Stats ▾]   |               |
|  | 🛡️ 85% Fits As Expected   |   |                           |               |
|  +---------------------------+   +---------------------------+               |
+-----------------------------------------------------------------------------+
```

#### 1. User Experience & Screen Action
- **Top 4 Auto-Show Rule:** The first 4 items in the wishlist grid automatically display their top 1–2 positive verified buyer stats directly on the card.
- **On-Demand "View Trust Stats" (Items 5+):** Items beyond the top 4 show a clean card with an expandable **`[📊 View Trust Stats ▾]`** button.
- **Intent Tagging:** Users tap **`[+ Tag]`** to assign custom occasion tags (`💼 Workwear`, `🎁 Gift Idea`, `✨ Aspirational`).
- **Trending Momentum Phrasing:** Items with early review counts display **`🔥 Trending: More buyers noticing this`** instead of raw numbers.

#### 2. Architectural Rules & Research Rationale
- **Preventing the "Wishlist Graveyard":** 84.4% of wishlists drop off because users mix immediate needs with long-term gift/aspirational ideas. Intent tagging organizes items by purchasing horizon.
- **Cognitive Load Balancing:** Auto-showing stats on the top 4 cards provides immediate reassurance, while the collapsible toggle on cards 5+ keeps long lists readable.
- **1-Tap Explainability:** Tapping any trust badge pill deep-links straight into verified reviews filtered by that exact attribute.

---

### Step 5: PDP Trust-Verified Dashboard
*Wireframe-matched quantitative due diligence integrated with Myntra's review engine.*

```
+-----------------------------------------------------------------------------+
|  Trust-Verified Dashboard                           [Verified Buyer Data]   |
|  +--------------+  +--------------+  +--------------+  +-----------------+  |
|  |     🛡️       |  |      📷      |  |      📦      |  |       👍        |  |
|  |     92%      |  |     87%      |  |     78%      |  |       94%       |  |
|  | Feels        |  | Matches      |  | Fabric As    |  | Overall         |  |
|  | Genuine      |  | Photos       |  | Described    |  | Satisfaction    |  |
|  +--------------+  +--------------+  +--------------+  +-----------------+  |
+-----------------------------------------------------------------------------+
```

#### 1. User Experience & Screen Action
- **What the User Sees:** A horizontal carousel of centered vertical cards matching the production wireframe: large iconic glyphs (Shield, Camera, Layers, ThumbsUp), bold emerald percentages, and clear descriptive labels.
- **Interactive Action:** Tapping any card (e.g. *"Matches Photos"*) instantly slices and filters the customer review list below.

#### 2. Architectural Rules & Research Rationale
- **Seamless Integration with Existing Review Infrastructure:** Myntra already possesses an established post-purchase review collection system that verifies customer deliveries. The Trust Dashboard hooks directly into this existing verified-buyer stream with lightweight structured prompts, requiring no separate platform or additional user friction.
- **Neutralizing 52.5% Quality Doubt:** Corpus research indicates quality doubt is the single largest checkout hesitation. Aggregate metrics provide immediate empirical reassurance.
- **Low-Sample Momentum:** Newly listed SKUs display trending discovery counts (`🔥 Gaining momentum`) until reaching statistical confidence.

---

### Step 6: Review Filtering & Natural Lighting UGC Photos
*Unedited visual proof and attribute slice verification.*

```
+-----------------------------------------------------------------------------+
|  Customer Reviews (1,248)                                                    |
|  [All]  [✓ Feels Genuine]  [✓ Matches Photos]  [✓ Fabric Feel]  [📷 Photos] |
|                                                                             |
|  Customer Photos: [🖼️ Natural Light Tag] [🖼️ Natural Light Tag]            |
|                                                                             |
|  👤 Rahul S.  [✓ Verified Buyer]  ★★★★★                                    |
|     Verified SKU Attributes: [✓ Matches Photos] [✓ Feels Genuine]           |
|     "Fabric is pure breathable cotton. Color matches the app photos."       |
+-----------------------------------------------------------------------------+
```

#### 1. User Experience & Screen Action
- **Filter Chips Bar:** Slices reviews by specific trust dimensions (`Authenticity`, `Photo Match`, `Fabric Feel`, `5 Stars`).
- **Customer Photo Lightbox:** Clicking any customer photo opens a high-resolution lightbox displaying the **"Natural Lighting"** verification tag.
- **Verified Buyer Cards:** Each review displays verified buyer badges confirming actual delivery and attribute verification.

#### 2. Architectural Rules & Research Rationale
- **Daylight UGC Proof:** Shoppers trust unedited customer photos taken in natural daylight significantly more than polished studio catalog photography.
- **Delivery SKU Verification:** Myntra's backend order tracking ensures only real buyers can submit reviews, preserving absolute data integrity.

---

## Architectural Summary Table

| Step # | Touchpoint | Primary User Action | Backend / System Rule |
|---|---|---|---|
| **1** | **Push Notification** | Tap ambient banner to view reviews | Alternates with Price Drops & Sales; Price Drops take same-day priority |
| **2** | **Homepage Shelf** | Inspect top-trust saved items | #1 item isolated with warm coral border (`#FF6B4A`) via Von Restorff effect |
| **3** | **Search Markers** | Search keywords; see `[🤍 Wishlisted]` | Zero type-ahead intrusion; stats withheld on search grid to prevent clutter |
| **4** | **Wishlist Tags** | Tag items by intent; expand stats | Top 4 auto-show stats; items 5+ use toggle; tags organize 1–3 mo. horizons |
| **5** | **PDP Dashboard** | Tap metric cards to filter reviews | Hooks into Myntra's existing verified buyer pipeline; wireframe-aligned |
| **6** | **Review Filters** | Filter reviews; inspect daylight UGC | Daylight lighting metadata + Myntra delivery tracking validation |

---

## Studio Interface & Accessibility

- **Dual-Mode Studio Switcher:** Seamlessly toggle between **Walkthrough Mode** (with left tour navigator and right research insight wings) and **Normal App View** (clean mobile phone interface).
- **Accessible Design System:** WCAG AAA high-contrast dark slate palette (`#0D0F17` / `#161922` / `#FFFFFF`), clean sans-serif typography, structured micro-icons, and 100vh single-screen responsive fit.
