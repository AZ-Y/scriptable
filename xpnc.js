/**
 * Quantumult X Script for 兴攀农场
 * Author: Mist (Modified for Quantumult X by Kimi)
 * Date: 2024-07-01
 */

const envName = 'xpnc'; // 环境变量名字
const env = $prefs.valueForKey(envName) || '';
const notify = 1; // 是否通知, 1通知, 0不通知. 默认通知
const debug = 0; // 是否调试, 1调试, 0不调试. 默认不调试
let msg = '';

// 脚本入口函数
async function main() {
    if (!env) {
        console.log(`没有填写变量,请查看脚本说明: ${envName}`);
        return;
    }
    const userCookies = env.split('\n');
    console.log(`\n========== 共找到 ${userCookies.length} 个账号 ==========`);
    for (let i = 0; i < userCookies.length; i++) {
        if (!userCookies[i]) continue;
        const user = {
            index: i + 1,
            authorization: userCookies[i],
        };
        await userTask(user);
        await wait(Math.floor(Math.random() * 4000) + 1000);
    }
    if (notify) {
        $notify('兴攀农场', '', msg);
    }
}

// 其他函数保持不变，只需要替换内部的API调用即可

// 网络请求函数
function httpRequest(options) {
    return new Promise((resolve) => {
        $httpClient[options.method](options, (err, resp, data) => {
            if (err) {
                console.log(JSON.stringify(err));
                resolve(null);
            } else {
                try {
                    data = JSON.parse(data);
                } catch (e) {
                    data = null;
                }
                resolve(data);
            }
        });
    });
}

// 等待 X 秒
function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// 双平台 log 输出
function doubleLog(data) {
    console.log(data);
    msg += `\n${data}`;
}

// 执行脚本
main().catch((e) => console.log(e));

// 账号任务
async function userTask(user) {
    console.log(`\n============= 账号[${user.index}]开始任务 =============`);
    await Sign(user);
    await wait(1);
    for (let i = 1; i < 17; i++) {
        await Task(user, i);
        await wait(1);
        await Reward(user, i);
        await wait(1);
    }
    await Fertilizer(user);
    await wait(1);
    for (let i = 0; i < 10; i++) {
        await Water(user);
        await wait(1);
    }
    await HomePage(user);
}

// 签到
async function Sign(user) {
    let urlObject = {
        url: `https://p.xpfarm.cn/treemp/user.PersonalCenter/addSignIn`,
        headers: {
            'Host': 'p.xpfarm.cn',
            'Content-Type': 'application/json',
            'authorization': user.authorization,
            'user-agent': 'Mozilla/5.0',
        },
        body: JSON.stringify({}),
    };
    let result = await httpRequest(urlObject);
    if (result?.code === '1000') {
        DoubleLog(`🌸账号[${user.index}]🕊签到成功-获得${result.data.reward.integral}积分🎉`);
    } else {
        DoubleLog(`🌸账号[${user.index}]签到-状态:${result.message}`);
    }
}

// 完成任务
async function Task(user, id) {
    let urlObject = {
        url: `https://p.xpfarm.cn/treemp/tree.Tasks/completeTask`,
        headers: {
            'Host': 'p.xpfarm.cn',
            'Content-Type': 'application/json',
            'authorization': user.authorization,
            'user-agent': 'Mozilla/5.0',
        },
        body: JSON.stringify({ "task_id": id }),
    };
    let result = await httpRequest(urlObject);
    if (result?.code === '1000') {
        console.log(`🌸账号[${user.index}]🕊任务${id}完成[${result.message}]🎉`);
    } else {
        console.log(`🌸账号[${user.index}]任务${id}完成状态:${result.message}`);
    }
}

// 领取奖励
async function Reward(user, id) {
    let urlObject = {
        url: `https://p.xpfarm.cn/treemp/tree.Tasks/receiveTaskReward`,
        headers: {
            'Host': 'p.xpfarm.cn',
            'Content-Type': 'application/json',
            'authorization': user.authorization,
            'user-agent': 'Mozilla/5.0',
        },
        body: JSON.stringify({ "task_id": id }),
    };
    let result = await httpRequest(urlObject);
    if (result?.code === '1000') {
        console.log(`🌸账号[${user.index}]🕊任务${id}领取[${result.message}],获得${result.data.reward[0].reward_type_name}${result.data.reward[0].reward}🎉`);
    } else {
        console.log(`🌸账号[${user.index}]任务${id}领取状态:${result.message}`);
    }
}

