const fs = require('fs');
const path = require('path');

const secretFolderPath = path.join(__dirname, 'secret-folder');

fs.readdir(secretFolderPath, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }

  const fileNames = files.filter((fileName) => {
    const filePath = path.join(secretFolderPath, fileName);
    return new Promise((resolve, reject) => {
      fs.stat(filePath, (err, stats) => {
        if (err) {
          reject(err);
        } else {
          resolve(stats.isFile());
        }
      });
    });
  });

  Promise.all(fileNames).then((fileNames) => {
    fileNames.forEach((isFile, index) => {
      if (isFile) {
        const fileName = files[index];
        const filePath = path.join(secretFolderPath, fileName);
        const { ext, name } = path.parse(filePath);
        fs.stat(filePath, (err, stats) => {
          if (err) {
            console.error(err);
          } else {
            const size = stats.size;
            if( size != 0 ){
              const sizeKb = (size/1024).toFixed(3);
              const extName = ext.slice(1);
              console.log(`${name} - ${extName} - ${sizeKb} kb`);
            }
            
          }
        });
      }
    });
  }).catch((err) => {
    console.error(err);
  });
});



