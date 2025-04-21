const ftp = require('ftp');
const fs = require('fs');

const ftpOptions = {
  host: '92.113.18.144',
  user: 'u993113834',
  password: 'Mahxoud@000',
};

function uploadToFtp(file, folder = '/domains/express-elmadina.com/public_html/Pets_images') {
  return new Promise((resolve, reject) => {
    const filePath = file.path;
    const fileName = Date.now() + '-' + file.originalname;
    const client = new ftp();

    client.on('ready', () => {
      client.mkdir(folder, true, (mkdirErr) => {
        if (mkdirErr) {
          client.end();
          return reject(mkdirErr);
        }

        client.put(filePath, `${folder}/${fileName}`, (putErr) => {
          client.end();
          fs.unlinkSync(filePath); // delete temp file

          if (putErr) {
            return reject(putErr);
          }

          const imageUrl = `https://express-elmadina.com/Pets_images/${fileName}`;
          resolve(imageUrl); // ✅ return only the URL
        });
      });
    });

    client.on('error', (err) => reject(err));
    client.connect(ftpOptions);
  });
}

module.exports = uploadToFtp;
// module.exports = uploadToFtp; // Export the function for use in other files