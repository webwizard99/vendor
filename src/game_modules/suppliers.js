const suppliers = (function(){

  let suppliers = [];

  const Supplier = function(payload) {
    const { name, offerings } = payload;
    this.name = name;
    this.offerings = offerings;
  }

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

  const getSuppliers = function*() {
    yield fetchSuppliers();
  }

  return {
    initializeSuppliers: async function(maxSuppliers) {
      const gGetSuppliers = getSuppliers();
      gGetSuppliers.next().value
        .then(initSuppliers => {
          console.log(initSuppliers);
          if (initSuppliers) {
            let drainSuppliers = initSuppliers;
            while (suppliers.length < maxSuppliers && drainSuppliers.length > 0) {
              const pushIndex = Math.floor(Math.random() * drainSuppliers.length);
              let newSupplier = drainSuppliers.splice(pushIndex, 1);
              newSupplier = newSupplier[0];
              const supplierPayload = { name: newSupplier.name, offerings: newSupplier.offerings };
              let thisSupplier = new Supplier(supplierPayload);
              suppliers.push(thisSupplier);
            }
            return suppliers;
          }
        });
    },
    getSuppliers: function() {
      return suppliers;
    }
  }
}());

export default suppliers;