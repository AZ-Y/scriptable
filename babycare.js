#!name=Bckid API 自动抓包
#!desc=用于自动处理 Bckid API 的请求
#!category=抓包

[Script]
bckid_api_fetch = type=http-response,pattern=^https:\/\/api.bckid.com.cn\/operation\/front\/bonus\/userTask\/list,script-path=https://raw.githubusercontent.com/yang7758258/ohhh154/main/babycare.js,requires-body=1,max-size=0

[MITM]
hostname = %APPEND% api.bckid.com.cn

[Script Contents]

const url = `https://api.bckid.com.cn/operation/front/bonus/userTask/list`;
const method = `POST`;
const headers = {
  'Accept-Encoding': `gzip,compress,br,deflate`,
  'content-type': `application/json`,
  'Connection': `keep-alive`,
  'Referer': `https://servicewechat.com/wxab5642d7bced2dcc/390/page-frame.html`,
  'user-agent-bckid': `bckid; miniProgram; 2.79.67; iPhone iPhone 13<iPhone14,5>; iOS 16.1.2; ;1002;`,
  'Host': `api.bckid.com.cn`,
  'Authorization': `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlblZlcnNpb24iOjE4MDkwODk3MDAzODMwMDY3MjEsImNsaWVudE9zIjoyLCJpZCI6IjE4MDg3OTQxODM0NzE1MzgxNzgiLCJleHAiOjE3MjA3NjAzNzB9.TkRm-bYK7mKde0eOfOywuWsdo9ce_WqGTKn-Sv4uxow`,
  'User-Agent': `Mozilla/5.0 (iPhone; CPU iPhone OS 16_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.49(0x18003137) NetType/WIFI Language/zh_CN`
};
const body = ``;

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
