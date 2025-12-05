let modalShown = false;
        let popupTimer;
        
        // Show modal after 3 seconds (can be customized)
        function initializePopup() {
            if (!modalShown && !localStorage.getItem('popupShown')) {
                popupTimer = setTimeout(() => {
                    openModal();
                }, 3000);
            }
        }
        
        // Open modal function
        function openModal() {
            const modal = document.getElementById('subscriptionModal');
            modal.classList.add('active');
            modalShown = true;
            
            // Clear any existing timer
            if (popupTimer) {
                clearTimeout(popupTimer);
            }
            
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
            
            // Add escape key listener
            document.addEventListener('keydown', handleEscapeKey);
        }
        
        // Close modal function
        function closeModal() {
            const modal = document.getElementById('subscriptionModal');
            modal.classList.remove('active');
            
            // Restore body scroll
            document.body.style.overflow = '';
            
            // Remove escape key listener
            document.removeEventListener('keydown', handleEscapeKey);
            
            // Mark as shown (won't auto-trigger again this session)
            localStorage.setItem('popupShown', 'true');
        }
        
        // Handle escape key
        function handleEscapeKey(event) {
            if (event.key === 'Escape') {
                closeModal();
            }
        }
        
        // Handle form submission
        document.getElementById('subscriptionForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Button states
            const submitBtn = document.querySelector('.submit-btn');
            const btnText = submitBtn.querySelector('.btn-text');
            const btnIcon = submitBtn.querySelector('.btn-icon');
            const originalText = btnText.textContent;
            
            // Loading state
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            btnText.textContent = 'Processing...';
            btnIcon.innerHTML = '⏳';
            
            // Simulate API call
            setTimeout(() => {
                // Success state
                submitBtn.classList.remove('loading');
                submitBtn.classList.add('success');
                btnText.textContent = 'Welcome Aboard!';
                btnIcon.innerHTML = '✨';
                
                // Create confetti
                createConfetti();
                
                setTimeout(() => {
                    closeModal();
                    // Reset button state
                    setTimeout(() => {
                        submitBtn.classList.remove('success');
                        submitBtn.disabled = false;
                        btnText.textContent = originalText;
                        btnIcon.innerHTML = '⏳';
                        this.reset();
                        // Reset form validation states
                        document.querySelectorAll('.form-group').forEach(group => {
                            group.classList.remove('valid');
                        });
                    }, 1000);
                }, 2000);
                
                console.log('Form submitted:', data);
            }, 2000);
        });

        // Add input validation animations
        document.querySelectorAll('.form-input').forEach(input => {
            input.addEventListener('input', function() {
                const formGroup = this.closest('.form-group');
                
                if (this.validity.valid && this.value.trim() !== '') {
                    formGroup.classList.add('valid');
                } else {
                    formGroup.classList.remove('valid');
                }
            });
            
            // Add focus ripple effect
            input.addEventListener('focus', function() {
                this.style.animationDuration = '0.6s';
                this.style.animationName = 'focus-ripple';
            });
        });

        // Create confetti function
        function createConfetti() {
            const confettiContainer = document.createElement('div');
            confettiContainer.classList.add('confetti');
            document.body.appendChild(confettiContainer);
            
            // Create confetti pieces
            for (let i = 0; i < 50; i++) {
                const confettiPiece = document.createElement('div');
                confettiPiece.classList.add('confetti-piece');
                
                // Random positioning and timing
                confettiPiece.style.left = Math.random() * 100 + '%';
                confettiPiece.style.animationDelay = Math.random() * 2 + 's';
                confettiPiece.style.animationDuration = (Math.random() * 2 + 2) + 's';
                
                // Random rotation
                const rotation = Math.random() * 360;
                confettiPiece.style.setProperty('--rotation', rotation + 'deg');
                
                confettiContainer.appendChild(confettiPiece);
            }
            
            // Remove confetti after animation
            setTimeout(() => {
                confettiContainer.remove();
            }, 4000);
        }

        // Add focus ripple keyframes
        const focusRippleStyle = document.createElement('style');
        focusRippleStyle.textContent = `
            @keyframes focus-ripple {
                0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
                70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
                100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
            }
        `;
        document.head.appendChild(focusRippleStyle);
        
        // Close modal when clicking overlay
        document.getElementById('subscriptionModal').addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });
        
        // Initialize popup behavior
        document.addEventListener('DOMContentLoaded', function() {
            initializePopup();
        });
        
        // Alternative triggers (scroll, exit intent, etc.)
        let scrollTriggered = false;
        
        window.addEventListener('scroll', function() {
            if (!scrollTriggered && !modalShown && window.scrollY > 200) {
                scrollTriggered = true;
                // Uncomment to trigger on scroll instead of time
                // openModal();
            }
        });
        
        // Exit intent detection (desktop only)
        document.addEventListener('mouseleave', function(e) {
            if (!modalShown && e.clientY <= 0) {
                // Uncomment to trigger on exit intent
                // openModal();
            }
        });