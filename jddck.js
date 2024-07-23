#!name=金杜丹
#!desc=金杜丹
#!category=羊毛

[Script]
金杜丹_获取cookie = type=http-response,pattern=^https:\/\/tianxin\.jmd724\.com\/index=client\/v1\/task,script-path=https://raw.githubusercontent.com/AZ-Y/scriptable/main/jdd.js,requires-body=1,max-size=0
金杜丹 = type=cron,cronexp="8 8,16 * * *",script-path=https://raw.githubusercontent.com/AZ-Y/scriptable/main/jdd.js,script-update-interval=0,timeout=3600,wake-system=1,engine=jsc

[MITM]
hostname =  tianxin.jmd724.com
