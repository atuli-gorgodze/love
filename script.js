const relationshipStart = new Date('2025-05-02T00:00:00');

function updateElapsedCounter() {
    const now = new Date();
    const elapsedMs = now - relationshipStart;

    if (elapsedMs < 0) {
        return;
    }

    const totalSeconds = Math.floor(elapsedMs / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    document.getElementById('elapsed-days').textContent = days;
    document.getElementById('elapsed-hours').textContent = hours;
    document.getElementById('elapsed-minutes').textContent = minutes;
    document.getElementById('elapsed-seconds').textContent = seconds;
}

setInterval(updateElapsedCounter, 1000);
updateElapsedCounter();

document.querySelectorAll('.gallery-item').forEach((item) => {
    item.addEventListener('mouseenter', () => {
        item.style.animation = 'none';
        setTimeout(() => {
            item.style.animation = 'pulse 0.5s ease-out';
        }, 10);
    });
});

const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.03); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);

const heartVideo = document.getElementById('heart-video');
const trackTitle = document.getElementById('music-track');
const trackStatus = document.getElementById('track-status');
const videoCards = document.querySelectorAll('.video-card');

function updateMusicStatus() {
    if (!heartVideo || !trackStatus) return;
    trackStatus.textContent = heartVideo.paused ? 'სტატუსი: პაუზა' : 'სტატუსი: ჟღერს';
}

function setHeartVideo(src, title) {
    const wrap = document.querySelector('.video-player-wrap');
    if (wrap) {
        wrap.style.display = 'block';
    }
    if (!heartVideo) return;
    const sourceElement = heartVideo.querySelector('source');
    if (sourceElement && sourceElement.src !== src) {
        sourceElement.src = src;
        heartVideo.load();
    }
    if (trackTitle) {
        trackTitle.textContent = title;
    }
    heartVideo.play().catch(() => {
        // Autoplay may be blocked; user can press play for audio/video
    });
}

videoCards.forEach((card) => {
    card.addEventListener('click', () => {
        const src = card.dataset.video;
        const title = card.dataset.title || 'ჩვენი ვიდეო';
        setHeartVideo(src, title);
    });
});

function attachHoverPreviews() {
    document.querySelectorAll('.video-card').forEach((card) => {
        const preview = card.querySelector('.card-video');
        if (!preview) return;

        card.addEventListener('mouseover', () => {
            preview.currentTime = 0;
            preview.play().catch(() => {});
        });

        card.addEventListener('mouseout', () => {
            preview.pause();
            preview.currentTime = 0;
        });
    });
}

if ('requestIdleCallback' in window) {
    requestIdleCallback(attachHoverPreviews);
} else {
    setTimeout(attachHoverPreviews, 100);
}

const musicLink = document.getElementById('music-link');
const playMusicBtn = document.getElementById('play-music');
const musicPlayer = document.getElementById('music-player');

if (playMusicBtn && musicPlayer && musicLink) {
    playMusicBtn.addEventListener('click', async () => {
        const link = musicLink.value.trim();

        if (!link) return;

        try {
            musicPlayer.pause();        // stop previous audio
            musicPlayer.src = link;
            musicPlayer.load();

            // small delay helps mobile browsers register source change
            setTimeout(async () => {
                try {
                    await musicPlayer.play();
                } catch (err) {
                    console.warn('Play failed:', err);
                }
            }, 50);

        } catch (error) {
            console.warn('Error setting music:', error);
        }
    });
}

if (heartVideo) {
    heartVideo.addEventListener('play', updateMusicStatus);
    heartVideo.addEventListener('pause', updateMusicStatus);
    updateMusicStatus();
}

