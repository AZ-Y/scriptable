const $ = new Env('Bckid 自动抓包');

// 从 Quantumult X 数据中获取 token
const token = $prefs.valueForKey('bckid_token'); // 使用 $prefs

!(async () => {
    try {
        // 验证 token 是否存在
        if (!token) {
            $.msg($.name, 'Token 获取失败', '请先获取有效的 token');
            return;
        }

        // 执行签到任务
        await checkIn();

        // 获取任务列表
        await getTaskList();
    } catch (error) {
        $.log('脚本运行出错:', error.message);
        $.msg($.name, '脚本错误', `错误信息: ${error.message}`);
    }
})().finally(() => $.done());

// 执行签到任务的函数
async function checkIn() {
    const url = 'https://api.bckid.com.cn/operation/front/bonus/check-in';
    const method = 'POST';
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': token,
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.49(0x18003137) NetType/WIFI Language/zh_CN',
    };
    const body = JSON.stringify({
        "userId": "12345",  // 你需要替换为实际的 userId
        "token": token
    });

    const request = {
        url: url,
        method: method,
        headers: headers,
        body: body
    };

    try {
        const response = await $task.fetch(request);
        if (response.statusCode === 200) {
            $.log('签到成功:', response.body);
            $.msg($.name, '签到成功', '查看控制台日志');
        } else {
            $.log('签到失败:', response.body);
            $.msg($.name, '签到失败', `状态码: ${response.statusCode}`);
        }
    } catch (error) {
        $.log('签到任务出错:', error.message);
        $.msg($.name, '签到任务错误', `错误信息: ${error.message}`);
    }
}

// 获取任务列表的函数
async function getTaskList() {
    const url = 'https://api.bckid.com.cn/operation/front/bonus/userTask/list';
    const method = 'POST';
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': token,
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.49(0x18003137) NetType/WIFI Language/zh_CN',
    };
    const body = '';

    const request = {
        url: url,
        method: method,
        headers: headers,
        body: body
    };

    try {
        const response = await $task.fetch(request);
        $.log('任务列表:', response.body);
    } catch (error) {
        $.log('获取任务列表出错:', error.message);
        $.msg($.name, '获取任务列表错误', `错误信息: ${error.message}`);
    }
}

function Env(name) {
    this.name = name;
    this.logSeparator = '\n';
    this.startTime = (new Date()).getTime();
    this.data = {};
    this.logs = [];

    this.getval = function (key) {
        return $prefs.valueForKey(key) || null;
    };

    this.setval = function (value, key) {
        return $prefs.setValueForKey(value, key);
    };

    this.log = function (...args) {
        console.log(...args);
        this.logs.push(args.join(this.logSeparator));
    };

    this.msg = function (title, subtitle, body) {
        console.log(`${title}: ${subtitle} - ${body}`);
    };

    this.done = function () {
        // 结束脚本
    };
}
