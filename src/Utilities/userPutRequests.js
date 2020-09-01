const userPutRequests = (function(){
  return {
    makeRequest: async function(putRoute, putBody) {
      let subBody = {};
      for ( let [ key, value ] of putBody) {
        subBody[key] = value
      }

      subBody = JSON.stringify(subBody)

      const putRes = fetch(`/${putRoute}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: subBody
      });

      return putRes;
    }
  }
}());

export default userPutRequests;