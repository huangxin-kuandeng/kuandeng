;;(function(exports) {

  var bootstrap = (typeof exports.bootstrap === "object") ?
    exports.bootstrap :
    (exports.bootstrap = {});

  bootstrap.pagination = function() {
  	var pageIndex = 1,
  		pageSize = 10,
  		total = 0,
  		pageCount = 0,
  		event = d3.dispatch('change');
  	var pagination = function(selection) {

        pageCount = Math.ceil(total/pageSize);
        //当个数为0时不显示结果
        if(total==0)return;

        //总记录数
        selection.append('span')
            .attr('class','count')
            .html('<label class="current">'+pageIndex+'</label>/'+pageCount+'&nbsp;'+t('pagination.total')+'<label class="total">'+total+'</label>');


        function click(p){
        	//设置当前页码
        	selection.selectAll('.current')
        		.html(pageIndex);
        	
            drawLink();
            event.change(p);
        }
        function drawLink(){
        	
        	var linkWrapper = selection.selectAll('.link')
        		.data([0]);
        	var $enter = linkWrapper.enter()
        		.append('span')
        		.attr('class','link');

        	$enter.append('a')
        		.attr('class','first')
        		.html(t('pagination.first'));
        	$enter.append('a')
        		.attr('class','pre')
            	.html(t('pagination.pre'));
            $enter.append('a')
            	.attr('class','next')
            	.html(t('pagination.next'))

            //Update
            var firstPage = selection.selectAll('.first'),
            	prePage = selection.selectAll('.pre'),
            	nextPage = selection.selectAll('.next');
            
            firstPage.classed('disabled',!(pageIndex -1 > 0))
            	.on('click',null);
            prePage.classed('disabled',!(pageIndex -1 > 0))
            	.on('click',null);
            nextPage.classed('disabled',!(pageIndex+1 <= pageCount))
            	.on('click',null);

            if(pageIndex -1 > 0){
                firstPage.attr('href','javascript:void(0);')
                    .on('click',function(){
                        pageIndex = 1;
                        click(pageIndex);
                    });
                prePage.attr('href','javascript:void(0);')
                    .on('click',function(){
                        pageIndex = pageIndex - 1;
                        click(pageIndex);
                    });
            }
            if(pageIndex+1 <= pageCount){
                nextPage.attr('href','javascript:void(0);')
                    .on('click',function(){
                        pageIndex = pageIndex + 1;
                        click(pageIndex);
                    });
            }
            linkWrapper.exit()
            	.remove();
        }
        drawLink();
  	}
  	pagination.pageIndex = function(_){
  		if (!arguments.length) return pagination;
        pageIndex = _;
        return pagination;
  	};
  	pagination.pageSize = function(_){
  		if (!arguments.length) return pagination;
        pageSize = _;
        return pagination;
  	};
  	pagination.total = function(_){
  		if (!arguments.length) return pagination;
        total = _;
        return pagination;
  	};
  	return d3.rebind(pagination, event, 'on');
  }

})(window);