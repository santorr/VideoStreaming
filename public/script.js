// === DOM element references ===
const wrapper = document.querySelector('.video-wrapper');
const videoBox = wrapper.querySelector('.video-box');
const video = wrapper.querySelector('video');
const pauseBtn = wrapper.querySelector('.pause-button');
const volumeSlider = wrapper.querySelector('.volume-slider');
const overlay = wrapper.querySelector('.video-overlay');
const titleEl = overlay.querySelector('h2');
const descEl = overlay.querySelector('p');

// === Utility: Set the play/pause icon dynamically ===
function setPauseIcon(svgPath, viewBox = "0 0 8 8") {
  pauseBtn.innerHTML = `
    <svg viewBox="${viewBox}" class="pause-icon" xmlns="http://www.w3.org/2000/svg">
      <path fill="currentColor" d="${svgPath}" />
    </svg>
  `;
}

// === Volume control: Update video volume based on slider input ===
volumeSlider.addEventListener('input', (e) => {
  const value = parseFloat(e.target.value);
  video.volume = value;
  video.muted = value === 0;
  updateVolumeIcon(volumeSlider, value);
});

// === Volume feedback: Update slider class to reflect current volume level ===
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

// === Toggle play/pause on video click ===
video.addEventListener('click', () => {
  video.paused ? video.play() : video.pause();
});

// === When video starts playing: update class and icon ===
video.addEventListener('play', () => {
  videoBox.classList.add('playing');
  setPauseIcon("M1 1H3V7H1V1ZM5 1H7V7H5V1Z"); // Pause icon
});

// === When video is paused: update class and icon ===
video.addEventListener('pause', () => {
  videoBox.classList.remove('playing');
  setPauseIcon("M2 1L2 7L7 4Z"); // Play icon
});

// === Mobile touch handling (reserved for future swipe logic) ===
let touchStartY = 0;

video.addEventListener('touchstart', (e) => {
  touchStartY = e.touches[0].clientY;
});

video.addEventListener('touchend', (e) => {
  const touchEndY = e.changedTouches[0].clientY;
  const deltaY = touchStartY - touchEndY;
  // Placeholder: vertical swipe logic can go here
});

// === Initialization on DOM load ===
function init() {
  const src = "/videos/video1.m3u8";

  // Set overlay text content
  titleEl.textContent = "Vidéo HLS test 🎈😫🙈";
  descEl.textContent = "Lecture d’un flux .m3u8 avec HLS.js hdkh lkhg jklh hgdslFUDl lu flsdfdsluf flusdyflsdyf dslufysdf sdlkfusdl hklhkjhsadh lkjdhsaj jdlkasdf";

  // If HLS is supported, load the .m3u8 source via Hls.js
  if (src.endsWith('.m3u8') && Hls.isSupported()) {
    const hls = new Hls();
    hls.loadSource(src);
    hls.attachMedia(video);
  } else {
    video.src = src; // Fallback for .mp4 or direct sources
  }

  // Once video metadata is ready, auto-play and set initial volume state
  video.onloadeddata = () => {
    video.play();
    video.muted = false;
    video.volume = 0.2;
    updateVolumeIcon(volumeSlider, video.volume);
  };
}

// Start the video player logic once the DOM is ready
document.addEventListener("DOMContentLoaded", init);
