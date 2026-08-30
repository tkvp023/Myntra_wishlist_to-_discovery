# Google Stitch UI / Wireframe Generation Prompts

Use the master prompt below in **Google Stitch** (or generate screen-by-screen using the individual screen prompts) to generate high-fidelity mobile app wireframes matching Myntra's design system.

---

## 🌟 Master Prompt (All Screens Overview)

```text
Design a complete 5-screen mobile app UI flow for the "Myntra Trust-Verified Review System" on a 390x844 mobile viewport.

Brand & Visual Design System:
- Brand Aesthetic: Native Myntra Mobile App (Fashion e-commerce). Clean, fashion-forward, high contrast, clean white backgrounds (#FFFFFF) with subtle grey section dividers (#F5F5F6).
- Primary Accent: Hot Pink / Magenta (#FF3F6C) used for CTAs, selected pill borders, and active icons.
- Text & Neutral Colors: Deep Charcoal (#282C3F) for headings/brand names, Slate Grey (#535766) for body descriptions, Muted Grey (#94969F) for placeholders and inactive states.
- Trust & State Colors: Emerald Green (#14958F) for positive trust badges ("Feels Genuine") and rating pills; Dark Maroon/Red (#6D1A36 / #D5284F) for negative trust states ("Feels Off"); Warm Amber (#F5A623) for neutral states ("Slightly Different").
- Typography: Clean sans-serif (Assistant / Roboto), crisp hierarchy with bold uppercase brand tags and bold discount highlights (#FF905A).
- Persistent Bottom Nav (56px): 4 tabs with icons & labels: Home (Myntra 'M' logo, active in pink), Categories (grid), Wishlist (heart with pink badge count '3'), Profile (user).

Generate the following 5 screens in sequence:

1. HOME / BROWSE SCREEN:
- Top search bar with Myntra 'M' logo inside, search placeholder with camera and mic icons, right notification bell and heart icons.
- Horizontal category pill tabs (ALL, MEN, WOMEN, KIDS) with active pink underline.
- Circular category bubbles (Fashion, Beauty, Footwear, Bags).
- Promotional banner carousel ("Get 25% Off | MYNTRASAVE") with dot indicators.
- 2-column fashion product grid. Each product card has: high-res product photo (3:4 ratio), dark green rating pill ("4.3 ★ 1.2k") overlay at bottom-left of photo, wishlist heart icon, bold brand name ("Roadster"), short title, MRP with strikethrough, bold sale price ("₹649"), orange discount badge ("62% OFF"), and a small trust tag ("92% Feels Genuine").

2. PRODUCT DETAIL PAGE (PDP) — PRODUCT & SPECS:
- Sticky top bar with back arrow, search, heart, and bag icon (with '1' badge).
- Full-width hero image gallery with swipe dots, bottom-right rating pill ("4.3 ★ 14 reviews"), and 3 square outline action buttons below photo (Copy Link, Wishlist, Share).
- Product Info: Bold uppercase brand ("ROADSTER"), product title, price block (₹649 with strikethrough MRP ₹1699 and pink "62% OFF!" pill).
- Size Selector: "Select Size" with "Size Chart >" link in pink. Horizontal row of circular size pills (38, 39, 40, 42, 44) with price tag below each.
- Sticky Bottom CTAs: 50/50 split with "Buy Now" (white with pink outline & text) and "Add to Bag" (solid #FF3F6C pink with white text and shopping bag icon).
- Specifications & Delivery card: 2-column spec grid (Fabric: Pure Cotton, Fit: Slim Fit, Weave: Knitted) + 7 Days Return guarantee badge + "Genuine Product" & "Quality Checked" seal icons.

3. PDP REVIEWS SECTION — FILTERABLE TRUST DASHBOARD (PART B):
- Section Header: "Ratings & Reviews" with large green rating badge ("4.3 ★"), "11,186 ratings | 1,744 reviews >".
- AI-Summarized Tags: 2-column grid of tags with thumbs-up/down icons (👍 Style (8), 👍 Value for Money (8), 👎 Stitching Quality (2)).
- "Trust-Verified Aggregates" Card Carousel (Horizontal Scroll):
  * Card 1: Shield icon, "92%", "Feels Genuine" in pink/green badge style.
  * Card 2: Camera icon, "87%", "Matches Photos".
  * Card 3: Ruler icon, "85%", "Fits as Expected".
  * Card 4: Fabric grid icon, "78%", "Fabric As Described".
- Review Filter Chips (Horizontal scroll): "All (144)", "Photo Match ✓", "Authenticity ✓", "Fit ✓", "Fabric Feel ✓", "5 ★", "4 ★", and a toggle switch for "Disagree Only".
- Customer Review Cards: Showing user name with green verified checkmark ("Pallela Tharun ✓"), green star pill ("5 ★"), "Size: 39", date, comment text, customer uploaded photo thumbnail, and INLINE TRUST BADGE PILLS (pink pill: "✓ Matches Photos", green pill: "✓ Feels Genuine").
- Prominent Pink Outline Button: "WRITE A REVIEW".

4. REVIEW SUBMISSION MODAL / SCREEN (PART A):
- Full-screen modal sliding up with header "Write a Review" and 'X' close button.
- Mini product preview card at top (thumbnail, "Roadster Men Slim Fit Checked Shirt", selected size "40").
- Star Rating: 5 large interactive stars with "Tap to rate".
- Trust Badge Section (Sequenced BEFORE text field):
  * Section title: "Trust-Verified Badges (Optional - Tap to cycle state)"
  * Badge 1 (Authenticity): Rounded card showing shield icon, state cycled to "FEELS GENUINE" (Hot pink border, soft pink background, green checkmark icon in top-right).
  * Badge 2 (Photo Match): Rounded card showing dual-photo icon, state cycled to "MATCHES PHOTOS" (Hot pink border, pink text, green checkmark).
  * Badge 3 (Fit): Rounded card showing ruler icon, state cycled to "FITS AS EXPECTED" (Hot pink border, pink text, green checkmark).
  * Badge 4 (Fabric Feel): Rounded card showing fabric weave icon, state in neutral/default "NOT SURE YET" (Grey border, grey text).
- Free-text review box: Placeholder "Share details about the fabric, drape, and overall quality...".
- Bottom Full-Width CTA: Solid Hot Pink button "SUBMIT REVIEW".

5. WISHLIST RE-ENGAGEMENT SCREEN (PART C):
- Top App Bar: "My Wishlist (3 Items)".
- Top Highlight Card ("Stalled Intent Trust Re-Engagement Prompt"):
  * Card styled with soft pink-to-white gradient (#FFF0F3 to #FFFFFF), thin pink border, and a subtle bell/sparkle badge.
  * Text: "Trust Insights for your saved item • Added 4 days ago"
  * Product thumbnail of Roadster Checked Shirt.
  * Social proof badge stats: "Based on 14 reviews: 92% confirm it feels genuine, 87% say it matches photos."
  * Button: "SEE REVIEWS & DECIDE >" in bold hot pink.
- 2-Column Wishlist Grid below: Saved items showing product photos, filled pink heart icon at top-right of image, brand, price, and a quick "MOVE TO BAG" bottom button on each card.
```

