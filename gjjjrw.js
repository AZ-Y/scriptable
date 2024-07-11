------------------------------------------
1. 此脚本仅用于学习研究，不保证其合法性、准确性、有效性，请根据情况自行判断，本人对此不承担任何保证责任。
2. 由于此脚本仅用于学习研究，您必须在下载后24小时内将所有内容从您的计算机或手机或任何存储设备中完全删除，若违反规定引起任何事件本人对此均不负责。
3. 请勿将此脚本用于任何商业或非法目的，若违反规定请自行对此负责。
4. 此脚本涉及应用与本人无关，本人对因此引起的任何隐私泄漏或其他后果不承担任何责任。
5. 本人对任何脚本引发的问题概不负责，包括但不限于由脚本错误引起的任何损失和损害。
6. 如果任何单位或个人认为此脚本可能涉嫌侵犯其权利，应及时通知并提供身份证明，所有权证明，我们将在收到认证文件确认后删除此脚本。
7. 所有直接或间接使用、查看此脚本的人均应该仔细阅读此声明。本人保留随时更改或补充此声明的权利。一旦您使用或复制了此脚本，即视为您已接受此免责声明。
*/

const $ = new Env("顾家家居");

(async () => {
    const userToken = $.getdata('kuka_token');
    if (!userToken) {
        $.log("无法获取用户token，请检查配置");
        return;
    }

    const headers = {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; MI 8 Lite Build/QKQ1.190910.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/80.0.3987.99 Mobile Safari/537.36/kukaofficialapp/9e4bb0e5bc326fb1_10219183246/newversion/versioncode-1000112/',
        'Accept-Encoding': 'gzip, deflate',
        'pragma': 'no-cache',
        'cache-control': 'no-cache',
        'origin': 'https://api.kuka.com',
        'servicetoken': userToken,
        'sec-fetch-dest': 'empty',
        'sec-fetch-site': 'same-origin',
        'sec-fetch-mode': 'cors',
        'referer': 'https://api.kuka.com/app?pmf_source=P0000005611M0002',
        'accept-language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
    };

    try {
        await signIn(headers);
        const points = await getPoints(headers);
        const tasks = await getTasks(headers);

        for (const task of tasks) {
            await completeTask(task, headers);
        }

        $.log(`签到成功，当前积分：${points}`);
    } catch (error) {
        $.log(`执行过程中发生错误：${error.message}`);
    }
})();

async function signIn(headers) {
    const url = 'https://api.kuka.com/user/checkIn';
    const response = await $.post({ url, headers });
    if (response.code !== 0 && response.code !== 1221) {
        throw new Error('签到失败或token过期');
    }
    $.log(`签到结果：${response.msg}`);
}

async function getPoints(headers) {
    const url = 'https://api.kuka.com/user/getMyAssets';
    const response = await $.post({ url, headers });
    return response.data.points;
}

async function getTasks(headers) {
    const url = 'https://api.kuka.com/user/getUserTaskList';
    const response = await $.post({ url, headers });
    return response.data.filter(task => task.taskState === 0 && task.type !== 13);
}

async function completeTask(task, headers) {
    const taskId = task.taskId;
    const completeUrl = `https://api.kuka.com/user/selectTaskPrize?taskId=${taskId}&channelId=1`;
    const rewardUrl = `https://api.kuka.com/user/userFinishTask?taskId=${taskId}&channelId=1&state=1`;

    await $.post({ url: completeUrl, headers });
    await $.post({ url: rewardUrl, headers });

    $.log(`任务完成：${task.name}`);
}

class Env {
    constructor(name) {
        this.name = name;
        this.data = {};
        this.logs = [];
    }

    log(...args) {
        this.logs.push(...args);
        console.log(...args);
    }

    getdata(key) {
        // 读取存储的数据
    }

    post(options) {
        return new Promise((resolve, reject) => {
            // 使用request库发起POST请求
            const request = require('request');
            request.post(options, (error, response, body) => {
                if (error) return reject(error);
                try {
                    resolve(JSON.parse(body));
                } catch (e) {
                    reject(e);
                }
            });
        });
    }
}
