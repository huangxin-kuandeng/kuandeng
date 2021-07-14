iD.Layers= function(context){
    var layer = {};
    /**
     * 添加一个图层
     * @param layer 图层对象
     */
    layer.addLayer = function(layer){
    	iD.data.layers.push(layer);
    }
    /**
     * 删除一个图层
     * @param layer 图层对象
     */
    layer.removeLayer = function(l){
        var layers = this.getLayers();
        for(var i =0 ; i < layers.length ; i++)
        {
            var _ = layers[i] ; 
            if( _ && l.id && _.id == l.id)
            {
                iD.data.layers.splice(i,1);
            }
        }
    }
    /**
     * 删除全部图层
     */
    layer.removeAllLayers = function(){
        iD.data.layers.length = 0;
    }
    /**
     * 获取所有图层
     */
    layer.getLayers = function(){
    	return iD.data.layers;
    }

    /**
     * 获取所有非热点图层
     */
    layer.getDataLayers = function(){
        var layers = iD.data.layers,dataLayers = [];
        layers.forEach(function(item){
            if(!item.isHotspot()){
                dataLayers.push(item);
            }
        });
        return dataLayers;
    }

    /**
     * 获取所有热点图层
     */
    layer.getHotspotLayers = function(){
        var layers = iD.data.layers,dataLayers = [];
        layers.forEach(function(item){
            if(item.isHotspot()){
                dataLayers.push(item);
            }
        });
        return dataLayers;
    }

    /**
     * 根据图层ID获取图层对象
     * @param layerId 图层ID
     */
    layer.getLayerById = function(layerId){
    	// var layers = iD.data.layers, r;
        for(var i =0 ; i < iD.data.layers.length ; i++)
        {
            var l =  iD.data.layers[i];
            if(l.id == layerId)
            {
                return iD.data.layers[i];
            }
        }
        return null;
    	//layers.forEach(function(item){
         //   if(item.id == layerId){
         //       r = item;
         //       return false;
         //   }
        //});
        //return r;
    }

    /**
     * 根据图层名称获取图层对象
     * @param layerId 图层名称
     */
    layer.getLayerByName = function(layerName) {
        var layerId = iD.config.getLayerId(layerName) ;
        return layer.getLayerById(layerId) ;
    }

    /**
     * 根据图层名称获取图层对象
     * @param layerId 图层名称
     */
    layer.getSubLayerByName = function(layerName) {
        return iD.config.getLayerByName(layerName) ;
    }
    /**
     * 获取当前可编辑图层
     * 返回一个可用图层
     * @param {String} layerName 

    layer.getCurrentEnableLayer = function(layerName){
    	var layerid;
    	if(layerName){
    		layerid = iD.config.getLayerId(layerName);
    	}
    	var layers = iD.data.layers, r;
        layers.forEach(function(item){
        	if(r) return ;
            if(item.editable && (layerid ? item.id == layerid : true) && (layerName ? iD.util.getModelNameByItem(item.models, layerName) : true)){
                r = item;
                return false;
            }
        });

        return r ;
    }*/

    /**
     * 根据图层名称获取图层对象
     * @param layerId 图层名称
     */
    layer.getLayersByModelName = function(modelName) {
        let layers = iD.data.layers, result = [];
        layers.forEach(function(item){
            // item.modelName == modelName
            if(modelName ? iD.util.getModelNameByItem(item.models || [], modelName) : true){
                result.push(item)
                // return false;
            }
        });
        return result;
    }

    layer.getEditableLayers = function(){
        let layers = iD.data.layers, result = [];
        layers.forEach(function(item){
            if(item.editable){
                result.push(item)
            }
        });
        return result;
    }

    layer.getCurrentModelEnableLayer = function(modelName){
        let layers = iD.data.layers, result;
        layers.forEach(function(item){
        	// item.modelName == modelName
            if(item.editable && (modelName ? iD.util.getModelNameByItem(item.models || [], modelName) : true)){
                result = item;
                return false;
            }
        });
        return result;
    }

    //1.获取当前编辑状态下的layer
    //2.获取当前图层下指定模型编辑状态的
    /*
    * 获取当前编辑图层
    *
    * TODO 编辑线上点时，要先判断线是否可编辑
    * */
    layer.getLayer = function(layerID, modelName) {
        if (layerID) {
            let lay = this.getLayerById(layerID);
            if (lay) {
                if (modelName) {
                    var model = lay.models[modelName];
                    if (model) {
                        return model;
                    }
                }
                return lay;
            }
        }
    }
    /*layer.getLayer = function(layerID, model) {
        var layerid;
        if(layerID) {
            let lay = this.getLayerById(layerID);
            layerid = lay && lay.id;
        }

        var layers = iD.data.layers, r;
        layers.forEach(function (item) {
            if (model) {
                let isEditable = layer.getLayerModelEditable(item, model);
                if (isEditable) {
                    r = item;
                    return false;
                }
            } else {
                if (r) return;
                if (item.editable && (layerid ? item.id == layerid : true)) {
                    r = item;
                    return false;
                }
            }
        });

        return r;
    }*/

    layer._setAttribute = function(lay, model, param) {
        if (param.display != undefined) {
            if (lay.display) {
                model.display = param.display;
            } else {
                model.display = false;
            }
        }

        if (!model.editlock && param.editable != undefined) {
            if (lay.editable) {
                model.editable = param.editable;
            } else {
                model.editable = false;
            }
        }
    }
    /*
    * 设置图层、图层模型是否可编辑
    * @param
    *       lay: 图层
    *       edit: 是否可编辑参数
    *       models: 模型名称，当模型名称数组为空则刷新该图层下所有模型
    * */
    layer.setLayerEditable = function(lay, edit = true, models = []) {
        let m = [];
        if (models.length == 0) {
            for (let j in lay.models) {
                m.push(j);
            }
        }
        for (let i in m) {
            // lay.models[models[i]] = arguments;
            this._setAttribute(lay, lay.models[m[i]], {editable:edit});
        }
    }

    layer.setLayerDisplay = function (lay, display = true, models = []) {
        let m = [];
        if (models.length == 0) {
            for (let j in lay.models) {
                m.push(j);
            }
        }
        for (let i in m) {
            // lay.models[models[i]] = arguments;
            this._setAttribute(lay, lay.models[m[i]], {display:display});
        }
    }

    /*layer.getLayerModelDisplay = function (lay, model) {
        if (lay && model) {
            let m = lay.models[model];
            if (m.display) {
                return true;
            }
        }
        return false;
    }*/
    
    /*
    * 获取某个模型是否可编辑、显示
    * */
    layer.getModelConfig = function (lay, models = []) {
        if (models.length == 0) {
            for (let j in lay.models) {
                models.push(j);
            }
        }
        var modelsConfig =  [];
        for (let i in models) {
            let modelDis = lay.models[models[i]];
            modelsConfig[models[i]] = {
                editable: modelDis && modelDis.editable
            }
        }
        return modelsConfig;
    }

    return layer;
}();
iD.ModelEntitys = {
}
/**
 * 图层对象
 */
