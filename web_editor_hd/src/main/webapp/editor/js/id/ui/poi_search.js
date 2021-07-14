iD.ui.PoiSearch = function(context) {

    return function(selection) {
    	
    	var pagingOpt = {
    			pageSize: 10,
    			pageIndex: 1,
    			keyword: '',
    			total: 0,
    			count: 0
    	};
    	
    	selection.paging = function(keyword){
			rPanel.style("display","block");
			function done(data){
				re_list.select("ul").selectAll("li").remove();
				
				if(data.status == "E1") {
					re_list.select("ul").append("li")
						.append("a").html("无相关数据");
					pagingOpt.pageIndex = 1;
					pagingOpt.total = 0;
					pagingOpt.count = 0;
					setIndex(pagingOpt.pageIndex);
					return;
				}else if(data.error){
					re_list.select("ul").append("li")
						.append("a").html("查询错误");
					pagingOpt.pageIndex = 1;
					pagingOpt.total = 0;
					pagingOpt.count = 0;
					setIndex(pagingOpt.pageIndex);
					return;
				}
				pagingOpt.total = data.total || pagingOpt.total;
				setIndex(pagingOpt.pageIndex);
				
				r_ul.selectAll("li").data(data.list).enter()
				.append("li").append("a").html(function(d){
					return d.name;
				}).attr("title",function(d){
					return d.name;
				}).on("click",function(d){
					context.map().center([d.x,d.y]);
				});
			}
			context.connection().searchPoiURL(iD.store.url.searchpoi, pagingOpt, done);
    	}
    	//添加搜索框
			selection.append("input")
	    	.on("keydown",function(){
	    		if(d3.event.keyCode === 13 && this.value){
	    			var fb = pagingOpt.keyword != this.value,
	    			    ftex = rPanel.style("display");
	    			if(fb || !fb && ftex=== "none"){
	    				pagingOpt.pageIndex = 1;
	    				pagingOpt.total = 0;
	    				pagingOpt.count = 0;
	    				pagingOpt.keyword = this.value;
	    				selection.paging();
	    			}
	    		}
	    	});
			selection.append('div')
				.attr('class','img-search-mark');
		//添加搜索结果面板	
			var rPanel = selection.append("div").attr("class","poi-search-results-panel");
			var stt = rPanel.append("div").attr("class","search_title");
			    stt.append("p").html("搜索结果");
			    stt.append("a").attr({href:"#","class":"close_two"})
			    .on("click",function(){
			    	rPanel.style("display","none");
			    });
			var re_list = rPanel.append("div").attr("class","results_list");
			var r_ul = re_list.append("ul");
			
			//分页
			var paging = rPanel.append("div").attr("class","search_page");
			var pagemode = ["home_page","pre_page","paging_num__tip","next_page","end_page"]
			paging.append("ul").selectAll("li").data(pagemode).enter()
			.append("li").append("a")
			.attr("href","#")
			.attr("class",function(d){
				return d;
			});
			                
			paging.select(".home_page").on('click',function(){
				if(pagingOpt.pageIndex == 1)return fasle;
				pagingOpt.pageIndex = 1;
				selection.paging();
				setIndex(pagingOpt.pageIndex);
				return false;
			})
			paging.select(".pre_page").on('click',function(){
				if(pagingOpt.pageIndex>1){
					pagingOpt.pageIndex--;
					selection.paging();
					setIndex(pagingOpt.pageIndex);
				}
				return false;
			})

			paging.select(".next_page").on('click',function(){
				if(pagingOpt.pageIndex >= pagingOpt.count)return ;
				pagingOpt.pageIndex++ ;
				selection.paging();
				setIndex(pagingOpt.pageIndex);
				return false;
			})
			paging.select(".end_page").on('click',function(){
				if(pagingOpt.pageIndex == pagingOpt.count)return ;
				pagingOpt.pageIndex = pagingOpt.count;
				selection.paging();
				setIndex(pagingOpt.count);
				return false;
			})
			 
			function setIndex(i){
				pagingOpt.count = Math.ceil(pagingOpt.total/pagingOpt.pageSize);
				if(!pagingOpt.count){
					i = 0;
				}
				paging.select(".paging_num__tip").html(i + "/" + pagingOpt.count);
				return false;
			}

    };
};
