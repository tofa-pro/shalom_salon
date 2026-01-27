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