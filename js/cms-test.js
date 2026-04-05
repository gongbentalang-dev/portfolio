let works = [];
let currentIndex = 0;

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const closeBtn = document.getElementById("close");
const prevBtn = document.querySelector(".arrow.left");
const nextBtn = document.querySelector(".arrow.right");

const categoryEl = document.querySelector(".category");
const shootingDateEl = document.querySelector(".shootingDate");
const cameraEl = document.querySelector(".camera");
const lensEl = document.querySelector(".lens");
const fNumberEl = document.querySelector(".fNumber");
const shutterSpeedEl = document.querySelector(".shutterSpeed");
const isoEl = document.querySelector(".iso");

function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}.${m}.${d}`;
}

function updateLightbox(index) {
  const work = works[index];
  if (!work) return;

  currentIndex = index;

  lightboxImg.src = work.image.url;
  lightboxImg.alt = work.category || "拡大画像";

  if (categoryEl) categoryEl.textContent = work.category || "";
  if (shootingDateEl) shootingDateEl.textContent = formatDate(work.shootingDate);
  if (cameraEl) cameraEl.textContent = work.camera || "";
  if (lensEl) lensEl.textContent = work.lens || "";
  if (fNumberEl) fNumberEl.textContent = work.fNumber || "";
  if (shutterSpeedEl) shutterSpeedEl.textContent = work.shutterSpeed || "";
  if (isoEl) isoEl.textContent = work.iso || "";
}

function openLightbox(index) {
  updateLightbox(index);
  lightbox.classList.add("active");
}

function closeLightbox() {
  lightbox.classList.remove("active");
}

function showPrev() {
  const prevIndex = currentIndex === 0 ? works.length - 1 : currentIndex - 1;
  updateLightbox(prevIndex);
}

function showNext() {
  const nextIndex = currentIndex === works.length - 1 ? 0 : currentIndex + 1;
  updateLightbox(nextIndex);
}

async function fetchWorks() {
  try {
    const response = await fetch("https://vks2e95ehh.microcms.io/api/v1/portfolio?limit=100", {
      headers: {
        "X-MICROCMS-API-KEY": "00noGUhIiZTR7chPxpAvKqzcwsYaPhPpMMGA"
      }
    });

    if (!response.ok) {
      console.error("HTTP Error:", response.status, response.statusText);
      return;
    }

    const data = await response.json();
    console.log("microCMS data:", data);

    const gallery = document.querySelector(".gallery");
    if (!gallery) {
      console.error(".gallery が見つかりません");
      return;
    }

    gallery.innerHTML = "";

    works = [...data.contents].reverse();

    works.forEach((work, index) => {
      const img = document.createElement("img");
      img.src = work.image.url;
      img.alt = work.category || "作品画像";
      img.dataset.index = index;

      img.addEventListener("click", () => {
        openLightbox(index);
      });

      gallery.appendChild(img);
    });
  } catch (error) {
    console.error("fetchWorks error:", error);
  }
}

if (closeBtn) {
  closeBtn.addEventListener("click", closeLightbox);
}

if (prevBtn) {
  prevBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    showPrev();
  });
}

if (nextBtn) {
  nextBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    showNext();
  });
}

if (lightbox) {
  lightbox.addEventListener("click", (e) => {
    // 画像本体・矢印・閉じるボタン以外なら閉じる
    if (
      e.target === lightbox ||
      (!e.target.closest("#lightbox-img") &&
        !e.target.closest(".arrow") &&
        !e.target.closest("#close"))
    ) {
      closeLightbox();
    }
  });
}

document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("active")) return;

  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") showPrev();
  if (e.key === "ArrowRight") showNext();
});

fetchWorks();