const $ = new Env("金杜丹任务");
const ckName = "jdd_data";
const userIdx = 0;

class JDD {
    constructor(str) {
        this.index = ++userIdx;
        this.token = str;
        this.ckStatus = true;
        this.headers = {
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.50(0x18003231) NetType/4G Language/zh_CN miniProgram/wx70eff0ac6e018724"
        };
    }
    getRandomTime() {
        return randomInt(1000, 3000);
    }

    async sign() {
        const url = `https://tianxin.jmd724.com/index.php?r=client/v1/task/sign-up&access_token=${this.token}`;
        const result = await $.get({ url, headers: this.headers });
        const response_data = JSON.parse(result.body);
        if (response_data.code === 0) {
            const gold_num = response_data.data.gold_num;
            const msg = response_data.msg;
            console.log(`${msg} 获得 ${gold_num} 金币`);
        } else {
            const msg = response_data.msg;
            console.log(msg);
        }
    }

    async fetch_ids() {
        const url = "https://tianxin.jmd724.com/index.php?r=client/v1/article/list";
        const result = await $.get({ url, headers: this.headers });
        const response_data = JSON.parse(result.body);
        const ids = [];
        response_data.data.list.slice(0, 5).forEach(item => ids.push(item.id));
        return ids;
    }

    async fetch_video_ids() {
        const url = "https://tianxin.jmd724.com/index.php?store_id=1&r=client/v1/article/list&pageSize=10&article_type=2";
        const result = await $.get({ url, headers: this.headers });
        const response_data = JSON.parse(result.body);
        const ids = [];
        response_data.data.list.slice(0, 5).forEach(item => ids.push(item.id));
        return ids;
    }

    async read(article_ids) {
        for (const article_id of article_ids) {
            const url = `https://tianxin.jmd724.com/index.php?r=client/v1/article/detail&article_id=${article_id}&access_token=${this.token}`;
            const result = await $.get({ url, headers: this.headers });
            const response_data = JSON.parse(result.body);
            if (response_data.code === 0) {
                console.log(`开始阅读文章编号${article_id}`);
            } else {
                const msg = response_data.msg;
                console.log(msg);
            }
        }
    }

    async gold(article_ids) {
        for (const article_id of article_ids) {
            const url = "https://tianxin.jmd724.com/index.php?r=client/v1/article/read-gold";
            const result = await $.post({ url, headers: this.headers, body: `article_id=${article_id}&access_token=${this.token}` });
            const response_data = JSON.parse(result.body);
            if (response_data.code === 0) {
                console.log(`成功获取文章编号${article_id} 的金币奖励`);
            } else {
                const msg = response_data.msg;
                console.log(msg);
            }
        }
    }

    async Videoviewing(video_ids) {
        for (const video_id of video_ids) {
            const url = `https://tianxin.jmd724.com/index.php?r=client/v1/article/detail&article_id=${video_id}&access_token=${this.token}`;
            const result = await $.get({ url, headers: this.headers });
            const response_data = JSON.parse(result.body);
            if (response_data.code === 0) {
                console.log(`开始观看视频编号${video_id}`);
            } else {
                const msg = response_data.msg;
                console.log(msg);
            }
        }
    }

    async VideoRewards(video_ids) {
        for (const video_id of video_ids) {
            const url = "https://tianxin.jmd724.com/index.php?r=client/v1/article/read-gold";
            const result = await $.post({ url, headers: this.headers, body: `article_id=${video_id}&access_token=${this.token}` });
            const response_data = JSON.parse(result.body);
            if (response_data.code === 0) {
                console.log(`成功获取视频编号${video_id} 的金币奖励`);
            } else {
                const msg = response_data.msg;
                console.log(msg);
            }
        }
    }
}

!(async () => {
    const tokens = $.getjson(ckName) || [];
    if (!tokens.length) {
        console.log("未找到token, 请先配置");
        return;
    }
    for (const token of tokens) {
        const jdd = new JDD(token);
        await jdd.sign();
        const article_ids = await jdd.fetch_ids();
        await jdd.read(article_ids);
        await $.wait(jdd.getRandomTime());
        await jdd.gold(article_ids);
        const video_ids = await jdd.fetch_video_ids();
        await jdd.Videoviewing(video_ids);
        await $.wait(jdd.getRandomTime());
        await jdd.VideoRewards(video_ids);
    }
})().catch((e) => {$.log(e)}).finally(() => {$.done({});});

