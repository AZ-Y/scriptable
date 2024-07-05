const $ = new Env('bckid');

!(async () => {
    try {
        if ($response && $response.headers) {
            const token = $response.headers['Authorization'];
            if (token) {
                $.log(`获取到的 token: ${token}`);
                $.setdata(token, 'bckid_token');
                $.msg($.name, 'Token 获取成功', token);
            } else {
                $.msg($.name, 'Token 获取失败', '未找到 Authorization 头');
            }
        } else {
            $.msg($.name, '响应无头部', '无有效的响应头部');
        }
    } catch (error) {
        $.log(`脚本运行出错: ${error}`);
        $.msg($.name, '脚本错误', `错误信息: ${error}`);
    }
})().finally(() => $.done());

function Env(t, e) {
    this.name = t;
    this.logSeparator = '\n';
    this.startTime = (new Date()).getTime();
    this.data = {};
    this.logs = [];
    
    this.getval = function(key) {
        return this.data[key] || null;
    };
    
    this.setval = function(value, key) {
        return this.data[key] = value;
    };
    
    this.log = function(...args) {
        console.log(...args);
        this.logs.push(args.join(this.logSeparator));
    };
    
    this.msg = function(title, subtitle, body) {
        console.log(`${title}: ${subtitle} - ${body}`);
    };
    
    this.done = function() {
        // 结束脚本
    };
}
