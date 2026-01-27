function servicerender(items){
    const list = document.getElementById('adminServicesBody');
    list.innerHTML = '';
    items.forEach(item=>{
      const tr = document.createElement('tr');
      tr.className = 'item';
      tr.dataset.id = item.Id;

      tr.innerHTML = `
                            <td>${item.ServiceName}</td>
                             <td>${item.Duration}</td>
                              <td>${item.PriceRange}</td>
                              <td>${item.Description}</td>
                            <td>
                                 <div class="actions">
                                <button class="edit" onclick="" ><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg></button>
                                <button class="del" onclick=""><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg></button> 
                                </div>
                                </td>
      `;

      // attach handlers
      tr.querySelector('.del').addEventListener('click', ()=>deleteservice(item, tr));
      tr.querySelector('.edit').addEventListener('click', ()=>editservice(item, tr));

      list.appendChild(tr);
    });
  }

  //Type
  function loadservice(){
    //loading
    alldata('services').then(data => {
        servicerender(data)
     });
  }
  function closeservice(){
    const listEl = document.getElementById('adminServicesBody');
    listEl.innerHTML = '';
  }
  document.getElementById("wan-create-form").addEventListener("submit", function (e) {
    e.preventDefault(); // stop page reload
    createwan();
  });
  function createservice(){
    let formData = {
        "servicename": document.getElementById("wan-first-ip").value,
        "duration":  document.getElementById("wan-second-ip").value,
        "thirdoctet":document.getElementById("wan-third-ip").value,
        "pricerange":document.getElementById("wan-four-ip").value,
        "description":document.getElementById("wan-subnet").value,
     }
     singledata("servicecreate",formData).then(data => {
      console.log('created:', data);
      alldata('services').then(data2 => {
        console.log('alldata:', data2);
        servicerender(data2)
     });
   });
   }
   function deleteservice(item,tr){
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
          attachDefaultHandlers(); 
        });
        actions.querySelector('[data-confirm="yes"]').addEventListener('click', ()=>{
          // animate then remove
          let formData = {
            "id": item.Id,
         }
         singledata("servicedelete",formData).then(data => {
          console.log('deleted:', data);
          alldata('services').then(data2 => {
            console.log('alldata:', data2);
            servicerender(data2)
         });
       });
        });

        function attachDefaultHandlers(){
          const d = tr.querySelector('.del');
          const e = tr.querySelector('.edit');
          if(d) d.addEventListener('click', ()=>deleteservice(item, tr));
          if(e) e.addEventListener('click', ()=>editservice(item, tr));
        }
   }
   function editservice(item, tr){
    // replace tr with small confirm UI
    const old = tr.innerHTML;
    tr.innerHTML = `
               <td><input type="text" id="wan-first-tab${item.Id}" value=${item.FirstOctet} class="input" name="type-name-tab" placeholder="type name"></td>
               <td><input type="text" id="wan-second-tab${item.Id}" value=${item.SecondOctet} class="input" name="type-name-tab" placeholder="type name"></td>
               <td><input type="text" id="wan-third-tab${item.Id}" value=${item.ThirdOctet} class="input" name="type-name-tab" placeholder="type name"></td>
               <td><input type="text" id="wan-four-tab${item.Id}" value=${item.FourthOctet} class="input" name="type-name-tab" placeholder="type name"></td>
               <td><input type="text" id="wan-subnet-tab${item.Id}" value=${item.Subnet} class="input" name="type-name-tab" placeholder="type name"></td>
                <td><input type="text" id="wan-serviceno-tab${item.Id}" value=${item.Serviceno} class="input" name="type-name-tab" placeholder="type name"></td>
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
      attachDefaultHandlers(); 
    });
    tr.querySelector('[data-confirm="yes"]').addEventListener('click', ()=>{
      // animate then remove
      let formData = {
        "id": item.Id,
        "servicename":document.getElementById(`wan-first-tab${item.Id}`).value,
        "duration":document.getElementById(`wan-second-tab${item.Id}`).value,
        "pricerange":document.getElementById(`wan-third-tab${item.Id}`).value,
        "description":document.getElementById(`wan-four-tab${item.Id}`).value,

     }
     singledata("serviceupdate",formData).then(data => {
      console.log('updated:', data);
      alldata('services').then(data2 => {
        console.log('alldata:', data2);
        servicerender(data2)
     });
   });
    });

    function attachDefaultHandlers(){
      const d = tr.querySelector('.del');
      const e = tr.querySelector('.edit');
      if(d) d.addEventListener('click', ()=>deleteservice(item, tr));
      if(e) e.addEventListener('click', ()=>editservice(item,tr));
    }
   }