async function getCookie() {
    const token = $request.headers['token'];
    if (!token) {
        console.log('未找到token头部');
        return;
    }
    const newData = {"token": token};
    const index = Changan.findIndex(e => e.token == newData.token);
    if (index !== -1) {
        if (Changan[index].token == newData.token) {
            console.log('token未改变');
            return;
        } else {
            Changan[index] = newData;
            console.log('更新token:', newData.token);
            $.msg($.name, '更新token成功!', '');
        }
    } else {
        Changan.push(newData);
        console.log('新增token:', newData.token);
        $.msg($.name, '新增token成功!', '');
    }
    $.setjson(Changan, "changan_data");
}

async function commonPost(url, body, token) {
    return new Promise(resolve => {
        const options = {
            url: url,
            method: 'POST',
            headers: {
                'Accept-Encoding': 'gzip,compress,br,deflate',
                'content-type': 'application/json',
                'Connection': 'keep-alive',
                'Referer': 'https://servicewechat.com/wxa85ccd055be3cfbc/223/page-frame.html',
                'Host': 'wxapi.uni.changan.com.cn',
                'codeEncryptedStr': 'UJSmPcxlGbafNTWj4N4Du6zM6jgaT/HNMkR0k3VJ2zijvWUvw9cDjkka4YisR1yYfrq4u0GXm1Cafs07NiyH9uRpZMUfGP8bS6wnyOgXUkWBrSiHx/W90dVUxT0d496cqIplomje9pUvmUuBUmJLNHDE1wY4Q6FfSn92Lg85H90=',
                'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.49(0x18003131) NetType/4G Language/zh_CN',
                'token': token,
                'sign': '740230F9A05C253ACC8CC1B4F51D971F',
                'timestamp': '1721726550903'
            },
            body: JSON.stringify(body)
        };
        $.post(options, async (err, resp, data) => {
            try {
                if (err) {
                    console.log(`API请求失败: ${JSON.stringify(err)}`);
                    console.log(`${$.name} API请求失败，请检查网络重试`);
                } else {
                    await $.wait(2000);
                    resolve(JSON.parse(data));
                }
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve();
            }
        });
    });
}

async function loadUtils() {
    let code = ($.isNode() ? process.env.Utils_Code : $.getdata('Utils_Code')) || '';
    if (code && Object.keys(code).length) {
        console.log(`✅ ${$.name}: 缓存中存在Utils代码, 跳过下载`);
        eval(code);
        return creatUtils();
    }
    console.log(`🚀 ${$.name}: 开始下载Utils代码`);
    return new Promise(async (resolve) => {
        $.getScript(
            'https://cdn.jsdelivr.net/gh/xzxxn777/Surge@main/Utils/Utils.js'
        ).then((fn) => {
            $.setdata(fn, "Utils_Code");
            eval(fn);
            console.log(`✅ Utils加载成功, 请继续`);
            resolve(creatUtils());
        });
    });
}

//
function getEnv(...keys){for(let key of keys){var value=$.isNode()?process.env[key]||process.env[key.toUpperCase()]||process.env[key.toLowerCase()]||$.getdata(key):$.getdata(key);if(value)return value;}};