iD.Layer = function(param){
	var _this = param || {};
    _this.hotspots = {};
    _this.hotspotType = "";
    _this.lastIds = [];
    _this.sublayers=[];
    
    function isMultiModel(){
        return _this._modelEntity && !(_this._modelEntity instanceof iD.ModelEntity);
    }
    
    function _modelEntityType(type){
    	if(isMultiModel()){
			for(let modelName in _this._modelEntity){
				let modelEntity = _this._modelEntity[modelName];
				if(modelEntity && modelEntity.type() == type){
					return true;
				}
			}
			return false;
		}else {
			return _this._modelEntity.type() == type;
		}
    }
    
    function _modelEntityHasModel(modelName){
    	if(!_this._modelEntity) return false;
    	if(isMultiModel()){
			return _this._modelEntity[modelName] != null;
		}else {
			return _this._modelEntity.modelName() == modelName;
		}
    }
    
	_this.isArea = function() {
		return _modelEntityType(3);
//      return _this._modelEntity.type() == 3;
//      return _this.type === "area";
    }
    _this.isHotspot = function() {
        return _this.type === "hotspot";
    }
    
	_this.isRoad =  function() {
		return _modelEntityHasModel(iD.data.DataType.ROAD);
//	    return _this._modelEntity.modelName() == iD.data.DataType.ROAD;
    	// return _this.type === "road";
    }
    _this.isDivider =  function() {
    	let mname = iD.data.DataType.DIVIDER;
    	/*if(window._systemType == 2){
    		mname == iD.data.DataType.FUSION_DIVIDER
    	}*/
	    return _modelEntityHasModel(mname);
//	    return _this._modelEntity.modelName() == iD.data.DataType.DIVIDER;
    	// return _this.type === "road";
    }

	_this.isLine = function() {
		return _modelEntityType(2);
//      return _this._modelEntity.type() == 2;
    	// return _this.type === "line";
    }
	
	_this.isPoint = function() {
		return _modelEntityType(1);
//      return _this._modelEntity.type() == 1;
//		return _this.type === "point";
	}
	_this.isRelation = function() {
		return _modelEntityType(0);
//      return _this._modelEntity.type() == 0;
//		return _this.type === "relation";
	}
    _this.modelEntity = function(_){
        if (!arguments.length) return _this._modelEntity;
        _this._modelEntity = _;
        return _this;
    }
    _this.hasModelEntity = function(_){
    	return _modelEntityHasModel(_);
    }
    /*
    * 判断模型显示状态
    * */
    _this.isModelDisplay = function(mname){
        if (_this.display) {
            return _this.models[mname] ? _this.models[mname].display : false;
        }
        return false;
    }
    /*
    * 判断模型编辑状态
    * */
    _this.isModelEditable = function(mname){
        if (_this.editable) {
            return _this.models[mname] ? _this.models[mname].editable : false;
        }
        return false;
    }
    // _this.typeModelEntity = function(_){
		// !_this._typeModelEntity && (_this._typeModelEntity = {});
    //     if (!arguments.length) return _this._typeModelEntity;
    //     _this._typeModelEntity[_.datatype] = _;
    //     return _this;
    // }
    // _this.getSubLayerByType = function(type){
		// var layers = this.sublayers;
		// if (layers) for(var i = 0 ; i < layers.length ; i++) if(type === layers[i].datatype) return layers[i];
    // }
    // _this.getSubModelEntityByType = function(type){
    //     return _this._typeModelEntity&&_this._typeModelEntity[type] && _this._typeModelEntity[type].model;
    // }
    // _this.getModelEntityByEntity=function(entity)
    // {
    //     return this.modelEntity();
    //     // var modelEntity, mtype;
    //     // if (entity.type == "node") {
    //     //     mtype = "1";
    //     // } else if (entity.type == "way") {
    //     //     mtype = "2";
    //     // }
    //     // else if (entity.type == "relation") {
    //     //     mtype = "0";
    //     // }
    //     // var layType;
    //     // if (entity.modelName == iD.data.DataType.HIGHWAY) {
    //     //     modelEntity = this.modelEntity();
    //     //     layType =this.geoType;
    //     // } else {
    //     //     modelEntity = this.getSubModelEntityByType(entity.modelName);
    //     //     //处理非子图层情况
    //     //     if(this.getSubLayerByType(entity.modelName)) {
    //     //         layType = this.getSubLayerByType(entity.modelName).geoType;
    //     //     }
    //     // }
    //     // if (modelEntity && mtype == layType) {
    //     //     return modelEntity;
    //     // }
    // }

	return _this;
}


