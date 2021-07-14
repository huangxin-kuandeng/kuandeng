;;(function (iD) {
	iD = iD || {};


    //自检地址
    //var autoCheck = 'http://100.69.180.43:11080/gts/task/autocheck.do?';

    //报告地址
    //var chkReportUrl="http://10.61.73.25:5002/check/get_reports?";

    //报告地址
    //var uptReportUrl= "http://10.61.73.25:5002/check/update_report_status?";

    var layer_check_list ={
        "NODE" :      iD.data.Constant.ROADNODE,
        "CROSS":      iD.data.Constant.C_NODE,
        "REL_CROSS_NODE" : "RoadNode",
        "REL_N_MAAT": "NodeMaat",
        "REL_C_MAAT" :"CrossMaat",
        "SAPA":"Sapa",
        "ZLEVEL" :	"ZLevel",
        "PLACE_NAME"  	:	"PlaceName",
        "FORBID_INFO"  	:	"ForbidInfo",
        "FORBID_INFO_C" 	:	"ForbidInfoC",
        "TURN_GUIDANCE" 	:	"TurnGuidance",
        "REL_N_SAAT"  	:	"NODEINFO",
        "REL_C_SAAT"  	:	"C_NODEINFO",
        "ROAD_RULE"   	:	"RoadRule"
        };

	iD.Check = {
		startCheck: function(taskId,transId, callback) {
			var self = this;
			if (!iD.User.getInfo()) {
				console.error('not login');
				return;
			}
            var WS = iD.Service.WS;
            WS.send("check","userID=" + iD.User.getInfo().userid +"&transID="+transId+"&taskID="+taskId);
            WS.on("check",function(d)
            {
                callback(d);

            });
		},
        startCheck2: function(taskId,transId, callback) {
            if (!iD.User.getInfo()) {
                console.error('not login');
                return;
            }

            var url = iD.config.URL.gts_url + '/task/autocheck.do?userID=' + iD.User.getInfo().userid + '&transID=' + transId+"&taskID="+taskId;
            return d3.json(url, function(error, data) {
                var  msg = "";
                if (error) {
                    msg = "调用自检服务失败。"
                    console.error(msg);
                }
                else if (data&& data.status != 0) {
                    msg = data.desc;
                    console.error(msg);
                }
                else if(data.chk_trans_id &&data.chk_trans_id) {
                    iD.Task.d.chk_trans_id = data.chk_trans_id;
                    iD.Task.working.chk_trans_id = data.chk_trans_id;
                }
                callback && callback(msg);
            });
        },

        updateReport:function(task,report,rptId,status)
        {
            var report_status = [
                {
                    "rep_id" : parseInt(rptId),
                    "chk_id" : report.chk_id,
                    "err_id" : report.err_id,
                    "status" : parseInt(status),
                    "layer"  : report.layer,
                    "feat_id":parseInt(report.ID),
                    "reason" : ""

                }];
            JSON.stringify()
            var url = iD.config.URL.chk_url + "/update_report_status?trans_id="+task.chk_trans_id+"&report_status="+JSON.stringify(report_status);
            d3.json(url).post();
            //d3.json(url).post(function(error, data) {
            //    error&& Dialog.alert("报告状态更新错误。");
            //    data&&data.update_status==0&&  Dialog.alert("报告状态更新成功。");
            //    data&&data.update_status==1&&Dialog.alert("报告状态更新失败，请与管理员联系。");
            //})
        },
        checkReport:function(context,msg)
        {
            if(!iD.reports)  return true ;
            for(var i in iD.reports)
            {
                if(iD.reports[i].status ==0) {
                    Dialog.alert(msg);
                    return false;
                }
            }
            return true;
        },
        lightEntity:function(context,report)
        {

            var layers = iD.config.allLayerIds,
                ids=[],
                reportId;
            if (typeof report.ext_info ==  'object' &&
                typeof report.ext_info.id_locate != 'undefined'){
                reportId = report.ext_info.id_locate ;
            }else {
                reportId = report.ID ;
            }
            //TODO 这块可能会有问题
            console.error('----','图层处理有问题')
            for(var i in layers) {
                ids.push("w"+layers[i]+"_"+reportId);
                ids.push("n"+layers[i]+"_"+reportId);
                //ids.push("r"+layers[i]+"_"+reportId);
            }

            try {
                //先定位
                if (!report.x || !report.y)
                {
                    console.warn("报告经度、维度数据不正确，x="+report.x+",y="+report.y+",无法定位。");
                    return ;
                }
                var loc = [report.x, report.y];
                context.map().center(loc);
                for(var i in ids) {
                        editor.lightEntity(ids[i]);
                }
            }  catch (e)
            {

            }



        }
	}
})(iD);