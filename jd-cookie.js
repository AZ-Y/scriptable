
/*
------------------------------------------
[rewrite_local]
^https?:\/\/api\.m\.jd\.com\/client\.action\?functionId=(wareBusiness|serverConfig|basicConfig) url script-response-body https://raw.githubusercontent.com/AZ-Y/scriptable/refs/heads/main/jd-cookie.js

[MITM]
hostname = %APPEND% api.m.jd.com

====================================*/


/*
------------------------------------------
[rewrite_local]
^https?:\/\/api\.m\.jd\.com\/client\.action\?functionId=(wareBusiness|serverConfig|basicConfig) url script-response-body https://raw.githubusercontent.com/AZ-Y/scriptable/refs/heads/main/jd-cookie.js

[MITM]
hostname = %APPEND% api.m.jd.com

====================================*/

const $ = new Env('JD Multi Cookie');

function getAndStoreJdCookie() {
  try {
    let rawCookie = $request.headers['Cookie'] || $request.headers['cookie'];
    console.log('获取的 Cookie:', rawCookie);

    if (rawCookie) {
      // 解析 pt_pin 和 pt_key
      let ptPinMatch = rawCookie.match(/pt_pin=([^;]+);/);
      let ptKeyMatch = rawCookie.match(/pt_key=([^;]+);/);
      
      if (ptPinMatch && ptKeyMatch) {
        let ptPin = ptPinMatch[1]; // 改正这里: Pin应为ptPinMatch
        let jdCookie = `pt_pin=${ptPin};pt_key=${ptKeyMatch[1]};`;
        console.log('要保存的 JD Cookie:', jdCookie);

        // 获取现有 jdCookie，并连接新的 cookie
        let existingCookies = $.getdata('jdCookie') || '';
        if (existingCookies) {
          existingCookies += '&'; // 用 & 隔开多个账号
        }
        existingCookies += jdCookie; // 添加新的cookie到现有

        // 保存更新后的 cookie
        $.setdata(existingCookies, 'jdCookie');
        console.log('JD Cookie 已保存:', $.getdata('jdCookie')); // 确认保存

        $.msg(`JD Cookie 已更新`, `账号: ${ptPin}`, jdCookie);
      } else {
        $.msg('错误', '', '无法从 Cookie 提取 pt_pin 或 pt_key');
      }
    } else {
      $.msg('错误', '', '无法获取 Cookie');
    }
  } catch (e) {
    $.logErr(e);
    $.msg('错误', '', '获取 Cookie 出现异常');
  } finally {
    $.done({});
  }
}

getAndStoreJdCookie();



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
    isJSBox() { return typeof $app !== "undefined" && typeof $http !== "undefined"; }

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
      } else return {};
    }

    setdata(value, key) {
      if (this.isNode()) {
        this.fs = this.fs || require("fs");
        this.path = this.path || require("path");
        const filePath = this.path.resolve(this.dataFile);
        const cwdPath = this.path.resolve(process.cwd(), this.dataFile);
        const fileExists = this.fs.existsSync(filePath) || this.fs.existsSync(cwdPath);
        
        const jsonData = JSON.stringify(value);
        if (fileExists) {
          if (this.fs.existsSync(filePath)) {
            this.fs.writeFileSync(filePath, jsonData);
          } else {
            this.fs.writeFileSync(cwdPath, jsonData);
          }
        } else {
          this.fs.writeFileSync(filePath, jsonData);
        }
      } else {
        this.data = this.data || {};
        return (this.data[key] = value, this.data);
      }
    }

    getval(key) { return this.getdata(key); }
    setval(value, key) { return this.setdata(value, key); }

    get(url, options) { return this.send.call(this, url, options); }
    post(url, options) { return this.send.call(this, url, "POST", options); }

    msg(title = this.name, subtitle = "", body = "", options = {}) {
      const formatOptions = (opts) => {
        if (!opts) return opts;
        if (typeof opts === "string") {
          return this.isLoon() ? opts : this.isQuanX() ? { "open-url": opts } : this.isSurge() ? { url: opts } : void 0;
        }
        if (typeof opts === "object") {
          if (this.isLoon()) {
            const { openUrl, url, mediaUrl } = opts;
            return { openUrl: openUrl || url || opts["open-url"], mediaUrl: mediaUrl || opts["media-url"] };
          }
          if (this.isQuanX()) {
            const { openUrl, url, mediaUrl } = opts;
            return { "open-url": openUrl || url || opts.openUrl, "media-url": mediaUrl || opts.mediaUrl };
          }
          if (this.isSurge()) {
            const { url, openUrl } = opts;
            return { url: url || openUrl || opts["open-url"] };
          }
        }
      };

      if (!this.isMute) {
        this.isSurge() || this.isLoon() ? $notification.post(title, subtitle, body, formatOptions(options)) : this.isQuanX() && $notify(title, subtitle, body, formatOptions(options));
      }
      
      const logContent = ["", "==============📣系统通知📣=============="];
      logContent.push(title);
      if (subtitle) logContent.push(subtitle);
      if (body) logContent.push(body);
      console.log(logContent.join(this.logSeparator));
      this.logs = this.logs.concat(logContent);
    }

    log(...messages) {
      if (messages.length > 0) {
        this.logs = [...this.logs, ...messages];
        console.log(messages.join(this.logSeparator));
      }
    }

    logErr(error, context) {
      const isStrangeError = !this.isSurge() && !this.isQuanX() && !this.isLoon();
      isStrangeError ? this.log("", `❗️${this.name}, 错误!`, error.stack) : this.log("", `❗️${this.name}, 错误!`, error);
    }

    wait(timeout) { return new Promise(resolve => setTimeout(resolve, timeout)); }

    done(data = {}) {
      const elapsedTime = (new Date).getTime() - this.startTime;
      const elapsedSeconds = elapsedTime / 1000;
      this.log("", `🔔${this.name}, 结束! 🕛 ${elapsedSeconds} 秒`, this.logs.join(this.logSeparator));
      this.isSurge() || this.isQuanX() || this.isLoon() && $done(data);
    }
  }(name, options);
}
