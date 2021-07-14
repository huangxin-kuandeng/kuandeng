/**
 * 更改编辑器中间的主窗口、辅窗口
 * 属性编辑模式：地图为主，图像为辅
 * 要素编辑模式：图像为主，地图为辅
 * 
 * 可更改$allWrap下 主窗口/辅窗口 的比例
 * @param {Object} context
 * @param {Object} $mapContent
 * @param {Object} $picplayer
 * @param {Object} $allWrap
 */
iD.ui.ViewModeChange = function(context, $mapContent, $picplayer, $allWrap) {
	var modeClasses = ["model-pos-left", "model-pos-right"];
    var layoutClasses = ["layout-7_3", "layout-6_4", "layout-5_5", "layout-10"];
    /*
    {
        id: 'view-mode-attribute',
        title: '属性编辑',
        action: function(){
        	changeModeDom(1);
        }
    }, {
        id: 'view-mode-element',
        title: '要素编辑',
        action: function(){
        	changeModeDom(2);
        }
    }, {
        id: 'view-layout-7_3',
        title: '7/3 比例',
        style: {
        	"line-height": 2.4
        },
        action: function(){
        	changeModeLayoutStyle(1);
        }
    }, {
        id: 'view-layout-6_4',
        title: '6/4 比例',
        style: {
        	"line-height": 2.4
        },
        action: function(){
        	changeModeLayoutStyle(2);
        }
    }, {
        id: 'view-layout-5_5',
        title: '5/5 比例',
        style: {
        	"line-height": 2.4
        },
        action: function(){
        	changeModeLayoutStyle(3);
        }
    }
    */
    var zooms = [];
    // 201811113 所有用户都可以查看标定面板
	zooms.push({
        id: 'view-mode-picRightBody',
        title: '核线标定',
        action: function(){
        	if(iD.picUtil.player){
        		var player = iD.picUtil.player;
        		if(!player.checkRightBodyShown()){
        			changeModeLayoutStyle(3);
        			player.showRightBody();
        		}else {
        			player.hideRightBody();
        		}
        	}
        }
    });
    
    /**
     * 1、属性编辑
     * 2、要素编辑
     * @param {Number} type
     */
    function changeModeDom(type){
    	var mainClass = modeClasses[0];
    	var smallClass = modeClasses[1];
    	var mainMode = {};
    	mainMode[mainClass] = true;
    	mainMode[smallClass] = false;
    	
    	var smallMode = {};
    	smallMode[mainClass] = false;
    	smallMode[smallClass] = true;
    	
    	if(type == 1){
    		$mapContent.classed(mainMode);
    		$picplayer.classed(smallMode);
    	}else if(type == 2){
    		$picplayer.classed(mainMode);
    		$mapContent.classed(smallMode);
    	}
    }
    
    /**
     * 1、7/3
     * 2、6/4
     * 3、5/5
     * @param {Number} type
     */
    function changeModeLayoutStyle(type){
    	var index = (type || 0) - 1;
    	if(index == -1){
    		return ;
    	}
    	var arr = [false, false, false, false];
    	arr[index] = true;
    	
    	$allWrap.classed(_.zipObject(layoutClasses, arr));
    	iD.picUtil.player && iD.picUtil.player.hideRightBody();
        iD.svg.Pic.dataMgr.pic && iD.svg.Pic.dataMgr.pic.resetSize();
    }

    return function(selection) {
        var button = selection.selectAll('button')
            .data(zooms)
            .enter().append('button')
            .attr('tabindex', -1)
            .attr('class', function(d) { return d.id; })
            .on('click.uizoom', function(d) { 
            	d.action();
            	d3.select(window).trigger("resize");
            })
            .call(bootstrap.tooltip()
                .placement('left')
                .html(false)
                .title(function(d) {
//                  return iD.ui.tooltipHtml(d.title, d.key);
                    return d.title;
                }));

        button.append('span')
        	.attr('class', 'text-fill')
            .text(function(d) { 
            	var str = d.title;
        		for(var key in d.style){
        			this.style[key] = d.style[key];
        		}
            	return str.substring(0, d.titleNum || 4);
            });

    };
};
