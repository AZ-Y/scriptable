[Script]
交朋友_获取cookie = type=http-response,pattern=^https:\/\/smp\-api\.iyouke\.com\/dtapi,script-path=https://raw.githubusercontent.com/AZ-Y/scriptable/main/jgpy.js,requires-body=1,max-size=0
朋友 = type=cron,cronexp="8 8,16 * * *",script-path=https://raw.githubusercontent.com/AZ-Y/scriptable/main/jgpy.js,script-update-interval=0,timeout=3600,wake-system=1,engine=jsc

[MITM]
hostname =  smp-api.iyouke.com
