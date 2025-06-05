// For browser: you can run this in the browser console
// For Node.js: install node-fetch first using `npm install node-fetch`

// Use this only in Node.js environment
import fetch from 'node-fetch';

const apiUrl = 'http://localhost:5000/predict';

const testData = {
  "AnimalName": 5,
  "symptoms1": 68,
  "symptoms2": 159,
  "symptoms3": 23,
  "symptoms4": 94,
  "symptoms5": 155
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
