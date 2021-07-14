/* eslint-disable prettier/prettier */
import jq from "jquery";
// 获取最新配置
export function oauth2Client(app, url) {
  var oauth2Client = {
    ouc: {
      user: null,
      oauth2User: url,
      clientId: "client",
      clientSecret: "secret"
    },
    getNoHashUrl: function() {
      return window.location.href.split("#")[0];
    },
    begin: function(opts) {
      opts = jq.extend({
        clientId: false,
        authorizeUrl: false,
        redirectUri: window.location.href,
        responseType: 'code'
      }, opts);
      window.location.href = opts.authorizeUrl + '?client_id=' +
        opts.clientId + '&response_type=' + opts.responseType +
        '&redirect_uri=' + opts.redirectUri;
    },
    user: function(url) {
      jq.ajax({
        type: "get",
        url: url,
        async: false,
        data: {},
        success: function(data) {

          // data = { "authorities": [{ "authority": "Operator" }, { "authority": "check" }, { "authority": "work" }], "details": { "remoteAddress": "10.11.5.80", "sessionId": "D588AAF1ED5633667F57AB8B4A16AEEC" }, "authenticated": true, "principal": { "userId": 1080098857, "username": "xiaofeili", "password": "22bcfcc40ae6ad8f4ff6a8c07c7f80f37d07ef635c379b86a58c50da", "showname": "xiaofeili", "officeCode": null, "roles": ["Operator", "work"], "authorities": [{ "authority": "Operator" }, { "authority": "work" }], "enabled": true, "credentialsNonExpired": true, "accountNonExpired": true, "accountNonLocked": true }, "credentials": null, "name": "zengzhizj" };

          if (!data) {
            oauth2Client.oAuthLoginPage();
            return;
          }

          app.config.globalProperties.$user = data;

        },
        error: function() {
          alert("当前登录用户为空，请检查当前地址是否正确");
          return;
        },
      });
    },
    signout: function() {
      jq.ajax({
        type: "get",
        url: oauth2Client.ouc.oauth2User + "logout",
        async: false,
        data: {},
        success: function() {
          window.location.reload();
        },
        error: function() {
          console.log("当前登录用户为空，请检查当前地址是否正确");
        },
      })
    },
    oAuthLoginPage: function() {
      oauth2Client.begin({
        authorizeUrl: oauth2Client.ouc.oauth2User + "/authorize",
        clientId: oauth2Client.ouc.clientId,
        redirectUri: oauth2Client.getNoHashUrl()
      });
    }

  };

  return oauth2Client;
}