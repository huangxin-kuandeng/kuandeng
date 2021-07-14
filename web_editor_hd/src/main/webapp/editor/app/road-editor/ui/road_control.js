iD.ui.RoadControl = function(context) {

	var event = d3.dispatch('apply'),
		modal,
		transportation,
		nodeId,
		fromWayId,
		toWayId,
		maatType,
		maat,
		assInfo;

	var fieldConfs = [{
		label: '门禁信息',
		renderGetter: getBlockTypeRender,
		setVal: function(render, cVals) {
			render.setVal(cVals.block_type || '0');
		},
		getVal: function(render, cVals) {
			cVals.block_type = render.val();
		}
	}];

	function roadControl(selection) {
		modal = iD.ui.modal(selection);

		modal.select('.modal')
			.classed('modal-alert common-dialog', true);

		//隐藏掉右上角的关闭按钮
		//modal.select('button.close').style('display', 'none');

		var section = modal.select('.KDSEditor-content');

		var $wrap = section.append('div')
			.attr('class', 'traffic-area road_control_pane');

		$wrap.append('div')
			.attr('class', 'title model_title')
			.html('交通信息');

		var $body = $wrap.append('div')
			.attr('class', 'body cf');

		var $fieldRows = $body.selectAll('div.field_row').data(fieldConfs.map(function(f) {
			if (f.renderGetter) {
				f.render = f.renderGetter();
			}
			return f;
		}));

		var $newFieldRows = $fieldRows.enter()
			.append('div')
			.attr('class', 'field_row');

		$newFieldRows.append('label').attr('class', 'field-label');

		$newFieldRows.append('span').attr('class', 'field-input');


		$fieldRows.selectAll('.field-label').html(function(d) {
			return d.label;
		});

		assInfo = roadControl.getAssistInfo();

		var cVals = assInfo.tags;

		$fieldRows.selectAll('.field-input').each(function(d) {

			d3.select(this)
				.html('')
				.call(d.render);

			if (cVals && d.setVal) {
				d.setVal(d.render, cVals);
			}
		});

		$fieldRows.exit().remove();

		//bottom
		var bottom = $wrap.append('div')
			.attr('class', 'footer');

		bottom.append('button')
			//.attr('type', 'button')
			.attr('class', 'apply button blue')
			.html('确定')
			.on('click', function() {

				var newVals = {};

				$fieldRows.selectAll('.field-input').each(function(d) {

					if (d.getVal) {
						d.getVal(d.render, newVals, cVals);
					}
				});
                // if(d3.select("body").attr("role") =="work"&&iD.Static.layersInfo.isEditable(iD.data.DataType.HIGHWAY)){
                if(d3.select("body").attr("role") =="work"&&false){
                    doSaveRoadContral(newVals, cVals);
                }

				modal.close();
			});

		bottom.append('button')
			//.attr('type', 'button')
			.attr('class', 'cancel button gray')
			.html('取消')
			.on('click', function() {
				modal.close();
			});
	}

	function getBlockTypeRender() {

		var fromWay = context.entity(fromWayId),
			toWay = context.entity(toWayId);

		var options = [{
			label: '未设定',
			value: 0
		}, {
			label: '无障碍通行门禁',
			value: 1
		}, {
			label: '刷卡进入门禁',
			value: 21
		}, {
			label: '授权进入门禁',
			value: 22
		}, {
			label: '收费进入门禁',
			value: 23
		}, {
			label: '紧急通道门禁',
			value: 24
		}, {
			label: '不可通行门禁',
			value: 3
		}];

/*		if (fromWay.tags.direction == '2' || fromWay.tags.direction == '3' ||
			toWay.tags.direction == '2' || toWay.tags.direction == '3') {

			options = options.filter(function(opt) {

				return opt.value !== 3 && opt.value !== 24;
			});

		}*/   //by modify  满足规格升级需求

		return iD.ui.RoadRule.Select({
			name: 'block_type',
			options: options
		});
	}

	function doSaveRoadContral(newVals, oldVals) {

		if (!maat.id) {
			//well, need to create such a maat

			if (assInfo.id) {
				console.error('No matt but got assInfo!!!', maat, assInfo);
			}

			maat = [];

			context.perform(
				iD.actions.AddMaat(maat, fromWayId, toWayId, nodeId),
				"创建Matt");
			maat = maat[0];

			assInfo.members[0].id = maat.id;
		}

		//console.log(assInfo);
        if(!assInfo.id&&newVals.block_type=="0")
        {
            return;
        }
		if (!assInfo.id) {
			assInfo = _.assign(iD.Relation(), assInfo);
		}
        if(newVals.block_type=="0")
        {
            context.perform(
                iD.actions.DeleteRelation(assInfo.id),
                "删除门禁信息");

        }else{

            if(parseFloat(context.entity(fromWayId).tags.length)<5.0||parseFloat(context.entity(toWayId).tags.length)<5.0)
            {
                Dialog.alert("制作门禁连接的两条道路长度必须大于5米");
                return;
            }
            assInfo = assInfo.update({
                tags: _.assign({}, assInfo.tags, newVals)
            });
            assInfo = iD.util.tagExtend.updateVerifyTag(assInfo);
            if (newVals.block_type != undefined) {
                if (assInfo.tags.type != undefined && assInfo.tags.type != "2") {
                    assInfo.tags.type = "2";
                }
            }
            context.perform(
                iD.actions.EditRelation(context, [assInfo], []),
                "更新门禁信息");
        }
        //context.map().dimensions(context.map().dimensions());
	}

	roadControl.transportation = function(_) {
		if (!arguments.length) {
			return transportation;
		}

		transportation = _;

		roadControl.fromWayId(transportation.fromwayId)
			.nodeId(transportation.nodeId)
			.toWayId(transportation.towayId);

		return roadControl;
	};

	//选择的节点
	roadControl.nodeId = function(_) {
		if (!arguments.length) return nodeId;
		nodeId = _;
		return roadControl;
	};
	//选择的道路
	roadControl.fromWayId = function(_) {
		if (!arguments.length) return fromWayId;
		fromWayId = _;
		return roadControl;
	};
	//需要去的路
	roadControl.toWayId = function(_) {
		if (!arguments.length) return toWayId;
		toWayId = _;
		return roadControl;
	};

	roadControl.getAssistInfo = function() {

		var maatInfo = iD.ui.RoadRuleEditor(context)
			.transportation(transportation).getMaatInfo();

		maat = maatInfo.maat;

		var maatType = maatInfo.maatType,
			isCross = maatInfo.isCross;

		var targetType = isCross ? 'AssistInfoC' : 'AssistInfo';

		function createNewAssInfo() {

			var fromWay = context.graph().entity(fromWayId);

			var assInfo = {
				layerId: fromWay.layerId,
				//layertype: fromWay.type,
				version: 1,
				members: [{
					id: maat.id,
					role: "maat",
					type: maatType
				}],
				tags: {
					// datatype: targetType,
					mesh: fromWay.tags.mesh
				}
			};

			return assInfo;
		}

		if (!maat || !maat.id) {
			return createNewAssInfo();
		}

		var pareRels = context.graph().parentRelations(maat);

		var assInfos = [];
		_.each(pareRels, function(rel) {

			if (targetType === rel.modelName) {
				assInfos.push(rel);
			}
		});

		assInfos.sort(function(a, b) {
			return a.id < b.id ? 1 : -1;
		});

		if (assInfos.length > 1) {
			console.warn('More than one AssistInfo found!!', assInfos);
		}


		return assInfos.length ? assInfos[0] : createNewAssInfo();
	};


	return d3.rebind(roadControl, event, 'on');
};