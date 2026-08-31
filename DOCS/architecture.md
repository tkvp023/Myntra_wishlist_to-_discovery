# Architecture — Myntra Trust-Verified Review System MVP (v2)

## 1. System Overview

A mobile-app-shaped web application that layers a **trust-verified review badge system** into Myntra's existing product discovery and purchase flow. The system has three interconnected parts:

| Part | Feature | User Touchpoint |
|------|---------|-----------------|
| **A** | Tap-Based Trust Badges | Review submission flow (post-purchase) |
| **B** | Filterable Review Dashboard | Product Detail Page (pre-purchase) |
| **C** | Wishlist Re-Engagement | Wishlist page (stalled-intent recovery) |

### High-Level Architecture

```mermaid
graph TB
    subgraph Client ["Frontend (Vercel)"]
        direction TB
        SHELL[App Shell — Phone Frame]
        SHELL --> ROUTER[React Router v7]
        ROUTER --> HOME[Home Page]
        ROUTER --> PDP[Product Detail Page]
        ROUTER --> WISH[Wishlist Page]
        ROUTER --> PROF[Profile Page]
        PDP --> REVIEW_MODAL[Review Modal — Part A]
        PDP --> BADGE_AGG[Badge Aggregates — Part B]
        PDP --> FILTER[Filter Chips — Part B]
        WISH --> REENGAGE[Re-engagement Cards — Part C]
    end

    subgraph Server ["Backend (Railway)"]
        direction TB
        EXPRESS[Express.js API Server]
        EXPRESS --> PROD_ROUTES[/api/products]
        EXPRESS --> REV_ROUTES[/api/reviews]
        EXPRESS --> WISH_ROUTES[/api/wishlist]
        PRISMA[Prisma ORM]
        PROD_ROUTES --> PRISMA
        REV_ROUTES --> PRISMA
        WISH_ROUTES --> PRISMA
    end

    subgraph Database ["PostgreSQL (Railway Addon)"]
        DB[(PostgreSQL)]
    end

    Client -->|HTTPS REST API| Server
    PRISMA --> DB

    style SHELL fill:#FF3F6C,color:#fff
    style EXPRESS fill:#282c3f,color:#fff
    style DB fill:#14958F,color:#fff
```

---

## 2. Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18+ | UI component framework |
| **Vite** | 6+ | Build tool, dev server, HMR |
| **Tailwind CSS** | v4 | Utility-first styling with custom Myntra tokens |
| **React Router** | v7 | Client-side routing (SPA) |
| **Lucide React** | Latest | Icon library |
| **Google Fonts** | — | Assistant + Roboto typefaces |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 20 LTS | Runtime |
| **Express.js** | 4.x | HTTP server, routing, middleware |
| **Prisma** | 6.x | ORM, schema management, migrations |
| **PostgreSQL** | 16 | Relational database |
| **cors** | Latest | Cross-origin resource sharing |
| **dotenv** | Latest | Environment variable management |

### Deployment

| Service | Platform | Purpose |
|---------|----------|---------|
| Frontend | **Vercel** | Static site + SPA hosting, CDN, auto-deploy from Git |
| Backend | **Railway** | Node.js hosting, auto-deploy from Git |
| Database | **Railway PostgreSQL** | Managed PostgreSQL addon |

---

## 3. Data Flow

### 3.1 Product Browsing (Home → PDP)

```mermaid
sequenceDiagram
    participant U as User
    participant FE as Frontend
    participant API as Backend API
    participant DB as PostgreSQL

    U->>FE: Opens app / Home page
    FE->>API: GET /api/products
    API->>DB: SELECT products
    DB-->>API: Product list
    API-->>FE: JSON product array
    FE-->>U: Renders product grid

    U->>FE: Taps product card
    FE->>API: GET /api/products/:id
    API->>DB: SELECT product + computed badge aggregates
    DB-->>API: Product detail + aggregates
    API-->>FE: JSON product + badges
    FE-->>U: Renders PDP with badge aggregate cards
```

### 3.2 Review Submission with Badges (Part A)

