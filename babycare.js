#!name=Bckid API 自动抓包
#!desc=用于自动处理 Bckid API 的请求
#!category=抓包

[Script]
bckid获取token = type=http-response,pattern=^https:\/\/api.bckid.com.cn\/operation\/front\/bonus\/userTask\/list,script-path=https://raw.githubusercontent.com/yang7758258/ohhh154/main/babycare.js,requires-body=1,max-size=0

[MITM]
hostname = %APPEND% api.bckid.com.cn
