const $ = new Env('七彩虹商城签到');
const qicaishop = ($.isNode() ? JSON.parse(process.env.qicaishop) : $.getjson("qicaishop")) || [];
let Utils = undefined;
let notice = '';

(async () => {
    if (typeof $request !== "undefined") {
        await getCookie();
    } else {
        await main();
    }
})().catch((e) => {
    $.log(e);
}).finally(() => {
    $.done({});
});

async function main() {
    console.log('七彩虹商城签到开始');
    Utils = await loadUtils();
    for (const item of qicaishop) {
        const authorization = item.authorization;
        console.log(`开始签到，authorization: ${authorization}`);
        
        // 签到接口
        let sign = await commonPost('https://shopapi.skycolorful.com/api/User/Sign', {}, authorization);
        console.log(`签到结果: ${JSON.stringify(sign)}`);
        if (sign.statusCode === 200) {
            console.log('签到成功');
            notice += '签到成功\n';
        } else {
            console.log('签到失败:', sign.msg);
            notice += `签到失败: ${sign.msg}\n`;
        }
    }

    sendMsg(notice);
}

async function getCookie() {
    const authorization = $request.headers['Authorization'];
    if (!authorization) {
        console.log('未找到Authorization头部');
        return;
    }
    const newData = { "authorization": authorization };
    const index = qicaishop.findIndex(e => e.authorization === newData.authorization);
    if (index !== -1) {
        if (qicaishop[index].authorization === newData.authorization) {
            console.log('Authorization未改变');
            return;
        } else {
            qicaishop[index] = newData;
            console.log('更新authorization:', newData.authorization);
            $.msg($.name, '更新authorization成功!', '');
        }
    } else {
        qicaishop.push(newData);
        console.log('新增authorization:', newData.authorization);
        $.msg($.name, '新增authorization成功!', '');
    }
    $.setjson(qicaishop, "qicaishop");
}

async function commonPost(url, body, authorization) {
    return new Promise(resolve => {
        const options = {
            url: url,
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'User-from': 'xcx',
                'Connection': 'keep-alive',
                'version': '2.0.0',
                'Accept-Encoding': 'gzip,compress,br,deflate',
                'Sign': '951e84bb82ebb2e9bf89902371ffe897',
                'AppSecret': 'MmI1YzAxZmItNzY0MC00MDFhLTgxODgtNDNhMTMxOTBhNjI2',
                'source': 'Wx',
                'requestId': '8dcfaa08-2371-410a-bab2-f21ab941afb3',
                'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.49(0x18003131) NetType/4G Language/zh_CN',
                'Authorization': authorization,
                'AppId': '815d8026-9a52-4445-a42c-a5443134232e',
                'X-Authorization': authorization,
                'Host': 'shopapi.skycolorful.com',
                'Referer': 'https://servicewechat.com/wx49018277e65fc3e1/58/page-frame.html',
                'Ticks': '1722048050849',
                'UcSource': '30'
            },
            body: JSON.stringify(body)
        };
        $.post(options, async (err, resp, data) => {
            try {
                if (err) {
                    console.log(`API请求失败: ${JSON.stringify(err)}`);
                    console.log(`${$.name} API请求失败，请检查网络重试`);
                } else {
                    await $.wait(2000);
                    resolve(JSON.parse(data));
                }
            } catch (e) {
                $.logErr(e, resp);
                resolve();
            }
        });
    });
}

async function loadUtils() {
    // Simulate loading external utilities if needed
    return {};
}

function sendMsg(message) {
    if (!message) return;
    try {
        if ($.isNode()) {
            let notify;
            try {
                notify = require('./sendNotify');
            } catch (e) {
                notify = require('./utils/sendNotify');
            }
            notify.sendNotify($.name, message);
        } else {
            $.msg($.name, '', message);
        }
    } catch (e) {
        $.log(`\n\n-----${$.name}-----\n${message}`);
    }
}

// Env class and related methods remain the same
// Load utilities function (dummy implementation)
async function loadUtils() {
    // Simulate loading external utilities if needed
    return {};
}
