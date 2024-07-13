
/**
 * @fileoverview Template to compose HTTP reqeuest.
 * 
 */

const url = `https://lapp.api.autohome.com.cn/openapi2/cloud/bdp/autohome/usersignin/signin`;
const method = `POST`;
const headers = {
'Accept-Encoding' : `gzip,compress,br,deflate`,
'content-type' : `application/x-www-form-urlencoded; charset=UTF-8`,
'Connection' : `keep-alive`,
'X-B3-TraceId' : `4b9392d3-9c72-0b49-7661-750c77e5e301`,
'Referer' : `https://servicewechat.com/wx84dd50b996d3d862/1100/page-frame.html`,
'Host' : `lapp.api.autohome.com.cn`,
'User-Agent' : `Mozilla/5.0 (iPhone; CPU iPhone OS 16_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.50(0x1800322e) NetType/4G Language/zh_CN`,
'X-B3-SpanId' : `4b9392d3-9c72-0b`
};
const body = `day=1&_appid=mini.wechat&uid=70828843&auth=2e49b120423f48b9897f954617920cd70438c32b&aid=5&_timestamp=1720832223&_sign=E9ED1C2E4E09CE06F4D11BFD8D8B5F0C`;

const myRequest = {
    url: url,
    method: method,
    headers: headers,
    body: body
};

$task.fetch(myRequest).then(response => {
    console.log(response.statusCode + "\n\n" + response.body);
    $done();
}, reason => {
    console.log(reason.error);
    $done();
});
