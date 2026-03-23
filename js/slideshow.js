const images = [
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

let currentIndex = 0;

const slide1 = document.getElementById("slide1");
const slide2 = document.getElementById("slide2");

let isFirstVisible = true;

// 初期画像セット
slide1.src = images[currentIndex];

// スライド更新
function updateSlide() {
  currentIndex = (currentIndex + 1) % images.length;

  const currentImage = images[currentIndex];

  if (isFirstVisible) {
    slide2.src = currentImage;
    slide2.classList.add("active");
    slide1.classList.remove("active");
  } else {
    slide1.src = currentImage;
    slide1.classList.add("active");
    slide2.classList.remove("active");
  }

  isFirstVisible = !isFirstVisible;
}

// スライド開始
setInterval(updateSlide, 4000);