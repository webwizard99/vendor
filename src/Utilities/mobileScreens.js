// redux imports
import { store } from '../index';
import { SET_MOBILE_SCREEN } from '../actions/types';

const mobileScreens = (function(){
  let currentScreen = '';
  let currentIndex = 0;
  const screens = ['store', 'suppliers'];

  const allScreens = {
    store: 'store',
    suppliers: 'suppliers'
  }

  let screenMap = {};

  const mapScreens = function() {
    screens.reduce((screen, screenN) => {
      screenMap[screen] = screenN;
    });
  }

  const dispatchMobileScreen = function() {
    const payload = {
      type: SET_MOBILE_SCREEN,
      screen: currentScreen
    }
    store.dispatch(payload);
  }

  return {
    init: function() {
      currentScreen = screens[0];
      currentIndex = 0;
      mapScreens();
    },

    getCurrentScreen: function() {
      return currentScreen;
    },

    nextScreen: function() {
      currentIndex++;
      if (currentIndex >= screens.length) {
        currentIndex = 0;
      }
      currentScreen = screens[currentIndex];
    },

    previousScreen: function() {
      currentIndex--;
      if (currentIndex < 0) {
        currentIndex = screens.length -1;
      }
      currentScreen = screens[currentIndex];
    },

    getAllScreens: function() {
      return allScreens;
    },

    setScreen: function(newScreen) {

    },

    updateScreen: function() {
      dispatchMobileScreen();
    }
  }
}());

export default mobileScreens;