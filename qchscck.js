#!name=七彩虹商城
#!desc=七彩虹商城
#!category=羊毛

[Script]
七彩虹商城_获取cookie = type=http-response,pattern=^https:\/\/hdyx\.by\-health\.com\/taskCenter\/api\/sign,script-path=https://raw.githubusercontent.com/AZ-Y/scriptable/main/qchsc.js,requires-body=1,max-size=0
七彩虹商城 = type=cron,cronexp="8 8,16 * * *",script-path=https://raw.githubusercontent.com/AZ-Y/scriptable/main/qchsc.js,script-update-interval=0,timeout=3600,wake-system=1,engine=jsc

[MITM]
hostname =  hdyx.by-health.com
