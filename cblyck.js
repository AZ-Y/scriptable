#!name=臭宝乐园
#!desc=臭宝乐园
#!category=羊毛

[Script]
臭宝乐园_获取cookie = type=http-response,pattern=^https:\/\/cbxcx\.weinian\.com\.cn\/wnuser\/v1\/memberUser\/daySign,script-path=https://raw.githubusercontent.com/AZ-Y/scriptable/main/cbly.js,requires-body=1,max-size=0
臭宝乐园 = type=cron,cronexp="8 8,16 * * *",script-path=https://raw.githubusercontent.com/AZ-Y/scriptable/main/cbly.js,script-update-interval=0,timeout=3600,wake-system=1,engine=jsc

[MITM]
hostname =  cbxcx.weinian.com.cn