```mermaid
sequenceDiagram
    participant U as User
    participant FE as Frontend
    participant API as Backend API
    participant DB as PostgreSQL

    U->>FE: Taps "Write a Review"
    FE-->>U: Opens review modal

    U->>FE: Selects star rating (1-5)
    U->>FE: Taps trust badges (cycles through states)
    U->>FE: Types review text
    U->>FE: Taps "Submit"

    FE->>API: POST /api/products/:id/reviews
    Note right of FE: Body: { rating, text, sizeBought,<br/>badgeAuthenticity, badgePhotoMatch,<br/>badgeFabricFeel, badgeOverallSatisfaction }
    
    API->>DB: INSERT review with badge data
    API->>DB: UPDATE product rating + reviewCount
    DB-->>API: Success
    API-->>FE: 201 Created + review object
    FE-->>U: Success animation + closes modal
    FE->>API: GET /api/products/:id (refresh aggregates)
```

### 3.3 Filtered Review Dashboard (Part B)

```mermaid
sequenceDiagram
    participant U as User
    participant FE as Frontend
    participant API as Backend API
    participant DB as PostgreSQL

    U->>FE: Taps filter chip (e.g., "Photo Match ✓")
    FE->>API: GET /api/products/:id/reviews?badge=photoMatch&value=matches
    API->>DB: SELECT reviews WHERE badgePhotoMatch = 'matches'
    DB-->>API: Filtered reviews
    API-->>FE: JSON filtered review list
    FE-->>U: Updates review list with matching reviews

    U->>FE: Toggles "Disagree Only"
    FE->>API: GET /api/products/:id/reviews?badge=photoMatch&disagreeOnly=true
    API->>DB: SELECT reviews WHERE badgePhotoMatch IN ('slightlyDiff', 'veryDiff')
    DB-->>API: Disagreeing reviews
    API-->>FE: JSON filtered list
    FE-->>U: Shows only negative badge reviews
```

### 3.4 Wishlist Re-Engagement (Part C)

```mermaid
sequenceDiagram
    participant U as User
    participant FE as Frontend
    participant API as Backend API
    participant DB as PostgreSQL

    U->>FE: Navigates to Wishlist tab
    FE->>API: GET /api/wishlist
    API->>DB: SELECT wishlist items + product details + badge aggregates
    DB-->>API: Wishlist items with aggregate data
    API-->>FE: JSON wishlist + re-engagement data
    FE-->>U: Renders wishlist with notification cards

    Note over FE,U: Re-engagement card shows:<br/>"Based on 47 reviews: 87% confirm<br/>this matches photos, 92% say it feels genuine"

    U->>FE: Taps "SEE REVIEWS"
    FE-->>U: Navigates to PDP review section (filtered)
```

---

## 4. Database Schema

### Entity Relationship Diagram

```mermaid
erDiagram
    PRODUCT ||--o{ REVIEW : "has many"
    PRODUCT ||--o{ WISHLIST_ITEM : "wishlisted by"

    PRODUCT {
        string id PK
        string name
        string brand
        string category
        string subcategory
        string description
        string[] images
        int mrp
        int discountPercent
        int finalPrice
        string[] sizes
        string color
        string material
        string fit
        float rating
        int reviewCount
        int fitTight
        int fitJustRight
        int fitLoose
        int lengthShort
        int lengthJustRight
        int lengthLong
        json aiTags
        string[] applicableBadges
        datetime createdAt
    }

    REVIEW {
        string id PK
        string productId FK
        string userName
        int rating
        string text
        string sizeBought
        string badgeAuthenticity
        string badgeFit
        string badgePhotoMatch
        string badgeFabricFeel
        string badgeComfortFeel
        string badgeMaterialFeel
        string badgeFinishDurability
        string badgeShadeMatch
        string badgeOverallSatisfaction
        datetime createdAt
    }

    WISHLIST_ITEM {
        string id PK
        string productId FK
        datetime addedAt
    }
```

### Badge Field Values

