const landing = document.getElementById("landing");
const train = document.getElementById("train");

const enterBtn = document.getElementById("enterBtn");
const playBtn = document.getElementById("playBtn");
const lightBtn = document.getElementById("lightBtn");

const lamp = document.getElementById("lamp");
const clock = document.getElementById("clock");
const journeyTime = document.getElementById("journeyTime");
const statusText = document.getElementById("status");

const sleepTimer = document.getElementById("sleepTimer");
const eventMessage = document.getElementById("eventMessage");
const cityLights = document.getElementById("cityLights");

const trainVolume = document.getElementById("trainVolume");
const rainVolume = document.getElementById("rainVolume");
const windVolume = document.getElementById("windVolume");

const timerButtons = document.querySelectorAll(".timers button");


let playing = false;
let journeySeconds = 0;

let journeyInterval = null;
let sleepInterval = null;

let sleepSeconds = 0;

let fictionalMinutes = 47;
let fictionalHour = 23;

let cabinLightOn = true;


/* =========================
   ENTER TRAIN
========================= */

enterBtn.addEventListener("click", function () {

    landing.classList.add("hidden");

    train.classList.remove("hidden");

    document.body.style.overflow = "hidden";

    playing = true;

    train.classList.remove("paused");

    playBtn.textContent = "Ⅱ";

    statusText.textContent = "DEPARTING...";

    startJourney();

    showRandomEvent();

});


/* =========================
   PLAY / PAUSE
========================= */

playBtn.addEventListener("click", function () {

    if (playing) {

        playing = false;

        train.classList.add("paused");

        playBtn.textContent = "▶";

        statusText.textContent = "PAUSED";

    } else {

        playing = true;

        train.classList.remove("paused");

        playBtn.textContent = "Ⅱ";

        statusText.textContent = "TRAVELLING...";

    }

});


/* =========================
   JOURNEY TIMER
========================= */

function startJourney() {

    clearInterval(journeyInterval);

    journeyInterval = setInterval(function () {

        if (!playing) return;

        journeySeconds++;

        updateJourneyTime();

        updateClock();

    }, 1000);

}


function updateJourneyTime() {

    const minutes =
        Math.floor(journeySeconds / 60);

    const seconds =
        journeySeconds % 60;

    journeyTime.textContent =
        String(minutes).padStart(2, "0") +
        ":" +
        String(seconds).padStart(2, "0");

}


/* =========================
   CLOCK
========================= */

function updateClock() {

    fictionalMinutes++;

    if (fictionalMinutes >= 60) {

        fictionalMinutes = 0;

        fictionalHour++;

    }

    if (fictionalHour >= 24) {

        fictionalHour = 0;

    }

    const displayHour =
        fictionalHour === 0
            ? 12
            : fictionalHour > 12
                ? fictionalHour - 12
                : fictionalHour;

    const period =
        fictionalHour >= 12
            ? "PM"
            : "AM";

    clock.textContent =
        String(displayHour).padStart(2, "0") +
        ":" +
        String(fictionalMinutes).padStart(2, "0") +
        " " +
        period;

}


/* =========================
   CABIN LIGHT
========================= */

lightBtn.addEventListener("click", function () {

    cabinLightOn = !cabinLightOn;

    lamp.style.opacity =
        cabinLightOn ? "0.42" : "0.05";

    lightBtn.textContent =
        cabinLightOn ? "☼" : "◐";

});


/* =========================
   SLEEP TIMER
========================= */

timerButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        const minutes =
            Number(button.dataset.minutes);

        startSleepTimer(minutes);

    });

});


function startSleepTimer(minutes) {

    clearInterval(sleepInterval);

    sleepSeconds = minutes * 60;

    sleepTimer.classList.remove("hidden");

    statusText.textContent = "SLEEP MODE";

    updateSleepDisplay();

    sleepInterval = setInterval(function () {

        if (sleepSeconds <= 0) {

            clearInterval(sleepInterval);

            sleepTimer.classList.add("hidden");

            playing = false;

            train.classList.add("paused");

            playBtn.textContent = "▶";

            statusText.textContent =
                "JOURNEY COMPLETE";

            return;

        }

        sleepSeconds--;

        updateSleepDisplay();

    }, 1000);

}


function updateSleepDisplay() {

    const minutes =
        Math.floor(sleepSeconds / 60);

    const seconds =
        sleepSeconds % 60;

    sleepTimer.textContent =
        "SLEEP MODE · " +
        String(minutes).padStart(2, "0") +
        ":" +
        String(seconds).padStart(2, "0");

}


/* =========================
   RANDOM EVENTS
========================= */

const events = [

    "A distant light disappears into the rain.",

    "The train passes a sleeping village.",

    "A lonely platform flashes past.",

    "Rain grows heavier against the glass.",

    "The carriage gently sways.",

    "The night outside feels endless.",

    "Another station disappears behind you."

];


function showRandomEvent() {

    if (!playing) return;

    const randomIndex =
        Math.floor(Math.random() * events.length);

    eventMessage.textContent =
        events[randomIndex];

    eventMessage.classList.remove("hidden");

    eventMessage.style.animation = "none";

    void eventMessage.offsetWidth;

    eventMessage.style.animation =
        "eventFade 5s both";

    setTimeout(function () {

        eventMessage.classList.add("hidden");

    }, 5000);

}


setInterval(function () {

    if (playing) {

        showRandomEvent();

    }

}, 25000);


/* =========================
   CITY LIGHTS
========================= */

function createCityLights() {

    cityLights.innerHTML = "";

    for (let i = 0; i < 45; i++) {

        const light =
            document.createElement("div");

        light.className = "city-light";

        light.style.left =
            Math.random() * 100 + "%";

        light.style.top =
            Math.random() * 90 + "%";

        const size =
            Math.random() * 3 + 2;

        light.style.width =
            size + "px";

        light.style.height =
            size + "px";

        light.style.opacity =
            Math.random() * 0.7 + 0.2;

        cityLights.appendChild(light);

    }

}


/* =========================
   INITIALIZE
========================= */

createCityLights();

train.classList.add("paused");
