var view = new Vue({
    el:'#integralMallView',
    data:{
        viewClass: 'success',
        iconClass: 'icon-chenggong1',
        iconTitle: '',
        viewType: 0,
        viewTitle: '',
        viewParam: {
            1: {
                iconClass: 'icon-chenggong1',
                viewClass: 'success',
                view: '兑换成功',
            },
            2: {
                iconClass: 'icon-jinggao',
                viewClass: 'warning',
                view: '兑换失败',
            },
        },
    },
    created(){
        this.viewType = this.getQueryString('viewType');
        this.viewTitle = this.getQueryString('viewTitle');
        this.iconClass = this.viewParam[this.viewType].iconClass;
        this.iconTitle = this.viewParam[this.viewType].view;
        this.viewClass = this.viewParam[this.viewType].viewClass;
        document.title = this.viewParam[this.viewType].view;
    },
    methods:{
        rebackIndex(){
            var phone = this.getQueryString('phone');
            window.location.replace('./index.html?phone=' + phone);
        },
        getQueryString(name) {
            var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
            var r = window.location.search.substr(1).match(reg);
            if(name == 'viewTitle'){
                return decodeURI(r[2]);
            }
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