---

## 📱 Individual Screen Prompts (For Single-Screen Iteration)

### Prompt for Screen 1: Home & Catalog Screen
```text
Mobile app wireframe (390x844) for Myntra fashion e-commerce Home/Browse page.
Header: Myntra 'M' logo inside rounded search bar with mic & lens icons, bell and heart icons on top right.
Navigation: Horizontal category tabs [ALL, MEN, WOMEN, KIDS] with active pink (#FF3F6C) underline.
Content:
1. Category circular icons (Fashion, Beauty, Footwear, Bags, Accessories).
2. Hero promo banner: "Get 25% Off | Code MYNTRASAVE" with carousel dots.
3. 2-column product grid: Roadster Casual Shirt (₹649, 62% OFF, 4.3★ rating pill, "92% Feels Genuine" trust tag) and INVICTUS Formal Trousers (₹1374, 45% OFF).
Bottom Navigation: 4 tabs (Home, Categories, Wishlist with badge '3', Profile). Style matching Myntra Applique design system with clean white background and #FF3F6C accents.
```

### Prompt for Screen 2: PDP Product View
```text
Mobile app wireframe (390x844) for Myntra Product Detail Page (PDP).
Header: Transparent sticky header with back arrow, search, heart, and shopping bag with '1' badge.
Hero: Portrait 3:4 product photo of a man in a navy checked shirt with dot indicators, bottom-right green rating pill "4.3 ★ | 14", and 3 square outline action buttons below photo (Copy Link, Heart, Share).
Price Section: Bold brand "ROADSTER", title "Men Slim Fit Casual Checked Shirt", price ₹649, strikethrough MRP ₹1699, pink badge "62% OFF!", and offer banner "Get at ₹549 with coupon".
Size Selector: "Select Size" with "Size Chart >" in pink. Row of 5 circular size pills (38, 39, 40, 42, 44) showing price underneath.
Specs Table: 2-column clean specs (Fabric: 100% Cotton, Fit: Slim Fit, Weave: Knitted).
Sticky Bottom Bar: Split 50/50 with "Buy Now" (outlined pink) and "Add to Bag" (solid hot pink #FF3F6C with white text).
```

