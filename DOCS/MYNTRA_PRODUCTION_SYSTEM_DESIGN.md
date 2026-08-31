# Myntra Trust-Verified Review System
## Enterprise Production System Design & Architecture Specification

---

## 📑 Table of Contents
1. [Executive Overview & Scale Context](#1-executive-overview--scale-context)
2. [End-to-End Enterprise Architecture Diagram](#2-end-to-end-enterprise-architecture-diagram)
3. [Component Breakdown by Layer](#3-component-breakdown-by-layer)
   - 3.1 Client Layer (Native iOS/Android & mWeb)
   - 3.2 Edge & API Gateway Layer
   - 3.3 Core Microservices Layer
   - 3.4 Event Streaming & Async Message Bus (Kafka)
   - 3.5 Real-Time Aggregation & Worker Engine
   - 3.6 Persistence, Cache & Storage Layer
4. [Data Flow & Sequence Pipelines](#4-data-flow--sequence-pipelines)
   - 4.1 Pipeline A: Post-Purchase 1-Tap Review Submission
   - 4.2 Pipeline B: PDP High-Speed Badge Aggregates Serving
   - 4.3 Pipeline C: Async Stalled-Wishlist Milestone Notification
5. [Caching Strategy & Sub-Millisecond SLA](#5-caching-strategy--sub-millisecond-sla)
6. [Anti-Gaming, Fraud Detection & Moderation Engine](#6-anti-gaming-fraud-detection--moderation-engine)
7. [Analytics, Telemetry & A/B Experimentation Pipeline](#7-analytics-telemetry--ab-experimentation-pipeline)
8. [Reliability, Fault Tolerance & Disaster Recovery](#8-reliability-fault-tolerance--disaster-recovery)

---

## 1. Executive Overview & Scale Context

Implementing the **Trust-Verified Review System** at Myntra's production scale requires an architecture capable of supporting:
* **Traffic Scale:** 40M+ Monthly Active Users (MAU), 150M+ daily page views, and peak festive concurrency (>100,000 QPS on PDP).
* **Latency SLA:** P99 PDP response time `< 45ms` (badge aggregates cached in-memory at the edge).
* **Write Throughput:** Millions of post-purchase badge reviews collected during major shopping events (EORS / Big Fashion Festival).
* **Event-Driven Re-Engagement:** Real-time stream processing to identify stalled wishlist items reaching 50+ consensus thresholds without database table locks.

---

## 2. End-to-End Enterprise Architecture Diagram

![Myntra Trust-Verified Enterprise System Design Diagram](assets/myntra_system_design_diagram.jpg)

### High-Level Topology Specification

```mermaid
flowchart TB
    %% CLIENT LAYER
    subgraph CLIENTS ["1. Client & Presentation Layer"]
        iOS["iOS App (Swift / React Native)"]
        Android["Android App (Kotlin / React Native)"]
        Web["Mobile Web / Desktop (Next.js / React)"]
    end

    %% EDGE LAYER
    subgraph EDGE ["2. Edge & API Gateway Layer"]
        CDN["Cloudflare / Akamai Edge CDN\n• Edge Caching\n• Image/WebP Optimization\n• WAF / DDoS Protection"]
        GW["Envoy / Kong API Gateway\n• JWT / OAuth Auth Verification\n• Rate Limiting & Circuit Breaking\n• Dynamic Route Dispatcher"]
    end

    CLIENTS -->|"HTTPS / HTTP2 / gRPC"| CDN
    CDN -->|"Cache Miss / Dynamic API"| GW

    %% MICROSERVICES LAYER
    subgraph SERVICES ["3. Core Microservices Layer (Kubernetes / EKS Cluster)"]
        ReviewSvc["Trust Review Ingestion Service\n• 1-Tap Badge Capture\n• Sizing / Verified Buyer Validation\n• Text & UGC Metadata Handling"]
        CatalogSvc["Product Catalog & PDP Service\n• PDP Metadata & Spec Builder\n• Category-Aware Badge Mapping\n• Fit/Length Bars API"]
        WishlistSvc["Wishlist & Collections Service\n• Wishlist Management\n• Custom Occasion Tags (Workwear/Vacay)\n• Stalled-Intent Tracker"]
        FraudSvc["Fraud & Anti-Gaming Service\n• Order ID Verification (Verified Buyer)\n• Sybil Attack & Review Bombing Detection\n• Sentiment Anomaly Scorer"]
        MediaSvc["UGC Media & Vision Service\n• Photo/Video Upload Signing\n• AI Daylight Color & Swatch Validator\n• NSFW / Blur / Duplicate Filter"]
        NotifSvc["Campaign & Notification Engine\n• Trust Milestone Push Dispatcher\n• Priority Arbitration (Price Drop > Trust)\n• Notification Fatigue Guardrail"]
    end

    GW -->|"POST /reviews"| ReviewSvc
    GW -->|"GET /products/:id"| CatalogSvc
    GW -->|"GET /wishlist"| WishlistSvc
    GW -->|"POST /ugc/upload-url"| MediaSvc

    ReviewSvc <-->|"Verify Purchase"| FraudSvc
    ReviewSvc -->|"Verify Media"| MediaSvc

    %% EVENT BACKBONE
    subgraph BACKBONE ["4. Event Streaming & Messaging Backbone (Apache Kafka)"]
        K_Review["Topic: review.badge.submitted"]
        K_Threshold["Topic: product.threshold.crossed"]
        K_Wishlist["Topic: wishlist.item.stalled"]
        K_Notif["Topic: notification.push.requested"]
    end

    ReviewSvc -->|"Emit Event"| K_Review
    WishlistSvc -->|"Emit Event"| K_Wishlist

    %% REAL-TIME STREAM WORKERS
    subgraph STREAMING ["5. Real-Time Stream Processing & Aggregation (Apache Flink / Spark Streaming)"]
        AggWorker["Badge Aggregation Engine\n• Computes 9-Badge Positive Ratios\n• Enforces 50-Submission Threshold Gate\n• Formats Momentum vs Statistical Mode"]
        MilestoneWorker["Trust Milestone Detector\n• Compares New Score vs Threshold (≥90%)\n• Matches Against Stalled Wishlist Items\n• Emits Milestone Events"]
    end

    K_Review --> AggWorker
    AggWorker -->|"Threshold Met"| K_Threshold
    K_Threshold --> MilestoneWorker
    K_Wishlist --> MilestoneWorker
    MilestoneWorker -->|"Trigger Push"| K_Notif
    K_Notif --> NotifSvc

    %% STORAGE LAYER
    subgraph STORAGE ["6. Enterprise Storage & Persistence Layer"]
        R_Cache[("Redis Cluster / DAX\n• Pre-Computed Badge Aggregates\n• Active Filters Cache\n• Sub-millisecond TTL Read")]
        PrimaryDB[("Primary Database (PostgreSQL / CockroachDB / DynamoDB)\n• Products, Reviews, Wishlists\n• Master Relational Entities")]
        BlobStore[("Object Storage (AWS S3 / Google Cloud Storage)\n• Customer Daylight Photos & Videos\n• Studio Catalog References")]
        DataLake[("OLAP Analytics & Warehouse (Snowflake / ClickHouse)\n• Return Rate Correlation Analytics\n• A/B Pilot Conversion Attribution\n• NPS & Review Quality Dashboards")]
    end

    AggWorker -->|"Write Pre-Calculated Stats"| R_Cache
    ReviewSvc -->|"Write Raw Review Record"| PrimaryDB
    CatalogSvc <-->|"Read Fast Pre-Computed Cache"| R_Cache
    CatalogSvc <-->|"Read Fallback / Base Specs"| PrimaryDB
    WishlistSvc <-->|"Read / Write Items"| PrimaryDB
    MediaSvc -->|"Store Compressed UGC"| BlobStore
    PrimaryDB -.->|"CDC Debezium"| DataLake
```

---

## 3. Component Breakdown by Layer

### 3.1 Client Layer (Native iOS/Android & Mobile Web)
* **Mobile Apps (Kotlin / Swift / React Native):** Native rendering of the 1-tap review submission modal, daylight UGC carousel, and filter chips.
* **Optimistic Local State:** When a user taps a trust badge chip (e.g. `94% Photo Match`), client-side filtering executes instantly (< 16ms frame rate) while background API queries fetch extended pages.

### 3.2 Edge & API Gateway Layer
* **Edge CDN (Akamai / Cloudflare):** Terminates SSL, caches pre-calculated PDP trust badge JSON fragments with a 60-second TTL, and performs on-the-fly WebP image compression.
* **API Gateway (Envoy / Kong):** Enforces JWT user authentication, rate limiting (prevents review submission spam), and injects telemetry headers for A/B testing cohort routing.

### 3.3 Core Microservices Layer
1. **Trust Review Ingestion Service:**
   - Exposes `POST /api/products/:id/reviews`.
   - Validates that the reviewer purchased the product (`Verified Buyer`), checks size compatibility, and records binary/ternary badge choices.
2. **Product Catalog & PDP Service:**
   - Merges core catalog metadata (MRP, brand, images, sizes) with pre-computed badge aggregates fetched from Redis.
3. **Wishlist & Re-Engagement Service:**
   - Tracks item save timestamps, user-assigned occasion tags (`Workwear`, `Wedding`, `Casual`), and calculates wishlist dormancy duration.
4. **Campaign & Notification Engine:**
   - Interacts with Firebase Cloud Messaging (FCM) and Apple Push Notification Service (APNs).
   - **Anti-Spam Filter:** Ensures a user receives at most one trust notification every 4 days, prioritizing price drops over trust milestones when both co-occur.

---

## 4. Data Flow & Sequence Pipelines

### 4.1 Pipeline A: Post-Purchase 1-Tap Review Submission

```mermaid
sequenceDiagram
    autonumber
    actor Buyer as Verified Buyer
    participant App as Mobile App
    participant GW as API Gateway
    participant RevSvc as Review Service
    participant Fraud as Fraud & Order Svc
    participant Kafka as Apache Kafka
    participant Agg as Aggregation Engine
    participant Redis as Redis Cache
    participant DB as Master DB

    Buyer->>App: Delivers Item -> Opens "Rate Product"
    App->>Buyer: Shows 1-Tap Badges (Authenticity, Fit, Photo Match)
    Buyer->>App: Taps Badges (Takes < 10 seconds)
    App->>GW: POST /api/products/prod_1/reviews
    GW->>RevSvc: Forward authenticated payload
    RevSvc->>Fraud: Validate Order ID & Verified Buyer status
    Fraud-->>RevSvc: Status: CONFIRMED_PURCHASE
    RevSvc->>DB: INSERT into Review Table
    RevSvc->>Kafka: Publish "review.badge.submitted"
    RevSvc-->>App: 201 Created (Badges Published ✓)
    Kafka->>Agg: Consume new review event
    Agg->>Agg: Recalculate Positive Ratios & Check 50-Threshold
    Agg->>Redis: SET product:prod_1:badge_aggregates
```

---

### 4.2 Pipeline B: PDP High-Speed Badge Aggregates Serving

```mermaid
sequenceDiagram
    autonumber
    actor Shopper as Shopper Browsing PDP
    participant CDN as Edge CDN
    participant GW as API Gateway
    participant CatSvc as Catalog Service
    participant Redis as Redis Cache
    participant DB as Read-Replica DB

    Shopper->>CDN: GET /api/products/prod_1
    alt Edge Cache Hit (Valid TTL)
        CDN-->>Shopper: Return cached PDP with Badge Aggregates (<15ms)
    else Edge Cache Miss
        CDN->>GW: Forward Request
        GW->>CatSvc: Dispatch GET /products/prod_1
        CatSvc->>Redis: GET product:prod_1:badge_aggregates
        alt Redis Hit (Sub-millisecond)
            Redis-->>CatSvc: Return pre-computed aggregates
        else Redis Miss
            CatSvc->>DB: Compute from raw reviews & fallback
            CatSvc->>Redis: Set cache with TTL 300s
        end
        CatSvc-->>GW: Return consolidated product JSON
        GW-->>CDN: Cache response & forward
        CDN-->>Shopper: Render PDP with Trust Dashboard (<45ms)
    end
```

---

### 4.3 Pipeline C: Async Stalled-Wishlist Milestone Notification

```mermaid
sequenceDiagram
    autonumber
    participant Agg as Stream Worker
    participant Kafka as Apache Kafka
    participant Milestone as Milestone Detector
    participant Wishlist as Wishlist DB
    participant NotifSvc as Notification Engine
    actor Shopper as Stalled Shopper

    Agg->>Kafka: Publish "product.threshold.crossed" (prod_1 > 90% Photo Match)
    Kafka->>Milestone: Consume threshold crossed event
    Milestone->>Wishlist: Query users with prod_1 in Wishlist > 7 days
    Wishlist-->>Milestone: Returns [User_8923, User_4412, ...]
    Milestone->>NotifSvc: Request Milestone Push
    NotifSvc->>NotifSvc: Check frequency cap & price drop conflicts
    NotifSvc->>Shopper: 🔔 "93% of verified buyers confirm Roadster Shirt matches photos"
    Shopper->>Shopper: Taps Push -> Deep links to PDP filtered reviews
```

---

## 5. Caching Strategy & Sub-Millisecond SLA

To handle mega-sale concurrency without degrading database performance:

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                            MULTI-TIER CACHE HIERARCHY                        │
├──────────────────────────┬───────────────────┬───────────────────────────────┤
│ Tier                     │ Technology        │ Stored Data & Eviction Policy │
├──────────────────────────┼───────────────────┼───────────────────────────────┤
│ Tier 1: Client Cache     │ React Query / SWR │ 3-minute in-memory cache      │
│ Tier 2: Edge CDN         │ Akamai / Cloudflare│ 60-second TTL edge JSON fragment │
│ Tier 3: Distributed Cache│ Redis Cluster (v7)│ Key: `prod:{id}:trust_stats`  │
│ Tier 4: Primary DB       │ PostgreSQL Replica│ Read-replica fallback pool    │
└──────────────────────────┴───────────────────┴───────────────────────────────┘
```

### Redis Key Data Structure:
```json
{
  "key": "prod:prod_1:badge_aggregates",
  "ttl": 3600,
  "value": {
    "totalBadgeReviews": 54,
    "hasThreshold": true,
    "confidenceLevel": "HIGH",
    "badges": {
      "authenticity": { "positivePercent": 93, "sampleSize": 54, "headline": "Feels 100% Genuine" },
      "photoMatch": { "positivePercent": 91, "sampleSize": 54, "headline": "Matches Product Photo" },
      "fit": { "positivePercent": 85, "sampleSize": 52, "headline": "Fits as Expected" },
      "fabricFeel": { "positivePercent": 88, "sampleSize": 50, "headline": "Soft & Breathable Cotton" }
    }
  }
}
```

---

## 6. Anti-Gaming, Fraud Detection & Moderation Engine

To protect platform integrity against seller review manipulation and bot rings:

1. **Verified Buyer Token Requirement:** A review submission must include an immutable `order_item_id` signed by the Order Service. Non-buyers cannot submit badge data.
2. **Sybil & Velocity Throttling:** Detects abnormal spikes in positive badge submissions for a single merchant SKU within short time windows ($>3\sigma$ velocity anomaly).
3. **Computer Vision Daylight Verification:** UGC photos uploaded by buyers pass through a lightweight vision classifier ensuring:
   - Image contains clothing/textiles (filters out random irrelevant photos).
   - Natural color balance check (flags studio-rendered stock images uploaded maliciously).

---

## 7. Analytics, Telemetry & A/B Experimentation Pipeline

```mermaid
flowchart LR
    A["Client Interaction\n• Filter Chip Tapped\n• Reengagement Click\n• Review Modal Submitted"] --> B["Myntra Analytics SDK\n(Clickstream Pipeline)"]
    B --> C["Kafka Topic: telemetry.trust.events"]
    C --> D["Snowflake / ClickHouse Data Warehouse"]
    D --> E["Looker / Tableau Executive Dashboards\n• Return Rate Reduction by Category\n• Wishlist-to-Bag Conversion Lift\n• Review Friction & Completion Rate"]
```

### Key Tracked Event Schemas:
* `trust_badge_viewed(productId, badgeType, percentValue, thresholdMode)`
* `trust_filter_clicked(productId, filterKey, disagreeOnly)`
* `wishlist_reengagement_clicked(productId, milestoneType)`
* `review_badge_submitted(productId, orderId, badgesSelectedCount, durationSeconds)`

---

## 8. Reliability, Fault Tolerance & Disaster Recovery

* **Graceful Degradation:** If the Redis aggregation cache becomes unavailable, the PDP automatically falls back to standard star rating and fit bars without blocking product page renders.
* **Circuit Breakers (Resilience4j / Envoy):** If the Trust Review service experiences latency $> 200\text{ms}$, review badge writes are queued asynchronously in Kafka while acknowledging the user with an optimistic success confirmation.
* **Multi-AZ Replication:** Redis Cluster and PostgreSQL instances span three AWS Availability Zones with automated sub-30-second failover.

---

## 🏁 Architectural Summary
This system design provides **horizontal scalability**, **sub-45ms PDP read latencies**, and **real-time event streaming**, seamlessly integrating trust-verified validation directly into Myntra's high-scale production ecosystem.
