module.exports = app => {
    app.beforeStart(async () => {
        // 应用会等待这个函数执行完成才启动
        console.log(app.redis.set)
        let { appid, secret, prefix } = app.config.wechat;
        let { data } = await app.curl(`${prefix}/token`, {
            method: 'GET',
            data: {
                grant_type: 'client_credential',
                appid,
                secret,
            },
            dataType: 'json',
        });
        if (!data.errcode) {
            //应该用定时任务，暂时先用过期时间开发
            // token = data.access_token;
            // await app.redis.set('wechat_token', token);
        } else {
            //没获取到
        }
        console.log(data)
    });
};