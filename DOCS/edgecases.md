# Edge Cases — Myntra Trust-Verified Review System MVP (v2)

> **Comprehensive catalog of edge cases, boundary conditions, and failure modes.**  
> Each case includes: the scenario, expected behavior, and which component handles it.

---

## 1. Badge System Edge Cases

### 1.1 Cold Start — Zero Badge Data

| Scenario | Expected Behavior | Component |
|----------|-------------------|-----------|
| Product has 0 reviews (brand new SKU) | Badge aggregates section hidden entirely; "Be the first to review" prompt shown | BadgeAggregates |
| Product has reviews but 0 badge submissions (all reviewers skipped badges) | Badge aggregates section hidden; AI tags and star ratings still visible | BadgeAggregates |
| Product has 1-49 badge submissions (below threshold) | Show raw count or "gaining traction" copy, NOT percentage. e.g., "12 of 15 reviewers confirm Fits as Expected" | BadgeAggregates |
| Product crosses threshold (50th badge submitted) | Switch from raw count to percentage display on next page load | BadgeAggregates |
| One badge type has data, another doesn't | Show cards only for badges with ≥ 1 submission; hide empty badge cards | BadgeAggregates |

### 1.2 Badge Submission Edge Cases

| Scenario | Expected Behavior | Component |
|----------|-------------------|-----------|
| User submits review with ALL badges left as "Not Sure Yet" | Valid submission. All badge fields stored as `null`. Star rating + text saved normally. Badges are optional. | ReviewModal |
| User submits review with ONLY badges, no text | Valid submission. Text is optional. Star rating is required. | ReviewModal |
| User submits review with no star rating | Prevent submission. Show inline error "Please rate this product" | ReviewModal |
| User taps badge rapidly (tap → tap → tap) | Each tap cycles to next state correctly. No state skipping. Debounce not needed (state machine is deterministic). | BadgeInput |
| User selects a badge, then changes mind | Tapping again cycles to next state; can return to "Not Sure Yet" by cycling through all states | BadgeInput |
| Fit badge cycle in review modal | Cycles 3 states: "Not Sure Yet" → "Fits as Expected" (positive) → "Doesn't Fit as Expected" (negative) → "Not Sure Yet" | BadgeInput |
| Clothing/Footwear review submission | User cannot submit Overall Satisfaction (badge does not exist for Clothing/Footwear); Fit badge is offered instead | ReviewModal |
| User submits and immediately submits another review for same product | Backend should allow multiple reviews from same session (no auth system in MVP). Each review is independent. | Reviews API |

### 1.3 Badge Display Edge Cases

| Scenario | Expected Behavior | Component |
|----------|-------------------|-----------|
| 100% positive for a badge (e.g., all reviewers said "Feels Genuine") | Show "100% Feels Genuine". No special treatment. | BadgeAggregates |
| 0% positive (all negative) | Show "0% Feels Genuine" or flip to show "100% Feels Off". Decision: show positive framing → "0% Feels Genuine" with red tint on card | BadgeAggregates |
| Exactly 50/50 split | Show "50% Feels Genuine". No special treatment. | BadgeAggregates |
| Photo Match with 3-way split (33% matches, 33% slightly diff, 33% very diff) | Show "33% Matches Photos". The aggregate card always shows the positive percentage. | BadgeAggregates |
| Badge pill text very long (e.g., "Thinner / Rougher Than Expected") | Text wraps within pill or truncates with ellipsis. Max pill width constrained. | ReviewCard badge pills |

---

## 2. Review System Edge Cases

### 2.1 Review List

| Scenario | Expected Behavior | Component |
|----------|-------------------|-----------|
| Product has 0 reviews | Show empty state: "No reviews yet. Be the first to review!" with "WRITE A REVIEW" CTA | ProductPage reviews |
| Product has 1 review | Show the single review. No "View All" link. Badge aggregates show "1 reviewer so far" | ProductPage reviews |
| Review text is extremely long (1000+ characters) | Truncate at ~200 chars with "...read more" link. Tap expands full text inline. | ReviewCard |
| Review text is empty (badges + star only) | Show star rating + badge pills. No text section rendered. No "...read more" link. | ReviewCard |
| Review text contains special characters, emojis, or Unicode | Render as-is. No sanitization needed for display (React auto-escapes). Backend stores UTF-8. | ReviewCard |
| Reviewer name is very long | Truncate with ellipsis after ~20 chars | ReviewCard |

