[Script]
水_获取cookie = type=http-response,pattern=^https:\/\/mi\.shuixing\.cn\/wechat\/mini\/p\/cs\/mi\/vp\/interact,script-path=https://raw.githubusercontent.com/AZ-Y/scriptable/main/SXJF.js,requires-body=1,max-size=0
水 = type=cron,cronexp="8 8,16 * * *",script-path=https://raw.githubusercontent.com/AZ-Y/scriptable/main/SXJF.js,script-update-interval=0,timeout=3600,wake-system=1,engine=jsc

[MITM]
hostname =  mi.shuixing.cn
