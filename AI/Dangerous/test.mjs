// For browser: you can run this in the browser console
// For Node.js: install node-fetch first using `npm install node-fetch`

// Use this only in Node.js environment
import fetch from 'node-fetch';

const apiUrl = 'http://localhost:5003/predict';

const testData = {
    "AnimalName":"Dog",
    "symptoms1":"Fever",
    "symptoms2":"Diarrhea",
    "symptoms3":"Vomiting",
    "symptoms4":"Weight loss",
    "symptoms5":"Dehydration"
};

fetch(apiUrl, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(testData)
})
  .then(response => response.json())
  .then(data => {
    console.log('Prediction:', data.prediction);
  })
  .catch(error => {
    console.error('Error:', error);
  });
