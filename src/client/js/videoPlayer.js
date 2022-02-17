const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const time = document.getElementById("time");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
let volumeValue = 0.5;
video.volume = volumeValue;

const handlePlayClick = (event) => {
  // if the video is playing, pause it
  if (video.paused) {
    video.play();
  }
  // else play the video
  else {
    video.pause();
  }
  playBtn.innerText = video.paused ? "Play" : "Pause";
};

const handleMute = (event) => {
  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  }
  muteBtn.innerText = video.muted ? "Unmute" : "Mute";
  if (volumeValue === 0) {
    volumeRange.value = video.muted ? 0 : 0.5;
  } else {
    volumeRange.value = video.muted ? 0 : volumeValue;
  }
};

const handleVolumeChange = (event) => {
  const {
    target: { value },
  } = event;
  if (video.muted) {
    video.muted = false;
    muteBtn.innerText = "Mute";
  }
  volumeValue = Number(value);
  video.volume = value;
  if (volumeValue === 0) {
    video.muted = true;
    muteBtn.innerText = "Unmute";
  }
};

const formatTimeLong = (seconds) =>
  new Date(seconds * 1000).toISOString().substr(11, 8);

const formatTimeShort = (seconds) =>
  new Date(seconds * 1000).toISOString().substr(14, 5);

const handleLoadedMetadata = () => {
  if (video.currentTime > 3600) {
    totalTime.innerText = formatTimeLong(Math.floor(video.duration));
  } else {
    totalTime.innerText = formatTimeShort(Math.floor(video.duration));
  }
};

const handleTimeUpdate = () => {
  console.log(video.currentTime);
  if (video.currentTime > 3600) {
    currentTime.innerText = formatTimeLong(Math.floor(video.currentTime));
  } else {
    currentTime.innerText = formatTimeShort(Math.floor(video.currentTime));
  }
};

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
