const http = require('http');

function request(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data), headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data, headers: res.headers });
        }
      });
    });

    req.on('error', (e) => reject(e));
    if (postData) {
      req.write(JSON.stringify(postData));
    }
    req.end();
  });
}

async function runTestSuite() {
  console.log('🚀 Running Comprehensive API Security & Functionality Test Suite...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, name, details = '') {
    if (condition) {
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${name} ${details}`);
      failed++;
    }
  }

  try {
    // 1. Health Checks
    const health = await request({ host: 'localhost', port: 3001, path: '/health', method: 'GET' });
    assert(health.status === 200 && health.data?.status === 'ok', 'GET /health returns 200 OK');

    const apiHealth = await request({ host: 'localhost', port: 3001, path: '/api/health', method: 'GET' });
    assert(apiHealth.status === 200 && apiHealth.data?.status === 'ok', 'GET /api/health returns 200 OK');

    // 2. Products List
    const allProducts = await request({ host: 'localhost', port: 3001, path: '/api/products', method: 'GET' });
    assert(allProducts.status === 200 && Array.isArray(allProducts.data) && allProducts.data.length > 0, 'GET /api/products returns product array', `(Found: ${allProducts.data?.length})`);

    // 3. Category & Gender Filters
    const menShirts = await request({ host: 'localhost', port: 3001, path: '/api/products?gender=men&category=clothing&subcategory=shirts', method: 'GET' });
    assert(menShirts.status === 200 && Array.isArray(menShirts.data), 'GET /api/products with multi-filter query');

    const beauty = await request({ host: 'localhost', port: 3001, path: '/api/products?category=beauty', method: 'GET' });
    assert(beauty.status === 200 && Array.isArray(beauty.data), 'GET /api/products?category=beauty');

    // 4. Product Details
    const prod1 = await request({ host: 'localhost', port: 3001, path: '/api/products/prod_1', method: 'GET' });
    assert(prod1.status === 200 && prod1.data?.id === 'prod_1', 'GET /api/products/prod_1 returns valid product object');
    assert(typeof prod1.data?.badgeAggregates === 'object', 'Product detail contains computed badgeAggregates');

    // 5. Non-existent Product (404 handling)
    const invalidProd = await request({ host: 'localhost', port: 3001, path: '/api/products/non_existent_id_9999', method: 'GET' });
    assert(invalidProd.status === 404, 'GET non-existent product returns 404 Not Found');

    // 6. Badge Aggregates Sub-route
    const badgeAgg = await request({ host: 'localhost', port: 3001, path: '/api/products/prod_1/badge-aggregates', method: 'GET' });
    assert(badgeAgg.status === 200, 'GET /api/products/prod_1/badge-aggregates returns 200');

    // 7. Reviews Filtering
    const allReviews = await request({ host: 'localhost', port: 3001, path: '/api/products/prod_1/reviews', method: 'GET' });
    assert(allReviews.status === 200 && Array.isArray(allReviews.data), 'GET /api/products/prod_1/reviews returns array');

    const photoMatchReviews = await request({ host: 'localhost', port: 3001, path: '/api/products/prod_1/reviews?badge=photoMatch&value=matches', method: 'GET' });
    assert(photoMatchReviews.status === 200 && Array.isArray(photoMatchReviews.data), 'Filter reviews by badge=photoMatch');

    const disagreeReviews = await request({ host: 'localhost', port: 3001, path: '/api/products/prod_1/reviews?badge=authenticity&disagreeOnly=true', method: 'GET' });
    assert(disagreeReviews.status === 200 && Array.isArray(disagreeReviews.data), 'Filter reviews with disagreeOnly=true');

    // 8. Review Submission Boundary & Security Tests
    const invalidRatingTest = await request(
      { host: 'localhost', port: 3001, path: '/api/products/prod_1/reviews', method: 'POST', headers: { 'Content-Type': 'application/json' } },
      { rating: 0, userName: 'Hacker' }
    );
    assert(invalidRatingTest.status === 400, 'Reject review with rating < 1 (status 400)');

    const invalidRatingTestHigh = await request(
      { host: 'localhost', port: 3001, path: '/api/products/prod_1/reviews', method: 'POST', headers: { 'Content-Type': 'application/json' } },
      { rating: 10, userName: 'Hacker' }
    );
    assert(invalidRatingTestHigh.status === 400, 'Reject review with rating > 5 (status 400)');

    const validReview = await request(
      { host: 'localhost', port: 3001, path: '/api/products/prod_1/reviews', method: 'POST', headers: { 'Content-Type': 'application/json' } },
      {
        userName: 'Test Verified Reviewer',
        rating: 5,
        text: 'Automated test suite review verifying trust badges',
        sizeBought: 'M',
        badgeAuthenticity: 'feelsGenuine',
        badgeFit: 'fitsAsExpected',
        badgePhotoMatch: 'matches',
        badgeFabricFeel: 'asDescribed'
      }
    );
    assert(validReview.status === 201 && validReview.data?.id, 'POST /api/products/prod_1/reviews creates verified review');

    // 9. Wishlist API & Re-engagement Logic
    const wishlistBefore = await request({ host: 'localhost', port: 3001, path: '/api/wishlist', method: 'GET' });
    assert(wishlistBefore.status === 200 && Array.isArray(wishlistBefore.data), 'GET /api/wishlist returns array');

    const addWishlist = await request({ host: 'localhost', port: 3001, path: '/api/wishlist/prod_7', method: 'POST' });
    assert(addWishlist.status === 201 || addWishlist.status === 200, 'POST /api/wishlist/prod_7 adds item');

    const deleteWishlist = await request({ host: 'localhost', port: 3001, path: '/api/wishlist/prod_7', method: 'DELETE' });
    assert(deleteWishlist.status === 200 && deleteWishlist.data?.success === true, 'DELETE /api/wishlist/prod_7 removes item');

    console.log(`\n========================================`);
    console.log(`🏁 TEST RESULTS: ${passed} Passed, ${failed} Failed`);
    console.log(`========================================\n`);

    if (failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error('Fatal test error:', err);
    process.exit(1);
  }
}

runTestSuite();
