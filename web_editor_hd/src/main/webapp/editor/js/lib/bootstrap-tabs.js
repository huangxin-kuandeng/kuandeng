;;(function(exports) {

  var bootstrap = (typeof exports.bootstrap === "object") ?
    exports.bootstrap :
    (exports.bootstrap = {});

  bootstrap.tabs = function() {
  	var event = d3.dispatch('change');
  	var tabs = function(id,controlId) {

  		var element = d3.select('#'+id),
  			control = d3.select('#'+controlId);
  		element.selectAll('li')
  				.on('click',function(){
  					var tabName = d3.select(this).attr('data-tab');
  					changeTab(tabName);
  				})

  		var controlFilter = function(){
  			var tabName = d3.select(this).attr('data-tab');
  			if(tabName && tabName.length > 0){
  				return true;
  			}
  			return false;
  		}
  		function changeTab(tabName){
  			//更新element样式
  			element.selectAll('li')
  					.classed('active',false);
  			element.selectAll('li')
  					.filter(function(){
  						if(d3.select(this).attr('data-tab') === tabName){
  							return true;
  						}
  					})
  					.classed('active',true);

  			//更新controlContent样式
  			control.selectAll('div')
  					.filter(controlFilter)
  					.style('display','none');

  			control.selectAll('div')
  					.filter(controlFilter)
  					.filter(function(){
  						if(d3.select(this).attr('data-tab') === tabName){
  							return true;
  						}
  					})
  					.style('display','block');

  			event.change(tabName);
  		}
  		var firstName = element.selectAll('li')
  							.filter(":first-child")
  							.attr('data-tab');
  		changeTab(firstName);
  	};
  	return d3.rebind(tabs, event, 'on');
  }

})(window);