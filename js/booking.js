// Booking Form Functionality
document.addEventListener('DOMContentLoaded', function() {
    const bookingForm = document.getElementById('bookingForm');
    const activitySelect = document.getElementById('activity');
    const participantsSelect = document.getElementById('participants');
    const activityPriceUSD = document.getElementById('activityPriceUSD');
    const activityPriceKSH = document.getElementById('activityPriceKSH');
    const participantCount = document.getElementById('participantCount');
    const totalPriceUSD = document.getElementById('totalPriceUSD');
    const totalPriceKSH = document.getElementById('totalPriceKSH');
    const bookingMessage = document.getElementById('bookingMessage');

    // Activity pricing in USD and KSH (1 USD = 150 KSH)
    const exchangeRate = 150;
    const activityPricesUSD = {
        'forest-hiking': 45,
        'bird-watching': 35,
        'eco-camping': 85,
        'nature-photography': 55,
        'wildlife-safari': 65,
        'eco-lodging': 120
    };
    
    const activityPricesKSH = {
        'forest-hiking': 6750,
        'bird-watching': 5250,
        'eco-camping': 12750,
        'nature-photography': 8250,
        'wildlife-safari': 9750,
        'eco-lodging': 18000
    };

    // Update pricing when activity or participants change
    function updatePricing() {
        const selectedActivity = activitySelect.value;
        const selectedParticipants = parseInt(participantsSelect.value) || 0;
        
        if (selectedActivity && selectedParticipants > 0) {
            let basePriceUSD = activityPricesUSD[selectedActivity];
            let basePriceKSH = activityPricesKSH[selectedActivity];
            let finalPriceUSD = basePriceUSD;
            let finalPriceKSH = basePriceKSH;
            
            // Apply group discount for 7+ people
            if (selectedParticipants >= 7) {
                finalPriceUSD = basePriceUSD * 0.85; // 15% discount
                finalPriceKSH = basePriceKSH * 0.85; // 15% discount
            }
            
            const totalUSD = finalPriceUSD * selectedParticipants;
            const totalKSH = finalPriceKSH * selectedParticipants;
            
            activityPriceUSD.textContent = `$${finalPriceUSD.toFixed(0)}`;
            activityPriceKSH.textContent = `KSH ${finalPriceKSH.toLocaleString()}`;
            participantCount.textContent = selectedParticipants;
            totalPriceUSD.textContent = `$${totalUSD.toFixed(0)}`;
            totalPriceKSH.textContent = `KSH ${totalKSH.toLocaleString()}`;
            
            // Show group discount message
            if (selectedParticipants >= 7) {
                showMessage('Group discount applied! 15% off for groups of 7 or more.', 'success');
            } else {
                hideMessage();
            }
        } else {
            activityPriceUSD.textContent = '$0';
            activityPriceKSH.textContent = 'KSH 0';
            participantCount.textContent = '0';
            totalPriceUSD.textContent = '$0';
            totalPriceKSH.textContent = 'KSH 0';
        }
    }

    // Show success/error message
    function showMessage(text, type) {
        bookingMessage.textContent = text;
        bookingMessage.className = `form-message ${type}`;
        bookingMessage.style.display = 'block';
    }

    function hideMessage() {
        bookingMessage.style.display = 'none';
    }

    // Set minimum date to today
    function setMinDate() {
        const dateInput = document.getElementById('date');
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateInput.min = tomorrow.toISOString().split('T')[0];
    }

    // Form validation
    function validateForm() {
        const requiredFields = bookingForm.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.style.borderColor = '#dc3545';
                isValid = false;
            } else {
                field.style.borderColor = '';
            }
        });

        // Email validation
        const email = document.getElementById('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email.value && !emailRegex.test(email.value)) {
            email.style.borderColor = '#dc3545';
            isValid = false;
        }

        // Phone validation (basic)
        const phone = document.getElementById('phone');
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (phone.value && !phoneRegex.test(phone.value.replace(/[\s\-\(\)]/g, ''))) {
            phone.style.borderColor = '#dc3545';
            isValid = false;
        }

        return isValid;
    }

    // Clear validation styling on input
    function clearValidation(field) {
        field.addEventListener('input', function() {
            this.style.borderColor = '';
        });
    }

    // Event listeners
    activitySelect.addEventListener('change', updatePricing);
    participantsSelect.addEventListener('change', updatePricing);

    // Add validation clearing to all form fields
    const formFields = bookingForm.querySelectorAll('input, select, textarea');
    formFields.forEach(clearValidation);

    // Form submission
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            // Simulate form submission
            showMessage('Booking submitted successfully! We will contact you within 24 hours to confirm your reservation.', 'success');
            
            // Reset form after successful submission
            setTimeout(() => {
                bookingForm.reset();
                updatePricing();
                hideMessage();
            }, 3000);
        } else {
            showMessage('Please fill in all required fields correctly.', 'error');
        }
    });

    // Pre-select activity from URL parameter
    function preSelectActivity() {
        const urlParams = new URLSearchParams(window.location.search);
        const activity = urlParams.get('activity');
        
        if (activity && activityPricesUSD[activity]) {
            activitySelect.value = activity;
            updatePricing();
        }
    }

    // Initialize
    setMinDate();
    preSelectActivity();
    updatePricing();

    // Add smooth scrolling for form sections
    const formSections = document.querySelectorAll('.form-section');
    formSections.forEach(section => {
        const heading = section.querySelector('h3');
        if (heading) {
            heading.style.cursor = 'pointer';
            heading.addEventListener('click', function() {
                section.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });
        }
    });

    // Add loading state to submit button
    const submitButton = bookingForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    
    bookingForm.addEventListener('submit', function() {
        if (validateForm()) {
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            submitButton.disabled = true;
            
            setTimeout(() => {
                submitButton.innerHTML = originalButtonText;
                submitButton.disabled = false;
            }, 2000);
        }
    });

    // Auto-format phone number
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 6) {
            value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
        } else if (value.length >= 3) {
            value = value.replace(/(\d{3})(\d{0,3})/, '($1) $2');
        }
        e.target.value = value;
    });

    // Activity-specific information updates
    activitySelect.addEventListener('change', function() {
        const selectedActivity = this.value;
        const durationSelect = document.getElementById('duration');
        
        // Update duration options based on activity
        if (selectedActivity === 'eco-camping' || selectedActivity === 'eco-lodging') {
            durationSelect.innerHTML = `
                <option value="overnight">Overnight</option>
                <option value="multi-day">Multi-day (2-3 days)</option>
                <option value="week">Week-long stay</option>
            `;
        } else {
            durationSelect.innerHTML = `
                <option value="half-day">Half Day (4 hours)</option>
                <option value="full-day">Full Day (8 hours)</option>
                <option value="overnight">Overnight</option>
                <option value="multi-day">Multi-day</option>
            `;
        }
    });

    console.log('Booking form functionality loaded successfully');
});
