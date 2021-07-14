iD.ui.TagEditor.autoassign =iD.ui.TagEditor.autoassign||{};
iD.ui.TagEditor.autoassign.road = function(tags){
	var isNull = function(k){
		var r = true;
		if(typeof tags[k] != 'undefined'
			&& tags[k] != ""){
			r = false;
		}
		return r;
	}
	var road_class_lc_fc = {
		"41000":["4","1"],
		"42000":["4","2"],
		"43000":["4","2"],
		"44000":["1","4"],
		"45000":["1","5"],
		"47000":["0","6"],
		"51000":["2","3"],
		"52000":["1","5"],
		"53000":["1","5"],
		"54000":["0","6"],
		"49":   ["0","6"],
		"100":  ["0","6"]
	}
	
	if(!isNull('link_type')&&tags['link_type']=='1'){//轮渡航线
		//if(isNull('road_class')){
			tags['road_class'] = '45000';
		//}
		//if(isNull('direction')){
			tags['direction'] = '1';
		//}
		//if(isNull('FORM_WAY')){
			tags['FORM_WAY'] = '15';
		//}
	}
	if(!isNull('direction')&&tags['direction']=='4'){//步行街
		//if(isNull('FORM_WAY')){
			tags['FORM_WAY'] = '15';
		//}
		//if(isNull('link_type')){
			tags['link_type'] = '0';
		//}
		//if(isNull('owner_ship')){
			tags['owner_ship'] = '0';
		//}
		//if(isNull('status')){
			tags['status'] = '0';
		//}
	}
	if(!isNull('road_class')&&(tags['road_class']=='41000'||tags['road_class']=='43000')){//步行街
		//if(isNull('owner_ship')){
			tags['owner_ship'] = '0';
		//}
		//if(isNull('paver')){
			tags['paver'] = '2';
		//}
	}
	if(!isNull('road_class')&&(tags['road_class']=='41000')){//步行街
		//if(isNull('toll')){
			tags['toll'] = '1';
		//}
	}

    //NO.2
    if(!isNull('road_class') && isNull('fc')){
        // if(isNull('fc')){
        tags.fc = road_class_lc_fc[tags['road_class']][1];//FC
        // }
    }
    if(!isNull('road_class')){
        // if(isNull('lc_1')){
        tags['lc_1'] = road_class_lc_fc[tags['road_class']][0];
        // }
        // if(isNull('lc_2')){
        tags['lc_2'] = road_class_lc_fc[tags['road_class']][0];
        // }
    }

    //fow
	// 1)      link_type=1，轮渡航线，由软件直接对应为-1；
	// 2)      FORM_WAY=4，环岛，ta同目前母库定义和取值，由软件直接对应为fow=4；
	// 3)      FORM_WAY=5，服务区道路，ta范畴大于母库范畴，由软件对应为fow=12；

	// 4)      direction=4（步行街）&road_class<>100，ta同目前母库定义和取值，由软件直接对应为fow=14；
	// 5)      owner_ship=4/5（地下停车场、立体停车场），ta范畴大于母库范畴，由软件对应为fow=7；

	// 6)      FORM_WAY=1 & road_class=41000，且不在intersection\freewayintersection范围内，由软件直接对应fow=1；
	// 7)      FORM_WAY=1 & road_class<>41000，由软件直接对应fow=2；

	// 8)      FORM_WAY=11/12/13/14，软件对应为fow=103；
	// 9)      FORM_WAY=7，软件对应为fow=11；
	// 10)     其余未赋值道路，软件先行对应为fow=3。"

	//if(isNull('fow')){
		if(!isNull('link_type')&&tags['link_type']=='1'){
			tags['fow'] = '-1';
		}
		else if(!isNull('FORM_WAY')&&tags['FORM_WAY']=='4'){
			tags['fow'] = '4';
		}
		else if(!isNull('FORM_WAY')&&tags['FORM_WAY']=='5'){
			tags['fow'] = '12';
		}
		else if(!isNull('direction')&&tags['direction']=='4'
			&&!isNull('road_class')&&tags['road_class']!='100'){
			tags['fow'] = '14';
		}
		else if(!isNull('owner_ship')&&(tags['owner_ship']=='4'||tags['owner_ship']=='5')){
			tags['fow'] = '7';
		}
		else if(!isNull('FORM_WAY')){
			if(tags['FORM_WAY']=='1'
				&&!isNull('road_class')&&tags['road_class']=='41000'){
				tags['fow'] = '1';
			}
			else if(tags['FORM_WAY']=='1'
				&&!isNull('road_class')&&tags['road_class']!='41000'){
				tags['fow'] = '2';
			}
			else if(['11','12','13','14'].indexOf(tags['FORM_WAY'])>=0){
				tags['fow'] = '103';
			}
			else if(tags['FORM_WAY']=='7'){
				tags['fow'] = '11';
			}
            else {
                tags['fow'] = '3';//蛮狠的自动赋值。。。
            }
		}
        else {
            tags['fow'] = '3';//蛮狠的自动赋值。。。
        }
	//}

	// road_link	ave_lanes	平均车道数	"
	// if(isNull('ave_lanes')){
		if(!isNull('road_class') && !isNull('FORM_WAY')){
			// road_class=47000/54000/49，ave_lanes=1
			if(['47000','54000','49'].indexOf(tags['road_class'])>=0){
				tags['ave_lanes'] = '1';
			}
			// road_class≠47000/54000/49，FORM_WAY=16，ave_lanes=2
            else if(['47000','54000','49'].indexOf(tags['road_class'])<0 && tags['FORM_WAY']=='16'){
			    tags['ave_lanes'] = '2';
		    }
		    // road_class=45000，FORM_WAY=15，ave_lanes=1
            else if(tags['road_class']=='45000' && tags['FORM_WAY']=="15") {
                tags['ave_lanes'] = '1';
            }
            // road_class=45000，FORM_WAY=1/2/4/7，ave_lanes=2
			else if(tags['road_class']=='45000' && ['1','2','4','7'].indexOf(tags['FORM_WAY'])>=0){
			    tags['ave_lanes'] = '2';
		    }
		    // road_class=43000，FORM_WAY=1/2/4/7/15，ave_lanes=3
			else if(tags['road_class']=='43000' && ['1','2','4','7','15'].indexOf(tags['FORM_WAY'])>=0){
				tags['ave_lanes'] = '3';
			}
        	// road_class=41000/42000/44000/51000/52000/53000，FORM_WAY=1/2/4/7/15，ave_lanes=2
		    else if(['41000','42000','44000','51000','52000','53000'].indexOf(tags['road_class'])>=0
					&& ['1','2','4','7','15'].indexOf(tags['FORM_WAY'])>=0){
			    tags['ave_lanes'] = '2';
			}
			// road_class=41000/42000/43000/44000/51000/52000/53000，FORM_WAY=5/53/56/58，ave_lanes=1
			else if(['41000','42000','43000','44000','51000','52000','53000'].indexOf(tags['road_class'])>=0
					&&['5','53','56','58'].indexOf(tags['FORM_WAY'])>=0){
					tags['ave_lanes'] = '1';
			}
			// road_class=41000/43000，FORM_WAY=3、8，ave_lanes=2
			else if(['41000','43000'].indexOf(tags['road_class'])>=0
					&&['3','8'].indexOf(tags['FORM_WAY'])>=0){
					tags['ave_lanes'] = '2';
			}
			// road_class=41000/43000，FORM_WAY=6/9/10，ave_lanes=1
			else if(['41000','43000'].indexOf(tags['road_class'])>=0
					&&['6','9','10'].indexOf(tags['FORM_WAY'])>=0){
					tags['ave_lanes'] = '1';
			}
			// road_class=42000/44000/51000/52000/53000，FORM_WAY=3/6/8/9/10/11/12/13/14，ave_lanes=1
			else if(['42000','44000','51000','52000','53000'].indexOf(tags['road_class'])>=0
					&&['3','6','8','9','10','11','12','13','14'].indexOf(tags['FORM_WAY'])>=0){
			    tags['ave_lanes'] = '1';
			}
		}
		// 特殊：link_type=1，ave_lanes=1;
		if(!isNull('link_type')&&tags['link_type']=='1'){
			tags['ave_lanes'] = '1';
		}
		// 特殊：direction=4，ave_lanes=1;"
		if(!isNull('direction')&&tags['direction']=='4'){
			tags['ave_lanes'] = '1';
		}
	// }

    if ( (!isNull('road_class') && ['41000','43000'].indexOf(tags['road_class'])>=0)
        || (!isNull('FORM_WAY') && ['3','8','9','10','13','14'].indexOf(tags['FORM_WAY'])>=0)
        || (!isNull('owner_ship') && ['3','4'].indexOf(tags['owner_ship'])>=0)
        || (!isNull('u_line') && tags['u_line']=='1') ) {
        tags['navitype'] = '2';
    }

    //NO.3
	// road_link	width	道路宽度        
	// if(isNull('width')){
		// 1、road_class=41000/43000，width=ave_lanes*3.5；
		// 2、road_class≠41000/43000，width=ave_lanes*3；
		// 3、road_class=45000，FORM_WAY=15，ave_lanes=1，则width=6；
		if(!isNull('road_class')&&!isNull('ave_lanes'))
        {
			if(['41000','43000'].indexOf(tags['road_class'])>=0){
                var width = parseInt(tags['ave_lanes'])*3.5;
				tags['width'] = width.toString();
			}else if(['41000','43000'].indexOf(tags['road_class'])<0){
                var width = parseInt(tags['ave_lanes'])*3;
                tags['width'] = width.toString();
			}
			else if(tags['road_class']=='45000'
				&&!isNull('FORM_WAY')&&tags['FORM_WAY']=='15'
				&&tags['ave_lanes']=='1'){
				tags['width'] = '6';
			}
		}
		// 5、特殊情况：link_type=1-轮渡航线，width=3；"
		if(!isNull('link_type')&&tags['link_type']=='1'){
			tags['width'] = '3';
		}
		// 4、特殊情况：direction=4-步行街，width=3；
		if(!isNull('direction')&&tags['direction']=='4'){
			tags['width'] = '3';
		}
	// }

    //NO.4
	// road_link	p_lanes	正向车道数	详见《附3_正反向车道数赋值》sheet.
	// road_link	n_lanes	逆向车道数	详见《附3_正反向车道数赋值》sheet.
	if(!isNull('direction')&&!isNull('ave_lanes')){
		if(['1','4'].indexOf(tags['direction'])>=0){
			var obj = {
						'1':['1','1'],
						'2':['1','1'],
						'3':['2','1'],
						'4':['2','2'],
						'5':['3','2'],
						'6':['3','3'],
						'7':['4','3'],
						'8':['4','4'],
						'9':['5','4']
						}
			if(['1','2','3','4','5','6','7','8','9'].indexOf(tags['ave_lanes'])>=0){
				// if(isNull('p_lanes')){
					tags['p_lanes'] = obj[tags['ave_lanes']][0];
				//}
				// if(isNull('n_lanes')){
					tags['n_lanes'] = obj[tags['ave_lanes']][1];
				//}
			}

		}else if(tags['direction']=="2"){
				// if(isNull('p_lanes')){
					tags['p_lanes'] = tags['ave_lanes'];
				//}
				// if(isNull('n_lanes')){
					tags['n_lanes'] = '0';
				//}

		}else if(tags['direction']=="3"){
				// if(isNull('p_lanes')){
					tags['p_lanes'] = '0';
				//}
				// if(isNull('n_lanes')){
					tags['n_lanes'] = tags['ave_lanes'];
				//}
		}

	}

	return tags;
}