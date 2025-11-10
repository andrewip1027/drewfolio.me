// // Initialize gallery when the DOM is loaded
// document.addEventListener('DOMContentLoaded', function() {
//     initializeWesternCopperGallery();
// });

// function initializeWesternCopperGallery() {
//     const galleryContainer = document.getElementById('westernCopperGallery');
//     if (!galleryContainer) return;

//     // List of images in the western_copper folder
//     const images = [
//         'images/Gallery/western_copper/1.jpg',
//         'images/Gallery/western_copper/2.jpg',
//         'images/Gallery/western_copper/3.jpg',
//         'images/Gallery/western_copper/4.jpg',
//         'images/Gallery/western_copper/5.jpg',
//         'images/Gallery/western_copper/6.jpg',
//         'images/Gallery/western_copper/7.jpg',
//         'images/Gallery/western_copper/8.jpg',
//         'images/Gallery/western_copper/9.jpg',
//         'images/Gallery/western_copper/10.jpg'
//     ];

//     // Create and add images to the gallery
//     images.forEach(imagePath => {
//         const imgContainer = document.createElement('div');
//         imgContainer.className = 'flex-shrink-0';
        
//         const img = document.createElement('img');
//         img.src = imagePath;
//         img.className = 'h-64 w-auto rounded-lg';
//         img.alt = 'Western Copper Gallery Image';
//         img.style.cursor = 'pointer';
        
//         // Add click event for modal
//         img.onclick = function() {
//             openModal(imagePath);
//         };
        
//         imgContainer.appendChild(img);
//         galleryContainer.appendChild(imgContainer);
//     });
// }

// // Modal functionality
// function openModal(imagePath) {
//     const modal = document.createElement('div');
//     modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75';
//     modal.onclick = function() {
//         modal.remove();
//     };

//     const modalImg = document.createElement('img');
//     modalImg.src = imagePath;
//     modalImg.className = 'max-h-[90vh] max-w-[90vw] object-contain';
//     modalImg.alt = 'Western Copper Gallery Image - Enlarged';

//     modal.appendChild(modalImg);
//     document.body.appendChild(modal);
// }