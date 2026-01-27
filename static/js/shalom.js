        // Initialize systems
        const gallerySystem = new GallerySystem();
        const appSystem = new AppointmentSystem();
        const adminSystem = new AdminSystem();

        // Make systems globally accessible
        window.gallerySystem = gallerySystem;
        window.adminSystem = adminSystem;
        window.appSystem = appSystem;

        // Website interactions
        document.addEventListener('DOMContentLoaded', function() {
            // Smooth scrolling for navigation links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href');
                    if (targetId === '#') return;
                    
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        window.scrollTo({
                            top: targetElement.offsetTop - 80,
                            behavior: 'smooth'
                        });

                        // Close mobile menu if open
                        const mobileNav = document.getElementById('mobileNav');
                        const mobileToggle = document.getElementById('mobileToggle');
                        if (mobileNav && mobileNav.classList.contains('active')) {
                            mobileNav.classList.remove('active');
                            mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
                        }
                    }
                });
            });
            
            // Set minimum date for booking form
            const dateInput = document.getElementById('date');
            if (dateInput) {
                const today = new Date().toISOString().split('T')[0];
                dateInput.min = today;
                
                // Set default value to tomorrow
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                dateInput.value = tomorrow.toISOString().split('T')[0];
            }
        });