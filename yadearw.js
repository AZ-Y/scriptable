const $ = new Env("雅迪星球");
const _key = 'yadea_data';
$.huihui = $.toObj(getEnv(_key)) || {};
$.is_debug = 'true-';
$.messages = [];

async function main() {
    await tasks();
}

async function tasks() {
    const url = `https://opmd.yadea.com.cn/api/miniprogram/custom-promotion/memberSign`;
    const body = JSON.stringify({});  // 根据实际需求填写请求体
    const headers = {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.49(0x18003137) NetType/4G Language/zh_CN",
        "Authorization": $.huihui.token  // 使用你存储的 token
    };
    const {status, message} = await httpRequest({url, body, headers});
    pushMsg(status === 200 ? '请求成功' : message);
}

// 取 Authorization
function getCk() {
    if ($request && $request.method != 'OPTIONS') {
        const authorization = $request.headers['Authorization'];  // 从请求头中提取 Authorization
        if (authorization) {
            const ckVal = $.toStr({authorization});
            $.setdata(ckVal, _key);
            $.msg($.name, '', '获取授权数据成功🎉\n' + ckVal);
        } else {
            $.msg($.name, '', 'Authorization 头部未找到');
        }
    }
}

// 脚本执行入口
(async () => {
    if (typeof $request !== 'undefined') {
        await getCk();
    } else {
        await main();
    }
})().catch((e) => $.messages.push(e.message || e) && $.logErr(e))
    .finally(async () => {
        await sendMsg($.messages.join('\n').trimStart().trimEnd());  // 推送通知
        $.done();
    })

// 从 URL 中提取参数的函数
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    const results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
