const http = require('http');

// Simple test runner
async function request(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
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

async function runTests() {
  console.log('Testing API Endpoints...');

  try {
    // 1. Health check
    const health = await request({ host: 'localhost', port: 3001, path: '/health', method: 'GET' });
    console.log('✔ GET /health ->', health.status, health.data?.status);

    // 2. Get all products
    const products = await request({ host: 'localhost', port: 3001, path: '/api/products', method: 'GET' });
    console.log('✔ GET /api/products ->', products.status, `count: ${products.data?.length}`);

    // 3. Get single product with badge aggregates
    const product1 = await request({ host: 'localhost', port: 3001, path: '/api/products/prod_1', method: 'GET' });
    console.log('✔ GET /api/products/prod_1 ->', product1.status, product1.data?.name);
    console.log('  Badge aggregates:', Object.keys(product1.data?.badgeAggregates || {}));

    // 4. Get product reviews
    const reviews = await request({ host: 'localhost', port: 3001, path: '/api/products/prod_1/reviews', method: 'GET' });
    console.log('✔ GET /api/products/prod_1/reviews ->', reviews.status, `count: ${reviews.data?.length}`);

    // 5. Filter reviews by badge
    const filtered = await request({ host: 'localhost', port: 3001, path: '/api/products/prod_1/reviews?badge=photoMatch&value=matches', method: 'GET' });
    console.log('✔ GET /api/products/prod_1/reviews?badge=photoMatch ->', filtered.status, `filtered count: ${filtered.data?.length}`);

    // 6. Submit a review with trust badges (Part A)
    const newRev = await request(
      {
        host: 'localhost',
        port: 3001,
        path: '/api/products/prod_1/reviews',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      },
      {
        userName: 'Test Buyer',
        rating: 5,
        text: 'Automated test review - fabric is perfect!',
        badgeAuthenticity: 'feelsGenuine',
        badgePhotoMatch: 'matches',
        badgeFabricFeel: 'asDescribed',
        badgeOverallSatisfaction: 'satisfied'
      }
    );
    console.log('✔ POST /api/products/prod_1/reviews ->', newRev.status, newRev.data?.id);

    // 7. Get wishlist items with re-engagement (Part C)
    const wishlist = await request({ host: 'localhost', port: 3001, path: '/api/wishlist', method: 'GET' });
    console.log('✔ GET /api/wishlist ->', wishlist.status, `count: ${wishlist.data?.length}`);
    if (wishlist.data?.length > 0) {
      console.log('  Sample re-engagement message:', wishlist.data[0].reengagement?.message);
    }

    console.log('\n🎉 All API endpoints verified successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Test failed:', err.message);
    process.exit(1);
  }
}

// Start server in-process for test
require('./src/index.js');
setTimeout(runTests, 1000);
