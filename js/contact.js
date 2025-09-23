// GreenScape Adventures - Contact Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initContactForm();
    initFormValidation();
    initMapInteraction();
});

// Initialize contact form
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;
    
    // Add real-time validation
    const nameField = document.getElementById('name');
    const emailField = document.getElementById('email');
    const messageField = document.getElementById('message');
    
    if (nameField) {
        nameField.addEventListener('blur', validateNameField);
        nameField.addEventListener('input', clearFieldError.bind(null, 'nameError'));
    }
    
    if (emailField) {
        emailField.addEventListener('blur', validateEmailField);
        emailField.addEventListener('input', clearFieldError.bind(null, 'emailError'));
    }
    
    if (messageField) {
        messageField.addEventListener('blur', validateMessageField);
        messageField.addEventListener('input', clearFieldError.bind(null, 'messageError'));
    }
    
    // Form submission
    contactForm.addEventListener('submit', handleFormSubmission);
}

// Initialize form validation
function initFormValidation() {
    // Add custom validation messages
    const inputs = document.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        input.addEventListener('invalid', function(e) {
            e.preventDefault();
            showCustomValidationMessage(this);
        });
        
        input.addEventListener('input', function() {
            clearCustomValidationMessage(this);
        });
    });
}

// Handle form submission
async function handleFormSubmission(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    // Clear previous errors
    clearAllErrors();
    
    // Validate form
    if (!validateContactForm()) {
        return;
    }
    
    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalContent = submitButton.innerHTML;
    
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitButton.disabled = true;
    
    try {
        const response = await fetch('php/contact.php', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
            showSuccessMessage('Thank you! Your message has been sent successfully. We\'ll get back to you within 24 hours.');
            form.reset();
            
            // Track form submission (analytics)
            trackFormSubmission();
        } else {
            showErrorMessage(data.message || 'An error occurred while sending your message. Please try again.');
        }
    } catch (error) {
        console.error('Form submission error:', error);
        showErrorMessage('Network error. Please check your connection and try again.');
    } finally {
        // Reset button
        submitButton.innerHTML = originalContent;
        submitButton.disabled = false;
    }
}

// Validate contact form
function validateContactForm() {
    let isValid = true;
    
    // Validate name
    if (!validateNameField()) {
        isValid = false;
    }
    
    // Validate email
    if (!validateEmailField()) {
        isValid = false;
    }
    
    // Validate message
    if (!validateMessageField()) {
        isValid = false;
    }
    
    return isValid;
}

// Validate name field
function validateNameField() {
    const nameField = document.getElementById('name');
    const nameValue = nameField.value.trim();
    
    if (nameValue.length < 2) {
        showFieldError('nameError', 'Name must be at least 2 characters long.');
        return false;
    }
    
    if (!/^[a-zA-Z\s'-]+$/.test(nameValue)) {
        showFieldError('nameError', 'Name can only contain letters, spaces, hyphens, and apostrophes.');
        return false;
    }
    
    clearFieldError('nameError');
    return true;
}

// Validate email field
function validateEmailField() {
    const emailField = document.getElementById('email');
    const emailValue = emailField.value.trim();
    
    if (!emailValue) {
        showFieldError('emailError', 'Email address is required.');
        return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailValue)) {
        showFieldError('emailError', 'Please enter a valid email address.');
        return false;
    }
    
    clearFieldError('emailError');
    return true;
}

// Validate message field
function validateMessageField() {
    const messageField = document.getElementById('message');
    const messageValue = messageField.value.trim();
    
    if (messageValue.length < 10) {
        showFieldError('messageError', 'Message must be at least 10 characters long.');
        return false;
    }
    
    if (messageValue.length > 1000) {
        showFieldError('messageError', 'Message must be less than 1000 characters.');
        return false;
    }
    
    clearFieldError('messageError');
    return true;
}

// Show field error
function showFieldError(fieldId, message) {
    const errorElement = document.getElementById(fieldId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        
        // Add error class to input
        const input = errorElement.previousElementSibling;
        if (input) {
            input.classList.add('error');
        }
    }
}

// Clear field error
function clearFieldError(fieldId) {
    const errorElement = document.getElementById(fieldId);
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
        
        // Remove error class from input
        const input = errorElement.previousElementSibling;
        if (input) {
            input.classList.remove('error');
        }
    }
}

// Clear all errors
function clearAllErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(error => {
        error.textContent = '';
        error.style.display = 'none';
    });
    
    const errorInputs = document.querySelectorAll('.error');
    errorInputs.forEach(input => {
        input.classList.remove('error');
    });
    
    const formMessage = document.getElementById('formMessage');
    if (formMessage) {
        formMessage.style.display = 'none';
        formMessage.className = 'form-message';
    }
}