| Badge Field | Possible Values |
|-------------|-----------------|
| `badgeAuthenticity` | `null` · `"feelsGenuine"` · `"feelsOff"` |
| `badgeFit` | `null` · `"fitsAsExpected"` · `"doesntFit"` |
| `badgePhotoMatch` | `null` · `"matches"` · `"slightlyDiff"` · `"veryDiff"` |
| `badgeFabricFeel` | `null` · `"asDescribed"` · `"thinnerRougher"` |
| `badgeComfortFeel` | `null` · `"comfortable"` · `"stiffUncomfortable"` |
| `badgeMaterialFeel` | `null` · `"sturdyPremium"` · `"flimsy"` |
| `badgeFinishDurability` | `null` · `"holdsShinColor"` · `"tarnishedFaded"` |
| `badgeShadeMatch` | `null` · `"matchesShade"` · `"differentShade"` |
| `badgeOverallSatisfaction` | `null` · `"satisfied"` · `"notSatisfied"` |

`null` = "Not Sure Yet" (default / not submitted)

### Badge → Category Mapping (v2)

> **v2 change:** Clothing & Footwear no longer get Overall Satisfaction. They get a new **Fit** badge instead.

| Category | Authenticity | Photo Match | Fit | 3rd/4th Badge | Overall Satisfaction | Max Badges |
|----------|:-----------:|:-----------:|:---:|-----------|:-------------------:|:----------:|
| Clothing | ✅ | ✅ | ✅ | Fabric Feel | ❌ | 4 |
| Footwear | ✅ | ✅ | ✅ | Comfort/Sole Feel | ❌ | 4 |
| Bags & Accessories | ✅ | ✅ | ❌ | Material Feel | ✅ | 4 |
| Jewelry & Watches | ✅ | ✅ | ❌ | Finish Durability | ✅ | 4 |
| Makeup | ✅ | ❌ | ❌ | Shade/Result Match | ✅ | 3 |
| Skincare | ✅ | ❌ | ❌ | — | ✅ | 2 |
| Haircare | ✅ | ❌ | ❌ | — | ✅ | 2 |
| Fragrance | ✅ | ❌ | ❌ | — | ✅ | 2 |
| Appliances | ✅ | ❌ | ❌ | — | ✅ | 2 |

---

## 5. API Design

### Base URL
- **Development**: `http://localhost:3001/api`
- **Production**: `https://<railway-app>.railway.app/api`

### Endpoints

#### Products

```
GET    /api/products                    → List all products
       ?category=clothing              → Filter by category
       
GET    /api/products/:id               → Product detail with badge aggregates
GET    /api/products/:id/badge-aggregates → Badge aggregates only
```

#### Reviews

```
GET    /api/products/:id/reviews        → All reviews for a product
       ?badge=photoMatch               → Filter by badge type
       ?value=matches                  → Filter by badge value
       ?disagreeOnly=true              → Only negative badge values
       ?rating=5                       → Filter by star rating
       ?sort=mostHelpful|newest        → Sort order
       
POST   /api/products/:id/reviews        → Submit a new review
```

#### Wishlist

```
GET    /api/wishlist                     → Get all wishlist items with re-engagement data
POST   /api/wishlist/:productId          → Add product to wishlist
DELETE /api/wishlist/:productId          → Remove from wishlist
```

### Response Shapes

#### Product List Item
```json
{
  "id": "clx1abc...",
  "name": "Men Slim Fit Casual Shirt",
  "brand": "Roadster",
  "category": "clothing",
  "images": ["/images/product-1-a.jpg"],
  "mrp": 1699,
  "discountPercent": 62,
  "finalPrice": 649,
  "rating": 4.2,
  "reviewCount": 156,
  "badgeSummary": {
    "topBadge": "92% Feels Genuine",
    "totalBadgeReviews": 120
  }
}
```

#### Product Detail (with Badge Aggregates)
```json
{
  "id": "clx1abc...",
  "name": "Men Slim Fit Casual Shirt",
  "brand": "Roadster",
  "...": "...full product fields...",
  "badgeAggregates": {
    "authenticity": {
      "total": 120,
      "feelsGenuine": 110,
      "feelsOff": 10,
      "percentPositive": 92,
      "belowThreshold": false
    },
    "photoMatch": {
      "total": 98,
      "matches": 85,
      "slightlyDiff": 10,
      "veryDiff": 3,
      "percentPositive": 87,
      "belowThreshold": false
    },
    "fabricFeel": {
      "total": 88,
      "asDescribed": 69,
      "thinnerRougher": 19,
      "percentPositive": 78,
      "belowThreshold": false
    },
    "overallSatisfaction": {
      "total": 130,
      "satisfied": 124,
      "notSatisfied": 6,
      "percentPositive": 95,
      "belowThreshold": false
    }
  }
}
```

