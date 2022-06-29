const http = require('http')
const httpProxy = require('http-proxy');
const express = require('express');
const history = require('connect-history-api-fallback'); // vue history解决
const fs = require('fs');
const path = require('path')
const url = require('url');

const utils = require('./utils/index.js');

const { v4: uuidv4 } = require('uuid');

const config = require('./settings/config.js');

let proxyBase = Object.keys(config.proxy)[0]

const app = express();


function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

//这句代码需要在express.static上面
app.use(history());

let dataLog = {}

// 设置静态资源目录
app.use(express.static(path.join(__dirname, 'public'))) // 默认目录为'/'
app.use('/static', express.static(path.join(__dirname, 'public')))

const proxy = httpProxy.createProxyServer();
const proxy91 = httpProxy.createProxyServer();


// 代理出错回调
proxy.on('error', function(e) {
  console.log('err', e)
});

proxy.on('proxyReq', function(proxyReq, req, res, options) {
  // let params = []
  // req.on('data', chunk => {
  //   params.push(chunk)
  // });
  // req.on('end', () => {
  //   console.log('params:'+ params.toString())
  // })
});
proxy.on('proxyRes', async function(proxyRes, req, res) {
  let uid = req.headers.uid
  const response = await utils.getParams(proxyRes);
  dataLog[uid] += 'response: ' + response.toString() + "\n";
});

http.createServer(function(req, res) {
  proxy.web(req, res, {
    target: config.proxy[proxyBase].target, // tree
    // secure: true,
    changeOrigin: config.proxy[proxyBase].changOrigin
  });
}).on('request', function(req,res) {

}).listen(7000);

// http.createServer(function(req, res) {
//     res.writeHead(200, {'Content-Type': 'application/json'});
//     // res.end(JSON.stringify(req.body, null, 2))
//     // const data = {"code": 0, "data": {"order_list": [{"out_trade_no": "20201024105820484233917", "pay_time": "2020-10-24 10:58:20", "trade_type": "CONSUME", "trade_type_verbose": "消费", "total_fee": [4], "create_time": "2020-10-24 10:58:20", "food_list": []}, {"out_trade_no": "20201024105446394672166", "pay_time": "2020-10-24 10:54:46", "trade_type": "CONSUME", "trade_type_verbose": "消费", "total_fee": [3], "create_time": "2020-10-24 10:54:46", "food_list": []}, {"out_trade_no": "2020101611215076012054640", "pay_time": "2020-10-16 11:21:50", "trade_type": "CONSUME", "trade_type_verbose": "消费", "total_fee": [6], "create_time": "2020-10-16 11:21:50", "food_list": []}, {"out_trade_no": "2020092410010022630379923", "pay_time": "2020-09-24 10:01:00", "trade_type": "CONSUME", "trade_type_verbose": "消费", "total_fee": [2], "create_time": "2020-09-24 10:01:00", "food_list": []}, {"out_trade_no": "", "pay_time": "2020-09-23 10:23:47", "trade_type": "WECHAT_RECHARGE", "trade_type_verbose": "微信充值", "total_fee": [1], "create_time": "2020-09-23 10:23:47", "food_list": []}, {"out_trade_no": "", "pay_time": "2020-08-17 14:13:55", "trade_type": "OPEN", "trade_type_verbose": "开户", "total_fee": 1900, "create_time": "2020-08-17 14:13:55", "food_list": []}]}}
//     const data = {
//       code: 0,
//       msg: '获取code失败，code已过期',
//       data: {
//         url:'http://127.0.0.1:8081/static/img/company_logo.799e03a.png',
//         phone: '232323we',
//         mobile: 13251478541
//       }
//     }
//     utils.sleep(500).then(()=> {
//       res.end(JSON.stringify(data))
//     })
    
// }).listen(8096);

// 设置跨域访问
app.all("*", function (req, res, next) {
  //设置允许跨域的域名，*代表允许任意域名跨域
  res.header("Access-Control-Allow-Origin", "*");
  //允许的header类型
  res.header("Access-Control-Allow-Headers", "*"); // "Origin, X-Requested-With, Content-Type, Accept"
  //跨域允许的请求方式
  res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
  //修改程序信息与版本
  // res.header('X-Powered-By', ' 3.2.1');
  //内容类型
  // res.header('Content-Type', 'application/json;charset=utf-8');

  if (req.method.toLowerCase() == "options") res.send(200);
  //让options尝试请求快速结束
  else next();
});

app.use(proxyBase, async function(req, res, next) {
  let uid = uuidv4();
  dataLog[uid] = ''
  const parsedUrl = url.parse(req.url)
  dataLog[uid] += "\n"+"==========================================================="+"\n\n"
  dataLog[uid] += "time: "+ utils.parseTime(new Date())+"\n";
  dataLog[uid] += 'url: ' + parsedUrl.path + "\n"
  dataLog[uid] += 'method: ' + req.method + "\n"
  dataLog[uid] += 'protocol: ' + req.protocol + "\n"
  dataLog[uid] += 'headers: ' + JSON.stringify(req.headers) + "\n"
  
  // const pathname = path.join(__dirname, parsedUrl.pathname)
  // req.session = 'test'
  res.setHeader('proxy','true');
  // res.setHeader('uid', uid);
  req.headers.uid = uid
  req.headers.proxy = 'true'
  // req.headers.protocol = req.protocol;
  let url_91 = 'http://127.0.0.1:7000' + proxyBase
  if (config.proxy[proxyBase].pathRewrite) {
    let rewriteKey = Object.keys(config.proxy[proxyBase].pathRewrite)[0]
    if (rewriteKey) {
      let reg = new RegExp(rewriteKey)
      url_91 = url_91.replace(reg, config.proxy[proxyBase].pathRewrite[rewriteKey])
    }
  }
  console.log('url_91', url_91)
  proxy91.web(req, res, {
    target: url_91,
    // secure: true,
    changeOrigin: config.proxy[proxyBase].changOrigin,
  });
  let params = []
  req.on('data', chunk => {
    params.push(chunk)
  });
  req.on('end', () => {
    try{
      dataLog[uid] += 'params: ' + params.toString() + "\n"
    }catch(e){
      //TODO handle the exception
    }
    
  })
  res.on('finish', (data) =>{
    utils.appendFile("./logs/proxy_log_"+utils.parseTime(new Date(), '{y}-{m}-{d}')+".log", dataLog[uid]) // utils.parseTime(new Date(), '{y}-{m}-{d}')+".log"
    delete dataLog[uid]
  })
});



app.listen(config.port);