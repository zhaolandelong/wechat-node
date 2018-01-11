const express = require('express');
const router = express.Router();
const wechat = require('wechat');
const crypto = require('crypto');
const xml2js = require('xml2js');
const utils = require('../common/utils');
const wechatApi = require('../common/wechatApi');
const config = require('../config');

router.get('/', function (req, res, next) {
    res.render('weixin', { weChatList });
});
//获取,验证access_token,存入redis中  
router.use(function (req, res, next) {

    //根据token从redis中获取access_token  
    utils.get(config.wechat.token).then(function (data) {
        //获取到值--往下传递  
        if (data) {
            return Promise.resolve(data);
        }
        //没获取到值--从微信服务器端获取,并往下传递  
        else {
            return wechatApi.updateAccessToken();
        }
    }).then(function (data) {
        console.log(data);
        //没有expire_in值--此data是redis中获取到的  
        if (!data.expires_in) {
            console.log('redis获取到值');
            req.accessToken = data;
            next();
        }
        //有expire_in值--此data是微信端获取到的  
        else {
            console.log('redis中无值');
            /** 
             * 保存到redis中,由于微信的access_token是7200秒过期, 
             * 存到redis中的数据减少20秒,设置为7180秒过期 
             */
            utils.set(config.wechat.token, `${data.access_token}`, 7180).then(function (result) {
                if (result == 'OK') {
                    req.accessToken = data.access_token;
                    next();
                }
            })
        }

    })
})

const weChatList = [{
    project: '/supin',
    token: 'zldl',
    appSecret: '0804541dbc6e6b7e4cd66b6df49e5220',
    appID: 'wx1e33cbe5d78306e4'
}];

const config1 = {
    token: 'zldl',
    appid: 'wxc04ca1666d781d0a',
    appsecret: '83622e71883e541ab78dee42e4163c8e',
    encodingAESKey: ''
}
router.use(express.query());
router.use('/supin', wechat(config1, function (req, res, next) {
    console.log(req.weixin);
    var message = req.weixin;
    //文本  
    if (message.Content === '1') {
        res.reply('hehe');
    }else{
        res.reply('你发别的我就回这条');
    }

}))
// weChatList.forEach(wx => {
//     router.all(wx.project, function (req, res, next) {
//         // console.log(req)
//         let { signature, timestamp, nonce, echostr } = req.query;

//         /*  加密/校验流程如下： */
//         //1. 将token、timestamp、nonce三个参数进行字典序排序
//         let array = new Array(wx.token, timestamp, nonce);
//         array.sort();
//         let str = array.toString().replace(/,/g, "");
//         //2. 将三个参数字符串拼接成一个字符串进行sha1加密
//         let sha1Code = crypto.createHash("sha1");
//         let code = sha1Code.update(str, 'utf-8').digest("hex");
//         //3. 开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
//         if (code === signature) {
//             res.send(echostr)
//         } else {
//             res.send("error");
//         }
//     });
// });

module.exports = router;