// gallery 内の画像をすべて取得
const images = document.querySelectorAll(".gallery img");

// lightbox要素
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");

// ボタン
const closeBtn = document.getElementById("close");
const prev = document.querySelector(".left");
const next = document.querySelector(".right");

// EXIF表示要素
const cameraEl = document.getElementById("camera");
const settingsEl = document.getElementById("settings");

let current = 0;

// クリックで開く
images.forEach((img, index) => {
  img.addEventListener("click", () => {
    lightbox.classList.add("active");
    lightboxImg.src = img.src;
    current = index;

    // EXIF取得
    EXIF.getData(img, function() {
      const make = EXIF.getTag(this, "Make");
      const model = EXIF.getTag(this, "Model");
      const f = EXIF.getTag(this, "FNumber");
      const shutter = EXIF.getTag(this, "ExposureTime");
      const iso = EXIF.getTag(this, "ISOSpeedRatings");

      cameraEl.textContent = `${make || ""} ${model || ""}`;
      settingsEl.textContent = `f/${f || "-"}  ${formatShutter(shutter)}s  ISO${iso || "-"}`;
    });
  });
});

// 閉じるボタン
closeBtn.addEventListener("click", () => {
  lightbox.classList.remove("active");
});

// 背景クリックでも閉じる
lightbox.addEventListener("click", (e) => {
  if(e.target === lightbox) lightbox.classList.remove("active");
});

// 次へ
next.addEventListener("click", (e) => {
  e.stopPropagation();
  current++;
  if(current >= images.length) current = 0;
  updateLightbox(images[current]);
});

// 前へ
prev.addEventListener("click", (e) => {
  e.stopPropagation();
  current--;
  if(current < 0) current = images.length - 1;
  updateLightbox(images[current]);
});

// キーボード操作
document.addEventListener("keydown", (e) => {
  if(!lightbox.classList.contains("active")) return;
  if(e.key === "ArrowRight") next.click();
  if(e.key === "ArrowLeft") prev.click();
  if(e.key === "Escape") lightbox.classList.remove("active");
});

// --- 関数で更新 ---
function updateLightbox(img) {
  lightboxImg.src = img.src;

  EXIF.getData(img, function() {
    const make = EXIF.getTag(this, "Make");
    const model = EXIF.getTag(this, "Model");
    const f = EXIF.getTag(this, "FNumber");
    const shutter = EXIF.getTag(this, "ExposureTime");
    const iso = EXIF.getTag(this, "ISOSpeedRatings");

    cameraEl.textContent = `${make || ""} ${model || ""}`;
    settingsEl.textContent = `f/${f || "-"}  ${formatShutter(shutter)}s  ISO${iso || "-"}`;
  });
}

// シャッタースピードを 1/xxx 表記に変換
function formatShutter(speed){
  if(!speed) return "-";
  if(speed < 1) return `1/${Math.round(1/speed)}`;
  return speed;
}

