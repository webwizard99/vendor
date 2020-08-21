const suppliers = (function(){

  let suppliers = [];

  const fetchSuppliers = async function() {
    let initSuppliers;
      try {
        initSuppliers = await fetch('/suppliers');
      } catch (err) {
        console.log(err);
      }
      if (initSuppliers) {
        initSuppliers = initSuppliers.json();
      }
      return initSuppliers;
  }

  return {
    initializeSuppliers: async function(maxSuppliers) {
      fetchSuppliers()
        .then(initSuppliers => {
          if (initSuppliers) {
            let drainSuppliers = initSuppliers;
            while (suppliers.length < maxSuppliers && drainSuppliers.length > 0) {
              const pushIndex = Math.floor(Math.random() * drainSuppliers.length);
              let newSupplier = drainSuppliers.splice(pushIndex, 1);
              newSupplier = newSupplier[0];
              suppliers.push(newSupplier);
            }
          }
        });
      
      console.log(suppliers);
    },
    getSuppliers: function() {
      return suppliers;
    }
  }
}());

export default suppliers;