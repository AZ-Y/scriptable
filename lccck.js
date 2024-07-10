#!name=领红包
#!desc=领红包
#!category=羊毛

[Script]
领红包_获取cookie = type=http-response,pattern=^https:\/\/appapi\.lvcchong\.com\/appBaseApi\/redPacket\/result$,script-path=https://raw.githubusercontent.com/AZ-Y/scriptable/main/lccrw.js,requires-body=1,max-size=0
领红包 = type=cron,cronexp="8 8,16 * * *",script-path=https://raw.githubusercontent.com/AZ-Y/scriptable/main/lccrw.js,script-update-interval=0,timeout=3600,wake-system=1,engine=jsc

[MITM]
hostname =  appapi.lvcchong.com
