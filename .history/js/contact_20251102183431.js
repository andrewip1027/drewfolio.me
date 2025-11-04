document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    const submitButton = document.getElementById('submit-button');
    const formStatus = document.getElementById('form-status');

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

    async function handleSubmit(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();

        // Basic validation
        if (!name || !email || !subject || !message) {
            showStatus('Please fill in all fields', true);
            return;
        }

        if (!validateEmail(email)) {
            showStatus('Please enter a valid email address', true);
            return;
        }

        // Disable button during submission
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Sending...';

        try {
            // You can replace this with your actual email service endpoint
            // For now, we'll simulate an API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Email content for demonstration
            const emailContent = {
                name,
                email,
                subject,
                message,
                timestamp: new Date().toISOString()
            };

            // Log the email content to console (for demonstration)
            console.log('Email would be sent with:', emailContent);

            // Clear the form
            contactForm.reset();
            showStatus('Message sent successfully! I will get back to you soon.');

        } catch (error) {
            console.error('Error sending message:', error);
            showStatus('Failed to send message. Please try again.', true);
        } finally {
            // Re-enable button
            submitButton.disabled = false;
            submitButton.innerHTML = 'Send Message';
        }
    }

    contactForm.addEventListener('submit', handleSubmit);
});