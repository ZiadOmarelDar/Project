const express = require('express');
const multer = require('multer');
const ftp = require('ftp');
const fs = require('fs');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
  
const ImageSchema = new mongoose.Schema({
  url: String,
});

const Image = mongoose.model('Image', ImageSchema);

const upload = multer({ dest: 'uploads/' });

const ftpOptions = {
  host: '92.113.18.144',
  user: 'u993113834',
  password: 'Mahxoud@000',
};

// Upload route
app.post('/upload', upload.single('image'), (req, res) => {
  console.log("filePath", typeof req.file)
  if (!req.file) {
   console.log("errrorrrrrrrrrrrrrrrrrrrrrrrr") 
  }
  const filePath = req.file.path;
  const fileName = Date.now() + '-' + req.file.originalname;
  const client = new ftp();
  client.on('ready', () => {
    console.log('FTP Connection Successful');

    // cheack and create the directory
    // client.mkdir('/domains/express-elmadina.com/public_html/Pets_images', true, (err) => {
    //   if (err) {
    //     console.error('Error creating directory:', err);
    //     client.end();
    //     return res.status(500).json({ message: 'Directory creation failed', error: err });
    //   }

      client.put(filePath, `/domains/express-elmadina.com/public_html/Pets_images/${fileName}`, async (err) => {
        client.end();
        if (err) {
          console.error('FTP Upload Error:', err);
          return res.status(500).json({ message: 'FTP Upload Failed', error: err });
        }

        const imageUrl = `https://express-elmadina.com/Pets_images/${fileName}`;
        console.log("image uploaded successfully:", imageUrl);
        // save into the mongodb
        // const newImage = new Image({ url: imageUrl });
        // await newImage.save();
        // console.log('Image URL saved to MongoDB:', imageUrl);
        // res.status(200).json({ message: 'Uploaded Successfully', imageUrl });
      
      });
    // });
  });

  client.on('error', (err) => {
    console.error('FTP Connection Error:', err);
    res.status(500).json({ message: 'FTP Connection Error', error: err });
  });

  client.connect(ftpOptions);

  client.on('end', () => {
    console.log('FTP Connection Closed');
  });

});





app.listen(3003, () => {
  console.log('Server running on http://localhost:3003');
});