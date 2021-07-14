/**
 * 数据模型字段
 * 在这使用经典类模式，主要和entity.js保持一致
 */
iD.ModelEntity = function(){
	this._fieldArray = [];
    this._geoType = 0;
    this._layerId='';
    this._members=[];
    this._type = 0;
    this._modelName = '';
}
iD.ModelEntity.prototype = {
    /**
     * 设置geoType
     * @param {int} geoType 
     */
    setGeoType : function(geoType){
        this._geoType = geoType;
    },
    getGeoType : function(){
        return this._geoType;
    },
    layerId :function(_){
        if (!arguments.length) return this._layerId;
        this._layerId = _;
        return this;
    },
    modelName: function(_){
        if(!arguments.length) return this._modelName;
        this._modelName = _;
        return this;
    },
    type :function(_){
        if(!arguments.length) return this._type;
        this._type = _;
        return this;
    },
    members : function(_){
        if (!arguments.length) return this._members;
        this._members = _;
        return this;
    },
	addField: function(fieldObj) {
        //排除掉重复的
        var flag = false;
        _(this._fieldArray).each(function(item){
            if(item.id == fieldObj.id){
                flag = true;
                return false;
            }
        });
        if(!flag){
            this._fieldArray.push(fieldObj);
        }
    },
    /**
     * 获得所有filed(如果geoType存在，则只获取对应的字段)
     * @param  {int} geoType 可选
     * @return []
     */
    getFields : function(geoType){
    	//过滤不可见的字段(isdisplay == 0)
        //过滤掉以r开头的字段
        // var _result =this._fieldArray;
        var _result = _.filter(this._fieldArray,function(obj){ 
            //TODO:模型返回有问题，现在直接全部显示
            return true;
            // return obj.display === "1" ;
                        });
        if(geoType){
            _result = _.filter(_result,function(obj){ return parseInt(obj.geoType,10) === parseInt(geoType,10);});
        }
        return _result;
    	return _result.reverse();
    },
    /**
     * 获得当前字段中所有Values
     * @return {[type]}
     */
    getValues:function(){
    	var _values = [];
    	_(this.getFields()).each(function(field){
    		_(field).each(function(value,key){
    			_values.push(value);
    		})
    	});
    	return _values;
    },
    /**
     * 根据英文key翻译为中文(如果geoType存在，则获取指定类型的字段)
     * 根据fieldName（英文字段名）获取中文字段名（fieldTitle）
     * @param  {[type]} englishName
     * @param {int} geoType 
     * @return {[type]}
     */
    getChineseName : function(englishName,geoType){
    	var name = englishName,
    		current;
    	_(this.getFields(geoType)).each(function(field){
    		_(field).each(function(value,key){
//  			if(key === englishName){
    			if(key === englishName || value === englishName){
//  				name = field.title || englishName;
    				name = field.title || field.fieldTitle || englishName;
    				current = field;
    				return false;
    			}
    		})
    		if(current){
    			return false;	//提前跳出循环
    		}
    	});
    	return name;
    }
}
