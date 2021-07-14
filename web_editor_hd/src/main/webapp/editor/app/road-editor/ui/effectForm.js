
iD.ui.EffectForm = function (context) {
	var url = iD.config.URL.kcs_report+'checkStatus/modify/update';
	function postStatus(id,status){

        d3.json(url)
            .header("Content-Type", "application/json")
            .post(JSON.stringify([{
                id,
                status
            }]), function(error, data) {
            	if(error || (data && data.code !='0')){
                    Dialog.alert('报表提交异常', null, null, null, null, {
                        AutoClose: 3
                    });
				}
            });
	}
    function locationPlayer(entity){
        if(!(entity instanceof iD.Node)){
            return ;
        }
        let graph,relations,parameter,trackPointId,trackId;

        graph= context.graph();
        relations = graph.parentRelations(entity,iD.data.DataType.MEASUREINFO);
        if(!relations.length) return ;
		if(!relations[0].tags.PARAMETER) return ;
        parameter = JSON.parse(relations[0].tags.PARAMETER);
        trackPointId = parameter.Paras.nodes[0].trackPointId;
        trackId = parameter.Paras.nodes[0].trackId;
        if(!trackPointId) return ;
        if(!trackId){
        	trackId = iD.svg.Pic.dataMgr.pointId2Track(trackPointId).trackId;
		}
        if(!trackId) return ;
        iD.svg.Pic.dataMgr.pic.getPicPlayer() && iD.svg.Pic.dataMgr.pic.getPicPlayer().locateTrackPointToPlayer(trackPointId,trackId);
    }

    function lightEntity(type = 'n', did, name) {
        var lay = getLayerByName(name);
        if (!lay) {
            return;
        }
        var sim = iD.Entity.id.delimiter || "_";
        var entity = context.hasEntity(type + lay.id + sim + did) || context.hasEntity(type + sim + did);
        if (!entity) {
            context.enter(iD.modes.Browse(context));
            return;
        }
        if (!(entity instanceof iD.Relation)) {
            context.map().lightEntity(entity.id);
            locationPlayer(entity);
        } else {
            var mids = [];
            _.each(entity.members || [], function (m) {
                let d = context.hasEntity(m.id);
                if (!(d instanceof iD.Relation)) {
                    mids.push(d.id)
                }
                if (d instanceof iD.Node) {
                    locationPlayer(entity);
                }
            });
            mids.length && context.map().lightEntity(mids);
        }

    }

	var effectForm = function (selection) {
		// let ids1;
		var effectTypeList = [
			iD.data.DataType.LANE_ATTRIBUTE,
			iD.data.DataType.DIVIDER_ATTRIBUTE,
			iD.data.DataType.ROAD_ATTRIBUTE
		];
//		查询框(外套的div)
		var effectform = selection.append('div').attr('id', 'EffectForm');
		var $formHeader = effectform.append('div').attr('class', 'effectsform-header');
		var $fmBtns = $formHeader.selectAll('div.fm-btn.mname-filter').data(effectTypeList)
			.enter().append('div')
			.attr('class', 'fm-btn mname-filter')
			.text(function(name){
				return name.charAt(0).toUpperCase() + 'A';
			})
			.on('click', function(name){
				renderForm(name);
			});
		
		$formHeader.append('div')
			.attr('class', 'effectsform-toggle')
			.attr('id', '_effectform_toggle')
			.on('click', function(){
				var height = effectform.node().offsetHeight;
				// 设置.ease("linear")无效
				var $trans = effectform.transition().ease("liner").duration(500);
				if(effectform.classed('active')){
					effectform.classed('active', false);
					$trans.style('bottom', -height + 'px');
				}else {
					effectform.classed('active', true);
					$trans.style('bottom', '0px');
				}
			}).append('span').attr('class', 'glyphicon glyphicon-triangle-right');
		
		$formHeader.append('div')
			.attr('class', 'fm-btn')
			.attr('id', '_effectform_close').text('X')
			.on('click', function(){
				effectform.style('display', 'none');
			});

//		列表(内容)
		var effectFormTable = effectform.append('div').attr('id', 'effectFormTable');

		var $button2 = $("#effects-lane-highlight");
		var $button3 = $("#effects-divider-attr-highlight");
		var $button4 = $("#effects-road-highlight");
		var showBtnList = $button2.add($button3).add($button4).toArray();
		// 点击其他按钮关闭列表
		var $otherBtns = context.container().selectAll('#KDSEditor-bar .effects-group > button').filter(function(){
			return showBtnList.indexOf(this) == -1;
		}).on('click.effect-form', function(){
			if (!['effects-shape-point','effects-dividerdref-memberarea','effects-dottedsoild','effects-barrerGeometry-effects'].includes(this.id)) {
				effectform.style('display', 'none');
			}
		});
		
		var fieldListLA = [{
			fieldName: 'LANETYPE',
			fieldTitle: '车道类型',
			chn: true
		}, {
			fieldName: 'MAX_SPEED',
			connectField: ['MIN_SPEED'],
			connect: ' — ',
			fieldTitle: '限速'
		}, {
			fieldName: 'STATUS',
			fieldTitle: '通行状态',
			chn: true
		}, {
			fieldName: 'SMTYPE',
			fieldTitle: '车道分歧点类型',
			chn: true
		}, {
			fieldName: 'PRELATIONS',
			fieldTitle: '车道限制信息',
			num: true
		}];
		
		var fieldListDA = [{
			fieldName: 'VIRTUAL',
			fieldTitle: '虚拟分隔线类型',
			chn: true
		}, {
			fieldName: 'COLOR',
			fieldTitle: '分隔线颜色',
			chn: true
		}, {
			fieldName: 'TYPE',
			fieldTitle: '分隔线类型',
			chn: true
		}, {
			fieldName: 'DRIVE_RULE',
			fieldTitle: '通行类型',
			chn: true
		}];
		
		var fieldListRA = [{
			fieldName: 'TYPE',
			fieldTitle: '属性类型',
			chn: true
		}, {
			fieldName: 'VALUE',
			fieldTitle: '变化后属性值',
			chn: true,
			parentFieldName: 'TYPE'
		}, {
			fieldName: 'SMTYPE',
			fieldTitle: '道路分歧类型',
			chn: true
		}];
		
		function getRenderParam(entity, modelName){
			var result, node;
			if(entity.modelName != modelName) return ;
			if(_.include([
				iD.data.DataType.LANE_ATTRIBUTE,
				iD.data.DataType.DIVIDER_ATTRIBUTE
			], modelName)){
				for(var m of entity.members) {
					if (m.modelName == iD.data.DataType.DIVIDER_NODE) {
					    node = context.hasEntity(m.id);
					    if(!node) continue;
                        node.type = m.type;
                        break;
                    }
				}
			}else if(modelName == iD.data.DataType.ROAD_ATTRIBUTE) {
				node = entity;
			}
			if(!node) return result;
			var nodeId = iD.Entity.id.toOSM(node.id);
			var values = [];
			var paramList;
			if(modelName == iD.data.DataType.LANE_ATTRIBUTE){
				paramList = fieldListLA;
			}else if(modelName == iD.data.DataType.DIVIDER_ATTRIBUTE){
				paramList = fieldListDA;
			}else if(modelName == iD.data.DataType.ROAD_ATTRIBUTE){
				paramList = fieldListRA;
			}
			
			var vnum = [];
			for(let item of paramList){
				let v = entity.tags[item.fieldName];
				let subVals;
				if(item.connect && item.connectField && item.connectField.length){
					subVals = _.map(item.connectField, fname => {
						let sv = entity.tags[fname];
						if(item.chn){
							sv = getFieldText(modelName, fname, sv);
						}
						sv = sv == null ? '' : sv+'';
						return sv;
					});
				}
				if(item.chn){
					v = getFieldText(modelName, item.fieldName, v, {
						parentFieldName: item.parentFieldName,
						parentFieldValue: entity.tags[item.parentFieldName]
					});
				}
				if(item.num){
					vnum = context.graph().parentRelations(
						entity, iD.ModelEntitys.LANE_ATTRIBUTE_RESTRICTION._modelName
					)
					v = vnum.length ? vnum.length : ' — ';
				}
				v = v == null ? '' : v+'';
				if(subVals){
					v = [v].concat(...subVals).join(item.connect);
				}
				values.push(v);
			}
			
			if(modelName == iD.data.DataType.LANE_ATTRIBUTE){
				var isNotPrelations = ' — ';
				if(vnum.length){
					let vnumType = vnum.find(d=>{ return (d.tags.TYPE != '0') });
					isNotPrelations = vnumType ? '否' : '是';
				}
				values.push(isNotPrelations);
			}
			
            result = {
            	id: nodeId,
                modelName: node.modelName,
                dataX: node.loc[0],
                dataY: node.loc[1],
                type: node.type,
            	values: values
            };
			return result;
		}
		
		function renderForm(modelName){
			var graph= context.graph();
            var entitys = graph.entities;
            var arr = [];
            var flag = _.include(effectTypeList, modelName);
            if (!flag) {
                effectForm.hideBtn();
                return;
            }
            $fmBtns.classed('active', false);
            var btnIndex = effectTypeList.indexOf(modelName);
            if(btnIndex > -1){
            	d3.select($fmBtns[0][btnIndex]).classed('active', true);
            }
            for (var i in entitys) {
                if (entitys[i] && entitys[i].modelName == modelName) {
                	var param = getRenderParam(entitys[i], modelName);
                	param && arr.push(param);
				}
            }
            var paramList = [];
            if(modelName == iD.data.DataType.LANE_ATTRIBUTE){
				paramList = fieldListLA;
			}else if(modelName == iD.data.DataType.DIVIDER_ATTRIBUTE){
				paramList = fieldListDA;
			}else if(modelName == iD.data.DataType.ROAD_ATTRIBUTE){
				paramList = fieldListRA;
			}
			
			var fieldTitles = ["要素ID"].concat(_.pluck(paramList, 'fieldTitle'));
			
			if(modelName == iD.data.DataType.LANE_ATTRIBUTE){
				fieldTitles.push("是否为非通行方向限制")
			}
			
            appendForm({
            	title: fieldTitles,
            	content: arr
			});
		}
		
		//单击LA按钮
		$button2.click(function(){
			renderForm(iD.data.DataType.LANE_ATTRIBUTE);
		})
		//单击DA按钮
		$button3.click(function(){
			renderForm(iD.data.DataType.DIVIDER_ATTRIBUTE);
		})
        //单击RA按钮
        $button4.click(function(){
			renderForm(iD.data.DataType.ROAD_ATTRIBUTE);
        })
		
//		根据数据增添展示的内容
		function appendForm(data) {
            var effectform = $('#EffectForm');
            effectform.addClass('active').css('bottom', '');
            effectform.fadeIn(500);

            var datumPanelTmpl = `
			    <div class="table-header">
	                <table>
	                	<thead style="font-weight:bold;">
			                <tr>
			                ${data.title.map(t => `
				                <th style="white-space: nowrap;">${t}</th>
				            `).join('')}
			                </tr>
			            </thead>
	                </table>
			    </div>
			    <div class="effectform-table-wrap">
		          	<div id="example2" class="table table-bordered table-hover">
			            <div class="box-body" style="text-align:center;font-size:14px;">
						    <table class="table table-bordered table-hover">
					            <tbody>
			                	${data.content.map(d => `
					                <tr filter-mname="${d.modelName}">
					                	<td title="${d.id}" class="td" style="font-weight:normal;">${d.id}</td>
					                	${d.values.map(v => `
						                	<td title="${v}" class="td" style="font-weight:normal;">${v}</td>
						                `).join('')}
					                </tr>
			                	`).join('')}
					            </tbody>
						    </table>
			  			</div>
		          	</div>
		        </div>
			`;

            effectFormTable.html(datumPanelTmpl);					//将生成的内容增添到页面中去
            var tbody = d3.selectAll('#example2 tbody');

            var child = $("#example2 tbody tr");
            for (var i = 0; i < child.length; i++) {
                var a = child[i];
                a.index = i;										//给每个className为child的元素添加index属性;
                a.onclick = function (e) {
                    d3.selectAll('#example2 tbody tr').classed('active',false);
                    d3.select(this).classed('active',true);
                    if(d3.select(e.target).classed('icon-check')){
                        postStatus(d3.select(this).datum().id,1);
                        d3.select(e.target).classed('active',true)
                    }else if(d3.select(e.target).classed('icon-cross')){
                        postStatus(d3.select(this).datum().id,2);
                        d3.select(e.target).classed('active',true);
                        d3.select(this).select('.icon-check').classed('active',true);
                    }

                    if(!iD.User.authCheckResultHandle()){
                        Dialog.alert(t("permission.checkedit_no_handle"));
                        return ;
                    }
                    var dataX = data.content[this.index].dataX;					//获取指定要素的X坐标
                    var dataY = data.content[this.index].dataY;					//获取指定要素的Y坐标
                    var dataId = data.content[this.index].id;				//获取指定要素的dataId
                    var dataType = data.content[this.index].type;			//获取指定要素的类型
                    var modelName = data.content[this.index].modelName;

                    if(dataType == "relation"){								//要素类型relation
                        context.map().center([dataX, dataY]);				//根据经纬度定位中心点
                        // lightEntity('r', dataId);
                    }else if(dataType == "node"){							//要素类型node
                        context.map().center([dataX, dataY]);				//根据经纬度定位中心点
                        lightEntity('n', dataId,modelName);
                    }else{													//要素类型way
                        context.map().center([dataX, dataY]);				//根据经纬度定位中心点
                        lightEntity('w', dataId,modelName);
                    }
                }
            }
        }
		
		function getFieldText(modelName, fieldName, fieldValue, options){
			var model = iD.ModelEntitys[modelName];
			if(!model) return '';
			var fieldList = model.getFields(model.getGeoType());
			options = options || {};
			// 级联关系
			var parentId, parentName = options.parentFieldName, parentValue = options.parentFieldValue;
			if(parentName){
				for(var f of fieldList){
					if(f.fieldName == parentName){
						if(!f.fieldInput || !f.fieldInput.values) break;
						for(let v of f.fieldInput.values){
							if(v.value == parentValue){
								parentId = v.id;
							}
						}
						break;
					}
				}
			}
			for(var f of fieldList){
				if(f.fieldName != fieldName) continue;
				if(!f.fieldInput || !f.fieldInput.values) return '';
				for(let v of f.fieldInput.values){
					if(parentId != null && v.parentId != parentId) continue;
					if(v.value == fieldValue){
						return v.name;
					}
				}
			}
			return '';
		}
	}
	
	function getLayerByName(name){
		var result;
		var layers = iD.Layers.getLayers();
		for(let lay of layers){
			if(iD.util.getModelNameByItem(lay.models || [], name)){
				result = lay;
				break;
			}
		}
		return result;
	}

	//----------------------------------------------------------------------------------------------------
	effectForm.hideBtn = function(){
        var effectform = $('#EffectForm');
        effectform.hide();
    }

	return effectForm;
}