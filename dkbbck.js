[Script]
登康贝比商城_获取cookie = type=http-response,pattern=^https:\/\/hx\.hemiao100\.com\/backg\/signed\/hmSignedActivityInfo\/small,script-path=https://raw.githubusercontent.com/AZ-Y/scriptable/main/dkbb.js,requires-body=1,max-size=0
登康贝比商城 = type=cron,cronexp="8 8,16 * * *",script-path=https://raw.githubusercontent.com/AZ-Y/scriptable/main/dkbb.js,script-update-interval=0,timeout=3600,wake-system=1,engine=jsc

[MITM]
hostname =  hx.hemiao100.com
