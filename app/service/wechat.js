const Service = require('egg').Service;
const sha1 = require('sha1');
// const redis = require("redis");
// const client = redis.createClient();

module.exports = class WeChatService extends Service {
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
            return echostr;
        } else {
            return 'err';
        }
    }

    async getToken() {
        let { redis } = this.app;
        let token = await this.app.redis.get('wechat_token');
        if (!token) {
            let { appid, secret, prefix } = this.config.wechat;
            let { data } = await this.ctx.curl(`${prefix}/token`, {
                data: {
                    grant_type: 'client_credential',
                    appid,
                    secret,
                },
                dataType: 'json',
            });
            if (!data.errcode) {
                //应该用定时任务，暂时先用过期时间开发
                token = data.access_token;
                await this.app.redis.set('wechat_token', token, 'EX', 7000);
            } else {
                //没获取到
            }
            return token;
        }
    }
}
