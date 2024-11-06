
/*
------------------------------------------
[rewrite_local]
^https?:\/\/api\.m\.jd\.com\/client\.action\?functionId=(wareBusiness|serverConfig|basicConfig) url script-response-body https://raw.githubusercontent.com/AZ-Y/scriptable/refs/heads/main/jd-cookie.js

[MITM]
hostname = %APPEND% api.m.jd.com

====================================*/


const $ = new Env('JD Cookie');

// 这里设定你的 BoxJS 密钥
const BOXJS_KEY = 'jdCookie';

!(async () => {
  if (typeof $request !== 'undefined') {
    const request = $request;
    const cookieHeader = request.headers['Cookie'];
    if (cookieHeader) {
      // 提取pt_pin和pt_key
      const ptPinMatch = cookieHeader.match(/pt_pin=([^;]+)/);
      const ptKeyMatch = cookieHeader.match(/pt_key=([^;]+)/);
      if (ptPinMatch && ptKeyMatch) {
        const ptPin = ptPinMatch[1];
        const ptKey = ptKeyMatch[1];
        const jdCookie = `pt_pin=${ptPin};pt_key=${ptKey};`;

        // 储存 Cookie 到 BoxJS
        let existingCookie = $persistentStore.read(BOXJS_KEY) || '';
        if (existingCookie) {
          existingCookie += '&'; // 连接多个 Cookie
        }
        existingCookie += jdCookie;
        $persistentStore.write(existingCookie, BOXJS_KEY); // 更新 BoxJS 中的存储内容

        console.log(`Cookie 已保存: ${jdCookie}`);
        $notify('Cookie 已保存', '', `获取的 Cookie: ${jdCookie}`);
      } else {
        console.error('未能从获取的 Cookie 中提取 pt_pin 或 pt_key');
      }
    } else {
      console.error('请求中未包含 Cookie');
    }
  } else {
    console.error('请求未定义，可能无法获取 Cookie');
  }
})()
.catch((e) => console.error(`运行时错误: ${e}`))
.finally(() => console.log('脚本执行完成'));

// prettier-ignore
function Env(name, options) {
  class Request {
    constructor(env) {
      this.env = env;
    }
    send(url, method = "GET") {
      url = typeof url === "string" ? { url } : url;
      let sendMethod = this.get;
      if (method === "POST") {
        sendMethod = this.post;
      }
      return new Promise((resolve, reject) => {
        sendMethod.call(this.env, url, (error, response, result) => {
          error ? reject(error) : resolve(result);
        });
      });
    }
    get(url) {
      return this.send.call(this, url);
    }
    post(url) {
      return this.send.call(this, url, "POST");
    }
  }

  return new class {
    constructor(name, options) {
      this.name = name;
      this.http = new Request(this);
      this.data = null;
      this.dataFile = "box.dat"; 
      this.logs = [];
      this.isMute = false;
      this.isNeedRewrite = false;
      this.logSeparator = "\n";
      this.encoding = "utf-8";
      this.startTime = (new Date).getTime();
      Object.assign(this, options);
      this.log("", `🔔${this.name}, 开始!`);
    }

    isNode() { return typeof module !== "undefined" && !!module.exports; }
    isQuanX() { return typeof $task !== "undefined"; }
    isSurge() { return typeof $httpClient !== "undefined" && typeof $loon === "undefined"; }
    isLoon() { return typeof $loon !== "undefined"; }

    getdata(key) {
      if (this.isNode()) {
        this.fs = this.fs || require("fs");
        this.path = this.path || require("path");
        const filePath = this.path.resolve(this.dataFile);
        const cwdPath = this.path.resolve(process.cwd(), this.dataFile);
        const fileExists = this.fs.existsSync(filePath) || this.fs.existsSync(cwdPath);
        
        if (fileExists) {
          const fileUsed = this.fs.existsSync(filePath) ? filePath : cwdPath;
          try {
            return JSON.parse(this.fs.readFileSync(fileUsed));
          } catch (error) {
            return {};
          }
        } else return {};
      } else {
        return $persistentStore.read(key) || null; // 其他环境
      }
    }

    setdata(value, key) {
      if (this.isNode()) {
        this.fs = this.fs || require("fs");
        this.path = this.path || require("path");
        const filePath = this.path.resolve(this.dataFile);
        const cwdPath = this.path.resolve(process.cwd(), this.dataFile);
        
        // 婉拒操作
        if (this.fs.existsSync(filePath)) {
          this.fs.writeFileSync(filePath, JSON.stringify({ [key]: value }));
        } else {
          this.fs.writeFileSync(cwdPath, JSON.stringify({ [key]: value }));
        }
      } else {
        $persistentStore.write(value, key); // 其他环境
      }
    }

    msg(title = this.name, subtitle = "", body = "") {
      if (!this.isMute) {
        if (this.isSurge() || this.isLoon()) {
          $notification.post(title, subtitle, body);
        } else if (this.isQuanX()) {
          $notify(title, subtitle, body);
        }
      }
      this.log(title, subtitle, body);
    }

    log(...messages) {
      console.log(messages.join(this.logSeparator));
    }

    logErr(e) {
      console.error(`❗️${this.name} 错误: ${e}`);
    }

    done(data = {}) {
      const elapsedTime = (new Date).getTime() - this.startTime;
      console.log(`🔔${this.name}, 结束! 🕛 ${elapsedTime / 1000} 秒`);
      if (this.isSurge() || this.isQuanX() || this.isLoon()) {
        $done(data);
      }
    }
  }(name, options);
}
