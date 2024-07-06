    const topspace = "GoJsWDOBkJ1zazOlyy4VQQB6CmgJWdnZ&53555ab5e1bc443cb5dda125fb2e26d4";

if (!topspace) {
    console.log("请设置环境变量 'topspace' 后再运行");
    $done();
} else {
    const topspaceList = topspace.split('@');

    (async () => {
        for (const [index, topspaceItem] of topspaceList.entries()) {
            const [x_vcs_user_token, app_id] = topspaceItem.split('&');
            const headers = {
                'User-Agent': "Mozilla/5.0 (Linux; Android 12; RMX3562 Build/SP1A.210812.016; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/122.0.6261.120 Mobile Safari/537.36 XWEB/1220133 MMWEBSDK/20240404 MMWEBID/2307 MicroMessenger/8.0.49.2600(0x28003133) WeChat/arm64 Weixin NetType/WIFI Language/zh_CN ABI/arm64 MiniProgramEnv/android",
                'app-id': app_id,
                'x-vcs-user-token': x_vcs_user_token
            };

            console.log(`=====开始执行第${index + 1}个账号任务=====`);

            // Fetch user info
            const userInfoUrl = "https://m.sda.changan.com.cn/app-apigw/user-info-api/api/v1/sda-app/personal-info/basic-information";
            try {
                const userInfoResponse = await httpRequest('GET', userInfoUrl, headers);
                const userInfoData = JSON.parse(userInfoResponse);
                if (userInfoData.code === 0) {
                    const userNickname = userInfoData.data.userNickname;
                    const totalPoints = userInfoData.data.pointInfo.totalPoints;
                    console.log(`用户:${userNickname}当前共有${totalPoints}币`);

                    // Check-in
                    const checkInUrl = "https://m.sda.changan.com.cn/app-apigw/user-info-api/api/v2/point/check-in";
                    const checkInResponse = await httpRequest('POST', checkInUrl, headers);
                    const checkInData = JSON.parse(checkInResponse);
                    if (checkInData.code === 0) {
                        const description = checkInData.data.description;
                        const total = checkInData.data.total;
                        console.log(`用户:${userNickname}${description}获得${total}TOP币`);
                    } else {
                        console.log(`签到失败: ${checkInData.msg}`);
                    }

                    // List articles
                    const listArticlesUrl = "https://m.sda.changan.com.cn/app-apigw/sda-zone-api/api/v1/post/list";
                    const listArticlesData = {
                        section_id: "1002",
                        page: { current_page: 1, page_size: 20 },
                        sort_type: "RECOMMEND_FIRST"
                    };
                    const listArticlesResponse = await httpRequest('POST', listArticlesUrl, headers, JSON.stringify(listArticlesData));
                    const listArticlesJson = JSON.parse(listArticlesResponse);
                    if (listArticlesJson.code === 0) {
                        const articleId = listArticlesJson.data.list[0].id;
                        console.log(`用户:${userNickname}获取文章${articleId}`);

                        // Publish comment
                        const publishCommentUrl = "https://m.sda.changan.com.cn/app-apigw/sda-zone-api/api/v1/comment/publish";
                        const publishCommentData = {
                            content: "很酷",
                            post_id: articleId
                        };
                        const publishCommentResponse = await httpRequest('POST', publishCommentUrl, headers, JSON.stringify(publishCommentData));
                        const publishCommentJson = JSON.parse(publishCommentResponse);
                        if (publishCommentJson.code === 0) {
                            console.log("发布成功");
                        } else {
                            console.log(`发布失败: ${publishCommentJson.msg}`);
                        }
// Share article
                        const shareArticleUrl = "https://m.sda.changan.com.cn/app-apigw/sda-zone-api/api/v1/action/share";
                        const shareArticleData = {
                            post_id: articleId
                        };
                        const shareArticleResponse = await httpRequest('POST', shareArticleUrl, headers, JSON.stringify(shareArticleData));
                        const shareArticleJson = JSON.parse(shareArticleResponse);
                        if (shareArticleJson.code === 0) {
                            console.log("转发成功");
                        } else {
                            console.log(`转发失败: ${shareArticleJson.msg}`);
                        }
                    } else {
                        console.log(`获取文章失败: ${listArticlesJson.msg}`);
                    }
                } else {
                    console.log(`登录失败: ${userInfoData.msg}`);
                }
            } catch (error) {
                console.error(`请求失败: ${error.message}`);
            }

            console.log("---------账号任务执行完毕---------");
        }
        $done();
    })();
}

async function httpRequest(method, url, headers, body = null) {
    return new Promise((resolve, reject) => {
        const options = {
            method: method,
            url: url,
            headers: headers,
            body: body,
            timeout: 10000 //设置超时时间为10秒
        };

        $task.fetch(options).then(response => {
            if (response.statusCode == 200) {
                resolve(response.body);
            } else {
                reject(new Error(response.body));
            }
        }).catch(error => {
            reject(error);
        });
    });
}
