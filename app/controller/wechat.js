const Controller = require('egg').Controller;

class WeChatContoller extends Controller {
    sign() {
        this.ctx.body = this.ctx.service.wechat.sign();
    }
}

module.exports = WeChatContoller;