### 2.2 Review Filtering (Part B)

| Scenario | Expected Behavior | Component |
|----------|-------------------|-----------|
| Filter selected but 0 reviews match | Show: "No reviews match this filter" with "Clear filters" link. Don't hide the filter chips. | ReviewFilterChips + review list |
| Multiple filters active (e.g., "Photo Match ✓" + "4 ★") | AND logic: review must match ALL active filters. If no results, show empty message. | ReviewFilterChips |
| "Disagree Only" toggled with no negative reviews | Show: "No negative reviews for this aspect" — a positive signal, not an error | ReviewFilterChips |
| User toggles filter rapidly | Cancel previous API call (AbortController) before starting new one. Show loading state. | ReviewFilterChips |
| User selects badge filter for a badge type not applicable to this product | This shouldn't happen — filter chips should only show badges applicable to this product's category | ReviewFilterChips |
| Filter applied, then new review submitted | Clear filters and refetch all reviews to show the new submission prominently | ReviewModal → ProductPage |

---

## 3. Wishlist Edge Cases (Part C)

### 3.1 Wishlist Operations

| Scenario | Expected Behavior | Component |
|----------|-------------------|-----------|
| Wishlist is empty | Show empty state: illustration + "Your wishlist is empty" + "Nothing saved yet. Tap the ♡ on any product to save it here." + "START SHOPPING" CTA | WishlistPage |
| User adds product already in wishlist | No-op. Heart stays filled. No duplicate entry. Backend upserts. | StickyActions |
| User removes item from wishlist while on wishlist page | Item animates out (fade + slide). Count in bottom nav decrements immediately (optimistic). | WishlistCard |
| User removes item from PDP, then navigates to wishlist | Item should be gone. Context state is source of truth, synced with API. | AppContext |
| User adds item on PDP, navigates to wishlist, item should be there | Wishlist page refetches on mount to ensure consistency | WishlistPage |

### 3.2 Re-Engagement (Part C)

| Scenario | Expected Behavior | Component |
|----------|-------------------|-----------|
| Wishlisted product has 0 badge data | No re-engagement card shown for this item. Item appears normally in wishlist grid. | ReengagementCard |
| Wishlisted product has badge data below threshold (< 50) | Show re-engagement card with raw count: "12 reviewers say it feels genuine" (not percentage) | ReengagementCard |
| All wishlisted products have badge data | Show re-engagement cards for items stalled longest (most days since wishlisted) — max 3 cards to avoid overwhelming | WishlistPage |
| Wishlisted product was just added (0 days ago) | Don't show re-engagement card. Only show for items ≥ 1 day old (stalled intent signal) | WishlistPage |
| User taps "SEE REVIEWS" on re-engagement card | Navigate to `/product/:id?filter=authenticity` (or whichever badge is strongest). PDP opens with filter pre-applied. | ReengagementCard → ProductPage |
| Deep-linked filter has no matching reviews (data changed) | Fall back to showing all reviews with a toast: "Filter cleared — showing all reviews" | ProductPage |
| Re-engagement message text is very long (multiple badges listed) | Cap at top 1-2 positive badges in the message per Touchpoint Content Map. Never show negative stats on wishlist. | ReengagementCard |

---

## 4. Product & Data Edge Cases

### 4.1 Product Data

| Scenario | Expected Behavior | Component |
|----------|-------------------|-----------|
| Product has no images | Show a placeholder image (grey box with camera icon). Should not happen with seeded data, but handle defensively. | ImageGallery |
| Product has 1 image | Show single image. No dot indicators. No swipe gesture. | ImageGallery |
| Product has no sizes (e.g., one-size accessories, perfume) | Hide size selector section entirely | SizeSelector |
| Product has no fit/length data | Hide fit/length bars section | FitLengthBars |
| Product has no AI tags | Hide AI tags section | AiTags |
| Product name is very long (wraps to 3+ lines) | Truncate to 2 lines with ellipsis in product cards. Full name shown on PDP. | ProductCard / ProductInfo |
| Product MRP equals final price (0% discount) | Show only the price. No MRP strikethrough, no discount badge. | ProductInfo |
| Product discount is 0% | Same as above — hide discount-related elements | ProductCard |

### 4.2 API & Network

