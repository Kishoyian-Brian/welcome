// GreenScape Adventures - Activities Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Activities are now static in HTML, so we just initialize other functionality
    initActivitiesPage();
});

// Initialize activities page functionality
function initActivitiesPage() {
    // Add animation to activity cards
    const cards = document.querySelectorAll('.activity-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('fade-in');
    });
    
    // Initialize favorites functionality
    initFavorites();
    
    // Add event listeners for filtering (if filter buttons exist)
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.dataset.filter;
            filterActivities(category);
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Add search functionality (if search input exists)
    const searchInput = document.querySelector('#activity-search');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            searchActivities(this.value);
        });
    }
}

// Display activities in the grid (now using static content)
function displayActivities(activities) {
    // This function is kept for compatibility but activities are now static in HTML
    console.log('Activities are now static in HTML');
}

// Show error message (not needed for static content)
function showErrorMessage(message) {
    // This function is kept for compatibility but errors shouldn't occur with static content
    console.log('Error message (static content):', message);
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    
    return text.replace(/[&<>"']/g, function(m) {
        return map[m];
    });
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
        return 'yesterday';
    } else if (diffDays < 7) {
        return `${diffDays} days ago`;
    } else if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
}

// Filter activities by category (if implemented)
function filterActivities(category) {
    const cards = document.querySelectorAll('.activity-card');
    
    cards.forEach(card => {
        const cardCategory = card.dataset.category;
        
        if (category === 'all' || cardCategory === category) {
            card.style.display = 'block';
            card.classList.add('fade-in');
        } else {
            card.style.display = 'none';
            card.classList.remove('fade-in');
        }
    });
}

// Search activities
function searchActivities(query) {
    const cards = document.querySelectorAll('.activity-card');
    const searchTerm = query.toLowerCase().trim();
    
    if (!searchTerm) {
        cards.forEach(card => {
            card.style.display = 'block';
            card.classList.add('fade-in');
        });
        return;
    }
    
    cards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            card.style.display = 'block';
            card.classList.add('fade-in');
        } else {
            card.style.display = 'none';
            card.classList.remove('fade-in');
        }
    });
}

// Add activity to favorites (localStorage)
function toggleFavorite(activityId) {
    const favorites = getFavorites();
    const index = favorites.indexOf(activityId);
    
    if (index > -1) {
        favorites.splice(index, 1);
        removeFromFavorites(activityId);
    } else {
        favorites.push(activityId);
        addToFavorites(activityId);
    }
    
    localStorage.setItem('greenscape_favorites', JSON.stringify(favorites));
}

function getFavorites() {
    const favorites = localStorage.getItem('greenscape_favorites');
    return favorites ? JSON.parse(favorites) : [];
}

function addToFavorites(activityId) {
    const card = document.querySelector(`[data-activity-id="${activityId}"]`);
    if (card) {
        const favoriteBtn = card.querySelector('.favorite-btn');
        if (favoriteBtn) {
            favoriteBtn.classList.add('active');
            favoriteBtn.innerHTML = '<i class="fas fa-heart"></i>';
        }
    }
}

function removeFromFavorites(activityId) {
    const card = document.querySelector(`[data-activity-id="${activityId}"]`);
    if (card) {
        const favoriteBtn = card.querySelector('.favorite-btn');
        if (favoriteBtn) {
            favoriteBtn.classList.remove('active');
            favoriteBtn.innerHTML = '<i class="far fa-heart"></i>';
        }
    }
}

// Initialize favorites on page load
function initFavorites() {
    const favorites = getFavorites();
    favorites.forEach(activityId => {
        addToFavorites(activityId);
    });
}

// Share activity
function shareActivity(activityId) {
    const card = document.querySelector(`[data-activity-id="${activityId}"]`);
    if (!card) return;
    
    const title = card.querySelector('h3').textContent;
    const description = card.querySelector('p').textContent;
    const url = window.location.href;
    
    if (navigator.share) {
        navigator.share({
            title: title,
            text: description,
            url: url
        }).catch(error => {
            console.log('Error sharing:', error);
            fallbackShare(title, description, url);
        });
    } else {
        fallbackShare(title, description, url);
    }
}

function fallbackShare(title, description, url) {
    const shareText = `${title} - ${description} Check it out: ${url}`;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(shareText).then(() => {
            if (window.GreenScapeUtils) {
                window.GreenScapeUtils.showNotification('Link copied to clipboard!', 'success');
            }
        }).catch(() => {
            showShareModal(shareText);
        });
    } else {
        showShareModal(shareText);
    }
}

function showShareModal(text) {
    const modal = document.createElement('div');
    modal.className = 'share-modal';
    modal.innerHTML = `
        <div class="share-modal-content">
            <h3>Share Activity</h3>
            <textarea readonly>${text}</textarea>
            <div class="share-modal-actions">
                <button onclick="this.closest('.share-modal').remove()" class="btn btn-secondary">Close</button>
                <button onclick="copyToClipboard('${text.replace(/'/g, "\\'")}')" class="btn btn-primary">Copy</button>
            </div>
        </div>
    `;
    
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;
    
    document.body.appendChild(modal);
}

function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    
    if (window.GreenScapeUtils) {
        window.GreenScapeUtils.showNotification('Copied to clipboard!', 'success');
    }
    
    // Close modal
    const modal = document.querySelector('.share-modal');
    if (modal) modal.remove();
}

// Initialize activities page
document.addEventListener('DOMContentLoaded', function() {
    initFavorites();
    
    // Add event listeners for filtering (if filter buttons exist)
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.dataset.filter;
            filterActivities(category);
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Add search functionality (if search input exists)
    const searchInput = document.querySelector('#activity-search');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            searchActivities(this.value);
        });
    }
});

// Export functions for use in other files
window.ActivitiesManager = {
    filterActivities,
    searchActivities,
    toggleFavorite,
    shareActivity,
    formatDate,
    escapeHtml
};
