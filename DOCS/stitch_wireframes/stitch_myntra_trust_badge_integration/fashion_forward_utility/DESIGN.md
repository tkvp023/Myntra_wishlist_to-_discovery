---
name: Fashion Forward Utility
colors:
  surface: '#faf8ff'
  surface-dim: '#d6d9eb'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e4e7fa'
  surface-container-highest: '#dfe2f4'
  on-surface: '#171b28'
  on-surface-variant: '#5b4042'
  inverse-surface: '#2c303e'
  inverse-on-surface: '#eef0ff'
  outline: '#8f6f72'
  outline-variant: '#e3bdc0'
  surface-tint: '#bd0043'
  primary: '#b90041'
  on-primary: '#ffffff'
  primary-container: '#df2457'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb2ba'
  secondary: '#5a5d73'
  on-secondary: '#ffffff'
  secondary-container: '#dbdef8'
  on-secondary-container: '#5e6177'
  tertiary: '#006763'
  on-tertiary: '#ffffff'
  tertiary-container: '#00837d'
  on-tertiary-container: '#f3fffd'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffd9dc'
  primary-fixed-dim: '#ffb2ba'
  on-primary-fixed: '#400011'
  on-primary-fixed-variant: '#910031'
  secondary-fixed: '#dee1fa'
  secondary-fixed-dim: '#c2c5de'
  on-secondary-fixed: '#161b2d'
  on-secondary-fixed-variant: '#42465a'
  tertiary-fixed: '#8af4ed'
  tertiary-fixed-dim: '#6cd8d1'
  on-tertiary-fixed: '#00201e'
  on-tertiary-fixed-variant: '#00504c'
  background: '#FFFFFF'
  on-background: '#171b28'
  surface-variant: '#dfe2f4'
  divider: '#F5F5F6'
  placeholder: '#94969F'
  discount-orange: '#FF905A'
  warning-maroon: '#6D1A36'
  error-red: '#D5284F'
  neutral-amber: '#F5A623'
  surface-pink: '#FFF0F3'
typography:
  display-brand:
    fontFamily: beVietnamPro
    fontSize: 18px
    fontWeight: '700'
    lineHeight: 24px
    letterSpacing: 0.5px
  headline-lg:
    fontFamily: beVietnamPro
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 28px
  headline-md:
    fontFamily: beVietnamPro
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
  body-lg:
    fontFamily: inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  body-md:
    fontFamily: inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  body-sm:
    fontFamily: inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-price:
    fontFamily: inter
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 18px
  label-discount:
    fontFamily: inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
  label-badge:
    fontFamily: inter
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 12px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  margin-mobile: 1rem
  gutter-grid: 0.5rem
  stack-sm: 0.25rem
  stack-md: 0.75rem
  stack-lg: 1.5rem
  section-gap: 2rem
---

## Brand & Style

This design system is built for a high-velocity fashion e-commerce environment. The brand personality is **Fashion-Forward, Energetic, and Trustworthy**. It balances the excitement of discovery with the functional rigor required for complex filtering and decision-making.

The visual style is **Corporate / Modern** with a lean toward high-density information display. It prioritizes:
- **Mass-Market Accessibility:** Highly legible typography and clear price hierarchies.
- **Functional Clarity:** Distinct state management for trust-verification (Genuine vs. Warning).
- **Vibrant Energy:** Strategic use of hot pink to drive conversion and brand recognition against a neutral backdrop.

## Colors

