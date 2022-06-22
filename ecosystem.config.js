module.exports = {
  apps : [{
    name: "proxy",
    script: "./index.js",
    watch: true,
    ignore_watch: ["node_modules", "logs", "public"],
    cwd: "./",
    env: {
      "NODE_ENV": "development",
    },
    env_production : {
       "NODE_ENV": "production"
    },
    error_file: "./logs/proxy-err.log",  // 错误日志路径
    out_file: "./logs/proxy-out.log",  // 普通日志路径
  }]
}