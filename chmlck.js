#!name=长虹美菱
#!desc=长虹美菱
#!category=羊毛

[Script]
长虹美菱_获取cookie = type=http-response,pattern=^https:\/\/hongke\.changhong\.com\/gw\/applet,script-path=https://raw.githubusercontent.com/AZ-Y/scriptable/main/chml.js,requires-body=1,max-size=0
长虹美菱 = type=cron,cronexp="8 8,16 * * *",script-path=https://raw.githubusercontent.com/AZ-Y/scriptable/main/chml.js,script-update-interval=0,timeout=3600,wake-system=1,engine=jsc

[MITM]
hostname =  http://hongke.changhong.com
