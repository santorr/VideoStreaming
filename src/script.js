
const wrapper = document.querySelector('.video-wrapper');
const videoBox = wrapper.querySelector('.video-box');
const video = wrapper.querySelector('video');
const pauseBtn = wrapper.querySelector('.pause-button');
const btn = wrapper.querySelector('.sound-toggle');
const volumeSlider = wrapper.querySelector('.volume-slider');
const overlay = wrapper.querySelector('.video-overlay');
const titleEl = overlay.querySelector('h2');
const descEl = overlay.querySelector('p');

const soundLoudPath = "M361.299413,341.610667 L328.014293,314.98176 C402.206933,233.906133 402.206933,109.96608 328.013013,28.8906667 L361.298133,2.26304 C447.910187,98.97536 447.908907,244.898347 361.299413,341.610667 Z M276.912853,69.77216 L243.588693,96.4309333 C283.38432,138.998613 283.38304,204.87488 243.589973,247.44256 L276.914133,274.101333 C329.118507,215.880107 329.118507,127.992107 276.912853,69.77216 Z M191.749973,1.42108547e-14 L80.8957867,87.2292267 L7.10542736e-15,87.2292267 L7.10542736e-15,257.895893 L81.0208,257.895893 L191.749973,343.35424 L191.749973,1.42108547e-14 Z";
const soundOffPath = "M47.0849493,-1.42108547e-14 L298.668,251.583611 L304.101001,257.015597 L304.101,257.016 L353.573532,306.488791 C353.573732,306.488458 353.573933,306.488124 353.574133,306.48779 L384.435257,337.348961 L384.434,337.349 L409.751616,362.666662 L379.581717,392.836561 L191.749,205.003 L191.749973,369.105851 L81.0208,283.647505 L7.10542736e-15,283.647505 L7.10542736e-15,112.980838 L80.8957867,112.980838 L91.433,104.688 L16.9150553,30.169894 L47.0849493,-1.42108547e-14 Z M361.298133,28.0146513 C429.037729,103.653701 443.797162,209.394226 405.578884,298.151284 L372.628394,265.201173 C396.498256,194.197542 381.626623,113.228555 328.013013,54.642278 L361.298133,28.0146513 Z M276.912853,95.5237713 C305.539387,127.448193 318.4688,168.293162 315.701304,208.275874 L266.464558,159.040303 C261.641821,146.125608 254.316511,133.919279 244.488548,123.156461 L243.588693,122.182545 L276.912853,95.5237713 Z M191.749973,25.7516113 L191.749,84.3256113 L158.969,51.5456113 L191.749973,25.7516113 Z";

let videoList = [];
let currentIndex = 0;
let isSwitching = false;

async function fetchVideoList() {
  try {
    const response = await fetch('.../api/getVideos.php');
    if (!response.ok) throw new Error('Réponse invalide');
    videoList = await response.json();
    loadVideo(currentIndex);
  } catch (err) {
    console.error("Erreur de chargement des vidéos :", err);
  }
}

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

function loadVideo(index) {
  if (!videoList.length || index < 0 || index >= videoList.length) return;

  const data = videoList[index];
  video.src = data.src;
  titleEl.textContent = data.title;
  descEl.textContent = data.description;
  video.play();
}

btn.addEventListener('click', () => {
  video.muted = !video.muted;
  setSoundIcon(video.muted ? soundOffPath : soundLoudPath);
});

volumeSlider.addEventListener('input', (e) => {
  video.volume = e.target.value;
  if (video.volume === 0) {
    video.muted = true;
    setSoundIcon(soundOffPath);
  } else {
    video.muted = false;
    setSoundIcon(soundLoudPath);
  }
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

window.addEventListener('wheel', (e) => {
  if (isSwitching || !videoList.length) return;

  if (e.deltaY > 50 && currentIndex < videoList.length - 1) {
    currentIndex++;
    isSwitching = true;
    loadVideo(currentIndex);
    setTimeout(() => { isSwitching = false }, 600);
  }

  if (e.deltaY < -50 && currentIndex > 0) {
    currentIndex--;
    isSwitching = true;
    loadVideo(currentIndex);
    setTimeout(() => { isSwitching = false }, 600);
  }
});

fetchVideoList();
video.muted = false;
setSoundIcon(soundLoudPath);
