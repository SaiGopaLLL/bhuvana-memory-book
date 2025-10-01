class RomanticMemoryBook {
    constructor() {
        this.currentPage = 0; // 0 = cover, 1-24 = memory pages, 25 = back cover
        this.totalPages = 25;
        this.isFlipping = false;
        this.romanticEffectsEnabled = true;
        
        this.init();
    }
    
    init() {
        // Get DOM elements
        this.book = document.getElementById('book');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.currentPageSpan = document.getElementById('currentPage');
        this.totalPagesSpan = document.getElementById('totalPages');
        
        // Get all pages and sort by data-page attribute
        this.pages = Array.from(this.book.querySelectorAll('.page')).sort((a, b) => {
            return parseInt(a.getAttribute('data-page')) - parseInt(b.getAttribute('data-page'));
        });
        
        console.log(`✨ Romantic Memory Book initialized with ${this.pages.length} pages`);
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Initialize page states
        this.updateDisplay();
        
        // Setup audio context for page flip sounds
        this.setupAudio();
        
        // Add romantic loading animation
        this.createLoadingEffect();
        
        // Start romantic background effects
        this.startRomanticEffects();
        
        // Initialize gesture recognition
        this.setupGestureRecognition();
    }
    
    createLoadingEffect() {
        // Create romantic loading with floating hearts
        const hearts = ['💕', '💖', '💝', '❤️', '💗'];
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                this.createFloatingHeart(hearts[Math.floor(Math.random() * hearts.length)]);
            }, i * 200);
        }
        
        setTimeout(() => {
            document.body.classList.add('loaded');
            this.createWelcomeMessage();
        }, 1000);
    }
    
    createWelcomeMessage() {
        const message = document.createElement('div');
        message.innerHTML = '✨ Welcome to Our Beautiful Story, Bhuvana ✨';
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #FFEEC9, #FDF0F4);
            color: #C19A6B;
            padding: 20px 40px;
            border-radius: 50px;
            font-size: 1.5rem;
            font-weight: 600;
            font-family: 'Playfair Display', serif;
            text-align: center;
            z-index: 9999;
            box-shadow: 0 10px 30px rgba(193, 154, 107, 0.3);
            border: 2px solid rgba(193, 154, 107, 0.4);
            opacity: 0;
            animation: welcomeFade 4s ease-in-out;
            pointer-events: none;
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            if (message.parentNode) {
                message.remove();
            }
        }, 4000);
    }
    
    setupEventListeners() {
        // Navigation buttons with romantic feedback
        this.prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.previousPage();
            this.createButtonSparkle(this.prevBtn);
        });
        
        this.nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.nextPage();
            this.createButtonSparkle(this.nextBtn);
        });
        
        // Enhanced keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' || e.key === ' ') {
                e.preventDefault();
                this.nextPage();
            } else if (e.key === 'ArrowLeft' || e.key === 'Backspace') {
                e.preventDefault();
                this.previousPage();
            } else if (e.key === 'Home') {
                e.preventDefault();
                this.goToPage(0);
            } else if (e.key === 'End') {
                e.preventDefault();
                this.goToPage(this.totalPages);
            }
        });
        
        // Enhanced book clicking with romantic zones
        this.book.addEventListener('click', (e) => {
            if (this.isFlipping) return;
            if (e.target.closest('.nav-btn')) return;
            
            const rect = this.book.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const bookWidth = rect.width;
            
            // Create click sparkle effect
            this.createClickSparkle(e.clientX, e.clientY);
            
            // More generous click areas with romantic feedback
            if (x > bookWidth * 0.35) {
                console.log('💖 Book click: next page');
                this.nextPage();
            } else {
                console.log('💖 Book click: previous page');
                this.previousPage();
            }
        });
        
        // Enhanced touch/swipe support
        this.setupTouchHandlers();
        
        // Prevent dragging for better UX
        this.book.addEventListener('dragstart', (e) => e.preventDefault());
        
        // Window resize handler
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }
    
    setupTouchHandlers() {
        let touchStartX = 0;
        let touchStartY = 0;
        let touchEndX = 0;
        let touchEndY = 0;
        let touchMoved = false;
        let touchStartTime = 0;
        
        this.book.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].clientX;
            touchStartY = e.changedTouches[0].clientY;
            touchStartTime = Date.now();
            touchMoved = false;
        }, { passive: true });
        
        this.book.addEventListener('touchmove', (e) => {
            touchMoved = true;
        }, { passive: true });
        
        this.book.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].clientX;
            touchEndY = e.changedTouches[0].clientY;
            const touchDuration = Date.now() - touchStartTime;
            
            if (!touchMoved && touchDuration < 300) {
                // Handle tap
                this.handleTap(touchEndX, touchEndY);
            } else if (touchMoved) {
                // Handle swipe
                this.handleSwipe(touchStartX, touchEndX, touchStartY, touchEndY);
            }
        }, { passive: true });
    }
    
    handleTap(x, y) {
        const rect = this.book.getBoundingClientRect();
        const relativeX = x - rect.left;
        const bookWidth = rect.width;
        
        this.createClickSparkle(x, y);
        
        if (relativeX > bookWidth * 0.35) {
            this.nextPage();
        } else {
            this.previousPage();
        }
    }
    
    setupGestureRecognition() {
        // Double-click for special effects
        let clickCount = 0;
        let clickTimer = null;
        
        this.book.addEventListener('click', () => {
            clickCount++;
            clearTimeout(clickTimer);
            
            if (clickCount === 2) {
                this.createHeartShower();
                clickCount = 0;
            } else {
                clickTimer = setTimeout(() => {
                    clickCount = 0;
                }, 400);
            }
        });
    }
    
    setupAudio() {
        // Enhanced audio context for romantic page flip sounds
        this.audioContext = null;
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('🔇 Audio not available, but the visual magic continues!');
        }
    }
    
    playRomanticFlipSound() {
        if (!this.audioContext) return;
        
        try {
            // Create a more musical, romantic page flip sound
            const oscillator1 = this.audioContext.createOscillator();
            const oscillator2 = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            const filter = this.audioContext.createBiquadFilter();
            
            oscillator1.connect(filter);
            oscillator2.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            // Soft, romantic frequencies
            oscillator1.frequency.setValueAtTime(400, this.audioContext.currentTime);
            oscillator1.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.15);
            
            oscillator2.frequency.setValueAtTime(800, this.audioContext.currentTime);
            oscillator2.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.15);
            
            filter.frequency.setValueAtTime(1000, this.audioContext.currentTime);
            filter.Q.setValueAtTime(1, this.audioContext.currentTime);
            
            gainNode.gain.setValueAtTime(0.02, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.15);
            
            oscillator1.start(this.audioContext.currentTime);
            oscillator2.start(this.audioContext.currentTime + 0.02);
            oscillator1.stop(this.audioContext.currentTime + 0.15);
            oscillator2.stop(this.audioContext.currentTime + 0.17);
        } catch (e) {
            // Silently continue without audio
        }
    }
    
    handleSwipe(startX, endX, startY, endY) {
        if (this.isFlipping) return;
        
        const minSwipeDistance = 60;
        const swipeDistanceX = startX - endX;
        const swipeDistanceY = Math.abs(startY - endY);
        
        // Only consider horizontal swipes
        if (Math.abs(swipeDistanceX) > minSwipeDistance && swipeDistanceY < 100) {
            if (swipeDistanceX > 0) {
                console.log('💕 Swipe: next page');
                this.nextPage();
            } else {
                console.log('💕 Swipe: previous page');
                this.previousPage();
            }
        }
    }
    
    nextPage() {
        if (this.isFlipping || this.currentPage >= this.totalPages) {
            this.createDisabledFeedback();
            return;
        }
        
        console.log(`💖 Turning from page ${this.currentPage} to ${this.currentPage + 1}`);
        
        this.isFlipping = true;
        this.playRomanticFlipSound();
        
        // Get the current page element to flip
        const pageToFlip = this.pages[this.currentPage];
        
        if (pageToFlip) {
            // Add flipping class for animation
            pageToFlip.classList.add('flipping');
            
            // Update current page immediately
            this.currentPage++;
            
            // Create romantic page turn effects
            this.createPageTurnEffects();
            
            // Complete the flip after animation
            setTimeout(() => {
                pageToFlip.classList.remove('flipping');
                pageToFlip.classList.add('flipped');
                
                this.updateDisplay();
                this.isFlipping = false;
                
                console.log(`✨ Page ${this.currentPage} revealed with love`);
                
                // Special effects for certain pages
                this.checkForSpecialPages();
                
            }, 600);
        } else {
            this.updateDisplay();
            this.isFlipping = false;
        }
    }
    
    previousPage() {
        if (this.isFlipping || this.currentPage <= 0) {
            this.createDisabledFeedback();
            return;
        }
        
        console.log(`💖 Returning from page ${this.currentPage} to ${this.currentPage - 1}`);
        
        this.isFlipping = true;
        this.playRomanticFlipSound();
        
        // Go back one page
        this.currentPage--;
        
        // Get the page to unflip
        const pageToUnflip = this.pages[this.currentPage];
        
        if (pageToUnflip) {
            pageToUnflip.classList.add('flipping');
            
            this.createPageTurnEffects();
            
            setTimeout(() => {
                pageToUnflip.classList.remove('flipping');
                pageToUnflip.classList.remove('flipped');
                
                this.updateDisplay();
                this.isFlipping = false;
                
                console.log(`✨ Back to page ${this.currentPage} with grace`);
                
            }, 600);
        } else {
            this.updateDisplay();
            this.isFlipping = false;
        }
    }
    
    updateDisplay() {
        // Update page indicator with romantic language
        let pageText = '📖 Cover';
        if (this.currentPage === this.totalPages) {
            pageText = '💝 The End';
        } else if (this.currentPage > 0) {
            pageText = `💕 Memory ${this.currentPage}`;
        }
        
        this.currentPageSpan.textContent = pageText;
        
        // Update navigation buttons with enhanced visual feedback
        const prevDisabled = this.currentPage === 0;
        const nextDisabled = this.currentPage >= this.totalPages;
        
        this.prevBtn.disabled = prevDisabled;
        this.nextBtn.disabled = nextDisabled;
        
        // Enhanced visual feedback
        this.prevBtn.style.opacity = prevDisabled ? '0.3' : '1';
        this.nextBtn.style.opacity = nextDisabled ? '0.3' : '1';
        this.prevBtn.style.transform = prevDisabled ? 'scale(0.9)' : 'scale(1)';
        this.nextBtn.style.transform = nextDisabled ? 'scale(0.9)' : 'scale(1)';
        
        console.log(`📊 Display: ${pageText}, Navigation: prev(${!prevDisabled}) next(${!nextDisabled})`);
    }
    
    createPageTurnEffects() {
        // Create romantic sparkles during page turn
        const sparkleCount = 8;
        for (let i = 0; i < sparkleCount; i++) {
            setTimeout(() => {
                this.createSparkle();
            }, i * 80);
        }
        
        // Create floating hearts
        setTimeout(() => {
            this.createFloatingHeart('💕');
        }, 200);
        
        setTimeout(() => {
            this.createFloatingHeart('💖');
        }, 400);
    }
    
    checkForSpecialPages() {
        // Special effects for milestone pages
        const specialPages = [1, 8, 9, 15, 24]; // First impression, confessions, first close moment, final
        
        if (specialPages.includes(this.currentPage)) {
            setTimeout(() => {
                this.createSpecialPageEffect();
            }, 300);
        }
    }
    
    createSpecialPageEffect() {
        // Create extra romantic effects for special pages
        const hearts = ['💖', '💕', '💝', '❤️', '💗'];
        
        for (let i = 0; i < 6; i++) {
            setTimeout(() => {
                const heart = hearts[Math.floor(Math.random() * hearts.length)];
                this.createFloatingHeart(heart, true); // Enhanced version
            }, i * 150);
        }
        
        // Create gentle page glow
        this.createPageGlow();
    }
    
    createSparkle() {
        const sparkles = ['✨', '⭐', '💫', '🌟'];
        const sparkle = document.createElement('div');
        sparkle.innerHTML = sparkles[Math.floor(Math.random() * sparkles.length)];
        sparkle.style.cssText = `
            position: fixed;
            left: ${Math.random() * window.innerWidth}px;
            top: ${Math.random() * window.innerHeight}px;
            font-size: ${Math.random() * 15 + 15}px;
            pointer-events: none;
            z-index: 999;
            animation: sparkleAnimation 2s ease-out forwards;
            color: #C19A6B;
        `;
        
        document.body.appendChild(sparkle);
        
        setTimeout(() => {
            if (sparkle.parentNode) {
                sparkle.remove();
            }
        }, 2000);
    }
    
    createFloatingHeart(heartType = '💕', enhanced = false) {
        const heart = document.createElement('div');
        heart.innerHTML = heartType;
        
        const size = enhanced ? Math.random() * 20 + 25 : Math.random() * 12 + 15;
        const startX = Math.random() * window.innerWidth;
        const drift = (Math.random() - 0.5) * 200;
        
        heart.style.cssText = `
            position: fixed;
            left: ${startX}px;
            bottom: -50px;
            font-size: ${size}px;
            pointer-events: none;
            z-index: 998;
            opacity: ${enhanced ? 0.9 : 0.7};
            animation: ${enhanced ? 'heartShower' : 'floatUp'} ${enhanced ? 4 : 6}s ease-out forwards;
            filter: drop-shadow(0 0 8px rgba(255, 238, 201, 0.6));
        `;
        
        document.body.appendChild(heart);
        
        // Add drift effect
        setTimeout(() => {
            heart.style.transform = `translateX(${drift}px)`;
        }, 100);
        
        setTimeout(() => {
            if (heart.parentNode) {
                heart.remove();
            }
        }, enhanced ? 4000 : 6000);
    }
    
    createHeartShower() {
        console.log('💖 Creating romantic heart shower for Bhuvana! 💖');
        
        const hearts = ['💖', '💕', '💝', '💗', '❤️', '💘', '💞'];
        
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.innerHTML = hearts[Math.floor(Math.random() * hearts.length)];
                heart.style.cssText = `
                    position: fixed;
                    left: ${Math.random() * window.innerWidth}px;
                    top: -50px;
                    font-size: ${Math.random() * 20 + 20}px;
                    pointer-events: none;
                    z-index: 9999;
                    animation: heartShower 4s ease-out forwards;
                    filter: drop-shadow(0 0 10px rgba(255, 238, 201, 0.8));
                `;
                
                document.body.appendChild(heart);
                
                setTimeout(() => {
                    if (heart.parentNode) {
                        heart.remove();
                    }
                }, 4000);
            }, i * 100);
        }
    }
    
    createClickSparkle(x, y) {
        const sparkle = document.createElement('div');
        sparkle.innerHTML = '✨';
        sparkle.style.cssText = `
            position: fixed;
            left: ${x - 15}px;
            top: ${y - 15}px;
            font-size: 30px;
            pointer-events: none;
            z-index: 9999;
            animation: sparkleAnimation 1s ease-out forwards;
            color: #C19A6B;
            filter: drop-shadow(0 0 8px rgba(255, 238, 201, 0.8));
        `;
        
        document.body.appendChild(sparkle);
        
        setTimeout(() => {
            if (sparkle.parentNode) {
                sparkle.remove();
            }
        }, 1000);
    }
    
    createButtonSparkle(button) {
        const rect = button.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 4; i++) {
            setTimeout(() => {
                this.createClickSparkle(
                    centerX + (Math.random() - 0.5) * 60,
                    centerY + (Math.random() - 0.5) * 60
                );
            }, i * 50);
        }
    }
    
    createPageGlow() {
        const glow = document.createElement('div');
        glow.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            width: 800px;
            height: 1000px;
            transform: translate(-50%, -50%);
            background: radial-gradient(ellipse at center, rgba(255, 238, 201, 0.3), transparent);
            border-radius: 50%;
            pointer-events: none;
            z-index: 5;
            animation: gentleGlow 2s ease-out forwards;
        `;
        
        document.body.appendChild(glow);
        
        setTimeout(() => {
            if (glow.parentNode) {
                glow.remove();
            }
        }, 2000);
    }
    
    createDisabledFeedback() {
        // Visual feedback when trying to navigate beyond bounds
        const feedback = document.createElement('div');
        feedback.innerHTML = this.currentPage === 0 ? '📖 This is the beginning!' : '💕 This is our story so far...';
        feedback.style.cssText = `
            position: fixed;
            top: 20%;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #FFEEC9, #FDF0F4);
            color: #C19A6B;
            padding: 15px 30px;
            border-radius: 30px;
            font-size: 1.2rem;
            font-weight: 600;
            font-family: 'Playfair Display', serif;
            z-index: 9999;
            border: 2px solid rgba(193, 154, 107, 0.3);
            box-shadow: 0 8px 25px rgba(193, 154, 107, 0.2);
            animation: feedbackPulse 2s ease-out forwards;
            pointer-events: none;
        `;
        
        document.body.appendChild(feedback);
        
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.remove();
            }
        }, 2000);
    }
    
    startRomanticEffects() {
        // Continuous romantic background effects
        this.createPeriodicHearts();
        this.createAmbientSparkles();
    }
    
    createPeriodicHearts() {
        const createHeart = () => {
            if (this.romanticEffectsEnabled) {
                const hearts = ['♥', '💕', '💖'];
                this.createFloatingHeart(hearts[Math.floor(Math.random() * hearts.length)]);
            }
        };
        
        // Create hearts at intervals
        setInterval(createHeart, 4000);
        
        // Initial hearts
        setTimeout(createHeart, 2000);
        setTimeout(createHeart, 6000);
    }
    
    createAmbientSparkles() {
        const createSparkle = () => {
            if (this.romanticEffectsEnabled && Math.random() > 0.7) {
                this.createSparkle();
            }
        };
        
        setInterval(createSparkle, 3000);
    }
    
    handleResize() {
        // Adjust book size and effects on window resize
        console.log('📱 Adjusting for new screen size...');
        // Responsive adjustments are handled by CSS
    }
    
    // Method to jump to specific page (enhanced)
    goToPage(pageNumber) {
        if (pageNumber < 0 || pageNumber > this.totalPages || this.isFlipping) {
            console.log(`❌ Cannot navigate to page ${pageNumber}`);
            this.createDisabledFeedback();
            return;
        }
        
        console.log(`🎯 Jumping to page ${pageNumber} with style`);
        
        // Create special effect for page jumping
        this.createHeartShower();
        
        // Update all page states instantly
        this.pages.forEach((page, index) => {
            page.classList.remove('flipping');
            if (index < pageNumber) {
                page.classList.add('flipped');
            } else {
                page.classList.remove('flipped');
            }
        });
        
        this.currentPage = pageNumber;
        this.updateDisplay();
        
        // Special message for direct navigation
        setTimeout(() => {
            const message = document.createElement('div');
            message.innerHTML = `💫 Arrived at ${pageNumber === 0 ? 'the beginning' : pageNumber === this.totalPages ? 'the end' : `memory ${pageNumber}`}!`;
            message.style.cssText = `
                position: fixed;
                top: 15%;
                left: 50%;
                transform: translateX(-50%);
                background: linear-gradient(135deg, #FFEEC9, #FDF0F4);
                color: #C19A6B;
                padding: 12px 25px;
                border-radius: 25px;
                font-size: 1.1rem;
                font-weight: 600;
                font-family: 'Inter', sans-serif;
                z-index: 9999;
                border: 2px solid rgba(193, 154, 107, 0.3);
                animation: feedbackPulse 2s ease-out forwards;
                pointer-events: none;
            `;
            
            document.body.appendChild(message);
            
            setTimeout(() => {
                if (message.parentNode) {
                    message.remove();
                }
            }, 2000);
        }, 500);
    }
    
    // Debug method with romantic flair
    debugPageStates() {
        console.log('💖 === ROMANTIC MEMORY BOOK DEBUG === 💖');
        console.log(`📖 Current page: ${this.currentPage}`);
        console.log(`📚 Total pages: ${this.totalPages}`);
        console.log(`🔄 Is flipping: ${this.isFlipping}`);
        console.log(`✨ Romantic effects: ${this.romanticEffectsEnabled ? 'ON' : 'OFF'}`);
        
        this.pages.forEach((page, index) => {
            const dataPage = page.getAttribute('data-page');
            const isFlipped = page.classList.contains('flipped');
            const isFlipping = page.classList.contains('flipping');
            console.log(`📄 Page ${index}: data-page=${dataPage}, flipped=${isFlipped}, flipping=${isFlipping}`);
        });
        console.log('💕 ========================== 💕');
    }
    
    // Toggle romantic effects
    toggleRomanticEffects() {
        this.romanticEffectsEnabled = !this.romanticEffectsEnabled;
        console.log(`✨ Romantic effects ${this.romanticEffectsEnabled ? 'enabled' : 'disabled'}`);
        
        if (this.romanticEffectsEnabled) {
            this.createHeartShower();
        }
    }
}

// Add enhanced CSS animations
const romanticStyles = document.createElement('style');
romanticStyles.textContent = `
    @keyframes welcomeFade {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
        20% { opacity: 1; transform: translate(-50%, -50%) scale(1.05); }
        80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
    }
    
    @keyframes feedbackPulse {
        0% { opacity: 0; transform: translateX(-50%) scale(0.8); }
        20% { opacity: 1; transform: translateX(-50%) scale(1.1); }
        80% { opacity: 1; transform: translateX(-50%) scale(1); }
        100% { opacity: 0; transform: translateX(-50%) scale(0.9); }
    }
    
    @keyframes floatUp {
        0% {
            opacity: 0;
            transform: translateY(0) rotate(0deg);
        }
        10% {
            opacity: 0.8;
        }
        90% {
            opacity: 0.6;
        }
        100% {
            opacity: 0;
            transform: translateY(-100vh) rotate(360deg);
        }
    }
    
    @keyframes gentleGlow {
        0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
        }
        50% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.2);
        }
        100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1.5);
        }
    }
