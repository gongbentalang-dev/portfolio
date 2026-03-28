const STORAGE_KEY = "imageViewTimes";
const rankingList = document.getElementById("ranking-list");

// ギャラリー画像一覧
const imageSources = [
  "images/photo1.jpg",
  "images/photo2.jpg",
  "images/photo3.jpg",
  "images/photo4.jpg",
  "images/photo5.jpg",
  "images/photo6.jpg",
  "images/photo7.jpg",
  "images/photo8.jpg",
  "images/photo9.jpg",
  "images/photo10.jpg",
  "images/photo11.jpg",
  "images/photo12.jpg",
  "images/photo13.jpg",
  "images/photo14.jpg",
  "images/photo15.jpg",
  "images/photo16.jpg",
  "images/photo17.jpg",
  "images/photo18.jpg",
];

// ミリ秒 → 秒
function formatTime(ms) {
  return (ms / 1000).toFixed(1) + " sec";
}

function loadRanking() {
  const viewTimes = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};

  const ranking = Object.entries(viewTimes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  if (ranking.length === 0) {
    rankingList.innerHTML = "<p>まだ閲覧データがありません。</p>";
    return;
  }

  rankingList.innerHTML = "";

  ranking.forEach(([index, time], i) => {
    const card = document.createElement("div");
    card.classList.add("ranking-card", `rank-${i + 1}`);

    card.innerHTML = `
      <div class="rank-label">#${i + 1}</div>
      <img src="${imageSources[index]}" alt="Ranked Image ${i + 1}">
      <div class="time-label">${formatTime(time)}</div>
    `;

    rankingList.appendChild(card);
  });
}

loadRanking();