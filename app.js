import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set, get, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyD5XFfR00-OsVOYtmZmZtHegKxDZEW4s",
    authDomain: "sportex-otc.firebaseapp.com",
    databaseURL: "https://sportex-otc-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "sportex-otc",
    storageBucket: "sportex-otc.appspot.com",
    messagingSenderId: "938427841690",
    appId: "1:938427841690:web:8cb1d9bd74107ad588f323"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const categoriesData = {
    football: [
        { name: "Real Madrid", base: 185.50 },
        { name: "Manchester City", base: 178.20 },
        { name: "Arsenal", base: 142.00 },
        { name: "Barcelona", base: 165.80 },
        { name: "Bayern Munich", base: 155.00 },
        { name: "Liverpool", base: 150.30 },
        { name: "Paris Saint-Germain", base: 145.00 },
        { name: "Inter Milan", base: 125.00 },
        { name: "Juventus", base: 115.00 },
        { name: "AC Milan", base: 110.00 }
    ],
    basketball: [
        { name: "Boston Celtics", base: 195.00 },
        { name: "Denver Nuggets", base: 185.00 },
        { name: "Los Angeles Lakers", base: 190.00 },
        { name: "Golden State Warriors", base: 180.00 },
        { name: "Dallas Mavericks", base: 165.00 },
        { name: "Milwaukee Bucks", base: 170.00 },
        { name: "New York Knicks", base: 160.00 }
    ],
    nfl: [
        { name: "Kansas City Chiefs", base: 210.00 },
        { name: "San Francisco 49ers", base: 195.00 },
        { name: "Philadelphia Eagles", base: 185.00 },
        { name: "Baltimore Ravens", base: 180.00 },
        { name: "Dallas Cowboys", base: 180.00 }
    ],
    nhl: [
        { name: "Florida Panthers", base: 180.00 },
        { name: "Edmonton Oilers", base: 175.00 },
        { name: "Colorado Avalanche", base: 170.00 },
        { name: "New York Rangers", base: 165.00 }
    ],
    formula1: [
        { name: "Red Bull Racing", base: 230.00 },
        { name: "Ferrari F1 Team", base: 220.00 },
        { name: "Mercedes AMG F1", base: 210.00 },
        { name: "McLaren F1", base: 195.00 },
        { name: "Max Verstappen", base: 240.00 }
    ],
    players: [
        { name: "Kylian Mbappe", base: 220.00 },
        { name: "Erling Haaland", base: 215.00 },
        { name: "Jude Bellingham", base: 205.00 },
        { name: "Nikola Jokic", base: 210.00 },
        { name: "Luka Doncic", base: 205.00 }
    ]
};

let currentCategory = 'football';
let marketData = {};

window.showCategory = function(category, btnElement) {
    currentCategory = category;
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    if (btnElement) {
        btnElement.classList.add('active');
    }
    renderMarket();
};

async function initMarket() {
    const dbRef = ref(db, 'market');
    const snapshot = await get(dbRef);
    
    if (!snapshot.exists()) {
        let initialData = {};
        for (const [cat, items] of Object.entries(categoriesData)) {
            initialData[cat] = items.map(item => ({
                name: item.name,
                price: item.base,
                prevPrice: item.base
            }));
        }
        await set(dbRef, initialData);
    }

    onValue(dbRef, (snap) => {
        if (snap.exists()) {
            marketData = snap.val();
            renderMarket();
        }
    });

    // Автоматска симулација на флуктуација на цените на секои 5 секунди
    setInterval(() => {
        get(dbRef).then((snap) => {
            if (!snap.exists()) return;
            let data = snap.val();
            for (const cat in data) {
                data[cat].forEach(item => {
                    item.prevPrice = item.price;
                    let change = (Math.random() * 4 - 1.95) / 100;
                    item.price = Math.max(1.00, item.price * (1 + change));
                    item.price = parseFloat(item.price.toFixed(2));
                });
            }
            set(dbRef, data);
        });
    }, 5000);
}

function renderMarket() {
    const container = document.getElementById('stocks');
    if (!container) return;
    
    container.innerHTML = '';
    const items = marketData[currentCategory] || [];

    if (items.length === 0) {
        container.innerHTML = '<div style="color: #848e9c; padding: 20px; text-align: center;">Loading liquidity pools...</div>';
        return;
    }

    items.forEach(item => {
        const isUp = item.price >= (item.prevPrice || item.price);
        const colorClass = isUp ? 'color: #0ecb81;' : 'color: #f6465d;';
        const sign = isUp ? '+' : '';
        const diff = (item.price - (item.prevPrice || item.price)).toFixed(2);

        const card = document.createElement('div');
        card.style.cssText = 'background: #151a21; border: 1px solid #262d37; padding: 16px; border-radius: 12px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 6px rgba(0,0,0,0.1);';
        
        card.innerHTML = `
            <div>
                <div style="font-weight: 600; font-size: 16px; color: #eaecef; margin-bottom: 4px;">${item.name}</div>
                <div style="font-size: 11px; color: #848e9c; text-transform: uppercase; letter-spacing: 0.5px;">OTC Token Unit</div>
            </div>
            <div style="margin-top: 12px; display: flex; justify-content: space-between; align-items: flex-end;">
                <div style="font-family: monospace; font-size: 18px; font-weight: 700; color: #eaecef;">
                    ${item.price.toFixed(2)} USDT
                </div>
                <div style="font-family: monospace; font-size: 13px; font-weight: 600; ${colorClass}">
                    ${sign}${diff}
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

initMarket();
