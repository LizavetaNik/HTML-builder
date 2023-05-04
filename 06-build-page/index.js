const fs = require('fs');
const path = require('path');

// Создаем папку project-dist
const projectDistFolderPath = path.join(__dirname, 'project-dist');

fs.access(projectDistFolderPath, (err) => {
  if (err) {
    return fs.mkdir(projectDistFolderPath, (err) => {
      if (err) {
        console.error(`Error: ${err.message}`);
      } else {
        console.log(`Folder ${projectDistFolderPath} created.`);
      }
    });
  } else {
    console.log(`Folder ${projectDistFolderPath} already exists.`);
  }
});

// Создаем файл .css
const stylesFolderPath = path.join(__dirname, 'styles');
const bundleFilePath = path.join(projectDistFolderPath, 'style.css');

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

// Копируем папку assets
const filesFolderPath = path.join(__dirname, 'assets');
const filesCopyFolderPath = path.join(projectDistFolderPath, 'assets');

// Рекурсивно копирует содержимое директории sourceDirPath в destDirPath
function copyDirRecursive(sourceDirPath, destDirPath) {
  fs.mkdir(destDirPath, { recursive: true }, (err) => {
    if (err) {
      console.error(err);
      return;
    }
  
    fs.readdir(sourceDirPath, { withFileTypes: true }, (err, files) => {
      if (err) {
        console.error(err);
        return;
      }
  
      files.forEach((file) => {
        const sourceFilePath = path.join(sourceDirPath, file.name);
        const destFilePath = path.join(destDirPath, file.name);
  
        if (file.isDirectory()) {
          copyDirRecursive(sourceFilePath, destFilePath);
        } else {
          fs.copyFile(sourceFilePath, destFilePath, (err) => {
            if (err) {
              console.error(err);
            }
          });
        }
      });
    });
  });
}
  
// Использование:
copyDirRecursive(filesFolderPath, filesCopyFolderPath);

// Создаем файл index.html
const componentsFolderPath = path.join(__dirname, 'components');
const templateFilePath = path.join(__dirname, 'template.html');
const indexFilePath = path.join(__dirname, 'project-dist', 'index.html');

// Читаем содержимое файла template.html
fs.promises.readFile(templateFilePath, 'utf-8')
  .then((templateHtml) => {
    // Находим все шаблонные теги вида {{componentName}}
    const regex = /\{\{([^\}]+)\}\}/g;
    const templateTags = templateHtml.match(regex);

    // Проходимся по каждому шаблонному тегу и заменяем его на HTML-код компонента
    Promise.all(templateTags.map((tag) => {
      const componentName = tag.slice(2, -2);
      const componentFilePath = path.join(componentsFolderPath, componentName + '.html');

      // Читаем HTML-код компонента и заменяем шаблонный тег на него
      return fs.promises.readFile(componentFilePath, 'utf-8')
        .then((componentHtml) => {
          return { tag, componentHtml };
        });
    }))
      .then((replacements) => {
        // Заменяем шаблонные теги на HTML-код компонентов в содержимом файла
        let newHtml = templateHtml;
        replacements.forEach(({ tag, componentHtml }) => {
          newHtml = newHtml.replace(tag, componentHtml);
        });

        // Сохраняем полученный HTML-код в файл index.html
        return fs.promises.writeFile(indexFilePath, newHtml, 'utf-8');
      })
      .then(() => {
        console.log('File saved successfully');
      })
      .catch((err) => {
        console.error('Error while saving file', err);
      });
  })
  .catch((err) => {
    console.error('Error while reading file', err);
});