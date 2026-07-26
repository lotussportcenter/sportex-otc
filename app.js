const sportData = {
    "NFL": [
        { name: "Seattle Seahawks", price: 45.50 },
        { name: "New England Patriots", price: 58.20 },
        { name: "Denver Broncos", price: 42.00 },
        { name: "Jacksonville Jaguars", price: 31.50 },
        { name: "LA Rams", price: 49.00 },
        { name: "Houston Texans", price: 36.80 },
        { name: "Buffalo Bills", price: 48.30 },
        { name: "Philadelphia Eagles", price: 55.40 },
        { name: "Pittsburgh Steelers", price: 52.10 },
        { name: "San Francisco 49ers", price: 59.00 },
        { name: "Chicago Bears", price: 44.20 },
        { name: "Green Bay Packers", price: 53.60 },
        { name: "Minnesota Vikings", price: 41.90 },
        { name: "Detroit Lions", price: 39.50 },
        { name: "Dallas Cowboys", price: 65.00 },
        { name: "Baltimore Ravens", price: 50.80 },
        { name: "LA Chargers", price: 43.10 },
        { name: "Kansas City Chiefs", price: 62.50 },
        { name: "Miami Dolphins", price: 46.70 },
        { name: "Cleveland Browns", price: 35.40 },
        { name: "Cincinnati Bengals", price: 47.90 },
        { name: "Washington Commanders", price: 38.20 },
        { name: "New York Giants", price: 45.00 },
        { name: "Tampa Bay Buccaneers", price: 44.60 },
        { name: "Carolina Panthers", price: 30.20 },
        { name: "Atlanta Falcons", price: 37.50 },
        { name: "New Orleans Saints", price: 40.10 },
        { name: "Indianapolis Colts", price: 38.90 },
        { name: "Arizona Cardinals", price: 33.40 },
        { name: "Las Vegas Raiders", price: 42.80 }
    ],
    "NBA": [
        { name: "Oklahoma City Thunder", price: 52.00 },
        { name: "San Antonio Spurs", price: 48.50 },
        { name: "Denver Nuggets", price: 55.00 },
        { name: "Los Angeles Lakers", price: 78.40 },
        { name: "Houston Rockets", price: 44.10 },
        { name: "Detroit Pistons", price: 32.00 },
        { name: "Boston Celtics", price: 74.20 },
        { name: "New York Knicks", price: 68.00 },
        { name: "Cleveland Cavaliers", price: 49.30 },
        { name: "Toronto Raptors", price: 41.50 },
        { name: "Golden State Warriors", price: 82.00 },
        { name: "Miami Heat", price: 58.60 },
        { name: "Philadelphia 76ers", price: 54.20 },
        { name: "Milwaukee Bucks", price: 60.10 },
        { name: "Chicago Bulls", price: 47.80 },
        { name: "Dallas Mavericks", price: 63.50 },
        { name: "Phoenix Suns", price: 51.90 },
        { name: "Memphis Grizzlies", price: 39.40 },
        { name: "Sacramento Kings", price: 37.20 },
        { name: "Minnesota Timberwolves", price: 45.60 },
        { name: "Atlanta Hawks", price: 38.00 },
        { name: "Brooklyn Nets", price: 43.80 },
        { name: "Charlotte Hornets", price: 29.50 },
        { name: "Indiana Pacers", price: 40.20 },
        { name: "Orlando Magic", price: 35.70 },
        { name: "Utah Jazz", price: 33.10 },
        { name: "Portland Trail Blazers", price: 31.80 },
        { name: "New Orleans Pelicans", price: 36.90 },
        { name: "Washington Wizards", price: 28.40 }
    ],
    "NHL": [
        { name: "Carolina Hurricanes", price: 41.00 },
        { name: "Colorado Avalanche", price: 54.20 },
        { name: "Vegas Golden Knights", price: 51.50 },
        { name: "Buffalo Sabres", price: 32.40 },
        { name: "Tampa Bay Lightning", price: 56.80 },
        { name: "Montreal Canadiens", price: 45.00 },
        { name: "Dallas Stars", price: 44.70 },
        { name: "Minnesota Wild", price: 39.10 }
    ],
    "F1": [
        { name: "Max Verstappen (Red Bull)", price: 85.00 },
        { name: "Lewis Hamilton (Ferrari)", price: 80.00 },
        { name: "Charles Leclerc (Ferrari)", price: 72.50 },
        { name: "Lando Norris (McLaren)", price: 75.00 },
        { name: "Oscar Piastri (McLaren)", price: 68.00 },
        { name: "George Russell (Mercedes)", price: 62.00 },
        { name: "Fernando Alonso (Aston Martin)", price: 55.00 }
    ]
};

function renderMarket() {
    let container = document.getElementById('market-container');
    if (!container) {
        // Ако го нема во HTML, го креираме автоматски под Live Spot Markets
        container = document.createElement('div');
        container.id = 'market-container';
        container.style.cssText = "padding: 20px; color: #fff; max-width: 1200px; margin: 0 auto;";
        document.body.appendChild(container);
    }
    
    container.innerHTML = '';

    for (const [category, items] of Object.entries(sportData)) {
        let section = document.createElement('div');
        section.style.cssText = "margin-bottom: 30px;";
        
        let heading = document.createElement('h2');
        heading.innerText = category;
        heading.style.cssText = "color: #00ffcc; border-bottom: 1px solid #333; padding-bottom: 10px; margin-bottom: 15px;";
        section.appendChild(heading);

        let grid = document.createElement('div');
        grid.style.cssText = "display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 15px;";

        items.forEach((item, index) => {
            let card = document.createElement('div');
            card.style.cssText = "background: #1a1a2e; border: 1px solid #333; padding: 15px; border-radius: 8px; display: flex; flex-direction: column; justify-content: space-between;";
            
            card.innerHTML = `
                <span style="font-weight: bold; margin-bottom: 10px; font-size: 15px;">${item.name}</span>
                <span id="price-${category}-${index}" style="color: #00ffcc; font-size: 18px; font-family: monospace;">${item.price.toFixed(2)} USDT</span>
            `;
            grid.appendChild(card);
        });

        section.appendChild(grid);
        container.appendChild(section);
    }
}

function startSimulation() {
    setInterval(() => {
        for (const category in sportData) {
            sportData[category].forEach((item, index) => {
                const change = (Math.random() * 5 - 2.45) / 100;
                item.price = Math.max(1.00, item.price * (1 + change));
                const el = document.getElementById(`price-${category}-${index}`);
                if (el) {
                    el.innerText = `${item.price.toFixed(2)} USDT`;
                    el.style.color = change >= 0 ? "#00ffcc" : "#ff4d4d";
                }
            });
        }
    }, 3000);
}

window.addEventListener('DOMContentLoaded', () => {
    renderMarket();
    startSimulation();
});
