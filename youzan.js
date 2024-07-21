/****************************************
☆　　╱╲*╱╲　☆
 ╱╳+▲╱　　╲　☆
╱╱ ◢◣+　　╳╲ 
╱ +◢█◣　／　　╲☆
☆　◢██◣   Sakura 
 _▂▂█▂▂   Checkbox·2023.11.17
送给双十一仍然孤单的你～别让天气影响到心情哟!:|
------------------------------------------
使用教程：
------------------------------------------
Sakura Checkbox｜有赞小程序批量签到工具

该签到脚本适用于所有的有赞小程序签到，请勿宣传，低调使用！！！

1.将获取ck脚本拉取到本地
2.打开你要签到的有赞小程序，进入签到页面，若提示获取ck成功则可以使用改脚本
3.要签到多个小程序则依次打开签到页面获取ck
4.关闭获取ck脚本，避免产生不必要的mitm

脚本兼容：Surge、QuantumultX、Loon、Shadowrocket、Node.js
------------------------------------------
目前找到的有赞小程序
------------------------------------------
- 参半口腔护理
- 伯喜线上商城
- AchockHouse
- 海贽医疗科技
- INTOYOU心慕与你
- 蜜蜂惊喜社
- 红之旗舰店
- 花洛莉亚
- 且初
- 菲诗蔻官方商城
- 肤漾
- 且悠
- HBN研究所
- 珂拉琪旗舰店
- 爱依服有赞商城
- 莱克旗舰店
- PMPM
- LAN蘭
- 云南白药生活+
- ffit8会员俱乐部
- 朵茜情调生活馆
- xbox聚乐部
- 三只松鼠
- 松鲜鲜调味瓶旗舰店
- 燕京啤酒
- 贝因美贝家商城
- 得宝
------------------------------------------
脚本配置
------------------------------------------
Loon:
[Script]
cron "30 8 * * *" script-path=https://gist.githubusercontent.com/Sliverkiss/585daf69a0a6c7243db8993f5394a124/raw/youzan.js, timeout=300, tag=Sakura Checkbox
http-response https://h5.youzan.com/wscump/checkin/get_activity_by_yzuid_v2.json.+ script-path=https://gist.githubusercontent.com/Sliverkiss/585daf69a0a6c7243db8993f5394a124/raw/youzan.js, timeout=300, tag=Sakura Checkbox获取token

[MITM]
hostname =h5.youzan.com
------------------------------------------
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

// env.js 全局
const $ = new Env("🌸Sakura Checkbox");
const ckName = "youzan_data";
//-------------------- 一般不动变量区域 -------------------------------------
let userCookie = ($.isNode() ? process.env[ckName] : $.getdata(ckName)) || '';
//开启数据缓存
$.cache = ($.isNode() ?JSON.parse(process.env[`youzan_cache`]) : $.getjson(`youzan_cache`)) || {};
//通知相关
const Notify = 1;//0为关闭通知,1为打开通知,默认为1
const notify = $.isNode() ? require('./sendNotify') : '';
//调试
$.is_debug = ($.isNode() ? process.env.IS_DEDUG : $.getdata('is_debug')) || 'false';
// 为通知准备的空数组
$.notifyMsg = [];
//签到数组
const checkList = [];
//签到任务数量
let checkCount = 0;
//签到成功数组
let checkTrueList = [];
//签到失败数组
let checkFalseList = [];
//---------------------- 自定义变量区域 -----------------------------------
//主程序执行入口
!(async () => {
    //await getNotice();
    console.log(`\n☆　　╱╲*╱╲　☆
 ╱╳+▲╱　　╲　☆
╱╱ ◢◣+　　╳╲ 
╱ +◢█◣　／　　╲☆
☆　◢██◣   Sakura 
 _▂▂█▂▂   Checkbox·1.0.0 
送给双十一仍然孤单的你～别让天气影响到心情哟!:|\n`);
    //没有设置变量,执行Cookie获取
    if (typeof $request != "undefined" || typeof $response != "undefined") {
        await getCookie();
        return;
    }
    //未检测到ck，退出
    if (!(await checkEnv())) { throw new Error(`❌未检测到ck，请添加环境变量`) };
    if (checkList.length > 0) {
        await main();
    }
})()
    .catch((e) => $.notifyMsg.push(e.message || e))//捕获登录函数等抛出的异常, 并把原因添加到全局变量(通知)
    .finally(async () => {
        await SendMsg($.notifyMsg.join('\n'))//带上总结推送通知
        $.done(); //调用Surge、QX内部特有的函数, 用于退出脚本执行
    });

async function main() {
    if (checkList) {
        //打广告
        DoubleLog(`🥳签到日志已送达 by Sliverkiss!\n如果对你有帮助,给个⭐️Star吧!\n`);
        //执行签到任务
        for (let item of checkList) {
            //查询店铺
            if ($.cache[`${item.checkinId}`]) {
                //读取缓存
                debug($.cache,`读取店铺缓存信息`);
                item.shopName = $.cache[`${item.checkinId}`]
            } else {
                //调用接口，查询店铺名称
                await getHomepage(item);
            }
            //执行签到任务
            let signMsg = await signin(item);
            //查询积分
            if (signMsg) await point(signMsg, item);
        }
        //更新缓存数据
        $.setjson($.cache, `youzan_cache`);
    } else {
        DoubleLog(`❌获取数据授权失败!请联系作者进行处理。`)
    }
}

async function signin(item) {
    try {
        const options = {
            //签到任务调用签到接口
            url: `https://h5.youzan.com/wscump/checkin/checkinV2.json?checkinId=${item.checkinId}`,
            //请求头, 所有接口通用
            headers: {
                "Extra-Data": "{ \"is_weapp\": 1}",
                "Cookie": item.token,
                "User-Agent": " Mozilla/5.0 (iPhone; CPU iPhone OS 14_8 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.37(0x18002524) NetType/WIFI Language/zh_CN miniProgram/wx6b30ed1839d47d45",
                "Host": "h5.youzan.com",
            }
        };
        //post方法
        return new Promise(resolve => {
            $.get(options, async (error, response, data) => {
                try {
                    let result = JSON.parse(data);
                    debug(result, '签到')
                    let msg = '';
                    if (result?.code == 0) {
                        //obj.error是0代表完成
                        msg = `签到成功！获得${result?.data?.list[0]?.infos?.title}`;
                        checkTrueList.push(msg);
                    } else if (result?.code == "1000030071") {
                        msg = `今日已签到`
                        checkTrueList.push(msg);
                    } else {
                        DoubleLog(`【${item.shopName}】任务编号 ${item.checkinId} >> ❌Check ck error!`)
                        checkFalseList.push(msg);
                    }
                    resolve(msg);
                } catch (error) {
                    $.log(`❌出现错误！原因为:${error}`);
                    resolve();
                }
            });
        });
    } catch (e) {
        $.log(`❌出现错误！原因为:${e}`);
    }
}

//查询用户信息
async function point(msg, item) {
    try {
        const options = {
            //签到任务调用签到接口
            url: `https://h5.youzan.com/wscump/pointstore/getCustomerPoints.json`,
            //请求头, 所有接口通用
            headers: {
                "Extra-Data": "{ \"is_weapp\": 1}",
                "Cookie": item.token,
                "User-Agent": " Mozilla/5.0 (iPhone; CPU iPhone OS 14_8 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.37(0x18002524) NetType/WIFI Language/zh_CN miniProgram/wx6b30ed1839d47d45",
                "Host": "h5.youzan.com",
            },
        };
        return new Promise(resolve => {
            $.get(options, async (error, response, data) => {
                try {
                    let result = JSON.parse(data);
                    DoubleLog(`【${item.shopName}】任务编号 ${item.checkinId} :${msg},积分：${result?.data?.currentAmount}`)
                } catch (error) {
                    $.log(`❌出现错误！原因为:${error}`);
                } finally {
                    resolve();
                }
            });
        });
    } catch (e) {
        console.log(e);
    }
}

//获取签到店铺信息
async function getHomepage(item) {
    try {
        const options = {
            //签到任务调用签到接口
            url: `https://h5.youzan.com/wscdeco/homepage-detail.json`,
            //请求头, 所有接口通用
            headers: {
                "Extra-Data": "{ \"is_weapp\": 1}",
                "Cookie": item.token,
                "User-Agent": " Mozilla/5.0 (iPhone; CPU iPhone OS 14_8 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.37(0x18002524) NetType/WIFI Language/zh_CN miniProgram/wx6b30ed1839d47d45",
                "Host": "h5.youzan.com",
            },
        };
        return new Promise(resolve => {
            $.get(options, async (error, response, data) => {
                try {
                    let result = $.toObj(data) || data;
                    if (result?.data?.shopMetaInfo) {
                        //查询店铺名称，并写入缓存
                        item.shopName = result?.data?.shopMetaInfo?.shopName;
                        $.cache[`${item.checkinId}`] =item.shopName;
                        debug(result?.data?.shopMetaInfo, "获取店铺信息");
                    } else {
                        console.log(`❌获取店铺信息失败！`)
                    }
                    resolve(result?.accountList);
                } catch (error) {
                    $.log(error);
                    resolve();
                }
            });
        });
    } catch (e) {
        throw new Error(`❌运行错误，原因为：${e}`);
    }
}

//获取Cookie
async function getCookie() {
    if ($request && $request.method != 'OPTIONS') {
        let signUrl = $request.url;
        //获取任务编号
        var reg = /checkinId=([0-9]+)/g;
        const checkinId = reg.exec(signUrl)[1];
        //获取cookie
        let cookie = $response.headers['Set-Cookie'] || $response.headers['set-cookie'];
        const ckItems = cookie.match(/KDTWEAPPSESSIONID=.+?;/g);
        //对获取到的数据进行处理
        userCookie = $.toObj(userCookie);
        //如果ck不存在
        if (!userCookie) userCookie = {};
        //添加或更新变量
        if (checkinId && ckItems[0]) {
            userCookie[`${checkinId}`] = ckItems[0];
            $.setjson(userCookie, ckName);
            $.msg($.name, "", `🎉任务编号${checkinId} 更新cookie成功！`);
        } else {
            $.msg($.name, "", `❌${$name} 获取cookie失败！请检查配置是否正确`);
        }
    }
}
/** --------------------------------辅助函数区域------------------------------------------- */
// 双平台log输出
function DoubleLog(data) {
    if ($.isNode()) {
        if (data) {
            console.log(`${data}`);
            $.notifyMsg.push(`${data}`);
        }
    } else {
        console.log(`${data}`);
        $.notifyMsg.push(`${data}`);
    }
}

