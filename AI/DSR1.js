// const InferenceClient = require("@huggingface/inference");

// const client = new InferenceClient("");

// const chatCompletion = async () => await client.chatCompletion({
//     provider: "novita",
//     model: "deepseek-ai/DeepSeek-R1-0528",
//     messages: [
//         {
//             role: "user",
//             content: "What is the capital of France?",
//         },
//     ],
// });

// console.log(chatCompletion.choices[0].message);

// const InferenceClient = require("@huggingface/inference");

// const client = new InferenceClient("");

// const chatCompletion = async () => {
//     return await client.chatCompletion({
//         provider: "novita",
//         model: "deepseek-ai/DeepSeek-R1-0528",
//         messages: [
//             {
//                 role: "user",
//                 content: "What is the capital of France?",
//             },
//         ],
//     });
// };

// (async () => {
//     try {
//         const response = await chatCompletion();
//         console.log(response.choices[0].message);
//     } catch (err) {
//         console.error("Error:", err);
//     }
// })();

// const { HfInference } = require('@huggingface/inference');

// const client = new HfInference("");

// (async () => {
//     const response = await client.chatCompletion({
//         model: "deepseek-ai/DeepSeek-R1-0528",
//         messages: [
//             {
//                 role: "user",
//                 content: "What is the capital of France? answer in arabic",
//             },
//         ],
//     });

//     console.log(response.choices[0].message.content);
// })();
// const fetch = require('node-fetch');
// const fs = require('fs');
// const path = require('path');
// async function query(data) {
// 	const response = await fetch(
// 		"https://router.huggingface.co/replicate/v1/models/black-forest-labs/flux-dev/predictions",
// 		{
// 			headers: {
// 				Authorization: `Bearer `,
// 				"Content-Type": "application/json",
// 			},
// 			method: "POST",
// 			body: JSON.stringify(data),
// 		}
// 	);
// 	const result = await response.blob();
// 	return result;
// }


// query({     input: {
//         prompt: "\"Astronaut riding a horse\"",
//     }, }).then(async (response) => {
//       const arrayBuffer = await response.arrayBuffer();
// 	const buffer = Buffer.from(arrayBuffer);

// 	// Save to file
// 	const filePath = path.join(__dirname, 'output-image.png');
// 	fs.writeFileSync(filePath, buffer);
// 	console.log(`Image saved to ${filePath}`);
// }).catch(console.error);

// const fetch = require('node-fetch');
// const fs = require('fs');

// async function query(data) {
// 	const response = await fetch(
// 		"https://router.huggingface.co/replicate/v1/models/black-forest-labs/flux-dev/predictions",
// 		{
// 			headers: {
// 				Authorization: `Bearer `,
// 				"Content-Type": "application/json",
// 			},
// 			method: "POST",
// 			body: JSON.stringify(data),
// 		}
// 	);
// 	const result = await response.blob();
// 	return result;
// }

// query({
// 	input: {
// 		prompt: "Astronaut riding a horse",
// 	},
// }).then((blob) => {
// 	// Save blob to a file
// 	const fileStream = fs.createWriteStream("output.jpg");
// 	blob.stream().pipe(fileStream);
// 	fileStream.on("finish", () => {
// 		console.log("Image saved to output.jpg");
// 	});
// }).catch((err) => {
// 	console.error("Error fetching image:", err);
// });
