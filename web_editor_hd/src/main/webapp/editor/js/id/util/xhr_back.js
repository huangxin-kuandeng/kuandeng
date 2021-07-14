
Object.toQueryString = function (source)
{
	if (typeof source == 'string')
	{
		return encodeURIComponent(source);
	}
	var queryString = [];
	for (var property in source)
	{
		queryString.push(encodeURIComponent(property) + '=' + encodeURIComponent(source[property]));
	}
	return queryString.join('&');
};
function escapeRegExp(str)
{
	return str.replace(/([.*+?^${}()|[\]\/\\])/g, '\\$1');
}
/*时间毫秒数，代替Math.random*/
function random()
{
	return new Date().getTime();
}
function $defined(obj)
{
	return (obj != undefined);
};
function $type(obj)
{
	if (!$defined(obj)) return false;
	if (obj.htmlElement) return 'element';
	var type = typeof obj;
	if (type == 'object' && obj.nodeName)
	{
		switch (obj.nodeType)
		{
			case 1: return 'element';
			case 3: return (/\S/).test(obj.nodeValue) ? 'textnode' : 'whitespace';
		}
	}
	if (type == 'object' || type == 'function')
	{
		switch (obj.constructor)
		{
			case Array: return 'array';
			case RegExp: return 'regexp';
		}
		if (typeof obj.length == 'number')
		{
			if (obj.item) return 'collection';
			if (obj.callee) return 'arguments';
		}
	}
	return type;
};
function array_map(array, fn, bind)
{
	var results = [];
	for (var i = 0, j = array.length; i < j; i++) results[i] = fn.call(bind, array[i], i, array);
	return results;
}
/*argDestination：要合并进到的对象*/
/*argOrigin：新加的对象*/
/*merge(a,b)：以a做基础，将b的属性拷进来*/
function merge(argDestination, argOrigin)
{
	for (var p in argOrigin)
	{
		if (typeof argDestination[p] == 'object' && typeof argOrigin[p] == 'object')
		{
			argDestination[p] = arguments.callee(argOrigin[p], argDestination[p]);
		}
		else
		{
			argDestination[p] = argOrigin[p];
		}
	}
	return argDestination;
}
/*全绑定*/
Function.prototype.fnBind = function (argObj, args)
{
	var _fn = this;
	return function ()
	{
		if (args && arguments.length)
		{
			var _args = Array.prototype.slice.call(args, 0);
			for (var i = 0; i < arguments.length; i++)
			{
				Array.prototype.push.call(_args, arguments[i]);
			}
		}
		return _fn.apply(argObj || this, _args || args || arguments);
	}
};
/*只绑参数*/
Function.prototype.bindArg = function ()
{
	return this.fnBind(null, arguments);
};
String.prototype.contains = function (string, s)
{
	return (s) ? (s + this + s).indexOf(s + string + s) > -1 : this.indexOf(string) > -1;
};
String.prototype.test = function (regex, params)
{
	return (($type(regex) == 'string') ? new RegExp(regex, params) : regex).test(this);
};
function Ajax(url, options, onComplete)
{
	this.url = url;
	this.running = false;
	this.timer = null;
	this.options = {
		method: 'GET',
		data: null,
		time: 600000,
		async: true,
		onComplete: false,
		onFailure: false,
		onTimeOut: false,
		onRequest: false,
		charset: 'utf-8'
	};
	this.setOptions(options);
	this.options.onComplete = onComplete || this.options.onComplete || function () { };
	this.transport = new XMLHttpRequest();
};
Ajax.prototype.setOptions = function (options)
{
	this.options.onComplete = false;
	this.options.onFailure = false;
	this.options.onTimeOut = false;
	this.options.onRequest = false;
	for (var option in options)
	{
		this.options[option] = options[option];
	}
};
Ajax.prototype.request = function ()
{
	if (this.running)
	{
		return this;
	}
	this.running = true;
	var data = this.options.data && Object.toQueryString(this.options.data);
	if (data && (this.options.method == 'GET'))
	{
		this.url = this.url + (this.url.contains('?') ? '&' : '?') + data;
		data = null;
	}
	this.transport.open(this.options.method, this.url, this.options.async);
	//this.transport.setRequestHeader("charset", this.options.charset);
	if (this.options.method == 'POST')
	{
		this.transport.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=' + this.options.charset);
	}
	this.transport.onreadystatechange = this.onStateChange.fnBind(this);
	this.transport.timeout=this.options.time;
	
	this.transport.send(data);
	this.transport.ontimeout=function(){
        console.warn("request Time out",this);
    }

	if (this.options.onTimeOut)
	{
		var cancel = this.cancel.fnBind(this);
		var timeOut = this.options.onTimeOut.fnBind(this);
		this.timer = setTimeout(function ()
		{
			cancel();
			timeOut();
		}, this.options.time );
	}
	if (this.options.onRequest)
	{
		this.options.onRequest();
	}
	return this;
};
Ajax.prototype.cancel = function ()
{
	if (!this.running)
	{
		return this;
	}
	this.running = false;
	if (this.timer)
	{
		clearTimeout(this.timer);
	}
	this.transport.abort();
	return this;
};
Ajax.prototype.onStateChange = function ()
{
	if (this.transport.readyState != 4 || !this.running) return;
	this.running = false;
	var status = this.transport.status;
	if (this.timer)
	{
		clearTimeout(this.timer);
	}
	if ((status >= 200) && (status < 300))
	{
		this.options.onComplete(this.transport.responseText);
	}
	else
	{
		if (this.options.onFailure)
		{
			this.options.onFailure();
		}
	}
};

onmessage = function (msg)
{
	var id = msg.data.id;
	var url = msg.data.url;
	var option = msg.data.option;

	new Ajax(url, {

	}, function (data)
	{
		postMessage({
			id: id,
			data: data
		});
	}).request();
}