`;
document.head.appendChild(romanticStyles);

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('💖 Initializing Romantic Memory Book for Bhuvana...');
    
    // Create the romantic memory book instance
    const romanticBook = new RomanticMemoryBook();
    
    // Make it globally accessible for debugging and interaction
    window.memoryBook = romanticBook;
    window.bhuvanaBook = romanticBook; // Special reference for Bhuvana
    
    // Enhanced debug helper functions
    window.debugBook = () => romanticBook.debugPageStates();
    window.goToPage = (page) => romanticBook.goToPage(page);
    window.createHeartShower = () => romanticBook.createHeartShower();
    window.toggleEffects = () => romanticBook.toggleRomanticEffects();
    
    // Special easter eggs and interactions
    let secretSequence = [];
    const secret = ['b', 'h', 'u', 'v', 'a', 'n', 'a'];
    
    document.addEventListener('keydown', (e) => {
        secretSequence.push(e.key.toLowerCase());
        if (secretSequence.length > secret.length) {
            secretSequence.shift();
        }
        
        if (secretSequence.join('') === secret.join('')) {
            console.log('💝 SECRET ACTIVATED: Special message for Bhuvana! 💝');
            romanticBook.createSpecialMessage();
            secretSequence = [];
        }
    });
    
    // Add special message method
    romanticBook.createSpecialMessage = function() {
        const message = document.createElement('div');
        message.innerHTML = `
            <div style="text-align: center;">
                <h2 style="margin-bottom: 15px; color: #C19A6B; font-family: 'Playfair Display', serif;">💖 For My Dearest Bhuvana 💖</h2>
                <p style="margin-bottom: 10px; font-size: 1.2rem;">Every page of this book is filled with love</p>
                <p style="margin-bottom: 10px; font-size: 1.2rem;">Every memory is a treasure in my heart</p>
                <p style="font-size: 1.2rem; font-style: italic;">You make every moment magical ✨</p>
            </div>
        `;
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #FFEEC9, #FDF0F4);
            color: #C19A6B;
            padding: 40px;
            border-radius: 20px;
            font-family: 'Inter', sans-serif;
            z-index: 9999;
            box-shadow: 0 20px 60px rgba(193, 154, 107, 0.3);
            border: 3px solid rgba(193, 154, 107, 0.5);
            max-width: 90vw;
            animation: welcomeFade 6s ease-in-out;
            pointer-events: none;
        `;
        
        document.body.appendChild(message);
        this.createHeartShower();
        
        setTimeout(() => {
            if (message.parentNode) {
                message.remove();
            }
        }, 6000);
    };
    
    // Add touch feedback for better mobile experience
    const addTouchFeedback = (element) => {
        element.addEventListener('touchstart', () => {
            element.style.transform = element.style.transform.replace('scale(1)', 'scale(0.95)') || 'scale(0.95)';
            element.style.transition = 'transform 0.1s ease';
        }, { passive: true });
        
        element.addEventListener('touchend', () => {
            setTimeout(() => {
                element.style.transform = element.style.transform.replace('scale(0.95)', '');
                element.style.transition = 'transform 0.3s ease';
            }, 100);
        }, { passive: true });
    };
    
    addTouchFeedback(romanticBook.prevBtn);
    addTouchFeedback(romanticBook.nextBtn);
    
    console.log('✨ Romantic Memory Book ready! ✨');
    console.log('💡 Debug commands: debugBook(), goToPage(n), createHeartShower(), toggleEffects()');
    console.log('🎮 Controls: Arrow keys, space, backspace, home, end, or click/touch book');
    console.log('💖 Type "bhuvana" for a special surprise!');
    
    // Create initial welcome hearts
    setTimeout(() => romanticBook.createFloatingHeart('💕'), 1500);
    setTimeout(() => romanticBook.createFloatingHeart('💖'), 2000);
    setTimeout(() => romanticBook.createFloatingHeart('💝'), 2500);
});

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', () => {
    if (window.memoryBook) {
        window.memoryBook.romanticEffectsEnabled = !document.hidden;
        
        if (!document.hidden) {
            // Welcome back with hearts
            setTimeout(() => {
                window.memoryBook.createFloatingHeart('💕');
            }, 500);
        }
    }
});

// Handle errors gracefully
window.addEventListener('error', (e) => {
    console.log('🛡️ Gracefully handling any issues to keep the magic alive...');
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RomanticMemoryBook;
}