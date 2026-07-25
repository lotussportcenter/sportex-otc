import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, onValue, set, update, runTransaction } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyD5XFfRfOO-OsVOYtmZmZtHegKyxDZEW4s",
  authDomain: "sportex-otc.firebaseapp.com",
  databaseURL: "https://sportex-otc-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "sportex-otc",
  storageBucket: "sportex-otc.firebasestorage.app",
  messagingSenderId: "938427841690",
  appId: "1:938427841690:web:8cb1d9bd74107ad588f323",
  measurementId: "G-3H2H9V3ZZF"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const categories = {
  football: [
    { name: "Real Madrid", base: 185.50, min: 140, max: 280 },
    { name: "Manchester City", base: 178.20, min: 130, max: 260 },
    { name: "Arsenal", base: 142.00, min: 100, max: 210 },
    { name: "Barcelona", base: 165.80, min: 120, max: 240 },
    { name: "Bayern Munich", base: 155.00, min: 110, max: 230 },
    { name: "Liverpool", base: 150.30, min: 105, max: 220 },
    { name: "Paris Saint-Germain", base: 145.00, min: 95, max: 210 },
    { name: "Inter", base: 112.40, min: 80, max: 170 },
    { name: "Juventus", base: 98.60, min: 65, max: 150 },
    { name: "Milan", base: 92.10, min: 60, max: 145 },
    { name: "Atalanta", base: 64.50, min: 40, max: 110 },
    { name: "Como", base: 32.80, min: 18, max: 65 },
    { name: "Manchester United", base: 125.00, min: 85, max: 190 },
    { name: "Aston Villa", base: 78.40, min: 50, max: 125 },
    { name: "Chelsea", base: 115.00, min: 75, max: 180 },
    { name: "Newcastle", base: 82.30, min: 52, max: 130 },
    { name: "Napoli", base: 88.00, min: 55, max: 135 },
    { name: "Roma", base: 72.00, min: 45, max: 115 },
    { name: "Fiorentina", base: 48.00, min: 28, max: 85 },
    { name: "Lazio", base: 56.00, min: 35, max: 95 },
    { name: "Borussia Dortmund", base: 94.00, min: 60, max: 145 },
    { name: "RB Leipzig", base: 71.00, min: 45, max: 115 },
    { name: "VfB Stuttgart", base: 52.00, min: 30, max: 90 },
    { name: "Hoffenheim", base: 34.00, min: 20, max: 65 },
    { name: "Bayern Leverkusen", base: 108.00, min: 70, max: 165 },
    { name: "RC Lens", base: 38.00, min: 22, max: 70 },
    { name: "Lille OSC", base: 44.00, min: 25, max: 75 },
    { name: "Olympique Lyon", base: 58.00, min: 35, max: 95 },
    { name: "Olympique Marseille", base: 62.00, min: 38, max: 100 },
    { name: "Atlético Madrid", base: 102.00, min: 65, max: 155 },
    { name: "Athletic Bilbao", base: 54.00, min: 32, max: 88 },
    { name: "Real Sociedad", base: 58.00, min: 35, max: 92 },
    { name: "Villarreal", base: 46.00, min: 26, max: 80 },
    { name: "Sevilla", base: 50.00, min: 30, max: 85 },
    { name: "Valencia", base: 42.00, min: 24, max: 72 },
    { name: "Betis", base: 45.00, min: 26, max: 76 }
  ],
  basketball: [
    { name: "Boston Celtics", base: 175.00, min: 120, max: 260 },
    { name: "Denver Nuggets", base: 162.00, min: 110, max: 240 },
    { name: "Oklahoma City Thunder", base: 148.00, min: 95, max: 220 },
    { name: "Los Angeles Lakers", base: 158.00, min: 105, max: 235 },
    { name: "Golden State Warriors", base: 152.00, min: 100, max: 225 },
    { name: "Dallas Mavericks", base: 138.00, min: 88, max: 200 },
    { name: "Milwaukee Bucks", base: 142.00, min: 90, max: 210 },
    { name: "Minnesota Timberwolves", base: 124.00, min: 78, max: 185 },
    { name: "New York Knicks", base: 130.00, min: 82, max: 190 },
    { name: "San Antonio Spurs", base: 95.00, min: 55, max: 160 },
    { name: "Miami Heat", base: 108.00, min: 68, max: 165 },
    { name: "Cleveland Cavaliers", base: 115.00, min: 72, max: 175 },
    { name: "Philadelphia 76ers", base: 122.00, min: 75, max: 180 },
    { name: "Phoenix Suns", base: 128.00, min: 80, max: 190 },
    { name: "Sacramento Kings", base: 85.00, min: 50, max: 135 },
    { name: "Indiana Pacers", base: 88.00, min: 52, max: 140 },
    { name: "Orlando Magic", base: 82.00, min: 48, max: 130 },
    { name: "Houston Rockets", base: 74.00, min: 42, max: 120 },
    { name: "Chicago Bulls", base: 78.00, min: 45, max: 125 },
    { name: "Atlanta Hawks", base: 68.00, min: 38, max: 110 },
    { name: "Brooklyn Nets", base: 62.00, min: 35, max: 100 },
    { name: "Toronto Raptors", base: 65.00, min: 36, max: 105 },
    { name: "Memphis Grizzlies", base: 86.00, min: 50, max: 135 },
    { name: "New Orleans Pelicans", base: 80.00, min: 46, max: 128 },
    { name: "Utah Jazz", base: 58.00, min: 32, max: 95 },
    { name: "Portland Trail Blazers", base: 52.00, min: 28, max: 88 },
    { name: "Detroit Pistons", base: 42.00, min: 22, max: 72 },
    { name: "Washington Wizards", base: 38.00, min: 20, max: 65 },
    { name: "Charlotte Hornets", base: 45.00, min: 25, max: 75 }
  ],
  nfl: [
    { name: "Kansas City Chiefs", base: 195.00, min: 140, max: 290 },
    { name: "San Francisco 49ers", base: 172.00, min: 120, max: 250 },
    { name: "Philadelphia Eagles", base: 160.00, min: 110, max: 235 },
    { name: "Baltimore Ravens", base: 155.00, min: 105, max: 225 },
    { name: "Detroit Lions", base: 142.00, min: 92, max: 210 },
    { name: "Buffalo Bills", base: 148.00, min: 95, max: 215 },
    { name: "Dallas Cowboys", base: 150.00, min: 98, max: 220 },
    { name: "Green Bay Packers", base: 128.00, min: 80, max: 185 },
    { name: "Houston Texans", base: 118.00, min: 72, max: 175 },
    { name: "Miami Dolphins", base: 122.00, min: 75, max: 180 },
    { name: "Cincinnati Bengals", base: 125.00, min: 78, max: 185 },
    { name: "LA Rams", base: 112.00, min: 68, max: 165 },
    { name: "Pittsburgh Steelers", base: 105.00, min: 62, max: 155 },
    { name: "Cleveland Browns", base: 88.00, min: 52, max: 135 },
    { name: "Tampa Bay Buccaneers", base: 85.00, min: 50, max: 130 },
    { name: "Jacksonville Jaguars", base: 78.00, min: 45, max: 122 },
    { name: "Seattle Seahawks", base: 82.00, min: 48, max: 128 },
    { name: "Minnesota Vikings", base: 80.00, min: 46, max: 125 },
    { name: "Indianapolis Colts", base: 74.00, min: 42, max: 118 },
    { name: "Chicago Bears", base: 76.00, min: 44, max: 120 },
    { name: "Denver Broncos", base: 68.00, min: 38, max: 110 },
    { name: "LA Chargers", base: 86.00, min: 50, max: 132 },
    { name: "New York Giants", base: 62.00, min: 35, max: 100 },
    { name: "Washington Commanders", base: 65.00, min: 36, max: 105 },
    { name: "New Orleans Saints", base: 64.00, min: 35, max: 102 },
    { name: "Atlanta Falcons", base: 70.00, min: 40, max: 112 },
    { name: "Las Vegas Raiders", base: 66.00, min: 36, max: 106 },
    { name: "Arizona Cardinals", base: 54.00, min: 30, max: 88 },
    { name: "Tennessee Titans", base: 52.00, min: 28, max: 85 },
    { name: "New England Patriots", base: 58.00, min: 32, max: 92 },
    { name: "Carolina Panthers", base: 42.00, min: 22, max: 70 }
  ],
  nhl: [
    { name: "Florida Panthers", base: 168.00, min: 115, max: 245 },
    { name: "Edmonton Oilers", base: 162.00, min: 110, max: 238 },
    { name: "Colorado Avalanche", base: 155.00, min: 105, max: 225 },
    { name: "Rangers New York", base: 148.00, min: 95, max: 215 },
    { name: "Dallas Stars", base: 142.00, min: 90, max: 208 },
    { name: "Vegas Golden Knights", base: 138.00, min: 88, max: 200 },
    { name: "Carolina Hurricanes", base: 135.00, min: 85, max: 195 },
    { name: "Tampa Bay Lightning", base: 132.00, min: 82, max: 192 },
    { name: "Boston Bruins", base: 128.00, min: 78, max: 185 },
    { name: "Toronto Maple Leafs", base: 130.00, min: 80, max: 188 },
    { name: "Vancouver Canucks", base: 120.00, min: 72, max: 175 },
    { name: "Winnipeg Jets", base: 112.00, min: 68, max: 165 },
    { name: "Nashville Predators", base: 95.00, min: 58, max: 145 },
    { name: "Los Angeles Kings", base: 92.00, min: 55, max: 140 },
    { name: "New Jersey Devils", base: 98.00, min: 60, max: 148 },
    { name: "Philadelphia Flyers", base: 74.00, min: 42, max: 118 },
    { name: "Washington Capitals", base: 82.00, min: 48, max: 128 },
    { name: "Pittsburgh Penguins", base: 80.00, min: 46, max: 125 },
    { name: "Detroit Red Wings", base: 76.00, min: 44, max: 120 },
    { name: "St. Louis Blues", base: 72.00, min: 40, max: 115 },
    { name: "Minnesota Wild", base: 78.00, min: 45, max: 122 },
    { name: "Ottawa Senators", base: 64.00, min: 36, max: 102 },
    { name: "Buffalo Sabres", base: 62.00, min: 34, max: 100 },
    { name: "Montreal Canadiens", base: 68.00, min: 38, max: 108 },
    { name: "Calgary Flames", base: 66.00, min: 36, max: 105 },
    { name: "Seattle Kraken", base: 70.00, min: 40, max: 110 },
    { name: "Utah Mammoth", base: 58.00, min: 32, max: 92 },
    { name: "Anaheim Ducks", base: 48.00, min: 26, max: 80 },
    { name: "Chicago Blackhawks", base: 52.00, min: 28, max: 85 },
    { name: "San Jose Sharks", base: 38.00, min: 20, max: 65 },
    { name: "Columbus Blue Jackets", base: 44.00, min: 24, max: 72 }
  ],
  players: [
    { name: "Kylian Mbappe", base: 215.00, min: 150, max: 320 },
    { name: "Erling Haaland", base: 208.00, min: 145, max: 310 },
    { name: "Jude Bellingham", base: 192.00, min: 130, max: 285 },
    { name: "Vinicius Junior", base: 188.00, min: 125, max: 280 },
    { name: "Lamine Yamal", base: 175.00, min: 110, max: 260 },
    { name: "Nikola Jokic", base: 198.00, min: 135, max: 295 },
    { name: "Luka Doncic", base: 195.00, min: 130, max: 290 },
    { name: "Giannis Antetokounmpo", base: 182.00, min: 120, max: 270 },
    { name: "Shai Gilgeous-Alexander", base: 178.00, min: 115, max: 265 },
    { name: "Victor Wembanyama", base: 185.00, min: 120, max: 280 },
    { name: "Lionel Messi", base: 165.00, min: 105, max: 240 },
    { name: "Cristiano Ronaldo", base: 158.00, min: 100, max: 230 },
    { name: "Pedri", base: 112.00, min: 72, max: 170 },
    { name: "Marcus Rashford", base: 88.00, min: 52, max: 138 },
    { name: "Joao Felix", base: 74.00, min: 42, max: 120 },
    { name: "Ferran Torres", base: 62.00, min: 35, max: 98 }
  ]
};

