[Script]
明基_获取cookie = type=http-response,pattern=^https:\/\/wit\-api\.benq\.com\.cn\/score,script-path=https://raw.githubusercontent.com/AZ-Y/scriptable/main/MJZM.js,requires-body=1,max-size=0
明基 = type=cron,cronexp="8 8,16 * * *",script-path=https://raw.githubusercontent.com/AZ-Y/scriptable/main/MJZM.js,script-update-interval=0,timeout=3600,wake-system=1,engine=jsc

[MITM]
hostname =  wit-api.benq.com.cn
