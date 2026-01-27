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

      