const fs = require('fs');
const path = require('path');
const process = require('process');
const output = fs.createWriteStream(path.join(__dirname, 'test.txt'));
const { stdin, stdout } = process;

stdout.write('Для завершения программы используйте Ctrl+C. \n');
stdout.write('Введите текст: \n');

stdin.on('data', data => {
  if(data.toString().replace(/\s/g, '') === 'exit'){
    console.log('Программа завершена');
    process.exit();
  }else{
    stdout.write('Введите текст: \n');
    output.write(data);
  }
});

process.stdin.resume();
process.on('SIGINT', () => {
    console.log('Программа завершена');
    process.exit();
});