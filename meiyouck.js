#!name=美柚app签到
#!desc=美柚app签到
#!category=羊毛

[Script]
美柚_获取cookie = type=http-response,pattern=^https:\/\/member\.guoyuejiu\.com\/api\/user\/history,script-path=https://raw.githubusercontent.com/AZ-Y/scriptable/main/meiyourw.js,requires-body=1,max-size=0
美柚 = type=cron,cronexp="8 8,16 * * *",script-path=https://raw.githubusercontent.com/AZ-Y/scriptable/main/meiyourw.js,script-update-interval=0,timeout=3600,wake-system=1,engine=jsc

[MITM]
hostname =  coin-api.youzibuy.com
