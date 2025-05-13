const wrapper = document.querySelector('.video-wrapper');
const videoBox = wrapper.querySelector('.video-box');
const video = wrapper.querySelector('video');
const pauseBtn = wrapper.querySelector('.pause-button');
const btn = wrapper.querySelector('.sound-toggle');
const volumeSlider = wrapper.querySelector('.volume-slider');
const overlay = wrapper.querySelector('.video-overlay');
const titleEl = overlay.querySelector('h2');
const descEl = overlay.querySelector('p');

// Icônes SVG pour le son
const soundLoudPath = "M361.299413,341.610667 ...";
const soundOffPath = "M47.0849493,0 ..."; // (abrégés ici pour clarté)

function setPauseIcon(svgPath, viewBox = "0 0 8 8") {
  pauseBtn.innerHTML = `
    <svg viewBox="${viewBox}" class="pause-icon" xmlns="http://www.w3.org/2000/svg">
      <path fill="currentColor" d="${svgPath}" />
    </svg>
  `;
}

function setSoundIcon(path) {
  btn.innerHTML = `
    <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"
         fill="white" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      <path d="${path}" />
    </svg>
  `;
}

btn.addEventListener('click', () => {
  video.muted = !video.muted;
  setSoundIcon(video.muted ? soundOffPath : soundLoudPath);
});

volumeSlider.addEventListener('input', (e) => {
  video.volume = e.target.value;
  video.muted = (video.volume === 0);
  setSoundIcon(video.muted ? soundOffPath : soundLoudPath);
});

video.addEventListener('click', () => {
  video.paused ? video.play() : video.pause();
});

video.addEventListener('play', () => {
  videoBox.classList.add('playing');
  setPauseIcon("M1 1H3V7H1V1ZM5 1H7V7H5V1Z");
});

video.addEventListener('pause', () => {
  videoBox.classList.remove('playing');
  setPauseIcon("M2 1L2 7L7 4Z");
});

// 📱 Swipe pour mobile
let touchStartY = 0;

video.addEventListener('touchstart', (e) => {
  touchStartY = e.touches[0].clientY;
});

video.addEventListener('touchend', (e) => {
  const touchEndY = e.changedTouches[0].clientY;
  const deltaY = touchStartY - touchEndY;

  // Tu peux ignorer ici, aucun scroll vidéo pour 1 seule vidéo
});

function init() {
  const src = "/videos/video1.m3u8";
  titleEl.textContent = "Vidéo HLS test";
  descEl.textContent = "Lecture d’un flux .m3u8 avec HLS.js";

  if (src.endsWith('.m3u8') && Hls.isSupported()) {
    const hls = new Hls();
    hls.loadSource(src);
    hls.attachMedia(video);
  } else {
    video.src = src;
  }

  video.onloadeddata = () => {
    video.play();
    video.muted = false;
    setSoundIcon(soundLoudPath);
  };
}

// Démarre le tout une fois le DOM chargé
document.addEventListener("DOMContentLoaded", init);
