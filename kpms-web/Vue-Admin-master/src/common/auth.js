export default {
  randomString:function(len,radix){
    var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var chars = CHARS, uuid = [], i;
    radix = radix || chars.length;

    if (len) {
      // Compact form
      for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
    } else {
      // rfc4122, version 4 form
      var r;

      // rfc4122 requires these characters
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';

      // Fill in random data.  At i==19 set the high bits of clock sequence as
      // per rfc4122, sec. 4.1.5
      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random()*16;
          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
        }
      }
    }

    return uuid.join('');
  },
  getUid:function(){
    var uid = window.localStorage.getItem('imp-uuid');
    if (!uid) {
      uid = this.randomString(32);
      window.localStorage.setItem('imp-uuid',uid);
    }
    return uid;
  },
//设置sid--cookie
  setSid: function(value){
		var exp = new Date();
		exp.setTime(exp.getTime() + 24*60*60*1000);
		document.cookie = "imp-sid="+ escape (value) + ";expires=" + exp.toGMTString();
  },
//获取sid--cookie
  getSid:function(){
		var arr,reg=new RegExp("(^| )imp-sid=([^;]*)(;|$)");
		if(arr=document.cookie.match(reg)){
			sid = unescape(arr[2]);
		}
    if(!!sid){
      return sid;
    }
    return '';
    
    var sid = window.localStorage.getItem('imp-sid');
    if(!!sid){
      return sid;
    }
    return '';
  },
//删除sid--cookie
  deleteSid: function(){
		var exp = new Date();
		exp.setTime(exp.getTime() - 1);
		document.cookie= "imp-sid=v;expires="+exp.toGMTString();
  },
  
//登录当前用户 保存sid--token
  login (token, callback) {
  	this.setSid(token);
    if (callback) callback();
    return;
    
    window.localStorage.setItem('imp-sid',token);
    if (callback) callback();
  },

//获取当前的sid--token
  getToken () {
  	var sId = this.getSid();
    return sId;
    
    return window.localStorage.getItem('imp-sid');
  },

//登出当前用户，删除sid--token
  logout (cb) {
  	this.deleteSid();
    if (cb) cb();
    return;
    
    window.localStorage.removeItem('imp-sid');
    if (cb) cb()
  },
	
//获取当前登录状态---是否存在sid--token
  loggedIn () {
    return !!this.getSid();
    return !!window.localStorage.getItem('imp-sid');
  }
}
