#!name=汤臣倍健营养家
#!desc=汤臣倍健营养家
#!category=羊毛

[Script]
汤臣倍健营养家_获取cookie = type=http-response,pattern=^https:\/\/hdyx\.by\-health\.com\/taskCenter\/api\/sign\/saveSign,script-path=https://raw.githubusercontent.com/AZ-Y/scriptable/main/tcbj.js,requires-body=1,max-size=0
汤臣倍健营养家 = type=cron,cronexp="8 8,16 * * *",script-path=https://raw.githubusercontent.com/AZ-Y/scriptable/main/tcbj.js,script-update-interval=0,timeout=3600,wake-system=1,engine=jsc

[MITM]
hostname =  hdyx.by-health.com
