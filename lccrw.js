const cookieName = 'lvcchong'
const cookieKey = 'cookie_lvcchong'
const bodyKey = 'body_lvcchong'
const myRequest = {
  url: 'https://appapi.lvcchong.com/appBaseApi/redPacket/result',
  headers: {
    'Cookie': $prefs.valueForKey(cookieKey)
  }
};

$task.fetch(myRequest).then(response => {
  const responseBody = response.body;
  $prefs.setValueForKey(responseBody, bodyKey);
  console.log('Response Body:', responseBody);
  $notify('领红包', '获取cookie成功', '');
  $done();
}, reason => {
  console.log('Error:', reason.error);
  $notify('领红包', '获取cookie失败', reason.error);
  $done();
});

// 定时任务部分
const url = 'https://appapi.lvcchong.com/appBaseApi/redPacket/result';
const headers = {
  'Cookie': $prefs.valueForKey(cookieKey),
};

$task.fetch({ url, headers }).then(response => {
  const result = response.body;
  console.log('领取红包结果:', result);
  $notify('领红包', '领取红包成功', result);
  $done();
}, reason => {
  console.log('Error:', reason.error);
  $notify('领红包', '领取红包失败', reason.error);
  $done();
});
