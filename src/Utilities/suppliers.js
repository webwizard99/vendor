const suppliers = (function(){

  let suppliers = [];

  return {
    initializeSuppliers: async function() {
      let initSuppliers;
      try {
        initSuppliers = await fetch('/suppliers');
      } catch (err) {
        console.log(err);
      }
      if (initSuppliers) {
        console.log(initSuppliers);
      }
    }
  }
}());

export default suppliers;