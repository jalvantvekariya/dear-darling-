document.addEventListener("DOMContentLoaded", () => {
    // --- Elements ---
    const loader = document.getElementById("loader");
    const screenLanding = document.getElementById("screen-landing");
    const screenLetter = document.getElementById("screen-letter");
    const screenProposal = document.getElementById("screen-proposal");
    const screenCelebration = document.getElementById("screen-celebration");
    
    const envelopeBtn = document.getElementById("envelope-btn");
    const continueBtn = document.getElementById("continue-btn");
    const yesBtn = document.getElementById("yes-btn");
    const noBtn = document.getElementById("no-btn");
    const musicToggle = document.getElementById("music-toggle");
    const bgMusic = document.getElementById("bg-music");
    
    // --- Initial Setup ---
    setTimeout(() => {
        loader.classList.remove("active");
        loader.classList.add("hidden");
        screenLanding.classList.remove("hidden");
        screenLanding.classList.add("active");
    }, 2000);

    // --- Music Toggle ---
    let isPlaying = false;
    musicToggle.addEventListener("click", () => {
        if (isPlaying) {
            bgMusic.pause();
            musicToggle.innerText = "🎵 Play Music";
        } else {
            bgMusic.play().catch(e => console.log("Audio play prevented by browser"));
            musicToggle.innerText = "🔇 Pause Music";
        }
        isPlaying = !isPlaying;
    });

    // --- Envelope Click ---
    envelopeBtn.addEventListener("click", () => {
        screenLanding.classList.remove("active");
        screenLanding.classList.add("hidden");
        
        screenLetter.classList.remove("hidden");
        screenLetter.classList.add("active");
        
        musicToggle.classList.remove("hidden");
        if(!isPlaying) {
            bgMusic.play().then(() => {
                isPlaying = true;
                musicToggle.innerText = "🔇 Pause Music";
            }).catch(e => console.log("Autoplay blocked"));
        }

        startTyping();
    });

    // --- Typing Effect ---
    const letterText = "My dearest,\n\nFrom the moment you walked into my life, everything changed. You bring light to my darkest days and a smile to my face just by existing. Every laugh we share, every quiet moment, means the world to me.\n\nI can't imagine my future without you in it.";
    const typingContainer = document.getElementById("typing-text");
    const letterEnding = document.getElementById("letter-ending");
    let charIndex = 0;

    function startTyping() {
        if (charIndex < letterText.length) {
            if(letterText.charAt(charIndex) === '\n') {
                typingContainer.innerHTML += "<br>";
            } else {
                typingContainer.innerHTML += letterText.charAt(charIndex);
            }
            charIndex++;
            setTimeout(startTyping, 40);
        } else {
            setTimeout(() => {
                letterEnding.classList.remove("hidden");
                continueBtn.classList.remove("hidden");
            }, 500);
        }
    }

    // --- Continue to Proposal ---
    continueBtn.addEventListener("click", () => {
        screenLetter.classList.remove("active");
        screenLetter.classList.add("hidden");
        
        screenProposal.classList.remove("hidden");
        screenProposal.classList.add("active");
    });

    // --- NO Button Logic (PC + iOS/Android Friendly) ---
    let isEvading = false;

    function evadeButton() {
        if (isEvading) return;
        isEvading = true;

        // Move to body so it floats freely over everything
        if (noBtn.parentElement !== document.body) {
            document.body.appendChild(noBtn);
        }

        // Force strict text and reset classes to wipe out the old "funny messages"
        noBtn.innerText = "🤍 NO";
        noBtn.className = "btn"; // Strips out any old 'round' or weird classes
        
        noBtn.classList.add("vanish");
        
        setTimeout(() => {
            noBtn.style.position = "fixed";
            noBtn.style.zIndex = "10000";
            
            // 1. Get true mobile viewport (fixes iOS notch and bottom address bars)
            const screenWidth = window.visualViewport ? window.visualViewport.width : window.innerWidth;
            const screenHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
            
            const btnWidth = noBtn.offsetWidth || 100; 
            const btnHeight = noBtn.offsetHeight || 45;
            
            // 2. Large safe padding to keep it far away from phone edges
            const safePadding = 60; 
            const maxX = screenWidth - btnWidth - safePadding;
            const maxY = screenHeight - btnHeight - safePadding;
            
            // 3. Central card avoidance math
            const proposalCard = document.querySelector(".proposal-card");
            const cardRect = proposalCard.getBoundingClientRect();
            const cardPadding = 25; 

            let randomX, randomY;
            let overlapping = true;
            let attempts = 0;

            // Roll coordinates until a safe, visible, non-overlapping spot is found
            while (overlapping && attempts < 100) {
                randomX = Math.max(safePadding, Math.floor(Math.random() * maxX));
                randomY = Math.max(safePadding, Math.floor(Math.random() * maxY));

                const btnLeft = randomX;
                const btnRight = randomX + btnWidth;
                const btnTop = randomY;
                const btnBottom = randomY + btnHeight;

                if (
                    btnRight > (cardRect.left - cardPadding) &&
                    btnLeft < (cardRect.right + cardPadding) &&
                    btnBottom > (cardRect.top - cardPadding) &&
                    btnTop < (cardRect.bottom + cardPadding)
                ) {
                    overlapping = true; // Overlaps center box, try again
                } else {
                    overlapping = false; // Safe spot found!
                }
                attempts++;
            }

            // Apply safe coordinates
            noBtn.style.left = `${randomX}px`;
            noBtn.style.top = `${randomY}px`;
            noBtn.innerText = "🤍 NO"; // Double check text is strictly NO
            
            noBtn.classList.remove("vanish");
            isEvading = false;
        }, 200);
    }

    // Bind to BOTH click and touchstart for instant mobile responsiveness
    const triggerEvade = (e) => {
        e.preventDefault();
        evadeButton();
    };
    noBtn.addEventListener("click", triggerEvade);
    noBtn.addEventListener("touchstart", triggerEvade, {passive: false});

    // --- YES Button Logic ---
    yesBtn.addEventListener("click", () => {
        noBtn.style.display = "none";

        screenProposal.classList.remove("active");
        screenProposal.classList.add("hidden");
        
        screenCelebration.classList.remove("hidden");
        screenCelebration.classList.add("active");

        createConfetti();
        setInterval(createConfetti, 2000);
    });

    // --- Background Effects ---
    const bgEffectsContainer = document.getElementById("bg-effects");
    
    function createFloatingHeart() {
        const heart = document.createElement("div");
        heart.innerHTML = ["🌸", "💖", "✨", "🤍"][Math.floor(Math.random() * 4)];
        heart.classList.add("floating-heart");
        heart.style.left = `${Math.random() * 100}vw`;
        heart.style.animationDuration = `${Math.random() * 3 + 3}s`;
        
        bgEffectsContainer.appendChild(heart);
        
        setTimeout(() => {
            heart.remove();
        }, 6000);
    }
    setInterval(createFloatingHeart, 800);

    // --- Confetti Generator ---
    function createConfetti() {
        const colors = ['#F8D7E8', '#EBDCFF', '#FFFFFF', '#D4A373', '#ff6b6b'];
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confetti = document.createElement("div");
                confetti.classList.add("confetti");
                confetti.style.left = `${Math.random() * 100}vw`;
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                
                if (Math.random() > 0.5) confetti.style.borderRadius = "50%";
                
                bgEffectsContainer.appendChild(confetti);
                
                setTimeout(() => confetti.remove(), 3000);
            }, i * 50);
        }
    }

    // --- Cursor Trail ---
    const cursorTrailContainer = document.getElementById("cursor-trail");
    let lastMove = 0;
    document.addEventListener("mousemove", (e) => {
        const now = Date.now();
        if (now - lastMove < 50) return;
        lastMove = now;

        const heart = document.createElement("div");
        heart.innerHTML = "💖";
        heart.classList.add("cursor-heart");
        heart.style.left = `${e.pageX}px`;
        heart.style.top = `${e.pageY}px`;
        
        cursorTrailContainer.appendChild(heart);
        
        setTimeout(() => {
            heart.remove();
        }, 800);
    });
});
