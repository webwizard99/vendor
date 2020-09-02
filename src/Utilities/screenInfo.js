import { store } from '../index';
import { SET_IS_FULLSCREEN, SET_IS_PC, SET_IS_MOBILE } from '../actions/types';

const screenInfo = (function(){
  let isPc = true;
  let isMobile = false;
  let isFullscreen = true;

  let height = 0;
  let width = 0;

  const dispatchFullscreen = function() {
    const payload = {
      type: SET_IS_FULLSCREEN,
      value: isFullscreen
    }
    store.dispatch(payload);
  }

  const dispatchIsPc = function() {
    const payload = {
      type: SET_IS_PC,
      value: isPc
    }
    store.dispatch(payload);
  }

  const dispatchIsMobile = function() {
    const payload = {
      type: SET_IS_MOBILE,
      value: isMobile
    }
    store.dispatch(payload);
  }

  const detectPc = function() {
    const notPc = window.orientation > -1;
    return !notPc;
    
  }

  const setFullScreen = function(ele) {
    isFullscreen = true;
    document.fullscreen = true;
    document.fullscreenElement = ele;
  }

  const setScreenInfo = function() {
    const app = document.querySelector('.App');
    const docDimensions = app.getBoundingClientRect();
    height = docDimensions.height;
    width = docDimensions.width;

    if (width < 768) {
      isMobile = true
    } 
  }

  return {
    init: function() {
      isPc = detectPc();
      setScreenInfo();
      dispatchIsPc();
      dispatchIsMobile();
    },
    getIsPc: function() {
      return isPc;
    },
    getIsMobile: function() {
      return isMobile;
    },
    setElementFullScreen: function(element) {
      setFullScreen(element);
      dispatchFullscreen();
    }
  }
}());

export default screenInfo;