'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get('/wechat', controller.wechat.sign);
  router.post('/wechat', controller.wechat.index);
};
