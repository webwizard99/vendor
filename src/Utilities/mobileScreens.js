const mobileScreen = (function(){
  let currentScreen = '';
  let currentIndex = 0;
  const screens = ['store', 'suppliers'];

  return {
    init: function() {
      currentScreen = screens[0];
      currentIndex = 0;
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
    }
  }
}());