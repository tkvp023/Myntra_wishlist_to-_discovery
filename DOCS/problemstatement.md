# Problem Statement & MVP Spec — Myntra Trust-Verified Review System
### v2 — updated with finalized badge taxonomy, threshold, and touchpoint content decisions

---

## 1. Problem Statement

**Root cause:** Users can't verify — before paying — whether a product's real appearance, fabric, and authenticity will match what's shown on the page. Existing review signals are either unfiltered free text or a partial structured layer (Fit/Length bars, AI-summarized tags) that doesn't cover the specific doubts driving hesitation, and is gated by review volume so many products get nothing at all. As a result, users leave the app to seek proof elsewhere (friends, Instagram reels, YouTube hauls) — a slow, off-platform loop that lets purchase intent decay before a wishlisted item converts.

## 2. Evidence Base

- Quality/authenticity doubt is the #1 hesitation driver — 52.5% of all hesitation instances, top blocker in 8 of 10 discovery questions analyzed (8,182-document research corpus)
- All 5 independent user interviews raised fabric, fit, or photo-accuracy trust issues unprompted
- 31.9% of users consult friends, 26.7% seek Instagram/YouTube content before purchasing — an off-platform verification workaround
- Photo-to-product mismatch quantified directly by interviewees: Dhanush (~70% match estimate), Prashant (~50% match estimate); Sruthi noted the product photo is her *only* pre-purchase reference point
- Sizing/fit surfaced independently across interviews: Prashant (6'3", standard sizing unreliable), Arun (size disparity as a reason he avoids online shopping), Dhanush (shoe fit issues) — fit is a distinct, recurring doubt from fabric/authenticity, not a subset of it
- 84.4% of wishlisting represents genuine purchase intent (not passive bookmarking) — so this is a stalled-intent problem, not a demand-generation problem

## 3. What Myntra Already Has (Verified In-App)

| Feature | What it shows | Confirmed limitation |
|---|---|---|
| Fit/Length aggregate bars | Tight–Just Right–Loose, Short–Just Right–Long | Appears on select products only |
| AI-summarized tags | Style, Value for Money, Purpose, Durability, Stitching Quality | Gated by review-volume threshold (consistent with Amazon's confirmed volume-gating for its equivalent feature); fixed taxonomy regardless of category |

**Confirmed gaps neither feature covers:** Photo Match (visual accuracy vs. listing) and Authenticity (counterfeit/genuine concern) — the two most-cited doubts in the underlying research.

**Ruled out:** AI virtual try-on — confirmed via search that Myntra is already piloting this via WhatsApp "Try-On Studio." Not pursued to avoid duplicating a feature already in motion.

**Prior art check:** No direct prior art found for a tap-based Photo Match/Authenticity review badge system after web search. Closest existing patterns are generic trust badges (Verified Purchase) and AI-generated product attribute tagging — neither serves the same purpose. Treat as "no direct prior art found," not "definitively novel."

## 4. Solution Overview (Full Vision — 3 Parts)

### Part A — Tap-Based Trust Badges (MVP / Build First)
Structured, optional tap badges shown during review submission, **additive to Myntra's existing star rating + text review, never a replacement**.

### Part B — Filterable, Criterion-Based Review Dashboard (Fast-Follow)
Filter chips on the review section; tapping one surfaces the aggregate badge stat + filters the review list to matching reviews, with a secondary toggle for disagreeing reviews only.

### Part C — Wishlist Re-Engagement (Fast-Follow)
Stalled wishlist items get a notification built from aggregate badge data (e.g. "87% confirm this matches photos") — no pricing/monetary language, aggregate only, no individual reviewer named, deep-links into the Part B filtered dashboard.

**MVP build scope for this phase: Part A only.** B and C are designed and documented but sequenced after Part A produces real badge data.

---

## 5. Core User Journey (New — the funnel this MVP is built around)

The entire solution exists to move a user through one intended path, re-entering at any point, converging on the same end state:

```
Entry points (any one of these):
  Notification  ──┐
  Homepage stat ──┼──►  WISHLIST PAGE  ──►  PRODUCT PAGE  ──►  Add to Bag  ──►  Checkout
  Search/Category─┘     (badge summary,     (reviews + full
  (organic, no ad)      1-2 top stats        badge panel,
                         per item)            all states, %)
```

- **Entry:** the user is pulled toward their **wishlist**, not directly to the product — either by tapping a notification, tapping a stat on Homepage, tapping a soft reminder in Search/Category, or just navigating to Wishlist on their own (organic, unprompted).
- **Wishlist page** is the midpoint — this is where the curated, positive-leaning badge summary (Section 8) does its job: reminding the user *why* this item was worth wishlisting, without overwhelming them.
- **Product page** is the conversion point — full reviews, full badge panel, complete unfiltered data (Section 8) — where the user does their final due diligence before **Add to Bag → Checkout**.
- Every touchpoint in Section 8 exists to serve this one funnel — none of them are standalone features; they're entry ramps into the same path.

**Non-disruptive, complementary design principle (confirmed):**
- This MVP must **layer into** Myntra's existing product, review, and wishlist experience — not replace, reskin, or restructure it. Star ratings, existing Fit/Length bars, AI-summarized tags, and the current review flow all remain exactly as they are today; badges are additive alongside them (already a hard constraint, Section 12 — restated here as it directly shapes UI decisions too).
- **UI restraint is a requirement, not a nice-to-have.** Every touchpoint must earn its visual weight:
  - Homepage and Search/Category get the *lightest* treatment (a single stat or just a thumbnail) because those surfaces have other jobs to do — the badge content should feel like a natural aside, not compete with or clutter the primary browsing/discovery experience.
  - Wishlist page shows only 1–2 stats per item (not a full panel) precisely to avoid turning a scannable list into a data-dense wall.
  - Full detail is reserved *only* for Product page, where the user has already signaled deep intent and expects to see more information.
- This "detail scales with intent" pattern (introduced in Section 8) is now also the answer to sensory overload: users only see as much as the moment calls for, and never more.

---

## 6. Badge Taxonomy (Final — v2)

### Universal badges
| Badge | States | Applies to |
|---|---|---|
| **Authenticity** | Not Sure Yet (default) / Feels Genuine / Feels Off or Lower Quality | Every category |
| **Overall Satisfaction** | Not Sure Yet (default) / Satisfied / Not Satisfied | Every category **except Clothing and Footwear** (see note below) |

> **Change from v1:** Overall Satisfaction is no longer fully universal. Clothing and Footwear — the two highest-volume categories — rely on Fit + Fabric Feel/Comfort + Photo Match + Authenticity to triangulate satisfaction indirectly, rather than a direct catch-all satisfaction tap. This was a deliberate trade-off (more specific signal over one vague one) and should be stated as such if questioned, not presented as an oversight.

### Category-specific badges
| Category | Photo Match (3-state) | Badge 3 | Badge 4 |
|---|:---:|---|---|
| **Clothing** | ✅ | **Fit** — Fits as Expected / Doesn't Fit as Expected | **Fabric Feel** — Feels As Described / Thinner or Rougher Than Expected |
| **Footwear** | ✅ | **Fit** — Fits as Expected / Doesn't Fit as Expected | **Comfort/Sole Feel** — Comfortable / Stiff or Uncomfortable |
| **Bags & Accessories** | ✅ | Overall Satisfaction | **Material Feel** — Feels Sturdy/Premium / Feels Flimsy |
| **Jewelry & Watches** | ✅ | Overall Satisfaction | **Finish Durability** — Holds Shine/Color / Tarnished or Faded Quickly |
| **Makeup** (lipstick, foundation, blush, eyeshadow) | ❌ | Overall Satisfaction | **Shade/Result Match** — Matches Shown Shade / Different Than Shown |
| **Skincare, Haircare, Fragrance, Appliances/Electronics** | ❌ | Overall Satisfaction | — (Authenticity + Overall Satisfaction only, 2 badges) |

**Photo Match states (where applicable):** Not Sure Yet (default) / Matches Photos / Slightly Different / Very Different

**Max badges shown per product:** 4 (Clothing, Footwear, Bags, Jewelry, Makeup capped effectively at 3) — 2 (Skincare, Haircare, Fragrance, Appliances/Electronics). Never all badge types at once on any single product.

> **Known gap, not yet resolved:** Appliances/Electronics still has no functional-quality badge (e.g. "Works as Described"). Flagged as an open item, not a considered final choice — revisit before those categories go live.

> **Taxonomy validation status:** This 6-bucket mapping is a first pass, not yet validated against Myntra's real internal category tree. Confirmed as acceptable to build against for MVP; refinement expected once real category data is available. Edge cases not yet resolved: Sunglasses/Eyewear, Innerwear.

---

## 7. Low-Sample Data Handling (Updated)

**Minimum-sample threshold: 50 submissions** (raised from the original placeholder of 5).

| Submission count | What's shown |
|---|---|
| 0 | No badge/stat shown at all |
| 1–49 | Raw count or "gaining traction"-style momentum copy (dynamic, exact copy variants + trigger rule still TBD — open item) |
| 50+ | Full percentage breakdown |

**Trade-off, stated explicitly:** 50 is a much higher bar than the original "5," chosen to protect against Amazon's documented small-sample-misrepresentation failure mode (Section 3). The cost: long-tail, lower-traffic products — plausibly where trust doubt matters most, given less brand recognition — will take longest to ever show a percentage, and may never cross 50 at all. This is a conscious bet on statistical confidence over broad coverage, not an oversight, and should be revisited once real submission-rate data exists.

---

## 8. Touchpoint Content Map (Updated)

Each touchpoint shows a different slice of badge data, scaled to how "warm" the context is to a specific wishlisted item.

| Touchpoint | Badge selection logic | Detail shown | Shows negative/mixed stats? |
|---|---|---|:---:|
| **Notifications** | • **Single item qualifying:** Product-page notification (1 stat)<br/>• **2+ items qualifying:** Wishlist-bound notification (multi-item summary) | 1 stat / summary | ❌ Only fires if positive stat(s) exist |
| **Homepage** | • **Exactly 1 qualifying item:** Single-item stat → taps through to Product page<br/>• **2+ qualifying items:** Multi-item summary → taps through to Wishlist page<br/>• **0 qualifying items:** Nothing shown | 1 stat / summary | ❌ Positive-only |
| **Search / Category browsing** | Trigger: keyword / category match on actual results grid. Native type-ahead suggestion list stays completely unmodified. | Inline marker on matching wishlisted item's tile (thumbnail + name only, no stats) | N/A — no stat shown |
| **Wishlist page** | Top 1–2 strongest stats per saved item | 1–2 stats | ❌ Positive-only |
| **Product page** | Shows everything | Full panel — all badges the product has data for, each with full state-by-state % breakdown | ✅ **Complete, unfiltered transparent data** |

**Guiding principle:** the further a touchpoint is from the actual buying decision, the more curated/positive the signal shown; the closer to the decision point (Product page), the more complete and honest the data.

---

## 9. Notification Rules (Part C — Two-Type Split)

### 1. Two-Notification-Type System
- **Product-Page Notification (Single-item trigger):**
  - Fires when a single wishlisted item crosses the 50-submission threshold with a positive stat.
  - Deep-links directly to the specific product's page, scrolled to the Part B summary.
  - **Cap:** 1 badge-based notification per item, sent once ever.
- **Wishlist-Bound Notification (Multi-item trigger):**
  - Fires when 2+ wishlisted items have positive confirmed trust stats.
  - Deep-links to the **Wishlist page** (the midpoint of the funnel).
  - **Repeatability:** Repeatable, re-triggers only when a *new* wishlisted item crosses the threshold.

### 2. General Notification Guardrails
- **Positive-Only Rule:** Both notification types only fire if positive confirmed stats exist.
- **Aggregate Only:** No individual reviewer named, no monetary/pricing language.
- **Price/Discount Priority & Staggering:**
  - Price/discount and badge notifications have equal priority — both send, but are staggered with a minimum gap (e.g. 2 hours) to avoid notification fatigue.

---

## 10. Open Items & Future Roadmap

The following items are recognized as open design/engineering questions for future scaling:
1. **Notification stagger gap value:** Minimum interval between same-day sends (e.g., 2 hours vs. 4 hours).
2. **Homepage / Notification dedupe logic:** Preventing a user from seeing the identical stat line in a push notification and on the homepage in the same session.
3. **Copy variants for 1–49 range:** Standardized rules for raw count (`"4 of 5 confirm"`) vs. momentum copy (`"Gaining traction — 18 buyers confirm"`).
4. **Appliances / Electronics functional badge:** Defining a functional quality badge (e.g. *"Works as Described"*) before broader live rollout.
5. **"Bags & Accessories" taxonomy validation:** Finalizing subcategory trees for eyewear, belts, and accessories against Myntra's production taxonomy.
6. **Backend submission schema & batch aggregation:** Materialized aggregate cache pipeline at 50-submission threshold crossing.
7. **Badge-text mismatch & moderation:** System handling of multi-dimensional nuance (e.g. 5★ star rating + negative fit badge).
8. **Matched-cohort holdout pilot design & event logging specification.**

---

## 10. Design Direction (Confirmed)

- Visual identity: Myntra-native (hot pink/magenta primary, deep maroon/red for negative states, amber for neutral/middle states), bold confident fashion-forward energy — not cartoonish/gamified
- Each badge is **one component with multiple tap states** (default "Not Sure Yet" + 2–3 selected variants), not separate badges per state
- Reference visual direction generated and approved — see attached badge sticker sheet

---

## 11. Known Risks & Mitigations

1. **Cold start** — new SKUs have zero badge data on day one. *Mitigation:* minimum-sample threshold (Section 6) — below 50 submissions, raw count/momentum copy shown, never a percentage.
2. **Self-selection bias** — optional taps skew toward reviewers with strong opinions. *Mitigation:* named explicitly as a stated limitation; badge prompt sequenced before the text field to lower response effort.
3. **Category taxonomy is a first pass**, not validated against Myntra's real internal category tree — directly determines which badges appear per product, so it's a structural input, not just a filter label. Confirmed acceptable to build against for MVP; flagged for revalidation.
4. **Coverage vs. confidence trade-off (new, from the threshold change)** — raising the threshold to 50 makes shown percentages more statistically reliable, but concentrates that reliable signal on already-popular products, likely under-serving the long-tail items where doubt is highest. Conscious trade-off, not an oversight.
5. **Pilot measurement risks confounding popularity with badge effect** — comparing items above vs. below the sample threshold risks measuring "high-traffic products convert better," not the badge effect specifically. A rigorous pilot needs a matched-cohort or holdout design (same popularity tier, badges on vs. off), not a raw threshold split. Full methodology not yet designed — flagged as an open item (Section 13).
6. **Overall Satisfaction is no longer universal** — Clothing and Footwear (highest-volume categories) don't get a direct satisfaction tap, relying on other badges to triangulate it instead. Deliberate trade-off, stated explicitly so it doesn't read as an accidental gap.
7. **Appliances/Electronics has no functional-quality badge** — open gap, not yet resolved.

---

## 12. Hard Constraints

- **No monetary incentives** anywhere in the solution (badges, dashboard, or notifications)
- Badges are **additive only** — existing star rating + free-text review flow must remain fully intact and unchanged
- Aggregate data only in any user-facing display — never attribute badge data to a named individual reviewer
- Must respect Myntra's real review submission window (~4–5 days post-delivery) — this is why Durability was excluded as a badge (requires longer-term usage data than the window allows)

## 13. What's Explicitly Out of Scope for This MVP

- Durability badge (time-delayed, doesn't fit review window)
- AI photo/virtual try-on engine (Myntra already piloting)
- Stock-scarcity messaging ("1 piece left") — separate urgency lever, not a trust/quality signal; may be explored later
- Cross-brand fit translator, structured video reviews, "ask before you wishlist" doubt capture, peer decision circles, return-reason feedback loops — parked as roadmap/future concepts, not in this build

---

## 14. MVP Form & Build Scope (Confirmed)

**Form:** A feature within Myntra — not a standalone AI agent, workflow, or separate experience. The badges, dashboard, and re-engagement notification are only meaningful layered into the actual purchase journey (PDP → review flow → wishlist → homepage → search), so the MVP is built as a Myntra-style web app rather than a disconnected tool.

**Build scope: Full vision — Parts A + B + C, all included in the deployed MVP.**
- Part A: product page with review submission flow including tap-based badges
- Part B: filterable, criterion-based review dashboard on the product page, plus the full badge panel per Section 8
- Part C: simulated wishlist re-engagement — notifications, homepage surfacing, search/category reminders, and wishlist-page summaries, all built per the content rules in Section 8

**Data:** Realistic seeded/mock data — fake products, fake reviews, fake badge tallies populated ahead of time (not live user-submitted data accumulating in real time), including some products deliberately seeded below the 50-submission threshold to demonstrate the raw-count/momentum fallback state.

**Visual fidelity requirement:** The MVP must look and feel as close to actual Myntra as possible — not a generic e-commerce template with Myntra's colors swapped in. This means matching Myntra's real UI conventions specifically:
- Signature hot pink/magenta (#FF3F6C-style) as the dominant accent, used the way Myntra uses it (CTAs, tags, prices, active states)
- Myntra's actual PDP layout patterns (image gallery, size selector, price/discount block, ratings summary at the top of reviews)
- Myntra's existing review section conventions (the confirmed Fit/Length bars and AI-summarized tag patterns) shown as-is, with the new badge system layered in visually consistent with them — not clashing with or replacing Myntra's real patterns
- Typography, spacing, and card/button styling that reads as "this could plausibly ship inside the real app," not as an obviously AI-generated or templated UI

**Deployment:** Must be deployed such that it can be interacted with and tested directly (live, hosted), not just described or shown as static mockups.

**Tech stack for build:** React + Tailwind CSS, hand-styled with custom color tokens to match Myntra's real visual language (no off-the-shelf UI kit like Material-UI/Ant Design — their default component styling would work against the "looks like Myntra" goal). Note: Myntra's own public engineering blog confirms a React/Redux/Redux-Saga web stack and an internal custom component system ("Unity"), but no specific public UI library is documented — visual fidelity is achieved through custom styling, not by matching their internal tooling.

---

## 15. Success Metric (Hypothesis, Not a Committed Number)

No verified 30-day wishlist-to-purchase baseline exists in current research data — do not present a fabricated target %. Pilot measurement plan: for wishlisted items with quality/authenticity badge data available (above the 50-submission threshold), compare 30-day conversion rate against items without, isolating the effect on the *quality-doubt-driven portion* of wishlist stall specifically (not overall conversion, which has other unaddressed drivers like price-waiting and return-policy concern).

**Not yet resolved:** the matched-cohort/holdout methodology needed to avoid confounding badge effect with baseline product popularity (Risk #5, Section 11). This needs to exist before real pilot data collection begins, along with the underlying event logging (badge taps, threshold-crossing timestamps, notification sends, downstream conversion) — both flagged as open items for before-build decisions, not yet specified in this document.

---

## 16. Open Items Still Pending (Not Yet Decided)

Carried forward from decision discussions, not yet resolved as of this version:

1. Exact copy variants for 1–49 submission range + trigger rule for raw count vs. momentum phrasing
2. Search/Category display order when multiple wishlisted items match
3. Homepage/Notification dedupe logic to avoid repeat exposure
4. Badge placement test (before vs. after free-text field) — single version or A/B test
5. Storage/schema design for badge submissions
6. Real-time vs. batch aggregation when a product crosses the 50-submission threshold
7. Notification priority enforcement mechanism (price/discount vs. badge send conflict)
8. Matched-cohort/holdout pilot measurement design
9. Event logging requirements to support future measurement
10. Badge-text mismatch handling (e.g. 5-star review + negative badge) — accepted as noise, or flagged/moderated?
11. Appliances/Electronics functional-quality badge gap
12. Category taxonomy validation against Myntra's real category tree (Sunglasses, Innerwear edge cases)
