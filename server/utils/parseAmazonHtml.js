const { JSDOM } = require('jsdom');

function extractProductTitle(productElement) {
  const titleSelectors = ['h2 a span', '.a-text-normal', 'h2'];
  for (const selector of titleSelectors) {
    const element = productElement.querySelector(selector);
    if (element && element.textContent.trim()) {
      return element.textContent.trim();
    }
  }
  return 'Title not found';
}

function extractProductRating(productElement) {
  const ratingSelectors = [
    '.a-icon-alt',
    '[aria-label*="estrelas"]',
    '[aria-label*="stars"]',
    '.a-icon-alt[aria-label*="de 5"]'
  ];

  for (const selector of ratingSelectors) {
    const element = productElement.querySelector(selector);
    if (element) {
      const ratingText = element.textContent || element.getAttribute('aria-label') || '';

      // Handle Brazilian Portuguese format: "4,8 de 5 estrelas"
      const ptBrMatch = ratingText.match(/(\d+[,\d]*)\s*de\s*5\s*estrelas?/i);
      if (ptBrMatch) {
        return `${ptBrMatch[1]} out of 5 stars`;
      }

      // Handle English format: "4.8 out of 5 stars"
      const enMatch = ratingText.match(/(\d+[.\d]*)\s*out\s*of\s*5\s*stars?/i);
      if (enMatch) {
        return `${enMatch[1]} out of 5 stars`;
      }

      const numberMatch = ratingText.match(/(\d+[,\d]*)/);
      if (numberMatch) {
        return `${numberMatch[1]} out of 5 stars`;
      }
    }
  }
  return 'Rating not found';
}

function extractProductReviews(productElement) {
  const reviewSelectors = [
    'a[href*="reviews"]',
    '.a-size-base',
    '[data-testid*="review"]',
    'span[class*="review"]'
  ];

  for (const selector of reviewSelectors) {
    const element = productElement.querySelector(selector);
    if (element) {
      const reviewsText = element.textContent.trim();

      // Handle Brazilian Portuguese format: "1.572 classificações globais"
      const ptBrMatch = reviewsText.match(/(\d+[.,\d]*)\s*classificações?/i);
      if (ptBrMatch) {
        return ptBrMatch[1];
      }

      // Handle English format: "1,572 reviews"
      const enMatch = reviewsText.match(/(\d+[.,\d]*)\s*reviews?/i);
      if (enMatch) {
        return enMatch[1];
      }

      const numberMatch = reviewsText.match(/(\d+[.,\d]*)/);
      if (numberMatch) {
        return numberMatch[1];
      }
    }
  }
  return 'Reviews not found';
}

function extractProductImageUrl(productElement) {
  const imageSelectors = [
    'img[src*="images"]',
    '.s-image',
    'img[data-src*="images"]',
    'img[src*="amazon"]'
  ];

  for (const selector of imageSelectors) {
    const element = productElement.querySelector(selector);
    if (element) {
      const imageUrl = element.getAttribute('src') || element.getAttribute('data-src');
      if (imageUrl && !imageUrl.includes('data:image')) {
        return imageUrl;
      }
    }
  }

  return 'Image not found';
}

function parseAmazonHtml(htmlContent) {
  const dom = new JSDOM(htmlContent);
  const document = dom.window.document;
  const products = [];
  const productSelectors = [
    '[data-component-type="s-search-result"]',
    '.s-result-item',
    '[data-asin]',
    '.s-card-container'
  ];

  let productElements = [];
  for (const selector of productSelectors) {
    productElements = document.querySelectorAll(selector);
    if (productElements.length > 0) {
      console.log(`[PARSER] Found ${productElements.length} products using selector: ${selector}`);
      break;
    }
  }

  if (productElements.length === 0) {
    console.log('[PARSER] No product elements found with any selector');
    return products;
  }

  productElements.forEach((productElement, index) => {
    try {
      const product = {
        id: index + 1,
        title: extractProductTitle(productElement),
        rating: extractProductRating(productElement),
        reviews: extractProductReviews(productElement),
        imageUrl: extractProductImageUrl(productElement)
      };

      // Only add products that have at least a title
      if (product.title !== 'Title not found') {
        products.push(product);
        console.log(`[PARSER] Extracted product ${index + 1}: ${product.title.substring(0, 50)}...`);
      }
    } catch (productError) {
      console.log(`[PARSER] Error extracting product ${index + 1}:`, productError.message);
    }
  });

  console.log(`[PARSER] Successfully parsed ${products.length} products`);
  return products;
}

module.exports = parseAmazonHtml;