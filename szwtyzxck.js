#!name=深圳湾体育中心
#!desc=深圳湾体育中心
#!category=羊毛

[Script]
深圳湾体育中心_获取cookie = type=http-response,pattern=^https:\/\/program\.springcocoon\.com\/szbay\/api\/services\/app,script-path=https://raw.githubusercontent.com/AZ-Y/scriptable/main/szwtyzx.js,requires-body=1,max-size=0
深圳湾体育中心 = type=cron,cronexp="8 8,16 * * *",script-path=https://raw.githubusercontent.com/AZ-Y/scriptable/main/szwtyzx.js,script-update-interval=0,timeout=3600,wake-system=1,engine=jsc

[MITM]
hostname =  program.springcocoon.com
