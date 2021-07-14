;;(function(exports) {

  var bootstrap = (typeof exports.bootstrap === "object") ?
    exports.bootstrap :
    (exports.bootstrap = {});

   bootstrap.timepicker = function(){
   		var hour=23,
   			minute= 59,
   			hourStep = 1 ,
   			minuteStep = 1,
   			isOpen = false,
   			dispatch = d3.dispatch('show');

   		var timepicker = function(input){
			var inputNode = input.node(),
				selection = d3.select(inputNode.parentNode);


			input.on('click.timepicker',highlightUnit)
				.on('focus.timepicker',highlightUnit)
				.on('blur.timepicker',blurElement);

   			selection.append('button')
   				.attr('class','button add-on')
   				.on('click.timepicker',showWidget)
   				.append('span')
   				.attr('class','label')
   				.html('选择');
   				
   			var wrap = selection.append('div')
   				.attr('class','bootstrap-timepicker-widget');

   				
   			var table = wrap.append('table');

   			var tr1 = table.append('tr');
   			tr1.append('td')
   					.append('a')
   					.attr('href','javascript:void(0);')
   					.attr('data-action','incrementHour')
   					.on('click.timepicker',incrementHour)
   					.append('i')
   					.attr('class','KDSEditor-icon-chevron-up');
   			tr1.append('td')
   				.attr('class','separator')
   				.html('&nbsp;');
   			tr1.append('td')
   					.append('a')
   					.attr('href','javascript:void(0);')
   					.attr('data-action','incrementMinute')
   					.on('click.timepicker',incrementMinute)
   					.append('i')
   					.attr('class','KDSEditor-icon-chevron-up');

   			var tr2 = table.append('tr');
   			tr2.append('td')
   				.append('input')
   				.attr('type','text')
   				.attr('name','hour')
   				.attr('class','bootstrap-timepicker-hour')
   				.attr('maxlength',2)
               .property('disabled',true)
   				.property('value',hour);
   			tr2.append('td')
   				.attr('class','separator')
   				.html(':');
   			tr2.append('td')
   				.append('input')
   				.attr('type','text')
   				.attr('name','minute')
               .property('disabled',true)
   				.attr('class','bootstrap-timepicker-minute')
   				.attr('maxlength',2)
   				.property('value',minute);

   			var tr3 = table.append('tr');
   			tr3.append('td')
   					.append('a')
   					.attr('href','javascript:void(0);')
   					.attr('data-action','decrementHour')
   					.on('click.timepicker',decrementHour)
   					.append('i')
   					.attr('class','KDSEditor-icon-chevron-down');
   			tr3.append('td')
   				.attr('class','separator')
   				.html('&nbsp;');
   			tr3.append('td')
   					.append('a')
   					.attr('href','javascript:void(0);')
   					.attr('data-action','decrementMinute')
   					.on('click.timepicker',decrementMinute)
   					.append('i')
   					.attr('class','KDSEditor-icon-chevron-down');

   			function blurElement(){
   				updateFromElementVal();
   			}
   			function highlightUnit(){
   				var position = getCursorPosition();
			      if (position >= 0 && position <= 2) {
			        highlightHour();
			      } else if (position >= 3 && position <= 5) {
			        highlightMinute();
			      }
   			}
   			function highlightHour(){
   				 if (inputNode.setSelectionRange) {
                    setTimeout(function() {
                        inputNode.setSelectionRange(0,2);
                    }, 0);
                }
   			}
   			function highlightMinute(){
   				if (inputNode.setSelectionRange) {
                    setTimeout(function() {
                    	inputNode.setSelectionRange(3,5);                            
                    }, 0);
                }
   			}
   			function getCursorPosition() {
		      var input = inputNode;

		      if ('selectionStart' in input) {// Standard-compliant browsers

		        return input.selectionStart;
		      } else if (document.selection) {// IE fix
		        input.focus();
		        var sel = document.selection.createRange(),
		          selLen = document.selection.createRange().text.length;

		        sel.moveStart('character', - input.value.length);

		        return sel.text.length - selLen;
		      }
		    }
   			function setTime(time){
   				var timeArray = time.split(':');
			      hour = parseInt(timeArray[0], 10);
			      minute = parseInt(timeArray[1], 10);
			      if (isNaN(hour)) {
			        hour = 0;
			      }
			      if (isNaN(minute)) {
			        minute = 0;
			      }
			      if (hour >= 24) {
			          hour = 24;
			        } else if (hour < 0) {
			          hour = 0;
			        }
			      if (minute < 0) {
			        minute = 0;
			      } else if (minute >= 60) {
			        minute = 59;
			      }
               if(hour===24){
                  minute = 0;
               }

			      update();
   			}
   			function isSelfClick(cur){
   				var flag = false;
   				while ( cur && cur.ownerDocument && cur.nodeType !== 11 ) {
   					if(cur === wrap.node()){
   						flag = true;
   						break;
   					}
					cur = cur.parentNode;
				}
   				return flag;
   			}
   			function updateFromElementVal(){
   				var val = inputNode.value;
   				if(val){
   					setTime(val);
   				}
   			}
   			function showWidget(){
   				dispatch.show();
   				if(isOpen){
   					return;
   				}
   				d3.select(document.body).on('mousedown.timepicker',function(){
	   			 	if(!isSelfClick(d3.event.target)){
	   			 		hideWidget();
	   			 	}
	   			 });
   				
   				updateFromElementVal();

   				//获得位置
   				var outer = getPosition(inputNode),
   					pos = {x: outer.x, y: outer.y + outer.h + 5};;
   				wrap.style({left: ~~pos.x + "px", top: ~~pos.y+ "px"})
   					.classed('open',true);
   				isOpen = true;
   			}
   			function hideWidget(){   				
   				if(isOpen === false){
   					return;
   				}
   				wrap.classed('open',false);
   				d3.select(document.body).on('mousedown.timepicker',null);
   				isOpen = false;
   			}
   			function incrementHour(){
               if(hour === 24){
                  hour = 0;
                  update();
                  return;
               }
               hour++;
   				update();
   			}
   			function incrementMinute(){
   				var newVal = minute + minuteStep;
   				if(newVal > 59){
   					incrementHour();
   					minute = newVal - 60;
   				}else{
   					minute = newVal;
                  if(hour === 24){
                     incrementHour();
                  }
   				}
   				update();
   			}
   			function decrementHour(){
   				if (hour === 0) {
		          hour = 23;
		        } else {
		          hour--;
		        }
		        update();
   			}
   			function decrementMinute(){
   				 var newVal = minute - minuteStep;

			      if (newVal < 0) {
			        decrementHour();
			        minute = newVal + 60;
			      } else {
			        minute = newVal;
                 if(hour === 24){
                     decrementHour();
                 }
			      }
			      update();
   			}
   			//更新
   			function update(){
   				var time = formatTime(parseInt(hour,10),parseInt(minute,10));

   				table.selectAll('input.bootstrap-timepicker-hour').property('value',time.hour);
   				table.selectAll('input.bootstrap-timepicker-minute').property('value',time.minute);
   				d3.select(inputNode).property('value',time.hour+':'+time.minute);
   			}
   			//对于小于10的数字，补0
   			function formatTime(hour,minute){
   				var obj = {};
   				obj.hour = hour;
   				obj.minute = minute;

   				if(hour < 10){
   					obj.hour = '0'+hour;
   				}
   				if(minute < 10){
   					obj.minute = '0'+minute;
   				}
   				return obj;
   			}
   		};
   		timepicker.hourStep = function(_){
   			if(!arguments.length) return hourStep;
   			hourStep = _;
   			return timepicker;
   		};
   		timepicker.minuteStep = function(_){
   			if(!arguments.length) return minuteStep;
   		    minuteStep = _;
   			return timepicker;
   		};

   		return d3.rebind(timepicker,dispatch,'on');
   };
	function getPosition(node) {
	    var mode = d3.select(node).style('position');
	    if (mode === 'absolute' || mode === 'static') {
	      return {
	        x: node.offsetLeft,
	        y: node.offsetTop,
	        w: node.offsetWidth,
	        h: node.offsetHeight
	      };
	    } else {
	      return {
	        x: 0,
	        y: 0,
	        w: node.offsetWidth,
	        h: node.offsetHeight
	      };
	    }
	  }

})(window);