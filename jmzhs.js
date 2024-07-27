const $ = new Env('九木杂物社签到');
const jiumu = ($.isNode() ? JSON.parse(process.env.jiumu || '[]') : $.getjson("jiumu", []));
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
    console.log('九木杂物社签到开始');
    console.log('jiumu:', JSON.stringify(jiumu)); // 打印 jiumu 的内容
    Utils = await loadUtils();
    if (!Array.isArray(jiumu) || jiumu.length === 0) {
        console.log('jiumu 不是一个数组或为空');
        return;
    }
    for (const item of jiumu) {
        const authorization = item.authorization;
        console.log(`开始签到，authorization: ${authorization}`);
        
        // 签到接口
        let sign = await commonPost('https://openapi.jmzawushe.com/member/signRecord/signTable', {}, authorization);
        console.log(`签到结果: ${JSON.stringify(sign)}`);
        if (sign.code === "200") {
            console.log('签到成功');
            notice += '签到成功\n';
        } else {
            console.log('签到失败:', sign.message);
            notice += `签到失败: ${sign.message}\n`;
        }
    }

    sendMsg(notice);
}

async function getCookie() {
    console.log('开始获取Cookie');
    const authorization = $request.headers['Authorization'];
    if (!authorization) {
        console.log('未找到Authorization头部');
        return;
    }
    const newData = { "authorization": authorization };
    console.log('新Cookie:', newData); // 打印新的 Cookie
    const index = jiumu.findIndex(e => e.authorization === newData.authorization);
    if (index !== -1) {
        if (jiumu[index].authorization === newData.authorization) {
            console.log('Authorization未改变');
            return;
        } else {
            jiumu[index] = newData;
            console.log('更新authorization:', newData.authorization);
            $.msg($.name, '更新authorization成功!', '');
        }
    } else {
        jiumu.push(newData);
        console.log('新增authorization:', newData.authorization);
        $.msg($.name, '新增authorization成功!', '');
    }
    $.setjson(jiumu, "jiumu");
    console.log('更新后的jiumu:', JSON.stringify(jiumu)); // 打印更新后的 jiumu
}

async function commonPost(url, body, authorization) {
    return new Promise(resolve => {
        const options = {
            url: url,
            headers: {
                'content-type': 'application/json',
                'x-ext-channel': 'x-9m-mini-185153153726',
                'Connection': 'keep-alive',
                'x-timestamp': '1722043734329',
                'Accept-Encoding': 'gzip,compress,br,deflate',
                'merchantId': '406',
                'behavior': '{"traceId":"","traceShopId":"","buyerUserId":14742886,"iccMemStoreCode":""}',
                'x-sign': 'a07fad2e64b3a0ff75d90a09e910487d',
                'x-req-uid': '14742886',
                'requestId': '66fcb0a68e72684b5f8a3c0818e9aeac',
                'x-mini-version': '1.5.3',
                'Authorization': authorization,
                'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.49(0x18003131) NetType/4G Language/zh_CN',
                'Host': 'openapi.jmzawushe.com',
                'Referer': 'https://servicewechat.com/wxd7a0e27393123a5d/279/page-frame.html'
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

function jsonToQueryString(t = {}) {
    return Object.keys(t).sort().map(e => `${encodeURIComponent(e)}=${encodeURIComponent(t[e])}`).join("&");
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