// Show custom validation message
function showCustomValidationMessage(input) {
    const errorId = input.id + 'Error';
    let message = '';
    
    switch (input.type) {
        case 'email':
            message = 'Please enter a valid email address.';
            break;
        case 'text':
            if (input.required) {
                message = 'This field is required.';
            }
            break;
        default:
            if (input.required) {
                message = 'This field is required.';
            }
    }
    
    if (message) {
        showFieldError(errorId, message);
    }
}

// Clear custom validation message
function clearCustomValidationMessage(input) {
    const errorId = input.id + 'Error';
    clearFieldError(errorId);
}

// Show success message
function showSuccessMessage(message) {
    const formMessage = document.getElementById('formMessage');
    if (formMessage) {
        formMessage.textContent = message;
        formMessage.className = 'form-message success';
        formMessage.style.display = 'block';
        
        // Scroll to message
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }
}

// Show error message
function showErrorMessage(message) {
    const formMessage = document.getElementById('formMessage');
    if (formMessage) {
        formMessage.textContent = message;
        formMessage.className = 'form-message error';
        formMessage.style.display = 'block';
        
        // Scroll to message
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Initialize map interaction
function initMapInteraction() {
    const mapPlaceholder = document.querySelector('.map-placeholder');
    
    if (!mapPlaceholder) return;
    
    mapPlaceholder.addEventListener('click', function() {
        // Open Google Maps in new tab
        const address = encodeURIComponent('123 Nature Trail, Forest City, FC 12345');
        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${address}`;
        window.open(mapsUrl, '_blank');
    });
    
    // Add hover effect
    mapPlaceholder.style.cursor = 'pointer';
    mapPlaceholder.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.02)';
        this.style.transition = 'transform 0.3s ease';
    });
    
    mapPlaceholder.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
}

// Track form submission for analytics
function trackFormSubmission() {
    // Google Analytics event tracking (if available)
    if (typeof gtag !== 'undefined') {
        gtag('event', 'form_submit', {
            'event_category': 'Contact',
            'event_label': 'Contact Form'
        });
    }
    
    // Facebook Pixel event tracking (if available)
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Contact');
    }
}

// Auto-save form data to localStorage
function autoSaveFormData() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    const formData = {
        name: form.name?.value || '',
        email: form.email?.value || '',
        subject: form.subject?.value || '',
        message: form.message?.value || ''
    };
    
    localStorage.setItem('greenscape_contact_form', JSON.stringify(formData));
}

// Load saved form data
function loadSavedFormData() {
    const savedData = localStorage.getItem('greenscape_contact_form');
    if (!savedData) return;
    
    try {
        const formData = JSON.parse(savedData);
        const form = document.getElementById('contactForm');
        
        if (form) {
            Object.keys(formData).forEach(key => {
                const field = form[key];
                if (field && formData[key]) {
                    field.value = formData[key];
                }
            });
        }
    } catch (error) {
        console.error('Error loading saved form data:', error);
    }
}

// Clear saved form data
function clearSavedFormData() {
    localStorage.removeItem('greenscape_contact_form');
}

// Initialize auto-save functionality
document.addEventListener('DOMContentLoaded', function() {
    // Load saved data on page load
    loadSavedFormData();
    
    // Auto-save form data every 30 seconds
    const form = document.getElementById('contactForm');
    if (form) {
        setInterval(autoSaveFormData, 30000);
        
        // Clear saved data on successful submission
        form.addEventListener('submit', function() {
            setTimeout(clearSavedFormData, 1000);
        });
    }
});

// Add character counter for message field
function initCharacterCounter() {
    const messageField = document.getElementById('message');
    if (!messageField) return;
    
    const counter = document.createElement('div');
    counter.className = 'character-counter';
    counter.style.cssText = `
        text-align: right;
        font-size: 0.9rem;
        color: #666;
        margin-top: 0.5rem;
    `;
    
    messageField.parentNode.appendChild(counter);
    
    function updateCounter() {
        const length = messageField.value.length;
        const maxLength = 1000;
        
        counter.textContent = `${length}/${maxLength} characters`;
        
        if (length > maxLength * 0.9) {
            counter.style.color = '#dc3545';
        } else if (length > maxLength * 0.7) {
            counter.style.color = '#ffc107';
        } else {
            counter.style.color = '#666';
        }
    }
    
    messageField.addEventListener('input', updateCounter);
    updateCounter();
}

// Initialize character counter
document.addEventListener('DOMContentLoaded', function() {
    initCharacterCounter();
});

// Add CSS for error states
const errorStyles = `
    .error {
        border-color: #dc3545 !important;
        box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
    }
    
    .character-counter {
        font-size: 0.9rem;
        color: #666;
        margin-top: 0.5rem;
        text-align: right;
    }
`;

// Inject error styles
const styleSheet = document.createElement('style');
styleSheet.textContent = errorStyles;
document.head.appendChild(styleSheet);

// Export functions for use in other files
window.ContactManager = {
    validateContactForm,
    showSuccessMessage,
    showErrorMessage,
    clearAllErrors,
    trackFormSubmission
};
