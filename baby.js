// 获取CK.js

// 定义要请求的 URL
const request = {
    url: 'https://api.bckid.com.cn/product/front/product/detail/getProductPrePrice', // 替换为实际的请求 URL
    method: 'GET'
};

// 发起 HTTP 请求
$httpClient.get(request, function (error, response, data) {
    if (error) {
        console.log('请求失败:', error);
        return;
    }

    // 从响应头中提取 Cookie
    const cookies = response.headers['Set-Cookie'];
    if (cookies) {
        console.log('提取到的 Cookies:', cookies);
        $persistentStore.write(cookies, 'auth_cookies'); // 保存到持久化存储
    } else {
        console.log('未找到 Cookies');
    }
});
