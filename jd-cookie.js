
/*
------------------------------------------
[rewrite_local]
^https?:\/\/api\.m\.jd\.com\/client\.action\?functionId=(wareBusiness|serverConfig|basicConfig) url script-response-body https://raw.githubusercontent.com/AZ-Y/scriptable/refs/heads/main/jd-cookie.js

[MITM]
hostname = %APPEND% api.m.jd.com

====================================*/

const $ = new Env('JD Cookie');
$.cookie_key = 'jdCookie';
$.cookies = $.getdata($.cookie_key);
$.is_debug = $.getdata('is_debug');

!(async () => {
  // 检查请求是否存在
  if (typeof $request !== `undefined`) {
    GetCookie($request);
  } else {
    $.msg('错误', '', '无请求数据，脚本无法运行');
    $.done({});
  }

  function GetCookie(request) {
    // 检查请求中是否存在 Cookie
    if (request.headers && request.headers['Cookie']) {
      let rawCookie = request.headers['Cookie'];
      debug('获取的 Cookie:', rawCookie);

      // 从 Cookie 中提取 pt_pin 和 pt_key
      let ptPinMatch = rawCookie.match(/pt_pin=([^;]+)/);
      let ptKeyMatch = rawCookie.match(/pt_key=([^;]+)/);
      
      if (ptPinMatch && ptKeyMatch) {
        let ptPin = ptPinMatch[1];
        let ptKey = ptKeyMatch[1];
        let jdCookie = `pt_pin=${ptPin};pt_key=${ptKey};`;

        // 获取现有的 jdCookie，并连接新的 cookie
        let existingCookies = $.cookies || '';
        if (existingCookies) {
          existingCookies += '&'; // 用 & 隔开多个账号
        }
        existingCookies += jdCookie; // 添加新的 cookie

        // 保存更新后的 cookie
        $.setdata(existingCookies, $.cookie_key);
        $.msg('Cookie 已保存', '', `获取的 Cookie: ${jdCookie}`);
      } else {
        $.msg('错误', '', '无法从 Cookie 提取 pt_pin 或 pt_key');
      }
    } else {
      debug('未能获取到 Cookie');
    }
  };

  function debug(text) {
    if ($.is_debug === 'true') {
      console.log(text);
    }
  }

})()
.catch((e) => $.logErr(e))
.finally(() => $.done());

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
