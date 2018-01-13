module.exports = app => {
    app.beforeStart(async () => {
        // 应用会等待这个函数执行完成才启动
        async function intervalGetToken() {
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
                await app.redis.set('wechat_token', data.access_token);
                console.log('update token successfully:', data)
            } else {
                //没获取到
                console.error('update token failed');
            }
        }
        await intervalGetToken();
        setInterval(intervalGetToken, 7000000);
    });
};