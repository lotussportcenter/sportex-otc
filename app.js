import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set, get, update, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyD5XFfR00-OsVOYtmZmZtHegKxDZEW4s",
    authDomain: "sportex-otc.firebaseapp.com",
    databaseURL: "https://sportex-otc-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "sportex-otc",
    storageBucket: "sportex-otc.appspot.com",
    messagingSenderId: "938427841690",
    appId: "1:938427841690:web:8cb1d9bd74107ad588f323",
    measurementId: "G-3H2H9V3ZZF"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Иницијални категории со слободни цени (без min/max граници)
const categories = {
    football: [
        { name: "Real Madrid", base: 185.50 },
        { name: "Manchester City", base: 178.20 },
        { name: "Arsenal", base: 142.00 },
        { name: "Barcelona", base: 165.80 },
        { name: "Bayern Munich", base: 155.00 },
        { name: "Liverpool", base: 150.30 },
        { name: "Paris Saint-Germain", base: 145.00 },
        { name: "Inter", base: 125.00 },
        { name: "Juventus", base: 115.00 },
        { name: "Milan", base: 110.00 },
        { name: "Atalanta", base: 95.00 },
        { name: "Como", base: 60.00 },
        { name: "Manchester United", base: 135.00 },
        { name: "Aston Villa", base: 105.00 },
        { name: "Chelsea", base: 130.00 },
        { name: "Newcastle", base: 112.00 },
        { name: "Napoli", base: 118.00 },
        { name: "Roma", base: 98.00 },
        { name: "Fiorentina", base: 85.00 },
        { name: "Lazio", base: 90.00 },
        { name: "Borussia Dortmund", base: 120.00 },
        { name: "RB Leipzig", base: 95.00 },
        { name: "VfB Stuttgart", base: 80.00 },
        { name: "Hoffenheim", base: 65.00 },
        { name: "Bayern Leverkusen", base: 130.00 },
        { name: "RC Lens", base: 70.00 },
        { name: "Lille OSC", base: 75.00 },
        { name: "Olympique Lyon", base: 88.00 },
        { name: "Olympique Marseille", base: 92.00 },
        { name: "Atlético Madrid", base: 125.00 },
        { name: "Athletic Bilbao", base: 82.00 },
        { name: "Real Sociedad", base: 86.00 },
        { name: "Villarreal", base: 78.00 },
        { name: "Sevilla", base: 80.00 },
        { name: "Valencia", base: 72.00 },
        { name: "Betis", base: 75.00 }
    ],
    basketball: [
        { name: "Boston Celtics", base: 195.00 },
        { name: "Denver Nuggets", base: 185.00 },
        { name: "Oklahoma City Thunder", base: 175.00 },
        { name: "Los Angeles Lakers", base: 190.00 },
        { name: "Golden State Warriors", base: 180.00 },
        { name: "Dallas Mavericks", base: 165.00 },
        { name: "Milwaukee Bucks", base: 170.00 },
        { name: "Minnesota Timberwolves", base: 155.00 },
        { name: "New York Knicks", base: 160.00 },
        { name: "San Antonio Spurs", base: 140.00 },
        { name: "Miami Heat", base: 145.00 },
        { name: "Cleveland Cavaliers", base: 150.00 },
        { name: "Philadelphia 76ers", base: 155.00 },
        { name: "Phoenix Suns", base: 160.00 },
        { name: "Sacramento Kings", base: 125.00 },
        { name: "Indiana Pacers", base: 130.00 },
        { name: "Orlando Magic", base: 120.00 },
        { name: "Houston Rockets", base: 110.00 },
        { name: "Chicago Bulls", base: 115.00 },
        { name: "Atlanta Hawks", base: 105.00 },
        { name: "Brooklyn Nets", base: 95.00 },
        { name: "Toronto Raptors", base: 100.00 },
        { name: "Memphis Grizzlies", base: 125.00 },
        { name: "New Orleans Pelicans", base: 120.00 },
        { name: "Utah Jazz", base: 90.00 },
        { name: "Portland Trail Blazers", base: 85.00 },
        { name: "Detroit Pistons", base: 70.00 },
        { name: "Washington Wizards", base: 65.00 },
        { name: "Charlotte Hornets", base: 75.00 }
    ],
    nfl: [
        { name: "Kansas City Chiefs", base: 210.00 },
        { name: "San Francisco 49ers", base: 195.00 },
        { name: "Philadelphia Eagles", base: 185.00 },
        { name: "Baltimore Ravens", base: 180.00 },
        { name: "Detroit Lions", base: 170.00 },
        { name: "Buffalo Bills", base: 175.00 },
        { name: "Dallas Cowboys", base: 180.00 },
        { name: "Green Bay Packers", base: 155.00 }
    ],
    nhl: [
        { name: "Florida Panthers", base: 180.00 },
        { name: "Edmonton Oilers", base: 175.00 },
        { name: "Colorado Avalanche", base: 170.00 },
        { name: "Rangers New York", base: 165.00 },
        { name: "Dallas Stars", base: 160.00 }
    ],
    players: [
        { name: "Kylian Mbappe", base: 220.00 },
        { name: "Erling Haaland", base: 215.00 },
        { name: "Jude Bellingham", base: 205.00 },
        { name: "Vinicius Junior", base: 200.00 },
        { name: "Lamine Yamal", base: 190.00 },
        { name: "Nikola Jokic", base: 210.00 },
        { name: "Luka Doncic", base: 205.00 },
        { name: "Giannis Antetokounmpo", base: 195.00 },
        { name: "Shai Gilgeous-Alexander", base: 190.00 },
        { name: "Victor Wembanyama", base: 200.00 },
        { name: "Lionel Messi", base: 175.00 },
        { name: "Cristiano Ronaldo", base: 170.00 }
    ]
};

// Функция за иницијализација на податоците во Firebase доколку веќе не постојат
async function initDatabase() {
    const dbRef = ref(db, 'market');
    const snapshot = await get(dbRef);
    if (!snapshot.exists()) {
        let initialData = {};
        for (const [category, items] of Object.entries(categories)) {
            initialData[category] = items.map(item => ({
                name: item.name,
                price: item.base,
                prevPrice: item.base
            }));
        }
        await set(dbRef, initialData);
    }
}

initDatabase();

// Пазарна логика за слободно движење без лимити (се извршува на секои неколку секунди)
function simulateFreeMarket() {
    const dbRef = ref(db, 'market');
    get(dbRef).snapshot ? null : get(dbRef).then((snapshot) => {
        if (!snapshot.exists()) return;
        let data = snapshot.val();

        for (const category in data) {
            data[category].forEach(item => {
                item.prevPrice = item.price;
                
                // Случаен процент на промена (од -2.5% до +2.5%) со целосно слободен пазар
                let percentChange = (Math.random() * 5 - 2.48) / 100;
                item.price = item.price * (1 + percentChange);
                
                // Заштита само да не отиде во минус или нула
                if (item.price < 1.00) item.price = 1.00;
                
                item.price = parseFloat(item.price.toFixed(2));
            });
        }
        set(dbRef, data);
    });
}

// Можеш да го вклучиш автоматското движење на пазарот по желба
// setInterval(simulateFreeMarket, 5000);