> **Minimum-sample threshold (v2)**: When `total < 50` for any badge, `belowThreshold` is `true`. Display rules:
> - `0 submissions` → badge/stat not shown at all
> - `1–49 submissions` → raw count or "gaining traction" momentum copy, NOT percentage
> - `50+ submissions` → full percentage breakdown

#### Review Item
```json
{
  "id": "clx2def...",
  "userName": "Aarav Sharma",
  "rating": 5,
  "text": "Great quality shirt, fabric feels exactly as described...",
  "sizeBought": "40",
  "badges": {
    "authenticity": "feelsGenuine",
    "photoMatch": "matches",
    "fabricFeel": "asDescribed",
    "overallSatisfaction": "satisfied"
  },
  "createdAt": "2025-12-03T10:00:00Z"
}
```

#### Wishlist Item (with Re-Engagement Data)
```json
{
  "id": "clx3ghi...",
  "product": {
    "id": "clx1abc...",
    "name": "Men Slim Fit Casual Shirt",
    "brand": "Roadster",
    "images": ["/images/product-1-a.jpg"],
    "finalPrice": 649,
    "rating": 4.2
  },
  "addedAt": "2026-08-25T10:00:00Z",
  "daysStalled": 3,
  "reengagement": {
    "hasData": true,
    "message": "Based on 120 reviews: 92% confirm it feels genuine, 87% say it matches photos",
    "badges": [
      { "label": "Feels Genuine", "percent": 92 },
      { "label": "Matches Photos", "percent": 87 }
    ],
    "deepLinkFilter": "authenticity"
  }
}
```

---

## 6. Frontend Component Architecture

### Component Tree

```mermaid
graph TD
    APP[App.jsx] --> SHELL[AppShell]
    SHELL --> HEADER[TopHeader]
    SHELL --> OUTLET[Router Outlet]
    SHELL --> NAV[BottomNav]

    OUTLET --> HP[HomePage]
    OUTLET --> PP[ProductPage]
    OUTLET --> WP[WishlistPage]
    OUTLET --> PRP[ProfilePage]

    HP --> SB[SearchBar]
    HP --> CB[CategoryBanner]
    HP --> PC[ProductCard]

    PP --> IG[ImageGallery]
    PP --> PI[ProductInfo]
    PP --> SS[SizeSelector]
    PP --> PD[ProductDetails]
    PP --> FLB[FitLengthBars]
    PP --> AIT[AiTags]
    PP --> BA["BadgeAggregates (Part B)"]
    PP --> RFC["ReviewFilterChips (Part B)"]
    PP --> RC[ReviewCard]
    PP --> SA[StickyActions]
    PP --> RM["ReviewModal (Part A)"]

    RM --> SRI[StarRatingInput]
    RM --> BI["BadgeInput (Part A core)"]

    WP --> WC[WishlistCard]
    WP --> REC["ReengagementCard (Part C)"]

    style APP fill:#FF3F6C,color:#fff
    style BA fill:#14958F,color:#fff
    style RFC fill:#14958F,color:#fff
    style RM fill:#14958F,color:#fff
    style BI fill:#14958F,color:#fff
    style REC fill:#14958F,color:#fff
```

### Key Component Specifications

#### BadgeInput (Part A — Core Innovation)

The central interactive component. A single badge renders as one tappable card that cycles through states:

```
┌─────────────────────────┐
│  [icon]  NOT SURE YET   │  ← Default: grey border, grey fill
│                         │     Tap →
├─────────────────────────┤
│  [icon]  FEELS GENUINE  │  ← Positive: pink border, pink tint
│                    ✅   │     Tap →
├─────────────────────────┤
│  [icon]  FEELS OFF /    │  ← Negative: maroon border, red tint
│  LOWER QUALITY     ✖   │     Tap →
├─────────────────────────┤
│  (cycles back to default)│
└─────────────────────────┘
```

