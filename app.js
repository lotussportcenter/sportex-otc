// Firebase config (replace with your own project keys)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT.firebaseio.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Categories
const categories = {
  football: ["FC Barcelona","Real Madrid","Manchester United","Liverpool","Chelsea","Arsenal","Paris Saint-Germain","Juventus","Bayern Munich","Borussia Dortmund"],
  basketball: ["Los Angeles Lakers","Chicago Bulls","Golden State Warriors","Boston Celtics","Miami Heat","Milwaukee Bucks","Brooklyn Nets","Phoenix Suns"],
  tennis: ["Novak Djokovic","Rafael Nadal","Roger Federer","Carlos Alcaraz","Iga Swiatek","Coco Gauff","Aryna Sabalenka","Daniil Medvedev"],
  nfl: ["Dallas Cowboys","New England Patriots","Green Bay Packers","Kansas City Chiefs","San Francisco 49ers","Pittsburgh Steelers","Miami Dolphins","Buffalo Bills"],
  others: ["Cristiano Ronaldo","Lionel Messi","Kylian Mbappé","Erling Haaland","LeBron James","Stephen Curry","Kevin Durant","Giannis Antetokounmpo"]
};

let charts = {};
let globalIndexChart;
let sectorCharts = {};
let initialPrices = {}; // store initial prices for limits

function showCategory(cat) {
  const div = document.getElementById("stocks");
  div.innerHTML = "";
  charts = {};

  categories[cat].forEach(name => {
    const container = document.createElement("div");
    container.className = "stock";
    container.innerHTML = `<h3>${name}</h3><canvas id="${name.replace(/\s+/g,'_')}"></canvas>`;
    div.appendChild(container);

    const ctx = document.getElementById(name.replace(/\s+/g,'_')).getContext("2d");
    charts[name] = new Chart(ctx, {
      type: 'line',
      data: { labels: [], datasets: [{ label: 'Price (USDT)', data: [], borderColor: '#007bff', fill: false, tension: 0.1 }] },
      options: { animation: false, scales: { x: { display: false }, y: { beginAtZero: true } } }
    });
  });

  sectorCharts.football = createSectorChart("footballIndex","Football Index","#ff5733");
  sectorCharts.basketball = createSectorChart("basketballIndex","Basketball Index","#ffc300");
  sectorCharts.tennis = createSectorChart("tennisIndex","Tennis Index","#007bff");
  sectorCharts.nfl = createSectorChart("