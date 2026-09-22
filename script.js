/* =========================
   LAST TRAIN
   Main Experience Script
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
const rain = document.getElementById("rain");

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


/* =========================
   AUDIO
========================= */

const audio = {
  train: new Audio("assets/audio/train.mp3"),
  rain: new Audio("assets/audio/rain.mp3"),
  wind: new Audio("assets/audio/wind.mp3")
};

Object.values(audio).forEach(sound => {
  sound.loop = true;
  sound.preload = "auto";
});


/* =========================
   LOCAL STORAGE
========================= */

function loadPreferences() {

  const savedTrain = localStorage.getItem("lastTrainTrainVolume");
  const savedRain = localStorage.getItem("lastTrainRainVolume");
  const savedWind = localStorage.getItem("lastTrainWindVolume");

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


function updateAudioVolumes() {

  audio.train.volume = Number(trainVolume.value) / 100;
  audio.rain.volume = Number(rainVolume.value) / 100;
  audio.wind.volume = Number(windVolume.value) / 100;

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
   CITY LIGHTS
========================= */

function createCityLights() {

  cityLights.innerHTML = "";

  for (let i = 0; i < 45; i++) {

    const light = document.createElement("div");

    light.className = "city-light";

    light.style.left = Math.random() * 100 + "%";
    light.style.top = Math.random() * 90 + "%";

    const size = Math.random() * 3 + 2;

    light.style.width = size + "px";
    light.style.height = size + "px";

    light.style.opacity =
      Math.random() * 0.7 + 0.2;

    cityLights.appendChild(light);
  }
}


/* =========================
   ENTER TRAIN
========================= */

enterBtn.addEventListener("click", () => {

  landing.classList.add("hidden");
  train.classList.remove("hidden");

  document.body.style.overflow = "hidden";

  playing = true;

  train.classList.remove("paused");

  playBtn.textContent = "Ⅱ";

  statusText.textContent = "DEPARTING...";

  startJourney();

  startAudio();

  showRandomEvent();
});


/* =========================
   AUDIO START
========================= */

function startAudio() {

  updateAudioVolumes();

  Object.values(audio).forEach(sound => {

    sound.play().catch(() => {
      // Audio files may not exist yet.
      // The visual experience will still work.
    });

  });
}


function pauseAudio() {

  Object.values(audio).forEach(sound => {
    sound.pause();
  });

}


/* =========================
   PLAY / PAUSE
========================= */

playBtn.addEventListener("click", () => {

  if (playing) {

    pauseJourney();

  } else {

    resumeJourney();

  }

});


function startJourney() {

  if (journeyInterval) {
    clearInterval(journeyInterval);
  }

  journeyInterval = setInterval(() => {

    if (!playing) return;

    journeySeconds++;

    updateJourneyTime();
    updateClock();

  }, 1000);
}


function pauseJourney() {

  playing = false;

  train.classList.add("paused");

  playBtn.textContent = "▶";

  statusText.textContent = "PAUSED";

  pauseAudio();

}


function resumeJourney() {

  playing = true;

  train.classList.remove("paused");

  playBtn.textContent = "Ⅱ";

  statusText.textContent = "TRAVELLING...";

  startAudio();

}


/* =========================
   JOURNEY TIMER
========================= */

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
    String(displayHour).padStart(2, "0") +
    ":" +
    String(fictionalMinutes).padStart(2, "0") +
    " " +
    period;
}


/* =========================
   CABIN LIGHT
========================= */

let cabinLightOn = true;

lightBtn.addEventListener("click", () => {

  cabinLightOn = !cabinLightOn;

  lamp.style.opacity =
    cabinLightOn ? "0.42" : "0.05";

  lightBtn.textContent =
    cabinLightOn ? "☼" : "◐";

});


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

timerButtons.forEach(button => {

  button.addEventListener("click", () => {

    const minutes =
      Number(button.dataset.minutes);

    startSleepTimer(minutes);

  });

});


function startSleepTimer(minutes) {

  clearInterval(sleepInterval);

  sleepSeconds = minutes * 60;

  sleepTimer.classList.remove("hidden");

  updateSleepDisplay();

  sleepInterval = setInterval(() => {

    if (sleepSeconds <= 0) {

      clearInterval(sleepInterval);

      sleepTimer.classList.add("hidden");

      pauseJourney();

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
   RANDOM ATMOSPHERIC EVENTS
========================= */

const events = [

  "A distant light disappears into the rain.",

  "The train passes a sleeping village.",

  "For a moment, the window becomes completely dark.",

  "A lonely platform flashes past.",

  "Rain grows heavier against the glass.",

  "Somewhere in the distance, a signal turns green.",

  "The carriage gently sways.",

  "A faint light moves across the window.",

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

  // Restart animation
  eventMessage.style.animation = "none";

  void eventMessage.offsetWidth;

  eventMessage.style.animation =
    "eventFade 5s both";

  setTimeout(() => {

    eventMessage.classList.add("hidden");

  }, 5000);

}


/* New event every 25 seconds */

setInterval(() => {

  if (playing) {
    showRandomEvent();
  }

}, 25000);


/* =========================
   INITIALIZATION
========================= */

createCityLights();
loadPreferences();

train.classList.add("paused");
