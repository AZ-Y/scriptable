#!name=雅迪星球
#!desc=雅迪星球
#!category=羊毛

[Script]
雅迪星球_获取cookie = type=http-response,pattern=^https:\/\/opmd\.yadea\.com\.cn\/api\/miniprogram\/custom-promotion\/memberSign,script-path=https://raw.githubusercontent.com/AZ-Y/scriptable/main/yadearw.js,requires-body=1,max-size=0
雅迪星球 = type=cron,cronexp="8 8,16 * * *",script-path=https://raw.githubusercontent.com/AZ-Y/scriptable/main/yadearw.js,script-update-interval=0,timeout=3600,wake-system=1,engine=jsc

[MITM]
hostname = %APPEND% opmd.yadea.com.cn
