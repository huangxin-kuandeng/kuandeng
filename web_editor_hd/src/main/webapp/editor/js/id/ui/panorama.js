iD.ui.Panorama = function(context) {

	// if (!iD.store.qq.isLoad) {
	// 	document.write('<script type=\'text/javascript\' src=\'' + iD.store.qq.url + '\'></script>');
	// 	iD.store.qq.isLoad = true;
	// }
    
	function panorama(selection) {
		if (context.panoramaOpt.debug) {
			
			var ttiipprent = iD.util.getDom('KDSEditor-content'),
				contentW = parseInt(iD.util.getStyleValue(ttiipprent, 'width')),
				contentH = parseInt(iD.util.getStyleValue(ttiipprent, 'height')),
				sScreen = true,
				con_W = parseInt(iD.util.getStyleValue(ttiipprent.parentNode, 'width')) === document.documentElement.clientWidth,
				con_H = parseInt(iD.util.getStyleValue(ttiipprent.parentNode, 'height')) === document.documentElement.clientHeight,
				isFullScreen = con_W && con_H;
			
			function getLeftTop1 () {
				
				var winWidth = Math.max(0, (window.innerWidth || document.documentElement.clientWidth)), 
	    			winHeight = Math.max(0, (window.innerHeight || document.documentElement.clientHeight));
	    		
	    		var left = (winWidth - panoWidth) / 2 - 0, top = (winHeight - panHeight) / 2 - 0;
	    		var w = Math.max(document.body.scrollWidth, window.innerWidth || document.documentElement.clientWidth),
	    			h = Math.max(document.body.scrollHeight, window.innerHeight || document.documentElement.clientHeight)
	    		return [left, top, w, h];
	    	}
	    	
	        var panoramaOpt = context.panoramaOpt,
	        	panoId = 'KDSEditor-Panorama', panoMapId = panoId + '-Map', panoHolderId = panoId + '-Holder',
				panoWidth = panoramaOpt.width, panHeight = panoramaOpt.height, zIndex = 1000, 
				zIndexCss = 'z-Index: ' + zIndex + ';',
	        	leftTop = getLeftTop1(), fontStyle = ';line-height: ' + panHeight + 'px;text-align:center;color: #ffffff;font-size: 24px;',
	        	panoContainerCss = ';width: ' + contentW + 'px;height: ' + panHeight + 'px;left: ' + 
	        		0 + 'px;top: ' + 0 + 'px;' + zIndexCss,
	        	coverCss = ';width: ' + contentW + 'px;height: ' + leftTop[3] + 'px;' + zIndexCss ,
	        	btns_lft1 = leftTop[0] + panoWidth - 18, btns_lft2 = contentW - 18,
	        	closeCss = ';left: ' + btns_lft2 + 'px;top: ' + (0 + 3) + 'px;z-Index: ' + (zIndex + 1) + ';';
	        	screenCss = ';left: ' + (btns_lft2- 20) + 'px;top: ' + (0 + 3) + 'px;z-Index: ' + (zIndex + 1) + ';'
	        				+ ';display: ' + (!isFullScreen ? 'block' : 'none') + ';';
	        
	        context.panoramaOpt.panoHolderId = panoHolderId;
	        context.panoramaOpt.panoMapId = panoMapId;
	        
	        //背景遮罩
	        var panoCover = selection.append('div')
	    		.attr('class', panoId + '-Cover')
	    		.attr('style', coverCss);
	        
	        //关闭按钮
	        var panoClose = selection.append('div')
				.attr('class', panoId + '-Close')
	        	.attr('style', closeCss)
	        	.attr('title', '关闭')
	        	.on('click', function () {
	        		if (__qq_pano_options._qq_isSetWH) screenIn();
	        		context.event.closepanorama();
	    			context.panoramaOpt = null;
	    			delete context.panoramaOpt;
	        	});
	        
	        //全屏/退出全屏
	        var panoScreen = selection.append('div')
				.attr('class', panoId + '-Screen2')
	        	.attr('style', screenCss)
	        	.attr('title', '全屏')
	        	.on('click', function () {
	        		if (sScreen) {
	        			screenOut();
	        			panoScreen.attr('title', '退出全屏').attr('class', panoId + '-Screen1');
	        			sScreen = false;
					} else {
						screenIn();
						panoScreen.attr('title', '全屏').attr('class', panoId + '-Screen2');
						sScreen = true;
					}
	        	});
	        
	        //街景容器
	        var panoHolder = selection.append('div')
	    		.attr('id', panoId + '-Holder')
	    		.attr('class', panoId + '-Holder')
	    		.attr('style', panoContainerCss);
	        
	        //缓冲加载提示
	        var pLoading = panoHolder.append('div')
				.attr('id', panoId + '-Holder-Loading')
				.attr('class', panoId + '-Holder-Loading')
				.attr('style', fontStyle);
	        pLoading.node().textContent = '正在加载街景......';
	        
	        var inOut = false;
	        //全屏
	        function screenOut () {
	        	var idContainer = iD.util.getDom('KDSEditor-content').parentNode;
				var pContainer = iD.util.getDom('KDSEditor-Panorama-Container');
				pContainer.style.zIndex = 1000;
				__qq_pano_options._qq_w = 0; __qq_pano_options._qq_h = 0; __qq_pano_options._qq_hh = 0;
				idContainer.appendChild(pContainer);
				resizeCallback();
				var lefttop = getLeftTop1(), wWidth = lefttop[2], wHeight = lefttop[3];
				if (__qq_pano_options._qq_isSetWH) {
					setSelectionParent(wWidth, wHeight);
					panoHolder.each(function () {
						this.style.width = wWidth + 'px';
						this.style.height = wHeight + 'px';
					});
					panoCover.each(function () {
						this.style.width = wWidth + 'px';
						this.style.height = wHeight + 'px';
					});
				}
				__qq_pano_options.a.setViewPort(wWidth, wHeight);
				
				var addressbar = iD.util.getDom('addressbar');
				addressbar && (addressbar.style.left = '16px');
				panoClose.node().style.left = wWidth - 20 + 'px';
				panoScreen.node().style.left = wWidth - 40 + 'px';
				inOut = true;
				
				__qq_pano_options._qq_con_lft && (idContainer.style.left = '0px');
				__qq_pano_options._qq_con_top && (idContainer.style.top = '0px');
				__qq_pano_options._qq_con_margin_lft && (idContainer.style.marginLeft = '0px');
				__qq_pano_options._qq_con_margin_top && (idContainer.style.marginTop = '0px');
	        }
	        
	        //退出全屏
	        function screenIn () {
	        	var mContainer = iD.util.getDom('KDSEditor-content');
				var pContainer = iD.util.getDom('KDSEditor-Panorama-Container');
				pContainer.style.zIndex = 'auto';
				mContainer.appendChild(pContainer);
				var lefttop = getLeftTop1(), wHeight = lefttop[3];
				__qq_pano_options.initDomWH(true);
				if (__qq_pano_options._qq_isSetWH) {
					mContainer.parentNode.style.width = __qq_pano_options._qq_oldw + 'px';
					mContainer.parentNode.style.height = __qq_pano_options._qq_oldh + 'px';
					var sidebar_dom = iD.util.getDom('KDSEditor-sidebar'), sidebar_w = sidebar_dom && parseInt(iD.util.getStyleValue(sidebar_dom, 'width')) || 0;
					panoHolder.node().style.width = (__qq_pano_options._qq_oldw - sidebar_w) + 'px';
					panoHolder.node().style.height = __qq_pano_options._qq_oldh + 'px';
					panoCover.node().style.width = (__qq_pano_options._qq_oldw - sidebar_w) + 'px';
					panoCover.node().style.height = __qq_pano_options._qq_oldh + 'px';
					__qq_pano_options.a.setViewPort(__qq_pano_options._qq_oldw - sidebar_w, __qq_pano_options._qq_oldh);
					__qq_pano_options._qq_w = __qq_pano_options._qq_oldw - sidebar_w;
				} else {
					panoHolder.node().style.width = __qq_pano_options._qq_w + 'px';
					__qq_pano_options.a.setViewPort(__qq_pano_options._qq_w, wHeight);
				}
				
				//var addressbar = iD.util.getDom('addressbar');
				//addressbar && (addressbar.style.left = __qq_pano_options._qq_hh + 16 + 'px');
				panoClose.node().style.left = btns_lft2 + 'px';
				panoScreen.node().style.left = btns_lft2 - 20 + 'px';
				inOut = false;
				
				var idContainer = mContainer.parentNode;
				__qq_pano_options._qq_con_lft && (idContainer.style.left = __qq_pano_options._qq_con_lft + 'px');
				__qq_pano_options._qq_con_top && (idContainer.style.top = __qq_pano_options._qq_con_top + 'px');
				__qq_pano_options._qq_con_margin_lft && (idContainer.style.marginLeft = __qq_pano_options._qq_con_margin_lft + 'px');
				__qq_pano_options._qq_con_margin_top && (idContainer.style.marginTop = __qq_pano_options._qq_con_margin_top + 'px');
	        }
	        
	        function setSelectionParent (w, h) {
	        	selection.node().parentNode.style.width = w + 'px';
				selection.node().parentNode.style.height = h + 'px';
	        }
	        
	        function resizeCallback() {//窗口缩放大小 重置位置
				var lefttop = getLeftTop1(), 
				left = lefttop[0], top = lefttop[1], winWidth = lefttop[2], winHeight = lefttop[3];
				if (__qq_pano_options._qq_isSetWH) {
					if (inOut) {
						var mContainer = iD.util.getDom('KDSEditor-content');
						mContainer.parentNode.style.width = winWidth + 'px';
						mContainer.parentNode.style.height = winHeight + 'px';
						panoHolder.each(function () {
							this.style.width = winWidth + 'px';
							this.style.height = winHeight + 'px';
						});
						panoCover.each(function () {
							this.style.width = winWidth + 'px';
							this.style.height = winHeight + 'px';
						});
						__qq_pano_options.a.setViewPort(winWidth, winHeight);
					} else {
						
					}
					
				} else {
					panoHolder.each(function () {
						this.style.width = winWidth + 'px';
						this.style.height = winHeight + 'px';
					});
					panoCover.each(function () {
						this.style.width = winWidth + 'px';
						this.style.height = winHeight + 'px';
					});
				}
			};
	        
	        window.onresize = resizeCallback;
			context.event.closepanorama(true);//处理qq多余dom
		} else {
			function getLeftTop () {
	    		var winWidth = Math.max(0, (window.innerWidth || document.documentElement.clientWidth)), 
	    			winHeight = Math.max(0, (window.innerHeight || document.documentElement.clientHeight)),
	    			sidebar_dom = iD.util.getDom('KDSEditor-sidebar'), sidebar_w = sidebar_dom && parseInt(iD.util.getStyleValue(sidebar_dom, 'width')) || 0;
	    		
	    		var left = (winWidth - panoWidth - sidebar_w) / 2 - 0, top = (winHeight - panHeight) / 2 - 0;
	    		var w = Math.max(document.body.scrollWidth, window.innerWidth || document.documentElement.clientWidth),
	    			h = Math.max(document.body.scrollHeight, window.innerHeight || document.documentElement.clientHeight)
	    		return [left, top, w, h];
	    	}
	    	
	        var panoramaOpt = context.panoramaOpt,
	        	panoId = 'KDSEditor-Panorama', panoMapId = panoId + '-Map', panoHolderId = panoId + '-Holder',
				panoWidth = panoramaOpt.width, panHeight = panoramaOpt.height, zIndex = panoramaOpt.zIndex, 
				zIndexCss = 'z-Index: ' + zIndex + ';',
	        	leftTop = getLeftTop(), fontStyle = ';line-height: ' + panHeight + 'px;text-align:center;color: #ffffff;font-size: 24px;',
	        	panoContainerCss = ';width: ' + panoWidth + 'px;height: ' + panHeight + 'px;left: ' + 
	        		leftTop[0] + 'px;top: ' + leftTop[1] + 'px;' + zIndexCss,
	        	coverCss = ';width: ' + leftTop[2] + 'px;height: ' + leftTop[3] + 'px;' + zIndexCss,
	        	closeCss = ';left: ' + (leftTop[0] + panoWidth - 18) + 'px;top: ' + (leftTop[1] + 3) + 'px;z-Index: ' + (zIndex + 1) + ';';
	        
	        context.panoramaOpt.panoHolderId = panoHolderId;
	        context.panoramaOpt.panoMapId = panoMapId;
	        
	        var panoCover = selection.append('div')
	    		.attr('class', panoId + '-Cover')
	    		.attr('style', coverCss);
	        var panoClose = selection.append('div')
				.attr('class', panoId + '-Close')
	        	.attr('style', closeCss)
	        	.attr('title', '关闭')
	        	.on('click', function () {
	        		context.event.closepanorama();
	    			context.panoramaOpt = null;
	    			delete context.panoramaOpt;
	        	});
	        
	        /**
	        var panoMap = selection.append('div')
		    	.attr('id', panoId + '-Map')
		    	.attr('class', panoId + '-Map')
		    	.attr('style', panoContainerCss);*/
	        var panoHolder = selection.append('div')
	    		.attr('id', panoId + '-Holder')
	    		.attr('class', panoId + '-Holder')
	    		.attr('style', panoContainerCss);
	        
	        var pLoading = panoHolder.append('div')
				.attr('id', panoId + '-Holder-Loading')
				.attr('class', panoId + '-Holder-Loading')
				.attr('style', fontStyle);
	        pLoading.node().textContent = '正在加载街景......';
	        
	        window.onresize = function () {//窗口缩放大小 重置位置
				var lefttop = getLeftTop(), 
				left = lefttop[0], top = lefttop[1], winWidth = lefttop[2], winHeight = lefttop[3];
				panoHolder.each(function () {
					this.style.left = lefttop[0] + 'px';
					this.style.top = lefttop[1] + 'px';
				});
				panoClose.each(function () {
					this.style.left = (lefttop[0] + panoWidth - 18) + 'px';
					this.style.top = (lefttop[1] + 3) + 'px';
				});
				panoCover.each(function () {
					this.style.width = winWidth + 'px';
					this.style.height = winHeight + 'px';
				});
			};
		}
    }

    return panorama;
};
