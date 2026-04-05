const images = document.querySelectorAll(".gallery img");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const closeBtn = document.getElementById("close");
const prevBtn = document.querySelector(".left");
const nextBtn = document.querySelector(".right");
const cameraEl = document.getElementById("camera");
const settingsEl = document.getElementById("settings");

let current = 0;
let startTime = null;

const STORAGE_KEY = "imageViewTimes";

// localStorageから取得
function getViewTimes() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
}

// localStorageへ保存
function saveViewTimes(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// 現在の画像の閲覧時間を記録
function recordTime(index) {
  if (startTime === null) return;

  const duration = Date.now() - startTime;
  const viewTimes = getViewTimes();

  if (!viewTimes[index]) {
    viewTimes[index] = 0;
  }

  viewTimes[index] += duration;
  saveViewTimes(viewTimes);

  startTime = null;
}

// ライトボックスを開く
function openLightbox(index) {
  current = index;
  lightbox.classList.add("active");
  updateLightbox();
  startTime = Date.now();
}

// ライトボックスを閉じる
function closeLightbox() {
  recordTime(current);
  lightbox.classList.remove("active");
}

// 次の画像へ
function showNext() {
  recordTime(current);
  current = (current + 1) % images.length;
  updateLightbox();
  startTime = Date.now();
}

// 前の画像へ
function showPrev() {
  recordTime(current);
  current = (current - 1 + images.length) % images.length;
  updateLightbox();
  startTime = Date.now();
}

// 表示内容を更新
function updateLightbox() {
  const img = images[current];
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt || "";

  const manualCamera = img.getAttribute("data-camera");
  const manualSettings = img.getAttribute("data-settings");

  // 手入力データがある場合はそれを優先
  if (manualCamera) {
    cameraEl.textContent = manualCamera;
    settingsEl.textContent = manualSettings || "";
    return;
  }

  // 手入力がない場合はEXIFを自動取得
  cameraEl.textContent = "Loading...";
  settingsEl.textContent = "";

  EXIF.getData(img, function () {
    const make = EXIF.getTag(this, "Make");
    const model = EXIF.getTag(this, "Model");
    const fNumber = EXIF.getTag(this, "FNumber");
    const shutter = EXIF.getTag(this, "ExposureTime");
    const iso = EXIF.getTag(this, "ISOSpeedRatings");

    if (make || model) {
      cameraEl.textContent = `${make || ""} ${model || ""}`.trim();
      settingsEl.textContent = `f/${fNumber || "-"}  ${formatShutter(shutter)}s  ISO${iso || "-"}`;
    } else {
      cameraEl.textContent = "No EXIF data";
      settingsEl.textContent = "";
    }
  });
}

// シャッタースピードを整形
function formatShutter(speed) {
  if (!speed) return "-";
  if (speed < 1) return `1/${Math.round(1 / speed)}`;
  return speed;
}

// 画像クリックで開く
images.forEach((img, index) => {
  img.addEventListener("click", () => {
    openLightbox(index);
  });
});

// 閉じるボタン
if (closeBtn) {
  closeBtn.addEventListener("click", () => {
    lightbox.classList.remove("active");
  });
}

// 背景クリックで閉じる
if (lightbox) {
  lightbox.addEventListener("click", (e) => {
    // 背景そのものを押した時だけ閉じる
    if (e.target === lightbox) {
      lightbox.classList.remove("active");
    }
  });
}

// ESCキーで閉じる
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    lightbox.classList.remove("active");
  }
});

// 次へ
nextBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  showNext();
});

// 前へ
prevBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  showPrev();
});

// キーボード操作
document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("active")) return;

  if (e.key === "ArrowRight") showNext();
  if (e.key === "ArrowLeft") showPrev();
  if (e.key === "Escape") closeLightbox();
});