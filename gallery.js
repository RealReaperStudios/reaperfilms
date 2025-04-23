let currentCategory = null;
let galleryData = null;

async function loadGalleryData() {
    try {
        const response = await fetch('.//data/gallery.json');
        if (!response.ok) {
            throw new Error('Failed to load gallery data');
        }
        galleryData = await response.json();
        
        if (!galleryData || !galleryData.categories || !Array.isArray(galleryData.categories)) {
            throw new Error('Invalid gallery data format');
        }
        
        renderCategories();
        
        // Check for hash in URL to show specific category
        const hash = window.location.hash.slice(1);
        if (hash && galleryData.categories.some(cat => cat.id === hash)) {
            showCategory(hash);
        } else if (galleryData.categories.length > 0) {
            showCategory(galleryData.categories[0].id);
        }
    } catch (error) {
        console.error('Error loading gallery data:', error);
        const galleryGrid = document.getElementById('galleryGrid');
        if (galleryGrid) {
            galleryGrid.innerHTML = '<p class="error-message">Failed to load gallery items. Please try again later.</p>';
        }
    }
}

function renderCategories() {
    const categoryNav = document.getElementById('categoryNav');
    if (!categoryNav) return;
    
    categoryNav.innerHTML = '';
    
    galleryData.categories.forEach(category => {
        const categoryIcon = document.createElement('div');
        categoryIcon.className = 'category-icon';
        categoryIcon.setAttribute('data-name', category.name);
        categoryIcon.setAttribute('data-category', category.id);
        
        const img = document.createElement('img');
        img.src = category.icon;
        img.alt = category.name;
        img.loading = 'lazy';
        
        categoryIcon.appendChild(img);
        categoryIcon.addEventListener('click', () => {
            showCategory(category.id);
            // Update URL hash without scrolling
            history.pushState(null, '', `#${category.id}`);
        });
        
        categoryNav.appendChild(categoryIcon);
    });
}

function showCategory(categoryId) {
    if (!categoryId || !galleryData) return;
    
    currentCategory = categoryId;
    
    // Update active category
    document.querySelectorAll('.category-icon').forEach(icon => {
        icon.classList.toggle('active', icon.getAttribute('data-category') === categoryId);
    });
    
    const category = galleryData.categories.find(cat => cat.id === categoryId);
    const galleryGrid = document.getElementById('galleryGrid');
    if (!galleryGrid) return;
    
    galleryGrid.innerHTML = '';
    
    if (category && Array.isArray(category.projects)) {
        category.projects.forEach(project => {
            if (Array.isArray(project.images)) {
                project.images.forEach(imageUrl => {
                    const galleryItem = document.createElement('div');
                    galleryItem.className = 'gallery-item';
                    galleryItem.setAttribute('data-title', project.title);
                    
                    const img = document.createElement('img');
                    img.src = imageUrl;
                    img.alt = project.title;
                    img.loading = 'lazy';
                    
                    galleryItem.appendChild(img);
                    galleryItem.addEventListener('click', () => {
                        showImage(imageUrl, project.title);
                    });
                    galleryGrid.appendChild(galleryItem);
                });
            }
        });
    }
}

function showImage(imageUrl, title) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    if (!lightbox || !lightboxImage) return;
    
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.removeEventListener('keydown', handleKeyPress);
    }
    
    function handleKeyPress(e) {
        if (e.key === 'Escape') {
            closeLightbox();
        }
    }
    
    // Set image
    lightboxImage.src = imageUrl;
    lightboxImage.alt = title;
    
    // Show lightbox
    lightbox.classList.add('active');
    
    // Add event listeners
    document.addEventListener('keydown', handleKeyPress);
    
    const closeButton = lightbox.querySelector('.lightbox-close');
    if (closeButton) {
        closeButton.addEventListener('click', closeLightbox);
    }
    
    // Close lightbox when clicking outside the image
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
}

// Handle browser navigation
window.addEventListener('hashchange', () => {
    const categoryId = window.location.hash.slice(1);
    if (categoryId && galleryData && galleryData.categories.some(cat => cat.id === categoryId)) {
        showCategory(categoryId);
    }
});

// Initialize gallery
document.addEventListener('DOMContentLoaded', loadGalleryData);