// DEBUG
function debug(text, title = 'debug') {
    if ($.is_debug === 'true') {
        if (typeof text == "string") {
            console.log(`\n-----------${title}------------\n`);
            console.log(text);
            console.log(`\n-----------${title}------------\n`);
        } else if (typeof text == "object") {
            console.log(`\n-----------${title}------------\n`);
            console.log($.toStr(text));
            console.log(`\n-----------${title}------------\n`);
        }
    }
}

// 发送消息
async function SendMsg(message) {
    if (!message) return;
    if (Notify > 0) {
        if ($.isNode()) {
            await notify.sendNotify($.name, message)
        } else {
            $.msg($.name, `共${checkCount}个签到任务 ✅成功${checkTrueList.length}个 ❌失败${checkFalseList.length}个`, message)
        }
    } else {
        console.log(message)
    }
}

//检查变量
async function checkEnv() {
    userCookie = JSON.parse(userCookie);
    //如果环境变量存在,遍历对象所有键值对，获取签到任务列表
    if (userCookie) {
        Object.keys(userCookie).forEach(key => {
            let item = { "checkinId": key, "token": userCookie[`${key}`] };
            checkList.push(item);
        })
        checkCount = checkList.length;
    } else {
        console.log("未找到CK");
        return;
    }
    return console.log(`共找到${checkCount}个签到任务`), true;//true == !0
}

