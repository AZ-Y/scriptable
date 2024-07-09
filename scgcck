#!name=四川观察
#!desc=四川观察
#!category=羊毛

[Script]
四川观察_获取cookie = type=http-response,pattern=^https:\/\/gw\.scgchc\.com\/app\/v1\/mall\/user\/getSignInfo,requires-body=1,max-size=0,script-path=https://raw.githubusercontent.com/AZ-Y/scriptable/main/scgcrw.js
四川观察_签到 = type=cron,cronexp="8 8,16 * * *",script-path=https://raw.githubusercontent.com/AZ-Y/scriptable/main/scgcrw.js,script-update-interval=0,timeout=3600,wake-system=1,engine=jsc

[MITM]
hostname = gw.scgchc.com
