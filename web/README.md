# Amazon Scraper Frontend

A modern, responsive web interface for the Amazon Product Scraper. Built with HTML5, CSS3, and Vanilla JavaScript using Vite for development.

## 📁 Project Structure

```
web/
├── index.html          # Main HTML page
├── src/
│   ├── script.js       # Frontend JavaScript logic
│   └── style.css       # Styling and responsive design
├── package.json        
└── README.md           
```

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation
```bash
cd web
npm install
```

### Development
```bash
npm run dev
```
The frontend will start on `http://localhost:5173`

### Production Build
```bash
npm run build
npm run preview
```

## 🎯 Usage

1. **Start the backend server** (see server/README.md)
2. **Start the frontend**:
   ```bash
   cd web
   npm run dev
   ```
3. **Open your browser** to `http://localhost:5173`
4. **Enter a keyword** in the search field
5. **Click "Search Products"** or press Enter
6. **View results** in beautiful product cards

## 🔧 Development

### File Structure
- `index.html`: Main HTML structure
- `src/script.js`: JavaScript logic and API calls
- `src/style.css`: Styling and responsive design

### Key Functions
- `handleSearch()`: Main search function
- `displayResults()`: Renders product cards
- `showLoading()`: Shows loading state
- `showError()`: Displays error messages

### Customization
- **Styling**: Modify `src/style.css` for design changes
- **API URL**: Update `API_BASE_URL` in `src/script.js`
- **Product Display**: Customize the `displayResults()` function

## 🛠️ Technical Features

- **Vanilla JavaScript**: No frameworks, pure JS
- **Vite Development**: Fast hot reload development server
- **AJAX Integration**: Fetch API for backend communication
- **CORS Handling**: Proper cross-origin request setup
- **Error Recovery**: Graceful handling of network issues

## 📡 API Integration

### Backend Communication
The frontend communicates with the backend API at `http://localhost:3000/api/scrape`.

### Request Format
```javascript
GET /api/scrape?keyword=yourSearchTerm
```

### Response Handling
```javascript
{
  "success": true,
  "keyword": "laptop",
  "products": [
    {
      "id": 1,
      "title": "Product Name",
      "rating": "4.3 out of 5 stars",
      "reviews": "1,234",
      "imageUrl": "https://..."
    }
  ],
  "total": 60,
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```