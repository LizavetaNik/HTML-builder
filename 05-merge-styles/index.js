const fs = require('fs');
const path = require('path');

const stylesFolderPath = path.join(__dirname, 'styles');
const projectDistFolderPath = path.join(__dirname, 'project-dist');
const bundleFilePath = path.join(projectDistFolderPath, 'bundle.css');

fs.readdir(stylesFolderPath, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }

  const cssFiles = files.filter((file) => path.extname(file) === '.css');

  let cssString = '';

  let filesLeftToRead = cssFiles.length;

  cssFiles.forEach((file) => {
    const cssFilePath = path.join(stylesFolderPath, file);

    fs.readFile(cssFilePath, 'utf-8', (err, cssContent) => {
      if (err) {
        console.error(err);
        return;
      }

      cssString += cssContent;

      filesLeftToRead--;

      if (filesLeftToRead === 0) {
        fs.writeFile(bundleFilePath, cssString, (err) => {
          if (err) {
            console.error(err);
            return;
          }
          //console.log('bundle.css created successfully');
        });
      }
    });
  });
});