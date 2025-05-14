const wrapper = document.querySelector('.video-wrapper');
const videoBox = wrapper.querySelector('.video-box');
const video = wrapper.querySelector('video');
const pauseBtn = wrapper.querySelector('.pause-button');
const btn = wrapper.querySelector('.sound-toggle');
const volumeSlider = wrapper.querySelector('.volume-slider');
const overlay = wrapper.querySelector('.video-overlay');
const titleEl = overlay.querySelector('h2');
const descEl = overlay.querySelector('p');

function setPauseIcon(svgPath, viewBox = "0 0 8 8") {
  pauseBtn.innerHTML = `
    <svg viewBox="${viewBox}" class="pause-icon" xmlns="http://www.w3.org/2000/svg">
      <path fill="currentColor" d="${svgPath}" />
    </svg>
  `;
}

volumeSlider.addEventListener('input', (e) => {
  const value = parseFloat(e.target.value);
  video.volume = value;
  video.muted = value === 0;
  updateVolumeIcon(volumeSlider, value);
});

function updateVolumeIcon(slider, volume) {
  if (volume === 0) {
    slider.setAttribute("data-volume", "muted");
  } else if (volume < 0.3) {
    slider.setAttribute("data-volume", "low");
  } else if (volume < 0.6) {
    slider.setAttribute("data-volume", "medium");
  } else {
    slider.setAttribute("data-volume", "high");
  }
}

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
    video.volume = 0.2;
    volumeSlider.setAttribute("data-volume", "low");
    updateVolumeIcon(volumeSlider, video.volume);
  };
}

// Démarre le tout une fois le DOM chargé
document.addEventListener("DOMContentLoaded", init);
