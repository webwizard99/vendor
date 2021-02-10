const tagProcessor = (function(){
  const tags = {
    nameStart: '%name%',
    nameEnd: '$endname%',
    statusStart: '%status%',
    statusEnd: '%statusend%'
  }

  // const tagArray = Object.values(tags);
  // const tagKeys = Object.keys(tags);

  // const tagifyStringArray = function(strArr) {
  //   let found = false;
  //   let tagIndex = 0;
  //   let stringIndex = 0;
  //   const tagTerminate = tagArray.length -1;
  //   while (!found) {
  //     found = true;
  //     const thisTag = tagArray[tagIndex];
  //     let thisString = strArr[stringIndex];
  //     if (thisString.find(thisTag)) {
  //       let tagLocation = thisString.indexOf(thisTag);
  //       if (tagLocation === 0) {

  //       }
  //     }
  //   }
  // }

  return {
    getTags: function() {
      return tags;
    },
    // processString: function(str) {
    //   let arrTag = [str];
    //   const taggedArray = tagifyString(arrTag);
    //   return taggedArray;
    // }
  }
}());

export default tagProcessor;