- Touch target: minimum 44×44px
- Transition: 200ms ease-out on border color, background, icon swap
- Photo Match has 4 states (adds "Slightly Different" in amber between positive and negative)

#### BadgeAggregates (Part B)

Horizontal scrollable row of aggregate stat cards:

```
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│ 🛡️  92%  │ │ 📷  87%  │ │ 🧵  78%  │ │ 👍  95%  │
│  Feels   │ │ Matches  │ │ Fabric   │ │Satisfied │
│ Genuine  │ │ Photos   │ │As Descr. │ │          │
└──────────┘ └──────────┘ └──────────┘ └──────────┘
```

- Below threshold (< 50 reviews): shows "X of Y confirm..." or "Gaining traction" instead of %
- Card styling: subtle border, icon on top, percentage bold, label smaller

#### ReengagementCard (Part C)

Notification-style card on wishlist page:

```
┌────────────────────────────────────────┐
│ 🔔 Trust insights for your wishlist    │
│                                        │
│ [Product Thumbnail]                    │
│ Based on 120 reviews:                  │
│ • 92% confirm it feels genuine         │
│ • 87% say it matches photos            │
│                                        │
│          [ SEE REVIEWS → ]             │
└────────────────────────────────────────┘
```

- Appears only for products with sufficient badge data
- "SEE REVIEWS" deep-links to PDP with badge filter pre-applied
- Aggregate data only — never attributes to individual reviewer

---

## 7. State Management

```mermaid
graph TD
    CTX[AppContext Provider] --> WS[Wishlist State]
    CTX --> RS[Review Submission State]
    CTX --> FS[Filter State]

    WS --> |items, addItem, removeItem| WP[WishlistPage]
    WS --> |count| NAV[BottomNav badge count]
    WS --> |isWishlisted| SA[StickyActions heart]

    RS --> |formData, setField, submit| RM[ReviewModal]
    
    FS --> |activeFilter, setFilter| RFC[ReviewFilterChips]
    FS --> |filteredReviews| RC[ReviewCard list]
```

**Approach:** React Context + `useReducer` for global state (wishlist items, active filters). Component-local state for form inputs (review modal). Server state fetched on mount and refetched after mutations.

No Redux — the state graph is simple enough that Context handles it cleanly without the boilerplate.

---

## 8. Mobile-App Frame Strategy