let charts = {};
let latestFirebaseData = null;
const CANDLE_INTERVAL_MS = 20000; // Нова свеќа на секои 20 секунди

function checkAndAutoFillDatabase(existingData) {
  if (existingData && Object.keys(existingData).length > 0) return;

  const updates = {};
  const now = Date.now();

  Object.keys(categories).forEach(cat => {
    categories[cat].forEach(itemObj => {
      const itemKey = itemObj.name.replace(/[^a-zA-Z0-9]/g, '_');
      let initialCandles = [];
      let prevClose = itemObj.base;
      
      for (let i = 10; i >= 1; i--) {
        const open = prevClose;
        const delta = parseFloat(((Math.random() - 0.49) * 0.05).toFixed(2));
        let close = parseFloat((open + delta).toFixed(2));
        
        if (close < itemObj.min) close = itemObj.min;
        if (close > itemObj.max) close = itemObj.max;

        const high = parseFloat((Math.max(open, close) + 0.02).toFixed(2));
        const low = parseFloat((Math.max(itemObj.min, Math.min(open, close) - 0.02)).toFixed(2));
        
        initialCandles.push({
          x: now - (i * CANDLE_INTERVAL_MS),
          o: open,
          h: high,
          l: low,
          c: close
        });
        prevClose = close;
      }

      updates[itemKey] = {
        name: itemObj.name,
        category: cat,
        price: prevClose,
        prevPrice: prevClose,
        candles: initialCandles,
        min: itemObj.min,
        max: itemObj.max,
        lastCandleTime: now
      };
    });
  });

  set(ref(db, 'prices'), updates);
}

