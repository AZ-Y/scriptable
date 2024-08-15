[Script]
快乐达_获取cookie = type=http-response,pattern=^https:\/\/kld\.kldww\.com\/capi\/customer,script-path=https://raw.githubusercontent.com/AZ-Y/scriptable/main/KLD.js,requires-body=1,max-size=0
快乐达 = type=cron,cronexp="8 8,16 * * *",script-path=https://raw.githubusercontent.com/AZ-Y/scriptable/main/KLD.js,script-update-interval=0,timeout=3600,wake-system=1,engine=jsc

[MITM]
hostname =  kld.kldww.com
