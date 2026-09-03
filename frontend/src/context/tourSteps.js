export const TOUR_STEPS = [
  {
    id: 'step_notification',
    stepNumber: 1,
    title: '1. Push Notification Updates on Saved Items',
    subtitle: 'Standard Mobile Push Notification (Lock Screen / Notification Bar)',
    route: '/',
    targetElementId: 'in-app-notification-banner',
    badgeText: 'Push Notification',
    description:
      'A standard mobile push notification delivered to the shopper\'s device when a saved item in their wishlist reaches our assumed threshold of 50 verified buyer reviews confirming strong quality (e.g. "93% of buyers confirm this feels genuine"). Tapping the notification opens the product page where shoppers can view details and trust ratings. (Note: In live production, Myntra calibrates specific volume thresholds per category to display verified stats).',
    actionPrompt: 'Tap on the top push notification banner to open the product page.',
    researchMetric: 'Smart Push Reminders (50+ Reviews)',
    researchHeading: 'Reminding Shoppers With Real Proof',
    researchQuote:
      'Instead of spamming users with generic discount notifications, we send helpful push alerts when verified buyers confirm the quality of items already in their wishlist. This gives shoppers the confidence to return and complete their purchase.',
    keyPoints: [
      'Standard Mobile Push: Delivered as a regular OS push notification to the user\'s phone (Lock Screen / Notification Tray) without needing the app to be open.',
      'Fair Priority: Price drop alerts always take precedence so shoppers never miss a discount.',
      '50+ Review Threshold: For this project MVP, we assume a minimum threshold of 50 verified reviews before triggering trust updates (Myntra uses dynamic category-calibrated thresholds in production).',
      'Direct Deep-Link: Tapping the push notification opens the app straight to the product page.'
    ]
  },
  {
    id: 'step_homepage',
    stepNumber: 2,
    title: '2. Homepage Saved Items Reminder',
    subtitle: 'Highlights Your Saved Clothes With Buyer Ratings',
    route: '/',
    targetElementId: 'saved-items-section',
    badgeText: 'Homepage Shelf',
    description:
      'A simple shelf in the middle of the homepage reminds shoppers of items they saved earlier, showing quick summaries like how it fits and whether it feels genuine.',
    actionPrompt: 'Tap on the Roadster Denim Shirt card to see its full ratings and customer reviews.',
    researchMetric: 'Easy to Spot',
    researchHeading: 'Bringing Saved Items Back to Mind',
    researchQuote:
      'People often save clothes in their wishlist and forget them. Putting a clean reminder shelf on the homepage with real customer feedback helps shoppers easily revisit what they liked without searching again.',
    keyPoints: [
      'Top Pick Highlight: The item with the best buyer feedback gets a gentle border so it stands out.',
      'Quick Summary: Shows 2 key facts (e.g. 93% Genuine · 85% Fits As Expected) at a single glance.',
      'Clean Look: Blends smoothly into the homepage without feeling pushy or cluttered.'
    ]
  },
  {
    id: 'step_search',
    stepNumber: 3,
    title: '3. Clean Search & Saved Markers',
    subtitle: 'Subtle Heart Badges While Searching',
    route: '/',
    targetElementId: 'top-search-bar',
    badgeText: 'Search Results',
    description:
      'While typing in the search box, suggestions stay completely clean. In the search results grid, any product you already saved has a small [🤍 Wishlisted] badge so you can easily spot it.',
    actionPrompt: 'Tap Search or type "shirts" to see the small saved item badge on matching products.',
    researchMetric: 'Clutter-Free Search',
    researchHeading: 'Keeping Search Simple and Fast',
    researchQuote:
      'When shoppers are searching, they want fast and clean results. We keep trust badges minimal here and show full details only when you click into a product.',
    keyPoints: [
      'Clean Search Bar: No annoying popups or extra badges while you are typing.',
      'Saved Marker: A small heart tag clearly marks items you already added to your wishlist.',
      'Right Timing: Detailed quality charts are saved for the product page where shoppers need them most.'
    ]
  },
  {
    id: 'step_wishlist',
    stepNumber: 4,
    title: '4. Wishlist Quality Ratings',
    subtitle: 'Instant Confidence on Your Saved Items',
    route: '/wishlist',
    targetElementId: 'wishlist-grid-section',
    badgeText: 'Wishlist Ratings',
    description:
      'Every saved item in your wishlist shows its top buyer ratings right on the card (like fit and genuine quality). Tapping any rating opens the verified reviews instantly.',
    actionPrompt: 'Tap any green rating badge on a wishlist card, or tap the bar chart icon to see all buyer stats.',
    researchMetric: '94.4% Buying Intent',
    researchHeading: 'Clearing Doubts on Saved Items',
    researchQuote:
      '94.4% of wishlisted items represent active purchase intent (84.4% genuine intent + 10.0% comparison shortlisting). Showing real customer ratings directly on wishlist cards answers quality doubts right away so shoppers don\'t have to reopen every single product page.',
    dataSource: {
      label: 'AI Discovery Engine',
      url: 'https://myntra-ai-discovery-engine.vercel.app/'
    },
    keyPoints: [
      'Clear Ratings on Cards: Shows key facts like "93% Feels Genuine" right under the photo.',
      '1-Tap to Reviews: Tapping any rating badge takes you straight to the exact reviews discussing that topic.',
      'Detailed Stats: Tapping the bar chart icon opens a complete breakdown of all buyer feedback.',
      'Reminder for Older Items: Highlights positive feedback on items saved a few days ago to help you decide.'
    ]
  },
  {
    id: 'step_pdp_dashboard',
    stepNumber: 5,
    title: '5. Product Trust Summary Dashboard',
    subtitle: 'Clear Ratings for Authenticity, Fit, and Fabric',
    route: '/product/prod_1',
    targetElementId: 'trust-dashboard-section',
    badgeText: 'Trust Dashboard',
    description:
      'A clean row of cards at the start of the reviews section showing clear percentages for what matters most: Is it genuine? Does it match the photos? How is the fit and fabric?',
    actionPrompt: 'Tap on any card (e.g. "Matches Photos") to filter customer reviews below.',
    researchMetric: '48.7% Quality Doubt (#1 Blocker)',
    researchHeading: 'Answering the Biggest Question: "Is It Good?"',
    researchQuote:
      'The #1 reason people hesitate to buy clothes online is quality doubt (48.7% of shoppers, 4,617 mentions in user research). We summarize real buyer feedback into simple percentages so shoppers get honest answers in seconds.',
    dataSource: {
      label: 'AI Discovery Engine',
      url: 'https://myntra-ai-discovery-engine.vercel.app/'
    },
    keyPoints: [
      'Built on Real Orders: Uses feedback collected only from customers who actually bought and received the item.',
      'Simple Cards: Big icons, clear green percentages, and plain-English descriptions.',
      'Interactive Filter: Tapping any card instantly filters the reviews below to show related comments.',
      'New Item Support: Newly added clothes show helpful early feedback as reviews start coming in.'
    ]
  },
  {
    id: 'step_badge_filtering',
    stepNumber: 6,
    title: '6. Trust Badge Review Filters',
    subtitle: 'Filter Reviews by Topic in One Tap',
    route: '/product/prod_1',
    targetElementId: 'reviews-filter-section',
    badgeText: 'Review Filters',
    description:
      'Filter buttons let shoppers quickly sort reviews by specific topics like Genuine Quality, Fit, Fabric Feel, or Photo Accuracy. This lets buyers find relevant feedback without reading hundreds of reviews.',
    actionPrompt: 'Look at the Ratings & Reviews section, then tap [View All] to open verified reviews and test topic filters.',
    researchMetric: 'Topic-Specific Filtering',
    researchHeading: 'Fast Answers for Buyer Concerns',
    researchQuote:
      'Shoppers often only have one specific doubt — like whether the fit runs small or if the fabric is soft. Giving instant one-tap filters for trust badges saves time and gives confident answers.',
    keyPoints: [
      'Trust Filter Pills: 1 tap to see reviews specifically about Authenticity, Fit, Fabric, or Photo Accuracy.',
      'Verified Buyer Badges: Green badges on review cards show how each customer rated the product attributes.',
      'Combined Filters: Filter by both star ratings and specific quality badges at the same time.'
    ]
  },
  {
    id: 'step_review_submission',
    stepNumber: 7,
    title: '7. Quick Review After Delivery',
    subtitle: 'Simple Questions When Your Order Arrives',
    route: '/profile',
    targetElementId: 'orders-review-trigger',
    badgeText: 'Review Submission',
    description:
      'After an order is delivered, customers can leave feedback under Profile → Orders. Simple multiple-choice buttons make it fast and easy to rate the fit, fabric feel, and genuine quality.',
    actionPrompt: 'Look at the [⭐ Rate & Submit Badges] button on the delivered order, then tap it to test the review form.',
    researchMetric: '100% Real Buyer Data',
    researchHeading: 'Easy Feedback for Delivered Orders',
    researchQuote:
      'Only customers with delivered orders can submit these ratings. By keeping the questions simple with quick tap buttons, more buyers leave honest feedback without wasting time.',
    keyPoints: [
      'Delivered Orders Only: Reviews are locked until an order is delivered so fake reviews cannot exist.',
      'Simple Tap Buttons: Quick choices like "Fits Well" or "Feels Genuine" instead of long essay forms.',
      'Photo & Video Upload: Buyers can easily attach unedited photos and video clips.',
      'Concept Demo: Shows how this review flow seamlessly integrates into Myntra\'s delivered orders tab.'
    ]
  }
];
