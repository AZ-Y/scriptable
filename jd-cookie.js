
/*
------------------------------------------
[rewrite_local]
^https?:\/\/api\.m\.jd\.com\/client\.action\?functionId=(wareBusiness|serverConfig|basicConfig) url script-response-body https://gist.githubusercontent.com/AZ-Y/4d999668c01a0642ca4ad9eee77e3e50/raw/eef5349c1ae02868006cd33986c756df00757208/Jdtoken.js

[MITM]
hostname = %APPEND% api.m.jd.com

====================================
*/
const $ = new Env('Jd cookie');
$.jdCookieKey = 'jdCookie';
$.jdCookie = $.getdata($.jdCookieKey);
$.isDebug = $.getdata('is_debug');

function getAndStoreJdCookie() {
  try {
    let rawCookie = $request.headers['Cookie'] || $request.headers['cookie'];
    if (rawCookie) {
      let ptPinMatch = rawCookie.match(/pt_pin=([^;]+);/);
      let ptKeyMatch = rawCookie.match(/pt_key=([^;]+);/);
      if (ptPinMatch && ptKeyMatch) {
        let ptPin = ptPinMatch[1];
        let jdCookie = `pt_pin=${ptPin};pt_key=${ptKeyMatch[1]};`;
        let previousJdCookie = $.getdata($.jdCookieKey);
        if (jdCookie !== previousJdCookie) {
          $.setdata(jdCookie, $.jdCookieKey);
          if (previousJdCookie) {
            $.notifySuccess(`JD Cookie 已更新`, jdCookie);
          } else {
            $.notifySuccess(`新增 JD Cookie`, jdCookie);
          }
        } else {
          $.log(`JD Cookie 未发生变化`);
        }
      } else {
        $.notifyError('错误', '无法从 Cookie 中提取 pt_pin 或 pt_key');
      }
    } else {
      $.notifyError('错误', '无法获取 Cookie');
    }
  } catch (e) {
    $.logErr(e);
    $.notifyError('错误', '获取 Cookie 出现异常');
  } finally {
    $.done({});
  }
}

getAndStoreJdCookie();

function Env(t, e) {
  class s {
    constructor(t) {
      this.env = t
    }

    send(t, e = "GET") {
      t = "string" == typeof t ? {
        url: t
      } : t;
      let s = this.get;
      return "POST" === e && (s = this.post), new Promise((e, i) => {
        s.call(this.env, t, ((t, s, o) => {
          t ? i(t) : e(s)
        }))
      })
    }

    get(t) {
      return this.send.call(this.env, t)
    }

    post(t) {
      return this.send.call(this.env, t, "POST")
    }
  }

  return new class {
    constructor(t, e) {
      this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.encoding = "utf-8", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`)
    }

    isNode() {
      return "undefined" != typeof module && !!module.exports
    }

    isQuanX() {
      return "undefined" != typeof $task
    }

    isSurge() {
      return "undefined" != typeof $httpClient && "undefined" == typeof $loon
    }

    isLoon() {
      return "undefined" != typeof $loon
    }

    isJSBox() {
      return "undefined" != typeof $app && "undefined" != typeof $http
    }

    getdata(t) {
      if (this.isNode()) {
        this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path");
        const e = this.path.resolve(this.dataFile),
          s = this.path.resolve(process.cwd(), this.dataFile),
          i = this.fs.existsSync(e),
          o = !i && this.fs.existsSync(s);
        if (i || o) {
          const i = i ? e : s;
          try {
            return JSON.parse(this.fs.readFileSync(i))
          } catch (t) {
            return {}
          }
        } else return {}
      } else return {}
    }

    setdata(t, e) {
      if (this.isNode()) {
        this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path");
        const s = this.path.resolve(this.dataFile),
          i = this.path.resolve(process.cwd(), this.dataFile),
          o = this.fs.existsSync(s),
          r = !o && this.fs.existsSync(i),
          a = JSON.stringify(t);
        o ? this.fs.writeFileSync(s, a) : r ? this.fs.writeFileSync(i, a) : this.fs.writeFileSync(s, a)
      } else this.data = this.data ? this.data : {};
      return this.data[e] = t, this.data
    }

    getval(t) {
      return this.getdata(t)
    }

    setval(t, e) {
      return this.setdata(t, e)
    }

    get(t, e) {
      return this.send.call(this, t, e)
    }

    post(t, e) {
      return this.send.call(this, t, "POST", e)
    }

    msg(e = this.name, s = "", i = "", o = {}) {
      const r = t => {
        if (!t) return t;
        if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? {
          "open-url": t
        } : this.isSurge() ? {
          url: t
        } : void 0;
        if ("object" == typeof t) {
          if (this.isLoon()) {
            let e = t.openUrl || t.url || t["open-url"],
              s = t.mediaUrl || t["media-url"];
            return {
              openUrl: e,
              mediaUrl: s
            }
          }
          if (this.isQuanX()) {
            let e = t["open-url"] || t.url || t.openUrl,
              s = t["media-url"] || t.mediaUrl;
            return {
              "open-url": e,
              "media-url": s
            }
          }
          if (this.isSurge()) {
            let e = t.url || t.openUrl || t["open-url"];
            return {
              url: e
            }
          }
        }
      };
      this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, r(o)) : this.isQuanX() && $notify(e, s, i, r(o)));
      let h = ["", "==============📣系统通知📣=============="];
      h.push(e), s && h.push(s), i && h.push(i), console.log(h.join("\n")), this.logs = this.logs.concat(h)
    }

    log(...t) {
      t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator))
    }

    logErr(t, e) {
      const s = !this.isSurge() && !this.isQuanX() && !this.isLoon();
      s ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t)
    }

    wait(t) {
      return new Promise(e => setTimeout(e, t))
    }

    done(t = {}) {
      const e = (new Date).getTime() - this.startTime,
        s = e / 1e3;
      this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t)
    }

    notifySuccess(title, message, options = {}) {
      this.msg(title, '', message, options);
    }

    notifyError(title, message, options = {}) {
      this.msg(title, '', message, { ...options, icon: '❌' });
    }
  }(t, e)
}
