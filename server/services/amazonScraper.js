const axios = require('axios');
const parseAmazonHtml = require('../utils/parseAmazonHtml');

const AMAZON_BASE_URL = 'https://www.amazon.com.br/s';
const AMAZON_HEADERS = {
  'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
  'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
  'device-memory': '8',
  'downlink': '10',
  'dpr': '1',
  'ect': '4g',
  'priority': 'u=0, i',
  'referer': 'https://www.amazon.com.br/',
  'rtt': '50',
  'upgrade-insecure-requests': '1',
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
  'viewport-width': '1400'
};

function buildAmazonSearchUrl(keyword) {
  const params = new URLSearchParams({
    'k': keyword,
    'ref': 'nb_sb_noss_2'
  });
  return `${AMAZON_BASE_URL}?${params.toString()}`;
}

/**
 * Fetches HTML content using axios (primary method)
 * @param {string} url - The URL to fetch
 * @returns {Promise<string>} - The HTML content
 */

async function fetchWithAxios(url) {
  console.log(`[AXIOS] Attempting to fetch with axios...`);
  const response = await axios.get(url, { 
    headers: AMAZON_HEADERS,
    timeout: 30000
  });
  
  if (response.status !== 200) {
    throw new Error(`Axios failed with status: ${response.status}`);
  }
  
  console.log(`[AXIOS] Successfully fetched with axios`);
  return response.data;
}

/**
 * Fetches HTML content using puppeteer (fallback method)
 * @param {string} url - The URL to fetch
 * @returns {Promise<string>} - The HTML content
 */

async function fetchWithPuppeteer(url) {
  console.log(`[PUPPETEER] Attempting to fetch with puppeteer...`);
  
  let browser;
  try {
    // Dynamically import puppeteer to avoid requiring it if not needed
    const puppeteer = require('puppeteer');
    
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    });
    
    const page = await browser.newPage();
    
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1400, height: 800 });
    await page.setExtraHTTPHeaders({
      'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
      'referer': 'https://www.amazon.com.br/'
    });
    
    console.log(`[PUPPETEER] Navigating to: ${url}`);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Wait for dynamic content to load
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const html = await page.content();
    console.log(`[PUPPETEER] Successfully fetched with puppeteer`);
    
    return html;
    
  } catch (error) {
    console.error(`[PUPPETEER] Error:`, error.message);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

/**
 * Fetches HTML content with fallback mechanism
 * @param {string} url - The URL to fetch
 * @returns {Promise<string>} - The HTML content
 */

async function fetchHtmlWithFallback(url) {
  try {
    return await fetchWithAxios(url);
  } catch (axiosError) {
    console.log(`[FALLBACK] Axios failed: ${axiosError.message}`);
    console.log(`[FALLBACK] Trying puppeteer as fallback...`);
    
    try {
      return await fetchWithPuppeteer(url);
    } catch (puppeteerError) {
      console.error(`[FALLBACK] Both methods failed:`);
      console.error(`  - Axios error: ${axiosError.message}`);
      console.error(`  - Puppeteer error: ${puppeteerError.message}`);
      throw new Error('All fetch methods failed');
    }
  }
}

async function scrapeAmazonProducts(keyword) {
  try {
    console.log(`[SCRAPER] Starting scrape for keyword: "${keyword}"`);
    
    const url = buildAmazonSearchUrl(keyword);
    console.log(`[SCRAPER] Built URL: ${url}`);
    
    console.log(`[SCRAPER] Making request to Amazon...`);
    const htmlContent = await fetchHtmlWithFallback(url);
    
    console.log(`[SCRAPER] Successfully fetched page, now parsing HTML...`);
    const products = parseAmazonHtml(htmlContent);
    console.log(`[SCRAPER] Parsed ${products.length} products`);
    
    return products;
    
  } catch (error) {
    console.error(`[SCRAPER] Error in scrapeAmazonProducts:`, error.message);
    throw error;
  }
}

module.exports = { scrapeAmazonProducts };