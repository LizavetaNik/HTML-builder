const fs = require('fs');
const path = require('path');

const filesFolderPath = path.join(__dirname, 'files');
const filesCopyFolderPath = path.join(__dirname, 'files-copy');

function copyDir() {
  // Проверяем, существует ли папка files-copy, и создаем ее, если нужно
  fs.access(filesCopyFolderPath, (err) => {
    if (err) {
      fs.mkdir(filesCopyFolderPath, { recursive: true }, (err) => {
        if (err) {
          console.error(err);
          return;
        }
        //console.log('Created files');
      });
    }
  });

  // Читаем содержимое папки files-copy
  fs.readdir(filesCopyFolderPath, (err, files) => {
    if (err) {
      console.error(err);
      return;
    }

    // Удаляем каждый файл в папке files-copy
    files.forEach((file) => {
      const filePath = path.join(filesCopyFolderPath, file);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(err);
        } 
        //else {
          //console.log('File deleted');
        //}
      });
    });

  });

  // Читаем содержимое папки files
  fs.readdir(filesFolderPath, (err, files) => {
    if (err) {
      console.error(err);
      return;
    }

    // Копируем файлы из папки files в папку files-copy
    files.forEach((file) => {
      const sourceFilePath = path.join(filesFolderPath, file);
      const destFilePath = path.join(filesCopyFolderPath, file);

      fs.copyFile(sourceFilePath, destFilePath, (err) => {
        if (err) {
          console.error(err);
        } 
        //else {
        //  console.log('File copied');
        //}
      });
    });
  }); 
}

// Вызываем функцию для копирования директории
copyDir();







