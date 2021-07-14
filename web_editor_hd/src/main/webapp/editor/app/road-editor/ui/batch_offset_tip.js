/**
 * 批量复制--要素偏移
 */
iD.ui.BatchOffsetTip = function (context, options) {
    var tipUtil = iD.ui.TipUtil(context);
    var dispatch = d3.dispatch('confirm', 'close');
    var DEFAULT_TYPE;
    var modelEntityMap;
    var center = [];
    var selectValue = '';
    var roadExpandTip = {};
    var screenX, screenY, modal;
    options = Object.assign({
    	value: 30,
    	step: 1,
        min: 0,
        enterEntity:null,
        actionCreateNew: true,
        actionCreateType: true,
        actionOffsetLeft: true,
        actionOffsetRight: true,
        actionOffsetUp: true,
        actionOffsetDown: true
    }, options);

    function closeExpandBox() {
        var delDiv = document.getElementById('barrier-offset-box');
        if (delDiv != null){
            delDiv.parentNode.parentNode.removeChild(delDiv.parentNode);
            delDiv.parentNode.removeChild(delDiv);
			context.enter(iD.modes.Browse(context));
        }
        
        if(options.enterEntity){
            context.buriedStatistics().merge(0,options.enterEntity.modelName);
        }else {
            let _name = context.buriedStatistics().getRecording().name;
            if(_name){
                context.buriedStatistics().merge(0,_name);
            }
        }
        modal && modal.close();
        modal = null;
    }

    roadExpandTip.perform = function (selection, perforFun, setActions) {
        var left, right, originalRoadTag = true;
        var createOffsetNumber = 1;
        var expandFieldWrapper;
        screenX = tipUtil.getMousePos().X;
        screenY = tipUtil.getMousePos().Y;
        closeExpandBox();
        
        modal = iD.ui.modal(selection);
        // 透明遮罩层
        modal.classed('transparent', true);
        modal.on('autoclose', function(){
            dispatch.close();
        });
        // 不使用全部鼠标事件
        modal.style('pointer-events', 'none');

        modal.select('.modal')
            .attr('class', 'modal-splash modal KDSEditor-col6')
        modal.select('button.close').attr('class', 'hide');
        modal.append('div')
            .attr('class', 'road-expand-box road-copy-box')
            .attr('id', 'barrier-offset-box')
            // 全部鼠标事件
            .style('pointer-events', 'all')
            .style('width', '160px')
            // .style('height', function(){
            //     return options.height ? options.height + 'px' : '';
            // })
            ;
        var expandBox = d3.select('.road-expand-box');
        var titleTable = expandBox.append('table')
            .attr('class', 'expand-title-table')
            .attr('id', 'expand-title-table')
            .attr('cellspacing', '0');
        var tbody = titleTable.append('tbody');
        var tr = tbody.append('tr');
        tr.append('td')
            .attr('class', 'expand-title-content-td')
            .text(options.title || t('operations.expand.offset-kerb'));
        tr.append('td')
            .attr('class', 'expand-title-close-td')
            .on('click', function () {
                dispatch.close();
                closeExpandBox();
            })
            .append('span')
            .attr('class', 'expand-title-close-span')
            .text('×');

        var expandContent = expandBox.append('div')
            .attr('class', 'road-expand-content');
        
        var arrowContent = expandContent.append('div')
            .attr('class', 'content-arrow')
            .style('text-align', 'center');
        
        var arrowDatas = ['left', 'up', 'right', 'down'].filter(function(d){
            let s = d.split('');
            let type = s.shift().toUpperCase() + s.join('');
            let k = 'actionOffset' + type;
            if(options.hasOwnProperty(k)){
                return options[k];
            }
            return true;
        });
        
        var $large = arrowContent.selectAll('div.large').data(arrowDatas);
        $large.exit().remove();
        $large.enter()
            .append('div')
            .attr('class', (v)=>'large ' + v + ' glyphicon glyphicon-arrow-'+v)
            .on('click', (d)=>{
                executeFun(d, false);
            });
        
        var $mini = arrowContent.selectAll('div.mini').data(arrowDatas);
        $mini.exit().remove();
        $mini.enter()
            .append('div')
            .attr('class', (v)=>{
                let s = 'mini ' + v;
                v = v == 'up' ? 'top' :
                    v == 'down' ? 'bottom' :
                    v;
                return s + ' glyphicon glyphicon-triangle-'+v;
            })
            .on('click', (d)=>{
                executeFun(d, true)
            });
		
        var expandRight = expandContent.append('div')
            .attr('class', 'expand-offset')
            .style('margin-top', '5px');
        expandRight.append('input')
            .attr('id', 'expand-offset-value')
            .attr('class', 'expand-text-right')
            .attr('min', options.min)
            .attr('value', options.value)
            .attr('type', 'number')
            .attr('step', options.step)
        expandRight.append('lable')
            .attr('class', 'meter')
            .text('调整值（cm）')
        
        if(options.actionCreateNew){
            var expandRight = expandContent.append('div')
				.attr('class', 'expand-offset')
                .style('text-align', 'center')
                .style('margin-top', '5px');
			
			var inputNumber = expandRight.append('input')
				.attr('id', 'expand-copy-value')
				.attr('class', 'expand-text-right')
				.attr('min', 1)
				.attr('value', 1)
				.attr('type', 'number')
				.attr('step', 1)
			
			inputNumber.on('change', function(){
				setActions(this.value)
			});
			
            expandRight.append('lable')
                .attr('class', 'meter')
                .text('批量复制');
        }
        
        function executeFun(type, miniType){
            var userInputParam = {'left': '', 'right': '', 'originalRoadTag': '', 'heightDiff': 0};
            var domCreate = document.getElementById('expand-copy-value');
            if(domCreate){
                createOffsetNumber = domCreate.value;
            }
            var value;
            if(miniType){
                value = 0.01;
            }else {
                value = +document.getElementById('expand-offset-value').value;
                value /= 100;
            }
            if(type == 'left'){
                userInputParam.left = value;
            }else if(type == 'right') {
                userInputParam.right = value;
            }else if(type == 'up'){
                userInputParam.heightDiff = value;
            }else if(type == 'down'){
                userInputParam.heightDiff = -value;
            }else {
                return ;
            }
			
			var newTags = {};
			userInputParam.newTags = newTags;
            
            userInputParam.originalRoadTag = originalRoadTag;
            userInputParam.createOffsetNumber = createOffsetNumber;
            // console.log('userInputParam', userInputParam);
            perforFun(userInputParam);
            dispatch.confirm(userInputParam);
        }

        new tipUtil.dragDrop({
            target: document.getElementById('barrier-offset-box'),
            bridge: document.getElementById('expand-title-table')
        });
    }

    function changeRadioStatus(self){
        let group = d3.select(self.parentNode);
        let selects = group.selectAll('select');
        selects.property('disabled', !self.checked);
    }

    function renderField_BARRIER(row, selectDomId){
        var modelEntity = modelEntityMap[iD.data.DataType.BARRIER_GEOMETRY];
        var field = _.find(modelEntity.getFields(modelEntity.getGeoType()), {
            fieldName: 'TYPE'
        });
        var $select = row.append('select')
            .attr('data-field', field.fieldName);
            // .attr('id', selectDomId);
        $select.data([field]);
        var $options = renderSelectDom($select, field);

        $options.property('selected', function(d){
            return DEFAULT_TYPE != null && d.value == DEFAULT_TYPE;
        });
        if(EFAULT_TYPE == null && $options.node()){
            $options.node().selected = true;
            $select.trigger('change');
        }
    }

    function renderField_OBJECT_PL(row, selectDomId){
        var modelEntity = modelEntityMap[iD.data.DataType.OBJECT_PL];
        var fieldArray = modelEntity.getFields(modelEntity.getGeoType());
        var fieldType = _.find(fieldArray, {
            fieldName: 'TYPE'
        });
        var fieldSubType = _.find(fieldArray, {
            fieldName: 'SUBTYPE'
        });
        var $select = row.append('select')
            .attr('data-field', fieldType.fieldName);
        $select.data([fieldType]);

        var $options = renderSelectDom($select, fieldType);

        var $selectSub = row.append('select')
            .attr('data-field', fieldSubType.fieldName);
        $selectSub.data([fieldSubType]);

        $select.on('change', function(field){
            $selectSub.value('');

            var value = this.value;
            var inputValues = (field.fieldInput && field.fieldInput.values || []);
            var valueObj = inputValues.filter(function(d){
                return d.value == value;
            })[0];
            if(!valueObj) return ;

            renderSelectDom($selectSub, fieldSubType, {
                optionFilter: function(v){
                    return v && v.parentId == valueObj.id;
                }
            });
        })

        if($options.node()){
            $options.node().selected = true;
            $select.trigger('change');
        }
    }

    function renderSelectDom($select, field, opts){
        $select.html('');
        opts = Object.assign({
            optionFilter: function(){
                return true;
            }
        }, opts);
        var renderValues = (field.fieldInput && field.fieldInput.values || []).filter(opts.optionFilter);
        var $options = $select.selectAll('option')
            .data(renderValues)
            .enter()
            .append('option')
            .attr('value', function(d){
                return d.value;
            })
            .text(function(d){
                return d.name;
            });
        return $options;
    }

    roadExpandTip.center = function (_) {
        if (_) {
            center = _;
            return this;
        } else {
            return center;
        }
    }

    roadExpandTip.setDefaultType = function(v){
        DEFAULT_TYPE = v;
        return this;
    }

    roadExpandTip.modelEntityMap = function(v){
        if(!v) return modelEntityMap;
        modelEntityMap = v;
        return this;
    }

    return d3.rebind(roadExpandTip, dispatch, 'on');
}
