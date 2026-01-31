function loadservice(element){
  //loading
    
     
      // alldata('dashlan').then(data => {
      // lanrender(data)
      //  });
  const dia = element.getAttribute("dialog-name");
  openDialog(dia)
  //creation
}
function closeservice(element){

  const dia = element.getAttribute("dialog-name");
  closeDialog(dia)
}