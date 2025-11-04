document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    const submitButton = document.getElementById('submit-button');
    const formStatus = document.getElementById('form-status');
    
    // Security settings
    const MAX_ATTEMPTS = 5; // Maximum attempts per session
    const COOLDOWN_PERIOD = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    const MIN_SUBMISSION_INTERVAL = 60 * 1000; // 1 minute between submissions
    
    // GitHub repository settings
    const GITHUB_REPO = 'andrewip1027/drewfolio.me';
    const MESSAGES_PATH = 'data/messages.json';

    // Track submission attempts
    let submissionAttempts = parseInt(localStorage.getItem('submissionAttempts') || '0');
    let lastSubmissionTime = parseInt(localStorage.getItem('lastSubmissionTime') || '0');
    let cooldownUntil = parseInt(localStorage.getItem('cooldownUntil') || '0');

    function showStatus(message, isError = false) {
        formStatus.textContent = message;
        formStatus.className = `mt-4 text-center ${isError ? 'text-red-600' : 'text-green-600'}`;
        setTimeout(() => {
            formStatus.textContent = '';
        }, 5000);
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validateInput(text) {
        // Check for suspicious patterns
        const suspiciousPatterns = [
            /<script/i,          // Script tags
            /javascript:/i,      // JavaScript protocol
            /data:/i,           // Data URLs
            /on\w+=/i,          // Event handlers
            /^\s*$/,            // Empty or whitespace only
            /[^\x20-\x7E]/      // Non-printable characters
        ];

        return !suspiciousPatterns.some(pattern => pattern.test(text));
    }

    function isSpam(message) {
        // Basic spam detection
        const spamIndicators = [
            /buy.{0,20}now/i,
            /\b(porn|sex|xxx)\b/i,
            /\b(casino|gambling|bet)\b/i,
            /(http|https):\/\/\S+/g, // URLs
            /\$\d+/,                 // Dollar amounts
            /free.{0,20}trial/i
        ];

        return spamIndicators.some(pattern => pattern.test(message));
    }

    function checkRateLimit() {
        const now = Date.now();

        // Check cooldown period
        if (now < cooldownUntil) {
            const hoursRemaining = Math.ceil((cooldownUntil - now) / (1000 * 60 * 60));
            throw new Error(`Please wait ${hoursRemaining} hours before trying again.`);
        }

        // Check submission interval
        if (now - lastSubmissionTime < MIN_SUBMISSION_INTERVAL) {
            throw new Error('Please wait at least 1 minute between submissions.');
        }

        // Check attempts
        if (submissionAttempts >= MAX_ATTEMPTS) {
            cooldownUntil = now + COOLDOWN_PERIOD;
            localStorage.setItem('cooldownUntil', cooldownUntil.toString());
            throw new Error('Too many attempts. Please try again in 24 hours.');
        }
    }

    function updateRateLimit() {
        submissionAttempts++;
        lastSubmissionTime = Date.now();
        localStorage.setItem('submissionAttempts', submissionAttempts.toString());
        localStorage.setItem('lastSubmissionTime', lastSubmissionTime.toString());

        // Reset attempts after cooldown period
        setTimeout(() => {
            submissionAttempts = 0;
            localStorage.setItem('submissionAttempts', '0');
        }, COOLDOWN_PERIOD);
    }

    async function getMessages() {
        const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${MESSAGES_PATH}`);
        if (!response.ok) throw new Error('Failed to fetch messages');
        const data = await response.json();
        return JSON.parse(atob(data.content));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        
        try {
            // Check rate limiting
            checkRateLimit();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();

            // Validation
            if (!name || !email || !subject || !message) {
                throw new Error('Please fill in all fields');
            }

            if (!validateEmail(email)) {
                throw new Error('Please enter a valid email address');
            }

            // Security validation
            if (![name, subject, message].every(validateInput)) {
                throw new Error('Invalid input detected');
            }

            if (isSpam(message) || isSpam(subject)) {
                throw new Error('Your message was detected as spam');
            }

            // Disable button during submission
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Sending...';

            const messageData = {
                name,
                email,
                subject,
                message,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                ipHash: await hashIP()
            };

            // Store in localStorage temporarily (will be cleared on successful GitHub storage)
            const pendingMessages = JSON.parse(localStorage.getItem('pendingMessages') || '[]');
            pendingMessages.push(messageData);
            localStorage.setItem('pendingMessages', JSON.stringify(pendingMessages));

            // Log the message data (for demonstration)
            console.log('Message stored locally:', messageData);

            // Successfully stored
            updateRateLimit();
            contactForm.reset();
            showStatus('Message sent successfully! I will get back to you soon.');

        } catch (error) {
            console.error('Error sending message:', error);
            showStatus(error.message || 'Failed to send message. Please try again.', true);
        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML = 'Send Message';
        }
    }

    // Generate a hash of the IP (for tracking unique submissions without storing actual IPs)
    async function hashIP() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            const ip = data.ip;
            
            // Hash the IP
            const msgBuffer = new TextEncoder().encode(ip);
            const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        } catch (error) {
            console.error('Failed to get IP hash:', error);
            return 'unknown';
        }
    }

    contactForm.addEventListener('submit', handleSubmit);

    // Reset submission attempts at midnight
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const timeUntilMidnight = tomorrow - now;
    setTimeout(() => {
        submissionAttempts = 0;
        localStorage.setItem('submissionAttempts', '0');
    }, timeUntilMidnight);
});