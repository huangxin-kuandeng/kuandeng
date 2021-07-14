iD.ui.RoadRule.RuleType = function(ruleTypeFlag,blockTypeFlag) {
    var roadRuleOptions=iD.ui.RoadRule.RuleType.typeOptions;
    roadRuleOptions.forEach(function(d){
        d.disabled=null;
       /* delete d.default;*/
    })
   /* roadRuleOptions[0].default=true;*/
    if(!ruleTypeFlag)
    {
        roadRuleOptions[0].disabled=true;
        roadRuleOptions[1].disabled=true;
       /* roadRuleOptions[2].default=true;
        delete roadRuleOptions[0].default;*/
    }
    if(!blockTypeFlag)
    {
        roadRuleOptions[2].disabled=true;

    }
	var render = iD.ui.RoadRule.Radio({
		name: 'type',
		options: roadRuleOptions
	});

	var ruleType = function(selection) {

		return render(selection);
	};


	ruleType.val = function(_) {
		return render.val.apply(render, arguments);
	};

	return d3.rebind(ruleType, render, 'on');
};

iD.ui.RoadRule.RuleType.typeOptions = [{
	label: '明示（强制）禁止信息（默认）',
	value: '0',
    disabled:null,
	default: true
}, {
	label: '门禁禁止',
    value: '1',
    disabled:null,
    default: false
}, {
	label: '临时交通管制',
    value: '2',
    disabled:null,
    default: false
}];

iD.ui.RoadRule.RuleType.getOptionLabel = function(val) {

	var opts = iD.ui.RoadRule.RuleType.typeOptions;

	for (var i = 0, len = opts.length; i < len; i++) {
		if (opts[i].value == val) {
			return opts[i].label;
		}
	}

	return '';
};