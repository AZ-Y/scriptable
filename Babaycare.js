/**
 * Babaycare 旗舰店、超级门店通用
 * Author: Mist
 * Date: 2024-06-21
 * cron "30 7 * * *" babaycare.js
 * export babaycare= authorization     多账号换行或者#分隔
 */

// 是否通知, 1 通知, 0 不通知. 默认通知
const Notify = 1;

// 是否调试, 1 调试, 0 不调试. 默认不调试
const debug = 0;

let scriptVersionNow = "1.0.0";  // 脚本版本号
let msg = "";

// 异步顺序执行函数
!(async () => {
    await getNotice();  // 远程通知
    await getVersion("yang7758258/ohhh154@main/babaycare.js");
    await main();  // 主函数
    await SendMsg(msg);  // 发送通知
})()
 .catch((e) => console.error(e))
 .finally(() => {});

// 脚本入口函数 main()
async function main() {
    // 使用 $persistentStore.read 来获取环境变量
    const env = $persistentStore.read('babaycare') || '';
    if (env == '') {
        // 没有设置变量,直接退出
        console.log(`没有填写变量,请查看脚本说明: babaycare`);
        return;
    }
    let user_ck = env.split('\n');
    console.log(`\n========== 共找到 ${user_ck.length} 个账号 ==========`);
    let index = 1;  // 用来给账号标记序号, 从 1 开始
    for (let ck of user_ck) {
        if (!ck) continue;  // 跳过空行
        let ck_info = ck.split('&');
        let authorization = ck_info[0];
        let user = {
            index: index,
            authorization
        };
        index = index + 1;  // 每次用完序号+1
        // 开始账号任务
        await userTask(user);
        // 每个账号之间等 1~5 秒随机时间
        let rnd_time = Math.floor(Math.random() * 4000) + 1000;
        console.log(`账号[${user.index}]随机等待${rnd_time / 1000}秒...`);
        await $delay(rnd_time);
    }
}

// 开始任务
async function userTask(user) {
    console.log(`\n============= 账号[${user.index}]开始任务 =============`);
    await SignInDailyScore(user);
    await $delay(1);
    await GetUserPoint(user);
}

// 签到
async function SignInDailyScore(user) {
    try {
        let urlObject = {
            method: 'post',
            url: `https://api.bckid.com.cn/operation/front/bonus/userSign/v3/sign`,
            headers: {
                'Host': 'api.bckid.com.cn',
                'authorization': user.authorization,
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36 MicroMessenger/7.0.20.1781(0x6700143B) NetType/WIFI MiniProgramEnv/Windows WindowsWechat/WMPF WindowsWechat(0x63090b11) XWEB/9129',
            },
            data: {}
        };
        let response = await axios.request(urlObject);
        let result = response.data;
        if (result?.code == '200') {
            // 打印签到结果
            console.log(`🌸账号[${user.index}]` + `🕊当前已签到${result.body.signDaysCountMod}天🎉`);
        } else {
            console.log(`🌸账号[${user.index}]签到-失败:${result.message}❌`);
        }
    } catch (e) {
        // 打印错误信息
        console.log('以下是报错输出：');
        console.log(e);
    }
}

// 积分查询
async function GetUserPoint(user) {
    try {
        let urlObject = {
            method: 'post',
            url: `https://api.bckid.com.cn/operation/front/bonus/userBonus/getUserBonus`,
            headers: {
                'Host': 'api.bckid.com.cn',
                'authorization': user.authorization,
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36 MicroMessenger/7.0.20.1781(0x6700143B) NetType/WIFI MiniProgramEnv/Windows WindowsWechat/WMPF WindowsWechat(0x63090b11) XWEB/9129',
            },
            data: {}
        };
        let response = await axios.request(urlObject);
        let result = response.data;
        if (result?.code == '200') {
            // 打印签到结果
            console.log(`🌸账号[${user.index}]` + `🕊账户当前积分[${result.body.userBonus}],历史积分[${result.body.sumBonus}]💰`);
        } else {
            console.log(`🌸账号[${user.index}]积分查询失败:${result.message}❌`);
        }
    } catch (e) {
        // 打印错误信息
        console.log('以下是报错输出：');
        console.log(e.response.data);
    }
}

/**
 * =========================================================发送消息=============================================
 */
async function SendMsg(message) {
    if (!message) return;
    if (Notify > 0) {
        await $notify($name, message);
    } else {
        console.log(message);
    }
}

/**
 * =====================================================双平台 log 输出==========================================
 */
function DoubleLog(data) {
    console.log(`${data}`);
    msg += `\n${data}`;
}

/**
 * ======================================================等待 X 秒============================================
 */
function wait(n) {
    return new Promise(function (resolve) {
        setTimeout(resolve, n * 1000);
    });
}

/**
 * ======================================================随机等待 1-5 秒============================================
 */
function sjwait() {
    return new Promise(function (resolve) {
        let waitTime = Math.floor(Math.random() * 4000 + 1000);
        setTimeout(resolve, waitTime);
    });
}

// ==========================================================13 位时间戳=====================================================
function getTimestamp() {
    return new Date().getTime();
}

// 网络请求函数
async function httpRequest(options, timeout = 1 * 1000) {
    let method = options.method? options.method.toLowerCase() : options.body? "post" : "get";
    let response;
    try {
        response = await axios({
            method,
            url: options.url,
            headers: options.headers,
            data: options.data,
            timeout
        });
    } catch (error) {
        console.log(error);
        return null;
    }
    return response.data;
}

//==============================================获取远程通知========================================
async function getNotice() {
    try {
        const urls = [
            "https://gitee.com/ohhhooh/jd_haoyangmao/raw/master/Notice.json",
        ];
        let notice = null;
        for (const url of urls) {
            const options = { url, headers: { "User-Agent": "" }, };
            const result = await httpRequest(options);
            if (result && "notice" in result) {
                notice = result.notice.replace(/\\n/g, "\n");
                break;
            }
        }
        if (notice) { console.log(notice); }
    } catch (e) {
        console.log(e);
    }
}

//==============================================获取远程版本=================================================
async function getVersion(scriptUrl, timeout = 3 * 1000) {
    try {
        const options = { url: `https://fastly.jsdelivr.net/gh/${scriptUrl}` };
        const response = await axios.get(options.url, { timeout });
        const regex = /scriptVersionNow\s*=\s*(["'`])([\d.]+)\1/;
        const match = response.data.match(regex);
        const scriptVersionLatest = match? match[2] : "";
        console.log(`\n============= 当前版本：${scriptVersionNow} 🌟 最新版本：${scriptVersionLatest} =============`);
    } catch (error) {
        console.error(error, response);
    }
}
