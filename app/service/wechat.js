const Service = require('egg').Service;
const sha1 = require('sha1');
// const redis = require("redis");
// const client = redis.createClient();

module.exports = class WeChatService extends Service {
    index() {
        let ctx = this.ctx,
            { request } = ctx;
        console.log(request.query)
        return '123'
    }

    sign() {
        let ctx = this.ctx,
            { signature, timestamp, nonce, echostr } = ctx.query,
            { token } = this.config.wechat;
        /* 
        1）将token、timestamp、nonce三个参数进行字典序排序 
        2）将三个参数字符串拼接成一个字符串进行sha1加密 
        3）开发者获得加密后的字符串可与signature对比，标识该请求来源于微信 
        */
        let sha = sha1([token, timestamp, nonce].sort().join(''));
        if (sha === signature) {
            console.log('sign wechat successfully, echostr is:', echostr)
            return echostr;
        } else {
            return 'err';
        }
    }
}
