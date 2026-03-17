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

];

let index = 0;

const slide1 = document.getElementById("slide1");
const slide2 = document.getElementById("slide2");

let showingFirst = true;

function changeSlide(){

index++;

if(index >= images.length){
index = 0;
}

if(showingFirst){

slide2.src = images[index];
slide2.classList.add("active");
slide1.classList.remove("active");

}else{

slide1.src = images[index];
slide1.classList.add("active");
slide2.classList.remove("active");

}

showingFirst = !showingFirst;

}

setInterval(changeSlide,4000);