const rankingList = document.getElementById("ranking-list");

function formatTime(seconds) {
  if (seconds >= 3600) {
    return `Viewed ${(seconds / 3600).toFixed(1)} h`;
  }

  if (seconds >= 60) {
    return `Viewed ${(seconds / 60).toFixed(1)} min`;
  }

  return `Viewed ${seconds.toFixed(1)} s`;
}

function renderMessage(message) {
  if (!rankingList) return;

  rankingList.innerHTML = "";

  const paragraph = document.createElement("p");
  paragraph.className = "ranking-message";
  paragraph.textContent = message;
  rankingList.appendChild(paragraph);
}

function createRankingCard(work, rank) {
  const card = document.createElement("div");
  const image = document.createElement("img");
  const info = document.createElement("div");
  const timeLabel = document.createElement("div");
  const categoryLabel = document.createElement("div");
  const rankLabel = document.createElement("div");

  card.classList.add("ranking-card", `rank-${rank}`);
  info.className = "ranking-info";
  timeLabel.className = "time-label";
  categoryLabel.className = "category-label";
  rankLabel.className = "rank-label";

  rankLabel.textContent = `#${rank}`;
  image.src = window.PortfolioCMS?.optimizeImageUrl(work.imageUrl, "gallery") || work.imageUrl || "";
  image.alt = work.category || `Ranked Image ${rank}`;
  image.loading = "lazy";
  image.decoding = "async";
  timeLabel.textContent = formatTime(work.viewTime);
  categoryLabel.textContent = work.category || "未分類";

  info.append(timeLabel, categoryLabel);
  card.append(rankLabel, image, info);

  return card;
}

async function fetchWorks() {
  if (!window.PortfolioCMS?.fetchPortfolioWorks) {
    throw new Error("PortfolioCMS helper is not available.");
  }

  return window.PortfolioCMS.fetchPortfolioWorks();
}

function getRankedWorks(works, viewTimes) {
  return works
    .map((work) => ({
      ...work,
      viewTime: viewTimes[work.id] || 0
    }))
    .filter((work) => work.viewTime > 0)
    .sort((a, b) => b.viewTime - a.viewTime)
    .slice(0, 5);
}

async function loadRanking() {
  if (!rankingList) {
    console.error('[Ranking] "#ranking-list" element was not found.');
    return;
  }

  try {
    const works = await fetchWorks();
    const viewTimes = window.PortfolioStorage?.getViewTimes?.() || {};
    const rankedWorks = getRankedWorks(works, viewTimes);

    if (rankedWorks.length === 0) {
      renderMessage("まだ閲覧データがありません。");
      return;
    }

    rankingList.innerHTML = "";

    rankedWorks.forEach((work, index) => {
      rankingList.appendChild(createRankingCard(work, index + 1));
    });
  } catch (error) {
    console.error("[Ranking] Failed to load ranking data:", error);
    renderMessage("ランキングの読み込みに失敗しました。");
  }
}

loadRanking();
