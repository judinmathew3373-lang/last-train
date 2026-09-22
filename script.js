/* =========================
   LAST TRAIN — FINAL V2
   Cinematic Train + Audio
========================= */

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


/* =========================
   STATE
========================= */

let playing = false;

let journeySeconds = 0;

let journeyInterval = null;
let sleepInterval = null;

let sleepSeconds = 0;

let fictionalMinutes = 47;
let fictionalHour = 23;

let cabinLightOn = true;

let eventTimeout = null;


/* =========================
   AUDIO
========================= */

const audio = {

    train: new Audio("assets/audio/train.wav"),

    rain: new Audio("assets/audio/rain.wav"),

    passingTrain:
        new Audio("assets/audio/passing-train.wav"),

    horn:
        new Audio("assets/audio/horn.wav"),

    atmosphere:
        new Audio("assets/audio/atmosphere.mp3")

};


audio.train.loop = true;
audio.rain.loop = true;
audio.atmosphere.loop = true;

audio.passingTrain.loop = false;
audio.horn.loop = false;


Object.values(audio).forEach(sound => {

    sound.preload = "auto";

});


/* =========================
   AUDIO VOLUME
========================= */

function updateAudioVolumes() {

    const trainLevel =
        Number(trainVolume.value) / 100;

    const rainLevel =
        Number(rainVolume.value) / 100;

    const windLevel =
        Number(windVolume.value) / 100;


    audio.train.volume =
        trainLevel * 0.70;

    audio.rain.volume =
        rainLevel * 0.65;

    /*
      WIND slider controls the
      long atmospheric layer.
    */

    audio.atmosphere.volume =
        windLevel * 0.25;


    /*
      Event sounds
    */

    audio.passingTrain.volume = 0.75;

    audio.horn.volume = 0.50;


    /* Save preferences */

    localStorage.setItem(
        "lastTrainTrainVolume",
        trainVolume.value
    );

    localStorage.setItem(
        "lastTrainRainVolume",
        rainVolume.value
    );

    localStorage.setItem(
        "lastTrainWindVolume",
        windVolume.value
    );
}


/* =========================
   LOAD SAVED SETTINGS
========================= */

function loadPreferences() {

    const savedTrain =
        localStorage.getItem(
            "lastTrainTrainVolume"
        );

    const savedRain =
        localStorage.getItem(
            "lastTrainRainVolume"
        );

    const savedWind =
        localStorage.getItem(
            "lastTrainWindVolume"
        );


    if (savedTrain !== null) {
        trainVolume.value = savedTrain;
    }

    if (savedRain !== null) {
        rainVolume.value = savedRain;
    }

    if (savedWind !== null) {
        windVolume.value = savedWind;
    }


    updateAudioVolumes();
}


/* =========================
   AUDIO START
========================= */

function startAudio() {

    updateAudioVolumes();


    audio.train
        .play()
        .catch(() => {});

    audio.rain
        .play()
        .catch(() => {});

    audio.atmosphere
        .play()
        .catch(() => {});
}


/* =========================
   AUDIO PAUSE
========================= */

function pauseAudio() {

    audio.train.pause();

    audio.rain.pause();

    audio.atmosphere.pause();

}


/* =========================
   AUDIO RESUME
========================= */

function resumeAudio() {

    audio.train
        .play()
        .catch(() => {});

    audio.rain
        .play()
        .catch(() => {});

    audio.atmosphere
        .play()
        .catch(() => {});
}


/* =========================
   FADE OUT
========================= */

function fadeOutAudio(duration = 4000) {

    const sounds = [

        audio.train,
        audio.rain,
        audio.atmosphere

    ];


    const originalVolumes =
        sounds.map(sound => sound.volume);


    const steps = 40;

    let step = 0;


    const fade =
        setInterval(() => {

            step++;


            sounds.forEach(
                (sound, index) => {

                    sound.volume =
                        originalVolumes[index] *
                        (1 - step / steps);

                }
            );


            if (step >= steps) {

                clearInterval(fade);


                sounds.forEach(sound => {

                    sound.pause();

                    sound.currentTime = 0;

                });


                updateAudioVolumes();

            }

        }, duration / steps);

}


/* =========================
   ENTER TRAIN
========================= */

enterBtn.addEventListener(
    "click",
    function () {

        landing.classList.add("hidden");

        train.classList.remove("hidden");

        document.body.style.overflow =
            "hidden";


        playing = true;

        train.classList.remove("paused");

        playBtn.textContent = "Ⅱ";

        statusText.textContent =
            "DEPARTING...";


        startJourney();

        startAudio();

        showRandomEvent();

    }
);


/* =========================
   PLAY / PAUSE
========================= */

playBtn.addEventListener(
    "click",
    function () {

        if (playing) {

            pauseJourney();

        } else {

            resumeJourney();

        }

    }
);


/* =========================
   PAUSE JOURNEY
========================= */

function pauseJourney() {

    playing = false;

    train.classList.add("paused");

    playBtn.textContent = "▶";

    statusText.textContent =
        "PAUSED";


    pauseAudio();

}


/* =========================
   RESUME JOURNEY
========================= */

function resumeJourney() {

    playing = true;

    train.classList.remove("paused");

    playBtn.textContent = "Ⅱ";

    statusText.textContent =
        "TRAVELLING...";


    resumeAudio();

}


