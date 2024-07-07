/**************************************
const url = `https://api.bckid.com.cn/operation/front/bonus/userSign/v3/sign`;
const method = `POST`;
const headers = {
'Accept-Encoding' : `gzip,compress,br,deflate`,
'content-type' : `application/json`,
'Connection' : `keep-alive`,
'Referer' : `https://servicewechat.com/wxab5642d7bced2dcc/390/page-frame.html`,
'user-agent-bckid' : `bckid; miniProgram; 2.79.67; iPhone iPhone 13<iPhone14,5>; iOS 16.1.2; ;1002;`,
'Host' : `api.bckid.com.cn`,
'Authorization' : `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlblZlcnNpb24iOjE4MDk5OTI1MjUyMjA2ODc4NzQsImNsaWVudE9zIjoyLCJpZCI6IjE4MDg3OTQxODM0NzE1MzgxNzgiLCJleHAiOjE3MjA5NzU2MjB9.XvSTVA6E34Fd7QhzM5zOEUxv4oWO118eTHKvXdAO-ws`,
'User-Agent' : `Mozilla/5.0 (iPhone; CPU iPhone OS 16_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.49(0x18003137) NetType/4G Language/zh_CN`
};
const body = `{}`;

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
