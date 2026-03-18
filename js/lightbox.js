const images = document.querySelectorAll(".gallery img");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const closeBtn = document.getElementById("close");
const prev = document.querySelector(".left");
const next = document.querySelector(".right");
const cameraEl = document.getElementById("camera");
const settingsEl = document.getElementById("settings");

let current = 0;

// クリックで開く
images.forEach((img, index) => {
  img.addEventListener("click", () => {
    lightbox.classList.add("active");
    current = index;
    // クリック時も関数を呼び出すように統一！
    updateLightbox(img);
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
  current = (current + 1) % images.length;
  updateLightbox(images[current]);
});

// 前へ
prev.addEventListener("click", (e) => {
  e.stopPropagation();
  current = (current - 1 + images.length) % images.length;
  updateLightbox(images[current]);
});

// キーボード操作
document.addEventListener("keydown", (e) => {
  if(!lightbox.classList.contains("active")) return;
  if(e.key === "ArrowRight") next.click();
  if(e.key === "ArrowLeft") prev.click();
  if(e.key === "Escape") lightbox.classList.remove("active");
});

// --- 表示を更新する関数（手入力優先＋自動取得） ---
function updateLightbox(img) {
  lightboxImg.src = img.src;

  const manualCamera = img.getAttribute("data-camera");
  const manualSettings = img.getAttribute("data-settings");

  if (manualCamera) {
    // 手入力があればそれを表示
    cameraEl.textContent = manualCamera;
    settingsEl.textContent = manualSettings || "";
  } else {
    // 手入力がない場合は自動取得
    cameraEl.textContent = "Loading...";
    settingsEl.textContent = "";

    EXIF.getData(img, function() {
      const make = EXIF.getTag(this, "Make");
      const model = EXIF.getTag(this, "Model");
      const f = EXIF.getTag(this, "FNumber");
      const shutter = EXIF.getTag(this, "ExposureTime");
      const iso = EXIF.getTag(this, "ISOSpeedRatings");

      if (make || model) {
        cameraEl.textContent = `${make || ""} ${model || ""}`;
        settingsEl.textContent = `f/${f || "-"}  ${formatShutter(shutter)}s  ISO${iso || "-"}`;
      } else {
        cameraEl.textContent = "No EXIF data";
        settingsEl.textContent = "";
      }
    });
  }
}

// シャッタースピードを 1/xxx 表記に変換
function formatShutter(speed){
  if(!speed) return "-";
  if(speed < 1) return `1/${Math.round(1/speed)}`;
  return speed;
}