| Scenario | Expected Behavior | Component |
|----------|-------------------|-----------|
| Backend is down (Railway cold start — can take ~10s) | Show loading spinner for up to 15s, then show error: "Having trouble connecting. Please try again." with "RETRY" button | API client |
| API returns 500 error | Show error toast: "Something went wrong" with "RETRY". Don't crash the page. | API client |
| API returns empty product list | Show: "No products found" — shouldn't happen with seeded data | HomePage |
| Slow network (3G) | Show loading skeleton while data fetches. Don't block interaction for cached pages. | All pages |
| Request times out | 10s timeout. Show error with retry. | API client |
| User navigates away while API call in-flight | Cancel the request (AbortController). No state update on unmounted component. | All pages |
| CORS error (misconfigured backend) | Console error logged. User sees: "Unable to connect to server" | API client |

---

## 5. UI / Layout Edge Cases

### 5.1 Phone Frame

| Scenario | Expected Behavior | Component |
|----------|-------------------|-----------|
| Desktop viewport very wide (2560px+) | Phone frame stays at 430px, centered. No stretching. | AppShell |
| Desktop viewport very narrow (500-600px) | Phone frame still shows with minimal margins. Below 431px, frame disappears. | AppShell |
| Very tall phone viewport (e.g., Galaxy Fold unfolded: 717px wide) | Frame fills width (no device border). Content scrolls normally. | AppShell |
| User zooms in browser (Ctrl+Plus) | Layout should remain functional. May lose phone-frame aesthetic at high zoom — acceptable. | AppShell |
| Landscape orientation on mobile | Not optimized for landscape. Show normally — content may look stretched but functional. | AppShell |
| Safe area insets (iPhone notch, Dynamic Island) | Use `env(safe-area-inset-bottom)` for bottom nav padding to avoid overlap with home indicator | BottomNav |

### 5.2 Scrolling & Overflow

| Scenario | Expected Behavior | Component |
|----------|-------------------|-----------|
| PDP content is very long (many reviews) | Content scrolls within the phone frame. Header and bottom nav stay fixed. No double scrollbar. | AppShell |
| Horizontal scroll containers (filter chips, badge aggregates) | Smooth horizontal scroll. No visible scrollbar (hidden via CSS). Touch swipe works. | ReviewFilterChips, BadgeAggregates |
| Sticky "Add to Bag" buttons overlap with bottom nav | Sticky actions positioned ABOVE the bottom nav (with proper `bottom` offset accounting for nav height) | StickyActions + BottomNav |
| Review modal open — background scrolling | Prevent body scroll when modal is open (`overflow: hidden` on container). Modal itself scrolls independently. | ReviewModal |
| Keyboard opens on mobile (text input in review modal) | Modal content adjusts. Text input remains visible above keyboard. May need `resize` viewport handling. | ReviewModal |

### 5.3 Touch & Interaction

| Scenario | Expected Behavior | Component |
|----------|-------------------|-----------|
| User taps wishlist heart on product card (home grid) | Heart toggles immediately (optimistic). API call happens in background. If API fails, revert with toast. | ProductCard |
| User double-taps product image (common mobile gesture) | No action (not Instagram). Single tap on image does nothing or opens full-screen image view. | ImageGallery |
| User swipes left/right on product image | Navigates to next/previous product image. Dot indicators update. | ImageGallery |
| User tries to swipe between pages (e.g., PDP → Home) | Not supported. Use bottom nav or back button. No swipe-to-navigate. | AppShell |
| Touch target smaller than 44px | Must not happen. All interactive elements (badges, buttons, hearts, chips) must be ≥ 44×44px. | All components |

---

## 6. State & Data Consistency Edge Cases

| Scenario | Expected Behavior | Component |
|----------|-------------------|-----------|
| User submits review → badge aggregates should update | After successful review POST, refetch badge aggregates. Optimistic update acceptable (increment counts locally). | ProductPage |
| User adds to wishlist on PDP → bottom nav count should update | AppContext dispatches immediately. Count in BottomNav reads from context. | AppContext → BottomNav |
| User adds to wishlist on PDP → wishlist page should show item | WishlistPage refetches on mount. If already mounted (unlikely in tab-based nav), should also listen to context changes. | WishlistPage |
| Multiple browser tabs open | No real-time sync between tabs (no websockets in MVP). Each tab has independent state. Acceptable for demo. | All |
| Browser back button from PDP → Home | Should navigate correctly. React Router handles this. Scroll position may reset — acceptable. | React Router |
| User refreshes page on PDP | PDP refetches data from API. No cached state. Scroll position resets to top. Filter state resets. | ProductPage |

