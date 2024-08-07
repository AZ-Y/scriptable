/**
 * Surge Script for 兴攀农场
 * Author: Mist
 * Date: 2024-07-02
 */

const env_name = 'xpnc'; // 环境变量名字
const env = $prefs.valueForKey(env_name) || '';
const Notify = 1; // 是否通知, 1通知, 0不通知. 默认通知
const debug = 0; // 是否调试, 1调试, 0不调试. 默认不调试

let allTasksSuccessful = true;  // 用于标记所有任务是否成功

// 脚本入口函数
(async () => {
    if (env === '') {
        console.log(`没有填写变量,请查看脚本说明: ${env_name}`);
        return;
    }
    let user_ck = env.split('\n');
    console.log(`\n========== 共找到 ${user_ck.length} 个账号 ==========`);
    for (let i = 0; i < user_ck.length; i++) {
        if (!user_ck[i]) continue;
        let ck_info = user_ck[i].split('&');
        let authorization = ck_info[0];
        let user = {
            index: i + 1,
            authorization,
        };
        allTasksSuccessful = await userTask(user) && allTasksSuccessful;  // 记录每个账号任务的执行结果
    }
    if (Notify > 0) {
        let notificationMessage = allTasksSuccessful? '所有账号任务成功完成' : '有账号任务执行失败';
        $notify("兴攀农场账号任务结果", notificationMessage);
    }
})().catch((e) => console.log(e));

// 账号任务
async function userTask(user) {
    console.log(`\n============= 账号[${user.index}]开始任务 =============`);
    let taskSuccessful = true;  // 用于标记当前账号的任务是否成功

    await Sign(user).catch(() => { taskSuccessful = false; });
    await wait(1);
    for (let i = 1; i < 17; i++) {
        await Task(user, i).catch(() => { taskSuccessful = false; });
        await wait(1);
        await Reward(user, i).catch(() => { taskSuccessful = false; });
        await wait(1);
    }
    await Fertilizer(user).catch(() => { taskSuccessful = false; });
    await wait(1);
    for (let i = 0; i < 10; i++) {
        await Water(user).catch(() => { taskSuccessful = false; });
        await wait(1);
    }
    await HomePage(user).catch(() => { taskSuccessful = false; });

    return taskSuccessful;  // 返回当前账号任务的执行结果
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
        console.log(`🌸账号[${user.index}]🕊签到成功-获得${result.data.reward.integral}积分🎉`);
    } else {
        console.log(`🌸账号[${user.index}]签到-状态:${result.message}`);
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
        console.log(`🌸账号[${user.index}]🕊施肥成功,总肥力${result.data.fertilizer}🎉`);
    } else {
        console.log(`🌸账号[${user.index}]施肥状态:${result.message}`);
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
        console.log(`🌸账号[${user.index}]🕊果树🌳当前状态[${result.data.type_name}]-进度[${result.data.growth_level}]-剩余肥力[${result.data.fertilizer}]-💧[${result.data.water_value}]🎉`);
    } else {
        console.log(`🌸账号[${user.index}]查询🔍:${result.message}果树🌳当前状态[${result.data.type_name}]-进度[${result.data.growth_level}]-剩余肥力[${result.data.fertilizer}]-💧[${result.data.water_value}]`);
    }
}

// 网络请求函数
function httpRequest(options) {
    return new Promise((resolve) => {
        $task.fetch(options).then((response) => {
            try {
                let data = JSON.parse(response.body);
                resolve(data);
            } catch (e) {
                resolve(null);
            }
        }, (error) => {
            console.log(error);
            resolve(null);
        });
    });
}

// 等待函数
function wait(n) {
    return new Promise((resolve) => setTimeout(resolve, n * 1000));
}
