const express = require('express');
const multer = require('multer');
const ftp = require('ftp');
const cors = require('cors');

const app = express();
app.use(cors());

const upload = multer({ dest: 'uploads/' });

const ftpOptions = {
  host: '92.113.18.144',
  user: 'u993113834',
  password: 'Mahxoud@000',
};

// Upload route
app.post('/upload', upload.single('image'), (req, res) => {
  const filePath = req.file.path;
  const fileName = Date.now() + '-' + req.file.originalname;
  const client = new ftp();

  client.on('ready', () => {
    console.log('FTP Connection Successful');

      client.put(filePath, `/domains/express-elmadina.com/public_html/Pets_images/${fileName}`, async (err) => {
        client.end();
        if (err) {
          console.error('FTP Upload Error:', err);
          return res.status(500).json({ message: 'FTP Upload Failed', error: err });
        }

        const imageUrl = `https://express-elmadina.com/Pets_images/${fileName}`;
        console.log("image uploaded successfully:", imageUrl);
      
      });
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