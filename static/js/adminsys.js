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
             //   this.setupClickHandlers();
               this.setupGalleryUpload();
            }
            setupEventListeners() {
                
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
        }
        const adminSystem = new AdminSystem();

         // Make systems globally accessible
         
        // window.adminSystem = adminSystem;