[rewrite_local]
bckid_获取token = type=http-response,pattern=^https:\/\/api.bckid.com.cn\/operation\/front\/bonus\/userTask\/list,script-path=https://raw.githubusercontent.com/AZ-Y/scriptable/main/babycarerw.js,requires-body=1,max-size=0
[MITM]
hostname = api.bckid.com.cn
