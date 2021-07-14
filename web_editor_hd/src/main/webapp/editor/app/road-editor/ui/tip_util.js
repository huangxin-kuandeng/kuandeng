/**
 * Created by wt on 2015/8/28.
 */
iD.ui.TipUtil= function(context) {
    var tipUtil = {};

    tipUtil.getMousePos = function() {
        var event = d3.event;
        var e = event || window.event;
        return {'X':e.screenX,'Y': e.screenY}
    }
    /*
     *   new Dragdrop({
     *         target      拖拽元素 HTMLElemnt 必选
     *         bridge     指定鼠标按下哪个元素时开始拖拽，实现模态对话框时用到
     *         dragX      true/false false水平方向不可拖拽 (true)默认
     *         dragY     true/false false垂直方向不可拖拽 (true)默认
     *         area      [minX,maxX,minY,maxY] 指定拖拽范围 默认任意拖动
     *         callback 移动过程中的回调函数
     * });
     */
    tipUtil.dragDrop = function(option){
        this.target=option.target;
        this.dragX=option.dragX!=false;
        this.dragY=option.dragY!=false;
        this.disX=0;
        this.disY=0;
        this.bridge =option.bridge;
        this.area=option.area;
        this.callback=option.callback;
        this.target.style.zIndex='0';
        var _this=this;
        this.bridge && (this.bridge.onmouseover=function(){ _this.bridge.style.cursor='move'});
        this.bridge?this.bridge.onmousedown=function(e){ _this.mousedown(e)}:this.target.onmousedown=function(e){ _this.mousedown(e)}
    }
    tipUtil.dragDrop.prototype={
        mousedown:function(e){
            var e=e||event;
            var _this=this;
            this.disX=e.clientX-this.target.offsetLeft;
            this.disY=e.clientY-this.target.offsetTop;
            this.target.style.cursor = 'move';

            if(window.captureEvents){
                e.stopPropagation();
                e.preventDefault();}
            else{
                e.cancelBubble = true;
            }
            if(this.target.setCapture){
                this.target.onmousemove=function(e){_this.move(e)}
                this.target.onmouseup=function(e){_this.mouseup(e)}
                this.target.setCapture()
            }
            else{
                document.onmousemove=function(e){_this.move(e)}
                document.onmouseup=function(e){_this.mouseup(e)}
            }
        },
        move:function(e){
            this.target.style.margin=0;
            var e=e||event;
            var scrollTop=document.documentElement.scrollTop||document.body.scrollTop;
            var moveX=e.clientX-this.disX;
            var moveY=e.clientY-this.disY;
            if(this.area){
                moveX < _this.area[0] && (moveX = this.area[0]); // left 最小值
                moveX > _this.area[1] && (moveX = this.area[1]); // left 最大值
                moveY < _this.area[2] && (moveY = this.area[2]); // top 最小值
                moveY > _this.area[3] && (moveY = this.area[3]); // top 最大值
            }

            this.dragX && (this.target.style.left=moveX+'px');
            this.dragY && (this.target.style.top=moveY+'px');
            //限定范围
            parseInt(this.target.style.top)<0 && (this.target.style.top=0);
            parseInt(this.target.style.left)<0 && (this.target.style.left=0);
            parseInt(this.target.style.left)>document.documentElement.clientWidth-this.target.offsetWidth&&(this.target.style.left=document.documentElement.clientWidth-this.target.offsetWidth+"px");
            parseInt(this.target.style.top)>scrollTop+document.documentElement.clientHeight-this.target.offsetHeight && (this.target.style.top=scrollTop+document.documentElement.clientHeight-this.target.offsetHeight+'px');
            if(this.callback){
                var obj = {moveX:moveX,moveY:moveY};
                this.callback.call(this,obj)
            }
            return false
        },
        mouseup:function (e)
        {
            var e=e||event;
            this.target.style.cursor = 'default';
            var _this=this;
            this.target.onmousemove=null;
            this.target.onmouseup=null;
            document.onmousemove=null;
            document.onmouseup=null;
            if(this.target.releaseCapture) {this.target.releaseCapture()}
        }
    }
    return tipUtil;

}