// Realistic image generator and fallback utility for products
export function getProductImageUrl(imgSrc, fallbackCategory = 'clothing', index = 1) {
  if (imgSrc && imgSrc.startsWith('http')) {
    return imgSrc;
  }

  // Curated high-resolution fashion e-commerce photography matching Myntra categories
  const categoryImages = {
    saree: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&auto=format&fit=crop&q=80'
    ],
    lehenga: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80'
    ],
    kurti: [
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80'
    ],
    tshirt_men: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&auto=format&fit=crop&q=80'
    ],
    trouser_men: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584865288642-42078afe6942?w=600&auto=format&fit=crop&q=80'
    ],
    clothing_men_shirt: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1620012253295-c15c429f66bf?w=600&auto=format&fit=crop&q=80'
    ],
    footwear_sports: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=80'
    ],
    footwear_heels: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1596703263906-8962fa9166f2?w=600&auto=format&fit=crop&q=80'
    ],
    bags_tote: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=80'
    ],
    jewelry_necklace: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1611591475152-478311394f47?w=600&auto=format&fit=crop&q=80'
    ],
    makeup_lipstick: [
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1599733589046-10c005739ef9?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?w=600&auto=format&fit=crop&q=80'
    ],
    skincare_serum: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1608248597359-0a693c042971?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&auto=format&fit=crop&q=80'
    ],
    fragrance_perfume: [
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=600&auto=format&fit=crop&q=80'
    ],
    appliances_styling: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1585751119414-ef2636f8aede?w=600&auto=format&fit=crop&q=80'
    ]
  };

  // Map product IDs / categories to rich photos
  const fallbackKey = imgSrc?.includes('saree') ? 'saree'
    : imgSrc?.includes('lehenga') ? 'lehenga'
    : imgSrc?.includes('kurta') || imgSrc?.includes('kurti') ? 'kurti'
    : imgSrc?.includes('tshirt') || imgSrc?.includes('polo') ? 'tshirt_men'
    : imgSrc?.includes('trouser') || imgSrc?.includes('cargo') || imgSrc?.includes('chino') ? 'trouser_men'
    : imgSrc?.includes('shirt') ? 'clothing_men_shirt'
    : imgSrc?.includes('shoes') || imgSrc?.includes('sneaker') ? 'footwear_sports'
    : imgSrc?.includes('heels') || imgSrc?.includes('juttis') ? 'footwear_heels'
    : imgSrc?.includes('lavie') || imgSrc?.includes('bag') ? 'bags_tote'
    : imgSrc?.includes('jewelry') ? 'jewelry_necklace'
    : imgSrc?.includes('makeup') || imgSrc?.includes('lipstick') ? 'makeup_lipstick'
    : imgSrc?.includes('skincare') || imgSrc?.includes('serum') ? 'skincare_serum'
    : imgSrc?.includes('fragrance') || imgSrc?.includes('perfume') ? 'fragrance_perfume'
    : imgSrc?.includes('philips') || fallbackCategory === 'appliances' ? 'appliances_styling'
    : 'clothing_men_shirt';

  const list = categoryImages[fallbackKey] || categoryImages.clothing_men_shirt;
  return list[(index - 1) % list.length] || list[0];
}
