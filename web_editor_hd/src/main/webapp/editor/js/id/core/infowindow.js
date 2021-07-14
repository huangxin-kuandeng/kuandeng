iD.InfoWindow = function iD_InfoWindow(map, opt) {
    if (!(this instanceof iD_InfoWindow)) {
        return (new iD_InfoWindow()).initialize(map, opt);
    } else if (arguments.length) {
        this.initialize(map, opt);
    }
    this.graphType =  "infoWindow";
};

_.extend(iD.InfoWindow.prototype, {
	
    type: 'infoWindow',
    
    initialize: function (map, opt) {
		this.map = map;
		this.opt = opt;
	},
	
	open: function (position) {
		if (!this.map) return;
		var map = this.map, opt = this.opt, context = map.getContext();
		var	tt = setInterval(function () {
			if (context.infowindow_isBand) {
				clearInterval(tt);
				!opt.size ? opt.size = [300, 100] : null, !opt.content ? opt.content = '' : null;
				context.event.openinfowindow(opt, position);
			}
		}, 50);
	},
    
    close: function () {
		if (!this.map) return;
		var map = this.map, context = map.getContext();
		var	tt = setInterval(function () {
			if (context.infowindow_isBand) {
				clearInterval(tt);
				context.event.closeinfowindow();
			}
		}, 50);
	},
	
	setContent: function (content) {
		if (!this.map) return;
		this.opt.content = content ? content : '';
		this.map.getContext().event.changeinfowindow(this.opt);
	},
	
	getContent: function () {
		return this.opt.content;
	},
    
	setSize: function (size) {
		if (!this.map) return;
		this.opt.size = size ? size: [300, 100];
		this.map.getContext().event.changeinfowindow(this.opt);
	},
	
	getSize: function () {
		return this.opt.size;
	},
	
	setPosition: function () {
		
	},
	
	getPosition: function () {
		
	}
	
});