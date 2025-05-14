const wrapper = document.querySelector('.video-wrapper');
const videoBox = wrapper.querySelector('.video-box');
const video = wrapper.querySelector('video');
const pauseBtn = wrapper.querySelector('.pause-button');
const volumeSlider = wrapper.querySelector('.volume-slider');
const overlay = wrapper.querySelector('.video-overlay');
const titleEl = overlay.querySelector('h2');
const descEl = overlay.querySelector('p');

// Change le contenu du bouton central (play/pause)
function setPauseIcon(svgPath, viewBox = "0 0 8 8") {
  pauseBtn.innerHTML = `
    <svg viewBox="${viewBox}" class="pause-icon" xmlns="http://www.w3.org/2000/svg">
      <path fill="currentColor" d="${svgPath}" />
    </svg>
  `;
}

// Gère le changement de volume via le slider
volumeSlider.addEventListener('input', (e) => {
  const value = parseFloat(e.target.value);
  video.volume = value;
  video.muted = value === 0;
  updateVolumeIcon(volumeSlider, value);
});

// Applique une classe CSS selon le niveau de volume
function updateVolumeIcon(slider, volume) {
  slider.classList.remove("volume-muted", "volume-low", "volume-medium", "volume-high");

  if (volume === 0) {
    slider.classList.add("volume-muted");
  } else if (volume < 0.3) {
    slider.classList.add("volume-low");
  } else if (volume < 0.6) {
    slider.classList.add("volume-medium");
  } else {
    slider.classList.add("volume-high");
  }
}

// Play/pause au clic sur la vidéo
video.addEventListener('click', () => {
  video.paused ? video.play() : video.pause();
});

// Affiche l'icône "pause"
video.addEventListener('play', () => {
  videoBox.classList.add('playing');
  setPauseIcon("M1 1H3V7H1V1ZM5 1H7V7H5V1Z");
});

// Affiche l'icône "play"
video.addEventListener('pause', () => {
  videoBox.classList.remove('playing');
  setPauseIcon("M2 1L2 7L7 4Z");
});

// Gestion mobile : on ignore pour 1 vidéo
let touchStartY = 0;

video.addEventListener('touchstart', (e) => {
  touchStartY = e.touches[0].clientY;
});

video.addEventListener('touchend', (e) => {
  const touchEndY = e.changedTouches[0].clientY;
  const deltaY = touchStartY - touchEndY;
  // Rien à faire ici
});

// Initialisation
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
    updateVolumeIcon(volumeSlider, video.volume); // 👈 met à jour la classe au chargement
  };
}

// Lance tout une fois le DOM prêt
document.addEventListener("DOMContentLoaded", init);
