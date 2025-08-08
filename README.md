# Amazon Product Scraper

A full-stack web application that scrapes Amazon product listings from the first page of search results for a given keyword. Built with Bun (backend) and Vanilla JavaScript with Vite (frontend).

## 📁 Project Structure

```
carvalho_test_project/
├── server/                 # Backend API (Bun + Express)
│   ├── index.js           # Express server entry point
│   ├── routes/
│   │   └── scrapeRoute.js # API route for /api/scrape
│   ├── services/
│   │   └── amazonScraper.js # Scraper logic with fallback
│   ├── utils/
│   │   └── parseAmazonHtml.js # HTML parsing utilities
│   ├── package.json       # Backend dependencies
│   └── README.md          # Backend documentation
├── web/                   # Frontend (HTML + CSS + JS + Vite)
│   ├── index.html         # Main HTML page
│   ├── src/
│   │   ├── script.js      # Frontend JavaScript
│   │   └── style.css      # Styling
│   └── package.json       # Frontend dependencies
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites
- [Bun](https://bun.sh/) installed on your system
- [Node.js](https://nodejs.org/) (for Vite development)

### 1. Clone and Setup
```bash
git clone <repository-url>
cd carvalho_test_project
```

### 2. Backend Setup
```bash
cd server
bun install
bun run dev
```
The backend will start on `http://localhost:3000`

### 3. Frontend Setup
```bash
cd ../web
npm install
npm run dev
```
The frontend will start on `http://localhost:5173`

### 4. Usage
1. Open your browser to `http://localhost:5173`
2. Enter a keyword in the search field
3. Click "Search Products" or press Enter
4. View the scraped Amazon products


## 🛠️ Technology Stack

### Backend
- **Bun**: Fast JavaScript runtime
- **Express**: Web framework
- **Axios**: HTTP client for fetching Amazon pages
- **JSDOM**: HTML parsing and DOM manipulation
- **Puppeteer**: Fallback scraping method

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with gradients and animations
- **Vanilla JavaScript**: No frameworks, pure JS
- **Vite**: Development server and build tool

## 📝 Features

### Backend Features
- ✅ Robust scraping with fallback mechanisms
- ✅ Error handling and logging
- ✅ CORS support for frontend integration
- ✅ Input validation and sanitization
- ✅ Detailed console logging for debugging

### Frontend Features
- ✅ Modern, responsive UI design
- ✅ Real-time search with loading states
- ✅ Error handling and user feedback
- ✅ Product cards with images, ratings, and reviews
- ✅ Mobile-friendly responsive design


## 🔧 Development

### Backend Development
```bash
cd server
bun run dev  # Auto-restart on changes
```

### Frontend Development
```bash
cd web
npm run dev  # Hot reload development server
```

### Production Build
```bash
# Backend
cd server
bun run start

# Frontend
cd web
npm run build
npm run preview
```