let works = [];
let currentIndex = 0;
let openedAt = 0;
let currentWorkId = null;

const FALLBACK_LABELS = {
  image: "作品写真",
  category: "未分類",
  metadata: "-"
};

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const closeBtn = document.getElementById("close");
const prevBtn = document.querySelector(".arrow.left");
const nextBtn = document.querySelector(".arrow.right");
const gallery = document.querySelector(".gallery");

const categoryEl = document.querySelector(".category");
const shootingDateEl = document.querySelector(".shootingDate");
const cameraEl = document.querySelector(".camera");
const lensEl = document.querySelector(".lens");
const fNumberEl = document.querySelector(".fNumber");
const shutterSpeedEl = document.querySelector(".shutterSpeed");
const isoEl = document.querySelector(".iso");

function formatDate(dateString) {
  if (!dateString) return FALLBACK_LABELS.metadata;

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return FALLBACK_LABELS.metadata;
  }

  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}.${m}.${d}`;
}

function getDisplayText(value, fallback = FALLBACK_LABELS.metadata) {
  return value || fallback;
}

function createImageAltText(work, index) {
  const category = work.category || FALLBACK_LABELS.category;
  return `${category} ${index + 1}`;
}

function setLightboxVisibility(isOpen) {
  if (!lightbox) return;

  lightbox.classList.toggle("active", isOpen);
  lightbox.setAttribute("aria-hidden", String(!isOpen));
}

function saveViewTime() {
  if (!currentWorkId || !openedAt || !window.PortfolioStorage) return;

  const seconds = (Date.now() - openedAt) / 1000;
  const viewTimes = window.PortfolioStorage.getViewTimes();

  viewTimes[currentWorkId] = (viewTimes[currentWorkId] || 0) + seconds;
  window.PortfolioStorage.saveViewTimes(viewTimes);
}

function updateTextContent(element, value, fallback) {
  if (!element) return;
  element.textContent = getDisplayText(value, fallback);
}

function updateLightbox(index) {
  const work = works[index];

  if (!work || !lightboxImg) {
    console.warn("[Photography] Lightbox update skipped because the work data was missing.");
    return;
  }

  currentIndex = index;

  lightboxImg.src = window.PortfolioCMS?.optimizeImageUrl(work.imageUrl, "detail") || work.imageUrl || "";
  lightboxImg.alt = createImageAltText(work, index);

  updateTextContent(categoryEl, work.category, FALLBACK_LABELS.category);
  updateTextContent(shootingDateEl, formatDate(work.shootingDate), FALLBACK_LABELS.metadata);
  updateTextContent(cameraEl, work.camera, FALLBACK_LABELS.metadata);
  updateTextContent(lensEl, work.lens, FALLBACK_LABELS.metadata);
  updateTextContent(fNumberEl, work.fNumber, FALLBACK_LABELS.metadata);
  updateTextContent(shutterSpeedEl, work.shutterSpeed, FALLBACK_LABELS.metadata);
  updateTextContent(isoEl, work.iso, FALLBACK_LABELS.metadata);
}

function openLightbox(index) {
  const work = works[index];

  if (!work) {
    console.warn(`[Photography] Lightbox could not open because work index ${index} was not found.`);
    return;
  }

  updateLightbox(index);
  currentWorkId = work.id || null;
  openedAt = Date.now();
  setLightboxVisibility(true);

  // Move focus to the close button so keyboard users can exit immediately.
  closeBtn?.focus();
}

function closeLightbox() {
  if (!lightbox?.classList.contains("active")) return;

  saveViewTime();
  setLightboxVisibility(false);
  currentWorkId = null;
  openedAt = 0;
}

function showPrev() {
  if (works.length === 0) return;

  saveViewTime();

  const prevIndex = currentIndex === 0 ? works.length - 1 : currentIndex - 1;
  updateLightbox(prevIndex);
  currentWorkId = works[prevIndex]?.id || null;
  openedAt = Date.now();
}

function showNext() {
  if (works.length === 0) return;

  saveViewTime();

  const nextIndex = currentIndex === works.length - 1 ? 0 : currentIndex + 1;
  updateLightbox(nextIndex);
  currentWorkId = works[nextIndex]?.id || null;
  openedAt = Date.now();
}

function createGalleryImage(work, index) {
  const img = document.createElement("img");

  img.src = window.PortfolioCMS?.optimizeImageUrl(work.imageUrl, "gallery") || work.imageUrl || "";
  img.alt = createImageAltText(work, index);
  img.dataset.index = String(index);
  img.loading = "lazy";
  img.decoding = "async";

  img.addEventListener("click", () => {
    openLightbox(index);
  });

  return img;
}

function renderGallery(items) {
  if (!gallery) {
    console.error('[Photography] ".gallery" element was not found.');
    return;
  }

  gallery.innerHTML = "";

  items.forEach((work, index) => {
    gallery.appendChild(createGalleryImage(work, index));
  });
}

async function fetchWorks() {
  if (!window.PortfolioCMS?.fetchPortfolioWorks) {
    console.error("[Photography] PortfolioCMS helper is not available.");
    return [];
  }

  try {
    const fetchedWorks = await window.PortfolioCMS.fetchPortfolioWorks();

    // Keep the existing behavior: newer works appear first.
    return [...fetchedWorks].reverse();
  } catch (error) {
    console.error("[Photography] Failed to fetch works from microCMS:", error);
    return [];
  }
}

async function initGalleryPage() {
  works = await fetchWorks();
  renderGallery(works);
}

if (closeBtn) {
  closeBtn.addEventListener("click", closeLightbox);
}

if (prevBtn) {
  prevBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    showPrev();
  });
}

if (nextBtn) {
  nextBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    showNext();
  });
}

if (lightbox) {
  lightbox.addEventListener("click", (event) => {
    const clickedOutsideDialog =
      event.target === lightbox ||
      (!event.target.closest("#lightbox-img") &&
        !event.target.closest(".arrow") &&
        !event.target.closest("#close"));

    if (clickedOutsideDialog) {
      closeLightbox();
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (!lightbox?.classList.contains("active")) return;

  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") showPrev();
  if (event.key === "ArrowRight") showNext();
});

let touchStartX = 0;

if (lightboxImg) {
  lightboxImg.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0]?.screenX || 0;
  });

  lightboxImg.addEventListener("touchend", (event) => {
    const touchEndX = event.changedTouches[0]?.screenX || 0;
    const diff = touchEndX - touchStartX;

    // Treat short movement as a normal tap, not as a swipe.
    if (Math.abs(diff) < 50) return;

    if (diff > 0) {
      showPrev();
      return;
    }

    showNext();
  });
}

initGalleryPage();
