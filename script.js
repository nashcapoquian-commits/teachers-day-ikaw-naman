const heroParticles = document.querySelector('.hero-particles');
const messageForm = document.getElementById('messageForm');
const messageWall = document.getElementById('messageWall');
const teacherName = document.getElementById('teacherName');
const messageText = document.getElementById('messageText');
const surpriseBtn = document.getElementById('surpriseBtn');
const giftWrap = document.getElementById('giftWrap');
const surpriseMessage = document.getElementById('surpriseMessage');
const appreciationBtn = document.getElementById('appreciationBtn');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const musicToggle = document.getElementById('musicToggle');
const musicToggle2 = document.getElementById('musicToggle2');

const colors = ['peach', 'sky', 'gold', 'rose'];

function createParticles() {
  const particles = [];
  for (let i = 0; i < 22; i++) {
    const span = document.createElement('span');
    const size = Math.random() * 10 + 6;
    const left = Math.random() * 100;
    const top = Math.random() * 100;
    const delay = Math.random() * 6;
    const duration = Math.random() * 5 + 4;

    span.style.width = `${size}px`;
    span.style.height = `${size}px`;
    span.style.left = `${left}%`;
    span.style.top = `${top}%`;
    span.style.animationDelay = `${delay}s`;
    span.style.animationDuration = `${duration}s`;
    particles.push(span);
  }

  heroParticles.append(...particles);
}

function appendMessage(name, text) {
  const note = document.createElement('div');
  note.className = `sticky-note ${colors[Math.floor(Math.random() * colors.length)]}`;
  note.innerHTML = `
    <p class="note-message">“${text}”</p>
    <span class="note-signature">— ${name}</span>
  `;
  messageWall.prepend(note);
}

messageForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const name = teacherName.value.trim();
  const text = messageText.value.trim();

  if (!name || !text) return;

  appendMessage(name, text);
  messageForm.reset();
  teacherName.focus();
});

surpriseBtn.addEventListener('click', () => {
  document.getElementById('surprise').scrollIntoView({ behavior: 'smooth', block: 'start' });
  setTimeout(() => {
    giftWrap.classList.add('opened');
    surpriseMessage.classList.remove('hidden');
  }, 200);
});

giftWrap.addEventListener('click', () => {
  giftWrap.classList.toggle('opened');

  if (giftWrap.classList.contains('opened')) {
    surpriseMessage.classList.remove('hidden');
  } else {
    surpriseMessage.classList.add('hidden');
  }
});

giftWrap.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    giftWrap.click();
  }
});

appreciationBtn.addEventListener('click', () => {
  document.getElementById('info').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

document.querySelectorAll('.gallery-item').forEach((item) => {
  item.addEventListener('click', () => {
    const src = item.dataset.image;
    lightboxImage.src = src;
    lightbox.classList.remove('hidden');
    lightbox.setAttribute('aria-hidden', 'false');
  });
});

lightbox.addEventListener('click', () => {
  lightbox.classList.add('hidden');
  lightbox.setAttribute('aria-hidden', 'true');
});

function updateCountdown() {
  const target = new Date('2026-11-25T09:00:00').getTime();
  const now = Date.now();
  const diff = Math.max(target - now, 0);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  document.getElementById('days').textContent = days;
  document.getElementById('hours').textContent = hours;
  document.getElementById('minutes').textContent = minutes;
  document.getElementById('seconds').textContent = seconds;
}

setInterval(updateCountdown, 1000);
updateCountdown();

let audioContext = null;
let gainNode = null;
let oscillatorA = null;
let oscillatorB = null;
let musicEnabled = false;

function ensureAudio() {
  if (!audioContext) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;

    audioContext = new AudioCtx();
    gainNode = audioContext.createGain();
    gainNode.gain.value = 0.0001;
    gainNode.connect(audioContext.destination);

    oscillatorA = audioContext.createOscillator();
    oscillatorB = audioContext.createOscillator();
    oscillatorA.type = 'sine';
    oscillatorB.type = 'triangle';
    oscillatorA.frequency.value = 220;
    oscillatorB.frequency.value = 277.18;
    oscillatorA.connect(gainNode);
    oscillatorB.connect(gainNode);
    oscillatorA.start();
    oscillatorB.start();
  }

  return audioContext;
}

function toggleMusic() {
  const ctx = ensureAudio();
  if (!ctx || !gainNode) return;

  musicEnabled = !musicEnabled;

  if (musicEnabled) {
    gainNode.gain.setTargetAtTime(0.03, ctx.currentTime, 0.3);
    musicToggle.classList.add('active');
    musicToggle2.classList.add('active');
    musicToggle.textContent = '♫';
  } else {
    gainNode.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.2);
    musicToggle.classList.remove('active');
    musicToggle2.classList.remove('active');
    musicToggle.textContent = '♪';
  }
}

musicToggle.addEventListener('click', toggleMusic);
musicToggle2.addEventListener('click', toggleMusic);

createParticles();
