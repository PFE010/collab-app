  function printCallback(result) {
    console.log(result)
  }

  function convertDate(date) {
    return date.slice(0, 19).replace('T', ' ');
  }
  
  module.exports = {
    printCallback,
    convertDate
  }