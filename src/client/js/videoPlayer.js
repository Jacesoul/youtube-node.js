const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const time = document.getElementById("time");
const volume = document.getElementById("volume");

const handlePlay = (e) => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
};
const handlePauseClick = (e) => (playBtn.innerText = "Play");
const handlePlayClick = (e) => (playBtn.innerText = "Pause");

const handleMute = (e) => {};

playBtn.addEventListener("click", handlePlay);
muteBtn.addEventListener("click", handleMute);
video.addEventListener("pause", handlePauseClick);
video.addEventListener("play", handlePlayClick);