/** ---------------------------------固定不动区域----------------------------------------- */
// prettier-ignore

//请求函数函数二次封装
function httpRequest(options, method) { typeof (method) === 'undefined' ? ('body' in options ? method = 'post' : method = 'get') : method = method; return new Promise((resolve) => { $[method](options, (err, resp, data) => { try { if (err) { console.log(`${method}请求失败`); $.logErr(err) } else { if (data) { typeof JSON.parse(data) == 'object' ? data = JSON.parse(data) : data = data; resolve(data) } else { console.log(`请求api返回数据为空，请检查自身原因`) } } } catch (e) { $.logErr(e, resp) } finally { resolve() } }) }) }
//Bark APP notify
async function BarkNotify(c, k, t, b) { for (let i = 0; i < 3; i++) { console.log(`🔷Bark notify >> Start push (${i + 1})`); const s = await new Promise((n) => { c.post({ url: 'https://api.day.app/push', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: t, body: b, device_key: k, ext_params: { group: t } }) }, (e, r, d) => r && r.status == 200 ? n(1) : n(d || e)) }); if (s === 1) { console.log('✅Push success!'); break } else { console.log(`❌Push failed! >> ${s.message || s}`) } } };
//From chavyleung's Env.js
function Env(t, e) { class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return "POST" === e && (s = this.post), new Promise((e, a) => { s.call(this, t, (t, s, r) => { t ? a(t) : e(s) }) }) } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.encoding = "utf-8", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`) } getEnv() { return "undefined" != typeof $environment && $environment["surge-version"] ? "Surge" : "undefined" != typeof $environment && $environment["stash-version"] ? "Stash" : "undefined" != typeof module && module.exports ? "Node.js" : "undefined" != typeof $task ? "Quantumult X" : "undefined" != typeof $loon ? "Loon" : "undefined" != typeof $rocket ? "Shadowrocket" : void 0 } isNode() { return "Node.js" === this.getEnv() } isQuanX() { return "Quantumult X" === this.getEnv() } isSurge() { return "Surge" === this.getEnv() } isLoon() { return "Loon" === this.getEnv() } isShadowrocket() { return "Shadowrocket" === this.getEnv() } isStash() { return "Stash" === this.getEnv() } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson(t, e) { let s = e; const a = this.getdata(t); if (a) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise(e => { this.get({ url: t }, (t, s, a) => e(a)) }) } runScript(t, e) { return new Promise(s => { let a = this.getdata("@chavy_boxjs_userCfgs.httpapi"); a = a ? a.replace(/\n/g, "").trim() : a; let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r; const [i, o] = a.split("@"), n = { url: `http://${o}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": i, Accept: "*/*" }, timeout: r }; this.post(n, (t, e, a) => s(a)) }).catch(t => this.logErr(t)) } loaddata() { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), a = !s && this.fs.existsSync(e); if (!s && !a) return {}; { const a = s ? t : e; try { return JSON.parse(this.fs.readFileSync(a)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), a = !s && this.fs.existsSync(e), r = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, r) : a ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r) } } lodash_get(t, e, s) { const a = e.replace(/\[(\d+)\]/g, ".$1").split("."); let r = t; for (const t of a) if (r = Object(r)[t], void 0 === r) return s; return r } lodash_set(t, e, s) { return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, a) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[a + 1]) >> 0 == +e[a + 1] ? [] : {}, t)[e[e.length - 1]] = s, t) } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, a] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ""; if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, a, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, a, r] = /^@(.*?)\.(.*?)$/.exec(e), i = this.getval(a), o = a ? "null" === i ? null : i || "{}" : "{}"; try { const e = JSON.parse(o); this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), a) } catch (e) { const i = {}; this.lodash_set(i, r, t), s = this.setval(JSON.stringify(i), a) } } else s = this.setval(t, e); return s } getval(t) { switch (this.getEnv()) { case "Surge": case "Loon": case "Stash": case "Shadowrocket": return $persistentStore.read(t); case "Quantumult X": return $prefs.valueForKey(t); case "Node.js": return this.data = this.loaddata(), this.data[t]; default: return this.data && this.data[t] || null } } setval(t, e) { switch (this.getEnv()) { case "Surge": case "Loon": case "Stash": case "Shadowrocket": return $persistentStore.write(t, e); case "Quantumult X": return $prefs.setValueForKey(t, e); case "Node.js": return this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0; default: return this.data && this.data[e] || null } } initGotEnv(t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get(t, e = (() => { })) { switch (t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"], delete t.headers["content-type"], delete t.headers["content-length"]), t.params && (t.url += "?" + this.queryStr(t.params)), this.getEnv()) { case "Surge": case "Loon": case "Stash": case "Shadowrocket": default: this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, a) => { !t && s && (s.body = a, s.statusCode = s.status ? s.status : s.statusCode, s.status = s.statusCode), e(t, s, a) }); break; case "Quantumult X": this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: a, headers: r, body: i, bodyBytes: o } = t; e(null, { status: s, statusCode: a, headers: r, body: i, bodyBytes: o }, i, o) }, t => e(t && t.error || "UndefinedError")); break; case "Node.js": let s = require("iconv-lite"); this.initGotEnv(t), this.got(t).on("redirect", (t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } }).then(t => { const { statusCode: a, statusCode: r, headers: i, rawBody: o } = t, n = s.decode(o, this.encoding); e(null, { status: a, statusCode: r, headers: i, rawBody: o, body: n }, n) }, t => { const { message: a, response: r } = t; e(a, r, r && s.decode(r.rawBody, this.encoding)) }) } } post(t, e = (() => { })) { const s = t.method ? t.method.toLocaleLowerCase() : "post"; switch (t.body && t.headers && !t.headers["Content-Type"] && !t.headers["content-type"] && (t.headers["content-type"] = "application/x-www-form-urlencoded"), t.headers && (delete t.headers["Content-Length"], delete t.headers["content-length"]), this.getEnv()) { case "Surge": case "Loon": case "Stash": case "Shadowrocket": default: this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient[s](t, (t, s, a) => { !t && s && (s.body = a, s.statusCode = s.status ? s.status : s.statusCode, s.status = s.statusCode), e(t, s, a) }); break; case "Quantumult X": t.method = s, this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: a, headers: r, body: i, bodyBytes: o } = t; e(null, { status: s, statusCode: a, headers: r, body: i, bodyBytes: o }, i, o) }, t => e(t && t.error || "UndefinedError")); break; case "Node.js": let a = require("iconv-lite"); this.initGotEnv(t); const { url: r, ...i } = t; this.got[s](r, i).then(t => { const { statusCode: s, statusCode: r, headers: i, rawBody: o } = t, n = a.decode(o, this.encoding); e(null, { status: s, statusCode: r, headers: i, rawBody: o, body: n }, n) }, t => { const { message: s, response: r } = t; e(s, r, r && a.decode(r.rawBody, this.encoding)) }) } } time(t, e = null) { const s = e ? new Date(e) : new Date; let a = { "M+": s.getMonth() + 1, "d+": s.getDate(), "H+": s.getHours(), "m+": s.getMinutes(), "s+": s.getSeconds(), "q+": Math.floor((s.getMonth() + 3) / 3), S: s.getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length))); for (let e in a) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? a[e] : ("00" + a[e]).substr(("" + a[e]).length))); return t } queryStr(t) { let e = ""; for (const s in t) { let a = t[s]; null != a && "" !== a && ("object" == typeof a && (a = JSON.stringify(a)), e += `${s}=${a}&`) } return e = e.substring(0, e.length - 1), e } msg(e = t, s = "", a = "", r) { const i = t => { switch (typeof t) { case void 0: return t; case "string": switch (this.getEnv()) { case "Surge": case "Stash": default: return { url: t }; case "Loon": case "Shadowrocket": return t; case "Quantumult X": return { "open-url": t }; case "Node.js": return }case "object": switch (this.getEnv()) { case "Surge": case "Stash": case "Shadowrocket": default: { let e = t.url || t.openUrl || t["open-url"]; return { url: e } } case "Loon": { let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"]; return { openUrl: e, mediaUrl: s } } case "Quantumult X": { let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl, a = t["update-pasteboard"] || t.updatePasteboard; return { "open-url": e, "media-url": s, "update-pasteboard": a } } case "Node.js": return }default: return } }; if (!this.isMute) switch (this.getEnv()) { case "Surge": case "Loon": case "Stash": case "Shadowrocket": default: $notification.post(e, s, a, i(r)); break; case "Quantumult X": $notify(e, s, a, i(r)); break; case "Node.js": }if (!this.isMuteLog) { let t = ["", "==============📣系统通知📣=============="]; t.push(e), s && t.push(s), a && t.push(a), console.log(t.join("\n")), this.logs = this.logs.concat(t) } } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr(t, e) { switch (this.getEnv()) { case "Surge": case "Loon": case "Stash": case "Shadowrocket": case "Quantumult X": default: this.log("", `❗️${this.name}, 错误!`, t); break; case "Node.js": this.log("", `❗️${this.name}, 错误!`, t.stack) } } wait(t) { return new Promise(e => setTimeout(e, t)) } done(t = {}) { const e = (new Date).getTime(), s = (e - this.startTime) / 1e3; switch (this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log(), this.getEnv()) { case "Surge": case "Loon": case "Stash": case "Shadowrocket": case "Quantumult X": default: $done(t); break; case "Node.js": process.exit(1) } } }(t, e) }
