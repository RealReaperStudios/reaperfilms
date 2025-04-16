let currentCategory = null;
let galleryData = null;

async function loadGalleryData() {
    try {
        const response = await fetch('.//data/gallery.json');
        galleryData = await response.json();
        renderCategories();
        if (galleryData.categories.length > 0) {
            showCategory(galleryData.categories[0].id);
        }
    } catch (error) {
        console.error('Error loading gallery data:', error);
    }
}

function renderCategories() {
    const categoryNav = document.getElementById('categoryNav');
    categoryNav.innerHTML = '';
    
    galleryData.categories.forEach(category => {
        const categoryIcon = document.createElement('div');
        categoryIcon.className = 'category-icon';
        categoryIcon.setAttribute('data-name', category.name);
        categoryIcon.innerHTML = `<img src="${category.icon}" alt="${category.name}">`;
        categoryIcon.addEventListener('click', () => showCategory(category.id));
        categoryNav.appendChild(categoryIcon);
    });
}

function showCategory(categoryId) {
    currentCategory = categoryId;
    
    // Update active category
    document.querySelectorAll('.category-icon').forEach((icon, index) => {
        icon.classList.toggle('active', galleryData.categories[index].id === categoryId);
    });
    
    const category = galleryData.categories.find(cat => cat.id === categoryId);
    const galleryGrid = document.getElementById('galleryGrid');
    galleryGrid.innerHTML = '';
    
    if (category) {
        category.projects.forEach(project => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.setAttribute('data-title', project.title);
            galleryItem.innerHTML = `<img src="${project.thumbnail}" alt="${project.title}">`;
            
            galleryItem.addEventListener('click', () => showProjectImages(project));
            galleryGrid.appendChild(galleryItem);
        });
    }
}

function showProjectImages(project) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    let currentImageIndex = 0;
    
    function showImage(index) {
        lightboxImage.src = project.images[index];
        lightboxImage.alt = `${project.title} - Image ${index + 1}`;
    }
    
    showImage(currentImageIndex);
    lightbox.classList.add('active');
    
    lightboxImage.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex + 1) % project.images.length;
        showImage(currentImageIndex);
    });
    
    document.querySelector('.lightbox-close').addEventListener('click', () => {
        lightbox.classList.remove('active');
    });
}

// Initialize gallery
document.addEventListener('DOMContentLoaded', loadGalleryData);