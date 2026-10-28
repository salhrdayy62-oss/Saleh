// ===== متغیرهای پایه =====
const heartsBg = document.getElementById('heartsBg');
const heartEmojis = ['❤️', '💖', '💕', '💗', '💝', '🌹', '💘'];

// ===== ساخت قلب‌های شناور =====
function createHeart() {
    const heart = document.createElement('div');
    heart.classList.add('floating-heart');
    heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
    heart.style.left = Math.random() * 100 + '%';
    heart.style.fontSize = (Math.random() * 20 + 15) + 'px';
    heart.style.animationDuration = (Math.random() * 8 + 8) + 's';
    heart.style.animationDelay = Math.random() * 2 + 's';
    heartsBg.appendChild(heart);
    setTimeout(() => heart.remove(), 18000);
}
setInterval(createHeart, 900);

// ===== اسکرول نرم =====
function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

// ===== ظاهر شدن کارت‌ها با اسکرول =====
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('visible'), index * 100);
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.wish-card').forEach(card => observer.observe(card));

document.querySelectorAll('.wish-card').forEach(card => {
    card.addEventListener('click', () => {
        card.style.transform = 'scale(0.96)';
        setTimeout(() => card.style.transform = '', 150);
    });
});

// ===== حالت شب/روز =====
const themeBtn = document.getElementById('themeBtn');
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark');
    themeBtn.textContent = '☀️';
}

themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    themeBtn.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    showToast(isDark ? 'حالت شب فعال شد 🌙' : 'حالت روز فعال شد ☀️');
});

// ===== پخش موسیقی (بدون فایل، با Web Audio) =====
const musicBtn = document.getElementById('musicBtn');
let audioCtx = null;
let isPlaying = false;
let melodyInterval = null;

function playSoftMelody() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    const notes = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25];

    function playNote() {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.value = notes[Math.floor(Math.random() * notes.length)];
        gain.gain.setValueAtTime(0, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.08, audioCtx.currentTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.5);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 1.5);
    }

    playNote();
    melodyInterval = setInterval(playNote, 900);
}

function stopSoftMelody() {
    if (melodyInterval) {
        clearInterval(melodyInterval);
        melodyInterval = null;
    }
}

musicBtn.addEventListener('click', () => {
    isPlaying = !isPlaying;
    if (isPlaying) {
        playSoftMelody();
        musicBtn.classList.add('playing');
        musicBtn.textContent = '⏸️';
        showToast('موسیقی پخش شد 🎵');
    } else {
        stopSoftMelody();
        musicBtn.classList.remove('playing');
        musicBtn.textContent = '🎵';
        showToast('موسیقی متوقف شد 🔇');
    }
});

// ===== گالری و لایت‌باکس (نسخه عکس) =====
const lightbox = document.getElementById('lightbox');
const lightboxContent = document.getElementById('lightboxContent');
const lightboxClose = document.getElementById('lightboxClose');

document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
        const imgSrc = item.dataset.image;
        if (!imgSrc) return;
        lightboxContent.innerHTML = `<img src="${imgSrc}" alt="عکس بزرگ">`;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

function closeLightbox() {
    lightbox.classList.remove('active');
    lightboxContent.innerHTML = '';
    document.body.style.overflow = '';
}

lightboxClose.addEventListener('click', closeLightbox);

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
    }
});

// ===== دکمه سلام رمانتیک =====
const helloBtn = document.getElementById('helloBtn');
const romanticMessages = [
    'سلام به روی ماهت 🌹',
    'امیدوارم امروزت پر از لبخند باشه 💖',
    'دلت همیشه شاد و لبت خندون 💕',
    'یه آدم خاص مثل تو، یه دنیا آرزو داره ✨',
    'قلبت پاک، راهت روشن 🌸',
    'زندگی با تو قشنگ‌تره ❤️',
    'هر روزت عاشقانه‌ترین روزت باشه 💝',
    'تو بهترینی، همیشه یادت باشه 💗'
];

helloBtn.addEventListener('click', () => {
    const randomMsg = romanticMessages[Math.floor(Math.random() * romanticMessages.length)];
    showToast(randomMsg);
    burstHearts();
});

// ===== انفجار قلب‌ها =====
function burstHearts() {
    for (let i = 0; i < 15; i++) {
        const heart = document.createElement('div');
        heart.textContent = ['❤️','💖','💕','💗','💝'][Math.floor(Math.random()*5)];
        heart.style.position = 'fixed';
        heart.style.left = '50%';
        heart.style.top = '50%';
        heart.style.fontSize = (Math.random() * 20 + 20) + 'px';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '3000';
        heart.style.transition = 'all 1.5s cubic-bezier(0.16, 1, 0.3, 1)';
        document.body.appendChild(heart);

        const angle = (Math.PI * 2 * i) / 15;
        const distance = 200 + Math.random() * 200;
        setTimeout(() => {
            heart.style.transform = `translate(${Math.cos(angle)*distance}px, ${Math.sin(angle)*distance}px) rotate(${Math.random()*720}deg)`;
            heart.style.opacity = '0';
        }, 30);

        setTimeout(() => heart.remove(), 1800);
    }
}

// ===== Toast =====
const toast = document.getElementById('toast');
const toastText = document.getElementById('toastText');
let toastTimeout = null;

function showToast(message) {
    toastText.textContent = message;
    toast.classList.add('show');
    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

console.log('❤️ وبلاگ صالح بارگذاری شد!');