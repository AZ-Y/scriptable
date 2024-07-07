/**
 * Quantumult X script to extract and store the Authorization header from a specific request.
 */

const url = `https://opmd.yadea.com.cn/api/miniprogram/custom-promotion/memberSign`;

if ($request && $request.url.indexOf(url) !== -1) {
    const authorization = $request.headers['Authorization'];
    
    if (authorization) {
        $prefs.setValueForKey(authorization, "yadea_authorization");
        console.log(`Authorization: ${authorization}`);
    } else {
        console.log("Authorization header not found.");
    }
}

$done({});
