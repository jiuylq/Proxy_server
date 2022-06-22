module.exports = {
  port: 8094,
  proxy: {
    '/api': {
      target: 'http://cashier-v4.debug.packertec.com',
      // ws: true,
      changOrigin: true,
      // pathRewrite: {
      //   '/api': '/'
      // }
    }
  }  
}