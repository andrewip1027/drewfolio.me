// Gallery image loading functionality
const initializeGallery = () => {
    const loadGalleryForSection = async (containerId, folderPath) => {
        const container = document.getElementById(containerId);
        if (!container) return;

        // Clear any existing content
        container.innerHTML = '';

        // Create the images based on file names in chronological order
        const imageNames = [
            '20231230_150155.jpg',
            '20240120_101640.jpg',
            '20240127_143935.jpg',
            '20240127_144226.jpg',
            '20240130_160140.jpg'
        ];

        // Create image elements
        imageNames.forEach(imageName => {
            const imagePath = `${folderPath}/${imageName}`;
            const div = document.createElement('div');
            div.className = 'relative aspect-video w-64 flex-shrink-0 overflow-hidden rounded-lg';
            
            const img = document.createElement('img');
            img.src = imagePath;
            img.alt = `Work experience image`;
            img.className = 'object-cover w-full h-full transform hover:scale-105 transition duration-300 zoomable-image';
            img.onclick = () => openImageModal(img.src);
            
            div.appendChild(img);
            container.appendChild(div);
        });
    };

    // Initialize company section galleries
    const initializeCompanyGalleries = async () => {
        await Promise.all([
            loadGalleryForSection('westernCopperGallery', 'images/Gallery/western_copper'),
            loadGalleryForSection('hktdcGallery', 'images/Gallery/hktdc'),
            loadGalleryForSection('powerpegGallery', 'images/Gallery/powerpeg'),
            loadGalleryForSection('interdevGallery', 'images/Gallery/interdev')
        ]);
    };

    // Image modal functionality
    const initializeImageModal = () => {
        // Create modal if it doesn't exist
        if (!document.querySelector('.modal')) {
            const imageModal = document.createElement('div');
            imageModal.className = 'modal';
            imageModal.innerHTML = `
                <span class="modal-close" onclick="closeImageModal()">&times;</span>
                <img class="modal-content" id="modalImage">
            `;
            document.body.appendChild(imageModal);

            // Close modal when clicking outside
            imageModal.addEventListener('click', function(e) {
                if (e.target === this) {
                    closeImageModal();
                }
            });

            // Close modal with escape key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    closeImageModal();
                }
            });
        }
    };

    // Initialize everything when DOM is loaded
    initializeCompanyGalleries();
    initializeImageModal();
};

// Modal functions need to be global as they're called from HTML
window.openImageModal = function(imageSrc) {
    const modal = document.querySelector('.modal');
    const modalImg = document.getElementById('modalImage');
    modal.classList.add('active');
    modalImg.src = imageSrc;
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
};

window.closeImageModal = function() {
    const modal = document.querySelector('.modal');
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
};

// Initialize gallery when the page loads
document.addEventListener('DOMContentLoaded', initializeGallery);