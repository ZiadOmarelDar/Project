const ftp = require('ftp');
const path = require('path');


 function uploadFileToFTP(localFilePath, originalName) {
  return new Promise((resolve, reject) => {
    const fileName = Date.now() + '-' + path.basename(originalName);
    const client = new ftp();

    client.on('ready', () => {
      console.log('FTP Connection Successful');

      const remotePath = `/domains/express-elmadina.com/public_html/Pets_images/${fileName}`;
      const readStream = fs.createReadStream(localFilePath);
      client.put(readStream, remotePath, (err) => {
        client.end();
        if (err) {
          console.error('FTP Upload Error:', err);
          return reject(err);
        }

        const imageUrl = `https://express-elmadina.com/Pets_images/${fileName}`;
        console.log('Image uploaded successfully:', imageUrl);
        resolve(imageUrl);
      });
    });

    client.on('error', (err) => {
      console.error('FTP Connection Error:', err);
      reject(err);
    });

    client.connect({
      host: '92.113.18.144',
      user: 'u993113834',
      password: 'Mahxoud@000',
    });
  });
}
module.exports = uploadFileToFTP;