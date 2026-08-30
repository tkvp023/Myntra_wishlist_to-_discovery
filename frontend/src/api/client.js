const rawBase = import.meta.env.VITE_API_URL ? String(import.meta.env.VITE_API_URL).trim().replace(/\/+$/, '') : '';
const API_BASE = rawBase
  ? (rawBase.endsWith('/api') ? rawBase : `${rawBase}/api`)
  : '/api';

/**
 * Universal JSON fetch wrapper
 */
async function fetchJson(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  try {
    const res = await fetch(url, config);
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      const error = new Error(errBody.error || `Request failed with status ${res.status}`);
      error.status = res.status;
      throw error;
    }
    return await res.json();
  } catch (err) {
    console.error(`[API Error] ${endpoint}:`, err);
    throw err;
  }
}

export const api = {
  // Products
  getProducts: (params = {}) => {
    // Accepts category string or options object { category, gender }
    const options = typeof params === 'string' ? { category: params } : params;
    const searchParams = new URLSearchParams();
    if (options.category && options.category !== 'all') {
      searchParams.append('category', options.category);
    }
    if (options.gender && options.gender !== 'all') {
      searchParams.append('gender', options.gender);
    }
    if (options.subcategory && options.subcategory !== 'all') {
      searchParams.append('subcategory', options.subcategory);
    }
    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return fetchJson(`/products${query}`);
  },

  getProduct: (id) => {
    return fetchJson(`/products/${id}`);
  },

  getBadgeAggregates: (productId) => {
    return fetchJson(`/products/${productId}/badge-aggregates`);
  },

  // Reviews
  getReviews: (productId, filters = {}) => {
    const params = new URLSearchParams();
    if (filters.badge) params.append('badge', filters.badge);
    if (filters.value) params.append('value', filters.value);
    if (filters.disagreeOnly) params.append('disagreeOnly', 'true');
    if (filters.rating) params.append('rating', filters.rating);
    if (filters.sort) params.append('sort', filters.sort);

    const queryString = params.toString() ? `?${params.toString()}` : '';
    return fetchJson(`/products/${productId}/reviews${queryString}`);
  },

  submitReview: (productId, reviewData) => {
    return fetchJson(`/products/${productId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(reviewData)
    });
  },

  // Wishlist
  getWishlist: () => {
    return fetchJson('/wishlist');
  },

  addToWishlist: (productId) => {
    return fetchJson(`/wishlist/${productId}`, {
      method: 'POST'
    });
  },

  removeFromWishlist: (productId) => {
    return fetchJson(`/wishlist/${productId}`, {
      method: 'DELETE'
    });
  }
};
