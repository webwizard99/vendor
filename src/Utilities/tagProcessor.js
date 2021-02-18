const tagProcessor = (function(){

  const filterClasses = {
    name: 'adventurerNameTag',
    status: 'status',
    value: 'value'
  }

  return {
    getFilterClasses: function() {
      return filterClasses;
    }
  }
}());

export default tagProcessor;