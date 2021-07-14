/**
 * D3 扩展类
 * @author zhenyu.hou
 * @email goinni@163.com
 */
_.extend(d3.selection.prototype, {
	/**
	 * 获取父节点
	 */
	parent : function (){
		var o = this.node(), 
			r = o.parentNode;
		while(!r.tagName) {
			r = r.parentNode;
			if(!r)return;
		}
		return d3.select(r);
	},
	/**
	 * 获取同辈相邻上一个节点
	 */
	prev : function (){
		var o = this.node(), 
			r = o.previousSibling;
		while(!r.tagName) {
			r = r.previousSibling;
			if(!r)return;
		}
		return d3.select(r);
	},
	/**
	 * 获取同辈相邻下一个节点
	 */
	next : function(){
		var o = this.node(),
			r = o.nextSibling;
		while(!r.tagName) {
			r = r.nextSibling;
			if(!r)return;
		}
		return d3.select(r);
	}
});