/**
 * 车道参考线里程
 * @param {Object} context
 */
iD.ui.DistanceRLine = function(context) {
    var btnDatas = [{
        id: 'btn-distance-rline',
        title: '里程',
        action: function(){
            showTotal();
        }
    }];

    function showTotal(){
        if(!iD.Task.d) return ;
        var rlines = [];
        var distanceList = [];
        var rlines = context.intersects(iD.geo.Extent([-Infinity, -Infinity], [Infinity, Infinity]));
        rlines = rlines.filter(function(d){
            let flag = d.modelName == iD.data.DataType.DIVIDER
                && d.tags.R_LINE == '1';
            if(!flag) return flag;

            let wayDis = 0;
            let nodes = context.childNodes(d);
            nodes.forEach(function(n, idx){
                if(idx == nodes.length - 1){
                    return ;
                }
                let dis = iD.util.distanceByLngLat(n.loc, nodes[idx+1].loc) || 0;
                wayDis += dis;
            });
            distanceList.push(wayDis);
            return flag;
        });
        if(!rlines.length){
            Dialog.alert('任务中没有参考线数据');
            return ;
        }

        let totalDis = 0;
        distanceList.forEach(function(v){
            totalDis += v;
        });
        let disText = '';
        if(totalDis < 1000){
            disText = totalDis.toFixed(2) + '米';
        }else {
            disText = (totalDis / 1000).toFixed(3) + '公里';
        }

        Dialog.alert([
            '<p>参考线: ' + rlines.length + '个</p>',
            '<p>总里程: ' + disText + '</p>',
        ].join(''));

    }
    
    return function(selection) {
        var button = selection.selectAll('button')
            .data(btnDatas)
            .enter().append('button')
            .attr('tabindex', -1)
            .attr('class', function(d) { return d.id; })
            .on('click.uizoom', function(d) { 
                d.action();
            })
            .call(bootstrap.tooltip()
                .placement('left')
                .title(function(d) {
                    return d.title;
                }));

        button.append('span')
            .attr('class', 'text-center')
            .text(function(d) { 
                var str = d.title;
                for(var key in d.style){
                    this.style[key] = d.style[key];
                }
                return str.substring(0, d.titleNum || 4);
            });
    };
};