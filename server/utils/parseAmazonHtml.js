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
  const ratingSelectors = ['.a-icon-alt', '[aria-label*="stars"]'];
  for (const selector of ratingSelectors) {
    const element = productElement.querySelector(selector);
    if (element) {
      const ratingText = element.textContent || element.getAttribute('aria-label');
      const ratingMatch = ratingText.match(/(\d+(?:\.\d+)?)/);
      if (ratingMatch) {
        return `${ratingMatch[1]} out of 5 stars`;
      }
    }
  }
  return 'Rating not found';
}

function extractProductReviews(productElement) {
  const reviewSelectors = ['a[href*="reviews"]', '.a-size-base'];
  for (const selector of reviewSelectors) {
    const element = productElement.querySelector(selector);
    if (element) {
      const reviewsText = element.textContent.trim();
      const reviewsMatch = reviewsText.match(/(\d+(?:,\d+)*)/);
      if (reviewsMatch) {
        return reviewsMatch[1];
      }
    }
  }
  return 'Reviews not found';
}

function extractProductImageUrl(productElement) {
  const imageSelectors = ['img[src*="images"]', '.s-image'];
  for (const selector of imageSelectors) {
    const element = productElement.querySelector(selector);
    if (element) {
      const imageUrl = element.getAttribute('src') || element.getAttribute('data-src');
      if (imageUrl) {
        return imageUrl;
      }
    }
  }
  return 'Image not found';
}

function parseAmazonHtml(htmlContent) {
  // Log the first 500 characters of the HTML for debugging
  console.log('\n[DEBUG] HTML snippet before parsing (first 500 chars):');
  console.log(htmlContent.substring(0, 500));

  const dom = new JSDOM(htmlContent);
  const document = dom.window.document;
  const products = [];
  const productSelectors = [
    '[data-component-type="s-search-result"]',
    '.s-result-item',
    '[data-asin]'
  ];
  let productElements = [];
  for (const selector of productSelectors) {
    productElements = document.querySelectorAll(selector);
    if (productElements.length > 0) {
      break;
    }
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
      products.push(product);
    } catch (productError) {
      // Skip product on error
    }
  });
  return products;
}

module.exports = parseAmazonHtml;