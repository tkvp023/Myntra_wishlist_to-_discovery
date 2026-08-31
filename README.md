# Myntra Trust-Verified Review System MVP (v2)

A mobile-app-shaped web application replicating the Myntra mobile experience with an innovative, tap-based **Trust-Verified Review System** to solve pre-purchase hesitation and stalled purchase intent.

---

## 🌟 Core Innovations

- **Part A (Tap-Based Trust Badges in Review Flow)**: Lightweight, structured, optional review badges (Authenticity, Fit, Photo Match, Fabric Feel, Comfort, Material, Finish, Shade, Overall Satisfaction) sequenced *before* text in the post-purchase review modal.
- **Part B (Filterable Trust Dashboard on PDP)**: Aggregate trust badge percentages and criterion-based filter chips on the Product Detail Page. Implements a **50-submission threshold** (full percentages for products with 50+ responses; raw counts / momentum phrasing below 50).
- **Part C (Wishlist Re-Engagement & Touchpoint Surfacing)**: Contextual trust validation prompts for stalled wishlist items with top positive stats and deep-links into filtered review views.

---

## 📐 Architecture & Documentation

All design decisions, edge cases, and API specifications are neatly organized in [`DOCS/`](DOCS/):

| Document | Purpose |
|---|---|
| [**DOCS/COMPLETE_SOLUTION_EXPLANATION.md**](DOCS/COMPLETE_SOLUTION_EXPLANATION.md) | **Master End-to-End Solution & Technical Architecture Document** |
| [**DOCS/WALKTHROUGH_GUIDE_updated.md**](DOCS/WALKTHROUGH_GUIDE_updated.md) | **Official 7-Step Interactive Walkthrough Guide & Architectural Rules** |
| [**DOCS/newproblemstatement.md**](DOCS/newproblemstatement.md) | Problem statement, user journeys, badge taxonomy, and core hypotheses |
| [**DOCS/architecture.md**](DOCS/architecture.md) | System architecture, ERD, and component diagrams |
| [**DOCS/mvp-features-overview.md**](DOCS/mvp-features-overview.md) | Complete system capabilities and feature overview guide |
| [**DOCS/touchpoint-content-map.md**](DOCS/touchpoint-content-map.md) | Section 8 Touchpoint Content Map reference |
| [**DOCS/pilot-measurement-and-event-spec.md**](DOCS/pilot-measurement-and-event-spec.md) | Holdout A/B pilot measurement design and analytics event taxonomy |
| [**DOCS/audit-and-decisions.md**](DOCS/audit-and-decisions.md) | Comprehensive resolution across Categories A through E |
| [**DOCS/v2-changelog.md**](DOCS/v2-changelog.md) | Summary of changes between v1 and v2 |
| [**DOCS/implementationplan.md**](DOCS/implementationplan.md) | Phased build plan with task-level granularity |
| [**DOCS/edgecases.md**](DOCS/edgecases.md) | Catalog of edge cases, boundary conditions, and fallbacks |
| [**DOCS/deployment.md**](DOCS/deployment.md) | Step-by-step deployment guide for Vercel + Railway |

---

## 📁 Clean Repository Structure

```
Graduation_project_mvp/
├── DOCS/                   # Architecture, specs, walkthrough guide, reference assets
│   ├── WALKTHROUGH_GUIDE_updated.md
│   ├── newproblemstatement.md
│   ├── architecture.md
│   ├── assets/             # Raw screen captures & wireframe archives (.zip)
│   └── seed-data.json      # 33 products, 172 reviews across ALL, MEN, WOMEN, BEAUTY, KIDS
├── frontend/               # Vite + React + Tailwind CSS (Mobile Frame & Studio Wings)
│   ├── src/
│   │   ├── components/     # Domain-separated: guide, home, pdp, review, wishlist, search, notifications, layout
│   │   ├── pages/          # HomePage, ProductPage, WishlistPage, CategoriesPage, ProfilePage, BagPage
│   │   ├── context/        # AppContext.jsx, GuideContext.jsx
│   │   ├── utils/          # badgeConfig.js, imageHelper.js
│   │   └── api/client.js   # Universal fetch wrapper
│   └── vercel.json         # SPA routing rewrites
└── backend/                # Node.js + Express + Prisma ORM (SQLite / PostgreSQL)
    ├── prisma/
    │   ├── schema.prisma   # Product, Review (9 badge fields), WishlistItem
    │   └── seed.js         # Seed database
    ├── tests/
    │   └── test-full-suite.js # Comprehensive 18-point API security & functional test suite
    └── src/
        ├── routes/         # products.js, reviews.js, wishlist.js
        ├── middleware/     # Centralized error handler
        └── utils/          # badgeHelper.js (aggregates, threshold=50, safe JSON parsers)
```
