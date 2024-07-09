/**************************************
@Name：四川观察小程序签到 签到 
@Author：
@Date：2024-7-9
====================================
⚠️【免责声明】
------------------------------------------
1、此脚本仅用于学习研究，不保证其合法性、准确性、有效性，请根据情况自行判断，本人对此不承担任何保证责任。
2、由于此脚本仅用于学习研究，您必须在下载后 24 小时内将所有内容从您的计算机或手机或任何存储设备中完全删除，若违反规定引起任何事件本人对此均不负责。
3、请勿将此脚本用于任何商业或非法目的，若违反规定请自行对此负责。
4、此脚本涉及应用与本人无关，本人对因此引起的任何隐私泄漏或其他后果不承担任何责任。
5、本人对任何脚本引发的问题概不负责，包括但不限于由脚本错误引起的任何损失和损害。
6、如果任何单位或个人认为此脚本可能涉嫌侵犯其权利，应及时通知并提供身份证明，所有权证明，我们将在收到认证文件确认后删除此脚本。
7、所有直接或间接使用、查看此脚本的人均应该仔细阅读此声明。本人保留随时更改或补充此声明的权利。一旦您使用或复制了此脚本，即视为您已接受此免责声明。
******************************************/
const $ = new Env('四川观察');
const scgchc = ($.isNode() ? JSON.parse(process.env.scgchc) : $.getjson("scgchc")) || [];
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
    console.log('四川观察开始');
    Utils = await loadUtils();
    for (const item of scgchc) {
        const authorization = item.authorization;
        console.log(`开始签到，authorization: ${authorization}`);
        let sign = await commonPost('https://gw.scgchc.com/app/v1/mall/user/getSignInfo', {}, authorization);
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
    const index = scgchc.findIndex(e => e.authorization == newData.authorization);
    if (index !== -1) {
        if (scgchc[index].authorization == newData.authorization) {
            console.log('Authorization未改变');
            return;
        } else {
            scgchc[index] = newData;
            console.log('更新authorization:', newData.authorization);
            $.msg($.name, '更新authorization成功!', '');
        }
    } else {
        scgchc.push(newData);
        console.log('新增authorization:', newData.authorization);
        $.msg($.name, '新增authorization成功!', '');
    }
    $.setjson(scgchc, "scgchc");
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

//
function getEnv(...keys){for(let key of keys){var value=$.isNode()?process.env[key]||process.env[key.toUpperCase()]||process.env[key.toLowerCase()]||$.getdata(key):$.getdata(key);if(value)return value;}};

//
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,a)=>{s.call(this,t,(t,s,r)=>{t?a(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.encoding="utf-8",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}getEnv(){return"undefined"!=typeof $environment&&$environment["surge-version"]?"Surge":"undefined"!=typeof $environment&&$environment["stash-version"]?"Stash":"undefined"!=typeof module&&module.exports?"Node.js":"undefined"!=typeof $task?"Quantumult X":"undefined"!=typeof $loon?"Loon":"undefined"!=typeof $rocket?"Shadowrocket":void 0}isNode(){return"Node.js"===this.getEnv()}isQuanX(){return"Quantumult X"===this.getEnv()}isSurge(){return"Surge"===this.getEnv()}isLoon(){return"Loon"===this.getEnv()}isShadowrocket(){return"Shadowrocket"===this.getEnv()}isStash(){return"Stash"===this.getEnv()}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const a=this.getdata(t);if(a)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,a)=>e(a))})}runScript(t,e){return new Promise(s=>{let a=this.getdata("@chavy_boxjs_userCfgs.httpapi");a=a?a.replace(/\n/g,"").trim():a;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[i,o]=a.split("@"),n={url:`http://${o}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":i,Accept:"*/*
