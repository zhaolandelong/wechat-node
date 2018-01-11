'use strict';

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1515640646196_3059';

  // add your config here
  config.middleware = [];

  config.wechat = {
    token: 'zldl',
    appid: 'wxc04ca1666d781d0a',
    secret: '83622e71883e541ab78dee42e4163c8e',
    encodingAESKey: '',
    prefix: 'https://api.weixin.qq.com/cgi-bin'
  };
  config.redis = {
    client: {
      port: 6379,          // Redis port 
      host: '127.0.0.1',   // Redis host 
      password: 'auth',
      db: 0,
    }
  };
  return config;
};
