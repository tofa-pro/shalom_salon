        // ====================
        // Gallery System
        // ====================
        class GallerySystem {
            constructor() {
                this.galleryImages = JSON.parse(localStorage.getItem('shalomGallery')) || this.getDefaultGallery();
                this.currentLightboxIndex = 0;
                this.currentFilter = 'all';
                this.init();
            }
            
            getDefaultGallery() {
                return [
                    {
                        id: 1,
                        title: "Elegant Box Braids",
                        category: "Box Braids",
                        description: "Beautiful medium-sized box braids with beads",
                        url: "https://images.unsplash.com/photo-1522338140262-f46f5913618a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                        date: "2024-01-15"
                    },
                    {
                        id: 2,
                        title: "Creative Cornrows",
                        category: "Cornrows",
                        description: "Intricate cornrow pattern with shaved sides",
                        url: "https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                        date: "2024-02-10"
                    },
                    {
                        id: 3,
                        title: "Stylish Crochet Braids",
                        category: "Crochet Braids",
                        description: "Natural-looking crochet braids with curls",
                        url: "https://images.unsplash.com/photo-1556228578-9c360e1d8d34?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                        date: "2024-02-20"
                    },
                    {
                        id: 4,
                        title: "Twists Perfection",
                        category: "Twists & Locs",
                        description: "Two-strand twists with colorful accessories",
                        url: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                        date: "2024-03-05"
                    },
                    {
                        id: 5,
                        title: "Men's Braid Style",
                        category: "Men's Styles",
                        description: "Clean braids for men with fade",
                        url: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                        date: "2024-03-12"
                    },
                    {
                        id: 6,
                        title: "Specialty Design",
                        category: "Specialty Styles",
                        description: "Custom design with geometric patterns",
                        url: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                        date: "2024-03-18"
                    },
                    {
                        id: 7,
                        title: "Before & After",
                        category: "Before & After",
                        description: "Transformational style change",
                        url: "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                        date: "2024-03-25"
                    },
                    {
                        id: 8,
                        title: "Studio Environment",
                        category: "Studio",
                        description: "Our comfortable and modern studio",
                        url: "https://images.unsplash.com/photo-1596703923338-48f1c07e4f2e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                        date: "2024-04-01"
                    }
                ];
            }
            
            init() {
                this.setupEventListeners();
                this.renderGallery();
            }
            
            setupEventListeners() {
                // Gallery filter buttons
                document.querySelectorAll('.filter-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                        btn.classList.add('active');
                        this.currentFilter = btn.getAttribute('data-filter');
                        this.renderGallery();
                    });
                });
                
                // Lightbox close
                const lightboxClose = document.getElementById('lightboxClose');
                if (lightboxClose) {
                    lightboxClose.addEventListener('click', () => {
                        this.closeLightbox();
                    });
                }
                
                // Lightbox navigation
                const lightboxPrev = document.getElementById('lightboxPrev');
                const lightboxNext = document.getElementById('lightboxNext');
                if (lightboxPrev && lightboxNext) {
                    lightboxPrev.addEventListener('click', () => {
                        this.navigateLightbox(-1);
                    });
                    lightboxNext.addEventListener('click', () => {
                        this.navigateLightbox(1);
                    });
                }
                
                // Close lightbox on ESC key
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape') {
                        this.closeLightbox();
                    }
                    if (e.key === 'ArrowLeft') {
                        this.navigateLightbox(-1);
                    }
                    if (e.key === 'ArrowRight') {
                        this.navigateLightbox(1);
                    }
                });
                
                // Close lightbox when clicking outside
                const lightbox = document.getElementById('lightbox');
                if (lightbox) {
                    lightbox.addEventListener('click', (e) => {
                        if (e.target === lightbox) {
                            this.closeLightbox();
                        }
                    });
                }
            }
            
            renderGallery() {
                const galleryGrid = document.getElementById('galleryGrid');
                if (!galleryGrid) return;
                
                let filteredImages = this.galleryImages;
                if (this.currentFilter !== 'all') {
                    filteredImages = this.galleryImages.filter(img => img.category === this.currentFilter);
                }
                
                galleryGrid.innerHTML = '';
                
                filteredImages.forEach((image, index) => {
                    const item = document.createElement('div');
                    item.className = 'gallery-item';
                    item.innerHTML = `
                        <img src="${image.url}" alt="${image.title}" loading="lazy">
                        <div class="gallery-overlay">
                            <span class="gallery-category">${image.category}</span>
                            <h4>${image.title}</h4>
                        </div>
                    `;
                    
                    item.addEventListener('click', () => {
                        this.openLightbox(index);
                    });
                    
                    galleryGrid.appendChild(item);
                });
                
                // If no images found
                if (filteredImages.length === 0) {
                    galleryGrid.innerHTML = `
                        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem;">
                            <i class="fas fa-images fa-3x" style="color: var(--text-light); margin-bottom: 1rem;"></i>
                            <h3>No Images Found</h3>
                            <p>No gallery images available for this category.</p>
                        </div>
                    `;
                }
            }
            
            openLightbox(index) {
                const lightbox = document.getElementById('lightbox');
                const lightboxImg = document.getElementById('lightboxImg');
                const lightboxTitle = document.getElementById('lightboxTitle');
                const lightboxCategory = document.getElementById('lightboxCategory');
                
                if (!lightbox || !lightboxImg || !lightboxTitle) return;
                
                this.currentLightboxIndex = index;
                const image = this.galleryImages[index];
                
                lightboxImg.src = image.url;
                lightboxImg.alt = image.title;
                lightboxTitle.textContent = image.title;
                lightboxCategory.textContent = image.category;
                
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
            
            closeLightbox() {
                const lightbox = document.getElementById('lightbox');
                if (lightbox) {
                    lightbox.classList.remove('active');
                    document.body.style.overflow = 'auto';
                }
            }
            
            navigateLightbox(direction) {
                let newIndex = this.currentLightboxIndex + direction;
                
                // Loop around
                if (newIndex < 0) {
                    newIndex = this.galleryImages.length - 1;
                } else if (newIndex >= this.galleryImages.length) {
                    newIndex = 0;
                }
                
                this.openLightbox(newIndex);
            }
            
            addImage(imageData) {
                const newImage = {
                    id: Date.now(),
                    title: imageData.title,
                    category: imageData.category,
                    description: imageData.description || '',
                    url: imageData.url,
                    date: new Date().toISOString().split('T')[0]
                };
                
                this.galleryImages.unshift(newImage); // Add to beginning
                localStorage.setItem('shalomGallery', JSON.stringify(this.galleryImages));
                this.renderGallery();
                return newImage;
            }
            
            deleteImage(imageId) {
                this.galleryImages = this.galleryImages.filter(img => img.id !== imageId);
                localStorage.setItem('shalomGallery', JSON.stringify(this.galleryImages));
                this.renderGallery();
            }
            
            getGalleryData() {
                return this.galleryImages;
            }
            
            renderAdminGallery() {
                const adminGalleryGrid = document.getElementById('adminGalleryGrid');
                if (!adminGalleryGrid) return;
                
                adminGalleryGrid.innerHTML = '';
                
                this.galleryImages.forEach(image => {
                    const item = document.createElement('div');
                    item.className = 'gallery-admin-item';
                    item.innerHTML = `
                        <img src="${image.url}" alt="${image.title}">
                        <div class="gallery-admin-info">
                            <span class="gallery-admin-category">${image.category}</span>
                            <h4>${image.title}</h4>
                            <p style="font-size: 0.9rem; color: var(--text-light); margin-bottom: 1rem;">${image.description || 'No description'}</p>
                            <p style="font-size: 0.8rem; color: var(--text-light); margin-bottom: 1rem;">Added: ${image.date}</p>
                            <div class="table-actions">
                                <button class="btn btn-small btn-danger" onclick="gallerySystem.deleteAdminImage(${image.id})">
                                    <i class="fas fa-trash"></i> Delete
                                </button>
                            </div>
                        </div>
                    `;
                    
                    adminGalleryGrid.appendChild(item);
                });
                
                // If no images
                if (this.galleryImages.length === 0) {
                    adminGalleryGrid.innerHTML = `
                        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; background: var(--white); border-radius: var(--border-radius);">
                            <i class="fas fa-images fa-2x" style="color: var(--text-light); margin-bottom: 1rem;"></i>
                            <h3>No Gallery Images</h3>
                            <p>Upload your first image using the form above.</p>
                        </div>
                    `;
                }
            }
            
            deleteAdminImage(imageId) {
                if (confirm('Are you sure you want to delete this image?')) {
                    this.deleteImage(imageId);
                    this.renderAdminGallery();
                    this.showNotification('Image deleted successfully!', 'success');
                }
            }
            
            showNotification(message, type = 'info') {
                // Remove existing notifications
                document.querySelectorAll('.notification').forEach(n => n.remove());
                
                // Create notification element
                const notification = document.createElement('div');
                notification.className = `notification notification-${type}`;
                notification.innerHTML = `
                    <div class="notification-content">
                        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'times-circle' : 'info-circle'}"></i>
                        <span>${message}</span>
                    </div>
                    <button class="notification-close" onclick="this.parentElement.remove()">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                
                document.body.appendChild(notification);
                
                // Auto remove after 5 seconds
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 5000);
            }
        }

        // ====================
        // Appointment System
        // ====================
        class AppointmentSystem {
            constructor() {
                this.appointments = JSON.parse(localStorage.getItem('shalomAppointments')) || [];
                this.customers = JSON.parse(localStorage.getItem('shalomCustomers')) || [];
                this.nextAppointmentId = parseInt(localStorage.getItem('shalomNextAppointmentId')) || 1;
                this.currentCustomer = null;
                this.init();
            }
            
            init() {
                this.setupEventListeners();
                this.setMinDate();
                this.showAdminButton();
            }
            
            setupEventListeners() {
                // Booking form submission
                const bookingForm = document.getElementById('bookingForm');
                if (bookingForm) {
                    bookingForm.addEventListener('submit', (e) => {
                        e.preventDefault();
                        this.handleBookingForm(e);
                    });
                }
                
                // Customer access button
                const customerAccessBtn = document.getElementById('customerAccessBtn');
                if (customerAccessBtn) {
                    customerAccessBtn.addEventListener('click', () => {
                        this.openCustomerDashboard();
                    });
                }
                
                // Check status button
                const checkStatusBtn = document.getElementById('checkStatusBtn');
                if (checkStatusBtn) {
                    checkStatusBtn.addEventListener('click', () => {
                        this.checkAppointmentStatus();
                    });
                }
                
                // View all appointments button
                const viewAllAppointmentsBtn = document.getElementById('viewAllAppointmentsBtn');
                if (viewAllAppointmentsBtn) {
                    viewAllAppointmentsBtn.addEventListener('click', () => {
                        this.openCustomerDashboard();
                    });
                }
                
                // Reschedule button
                const rescheduleBtn = document.getElementById('rescheduleBtn');
                if (rescheduleBtn) {
                    rescheduleBtn.addEventListener('click', () => {
                        this.rescheduleAppointment();
                    });
                }
                
                // Cancel button
                const cancelBtn = document.getElementById('cancelBtn');
                if (cancelBtn) {
                    cancelBtn.addEventListener('click', () => {
                        this.cancelAppointment();
                    });
                }
                
                // Book appointment button
                const bookAppointmentBtn = document.getElementById('bookAppointmentBtn');
                if (bookAppointmentBtn) {
                    bookAppointmentBtn.addEventListener('click', () => {
                        document.getElementById('contact').scrollIntoView({behavior: 'smooth'});
                    });
                }
                
                // Show customer access button if customer exists
                const savedCustomer = localStorage.getItem('currentCustomer');
                if (savedCustomer) {
                    this.currentCustomer = JSON.parse(savedCustomer);
                    document.getElementById('customerAccessBtn').style.display = 'flex';
                }

                // Mobile navigation toggle
                const mobileToggle = document.getElementById('mobileToggle');
                const mobileNav = document.getElementById('mobileNav');
                if (mobileToggle && mobileNav) {
                    mobileToggle.addEventListener('click', () => {
                        mobileNav.classList.toggle('active');
                        mobileToggle.innerHTML = mobileNav.classList.contains('active') 
                            ? '<i class="fas fa-times"></i>' 
                            : '<i class="fas fa-bars"></i>';
                    });
                }
                
                // Close mobile menu when clicking outside
                document.addEventListener('click', (e) => {
                    if (mobileNav && mobileNav.classList.contains('active') && 
                        !mobileNav.contains(e.target) && 
                        !mobileToggle.contains(e.target)) {
                        mobileNav.classList.remove('active');
                        mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
                    }
                });
            }
            
            showAdminButton() {
                document.getElementById('adminAccessBtn').style.display = 'flex';
            }
            
            handleBookingForm(event) {
                const form = event.target;
                
                // Generate unique appointment ID
                const appointmentId = `APP-${this.nextAppointmentId.toString().padStart(3, '0')}`;
                this.nextAppointmentId++;
                localStorage.setItem('shalomNextAppointmentId', this.nextAppointmentId);
                
                const formData = {
                    id: appointmentId,
                    name: document.getElementById('name').value,
                    phone: document.getElementById('phone').value,
                    email: document.getElementById('email').value || '',
                    service: document.getElementById('service').value,
                    date: document.getElementById('date').value,
                    time: document.getElementById('time').value,
                    message: document.getElementById('message').value || '',
                    status: 'pending',
                    createdAt: new Date().toISOString()
                };
                
                // Validate required fields
                if (!formData.name || !formData.phone || !formData.service || !formData.date || !formData.time) {
                    this.showNotification('Please fill all required fields!', 'error');
                    return;
                }
                
                // Save customer information if requested
                const saveProfile = document.getElementById('saveProfile').checked;
                if (saveProfile) {
                    this.saveCustomerProfile(formData);
                }
                
                // Add to appointments
                this.appointments.push(formData);
                localStorage.setItem('shalomAppointments', JSON.stringify(this.appointments));
                
                // Show success message with appointment ID
                this.showNotification(
                    `Thank you for your booking, ${formData.name}! Your appointment has been received. Your appointment ID is ${appointmentId}.`,
                    'success'
                );
                
                // Auto-login customer if they saved profile
                if (saveProfile) {
                    this.currentCustomer = {
                        name: formData.name,
                        phone: formData.phone,
                        email: formData.email
                    };
                    localStorage.setItem('currentCustomer', JSON.stringify(this.currentCustomer));
                    document.getElementById('customerAccessBtn').style.display = 'flex';
                }
                
                // Reset form
                form.reset();
                this.setMinDate();
                
                // Update admin dashboard if it's open
                if (window.adminSystem && window.adminSystem.currentAdmin) {
                    window.adminSystem.updateAdminDashboard();
                }
            }
            
            saveCustomerProfile(formData) {
                const existingCustomer = this.customers.find(c => c.phone === formData.phone);
                
                if (!existingCustomer) {
                    const customer = {
                        id: Date.now(),
                        name: formData.name,
                        phone: formData.phone,
                        email: formData.email || '',
                        createdAt: new Date().toISOString()
                    };
                    this.customers.push(customer);
                    localStorage.setItem('shalomCustomers', JSON.stringify(this.customers));
                }
            }
            
            checkAppointmentStatus() {
                const phone = document.getElementById('statusPhone').value.trim();
                
                if (!phone) {
                    this.showNotification('Please enter your phone number', 'error');
                    return;
                }
                
                // Find appointments for this phone number
                const customerAppointments = this.appointments
                    .filter(a => a.phone === phone)
                    .sort((a, b) => new Date(b.date) - new Date(a.date));
                
                const statusCard = document.getElementById('appointmentStatusCard');
                const noAppointmentMessage = document.getElementById('noAppointmentMessage');
                
                if (customerAppointments.length > 0) {
                    const latestAppointment = customerAppointments[0];
                    
                    // Update status card with appointment details
                    document.getElementById('statusAppointmentId').textContent = latestAppointment.id;
                    document.getElementById('statusServiceName').textContent = latestAppointment.service;
                    document.getElementById('statusAppointmentDate').textContent = 
                        `${this.formatDate(latestAppointment.date)} at ${latestAppointment.time}`;
                    document.getElementById('statusClientName').textContent = latestAppointment.name;
                    document.getElementById('statusClientPhone').textContent = latestAppointment.phone;
                    document.getElementById('statusClientEmail').textContent = latestAppointment.email || 'Not provided';
                    document.getElementById('statusDuration').textContent = this.getServiceDuration(latestAppointment.service);
                    
                    // Update status badge
                    const statusBadge = document.getElementById('statusBadge');
                    statusBadge.textContent = latestAppointment.status;
                    statusBadge.className = 'status-badge ' + latestAppointment.status;
                    
                    // Update card class
                    statusCard.className = 'appointment-status-card ' + latestAppointment.status;
                    
                    // Show/hide action buttons based on status
                    const rescheduleBtn = document.getElementById('rescheduleBtn');
                    const cancelBtn = document.getElementById('cancelBtn');
                    
                    if (latestAppointment.status === 'cancelled') {
                        rescheduleBtn.style.display = 'none';
                        cancelBtn.style.display = 'none';
                    } else {
                        rescheduleBtn.style.display = 'flex';
                        cancelBtn.style.display = 'flex';
                    }
                    
                    // Show status card, hide no appointment message
                    statusCard.style.display = 'block';
                    noAppointmentMessage.style.display = 'none';
                    
                    // Auto-login if not already logged in
                    if (!this.currentCustomer) {
                        this.currentCustomer = {
                            name: latestAppointment.name,
                            phone: latestAppointment.phone,
                            email: latestAppointment.email
                        };
                        document.getElementById('customerAccessBtn').style.display = 'flex';
                    }
                } else {
                    // Show no appointment message, hide status card
                    noAppointmentMessage.style.display = 'block';
                    statusCard.style.display = 'none';
                }
            }
            
            openCustomerDashboard() {
                const phone = document.getElementById('statusPhone').value || 
                             (this.currentCustomer ? this.currentCustomer.phone : null);
                
                if (!phone) {
                    this.showNotification('Please check your appointment status first or enter your phone number.', 'info');
                    return;
                }
                
                // Find all appointments for this customer
                const customerAppointments = this.appointments
                    .filter(a => a.phone === phone)
                    .sort((a, b) => new Date(b.date) - new Date(a.date));
                
                if (customerAppointments.length === 0) {
                    this.showNotification('No appointments found for your account.', 'info');
                    return;
                }
                
                // Create customer dashboard modal
                this.showCustomerDashboardModal(customerAppointments);
            }
            
            showCustomerDashboardModal(appointments) {
                let appointmentsHtml = '';
                appointments.forEach(app => {
                    appointmentsHtml += `
                        <div class="customer-appointment-card" style="background: var(--white); border-radius: var(--border-radius); padding: 1.5rem; margin-bottom: 1rem; border-left: 4px solid ${this.getStatusColor(app.status)}; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
                                <div>
                                    <h4 style="color: var(--primary); margin-bottom: 0.5rem;">${app.service}</h4>
                                    <p style="color: var(--text); margin-bottom: 0.25rem;">
                                        <i class="fas fa-calendar"></i> ${this.formatDate(app.date)} at ${app.time}
                                    </p>
                                    <p style="color: var(--text-light); font-size: 0.9rem;">
                                        Appointment ID: ${app.id}
                                    </p>
                                </div>
                                <span class="status-badge ${app.status}" style="font-size: 0.8rem; padding: 0.25rem 1rem;">${app.status}</span>
                            </div>
                            
                            ${app.message ? `<p style="color: var(--text-light); font-size: 0.9rem; margin-bottom: 1rem;"><strong>Notes:</strong> ${app.message}</p>` : ''}
                            
                            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                                ${app.status !== 'cancelled' ? `
                                    <button class="btn btn-small btn-outline" onclick="appSystem.rescheduleSpecificAppointment('${app.id}')">
                                        <i class="fas fa-calendar-alt"></i> Reschedule
                                    </button>
                                    <button class="btn btn-small btn-danger" onclick="appSystem.cancelSpecificAppointment('${app.id}')">
                                        <i class="fas fa-times"></i> Cancel
                                    </button>
                                ` : ''}
                            </div>
                        </div>
                    `;
                });
                
                const modalHtml = `
                    <div class="modal">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h3 style="color: var(--primary);">My Appointments</h3>
                                <button class="modal-close" onclick="this.closest('.modal').remove()">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                            
                            <div style="margin-bottom: 2rem;">
                                <p style="color: var(--text-light);">You have ${appointments.length} appointment${appointments.length !== 1 ? 's' : ''}</p>
                            </div>
                            
                            <div id="customerAppointmentsList">
                                ${appointmentsHtml}
                            </div>
                            
                            <div style="margin-top: 2rem; text-align: center;">
                                <button class="btn" onclick="document.getElementById('contact').scrollIntoView({behavior: 'smooth'}); this.closest('.modal').remove();">
                                    <i class="fas fa-calendar-plus"></i> Book New Appointment
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                
                document.body.insertAdjacentHTML('beforeend', modalHtml);
            }
            
            rescheduleSpecificAppointment(appointmentId) {
                this.showNotification('Reschedule feature coming soon! Please call us at (404) 555-1234 to reschedule.', 'info');
            }
            
            cancelSpecificAppointment(appointmentId) {
                if (confirm('Are you sure you want to cancel this appointment?')) {
                    const appointment = this.appointments.find(a => a.id === appointmentId);
                    if (appointment) {
                        appointment.status = 'cancelled';
                        appointment.updatedAt = new Date().toISOString();
                        localStorage.setItem('shalomAppointments', JSON.stringify(this.appointments));
                        
                        // Update admin dashboard if open
                        if (window.adminSystem && window.adminSystem.currentAdmin) {
                            window.adminSystem.updateAdminDashboard();
                        }
                        
                        this.showNotification('Appointment cancelled successfully.', 'success');
                        
                        // Update the customer dashboard
                        const phone = appointment.phone;
                        const customerAppointments = this.appointments
                            .filter(a => a.phone === phone)
                            .sort((a, b) => new Date(b.date) - new Date(a.date));
                        
                        // Refresh the modal
                        const modal = document.querySelector('.modal');
                        if (modal) {
                            modal.remove();
                            this.showCustomerDashboardModal(customerAppointments);
                        }
                        
                        // Refresh status check if open
                        if (document.getElementById('statusPhone').value === phone) {
                            this.checkAppointmentStatus();
                        }
                    }
                }
            }
            
            getStatusColor(status) {
                const colors = {
                    'pending': '#FF9800',
                    'confirmed': '#4CAF50',
                    'cancelled': '#F44336'
                };
                return colors[status] || '#FF9800';
            }
            
            rescheduleAppointment() {
                this.showNotification('Reschedule feature coming soon! Please call us at (404) 555-1234 to reschedule.', 'info');
            }
            
            cancelAppointment() {
                const phone = document.getElementById('statusPhone').value;
                if (phone && confirm('Are you sure you want to cancel this appointment?')) {
                    const appointment = this.appointments.find(a => a.phone === phone);
                    if (appointment) {
                        appointment.status = 'cancelled';
                        appointment.updatedAt = new Date().toISOString();
                        localStorage.setItem('shalomAppointments', JSON.stringify(this.appointments));
                        
                        // Update admin dashboard if open
                        if (window.adminSystem && window.adminSystem.currentAdmin) {
                            window.adminSystem.updateAdminDashboard();
                        }
                        
                        this.showNotification('Appointment cancelled successfully.', 'success');
                        this.checkAppointmentStatus(); // Refresh status display
                    }
                }
            }
            
            getServiceDuration(service) {
                const durations = {
                    'Box Braids': '3-4 hours',
                    'Cornrows': '2-3 hours',
                    'Crochet Braids': '2-3 hours',
                    'Twists & Locs': '3-4 hours',
                    'Men\'s Styles': '1-2 hours',
                    'Specialty Styles': '2-4 hours',
                    'Consultation': '30 minutes'
                };
                return durations[service] || '2-3 hours';
            }
            
            formatDate(dateString) {
                const date = new Date(dateString);
                return date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            }
            
            setMinDate() {
                const dateInput = document.getElementById('date');
                if (dateInput) {
                    const today = new Date().toISOString().split('T')[0];
                    dateInput.min = today;
                    
                    // Set default value to tomorrow
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    dateInput.value = tomorrow.toISOString().split('T')[0];
                }
            }
            
            showNotification(message, type = 'info') {
                // Remove existing notifications
                document.querySelectorAll('.notification').forEach(n => n.remove());
                
                // Create notification element
                const notification = document.createElement('div');
                notification.className = `notification notification-${type}`;
                notification.innerHTML = `
                    <div class="notification-content">
                        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'times-circle' : 'info-circle'}"></i>
                        <span>${message}</span>
                    </div>
                    <button class="notification-close" onclick="this.parentElement.remove()">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                
                document.body.appendChild(notification);
                
                // Auto remove after 5 seconds
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 5000);
            }
        }

        // ====================
        // Admin System
        // ====================
        class AdminSystem {
            constructor() {
                this.appointments = JSON.parse(localStorage.getItem('shalomAppointments')) || [];
                this.customers = JSON.parse(localStorage.getItem('shalomCustomers')) || [];
                this.adminPassword = localStorage.getItem('adminPassword') || 'admin123';
                this.currentAdmin = null;
                this.init();
            }
            
            init() {
                this.setupEventListeners();
                this.setupClickHandlers();
                this.setupGalleryUpload();
            }
            
            setupEventListeners() {
                // Admin access button
                const adminAccessBtn = document.getElementById('adminAccessBtn');
                if (adminAccessBtn) {
                    adminAccessBtn.addEventListener('click', () => {
                        this.promptAdminLogin();
                    });
                }
                
                // Admin logout
                const logoutAdminBtn = document.getElementById('logoutAdminBtn');
                if (logoutAdminBtn) {
                    logoutAdminBtn.addEventListener('click', () => {
                        this.logoutAdmin();
                    });
                }
                
                // Admin panel navigation
                document.querySelectorAll('.admin-menu a').forEach(link => {
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        const panel = link.getAttribute('data-panel');
                        this.switchAdminPanel(panel, link);
                    });
                });
                
                // Business info form
                const businessInfoForm = document.getElementById('businessInfoForm');
                if (businessInfoForm) {
                    businessInfoForm.addEventListener('submit', (e) => {
                        e.preventDefault();
                        this.saveBusinessInfo();
                    });
                }
                
                // Appointment search and filters
                const appointmentSearch = document.getElementById('appointmentSearch');
                if (appointmentSearch) {
                    appointmentSearch.addEventListener('input', () => {
                        this.filterAppointments();
                    });
                }
                
                const statusFilter = document.getElementById('statusFilter');
                if (statusFilter) {
                    statusFilter.addEventListener('change', () => {
                        this.filterAppointments();
                    });
                }
                
                const dateFilter = document.getElementById('dateFilter');
                if (dateFilter) {
                    dateFilter.addEventListener('change', () => {
                        this.filterAppointments();
                    });
                }
                
                // Customer search
                const customerSearch = document.getElementById('customerSearch');
                if (customerSearch) {
                    customerSearch.addEventListener('input', () => {
                        this.filterCustomers();
                    });
                }
                
                // Add service button
                const addServiceBtn = document.getElementById('addServiceBtn');
                if (addServiceBtn) {
                    addServiceBtn.addEventListener('click', () => {
                        this.openServiceModal();
                    });
                }
                
                // Change password button
                const changePasswordBtn = document.getElementById('changePasswordBtn');
                if (changePasswordBtn) {
                    changePasswordBtn.addEventListener('click', () => {
                        this.changePassword();
                    });
                }
                
                // Export data button
                const exportDataBtn = document.getElementById('exportDataBtn');
                if (exportDataBtn) {
                    exportDataBtn.addEventListener('click', () => {
                        this.exportData();
                    });
                }
                
                // Import data button
                const importDataBtn = document.getElementById('importDataBtn');
                if (importDataBtn) {
                    importDataBtn.addEventListener('click', () => {
                        this.importData();
                    });
                }
                
                // Clear data button
                const clearDataBtn = document.getElementById('clearDataBtn');
                if (clearDataBtn) {
                    clearDataBtn.addEventListener('click', () => {
                        this.clearData();
                    });
                }
            }
            
            setupClickHandlers() {
                // Use event delegation for dynamic appointment actions
                document.addEventListener('click', (e) => {
                    // Check if clicked element is an appointment action button
                    if (e.target.closest('[data-action]')) {
                        const button = e.target.closest('[data-action]');
                        const action = button.getAttribute('data-action');
                        const appointmentId = button.getAttribute('data-id');
                        
                        if (action === 'view') {
                            this.viewAppointment(appointmentId);
                        } else if (action === 'confirm') {
                            this.confirmAppointment(appointmentId);
                        } else if (action === 'cancel') {
                            this.cancelAppointment(appointmentId);
                        }
                    }
                    
                    // Check if clicked element is a service action button
                    if (e.target.closest('[data-service-action]')) {
                        const button = e.target.closest('[data-service-action]');
                        const action = button.getAttribute('data-service-action');
                        const serviceName = button.getAttribute('data-service-name');
                        
                        if (action === 'edit') {
                            this.editService(serviceName);
                        } else if (action === 'delete') {
                            this.deleteService(serviceName);
                        }
                    }
                });
            }
            
            setupGalleryUpload() {
                const uploadArea = document.getElementById('uploadArea');
                const imageInput = document.getElementById('imageInput');
                const galleryUploadForm = document.getElementById('galleryUploadForm');
                
                if (uploadArea && imageInput) {
                    // Click to upload
                    uploadArea.addEventListener('click', () => {
                        imageInput.click();
                    });
                    
                    // Drag and drop
                    uploadArea.addEventListener('dragover', (e) => {
                        e.preventDefault();
                        uploadArea.style.borderColor = 'var(--secondary)';
                        uploadArea.style.background = 'rgba(255,107,139,0.05)';
                    });
                    
                    uploadArea.addEventListener('dragleave', () => {
                        uploadArea.style.borderColor = 'var(--accent)';
                        uploadArea.style.background = 'transparent';
                    });
                    
                    uploadArea.addEventListener('drop', (e) => {
                        e.preventDefault();
                        uploadArea.style.borderColor = 'var(--accent)';
                        uploadArea.style.background = 'transparent';
                        
                        if (e.dataTransfer.files.length > 0) {
                            this.handleImageUpload(e.dataTransfer.files[0]);
                        }
                    });
                    
                    // File input change
                    imageInput.addEventListener('change', (e) => {
                        if (e.target.files.length > 0) {
                            this.handleImageUpload(e.target.files[0]);
                        }
                    });
                }
                
                if (galleryUploadForm) {
                    galleryUploadForm.addEventListener('submit', (e) => {
                        e.preventDefault();
                        this.handleGalleryFormSubmit();
                    });
                }
            }
            
            handleImageUpload(file) {
                const preview = document.getElementById('imagePreview');
                const titleInput = document.getElementById('imageTitle');
                
                if (!file.type.match('image.*')) {
                    this.showNotification('Please select an image file (JPG, PNG, GIF)', 'error');
                    return;
                }
                
                if (file.size > 5 * 1024 * 1024) {
                    this.showNotification('Image size should be less than 5MB', 'error');
                    return;
                }
                
                const reader = new FileReader();
                reader.onload = (e) => {
                    preview.src = e.target.result;
                    preview.style.display = 'block';
                    
                    // Set default title from filename
                    const fileName = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
                    titleInput.value = fileName.charAt(0).toUpperCase() + fileName.slice(1);
                };
                reader.readAsDataURL(file);
            }
            
            handleGalleryFormSubmit() {
                const preview = document.getElementById('imagePreview');
                const title = document.getElementById('imageTitle').value;
                const category = document.getElementById('imageCategory').value;
                const description = document.getElementById('imageDescription').value;
                
                if (!preview.src || preview.style.display === 'none') {
                    this.showNotification('Please select an image first', 'error');
                    return;
                }
                
                if (!title || !category) {
                    this.showNotification('Please fill all required fields', 'error');
                    return;
                }
                
                const imageData = {
                    title: title,
                    category: category,
                    description: description,
                    url: preview.src
                };
                
                // Add to gallery
                gallerySystem.addImage(imageData);
                
                // Show success message
                this.showNotification('Image uploaded successfully!', 'success');
                
                // Reset form
                document.getElementById('galleryUploadForm').reset();
                preview.style.display = 'none';
                preview.src = '';
                
                // Update admin gallery view
                gallerySystem.renderAdminGallery();
            }
            
            promptAdminLogin() {
                const password = prompt('Enter admin password:');
                if (password === this.adminPassword) {
                    this.currentAdmin = { name: 'Admin' };
                    this.openAdminDashboard();
                } else if (password) {
                    alert('Incorrect password!');
                }
            }
            
            openAdminDashboard() {
                // Update dashboard data
                this.updateAdminDashboard();
                
                // Show admin dashboard
                document.getElementById('adminDashboard').classList.add('active');
                document.getElementById('mainWebsite').style.display = 'none';
                document.getElementById('adminAccessBtn').style.display = 'none';
            }
            
            logoutAdmin() {
                this.currentAdmin = null;
                document.getElementById('adminDashboard').classList.remove('active');
                document.getElementById('mainWebsite').style.display = 'block';
                document.getElementById('adminAccessBtn').style.display = 'flex';
            }
            
            updateAdminDashboard() {
                // Always reload fresh data from localStorage
                this.appointments = JSON.parse(localStorage.getItem('shalomAppointments')) || [];
                this.customers = JSON.parse(localStorage.getItem('shalomCustomers')) || [];
                
                // Calculate statistics
                const today = new Date().toISOString().split('T')[0];
                const todayAppointments = this.appointments.filter(a => a.date === today);
                
                // Update statistics
                document.getElementById('adminTotalAppointments').textContent = this.appointments.length;
                document.getElementById('adminTodayAppointments').textContent = todayAppointments.length;
                document.getElementById('adminPendingAppointments').textContent = 
                    this.appointments.filter(a => a.status === 'pending').length;
                document.getElementById('adminConfirmedAppointments').textContent = 
                    this.appointments.filter(a => a.status === 'confirmed').length;
                document.getElementById('adminCancelledAppointments').textContent = 
                    this.appointments.filter(a => a.status === 'cancelled').length;
                
                // Update today's schedule
                this.updateTodaySchedule(todayAppointments);
                
                // Update recent bookings (last 10 appointments)
                this.updateRecentBookings();
                
                // Update appointments table
                this.updateAppointmentsTable();
                
                // Update customers table
                this.updateCustomersTable();
                
                // Update services table
                this.updateServicesTable();
                
                // Update gallery
                gallerySystem.renderAdminGallery();
            }
            
            updateTodaySchedule(appointments) {
                const tbody = document.getElementById('adminTodayBody');
                tbody.innerHTML = '';
                
                if (appointments.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 2rem;">No appointments for today</td></tr>';
                    return;
                }
                
                // Sort by time
                appointments.sort((a, b) => {
                    const timeA = this.parseTime(a.time);
                    const timeB = this.parseTime(b.time);
                    return timeA - timeB;
                });
                
                appointments.forEach(appointment => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${appointment.time}</td>
                        <td>${appointment.name}</td>
                        <td>${appointment.service}</td>
                        <td><span class="status-badge ${appointment.status}">${appointment.status}</span></td>
                    `;
                    tbody.appendChild(row);
                });
            }
            
            updateRecentBookings() {
                const tbody = document.getElementById('adminRecentBody');
                tbody.innerHTML = '';
                
                // Get last 10 appointments
                const recentAppointments = [...this.appointments]
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .slice(0, 10);
                
                if (recentAppointments.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 2rem;">No recent bookings</td></tr>';
                    return;
                }
                
                recentAppointments.forEach(appointment => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${this.formatDate(appointment.date)}</td>
                        <td>${appointment.name}</td>
                        <td>${appointment.service}</td>
                        <td><span class="status-badge ${appointment.status}">${appointment.status}</span></td>
                    `;
                    tbody.appendChild(row);
                });
            }
            
            updateAppointmentsTable() {
                const tbody = document.getElementById('adminAppointmentsBody');
                tbody.innerHTML = '';
                
                if (this.appointments.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 2rem;">No appointments found</td></tr>';
                    return;
                }
                
                // Sort by date (newest first)
                const sortedAppointments = [...this.appointments].sort((a, b) => {
                    return new Date(b.date) - new Date(a.date);
                });
                
                sortedAppointments.forEach(appointment => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td><strong>${appointment.id}</strong></td>
                        <td>${this.formatDate(appointment.date)}</td>
                        <td>${appointment.time}</td>
                        <td>${appointment.name}</td>
                        <td>${appointment.phone}</td>
                        <td>${appointment.service}</td>
                        <td><span class="status-badge ${appointment.status}">${appointment.status}</span></td>
                        <td>
                            <div class="table-actions">
                                <button class="btn btn-small" data-action="view" data-id="${appointment.id}">
                                    <i class="fas fa-eye"></i>
                                </button>
                                ${appointment.status !== 'confirmed' ? `
                                    <button class="btn btn-small btn-success" data-action="confirm" data-id="${appointment.id}">
                                        <i class="fas fa-check"></i>
                                    </button>
                                ` : ''}
                                ${appointment.status !== 'cancelled' ? `
                                    <button class="btn btn-small btn-danger" data-action="cancel" data-id="${appointment.id}">
                                        <i class="fas fa-times"></i>
                                    </button>
                                ` : ''}
                            </div>
                        </td>
                    `;
                    tbody.appendChild(row);
                });
            }
            
            filterAppointments() {
                const searchTerm = document.getElementById('appointmentSearch').value.toLowerCase();
                const statusFilter = document.getElementById('statusFilter').value;
                const dateFilter = document.getElementById('dateFilter').value;
                
                const tbody = document.getElementById('adminAppointmentsBody');
                const rows = tbody.querySelectorAll('tr');
                
                rows.forEach(row => {
                    const cells = row.querySelectorAll('td');
                    if (cells.length < 6) return;
                    
                    const id = cells[0].textContent.toLowerCase();
                    const name = cells[3].textContent.toLowerCase();
                    const phone = cells[4].textContent.toLowerCase();
                    const service = cells[5].textContent.toLowerCase();
                    const status = cells[6].querySelector('.status-badge')?.textContent.toLowerCase() || '';
                    const date = cells[1].textContent;
                    
                    let matches = true;
                    
                    if (searchTerm && !id.includes(searchTerm) && !name.includes(searchTerm) && !phone.includes(searchTerm) && !service.includes(searchTerm)) {
                        matches = false;
                    }
                    
                    if (statusFilter && status !== statusFilter.toLowerCase()) {
                        matches = false;
                    }
                    
                    if (dateFilter) {
                        const filterDate = this.formatDate(dateFilter);
                        if (date !== filterDate) {
                            matches = false;
                        }
                    }
                    
                    row.style.display = matches ? '' : 'none';
                });
            }
            
            updateCustomersTable() {
                const tbody = document.getElementById('adminCustomersBody');
                tbody.innerHTML = '';
                
                if (this.customers.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem;">No customers found</td></tr>';
                    return;
                }
                
                this.customers.forEach(customer => {
                    // Count customer appointments
                    const customerAppointments = this.appointments.filter(a => a.phone === customer.phone);
                    const lastAppointment = customerAppointments.length > 0 
                        ? this.formatDate(customerAppointments[customerAppointments.length - 1].date)
                        : 'Never';
                    
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${customer.name}</td>
                        <td>${customer.phone}</td>
                        <td>${customer.email || 'N/A'}</td>
                        <td>${customerAppointments.length}</td>
                        <td>${lastAppointment}</td>
                        <td>
                            <div class="table-actions">
                                <button class="btn btn-small" onclick="adminSystem.viewCustomer('${customer.phone}')">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                        </td>
                    `;
                    tbody.appendChild(row);
                });
            }
            
            filterCustomers() {
                const searchTerm = document.getElementById('customerSearch').value.toLowerCase();
                const tbody = document.getElementById('adminCustomersBody');
                const rows = tbody.querySelectorAll('tr');
                
                rows.forEach(row => {
                    const cells = row.querySelectorAll('td');
                    if (cells.length < 6) return;
                    
                    const name = cells[0].textContent.toLowerCase();
                    const phone = cells[1].textContent.toLowerCase();
                    const email = cells[2].textContent.toLowerCase();
                    
                    const matches = searchTerm === '' || 
                        name.includes(searchTerm) || 
                        phone.includes(searchTerm) || 
                        email.includes(searchTerm);
                    
                    row.style.display = matches ? '' : 'none';
                });
            }
            
            updateServicesTable() {
                const tbody = document.getElementById('adminServicesBody');
                tbody.innerHTML = '';
                
                // Default services
                const services = [
                    {
                        name: 'Box Braids',
                        duration: '3-4 hours',
                        price: '$80 - $150',
                        description: 'Classic box braids in various sizes and lengths.'
                    },
                    {
                        name: 'Cornrows',
                        duration: '2-3 hours',
                        price: '$60 - $120',
                        description: 'Traditional cornrow styles with creative patterns.'
                    },
                    {
                        name: 'Crochet Braids',
                        duration: '2-3 hours',
                        price: '$90 - $180',
                        description: 'Quick and protective style using crochet technique.'
                    },
                    {
                        name: 'Twists & Locs',
                        duration: '3-4 hours',
                        price: '$70 - $140',
                        description: 'Two-strand twists and loc installations.'
                    },
                    {
                        name: 'Men\'s Styles',
                        duration: '1-2 hours',
                        price: '$40 - $80',
                        description: 'Braids, fades, and locs for men.'
                    },
                    {
                        name: 'Specialty Styles',
                        duration: '2-4 hours',
                        price: '$100 - $200',
                        description: 'Custom and intricate braiding designs.'
                    }
                ];
                
                services.forEach(service => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${service.name}</td>
                        <td>${service.duration}</td>
                        <td>${service.price}</td>
                        <td>${service.description}</td>
                        <td>
                            <div class="table-actions">
                                <button class="btn btn-small" data-service-action="edit" data-service-name="${service.name}">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-small btn-danger" data-service-action="delete" data-service-name="${service.name}">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </td>
                    `;
                    tbody.appendChild(row);
                });
            }
            
            switchAdminPanel(panel, link) {
                // Update active menu item
                document.querySelectorAll('.admin-menu a').forEach(a => {
                    a.classList.remove('active');
                });
                link.classList.add('active');
                
                // Show selected panel
                document.querySelectorAll('.admin-panel').forEach(p => {
                    p.classList.remove('active');
                });
                document.getElementById(`${panel}Panel`).classList.add('active');
                
                // Update data when switching to appointments or dashboard
                if (panel === 'appointments' || panel === 'dashboard') {
                    this.updateAdminDashboard();
                }
            }
            
            viewAppointment(appointmentId) {
                const appointment = this.appointments.find(a => a.id === appointmentId);
                if (appointment) {
                    const modalHtml = `
                        <div class="modal">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h3 style="color: var(--primary);">Appointment Details</h3>
                                    <button class="modal-close" onclick="this.closest('.modal').remove()">
                                        <i class="fas fa-times"></i>
                                    </button>
                                </div>
                                
                                <div style="display: grid; gap: 1rem; margin-bottom: 2rem;">
                                    <div>
                                        <label style="color: var(--text-light); font-size: 0.9rem;">Appointment ID</label>
                                        <p style="font-weight: 600; color: var(--primary);">${appointment.id}</p>
                                    </div>
                                    <div>
                                        <label style="color: var(--text-light); font-size: 0.9rem;">Customer Name</label>
                                        <p style="font-weight: 600; color: var(--primary);">${appointment.name}</p>
                                    </div>
                                    <div>
                                        <label style="color: var(--text-light); font-size: 0.9rem;">Phone Number</label>
                                        <p style="font-weight: 600; color: var(--primary);">${appointment.phone}</p>
                                    </div>
                                    <div>
                                        <label style="color: var(--text-light); font-size: 0.9rem;">Email</label>
                                        <p style="font-weight: 600; color: var(--primary);">${appointment.email || 'Not provided'}</p>
                                    </div>
                                    <div>
                                        <label style="color: var(--text-light); font-size: 0.9rem;">Service</label>
                                        <p style="font-weight: 600; color: var(--primary);">${appointment.service}</p>
                                    </div>
                                    <div>
                                        <label style="color: var(--text-light); font-size: 0.9rem;">Date & Time</label>
                                        <p style="font-weight: 600; color: var(--primary);">${this.formatDate(appointment.date)} at ${appointment.time}</p>
                                    </div>
                                    <div>
                                        <label style="color: var(--text-light); font-size: 0.9rem;">Status</label>
                                        <p><span class="status-badge ${appointment.status}">${appointment.status}</span></p>
                                    </div>
                                    ${appointment.message ? `
                                        <div>
                                            <label style="color: var(--text-light); font-size: 0.9rem;">Notes</label>
                                            <p style="color: var(--primary);">${appointment.message}</p>
                                        </div>
                                    ` : ''}
                                    <div>
                                        <label style="color: var(--text-light); font-size: 0.9rem;">Created</label>
                                        <p style="color: var(--primary);">${new Date(appointment.createdAt).toLocaleString()}</p>
                                    </div>
                                </div>
                                
                                <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                                    <button class="btn btn-small btn-outline" onclick="this.closest('.modal').remove()">
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;
                    
                    document.body.insertAdjacentHTML('beforeend', modalHtml);
                }
            }
            
            confirmAppointment(appointmentId) {
                const appointment = this.appointments.find(a => a.id === appointmentId);
                if (appointment) {
                    if (confirm(`Confirm appointment with ${appointment.name} for ${appointment.service}?`)) {
                        appointment.status = 'confirmed';
                        appointment.updatedAt = new Date().toISOString();
                        localStorage.setItem('shalomAppointments', JSON.stringify(this.appointments));
                        
                        this.showNotification('Appointment confirmed successfully!', 'success');
                        this.updateAdminDashboard();
                    }
                }
            }
            
            cancelAppointment(appointmentId) {
                const appointment = this.appointments.find(a => a.id === appointmentId);
                if (appointment) {
                    if (confirm(`Cancel appointment with ${appointment.name} for ${appointment.service}?`)) {
                        appointment.status = 'cancelled';
                        appointment.updatedAt = new Date().toISOString();
                        localStorage.setItem('shalomAppointments', JSON.stringify(this.appointments));
                        
                        this.showNotification('Appointment cancelled successfully!', 'success');
                        this.updateAdminDashboard();
                    }
                }
            }
            
            viewCustomer(phone) {
                const customer = this.customers.find(c => c.phone === phone);
                const customerAppointments = this.appointments.filter(a => a.phone === phone);
                
                if (customer) {
                    let appointmentsText = '';
                    customerAppointments.forEach(app => {
                        appointmentsText += `\n- ${this.formatDate(app.date)} ${app.time}: ${app.service} (${app.status})`;
                    });
                    
                    alert(`Customer Details:\n\nName: ${customer.name}\nPhone: ${customer.phone}\nEmail: ${customer.email || 'N/A'}\nTotal Appointments: ${customerAppointments.length}${appointmentsText}`);
                }
            }
            
            editService(serviceName) {
                alert(`Edit service: ${serviceName} - Feature coming soon!`);
            }
            
            deleteService(serviceName) {
                if (confirm(`Are you sure you want to delete the service "${serviceName}"?`)) {
                    this.showNotification(`Service "${serviceName}" deleted (demo only - not actually removed).`, 'success');
                }
            }
            
            openServiceModal() {
                const modalHtml = `
                    <div class="modal">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h3 style="color: var(--primary);">Add New Service</h3>
                                <button class="modal-close" onclick="this.closest('.modal').remove()">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                            
                            <form id="serviceForm">
                                <div class="form-group">
                                    <label class="form-label">Service Name</label>
                                    <input type="text" class="form-control" required>
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">Duration</label>
                                    <select class="form-control" required>
                                        <option value="">Select duration</option>
                                        <option value="1-2 hours">1-2 hours</option>
                                        <option value="2-3 hours">2-3 hours</option>
                                        <option value="3-4 hours">3-4 hours</option>
                                        <option value="4-5 hours">4-5 hours</option>
                                    </select>
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">Price Range</label>
                                    <input type="text" class="form-control" placeholder="e.g., $80 - $150" required>
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">Description</label>
                                    <textarea class="form-control" rows="3" required></textarea>
                                </div>
                                
                                <button type="submit" class="btn">Add Service</button>
                            </form>
                        </div>
                    </div>
                `;
                
                document.body.insertAdjacentHTML('beforeend', modalHtml);
                
                // Add form submission handler
                const serviceForm = document.getElementById('serviceForm');
                if (serviceForm) {
                    serviceForm.addEventListener('submit', (e) => {
                        e.preventDefault();
                        this.showNotification('Service added successfully!', 'success');
                        document.querySelector('.modal').remove();
                    });
                }
            }
            
            saveBusinessInfo() {
                const businessName = document.getElementById('businessName').value;
                const businessPhone = document.getElementById('businessPhone').value;
                const businessEmail = document.getElementById('businessEmail').value;
                const businessAddress = document.getElementById('businessAddress').value;
                const hoursWeekday = document.getElementById('businessHoursWeekday').value;
                const hoursSunday = document.getElementById('businessHoursSunday').value;
                const about = document.getElementById('businessAbout').value;
                
                // Update website
                document.getElementById('businessAddressText').textContent = businessAddress;
                document.getElementById('businessPhoneText').textContent = businessPhone;
                document.getElementById('businessEmailText').textContent = businessEmail;
                document.getElementById('businessHoursWeekdayText').textContent = hoursWeekday;
                document.getElementById('businessHoursSundayText').textContent = hoursSunday;
                document.getElementById('businessAboutText').textContent = about;
                
                // Update footer
                document.getElementById('footerBusinessName').textContent = businessName;
                document.getElementById('footerAboutText').textContent = about;
                document.getElementById('footerAddress').textContent = businessAddress.split('\n')[0];
                document.getElementById('footerPhone').textContent = businessPhone;
                document.getElementById('footerEmail').textContent = businessEmail;
                document.getElementById('copyrightBusinessName').textContent = businessName;
                
                this.showNotification('Business information saved successfully!', 'success');
            }
            
            changePassword() {
                const current = document.getElementById('currentPassword').value;
                const newPass = document.getElementById('newPassword').value;
                
                if (!current || !newPass) {
                    alert('Please enter both current and new password!');
                    return;
                }
                
                if (current !== this.adminPassword) {
                    alert('Current password is incorrect!');
                    return;
                }
                
                this.adminPassword = newPass;
                localStorage.setItem('adminPassword', newPass);
                document.getElementById('currentPassword').value = '';
                document.getElementById('newPassword').value = '';
                this.showNotification('Password changed successfully!', 'success');
            }
            
            exportData() {
                const data = {
                    appointments: this.appointments,
                    customers: this.customers,
                    gallery: gallerySystem.getGalleryData(),
                    exportDate: new Date().toISOString()
                };
                
                const dataStr = JSON.stringify(data, null, 2);
                const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
                
                const exportFileDefaultName = `shalom-braids-backup-${new Date().toISOString().split('T')[0]}.json`;
                
                const linkElement = document.createElement('a');
                linkElement.setAttribute('href', dataUri);
                linkElement.setAttribute('download', exportFileDefaultName);
                linkElement.click();
                
                this.showNotification('Data exported successfully!', 'success');
            }
            
            importData() {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.json';
                
                input.onchange = e => {
                    const file = e.target.files[0];
                    const reader = new FileReader();
                    
                    reader.onload = event => {
                        try {
                            const data = JSON.parse(event.target.result);
                            
                            if (confirm('This will replace all existing data. Continue?')) {
                                this.appointments = data.appointments || [];
                                this.customers = data.customers || [];
                                
                                // Update gallery if data exists
                                if (data.gallery) {
                                    localStorage.setItem('shalomGallery', JSON.stringify(data.gallery));
                                    gallerySystem.galleryImages = data.gallery;
                                    gallerySystem.renderGallery();
                                    gallerySystem.renderAdminGallery();
                                }
                                
                                localStorage.setItem('shalomAppointments', JSON.stringify(this.appointments));
                                localStorage.setItem('shalomCustomers', JSON.stringify(this.customers));
                                
                                this.updateAdminDashboard();
                                this.showNotification('Data imported successfully!', 'success');
                            }
                        } catch (error) {
                            alert('Error importing data: Invalid file format!');
                        }
                    };
                    
                    reader.readAsText(file);
                };
                
                input.click();
            }
            
            clearData() {
                if (confirm('WARNING: This will delete ALL data including appointments, customers, and gallery. This action cannot be undone. Continue?')) {
                    this.appointments = [];
                    this.customers = [];
                    gallerySystem.galleryImages = [];
                    
                    localStorage.setItem('shalomAppointments', JSON.stringify(this.appointments));
                    localStorage.setItem('shalomCustomers', JSON.stringify(this.customers));
                    localStorage.setItem('shalomGallery', JSON.stringify([]));
                    
                    this.updateAdminDashboard();
                    gallerySystem.renderGallery();
                    this.showNotification('All data cleared successfully!', 'success');
                }
            }
            
            parseTime(timeStr) {
                const [time, modifier] = timeStr.split(' ');
                let [hours, minutes] = time.split(':').map(Number);
                
                if (modifier === 'PM' && hours < 12) hours += 12;
                if (modifier === 'AM' && hours === 12) hours = 0;
                
                return hours * 60 + minutes;
            }
            
            formatDate(dateString) {
                const date = new Date(dateString);
                return date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            }

            showNotification(message, type = 'info') {
                // Remove existing notifications
                document.querySelectorAll('.notification').forEach(n => n.remove());
                
                // Create notification element
                const notification = document.createElement('div');
                notification.className = `notification notification-${type}`;
                notification.innerHTML = `
                    <div class="notification-content">
                        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'times-circle' : 'info-circle'}"></i>
                        <span>${message}</span>
                    </div>
                    <button class="notification-close" onclick="this.parentElement.remove()">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                
                document.body.appendChild(notification);
                
                // Auto remove after 5 seconds
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 5000);
            }
        }

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