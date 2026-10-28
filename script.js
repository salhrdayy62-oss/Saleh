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

// ===== حالت شب/روز (پیش‌فرض: تاریک) =====
const themeBtn = document.getElementById('themeBtn');
const savedTheme = localStorage.getItem('theme');

// اگه کاربر قبلاً "روشن" انتخاب کرده بود → روشن، وگرنه تاریک (پیش‌فرض)
if (savedTheme === 'light') {
    document.body.classList.remove('dark');
    themeBtn.textContent = '🌙';
} else {
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
// ===== پخش موسیقی (فایل صوتی دلخواه) =====
const musicBtn = document.getElementById('musicBtn');

// 👇👇👇 نام فایل آهنگ خودت رو اینجا بذار 👇👇👇
const music = new Audio('music.mp3');
music.loop = true;      // تکرار خودکار
music.volume = 0.6;     // صدا (۰ تا ۱)

let isPlaying = false;

musicBtn.addEventListener('click', () => {
    if (!isPlaying) {
        music.play()
            .then(() => {
                isPlaying = true;
                musicBtn.classList.add('playing');
                musicBtn.textContent = '⏸️';
                showToast('موسیقی پخش شد 🎵');
            })
            .catch(err => {
                console.error('خطا در پخش:', err);
                showToast('فایل موسیقی پیدا نشد ❌');
            });
    } else {
        music.pause();
        isPlaying = false;
        musicBtn.classList.remove('playing');
        musicBtn.textContent = '🎵';
        showToast('موسیقی متوقف شد 🔇');
    }
});

// وقتی آهنگ تموم شد (اختیاری - چون loop روشنه)
music.addEventListener('ended', () => {
    isPlaying = false;
    musicBtn.classList.remove('playing');
    musicBtn.textContent = '🎵';
});

// قطع آهنگ هنگام بستن صفحه
window.addEventListener('beforeunload', () => {
    music.pause();
});

// ===== دکمه "بیشتر بدونم" - اسکرول + قلب + موسیقی =====
const scrollBtn = document.getElementById('scrollBtn');

scrollBtn.addEventListener('click', () => {
    // افکت فشردن دکمه
    scrollBtn.style.transform = 'scale(0.95)';
    setTimeout(() => scrollBtn.style.transform = '', 150);

    // ۱. انفجار قلب‌ها 💖
    burstHearts();

    // ۲. اسکرول نرم به بخش درباره من
    setTimeout(() => scrollToSection('about'), 200);

    // ۳. پخش موسیقی (اگه قبلاً پخش نشده) 🎵
    if (!isPlaying) {
        music.play().then(() => {
            isPlaying = true;
            musicBtn.classList.add('playing');
            musicBtn.textContent = '⏸️';
        }).catch(() => {
            // اگه فایل موسیقی نبود، بی‌صدا رد شه
        });
    }

    // ۴. پیام خوش‌آمد 💫
    showToast('قلبم برات می‌تپه 💖');
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