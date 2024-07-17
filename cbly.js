const $ = new Env('臭宝乐园签到');
const cbxyuan = ($.isNode() ? JSON.parse(process.env.cbxyuan) : $.getjson("cbxyuan")) || [];
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
    $.done({}); // Complete the script
});

async function main() {
    console.log('臭宝乐园签到开始');
    for (const item of cbxyuan) {
        const authorization = item.authorization;
        console.log(`开始签到，authorization: ${authorization}`);

        // 签到接口
        let sign = await commonPost('https://cbxcx.weinian.com.cn/wnuser/v1/memberUser/daySign', {}, authorization);
        console.log(`签到结果: ${JSON.stringify(sign)}`);

        if (sign && sign.status === 200) {
            let message = sign.msg || '签到成功';

            // 获取用户详细信息
            let userInfo = await getUserInfo(authorization);
            let userDetails = '';
            if (userInfo && userInfo.status === 200) {
                let data = userInfo.data;
                userDetails = `用户: ${data.nickName || '未知'}, 总签到次数: ${data.totalSignNum || 0}, 当前积分: ${data.points || 0}`;
            } else {
                userDetails = '无法获取用户信息';
            }

            console.log('签到成功');
            notice += `签到成功: ${message}\n${userDetails}\n`;
        } else {
            let errorMessage = sign && sign.msg ? sign.msg : '无详细错误信息';
            console.log('签到失败:', errorMessage);
            notice += `签到失败: ${errorMessage}\n`;
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
    const index = cbxyuan.findIndex(e => e.authorization === newData.authorization);
    if (index !== -1) {
        if (cbxyuan[index].authorization === newData.authorization) {
            console.log('Authorization未改变');
            return;
        } else {
            cbxyuan[index] = newData;
            console.log('更新authorization:', newData.authorization);
            $.msg($.name, '更新authorization成功!', '');
        }
    } else {
        cbxyuan.push(newData);
        console.log('新增authorization:', newData.authorization);
        $.msg($.name, '新增authorization成功!', '');
    }
    $.setjson(cbxyuan, "cbxyuan");
}

async function commonPost(url, body, authorization) {
    return new Promise(resolve => {
        const options = {
            url: url,
            headers: {
                'Accept-Encoding': 'gzip,compress,br,deflate',
                'Content-Type': 'application/json',
                'Authorization': authorization,
                'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.50(0x18003231) NetType/4G Language/zh_CN'
            },
            body: JSON.stringify(body)
        };
        $.post(options, async (err, resp, data) => {
            try {
                if (err) {
                    console.log(`API请求失败: ${JSON.stringify(err)}`);
                    console.log(`${$.name} API请求失败，请检查网络重试`);
                    resolve({ status: 500, msg: '请求失败' });
                } else {
                    await $.wait(2000);
                    resolve(JSON.parse(data));
                }
            } catch (e) {
                $.logErr(e, resp);
                resolve({ status: 500, msg: '解析响应失败' });
            }
        });
    });
}

async function getUserInfo(authorization) {
    return new Promise(resolve => {
        const options = {
            url: 'https://cbxcx.weinian.com.cn/wnuser/v1/memberUser/getMemberUser',
            headers: {
                'Accept-Encoding': 'gzip,compress,br,deflate',
                'Content-Type': 'application/json',
                'Authorization': authorization,
                'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.50(0x18003231) NetType/4G Language/zh_CN'
            }
        };
        $.get(options, async (err, resp, data) => {
            try {
                if (err) {
                    console.log(`用户信息请求失败: ${JSON.stringify(err)}`);
                    resolve({ status: 500, msg: '请求失败' });
                } else {
                    await $.wait(2000);
                    resolve(JSON.parse(data));
                }
            } catch (e) {
                $.logErr(e, resp);
                resolve({ status: 500, msg: '解析响应失败' });
            }
        });
    });
}

function sendMsg(message) {
    // Implement your messaging function here
    $.msg($.name, '签到结果', message);
}
