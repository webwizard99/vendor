const tagProcessor = (function(){

  const filterClasses = {
    name: 'adventurerNameTag',
    monsterName: 'monsterNameTag',
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