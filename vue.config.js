
module.exports = {
  devServer: {
    open: true,
    host: "dev.map.fadongxi.com", // nginx配置的域名
    port: 8091,
    https: false,
    hotOnly: false,
    proxy: {
      // 配置跨域
      "/api": {
        // 后端给的接口域名
        // target: "http://bi.open-ts.fadongxi.com", // 嘉诚老师
        // target: "http://dev.open.qufenqi.com/",   //林洁

        target: "http://dev.ds.open.fadongxi.com", //测试地址
        ws: true,
        changOrigin: true,

        // pathRewrite: {
        //   "^/api": "",
        // },
      },
    },
  },
  configureWebpack: (config)=>{
    if(process.env.NODE_ENV === 'production'){
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
    }
  }
};
