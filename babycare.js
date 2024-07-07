#!name=babycare小程序签到
#!desc=
#!category=羊毛

[Script]
babycare_获取cookie = type=http-response,pattern=^https:\/\/api\.bckid\.com\.cn\/operation\/front\/bonus\/userSign\/v3\/sign,script-path=https://raw.githubusercontent.com/AZ-Y/scriptable/main/babycarerw.js,requires-body=1,max-size=0
babycare = type=cron,cronexp="8 8,16 * * *",script-path=https://raw.githubusercontent.com/AZ-Y/scriptable/main/babycarerw.js,script-update-interval=0,timeout=3600,wake-system=1,engine=jsc

[MITM]
hostname = api.bckid.com.cn
