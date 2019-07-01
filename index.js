const fs = require('fs');
const path = require('path');
const readline = require('readline');
const chalk = require('chalk');
const rule = require('./rule');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '-> ',
});

const text = rule.text;
const ignoreDir = rule.ignoreDir;
const ignoreFile = rule.ignoreFile;
const notcopy = rule.notcopy;

console.log(chalk.green('输入路径，可以是文件或者文件夹。'), '（输入', chalk.yellow('exit'),'退出操作）', chalk.gray('建议：直接将文件或者文件夹拖入命令窗口'));
rl.prompt();

rl.on('line', function(line) {

  if(line.trim() === 'exit'){
    console.log(chalk.green('bye bye'));
    process.exit(0);
  }else{
    //以同步的方法检测目录是否存在。
    const b = fs.existsSync(line);
    if(b){
      if(/^win/.test(process.platform)){
        initWin(line);
      }else{
        initMac(line);
      }
      console.log(chalk.green('处理完成'));
      process.exit(0);
    }else{
      console.log(chalk.red('error'), '路径不正确，请重新输入');
      rl.prompt();
    }
  }
});

const initMac = (line) => {

}

const initWin = (line) => {
  const stats = fs.statSync(line);
  const isFile = stats.isFile(); // 是文件
  const isDir = stats.isDirectory(); // 是文件夹

  const newPathArr = line.split('\\');
  const lastName = newPathArr.pop();
  if (!lastName) {
    lastName = newPathArr.pop();
  }

  if(isFile){
    let extname = path.extname(line); // 后缀名
    const newPath = newPathArr.join('\\') + '\\';

    dealFile(line, newPath + lastName.split('.')[0] + '2replace' + extname);
  }

  if(isDir){
    // 根据输入的文件地址，在同级目录创建新的文件夹 
    newPathArr.push(lastName + '2replace');
    const newPath = newPathArr.join('\\');
    const isExists = fs.existsSync(newPath);
    if (!isExists) {
      fs.mkdir(newPath, function(err) {
        if (err) {
          console.error(err);
        }
      });
    }
    dealFolder(line, newPath);
  }
}

/**
 * 处理文件
 * @return {[type]} [description]
 */
const dealFile = (filePath, newFilePath, isIgnoreDir = false) => {
  console.log('Building ' + filePath)

  let extname = path.extname(filePath); // 后缀名
  let isIgnore = ignoreFile.some(v => extname === v);

  // 判断是否进行匹配操作
  if (!isIgnore && !isIgnoreDir) {
    let content = fs.readFileSync(filePath, 'utf-8');
    content = replaceRule(content);
    fs.writeFileSync(newFilePath, content, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log('Finished ' + newFilePath);
      }
    });
  } else {
    fs.copyFileSync(filePath, newFilePath);
  }
}

/**
 * 处理文件夹
 * @return {[type]} [description]
 */
const dealFolder = (folderPath, newFolderPath, isIgnoreDir = false) => {
  const files = fs.readdirSync(folderPath); 
  files.forEach((filename) => {
    let filedir = path.join(folderPath, filename);
    let newName = replaceRule(filename)
    let newPath = path.join(newFolderPath, newName); // 对获取的文件名进行修改
    // 根据文件路径获取文件信息，返回一个fs.Stats对象
    const stats = fs.statSync(filedir);
    const isFile = stats.isFile(); //是文件
    const isDir = stats.isDirectory(); //是文件夹


    if (isFile) {
      dealFile(filedir, newPath, isIgnoreDir);
    }
    // 如果是文件夹，则在新目录内创建文件夹
    if (isDir) {
      let isNotcopy = notcopy.some(v => filename === v);
      if (!isNotcopy) {
        // 判断文件夹是否存在，不存在则创建
        let isExists = fs.existsSync(newPath);
        if (!isExists) {
          fs.mkdir(newPath, function(err) {
            if (err) {
              console.error(err);
            }
          });
        }
        let isIgnore = ignoreDir.some(v => filename === v);
        dealFolder(filedir, newPath, isIgnoreDir || isIgnore); //递归，如果是文件夹，就继续遍历该文件夹下面的文件
      }
    }
  });
}

const replaceRule = (string) => {
  text.forEach(v => {
    string = string.replace(RegExp(v[0], "g"), v[1])
  })
  return string;
}
