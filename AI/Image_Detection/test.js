const axios = require("axios");
const fs = require("fs");

const image = fs.readFileSync("X:\\dog.jpeg", {encoding: "base64"});

axios({
    method: "POST",
    url: "https://serverless.roboflow.com/dog-and-cat-face-detector/1",
    params: {api_key: "dS3RZmgNp1oZ62SCy7cJ"},
    data: image,
    headers: {"Content-Type": "application/x-www-form-urlencoded"}
})
.then(function(response) {
    console.log(response.data);
})
.catch(function(error) {
    console.log(error.message);
});