const fs = require('fs');
const path = require('path');
const readline = require("readline");

/**
 * @description 延时器
 * @param {Number} time
 */
const sleep = time => {
  return new Promise(resolve => setTimeout(resolve, time));
};

/**
 * @description 读取目录
 * @param {Srring} dir
 */
const resolvedir = function (dir) {
  return path.join(__dirname, '..', dir)
}

 /**
  * @description 监听目录文件变化
  * @param {String} dir
  * @param {Object} opts
  * @param {Function} callback
  */
 const watch = function (dir, opts, callback) {
  fs.watch(dir, opts, (eventType, filename) => {
    callback&&callback(eventType, filename);
  });
};
/**
 * @description 监听文件变化
 * @param {String} path
 * @param {Object} opts
 * @param {Function} callback
 */
const watchFile = function (path, opts, callback) {
  fs.watchFile(path, opts, (curr, prev) => {
    callback&&callback(curr, prev)
  });
};

/**
 * @description 创建文件目录
 * @param {Object} filePath './test/aa/cc.txt'
 * @param {Boolean} write default=true
 */
const mkdir = function (filePath, write=true) {
 const dirCache={}
 const pathArr=filePath.split('/');
 let dir=pathArr[0];
 for(let i=1;i<pathArr.length;i++){
   if(!dirCache[dir]&&!fs.existsSync(dir)){
     dirCache[dir]=true;
     fs.mkdirSync(dir);
   }
   dir=dir+'/'+pathArr[i];
 }
 if(write) { // 不进行文件写入，仅仅创建目录
  fs.writeFileSync(filePath, '') 
 }
}
 
 // const dirCache={};
 // writeFileByUser('./data/17/1017.md');

/**
 * @description 追加数据到文件中
 * @param {String} filePath
 * @param {Object} data
 * @param {String} type
 */
const appendFile = function (filePath, data, type="utf8") {
  if (fs.existsSync(filePath)) {
    // console.log('该路径已存在');
  }else{
    // console.log('该路径不存在');
    mkdir(filePath);
  }
  fs.appendFile(filePath, data, type, function(err){  
    if(err)  {
       console.log(err);  
    } else {
       // console.log('appendFile 成功了')
    }
  })
}
 
/**
 * @description 文件大小格式转换
 * @param {Number} size
 * @return {String}
 */
 const fileFormatSize = function (size) {
 	var i
 	var unit = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
 	for (i = 0; i < unit.length && size >= 1024; i++) {
 		size /= 1024
 	}
 	return (Math.round(size * 100) / 100 || 0) + unit[i]
 }

/**
 * @description 流的方式读取文件
 * @param {String} filename
 * @param {Number} lines
 * @param {Function} callback
 */
const createReadStream = function (filename, size=0, callback) {
  let chunk = '';
  // size = Math.max(0, fs.statSync(filename).size);
  let fd = fs.createReadStream(filename, {start : size});
  fd.on('data', function(data) { chunk += data.toString(); });
  fd.on('end', function() {
    callback(chunk);
  });
};

/**
 * @description 逐行读取文件流
 * @param {String} __dirname
 * @param {String} name
 * @param {Function} callback
 */
const readlineStream = function(__dirname, name, callback) {
  const readlineTask = readline.createInterface({
    input: fs.createReadStream(path.join(__dirname, '/'+name)),
  });

  readlineTask.on('line', function(chunk) {
    // 读取每一行数据
    callback(chunk)
  });

  readlineTask.on('close', function() {
    /**
     * 
     */
    //文件读取结束的逻辑
  })
}

/**
 * @description 同步写入文件
 * @param {String} name
 * @param {Object} data
 * @param {Object} opts
 */
const writeFileSync = function(name, data, opts={}) {
  fs.writeFileSync(name, data, opts);
}

 module.exports = {
   sleep: sleep,
   resolvedir: resolvedir,
   watch: watch,
   watchFile: watchFile,
   mkdir: mkdir,
   appendFile: appendFile,
   createReadStream: createReadStream,
   writeFileSync: writeFileSync,
 }
 
 
// fs.Stats 对象提供了关于文件的信息。
// fs.accessSync(path[, mode]) // 测试用户对 path 指定的文件或目录的权限
// fs.accessSync('etc/passwd', fs.constants.R_OK | fs.constants.W_OK);
// 追加数据到文件，如果文件尚不存在则创建文件。 data 可以是字符串或 Buffer
// fs.appendFileSync(path, data[, options])
// 创建目录
// fs.mkdirSync(path[, options])
// fs.copyFileSync(src, dest[, mode])
// fs.rename(oldPath, newPath, callback)
// fs.rmdirSync(path[, options])
// fs.watchFile(filename[, options], listener)
// fs.writeFileSync(file, data[, options])
// fs.readFileSync(new URL('file:///C:/文件'));
// fs.dir.readSync(path)
 
 
// // child.js
// function computedTotal(arr, cb) {
//     // 耗时计算任务
// }

// // 与主进程通信
// // 监听主进程信号
// process.on('message', (msg) => {
//   computedTotal(bigDataArr, (flag) => {
//     // 向主进程发送完成信号
//     process.send(flag);
//   })
// });

// // main.js
// const { fork } = require('child_process');

// app.use(async (ctx, next) => {
//   if(ctx.url === '/fetch') {
//     const data = ctx.request.body;
//     // 通知子进程开始执行任务,并传入数据
//     const res = await createPromisefork('./child.js', data)
//   }
  
//   // 创建异步线程
//   function createPromisefork(childUrl, data) {
//     // 加载子进程
//     const res = fork(childUrl)
//     // 通知子进程开始work
//     data && res.send(data)
//     return new Promise(reslove => {
//         res.on('message', f => {
//             reslove(f)
//         })
//     })  
//   }
  
//   await next()
// })
 