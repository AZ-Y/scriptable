[Script]
欧普_获取cookie = type=http-response,pattern=^https:\/\/kfscrm\.opple\.com\/opple\/scrm\/mkt\/activities,script-path=https://raw.githubusercontent.com/AZ-Y/scriptable/main/OPZM.js,requires-body=1,max-size=0
欧普 = type=cron,cronexp="8 8,16 * * *",script-path=https://raw.githubusercontent.com/AZ-Y/scriptable/main/OPZM.js,script-update-interval=0,timeout=3600,wake-system=1,engine=jsc

[MITM]
hostname =  kfscrm.opple.com
