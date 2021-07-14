iD.svg.PlayerTrackCurve = function(context, _opts) {
    _opts = _opts || {};
    const isSubPlayer = _opts.hasOwnProperty('isSubPlayer') ? _opts.isSubPlayer : false;

    var dispatch = d3.dispatch(
        'node_drag', 'node_dragend', 'node_offset_change'
    );
    
    // offsetCal=true时，轨迹才会加上xyz偏移量
    var posParam = iD.Task.getPosParam();
    var useOffsetCal = posParam.offsetCal;

    var curveForm = new iD.svg.PlayerTrackCurveForm(context, _opts);
    // current-当前点，all-全部点
    var curverStatus = 'current';
    var player;
    // 原始轨迹
    var trackObj;
    // 轨迹默认xyz偏移量，xy是UTM.x，UTM.y
    var trackNodeDelta = {};
    // 记录节点被修改后的值
    var trackNodeChanged = {};

    var chart1 = new TrackCurveChart(chartOption({
        title: 'dx(UTM)',
        tipValText: 'dx'
    }, 'x'));
    var chart2 = new TrackCurveChart(chartOption({
        title: 'dy(UTM)',
        tipValText: 'dy'
    }, 'y'));
    var chart3 = new TrackCurveChart(chartOption({
        title: 'dz',
        tipValText: 'dz',
    }, 'z'));

    function chartOption(opts, tagName){
        opts = opts || {};
        return Object.assign({
            serieDataValue: function(node, idx){
                return trackNodeDelta[node.id] && trackNodeDelta[node.id][tagName] || 0;
            },
            dataZoomRange: getTrackCurrentRange,
            currentIndex: function(){
                return player.selectPicIndex;
            },
            // 拖拽更新时，小数点精度
            dragPrecision: 2,
            onDraging: function(p){
                var index = p[0];
                var newValue = p[1];
                var node = trackObj.nodes[index];
                updateNodeChanged(index, newValue, tagName);
                dispatch.node_drag(trackNodeChanged, node.id, index);
            },
            onDragend: function(p){
                var index = p[0];
                var node = trackObj.nodes[index];
                dispatch.node_dragend(trackNodeChanged, node.id, index);
            },
            onSeriesUpdate: function(index, newValue){
                var node = trackObj.nodes[index];
                updateNodeChanged(index, newValue, tagName);
                dispatch.node_offset_change(trackNodeChanged, node.id, index);
            },
            isVisible: function(){
                return playerTrackCurve.isVisible();
            }
        }, opts);
    }

    function updateNodeChanged(index, newValue, tagName){
        var node = trackObj.nodes[index];
        var delta = trackNodeDelta[node.id] && trackNodeDelta[node.id][tagName] || 0;
        if(!trackNodeChanged[node.id]){
            trackNodeChanged[node.id] = {};
        }
        trackNodeChanged[node.id][tagName] = newValue - delta;
    }

    function PlayerTrackCurve() {
        this.$dom;
        this.$close;
        this.$buttons;
        this.$controlButtons;
    }
    _.assign(PlayerTrackCurve.prototype, {
        init: function(arg1) {
            player = arg1;
            formParam = {};

            curveForm.init(arg1, this);
        },
        render: function($root) {
            var self = this;
            self.$dom = $root;
            trackObj = null;
            trackNodeChanged = {};
            self.$close = $root.append('div')
                .attr('class', 'wrapper-close')
                .text('×');
            self.$buttons = $root.append('div')
                .attr('class', 'trackcurve-buttons buttons');
            self.$buttons.append('button')
                .attr('type', 'button')
                .attr('class', 'btn showall' + (curverStatus == 'all' ? ' active': ''))
                .text('全部点');
            self.$buttons.append('button')
                .attr('type', 'button')
                .attr('class', 'btn showcurrent' + (curverStatus == 'current' ? ' active': ''))
                .text('当前点(跟随视频)');
            
            self.$controlButtons = $root.append('div')
                .attr('class', 'trackcurve-control-buttons buttons');
            
            self.$controlButtons.append('button')
                .attr('type', 'button')
                .attr('class', 'btn showform hide')
                .text('表单');
            self.$controlButtons.append('button')
                .attr('type', 'button')
                .attr('class', 'btn showcurve')
                .text('曲线图');

            var div1 = $root.append('div')
                // .attr('id', 'picplayer_track_curver')
                .attr('class', 'chart-wrapper');
            var div2 = $root.append('div')
                .attr('class', 'chart-wrapper');
            var div3 = $root.append('div')
                .attr('class', 'chart-wrapper');
            
            chart1.init(div1.node());
            chart2.init(div2.node());
            chart3.init(div3.node());

            curveForm.render($root.append('div').attr('class', 'curveform-wrapper'));

            self.initEvent();
            self.hide();
        },
        clearChanged: function(){
            trackNodeChanged = {};
        },
        setTrack: function(trackId){
            var self = this;
            // 不重复渲染
            if(trackId && trackObj && trackObj.trackId == trackId){
                return ;
            }

            trackNodeDelta = {};
            trackNodeChanged = {};
            // 基于原始轨迹，轨迹点调整dx\dy\dz
            // useOffsetCal=false时，原始轨迹无偏移，默认0
            trackObj = player.dataMgr.getTrack(trackId);
            trackNodeDelta = iD.picUtil.getTrackNodesOffset(trackObj, player.dataMgr.planeFrames, useOffsetCal, true);
            // console.log('track utm offset ... ', trackNodeDelta);

            chart1.setTrack(trackObj);
            chart2.setTrack(trackObj);
            chart3.setTrack(trackObj);

            self.renderTrack();
            // self.show();

            if(curveForm && curveForm.isVisible()){
                curveForm.setTrack(trackObj, trackNodeDelta);
            }
        },
        setNodeIndex: function(index, targetZoom){
            var self = this;
            if(curverStatus == 'all') {
                chart1.refreshCurrentNode();
                chart2.refreshCurrentNode();
                chart3.refreshCurrentNode();
            }
            if(!targetZoom && curverStatus != 'current') return ;
            // 指定zoom时更新显示范围
            if(!targetZoom && !self.isVisible()){
                return ;
            }
            console.time('index changed');
            // 150ms
            chart1.setIndexRange(index, targetZoom);
            chart2.setIndexRange(index, targetZoom);
            chart3.setIndexRange(index, targetZoom);
            console.timeEnd('index changed');
        },
        refreshCharts: function (){
            chart1.refresh();
            chart2.refresh();
            chart3.refresh();
        },
        initEvent: function(){
            var self = this;
            var updateIndex = _.debounce(function(){
                self.setNodeIndex.apply(self, _.toArray(arguments));
            }, 200, {
                leading: false,
                trailing: true
            });
            player.on('picUpdate.picplayer-trackcurve', function(){
                // if(player.playStatus == 'play') return ;
                updateIndex(player.selectPicIndex);
            });

            self.$close.on('click', function(){
                if(self.$dom.classed('hide')){
                    self.$dom.classed('hide', false);
                }else {
                    self.$dom.classed('hide', true);
                }
            });

            self.$buttons.select('.showcurrent').on('click', function(){
                self.$buttons.selectAll('button').classed('active', false);
                d3.select(this).classed('active', true);
                curverStatus = 'current';
                self.setNodeIndex(player.selectPicIndex);
                self.refreshCharts();
            });
            self.$buttons.select('.showall').on('click', function(){
                self.$buttons.selectAll('button').classed('active', false);
                d3.select(this).classed('active', true);
                curverStatus = 'all';
                self.setNodeIndex(player.selectPicIndex, {
                    startValue: 0,
                    endValue: trackObj.nodes.length - 1
                });
                self.refreshCharts();
            });

            // 全部/当前，切换
            initMouseClick2Player(chart1);
            initMouseClick2Player(chart2);
            initMouseClick2Player(chart3);

            function initMouseClick2Player(chart){
                chart.getChart().on('click', function(data){
                    if(!['series', 'graphic'].includes(data.componentType)){
                        return ;
                    }
                    var idx = chart.getMouseDataIndex();
                    if(idx == -1){
                        return ;
                    }
                    player.locateFrameByIndex(idx);
                });
            }

            // 曲线图/表单，切换
            var $showCurve = self.$controlButtons.select('.showcurve')
                .on('click', function(){
                    if(curveForm){
                        curveForm.hide();
                    }
                    controlButtonStatus();
                });
            var $showForm = self.$controlButtons.select('.showform')
                .on('click', function(){
                    if(curveForm){
                        curveForm.show();
                        curveForm.setTrack(trackObj, trackNodeDelta);
                    }
                    controlButtonStatus();
                });
            
            function controlButtonStatus(){
                if(curveForm && curveForm.isVisible()){
                    $showCurve.classed('hide', false);
                    $showForm.classed('hide', true);
                }else {
                    $showCurve.classed('hide', true);
                    $showForm.classed('hide', false);
                }
            }
            controlButtonStatus();

            // 表单双击
            // if(curveForm){
            //     curveForm.on('rowdblclick.trackcurve', function(d){
            //         if(d.index == -1) return ;
            //         player.locateFrameByIndex(d.index);
            //     });
            // }
        },
        renderTrack: function(){
            var self = this;
            if(!trackObj){
                return ;
            }
            chart1.render();
            chart2.render();
            chart3.render();
            
            if(curverStatus == 'all'){
                self.setNodeIndex(player.selectPicIndex, {
                    startValue: 0,
                    endValue: trackObj.nodes.length - 1
                });
            }

            window.myChart = chart1.getChart();
            window.myChart2 = chart2.getChart();
            window.myChart3 = chart3.getChart();
        },
        getChanged: function(){
            return trackNodeChanged;
        },
        getNodeOffset: function(nodeid){
            if(!player || !player.wayInfo){
                return;
            }
            // 默认偏移量0
            let proto = trackNodeDelta[nodeid] || {
                x: 0,
                y: 0,
                z: 0
            };
            let offset = trackNodeChanged[nodeid] || {};
            let result = {};
            for(let k in proto){
                result[k] = (proto[k] || 0) + (offset[k] || 0);
            }
            return result;
        },
        setNodeOffset: function(index, offset){
            if(index == null || !offset){
                return ;
            }
            if(offset.x != null){
                chart1.updateSeriesValue(index, offset.x);
            }
            if(offset.y != null){
                chart2.updateSeriesValue(index, offset.y);
            }
            if(offset.z != null){
                chart3.updateSeriesValue(index, offset.z);
            }
        },
        isVisible: function(){
            let flag = this.$dom && !this.$dom.classed('hide') || false;
            if(flag && curveForm){
                flag = !curveForm.isVisible();
            }
            return flag;
        },
        show: function(){
            this.$dom && this.$dom.classed('hide', false);
            if(curveForm && curveForm.isVisible()){
                curveForm.resizeTable();
            }
        },
        hide: function(){
            this.$dom && this.$dom.classed('hide', true);
        }
    });

    function getTrackCurrentRange(track, trackIndex){
        track = track || trackObj;
        // 3 - now - 4
        var diff = 3;
        var a = 0;
        var b = 0;
        var minIdx = 0;
        var maxIdx = track.nodes.length - 1;
        var index = trackIndex != null ? trackIndex : player.selectPicIndex;
        if(player.wayInfo.trackId != track.trackId){
            index = 0;
        }
        if(index - diff < minIdx){
            a = minIdx,
            b = a + diff*2 + 1;
        }else if(index + diff > maxIdx){
            b = maxIdx;
            a = b - diff*2 + 1;
        }else {
            a = index - diff;
            b = index + diff + 1;
        }
        if(a < 0){
            a = 0;
        }
        if(b > maxIdx){
            b = maxIdx;
        }
        return [a, b];
    }

    var playerTrackCurve = new PlayerTrackCurve();
    return d3.rebind(playerTrackCurve, dispatch, 'on');
}

