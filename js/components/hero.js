"use strict"

/* =========================================================
 HERO
 ========================================================= */

const hero = document.querySelector(".hero");
const countdownLabel = document.querySelector("[data-countdown-label]");
const countdownMessage = document.querySelector("[data-countdown-message]");
const clockMarkers = document.querySelectorAll(".analog-clock__marker")
const countdownLabelCurrent = document.querySelector(".hero-countdown__label-current");
const countdownMessageCurrent = document.querySelector(".hero-countdown__message-current");


const HERO_TIMING = {

    exit: 700,

    gap: 250,

    clockStart: 250,

    clockStep: 110,

    contentChange: 500,

    buttonEnter: 500,

    titleEnter: 650,

};
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}


//    async function lightNightMarkers() {
//     const nightHours = [12,11,10,9,8,7,6];
//     for (const hour of nightHours) {
//         const marker = document.querySelector(`.analog-clock__marker[data-hour="${hour}"]`);
//          if (!marker) continue;
//         marker?.classList.add("is-night")


//     await wait(
//             HERO_TIMING.clockStep
//         );
//     }

//    }
async function lightNightMarkers() {

    const nightHours = [

        12,
        11,
        10,
        9,
        8,
        7,
        6,

    ];


    for (
        const hour
        of nightHours
    ) {

        const marker =
            document.querySelector(
                `.analog-clock__marker[data-hour="${hour}"]`
            );


        if (!marker) continue;


        marker.classList.add(
            "is-night"
        );


        await wait(
            HERO_TIMING.clockStep
        );

    }

}


// async function resetNightMarkers() {
//     const nightHours = [6, 7, 8, 9, 10, 11, 12];
//     for (const hour of nightHours) {
//         const marker = document.querySelector(`.analog-clock__marker[data-hour="${hour}"]`)
//         if (!marker) continue;

//         marker?.classList.remove("is-night")
//         await wait(80);
//     }
// }


async function resetNightMarkers() {

    const nightHours = [

        6,
        7,
        8,
        9,
        10,
        11,
        12,

    ];


    for (
        const hour
        of nightHours
    ) {

        const marker =
            document.querySelector(
                `.analog-clock__marker[data-hour="${hour}"]`
            );


        if (!marker) continue;


        marker.classList.remove(
            "is-night"
        );


        await wait(80);

    }

}



/* ==================================================
   TRANSITION TO NIGHT
================================================== */

async function transitionToNight() {

    /*
     * ----------------------------------------------
     * 1. PRIMARY SCENE STARTS EXITING
     * ----------------------------------------------
     */

    hero.dataset.heroState =
        "night";


    /*
     * ----------------------------------------------
     * 2. WAIT BEFORE CLOCK STARTS
     * ----------------------------------------------
     */

    await wait(
        HERO_TIMING.clockStart
    );


    /*
     * ----------------------------------------------
     * 3. START CLOCK SWEEP
     * ----------------------------------------------
     */

    const clockAnimation =
        lightNightMarkers();


    /*
     * ----------------------------------------------
     * 4. CHANGE COUNTDOWN COPY
     * ----------------------------------------------
     */

    await wait(250);


    /*
     * Add transition class.
     * The CSS handles the movement.
     */

    hero.classList.add(
        "countdown-changing"
    );


    await wait(200);


    /*
     * Text content already exists in HTML,
     * so no innerText replacement is required.
     */


    hero.classList.remove(
        "countdown-changing"
    );


    /*
     * ----------------------------------------------
     * 5. WAIT FOR CLOCK
     * ----------------------------------------------
     */

    await clockAnimation;

}


/* ==================================================
   TRANSITION BACK TO INTRO
================================================== */

async function transitionToIntro() {

    /*
     * ----------------------------------------------
     * 1. CHANGE HERO STATE
     * ----------------------------------------------
     */

    hero.dataset.heroState =
        "intro";


    /*
     * ----------------------------------------------
     * 2. RESET CLOCK
     * ----------------------------------------------
     */

    await wait(400);


    await resetNightMarkers();

}


/* ==================================================
   MAIN HERO LOOP
================================================== */

async function runHeroAnimation() {

    while (true) {

        /*
         * ==========================================
         * INTRO STATE
         * ==========================================
         */

        hero.dataset.heroState =
            "intro";


        /*
         * Let visitor enjoy initial state.
         */

        await wait(6500);


        /*
         * ==========================================
         * NIGHT TRANSITION
         * ==========================================
         */

        await transitionToNight();


        /*
         * ==========================================
         * NIGHT STATE
         * ==========================================
         */

        await wait(5000);


        /*
         * ==========================================
         * RETURN TO INTRO
         * ==========================================
         */

        await transitionToIntro();


        /*
         * ==========================================
         * BREATHING SPACE
         * ==========================================
         */

        await wait(2500);

    }

}


/* ==================================================
   REDUCED MOTION
================================================== */

const prefersReducedMotion =
    window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


if (!prefersReducedMotion) {

    runHeroAnimation();

}