const express = require('express');
const router = express.Router();
const amazonScraper = require('../services/amazonScraper');

// GET /api/scrape?keyword=yourKeyword
router.get('/scrape', async (req, res) => {
  const { keyword } = req.query;
  
  // Input validation
  if (!keyword) {
    return res.status(400).json({ 
      error: 'Missing keyword query parameter',
      message: 'Please provide a keyword to search for products',
      example: '/api/scrape?keyword=laptop'
    });
  }

  if (typeof keyword !== 'string' || keyword.trim().length === 0) {
    return res.status(400).json({ 
      error: 'Invalid keyword',
      message: 'Keyword must be a non-empty string'
    });
  }

  if (keyword.length > 100) {
    return res.status(400).json({ 
      error: 'Keyword too long',
      message: 'Keyword must be 100 characters or less'
    });
  }

  try {
    console.log(`[API] Scraping request received for keyword: "${keyword}"`);
    
    const products = await amazonScraper.scrapeAmazonProducts(keyword.trim());
    
    console.log(`[API] Successfully scraped ${products.length} products for keyword: "${keyword}"`);
    
    res.json({ 
      success: true,
      keyword: keyword.trim(),
      products,
      total: products.length,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error(`[API] Error scraping products for keyword "${keyword}":`, error.message);
    
    res.status(500).json({ 
      success: false,
      error: 'Failed to scrape Amazon products',
      message: error.message,
      keyword: keyword.trim(),
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;