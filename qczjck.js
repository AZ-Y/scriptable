#!name=囯乐酱酒
#!desc=囯乐酱酒
#!category=羊毛

[Script]
囯乐酱酒_获取cookie = type=http-response,pattern=^https:\/\/lapp\.api\.autohome\.com\.cn\/openapi2\/cloud\/bdp\/autohome\/usersignin\/signin,script-path=https://raw.githubusercontent.com/AZ-Y/scriptable/main/qczjrw.js,requires-body=1,max-size=0
囯乐酱酒 = type=cron,cronexp="8 8,16 * * *",script-path=https://raw.githubusercontent.com/AZ-Y/scriptable/main/qczjrw.js,script-update-interval=0,timeout=3600,wake-system=1,engine=jsc

[MITM]
hostname =  lapp.api.autohome.com.cn
