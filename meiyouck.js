#!name=美柚app签到
#!desc=美柚app签到
#!category=羊毛

[Script]
美柚_获取cookie = type=http-response,pattern=^https:\/\/coin-api\.youzibuy\.com\/api\/member_task\/report\?app_id=01&bcTopAccessToken=&channelID=AppStore&isJdInstall=1&isPddInstall=1&isTbInstall=1&isTteInstall=0&lang=zh&mode=3&nonce=xaVfNGhNSqJPv1Ov&platform=ios&scale=3.0&themeid=0&timestamp=1720566445&v=8.7.5&v1=8.75.0.0&sign=9d3ef3b655f2d897940a3c7dd516675c,script-path=https://raw.githubusercontent.com/AZ-Y/scriptable/main/meiyourw.js,requires-body=1,max-size=0
美柚 = type=cron,cronexp="8 8,16 * * *",script-path=https://raw.githubusercontent.com/AZ-Y/scriptable/main/meiyourw.js,script-update-interval=0,timeout=3600,wake-system=1,engine=jsc

[MITM]
hostname = coin-api.youzibuy.com