### Prompt for Screen 3: PDP Filterable Trust Reviews Dashboard (Part B)
```text
Mobile app wireframe (390x844) for Myntra PDP Ratings & Reviews section with new Trust-Verified Badge Dashboard.
Top Rating Summary: Large green rating pill "4.3 ★", "11,186 ratings & 1,744 reviews >".
AI Summarized Tags: Horizontal tags with icons (👍 Style 9, 👍 Softness 8, 👎 Stitching 2).
Trust-Verified Aggregates Carousel: 4 horizontal scrollable cards:
- Card 1: Shield icon, "92%", "Feels Genuine" (green/pink highlight)
- Card 2: Camera icon, "87%", "Matches Photos" (pink highlight)
- Card 3: Ruler icon, "85%", "Fits as Expected" (pink highlight)
- Card 4: Fabric grid icon, "78%", "Fabric As Described"
Filter Chips Bar: Horizontal scrollable pills ["All (144)", "Photo Match ✓", "Authenticity ✓", "Fit ✓", "Fabric Feel", "5★", "4★"] + toggle switch for "Disagree Only".
Review Card: Reviewer "Pallela Tharun Venkat ✓" with 5★ green pill, size tag "Size: 39", date, review text, customer photo thumbnail, and trust badge tags ("✓ Matches Photos", "✓ Feels Genuine").
Bottom CTA: Pink outlined button "WRITE A REVIEW".
```

### Prompt for Screen 4: Review Submission Modal with Trust Badges (Part A)
```text
Mobile app wireframe (390x844) for Myntra Review Submission Flow bottom sheet modal.
Header: "Write a Review" with close 'X' icon.
Product Context: Mini thumbnail of Roadster checked shirt with title and size "Size: 40".
Star Rating: 5 large gold interactive star outlines with label "Tap to Rate".
Trust Badges Section: Title "Trust-Verified Badges (Optional - Tap to cycle state)":
- Badge 1 (Authenticity): Pill card with shield icon, active state "FEELS GENUINE" with hot pink border (#FF3F6C), soft pink fill, green checkmark icon in corner.
- Badge 2 (Photo Match): Pill card with camera icon, active state "MATCHES PHOTOS" with pink border and green checkmark.
- Badge 3 (Fit): Pill card with ruler icon, active state "FITS AS EXPECTED" with pink border and green checkmark.
- Badge 4 (Fabric Feel): Pill card with fabric icon, default state "NOT SURE YET" with neutral grey border and question mark.
Text Area: Clean rounded textarea with placeholder "Share your thoughts on the fabric, fit, and appearance...".
Bottom Button: Full-width solid pink button "SUBMIT REVIEW".
```

### Prompt for Screen 5: Wishlist with Stalled Intent Re-Engagement (Part C)
```text
Mobile app wireframe (390x844) for Myntra Wishlist page featuring Trust Re-engagement Card.
Top App Bar: "Wishlist (3 Items)".
Top Hero Card: "Trust Insight for your saved item (Added 4 days ago)" in a soft pink tinted container (#FFF0F3) with a pink left accent line.
Inside Hero Card:
- Thumbnail of wishlisted Roadster shirt.
- Text: "Based on 14 verified reviews: 92% confirm it feels genuine, and 87% say it matches photos."
- CTA Button: "SEE REVIEWS & DECIDE >" in bold hot pink text with right arrow.
Grid Section: 2-column wishlist grid showing 3 items with filled pink heart buttons on image corners, brand names, prices, and a full-width "MOVE TO BAG" button under each item.
Bottom Nav: Standard Myntra bottom bar with Wishlist tab active in pink.
```
