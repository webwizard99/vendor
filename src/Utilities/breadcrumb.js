import { store } from '../index';
import { SET_MOBILE_SCREEN, SET_PC_DETAIL } from '../actions/types';

import screenInfo from './screenInfo';

const breadcrumb = (function(){
  let breadcrumbs = [];

  const Breadcrumb = function(payload) {
    const { 
      displayPayload,
      isMobile,
      scrollPos
    } = payload;
    this.displayPayload = displayPayload;
    this.isMobile = isMobile;
    this.scrollPos = scrollPos;
  }

  Breadcrumb.dispatchDisplay = function() {
    if (this.isMobile) {
      store.dispatch({ type: SET_MOBILE_SCREEN, screen: this.displayPayload });
    } else {
      store.dispatch({ type: SET_PC_DETAIL, detail: this.displayPayload });
    }
  }

  return {
    popBreadcrumb: function() {
      if (breadcrumbs.length < 1) return false;
      const nextCrumb = breadcrumbs.pop();
      nextCrumb.dispatchDisplay();
    },
    addBreadcrumb: function(payload) {
      let { display, scrollPos } = payload;
      const isMobile = screenInfo.isMobile();
      const newCrumb = new Breadcrumb({ displayPayload: display, scrollPos: scrollPos, isMobile: isMobile });
      breadcrumbs.push(newCrumb);
    }
  }
}());

export default breadcrumb;