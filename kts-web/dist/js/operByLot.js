
var operByLot = {
    //====================1.
    /**批量处理CRUD */
    /**本页或全量 */
    isPage : false,
    /**功能列表 */
    fnList: {
        ins: {inUse:false,desc:'创建'},
        del: {inUse:false,desc:'删除'},
        sel: {inUse:true,desc:'查询'},
        cus: {inUse:true,desc:'存为常用'},
        insByLot: {inUse:false,desc:'查询结果批量创建'},
        insAlot: {inUse:false,desc:'勾选多行批量创建'},
    },
    /**全部字段 */
    keywordSub: [],
    keywordPri: [],
    /**选用字段 */
    /** k: v: type: */
    keywordAvail: {},
    keywordRes: {},
    option: {},
    urlSets: {
    },

    //======================2.
    /**初始化 */
    // loadsubKeys: function () { //fail  await一直报不好使ri
    //         return new Promise((resolve, reject) => {
    //         util.getAjax('http://192.168.5.34:33320/kms-v2/base/spec/get',true,(data) =>{
    //         let resData = data.result.spec || []
    //         resolve(resData)
    //      })
    //     }) 
    // },    
    load:  function(_option){
        if(_option.pageName == 'MyTask'){
            operByLot.fnList.sel.desc='领取';
        }
         //1.更新配置项
        operByLot.urlSets = (_option.urlSets?_option.urlSets: operByLot.urlSets);
        operByLot.option = (_option?_option:operByLot.option); 
        //2.查询全字段
        operByLot.keywordSub = [];
       operByLot.keywordPri = operByLot.option.cols || [];
       /*3.更新方法设置*/
       if(operByLot.option.fn && !$.isEmptyObject(operByLot.option.fn)) {
            Object.assign(operByLot.fnList,operByLot.option.fn);
       }
        operByLot.keywordRes = {};
        util.getAjax(window.kms_v2  + 'base/spec/get',true,(data) =>{
           operByLot.keywordSub = data.result.spec || [];
           operByLot.init();
           operByLot.eventBind();
         })
         //3.查询常用列表
        operByLot.cusQuery();
    //  operByLot.keywordSub =  await operByLot.loadsubKeys()
    //     operByLot.init();
    //     operByLot.eventBind();
    },

    init: function() {
        //配置项
        // let cusResult =[
        //     '组网分割全图',
        //     '组网分割全图模型-农村',
        //     '组网分割半图模型-城市',
        //     '组网分割半图模型-高速',
        //     '组网分割半图模型-农村',
        //     '组网分割半图模型-国省道',
        //     '组网检测模型',
        //     '病害分割模型',
        //     '病害检测模型'
        // ]
        let subKeys = operByLot.keywordSub// code name values
        let priKeys = operByLot.keywordPri
        let menus = operByLot.fnList;
        let _html = `<div class='operByLot'>
        <div class='keywordDiv' style='width:100%;height:80%;'>
        <p class='rank_line'>*项目级*</p>
        ${priKeys.map(el => {

            let res = '';
            if(util.isJSON4object(el.values)) {
                try{
                    let obj = el.values;
                    res = `<label class='subkey'> ${el.name}</label><select class='subkey pri' data-code='${el.code}' >
                    ${Object.keys(obj).map(ell => {return `<option value='${ell}'>${obj[ell]}</option>`}).join('')}
                    </select>`
                }catch(e){
                    res = `<label class='subkey'> ${el.name}</label><input class='subkey pri' data-code='${el.code}' value='${el.values}' />`
                }
            } else if(el.type && el.type=='time'){
              res =  `<label class='subkey'>${el.name}</label>
                            <input class='subkey pri  time' name="startTime" placeholder='开始时间'  data-code='start_${el.code}' value='' />-- <input  placeholder='结束时间' class='subkey pri  time' name="endTime"  data-code='end_${el.code}' value='' />`
                // res = `<label class='subkey'>${el.name}</label><input class='subkey pri time' data-code='${el.code}' value='' />`
            }else {
               res = `<label class='subkey'>${el.name}</label><input class='subkey pri' data-code='${el.code}' value='' />`
            }
            return res
        }).join('')}
        <p class='rank_line'>*属性级*</p>
        ${subKeys.map(el => {
            let res = '';
            if(util.isJSON4object(el.values)) {
                try{
                    let obj = el.values;
                    res = `<label class='subkey'> ${el.name}</label><select class='subkey' data-code='${el.code}' >
                    ${Object.keys(obj).map(ell => {return `<option value='${ell}'>${obj[ell]}</option>`}).join('')}
                    </select>`
                }catch(e){
                    res = `<label class='subkey'> ${el.name}</label><input class='subkey' data-code='${el.code}' value='${el.values}' />`
                }
            } else {
               res = `<label class='subkey'>${el.name}</label><input class='subkey' data-code='${el.code}' value='' />`
            }
            return res
        }).join('')}
        </div>
        <div class='fnDiv' style='width:100%;height:20%;border-top:1px dashed #2884cf;padding:4px;'>
        <a class="cls tabTools" href="#">关闭</a>
        <a class="clr tabTools" href="#">清除</a>
		<div class="btn-group" style='float:right;height:24px;margin-right: 8px;'>
		  	<button type="button"  style='height: 24px; line-height: 24px; width: 50px; padding: 0px; text-align: center;' class="sel subTabTools btn btn-success ">${operByLot.fnList.sel.desc}</button>
		  	<button type="button" class="btn btn-success dropdown-toggle" data-toggle="dropdown" style="width: initial;height:24px;" aria-expanded="true">
		        <span class="caret" style='padding-top:10px;'></span>
		        <span class="sr-only">Toggle Dropdown</span>
		  	</button>
		  	<ul class="dropdown-menu" role="menu" style="min-width:100px;margin:0px;">
              ${Object.entries(menus).map(([k,o]) => {
                  let res = '';
                  if(o.inUse){
                    res = `<li><a class="${k} subTabTools" href="#">${o.desc}</a></li>`
                  }
                  return res
              }).join('')}
		  	</ul>
		</div>
        <a class="cuslist tabTools" href="#">常用</a>
        </div>
        <div class="cusResult" style="display: none;"><div class="resHeader"><span class="subLstHead">常用列表</span>
        <a class="cuscls tabTools" href="#">关闭</a>
        </div><div class="resBody"><ol>
        ${operByLot.cusResult.map((el,id) => `<li><a data-code='${id}' href='#'>${el}</a></li>`).join('')}
        </ol></div></div>
        </div>`;
        $('#operByLot').html(_html) ;
        $('.keywordDiv .time').datepicker({
            format: 'yyyy-mm-dd',
            autoclose: true,
            language: "zh-CN"
        });
    },
    /**执行操作 */
    cuslist: function() {
        $('.cusResult').css('display','block') 
    },
    sel: function() {
        let _data = operByLot.keywordRes;//处理数据
        if(operByLot.option['selCallback']){
            return operByLot.option['selCallback'](_data,true)
        } else if(operByLot.option['urlSets']['sel']){
            let _url = operByLot.urlSets['sel'];
            util.postAjax(_url, _data, function (res) {
                if (res.code == 0) {
                    console.log(res)
                    return res;
                } else {
                    alert('操作失败')
                }
            })
        } else {
            alert('查询函数无效')
        } 
    },
    insByLot: function () {
        let _data = operByLot.keywordRes;//处理数据
        if(operByLot.option.fn||['insByLotCallback']){
            return operByLot.option['insByLotCallback']('ByLot',_data);
        }
    },
    insAlot: function () {
        let _data = operByLot.keywordRes;//处理数据
        if(operByLot.option.fn||['insAlotCallback']){
            return operByLot.option['insAlotCallback']('Alot',_data);
        }
    },
    del: function() {
       let _url = operByLot.urlSets['del'];
       if(!_url){
           util.errorView('暂无删除功能')
           return
       }
       let _data = operByLot.keywordRes;//处理数据
       util.postAjax(_url,_data,function (res){
           if(res.code == 0){
               alert('删除成功')
           } else {
               alert('操作失败')
           }
        })
     },
    /**保存常用 */
    cus: function() {               
        let _url = operByLot.urlSets['cus'];
        let cusArr = {};
        $('input.subkey').each(function(){
            let v = $(this).val();
            if(v){
                cusArr[$(this).attr('data-code')] = {value: v}; 
            }
        })
        $('select.subkey').each(function(){
            let v = $(this).val();
            let name = $(this).find("option:selected").text();
            let tep = {};
            if(v && v!= '0' && name){ 
                tep['code'] = v; tep['name'] = name;
                cusArr[$(this).attr('data-code')] = {value:tep};                
               
            }
        })

        if($.isEmptyObject(cusArr)){
            util.errorView('常用组合为空')
            return
        }
        let _data = {
            "data": [{
            "properties": {
            "type": operByLot.option.pageName,
            "name": cusArr
            }
            }]
        }
        util.postAjax(_url,_data,function (res){
            if(res.code == 0){
                alert('保存成功')
                operByLot.cusQuery()
            } else {
                alert('操作失败')
            }
         })
    },
    /**查询常用列表 */
    cusQuery: function () {
        operByLot.cusResult = [];
        let _params = {
            "ops": [
            {
                "k": "type",
                "v": operByLot.option.pageName,
                "op": "eq"
            }
            ],
            "page": {
            "pageNo": 1,
            "pageSize": 200  //fake
            }
        }
        util.postAjax(window.kms_v2 + 'data/web_form/info/queryPage',_params,(data) =>{  // List<Obejct>
            if(data.code == 0 && !$.isEmptyObject(data.result.data) && data.result.data.length>0){
                 let res =  data.result.data;
                operByLot.cusResult =  res.map(el => el.properties.name); // key value{code name}
          $('.resBody').html(`<ol>
        ${operByLot.cusResult.map((el,id) => {
          let desc = Object.keys(el).map(eel => {
                 let name='';
                if (typeof(el[eel].value)=='string'){
                    name = el[eel].value
                } else {
                    name = el[eel].value.name;
                } 
                return name  
            }).join('-')
               
            return `<li><a data-code='${id}' href='#'>${desc}</a></li>`}).join('')}
        </ol>`)
            /**绑定 */
        $('.resBody li a').on('click',function () {
            let cusId = Number($(this).attr('data-code'));
            operByLot._cusSelected = operByLot.cusResult[cusId]
            operByLot.clr()            
        })
            }         
        })

    
    },
    /**清除 */
    clr: function() {
        operByLot.keywordRes = {};
        if( operByLot._cusSelected){
            Object.keys( operByLot._cusSelected).map(el =>{
                operByLot.keywordRes[el] = (typeof( operByLot._cusSelected[el].value) == 'string'?  operByLot._cusSelected[el].value: operByLot._cusSelected[el].value.code)
            })     
        }
        let subKeys = operByLot.keywordSub;
        let priKeys = operByLot.keywordPri;       
            let _html = 
            `<p class='rank_line'>*项目级*</p>
            ${priKeys.map(el => {
                let res = '';
                let defVal = (el.code in operByLot.keywordRes?operByLot.keywordRes[el.code]:"");
                if(util.isJSON4object(el.values)) {
                    try{
                        let obj = el.values;
                        res = `<label class='subkey'> ${el.name}</label><select class='subkey' data-code='${el.code}' >
                        ${Object.keys(obj).map(ell => {
                            let selected = (ell == defVal?'selected':'')
                            return `<option ${selected} value='${ell}'>${obj[ell]}</option>`}).join('')}
                        </select>`
                    }catch(e){
                        res = `<label class='subkey'> ${el.name}</label><input class='subkey' data-code='${el.code}' value='${defVal}' />`
                    }
                } else if(el.type && el.type=='time'){
                    res =  `<label class='subkey'>${el.name}</label>
                            <input class='subkey pri  time' name="startTime"  data-code='${el.code}' value='' />--<input class='subkey pri  time' name="endTime"  data-code='${el.code}' value='' />`
                      // res = `<label class='subkey'>${el.name}</label><input class='subkey pri time' data-code='${el.code}' value='' />`
                  }else {
                res = `<label class='subkey'> ${el.name}</label><input class='subkey' data-code='${el.code}' value='${defVal}' />`
                }
                return res
            }).join('')}<p class='rank_line'>*属性级*</p>
                ${subKeys.map(el => {
                    let res = '';
                    let defVal = (el.code in operByLot.keywordRes?operByLot.keywordRes[el.code]:"");
                    if(util.isJSON4object(el.values)) {
                        try{
                            let obj = el.values;
                            res = `<label class='subkey'> ${el.name}</label><select class='subkey' data-code='${el.code}' >
                            ${Object.keys(obj).map(ell => {
                                let selected = (ell == defVal?'selected':'')
                                return `<option ${selected} value='${ell}'>${obj[ell]}</option>`}).join('')}
                            </select>`
                        }catch(e){
                            res = `<label class='subkey'> ${el.name}</label><input class='subkey' data-code='${el.code}' value='${defVal}' />`
                        }
                    } else {
                    res = `<label class='subkey'> ${el.name}</label><input class='subkey' data-code='${el.code}' value='${defVal}' />`
                    }
                    return res
                }).join('')}`
 
        $('.operByLot .keywordDiv').html(_html);
        operByLot._cusSelected = {}
    },
    cls: function(){
        $('.operByLot').css('display','none')
    },
    cuscls:function(){
        $('.cusResult').css('display','none')
    },
    eventBind: function(){
        $('#operByLot').on('change','input.subkey,select.subkey', function(){
            let v = $(this).val();
            let k = $(this).attr('data-code');
            if(v=='0' || !v){
              delete  operByLot.keywordRes[k]
            }else if(v){
                operByLot.keywordRes[k] = v; 
            }
        })  
        let aTags =  $('#operByLot a.tabTools');
         aTags.each(function(){
            let evtName1 = $(this)[0].className.split(' ')[0];
            $(this).on('click',operByLot[evtName1]);
         })
         let subTags =  $('#operByLot div.fnDiv  div.btn-group .subTabTools');
         subTags.each(function(){
            let evtName2 = $(this)[0].className.split(' ')[0];
            $(this).on('click',operByLot[evtName2]);
         })
    }
}
