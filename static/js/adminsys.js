 // ====================
        // Admin System
        // ====================
        class AdminSystem {
            constructor() {

                this.init();

            }
            
            init() {
                this.setupEventListeners();
             //   this.setupClickHandlers();
              
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