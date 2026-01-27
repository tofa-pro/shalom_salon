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

      