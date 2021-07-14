iD.ui.TagEditorInput.inputGroup = function(field,context,opts) {
//console.log("opts.fieldTpl",opts.fieldTpl);
    var event = d3.dispatch('change'),
        input, nameFldsInputs, nameFldsOptions = opts.fieldTpl.fieldOptions,
        // [{
        //     name: 'alias',
        //     title: '道路别名'
        // }, {
        //     name: 'fname',
        //     title: '曾用名'
        // }],
        baseNum = 1;
    var tips = [];
        _.each(nameFldsOptions,function(v){
            tips.push(v.title);
        });
        tips = tips.join(', ');

    function i(selection, opts) {
        this._tags = opts.tags;
        var that = this;

        input = selection.selectAll('input')
            .data([0]);

        input.enter().append('input');

        input.attr('type', 'text')
            .attr('id', 'preset-input-' + field.id)
            .attr('class', 'preset-input')
            .attr('placeholder', field.placeholder());

        var fieldModel = opts.fieldModel;

        if (fieldModel && fieldModel.fieldSize) {
            input.attr('maxLength', fieldModel.fieldSize);
        }

        input
            .on('blur', change(that))
            .on('change', change(that));

        var nameAddBtn = selection.selectAll('.roadname-add')
            .data([0]);

        nameAddBtn.enter().append('button')
            .attr('class', 'button-input-action roadname-add minor')
            .call(bootstrap.tooltip()
                .title(function(){
                    if(input.value()==""){
                        return '填写：' + field.fieldModel.title + '后才能添加附加属性';
                    }else if(nameFldsInputs.selectAll('div.entry').data().length>=nameFldsOptions.length){
                        return '只能添加'+nameFldsOptions.length+'条附加属性';
                    }else{
                        var data = nameFldsInputs.selectAll('div.entry').data();

                        if (_.any(data, function(d) {
                                return !d.value || d.value=="";
                            })) {

                            return '请先填写完全别名。';
                        }else{
                            return tips;
                        }
                    }
                })
                .placement('left'))
            .append('span')
            .attr('class', 'icon KDSEditor-icon plus');

        nameAddBtn
            .on('click', addBlank(that));
        nameAddBtn.classed("hide",false);

        nameFldsInputs = d3.select(selection.node().parentNode.parentNode)
                        //selection
                        .selectAll('.namelist-wrap')
            .data([0]);

        nameFldsInputs.enter().append('div')
            .attr('class', 'namelist-wrap localized-wrap');

    }
    function getValue(_t, tags){
        var t = {},_t = _t||{},tags = tags||opts.tags;

        // console.log("getValue start","_t:",_t,"tags:",tags);
        var alias_chn = [];
        _.each(nameFldsOptions, function(d) {
            if(_t.hasOwnProperty(d.name)){
                if(typeof _t[d.name] != 'undefined'
                    &&_t[d.name]!=''){
                    //t[d.name] = _t[d.name];
                    alias_chn.push(_t[d.name]);
                }
            }else if (tags[d.name]) {
                //t[d.name] = tags[d.name];
                alias_chn.push(tags[d.name]);
            }
            t[d.name] = undefined;
        });
        t['alias_chn'] = alias_chn.join("|");

        if(typeof t['alias_chn'] != 'undefined'
            &&t['alias_chn']!=""){  
            var alias_chn = t['alias_chn'].split("|");
            for (var len = alias_chn.length,i=0; i < len; i++) {
                t['alias_chn'+createSN(i,alias_chn.length,3)] = alias_chn[i];
            };
        }

        if (tags[opts.fieldTpl.fieldName]){
            t[opts.fieldTpl.fieldName] = tags[opts.fieldTpl.fieldName];
        }

        t['name_chn'] = typeof _t['name_chn'] != 'undefined' ? _t['name_chn'] : tags['name_chn']
        // console.log("getValue end1","t:",t);
        // console.log("getValue end2","_t:",_t);
        // console.log("getValue end2"," _.extend({}, t, _t):", _.extend({}, t, _t),"tags:",tags);

        //自动从半角转全角
        function SBC(text) {
            return text.replace(/[\x20-\x7e]/g, function ($0) {
                return $0 == " " ? "\u3000" : String.fromCharCode($0.charCodeAt(0) + 0xfee0);
            });
        }

        //道路名称半角转全角
        if(typeof t['alias_chn'] !='undefined'){
            t['name_chn']  = SBC(t['name_chn']);
        }
        if(typeof t['alias_chn1'] !='undefined'){
            t['alias_chn1']  = SBC(t['alias_chn1'] );
        }
        if(typeof t['alias_chn2'] !='undefined'){
            t['alias_chn2']  = SBC(t['alias_chn2'] );
        }
        if(typeof t['alias_chn3'] !='undefined'){
            t['alias_chn3']  = SBC(t['alias_chn3'] );
        }
        //获得触发名称
        var keys = Object.keys(_t) ;
        t['name_trigger'] = keys.join(',') ;
        return t;
    }
    function createSN(i,len,max){
        return (max-len)+i+1;
    }
    function addBlank(i) {
        return function(){
            d3.event.preventDefault();

            var data = nameFldsInputs.selectAll('div.entry').data();

            if (_.any(data, function(d) {
                    return !d.value || d.value=="";
                })
                ||input.value()==""
                ||data.length >= nameFldsOptions.length) {

                return;
            }

            // for (var i = data.length - 1; i >= 0; i--) {
            //     data[i]['name'] = 'alias_chn'+(3-(i+1-data.length));
            // };
            data.unshift({
                name: 'alias_chn'+(3-data.length),
                value: ''
            });

            nameFldsInputs.call(render, data, i);
        }
    }

    function changeFieldName(wrap, change, i) {

        var d = wrap.datum(),
            t = {};

        for (var k in change) {

            if (d.name !== change[k]) {

                if (d.name) {
                    t[d.name] = undefined;
                }
            }

            d.name = change[k];

            t[change[k]] = d.value;

            break;
        }

        if (d.value) {
            event.change(getValue(t, i._tags));
        }
    }

    function changeFieldValue(wrap, i) {
        return function(d){
            d.value = d3.select(this).value() || '';
            
            if(!d.name || !d.value){
                wrap.call(iD.ui.TagEditor.toastr, "未编辑完的新增项将自动删除。", {
                    className: 'warning'
                });
            }
            if (d.name) {

                var t = {};

                t[d.name] = d.value;

                event.change(getValue(t, i._tags));
            }
        }
    }

    function render(selection, data, i) {

        // var wraps = selection.selectAll('div.entry')
        //     .data([])
        //     .exit()
        //     .remove();

        //console.warn('old:',selection.selectAll('div.entry').data());
        //console.warn("new:",data);
        var wraps = selection.selectAll('div.entry')
            .data(data, function(d) {

                return d.name;
            });
        // wraps.each(function() {

        //     var wrap = d3.select(this);
        //     // wrap.node().__comboInput.on('change', function(d) {
        //     //     changeFieldName.call(this, wrap, d, i);
        //     // });
        //     wrap.selectAll('input.preset-input')
        //         .on('blur', changeFieldValue(wrap, i))
        //         .on('change', changeFieldValue(wrap, i))
        //     // var comboInput = .on('change', function(d) {
        //     //     changeFieldName.call(this, wrap, d, i);
        //     // });

        //     // wrap.append('input')
        //     //     .on('blur', changeFieldValue(wrap, i))
        //     //     .on('change', changeFieldValue(wrap, i))

        // });
        var innerWrap = wraps.enter()
            .insert('div', ':first-child')
            .attr('class', 'entry');

        innerWrap.each(function() {

            var wrap = d3.select(this);

            // var comboOpts = {};

            // _.each(nameFldsOptions, function(opt) {
            //     comboOpts[opt.name] = opt.title;
            // });

            // var comboId = field.id + '_' + (baseNum++),
            //     comboKey = comboId + '_key';

            // var comboInput = iD.ui.TagEditorInput.combo({
            //     id: comboId,
            //     key: comboKey,
            //     strings: {
            //         options: comboOpts
            //     },
            //     placeholder: function() {
            //         return '';
            //     }
            // }).on('change', function(d) {
            //     changeFieldName.call(this, wrap, d, i);
            // });

            // comboInput.comboKey = comboKey;

            // wrap.call(comboInput);

            // wrap.node().__comboInput = comboInput;

            var $label = wrap.selectAll('label.form-label')
            .data(["别名"]);

            $label.enter()
                .append('label')
                .attr('class', 'form-label KDSEditor-form-label');

            $label.html(function(d) {
                return d;
            });
            wrap.append('input')
                .attr('type', 'text')
                .attr('placeholder', '')
                .attr('class', 'no-top-border namelist-fieldval preset-input');

            wrap.append('button')
                .attr('class', 'button-input-action minor remove')
                .append('span').attr('class', 'icon KDSEditor-icon delete');
        });
        wraps.each(function() {
            var wrap = d3.select(this);
            wrap.select('input')
                .on('blur', changeFieldValue(wrap, i))
                .on('change', changeFieldValue(wrap, i));

            wrap.select('button.remove')
                .on('click', function(d) {
                    d3.event.preventDefault();

                    if (d.name) {
                        var t = {};
                        t[d.name] = undefined;
                        event.change(getValue(t));
                    }

                    // d3.select(this.parentNode)
                    //     .style('top', '0')
                    //     .style('max-height', '240px')
                    //     .transition()
                    //     .style('opacity', '0')
                    //     .style('max-height', '0px')
                    //     .remove();
                });
        });

        innerWrap
            .style('margin-top', '0px')
            .style('max-height', '0px')
            .style('opacity', '0')
            //.transition()
            //.duration(200)
            .style('margin-top', '10px')
            .style('max-height', '240px')
            .style('opacity', '1')
            //.each('end', function() {
            //    d3.select(this)
                    .style('max-height', '')
                    .style('overflow', 'visible');
            //});


        // wraps.order().each(function(d) {
        //     var t = {},
        //         comboInput = this.__comboInput;

        //     t[comboInput.comboKey] = d.name;

        //     comboInput.tags(t);
        // });

        // entry.select('.namelist-fieldname')
        //     .value(function(d) {
        //         return d.name;
        //     });

        wraps.exit()
            //.transition()
            //.duration(200)
            .style('max-height', '0px')
            .style('opacity', '0')
            .style('top', '-10px')
            .remove();

        wraps.select('.namelist-fieldval')
            .value(function(d) {
                return d.value;
            });
    }


    function change(i) {
        return function(){
            var t = {};
            t[field.key] = input.value() || '';
            event.change(getValue(t,i._tags)); 
        }
    }

    i.readOnly = function(readonly) {
        input.call(iD.ui.TagEditor.readOnly, readonly);
        nameFldsInputs.selectAll('input.preset-input').call(iD.ui.TagEditor.readOnly, readonly);

        // nameFldsInputs.selectAll('div.entry').each(function() {
        //     this.__comboInput.readOnly(readonly);
        // });
    }

    i.disable = function(disable) {
        input.call(iD.ui.TagEditor.disable, disable);
        nameFldsInputs.selectAll('input.preset-input').call(iD.ui.TagEditor.disable, disable);

        // nameFldsInputs.selectAll('div.entry').each(function() {
        //     this.__comboInput.disable(disable);
        // });
    }

    i.tags = function(tags) {
        if(tags['alias_chn']
            && typeof tags['alias_chn1'] == 'undefined'
            && typeof tags['alias_chn2'] == 'undefined'
            && typeof tags['alias_chn3'] == 'undefined'){
            var alias_chn = tags['alias_chn'].split("|");
            for (var len = alias_chn.length,i=0; i < len; i++) {
                tags['alias_chn'+createSN(i,alias_chn.length,3)] = alias_chn[i];
            };
        }
        this._tags = tags;
        input.value(tags[field.key] || '');

        var nameFlds = [];

        _.each(nameFldsOptions, function(d) {
            if (typeof tags[d.name] != 'undefined') {
                nameFlds.push({
                    name: d.name,
                    value: tags[d.name]
                });
            }
        });
        nameFlds.reverse();

        nameFldsInputs.call(render, nameFlds, this);
    };

    i.focus = function() {
        input.node().focus();
    };
    
    i.change = function(t) {
        var t = typeof t != "undefined" ? _.extend({}, t):{};
        //t[field.key] = input.value() || '';
        event.change(t); //getValue(t,this._tags)
    };

    return d3.rebind(i, event, 'on');
};