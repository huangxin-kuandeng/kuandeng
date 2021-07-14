iD.ui.FeatureList = function(context) {
    var layerInfo,
        event= d3.dispatch('close'),
        tabs = [{
            title : t('inspector.data_list_tab_name'),
            key : 'search',
            action : iD.ui.SearchList(context)
        },{
            title : t('inspector.style_setting_tab_name'),
            key : 'style',
            action : iD.ui.StyleSettingList(context)
        }];

    var cTabs = [], ui = context.options.ui, dataPane = ui && ui.dataPane, stylePane = ui && ui.stylePane;
    if (dataPane) cTabs.push(tabs[0]);//数据列表 选项卡
    if (stylePane) cTabs.push(tabs[1]);//样式列表 选项卡
    if (typeof dataPane === 'undefined' && typeof stylePane === 'undefined') {//默认
    	cTabs.push(tabs[0]); cTabs.push(tabs[1]);
    }
    tabs = cTabs;
    
    function featureList(selection) {

        var $header = selection.selectAll('.KDSEditor-header')
            .data([0]);

        var $headerEnter = $header.enter()
            .append('div')
            .attr('class', 'KDSEditor-header KDSEditor-fillL cf');

        $headerEnter.append('button')
            .attr('class','KDSEditor-fr')
            .on('click',function(){
            	//这块不应该这么写
            	//解决的问题是在绘制tabsContent的时候，只有第一次重绘，后续就不重绘了
            	//不知道是什么原因造成的
            	//目前只是临时解决一下
            	selection.html('');
            	event.close();
            })
            .append('span')
            .attr('class','KDSEditor-icon close');
        $headerEnter.append('h3')
            .text(layerInfo.name+t('inspector.feature_list'));

        function drawTabsHeader(){
            var $tabs = selection.selectAll('.KDSEditor-feature-tabs')
                        .data([0]);
            var $tabsEnter = $tabs.enter()
                        .append('ul')
                        .attr('class','KDSEditor-feature-tabs')
                        .attr('id','feature_tabs');
            var $items = $tabsEnter.selectAll('li')
                .data(tabs,function(d){ return d.key ;});

            var $enter = $items.enter().append('li')
                    .attr('data-tab',function(d){ return d.key;})
                    .append('a')
                    .attr('class','anchor')
                    .html(function(d){ return d.title ;});
            $items.exit()
                    .remove();
        };
        function drawTabsContent(){
            var $tabsContent = selection.selectAll('.KDSEditor-feature-tabsContent')
                        .data([0]);
            var $tabsContentEnter = $tabsContent.enter()
                        .append('div')
                        .attr('class','KDSEditor-feature-tabsContent')
                        .attr('id','feature_tabsContent');

            var $items = $tabsContentEnter.selectAll('div')
                            .data(tabs,function(d){ return d.key ;});
            var $enter = $items.enter()
                    .append('div')
                    .attr('data-tab',function(d){ return d.key ;})
                    .attr('class',function(d){
                        return d.key + '-list-pane';
                    });
            $enter.each(function(d){
                d3.select(this).call(d.action.layerInfo(layerInfo));
            });

            $items.exit()
                    .remove();
        };
        drawTabsHeader();
        drawTabsContent();

        //执行Tabs
        if (tabs.length) bootstrap.tabs()('feature_tabs','feature_tabsContent');
    }
    featureList.layerInfo = function(_){
        if (!arguments.length) return layerInfo;
        layerInfo = _;
        return featureList;
    };

    return d3.rebind(featureList,event,'on');
};
