const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");
//const time = document.getElementById("time");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const fullScreenIcon = fullScreenBtn.querySelector("i");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");
const textarea = document.querySelector("textarea");

let controlsTimeout = null;
let volumeValue = 0.5;
video.volume = volumeValue;

const handlePlayBtnClick = (event) => {
  // if the video is playing, pause it
  if (video.paused) {
    video.play();
  }
  // else play the video
  else {
    video.pause();
  }
  playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
};

const handleMute = (event) => {
  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  }
  muteBtnIcon.classList = video.muted ? "fas fa-volume-mute" : "fas fa-volume-up";
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
    muteBtnIcon.className = "fas fa-volume-up";
  }
  volumeValue = Number(value);
  video.volume = value;
  if (volumeValue === 0) {
    video.muted = true;
    muteBtnIcon.className = "fas fa-volume-mute";
  }
};

const formatTimeLong = (seconds) => new Date(seconds * 1000).toISOString().substr(11, 8);

const formatTimeShort = (seconds) => new Date(seconds * 1000).toISOString().substr(14, 5);

const handleLoadedMetadata = () => {
  if (video.duration > 3600) {
    totalTime.innerText = formatTimeLong(Math.floor(video.duration));
  } else {
    totalTime.innerText = formatTimeShort(Math.floor(video.duration));
  }
  timeline.max = Math.floor(video.duration);
};

const handleTimeUpdate = () => {
  if (video.currentTime > 3600) {
    currentTime.innerText = formatTimeLong(Math.floor(video.currentTime));
  } else {
    currentTime.innerText = formatTimeShort(Math.floor(video.currentTime));
  }
  timeline.value = Math.floor(video.currentTime);
};

const handleTimelineChange = (event) => {
  const {
    target: { value },
  } = event;
  video.currentTime = value;
};

const handleFullscreen = () => {
  const fullscreen = document.fullscreenElement;
  if (fullscreen) {
    document.exitFullscreen();
  } else {
    videoContainer.requestFullscreen();
  }
};

const handleFullScreenBtn = () => {
  const fullscreen = document.fullscreenElement;
  if (fullscreen) {
    fullScreenIcon.classList = "fas fa-compress";
  } else {
    fullScreenIcon.classList = "fas fa-expand";
  }
};

const handleFullScreenClick = () => {
  const fullscreen = document.fullscreenElement;
  if (fullscreen) {
    document.exitFullscreen();
  } else {
    videoContainer.requestFullscreen();
  }
};

const hideControls = () => videoControls.classList.remove("showing");

const handleMouseMove = () => {
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }
  videoControls.classList.add("showing");
  controlsTimeout = setTimeout(hideControls, 3000);
};

const handleMouseLeave = () => {
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }
  hideControls();
};

const handlePlayKeydown = (event) => {
  if (event.key === " " && event.target !== textarea) handlePlayClick();
  handleMouseMove();
};

const handlePlayClick = () => {
  handlePlayBtnClick();
};

const handleEnded = () => {
  const { id } = videoContainer.dataset;
  fetch(`/api/videos/${id}/view`, {
    method: "POST",
  });
};

const blockSpacePageDn = (e) => {
  if (e.key === " ") {
    e.preventDefault();
  }
};

playBtn.addEventListener("click", handlePlayBtnClick);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("dblclick", handleFullScreenClick);
video.addEventListener("click", handlePlayClick);
video.addEventListener("ended", handleEnded);
timeline.addEventListener("input", handleTimelineChange);
fullScreenBtn.addEventListener("click", handleFullscreen);
videoContainer.addEventListener("fullscreenchange", handleFullScreenBtn);
videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);
document.addEventListener("keydown", handlePlayKeydown);
window.addEventListener("keydown", blockSpacePageDn);
