const $ = new Env('雅迪星球');
const Yadea = ($.isNode() ? JSON.parse(process.env.Yadea) : $.getjson("Yadea")) || [];
let Utils = undefined;
let notice = '';

!(async () => {
    if (typeof $request != "undefined") {
        await getCookie();
    } else {
        await main();
    }
})().catch((e) => {$.log(e)}).finally(() => {$.done({});});

async function main() {
    console.log('雅迪星球开始\n频道感谢原作者大老师');
    Utils = await loadUtils();
    for (const item of Yadea) {
        const authorization = item.authorization;
        console.log(`开始签到，authorization: ${authorization}`);
        let sign = await commonPost('https://opmd.yadea.com.cn/api/miniprogram/custom-promotion/memberSign', {}, authorization);
        console.log(`签到结果: ${JSON.stringify(sign)}`);
        if (sign.code === 200) {
            console.log('签到成功');
            notice += '签到成功\n';
        } else {
            console.log('签到失败:', sign.msg);
            notice += `签到失败: ${sign.msg}\n`;
        }
    }
    if (notice) {
        $.msg($.name, '', notice);
    }
}

async function getCookie() {
    const authorization = $request.headers['Authorization'];
    if (!authorization) {
        console.log('未找到Authorization头部');
        return;
    }
    const newData = {"authorization": authorization};
    const index = Yadea.findIndex(e => e.authorization == newData.authorization);
    if (index !== -1) {
        if (Yadea[index].authorization == newData.authorization) {
            console.log('Authorization未改变');
            return;
        } else {
            Yadea[index] = newData;
            console.log('更新authorization:', newData.authorization);
            $.msg($.name, '更新authorization成功!', '');
        }
    } else {
        Yadea.push(newData);
        console.log('新增authorization:', newData.authorization);
        $.msg($.name, '新增authorization成功!', '');
    }
    $.setjson(Yadea, "Yadea");
}

async function commonPost(url, body, authorization) {
    return new Promise(resolve => {
        const options = {
            url: url,
            headers : {
                'content-type': 'application/json',
                'Authorization': authorization,
                'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.49(0x18003137) NetType/4G Language/zh_CN'
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
            } finally {
                resolve();
            }
        });
    });
}

async function loadUtils() {
    let code = ($.isNode() ? process.env.Utils_Code : $.getdata('Utils_Code')) || '';
    if (code && Object.keys(code).length) {
        console.log(`✅ ${$.name}: 缓存中存在Utils代码, 跳过下载`);
        eval(code);
        return creatUtils();
    }
    console.log(`🚀 ${$.name}: 开始下载Utils代码`);
    return new Promise(async (resolve) => {
        $.getScript(
            'https://cdn.jsdelivr.net/gh/xzxxn777/Surge@main/Utils/Utils.js'
        ).then((fn) => {
            $.setdata(fn, "Utils_Code");
            eval(fn);
            console.log(`✅ Utils加载成功, 请继续`);
            resolve(creatUtils());
        });
    });
}
