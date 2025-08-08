const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const resultsContainer = document.getElementById('resultsContainer');

const API_BASE_URL = 'http://localhost:3000/api';
searchBtn.addEventListener('click', handleSearch);

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

async function handleSearch() {
    const keyword = searchInput.value.trim();
    
    if (!keyword) {
        showError('Please enter a keyword to search');
        return;
    }
    
    showLoading();
    
    try {
        const response = await fetch(`${API_BASE_URL}/scrape?keyword=${encodeURIComponent(keyword)}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const responseData = await response.json();
        console.log('Response data:', responseData);
        
        if (!responseData.success) {
            throw new Error(responseData.message || 'Failed to scrape products');
        }
        
        const data = responseData.products;
        console.log('Products data:', data);
        
        displayResults(data);
        
    } catch (error) {
        console.error('Search error:', error);
        showError(`Failed to search: ${error.message}`);
    }
}

function showLoading() {
    resultsContainer.innerHTML = `
        <div class="loading-message">
            <div class="spinner"></div>
            <p>Searching Amazon for products...</p>
        </div>
    `;
}

function showError(message) {
    resultsContainer.innerHTML = `
        <div class="error-message">
            <p>${message}</p>
        </div>
    `;
}


function displayResults(data) {
    if (!data || !Array.isArray(data) || data.length === 0) {
        resultsContainer.innerHTML = `
            <div class="no-results">
                <h3>No products found</h3>
                <p>Try a different keyword or check your internet connection.</p>
            </div>
        `;
        return;
    }
    
    const resultsCount = `
        <div class="results-count">
            Found ${data.length} product${data.length !== 1 ? 's' : ''}
        </div>
    `;
    
    const productsHTML = data.map(product => `
        <div class="product-card">
            <div class="product-image">
                ${product.imageUrl && product.imageUrl !== 'Image not found' 
                    ? `<img src="${product.imageUrl}" alt="${product.title}" onerror="this.style.display='none'">`
                    : '<span>No Image</span>'
                }
            </div>
            <div class="product-info">
                <h3>${product.title}</h3>
                <div class="product-details">
                    <span>⭐ ${product.rating}</span>
                    <span>📝 ${product.reviews} reviews</span>
                </div>
            </div>
        </div>
    `).join('');
    
    resultsContainer.innerHTML = resultsCount + productsHTML;
}

function init() {
    resultsContainer.innerHTML = `
        <div class="welcome-message">
            <h3>Welcome to Amazon Product Scraper</h3>
            <p>Enter a keyword above to start searching for products on Amazon.</p>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', init);
