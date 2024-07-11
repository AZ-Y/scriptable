#!name=囯乐酱酒
#!desc=囯乐酱酒
#!category=羊毛

[Script]
囯乐酱酒_获取cookie = type=http-response,pattern=^https:\/\/member\.guoyuejiu\.com\/api\/user\/score\?current=1&size=20,script-path=https://raw.githubusercontent.com/AZ-Y/scriptable/main/gljjrw.js,requires-body=1,max-size=0
囯乐酱酒 = type=cron,cronexp="8 8,16 * * *",script-path=https://raw.githubusercontent.com/AZ-Y/scriptable/main/gljjrw.js,script-update-interval=0,timeout=3600,wake-system=1,engine=jsc

[MITM]
hostname =  member.guoyuejiu.com
