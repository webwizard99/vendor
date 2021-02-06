// redux imports
import { store } from '../index';
import { SET_PC_DETAIL } from '../actions/types';

import pcMenus from './pcMenus';

const pcDetailMenus = (function(){
  let currentMenu = '';
  let currentIndex = 0;

  const menus = [pcMenus.adventurers, pcMenus.dungeon];

  let menuMap = {};

  const mapMenus = function() {
    menus.forEach((menu, menuN) => {
      menuMap[menu] = menuN;
    })
  }

  const dispatchPCMenu = function() {
    const payload = {
      type: SET_PC_DETAIL,
      detail: currentMenu
    }
    store.dispatch(payload);
  }

  return {
    init: function() {
      currentMenu = menus[0];
      currentIndex = 0;
      mapMenus();
    },

    getCurrentMenu: function() {
      return currentMenu;
    },

    nextMenu: function() {
      currentIndex++;
      if (currentIndex >= menus.length) {
        currentIndex = 0;
      }
      currentMenu = menus[currentIndex];
    },

    previousMenu: function() {
      currentIndex--;
      if (currentIndex < 0) {
        currentIndex = menus.length - 1;
      }
      currentMenu = menus[currentIndex];
    },

    getMenus: function() {
      return menus;
    },

    setmenu: function(newMenu) {
      const menuIndex = menuMap[newMenu];
      if (menuIndex === null) {
        return false
      }
      currentIndex = menuIndex;
      currentMenu = menus[menuIndex];
      return true;
    },

    updateMenu: function() {
      dispatchPCMenu();
    }
  }
}());

export default pcDetailMenus;