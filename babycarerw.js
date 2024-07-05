const $ = new Env('Bckid Token 抓取');

// 获取 Cookie 或 Token 的函数
async function getToken() {
    if ($request && $request.url.indexOf("https://api.bckid.com.cn/operation/front/bonus/userTask/list") > -1) {
        // 从请求头中提取 Cookie 或 Token
        const cookie = $request.headers['Cookie'] || $request.headers['cookie'];
        console.log('请求 URL:', $request.url);
        console.log('请求头:', $request.headers);
        if (cookie) {
            // 将获取到的 Cookie 存储到 Quantumult X 数据存储中
            $.setval(cookie, 'bckid_token');
            $.msg('Cookie 获取成功', '', cookie);
        } else {
            $.msg('未获取到 Cookie', '', '检查请求头');
        }
    } else {
        $.msg('请求 URL 不匹配', '', '检查请求 URL');
    }
}

!(async () => {
    await getToken();
})().finally(() => $.done());

// Env 构造函数
function Env(name) {
    this.name = name;
    this.getval = function (key) {
        return $prefs.valueForKey(key) || null;
    };
    this.setval = function (value, key) {
        return $prefs.setValueForKey(value, key);
    };
    this.msg = function (title, subtitle, body) {
        $notification.post(title, subtitle, body);
    };
    this.done = function () {
        // 结束脚本
    };
}
