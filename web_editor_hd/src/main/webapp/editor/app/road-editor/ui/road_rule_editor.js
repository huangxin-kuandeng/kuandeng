iD.ui.RoadRuleEditor = function(context) {

	var event = d3.dispatch('apply'),
		transportation,
		modal,
		nodeId,
		nodeDataType,
		fromWayId,
		toWayId,

		relations = [], //存放添加的关系
		deleteRelations = [], //存放删除的关系

		editRelation, //编辑的Relation对象
		relationTemplate = {}, //关系模板

		maat,   
		edit = {},

		timeRuleObj = {
			time1: '',
			time2: ''
		},
		// RULE_TYPE：
		//     Bit0：
		//         0-时间限制。此时RULE_TIME不能取24小时。
		//         1-全天限制（即时间为24小时）。此时RULE_TIME固定为24小时。
		//     Bit1：
		//         0-无外埠限制。
		//         1-外埠限制。
		//     Bit2：
		//         0-无车辆限制（即车辆为全部车辆）。此时，VEHICLE取值固定为所有车辆。
		//         1-车辆限制。此时，VEHICLE取值不为所有车辆。

		ruleTypeBinary = [0, 0, 0];

	/**
	 * 临时辅助方法
	 */
	// var _Util = {
	// 	_cars: _.map(iD.ui.RoadRule.CarList.carOptions, function(item) {
	// 		return _.assign({}, item, {
	// 			name: item.label
	// 		});
	// 	}),
	// 	//二进制转16进制
	// 	_2To16: function(v) {
	// 		return parseInt(v, 2).toString(16).toUpperCase();
	// 	},
	// 	//16进制转2进制
	// 	_16To2: function(v) {
	// 		return parseInt(v, 16).toString(2);
	// 	},
	// 	//2进制转10进制
	// 	_2To10: function(v) {
	// 		return parseInt(v, 2).toString(10);
	// 	},
	// 	//10进制转2进制
	// 	_10To2: function(v) {
	// 		return parseInt(v, 10).toString(2);
	// 	},
	// 	//组装时间
	// 	//返回：[(h:02:00)(h:03:00)]
	// 	// _timeTranfer: function(time1, time2) {
	// 	// 	var arr = [];
	// 	// 	arr.push('[(h:');
	// 	// 	arr.push(time1);
	// 	// 	arr.push(')(h:');
	// 	// 	arr.push(time2);
	// 	// 	arr.push(')]');
	// 	// 	return arr.join('');
	// 	// },
	// 	//组装时间的反操作
	// 	//返回{time1:'02:00',time2:'03:00'}
	// 	// _timeReverseTranfer: function(time) {
	// 	// 	var obj = {
	// 	// 		time1: '00:00',
	// 	// 		time2: '24:00'
	// 	// 	};
	// 	// 	//首先把收尾的[(,)]，以及h:去掉
	// 	// 	time = time.replace('[(', '').replace(')]', '').replace(/h:/g, '').split(')(');
	// 	// 	if (time.length == 2) {
	// 	// 		obj.time1 = time[0];
	// 	// 		obj.time2 = time[1];
	// 	// 	}
	// 	// 	return obj;
	// 	// },
	// 	//根据选择的车辆
	// 	//生成对应十六进制
	// 	// _createHexadecimalBySelectedCars: function(ids) {
	// 	// 	var temp = [];
	// 	// 	for (var i = 0; i < 32; i++) {
	// 	// 		temp.push(0);
	// 	// 	}
	// 	// 	_(ids).each(function(id) {
	// 	// 		temp[id] = 1;
	// 	// 	});
	// 	// 	return this._2To16(temp.reverse().join(''));
	// 	// },
	// 	_createHexadecimalBySelectedCars: function(ids) {
	// 		var temp = [];
	// 		for (var i = 0; i < 32; i++) {
	// 			temp.push(0);
	// 		}
	// 		_(ids).each(function(id) {
	// 			temp[id] = 1;
	// 		});
	// 		return temp.join(',');
	// 	},
	// 	//根据16进制，获得选择的车类型
	// 	//返回数组
	// 	// _getCarNamesByHexadecimal: function(v) {
	// 	// 	var array = [],
	// 	// 		v = (v && this._16To2(v)) || '',
	// 	// 		cars = this._cars;
	// 	// 	for (var i = 0, l = v.length; i < l; i++) {
	// 	// 		if (parseInt(v[i], 10) === 1) {
	// 	// 			var obj = searchCar(l - 1 - i);
	// 	// 			if (obj) {
	// 	// 				array.push(obj);
	// 	// 			}
	// 	// 		}
	// 	// 	}

	// 	// 	function searchCar(i) {
	// 	// 		var obj;
	// 	// 		_(cars).each(function(item) {
	// 	// 			if (item.id === i) {
	// 	// 				obj = item;
	// 	// 				return false;
	// 	// 			}
	// 	// 		});
	// 	// 		return obj;
	// 	// 	}
	// 	// 	return array;
	// 	// }
	// 	_getCarNamesByHexadecimal: function(v) {
	// 		var array = [],
	// 			v = v || '',
	// 			cars = this._cars;
	// 		for (var i = 0, l = v.length; i < l; i++) {
	// 			if (parseInt(v[i]) === 1) {
	// 				var obj = searchCar(l - 1 - i);
	// 				if (obj) {
	// 					array.push(obj);
	// 				}
	// 			}
	// 		}

	// 		function searchCar(i) {
	// 			var obj;
	// 			_(cars).each(function(item) {
	// 				if (item.id === i) {
	// 					obj = item;
	// 					return false;
	// 				}
	// 			});
	// 			return obj;
	// 		}
	// 		return array;
	// 	}
	// };

	function compareMember(members) {
		//组合一个可以比较的对象
		var objA = {
			'FROAD_ID': '',
			'ROAD_NODE_ID': '',
			'TROAD_ID': ''
		};
		_(members).each(function(member) {
			if([iD.data.RoleType.ROAD_NODE_ID,iD.data.RoleType.C_NODE_ID].includes(member.role)){
				objA.ROAD_NODE_ID = member.id
			}else{
				objA[member.role] = member.id;
			}
			
		});

		var objB = {
			'FROAD_ID': fromWayId,
			'ROAD_NODE_ID': nodeId,
			'TROAD_ID': toWayId
		};
		return _.isEqual(objA, objB);
	}

	//console.warn(_Util._getCarNamesByHexadecimal('80000000'), _Util._getCarNamesByHexadecimal('FF000000'));

	// function validateTags(tags) {
	// 	var obj = {};
	// 	//如果这三个值都为空，直接返回false
	// 	obj.rule_type = tags.rule_type || '';
	// 	obj.rule_time = tags.rule_time || '';
	// 	obj.vehicle = tags.vehicle || '';

	// 	var _value = _.values(obj).join('');
	// 	if (_value === '') {
	// 		return false;
	// 	}
	// 	return true;
	// }


	function parseRuleTime(ruleTime) {

		//iD.testGDF() ;
		return iD.convertGDFToInfo(ruleTime || '');

		// var timeInfo = {};

		// var parts = (ruleTime || '').split('|');

		// if (!parts.length || parts.length !== 5) {
		// 	console.warn('Unknow rule time format', ruleTime);
		// 	return timeInfo;
		// }

		// timeInfo = {
		// 	timeRange: _.map(parts[0].split(','), function(r) {
		// 		var p = r.split('~')
		// 		return {
		// 			start: p[0],
		// 			end: p[1]
		// 		};
		// 	}),
		// 	dateRange: _.map(parts[1].split(','), function(r) {
		// 		var p = r.split('~')
		// 		return {
		// 			start: p[0],
		// 			end: p[1]
		// 		};
		// 	}),
		// 	holiday: parts[2],
		// 	weekDay: parts[3].split(','),
		// 	season: parts[4].split(',')
		// };

		// return timeInfo;
	}


	function buildRuleTime(timeInfo) {

		//iD.testGDF() ;
		return iD.convertInfoToGDF(timeInfo);

		//something like {
		//"timeRange":[{"start":"00:00","end":"23:59"}],
		//"dateRange":[{"start":"1-1","end":"12-31"}],
		//"weekDay":["2","6"],
		//"season":["summer","autumn"],
		//"holiday":"2"}
		// console.log(JSON.stringify(timeInfo));

		// //时间段
		// var timeRange = timeInfo.timeRange,
		// 	//日期
		// 	dateRange = timeInfo.dateRange,
		// 	//节假日
		// 	holiday = timeInfo.holiday,
		// 	//星期
		// 	weekDay = timeInfo.weekDay,
		// 	//季节
		// 	season = timeInfo.season;

		// var parts = [];

		// parts.push(
		// 	_.map(timeRange, function(r) {
		// 		return r.start + '~' + r.end;
		// 	}).join(','));

		// parts.push(
		// 	_.map(dateRange, function(r) {
		// 		return r.start + '~' + r.end;
		// 	}).join(','));

		// parts.push(holiday);

		// parts.push(weekDay.join(','));

		// parts.push(season.join(','));

		// return parts.join('|');
	}

	/**
	 * 分析单个Relation
	 */
	function analyzeSingleRelation(relation) {

		var obj = _.assign({}, relation.tags);
		//时间限制
		obj.id = relation.id;

		//obj.rule_time = _Util._timeReverseTranfer(relation.tags.time || '');

		//规则类型
		obj.TYPE = relation.tags.TYPE || '1';
		// var _ruleTypeBinary = [],
		// 	_tempRuleType = _Util._10To2(obj.TYPE);

		// _(_tempRuleType).each(function(item) {
		// 	_ruleTypeBinary.push(parseInt(item, 10));
		// });
		// if (_tempRuleType.length !== 3) {
		// 	//补0
		// 	for (var i = 0, l = 3 - _tempRuleType.length; i < l; i++) {
		// 		_ruleTypeBinary.unshift(0);
		// 	}
		// }

		// if (_ruleTypeBinary[1]) {
		// 	obj.isOuter = true;
		// }
		// if (_ruleTypeBinary[2]) {
		// 	obj.isAllDayLimit = true;
		// }

		//车辆限制
		obj.vehicle = iD.util._Util._getCarNamesByHexadecimal(relation.tags.VEHICLE || '0');

		//console.warn(obj.vehicle);

		//数据类型
		obj.modelName = relation.modelName;
//		obj.datatype = relation.modelName || '';

		obj.timeInfo = parseRuleTime(relation.tags.TIME);

		return obj;
	};


	function roadRuleEditor(selection) {

		var relationInfo = roadRuleEditor.getRelationInfo();

//		console.log("ding---"+relationInfo.relations);

		relations = relationInfo.relations;

		maat = relationInfo.maat;

		nodeDataType = context.graph().entity(nodeId).modelName || '';
		nodeDataType = nodeDataType.indexOf(iD.data.DataType.ROAD_NODE) > -1 ? iD.data.DataType.TRAFFICRULE : iD.data.DataType.C_TRAFFICRULE;
//		nodeDataType = nodeDataType.indexOf('Node') > -1 ? 'ForbidInfo' : 'ForbidInfoC';

		modal = iD.ui.modal(selection);

		modal.select('.modal')
			.classed('modal-alert common-dialog', true);

		//隐藏掉右上角的关闭按钮
		//modal.select('button.close').style('display', 'none');

		var section = modal.select('.KDSEditor-content');

		var restriction = section.append('div')
			.attr('class', 'traffic-area');

		restriction.append('div')
			.attr('class', 'title model_title')
			.html('限行信息');


		var wrap = restriction.append('div')
			.attr('class', 'body');


		var fromWay = context.graph().entity(fromWayId);
		var toWay = context.graph().entity(toWayId);
        
        
		
		var maatType = relationInfo.maatType;

		if (!maat.id) {
			//well, need to create such a maat

			maat = [];

			context.perform(
				//iD.actions.AddMaat(maat, fromWayId, toWayId, nodeId, maatType),
				iD.actions.AddMaat(maat, fromWayId, toWayId, nodeId, maatType),
				"创建Matt");
			maat = maat[0];
		}

		/**
    	relationTemplate.members =  [
				{id: fromWayId	,role: "from_road"	,type: "Highway"},
				{id: nodeId		,role: "node"	,type: (nodeDataType === "CrossRule" ? iD.data.Constant.C_NODE : iD.data.Constant.ROADNODE)},
				{id: toWayId	,role: "to_road"	,type: "Highway"}];*/
			
		relationTemplate.modelName = maat.modelName == iD.data.DataType.NODECONN?iD.data.DataType.TRAFFICRULE:iD.data.DataType.C_TRAFFICRULE;
			//关系模板
		relationTemplate.layerId = iD.Layers.getCurrentModelEnableLayer(relationTemplate.modelName).id;
		relationTemplate.layer = iD.Layers.getCurrentModelEnableLayer(relationTemplate.modelName);
//		relationTemplate.layertype = fromWay.type;
//		relationTemplate.version = 1;
   

		relationTemplate.members = [{
			id: maat.id,
			role: maat.modelName == iD.data.DataType.NODECONN?iD.data.RoleType.NODECONN_ID:iD.data.RoleType.C_NODECONN_ID,
			type: iD.data.GeomType.RELATION,
			modelName:maat.modelName
		}];

		//绘制规则列表
		drawRestrictionList();
		/**
		 * 输出限行规则
		 * @return void
		 */
		function drawRestrictionList() {
			modal.classed('restriction_detail', false);

			//TODO 这块写的太生硬了，后续需要修改	
			// var fieldKey = iD.Layers.getLayer(fromWay.layerId).label.fieldKey || 'name_chn';
			var fieldKey = 'name_chn';

			var items = wrap.html('');
			var aName = iD.util.displayName(fromWay, fieldKey) || '未知道路';
			var bName = iD.util.displayName(toWay, fieldKey) || '未知道路';
			//追加roadA-B
			// items.append('div')
			// 	.attr('class', 'roadA-B')
			// 	.html('从 <strong>' + aName + '</strong> 到 <strong>' + bName + '</strong> 的限行信息: ');


			modal.select('div.model_title')
				.html('从 <strong>' + aName + '</strong> 到 <strong>' + bName + '</strong> 的限行信息: ');

			//追加列表
			var dl = items.append('dl')
				.attr('class', 'time-list');
			var dl_title = dl.append('dt');
			dl_title.append('b').html('类型');
			// dl_title.append('b').html('外埠限制');
			dl_title.append('b').html('车辆限制');
			dl_title.append('b').html('操作');

			var dds = dl.selectAll('dd').data(_.map(relations, function(d) {
				return {
					relation: d,
					analyzed: analyzeSingleRelation(d)
				};
			}));

			var enter = dds.enter().append('dd');
			enter.append('b').attr('class', 'type');
			enter.append('b').attr('class', 'outer');
			enter.append('b').attr('class', 'car');
			var opt = enter.append('b').attr('class', 'opt');
			opt.append('button')
				.attr('class', 'edit button blue')
				//.attr('href', 'javascript:void(0);')
				.html('编辑')
                /*.classed('hide',function(d){
                    if(d3.select("body").attr("role") =="check"
                        // ||(d3.select("body").attr("role") =="work"&&!iD.Static.layersInfo.isEditable(iD.data.DataType.HIGHWAY))){
                        ||(d3.select("body").attr("role") =="work"&& true)){
                        return true;
                    }else{
                        return false;
                    }
                });*/
			opt.append('button')
				.attr('class', 'del button red')
				//.attr('href', 'javascript:void(0);')
				.html('删除')
                /*.classed('hide',function(d){
                    if(d3.select("body").attr("role") =="check"
                        ||(d3.select("body").attr("role") =="work"&&true)){
                        return true;
                    }else{
                        return false;
                    }
                });*/


            //--------------------------tags descript start-------------------
            var ddesc = enter.append('div').attr("class",'relDes').attr("id","relDes");
            //新增属性详细描述
            //enter.append('dd').html(function(d) {
            //    var obj = d.analyzed;
            //    return "禁止信息种类："+iD.ui.RoadRule.RuleType.getOptionLabel(obj.type);
            //    //return obj.rule_time.time1 + '-' + obj.rule_time.time2;
            //});
            //enter.append('dd').html(function(d) {
            //    var obj = d.analyzed;
            //    if (obj.isOuter) {
            //        return "有无外埠限制："+'有';
            //    }
            //    return "有无外埠限制："+'无';
            //});
            ddesc.append('dd').html(function(d) {
                var obj = d.analyzed,
                    cars = obj.vehicle,
                    names = [];
                _(cars).each(function(o) {
                    names.push(o.name);
                });
                return "车辆："+names.join(',');
            }).classed('hide',function(d){
                var obj = d.analyzed,
                    cars = obj.vehicle,
                    names = [];
                _(cars).each(function(o) {
                    names.push(o.name);
                });
                return  (names.length==0);
            });
            ddesc.append('dd').html(function(d) {
                var obj = d.analyzed,
                    timeRange = obj.timeInfo.timeRange,
                     times = [];
                _(timeRange).each(function(o) {
                    times.push(o.start+"-"+ o.end);
                });
                return "时间段："+times.join(',');
            }).classed('hide',function(d){
                var obj = d.analyzed,
                    timeRange = obj.timeInfo.timeRange,
                    times = [];
                _(timeRange).each(function(o) {
                    times.push(o.start+"-"+ o.end);
                });
                return  (times.length==0);
            });
            ddesc.append('dd').html(function(d) {
                var obj = d.analyzed,
                    dateRange = obj.timeInfo.dateRange,
                    dates = [];
                _(dateRange).each(function(o) {
                    dates.push(o.start+"-"+ o.end);
                });
                return "日期段："+dates.join(',');
            }).classed('hide',function(d){
                var obj = d.analyzed,
                    dateRange = obj.timeInfo.dateRange,
                    dates = [];
                _(dateRange).each(function(o) {
                    dates.push(o.start+"-"+ o.end);
                });
                return  (dates.length==0);
            });
            ddesc.append('dd').html(function(d) {
                var obj = d.analyzed,
                    weekDay = obj.timeInfo.weekDay,
                    weeks = [];
                var weekObj = {"1":"星期一", "2":"星期二","3":"星期三","4":"星期四","5":"星期五","6":"星期六","7":"星期日"};
                _(weekDay).each(function(o) {
                    weeks.push(weekObj[o.toString()]);
                });
                return "星期："+weeks.join(',');
            }).classed('hide',function(d){
                var obj = d.analyzed,
                    weekDay = obj.timeInfo.weekDay,
                    weeks = [];
                var weekObj = {"1":"星期一", "2":"星期二","3":"星期三","4":"星期四","5":"星期五","6":"星期六","7":"星期日"};
                _(weekDay).each(function(o) {
                    weeks.push(weekObj[o.toString()]);
                });
                return  (weeks.length==0);
            });
            ddesc.append('dd').html(function(d) {
                var obj = d.analyzed,
                    season = obj.timeInfo.season,
                    seasons = [];
                var seasonObj = {"spring":"春季", "summer":"夏季","autumn":"秋季","winter":"冬季","dry":"干季","rainy":"雨季/汛期"};
                _(season).each(function(o) {
                    seasons.push(seasonObj[o.toString()]);
                });
                return "季节："+seasons.join(',');
            }).classed('hide',function(d){
                var obj = d.analyzed,
                    season = obj.timeInfo.season,
                    seasons = [];
                var seasonObj = {"spring":"春季", "summer":"夏季","autumn":"秋季","winter":"冬季","dry":"干季","rainy":"雨季/汛期"};
                _(season).each(function(o) {
                    seasons.push(seasonObj[o.toString()]);
                });
                return  (seasons.length==0);
            });
            ddesc.append('dd').html(function(d) {
                var obj = d.analyzed,
                    holiday = obj.timeInfo.holiday,
                    holidayObj = {"0":"未设定", "1":"节假日","2":"节假日除外"};
                return "节假日："+ holidayObj[holiday.toString()];
            }).classed('hide',function(d){
                var obj = d.analyzed,
                    holiday = obj.timeInfo.holiday,
                    holidayObj = {"0":"未设定", "1":"节假日","2":"节假日除外"};
                return  (holiday.toString()=="0");
            });


            enter.on('click',function(d){
                if(this.lastElementChild.className == "relDes"){
                    d3.select(this.lastElementChild).classed('hide',true)
                }else if(this.lastElementChild.className == "relDes hide"){
                    d3.select(this.lastElementChild).classed('hide',false)
                }
                //console.log(d);
            })
            //------------------------------------------------------- tags descript end-------------------------


			//Update
			enter.select('b.type')
				.html(function(d) {
					var obj = d.analyzed;
					return iD.ui.RoadRule.RuleType.getOptionLabel(obj.type);
					//return obj.rule_time.time1 + '-' + obj.rule_time.time2;
				});

			enter.select('b.outer')
				.html(function(d) {
					// var obj = d.analyzed;
					// if (obj.isOuter) {
					// 	return '有';
					// }
					return '无';
				});

			enter.select('b.car')
				.html(function(d) {
					var obj = d.analyzed,
						cars = obj.vehicle,
						names = [];
					_(cars).each(function(o) {
						names.push(o.name);
					});
					return names.join(',');
				});


			//操作按钮
			enter.select('button.edit')
				.on('click', function(d) {
					//编辑
					editRelation = d.relation;
					drawRestrictionDetail();
				});
			enter.select('button.del')
				.on('click', function(d) {
					d = d.relation;

					//删除,放到删除的数组中
					if (context.graph().hasEntity(d.id)) {
						deleteRelations.push(context.graph().entity(d.id));
					}

					//这块有待优化，时间紧迫，先实现
					var temp = [];
					_(relations).each(function(item, index) {
						if (item.id != d.id) {
							temp.push(item);
						}
					});
					relations = temp;
					//重新渲染规则列表
					drawRestrictionList();
				});

			//bottom
			var bottom = items.append('div')
				.attr('class', 'bottom');

			var addRuleBtn = bottom.append('button')
				//.attr('type', 'button')
				.attr('class', 'add-rule button blue')
				.html('添加限行规则')
                .classed('hide',function(d){
                	var modelConfig = iD.Layers.getLayer(fromWay.layerId, fromWay.modelName);
                    if(d3.select("body").attr("role") =="check"
                        // ||(d3.select("body").attr("role") =="work"&&!iD.Static.layersInfo.isEditable(iD.data.DataType.HIGHWAY))){
                        ||(d3.select("body").attr("role") =="work" && !modelConfig && !modelConfig.editable)){
                        return true;
                    }else{
                        return false;
                    }
                })
				.on('click', btnAddNewRule);

			if (relations.length < 5) {
				addRuleBtn.style('display', '');

			} else {
				addRuleBtn.style('display', 'none');

			}


			bottom.append('button')
				//.attr('type', 'button')
				.attr('class', 'apply button blue')
				.html('应用')
				.on('click', btnApply);
			bottom.append('button')
				//.attr('type', 'button ')
				.attr('class', 'cancel button gray')
				.html('取消')
				.on('click', btnClose);
		}

        function isVehicleOverlap(rA, rB) {
            for (var a=0; a<rA.length; a++) {
                if (rA[a].id == '0') {
                    rA.pop() ;
                    rA.push({id:1}, {id:2}, {id:3}, {id:4}, {id:5}, {id:6}, {id:7}, {id:8}, {id:9}, {id:10}, {id:11}, {id:12}) ;
                    break ;
                }
            }
            for (var b=0; b<rB.length; b++) {
                if (rB[b].id == '0') {
                    rB.pop() ;
                    rB.push({id:1}, {id:2}, {id:3}, {id:4}, {id:5}, {id:6}, {id:7}, {id:8}, {id:9}, {id:10}, {id:11}, {id:12}) ;
                    break
                }
            }

            for (var a=0; a<rA.length; a++) {
                for (var b=0; b<rB.length; b++) {
                    if (rA[a].id == rB[b].id)
                        return true ;
                }
            }
            return false ;
        }

        function isTimeOverlap(tagsA, tagsB) {
            if (typeof tagsA.type != undefined && typeof tagsB.type != undefined) {

                //日期以及车辆上没有重叠

                // 0 明示
                // 1(强制信息)
                // 2 门禁
                if (tagsA.type==tagsB.type)
                    return false ;

                if (tagsA.type=="1" && tagsB.type=="0")
                    return false ;
                if (tagsB.type=="1" && tagsA.type=="0" )
                    return false ;

                //判断车种是否相同
                var vehicleA = iD.util._Util._getCarNamesByHexadecimal(tagsA.VEHICLE),
                     vehicleB = iD.util._Util._getCarNamesByHexadecimal(tagsB.VEHICLE);
            
                if ( isVehicleOverlap(vehicleA, vehicleB)) {

                    // 明示非24小时禁止与门禁非24小时时间段重叠；不符合需求。
                    //确认如下方式过滤：
                    //1.门禁信息与强制信息不能重复录入 （可同时存在但时间段,日期,不能重复）
                    //2.同一路径中高德推荐禁止信息与0-24小时明示禁止信息，不能同时存在（不考虑车种、天气等）
                    //3.强制非24小时可以与推荐同时存在
                    var timeA = parseRuleTime(tagsA.time),
                        timeB = parseRuleTime(tagsB.time);


                    //强制非24小时可以与推荐同时存在
                    return iD.compareTimeOverlap(tagsA.type, tagsB.type, timeA, timeB);
                }
            }
            return false ;
        }
		/**
		 * 追加一条规则，包含编辑
		 */
		function doEditRuleDetail(newRelation, oldRelation) {



			// //限行时间
			// timeRuleObj.time1 = d3.select('#time_rule_time_start').property('value');
			// timeRuleObj.time2 = d3.select('#time_rule_time_end').property('value');

			// //获得时间时间限制,默认：全天限制
			// var timeRuleId = 1;
			// d3.selectAll('input.timerule').each(function() {
			// 	if (this.checked) {
			// 		timeRuleId = parseInt(this.value, 10);
			// 	}
			// });
			// if (timeRuleId === 1) {
			// 	//如果全天限制
			// 	timeRuleObj.time1 = '00:00';
			// 	timeRuleObj.time2 = '24:00';
			// }
			// if (timeRuleObj.time1 === '00:00' && timeRuleObj.time2 === '24:00') {
			// 	timeRuleId = 1;
			// }

			// //对应二进制第0位(从右到左)
			// ruleTypeBinary[2] = timeRuleId ? 1 : 0;

			// //检查时间是否合法
			// if (timeRuleId === 0 && !checkRuleTime(timeRuleObj.time1, timeRuleObj.time2)) {
			// 	alert('开始时间不能大于结束时间！');
			// 	return;
			// }
			// 

			// ruleTypeBinary[2] = 0;

			// //获得外埠车辆
			// var outRuleId = newRelation.isOuter ? 2 : 0;

			// //对应二进制第1位,同上
			// ruleTypeBinary[1] = outRuleId ? 1 : 0;

			//获得车辆限制
			var carSelectedIds = newRelation.vehicle || [];

			//如果选择【全部车辆】或者什么都不选，则默认全部车辆
			if (carSelectedIds.length === 0) {
				Dialog.alert('请选择要限制的车辆！');
				return;
				carSelectedIds = [];
			}
			//对应二进制第2位,同上
			// ruleTypeBinary[0] = _.contains(carSelectedIds, 31) ? 0 : 1;

			/************start**************/
			var relation;

			if (editRelation) {

				relation = _.find(relations, function(r) {
					return r.id === editRelation.id;
				});

			} else {  //TODO 可能会有问题 需要测试
				relation = iD.Relation();
				relation = _.extend(relation, _.clone(relationTemplate));
			    relation.modelName = nodeDataType;
			    relation.tags = iD.util.getDefauteTags(nodeDataType, iD.Layers.getLayer(relation.layerId))
			}

			relation = relation.update({
				tags: _.assign({}, relation.tags, {
//					datatype: nodeDataType,
					/*licplate: newRelation.isOuter ? '1' : '0',
					type: newRelation.type,
					time: buildRuleTime(newRelation.timeInfo),
					vehicle: _Util._createHexadecimalBySelectedCars(carSelectedIds),
					mesh: context.entity(fromWayId).tags.mesh*/
					// LICPLATE: newRelation.isOuter ? '1' : '0',
					TYPE: newRelation.TYPE,
					// VEHICLE: _Util._createHexadecimalBySelectedCars(carSelectedIds),
					VEHICLE: iD.util._Util._createHexadecimalBySelectedCars(carSelectedIds),
					TIME: buildRuleTime(newRelation.timeInfo)
				})
			});


			var tmpEqRel = null;

			if (relations.some(function(r) {

					if (r.id == relation.id) {
						return ;
					}

					if (_.isEqual(r.tags, relation.tags)) {

						tmpEqRel = r;

						return true;
					}

				})) {

				Dialog.alert('相同内容的限行信息已经存在！');
				return;
				//console.warn('some thing relationed', relation, tmpEqRel);
			}

            //添加两条时间重叠的明示时间禁止信息
            if (relations.some(function(r) {

                    if (r.id == relation.id) {
                        return ;
                    }

                    if (isTimeOverlap(r.tags, relation.tags)) {

                        tmpEqRel = r;

                        return true;
                    }

                })) {

                Dialog.alert('存在两条时间重叠的明示时间禁止信息！');
                return;
                //console.warn('some thing relationed', relation, tmpEqRel);
            }


            //高德推荐不能与包含“小轿车、小客客车、微型车、全部车辆”24小时非外埠禁止信息重复
//             if (relations.some(function(r) {
//                     //判断是否为明示禁止与高德推荐同时存在
//                     var isSameTypeForbid=function(r_Forbid)
//                     {
//                         //if(r_Forbid.tags.licplate!=0||r_Forbid.tags.time!="[(h0){h24}]")
//                         if(r_Forbid.tags.TIME!="[(h0){h24}]")
//                         {
//                             return false;
//                         }
// //                      var vh_flag=parseInt(r_Forbid.tags.vehicle.slice(0,4),16)
// 						var vh_flag=parseInt(r_Forbid.tags.VCHICLE.slice(0,4),16)
//                         if((vh_flag>>15)&0x01==1||(vh_flag>>14)&0x01==1||(vh_flag>>13)&0x01==1||(vh_flag>>9)&0x01==1){
//                             return true;
//                         }else{
//                             return false;
//                         }
//                     }
//                     if (r.id == relation.id) {
//                         return ;
//                     }
//                     if ((r.tags.TYPE== "1" &&relation.tags.TYPE=="0")) {
// //                  if ((r.tags.type==1&&relation.tags.type==0)) {

//                         if(isSameTypeForbid(relation))
//                         {
//                             return true
//                         }else{
//                             return false;
//                         }
//                     }else if(r.tags.TYPE=="0"&&relation.tags.TYPE=="1")
// //                  }else if(r.tags.type==0&&relation.tags.type==1)
//                     {
//                         if(isSameTypeForbid(r))
//                         {
//                             return true
//                         }else{
//                             return false;
//                         }
//                     }

//                 })) {
//                 Dialog.alert('推荐不能与只包含“小轿车、小型客车、微型车、全部车辆”、非外埠，24小时强制禁止信息同时存在！');
//                 return;
//                 //console.warn('some thing relationed', relation, tmpEqRel);
//             }


            /*
            if ((function(tmpRelations) {

					var hasAmapRecommend = tmpRelations.some(function(r) {
						return r.tags.type === '1';
					});

					if (hasAmapRecommend) {

						return tmpRelations.some(function(r) {

							return r.tags.type === '0' &&
								r.tags.time.indexOf('(h0){h24}') >= 0;

						});

					}

				})(editRelation ? relations : [relation].concat(relations)) === true) {

				Dialog.alert('高德禁止与0-24小时明示禁止不能同时存在！');
				return;
			};
            */

			console.log('road rule', relation);

			/**************end***************/

			if (editRelation) {
				//relation.id = editRelation.id;
				edit[relation.id] = true;
			}

			if (!editRelation) {
				relations.push(relation);
			} else {
				//首先把原数组中所对应的关系删掉
				//有待优化
				var temp = [];
				_(relations).each(function(r) {
					if (r.id != editRelation.id) {
						temp.push(r);
					}
				});
				relations = temp;
				relations.push(relation);
			}


			//重置
			editRelation = null;
			relation = null;

			//返回到规则列表页面
			drawRestrictionList();
		}

/*        var blockTypeFlag=false;
        var intNodeWayNum=0;
        context.graph().parentWays(context.entity(nodeId)).forEach(function(d){
            if(!d.isOneRoadCrossWay()){
                intNodeWayNum++;
            }
        })
        if(2==intNodeWayNum)
        {

        }*/

        var defaultNewRelation = {
            VEHICLE: [{
                id: 0
            }],
            TYPE: '0',
            timeInfo: {
                timeRange: [{
                    start: "00:00",
                    end: "24:00"
                }]
            }
        };

        var blockTypeFlag=false;
		let _entity = context.entity(nodeId);
		let topoEntity = iD.TopoEntity();
		let crossNodeMembers = [];
		
		if(_entity.isRoadCross()){
			crossNodeMembers = topoEntity.getCrossNodeMembers(context.graph(), _entity.id);
		}

        if(_entity.isRoadCross()||fromWayId==toWayId)
        {
            blockTypeFlag=false;
        }else if(_entity.tags.realnode=="0")
        {
            blockTypeFlag=true;
        }

        var ruleTypeFlag=false;
        var  ruleTypeFlagFrom=false;
        var  ruleTypeFlagTo=false;

		
        if (fromWay.tags.DIRECTION === '1') {
            ruleTypeFlagFrom=true;
        } else if (fromWay.tags.DIRECTION === '2') {
            if (fromWay.last() ===nodeId) {
                ruleTypeFlagFrom=true;
            }else if(_entity.isRoadCross())
            {
                if(-1!=crossNodeMembers.indexOf(fromWay.last()))
                {
                    ruleTypeFlagFrom=true;
                }
                crossNodeMembers.forEach(function(member){
                    if(member.id==fromWay.last())
                    {
                        ruleTypeFlagFrom=true;
                    }
                })
            }
        } else if (fromWay.tags.DIRECTION === '3') {
            if (fromWay.first() ===nodeId) {
                ruleTypeFlagFrom=true;
            }else if(_entity.isRoadCross())
            {
                crossNodeMembers.forEach(function(member){
                    if(member.id==fromWay.first())
                    {
                        ruleTypeFlagFrom=true;
                    }
                })
            }
        }

        if(ruleTypeFlagFrom)
        {
            if (toWay.tags.DIRECTION === '1') {
                ruleTypeFlagTo=true;
            } else if (toWay.tags.DIRECTION === '3') {
                if (toWay.last() ===nodeId) {
                    ruleTypeFlagTo=true;
                }else if(_entity.isRoadCross())
                {
                    if(-1!=crossNodeMembers.indexOf(toWay.last()))
                    {
                        ruleTypeFlagTo=true;
                    }
                    crossNodeMembers.forEach(function(member){
                        if(member.id==toWay.last())
                        {
                            ruleTypeFlagTo=true;
                        }
                    })
                }
            } else if (toWay.tags.DIRECTION === '2') {
                if (toWay.first() ===nodeId) {
                    ruleTypeFlagTo=true;
                }else if(_entity.isRoadCross())
                {
                    crossNodeMembers.forEach(function(member){
                        if(member.id==toWay.first())
                        {
                            ruleTypeFlagTo=true;
                        }
                    })
                }
            }
        }
        if(ruleTypeFlagFrom&&ruleTypeFlagTo)
        {
            ruleTypeFlag=true;
        }
        if(!ruleTypeFlag)
        {
            defaultNewRelation.TYPE="2";
        }
        // if(fromWay.tags.direction)
		var ruleDetailFormTpl = [{
			title: null,
			render: iD.ui.RoadRule.RuleType(ruleTypeFlag,blockTypeFlag),
			setVal: function(render, editRelation) {

				render.val(editRelation.TYPE);
			},
			getVal: function(render, newRelation) {

				newRelation.TYPE = render.val() || '0';
			},
			onChange: function($formGrps, d) {

				var isAmapRecommend = d.render.val() === '1';

				[{
					id: 'time-range',
					val: [{
						start: "00:00",
						end: "24:00"
					}]
				}, {
					id: 'vehicle',
					val: [0]
				},
                //  {
				// 	id: 'outerlnk',
				// 	val: []
				// },
                 {
					id: 'holiday',
					val: []
				}, {
					id: 'season',
					val: []
				}, {
					id: 'date-range',
					val: []
				}, {
					id: 'weekday',
					val: []
				}].forEach(function(d) {
 
					var inpInfo = d3.select('#traffic-rule-grp-' + d.id).datum();
				    inpInfo.render.disable(isAmapRecommend);
				 	if (isAmapRecommend) {
						inpInfo.render.val(d.val);
				 	}

				});

			}
		},
        //  {
		// 	id: 'outerlnk',
		// 	title: null,
		// 	render: iD.ui.RoadRule.MultiCheck({
		// 		options: [{
		// 			label: '外埠限制',
		// 			name: 'outer',
		// 			value: 'outer'
		// 		}]
		// 	}),
		// 	setVal: function(render, editRelation) {

		// 		var vals = {};

		// 		if (editRelation.isOuter) {
		// 			vals.outer = 'outer';
		// 		}

		// 		render.val(vals);
		// 	},
		// 	getVal: function(render, newRelation) {  

		// 		var vals = render.val();

		// 		if (vals.outer) {
		// 			newRelation.isOuter = true;
		// 		}
		// 	}
		// },
         {
			id: 'vehicle',
			title: '车辆',
			render: iD.ui.RoadRule.CarList({currentLayer:relationTemplate.layer}),
			setVal: function(render, editRelation) {

				render.val(_.map(editRelation.vehicle, function(item) {

					return item.id;
				}));
			},
			getVal: function(render, newRelation) {
				newRelation.vehicle = render.val();
			}
		}, {
			id: 'time-range',
			title: '时间段',
			render: iD.ui.RoadRule.TimeRange({
				limit: 5
			}),
			setVal: function(render, editRelation) {

				render.val(editRelation.timeInfo.timeRange);
			},
			getVal: function(render, newRelation) {
				newRelation.timeInfo.timeRange = render.val();
			}
		}, {
			id: 'date-range',
			title: '日期',
			render: iD.ui.RoadRule.DateRange({
				limit: 2
			}),
			fold: 1,
			setVal: function(render, editRelation) {
				render.val(editRelation.timeInfo.dateRange);
			},
			getVal: function(render, newRelation) {
				newRelation.timeInfo.dateRange = render.val();
			}
		}, {
			id: 'weekday',
			title: '星期',
			render: iD.ui.RoadRule.WeekDay(),
			fold: 1,
			setVal: function(render, editRelation) {
				render.val(editRelation.timeInfo.weekDay);
			},
			getVal: function(render, newRelation) {
				newRelation.timeInfo.weekDay = render.val();
			}
		}, {
			id: 'season',
			title: '季节',
			render: iD.ui.RoadRule.Season(),
			fold: 1,
			setVal: function(render, editRelation) {
				render.val(editRelation.timeInfo.season);
			},
			getVal: function(render, newRelation) {
				newRelation.timeInfo.season = render.val();
			}
		}, {
			id: 'holiday',
			title: '节假日',
			render: iD.ui.RoadRule.Holiday(),
			fold: 1,
			setVal: function(render, editRelation) {
				render.val(editRelation.timeInfo.holiday || '0');
			},
			getVal: function(render, newRelation) {
				newRelation.timeInfo.holiday = render.val();
			}
		}];


		/**
		 * 绘制规则详细信息
		 */
		function drawRestrictionDetail() {

			if (editRelation) {
				//方便赋值
				editRelation = analyzeSingleRelation(editRelation);
			}

			modal.select('div.model_title')
				.html((editRelation ? '编辑' : '创建') + '一条限行规则');

			modal.classed('restriction_detail', true);

			//console.log(editRelation);

			var items = wrap.html('');

			var $form = items.append('div')
				.attr('class', 'rule-grplist');

			var $formGrps = $form.selectAll('div.rule-group')
				.data(ruleDetailFormTpl);

			var $newGrps = $formGrps.enter()
				.append('div')
				.attr('class', 'rule-group cf')
				.attr('id', function(d, idx) {
					return 'traffic-rule-grp-' + (d.id ? d.id : idx);
				});

			$newGrps.append('h3')
				.attr('class', 'rule-group-title fold_title')
				.on('click', function(d) {
					var grp = d3.select(this.parentNode);
					grp.classed('fold', !grp.classed('fold'));
				});

			$newGrps.append('div').attr('class', 'rule-group-body fold_body cf');

			$formGrps.classed('fold', function(d) {
				return d.fold;
			});

			$formGrps.selectAll('h3.rule-group-title').classed('no-title', function(d) {
				return !d.title;
			}).html(function(d) {
				return d.title;
			})

			$formGrps.selectAll('div.rule-group-body').each(function(d) {

				if (d.onChange) {

					d.render.on('change', function() {

						// var args = Array.prototype.slice.call(arguments, 0);

						// args.unshift($formGrps)

						d.onChange.apply(null, [$formGrps, d]);
					});
				}

				d3.select(this).call(d.render);


			});

			$formGrps.selectAll('div.rule-group-body').each(function(d) {

				if (d.setVal) {

					d.setVal(d.render, editRelation || defaultNewRelation);

					var changeFunc = d.render.on('change');

					if (changeFunc) {
						changeFunc();
					}
				}
			});


			//bottom
			var bottom = wrap.append('div')
				.attr('class', 'bottom');

			bottom.append('button')
				.attr('class', 'apply button blue')
				.on('click', function() {

					var newRelation = {
						timeInfo: {}
					};

					var passed = true;

					$formGrps.selectAll('div.rule-group-body').each(function(d) {

						if (!passed) {
							return;
						}

						var validateFunc = d.validate || d.render.validate;

						if (validateFunc) {

							var validateResult = validateFunc();

							if (validateResult !== false) {

								var $topGrp = d3.select(this.parentNode);
								$topGrp.classed('fold', false);


								//validateFunc();

								passed = false;

								return false;
							}
						}

						if (d.getVal) {
							d.getVal(d.render, newRelation, editRelation);
						}
					});

					if (!passed) {
						return;
					}

					doEditRuleDetail(newRelation, editRelation);
				})
				.html(editRelation ? '修改' : '添加');

			bottom.append('button')
				//.attr('type', 'button')
				.attr('class', 'cancel button gray')
				.html('取消')
				.on('click', btnCancel);

		}


		// function timeRuleChanage() {
		// 	d3.selectAll('input.time_rule_time').property('disabled', this.value == '1');
		// }


		function btnAddNewRule() {
			//重置为空
			editRelation = null;
			drawRestrictionDetail();
		}

		// function checkRuleTime(time1, time2) {
		// 	var time1Hour = parseInt(time1.split(':')[0], 10),
		// 		time1Minute = parseInt(time1.split(':')[1], 10),
		// 		time2Hour = parseInt(time2.split(':')[0], 10),
		// 		time2Minute = parseInt(time2.split(':')[1], 10);

		// 	if (time1Hour > time2Hour) {
		// 		return false;
		// 	}
		// 	if (time1Hour == time2Hour && time1Minute > time2Minute) {
		// 		return false;
		// 	}

		// 	return true;
		// }

		/**
		 * 规则列表页面中的【取消】按钮
		 */
		function btnClose() {
			modal.close();
		}
		/**
		 * 添加规则页面中的【取消】按钮
		 */
		function btnCancel() {
			//重置
			editRelation = null;
			//返回到规则列表
			drawRestrictionList();
		}
		/**
		 * 规则列表页面中【应用】按钮
		 */
		function btnApply() {
            // if(d3.select("body").attr("role") =="work"&&iD.Static.layersInfo.isEditable(iD.data.DataType.ROAD)){
            if(d3.select("body").attr("role") =="work"&&context.layers().getCurrentModelEnableLayer(iD.data.DataType.ROAD)){
                relations.forEach(function(v, k) {
                    (context.graph().hasEntity(v.id) && !edit[v.id]) && (relations[k] = context.graph().entity(v.id));
                    relations[k] = iD.util.tagExtend.updateVerifyTag(relations[k]);
                });
                // console.log('rule apply', relations, deleteRelations);
                context.perform(
                    iD.actions.EditRelation(context, relations, deleteRelations),
                    "更新限行关系");
                //context.map().dimensions(context.map().dimensions());
            }
			//关闭交通规则窗口
			btnClose();
		}
	};


	//选择的节点
	roadRuleEditor.nodeId = function(_) {
		if (!arguments.length) return nodeId;
		nodeId = _;
		return roadRuleEditor;
	};
	//选择的道路
	roadRuleEditor.fromWayId = function(_) {
		if (!arguments.length) return fromWayId;
		fromWayId = _;
		return roadRuleEditor;
	};
	//需要去的路
	roadRuleEditor.toWayId = function(_) {
		if (!arguments.length) return toWayId;
		toWayId = _;
		return roadRuleEditor;
	};

	roadRuleEditor.transportation = function(_) {
		if (!arguments.length) {
			return transportation;
		}

		transportation = _;

		roadRuleEditor.fromWayId(transportation.fromwayId)
			.nodeId(transportation.nodeId)
			.toWayId(transportation.towayId);

		return roadRuleEditor;
	};

	roadRuleEditor.getMaatInfo = function() {

		//获得指定关系的Relation
		var fromWay = context.graph().entity(fromWayId);

		var mRelations = [];

		_(context.graph().parentRelations(fromWay)).each(function(relation) {

			var crossOrmaat = (relation.modelName === iD.data.DataType.C_NODECONN ||
				relation.modelName === iD.data.DataType.NODECONN);

			// if (false) {
			// 	console.log(crossOrmaat, (function zzzz(members) {


			// 		var objA = {
			// 			'from_road': '',
			// 			'node': '',
			// 			'to_road': ''
			// 		};
			// 		_(members).each(function(member) {
			// 			objA[member.role] = member.id;
			// 		});



			// 		var objB = {
			// 			'from_road': fromWayId,
			// 			'node': nodeId,
			// 			'to_road': toWayId
			// 		};

			// 		console.log(objA, objB);

			// 		return _.isEqual(objA, objB);
			// 	})(relation.members));
			// }

			if (crossOrmaat) {
				if (compareMember(relation.members)) {
					mRelations.push(relation);
				}
			}
		});

		if (mRelations.length > 1) {
			console.warn('More than one maat found!!', mRelations);
		}


		var maat = mRelations[0] || {};

		var isCross = false,
			maatType = null;

		if (maat.id) {

			maatType = maat.modelName;

		} else {

			maatType = context.graph().entity(nodeId).isRoadCross() ?
//				iD.data.Constant.CROSSMAAT : iD.data.Constant.NODEMAAT;
				iD.data.DataType.C_NODECONN : iD.data.DataType.NODECONN;

		}

		switch (maatType) {

//			case iD.data.Constant.CROSSMAAT:
			case iD.data.DataType.C_NODECONN:
				isCross = true;
				break;

//			case iD.data.Constant.NODEMAAT:
			case iD.data.DataType.NODECONN:
				break;

			default:
				console.warn('Unkown maat type', maatType);
		}

		return {
			maat: maat,
			maatType: maatType,
			isCross: isCross
		};
	};

	roadRuleEditor.getRelationInfo = function(opts) {

		opts = _.assign({}, opts);

		var maatInfo = roadRuleEditor.getMaatInfo();

		var targetType = maatInfo.isCross ? iD.data.DataType.C_TRAFFICRULE : iD.data.DataType.TRAFFICRULE;

		var roadRules = [],
			pareRels = context.graph().parentRelations(maatInfo.maat);

		_.each(pareRels, function(rel) {

			if (targetType === rel.modelName) {
				roadRules.push(rel);
			}

		});

		roadRules.sort(function(a, b) {
			return a.id - b.id;
		});

		var relationInfo = _.assign({}, maatInfo, {

			relations: roadRules
		});

		if (opts.withAnalyzed) {

			relationInfo.analyzedRelations = relationInfo.relations.map(analyzeSingleRelation);
		}

		return relationInfo;
	};

	return d3.rebind(roadRuleEditor, event, 'on');

};

iD.ui.RoadRule = {};