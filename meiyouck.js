#!name=美柚app签到
#!desc=美柚app签到
#!category=羊毛

[Script]
# 获取美柚的cookie
美柚_获取cookie = type=http-response, pattern=^https:\/\/coin\-api\.youzibuy\.com\/checkin_v3, script-path=https://raw.githubusercontent.com/AZ-Y/scriptable/main/meiyourw.js, requires-body=1, max-size=0
  
[MITM]
hostname = coin-api.youzibuy.com
