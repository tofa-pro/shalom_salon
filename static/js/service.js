 // ====================
        // Admin System
        // ====================
        class ServiceManagment {
          constructor() {

              this.init();

          }
          init() {
            this.setupEventListeners();
            this.loadService();
        }
        loadService(){
          alldata('services').then(data => {
            console.log('alldata:', data);
            this.servicerender(data);
         });
        }
        setupEventListeners(){
            // service creation form
            const ServiceForm = document.getElementById('service-create-form');
            if (ServiceForm) {
              ServiceForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.createservice();
                });
            }
            // dialogbox open
            const addServiceBtn = document.getElementById('addServiceBtn');
            if (addServiceBtn) {
              addServiceBtn.addEventListener('click', () => {
                    const dia = addServiceBtn.getAttribute("dialog-name");
                    openDialog(dia)
                });
            }
            const closeServiceBtn = document.getElementById('closeServiceBtn');
            if (closeServiceBtn) {
              closeServiceBtn.addEventListener('click', () => {
                    const dia = closeServiceBtn.getAttribute("dialog-name");
                    closeDialog(dia)
                });
            }
        }
       
        servicerender(items){
          const listEl = document.getElementById('servicelist');
          listEl.innerHTML = '';
            items.forEach(item=>{
            const tr = document.createElement('tr');
            tr.className = 'item';
            tr.dataset.id = item.Id;
        
            tr.innerHTML = `
                                  <td>${item.ServiceName.String}</td>
                                  <td>${item.Duration.String}</td>
                                  <td>${item.PriceRange.String}</td>
                                   <td>${item.Description.String}</td>
                                  <td>
                                       <div class="actions">
                                      <button class="edit" onclick="" ><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg></button>
                                      <button class="del" onclick=""><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg></button> 
                                      </div>
                                      </td>
            `;
        
            // attach handlers
            tr.querySelector('.del').addEventListener('click', ()=>this.deleteservice(item, tr));
            tr.querySelector('.edit').addEventListener('click', ()=>this.editservice(item, tr));
        
            listEl.appendChild(tr);
          });
        }

        createservice(){
          let formData = {
              "servicename": document.getElementById("service-name").value,
              "duration": document.getElementById("duration-option").value,
              "pricerange": document.getElementById("pricerange-name").value,
              "description": document.getElementById("description-name").value,
           }
           singledata("servicecreate",formData).then(data => {
            console.log('created:', data);
              this.loadService()
         });
         }

        deleteservice(item,tr){
          // replace actions with small confirm UI
          const actions = tr.querySelector('.actions');
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
             this.attachDefaultHandlers(item,tr); 
          });
          actions.querySelector('[data-confirm="yes"]').addEventListener('click', ()=>{
            // animate then remove
            let formData = {
              "id": item.Id,
           }
           singledata("servicedelete",formData).then(data => {
            console.log('deleted:', data);
            this.loadService();
         });
          });     
     }

     editservice(item,tr){
      // replace tr with small confirm UI
      const old = tr.innerHTML;
      tr.innerHTML = `
                 <td><input type="text" id="service-name-tab${item.Id}" value=${item.ServiceName.String} class="input" name="rsg-name-tab" placeholder="Rsg"></td>  
                 <td><input type="text" id="duration-name-tab${item.Id}" value=${item.Duration.String} class="input" name="latitude-name-tab" placeholder="Latitude"></td>
                 <td><input type="text" id="price-name-tab${item.Id}" value=${item.PriceRange.String} class="input" name="longtude-name-tab" placeholder="Longtude"></td>
                  <td><input type="text" id="description-name-tab${item.Id}" value=${item.Description.String} class="input" name="longtude-name-tab" placeholder="Longtude"></td>
                              <td>
                                  <div class="actions">
                                  <div class="confirm" role="status" aria-live="polite">update?</div>
                                  <div>
                                  <button class="btn" data-confirm="yes"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg></button>
                                  <button class="btn btn-danger" data-confirm="no"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg></button>
                                  </div>
                              </div>
                              </td>
      `;
  
      tr.querySelector('[data-confirm="no"]').addEventListener('click', ()=>{
         tr.innerHTML = old;
         this.attachDefaultHandlers(item,tr); 
      });
      tr.querySelector('[data-confirm="yes"]').addEventListener('click', ()=>{
        // animate then remove
        let formData = {
          "id": item.Id,
          "servicename": document.getElementById(`service-name-tab${item.Id}`).value,
          "duration": document.getElementById(`duration-name-tab${item.Id}`).value,
          "pricerange":  document.getElementById(`price-name-tab${item.Id}`).value,
          "description":document.getElementById(`description-name-tab${item.Id}`).value,
       }
       singledata("serviceupdate",formData).then(data => {
        console.log('updated:', data);
        this.loadService()
     });
      });
     }

     attachDefaultHandlers(item,tr){
      const d = tr.querySelector('.del');
      const e = tr.querySelector('.edit');
      if(d) d.addEventListener('click', ()=>this.deleteservice(item,tr));
      if(e) e.addEventListener('click', ()=>this.editservice(item,tr));
     }
          //end of class
        } 

const sericemanage = new ServiceManagment();