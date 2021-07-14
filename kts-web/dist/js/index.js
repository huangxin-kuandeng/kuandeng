var ouc = {
	user: null,
	oauth2User: iD.config.URL.kd_auth_server + "oauth",
	clientId: "client",
	clientSecret: "secret"
}

d3.json(iD.config.URL.kd_auth_server + "user").get(function(xhr, data){
	if(!data){
		oAuthLoginPage();
		return ;
	}
	
	// ouc.user = data;
});

function getNoSearchUrl() {
	return window.location.origin + window.location.pathname;
}

function getNoHashUrl(){
	return window.location.href.split("#")[0];
}

function isNotNull(str) {
	return str != null && $.trim(str) != "";
}

function oAuthLoginPage() {
	// oauth2登录，使用access_token参数，在调用接口的请求中使用
	$.oauth2Client.begin({
		authorizeUrl: ouc.oauth2User + "/authorize",
		clientId: ouc.clientId,
		redirectUri: getNoHashUrl()
	});
}