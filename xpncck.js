#!name=兴攀农场
#!desc=兴攀农场
#!category=羊毛

[Script]
兴攀农场_获取cookie = type=http-response,pattern=^https:\/\/p\.xpfarm\.cn\/treemp\/user\.PersonalCenter\/addSignIn,script-path=https://raw.githubusercontent.com/AZ-Y/scriptable/main/xpnc.js,requires-body=1,max-size=0
兴攀农场 = type=cron,cronexp="8 8,16 * * *",script-path=https://raw.githubusercontent.com/AZ-Y/scriptable/main/xpnc.js,script-update-interval=0,timeout=3600,wake-system=1,engine=jsc

[MITM]
hostname = %APPEND% p.xpfarm.cn
