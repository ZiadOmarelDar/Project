const express = require('express');
const multer = require('multer');
const ftp = require('ftp');
const fs = require('fs');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb+srv://PetsCare:lDQ6GppZgrBKPZO2@cluster0.ifl5z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// MongoDB schema
const ImageSchema = new mongoose.Schema({
  url: String,
});
const Image = mongoose.model('Image', ImageSchema);

// Multer setup
const upload = multer({ dest: 'uploads/' });

// FTP connection options
const ftpOptions = {
  host: '92.113.18.144',   // replace with your FTP server address
  user: 'u993113834',      // replace with your FTP username
  password: 'Mahxoud@000',    // replace with your FTP password
};

// Upload route
app.post('/upload', upload.single('image'), (req, res) => {
  const filePath = req.file.path;
  const fileName = Date.now() + '-' + req.file.originalname;

  const client = new ftp();

  client.on('ready', () => {
    console.log('FTP Connection Successful');

    // Ensure the 'images' directory exists or create it
    client.mkdir('/domains/express-elmadina.com/public_html/images', true, (err) => {
      if (err) {
        console.error('Error creating directory:', err);
        client.end(); // Close FTP connection if there's an error
        return res.status(500).json({ message: 'Directory creation failed', error: err });
      }

      console.log('Directory created or already exists.');

      // Upload the image to the correct directory on the server
      client.put(filePath, `/domains/express-elmadina.com/public_html/images/${fileName}`, async (err) => {
        client.end(); // Close FTP connection

        if (err) {
          console.error('FTP Upload Error:', err);
          return res.status(500).json({ message: 'FTP Upload Failed', error: err });
        }

        // Optionally remove the local temporary file
        // fs.unlinkSync(filePath); 

        const imageUrl = `https://express-elmadina.com/images/${fileName}`;
        const newImage = new Image({ url: imageUrl });
        await newImage.save();
         console.log('Image URL saved to MongoDB:', imageUrl);
        res.status(200).json({ message: 'Uploaded Successfully', imageUrl });
      });
    });
  });

  client.on('error', (err) => {
    console.error('FTP Connection Error:', err);
    res.status(500).json({ message: 'FTP Connection Error', error: err });
  });

  client.connect(ftpOptions);
});

// Start Server
app.listen(3003, () => {
  console.log('Server running on http://localhost:3003');
});


