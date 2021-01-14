const fetcher = (function(){
  return {
    fetchRoute: async function(routeName) {
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