// 施肥
async function Fertilizer(user) {
    let urlObject = {
        url: `https://p.xpfarm.cn/treemp/tree.Tasks/addFertilizer`,
        headers: {
            'Host': 'p.xpfarm.cn',
            'Content-Type': 'application/json',
            'authorization': user.authorization,
            'user-agent': 'Mozilla/5.0',
        },
        body: JSON.stringify({ "type": 1 }),
    };
    let result = await httpRequest(urlObject);
    if (result?.code === '1000') {
        DoubleLog(`🌸账号[${user.index}]🕊施肥成功,总肥力${result.data.fertilizer}🎉`);
    } else {
        DoubleLog(`🌸账号[${user.index}]施肥状态:${result.message}`);
    }
}

// 浇水
async function Water(user) {
    let urlObject = {
        url: `https://p.xpfarm.cn/treemp/tree.Tasks/addWater`,
        headers: {
            'Host': 'p.xpfarm.cn',
            'Content-Type': 'application/json',
            'authorization': user.authorization,
            'user-agent': 'Mozilla/5.0',
        },
        body: JSON.stringify({}),
    };
    let result = await httpRequest(urlObject);
    if (result?.code === '1000') {
        console.log(`🌸账号[${user.index}]🕊浇水成功，剩余💧[${result.data.water_value} ]肥力[${result.data.fertilizer}]🎉`);
    } else {
        console.log(`🌸账号[${user.index}]浇水状态:${result.message}`);
    }
}

// 获取首页信息
async function HomePage(user) {
    let urlObject = {
        url: `https://p.xpfarm.cn/treemp/tree.Tasks/getHomePage`,
        headers: {
            'Host': 'p.xpfarm.cn',
            'Content-Type': 'application/json',
            'authorization': user.authorization,
            'user-agent': 'Mozilla/5.0',
        },
        body: JSON.stringify({}),
    };
    let result = await httpRequest(urlObject);
    if (result?.code === '1000') {
        DoubleLog(`🌸账号[${user.index}]🕊果树🌳当前状态[${result.data.type_name}]-进度[${result.data.growth_level}]-剩余肥力[${result.data.fertilizer}]-💧[${result.data.water_value}]🎉`);
    } else {
        DoubleLog(`🌸账号[${user.index}]查询🔍:${result.message}果树🌳当前状态[${result.data.type_name}]-进度[${result.data.growth_level}]-剩余肥力[${result.data.fertilizer}]-💧[${result.data.water_value}]`);
    }
}

// 网络请求函数
function httpRequest(options) {
    return new Promise((resolve) => {
        $httpClient.post(options, (err, resp, data) => {
            if (err) {
                console.log(JSON.stringify(err));
                resolve(null);
            } else {
                try {
                    data = JSON.parse(data);
                } catch (e) {
                    data = null;
                }
                resolve(data);
            }
        });
    });
}

// 双平台 log 输出
function DoubleLog(data) {
    console.log(data);
    msg += `${data}`;
}

// 等待 X 秒
function wait(n) {
    return new Promise((resolve) => setTimeout(resolve, n * 1000));
}


