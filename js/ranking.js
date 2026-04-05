const STORAGE_KEY = "viewTimes";
const rankingList = document.getElementById("ranking-list");
const API_URL = "https://vks2e95ehh.microcms.io/api/v1/portfolio?limit=100";

if (!rankingList) {
  console.error("#ranking-list が見つかりません");
}

async function fetchWorks() {
  const response = await fetch(API_URL, {
    headers: {
      "X-MICROCMS-API-KEY": "00noGUhIiZTR7chPxpAvKqzcwsYaPhPpMMGA"
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.contents || [];
}

function getViewTimes() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
}

function formatTime(seconds) {
  return `Viewed ${seconds.toFixed(1)} s`;
}

function createRankingCard(work, rank) {
  const card = document.createElement("div");
  card.classList.add("ranking-card", `rank-${rank}`);

  const imageUrl = work.image?.url || "";
  const category = work.category || "";
  const altText = category || `Ranked Image ${rank}`;

  card.innerHTML = `
    <div class="rank-label">#${rank}</div>
    <img src="${imageUrl}" alt="${altText}">
    <div class="ranking-info">
      <div class="time-label">${formatTime(work.viewTime)}</div>
      <div class="category-label">${category}</div>
    </div>
  `;

  return card;
}

function renderMessage(message) {
  rankingList.innerHTML = `<p class="ranking-message">${message}</p>`;
}

async function loadRanking() {
  if (!rankingList) return;

  try {
    const works = await fetchWorks();
    const viewTimes = getViewTimes();

    const rankedWorks = works
      .map((work) => ({
        ...work,
        viewTime: viewTimes[work.id] || 0
      }))
      .filter((work) => work.viewTime > 0)
      .sort((a, b) => b.viewTime - a.viewTime)
      .slice(0, 5);

    if (rankedWorks.length === 0) {
      renderMessage("まだ閲覧データがありません。");
      return;
    }

    rankingList.innerHTML = "";

    rankedWorks.forEach((work, index) => {
      const card = createRankingCard(work, index + 1);
      rankingList.appendChild(card);
    });
  } catch (error) {
    console.error("Ranking load error:", error);
    renderMessage("ランキングの読み込みに失敗しました。");
  }
}

loadRanking();