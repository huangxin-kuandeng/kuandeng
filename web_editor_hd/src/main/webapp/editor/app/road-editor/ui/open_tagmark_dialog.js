(function(){

var singleDialog = null;
// 缓存每个任务相应的任务参数
var TASK_INFO_MAP = {};
var _DELIMITER = '||';

iD.ui.openTagmarkDialog = function(context, entityid, opts){
	if(singleDialog && !singleDialog.closed){
        destoryDialog(singleDialog);
	}
	singleDialog = null;
	opts = opts || {};
	let loadXhr;
	
	var entityList = opts.entityList || [];
	var entity = context.entity(entityid);
	var entityEditor = iD.ui.EntityEditor(context),
   		rawTagEditor = iD.ui.RawTagEditor(context),
   		tagModelName = iD.data.DataType.AUTO_NETWORK_TAG
        entityTags = _.clone(entity.tags);
   	
	var dialog = Dialog.open({
		Title: opts.title || '组网标记详情',
		InnerHtml: '<div id="tagmark_dialog_html" class="tagmark_dialog_html"></div>',
		Width: 500,
		Height: 580,
		Modal: false,
		CancelEvent: function(){
			loadXhr && loadXhr.abort();
			loadXhr = null;
			
			rawTagEditor.on('change.tagmark_dialog', null);
			context.event.on('saveend.tagmark_dialog', null);
            context.connection().on('loaded.tagmark_dialog', null);
            iD.User.on('dvr.tagmark_dialog', null);

			clip && clip.destroy();
			clip = null;
			
			dialog.close();
		}
	});
	singleDialog = dialog;
	
	// doms
	var $selection = d3.select('#tagmark_dialog_html');
	var $dialogTitle = d3.select('#_DialogDiv_' + dialog.ID).select('#_Title_' + dialog.ID);
	var $dialogContainer = d3.select('#_DialogDiv_' + dialog.ID).select('#_Container_' + dialog.ID);
	var $loadMask = d3.select($dialogContainer.node().parentNode).append('div').attr('class', 'loading-mask hide');
	$loadMask.append('div').attr('class', 'info').text('任务信息加载中 ...');
	
	$dialogContainer.style({
	    'overflow-y': 'auto',
	    'padding': '0px 13px'
	});
	
	// raw field
	var $fieldWrapper = $selection
		.append('div')
		.attr('class', 'tagmark_fields_wrapper');
	var $tagEditorWrapper = $fieldWrapper
		.append('div')
        .attr('class', 'KDSEditor-inspector-border raw-taglist-editor KDSEditor-inspector-inner');
    refreshTagEditor();
    if(!opts.title) {
        refreshTitle();
    }
    
	rawTagEditor.on('change.tagmark_dialog', function(tags){
		var toChange = true;
		if(tags.LINK && tags.LINK != entityTags.LINK){
			toChange = false;
			changeFieldLINK(tags);
        }else if(tags.LINK == ''){
            tags.BUSSINFO = '';
        }
		
		if(tags.TYPE && tags.TYPE != entityTags.TYPE){
			// update Title
            refreshTitle();
		}
		
		toChange && execChangeTags(tags);
	});
	
	function changeFieldLINK(tags){
		var taskid = entityTags.TASKID;
		$loadMask.classed('hide', false);
		// 根据问题模块，加载任务信息
		loadXhr && loadXhr.abort();
		/*
		if(!TASK_INFO_MAP[taskid]){
			return ;
		}
		*/
		loadXhr = iD.util.loadNetworkTagBussinfo(taskid, entity.loc, function(result){
			if(result.length){
				TASK_INFO_MAP[taskid] = result;
			}
			execChangeTags(Object.assign({}, tags, {
				BUSSINFO: parseFieldBUSSINFO(tags.LINK)
			}));
			refreshTagEditor();
			$loadMask.classed('hide', true);
		});
	}
	
	function parseFieldBUSSINFO(link){
		if(!link) return '';
		var result = TASK_INFO_MAP[entityTags.TASKID];
		if(!result) return '';
		var infos = _.compact(_.map(result, function(d){
			if(d.id == link){
				return d.params;
			}
		}));
		
		return infos.join(_DELIMITER);
	}
	
    function refreshTitle(){
        var $select = $fieldWrapper.select('li[data-fld=TYPE] select.value');
        if($select.size()){
            var o = $select.node().selectedOptions[0] || {};
            dialog.Title = iD.Entity.id.toOSM(entityid) + ' ' + (o.text || '');
            $dialogTitle.text(dialog.Title);
        }
    }
    
	function execChangeTags(tags){
		entityEditor.entityID(entityid).changeTags(tags);
		Object.assign(entityTags,  tags);
		$copy.property('disabled', function(){
    		return !entityTags || !entityTags.BUSSINFO;
    	})
	}
	
	function refreshTagEditor(){
		$tagEditorWrapper.selectAll('*').remove();
		$tagEditorWrapper
			.call(rawTagEditor
//      	.modelName(tagModelName)
//      	.clearHtml(true)
        	.entityID(entityid)
        	.tags(entityTags)
        	.state('select'));
	}
	
    // buttons
    var $buttons = $selection
    	.append('div')
    	.attr('class', 'tagmark_dialog_buttons filter-buttons');
    
    var $copy = $buttons
    	.append('button')
    	.attr('type', 'button')
    	.attr('class', 'btn btn-default')
    	.property('disabled', function(){
    		return !entityTags || !entityTags.BUSSINFO;
    	})
    	.text('复制任务参数');
	
	var clip = new ClipboardJS($copy.node(), {
		text: function(trigger){
//			var text = $fieldWrapper.select('li[data-fld=CREATETIME] .value').value();
			var text = context.entity(entityid).tags.BUSSINFO || '';
			if(text){
				var delimiter = _DELIMITER.replace(/([\|\\])/g, '\\$1');
				text = text.replace(new RegExp(delimiter, 'g'), '\n');
			}
			return text;
		}
	});
	
	// 新增数据保存后没有最新id，直接关闭；
	if(parseInt(iD.Entity.id.toOSM('nAUTO_NETWORK_TAG_-2')) < 0){
		context.event.on('saveend.tagmark_dialog', function(){
            destoryDialog(dialog);
		});
	}
	/*
	context.connection().on('loaded.tagmark_dialog', function(layer){
		if(dialog.closed || !context.hasEntity(entityid)){
			return ;
		}
		context.connection().on('loaded.tagmark_dialog', null);
		console.log('loaded ... ');
		iD.ui.openTagmarkDialog(context, entityid, Object.assign({}, opts, {
			title: $dialogTitle.text()
		}))
	});
	*/
    iD.User.on('dvr.tagmark_dialog', function() {
        // 切换任务时触发
        destoryDialog(dialog);
    });
};

function destoryDialog(dialog){
    if (dialog && !dialog.closed) {
        dialog.CancelEvent && dialog.CancelEvent();
        !dialog.closed && dialog.close();
    }
};

})();
