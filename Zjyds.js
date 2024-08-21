const axios = require('axios');

async function signIn() {
    const url = "https://zayeyapp.hzgsedu.cn/my/getCredit.htm";
    
    const headers = {
        'User-Agent': "Mozilla/5.0 (iPhone; CPU iPhone OS 16_1_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
        'uid': "2021",
        'deviceName': "phone",
        'token': "{MD5}om3XtagvxX6KkeY8xiwVIA==",
        'Accept-Language': "zh-CN,zh-Hans;q=0.9",
        'Cookie': "JSESSIONID=6832521AB0BBE58443D754DBA38A897E"
    };

    const params = {
        't': "1724123010429"
    };

    try {
        const response = await axios.get(url, { headers: headers, params: params });
        
        // 打印响应结果
        console.log(`Sign-in response: ${JSON.stringify(response.data)}`);
        
        // 检查签到状态
        if (response.data && response.data.result) {
            if (response.data.data) {
                sendNotification("签到成功", `签到操作已成功，数据: ${response.data.data}`);
            } else {
                sendNotification("签到已完成", "你已经签过到了，无法重复签到。");
            }
        } else {
            sendNotification("签到失败", "签到操作未成功，请检查。");
        }
        
    } catch (error) {
        console.error(`Failed to sign in. Error: ${error}`);
        sendNotification("签到失败", "发生错误，签到失败。");
    }
}

// 发送通知函数
function sendNotification(title, message) {
    console.log(`${title}: ${message}`);
    // 如果青龙支持通知，可以在这里调用通知 API，例如:
    // notify.sendNotify(title, message);
}

// 运行签到函数
signIn();
