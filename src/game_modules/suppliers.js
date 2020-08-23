// game imports
import supplies from './supplies';
import items from './items';

// redux imports
import { store } from '../index';
import { SET_SUPPLIERS, SET_SUPPLY_READY } from '../actions/types';

const suppliers = (function(){

  let suppliers = [];

  let currentId = 0;

  const startingGold = 1000;

  const Supplier = function(payload) {
    const { name, offerings } = payload;
    this.name = name;
    this.offerings = offerings;
    this.inventory = [];
    this.id = currentId;
    currentId++;
  }

  Supplier.prototype.rankFavorites = function() {
    let bestOfferings = [];
    const offeringsCount = this.offerings.length;
    for (let i = 0; i < offeringsCount; i++) {
      bestOfferings.push(this.offerings[i]);
    }
    bestOfferings.sort((off1, off2) => {
      return off1.markup - off2.markup;
    });
    this.rankedOfferings = bestOfferings;
  }

  Supplier.prototype.sellItem = function(payload) {
    let { id, price } = payload;

    const itemIndex = this.inventory.indexOf(id);
    if (!itemIndex) {
      return false;
    }

    this.inventory.splice(itemIndex, 1);
    this.gold += price;

    return true;
  }

  const dispatchSuppliers = function(newSuppliers) {
    const payload = {
      type: SET_SUPPLIERS,
      payload: newSuppliers
    }
    store.dispatch(payload);
  }

  const dispatchSupplyReady = function(value) {
    const payload = {
      type: SET_SUPPLY_READY,
      value: value
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
    // copy supplies to local array
    const remainingSupplies = JSON.parse(JSON.stringify(supplies.getSupplies()));
    let supplyTypes = [];
    let supplyValues = [];
    remainingSupplies.forEach(remainingSupply => {
      const supplyItem = items.getItem(remainingSupply);
      supplyTypes.push(supplyItem.type);
      supplyValues.push(supplyItem.value);
    });
    let currentSupplier = 0;
    const supplierCount = suppliers.length;
    // loop through each supply item
    remainingSupplies.forEach((remSupply, remNum) => {
      // create an order based on last supplier to take an
      // item and proceeded sequentially to include all
      // suppliers
      let supplierTries = [];
      for (let i = 0; i < supplierCount; i++) {
        let thisIndex = currentSupplier + i;
        if (thisIndex >= supplierCount) {
          thisIndex -= supplierCount;
        }
        supplierTries.push(thisIndex);
      }
      let taken = false;
      
      // check with each supplier if type of current supply is
      // in their offerings
      supplierTries.forEach(supplierIndex => {
        let favorites = suppliers[supplierIndex].rankedOfferings;
        for (let fave of favorites) {
          // if type of supplier's offering equals type of this supply
          if (fave.type === supplyTypes[remNum]) {
            if (!taken && suppliers[supplierIndex].gold >= supplyValues[remNum]) {
              // if supplier inventory not initialized, set to empty array
              if (suppliers[supplierIndex].inventory === null) {
                suppliers[supplierIndex].inventory = [];
              }

              // remove item from supply
              let thisSupply = supplies.depleteSupply(remSupply);
              if (Array.isArray(thisSupply)) {
                thisSupply = thisSupply[0];
              }

              suppliers[supplierIndex].gold -= supplyValues[remNum];

              // put item in supplier's inventory
              suppliers[supplierIndex].inventory.push(thisSupply);

              // mark item taken;
              taken = true;
              currentSupplier = supplierIndex + 1;
              if (currentSupplier > supplierCount) {
                currentSupplier = 0;
              }
            }
          }
        }
      });
    });
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
              thisSupplier.gold = startingGold;
              suppliers.push(thisSupplier);
            }
            suppliers.forEach(supplier => supplier.rankFavorites());
            dispatchSuppliers(suppliers);
            return suppliers;
          }
        });
    },
    getSuppliers: function() {
      return suppliers;
    },
    takeSupplierTurn: function() {
      takeSupplies();
      dispatchSuppliers(suppliers);
      dispatchSupplyReady(false);
    },
    sellItem(payload) {
      const { id, itemId, price} = payload;
      
      const thisSupplier = suppliers.find(refSupplier => refSupplier.id === id);
      if (!thisSupplier) {
        return false;
      }
      const sellPayload = {
        id: itemId,
        price: price
      }

      const resSale = thisSupplier.sellItem(sellPayload);
      if (!resSale) {
        return false;
      }
      return true;
    }
  }
}());

export default suppliers;