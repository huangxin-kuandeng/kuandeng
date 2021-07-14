(function(){

// 通用
var $container;
var paramList = [];
var context;
var listShow = false;

// var dispatch = d3.dispatch();
// var player;

function IntersectionList() {
    this.$dom;
    this.$list;
    this.$detail;
    this.$toggle;
    this.$close;
}
_.assign(IntersectionList.prototype, {
    init: function(ctx){
        context = ctx;
        this.render(d3.select('body'));
    },
    render: function(container) {
        var self = this;
        var $panel = d3.select('#intersection-history-div');
        var $detail = d3.select('#showdata');
        var $toggle = d3.select('#intersection-history-div .history-toggle');
        var $close =  d3.select('#intersection-history-div .history-close');
        if(!$panel || !$panel.node()){
            $panel = container.append("div").attr("id", "intersection-history-div")
                .attr('class', 'hide');
            $panel.append("div").attr("class", "history-title").text('前方交会列表');
            $panel.append("div").attr("class", "history-list");

            $close = $panel.append("div").attr("class", "history-close").text('×');

            $toggle = $panel.append("div").attr("class", "history-toggle");
            $toggle.append('i').attr('class', 'glyphicon glyphicon-chevron-up');
            $toggle.append('i').attr('class', 'glyphicon glyphicon-chevron-down');

            $detail.node() && $detail.remove();
            $detail = container
                .append('div').attr('id','showdata')
                .attr('class', 'hide')
        }
        var $list = $panel.select("div.history-list");
        $container = $panel;
        self.$dom = $container;
        self.$list = $list;
        self.$detail = $detail;
        self.$toggle = $toggle;
        self.$close = $close;

        self.refresh();
        self.initEvent();

        self.resize();
        self.close();
    },
    add: function(geometry, canvasList, opts){
        var nodeid = iD.picUtil.createIntersectionDatum(geometry, opts);
        var hisdata = {
            geometry: geometry,
            points: _.cloneDeep(canvasList),
            id: nodeid
        };
        paramList.push(hisdata);
        this.open();
        // this.refresh();
    },
    show: function(){
        var self = this;
        if(!self.$dom || !self.$dom.node()){
            return ;
        }
        listShow = true;
        self.$list.classed('hide', false);
        self.$toggle.selectAll('.glyphicon').classed('hide', true);
        self.$toggle.select('.glyphicon-chevron-up').classed('hide', false);
    },
    hide: function(){
        var self = this;
        if(!self.$dom || !self.$dom.node()){
            return ;
        }
        listShow = false;
        self.$list.classed('hide', true);
        // self.$detail.classed('hide', true);
        self.$toggle.selectAll('.glyphicon').classed('hide', true);
        self.$toggle.select('.glyphicon-chevron-down').classed('hide', false);
    },
    open: function(){
        var self = this;
        if(!self.$dom || !self.$dom.node()){
            return ;
        }
        self.$dom.classed('hide', false);
        self.show();
        self.refresh();
    },
    close: function(){
        var self = this;
        if(!self.$dom || !self.$dom.node()){
            return ;
        }
        self.$dom.classed('hide', true);
        self.$detail.classed('hide', true);
        self.hide();
    },
    isVisible: function(){
        return this.$dom && !this.$dom.classed('hide');
    },
    resize: function(){
        var self = this;
        if(!self.$dom || !self.$dom.node()){
            return ;
        }
        self.$list.style('max-height', window.innerHeight * 0.7 + 'px');
    },
    refresh: function(){
        var self = this;
        if(!self.isVisible()){
            return ;
        }
        self.refreshList();
    },
    refreshList: function(){
        var $list = this.$list;
        var $items = $list.selectAll("div.list-item").data(paramList.filter(function(d){
            return context.hasEntity(d.id);
        }));
        $items.exit().remove();

        $items.enter().append("div").attr("class", "list-item")
            .each(function(d){
                var $this = d3.select(this);
                var geometry = d.geometry;
                // var showId = Math.abs(iD.Entity.id.toOSM(d.id));
                var showId = iD.Entity.id.toOSM(d.id);
                var utmLonlat = iD.util.LLtoUTM_(geometry.lng, geometry.lat);
                var utmx = utmLonlat.x.toFixed(3);
                var utmy = utmLonlat.y.toFixed(3);
                var lng = geometry.lng && geometry.lng.toFixed(6), 
                    lat = geometry.lat && geometry.lat.toFixed(6), 
                    z = geometry.elevation && geometry.elevation.toFixed(6);
                $this.html(
                    `
                    <div class="item-prefix">
                        ${showId || ""}
                    </div>
                    <div class="item-left">
                        <p>${lng || ""}</p>
                        <p>${lat || ""}</p>
                        <p>${z || ""}</p>
                        <hr />
                        <p>${utmx || ""}</p>
                        <p>${utmy || ""}</p>
                    </div>
                    <div class="btn-list">
                        <button type="button" class="detail">详情</button>
                        <button type="button" class="locate">定位</button>
                    </div>
                    `);
            });
        $list.selectAll("div.list-item button.detail").on("click.pic-player", function(d){
            var data = this.parentNode.parentNode.__data__;
            var geometry = data.geometry;
            var pointDatas = data.points;
            var arr = [{
                trackPointId: pointDatas[0].trackPointId,
                x: pointDatas[0].imgOffset.x,
                y: pointDatas[0].imgOffset.y,
                point: pointDatas[0].point
            }, {
                trackPointId: pointDatas[1].trackPointId,
                x: pointDatas[1].imgOffset.x,
                y: pointDatas[1].imgOffset.y,
                point: pointDatas[1].point
            }];
            var utmLonlat = iD.util.LLtoUTM_(geometry.lng, geometry.lat);

            showdata(arr, {
                center: geometry.lng + "," + geometry.lat,
                utmX: utmLonlat.x,
                utmY: utmLonlat.y
            });
        });
        $list.selectAll("div.list-item button.locate").on("click.pic-player", function(d){
            var data = this.parentNode.parentNode.__data__;
            var geometry = data.geometry;
            if(!geometry) return ;
            context.map().center([geometry.lng, geometry.lat]);
        });
    },
    initEvent: function(){
        var self = this;
        self.$close.on('click', function(){
            self.close();
        });
        self.$toggle.on('click', function(){
            if(listShow){
                self.hide();
            }else {
                self.show();
            }
        });
        d3.select(window).on('resize._intersection_list', function(){
            self.resize();
        });

        // var isUndone = false;
        // context.history().on('undone._intersection_list', function(){
        //     isUndone = true;
        // });

        context.history().on('change._intersection_list', function (difference, extent) {
            if(!self.isVisible()){
                return ;
            }
            // if(isUndone) {
            //     isUndone = false;
            //     return ;
            // }
            // history的change事件，与视频绘制后context.perform冲突，可能导致绘制反投多次的问题；
            if (difference && !extent) {
                let changed = false;
                // 添加/删除前方交会时，刷新
                let changes = difference.created().concat(difference.deleted());
                for(let d of changes){
                    if(d.isPlaceName && d.isPlaceName()){
                        changed = true;
                        break;
                    }
                }
                changed && self.refresh();
            }
        });
    }
});


function showdata(data, opts){
    opts = opts || {};
    // table table-bordered table-hover
    var tableTempl =result=>`
<div>
    <table id="example2" class="">
        <thead>
            <tr>
            <th>trackPointId</th>
            <th>roll</th>
            <th>pitch</th>
            <th>azimuth</th>
            <th>x</th>
            <th>y</th>
            <th>z</th>
            <th>pixelX</th>
            <th>pixelY</th>
            <th>UTM-X</th>
            <th>UTM-Y</th>
            </tr>
        </thead>
        <tbody>
            ${result.map(d => `
            <tr>
                <td>${d.point.tags.trackPointId}</td>
                <td>${d.point.tags.roll}</td>
                <td>${d.point.tags.pitch}</td>
                <td>${d.point.tags.azimuth}</td>
                <td>${d.point.tags.x}</td>
                <td>${d.point.tags.y}</td>
                <td>${d.point.tags.z}</td>
                <td>${d.x}</td>
                <td>${d.y}</td>
                <td>${opts.utmX}</td>
                <td>${opts.utmY}</td>
            </tr>
        `).join('')}
        </tbody>
        <tfoot>
            <tr>
                <th>trackPointId</th>
                <th>roll</th>
                <th>pitch</th>
                <th>azimuth</th>
                <th>x</th>
                <th>y</th>
                <th>z</th>
                <th>pixelX</th>
                <th>pixelY</th>
                <th>UTM-X</th>
                <th>UTM-Y</th>
            </tr>
        </tfoot>
    </table>
    <div class="positioning-location"> 
        <div>
            <input type="text" class="coordinate-text"  placeholder="x, y" value="${opts.center || ""}"/>
        </div>
        <input class="coordinate-subimt" value="定位" type="button"/>
        <input class="coordinate-close" value="关闭" type="button"/>
    </div>
</div>    
        `;
    var table =tableTempl(data);
    var $showdata = intersectionList.$detail.html(table).classed('hide', false);
    $showdata.select('.coordinate-subimt').on('click',function(){
        var $input = $showdata.select('input.coordinate-text');
        var coordinate =  $input.value() || $input.attr("placeholder");
        var xy = coordinate.split(',');
        if(xy.length != 2){
            Dialog.alert('坐标格式错误： '+xy);
            return ;
        }
        // ,z: +xy[2]
        context.map().center([+xy[0],+xy[1]]);
        // iD.picUtil.createIntersectionDatum({x:+xy[0],y:+xy[1]});
    })
    $showdata.select('.coordinate-close').on('click',function(){
        $showdata.html("").classed('hide', true);
    })
}

// var playerPosForm = new PlayerPosForm();
// return d3.rebind(playerPosForm, dispatch, 'on');

var intersectionList = new IntersectionList();


iD.svg.PlayerIntersectionList = function(ctx){
    if(!context){
        intersectionList.init(ctx)
    }
    return intersectionList;
}
})();
