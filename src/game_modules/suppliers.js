// game imports
import supplies from './supplies';
import items from './items';

// redux imports
import { store } from '../index';
import { SET_SUPPLIERS } from '../actions/types';

const suppliers = (function(){

  let suppliers = [];

  const Supplier = function(payload) {
    const { name, offerings } = payload;
    this.name = name;
    this.offerings = offerings;
  }

  const dispatchSuppliers = function(newSuppliers) {
    const payload = {
      type: SET_SUPPLIERS,
      payload: newSuppliers
    }
    store.dispatch(payload);
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

  const takeSupplies = function() {
    let remainingSupplies = supplies.getSupplies();
    let supplyTypes = [];
    remainingSupplies.forEach(remainingSupply => {
      const supplyItem = items.getItem(remainingSupply);
      supplyTypes.push(supplyItem.type);
    });
    console.log(supplyTypes);
    let currentSupplier = 0;
    const supplierCount = suppliers.length;
    while (remainingSupplies.length > 0) {
      let preferredOffering = 0;
      let preferredMarkup = 0;
      suppliers[currentSupplier].offerings.forEach((offering, offN) => {
        if (offering.markup > preferredMarkup) {
          preferredOffering = offN;
          preferredMarkup = offering.markup;
        } 
      });
      // check if offering of type with highest markup is in remaining supplies
      let itemIndex = supplyTypes.find(itemType => itemType === suppliers[currentSupplier].offerings[preferredOffering].type);
      if (itemIndex === undefined) {
        itemIndex = 0;
      } 

      // if supplier inventory not initialized, set to empty array
      if (suppliers[currentSupplier].inventory === null) {
        suppliers[currentSupplier].invenotory = [];
      }
      // remove item from supply
      const thisSupply = supplies.depleteSupply(remainingSupplies[itemIndex]);
      // put item in supplier's inventory
      suppliers[currentSupplier].inventory.push(thisSupply);
      // remove reference to item from local supplies array and supplyTypes array
      remainingSupplies.splice(itemIndex, 1);
      supplyTypes.splice(itemIndex, 1);

      // advance index of supplier to next supplier
      currentSupplier++;
      if (currentSupplier >= supplierCount) {
        currentSupplier = 0;
      }
    }

    // dispatchSuppliers(suppliers);
  }

  return {
    initializeSuppliers: async function(maxSuppliers) {
      const gGetSuppliers = getSuppliers();
      gGetSuppliers.next().value
        .then(initSuppliers => {
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
            takeSupplies();
            dispatchSuppliers(suppliers);
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