//===============================================================================================================================================
//================================================固定API===============================================================================================
function Env(t, e) { class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return ("POST" === e && (s = this.post), new Promise((e, a) => { s.call(this, t, (t, s, r) => { t ? a(t) : e(s) }) })) } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new (class { constructor(t, e) { this.userList = []; this.userIdx = 0; (this.name = t), (this.http = new s(this)), (this.data = null), (this.dataFile = "box.dat"), (this.logs = []), (this.isMute = !1), (this.isNeedRewrite = !1), (this.logSeparator = "\n"), (this.encoding = "utf-8"), (this.startTime = new Date().getTime()), Object.assign(this, e), this.log("", `🔔${this.name},开始!`) } getEnv() { return "undefined" != typeof $environment && $environment["surge-version"] ? "Surge" : "undefined" != typeof $environment && $environment["stash-version"] ? "Stash" : "undefined" != typeof module && module.exports ? "Node.js" : "undefined" != typeof $task ? "Quantumult X" : "undefined" != typeof $loon ? "Loon" : "undefined" != typeof $rocket ? "Shadowrocket" : void 0 } isNode() { return "Node.js" === this.getEnv() } isQuanX() { return "Quantumult X" === this.getEnv() } isSurge() { return "Surge" === this.getEnv() } isLoon() { return "Loon" === this.getEnv() } isShadowrocket() { return "Shadowrocket" === this.getEnv() } isStash() { return "Stash" === this.getEnv() } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson(t, e) { let s = e; const a = this.getdata(t); if (a) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise((e) => { this.get({ url: t }, (t, s, a) => e(a)) }) } runScript(t, e) { return new Promise((s) => { let a = this.getdata("@chavy_boxjs_userCfgs.httpapi"); a = a ? a.replace(/\n/g, "").trim() : a; let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); (r = r ? 1 * r : 20), (r = e && e.timeout ? e.timeout : r); const [i, o] = a.split("@"), n = { url: `http://${o}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": i, Accept: "*/*" }, timeout: r, }; this.post(n, (t, e, a) => s(a)) }).catch((t) => this.logErr(t)) } loaddata() { if (!this.isNode()) return {}; { (this.fs = this.fs ? this.fs : require("fs")), (this.path = this.path ? this.path : require("path")); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), a = !s && this.fs.existsSync(e); if (!s && !a) return {}; { const a = s ? t : e; try { return JSON.parse(this.fs.readFileSync(a)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { (this.fs = this.fs ? this.fs : require("fs")), (this.path = this.path ? this.path : require("path")); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), a = !s && this.fs.existsSync(e), r = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, r) : a ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r) } } lodash_get(t, e, s) { const a = e.replace(/\[(\d+)\]/g, ".$1").split("."); let r = t; for (const t of a) if (((r = Object(r)[t]), void 0 === r)) return s; return r } lodash_set(t, e, s) { return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), (e.slice(0, -1).reduce((t, s, a) => Object(t[s]) === t[s] ? t[s] : (t[s] = Math.abs(e[a + 1]) >> 0 == +e[a + 1] ? [] : {}), t)[e[e.length - 1]] = s), t) } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, a] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ""; if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, a, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, a, r] = /^@(.*?)\.(.*?)$/.exec(e), i = this.getval(a), o = a ? ("null" === i ? null : i || "{}") : "{}"; try { const e = JSON.parse(o); this.lodash_set(e, r, t), (s = this.setval(JSON.stringify(e), a)) } catch (e) { const i = {}; this.lodash_set(i, r, t), (s = this.setval(JSON.stringify(i), a)) } } else s = this.setval(t, e); return s } getval(t) { switch (this.getEnv()) { case "Surge": case "Loon": case "Stash": case "Shadowrocket": return $persistentStore.read(t); case "Quantumult X": return $prefs.valueForKey(t); case "Node.js": return (this.data = this.loaddata()), this.data[t]; default: return (this.data && this.data[t]) || null } } setval(t, e) { switch (this.getEnv()) { case "Surge": case "Loon": case "Stash": case "Shadowrocket": return $persistentStore.write(t, e); case "Quantumult X": return $prefs.setValueForKey(t, e); case "Node.js": return ((this.data = this.loaddata()), (this.data[e] = t), this.writedata(), !0); default: return (this.data && this.data[e]) || null } } initGotEnv(t) { (this.got = this.got ? this.got : require("got")), (this.cktough = this.cktough ? this.cktough : require("tough-cookie")), (this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar()), t && ((t.headers = t.headers ? t.headers : {}), void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get(t, e = () => { }) { switch ((t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"], delete t.headers["content-type"], delete t.headers["content-length"]), this.getEnv())) { case "Surge": case "Loon": case "Stash": case "Shadowrocket": default: this.isSurge() && this.isNeedRewrite && ((t.headers = t.headers || {}), Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, a) => { !t && s && ((s.body = a), (s.statusCode = s.status ? s.status : s.statusCode), (s.status = s.statusCode)), e(t, s, a) }); break; case "Quantumult X": this.isNeedRewrite && ((t.opts = t.opts || {}), Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then((t) => { const { statusCode: s, statusCode: a, headers: r, body: i, bodyBytes: o, } = t; e(null, { status: s, statusCode: a, headers: r, body: i, bodyBytes: o, }, i, o) }, (t) => e((t && t.error) || "UndefinedError")); break; case "Node.js": let s = require("iconv-lite"); this.initGotEnv(t), this.got(t).on("redirect", (t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); s && this.ckjar.setCookieSync(s, null), (e.cookieJar = this.ckjar) } } catch (t) { this.logErr(t) } }).then((t) => { const { statusCode: a, statusCode: r, headers: i, rawBody: o, } = t, n = s.decode(o, this.encoding); e(null, { status: a, statusCode: r, headers: i, rawBody: o, body: n, }, n) }, (t) => { const { message: a, response: r } = t; e(a, r, r && s.decode(r.rawBody, this.encoding)) }) } } post(t, e = () => { }) { const s = t.method ? t.method.toLocaleLowerCase() : "post"; switch ((t.body && t.headers && !t.headers["Content-Type"] && !t.headers["content-type"] && (t.headers["content-type"] = "application/x-www-form-urlencoded"), t.headers && (delete t.headers["Content-Length"], delete t.headers["content-length"]), this.getEnv())) { case "Surge": case "Loon": case "Stash": case "Shadowrocket": default: this.isSurge() && this.isNeedRewrite && ((t.headers = t.headers || {}), Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient[s](t, (t, s, a) => { !t && s && ((s.body = a), (s.statusCode = s.status ? s.status : s.statusCode), (s.status = s.statusCode)), e(t, s, a) }); break; case "Quantumult X": (t.method = s), this.isNeedRewrite && ((t.opts = t.opts || {}), Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then((t) => { const { statusCode: s, statusCode: a, headers: r, body: i, bodyBytes: o, } = t; e(null, { status: s, statusCode: a, headers: r, body: i, bodyBytes: o, }, i, o) }, (t) => e((t && t.error) || "UndefinedError")); break; case "Node.js": let a = require("iconv-lite"); this.initGotEnv(t); const { url: r, ...i } = t; this.got[s](r, i).then((t) => { const { statusCode: s, statusCode: r, headers: i, rawBody: o, } = t, n = a.decode(o, this.encoding); e(null, { status: s, statusCode: r, headers: i, rawBody: o, body: n }, n) }, (t) => { const { message: s, response: r } = t; e(s, r, r && a.decode(r.rawBody, this.encoding)) }) } } time(t, e = null) { const s = e ? new Date(e) : new Date(); let a = { "M+": s.getMonth() + 1, "d+": s.getDate(), "H+": s.getHours(), "m+": s.getMinutes(), "s+": s.getSeconds(), "q+": Math.floor((s.getMonth() + 3) / 3), S: s.getMilliseconds(), }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length))); for (let e in a) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? a[e] : ("00" + a[e]).substr(("" + a[e]).length))); return t } queryStr(t) { let e = ""; for (const s in t) { let a = t[s]; null != a && "" !== a && ("object" == typeof a && (a = JSON.stringify(a)), (e += `${s}=${a}&`)) } return (e = e.substring(0, e.length - 1)), e } msg(e = t, s = "", a = "", r) { const i = (t) => { switch (typeof t) { case void 0: return t; case "string": switch (this.getEnv()) { case "Surge": case "Stash": default: return { url: t }; case "Loon": case "Shadowrocket": return t; case "Quantumult X": return { "open-url": t }; case "Node.js": return }case "object": switch (this.getEnv()) { case "Surge": case "Stash": case "Shadowrocket": default: { let e = t.url || t.openUrl || t["open-url"]; return { url: e } } case "Loon": { let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"]; return { openUrl: e, mediaUrl: s } } case "Quantumult X": { let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl, a = t["update-pasteboard"] || t.updatePasteboard; return { "open-url": e, "media-url": s, "update-pasteboard": a, } } case "Node.js": return }default: return } }; if (!this.isMute) switch (this.getEnv()) { case "Surge": case "Loon": case "Stash": case "Shadowrocket": default: $notification.post(e, s, a, i(r)); break; case "Quantumult X": $notify(e, s, a, i(r)); break; case "Node.js": }if (!this.isMuteLog) { let t = ["", "==============📣系统通知📣==============",]; t.push(e), s && t.push(s), a && t.push(a), console.log(t.join("\n")), (this.logs = this.logs.concat(t)) } } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr(t, e) { switch (this.getEnv()) { case "Surge": case "Loon": case "Stash": case "Shadowrocket": case "Quantumult X": default: this.log("", `❗️${this.name},错误!`, t); break; case "Node.js": this.log("", `❗️${this.name},错误!`, t.stack) } } wait(t) { return new Promise((e) => setTimeout(e, t)) } DoubleLog(d) { if (this.isNode()) { if (d) { console.log(`${d}`); msg += `\n ${d}` } } else { console.log(`${d}`); msg += `\n ${d}` } } async SendMsg(m) { if (!m) return; if (Notify > 0) { if (this.isNode()) { var notify = require("./sendNotify"); await notify.sendNotify(this.name, m) } else { this.msg(this.name, "", m) } } else { console.log(m) } } done(t = {}) { const e = new Date().getTime(), s = (e - this.startTime) / 1e3; switch ((this.log("", `🔔${this.name},结束!🕛${s}秒`), this.log(), this.getEnv())) { case "Surge": case "Loon": case "Stash": case "Shadowrocket": case "Quantumult X": default: $done(t); break; case "Node.js": process.exit(1) } } })(t, e) }
//Env rewrite:smallfawn Update-time:23-6-30 newAdd:DoubleLog & SendMsg
