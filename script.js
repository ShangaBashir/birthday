/* ==========================================================================
   Cozy Magical Birthday Book JavaScript Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Elements ---
  const book = document.getElementById('birthday-book');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const musicBtn = document.getElementById('music-btn');
  const customBtn = document.getElementById('custom-btn');
  const customModal = document.getElementById('custom-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const saveCustomBtn = document.getElementById('save-customization-btn');
  const restartBookBtn = document.getElementById('restart-book-btn');

  // Personalization fields
  const inputSisterName = document.getElementById('input-sister-name');
  const inputWish = document.getElementById('input-wish');
  const inputSender = document.getElementById('input-sender');

  const displaySisterNames = document.querySelectorAll('.sister-name-display');
  const displayWish = document.getElementById('custom-birthday-wish');
  const displaySenderSig = document.getElementById('wish-signature');
  const displayLetterSig = document.getElementById('letter-sender-display');

  // Book Spines & Overlay
  const bookSpines = document.querySelectorAll('.book-spine');
  const bookReveal = document.getElementById('book-reveal');
  const closeRevealBtn = document.getElementById('close-reveal-btn');
  const revealedTitle = document.getElementById('revealed-title');
  const revealedText = document.getElementById('revealed-text');

  // Nook Interactive Elements
  const fireplaceEl = document.getElementById('fireplace-el');
  const windowEl = document.getElementById('window-el');
  const lampEl = document.getElementById('lamp-el');
  const teaEl = document.getElementById('tea-el');
  const petEl = document.getElementById('pet-el');

  const nookFire = document.getElementById('nook-fire');
  const fireGlow = document.getElementById('fire-glow');
  const lampBeam = document.getElementById('lamp-beam');
  const teaSteam = document.getElementById('tea-steam');
  const windowStars = document.getElementById('window-stars');
  const windowRain = document.getElementById('window-rain');
  const nookCat = document.getElementById('nook-cat');
  const nookDog = document.getElementById('nook-dog');
  const ambientGlow = document.getElementById('ambient-glow');

  // Nook Legends
  const legendFire = document.getElementById('legend-fire');
  const legendLamp = document.getElementById('legend-lamp');
  const legendTea = document.getElementById('legend-tea');
  const legendWeather = document.getElementById('legend-weather');
  const legendPet = document.getElementById('legend-pet');

  // Cake Elements
  const candles = document.querySelectorAll('.candle');
  const wishReveal = document.getElementById('wish-reveal');
  const cakeInstruction = document.getElementById('cake-instruction');
  const envelope = document.getElementById('envelope');

  // --- State Variables ---
  let currentLocation = 0;
  const papers = [
    document.getElementById('p1'),
    document.getElementById('p2'),
    document.getElementById('p3'),
    document.getElementById('p4')
  ];
  const maxLocation = papers.length;

  // Customization Defaults
  let sisterName = "Dashne";
  let birthdayWish = "To the best sister, Dashne! Hope you have cozy reading nights, lots of great books, and a wonderful new year!";
  let senderName = "Shanga";

  // Audio Context State
  let audioCtx = null;
  let isMusicPlaying = false;
  let melodyTimeoutId = null;
  let currentNoteIndex = 0;

  // --- Initialize Customizations ---
  function loadCustomizations() {
    const savedName = localStorage.getItem('birthday_sister_name');
    const savedWish = localStorage.getItem('birthday_sister_wish');
    const savedSender = localStorage.getItem('birthday_sender_name');

    if (savedName && savedName !== "Sister") sisterName = savedName;
    if (savedWish && !savedWish.includes("Sister")) birthdayWish = savedWish;
    if (savedSender && savedSender !== "Your Loving Brother" && savedSender !== "With all my love") senderName = savedSender;

    // Set form input values
    inputSisterName.value = sisterName;
    inputWish.value = birthdayWish;
    inputSender.value = senderName;

    // Apply to display elements
    updateDisplayTexts();
  }

  function updateDisplayTexts() {
    displaySisterNames.forEach(el => el.textContent = sisterName);
    displayWish.textContent = birthdayWish;
    displaySenderSig.textContent = `- ${senderName}`;
    displayLetterSig.textContent = `With all my love,\n${senderName}`;
  }

  loadCustomizations();

  // --- Starry Background Canvas ---
  const bgCanvas = document.getElementById('bg-canvas');
  const bgCtx = bgCanvas.getContext('2d');
  let stars = [];

  function resizeBg() {
    bgCanvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight;
    initStars();
  }

  function initStars() {
    stars = [];
    const starCount = Math.floor((bgCanvas.width * bgCanvas.height) / 8000);
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * bgCanvas.width,
        y: Math.random() * bgCanvas.height,
        radius: Math.random() * 1.5 + 0.5,
        opacity: Math.random(),
        twinkleSpeed: 0.005 + Math.random() * 0.015,
        driftSpeed: 0.02 + Math.random() * 0.05
      });
    }
  }

  function drawStars() {
    bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
    bgCtx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    
    stars.forEach(star => {
      // Draw star
      bgCtx.beginPath();
      bgCtx.globalAlpha = Math.abs(Math.sin(star.opacity));
      bgCtx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      bgCtx.fill();
      
      // Update star animation
      star.opacity += star.twinkleSpeed;
      star.y -= star.driftSpeed;
      
      // Wrap around screen
      if (star.y < -10) {
        star.y = bgCanvas.height + 10;
        star.x = Math.random() * bgCanvas.width;
      }
    });
    
    bgCtx.globalAlpha = 1.0;
    requestAnimationFrame(drawStars);
  }

  window.addEventListener('resize', resizeBg);
  resizeBg();
  drawStars();

  // --- Confetti & Sparkles Canvas ---
  const celebCanvas = document.getElementById('celebration-canvas');
  const celebCtx = celebCanvas.getContext('2d');
  let particles = [];
  let isCelebActive = false;

  function resizeCeleb() {
    celebCanvas.width = window.innerWidth;
    celebCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCeleb);
  resizeCeleb();

  class Particle {
    constructor(x, y, colorType) {
      this.x = x;
      this.y = y;
      this.radius = Math.random() * 4 + 2;
      this.vx = (Math.random() - 0.5) * 12;
      this.vy = -Math.random() * 12 - 4;
      this.gravity = 0.25;
      this.opacity = 1.0;
      this.fade = 0.008 + Math.random() * 0.012;
      this.spin = Math.random() * 360;
      this.spinSpeed = (Math.random() - 0.5) * 10;
      
      // Harmonious blue/gold color palette
      const goldColors = ['#ffd700', '#fcf6ba', '#d4af37', '#f3e5ab'];
      const blueColors = ['#3182ce', '#63b3ed', '#a3c2e8', '#e2e8f0'];
      
      if (colorType === 'gold') {
        this.color = goldColors[Math.floor(Math.random() * goldColors.length)];
      } else if (colorType === 'blue') {
        this.color = blueColors[Math.floor(Math.random() * blueColors.length)];
      } else {
        this.color = Math.random() > 0.5 
          ? goldColors[Math.floor(Math.random() * goldColors.length)]
          : blueColors[Math.floor(Math.random() * blueColors.length)];
      }
    }

    update() {
      this.vx *= 0.98;
      this.x += this.vx;
      this.vy += this.gravity;
      this.y += this.vy;
      this.opacity -= this.fade;
      this.spin += this.spinSpeed;
    }

    draw() {
      celebCtx.save();
      celebCtx.globalAlpha = Math.max(0, this.opacity);
      celebCtx.translate(this.x, this.y);
      celebCtx.rotate((this.spin * Math.PI) / 180);
      
      celebCtx.fillStyle = this.color;
      // Draw small diamond or circle
      if (Math.random() > 0.5) {
        celebCtx.beginPath();
        celebCtx.moveTo(0, -this.radius);
        celebCtx.lineTo(this.radius, 0);
        celebCtx.lineTo(0, this.radius);
        celebCtx.lineTo(-this.radius, 0);
        celebCtx.closePath();
        celebCtx.fill();
      } else {
        celebCtx.beginPath();
        celebCtx.arc(0, 0, this.radius, 0, Math.PI * 2);
        celebCtx.fill();
      }
      
      celebCtx.restore();
    }
  }

  function startCelebration() {
    isCelebActive = true;
    particles = [];
    const rect = book.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height * 0.65;
    
    // Spawn 150 particles
    for (let i = 0; i < 150; i++) {
      particles.push(new Particle(startX, startY, 'mixed'));
    }
    
    // Spurt more particles periodically
    let burstCount = 0;
    const burstInterval = setInterval(() => {
      if (burstCount >= 3 || !isCelebActive) {
        clearInterval(burstInterval);
        return;
      }
      const x = rect.left + Math.random() * rect.width;
      const y = rect.top + rect.height * 0.5;
      for (let i = 0; i < 40; i++) {
        particles.push(new Particle(x, y, Math.random() > 0.5 ? 'gold' : 'blue'));
      }
      burstCount++;
    }, 600);
  }

  function updateCelebration() {
    if (!isCelebActive) return;
    
    celebCtx.clearRect(0, 0, celebCanvas.width, celebCanvas.height);
    
    particles = particles.filter(p => p.opacity > 0);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    
    if (particles.length > 0) {
      requestAnimationFrame(updateCelebration);
    } else {
      isCelebActive = false;
    }
  }

  // --- Web Audio Synthesizer (Music Box & Interaction SFX) ---
  function initAudio() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Synthesize a chime chime note (Glockenspiel/Music box)
  function playChime(freq, duration, delay = 0) {
    if (!audioCtx) return;
    
    const now = audioCtx.currentTime + delay;
    
    // Main Oscillator (sine or triangle)
    const osc1 = audioCtx.createOscillator();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, now);
    
    // First high overtone (metallic tine strike)
    const osc2 = audioCtx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, now);
    
    // Second high overtone for sparkling ring
    const osc3 = audioCtx.createOscillator();
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(freq * 3, now);
    
    // Gain / Volume envelope
    const gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0, now);
    // Sharp attack
    gainNode.gain.linearRampToValueAtTime(0.12, now + 0.005);
    // Slow exponential decay/ring
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    
    // Connect nodes
    osc1.connect(gainNode);
    osc2.connect(gainNode);
    osc3.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    // Play
    osc1.start(now);
    osc2.start(now);
    osc3.start(now);
    
    // Clean up
    osc1.stop(now + duration + 0.1);
    osc2.stop(now + duration + 0.1);
    osc3.stop(now + duration + 0.1);
  }

  // Quick sound effect for page flip
  function playPageFlipSound() {
    initAudio();
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    
    // Generate low soft swoosh noise
    const bufferSize = audioCtx.sampleRate * 0.15; // 0.15 seconds
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, now);
    filter.frequency.exponentialRampToValueAtTime(50, now + 0.15);
    
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);
    
    noise.start(now);
    noise.stop(now + 0.2);
  }

  // Happy Birthday Chime Melody Data
  const BASE_TEMPO = 95; // BPM
  const BEAT_DURATION = 60 / BASE_TEMPO; // duration of 1 beat in seconds

  const melodyNotes = [
    { freq: 261.63, beats: 0.75 }, // C4
    { freq: 261.63, beats: 0.25 }, // C4
    { freq: 293.66, beats: 1.0 },  // D4
    { freq: 261.63, beats: 1.0 },  // C4
    { freq: 349.23, beats: 1.0 },  // F4
    { freq: 329.63, beats: 2.0 },  // E4
    
    { freq: 261.63, beats: 0.75 }, // C4
    { freq: 261.63, beats: 0.25 }, // C4
    { freq: 293.66, beats: 1.0 },  // D4
    { freq: 261.63, beats: 1.0 },  // C4
    { freq: 392.00, beats: 1.0 },  // G4
    { freq: 349.23, beats: 2.0 },  // F4
    
    { freq: 261.63, beats: 0.75 }, // C4
    { freq: 261.63, beats: 0.25 }, // C4
    { freq: 523.25, beats: 1.0 },  // C5
    { freq: 440.00, beats: 1.0 },  // A4
    { freq: 349.23, beats: 1.0 },  // F4
    { freq: 329.63, beats: 1.0 },  // E4
    { freq: 293.66, beats: 2.0 },  // D4
    
    { freq: 466.16, beats: 0.75 }, // Bb4
    { freq: 466.16, beats: 0.25 }, // Bb4
    { freq: 440.00, beats: 1.0 },  // A4
    { freq: 349.23, beats: 1.0 },  // F4
    { freq: 392.00, beats: 1.0 },  // G4
    { freq: 349.23, beats: 2.5 }   // F4
  ];

  function playMelodyLoop() {
    if (!isMusicPlaying) return;

    const currentNote = melodyNotes[currentNoteIndex];
    const duration = currentNote.beats * BEAT_DURATION;

    // Synthesize note chime
    playChime(currentNote.freq, duration * 1.5);

    // Schedule next note
    currentNoteIndex = (currentNoteIndex + 1) % melodyNotes.length;
    
    // Set a tiny gap between notes for nice separation
    melodyTimeoutId = setTimeout(playMelodyLoop, duration * 1000);
  }

  function startMusic() {
    initAudio();
    isMusicPlaying = true;
    musicBtn.classList.add('playing');
    currentNoteIndex = 0;
    playMelodyLoop();
  }

  function stopMusic() {
    isMusicPlaying = false;
    musicBtn.classList.remove('playing');
    if (melodyTimeoutId) {
      clearTimeout(melodyTimeoutId);
      melodyTimeoutId = null;
    }
  }

  function toggleMusic() {
    if (isMusicPlaying) {
      stopMusic();
    } else {
      startMusic();
    }
  }

  // --- Book Navigation Page-turning Logic ---
  function updatePapersState() {
    papers.forEach((paper, idx) => {
      // Toggle flipped status
      if (idx < currentLocation) {
        paper.classList.add('flipped');
      } else {
        paper.classList.remove('flipped');
      }

      // Manage z-indices
      if (idx < currentLocation) {
        paper.style.zIndex = idx;
      } else {
        paper.style.zIndex = maxLocation - idx;
      }

      // Manage active pointer events
      paper.classList.remove('active-left', 'active-right');
      if (idx === currentLocation - 1) {
        paper.classList.add('active-left');
      } else if (idx === currentLocation) {
        paper.classList.add('active-right');
      }
    });

    // Translate Book Container for centering closed covers and open book
    if (currentLocation === 0) {
      book.style.transform = 'rotateX(12deg) rotateY(0deg) translateX(0px)';
    } else if (currentLocation === maxLocation) {
      book.style.transform = 'rotateX(12deg) rotateY(0deg) translateX(440px)';
    } else {
      book.style.transform = 'rotateX(12deg) rotateY(0deg) translateX(220px)';
    }

    // Toggle navigation button disabled states and visibility
    const navContainer = document.querySelector('.nav-container');
    if (navContainer) {
      if (currentLocation === 0) {
        navContainer.classList.add('hidden');
      } else {
        navContainer.classList.remove('hidden');
      }
    }
    prevBtn.disabled = currentLocation === 0;
    nextBtn.disabled = currentLocation === maxLocation;
  }

  function goNextPage() {
    if (currentLocation < maxLocation) {
      playPageFlipSound();
      currentLocation++;
      updatePapersState();
      
      // Close open book reveals
      bookReveal.classList.remove('active');
    }
  }

  function goPrevPage() {
    if (currentLocation > 0) {
      playPageFlipSound();
      currentLocation--;
      updatePapersState();
      
      // Close open book reveals
      bookReveal.classList.remove('active');
    }
  }

  // Event Listeners for Nav
  nextBtn.addEventListener('click', goNextPage);
  prevBtn.addEventListener('click', goPrevPage);

  // Click on book cover to open it
  document.querySelector('.book-cover').addEventListener('click', (e) => {
    // Avoid double trigger if clicking controls
    if (currentLocation === 0) goNextPage();
  });

  // Clicking restart on the back cover restarts
  restartBookBtn.addEventListener('click', () => {
    currentLocation = 0;
    updatePapersState();
    playPageFlipSound();
    
    // Reset candles
    candles.forEach(candle => {
      candle.classList.remove('blown-out');
    });
    wishReveal.classList.add('hidden');
    cakeInstruction.textContent = "Click the candles to make a wish & blow them out!";
  });

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ') {
      // Prevent scrolling
      if (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        goNextPage();
      }
    } else if (e.key === 'ArrowLeft') {
      if (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        goPrevPage();
      }
    }
  });

  // --- Bookshelf Page Interaction ---
  const bookWishes = {
    "1": {
      title: "Volume of Joy",
      text: "A sister is a friend forever. Hope your birthday is as bright and happy as your smile. Thank you for making us laugh!"
    },
    "2": {
      title: "Chronicles of Dashne",
      text: "Inside jokes, talking over tea, and reading books together. Thank you for being the best sister and friend. Happy Birthday to my favorite person!"
    },
    "3": {
      title: "Cozy Chapter Collection",
      text: "Cozy up with a good book and hot tea today. Always remember how much we love you. Wish you a happy and peaceful year!"
    },
    "4": {
      title: "Book of Dreams",
      text: "May all your dreams come true in this new year of your life. Hope your birthday is the start of a wonderful journey!"
    }
  };

  bookSpines.forEach(spine => {
    spine.addEventListener('click', () => {
      initAudio();
      playChime(392.00, 0.4); // Play note G4
      setTimeout(() => playChime(523.25, 0.6), 100); // Play note C5
      
      const bookIndex = spine.getAttribute('data-book');
      const bookData = bookWishes[bookIndex];

      revealedTitle.textContent = bookData.title;
      revealedText.textContent = bookData.text;

      bookReveal.classList.add('active');
    });
  });

  // Close the book reveal card when clicking anywhere on the page (except on another book spine)
  const bookshelfPage = document.querySelector('.bookshelf-page');
  bookshelfPage.addEventListener('click', (e) => {
    if (bookReveal.classList.contains('active')) {
      if (!e.target.closest('.book-spine')) {
        bookReveal.classList.remove('active');
        playChime(261.63, 0.2); // Play low note C4
      }
    }
  });

  // --- Cozy Reading Nook Interaction ---
  let isFireplaceOn = false;
  let isLampOn = false;
  let isTeaHot = false;
  let isRainySky = false;
  let activePet = "cat"; // cat or dog

  fireplaceEl.addEventListener('click', () => {
    initAudio();
    isFireplaceOn = !isFireplaceOn;
    
    if (isFireplaceOn) {
      nookFire.classList.remove('hidden');
      fireGlow.classList.remove('hidden');
      ambientGlow.classList.add('fire-on');
      legendFire.classList.add('active');
      legendFire.querySelector('span').textContent = 'On 🔥';
      playChime(329.63, 0.3); // E4
    } else {
      nookFire.classList.add('hidden');
      fireGlow.classList.add('hidden');
      ambientGlow.classList.remove('fire-on');
      legendFire.classList.remove('active');
      legendFire.querySelector('span').textContent = 'Off';
      playChime(261.63, 0.2); // C4
    }
  });

  lampEl.addEventListener('click', () => {
    initAudio();
    isLampOn = !isLampOn;
    
    if (isLampOn) {
      lampBeam.classList.remove('hidden');
      legendLamp.classList.add('active');
      legendLamp.querySelector('span').textContent = 'On 💡';
      playChime(392.00, 0.3); // G4
    } else {
      lampBeam.classList.add('hidden');
      legendLamp.classList.remove('active');
      legendLamp.querySelector('span').textContent = 'Off';
      playChime(311.13, 0.25); // Eb4
    }
  });

  teaEl.addEventListener('click', () => {
    initAudio();
    isTeaHot = !isTeaHot;
    
    if (isTeaHot) {
      teaSteam.classList.remove('hidden');
      legendTea.classList.add('active');
      legendTea.querySelector('span').textContent = 'Hot ☕';
      playChime(440.00, 0.3); // A4
    } else {
      teaSteam.classList.add('hidden');
      legendTea.classList.remove('active');
      legendTea.querySelector('span').textContent = 'Cold';
      playChime(349.23, 0.25); // F4
    }
  });

  windowEl.addEventListener('click', () => {
    initAudio();
    isRainySky = !isRainySky;
    
    if (isRainySky) {
      windowStars.classList.add('hidden');
      windowRain.classList.remove('hidden');
      legendWeather.classList.add('active');
      legendWeather.querySelector('span').textContent = 'Rainy 🌧️';
      playChime(293.66, 0.4); // D4
    } else {
      windowStars.classList.remove('hidden');
      windowRain.classList.add('hidden');
      legendWeather.classList.remove('active');
      legendWeather.querySelector('span').textContent = 'Starry';
      playChime(349.23, 0.3); // F4
    }
  });

  petEl.addEventListener('click', () => {
    initAudio();
    if (activePet === 'cat') {
      activePet = 'dog';
      nookCat.classList.add('hidden');
      nookDog.classList.remove('hidden');
      legendPet.classList.add('active');
      legendPet.querySelector('span').textContent = 'Dog 🐶';
      playChime(493.88, 0.3); // B4
    } else {
      activePet = 'cat';
      nookCat.classList.remove('hidden');
      nookDog.classList.add('hidden');
      legendPet.classList.remove('active');
      legendPet.querySelector('span').textContent = 'Cat 🐱';
      playChime(523.25, 0.3); // C5
    }
  });

  // --- Celebration Birthday Cake Candle Interaction ---
  const cakeContainer = document.getElementById('cake-container');
  
  // Clicking individual candles blows them out one by one
  candles.forEach(candle => {
    candle.addEventListener('click', (e) => {
      e.stopPropagation(); // Avoid triggering the main cake container toggle
      initAudio();
      
      if (!candle.classList.contains('blown-out')) {
        candle.classList.add('blown-out');
        
        // Play cute pitch slide/blow out sound
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        const now = audioCtx.currentTime;
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.15);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        
        osc.start(now);
        osc.stop(now + 0.16);

        // Check if all candles blown out
        checkAllCandlesBlown();
      }
    });
  });

  // Clicking the cake body toggles all candle lights on/off
  cakeContainer.addEventListener('click', () => {
    initAudio();
    
    // Check if at least one candle is lit (not blown out)
    const anyCandleLit = Array.from(candles).some(c => !c.classList.contains('blown-out'));
    
    if (anyCandleLit) {
      // Turn lights OFF (blow out all candles)
      candles.forEach(candle => {
        candle.classList.add('blown-out');
      });
      
      // Play blowout sound
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      const now = audioCtx.currentTime;
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.15);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      
      osc.start(now);
      osc.stop(now + 0.16);
      
      checkAllCandlesBlown();
    } else {
      // Turn lights ON (light up all candles)
      candles.forEach(candle => {
        candle.classList.remove('blown-out');
      });
      
      // Hide wish reveal
      wishReveal.classList.add('hidden');
      cakeInstruction.textContent = "Click the cake to blow out the candles and make a wish!";
      
      // Play relight sound (ascending chime sweep)
      playChime(329.63, 0.4); // E4
      setTimeout(() => playChime(392.00, 0.4), 80); // G4
      setTimeout(() => playChime(523.25, 0.5), 160); // C5
    }
  });

  function checkAllCandlesBlown() {
    const allBlown = Array.from(candles).every(c => c.classList.contains('blown-out'));
    if (allBlown) {
      cakeInstruction.textContent = "Your wish has come true! ✨";
      
      // Play a lovely harp sweep
      setTimeout(() => playArpeggio(), 200);

      // Spawn Confetti
      startCelebration();
      updateCelebration();

      // Show wish reveal panel
      setTimeout(() => {
        wishReveal.classList.remove('hidden');
        
        // Auto-play music box!
        if (!isMusicPlaying) {
          startMusic();
        }
      }, 600);
    }
  }

  function playArpeggio() {
    const arpeggio = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
    arpeggio.forEach((freq, idx) => {
      playChime(freq, 0.7, idx * 0.08);
    });
  }

  // --- Envelope Interaction ---
  envelope.addEventListener('click', (e) => {
    e.stopPropagation();
    initAudio();
    
    envelope.classList.toggle('open');
    if (envelope.classList.contains('open')) {
      playChime(349.23, 0.2); // F4
      setTimeout(() => playChime(440.00, 0.4), 100); // A4
    } else {
      playChime(261.63, 0.3); // C4
    }
  });

  // --- Personalization Modal Controls ---
  musicBtn.addEventListener('click', () => {
    toggleMusic();
  });

  customBtn?.addEventListener('click', () => {
    initAudio();
    customModal.classList.add('active');
    playChime(392.00, 0.25);
  });

  closeModalBtn.addEventListener('click', () => {
    customModal.classList.remove('active');
    playChime(261.63, 0.25);
  });

  // Close modal when clicking background
  customModal.addEventListener('click', (e) => {
    if (e.target === customModal) {
      customModal.classList.remove('active');
      playChime(261.63, 0.25);
    }
  });

  saveCustomBtn.addEventListener('click', () => {
    initAudio();
    
    sisterName = inputSisterName.value.trim() || "Sister";
    birthdayWish = inputWish.value.trim() || "To the best sister in the world! Wishing you endless cozy reading nights, stacked bookshelves, and wonderful adventures in every new chapter of life.";
    senderName = inputSender.value.trim() || "Your Loving Brother";

    // Save to localStorage
    localStorage.setItem('birthday_sister_name', sisterName);
    localStorage.setItem('birthday_sister_wish', birthdayWish);
    localStorage.setItem('birthday_sender_name', senderName);

    // Apply to UI
    updateDisplayTexts();
    
    // Close modal & play success sound
    customModal.classList.remove('active');
    playArpeggio();
    
    // If modal customizer used, refresh wishes revealed book if open
    bookReveal.classList.remove('active');
  });

  // Start initialization
  updatePapersState();
});
