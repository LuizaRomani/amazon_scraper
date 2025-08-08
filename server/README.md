# Amazon Product Scraper API

A robust Amazon product scraper API built with Bun, Express, and JSDOM. Features fallback mechanisms using Puppeteer when axios requests are blocked.


## 📁 Project Structure

```
server/
├── index.js                  # Express server entry point
├── routes/
│   └── scrapeRoute.js        # API route for /api/scrape
├── services/
│   └── amazonScraper.js      # Scraper logic with fallback
├── utils/
│   └── parseAmazonHtml.js    # HTML parsing utilities
├── package.json              
└── README.md                 
```

## 🛠️ Installation

1. **Navigate to the server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   bun install
   ```

## 🚀 Usage

### Development Mode (with auto-restart)
```bash
bun run dev
```

### Production Mode
```bash
bun run start
```

### Manual Start
```bash
bun index.js
```

## 📡 API Endpoints

### GET /api/scrape
Scrapes Amazon products for a given keyword.

**Parameters:**
- `keyword` (required): Search term for Amazon products

**Example:**
```bash
curl "http://localhost:3000/api/scrape?keyword=shampoo"
```

**Response:**
```json
{
  "products": [
    {
      "id": 1,
      "title": "Product Name",
      "rating": "4.3 out of 5 stars",
      "reviews": "1,234",
      "imageUrl": "https://..."
    }
  ]
}
```

## 📝 Logging

The API provides detailed logging with prefixes:
- `[SCRAPER]`: Main scraper operations
- `[AXIOS]`: Axios fetch attempts
- `[PUPPETEER]`: Puppeteer fallback operations
- `[FALLBACK]`: Fallback decision logs
