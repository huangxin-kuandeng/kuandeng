/*!
 * 基于jock-citypicker v2.0修改
 * 城市选择，省份拼音排序
 */
(function(host) {
	var window = host || window,
		doc = document,
		selectedCity = null,
		popUpCityFrame = null,
		selectEventProxy = null,
		hotEventProxy = null,
		scrollEventProxy = null,
		toString = Object.prototype.toString,
		cityData = _CITY_PICKER_CITYLIST,
		KEY = ["A", "B", "C", "D", "E", "F", "G", "H", "", "J", "K", "L", "M", "N", "", "P", "Q", "R", "S", "T", "", "", "W", "X", "Y", "Z"],
		ID = {
			cityFrame: "div_select_city_sub_menu",
			cityList: "div_city_list"
		},
		CLAZZ = {
			cityFrame: "mod_list_city",
			cityTop: "city_top",
			cityList: "list_wrap",
			cityHot: "hot",
			cityCont: "city_cont",
			col1: "col1",
			col2: "col2",
			table: "mod_city_list"
		};
	function createCityTopHtml() {
		var fragment = doc.createDocumentFragment(),
			strong = doc.createElement("strong"),
//			txt1 = doc.createTextNode("城市索引："),
			txt1 = doc.createTextNode("省份索引："),
			txt2 = doc.createTextNode("全部"),
			p = doc.createElement("p"),
			a = doc.createElement("a");
		strong.appendChild(txt1);
		a.href = "#";
		a.appendChild(txt2);
		p.appendChild(a);
		for(var row in cityData) {
			if(cityData.hasOwnProperty(row)) {
				a = doc.createElement("a");
				a.href = "#" + row;
				a.appendChild(doc.createTextNode(row));
				p.appendChild(a);
			}
		}
		fragment.appendChild(strong);
		fragment.appendChild(p);
		return fragment;
	}

	function createHotCityHtml(addCity=false) {
		var fragment = doc.createDocumentFragment(),
			strong = doc.createElement("strong"),
			txt = doc.createTextNode("热门城市："),
			currentCity = null,
			cityText = "",
			link = null,
			hotCity = [{
				name: "北京",
				adcode: '110000',
				spell: "beijing"
			}, {
				name: "上海",
				adcode: '310000',
				spell: "shanghai"
			}, {
				name: "广州",
				adcode: '440100',
				spell: "guangzhou"
			}, {
				name: "深圳",
				adcode: '440300',
				spell: "shenzhen"
			}, {
				name: "重庆",
				adcode: '500000',
				spell: "chongqing"
			}, {
				name: "苏州",
				adcode: '320500',
				spell: "suzhou"
			}, {
				name: "保定",
				adcode: '130600',
				spell: "baoding"
			}, {
				name: "天津",
				adcode: '120000',
				spell: "tianjin"
			}];
		strong.appendChild(txt);
		fragment.appendChild(strong);
		if(addCity){
			hotCity.push(addCity)
		}
		for(var i = 0, len = hotCity.length; i < len; i++) {
			currentCity = hotCity[i];
			link = createCityNameDomA(currentCity);
			fragment.appendChild(link);
		}
		return fragment;
	}
	
	function createCityNameDomA(cityinfo){
		var link = doc.createElement("a");
		link.title = cityinfo.name;
		// link.href = "/" + cityinfo.spell;
		link.href = 'javascript:void(0)';
		link.appendChild(doc.createTextNode(cityinfo.name));
		link.setAttribute('adcode', cityinfo.adcode);
		// 不存在城市详细信息
		if(!_CITY_PICKER_GEOLIST[cityinfo.adcode]){
			link.style.backgroundColor = 'red';
		}
		return link;
	}
	
	function filterName(name){
    	for(var key in _CITY_PICKER_GEOLIST){   
        	if (_CITY_PICKER_GEOLIST[key].name === name){  
	            return _CITY_PICKER_GEOLIST[key]
            }                 
    	}
	}
	
	function createCityTRHtml() {
		var fragment = doc.createDocumentFragment();
		for(var miao in cityData) {
			if(!cityData.hasOwnProperty(miao)) {
				continue;
			}
			// 首字母
			var provinces = cityData[miao];
			// 多个省份
			for(let prov of provinces){
				// 每个省份多个城市
				for(let provname in prov){
					var s1 = filterName(provname);
					var cityArray = prov[provname];
					var tr = doc.createElement("tr"),
						th = doc.createElement("th"),
						td = doc.createElement("td"),
						span = doc.createElement("span"),
						text = doc.createTextNode(provname),
						currentMiao = null,
						a = null;
					for(var j = 0, len = cityArray.length; j < len; j++) {
						currentMiao = cityArray[j];
						a = createCityNameDomA(currentMiao);
						td.appendChild(a);
					}
					if(s1){
						text = createCityNameDomA(s1);
					}
					span.appendChild(text);
					th.appendChild(span);
					tr.id = "miao_" + miao;
					tr.appendChild(th);
					tr.appendChild(td);
					fragment.appendChild(tr);
				}
			}
		}
		return fragment;
	}

	function createCityContentHtml() {
		var fragment = doc.createDocumentFragment(),
			h4 = doc.createElement("h4"),
			table = doc.createElement("table"),
			colgroup = doc.createElement("colgroup"),
			tbody = doc.createElement("tbody"),
			col1 = doc.createElement("col"),
			col2 = doc.createElement("col"),
			h4Text = doc.createTextNode("全部城市："),
			trHtml = createCityTRHtml();
		table.className = CLAZZ.table;
		col1.className = CLAZZ.col1;
		col2.className = CLAZZ.col2;
		colgroup.appendChild(col1);
		colgroup.appendChild(col2);
		h4.appendChild(h4Text);
		tbody.appendChild(trHtml);
		table.appendChild(colgroup);
		table.appendChild(tbody);
		selectEventProxy = table;
		fragment.appendChild(h4);
		fragment.appendChild(table);
		return fragment;
	}

	function stopPropagation(event) {
		if(event.stopPropagation) {
			event.stopPropagation();
		} else {
			event.cancelBubble = true;
		}
	}

	function preventDefault(event) {
		if(event.preventDefault) {
			event.preventDefault();
		} else {
			event.returnValue = false;
		}
	}

	function cityScroll(m) {
		if(m && typeof m === "string") {
			m = m.toUpperCase();
			if(doc.all) {
				var cityListDiv = doc.getElementById(ID.cityList),
					tr = doc.getElementById("miao_" + m);
				if(tr !== null) {
					cityListDiv.scrollTop = tr.offsetTop + 32;
				}
			} else {
				var miao = doc.getElementById("miao_" + m);
				if(miao !== null) {
					miao.scrollIntoView();
				}
			}
		}
	}

	function addSelectEvent(proxyTag, type, callback) {
		proxyTag["on" + type] = function(e) {
			var event = e || window.event,
				target = event.srcElement || event.target;
			if(target.tagName.toLowerCase() == "a") {
				var adcode = target.getAttribute('adcode');
				var cityinfo = _CITY_PICKER_GEOLIST[adcode];
				if(cityinfo){
					selectedCity = cityinfo;
					callback(target.innerHTML, selectedCity);
				}
			}
			citypicker.close();
			stopPropagation(event);
			preventDefault(event);
		};
	}

	function addScrollEvent(proxyTag, type) {
		proxyTag["on" + type] = function(e) {
			var event = e || window.event,
				target = event.srcElement || event.target;
			if(target.tagName.toLowerCase() == "a") {
				var m = target.getAttribute("href").replace(/^#/, "") || "A";
				cityScroll(m);
			}
			stopPropagation(event);
			preventDefault(event);
		};
	}
	/**
	 * 键盘按键跳转
	 * @param {Object} tag
	 */
	function addKeyPressEvent(tag) {
		return false;
		/*
		tag.onkeypress = function(e) {
			var event = window.event || e,
				charCode, keyIndex = 0,
				keyCode;
			if(typeof event.charCode == "number") {
				charCode = event.charCode;
			} else {
				charCode = event.keyCode;
			}
			if(charCode >= 97 && charCode <= 122) {
				keyIndex = charCode - 97;
			} else if(charCode >= 65 && charCode <= 90) {
				keyIndex = charCode - 65;
			}
			keyCode = KEY[keyIndex];
			cityScroll(keyCode);
		};
		*/
	}

	function createFrame(addCity=false) {
		var cityFrame = doc.createElement("div"),
			cityTop = doc.createElement("div"),
			cityHot = doc.createElement("p"),
			cityList = doc.createElement("div"),
			cityCont = doc.createElement("div"),
			hotCityHtml = createHotCityHtml(addCity),
			cityContentHtml = createCityContentHtml(),
			cityTopHtml = createCityTopHtml();
		addKeyPressEvent(cityFrame);
		hotEventProxy = cityHot;
		scrollEventProxy = cityTop;
		popUpCityFrame = cityFrame;
		cityFrame.id = ID.cityFrame;
		cityFrame.className = CLAZZ.cityFrame;
		cityTop.className = CLAZZ.cityTop;
		cityHot.className = CLAZZ.cityHot;
		cityList.id = ID.cityList;
		cityList.className = CLAZZ.cityList;
		cityCont.className = CLAZZ.cityCont;
		cityHot.appendChild(hotCityHtml);
		cityCont.appendChild(cityContentHtml);
		cityTop.appendChild(cityTopHtml);
		cityList.appendChild(cityCont);
		cityFrame.appendChild(cityTop);
		cityFrame.appendChild(cityHot);
		cityFrame.appendChild(cityList);
		return cityFrame;
	}
	var citypicker = {
		version: "2.0",
		point: {
			left: 0,
			top: 0
		},
		callback: function() {},
		show: function() {
			var lenght = arguments.length,
				addHotCity = null,
				options, point = citypicker.point,
				callback = citypicker.callback;
			if( (lenght == 2) || (lenght == 3) ) {
				point = arguments[0];
				callback = arguments[1];
				addHotCity = arguments[2];
			} else {
				options = arguments[0];
				if(options && typeof options === "object") {
					point.left = options.left || citypicker.point;
					point.top = options.top || citypicker.top;
					callback = options.selected || citypicker.callback;
				}
			}
			var docCityFrame = doc.getElementById(ID.cityFrame);
			if(docCityFrame){
				docCityFrame.remove();
				docCityFrame = null;
			}
			if(!popUpCityFrame || !docCityFrame) {
				popUpCityFrame = createFrame(addHotCity);
				addScrollEvent(scrollEventProxy, "click");
				addKeyPressEvent(doc);
				doc.body.appendChild(popUpCityFrame);
			}
			citypicker.fix(point);
			citypicker.bind(callback);
			popUpCityFrame.style.display = "block";
			return this;
		},
		close: function() {
			if(popUpCityFrame) {
				popUpCityFrame.style.display = "none";
			}
		},
		getSelectedCity: function() {
			return selectedCity;
		},
		fix: function(point) {
			if(point && typeof point === "object") {
				var left = parseInt(point.left, 10) || 0,
					top = parseInt(point.top, 10) || 0;
				citypicker.point = {
					left: left,
					top: top
				};
				if(popUpCityFrame) {
					popUpCityFrame.style.left = left + "px";
					popUpCityFrame.style.top = top + "px";
				}
			}
			return this;
		},
		bind: function(callback) {
			if(toString.call(callback) === "[object Function]") {
				citypicker.callback = callback;
				if(popUpCityFrame !== null) {
					addSelectEvent(selectEventProxy, "click", callback);
					addSelectEvent(hotEventProxy, "click", callback);
				}
			}
			if(popUpCityFrame){
				popUpCityFrame.onmouseleave = function(){
					citypicker.close();
					stopPropagation(event);
					preventDefault(event);
				}
			}
			return this;
		}
	};
	window.citypicker = citypicker;
})(window);