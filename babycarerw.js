const Notify = 1;  // 是否通知
const debug = 0;  // 是否调试

const env_name = 'babaycare';  // 环境变量名字
const env = $persistentStore.read(env_name) || '';

if (env === '') {
    console.log(`没有填写变量,请查看脚本说明: ${env_name}`);
} else {
    let user_ck = env.split('\n');
    console.log(`\n========== 共找到 ${user_ck.length} 个账号 ==========`);

    let index = 1;
    (async function processAccounts() {
        for (let ck of user_ck) {
            if (!ck) continue;

            let ck_info = ck.split('&');
            let authorization = ck_info[0];
            let user = {
                index: index,
                authorization
            };

            index++;
            await userTask(user);

            let rnd_time = Math.floor(Math.random() * 4000) + 1000;
            console.log(`账号[${user.index}]随机等待${rnd_time / 1000}秒...`);
            await sleep(rnd_time);
        }
    })();
}

function userTask(user) {
    return new Promise((resolve) => {
        console.log(`\n============= 账号[${user.index}]开始任务 =============`);
        SignInDailyScore(user, () => {
            sleep(1000).then(() => {
                GetUserPoint(user, resolve);
            });
        });
    });
}

function SignInDailyScore(user, callback) {
    let urlObject = {
        method: 'post',
        url: `https://api.bckid.com.cn/operation/front/bonus/userSign/v3/sign`,
        headers: {
            'Host': 'api.bckid.com.cn',
            'authorization': user.authorization,
            'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
        },
        body: {}
    };

    $http.post(urlObject, (response) => {
        if (response.status === 200 && response.body) {
            console.log(`🌸账号[${user.index}]🕊当前已签到${response.body.signDaysCountMod || '未知'}天🎉`);
        } else {
            console.log(`🌸账号[${user.index}]签到失败: ${response.body ? response.body.message : '未知错误'}❌`);
        }
        callback();
    });
}

function GetUserPoint(user, callback) {
    let urlObject = {
        method: 'post',
        url: `https://api.bckid.com.cn/operation/front/bonus/userBonus/getUserBonus`,
        headers: {
            'Host': 'api.bckid.com.cn',
            'authorization': user.authorization,
            'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
        },
        body: {}
    };

    $http.post(urlObject, (response) => {
        if (response.status === 200 && response.body) {
            console.log(`🌸账号[${user.index}]🕊账户当前积分[${response.body.userBonus || '未知'}],历史积分[${response.body.sumBonus || '未知'}]💰`);
        } else {
            console.log(`🌸账号[${user.index}]积分查询失败: ${response.body ? response.body.message : '未知错误'}❌`);
        }
        callback();
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
