const fs = require('fs');
const path = require('path');
const readline = require('readline');
const join = require('path').join;
const Bagpipe = require('bagpipe'); // 防止过载
let bagpipe = new Bagpipe(2);
const rule = require('./rule')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const text = rule.text;
const ignoreDir = rule.ignoreDir;
const ignoreFile = rule.ignoreFile;
const notcopy = rule.notcopy;

let newPath;

console.log('输入路径')
rl.on('line', function(line) {
  // 根据输入的文件地址，在同级目录创建新的文件夹
  let newPathArr = line.split('\\');
  let lastName = newPathArr.pop();
  if (!lastName) {
    lastName = newPathArr.pop();
  }
  newPathArr.push(lastName + '2replace');
  newPath = newPathArr.join('\\');

  let isExists = fs.existsSync(newPath);
  if (!isExists) {
    fs.mkdir(newPath, function(err) {
      if (err) {
        console.error(err);
      }
    });
  }
  readFile(line, newPath)
})

//文件遍历方法
function readFile(filePath, newPath, isIgnoreDir = false) {
  fs.readdir(filePath, function(err, files) {
    if (err) {
      console.warn(err)
    } else {
      //遍历读取到的文件列表
      files.forEach(function(filename) {
        //获取当前文件的绝对路径
        let filedir = path.join(filePath, filename);
        let newFilename = replaceRule(filename)
        let newFilePath = path.join(newPath, newFilename); // 对获取的文件名进行修改
        // 根据文件路径获取文件信息，返回一个fs.Stats对象
        fs.stat(filedir, function(eror, stats) {
          if (eror) {
            console.warn('获取文件stats失败');
          } else {
            let isFile = stats.isFile(); //是文件
            let isDir = stats.isDirectory(); //是文件夹
            console.log('Building ' + filedir)

            if (isFile) {
              let extname = path.extname(filedir); // 后缀名
              let isIgnore = ignoreFile.some(v => extname === v);

              // 判断是否进行匹配操作
              if (!isIgnore && !isIgnoreDir) {
                let content = fs.readFileSync(filedir, 'utf-8');
                content = replaceRule(content);
                fs.writeFile(newFilePath, content, (err) => {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log('Finished ' + newFilePath);
                  }
                });
              } else {

                // 防止过载
                bagpipe.push(function(filedir, newFilePath, callback) {
                  let readable = fs.createReadStream(filedir); //创建读取流
                  let writable = fs.createWriteStream(newFilePath); //创建写入流
                  readable.pipe(writable).on('close', function() {
                    callback(null);
                  });
                }, filedir, newFilePath, function(err) {
                  // 不会因为文件描述符过多出错
                  // 妥妥的
                });
                console.log('Finished ' + newFilePath)
              }

            }
            // 如果是文件夹，则在新目录内创建文件夹
            if (isDir) {
              let isNotcopy = notcopy.some(v => filename === v);

              if (!isNotcopy) {

                // 判断文件夹是否存在，不存在则创建
                let isExists = fs.existsSync(newFilePath);
                if (!isExists) {
                  fs.mkdir(newFilePath, function(err) {
                    if (err) {
                      console.error(err);
                    }
                  });
                }
                let isIgnoreDir = ignoreDir.some(v => filename === v);
                readFile(filedir, newFilePath); //递归，如果是文件夹，就继续遍历该文件夹下面的文件

              }

            }
          }
        })
      });
    }
  });
}

function replaceRule(string) {
  text.forEach(v => {
    string = string.replace(RegExp(v[0], "g"), v[1])
  })
  return string;
}