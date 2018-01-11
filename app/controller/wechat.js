const Controller = require('egg').Controller;

class WeChatContoller extends Controller {
    sign() {
        let ctx = this.ctx;
        ctx.service.wechat.getToken();
        ctx.body = 'ctx.service.wechat.sign()';
        // ctx.body = ctx.service.wechat.sign();
    }
}

module.exports = WeChatContoller;