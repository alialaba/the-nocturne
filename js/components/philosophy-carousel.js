"use strict"
const philosophy = document.querySelector(".philosophy")
const track = document.querySelector(".philosophy__cards-track");
const cards = [...document.querySelectorAll(".philosophy-card")];
const dots = [...document.querySelectorAll(".dot")];

let currentIndex = 0;
let autoTimer = null;
let isPhilosophyVisible = false;

let interactionTimer = null;

const carouselBreakpoint = window.matchMedia("(max-width: 1024px)");

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)")


const updateDots = (index) => {
    dots.forEach((dot, i) => dot.classList.toggle("active", i == index));
}

const scrollToCard = (index) => {
    const card = cards[index];

    track.scrollTo({
        left: card.offsetLeft,
        behavior: reduceMotion.matches ? "auto" : "smooth"
    })
}

const startAutoPlay = () => {
    if (!carouselBreakpoint.matches) return;
    if (reduceMotion.matches) return;

    if (!isPhilosophyVisible) return

    /* Prevent multiple intervals */
    if (autoTimer) return;

    autoTimer = setInterval(() => {
        currentIndex = (currentIndex + 1) % cards.length;
        updateDots(currentIndex);
        scrollToCard(currentIndex);

    }, 6000)
}

const stopAutoPlay = () => {
    clearInterval(autoTimer);
    autoTimer = null;
}




const philosophyObserver = new IntersectionObserver((entries) => {
    const entry = entries[0];

    if (entry.isIntersecting) {
        isPhilosophyVisible = true
        startAutoPlay();
    } else {
        isPhilosophyVisible = false;
        stopAutoPlay();
    }
}, { threshold: 0.4 })


philosophyObserver.observe(philosophy)



const pauseForInteraction = () => {
    stopAutoPlay();
}

const resumeAfterInteraction = () => {
    clearTimeout(interactionTimer);

    interactionTimer = setTimeout(() => {
        startAutoPlay()
    }, 1200);

}
/* ── Touch */
track.addEventListener("touchstart", pauseForInteraction, { passive: true })
track.addEventListener("touchend", resumeAfterInteraction, { passive: true })
/* Pointer support */

track.addEventListener("pointerdown", pauseForInteraction);
track.addEventListener("pointerup", resumeAfterInteraction);
