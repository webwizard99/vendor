const fetcher = (function(){
  return {
    fetchRoute: function(routeName) {
      let response;
      try {
        response = await fetch(`/${routeName}`);
      } catch (err) {
        console.log(err);
      }
      if (response) {
        response = response.json();
      }
      return response;
    }
  }
}());

export default fetcher;