The palette is engineered for high contrast and emotional signaling:
- **Primary (#FF3F6C):** Reserved for primary actions (Add to Bag), active navigation states, and brand-specific trust highlights.
- **Typography:** Deep Charcoal (#282C3F) provides maximum readability for headings and brand names, while Slate Grey (#535766) handles secondary body content.
- **Trust Spectrum:**
    - **Positive (#14958F):** Used for "Feels Genuine" badges and rating pills.
    - **Neutral (#F5A623):** For "Slightly Different" or pending states.
    - **Warning (#D5284F):** For "Feels Off" or limited stock alerts.
- **Structure:** A clinical white background (#FFFFFF) is punctuated by light grey (#F5F5F6) dividers to separate product sections without adding visual weight.

## Typography

This system uses a dual-sans-serif approach. **Be Vietnam Pro** is used for headlines and brand identifiers to provide a contemporary, approachable feel. **Inter** handles all utility and body text, chosen for its exceptional legibility at small sizes (essential for technical specifications and review text).

**Hierarchy Rules:**
- **Brand Names:** Always bold, often uppercase to mimic luxury retail tags.
- **Price Points:** Uses bold Inter to ensure the numerical data is the first thing a user scans in a product card.
- **Discount Highlights:** Stylized in `discount-orange` to create a secondary layer of visual urgency separate from the primary pink CTAs.

## Layout & Spacing

The layout follows a **fluid grid** model optimized for a 390px mobile viewport. 

- **Product Grids:** A 2-column layout is standard for browse screens, utilizing a 8px (0.5rem) gutter.
- **Sectioning:** Content is grouped into "Cards" or "Slabs." Slabs are separated by 1px horizontal dividers (#F5F5F6) or 8px grey spacers to indicate logical breaks in the Product Detail Page (PDP).
- **Safe Areas:** A consistent 16px (1rem) margin is maintained on the horizontal edges of the screen for all text content.
- **Touch Targets:** All interactive elements (pills, stars, buttons) maintain a minimum 44px height to ensure ease of use.

## Elevation & Depth

The system uses **Tonal Layers** and **Low-Contrast Outlines** rather than heavy shadows to maintain a clean, flat aesthetic.

- **Level 0 (Base):** White background (#FFFFFF).
- **Level 1 (Surface):** Light grey containers (#F5F5F6) used for secondary info blocks like delivery services.
- **Level 2 (Interaction):** Thin 1px borders (#D4D5D9) are used for "Ghost" buttons and inactive chips.
- **Floating Elements:** Only the sticky bottom navigation and the "Add to Bag" bar use a soft, diffused ambient shadow (8% opacity black, 4px blur) to indicate they sit above the scrollable content.
- **Trust Overlays:** Rating pills and trust tags are "anchored" to the bottom-left of product images with 80% opacity backgrounds to ensure legibility over varying photography.

## Shapes

The design system uses a **Soft** shape language. This creates a professional yet accessible feel that avoids the "toy-like" appearance of fully rounded pills while remaining friendlier than sharp corners.

- **Standard Radius (4px):** Product cards, input fields, and standard buttons.
- **Large Radius (8px):** Section containers and modal bottom sheets.
- **Extra Large (Full/Pill):** Used exclusively for status chips (Ratings, Sale Badges) and "Select Size" circles to differentiate them from functional containers.

## Components

### Buttons
- **Primary:** Solid #FF3F6C with white text. High-impact for "Add to Bag."
- **Secondary/Outline:** 1px #FF3F6C border with pink text. Used for "Buy Now" or "Write a Review."
- **Ghost:** 1px Grey border with Charcoal text. Used for secondary actions like "Share" or "Copy Link."

### Chips & Pills
- **Filter Chips:** Light grey border, transitions to pink border and pink text when active.
- **Rating Pills:** Dark green background with white text and a star icon, usually placed as an overlay on images.
- **Trust Tags:** Small, semi-transparent labels at the base of product cards (e.g., "92% Feels Genuine").

### Input Fields
- **Search Bar:** Large radius (pill-shaped), light grey border, containing brand logo and iconography for voice/camera search.
- **Review Textarea:** 4px radius, light grey border, 16px internal padding.

### Cards
- **Product Card:** No border, 0px radius on images (3:4 ratio), followed by tight vertical stacking of text info.
- **Trust Aggregate Card:** Horizontal scrolling cards in the review section with central icons and large percentage displays.

### Bottom Navigation
- **Height:** 56px.
- **Active State:** Icon and label colored in #FF3F6C.
- **Inactive State:** Icon and label in #94969F.