import days from './days';

const main = (function() {
  

  return {
    addDay: function() {
      const currentDay = days.getDay();
      days.setDay(currentDay + 1);
    }

  }
} ());

export default main;