function showCategory(cat, element) {
  if (element) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');
  }

  const div = document.getElementById("stocks");
  if (!div) return;
  div.innerHTML = "";
  charts = {};

  if (!categories[cat]) return;

  categories[cat].forEach(itemObj => {
    const name = itemObj.name;
    const itemKey = name.replace(/[^a-zA-Z0-9]/g, '_');
    const container = document.createElement("div");
    container.className = "stock-card";
    
    container.innerHTML = `
      <div class="stock-header">
        <h3 class="stock-name">${name}</h3>
        <span id="price_${itemKey}" class="stock-price">--.-- USDT</span>
      </div>
      <div class="chart-container">
        <canvas id="canvas_${itemKey}"></canvas>
      </div>
    `;
    div.appendChild(container);

    const ctx = document.getElementById(`canvas_${itemKey}`).getContext("2d");
    const existingCandles = (latestFirebaseData && latestFirebaseData[itemKey] && latestFirebaseData[itemKey].candles) 
      ? latestFirebaseData[itemKey].candles 
      : [];

    charts[name] = new Chart(ctx, {
      type: 'candlestick',
      data: { 
        datasets: [{ 
          label: 'Price (USDT)', 
          data: existingCandles,
          color: { up: '#00ff88', down: '#ff4949', unchanged: '#888888' }
        }] 
      },
      options: { 
        responsive: true,
        maintainAspectRatio: false,
        animation: false, 
        plugins: { legend: { display: false } },
        scales: { 
          x: { 
            type: 'time',
            time: { unit: 'second' },
            ticks: { color: '#848e9c', maxTicksLimit: 4 },
            grid: { color: '#1e2329' }
          }, 
          y: { 
            beginAtZero: false,
            ticks: { color: '#848e9c' },
            grid: { color: '#1e2329' }
          } 
        } 
      }
    });
  });

  if (latestFirebaseData) {
    updateUIWithPrices(latestFirebaseData);
  }
}

