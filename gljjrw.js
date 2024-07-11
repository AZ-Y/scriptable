/**************************************
@Name：囯乐酱酒小程序签到
@Date：2024-7-8
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
/**************************************
@Name：囯乐酱酒小程序签到
@Date：2024-7-8
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
const $ = new Env('国乐酱酒签到');
const Notify = 1; // 用于控制通知开关
let msg = ""; // 用于存储通知信息

// 定义环境变量名称
const ENV_NAME = 'guoyuejiu';
// 获取环境变量
const env = $.getdata(ENV_NAME) || '';

// 脚本版本
let scriptVersion = "1.0.0";

// 主执行函数
async function main() {
    if (!env) {
        $.log(`没有填写变量,请查看脚本说明: ${ENV_NAME}🚳`);
        return;
    }
    const userCookies = env.split('\n').filter(Boolean); // 处理多账号数据
    for (let i = 0; i < userCookies.length; i++) {
        const userCookie = userCookies[i];
        const Authorization = userCookie; // 假设环境变量就是Authorization令牌
        // 创建用户实例并执行任务
        const user = new User(Authorization, i + 1);
        await user.runTask();
        if (Notify) {
            msg += `${user.result}\n`;
        }
    }
    // 发送通知
    if (Notify && msg) {
        $.notify("国乐酱酒签到结果", "", msg);
    }
}

// 用户类
class User {
    constructor(Authorization, index) {
        this.index = index;
        this.Authorization = Authorization;
        this.result = '';
    }

    async runTask() {
        try {
            const signInResult = await this.signIn();
            if (signInResult && signInResult.code === 0) {
                this.result = `账号[${this.index}]签到成功，连续签到${signInResult.data.spanSumDays}天`;
            } else if (signInResult) {
                this.result = `账号[${this.index}]签到失败: ${signInResult.message}`;
            } else {
                this.result = `账号[${this.index}]签到失败: 未知错误`;
            }
        } catch (error) {
            this.result = `账号[${this.index}]签到失败: ${error}`;
        }
    }

    async signIn() {
        const url = 'https://member.guoyuejiu.com/api/sign/daily/sign';
        const headers = {
            Authorization: this.Authorization,
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.49(0x18003137) NetType/4G Language/zh_CN' // 替换为实际的User-Agent
        };
        try {
            const response = await $httpClient.get(url, headers);
            if (response.status === 200) {
                return response.data;
            }
        } catch (error) {
            $.log(`账号[${this.index}]签到失败: ${error}`);
        }
    }
}

// 执行主函数
main().catch(e => {
    $.log(`运行错误: ${e}`);
}).finally(() => {
    $.done();
});
/** ---------------------------------固定不动区域----------------------------------------- */
//prettier-ignore
async function sendMsg(a, e) { a && ($.isNode() ? await notify.sendNotify($.name, a) : $.msg($.name, $.title || "", a, e)) }
function DoubleLog(o) { o && ($.log(`${o}`), $.notifyMsg.push(`${o}`)) };
async function checkEnv() { try { if (!userCookie?.length) throw new Error("no available accounts found"); $.log(`\n[INFO] 检测到 ${userCookie?.length ?? 0} 个账号\n`), $.userList.push(...userCookie.map((o => new UserInfo(o))).filter(Boolean)) } catch (o) { throw o } }
function debug(g, e = "debug") { "true" === $.is_debug && ($.log(`\n-----------${e}------------\n`), $.log("string" == typeof g ? g : $.toStr(g) || `debug error => t=${g}`), $.log(`\n-----------${e}------------\n`)) }
//From xream's ObjectKeys2LowerCase
function ObjectKeys2LowerCase(obj) { return !obj ? {} : Object.fromEntries(Object.entries(obj).map(([k, v]) => [k.toLowerCase(), v])) };
//From sliverkiss's Request
async function Request(t) { "string" == typeof t && (t = { url: t }); try { if (!t?.url) throw new Error("[URL][ERROR] 缺少 url 参数"); let { url: o, type: e, headers: r = {}, body: s, params: a, dataType: n = "form", resultType: u = "data" } = t; const p = e ? e?.toLowerCase() : "body" in t ? "post" : "get", c = o.concat("post" === p ? "?" + $.queryStr(a) : ""), i = t.timeout ? $.isSurge() ? t.timeout / 1e3 : t.timeout : 1e4; "json" === n && (r["Content-Type"] = "application/json;charset=UTF-8"); const y = "string" == typeof s ? s : (s && "form" == n ? $.queryStr(s) : $.toStr(s)), l = { ...t, ...t?.opts ? t.opts : {}, url: c, headers: r, ..."post" === p && { body: y }, ..."get" === p && a && { params: a }, timeout: i }, m = $.http[p.toLowerCase()](l).then((t => "data" == u ? $.toObj(t.body) || t.body : $.toObj(t) || t)).catch((t => $.log(`[${p.toUpperCase()}][ERROR] ${t}\n`))); return Promise.race([new Promise(((t, o) => setTimeout((() => o("当前请求已超时")), i))), m]) } catch (t) { console.log(`[${p.toUpperCase()}][ERROR] ${t}\n`) } }
//From chavyleung's Env.js
function Env(t, e) { class 
