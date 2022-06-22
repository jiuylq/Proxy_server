const fsUtils = require('./fsUtils.js');

module.exports = {
  ...fsUtils,
  /**
   * @description getParams 获取请求参数
   * @param {Object} req
   * @param {Object} callback
   */
  getParams: function(req, callback) {
    let data = []
    let strData = ''
    // req.setEncoding('utf8');
    return new Promise((resolve, reject) => {
      req.on('data', chunk => {
        // data=data.toString('utf-8');
        // data.push(chunk)
        strData += chunk.toString();
      });
      req.on('end', () => {
        callback&&callback(strData)
        resolve(strData)
      })
    })
  },
  /**
   * @description paramsToJSON 格式化参数，例如：xx=11&oo=22
   * @param {Object} params
   */
  paramsToJSON: function (params) {
    const obj = {}
    const reg = /([^?&=]+)=([^?&=]*)/g
    params.replace(reg, (rs, $1, $2) => {
      const name = decodeURIComponent($1)
      let val = decodeURIComponent($2)
      val = String(val)
      obj[name] = val
      return rs
    })
    return obj
  },
  /**
   * @description toUrlQuery
   * @param {Object} json
   */
  toUrlQuery: function (json) {
    if (!json) return ''
    return cleanArray(
      Object.keys(json).map(key => {
        if (json[key] === undefined) return ''
        return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
      })
    ).join('&')
  },
  /**
   * @param {Object} date
   * @param {Object} fmt
   */
  dateFormat: function(date, fmt) {
    var o = {
      "M+": date.getMonth() + 1, //月份   
      "d+": date.getDate(), //日   
      "h+": date.getHours(), //小时   
      "m+": date.getMinutes(), //分   
      "s+": date.getSeconds(), //秒   
      "q+": Math.floor((date.getMonth() + 3) / 3), //季度   
      "S": date.getMilliseconds() //毫秒   
    };
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt))
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  },
  /**
   * @param {Object} time
   * @param {Object} cFormat
   */
  parseTime: function (time, cFormat) {
    if (arguments.length === 0 || !time) {
      return null
    }
    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
    let date
    if (typeof time === 'object') {
      date = time
    } else {
      if ((typeof time === 'string')) {
        if ((/^[0-9]+$/.test(time))) {
          // support "1548221490638"
          time = parseInt(time)
        } else {
          // support safari
          // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
          time = time.replace(new RegExp(/-/gm), '/')
        }
      }
  
      if ((typeof time === 'number') && (time.toString().length === 10)) {
        time = time * 1000
      }
      date = new Date(time)
    }
    const formatObj = {
      y: date.getFullYear(),
      m: date.getMonth() + 1,
      d: date.getDate(),
      h: date.getHours(),
      i: date.getMinutes(),
      s: date.getSeconds(),
      a: date.getDay()
    }
    const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
      const value = formatObj[key]
      // Note: getDay() returns 0 on Sunday
      if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
      return value.toString().padStart(2, '0')
    })
    return time_str
  },
  /**
   * @description sleep 延时函数
   * @param {Object} time
   */
  sleep: time => {
    return new Promise(resolve => setTimeout(resolve, time))
  }
}