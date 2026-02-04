 // ====================
        // Admin System
        // ====================
        class galleryManagment {
            constructor() {
  
                this.init();
                
  
            }
            init() {
              this.setupEventListeners();
              this.setupGalleryUpload();
              this.loadGallery();
          }
          loadGallery(){
            alldata('gallery').then(data => {
              console.log('alldata:', data);
              this.galleryrender(data);
           });
          }
          setupEventListeners(){
              // service creation form
              const galleryForm = document.getElementById('gallery-create-form');
              if (galleryForm) {
                galleryForm.addEventListener('submit', (e) => {
                      e.preventDefault();
                      this.creategallery();
                  });
              }
          }
         
          galleryrender(items){
            const listEl = document.getElementById('gallerylist');
            if (!listEl) return;

            listEl.innerHTML = '';
              items.forEach(item=>{
              const div = document.createElement('div');
              div.className = 'gallery-admin-item';
              div.dataset.id = item.Id;
              div.innerHTML = `
                        <img src="${item.ImgPath.String}" alt="${item.ImgTitle.String}">
                        <div class="gallery-admin-info">
                            <span class="gallery-admin-category">${item.Catagory.String}</span>
                            <h4>${item.ImgTitle.String}</h4>
                            <p style="font-size: 0.9rem; color: var(--text-light); margin-bottom: 1rem;">${item.ImgDescription.String || 'No description'}</p>
                            <p style="font-size: 0.8rem; color: var(--text-light); margin-bottom: 1rem;">Added: </p>
                            <div class="table-actions">
                                <button class="del btn btn-small btn-danger" onclick="">
                                    <i class="fas fa-trash"></i> Delete
                                </button>
                            </div>
                        </div>
                    `;
          
              // attach handlers
              div.querySelector('.del').addEventListener('click', ()=>this.deletegallery(item, div));
          
              listEl.appendChild(div);
            });
          }
  
          creategallery(){
            const formData = new FormData();

formData.append(
  "imgtitle",
  document.getElementById("imgtitle-name").value
)

formData.append(
  "category",
  document.getElementById("imgcatagory-option").value
)

formData.append(
  "imgdescription",
  document.getElementById("description-name").value
)
formData.append(
    "imgpath",
    document.getElementById("imgpath-name").files[0]
)

 
// formData.append(
//   "imgpath",
//   document.getElementById("imgpath-name").files[0]
// )
for( const[key,value] of formData.entries()){
  console.log(key,value)
}
//console.log(formData)
// send
singledata2("gallerycreate", formData).then(data => {
  console.log("created:", data)
  this.loadGallery()
})

           }
  
          deletegallery(item,div){
            // replace actions with small confirm UI
            const actions = div.querySelector('.table-actions');
            const old = actions.innerHTML;
            actions.innerHTML = `
                <div class="confirm" role="status" aria-live="polite">Delete?</div>
                                    <div>
                                    <button class="btn" data-confirm="yes"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg></button>
                                    <button class="btn btn-danger" data-confirm="no"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg></button>
                                    </div>
            `;
            actions.querySelector('[data-confirm="no"]').addEventListener('click', ()=>{
               actions.innerHTML = old;
               this.attachDefaultHandlers(item,div); 
            });
            actions.querySelector('[data-confirm="yes"]').addEventListener('click', ()=>{
              // animate then remove
              let formData = {
                "id": item.Id,
             }
             singledata("gallerydelete",formData).then(data => {
              console.log('deleted:', data);
              this.loadGallery();
           });
            });     
       }
  
       attachDefaultHandlers(item,div){
        const d = div.querySelector('.del');
        if(d) d.addEventListener('click', ()=>this.deletegallery(item,div));
       }
            //end of class
        
          setupGalleryUpload() {
            const uploadArea = document.getElementById('uploadArea');
            const imageInput = document.getElementById('imgpath-name');
            
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
                        // 🔑 THIS puts the file into the input
                           const dataTransfer = new DataTransfer()
                           dataTransfer.items.add(e.dataTransfer.files[0])
                           imageInput.files = dataTransfer.files
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
            
        }
        
        handleImageUpload(file) {
            const preview = document.getElementById('imagePreview');
            const titleInput = document.getElementById('imgtitle-name');
            
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
    
  const gallerymanage = new galleryManagment();