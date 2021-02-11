const tagProcessor = (function(){

  const filterClasses = {
    name: 'adventurerNameTag',
    status: 'status'
  }

  return {
    getFilterClasses: function() {
      return filterClasses;
    }
  }
}());

export default tagProcessor;