/* =========================
   JOURNEY TIMER
========================= */

function startJourney() {

    clearInterval(journeyInterval);


    journeyInterval =
        setInterval(function () {

            if (!playing) return;


            journeySeconds++;

            updateJourneyTime();

            updateClock();


        }, 1000);

}


function updateJourneyTime() {

    const minutes =
        Math.floor(
            journeySeconds / 60
        );

    const seconds =
        journeySeconds % 60;


    journeyTime.textContent =

        String(minutes)
            .padStart(2, "0")

        +

        ":" +

        String(seconds)
            .padStart(2, "0");

}


/* =========================
   CINEMATIC CLOCK
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

        String(displayHour)
            .padStart(2, "0")

        +

        ":" +

        String(fictionalMinutes)
            .padStart(2, "0")

        +

        " " +

        period;

}


/* =========================
   CABIN LIGHT
========================= */

lightBtn.addEventListener(
    "click",
    function () {

        cabinLightOn =
            !cabinLightOn;


        lamp.style.opacity =
            cabinLightOn
                ? "0.42"
                : "0.05";


        lightBtn.textContent =
            cabinLightOn
                ? "☼"
                : "◐";

    }
);


/* =========================
   VOLUME CONTROLS
========================= */

trainVolume.addEventListener(
    "input",
    updateAudioVolumes
);

rainVolume.addEventListener(
    "input",
    updateAudioVolumes
);

windVolume.addEventListener(
    "input",
    updateAudioVolumes
);


/* =========================
   SLEEP TIMER
========================= */

timerButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            function () {

                const minutes =
                    Number(
                        button.dataset.minutes
                    );


                startSleepTimer(minutes);

            }
        );

    }
);


function startSleepTimer(minutes) {

    clearInterval(sleepInterval);


    sleepSeconds =
        minutes * 60;


    sleepTimer.classList.remove(
        "hidden"
    );


    statusText.textContent =
        "SLEEP MODE";


    updateSleepDisplay();


    sleepInterval =
        setInterval(
            function () {

                if (sleepSeconds <= 0) {

                    clearInterval(
                        sleepInterval
                    );


                    sleepTimer.classList.add(
                        "hidden"
                    );


                    playing = false;

                    train.classList.add(
                        "paused"
                    );


                    playBtn.textContent =
                        "▶";


                    statusText.textContent =
                        "JOURNEY COMPLETE";


                    fadeOutAudio(4000);


                    return;

                }


                sleepSeconds--;

                updateSleepDisplay();

            },
            1000
        );

}


function updateSleepDisplay() {

    const minutes =
        Math.floor(
            sleepSeconds / 60
        );

    const seconds =
        sleepSeconds % 60;


    sleepTimer.textContent =

        "SLEEP MODE · " +

        String(minutes)
            .padStart(2, "0")

        +

        ":" +

        String(seconds)
            .padStart(2, "0");

}


/* =========================
   ATMOSPHERIC EVENTS
========================= */

const events = [

    {
        text:
            "A distant light disappears into the rain.",
        sound: null
    },

    {
        text:
            "The train passes a sleeping village.",
        sound: null
    },

    {
        text:
            "For a moment, the window becomes completely dark.",
        sound: null
    },

    {
        text:
            "A lonely platform flashes past.",
        sound: "passingTrain"
    },

    {
        text:
            "Rain grows heavier against the glass.",
        sound: null
    },

    {
        text:
            "Somewhere in the distance, a signal turns green.",
        sound: "horn"
    },

    {
        text:
            "The carriage gently sways.",
        sound: null
    },

    {
        text:
            "A faint light moves across the window.",
        sound: null
    },

    {
        text:
            "The night outside feels endless.",
        sound: null
    },

    {
        text:
            "Another station disappears behind you.",
        sound: "passingTrain"
    },

    {
        text:
            "A distant train answers through the darkness.",
        sound: "horn"
    }

];


/* =========================
   RANDOM EVENT
========================= */

function showRandomEvent() {

    if (!playing) return;


    const randomIndex =
        Math.floor(
            Math.random() *
            events.length
        );


    const selected =
        events[randomIndex];


    eventMessage.textContent =
        selected.text;


    eventMessage.classList.remove(
        "hidden"
    );


    eventMessage.style.animation =
        "none";


    void eventMessage.offsetWidth;


    eventMessage.style.animation =
        "eventFade 5s both";


    clearTimeout(eventTimeout);


    eventTimeout =
        setTimeout(
            function () {

                eventMessage.classList.add(
                    "hidden"
                );

            },
            5000
        );


    /*
      Play event sound
    */

    if (
        selected.sound &&
        audio[selected.sound]
    ) {

        const sound =
            audio[selected.sound];


        sound.currentTime = 0;


        sound.play().catch(
            () => {}
        );

    }

}


/* =========================
   RANDOM EVENTS
========================= */

setInterval(
    function () {

        if (playing) {

            showRandomEvent();

        }

    },
    25000
);


/* =========================
   CITY LIGHTS
========================= */

function createCityLights() {

    cityLights.innerHTML = "";


    for (let i = 0; i < 45; i++) {

        const light =
            document.createElement("div");


        light.className =
            "city-light";


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


        cityLights.appendChild(
            light
        );

    }

}


/* =========================
   INITIALIZE
========================= */

createCityLights();

loadPreferences();

train.classList.add("paused");
