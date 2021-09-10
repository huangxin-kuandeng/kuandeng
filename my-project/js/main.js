var home = new Vue({
    el:'#integralMall',
    data:{
        configApi: {},
        type: true,
        member_id: '',
        // 订单号
        client_order_id: '',
        titleName: '积分商城',
        exchangeTitle: '立即兑换',
        transNum: 0,
        verificationCode: '',
        couPonData:[],
        picked: '',
        phoneNumber: '',
        phoneNumberTitle: '',
        dialogShow: false,
        curCount: null,
        message: '获取验证码',
        InterValObj: null,
        pickedData: null,
        messageDisabled: false,
        loadingShow: true,
        backGroundLoadingShow: false,
        orderNumber: null,
    },
    watch: {
        picked(){
            var pickedData = this.couPonData.find(d=>{
                return d.id == this.picked;
            })
            this.pickedData = pickedData;
        },
        transNum(){
            this.couPonData.forEach(d=>{
                let money = Number(d.money);
                if(money > this.transNum){
                    d.isUse = true;
                }else{
                    d.isUse = false;
                }
            })
        }
    },
    created(){
        this.member_id = this.getQueryString('member_id') || '321312412';
        if(!this.member_id){
            this.loadingShow = false;
            this.vueAlert('获取用户信息失败');
        }else{
            this.queryUserInfo();
        }
        this.queryCouponList();
    },
    methods:{
        // 生成时间戳
        newCreateData(){
            var $time = new Date().getTime() + '';
            var $tenTime = $time.slice(0,10);
            return $tenTime;
        },
        // 生成随机字符串
        newCreateString(l) {
        　　var $length = l || 8;
        　　var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
        　　var $maxPos = $chars.length;
        　　var $string = '';
        　　for (i = 0; i < $length; i++) {
                $string += $chars.charAt(Math.floor(Math.random() * $maxPos));
        　　}
        　　return $string;
        },
        vueAlert(message){
            var iframe = document.createElement("IFRAME");   
            iframe.style.display = "none";   
            iframe.setAttribute("src", 'data:text/plain,');   
            document.documentElement.appendChild(iframe);   
            var alertFrame = window.frames[0];   
            var iwindow = alertFrame.window;
            if (iwindow == undefined) {   
                iwindow = alertFrame.contentWindow;   
            }   
            iwindow.alert(message);
            iframe.parentNode.removeChild(iframe);
        },
        // 通过用户标识获取用户手机号信息
        queryUserInfo(){
            var $this = this,
                timestamp = $this.newCreateData(),
                type = 'score',
                nonce = $this.newCreateString(),
                corpid = '2v28u6dv',
                member_id = $this.member_id;
            var search = {
                timestamp, type, nonce, corpid, member_id
            }
            $this.getAxios({
                url: window.config_api + 'signature/index?',
                search: search,
            }).then((data)=>{
                data = data || {
                    "status": "E00000",
                    "desc": "490978264b0b591fa5e562736dca074b6ef5361a"
                }
                if(!data || data.status != 'E00000'){
                    vueAlert(data.desc);
                    return false;
                }
                search.signature = data.desc;
                $this.getAxios({
                    url: window.config_api + 'score_std/index?',
                    search: search,
                }).then((data)=>{
                    data = data || {
                        "status": "E00000",
                        "desc": "13426256094"
                    }
                    if(!data || data.status != 'E00000'){
                        $this.loadingShow = false;
                        $this.vueAlert(data.desc);
                        return false;
                    }
                    $this.phoneNumber = data.desc;
                    $this.phoneNumberTitle = this.changeStr($this.phoneNumber, 3, '*****');
                    $this.queryPhoneInfo();
                })
            })
        },
        // 通过用户标识获取用户手机号信息
        queryPhoneInfo(){
            var $this = this,
                timestamp = $this.newCreateData(),
                type = 'score',
                nonce = $this.newCreateString(),
                corpid = '2v28u6dv',
                mobile = $this.phoneNumber;
            var search = {
                timestamp, type, nonce, corpid, mobile
            }
            $this.getAxios({
                url: window.config_api + 'signature/index?',
                search: search,
            }).then((data)=>{
                data = data || {
                    "status": "E00000",
                    "desc": "490978264b0b591fa5e562736dca074b6ef5361a"
                }
                if(!data || data.status != 'E00000'){
                    $this.vueAlert(data.desc);
                    return false;
                }
                search.signature = data.desc;
                $this.getAxios({
                    url: window.config_api + 'score_std/index?',
                    search: search,
                }).then((data)=>{
                    $this.loadingShow = false;
                    data = data || {
                        "status": "E00000",
                        "desc": "9000000"
                    }
                    if(!data || data.status != 'E00000'){
                        $this.vueAlert(data.desc);
                        return false;
                    }
                    $this.transNum = data.desc;
                })
            })
        },
        queryCouponList(){
            var $this = this;
            // $this.getAxios({
            //     url: 'http://kts.gzproduction.com/kts/service/dispatch/status?t=' + this.phoneNumber,
            // }).then((data)=>{
            //     if(!data || data.code != '0'){
            //         $this.vueAlert('获取可兑换优惠券失败');
            //     }
                $this.couPonData = [
                    { "name": "一元", "money":"100", "id":"jfa100", "isUse": true, },
                    { "name": "一万元", "money":"10000000", "id":"jfa10000000", "isUse": true }
                ];
                // $this.loadingShow = false;
            // })
        },
        closeDialog(){
            this.orderNumber = null;
            this.dialogShow = false;
        },
        exchange(){
            this.verificationCode = '';
            this.client_order_id = '';
            this.dialogShow = true;
            // this.generateOrder();
            // this.sendMessage(true);
        },
        // 创建订单--发送手机短信验证码的触发函数
        sendMessageRequest(){
            var $this = this,
                timestamp = $this.newCreateData(),
                type = 'order',
                nonce = $this.newCreateString(),
                corpid = '2v28u6dv',
                mobile = $this.phoneNumber,
                amount = $this.picked;
            var search = {
                timestamp, type, nonce, corpid, mobile, amount
            }
            $this.backGroundLoadingShow = true;
            $this.getAxios({
                url: window.config_api + 'signature/index?',
                search: search,
            }).then((data)=>{
                $this.backGroundLoadingShow = false;
                data = data || {
                    "status": "E00000",
                    "desc": "d314b7dacf686c20116086e47c0ec4c9623e0680"
                }
                if(!data || data.status != 'E00000'){
                    $this.vueAlert(data.desc);
                    return false;
                }
                search.signature = data.desc;
                $this.getAxios({
                    url: window.config_api + 'charge_std/index?',
                    search: search,
                }).then((data)=>{
                    data = data || {
                        "order_id": "BTF20210910152450027307230880",
                        "client_order_id": "BTF20210910152450027307230880",
                        "status": "E10000",
                        "desc": "提交订单成功"
                    }
                    if(!data || (data.status != 'E20000' && data.status != 'E10000')){
                        $this.vueAlert(data.desc);
                        return false;
                    }
                    $this.client_order_id = data.client_order_id;
                })
            })
        },
        // 提交订单--确认兑换
        submitSend(){

            if(!this.client_order_id){
                this.vueAlert('请先获取验证码');
                return false;
            }

            var $this = this,
                timestamp = $this.newCreateData(),
                type = 'pay',
                nonce = $this.newCreateString(),
                corpid = '2v28u6dv',
                mobile = $this.phoneNumber,
                client_order_id = $this.client_order_id,
                verify_code = $this.verificationCode;
            var search = {
                timestamp, type, nonce, corpid, mobile, client_order_id, verify_code
            }

            $this.backGroundLoadingShow = true;

            $this.getAxios({
                url: window.config_api + 'signature/index?',
                search: search,
            }).then((data)=>{
                data = data || {
                    "status": "E00000",
                    "desc": "0853dd9377e0776c40ffc5793000c1688d0bdc52"
                }
                if(!data || data.status != 'E00000'){
                    $this.vueAlert(data.desc);
                    $this.backGroundLoadingShow = false;
                    return false;
                }
                search.signature = data.desc;
                search.member_id = $this.member_id;
                $this.getAxios({
                    url: window.config_api + 'cmcc_pay_std/index?',
                    search: search,
                }).then((data)=>{
                    $this.backGroundLoadingShow = false;
                    data = data || {
                        "order_id": "BTF20210909195137053105990533",
                        "isp_status_code": "E00000",
                        "desc": "积分支付成功",
                        "status": "E00000",
                        "client_order_id": "BTF20210909195137053105990533"
                    }
                    var code = '1';
                    var message = data.desc || '';
                    if(data && data.status == 'E40015'){
                        $this.vueAlert(data.desc);
                        return false;
                    }else if(data && data.status == 'E00000'){
                        code = '1';
                    }else{
                        code = '2';
                    }
                    var view = window.location.search ? './view.html' : './view.html?';
                    window.location.replace(view + window.location.search + '&viewType=' + code + '&viewTitle=' + message);
                })
            })
        },
        // 发送验证码事件
        sendMessage(type = false){
            if( !this.curCount ){
                this.curCount = 60;
                this.sendMessageRequest();
                //设置button效果，开始计时
                this.messageDisabled = true;                 //禁用按钮
                this.message = this.curCount + 's后重新获取';
                this.InterValObj = window.setInterval(this.SetRemainTime, 1000); //启动计时器，1秒执行一次
            }
        },
        SetRemainTime(){
            if (this.curCount == 0) {                
                window.clearInterval(this.InterValObj); //停止计时器
                this.message = '重新获取';           //修改按钮文字
                this.messageDisabled = false;       //启用按钮
            }else{
                this.curCount --;
                this.message = this.curCount + 's后重新获取';
            }
        },
        getQueryString(name) {
            var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
            var r = window.location.search.substr(1).match(reg);
            if (r != null) {
                return unescape(r[2]);
            }
            return null;
        },
        changeStr(str, index, changeStr){
            return str.substr(0, index) + changeStr+ str.substr(index + changeStr.length);
        },
        // get请求
        getAxios(param){
            var $url = param.url;
            if(param.search){
                for(var id in param.search){
                    $url += ('&' + id + '=' + param.search[id]);
                }
            }
            return new Promise((resolve) => {
                axios
                    .get($url)
                    .then(
                        (response) => {
                            if( typeof(response.data) == 'string' ){
                                resolve( JSON.parse(response.data) );
                            }else{
                                resolve(response.data);
                            }
                        },
                        () => {
                            resolve();
                        }
                    )
                    .catch(() => {
                        resolve();
                    });
              });
        },
        // post请求
        postAxios(param){
            return new Promise((resolve) => {
              axios
                .post(param.url, param.data)
                .then(
                  (response) => {
                    resolve(response.data);
                  },
                  () => {
                    resolve();
                  }
                )
                .catch(() => {
                  resolve();
                });
            });
        }

    }
})