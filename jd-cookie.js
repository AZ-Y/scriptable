
/*
------------------------------------------
[rewrite_local]
^https?:\/\/api\.m\.jd\.com\/client\.action\?functionId=(wareBusiness|serverConfig|basicConfig) url script-response-body https://raw.githubusercontent.com/AZ-Y/scriptable/refs/heads/main/jd-cookie.js

[MITM]
hostname = %APPEND% api.m.jd.com

====================================*/



// 获取cookie
let cookie = $request.headers['Cookie'] || $request.headers['cookie'];
let ptPinMatch = cookie.match(/pt_pin=(.*?);/);
let ptKeyMatch = cookie.match(/pt_key=(.*?);/);
if (ptPinMatch && ptKeyMatch) {
    let pt_pin = ptPinMatch[1];
    let pt_key = ptKeyMatch[1];
    let newCookie = `pt_pin=${pt_pin};pt_key=${pt_key};`;
    let savedCookie = Keychain.get(`Cookie_${pt_pin}`);
    
    if (savedCookie !== newCookie) {
        let title = "Cookie 更新";
        let subtitle = `账号: ${pt_pin}`;
        let message = `新的Cookie: ${newCookie}`;
        
        if (typeof $notify !== 'undefined') {
            $notify(title, subtitle, message);
        }
        
        // 使用 Keychain 存储新的 Cookie
        Keychain.set(`Cookie_${pt_pin}`, newCookie);
        
        console.log(`获取的Cookie: ${newCookie}`);
    }
} else {
    if (typeof $notify !== 'undefined' || typeof $notification !== 'undefined') {
        let errorTitle = "Cookie 错误";
        let errorMessage = "无法提取 pt_pin 或 pt_key。";
        $notify ? $notify(errorTitle, "", errorMessage) : $notification.post(errorTitle, "", errorMessage);
    }
    console.log("无法提取 pt_pin 或 pt_key。");
}

if (typeof $done !== 'undefined') {
    $done({});
}