function TrackCurveChart(opts){
    opts = opts || {};
    var trackObj;
    // 
    var myChart;
    var chartInited = false;

    // 半径
    var symbolSize = 10;
    var symbolShowNumber = opts.symbolShowNumber || 20;
    var optionColor = [
        "#c23531", "#2f4554", "#61a0a8", 
        "#d48265", "#91c7ae", "#749f83", 
        "#ca8622", "#bda29a", "#6e7074", 
        "#546570", "#c4ccd3"
    ];
    var currentNodeColor = '#37A2DA';
    var currentIndex = opts.currentIndex;
    var dragPrecision = opts.dragPrecision != null ? opts.dragPrecision : 2;
    // 记录节点是否正在显示（拖拽、缩放改变等操作刷新）
    var symbolIsVisible;
    // 记录鼠标位置的数据索引
    var mouseDataIndex = -1;
    
    // 不需要四舍五入
    function precisionNum(num){
        let str = num.toFixed(dragPrecision + 1);
        str = str.slice(0, str.length - 1);
        return Number(str);
    }

    var xMin = 0;
    var xMax = 0;
    var yMin = 0;
    var yMax = 0;
    // y范围扩充 [min, max]
    var expandYNum = opts.expandY || [1, 1];
    // 节点信息，[index, z]
    var serieData = [];

    var chartOption = {
        title: {
            text: opts.title || '',
            textStyle: {
                fontSize: 14
            }
        },
        animation: false,
        tooltip: {
            show: true,
            // triggerOn: 'none',
            triggerOn: 'mousemove',
            trigger: 'axis',
            axisPointer: {
                type: 'line',
                label: {
                    backgroundColor: '#6a7985'
                }
            },
            // alwaysShowContent: true,
            // position: [0, 0],
            formatter: function (params) {
                params = params[0] || params;
                mouseDataIndex = params.data[0];
                return '' + params.data[0] + '<br>' + (opts.tipValText || '') + ': ' + precisionNum(params.data[1]);
            }
        },
        grid: Object.assign({
            top: 25,
            left: 35,
            right: 20,
            bottom: 45,
            // height: 160
        }, opts.grid),
        xAxis: {
            min: xMin,
            max: xMax,
            // type: 'category',
            type: 'value',
            axisLine: {onZero: false}
        },
        yAxis: {
            // min: function(v){
            //     if(!expandYNum[0]) return v.min;
            //     yMin = v.min - expandYNum[0];
            //     yMin = Math.ceil(yMin);
            //     return yMin;
            // },
            // max: function(v){
            //     if(!expandYNum[1]) return v.max;
            //     yMax = v.max + expandYNum[1];
            //     yMax = Math.ceil(yMax);
            //     return yMax;
            // },
            min: yMin,
            max: yMax,
            type: 'value',
            axisLine: {onZero: false}
        },
        dataZoom: [{
            type: 'slider',
            xAxisIndex: 0,
            filterMode: 'none',
            minValueSpan: 7,
            left: 20,
            right: 20,
            // start: 0,
            // end: 10,
            labelPrecision: 0,
            // throttle: 100
            top: 'auto',
            height: 25,
            bottom: 0
        },
        // {
        //     type: 'slider',
        //     yAxisIndex: 0,
        //     filterMode: 'empty'
        // },
        {
            type: 'inside',
            xAxisIndex: 0,
            filterMode: 'empty',
            minValueSpan: 7
            // throttle: 200
        }],
        series: [{
            id: 'trackNode',
            type: 'line',
            // smooth: true,
            step: false,
            showSymbol: false,
            symbolSize: symbolSize,
            data: serieData,
            // areaStyle: {
            //     origin: 'start'
            // }
            itemStyle: {
                color: function(d){
                    let idx = d.value[0];
                    if(symbolIsVisible && currentIndex && currentIndex() == idx){
                        return currentNodeColor;
                    }
                    return optionColor[0];
                },
                borderWidth: 2
            },
            lineStyle: {
                color: optionColor[0]
            }
        }],
        color: optionColor
    };

    function init(element){
        if(!element || chartInited) return ;
        myChart = echarts.init(element);
        chartInited = true;
        initEvent();
    }

    function initEvent(){
        d3.select(myChart.getDom()).on('mouseout', mouseout);

        function mouseout(){
            // 取消dataZoom的拖拽状态
            myChart.dispatchAction({
                type: 'takeGlobalCursor',
                key: 'dataZoomSelect',
                // 启动或关闭
                dataZoomSelectActive: true
            });
        }
    }

    function setTrack(track){
        trackObj = track;
        serieData.length = 0;
    }

    function render(){
        if(!trackObj || !myChart){
            return ;
        }

        xMin = 0;
        xMax = trackObj.nodes.length - 1;
        yMin = Infinity;
        yMax = -Infinity;
        // serieData
        trackObj.nodes.forEach(function(node, idx){
            let z = opts.serieDataValue && opts.serieDataValue(node, idx) || 0;
            let p = [idx, z];
            serieData.push(p);

            if(z < yMin){
                yMin = z;
            }
            if(z > yMax){
                yMax = z;
            }
        });
        chartOption.xAxis.min = xMin;
        chartOption.xAxis.max = xMax;
        chartOption.series[0].data = serieData;

        refreshYAxis(false, {
            min: yMin,
            max: yMax
        });

        if(opts.dataZoomRange instanceof Function){
            var range = opts.dataZoomRange(trackObj);
            if(range.length == 2){
                chartOption.dataZoom[0].startValue = range[0];
                chartOption.dataZoom[0].endValue = range[1];
            }
        }

        myChart.setOption(chartOption);

        myChart.setOption(createGraphicOption());

        // window.addEventListener('resize', updatePosition);
        myChart.off('dataZoom', updatePosition);
        myChart.on('dataZoom', updatePosition);

        symbolIsVisible = null;
        updatePosition();
    }

    function refreshYAxis(update = true, obj){
        let y = getYAxisMinMax(obj);
        yMin = y.min;
        yMax = y.max;
        chartOption.yAxis.min = yMin;
        chartOption.yAxis.max = yMax;

        update && myChart.setOption({
            yAxis: {
                min: yMin,
                max: yMax
            }
        });

        return y;
    }

    function getYAxisMinMax(obj){
        var min = Infinity;
        var max = -Infinity;
        if(obj){
            min = obj.min;
            max = obj.max;
        }else {
            serieData.forEach(function(p, idx){
                let v = p[1];
                if(v < min){
                    min = v;
                }
                if(v > max){
                    max = v;
                }
            });
        }
        if(expandYNum.length == 2){
            min -= expandYNum[0];
            max += expandYNum[1];
        }
        min = Math.ceil(min);
        max = Math.floor(max);

        return {
            min,
            max
        }
    }

    // 定位到当前点
    function setIndexRange(index, targetZoom){
        var zoom = targetZoom;
        if(!zoom && opts.dataZoomRange instanceof Function){
            var range = opts.dataZoomRange(trackObj, index);
            if(range.length == 2){
                zoom = {
                    startValue: range[0],
                    endValue: range[1]
                }
            }
        }
        // if(zoom){
        //     myChart.setOption({
        //         dataZoom: [zoom]
        //     });
        //     updatePosition();
        // }
        if(zoom){
            myChart.dispatchAction({
                type: 'dataZoom',
                startValue: zoom.startValue,
                endValue: zoom.endValue
            });
        }
    }

    
    function getGraphicRangeDatas(){
        // serieData
        var zoom = myChart.getOption().dataZoom[0];
        var range = [
            Math.ceil(zoom.startValue), 
            Math.ceil(zoom.endValue)
        ];
        var datas = [];
        if(range[1] - range[0] >= symbolShowNumber){
            return datas;
        }
        serieData.forEach(function(d, idx){
            if(idx >= range[0] && idx <= range[1]){
                datas.push({
                    item: d,
                    dataIndex: idx
                });
            }
        });
        return datas;
    }

    function getSeriesSymbolStatus(){
        var flag = false;
        var zoom = myChart.getOption().dataZoom[0];
        if(zoom.endValue - zoom.startValue <= symbolShowNumber){
            flag = true;
        }
        return flag;
    }

    function createGraphicOption(){
        // Add shadow circles (which is not visible) to enable drag.
        return {
            graphic: getGraphicRangeDatas().map(function (d, idx) {
                let item = d.item;
                let dataIndex = d.dataIndex;
                return {
                    id: idx,
                    type: 'circle',
                    // $action: 'remove',
                    position: myChart.convertToPixel('grid', item),
                    shape: {
                        cx: 0,
                        cy: 0,
                        r: symbolSize / 2 + 1
                    },
                    invisible: true,
                    draggable: true,
                    ondrag: echarts.util.curry(onPointDragging, dataIndex),
                    ondragend: echarts.util.curry(onPointDragend, dataIndex),
                    onmousedown: echarts.util.curry(showTooltipMousedown, dataIndex),
                    onmousemove: echarts.util.curry(showTooltip, dataIndex),
                    // onmouseleave: echarts.util.curry(hideTooltip, dataIndex),
                    z: 100
                };
            })
        };
    }
    function createCurrentGraphicOption(){
        let index = currentIndex();
        let datas = [{
            item: serieData[index],
            dataIndex: index
        }];
        // Add shadow circles (which is not visible) to enable drag.
        return {
            graphic: datas.map(function (d, idx) {
                let item = d.item;
                let dataIndex = d.dataIndex;
                return {
                    id: 'current_node',
                    type: 'circle',
                    // $action: 'remove',
                    position: myChart.convertToPixel('grid', item),
                    shape: {
                        cx: 0,
                        cy: 0,
                        r: symbolSize / 2 + 1
                    },
                    style: {
                        fill: '#FFF',
                        stroke: currentNodeColor,
                        lineWidth: 2
                    },
                    invisible: false,
                    draggable: false,
                    onmousemove: function(){
                        mouseDataIndex = dataIndex;
                        let oldTip = myChart.getOption().tooltip[0];
                        if(oldTip && oldTip.triggerOn != 'none'){
                            myChart.setOption({
                                tooltip: {
                                    triggerOn: 'none'
                                }
                            });
                        }
                        showTooltip(mouseDataIndex);
                    },
                    onmouseout: function(){
                        let oldTip = myChart.getOption().tooltip[0];
                        if(oldTip && oldTip.triggerOn == 'none'){
                            myChart.setOption({
                                tooltip: {
                                    triggerOn: chartOption.tooltip.triggerOn
                                }
                            });
                        }
                    },
                    z: 101
                };
            })
        };
    }

    // 全部点时刷新当前点位置
    function refreshCurrentNode(){
        var hasCurrent = false;
        var oldOption = myChart.getOption();
        var oldEles = oldOption.graphic && oldOption.graphic[0].elements || [];
        oldEles.forEach(function(d){
            if(hasCurrent) return ;
            if(d && d.id == 'current_node'){
                hasCurrent = true;
                return ;
            }
        });
        if(!hasCurrent) return ;
        myChart.setOption({
            graphic: createCurrentGraphicOption().graphic.map(function(d){
                d.$action = 'replace';
                return d;
            })
        });
    }

    function updatePosition() {
        var oldOption  = myChart.getOption();
        // var oldFlag = oldOption.series[0].showSymbol;
        var flag = getSeriesSymbolStatus();
        var options = {};
        if(symbolIsVisible != flag){
            options.series = [{
                id: 'trackNode',
                showSymbol: flag
            }];
        }
        symbolIsVisible = flag;
        // options.graphic = getGraphicRangeDatas().map(function (d, idx) {
        //     let item = d.item;
        //     let dataIndex = d.dataIndex;
        //     return {
        //         // id: idx,
        //         position: myChart.convertToPixel('grid', item),
        //         ondrag: echarts.util.curry(onPointDragging, dataIndex),
        //         onmousemove: echarts.util.curry(showTooltip, dataIndex),
        //         onmouseout: echarts.util.curry(hideTooltip, dataIndex)
        //     };
        // })
        if(flag){
            options.graphic = createGraphicOption().graphic;
            options.graphic.push({
                id: 'current_node',
                $action: 'remove'
            });
        }else {
            var oldEles = oldOption.graphic && oldOption.graphic[0].elements || [];
            var currentNode;
            options.graphic = oldEles.map(function(d){
                d.$action = 'remove';
                if(d.id == 'current_node') {
                    currentNode = d;
                }
                return d;
            });
            var newOption = createCurrentGraphicOption();
            if(currentNode){
                Object.assign(currentNode, newOption.graphic[0], {
                    $action: 'replace'
                });
            }else {
                options.graphic.push(...newOption.graphic);
            }
        }
        myChart.setOption(options);

        // if(!flag){
        //     console.log('add current node');
        //     myChart.setOption({
        //         graphic: createCurrentGraphicOption().graphic.map(function(d){
        //             d.$action = 'replace';
        //             return d;
        //         })
        //     });
        // }

        // myChart.setOption({
        //     graphic: getGraphicRangeDatas().map(function (d) {
        //         let item = d.item;
        //         // let dataIndex = d.dataIndex;
        //         return {
        //             position: myChart.convertToPixel('grid', item)
        //         };
        //     })
        // });
    }

    function showTooltipMousedown(dataIndex){
        myChart.setOption({
            tooltip: {
                alwaysShowContent: true
            }
        });
        showTooltip(dataIndex);
    }

    function showTooltip(dataIndex) {
        myChart.dispatchAction({
            type: 'showTip',
            seriesIndex: 0,
            dataIndex: dataIndex
        });
    }

    function hideTooltip(dataIndex) {
        myChart.setOption({
            tooltip: {
                alwaysShowContent: false
            }
        });
        myChart.dispatchAction({
            type: 'hideTip'
        });
    }

    // function onPointDragging(dataIndex, dx, dy) {
    function onPointDragging(dataIndex, evt) {
        var point = serieData[dataIndex];
        // serieData[dataIndex] = myChart.convertFromPixel('grid', this.position);
        var p = myChart.convertFromPixel('grid', this.position);
        if(p[0] < xMin) p[0] = xMin;
        if(p[0] > xMax) p[0] = xMax;
        if(p[1] < yMin) p[1] = yMin;
        if(p[1] > yMax) p[1] = yMax;
        
        p[1] = precisionNum(p[1]);
        point[1] = p[1];
        
        // 节点拖拽层
        if(evt && evt.target && evt.target._$eventProcessor){
            var circle = evt.target._$eventProcessor;
            var cp = myChart.convertToPixel('grid', point);
            var pos = circle.position;
            pos[0] = cp[0];
            if(p[1] >= yMax || p[1] <= yMin){
                pos[1] = cp[1];
            }
        }

        // Update data
        myChart.setOption({
            series: [{
                id: 'trackNode',
                data: serieData
            }]
        });

        opts.onDraging && opts.onDraging(point, dataIndex);
    }
    function onPointDragend(dataIndex, evt) {
        var point = serieData[dataIndex];
        opts.onDragend && opts.onDragend(point, dataIndex);

        hideTooltip(dataIndex);
    }

    function getMouseDataIndex(){
        return mouseDataIndex;
    }

    function updateSeriesValue(index, newValue){
        if(index == null || isNaN(newValue)) return ;
        if(!serieData[index]) return ;
        serieData[index][1] = newValue;

        var y = refreshYAxis(false);

        myChart.setOption({
            yAxis: {
                min: y.min,
                max: y.max
            },
            series: [{
                id: 'trackNode',
                data: serieData
            }]
        });

        updatePosition();

        opts.onSeriesUpdate && opts.onSeriesUpdate(index, newValue);
    }

    function refresh(){
        refreshYAxis(true);
        myChart.resize();
    }

    this.init = init;
    this.render = render;
    this.setTrack = setTrack;
    this.setIndexRange = setIndexRange;
    this.getMouseDataIndex = getMouseDataIndex;
    this.updateSeriesValue = updateSeriesValue;
    this.refreshCurrentNode = refreshCurrentNode;
    this.refresh = refresh;
    this.getChart = function(){
        return myChart;
    }
}