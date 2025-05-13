// === DOM Elements ===
const wrapper = document.querySelector('.video-wrapper');
const videoBox = wrapper.querySelector('.video-box');
const video = wrapper.querySelector('video');
const pauseBtn = wrapper.querySelector('.pause-button');
const soundBtn = wrapper.querySelector('.sound-toggle');
const volumeSlider = wrapper.querySelector('.volume-slider');
const overlay = wrapper.querySelector('.video-overlay');
const titleEl = overlay.querySelector('h2');
const descEl = overlay.querySelector('p');

// === SVG Icon Paths ===
const soundLoudPath = "M191.749973,0 L80.8957867,87.2292267 L0,87.2292267 L0,257.895893 L81.0208,257.895893 L191.749973,343.35424 L191.749973,0 Z";
const soundOffPath = "M47.0849493,0 L298.668,251.583611 L304.101001,257.015597 L353.573532,306.488791 L384.435257,337.348961 L409.751616,362.666662 L379.581717,392.836561 L191.749,205.003 L191.749973,369.105851 L81.0208,283.647505 L0,283.647505 L0,112.980838 L80.8957867,112.980838 L91.433,104.688 L16.9150553,30.169894 L47.0849493,0 Z";

// === Player State ===
let isSwitching = false;

// === UI Helpers ===
function setPauseIcon(path, viewBox = "0 0 8 8") {
  pauseBtn.innerHTML = `
    <svg viewBox="${viewBox}" class="pause-icon" xmlns="http://www.w3.org/2000/svg">
      <path fill="currentColor" d="${path}" />
    </svg>
  `;
}

function setSoundIcon(path) {
  soundBtn.innerHTML = `
    <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"
         fill="white" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      <path d="${path}" />
    </svg>
  `;
}

// === Event Listeners ===
soundBtn.addEventListener('click', () => {
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

// === Swipe and Scroll Events (optional, future use) ===
let touchStartY = 0;

video.addEventListener('touchstart', (e) => {
  touchStartY = e.touches[0].clientY;
});

video.addEventListener('touchend', (e) => {
  const touchEndY = e.changedTouches[0].clientY;
  const deltaY = touchStartY - touchEndY;

  if (Math.abs(deltaY) > 50 && !isSwitching) {
    isSwitching = true;
    setTimeout(() => { isSwitching = false }, 600);
  }
});

// === Init Video Playback with HLS Support ===
function init() {
  const src = "/videos/video1/video1.m3u8"; // <- Change to your actual path
  titleEl.textContent = "Test HLS Video";
  descEl.textContent = "This is streamed via .m3u8";

  if (Hls.isSupported()) {
    const hls = new Hls();
    hls.loadSource(src);
    hls.attachMedia(video);
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = src;
  }

  video.onloadeddata = () => {
    video.classList.remove('hidden');
    video.classList.remove('fade-out');
    video.play();
    video.muted = false;
    setSoundIcon(soundLoudPath);
  };
}

init();
