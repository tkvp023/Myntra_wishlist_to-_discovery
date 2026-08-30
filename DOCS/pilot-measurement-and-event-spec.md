# Pilot Measurement & Event Logging Specification

> **Methodology for measuring the causal impact of the Trust Badge System without popularity confounders, paired with the complete analytics event taxonomy.**

---

## 🎯 1. Pilot Measurement Methodology (Holdout Experiment Design)

### The Popularity-Confound Problem
- If we simply compare products with badges (≥50 submissions) vs. products without badges (<50 submissions), we would measure **product popularity**, not the badge effect.
- Popular products naturally have higher conversion rates, greater brand affinity, and more sales volume regardless of badges.

### The Solution: Matched-Pair Holdout A/B Test
To isolate the true causal impact of the trust badge system on customer decision-making, we use a **Randomized Matched-Cohort Holdout Design**:

```
                                  ELIGIBLE SKUs
                          (Both have ≥50 submissions,
                           same category, price tier, brand tier)
                                      │
                   ┌──────────────────┴──────────────────┐
                   ▼                                     ▼
        GROUP A: CONTROL (50%)                GROUP B: TEST (50%)
        • Standard Star Rating & Free Text    • Full Trust Badge Panel (PDP)
        • NO Trust Badges                     • Wishlist Re-engagement Cards
        • Standard Wishlist & Search          • 2-Notification-Type System
                                              • Inline Search Markers
```

### Primary & Secondary Success Metrics

| Metric | Target Hypothesis | Measurement Window |
|---|---|---|
| **Wishlist-to-Cart Conversion Rate** | **+12% to +18% increase** (stalled buyers converted by verified trust confirmations) | 14 days post-wishlist |
| **7-Day Return Rate** | **-15% to -22% reduction** (fewer sizing, fabric, and photo mismatch returns) | 7 days post-delivery |
| **PDP Dwell Time & Review Engagement** | **+25% increase** in time spent reviewing structured badge distributions | Session level |
| **Review Submission Completion Rate** | **+30% higher review response rate** due to low-friction 1-tap badge sequencing before text | Post-delivery review flow |

---

## 📊 2. Comprehensive Event Logging Specification

Every user interaction across the funnel emits a structured analytics event payload:

### 1. Review Submission Flow (Part A)
```typescript
// review_badge_tapped
{
  event: "review_badge_tapped",
  properties: {
    product_id: "prod_1",
    category: "clothing",
    badge_key: "fit",
    selected_state: "fitsAsExpected", // 'fitsAsExpected' | 'doesNotFit' | 'notSure'
    previous_state: "notSure",
    time_to_tap_ms: 1850,
    source: "post_purchase_review_modal"
  }
}

// review_submitted
{
  event: "review_submitted",
  properties: {
    review_id: "rev_9921",
    product_id: "prod_1",
    rating: 5,
    badges_completed_count: 4,
    has_text_review: true,
    text_character_count: 84
  }
}
```

### 2. Product Detail Page Due Diligence (Part B)
```typescript
// pdp_trust_panel_viewed
{
  event: "pdp_trust_panel_viewed",
  properties: {
    product_id: "prod_5",
    threshold_crossed: true,
    total_badge_submissions: 52,
    top_badge_key: "authenticity",
    top_badge_percent: 94
  }
}

// pdp_badge_filter_applied
{
  event: "pdp_badge_filter_applied",
  properties: {
    product_id: "prod_5",
    filter_type: "badge", // 'badge' | 'rating' | 'disagree_only'
    filter_value: "fit",
    filtered_reviews_count: 46
  }
}
```

### 3. Wishlist & Entry Touchpoints (Part C, Section 8)
```typescript
// notification_sent
{
  event: "notification_sent",
  properties: {
    user_id: "usr_4821",
    notification_type: "wishlist_milestone", // 'wishlist_milestone' | 'product_alert' | 'price_drop'
    product_ids: ["prod_1", "prod_5"],
    qualifying_items_count: 2,
    top_stat_shown: "93% confirm Roadster Shirt feels genuine",
    stagger_gap_hours: 2.5
  }
}

// notification_clicked
{
  event: "notification_clicked",
  properties: {
    notification_id: "notif_812",
    notification_type: "wishlist_milestone",
    deep_link_destination: "/wishlist",
    days_stalled: 3
  }
}

// search_inline_marker_viewed
{
  event: "search_inline_marker_viewed",
  properties: {
    query: "casual shirt",
    matching_wishlist_product_id: "prod_1",
    grid_position_index: 0
  }
}

// add_to_bag_from_trust_surface
{
  event: "add_to_bag_from_trust_surface",
  properties: {
    product_id: "prod_1",
    source_touchpoint: "pdp_trust_dashboard", // 'homepage_shelf' | 'wishlist_reengagement' | 'pdp_trust_dashboard'
    pre_filtered_badge: "authenticity",
    final_price: 649
  }
}
```

---

## 🔒 3. Data Privacy & Compliance Guardrails

1. **Zero Monetary Incentives:** No coupon, coin, or point incentives are ever linked to badge taps.
2. **Aggregate-Only Display:** Individual reviewer identities are never tied to badge metrics in user-facing surfaces.
3. **Additive Architecture:** Star ratings and free text remain fully intact and independent.
