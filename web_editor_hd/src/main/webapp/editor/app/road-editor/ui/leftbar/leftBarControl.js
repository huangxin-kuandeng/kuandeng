iD.ui.LeftBarControl = function (context) {
	var classNames = ['glyphicon-chevron-left', 'glyphicon-chevron-right'];
	var classes = {
		show: classNames[0],
		hide: classNames[1]
	};
	var $control, $icon, $selection;
	
	function show(){
		if(!$selection || !$selection.size()){
			return ;
		}
		$icon.classed(classNames.join(' '), false).classed(classes.show, true);
		$selection.style({
			position: 'fixed',
			top: 0,
			left: 0
		});
	}
	function hide(){
		if(!$selection || !$selection.size()){
			return ;
		}
		$icon.classed(classNames.join(' '), false).classed(classes.hide, true);
		$selection.style({
			position: 'fixed',
			top: 0,
			left: - ($selection.node().offsetWidth) + "px"
		});
	}
	
	var leftBarControl = function (selection) {
		$selection = selection;
		$control = selection.append('div').attr('id', 'leftbar-visible-control');
		$icon = $control.append('span').attr('class', 'glyphicon glyphicon-chevron-right');
		
		$control.on('click.leftbar-control', function(){
			if($icon.classed(classes.show)){
				hide();
			}else if($icon.classed(classes.hide)){
				show();
			}
		});
	}
	
	iD.ui.LeftBarControl.show = show;
	iD.ui.LeftBarControl.hide = hide;
	
	return leftBarControl;
}
