/**
 * 合标统计
 * @param {Object} context
 */
iD.ui.MarkupStatistics = function (context) {
	
    // var modelEntity, currentLayer;
    var entities = [], entityEditor = iD.ui.EntityEditor(context),
        domData = [], undoArray = [];
    let afterLength = 5, beforeLength = 5;
    let cacheCount = 3;
    let that = this;
    
    var markupForm = function () {
    	if(that.markupDialog){
//      	var $signPostAttr = d3.select('.signpost-attribute');
	        that.markupDialog.widget().style('display', 'block');
	        renderTable();
	        return;
	    }else{
		    that.markupDialog = iD.dialog(null, {
		        width: 'calc(100% - 90px)',
		        height: 400,
		        appendTo: '#id-container',
		        autoOpen: false,
		        resizable: true,
		        closeBtn: true,
		        onTask: true,
		        destroyOnClose: false
		    });
		    
            that.markupDialog.option('title', '质量标记报表');
            
            that.markupDialog.on('close', function(){
        		let $MarkupCtr = d3.select('.markupform-control');
        		$MarkupCtr.style('display', 'block');
            });
            that.markupDialog.on('open', function(){
        		let $markupDialog = d3.select('.ui-dialog.markupDialog');
        		$markupDialog.style({
        			'top': 'calc(100% - 400px)',
        			'left': '35px'
        		});
            });

            that.markupDialog.widget().classed('markupDialog', true);
	    }
	    
        var $button6 = $(".report-button #button6");//查看质量标记

        $button6.on('click', function () {
            let $dom = d3.select('#MarkupForm').select('.treeTable')
            if ($dom.node()) {
                let $markupform = d3.select('#MarkupForm');
                if ($markupform.style('display') == 'block') {
                    $markupform.style('display', 'none');
                } else {
                    $markupform.style('display', 'block');
                }
            } else {
                Dialog.alert('当前任务没有质检标记！')
            }
        })

        // console.log(tags)
        var $markupform = that.markupDialog.element.append('div').attr('id', 'MarkupForm')
            .style({
                position: 'absolute',
                padding: 0,
                left: '0px',
                top: '34px',
                bottom: '0px',
                'z-index': '310',
                height: 'calc(100% - 34px)',
                width: '100%',
                'background-color': '#fff',
                display: 'block'
            });

        //		列表(内容)
        let $markupFormTable = $markupform.append('div').attr('id', 'markupFormTable');

        $markupFormTable.append('table')
            .attr({
                id: 'table1',
                class: 'layui-table',
                'lay-filter': 'table1'
            })

        //操作列
        let $oprScript = d3.select('body').append('script').attr({
            type: 'text/html',
            id: 'oper-col'
        });

        $oprScript.append('i')
            .attr({
                // class: 'layui-icon layui-icon-ok2-circle',
                class: 'glyphicon glyphicon-ok-sign',
                'lay-event': 'check',
                title: '已修改',
                'data-status': '4'
            })
            .style({
                'cursor': 'pointer',
                'margin-right': '3px'
            });

        $oprScript.append('i')
            .attr({
                class: 'glyphicon glyphicon-remove-sign',
                // class: 'layui-icon layui-icon-remove-circle',
                'lay-event': 'cross',
                title: '误报',
                'data-status': '2'
            })
            .style({
                'cursor': 'pointer',
                'margin-right': '3px'
            });

        $oprScript.append('i')
            .attr({
                class: 'glyphicon glyphicon-circle-arrow-right',
                // class: 'layui-icon layui-icon-upload2',
                'lay-event': 'error',
                title: '搁置',
                'data-status': '3'
            })
            .style({
                'cursor': 'pointer',
                'margin-right': '3px'
            });

        //编辑完成操作
        execFormData();
        /*let $oprbtnsScript = d3.select('body').append('script').attr({
            type: 'text/html',
            id: 'oper-btn-col'
        });

        $oprbtnsScript.append('a')
            .attr({
                class: 'layui-btn layui-btn-primary layui-btn-xs',
                'lay-event': "show",
                title: '展开',
            })
            .html('展开');

        $oprbtnsScript.append('a')
            .attr({
                class: 'layui-btn layui-btn-danger layui-btn-xs',
                'lay-event': "hide",
                title: '折叠',
            })
            .html('折叠');*/
    }
    markupForm.reset = function(){
        entities = []; 
        let $markupFormTable = d3.select('#markupFormTable');
        $markupFormTable.html('无数据');
        appendForm(entities);
    }
    markupForm.showBtn = function () {
        context.connection().on('load.markup', function (err, result, url) {
            // debugger
            // entities = [];
            if (result.data && result.data.length) {
                result.data.forEach(function (entity) {
                    if (entity.modelName == iD.data.DataType.QUALITY_TAG) {
                        entities.push(entity);
                    }
                })
            }
        });
        context.connection().on('loaded.markup', function (err, result, url) {
            //TODO简单处理， 默认以数据加载完成是重新加载
            // let _baseTag = _.filter(context.graph().base().entities, d=>{ return d.modelName == iD.data.DataType.QUALITY_TAG});
            // let newTag = _.filter(context.graph().entities, d=>{ return d.modelName == iD.data.DataType.QUALITY_TAG});
            // let tags  = _baseTag.concat(newTag);
            // appendForm(tags);
            // entities = []; 
            // console.log('输出标记总数：', tags.length)
        	let $markupFormTable = d3.select('#markupFormTable');
         	if (entities.length) {
    			$markupFormTable.html('');
                console.log('输出标记总数：', entities.length)
                appendForm(entities);
                entities = []; 
            }
            //  else{
    		// 	$markupFormTable.html('无数据');
         	// }
            // $MarkupForm.style('display', 'block');
            // } else {        
            // debugger        
            /*if ($MarkupForm.style('display') == 'block') {
                $MarkupForm.style('display', 'none');
            } else {
                $MarkupForm.style('display', 'block');
            }*/
            // layui.modules = {}
            // }
        });
        // context.event.on('taskChage.markup', function(data, callback) {
        //     var $MarkupForm = d3.select('#MarkupForm');
        //     $MarkupForm.style('display', 'none');

        //     callback && callback();
        // })
        context.history()
            .on('undone.markup', function (difference) {
                var change = difference.modified();
                change.forEach(function (entity) {
                    if (entity && entity.modelName == iD.data.DataType.QUALITY_TAG) {
                        let $tableBody = d3.select('.markupDialog .tableBody');
                        let $trs = $tableBody.selectAll('p')[0];
                        for (let j = 0; j < $trs.length; j++) {
                            let $tr = d3.select($trs[j]);
                            let $td = $tr.selectAll('[data-content="' + entity.id + '"]');
                            if ($td[0].length) {
                                let parentId = _.filter(domData, { state: entity.id })[0].pid;
                                let parentData = _.filter(domData, { id: parentId })[0];
                                let progress = parentData.progress.split('/');
                                var num = _.clone(Number(progress[0]));
                                let index = _.indexOf(undoArray, entity.id);
                                if (entity.tags.STATE == '0' || entity.tags.STATE == '1') {
                                    if (index != -1) {
                                        undoArray.splice(index, 1);
                                    } else {
                                        undoArray.push(entity.id);
                                    }
                                    if (num - 1 >= 0) {
                                        num -= 1;
                                    }

                                }
                                var progress_res = num + '/' + progress[1];
                                let $parentDom = d3.select($tr.node().parentElement).select('[data-index="' + parentData.LAY_TABLE_INDEX + '"]');
                                var $progress = $parentDom.select('span.progress');
                                $progress.html(progress_res);
                                parentData.progress = progress_res;


                                if (num == 0) {
                                    let $p_td = $parentDom.select('span.state');
                                    let $p_all = $p_td.selectAll('i.glyphicon');
                                    $p_all.classed("active", false);
                                }
                            }
                        }
                    }
                });
            })
            .on('redone.markup', function (difference) {
                var changes = difference.changes();
                for (let i in changes) {
                    var entity = context.hasEntity(i);
                    var change = changes[i];
                    var oldEntity = change.base;
                    if (entity && entity.modelName == iD.data.DataType.QUALITY_TAG) {
                        let $tableBody = d3.select('.markupDialog .tableBody');
                        let $trs = $tableBody.selectAll('p')[0];
                        for (let j = 0; j < $trs.length; j++) {
                            let $tr = d3.select($trs[j]);
                            let $td = $tr.selectAll('[data-content="' + entity.id + '"]');
                            if ($td[0].length) {
                                let parentId = _.filter(domData, { state: entity.id })[0].pid;
                                let parentData = _.filter(domData, { id: parentId })[0];
                                let progress = parentData.progress.split('/');
                                var num = _.clone(Number(progress[0]));
                                if (oldEntity.tags.STATE == '0' || oldEntity.tags.STATE == '1') {
                                    if (num + 1 <= progress[1]) {
                                        num += 1;
                                    }
                                }
                                var progress_res = num + '/' + progress[1];
                                let $parentDom = d3.select($tr.node().parentElement).select('[data-index="' + parentData.LAY_TABLE_INDEX + '"]');
                                var $progress = $parentDom.select('.progress');
                                $progress.html(progress_res);
                                parentData.progress = progress_res;
                            }
                        }
                    }
                }
            })
            .on('change.markup', function (difference) {
                if (!difference) return;
                var change = difference.modified();
                change.forEach(function (_entity) {
                    if (_entity && _entity.modelName == iD.data.DataType.QUALITY_TAG) {
                        let $tableBody = d3.select('.markupDialog .tableBody');
                        let $trs = $tableBody.selectAll('p');
                        if($trs.length == 0) return false;
                        let _$tr = $trs[0];
                        for (let j = 0; j < _$tr.length; j++) {
                            let $tr = d3.select(_$tr[j]);
                            let $td = $tr.selectAll('[data-content="' + _entity.id + '"]');
                            if ($td[0].length) {
                                let layEvent = '';
                                if (_entity.tags.STATE == '4') {
                                    layEvent = 'check';
                                } else if (_entity.tags.STATE == '2') {
                                    layEvent = 'cross';
                                } else if (_entity.tags.STATE == '3') {
                                    layEvent = 'error';
                                }
                                var $all = $td.selectAll('.glyphicon');
                                $all.classed("active", false);
                                var $this = $tr.select('[lay-event="' + layEvent + '"]');
                                $this.classed('active', true);

                                // 渲染表格
                                // renderTable();
                                // let parentId = _.filter(domData, {state: entity.id})[0].pid;
                                // let parentData = _.filter(domData, {id: parentId })[0];
                                // let $parentDom = d3.select($tr.node().parentElement).select('[data-index="'+parentData.LAY_TABLE_INDEX+'"]');
                                // // let $spanDom = $parentDom.select('[data-field="errortype"]').select('span');
                                // // layui.treetable.toggleRows($($spanDom.node()), true);
                                // $('#table1').next('.treeTable').find('.layui-table-body tbody tr').each(function () {
                                //     var $ti = $(this).find('.treeTable-icon');
                                //     var tid = $ti.attr('lay-tid');
                                //     if (tid == parentData.id) {
                                //         layui.treetable.toggleRows($ti, true);
                                //     }

                                // });
                                //恢复核标进度
                                /*let parentId = _.filter(domData, {state: entity.id})[0].pid;
                                let parentData = _.filter(domData, {id: parentId })[0];
                                let progress = parentData.progress.split('/');
                                var num = _.clone(Number(progress[0]));
                                let index = _.indexOf(undoArray, entity.id);
                                let index_re = _.indexOf(redoArray, entity.id);
                                if (entity.tags.STATE == '0' || entity.tags.STATE == '1') {
                                    if (index != -1) {
                                        undoArray.splice(index, 1);
                                        return;
                                    }
                                    if (num - 1 >= 0){
                                        num -= 1;
                                        redoArray.splice(index_re, 1);
                                    }
                                    undoArray.push(entity.id);
                                } else {
                                    if (index_re != -1) {
                                        redoArray.splice(index_re, 1);
                                        return;
                                    }
                                    if (num + 1 <= progress[1]){
                                        num += 1;
                                        undoArray.splice(index, 1);
                                    }
                                    redoArray.push(entity.id)
                                }
                                    var progress_res = num + '/' + progress[1];
                                    let $parentDom = d3.select($tr.node().parentElement).select('[data-index="'+parentData.LAY_TABLE_INDEX+'"]');
                                    var $progress = $parentDom.select('[data-field="progress"]').select('div');
                                    $progress.html(progress_res);
                                    parentData.progress = progress_res;
                                    
    
                                    if (num == 0) {
                                        let $p_td = $parentDom.select('[data-field="state"]');
                                        let $p_all = $p_td.selectAll('.glyphicon');
                                        $p_all.classed("active", false);
                                    }*/
                            }
                        }
                    }
                })
            });
    }

    function appendForm(_entities) {

        domData = transforDatas(_entities);
        context.variable.localCheckTags = _.clone(_entities);

        var $MarkupForm = d3.select('#MarkupForm');
        var $MarkupCtr = d3.select('.markupform-control');
        if (domData.length == 0) {
        	that.markupDialog.close();
        	$MarkupCtr.style('display', 'block');
        } else {
        	that.markupDialog.open();
        	$MarkupCtr.style('display', 'none');
        }

		renderTable();
//      if (layui.treetable) {
//          renderTable();
//      } else {
//          layui.config({
//              base: '../../js/lib/layui/module/'
//          }).extend({
//              treetable: 'treetable-lay/treetable'
//          }).use(['layer', 'table', 'treetable'], function () {
//              var $ = layui.jquery;
//              // 渲染表格
//              renderTable();
//          });
//      }
    }

    function cacheImage(item) {
        let idx = item.LAY_TABLE_INDEX;
        if (!_.isNumber(idx)) return;
        let _tLen = idx + cacheCount;
        let domLength = domData.length;

        let len = _tLen > domLength ? domLength : _tLen;
        let marks = [];

        for (let i = idx; i < len; i++) {
            let _t = _.filter(domData, { 'LAY_TABLE_INDEX': i })[0];
            if (_t && _t.entityId) {
                marks.push(_t);
            }
        }

        for (let i = 0; i < marks.length; i++) {
            let entity = context.hasEntity(marks[i].entityId);
            if (entity) {
                let trackIds = entity.tags.TRACK_ID.split(',');
                let tracPointIds = entity.tags.TRACK_POINT_ID.split(',');
                if (trackIds[0]) {
                    let track = iD.svg.Pic.dataMgr.getTrack(trackIds[0]);
                    if (!track) continue;

                    let nodes = track.nodes;
                    let len = nodes.length - 1;
                    let idx = _.findIndex(track.nodes, { id: tracPointIds[0] });
                    let idx1 = idx - afterLength;
                    let idx2 = idx + beforeLength;
                    idx1 = idx1 < 0 ? 0 : idx1;
                    idx2 = idx2 > len ? len : idx2;
                    preloadImage(nodes, idx1, idx2 );
                }
            }
        }
    }

    function preloadImage(nodes, loadImageFirstIndex, loadImagelastIndex) {
        // var loadedimages = 0, iserr = false;
        // var loadedCount = 0;

        // var length = loadImagelastIndex - loadImageFirstIndex + 1;
        // function imageloadpost() {
        //     loadedimages++;
        //     if (loadedimages == length) {
        //         imgLoading = false;
        //         if (iserr) console.log('视频图片未加载全');
        //     }
        // }

        for (var i = loadImageFirstIndex; i <= loadImagelastIndex; i++) {
            var img = new Image();
            img.src = nodes[i].tags.picUrl;
            // if (img.complete) {  // 如果图片已经存在于浏览器缓存，直接调用回调函数
            //     loadedCount++;
            //     imageloadpost();
            //     continue; // 直接返回，不用再处理onload事件
            // }
            // img.onload = function () {
            //     loadedCount++;
            //     imageloadpost();
            // }
            // img.onerror = function () {
            //     iserr = true;
            //     loadedCount++;
            //     imageloadpost();
            // }
        }
    }

    function renderTable() {
        let $markupFormTable = d3.select('#markupFormTable'),
        	$operCol = d3.select('#oper-col').html(),
        	$tableObj = {
        		'state': '状态',
        		'errortype': '错误类别',
        		'checknum': '检查项编码',
        		'datatype': '数据类型',
        		'question': '问题描述',
        		'tagsource': '标记类型',
        		'progress': '核标进度',
        		'buttons': '操作'
        	};
    	
        let $tableHead = $markupFormTable.append('div')
            .attr({
                class: 'tableHead'
            });
		let $tableBody = $markupFormTable.append('div')
            .attr({
                class: 'tableBody'
            });
        let excelBtnType = domData.length ? 'block' : 'none';
        let excelBtn = $markupFormTable.append('a')
            .style({
                'display': excelBtnType
            })
			.html('导出')
	        .on('click', function() {
	            dataToExcel(domData);
	        });
        
        for(let name in $tableObj){
        	let nameCn = $tableObj[name];
	      	$tableHead.append('b')
	            .attr({
	                class: 'tableHeadTitle'
	            })
	            .html(nameCn);
        }
	    
	    //生成列表DOM元素
    	for(let i=0; i<domData.length; i++){
    		let pid = domData[i].pid,
    			id = domData[i].id,
    			entityId = domData[i].entityId || null,
    			state = domData[i].state,
    			trType = (pid < 0) ? 'trFather' : 'trChild',
    			$btn = (pid < 0) ? 'glyphicon glyphicon-chevron-down' : '',
    			childClass = (pid < 0) ? '' : ('trChild_'+pid),
    			trClass = trType + ' ' + childClass,
				entity = entityId ? context.hasEntity(entityId) : null,
				isCore = (entity && entity.tags.IS_CORE == '1') ? ' isCoreType' : '';
    		
			$tableBodyChild = $tableBody.append('p')
	            .attr({
	                'class': trClass,
	                'data-index': i,
	                'data-pid': pid,
	                'data-id': id
	            })
		        .on('click', function() {
		            let $this = d3.select(this);
		            updateClick($this);
		        });
	        for(let name in $tableObj){
	        	let value = domData[i][name] || '';
	    		if(name == 'state'){
		    		$tableBodyChild.append('span')
			            .attr({
			                'class': ('state' + isCore),
			                'data-content': state
			            })
			            .html($operCol);
	    		}else if(name != 'buttons'){
		    		$tableBodyChild.append('span')
			            .attr({
			                'title': value,
			                'class': name
			            })
			            .html(value)
				        .on('click', function() {
				            let $this = d3.select(this),
				            	$parentDom = d3.select(this.parentNode),
				        		clickType = $this.classed('errortype'),
				        		$clickType = $parentDom.classed('trFather');
				        	
				        	if(clickType && $clickType){
				        		openSubset($parentDom);
				        	}
				        });
	    		}
	        }
	        
	        //操作按钮--显示隐藏子结果
    		$tableBodyChild.append('span')
	            .attr({
	                'class': $btn
	            })
		        .on('click', function() {
		            let $this = d3.select(this),
		           		$parentDom = d3.select(this.parentNode),
		        		clickType = $this.classed('glyphicon');
		        	
		        	if(clickType){
		        		openSubset($parentDom);	
		        	}
		        });
    		
    		domData[i]['LAY_TABLE_INDEX'] = i;
    	}
		//历史结果效果显示
        let $trs = $tableBody.selectAll('p')[0];
        $trs.forEach(function (tr) {
            let $tr = d3.select(tr);
            let d_index = $tr.attr('data-index');
            let item = _.filter(domData, { 'LAY_TABLE_INDEX': Number(d_index) })[0];
            if (item.entityId) {
                let entity = context.hasEntity(item.entityId);
                var $btn = $tr.select('[data-status="' + entity.tags.STATE + '"]');
                $btn.classed("active", true);
            }
        });
        //点击状态
    	let iconDom = d3.selectAll('.tableBody p span .glyphicon');
        iconDom.on('click', function (obj) {
        	let $this = d3.select(this),
            	layEvent = $this.attr('lay-event'),
        		$tr = d3.select(this.parentNode.parentNode),
        		index = $tr.attr('data-index'),
        		data = domData[index] || null;

            var loading = iD.ui.Loading(iD.User.context)
                .message('正在更新标记点状态……')
                .blocking(true);

            iD.User.context.container()
                .call(loading);

            setTimeout(function () {
                updateState($tr, data.id, data.pid, $tr[0][0].parentElement, layEvent);
                loading && loading.close();
            }, 300);
        });
    	
    	
    	return
    	
    	
        var table = layui.table;
        var layer = layui.layer;
        var treetable = layui.treetable;
        layer.load(2);
        treetable.render({
            treeColIndex: 1,
            treeSpid: -1,
            treeIdName: 'id',
            treePidName: 'pid',
            treeDefaultClose: true,
            treeLinkage: false,
            elem: '#table1',
            data: domData,
            page: false,
            cols: [[
                //                  {type: 'numbers'},
                { templet: '#oper-col', field: 'state', title: '状态', width: 90 },
                { field: 'errortype', title: '错误类别', minWidth: 100 },
                { field: 'checknum', title: '检查项编码', minWidth: 100 },
                { field: 'datatype', title: '数据类型', minWidth: 100 },
                { field: 'question', title: '问题描述', minWidth: 100 },
                { field: 'tagsource', title: '标记类型', minWidth: 100 },
                { field: 'progress', title: '核标进度', minWidth: 100 },
                // {templet: '#oper-btn-col', title: '操作', width: 170}
            ]],
            done: function () {
                layer.closeAll('loading');
                let $tableBody = d3.select('.layui-table-body.layui-table-main');
                $tableBody.style({
                    position: 'relative',
                    'overflow-y': 'auto',
                    height: '600px'
                })
                let $trs = $tableBody.selectAll('tr')[0];
                $trs.forEach(function (tr) {
                    let $tr = d3.select(tr);
                    let d_index = $tr.attr('data-index');
                    let item = _.filter(domData, { 'LAY_TABLE_INDEX': Number(d_index) })[0];
                    // if (item.pid == -1) {
                    //     let progress = item.progress;
                    //     progress.split('/');
                    //     if (progressp[0] == progress[1]){

                    //     }
                    // }
                    if (item.entityId) {
                        let entity = context.hasEntity(item.entityId);
                        var $btn = $tr.select('[data-status="' + entity.tags.STATE + '"]');
                        // $btn.style('color','#78B343');
                        $btn.classed("active", true);
                    }
                    if ($tr.style('display') == 'none') {
                        $tr.on('click', function () {
                            let $this = d3.select(this);
                            let index = $this.attr('data-index');
                            let item = _.filter(domData, { 'LAY_TABLE_INDEX': Number(index) })[0];
                            if (item) {
                                let entityId = item.entityId;
                                let entity = context.hasEntity(entityId);
                                let tid = entity.tags.TRACK_ID.split(',');
                                let tpId = entity.tags.TRACK_POINT_ID.split(',');
                                context.map().lightEntity(entityId);
                                context.map().center(entity.loc);
                                cacheImage(item);
                                if (tid[0]) {//跳到对应视频帧
                                    let track = iD.svg.Pic.dataMgr.getTrack(tid[0]);
                                    let frameIndex = _.findIndex(track.nodes, { id: tpId[0] });
                                    iD.picUtil.player.switchPlayerTrackId(tid[0], function () {
                                        let progressRange = d3.select('.footer-progress-range');
                                        progressRange.value(parseInt(frameIndex)).trigger('change');
                                    })
                                    cacheImage(item);
                                }
                            }
                        })
                    } else {
                        $tr.style('background-color', '#FFFFC7');
                    }
                });
                // treetable.expandAll('#table1');//展开所有子项
            }
        });
        //点击状态
        table.on('tool(table1)', function (obj) {
            var data = obj.data;
            var layEvent = obj.event;
            var $tr = d3.select(obj.tr[0]);

            var loading = iD.ui.Loading(iD.User.context)
                .message('正在更新标记点状态……')
                .blocking(true);

            iD.User.context.container()
                .call(loading);

            setTimeout(function () {
                updateState($tr, data.id, data.pid, obj.tr[0].parentElement, layEvent);
                loading && loading.close();
                var $all = $tr.selectAll('.glyphicon');
                //$all.style('color','');
                $all.classed("active", false);
                var $this = $tr.select('[lay-event="' + layEvent + '"]');
                // $this.style('color','#78B343');
                $this.classed('active', true);
            }, 300);




            //修改核标进度

            // if (layEvent === 'check') {
            //     layer.msg('已修改' + data.id);
            // } else if (layEvent === 'cross') {
            //     layer.msg('搁置' + data.id);
            // } else if (layEvent === 'error') {
            //     layer.msg('误报' + data.id);
            // }
        });
    };
	
	//子集展开
	function openSubset(parentDom){
		
		let $id = parentDom.attr('data-id'),
			$glyicon = parentDom.select('span.glyphicon'),
    		$child = 'trChild_'+$id,
    		$childs = d3.selectAll('.'+$child),
    		$display = $childs.style('display'),
    		$newDisplay = ($display == 'none') ? 'block' : 'none',
    		$newClass = ($display == 'none') ? 'glyphicon glyphicon-chevron-up' : 'glyphicon glyphicon-chevron-down';
    	$childs.style('display', $newDisplay);
    	$glyicon.attr('class', $newClass);
		
	}
	
	function updateClick($p){
        let $id = $p.attr('data-id'),
        	$type = $p.classed('trFather'),
        	$selected = d3.selectAll('p.trChild.selected'),
            index = $p.attr('data-index');
        if($type){
        	return;
        }
        let item = domData[index] || null;
        if (item) {
        	$selected.classed('selected', false);
        	$p.classed('selected', true);
        	
            let entityId = item.entityId;
            let entity = context.hasEntity(entityId);
            let tid = entity.tags.TRACK_ID.split(',');
            let tpId = entity.tags.TRACK_POINT_ID.split(',');
            context.map().lightEntity(entityId);
            context.map().center(entity.loc);
            cacheImage(item);
            if (tid[0]) {//跳到对应视频帧
                let track = iD.svg.Pic.dataMgr.getTrack(tid[0]);
                let frameIndex = _.findIndex(track.nodes, { id: tpId[0] });
                iD.picUtil.player.switchPlayerTrackId(tid[0], function () {
                    let progressRange = d3.select('.footer-progress-range');
                    progressRange.value(parseInt(frameIndex)).trigger('change');
                })
                cacheImage(item);
            }
        }
	}

    function updateState($tr, id, pid, parentElement, layEvent) {
        let $parentElement = d3.select(parentElement);
        var pidArr = [];
		var actions = [];
		var isCore = '0';
        if (pid == -1) {
            pidArr = _.filter(domData, { 'pid': Number(id) });//获取当前父类下所有子类
            //var progress_res = progress + '/' + progress;
        } else {
            pidArr = _.filter(domData, { 'pid': Number(pid) });//获取当前父类下所有子类
			let entity = pidArr[0] ? context.hasEntity(pidArr[0].entityId) : null;
			isCore = (layEvent != 'check' && entity) ? entity.tags.IS_CORE : '0';
			
			if(isCore != '1'){
				var parentData = _.filter(domData, function (d) {
					return d.id == pid;
				})[0];

				var progress = parentData.progress.split('/');
				let num = _.clone(Number(progress[0]));
				if (num + 1 <= progress[1]) {
					num += 1;
				}
				var progress_res = num + '/' + progress[1];
				let $parentDom = $parentElement.select('[data-index="' + parentData.LAY_TABLE_INDEX + '"]');//查找索引数据，并修改
				/*if (num == Number(progress[1])){
					var $this = $parentDom.select('[lay-event="'+layEvent+'"]');
					$this.style('color','#78B343');
				} else*/ if (progress[0] != progress[1]) {
					let $stateBtns = $parentDom.select('span.state');
					let $all = $stateBtns.selectAll('.glyphicon');
					$all.style('color', '');
				}

				//如果子类已经选择过state，则不再赋值进度
				if (!_.filter($tr.selectAll('.glyphicon')[0], function (d) { return (d3.select(d).style('color') != "rgb(51, 51, 51)" && d3.select(d).style('color') != "rgba(51, 51, 51, 0.5)" ) }).length) {
					var $progress = $parentDom.select('span.progress');
					$progress.html(progress_res);
					$progress.attr('title', progress_res);
					parentData.progress = progress_res;
				}
			}
        }
        // var entities = [];
        pidArr.forEach(function (d) {
            if (d.id != id && pid != -1) return;

            let entity = context.hasEntity(d.entityId);
            if (entity && (entity.tags.STATE != '0' /*&& entity.tags.STATE != '1'*/) && pid == -1) {
                return;
            }else if(layEvent != 'check' && entity.tags.IS_CORE == '1'){
				isCore = '1';
				return;
			}
            // entities.push(entity);
            // $all.style('color','');
            /*$all.classed("active", false);
            var $this = $c_tr.select('[lay-event="'+layEvent+'"]');
            // $this.style('color','#78B343');
            $this.classed("active", true);
            
            
            let state = '0';
            if (layEvent == 'check') {
                state = '4';
            } else if (layEvent == 'cross') {
                state = '2';
            } else if (layEvent == 'error') {
                state = '3';
            }
            let tag = {
                STATE: state
            }
            entityEditor.entityID(item.entityId).changeTags(tag);
            if(pid == -1) {
                var $progress = $tr.select('[data-field="progress"]').select('div');
                $progress.html(progress_res);
            }*/
            // })
            // if (entities.length != pidArr.length && pid == -1) {
            //     return;
            // }
            // pidArr.forEach(function(d) {

            if (d.id != id && pid != -1) return;
            let index = d.LAY_TABLE_INDEX;
            let $c_tr = $parentElement.select('[data-index="' + index + '"]');//查找索引数据，并修改
            var $all = $c_tr.selectAll('.glyphicon');
            let item = _.filter(domData, { 'LAY_TABLE_INDEX': Number(index) })[0];
            $all.classed("active", false);
            var $this = $c_tr.select('[lay-event="' + layEvent + '"]');
            // $this.style('color','#78B343');
            $this.classed("active", true);

            let state = '0';
            if (layEvent == 'check') {
                state = '4';
            } else if (layEvent == 'cross') {
                state = '2';
            } else if (layEvent == 'error') {
                state = '3';
            }
            let tag = {
                STATE: state
            }
			
			actions.push(iD.actions.ChangeTags(item.entityId, tag));
			
            // entityEditor.entityID(item.entityId).changeTags(tag);
			
			
            if (pid == -1) {
                var parentData = _.filter(domData, function (d) {
                    return d.pid == pid && d.id == id;
                })[0];
                var progress = parentData.progress.split('/');

                var num = _.clone(Number(progress[0]));
                if (num + 1 <= progress[1]) {
                    num += 1;
                }

                var progress_res = num + '/' + progress[1];
                var $progress = $tr.select('.progress');
                $progress.html(progress_res);
				$progress.attr('title', progress_res);
                parentData.progress = progress_res;
            }
        })
		
		if(actions.length){
			actions.push('a');
			actions.length && context.perform.apply(context, actions);
		}
		
		if(isCore != '1'){
			var $alls = $tr.selectAll('.glyphicon');
			//$alls.style('color','');
			$alls.classed("active", false);
			var _$this = $tr.select('[lay-event="' + layEvent + '"]');
			// $this.style('color','#78B343');
			_$this.classed('active', true);
		}else{
			console.log('存在IS_CORE参数为1的数据，误报/搁置操作不生效！')
		}
    }

    function transforDatas(_entities) {
        var result = [];
        let currentLayer = context.layers().getLayersByModelName(iD.data.DataType.QUALITY_TAG)[0];
        if (!currentLayer) return [];
        let modelEntity = currentLayer.modelEntity()[iD.data.DataType.QUALITY_TAG];
        let errorType = _.filter(modelEntity._fieldArray, { 'fieldName': 'ERROR_TYPE' })[0];
        let types = errorType.fieldType.fieldTypeValues;
        let tagSource = _.filter(modelEntity._fieldArray, { 'fieldName': 'TAG_SOURCE' })[0];
        let source = tagSource.fieldType.fieldTypeValues;
        let newDatas = {};
        // let aa = 0;
        _entities.forEach(function (entity) {
            let ERROR_TYPE = entity.tags.ERROR_TYPE;
            let FEATURE = entity.tags.FEATURE;
            let CHECK_ITEM_ID = entity.tags.CHECK_ITEM_ID;
            let type = _.filter(types, { 'value': ERROR_TYPE })[0];
			let type_name = (type && type.name) ? type.name : '';
            // if (type) {
                // if (aa == 0 || aa == 5) {
                //     CHECK_ITEM_ID = '';
                // }
                // aa++;
                var obj = {
                    "id": '',
                    "state": "xx",
                    "errortype": type_name,
                    'checknum': '',
                    'datatype': '',
                    'question': '',
                    'tagsource': '',
                    'progress': '',
                    "pid": -1
                }
                //如果标记点都为“已修改”、“误报”、“搁置”，则可进入检查服务
                if (context.variable.checkUselessFlag && (entity.tags.STATE == '0' || entity.tags.STATE == '1')) {
                    console.log('标记点存在未修改！')
                    context.variable.checkUselessFlag = false;//判断是否进入下个工作流环节
                }
                //数据分类
                if (ERROR_TYPE == '0') {
                    // if (CHECK_ITEM_ID && FEATURE) {
                        if (!newDatas[CHECK_ITEM_ID + '-' + FEATURE]) {
                            newDatas[CHECK_ITEM_ID + '-' + FEATURE] = obj;
                            newDatas[CHECK_ITEM_ID + '-' + FEATURE].datatype = FEATURE;
                            newDatas[CHECK_ITEM_ID + '-' + FEATURE].datas = [];
                        }
                        // if (newDatas[CHECK_ITEM_ID+'-'+FEATURE].datas.length < 3) {
                        // if (entity.tags.STATE != '4') {
                        newDatas[CHECK_ITEM_ID + '-' + FEATURE].datas.push(entity);
                        // }
                        // }
                    // }
                } else {
                    // if (ERROR_TYPE && FEATURE) {
                        if (!newDatas[ERROR_TYPE + '-' + FEATURE]) {
                            newDatas[ERROR_TYPE + '-' + FEATURE] = obj;
                            newDatas[ERROR_TYPE + '-' + FEATURE].datatype = FEATURE;
                            newDatas[ERROR_TYPE + '-' + FEATURE].datas = [];
                        }
                        // if (entity.tags.STATE != '4') {
                        newDatas[ERROR_TYPE + '-' + FEATURE].datas.push(entity);
                        // }
                    // }
                }
                /*if (CHECK_ITEM_ID && FEATURE) {
                    if (!newDatas[CHECK_ITEM_ID+'-'+FEATURE]) {
                        newDatas[CHECK_ITEM_ID+'-'+FEATURE] = obj;
                        newDatas[CHECK_ITEM_ID+'-'+FEATURE].datatype = FEATURE;
                        newDatas[CHECK_ITEM_ID+'-'+FEATURE].datas = [];
                    }
                    // if (newDatas[CHECK_ITEM_ID+'-'+FEATURE].datas.length < 3) {
                    // if (entity.tags.STATE != '4') {
                        newDatas[CHECK_ITEM_ID+'-'+FEATURE].datas.push(entity);
                    // }
                    // }
                } else if (ERROR_TYPE && FEATURE) {
                    if (!newDatas[ERROR_TYPE+'-'+FEATURE]) {
                        newDatas[ERROR_TYPE+'-'+FEATURE] = obj;
                        newDatas[ERROR_TYPE+'-'+FEATURE].datatype = FEATURE;
                        newDatas[ERROR_TYPE+'-'+FEATURE].datas = [];
                    }
                    // if (entity.tags.STATE != '4') {
                        newDatas[ERROR_TYPE+'-'+FEATURE].datas.push(entity);
                    // }
                } else if (ERROR_TYPE) {
                    if (!newDatas[ERROR_TYPE]) {
                        newDatas[ERROR_TYPE] = obj;
                        newDatas[ERROR_TYPE].datatype = '';
                        newDatas[ERROR_TYPE].datas = [];
                    }
                    // if (entity.tags.STATE != '4') {
                        newDatas[ERROR_TYPE].datas.push(entity);
                    // }
                }*/
            // }
        });
        // if (checkUselessFlag) {
        //     context.variable.checkUselessFlag = checkUselessFlag;//判断是否进入下个工作流环节
        // }
        // console.log('newDatas:', newDatas);
        var num = 1;
        for (let i in newDatas) {
            let item = newDatas[i];
            item.id = num;
            let data = _.clone(item.datas);
            delete item.datas;
            var subResult = [], progress = 0;
            data.forEach(function (d) {
                // if (d.tags.STATE == 4/* && iD.User.isWorkRole()*/) return;
                num++;
                // d.tags.TAG_SOURCE = d.tags.TAG_SOURCE ? d.tags.TAG_SOURCE : '1';
                let tagSource = _.filter(source, { 'value': d.tags.TAG_SOURCE })[0] || {};
                let tagSourceName = tagSource.name;
                if (tagSource.value == '4' || tagSource.value == '5' || tagSource.value == '6' || tagSource.value == '7') {
                    tagSourceName = '作业标';
                }
                let subObj = {
                    "id": num,
                    "state": d.id,
                    "errortype": '',
                    'checknum': d.tags.CHECK_ITEM_ID || '',
                    'datatype': item.datatype,
                    'question': d.tags.DESC,
                    'tagsource': tagSourceName || '',
                    'progress': '',
                    "pid": item.id,
                    "entityId": d.id
                }
                if (d.tags.STATE == '0' || d.tags.STATE == '1') {
                    subResult.unshift(subObj);
                } else {
                    progress += 1;
                    subResult.push(subObj);
                }
            })
            item.progress = progress + '/' + data.length;
            if (data.length) {
                result.push(item);
                result = result.concat(subResult);
            }
            num++;
        }
        return result;
    }

    // 检查本地标记点是否都是搁置、误报、已修改状态
    // return true:  本地所有数据都已修改，可请求服务
    //        false: 本地数据还未修改完成，给提示继续操作，不请求服务
    function checkUseless() {
        if (context.variable.localCheckTags.length) {
            var culArr = [];
            for (var i = 0; i < context.variable.localCheckTags.length; i++) {
                var checkTag = context.variable.localCheckTags[i];
                var ct = context.hasEntity(checkTag.id);
                //              console.log("checkData:"+checkData.status+"===="+i)
                if (ct) {
                    if (ct.tags.STATE != 2 && ct.tags.STATE != 3 && ct.tags.STATE != 4) {
                        culArr.push(ct);
                    }
                }
            }
            if (culArr.length) {
                context.variable.checkUselessFlag = false;
                return;
            }
        }
        context.variable.checkUselessFlag = true;
    }

    function execFormData() {
        var $button2 = $(".report-button #button2");
        var $button3 = $(".report-button #button3");
        $button2.click(function (data) {

            context.buriedStatistics().save();

            //线性作业、作业员检查任务逻辑
            if (iD.User.isLineWorkRole() || iD.User.isWorkRole()) {
                checkUseless();
                if (!context.variable.checkUselessFlag) {
                    Dialog.alert('存在未修改的检查项');
                    return;
                }
                Dialog.confirm(`
                        <span style='color:red;font-size: 16px;font-weight: bold;'>请确认是否所有数据已编辑完成并提交检查进入下一环节。</span>
                    `, function () {
                    // if (context.variable.checkUselessFlag) {
                    //     processPassStatus(true, function(){
                    //        goNextTask();
                    //     });
                    // } else {
                    autoCheckStatus(function (isPass) {// 0：正在启动， 1：无需启动检查服务
                        if (isPass == '0') {
                            goNextTask();
                        } else if (isPass == '1') {
                            processPassStatus(true, function () {
                                goNextTask();
                            });
                        }
                    });
                    // }
                });

            } //线性质检、质检、验收员检查任务逻辑
            else if (iD.User.isLineCheckRole() || iD.User.isEditCheckRole() || iD.User.isVerifyRole()) {
                Dialog.confirm(`
                    <span>是否通过</span>
                    <select id="_report_editcheck_select" value="true" style="padding: 3px 5px;">
                        <option value="true">是</option>
                        <option value="false">否</option>
                    </select>
                `, function () {
                    processPassStatus(d3.select('#_report_editcheck_select').value(), function () {
                        // reloadCurrentPage();
                        goNextTask();
                    });
                });
            }
            //精度质检用户检查任务逻辑
            else if (iD.User.isPrecisionRole()) {
                // 精度质检员，质检完成后直接通过，没有是否选项，不传参；
                processPassStatus(true, function () {
                    // reloadCurrentPage();
                    goNextTask();
                }, {
                    emptyParam: true
                });
            }
            //审核员处理检查任务逻辑
            else if (iD.User.isAuditRole()) {
                Dialog.confirm(`
                    <span>是否通过</span>
                    <select id="_report_audit_select" value="true" style="padding: 3px 5px;">
                        <option value="true">是</option>
                        <option value="false">否</option>
                    </select>
                    <div id="_report_audit_select_keysource_div" style="display: none;">
                        <span>修改数据来源</span>
                        <select id="_report_audit_select_keysource" value="true" style="padding: 3px 5px;">
                            <option value="branch">branch</option>
                            <option value="task">task</option>
                        </select>
                    </div>
                `, function () {
                    var flagSelect = d3.select('#_report_audit_select');
                    var flag = flagSelect.value() == 'true';
                    var param = {};
                    // 不通过时选择数据来源
                    // branch-母库旧数据
                    // task-组网新数据
                    if (!flag) {
                        param.keySource = d3.select('#_report_audit_select_keysource').value();
                    }
                    processPassStatus(flagSelect.value(), function () {
                        // reloadCurrentPage();
                        goNextTask();
                    }, {
                        param: param
                    });
                });
                var flagSelect = d3.select('#_report_audit_select');
                var sourceSelect = d3.select('#_report_audit_select_keysource_div');
                if (flagSelect.size()) {
                    flagSelect.on('change', function () {
                        let flag = this.value == 'true';
                        if (!flag) {
                            sourceSelect.style('display', 'block');
                        } else {
                            sourceSelect.style('display', 'none');
                        }
                    });
                }
            }
        });

        $button3.click(function () {
            var $MarkupForm = d3.select('.markupDialog');
            var $MarkupCtr = d3.select('.markupform-control');
            var display = $MarkupForm.style('display');
            if (display == 'block') {
        		that.markupDialog.close();
                $MarkupCtr.style('display', 'block');
            } else {
        		that.markupDialog.open();
                $MarkupCtr.style('display', 'none');
            }
        })
    }

    //执行自动检查服务
    function autoCheckStatus(callback) {
        // var posParam = iD.Task.getPosParam();
        let taskObj = iD.Task.d;
        // let _checkData = {
        //     "projectId": taskObj.tags.projectId
        // };
        var loading = iD.ui.Loading(iD.User.context)
            .message('正在调用检查服务，请稍等……')
            .blocking(true);
        iD.User.context.container()
            .call(loading);
        iD.UserBehavior.logger({
            tag: 'check_start'
        });
        var bodyParam = {
            "activityId": iD.Task.d.protoData.taskDefinitionKey,          //工作流ID (tag中的currentActivity的值）环节名称
            "taskId": iD.Task.d.tags.taskId
        }
        // var url = iD.config.URL.kcs_edit + 'check/async/tasks/'+taskObj.task_id + "?callback={callback}&" + iD.util.parseParam2String(_checkData)
        // var url = iD.config.URL.kcs_schedule + 'dispatch/check?taskId='+taskObj.task_id;
        d3.json(iD.config.URL.kts + 'dispatch/job/start')
            .header("Content-Type", "application/json;charset=UTF-8")
            .post(JSON.stringify(bodyParam), function (error, data) {
                loading && loading.close();
                if (data.code != '0') {
                    Dialog.alert('启动检查服务失败！' + data.message);
                    return;
                }

                callback && callback(data.result);
            });
    }

    /**
	 * 设置当前任务是否通过当前流程
	 * @param {Boolean} isPass
	 * @param {Function} callback
	 * @param {Object} opts
	 */
    function processPassStatus(isPass, callback, opts = {}) {
        // if(iD.Task.d.tags.checkStatus == '100'){
        //     let flag = window.confirm('当前流程中无检查场景，未经过自动检查，是否继续？');
        //     if(!flag) return ;
        // }
        let history = context.history();
        if (history.hasChanges()) {
            // 是否清空
            if (window.confirm('当前修改并未保存，取消后手动保存！')) {
                context.enter(iD.modes.Browse(context));
                context.flush();
            } else {
                // 手动保存
                return;
            }
        }
        if (isPass == null) {
            return;
        }
        // 是否通过
        let _checkData = {
            "taskId": "" + iD.Task.d.protoData.id,
            "properties": [{
                "id": "passFlag",
                "value": isPass + ""
            }]
        };
        _checkData.properties.push(..._.compact(_.map(opts.param || {}, function (v, k) {
            if (v == null) return;
            return { id: k, value: v };
        })));
        if (opts.emptyParam) {
            // 精度质检员特殊处理；
            _checkData.properties = [];
        }
        iD.UserBehavior.logger({
            tag: 'task_submit_start'
        });
        $.ajax({
            type: "post",
            url: iD.config.URL.kts + 'form/form-data',
            async: false,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(_checkData),
            complete: function (xhr, status) {
                iD.UserBehavior.logger({
                    tag: 'task_submit_end',
                    'status': '0',
                });
                callback && callback(xhr, status);
            }
        });
    }

    function goNextTask() {
        var taskid = iD.Task.d.task_id;
        var idx = iD.Task.tasks.indexOf(iD.Task.d);
        // clearView();
        iD.Task.get(function (tasks) {
            if (tasks[idx] && tasks[idx].task_id == taskid) {
                idx++;
            }
            var list = tasks.slice(idx);
            if (list.length == 0) {
                list = tasks;
                if (idx == list.length - 1) {
                    list.pop();
                }
            }
            var nextTask = getEnterTask(list);
            if (nextTask) {
                context.ui().taskList.enter(nextTask.task_id);
            } else {
                // 没有下个检查完成/未检查的任务，刷新页面
                reloadCurrentPage();
            }
        });
    }

    function getEnterTask(tasks) {
        for (var i = 0; i < tasks.length; i++) {
            var task = tasks[i];
            // 作业员，筛选下一个可作业任务
            if (iD.User.isWorkRole()) {
                if (/*(task.tags.checkStatus == "2" 
                    || task.tags.checkStatus == "100" 
                    || !task.tags.checkStatus) 
                    && */task.task_id != iD.Task.d.task_id) {
                    return task;
                }
            } else {
                // 质检、验收、审核员，直接跳转到下一个任务
                return task;
            }
        }
    }

    function clearView() {
        d3.select('#EffectForm').style('display', 'none');
        d3.select('#ReportForm').style('display', 'none');
        context.surface().select('.layer.layer-transaction').html('');

        if (iD.picUtil.player) {
            iD.picUtil.player.destory();
            iD.picUtil.player.dataMgr.pic.clearDatas();
        }
        editor.removeALLDataLayer();
    }

    function reloadCurrentPage(taskId) {
        var url = window.location.href;
        var param = "";
        if (taskId) {
            param = "&taskID=" + taskId;
        }
        if (iD.url.getUrlParam("taskID")) {
            url = url.replace(/&taskID=(\d+)?&?/, '');
        }
        window.location.href = url.split('#')[0] + param;
    }
	
	function dataToExcel(data){
	    let taskId = iD.Task.d.tags.taskId;
	    let tag_sources = ['', '质检员', '验收员', '质量评估员', '基于资料的打标服务', '基于车道模型的打标服务', '逻辑检查项服务', '后自动化服务', '融合前单轨迹核线检查', '融合后单轨迹核线检查', '多轨迹核线检查', '静态激光点云真值评估'];
      	let str1 = '<tr style="background-color:#f2f2f2;"><td>任务ID</td><td>状态</td><td>错误类别</td><td>检查项编码</td><td>数据类型</td><td>问题描述</td><td>内容</td><td>标记类型</td><td>核标进度</td><td>标记来源</td><td>是否误报</td><td>坐标</td></tr>';
	    for(let s = 0 ; s < data.length ; s++ ){
	    	let entityId = data[s].entityId || null,
				entity = entityId ? context.hasEntity(entityId) : {},
				tag_source = entity.tags ? entity.tags.TAG_SOURCE : '0',
				tag_source_cn = tag_sources[tag_source] || '',
				locs = entity.loc || [],
				locsStr = locs.join(','),
				status = d3.select('#markupFormTable .tableBody p[data-index="'+s+'"] span.state i.active'),
	    		state = status[0][0] ? status.attr('title') : '';
	    	
	    	if(data[s].pid < 0){
	    		str1 += '<tr style="background-color:rgb(255, 255, 199);">';
	    	}else{
	    		str1 += '<tr>';
	    	}
        	
	    	str1 += `<td>${ taskId + '\t'}</td>`;
	    	str1 += `<td>${ state + '\t'}</td>`;
	    	str1 += `<td>${ data[s].errortype + '\t'}</td>`;
	    	str1 += `<td>${ data[s].checknum + '\t'}</td>`;
	    	str1 += `<td>${ data[s].datatype + '\t'}</td>`;
	    	str1 += `<td>${ data[s].question + '\t'}</td>`;
	    	str1 += `<td>${ data[s].checknum + data[s].question + '\t'}</td>`;
	    	str1 += `<td>${ data[s].tagsource + '\t'}</td>`;
	    	str1 += `<td STYLE='MSO-NUMBER-FORMAT:\\@'>${ data[s].progress + '\t'}</td>`;
	    	str1 += `<td>${ tag_source_cn + '\t'}</td>`;
	    	str1 += `<td>\t</td>`;
	    	str1 += `<td>${ locsStr + '\t'}</td>`;
	    	
        	str1 += '</tr>';
	    }
      	//Worksheet名
      	let worksheet = 'Sheet1';
      	let _uri = 'data:application/vnd.ms-excel;base64,';
 
      	//下载的表格模板数据
      	let template = `<html xmlns:o="urn:schemas-microsoft-com:office:office" 
      	xmlns:x="urn:schemas-microsoft-com:office:excel" 
      	xmlns="http://www.w3.org/TR/REC-html40">
      	<head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
        	<x:Name>${worksheet}</x:Name>
        	<x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
        	</x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
        	</head><body><table>${str1}</table></body></html>`;
        
      	//下载模板
        let base64 = window.btoa(unescape(encodeURIComponent(template)));
      	let name = taskId + '质量标记报表';
        
	    var a = document.createElement("a");
	    a.download = taskId + ' -- 质量标记报表.xls';
	    a.href = _uri + base64;
	    document.body.appendChild(a);
	    a.click();
	    document.body.removeChild(a);
	}
	
    return markupForm;
};