function updateUIWithPrices(data) {
  if (!data) return;
  Object.keys(data).forEach(key => {
    const item = data[key];
    const priceEl = document.getElementById(`price_${key}`);
    
    if (priceEl && item.price !== undefined) {
      priceEl.innerText = `${item.price.toFixed(2)} USDT`;
      if (item.prevPrice !== undefined) {
        if (item.price < item.prevPrice) {
          priceEl.classList.add('down');
        } else {
          priceEl.classList.remove('down');
        }
      }
    }

    if (charts[item.name] && item.candles) {
      charts[item.name].data.datasets[0].data = item.candles;
      charts[item.name].update('none');
    }
  });
}

// ЕДЕН ГЛАВЕН ТАБ (MASTER) ГИ МЕНУВА ЦЕНИТЕ НА СЕКОИ 5 СЕКУНДИ ЗА ДА ИМААТ СИТЕ ИСТИ ЦЕНИ
function startMasterSimulation() {
  setInterval(() => {
    if (!latestFirebaseData) return;
    const keys = Object.keys(latestFirebaseData);
    if (keys.length === 0) return;

    const updates = {};
    const now = Date.now();

    keys.forEach(key => {
      const item = latestFirebaseData[key];
      if (!item) return;

      const change = parseFloat(((Math.random() - 0.49) * 0.08).toFixed(2));
      let openPrice = item.price;
      let closePrice = parseFloat((openPrice + change).toFixed(2));

      if (item.min !== undefined && closePrice < item.min) closePrice = item.min;
      if (item.max !== undefined && closePrice > item.max) closePrice = item.max;

      let candles = item.candles ? [...item.candles] : [];
      let lastCandleTime = item.lastCandleTime || now;

      if (candles.length === 0 || (now - lastCandleTime >= CANDLE_INTERVAL_MS)) {
        const highPrice = parseFloat((Math.max(openPrice, closePrice) + 0.02).toFixed(2));
        const lowPrice = parseFloat((Math.max(item.min || 1.0, Math.min(openPrice, closePrice) - 0.02)).toFixed(2));

        candles.push({ x: now, o: openPrice, h: highPrice, l: lowPrice, c: closePrice });
        if (candles.length > 25) candles.shift();
        updates[`${key}/lastCandleTime`] = now;
      } else {
        let currentCandle = candles[candles.length - 1];
        currentCandle.c = closePrice;
        currentCandle.h = parseFloat(Math.max(currentCandle.h, closePrice).toFixed(2));
        currentCandle.l = parseFloat(Math.min(currentCandle.l, closePrice).toFixed(2));
        candles[candles.length - 1] = currentCandle;
      }

      updates[`${key}/prevPrice`] = openPrice;
      updates[`${key}/price`] = closePrice;
      updates[`${key}/candles`] = candles;
    });

    update(ref(db, 'prices'), updates);
  }, 5000); // Секои 5 секунди сите добиваат синхронизирана нова промена низ цела мрежа
}

window.addEventListener("DOMContentLoaded", () => {
  showCategory("football");

  const dbRef = ref(db, 'prices');
  onValue(dbRef, (snapshot) => {
    const data = snapshot.val();
    if (!data) {
      checkAndAutoFillDatabase(null);
    } else {
      latestFirebaseData = data;
      checkAndAutoFillDatabase(data);
      updateUIWithPrices(data);
    }
  });

  // Ја палиме симулацијата (автоматски ги освежува цените во базата на 5 сек за сите)
  startMasterSimulation();
});

window.showCategory = showCategory;
