// GreenScape Adventures - Gallery Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initImageSlider();
    initGalleryFilters();
    initPhotoModal();
    initLazyLoading();
});

// Image Slider Functionality
function initImageSlider() {
    const slider = document.querySelector('.slider-wrapper');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dots = document.querySelectorAll('.dot');
    
    if (!slider || slides.length === 0) return;
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    // Show specific slide
    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }
    
    // Next slide
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
    }
    
    // Previous slide
    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(currentSlide);
    }
    
    // Go to specific slide
    function goToSlide(index) {
        currentSlide = index;
        showSlide(currentSlide);
    }
    
    // Event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
    }
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });
    
    // Touch/swipe support
    let startX = 0;
    let endX = 0;
    
    slider.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
    });
    
    slider.addEventListener('touchend', function(e) {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const threshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }
    
    // Auto-play slider
    let autoPlayInterval;
    
    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 5000);
    }
    
    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }
    
    // Start auto-play
    startAutoPlay();
    
    // Pause on hover
    slider.addEventListener('mouseenter', stopAutoPlay);
    slider.addEventListener('mouseleave', startAutoPlay);
    
    // Pause on touch
    slider.addEventListener('touchstart', stopAutoPlay);
    slider.addEventListener('touchend', function() {
        setTimeout(startAutoPlay, 3000);
    });
}

// Gallery Filter Functionality
function initGalleryFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (!filterButtons.length || !galleryItems.length) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter gallery items
            filterGalleryItems(filter);
        });
    });
}

function filterGalleryItems(filter) {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        const category = item.dataset.category;
        const shouldShow = filter === 'all' || category === filter;
        
        if (shouldShow) {
            item.style.display = 'block';
            setTimeout(() => {
                item.classList.add('fade-in');
            }, 100);
        } else {
            item.classList.remove('fade-in');
            setTimeout(() => {
                item.style.display = 'none';
            }, 300);
        }
    });
}

// Photo Modal Functionality
function initPhotoModal() {
    const modal = document.getElementById('photoModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalClose = document.getElementById('modalClose');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (!modal) return;
    
    // Open modal when clicking gallery items
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            const title = this.querySelector('h3').textContent;
            const description = this.querySelector('p').textContent;
            
            openPhotoModal(img.src, title, description);
        });
    });
    
    // Close modal
    if (modalClose) {
        modalClose.addEventListener('click', closePhotoModal);
    }
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closePhotoModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closePhotoModal();
        }
    });
}

function openPhotoModal(imageSrc, title, description) {
    const modal = document.getElementById('photoModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    
    if (!modal) return;
    
    modalImage.src = imageSrc;
    modalImage.alt = title;
    modalTitle.textContent = title;
    modalDescription.textContent = description;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Add loading effect
    modalImage.style.opacity = '0';
    modalImage.onload = function() {
        this.style.opacity = '1';
    };
}

function closePhotoModal() {
    const modal = document.getElementById('photoModal');
    
    if (!modal) return;
    
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Lazy Loading for Images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if (!images.length) return;
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Gallery Search Functionality
function initGallerySearch() {
    const searchInput = document.querySelector('#gallery-search');
    
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        galleryItems.forEach(item => {
            const title = item.querySelector('h3').textContent.toLowerCase();
            const description = item.querySelector('p').textContent.toLowerCase();
            const category = item.dataset.category.toLowerCase();
            
            const matches = title.includes(query) || 
                          description.includes(query) || 
                          category.includes(query);
            
            if (matches) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.classList.add('fade-in');
                }, 100);
            } else {
                item.classList.remove('fade-in');
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
        
        // Update filter buttons if no results
        updateFilterButtons(query);
    });
}

function updateFilterButtons(query) {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    filterButtons.forEach(button => {
        const filter = button.dataset.filter;
        const visibleItems = Array.from(galleryItems).filter(item => {
            const title = item.querySelector('h3').textContent.toLowerCase();
            const description = item.querySelector('p').textContent.toLowerCase();
            const category = item.dataset.category.toLowerCase();
            
            const matchesSearch = title.includes(query) || 
                                description.includes(query) || 
                                category.includes(query);
            
            const matchesFilter = filter === 'all' || item.dataset.category === filter;
            
            return matchesSearch && matchesFilter;
        });
        
        button.style.opacity = visibleItems.length > 0 ? '1' : '0.5';
        button.disabled = visibleItems.length === 0;
    });
}

// Fullscreen functionality
function toggleFullscreen() {
    const modal = document.getElementById('photoModal');
    
    if (!modal) return;
    
    if (!document.fullscreenElement) {
        modal.requestFullscreen().catch(err => {
            console.log('Error attempting to enable fullscreen:', err);
        });
    } else {
        document.exitFullscreen();
    }
}

// Keyboard shortcuts for modal
document.addEventListener('keydown', function(e) {
    const modal = document.getElementById('photoModal');
    
    if (!modal || !modal.classList.contains('active')) return;
    
    switch(e.key) {
        case 'f':
        case 'F':
            toggleFullscreen();
            break;
        case 'ArrowLeft':
            // Previous image (if implemented)
            break;
        case 'ArrowRight':
            // Next image (if implemented)
            break;
    }
});

// Image preloading for better performance
function preloadImages() {
    const images = document.querySelectorAll('.gallery-item img');
    const imageUrls = Array.from(images).map(img => img.src);
    
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

// Initialize gallery features
document.addEventListener('DOMContentLoaded', function() {
    initGallerySearch();
    preloadImages();
    
    // Add smooth transitions to gallery items
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
        item.classList.add('fade-in');
    });
});

// Export functions for use in other files
window.GalleryManager = {
    openPhotoModal,
    closePhotoModal,
    filterGalleryItems,
    toggleFullscreen,
    preloadImages
};
