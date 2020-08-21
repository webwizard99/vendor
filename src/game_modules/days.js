const days = (function (){
  const startDay = 1;
  let day = startDay;

  return {
    getDay: function() {
      return day;
    },

    setDay: function(newDay) {
      if (typeof newDay !== "number") {
        console.log("trying to set day to a non number value!");
        return;
      }
      day = newDay;
    },

    resetDay: function() {
      day = startDay;
    }
  }
}());

export default days;