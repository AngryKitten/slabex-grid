let baseUrl = 'http://localhost';

let hitTheDatabase = (formValues) => {
  fetch(`${baseUrl}:3030/api/send-variables`, {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify({
      minRowHeight: formValues[0],
      maxRowSpan: formValues[1],
      numColumns: formValues[2],
      gutter: formValues[3],
      prefix: formValues[4]
    })
  }).then(() => {
    window.location = './download';
  });
}

let isNumber = (item) => {
  return item.match(/^[0-9]+$/);
}

let download = () => {
  let prefixValue = document.getElementById('prefix').value;
  let formValues = [
    document.getElementById('min-row-height').value,
    document.getElementById('max-row-span').value,
    document.getElementById('num-columns').value,
    document.getElementById('gutter').value
  ];
  if (prefixValue !== '') {
    prefixValue += '-';
  }
  for (let i = 0; i < formValues.length; i++) {
    if (formValues[i] !== '') {
      if (!isNumber(formValues[i])) {
        console.error(formValues[i] + ' is not a valid integer');
        return false;
      }
    } else {
      formValues[i] = 0;
    }
  }
  formValues.push(prefixValue);
  hitTheDatabase(formValues);
}