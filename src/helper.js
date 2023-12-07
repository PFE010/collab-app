  function printCallback(result) {
    console.log(result)
  }

  function convertDate(date) {
    return date.slice(0, 19).replace('T', ' ');
  }

  function countLabels(data) {
    if (data) {
      const labelArray = data.split(',').map(label => label.trim());
      return labelArray.length === 1 ? 1 : labelArray.length;
    } else {
      return 0;
    }
  }
  

  function fromArrayToLabelString(labels) {
    // Assuming 'labels' is an array containing pull_request.labels
    if (!Array.isArray(labels)) {
        return ''; // Return an empty string if labels is not an array
    }

    // Map the labels to a new array with just the label names
    const labelNames = labels.map(label => label.name || label);

    // Join the label names array with ', ' to create the desired string format
    return labelNames.join(',');
}



  
function labelStringToList(labelString) {
  return labelString.split(',');
} 

  module.exports = {
    printCallback,
    convertDate,
    fromArrayToLabelString,
    countLabels,
    labelStringToList
  }