//
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,a)=>{s.call(this,t,(t,s,r)=>{t?a(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.encoding="utf-8",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}getEnv(){return"undefined"!=typeof $environment&&$environment["surge-version"]?"Surge":"undefined"!=typeof $environment&&$environment["stash-version"]?"Stash":"undefined"!=typeof module&&module.exports?"Node.js":"undefined"!=typeof $task?"Quantumult X":"undefined"!=typeof $loon?"Loon":"undefined"!=typeof $rocket?"Shadowrocket":void 0}isNode(){return"Node.js"===this.getEnv()}isQuanX(){return"Quantumult X"===this.getEnv()}isSurge(){return"Surge"===this.getEnv()}isLoon(){return"Loon"===this.getEnv()}isShadowrocket(){return"Shadowrocket"===this.getEnv()}isStash(){return"Stash"===this.getEnv()}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const a=this.getdata(t);if(a)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,a)=>e(a))})}runScript(t,e){return new Promise(s=>{let a=this.getdata("@chavy_boxjs_userCfgs.httpapi");a=a?a.replace(/\n/g,"").trim():a;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[i,o]=a.split("@"),n={url:`http://${o}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":i,Accept:"*/*"},timeout:r};this.post(n,(t,e,a)=>s(a))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),a=!s&&this.fs.existsSync(e);if(!s&&!a)return{};{const a=s?t:e;try{return JSON.parse(this.fs.readFileSync(a))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),a=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):a?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const a=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of a)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,a)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[a+1])>>0==+e[a+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,a]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,a,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,a,r]=/^@(.*?)\.(.*?)$/.exec(e),i=this.getval(a),o=a?"null"===i?null:i||"{}":"{}";try{const e=JSON.parse(o);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),a)}catch(e){const i={};this.lodash_set(i,r,t),s=this.setval(JSON.stringify(i),a)}}else s=this.setval(t,e);return s}getval(t){switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":return $persistentStore.read(t);case"Quantumult X":return $prefs.valueForKey(t);case"Node.js":return this.data=this.loaddata(),this.data[t];default:return this.data&&this.data[t]||null}}setval(t,e){switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":return $persistentStore.write(t,e);case"Quantumult X":return $prefs.setValueForKey(t,e);case"Node.js":return this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0;default:return this.data&&this.data[e]||null}}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){switch(t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"],delete t.headers["content-type"],delete t.headers["content-length"]),t.params&&(t.url+="?"+this.queryStr(t.params)),this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":default:this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,a)=>{!t&&s&&(s.body=a,s.statusCode=s.status?s.status:s.statusCode,s.status=s.statusCode),e(t,s,a)});break;case"Quantumult X":this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:a,headers:r,body:i,bodyBytes:o}=t;e(null,{status:s,statusCode:a,headers:r,body:i,bodyBytes:o},i,o)},t=>e(t&&t.error||"UndefinedError"));break;case"Node.js":let s=require("iconv-lite");this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:a,statusCode:r,headers:i,rawBody:o}=t,n=s.decode(o,this.encoding);e(null,{status:a,statusCode:r,headers:i,rawBody:o,body:n},n)},t=>{const{message:a,response:r}=t;e(a,r,r&&s.decode(r.rawBody,this.encoding))})}}post(t,e=(()=>{})){const s=t.method?t.method.toLocaleLowerCase():"post";switch(t.body&&t.headers&&!t.headers["Content-Type"]&&!t.headers["content-type"]&&(t.headers["content-type"]="application/x-www-form-urlencoded"),t.headers&&(delete t.headers["Content-Length"],delete t.headers["content-length"]),this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":default:this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient[s](t,(t,s,a)=>{!t&&s&&(s.body=a,s.statusCode=s.status?s.status:s.statusCode,s.status=s.statusCode),e(t,s,a)});break;case"Quantumult X":t.method=s,this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:a,headers:r,body:i,bodyBytes:o}=t;e(null,{status:s,statusCode:a,headers:r,body:i,bodyBytes:o},i,o)},t=>e(t&&t.error||"UndefinedError"));break;case"Node.js":let a=require("iconv-lite");this.initGotEnv(t);const{url:r,...i}=t;this.got[s](r,i).then(t=>{const{statusCode:s,statusCode:r,headers:i,rawBody:o}=t,n=a.decode(o,this.encoding);e(null,{status:s,statusCode:r,headers:i,rawBody:o,body:n},n)},t=>{const{message:s,response:r}=t;e(s,r,r&&a.decode(r.rawBody,this.encoding))})}}time(t,e=null){const s=e?new Date(e):new Date;let a={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in a)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?a[e]:("00"+a[e]).substr((""+a[e]).length)));return t}queryStr(t){let e="";for(const s in t){let a=t[s];null!=a&&""!==a&&("object"==typeof a&&(a=JSON.stringify(a)),e+=`${s}=${a}&`)}return e=e.substring(0,e.length-1),e}msg(e=t,s="",a="",r){const i=t=>{switch(typeof t){case void 0:return t;case"string":switch(this.getEnv()){case"Surge":case"Stash":default:return{url:t};case"Loon":case"Shadowrocket":return t;case"Quantumult X":return{"open-url":t};case"Node.js":return}case"object":switch(this.getEnv()){case"Surge":case"Stash":case"Shadowrocket":default:{let e=t.url||t.openUrl||t["open-url"];return{url:e}}case"Loon":{let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}case"Quantumult X":{let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl,a=t["update-pasteboard"]||t.updatePasteboard;return{"open-url":e,"media-url":s,"update-pasteboard":a}}case"Node.js":return}default:return}};if(!this.isMute)switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":default:$notification.post(e,s,a,i(r));break;case"Quantumult X":$notify(e,s,a,i(r));break;case"Node.js":}if(!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),a&&t.push(a),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":case"Quantumult X":default:this.log("",`❗️${this.name}, 错误!`,t);break;case"Node.js":this.log("",`❗️${this.name}, 错误!`,t.stack)}}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;switch(this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":case"Quantumult X":default:$done(t);break;case"Node.js":process.exit(1)}}}(t,e)}
