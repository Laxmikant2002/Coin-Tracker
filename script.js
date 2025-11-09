// API Configuration
const API_URL = 'https://api.coingecko.com/api/v3/coins/markets';
const API_PARAMS = {
    vs_currency: 'usd',
    order: 'market_cap_desc',
    per_page: 10,
    page: 1,
    sparkline: false,
    price_change_percentage: '24h'
};

// Global variables
let cryptoData = [];
let displayedData = [];

// Build API URL with parameters
function buildApiUrl() {
    const params = new URLSearchParams(API_PARAMS);
    return `${API_URL}?${params.toString()}`;
}

// Part 1 & 5: Fetch data using .then() method
function fetchDataWithThen() {
    const apiUrl = buildApiUrl();
    
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Data fetched successfully with .then():', data);
            cryptoData = data;
            displayedData = [...cryptoData];
            renderCryptoList(displayedData);
        })
        .catch(error => {
            console.error('Error fetching data with .then():', error);
            alert('Failed to fetch cryptocurrency data. Please try again later.');
        });
}

// Part 1 & 5: Fetch data using async/await method
async function fetchDataWithAsync() {
    const apiUrl = buildApiUrl();
    
    try {
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Data fetched successfully with async/await:', data);
        
        cryptoData = data;
        displayedData = [...cryptoData];
        renderCryptoList(displayedData);
    } catch (error) {
        console.error('Error fetching data with async/await:', error);
        alert('Failed to fetch cryptocurrency data. Please try again later.');
    }
}

// Use async/await as the primary method
fetchDataWithAsync();

// Format numbers
function formatNumber(num) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(num);
}

function formatLargeNumber(num) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        notation: 'compact',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(num);
}

// Render crypto list
function renderCryptoList(data) {
    const cryptoList = document.getElementById('cryptoList');
    cryptoList.innerHTML = '';

    data.forEach(crypto => {
        const cryptoItem = document.createElement('div');
        cryptoItem.className = 'crypto-item';

        const changeClass = crypto.price_change_percentage_24h >= 0 ? 'positive' : 'negative';
        const changeSign = crypto.price_change_percentage_24h >= 0 ? '' : '';

        cryptoItem.innerHTML = `
            <img src="${crypto.image}" alt="${crypto.name}" class="crypto-icon">
            <div>
                <div class="crypto-name">${crypto.name}</div>
            </div>
            <div class="crypto-symbol">${crypto.symbol.toUpperCase()}</div>
            <div class="crypto-price">${formatNumber(crypto.current_price)}</div>
            <div class="crypto-volume">${formatLargeNumber(crypto.total_volume)}</div>
            <div class="crypto-change ${changeClass}">${changeSign}${Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%</div>
            <div class="crypto-mkt-cap">Mkt Cap : ${formatLargeNumber(crypto.market_cap)}</div>
        `;

        cryptoList.appendChild(cryptoItem);
    });
}

// Search functionality
document.getElementById('searchInput').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    displayedData = cryptoData.filter(crypto => 
        crypto.name.toLowerCase().includes(searchTerm) || 
        crypto.symbol.toLowerCase().includes(searchTerm)
    );
    renderCryptoList(displayedData);
});

// Sort by market cap
document.getElementById('sortByMktCap').addEventListener('click', () => {
    displayedData.sort((a, b) => b.market_cap - a.market_cap);
    renderCryptoList(displayedData);
});

// Sort by percentage change
document.getElementById('sortByPercentage').addEventListener('click', () => {
    displayedData.sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
    renderCryptoList(displayedData);
});

// Initial render
renderCryptoList(displayedData);