---

## 7. Content & Copy Edge Cases

| Scenario | Expected Behavior | Component |
|----------|-------------------|-----------|
| Badge aggregate message in re-engagement card needs to be aggregate-only | NEVER show "User X said..." — always "92% of reviewers" or "Based on X reviews". Per hard constraint. | ReengagementCard |
| No monetary/incentive language anywhere | No "Earn points", "Get rewards", "Win badges". Badges are a UI element, not a gamification reward. | All |
| Price display in INR | Always use ₹ symbol with Indian number formatting (e.g., ₹1,699 not ₹1699). No decimal places for whole numbers. | ProductCard, ProductInfo |
| Discount calculation rounding | `Math.round((mrp - finalPrice) / mrp * 100)` — always round to nearest integer. Show "(XX% OFF)" | helpers.js |

---

## 8. Performance Edge Cases

| Scenario | Expected Behavior | Component |
|----------|-------------------|-----------|
| Product with 100+ reviews (unlikely in MVP but defensive) | Paginate reviews: load first 10, "Load More" button for next batch. In MVP with seeded data (max 15), not an issue. | ProductPage |
| Many product images (4+ per product) | Lazy load below-fold images. First image loads eagerly. | ImageGallery |
| Rapid navigation between products (tap card → back → tap another → back) | Cancel in-flight API calls on unmount. No stale data rendered. | ProductPage |
| Large DOM from many review cards | Virtual scroll not needed for 15 cards. If reviews grow, consider virtualization. | ProductPage |

---

## 9. Accessibility Edge Cases

| Scenario | Expected Behavior | Component |
|----------|-------------------|-----------|
| Screen reader reads badge states | Each badge has `aria-label`: "Authenticity: Not Sure Yet. Tap to change." Updates on state change. | BadgeInput |
| Keyboard navigation through badges | Badge inputs are focusable (`tabIndex={0}`). Enter/Space cycles state. | BadgeInput |
| Color-blind users can't distinguish positive/negative badges | Icons (✅ checkmark vs ✖ X) differentiate states in addition to color. Text labels always present. | BadgeInput, ReviewCard pills |
| Reduced motion preference | Check `prefers-reduced-motion`. If set, skip animations (no bounce, no slide-in). Instant state changes. | All animated components |

---

## 10. Security Edge Cases (MVP Scope)

| Scenario | Expected Behavior | Notes |
|----------|-------------------|-------|
| No authentication | Any visitor can submit reviews, add to wishlist. Acceptable for MVP demo. | By design |
| XSS in review text | React auto-escapes HTML in JSX. Prisma parameterizes queries. No raw HTML rendering. | Handled by framework |
| SQL injection via API params | Prisma ORM parameterizes all queries. No raw SQL. | Handled by Prisma |
| Rate limiting | No rate limiting in MVP. If abused, can add `express-rate-limit` middleware. | Not implemented |
| Malicious badge values in POST body | Backend validates badge values against allowed enum. Rejects unknown values with 400. | Reviews API |
| Very large POST body | Express `body-parser` default limit (100kb) is sufficient. No file uploads in MVP. | Express default |

---

## Summary: Edge Cases by Priority

### Must Handle (will break the demo if not addressed)

1. Cold start — zero/low badge data (threshold display)
2. Empty states (no reviews, empty wishlist)
3. Badge taxonomy per category (correct badges shown)
4. Sticky actions + bottom nav overlap
5. Filter produces zero results
6. Review submission with no text (text is optional)
7. Review submission with no badges (badges are optional)
8. API error handling (Railway cold start delay)

### Should Handle (looks broken if not addressed)

9. Long text truncation (product names, review text)
10. Loading skeletons during API calls
11. Wishlist state sync across pages
12. Price display formatting (₹ + commas)
13. Safe area insets (iPhone notch)
14. Keyboard handling in review modal

### Nice to Have (polish, not critical for demo)

15. Reduced motion preference
16. Screen reader labels
17. Request cancellation on unmount
18. Landscape orientation handling
19. Browser zoom behavior
20. Multi-tab consistency