### Desktop (viewport > 430px)

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│              Dark background (#1a1a2e)               │
│                                                      │
│          ┌──────────────────────┐                     │
│          │    ┌────────────┐    │                     │
│          │    │ Top Header │    │                     │
│          │    ├────────────┤    │                     │
│          │    │            │    │                     │
│          │    │  Scrollable│    │  max-width: 430px   │
│          │    │  Content   │    │  height: 100vh      │
│          │    │  Area      │    │  overflow-y: auto   │
│          │    │            │    │  rounded-3xl        │
│          │    │            │    │  box-shadow          │
│          │    ├────────────┤    │                     │
│          │    │ Bottom Nav │    │                     │
│          │    └────────────┘    │                     │
│          └──────────────────────┘                     │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### Mobile (viewport ≤ 430px)

```
┌────────────────────┐
│    Top Header      │
├────────────────────┤
│                    │
│   Scrollable       │  width: 100vw
│   Content          │  height: 100vh
│   Area             │  no border-radius
│                    │  no shadow
│                    │
├────────────────────┤
│    Bottom Nav      │
└────────────────────┘
```

CSS implementation:
```css
/* Outer wrapper */
.app-frame {
  /* Desktop: centered phone */
  @media (min-width: 431px) {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: #1a1a2e;
  }
}

/* Inner phone container */
.app-container {
  width: 100%;
  max-width: 430px;
  height: 100vh;
  overflow-y: auto;
  background: #ffffff;

  @media (min-width: 431px) {
    border-radius: 2rem;
    box-shadow: 0 25px 60px rgba(0,0,0,0.4);
    height: 90vh;
  }
}
```

---

## 9. Design System Reference

### Color Tokens

```css
@theme {
  --color-myntra-pink:        #FF3F6C;
  --color-myntra-pink-light:  #FFF0F3;
  --color-myntra-dark:        #282C3F;
  --color-myntra-secondary:   #535766;
  --color-myntra-muted:       #94969F;
  --color-myntra-green:       #14958F;
  --color-myntra-rating:      #388E3C;
  --color-myntra-amber:       #F5A623;
  --color-myntra-red:         #D5284F;
  --color-myntra-maroon:      #6D1A36;
  --color-myntra-bg:          #FFFFFF;
  --color-myntra-section:     #F5F5F6;
  --color-myntra-border:      #D4D5D9;
  --color-myntra-border-light:#EAEAEC;
  --color-myntra-star:        #FFC700;
  --color-myntra-discount:    #FF905A;
  --color-badge-positive-bg:  #FFF0F3;
  --color-badge-negative-bg:  #FEF0EF;
  --color-badge-amber-bg:     #FFF8E7;
}
```

### Typography Scale

| Usage | Size | Weight | Color |
|-------|------|--------|-------|
| Brand name (PDP) | 16px | 700 (Bold) | `--myntra-dark` |
| Product name | 14px | 400 | `--myntra-secondary` |
| Price (sale) | 20px | 700 | `--myntra-dark` |
| MRP (strikethrough) | 14px | 400 | `--myntra-muted` |
| Discount % | 14px | 600 | `--myntra-discount` |
| Section headers | 16px | 700 | `--myntra-dark` |
| Body text | 14px | 400 | `--myntra-secondary` |
| Badge label | 11px | 600 | varies by state |
| Badge percentage | 18px | 700 | varies by state |
| Button text | 14px | 700 | white or `--myntra-pink` |
| Rating pill | 13px | 700 | white on `--myntra-rating` |

### Spacing System

| Token | Value | Usage |
|-------|-------|-------|
| `xs` | 4px | Tight spacing, inline gaps |
| `sm` | 8px | Card padding, icon margins |
| `md` | 12px | Section padding |
| `lg` | 16px | Page horizontal padding |
| `xl` | 20px | Section vertical gaps |
| `2xl` | 24px | Major section separators |
| `3xl` | 32px | Page top/bottom padding |

---

## 10. Security & Constraints

| Constraint | Implementation |
|------------|---------------|
| No monetary incentives | No reward/gamification language anywhere in UI |
| Badges are additive only | Star rating + text review flow remains untouched; badges are an optional step before text |
| Aggregate data only | Badge percentages shown on PDP and wishlist — never "User X said it feels genuine" |
| Minimum-sample threshold | < 50 badge submissions → show raw count/momentum copy, not percentage. 0 submissions → nothing shown. |
| Review window | Badge prompt only appears in the review submission flow (post-delivery context implied) |
| CORS | Backend only accepts requests from the Vercel frontend domain |

---

## 11. Environment Variables

### Frontend (Vercel)

| Variable | Example | Purpose |
|----------|---------|---------|
| `VITE_API_URL` | `https://myntra-mvp-api.railway.app` | Backend API base URL |

### Backend (Railway)

| Variable | Example | Purpose |
|----------|---------|---------|
| `DATABASE_URL` | `postgresql://...` | PostgreSQL connection string (auto from Railway) |
| `PORT` | `3001` | Server port (auto from Railway) |
| `FRONTEND_URL` | `https://myntra-mvp.vercel.app` | Allowed CORS origin |
| `NODE_ENV` | `production` | Environment flag |

---

## 12. Performance Considerations

| Concern | Mitigation |
|---------|------------|
| Badge aggregate computation | Aggregates computed on backend per-request (dataset is small — 12 products, ~150 reviews). If scale were a concern, would cache in Redis or denormalize into product table. |
| Image loading | Product images served from Vercel's CDN (`/public/images/`). Lazy loading with `loading="lazy"` attribute. |
| API latency | Railway and Vercel both deploy on global edge. CORS preflight cached with `Access-Control-Max-Age`. |
| Bundle size | Vite tree-shakes unused code. Lucide icons imported individually. No heavy UI library (no Material-UI, Ant Design). |
| Mobile performance | CSS animations use `transform` and `opacity` only (GPU-accelerated). No layout thrashing. |
