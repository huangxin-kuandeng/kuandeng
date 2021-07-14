iD.svg.PlayerTrackCurveForm = function(context, _opts) {
    _opts = _opts || {};
    const isSubPlayer = _opts.hasOwnProperty('isSubPlayer') ? _opts.isSubPlayer : false;

    var dispatch = d3.dispatch(
        'sortrow', 'rowclick', 'rowdblclick', 'rowcontextmenu',
        'colclick'
    );
    
    var player, playerTrackCurve;
    // 原始轨迹
    var trackObj;
    var trackNodeDelta = {};
    // 表头、表格内容
    var theadDataList = [{
        fieldName: 'index',
        fieldTitle: '索引'
    }, {
        fieldName: 'dx',
        fieldTitle: 'dx(UTM)'
    }, {
        fieldName: 'dy',
        fieldTitle: 'dy(UTM)'
    }, {
        fieldName: 'dz'
    }];
    var trDataList = [];

    function PlayerTrackCurveForm() {
        this.$dom;
        this.$theader;
        this.$table;
        this.$buttons;
        // 所有字段都可排序
        this.sortField = {
            name: '',
            sort: 'asc'
        };
    }
    _.assign(PlayerTrackCurveForm.prototype, {
        init: function(arg1, arg2) {
            player = arg1;
            playerTrackCurve = arg2;
        },
        render: function($root) {
            var self = this;
            self.$dom = $root;
            var $wrap = $root.append('div').attr('class', 'table-wrap clearfix');
            self.$theader = $wrap.append('div').attr('class', 'table-headwrap')
                .append('div').attr('class', 'table table-bordered table-header');
            self.$table = $wrap.append('div').attr('class', 'table-bodywrap')
                .append('div').attr('class', 'table table-bordered table-hover');
            self.$buttons = $root.append('div')
                .attr('class', 'curveform-buttons buttons');
            self.$buttons.append('input')
                .attr('type', 'number')
                .attr('placeholder', '索引')
                .attr('title', '表单定位到索引')
                .attr('min', 0)
                .attr('step', 1)
                .attr('class', 'locate_index');
            
            self.initEvent();
            self.hide();
        },
        setTrack: function(track, nodeDelta){
            // if(track && trackObj && track.trackId == trackObj.trackId){
            //     return ;
            // }
            trackObj = track;
            trackNodeDelta = nodeDelta;
            trDataList = [];
            trackObj.nodes.forEach(function(d, idx){
                let delta = trackNodeDelta[d.id];

                let obj = {
                    index: idx,
                    id: d.id,
                    // 原始值
                    // x,y,z
                    x: delta && delta.x || 0,
                    y: delta && delta.y || 0,
                    z: delta && delta.z || 0,
                    // 是否被修改过（曲线）
                    changed: false
                };
                // 当前值（调整后）
                obj.dx = obj.x;
                obj.dy = obj.x;
                obj.dz = obj.x;

                trDataList.push(obj);
            });
            this.renderTable();
            this.$buttons.select('input.locate_index')
                .attr('max', trackObj.nodes.length - 1)
                .value('');
        },
        renderTable: function(){
            var self = this;
            var $tableHeader = self.$theader.html('');
            var $table = self.$table.html('');
            // 调整过的偏移量
            var curveChanged = playerTrackCurve && playerTrackCurve.getChanged() || {};
            trDataList.forEach(function(d){
                let offset = curveChanged[d.id];
                if(!offset) return ;
                if(offset.x != null){
                    d.dx = d.x + offset.x;
                    d.changed = true;
                }
                if(offset.y != null){
                    d.dy = d.y + offset.y;
                    d.changed = true;
                }
                if(offset.z != null){
                    d.dz = d.z + offset.z;
                    d.changed = true;
                }
            });
            
            var $thList = $tableHeader.append('div').attr('class', 'tr')
                .selectAll('.th').data(theadDataList).enter()
                .append('div').attr('class', 'th')
                .attr('data-field', function(d){
                    return d.fieldName || '';
                });
            $thList.append('span')
                .attr('class', 'name')
                .text(function(d){
                    return d.fieldTitle || d.fieldName || '';
                });
            $thList.append('span')
                .attr('class', 'glyphicon glyphicon-arrow-down');
            $thList.append('span')
                .attr('class', 'glyphicon glyphicon-arrow-up');
            $thList.on('click', function(d){
                    // 点击排序
                    var sort = 'asc', fieldName = d.fieldName;
                    // if(self.sortField.name === fieldName){}
                    var oldSort = self.sortField.sort;
                    // 取反
                    sort = ['asc', 'desc'][Number(oldSort == 'asc')];

                    dispatch.sortrow(fieldName, sort);
                });
            var $trList = $table
                .selectAll('.tr').data(trDataList).enter()
                .append('div').attr('class', 'tr')
                .on('click', function(d, idx){
                    // 每行点击
                    dispatch.rowclick.call(this, d, idx);
                }).on('dblclick', function(d, idx){
                    // 每行双击
                    dispatch.rowdblclick.call(this, d, idx);
                }).on('contextmenu', function(d, idx){
                    dispatch.rowcontextmenu.call(this, d, idx);
                });
            
            $trList.selectAll('.td').data(function(d, index){
                var fieldNames = _.map(theadDataList, f => f.fieldName || false);
                fieldNames = _.compact(fieldNames);
                return fieldNames.map((name, idx) => {
                    let fvalue = d[name];
                    fvalue = fvalue == null ? '' : fvalue;
                    return {
                        name: name,
                        value: fvalue,
                        id: d.id,
                        row: index,
                        col: idx
                    };
                });
            }).enter()
            .append('div').attr('class', 'td')
            .on('click', function(d, idx){
                dispatch.colclick.call(this, d, idx);
            })
            .text(function(d){
                return d.value;
            });

            self.resizeTable();
            dispatch.sortrow(theadDataList[0].fieldName, this.sortField.sort);
        },
        // 值内容可能会过长，以值最大长度为准
        resizeTable: function(){
            var self = this;
            var $tableHeader = self.$theader;
            var $table = self.$table;
            var $trList = $table.selectAll('.tr');
            var wd = {};
            var domWidth = Number(self.$dom.style('width').split('px')[0]);
            var totalWidth = 0;
            var wdNum = 0;
            var $trs = d3.select($trList.node()).selectAll('.td').each(function(d){
                var $this = d3.select(this);
                var width = Number($this.style('width').split('px')[0]);
                if(width < 100){
                    width = 100;
                }
                var $th = $tableHeader.selectAll('.tr .th:nth-child(' + (d.col + 1) + ')');
                var thWidth = Number($th.style('width').split('px')[0]);
                width = _.max([thWidth, width]); 
                wd[d.name] = width;
            });

            // 最大宽度不足dom宽度，使用默认宽度；
            _.values(wd).forEach(function(v){
                totalWidth += v;
                wdNum += 1;
            });
            if(totalWidth <= domWidth){
                for(let k in wd){
                    wd[k] = domWidth / wdNum;
                }
            }
            
            $trs.each(function(d){
                if(!wd[d.name]) return ;
                var width = wd[d.name] + 'px';
                this.style.width = width;
                this.style['min-width'] = width;
            });
            $tableHeader.selectAll('.tr .th').each(function(d){
                if(!wd[d.fieldName]) return ;
                var width = wd[d.fieldName] + 'px';
                this.style.width = width;
                this.style['min-width'] = width;
            });
        },
        refresh: function(){
            this.renderTable();
        },
        initEvent: function(){
            var self = this;
            var ns = 'curve-form';
            // 行点击
            dispatch.on('rowclick.' + ns, function(d){
                lightRow(self, this);
            });
            
            // 列点击
            dispatch.on('colclick.' + ns, function(d){
                if(d.col < 1){
                    clearLastInput();
                    return ;
                }
                var evt = d3.event;
                evt.stopPropagation();
                evt.preventDefault();
                // dx\dy\dz
                // 防止重复点击
                if(evt.target.nodeName != 'DIV' || 
                    !evt.target.classList.contains('td')){
                    return ;
                }
                td2Input(d, this, function(newValue){
                    var row = trDataList[d.row];
                    // x\y\z
                    var pname = d.name.split('d')[1];
                    let obj = {};
                    obj[pname] = newValue;
                    playerTrackCurve.setNodeOffset(row.index, obj);

                    row[d.name] = newValue;
                    d.value = newValue;
                });
            });

            // 行右键 菜单
            dispatch.on('rowcontextmenu.' + ns, function(d){
                // var evt = d3.event;
                // evt.preventDefault();
            });
            // 行排序
            dispatch.on('sortrow.' + ns, function(fieldName, sort = '', useOrder = false){
                if(!self.isVisible() || !self.$dom || !self.$dom.size()) return false;
                var $thList = self.$dom.selectAll('.table-headwrap .th');
                var $trList = self.$dom.selectAll('.table-bodywrap .tr');
                
                // 进行过排序，完全一致的情况
                if($thList.filter('.sort').size() 
                    && self.sortField.name === fieldName 
                    && self.sortField.sort === sort){
                    return ;
                }
                
                $trList.sort(function(d1, d2){
                    var v1 = d1[fieldName] || '', v2 = d2[fieldName] || '';
                    return sortNumber(v1, v2, sort);
                });
                self.sortField.name = fieldName;
                self.sortField.sort = sort;
                
                $thList.filter('.sort').classed('sort asc desc', false);
                $thList.filter('[data-field=' + fieldName + ']').classed('sort ' + sort, true);
            });

            // 输入索引定位
            self.$buttons.select('input.locate_index').on('keyup', function(){
                var evt = d3.event;
                if(evt.keyCode == 13){
                    let v = this.value;
                    if(isNaN(v)){
                        v = 0;
                    }
                    v = parseInt(v);
                    let min = Number(this.min);
                    let max = Number(this.max);
                    if(v < min){
                        v = min;
                    }else if(v > max){
                        v = max;
                    }
                    this.value = v;
                    self.scrollToDataIndex(v);
                }
            });
        },
        scrollToDataIndex: function(index){
            var self = this;
            var $trList = self.$table
                .selectAll('.tr');
            var trDoms = $trList.nodes();
            var tr, trIndex;
            for(let i = 0; i<trDoms.length; i++){
                let trDom = trDoms[i];
                let row = trDom.__data__;
                if(!row || row.index != index) continue;
                tr = trDom;
                trIndex = i;
                break;
            }
            if(tr){
                self.$table.node().parentNode.scrollTop = tr.offsetHeight * trIndex;
                lightRow(self, tr);
            }
        },
        isVisible: function(){
            return this.$dom && !this.$dom.classed('hide') || false;
        },
        show: function(){
            this.$dom && this.$dom.classed('hide', false);
        },
        hide: function(){
            clearLastInput();
            this.$dom && this.$dom.classed('hide', true);
        }
    });

    function lightRow(self, tr){
        var $trList = self.$dom.selectAll('.table-bodywrap .tr');
        $trList.classed('active', false);
        d3.select(tr).classed('active', true);
    }

    var lastInput = {};

    function td2Input(d, element, okFun){
        clearLastInput();

        var $element = d3.select(element);
        var oldValue = d.value;
        var num = 3;
        $element.classed('inputing', true);
        $element.html('')
            .append('input')
            .attr('type', 'number')
            .attr('name', d.name)
            .attr('step', 0.01)
            .value(oldValue)
            .on('keyup', function(){
                let evt = d3.event;
                let v = this.value;
                if(evt.keyCode == 13){
                    if(isNaN(v) || v == ''){
                        v = 0;
                        this.value = 0;
                    }
                    if((v+'').indexOf('.') > -1){
                        v = Number(v).toFixed(num);
                    }
                    v = Number(v) || 0;

                    clearLastInput();
                    $element.html(v);

                    okFun && okFun(v);
                }else if(evt.keyCode == 27){
                    clearLastInput();
                    $element.html(oldValue);
                }
            });
        
        lastInput.d = d;
        lastInput.$element = $element;
    }

    function clearLastInput(){
        if(!lastInput.$element) return ;
        lastInput.$element
            .html(lastInput.d.value)
            .classed('inputing', false);
        lastInput.$element = null;
        lastInput.d = null;
    }

    function sortNumber(a, b, sort = 'asc'){
        function returnNum(num){
            return sort === 'asc' ? num : 
                sort === 'desc' ? -num : 0;
        }
        var na = Number(a), nb = Number(b);
        if(isNaN(na) || isNaN(nb)){
            // 任一一个不是数字格式的情况，字符串排序；
            return returnNum(a.localeCompare(b));
        }else {
            // 都是number
            return returnNum(na - nb);
        }
    }

    var playerTrackCurveForm = new PlayerTrackCurveForm();
    return d3.rebind(playerTrackCurveForm, dispatch, 'on');
}