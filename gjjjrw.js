// 获取请求头中的变量并存储在环境变量中
const headers = $request ? $request.headers : {};

if (headers['AccessToken']) {
    $env.set('kua_accessToken', headers['AccessToken']);
}
if (headers['appid']) {
    $env.set('kua_appid', headers['appid']);
}
if (headers['timestamp']) {
    $env.set('kua_timestamp', headers['timestamp']);
}

const fetchAndNotify = async (request, taskName) => {
    try {
        const response = await $task.fetch(request);
        console.log(response.statusCode + "\n\n" + response.body);
        $notify(`顾家家居${taskName}任务`, "请求成功", response.body);
    } catch (reason) {
        console.log(reason.error);
        $notify(`顾家家居${taskName}任务`, "请求失败", reason.error);
    }
};

const kuaTask = async () => {
    // 顾家家居点赞任务
    const likeUrl = `https://mc.kukahome.com/club-server/front/member/pushEvent`;
    const likeBody = `{"eventId":"c_showhome_like","content":"晒家-点赞","targetId":"300001","targetName":"晒家-点赞","businessId":"52186","businessName":"实物简单大方，非常有质感！这次购买也是朋友推荐！"}`;
    const likeRequest = {
        url: likeUrl,
        method: 'POST',
        headers: {
            'appid': $env.get('kua_appid') || `667516`,
            'content-type': `application/json`,
            'Connection': `keep-alive`,
            'AccessToken': $env.get('kua_accessToken') || `2963193b9c6643fe4e6c8a4004479b90`,
            'parameterSign': `45c121d255eb9aeddbc8b15c7cf88175`,
            'timestamp': $env.get('kua_timestamp') || `1720712703722`,
            'sign': `b4be966644c4deafa307f6fa82b072cc`,
            'E-Opera': ``,
            'Accept-Encoding': `gzip,compress,br,deflate`,
            'User-Agent': `Mozilla/5.0 (iPhone; CPU iPhone OS 16_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.50(0x1800322e) NetType/4G Language/zh_CN`,
            'X-Customer': `5227043`,
            'Host': `mc.kukahome.com`,
            'brandCode': `K001`,
            'Referer': `https://servicewechat.com/wx0770280d160f09fe/196/page-frame.html`
        },
        body: likeBody
    };
    await fetchAndNotify(likeRequest, '点赞');

    // 顾家家居收藏任务
    const collectUrl = `https://mc.kukahome.com/club-server/front/foot/point/insertFootPoint`;
    const collectBody = `{"brandCode":"K001","buriedPointLogo":"do_collect_btn","subordinateTerminal":"会员小程序","businessName":"","businessCode":"","currentPageLink":""}`;
    const collectRequest = {
        url: collectUrl,
        method: 'POST',
        headers: {
            'appid': $env.get('kua_appid') || `667516`,
            'content-type': `application/json`,
            'Connection': `keep-alive`,
            'AccessToken': $env.get('kua_accessToken') || `2963193b9c6643fe4e6c8a4004479b90`,
            'parameterSign': `c73bfa3810fc4d7ce87d7145ee6a03fd`,
            'timestamp': $env.get('kua_timestamp') || `1720712704474`,
            'sign': `cc3401290dfdb2237225abd8dd3fd2b6`,
            'E-Opera': ``,
            'Accept-Encoding': `gzip,compress,br,deflate`,
            'User-Agent': `Mozilla/5.0 (iPhone; CPU iPhone OS 16_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.50(0x1800322e) NetType/4G Language/zh_CN`,
            'X-Customer': `5227043`,
            'Host': `mc.kukahome.com`,
            'brandCode': `K001`,
            'Referer': `https://servicewechat.com/wx0770280d160f09fe/196/page-frame.html`
        },
        body: collectBody
    };
    await fetchAndNotify(collectRequest, '收藏');

    // 顾家家居签到任务
    const loginUrl = `https://mc.kukahome.com/club-server/member/insertMemberLogin`;
    const loginBody = `{"brandCode":"K001","memberPhone":"15833332749","primarySources":"固定场景","secondarySource":"【1089】任务栏-最近使用","sourceImage":"https://kuka-member-test.oss-cn-hangzhou.aliyuncs.com/testtest/ALIOSS_IMG_fb31659e-a7f8-4dd8-83ea-379f3da28b03_3dafe3ed-cec7-44a3-9348-3fd13cddfbdb.png"}`;
    const loginRequest = {
        url: loginUrl,
        method: 'POST',
        headers: {
            'appid': $env.get('kua_appid') || `667516`,
            'content-type': `application/json`,
            'Connection': `keep-alive`,
            'AccessToken': $env.get('kua_accessToken') || `2963193b9c6643fe4e6c8a4004479b90`,
            'parameterSign': `0b5b7cbc449c53c525832c4e2f1f9189`,
            'timestamp': $env.get('kua_timestamp') || `1720712603980`,
            'sign': `87ffb7959da1ee093f3e02397c336755`,
            'E-Opera': ``,
            'Accept-Encoding': `gzip,compress,br,deflate`,
            'User-Agent': `Mozilla/5.0 (iPhone; CPU iPhone OS 16_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.50(0x1800322e) NetType/4G Language/zh_CN`,
            'X-Customer': `5227043`,
            'Host': `mc.kukahome.com`,
            'brandCode': `K001`,
            'Referer': `https://servicewechat.com/wx0770280d160f09fe/196/page-frame.html`
        },
        body: loginBody
    };
    await fetchAndNotify(loginRequest, '签到');
};

if (typeof $task !== 'undefined') {
    kuaTask();
}

$done({});
