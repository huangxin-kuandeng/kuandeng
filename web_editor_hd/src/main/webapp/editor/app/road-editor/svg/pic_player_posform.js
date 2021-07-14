iD.svg.PlayerPosForm = function(context, _opts) {
    _opts = _opts || {};
    const isSubPlayer = _opts.hasOwnProperty('isSubPlayer') ? _opts.isSubPlayer : false;
    const playerTrackCurve = _opts.playerTrackCurve;

    var dispatch = d3.dispatch(
        'pos_submit', 'pos_change'
    );
    var player;
    var formOptions = [{
        name: 'roll',
        value: 0
    }, {
        name: 'pitch',
        value: 0
    }, {
        name: 'azimuth',
        value: 0
    }, {
        title: 'dx(UTM)',
        name: 'x',
        step: 0.05,
        value: 0
    }, {
        title: 'dy(UTM)',
        name: 'y',
        step: 0.05,
        value: 0
    }, {
        title: 'dz(M)',
        name: 'z',
        value: 0
    }];
    var trackFormOptions = [{
        title: 'roll',
        name: 'rollDelta',
        value: 0
    }, {
        title: 'pitch',
        name: 'pitchDelta',
        value: 0
    }, {
        title: 'azimuth',
        name: 'azimuthDelta',
        value: 0
    }];
    // 纬度0.00001度在地球表面任意地方对应的地球表面距离都是大约1米稍多.
    // [116.34952917426, 39.93560019751] = 444423.66783632163, 4420812.026625802
    // [116.34951917426, 39.93560019751] = 444422.8134281693, 4420812.032852786
    var formParam = {};
    var formStatus = 'read';
    // 原始轨迹UTM偏移量，用于显示
    var trackNodeDelta = {};

    function PlayerPosForm() {
        this.$dom;
        this.$trackDom;
        this.$title;
        this.$buttonList;
        this.$showBtn;
        this.$hideBtn;
    }
    _.assign(PlayerPosForm.prototype, {
        init: function(arg1) {
            player = arg1;
            formParam = {};
        },
        render: function($root) {
            var self = this;
            self.$dom = $root;
            self.$title = $root.append('div').attr('class', 'posform-title').text(' ');
            var $form = $root.append('form').attr('class', 'form').on('submit', function(){
                d3.event.stopPropagation();
                d3.event.preventDefault();
                return false;
            });
            self.$form = $form;
            self.renderFuncButtons();
            self.renderOptions();
            self.renderFooter();
            self.updateFormStatus(formStatus);
            self.initPlayerEvent();

            self.hide();
        },
        renderFuncButtons(){
            var self = this;
            self.$showBtn = self.$dom.append('div').attr('class', 'btn-div btn-open').text('POS>');
            self.$hideBtn = self.$dom.append('div').attr('class', 'btn-div btn-close').text('×');

            self.$showBtn.on('click', function(){
                self.show();
            });
            self.$hideBtn.on('click', function(){
                self.hide();
            });
        },
        renderTrackPos: function($root){
            if(isSubPlayer || !player || !player.wayInfo) return ;
            var trackObj = player.wayInfo;
            var self = this;
            // 已渲染，刷新
            if(self.$trackDom && self.$trackDom.size()){
                updatePos(trackObj);
                return ;
            }
            self.$trackDom = $root;
            self.$trackTitle = self.$trackDom.append('div').attr('class', 'posform-title').text('标定');

            self.$trackForm = self.$trackDom.append('form').attr('class', 'form').on('submit', function(){
                d3.event.stopPropagation();
                d3.event.preventDefault();
                return false;
            });
            
            var $showBtn = self.$trackDom.append('div').attr('class', 'btn-div btn-open').text('标定>');
            var $hideBtn = self.$trackDom.append('div').attr('class', 'btn-div btn-close').text('×');

            $showBtn.on('click', function(){
                show();
            });
            $hideBtn.on('click', function(){
                hide();
            });

            function show(){
                $showBtn.classed('hide', true);
                $hideBtn.classed('hide', false);

                self.$trackDom.style('border', '');
                self.$trackTitle.classed('hide', false);
                self.$trackForm.classed('hide', false);
            }
            function hide(){
                $showBtn.classed('hide', false);
                $hideBtn.classed('hide', true);

                self.$trackDom.style('border', 'none');
                self.$trackTitle.classed('hide', true);
                self.$trackForm.classed('hide', true);
            }

            
            trackFormOptions.forEach(function(d){
                var $div = self.$trackForm.append('div').attr('class', 'form-group');
                var title = d.title || d.name;
                $div.append('label')
                    .attr('for', d.name)
                    .text(title);
                $div.append('input')
                    .attr('type', 'number')
                    .attr('class', 'form-control')
                    .attr('name', d.name)
                    .attr('placeholder', d.placeholder)
                    .attr('value', d.value)
                    .property('readOnly', true);
            });

            function updatePos(){
                self.$trackForm.selectAll('input').each(function(){
                    if(!this.name || trackObj[this.name] == null){
                        return ;
                    }
                    this.type = 'text';
                    this.value = trackObj[this.name] || 0;
                    this.title = this.value;
                    // this.readOnly = true;
                });
            }

            updatePos(trackObj);
            hide();
        },
        show: function(){
            var self = this;
            self.$showBtn.classed('hide', true);
            self.$hideBtn.classed('hide', false);

            self.$dom.style('border', '');
            self.$title.classed('hide', false);
            self.$form.classed('hide', false);
        },
        hide: function(){
            var self = this;
            self.$showBtn.classed('hide', false);
            self.$hideBtn.classed('hide', true);

            self.$dom.style('border', 'none');
            self.$title.classed('hide', true);
            self.$form.classed('hide', true);
        },
        renderOptions: function(){
            var self = this;
            var $form = self.$form
            formOptions.forEach(function(d){
                var $div = $form.append('div').attr('class', 'form-group');
                var title = d.title || d.name;
                $div.append('label')
                    .attr('for', d.name)
                    .text(title);
                $div.append('input')
                    .attr('type', 'number')
                    .attr('class', 'form-control')
                    .attr('name', d.name)
                    .attr('placeholder', d.placeholder)
                    .attr('value', d.value)
                    .attr('step', d.step || '0.1');
                formParam[d.name] = d.value;
            });
            $form.selectAll('input')
                .on('change', inputChange)
                .on('keyup', function(){
                    var evt = d3.event;
                    if(evt.keyCode == 27){
                        this.value = formParam[this.name] || 0;
                        return ;
                    }
                    if(evt.keyCode == 13){
                        inputChange.call(this);
                        triggerSubmit();
                    }
                });
                // .on('blur', inputChange);
        },
        renderFooter: function(){
            var self = this;
            var $form = self.$form;
            var $div = $form.append('div').attr('class', 'form-group');
            self.$buttonList = $div;
            $div.append('button')
                .attr('type', 'button')
                .attr('class', 'btn submit show-edit')
                .text('应用')
                .on('click', function(){
                    triggerSubmit();
                });
            $div.append('button')
                .attr('type', 'button')
                .attr('class', 'btn reset show-edit')
                .text('重置')
                .on('click', function(){
                    self.resetPos();
                    triggerSubmit();
                });
            $div.append('button')
                .attr('type', 'button')
                .attr('class', 'btn reset show-edit')
                .text('查看POS')
                .on('click', function(){
                    self.updateFormStatus('read');
                });
            
            // read 
            $div.append('button')
                .attr('type', 'button')
                .attr('class', 'btn reset show-read')
                .text('编辑POS')
                .on('click', function(){
                    self.updateFormStatus('edit');
                });
        },
        /**
         * 更新表单状态：轨迹点pos/编辑整体pos
         */
        updateFormStatus: function(status = 'read'){
            var self = this;
            if(status == 'read'){
                self.$title.text('轨迹点POS');
                let node = player.pic_point;
                let offset = getNodeOffset(node && node.id);
                node && this.$form.selectAll('input').each(function(){
                    if(!this.name || node.tags[this.name] == null){
                        return ;
                    }
                    this.type = 'text';
                    if(offset[this.name] != null){
                        this.value = offset[this.name] || 0;
                    }else {
                        this.value = node.tags[this.name] || 0;
                    }
                    this.title = this.value;
                    this.readOnly = true;
                });
            }else if(status == 'edit'){
                self.$title.text('编辑整体POS');
                this.$form.selectAll('input').each(function(){
                    if(!this.name || formParam[this.name] == null){
                        return ;
                    }
                    this.type = 'number';
                    this.value = formParam[this.name] || 0;
                    this.title = '';
                    this.readOnly = false;
                });
            }

            self.$buttonList.selectAll('.btn').style('display', 'none');
            self.$dom.classed(formStatus, false);
            formStatus = status;
            self.$dom.classed(formStatus, true);
            self.$buttonList.selectAll('.show-' + formStatus).style('display', 'block');
        },
        getPosTrack: function(track){
            var curveChanged = playerTrackCurve && playerTrackCurve.getChanged();
            var posTrack = player.dataMgr && player.dataMgr.getUpdateRTCTrack(track, formParam, curveChanged);
            if(!posTrack){
                return track;
            }
            return posTrack;
        },
        resetPos: function(){
            var self = this;
            var result = {};
            formOptions.forEach(function(d){
                result[d.name] = d.value;
            });
            self.setPos(result);
        },
        setPos: function(param){
            var self = this;
            self.$dom.selectAll('input').each(function(){
                let input = this;
                let name = input.name;
                if(param[name] != null){
                    input.value = param[name];
                    formParam[name] = param[name];
                }
            });
        },
        initPlayerEvent: function(){
            var self = this;
            // init event ...
            self.on('pos_submit._pos_form', updatePlayerPos);
            // self.on('pos_change._pos_form', updatePlayerPos);
            if(playerTrackCurve){
                playerTrackCurve.on('node_dragend._pos_form', function(){
                    updatePlayerPos(formParam, true);
                });
                playerTrackCurve.on('node_offset_change._pos_form', function(){
                    updatePlayerPosLimit(formParam, true);
                });
            }

            player.on('picUpdate._pos_form', function(){
                if(formStatus == 'read'){
                    self.updateFormStatus(formStatus);
                }
            })
            
            var lastParam = {};
            var updatePlayerPosLimit = _.debounce(updatePlayerPos, 200, {
                leading: false,
                trailing: true
            });

            function updatePlayerPos(param, fromCurve = false){
                // if(formStatus != 'edit') return ;
                if(!fromCurve && _.isEqual(lastParam, param)) return ;
                var trackObj = player.wayInfo;
                var posTrack = playerPosForm.getPosTrack(trackObj);
                player.dataMgr.trackObj = posTrack;
                player.wayInfo = posTrack;
                player.allNodes = player.wayInfo.nodes;
                player.pic_point = posTrack.nodes[player.selectPicIndex];
                // 刷新斜面
                // player.dataMgr.resetPlanes(player.selectPicIndex);
                player.resetCanvas();

                lastParam = _.clone(param);

                if(formStatus == 'read'){
                    self.updateFormStatus(formStatus);
                    // return ;
                }

                if(isSubPlayer){
                    return ;
                }
                if(player.getEpilineTool()){
                    player.getEpilineTool().updateEpilineParam();
                }
                // if(param && (param.x || param.y)){
                //     player.dataMgr.pic.redrawTracks();
                // }
            }
        }
    });

    function getNodeOffset(nodeid){
        if(!nodeid || !player || !player.wayInfo){
            return;
        }
        let trackId = player.wayInfo.trackId;
        let offset;
        if(playerTrackCurve){
            offset = playerTrackCurve.getNodeOffset(nodeid);
        }else {
            if(!trackNodeDelta || trackNodeDelta.trackId != trackId){
                var posParam = iD.Task.getPosParam();
                var useOffsetCal = posParam.offsetCal;
                trackNodeDelta = iD.picUtil.getTrackNodesOffset(
                    player.dataMgr.getTrack(trackId), 
                    player.dataMgr.planeFrames, 
                    useOffsetCal, 
                    true);
                trackNodeDelta.trackId = player.wayInfo.trackId;
            }
            offset = trackNodeDelta[nodeid];
        }
        if(!offset){
            offset = {
                x: 0,
                y: 0,
                z: 0
            }
        }
        return offset;
    }

    function inputChange(){
        var input = this;
        if(input.value == '' || isNaN(input.value)){
            input.value = 0;
        }
        var oldValue = formParam[input.name];
        formParam[input.name] = Number(input.value);

        if(oldValue != formParam[input.name]){
            // dispatch.pos_change(formParam);
            triggerPosChange();
        }
    }

    function triggerPosChange(){
        dispatch.pos_change(_.clone(formParam));
    }
    triggerPosChange = _.debounce(triggerPosChange, 200, {
        leading: false,
        trailing: true
    });

    function triggerSubmit(){
        dispatch.pos_submit(_.clone(formParam));
    }

    var playerPosForm = new PlayerPosForm();
    return d3.rebind(playerPosForm, dispatch, 'on');
}