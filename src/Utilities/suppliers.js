const suppliers = (function(){

  let suppliers = [];

  return {
    initializeSuppliers: async function(maxSuppliers) {
      let initSuppliers;
      try {
        initSuppliers = await fetch('/suppliers');
      } catch (err) {
        console.log(err);
      }
      if (initSuppliers) {
        console.log(initSuppliers);
        initSuppliers = initSuppliers.json();
        console.log(initSuppliers);
        while (suppliers.length < maxSuppliers && initSuppliers.length > 0) {
          const pushIndex = Math.floor(Math.random() * initSuppliers.length);
          console.log(`pushIndex: ${pushIndex}`);
          let newSupplier = initSuppliers.splice(pushIndex, 1);
          suppliers.push(newSupplier);
        }
      }
      
      console.log(suppliers);
    },
    getSuppliers: function() {
      return suppliers;
    }
  }
}());

export default suppliers;