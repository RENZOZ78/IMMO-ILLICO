// SILDER PORTFOLIO

const sliderPortfolio = document.querySelector('.slider-portfolio');
const srcEnCoursSlider = document.querySelector('.img-visible-slider');
const allPicsPortfolio = Array.from(document.querySelectorAll('.grid-item img'));
const rightPortfolio = document.querySelector('.btn-right');
const leftPortfolio = document.querySelector('.btn-left');
const fermerSlide = document.querySelector('.btn-fermer-slider');

let photoEnCours;
let indexEnCours;

//on veut que lorsqu'on clique sur une image, => elle s'affiche en grand
//dans le tableau array, on va savoir quelle photo exact on est en train de regarder
allPicsPortfolio.forEach(item =>{
item.addEventListener('click', (e) =>{

    sliderPortfolio.style.display = "block";
    srcEnCoursSlider.src = e.target.src;
    photoEnCours = e.target;
    indexEnCours = allPicsPortfolio.indexOf(photoEnCours);
})
})

//DIRECTION DES BOUTONS
//a partir de l'index 11 il ya un reset

rightPortfolio.addEventListener('click',() =>{
    if(indexEnCours === 11){
        indexEnCours = 0;
        srcEnCoursSlider.src = allPicsPortfolio[indexEnCours + 1].src;
        photoEnCours = allPicsPortfolio[indexEnCours];
        return;
    }
    srcEnCoursSlider.src = allPicsPortfolio[indexEnCours + 1].src;
    photoEnCours = allPicsPortfolio[indexEnCours + 1];
    indexEnCours = allPicsPortfolio.indexOf(photoEnCours);
})

leftPortfolio.addEventListener('click', () =>{
    if (indexEnCours === 0){
        indexEnCours = 11;
        srcEnCoursSlider.src = allPicsPortfolio[indexEnCours - 1].src;
        photoEnCours = allPicsPortfolio[indexEnCours];
        return;
    }
    srcEnCoursSlider.src = allPicsPortfolio[indexEnCours - 1].src;
    photoEnCours = allPicsPortfolio[indexEnCours - 1];
    indexEnCours = allPicsPortfolio.indexOf(photoEnCours);
})

//fermer le slide quand on a envie de le quitter
fermerSlide.addEventListener('click',() => {sliderPortfolio.style.display = "none";
})