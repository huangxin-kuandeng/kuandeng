var home = new Vue({
    el:'#integralMall',
    data:{
        type: true,
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
        orderNumber: null,
    },
    watch: {
        picked(){
            var pickedData = this.couPonData.find(d=>{
                return d.money == this.picked;
            })
            this.pickedData = pickedData;
        }
    },
    created(){
        window.history.length = 0;
        this.phoneNumber = this.getQueryString('phone');
        if(!this.phoneNumber){
            alert('获取用户信息失败');
            return;
        }
        this.phoneNumberTitle = this.changeStr(this.phoneNumber, 3, '*****');
        this.queryPhoneInfo();
    },
    methods:{
        errorView(){
            console.log('数据加载失败')
        },
        queryPhoneInfo(){
            var $this = this;
            getAjax({
                url: 'http://kts.gzproduction.com/kts/service/dispatch/status?t=' + this.phoneNumber,
                callback: function(data){
                    if(!data || data.code != '0'){
                        alert('获取用户积分失败');
                    }
                    $this.transNum = 22;
                    $this.queryCouponList();
                }
            })
        },
        queryCouponList(){
            var $this = this;
            getAjax({
                url: 'http://kts.gzproduction.com/kts/service/dispatch/status?t=' + this.phoneNumber,
                callback: function(data){
                    if(!data || data.code != '0'){
                        alert('获取可兑换优惠券失败');
                    }
                    $this.couPonData = [
                        {"name":'十块钱',"money":"10","useMessage":"无使用门槛","date":"2019.11.13-2020.01.20","msg":"描述的相关信息"},
                        {"name":'五块钱',"money":"5","useMessage":"无使用门槛","date":"2019.11.13-2020.01.20","msg":"描述的相关信息"},
                        {"name":'一块钱',"money":"1","useMessage":"无使用门槛","date":"2019.11.13-2020.01.20","msg":"描述的相关信息"},
                        {"name":'五十块钱',"money":"50","useMessage":"无使用门槛","date":"2019.11.13-2020.01.20","msg":"描述的相关信息"}
                    ];

                    $this.couPonData.forEach(d=>{
                        let money = Number(d.money);
                        if(money > $this.transNum){
                            d.isUse = false;
                        }else{
                            d.isUse = true;
                        }
                    })
                    $this.loadingShow = false;
                    console.log('优惠券列表获取成功');
                }
            })
        },
        closeDialog(){
            this.orderNumber = null;
            this.dialogShow = false;
        },
        exchange(){
            this.verificationCode = '';
            this.dialogShow = true;
            this.generateOrder();
            // this.sendMessage(true);
        },
        // 发送手机短信验证码的触发函数
        sendMessageRequest(){
            var $this = this;
            getAjax({
                url: 'http://kts.gzproduction.com/kts/service/dispatch/status?t=' + this.phoneNumber,
                callback: function(data){
                    if(!data || data.code != '0'){
                        alert('错误');
                        return;
                    }
                    console.log('发送短信验证码成功');
                }
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
        // 生成兑换优惠券的订单
        generateOrder(){
            var $this = this;
            getAjax({
                url: 'http://kts.gzproduction.com/kts/service/dispatch/status?t=' + $this.pickedData.id,
                callback: function(data){
                    if(!data || data.code != '0'){
                        alert('错误');
                        return;
                    }
                    $this.orderNumber = 21387217948347981298;
                    console.log('生成订单号成功');
                }
            })
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
        submitSend(){
            var $this = this;
            getAjax({
                url: 'http://kts.gzproduction.com/kts/service/dispatch/status?t=' + $this.verificationCode,
                callback: function(data){
                    if(!data || data.code != '0'){
                        alert('验证码错误');
                        return;
                    }
                    if($this.verificationCode != '111111'){
                        alert('验证码错误【111111】');
                        return;
                    }
                    var code = data.code == '0' ? '1' : '2';
                    if($this.picked == '10'){
                        code = 2;
                    }
                    var message = data.message || '';
                    window.location.replace('./view.html' + window.location.search + '&viewType=' + code + '&viewTitle=' + message);
                }
            })
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
        }
    }
})