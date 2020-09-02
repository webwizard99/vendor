const screenInfo = (function(){
  let isPc = true;

  const detectPc = function() {
    const notPc = window.orientation > -1;
    return !notPc;
    
  }

  return {
    init: function() {
      isPc = detectPc();
    },
    getIsPc: function() {
      return isPc;
    }
  }
}());

export default screenInfo;