#!name=劲友家
#!desc=劲友家
#!category=羊毛

[Script]
劲友家_获取cookie = type=http-response,pattern=^https:\/\/jjw\.jingjiu\.com\/app\-jingyoujia\/app\/jingyoujia\/taskContinuousRecord,script-path=https://raw.githubusercontent.com/AZ-Y/scriptable/main/jyjrw.js,requires-body=1,max-size=0
劲友家 = type=cron,cronexp="8 8,16 * * *",script-path=https://raw.githubusercontent.com/AZ-Y/scriptable/main/jyjrw.js,script-update-interval=0,timeout=3600,wake-system=1,engine=jsc

[MITM]
hostname =  jjw.jingjiu.com
