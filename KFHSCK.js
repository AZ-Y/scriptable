[Script]
卡夫亨氏脚本_获取cookie = type=http-response,pattern=^https:\/\/kraftheinzcrm\-uat\.kraftheinz\.net\.cn\/crm\/public\/index\.php\/api,script-path=https://raw.githubusercontent.com/AZ-Y/scriptable/main/KFHS.js,requires-body=1,max-size=0
卡夫亨氏脚本 = type=cron,cronexp="8 8,16 * * *",script-path=https://raw.githubusercontent.com/AZ-Y/scriptable/main/KFHS.js,script-update-interval=0,timeout=3600,wake-system=1,engine=jsc

[MITM]
hostname =  kraftheinzcrm-uat.kraftheinz.net.cn
