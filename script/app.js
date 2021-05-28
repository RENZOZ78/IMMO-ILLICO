
/*SLIDER AVEC CHEVRON*/
// Quand je clique sur les chevrons, ca ramene sur l'image suivante ou sur l'image precedente

const itemsSlide = document.querySelectorAll('.container-slides img');
const nbSlide = itemsSlide.length;
const suivant = document.querySelector('.right');
const precedent = document.querySelector('.left');
let count = 0;

suivant.addEventListener('click', slideSuivante);

function slideSuivante(){
    itemsSlide[count].classList.remove('active');

    if(count < nbSlide - 1){
        count++;
    }else{
        count = 0;
    }

    itemsSlide[count].classList.add('active');
}

precedent.addEventListener('click', slidePrecedente)

function slidePrecedente(){
    itemsSlide[count].classList.remove('active');

    if (count > 0){
        count--;
    }else{
        count = nbSlide - 1;
    }
    itemsSlide[count].classList.add('active');
}

// TITRE ANIMATION

// Wrap every letter in a span
var textWrapper = document.querySelector('.titre-site');
var textIcon = document.querySelector('.incon-img');
textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");
// textIcon.innerHTML = textIcon.textContent.replace(/\S/g, "<span class='img'>$&</span>");

anime.timeline({loop: true})
    .add({
        targets: '.titre-site .letter',
        scale: [4,1],
        opacity: [0,1],
        translateZ: 0,
        easing: "easeOutExpo",
        duration: 950,
        delay: (el, i) => 70*i
    }).add({
    targets: '.titre-site',
    opacity: 0,
    duration: 1000,
    easing: "easeOutExpo",
    delay: 1000
});

// anime.timeline({loop: true})
//     .add({
//             targets: '.icon-img .img',
//             scale: [4,1],
//             opacity: [0,1],
//             translateZ: 0,
//             easing: "easeOutExpo",
//             duration: 950,
//             delay: (el, i) => 70*i
//         }).add({
//         targets: '.icon-img',
//         opacity: 0,
//         duration: 1000,
//         easing: "easeOutExpo",
//         delay: 1000
//     });

