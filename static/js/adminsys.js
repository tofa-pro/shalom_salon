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
               // this.setupGalleryUpload();
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
        }
        const adminSystem = new AdminSystem();

         // Make systems globally accessible
         
        // window.adminSystem = adminSystem;