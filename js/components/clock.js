"use strict";

const clock = document.querySelector("[data-clock]");
const markersContainer = document.querySelector("[data-clock-markers]");
const hourHand = document.querySelector("[data-clock-hour]");
const minuteHand = document.querySelector("[data-clock-minute]")
const secondHand = document.querySelector("[data-clock-second]")

/* ---------------------------------------------
   CREATE 12 HOUR MARKERS
--------------------------------------------- */
for (let hour = 1; hour <= 12; hour++) {
    const marker = document.createElement("span");
    marker.className = "analog-clock__marker";
    marker.dataset.hour = hour;
    marker.style.setProperty("--hour", hour)

    markersContainer.appendChild(marker);
}

const markers = document.querySelectorAll(".analog-clock__marker");
// console.log(markers)
/* =========================================================
   UPDATE CLOCK
   ========================================================= */

function updateClock() {
    const now = new Date();

    const seconds = now.getSeconds();
    const milliSeconds = now.getMilliseconds();
    const minutes = now.getMinutes();
    const hours = now.getHours() % 12;


    const secondAngle = (seconds + milliSeconds / 1000) * 6;
    const minuteAngle = (minutes + seconds / 60) * 6;
    const hourAngle = (hours + minutes / 60) * 30;


    secondHand.style.transform = `translateX(-50%) rotate(${secondAngle}deg)`;
    minuteHand.style.transform = `translateX(-50%) rotate(${minuteAngle}deg)`;
    hourHand.style.transform = `translateX(-50%) rotate(${hourAngle}deg)`;
    requestAnimationFrame(updateClock);
}
updateClock();