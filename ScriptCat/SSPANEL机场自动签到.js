// ==UserScript==
// @name         SSPANEL机场自动签到
// @namespace    go28
// @version      1.1.0
// @crontab * * once * *
// @author       go28
// @debug
// @connect muniucloud.page
// @connect api.day.app
// @grant GM_xmlhttpRequest
// @grant GM_notification
// ==/UserScript==
//sendurl为手机推送地址，设置教程https://github.com/Finb/Bark/blob/master/README.md
var username = ''
var password = ''
var url = 'https://'
var sendurl=''

return new Promise((resolve, reject) => {
    logout();
    setTimeout(function(){
    GM_xmlhttpRequest({
        method: 'POST',
        url: url+'/auth/login',
        headers: {
            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "referrer": url+'/auth/login',
            "referrerPolicy": "strict-origin-when-cross-origin"
        },
        data: 'email=' + encodeURIComponent(username) + '&passwd=' + encodeURIComponent(password) + '&remember_me=on&code=',
        onload: function (xhr) {
            // GM_notification(xhr.status.toString);
            GM_notification(JSON.parse(xhr.responseText).msg);
            if (xhr.status == 302 || JSON.parse(xhr.responseText).msg == '登录成功') {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: url+'/user/checkin',
                    onload: function (xhr) {
                        var json = JSON.parse(xhr.responseText);
                        GM_notification(json.msg);
                        bark(json.msg);
                        resolve('✈签到完成');
                    }
                });
            } else {
                bark(JSON.parse(xhr.responseText).msg);
                GM_notification('自动签到失败,账号未登录,请先登录');
                reject('✈账号未登录');
            }
        }
    });},5e3)
});

async function bark(body){
    GM_xmlhttpRequest({
        method: 'GET',
        url: sendurl+encodeURIComponent(body),
        onload: function (xhr) {
            // 推送通知
            JSON.parse(xhr.responseText).message}
    })
};

async function logout(){
    GM_xmlhttpRequest({
        method: 'GET',
        url: url+'/user/logout'
    })
};

