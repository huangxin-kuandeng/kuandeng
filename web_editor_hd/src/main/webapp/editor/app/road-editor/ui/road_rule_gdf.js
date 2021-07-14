/*
 * GDF时间转化
 *  1. 将GDF转化为字段结构  iD.convertGDFToInfo
 *  2. 将字段结构转化为GDF  iD.convertInfoToGDF
 */

//比较时间是否有重叠
iD.compareTimeOverlap = function (typeA, typeB, timeA, timeB) {

    //hh:mm 转化为 数组[hh, mm]
    function strToHourMinute(str) {
        var parts = str.split(':');
        var hh_mm = [] ;
        hh_mm[0] = parseInt(parts[0]) ;
        hh_mm[1] = parseInt(parts[1]) ;
        return hh_mm ;
    }

    //"start":"09:00","end":"12:00"
    //start <= end
    function lessThan(start,end) {

        var hh_mm_1 = strToHourMinute(start) ;
        var hh_mm_2 = strToHourMinute(end) ;

        if (hh_mm_1[0] < hh_mm_2[0]) {
            return true ;
        }else if (hh_mm_1[0] == hh_mm_2[0] && hh_mm_1[1] <= hh_mm_2[1]) {
            return true ;
        }
        return false ;
    }

    function isTimeOverlap(rA, range) {
        if (range.some(function(r) {
                if (!(lessThan(r.end,rA.start) || lessThan(rA.end, r.start)))  {
                    return true;
                }
            })) {
            return true ;
        }
        return false ;
    }

    //判断时间段
   function isTimeRangeOver(timeRangeA, timeRangeB) {
        if (timeRangeA.some(function(r) {
                if (isTimeOverlap(r, timeRangeB)) {
                    return true;
                }
            })) {
            return true ;
        }
        return false ;
    }

    //日期(Month-Day)
    function strToMonthDay(data) {
        var parts = data.split('-');
        var hh_mm = [] ;
        hh_mm[0] = parseInt(parts[0]) ;
        hh_mm[1] = parseInt(parts[1]) ;
        return hh_mm ;
    }

    //比较日期
    function lessThanData(mm_dd_1, mm_dd_2){
        if (mm_dd_1[0] < mm_dd_2[0]) {
            return true ;
        }
        else if (mm_dd_1[0] == mm_dd_2[0]) {
            if (mm_dd_1[1] <= mm_dd_2[1]) {
                return true ;
            }
        }
        return false ;
    }
    function isDataOverlap(dateA, dateB){

        //起始时间
        var mm_dd_1 = strToMonthDay(dateA.start) ;
        var mm_dd_2 = strToMonthDay(dateA.end) ;

        //起始时间
        var mm_dd_3 = strToMonthDay(dateB.start) ;
        var mm_dd_4 = strToMonthDay(dateB.end) ;

        //if (mm_dd_2  <= mm_dd_3)
        if (lessThanData(mm_dd_2, mm_dd_3) || lessThanData(mm_dd_3, mm_dd_1))
            return false ;

        return true ;
    }

    // undefined 未定义, overlap 重叠, separate 不重叠
    //判断日期
    function isDataRangeOver(dateRangeA, dateRangeB) {
        if (dateRangeA.length == 0 && dateRangeB.length == 0)  {
            return "undefined" ;
        }
        else if (dateRangeA.length == 0 || dateRangeB.length == 0)  {
            return "separate" ;
        }
        //判断日期是否重叠
        for (var a=0; a<dateRangeA.length; a++) {
            for (var b=0; b<dateRangeB.length; b++) {
                if (isDataOverlap(dateRangeA[a], dateRangeB[b]))
                    return "overlap" ;
            }
        }
        return "separate" ;
    }

    function isSeasonOver(seasonA, seasonB){
        if (seasonA.length == 0 && seasonB.length == 0)  {
            return "undefined" ;
        }
        else if (seasonA.length == 0 || seasonB.length == 0)  {
            return "separate" ;
        }
        //判断日期是否重叠
        for (var a=0; a<seasonA.length; a++) {
            for (var b=0; b<seasonB.length; b++) {
                if (seasonA[a] == seasonB[b])
                    return "overlap" ;
            }
        }
        return "separate" ;
    }
    function isWeekDayOver(weekDayA, weekDayB){
        if (weekDayA.length == 0 && weekDayB.length == 0)  {
            return "undefined" ;
        }
        else if (weekDayA.length == 0 || weekDayB.length == 0)  {
            return "separate" ;
        }
        //判断星期是否重叠
        for (var a=0; a<weekDayA.length; a++) {
            for (var b=0; b<weekDayB.length; b++) {
                if (weekDayA[a] == weekDayB[b])
                    return "overlap" ;
            }
        }
        return "separate" ;
    }
    function isHolidayOver(holidayA, holidayB){
        if (holidayA == holidayB )  {
            return "overlap" ;
        }
        return "separate" ;
    }

    var bTime = isTimeRangeOver(timeA.timeRange, timeB.timeRange),
        bData = isDataRangeOver(timeA.dateRange, timeB.dateRange),
        bSeason = isSeasonOver(timeA.season, timeB.season),
        bWeek = isWeekDayOver(timeA.weekDay, timeB.weekDay),
        bHoliday = isHolidayOver(timeA.holiday, timeB.holiday) ;

    if (!bTime)
        return false;

    if (bData == "separate")
        return false;

    if (bSeason == "separate")
        return false;

    if (bWeek == "separate")
        return false;

    if (bHoliday == "separate")
        return false;

    // 0 明示
    // 1 (强制信息)
    // 2 门禁
    //强制非24小时可以与推荐同时存在
    if ((typeA==0 && typeB==1) || (typeA==1 && typeB==0) ||
         (typeA==2 && typeB==1) || (typeA==1 && typeB==2))
        return false ;

    return true ;
}

//将GDF转化为字段结构
//{    "timeRange":[{"start":"00:00","end":"23:59"}],
//    "dateRange":[{"start":"1-1","end":"12-31"}],
//    "weekDay":["2","6"],
//    "season":["spring","summer","autumn","winter","dry","rainy"],
//    "holiday":"1"};
iD.convertGDFToInfo = function (gdfTime) {

    function IsNumber(ch) {
        switch (ch) {
            case '0' :
            case '1' :
            case '2' :
            case '3' :
            case '4' :
            case '5' :
            case '6' :
            case '7' :
            case '8' :
            case '9' :
                return true ;
        }
        return false ;
    }
    //h13m30
    function strToHourMinute(str) {
        var time = [], count=0 ;
        var ch, sub, hour, minute ;
        for (var i = 0; i < str.length; i++) {
            ch = str.charAt(i);
            if (ch=='h') {
                sub = undefined ; count = 1 ;
            } else if (ch=='m') {
                if (count==1) {
                    hour = sub ;
                }
                sub = undefined ; count = 2 ;
            } else if (IsNumber(ch)) {
                if (count>0) {
                    if (sub == undefined)
                        sub = ch ;
                    else
                        sub+=ch ;
                }
            } else {
                if (count==1) {
                    hour = sub ;
                } else if (count==2) {
                    minute = sub ;
                }
                sub = undefined ;count++ ;
            }
        }
        if (count==1) {
            hour = sub ;
        }
        else if (count==2) {
            minute = sub ;
        }

        if (hour==undefined)
            time[0] = 0 ;
        else
            time[0] = parseInt(hour) ;

        if (minute==undefined)
            time[1] = 0 ;
        else
            time[1] = parseInt(minute) ;

        return time ;
    }

    //计算终止时间
    function ComputerEndTime(start_t, end_t) {
        if (start_t==undefined || end_t == undefined) {
            return false ;
        }
        var hour = start_t[0] + end_t[0] ;
        var minute = start_t[1] + end_t[1] ;
        if (minute >= 60)
        {
            minute -= 60 ;
            hour += 1 ;
        }
        if (hour==24 && minute==0) {
            //empty code here
        }
        else if (hour >= 24 ) {
            hour -= 24 ;
        }
        end_t[0] = hour ;
        end_t[1] = minute ;
        return true ;
    }
    //00:00
    function arrToTime(start_t) {
        var time;
        if (start_t[0]<10) {
            time = '0'+ start_t[0] ;
        }
        else {
            time = start_t[0].toString() ;
        }
        time+=':' ;
        if (start_t[1]<10) {
            time += '0'+ start_t[1] ;
        }
        else {
            time += start_t[1].toString() ;
        }
        return time ;
    }

    //[(h9){h3}] -> {"start":"09:00","end":"12:00"}
    //[(h13m30){h5m30}] -> {"start":"12:30","end":"19:00"}   //13:30至19:00
    function strToTime(str,hourminue) {
        var start_t, end_t, sub ;
        //起始时间
        var first = str.indexOf('('),
            last  = str.indexOf(')');
        if (first>=0 && last>=0) {
            sub = str.slice(first+1, last) ;
            start_t = strToHourMinute(sub) ;
        }

        //间隔时间
        first = str.indexOf('{'),
        last  = str.indexOf('}');
        if (first>=0 && last>=0) {
            sub = str.slice(first+1, last) ;
            end_t = strToHourMinute(sub) ;
        }

        //计算终止时间
        if (ComputerEndTime(start_t, end_t)) {
            var time = {"start": arrToTime(start_t),"end":arrToTime(end_t)};
            hourminue.push(time) ;
        }
    }

    //时间段 [(h9){h3}]
    function gdfToTimeRange(gdfTime) {
        var hourminue = [] ;
        var first = gdfTime.indexOf('[(h'), last, str ;
        while (first>=0) {
            last = gdfTime.indexOf(']', first);
            if (last==-1)
                break ;

            str = gdfTime.slice(first, last+1) ;
            //转化为时间
            strToTime(str, hourminue);
            first = gdfTime.indexOf('[(h', last);
        }
        return hourminue ;
    }

    //计算终止日期
    function ComputerEndDate(start_t, end_t) {
        if (start_t==undefined || end_t == undefined) {
            return false ;
        }
        var days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] ;

        var month = start_t[0] + end_t[0] ;
        var day   = start_t[1] + end_t[1] - 1 ;

        if (day > days[month-1])
        {
            day = end_t[1] - (days[start_t[0]-1] - start_t[1]) ;
            month += 1 ;
        }
        if (month > 12 ) {
            month -= 12 ;
        }
        end_t[0] = month ;
        end_t[1] = day ;
        return true ;
    }
    //00-00
    function arrToDate(start_t) {
        var data =  start_t[0].toString() + '-' + start_t[1].toString();
        return data ;
    }
    //[(M4d1){M8}]
    function strToMonthDay(str) {
        var date = [], count=0 ;
        var ch, sub, month, day ;
        for (var i = 0; i < str.length; i++) {
            ch = str.charAt(i);
            if (ch=='M') {
                sub = undefined ; count = 1 ;
            } else if (ch=='d') {
                if (count==1) {
                    month = sub ;
                }
                sub = undefined ; count = 2 ;
            } else if (IsNumber(ch)) {
                if (count>0) {
                    if (sub == undefined)
                        sub = ch ;
                    else
                        sub+=ch ;
                }
            } else {
                if (count==1) {
                    month = sub ;
                } else if (count==2) {
                    day = sub ;
                }
                sub = undefined ;count++ ;
            }
        }
        if (count==1) {
            month = sub ;
        }
        else if (count==2) {
            day = sub ;
        }

        if (month==undefined)
            date[0] = 0 ;
        else
            date[0] = parseInt(month) ;

        if (day==undefined)
            date[1] = 0 ;
        else
            date[1] = parseInt(day) ;
        return date ;
    }

    //日期 (Month-day)  [(M4d1){M8}]
    function strToDate(str, monthday) {
        var start_t, end_t, sub ;
        //起始时间
        var first = str.indexOf('('),
            last  = str.indexOf(')');
        if (first>=0 && last>=0) {
            sub = str.slice(first+1, last) ;
            start_t = strToMonthDay(sub) ;
        }

        //间隔时间
        first = str.indexOf('{'),
            last  = str.indexOf('}');
        if (first>=0 && last>=0) {
            sub = str.slice(first+1, last) ;
            end_t = strToMonthDay(sub) ;
        }

        //计算终止时间
        if (ComputerEndDate(start_t, end_t)) {
            //var time = {"start":"1-1","end":"12-31"};
            var time = {"start": arrToDate(start_t),"end":arrToDate(end_t)};
            monthday.push(time) ;
        }
    }

    function gdfToDataRange(gdfTime){
        var monthday = [] ;
        var first = gdfTime.indexOf('[(M'), last, str ;
        while (first>=0) {
            last = gdfTime.indexOf(']', first);
            if (last==-1)
                break ;

            //转化为时间
            str = gdfTime.slice(first, last+1) ;
            strToDate(str, monthday) ;
            first = gdfTime.indexOf('[(M', last);
        }
        return monthday ;
    }
    //星期 ()
    //1,2,3,4,5,6,7
    //t定义每周的星期。取值：1-星期日、2-星期一、……7-星期六。例：(t2)表示星期一
    //持续天数。{d7}={w1}
    //(t7){d2}
    function strToWeekStart(str) {
        var count=0 ;
        var ch, sub, week ;
        for (var i = 0; i < str.length; i++) {
            ch = str.charAt(i);
            if (ch=='t') {
                sub = undefined ; count = 1 ;
            } else if (IsNumber(ch)) {
                if (count>0) {
                    if (sub == undefined)
                        sub = ch ;
                    else
                        sub+=ch ;
                }
            } else {
                if (count==1) {
                    week = sub ;
                }
                sub = undefined ;count++ ;
            }
        }
        if (count==1) {
            week = sub ;
        }

        if (week==undefined)
            return undefined ;
        else
            return parseInt(week) ;
    }
    function strToWeekDuration(str) {
        var count=0 ;
        var ch, sub, week ;
        for (var i = 0; i < str.length; i++) {
            ch = str.charAt(i);
            if (ch=='d') {
                sub = undefined ; count = 1 ;
            } else if (IsNumber(ch)) {
                if (count>0) {
                    if (sub == undefined)
                        sub = ch ;
                    else
                        sub+=ch ;
                }
            } else {
                if (count==1) {
                    week = sub ;
                }
                sub = undefined ;count++ ;
            }
        }
        if (count==1) {
            week = sub ;
        }
        if (week==undefined)
            return undefined ;
        else
            return parseInt(week) ;
    }
    function strToWeekDay(start_t,dur,week) {
        var day ;
        for (var i=0; i<dur; i++) {
            day = start_t + i - 1;
            if (day>7)  day-=7 ;
            else if (day==0) day = 7 ;
            week.push(day.toString()) ;
        }
    }
    function strToWeek(str,week){
        //week.push("1") ;
        var start_t, dur, sub ;
        //起始时间
        var first = str.indexOf('('),
            last  = str.indexOf(')');
        if (first>=0 && last>=0) {
            sub = str.slice(first+1, last) ;
            start_t = strToWeekStart(sub) ;
        }

        //间隔时间
        first = str.indexOf('{'),
        last  = str.indexOf('}');
        if (start_t!=undefined && first>=0 && last>=0) {
            sub = str.slice(first+1, last) ;
            dur = strToWeekDuration(sub) ;
            strToWeekDay(start_t,dur,week) ;
        }
    }

    function gdfToWeekDay(gdfTime){
        var week = [] ;
        var first = gdfTime.indexOf('[(t'), last, str ;
        while (first>=0) {
            last = gdfTime.indexOf(']', first);
            if (last==-1)
                break ;

            //转化为时间
            str = gdfTime.slice(first, last+1) ; //[(t1){d3}]
            strToWeek(str,week) ;
            first = gdfTime.indexOf('[(t', last);
        }
        return week ;
    }

    //节假日 ()
    function gdfToHoliday(gdfTime){
        var pos = gdfTime.indexOf('-[(z4){z54}]') ;
        if (pos>=0) {
            return '2' ;
        }
        pos = gdfTime.indexOf('[(z4){z54}]') ;
        if (pos>=0) {
            return '1' ;
        }
        return '0' ;
    }
    //季节 ()
    function gdfToSeason(gdfTime){
        var seasons = [] ;
        var pos = gdfTime.indexOf('[(z5){z55}]') ;
        if (pos!=-1) {
            seasons.push("spring") ;
        }
        pos = gdfTime.indexOf('[(z6){z56}]') ;
        if (pos!=-1) {
            seasons.push("summer") ;
        }
        pos = gdfTime.indexOf('[(z7){z57}]') ;
        if (pos!=-1) {
            seasons.push("autumn") ;
        }
        pos = gdfTime.indexOf('[(z8){z58}]') ;
        if (pos!=-1) {
            seasons.push("winter") ;
        }
        pos = gdfTime.indexOf('[(z14){z64}]') ;
        if (pos!=-1) {
            seasons.push("dry") ;
        }
        pos = gdfTime.indexOf('[(z13){z63}]') ;
        if (pos!=-1) {
            seasons.push("rainy") ;
        }
        return seasons ;
    }

    var info = {};
    //时间段
    info.timeRange = gdfToTimeRange(gdfTime);
    //日期
    info.dateRange = gdfToDataRange(gdfTime);
    //节假日
    info.holiday = gdfToHoliday(gdfTime);
    //星期
    info.weekDay = gdfToWeekDay(gdfTime);
    //季节
    info.season = gdfToSeason(gdfTime);

    return info ;
}

//将字段结构转化为GDF
iD.convertInfoToGDF = function (timeInfo) {

    //将字符串加入到 total 后面
    function addMultiply(str1, str2) {
        if (str1 == undefined) {
            return str2 ;
        }
        if (str2 == undefined) {
            return str1 ;
        }
        return str1 +'*' + str2 ;
    }

    function addPlus(str1, str2) {
        if (str1 == undefined) {
            return str2 ;
        }
        if (str2 == undefined) {
            return str1 ;
        }
        return str1 +'+' + str2 ;
    }

    function addTail(str1, str2) {
        if (str1 == undefined) {
            return str2 ;
        }
        if (str2 == undefined) {
            return str1 ;
        }
        return str1 + str2 ;
    }

    function addCommon(str) {
        if (str == undefined) {
            return str ;
        }
        return '[' + str + ']' ;
    }

    //生成一个字节的GDF时间
    //[(start){duration}]
    function toGDFStr(start, duration) {
        return '[(' + start + '){' + duration + '}]'; ;
    }

    //hh:mm 转化为 数组[hh, mm]
    function strToHourMinute(str) {
        var parts = str.split(':');
        var hh_mm = [] ;
        hh_mm[0] = parseInt(parts[0]) ;
        hh_mm[1] = parseInt(parts[1]) ;
        return hh_mm ;
    }

    //计算持续时间(hour-minute)
    function timeToDuration(hh_mm_1,hh_mm_2) {
        var hh_mm = [] ;
        if (hh_mm_1[0] < hh_mm_2[0]) {
            if (hh_mm_1[1] <= hh_mm_2[1]) {           //00:20 -- 00:50
                hh_mm[0] = hh_mm_2[0] - hh_mm_1[0] ;
                hh_mm[1] = hh_mm_2[1] - hh_mm_1[1];
            }
            else {  //00:50 -- 01:20
                hh_mm[0] = hh_mm_2[0] - hh_mm_1[0] - 1 ;
                hh_mm[1] = 60 - hh_mm_1[1] + hh_mm_2[1];
            }
        }
        else if (hh_mm_1[0] == hh_mm_2[0]){
            if (hh_mm_1[1] <= hh_mm_2[1]) {           //00:20 -- 00:50
                hh_mm[0] = 0 ;
                hh_mm[1] = hh_mm_2[1] - hh_mm_1[1];
            }
            else {       //00:50 -- 00:20
                hh_mm[0] = 24 ;
                hh_mm[1] = hh_mm_2[1] + 60 - hh_mm_1[1];
            }
        } else { //if (hh_mm_1[0] > hh_mm_2[0])
            if (hh_mm_1[1] <= hh_mm_2[1]) {           //23:20 -- 00:50
                hh_mm[0] = 24 - hh_mm_1[0] + hh_mm_2[0] ;
                hh_mm[1] = hh_mm_2[1] - hh_mm_1[1];
            }
            else {       //23:50 -- 00:20   22:50 -- 3:20
                hh_mm[0] = 24 - hh_mm_1[0] + hh_mm_2[0] - 1;
                hh_mm[1] = 60 - hh_mm_1[1] + hh_mm_2[1];
            }
        }
        return hh_mm ;
    }

    //hh:mm
    //9:00至12:00   [(h9){h3}]
    //13:30至19:00  [(h13m30){h5m30}]
    function timeToGDF(start, end) {
        //起始时间
        var hh_mm_1 = strToHourMinute(start) ;
        var hh_mm_2 = strToHourMinute(end) ;

        //终止时间
        var hh_mm_3 = timeToDuration(hh_mm_1,hh_mm_2);

        //[(h13m30){h5m30}]
        var start_time = 'h'+hh_mm_1[0] ;
        if (hh_mm_1[1]>0)
            start_time += 'm'+hh_mm_1[1] ;

        var duration = 'h'+hh_mm_3[0] ;
        if (hh_mm_3[1]>0)
            duration += 'm'+hh_mm_3[1] ;

        return toGDFStr(start_time, duration);
    }

    //时间(hour:minute)
    function timeRangeToGDF(timeRange){
        var gdf, val ;
        for (var i=0; i<timeRange.length; i++){
            val = timeToGDF(timeRange[i].start,timeRange[i].end);
            gdf = addPlus(gdf,val) ;
        }
        if (i>1){
            gdf = addCommon(gdf) ;
        }
        return gdf ;
    }

    //日期(Month-Day)
    function strToMonthDay(data) {
        var parts = data.split('-');
        var hh_mm = [] ;
        hh_mm[0] = parseInt(parts[0]) ;
        hh_mm[1] = parseInt(parts[1]) ;
        return hh_mm ;
    }

    //计算持续时间(Month-day)
    function dataDuration(mm_dd_1,mm_dd_2) {
        var days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] ;
        var mm_dd = [] ;
        if (mm_dd_1[0] < mm_dd_2[0]) {
            if (mm_dd_1[1] <= mm_dd_2[1]) {  //01:05 -- 05:20
                mm_dd[0] = mm_dd_2[0] - mm_dd_1[0] ;
                mm_dd[1] = mm_dd_2[1] - mm_dd_1[1] ;
            }
            else { //01:25 -- 05:10
                mm_dd[0] = mm_dd_2[0] - mm_dd_1[0] - 1 ;
                mm_dd[1] = days[mm_dd_1[0]-1] - mm_dd_1[1] + mm_dd_2[1];
            }
        }
        else if (mm_dd_1[0] == mm_dd_1[0]){
            if (mm_dd_1[1] <= mm_dd_1[1]) {  //01:05 -- 01:20
                mm_dd[0] = 0 ;
                mm_dd[1] = mm_dd_2[1] - mm_dd_1[1];
            }
            else {       //01:20 -- 01:10
                mm_dd[0] = 12 ;
                mm_dd[1] = days[mm_dd_1[0]-1] - mm_dd_1[1] + mm_dd_2[1];
            }
        } else { //if (mm_dd_1[0] > mm_dd_2[0])
            // 02:10 -- 01:20
            if (mm_dd_1[1] <= mm_dd_1[1]) {  //01:05 -- 01:20
                mm_dd[0] = 12 - mm_dd_1[0] + mm_dd_2[0] ;
                mm_dd[1] = mm_dd_2[1] - mm_dd_1[1];
            }
            else {     // 02:20 -- 01:10
                mm_dd[0] = 12 - mm_dd_1[0] + mm_dd_2[0] -1;
                mm_dd[1] = days[mm_dd_1[0]-1] - mm_dd_1[1] + mm_dd_2[1];
            }
        }

        mm_dd[1] += 1;

        return mm_dd ;
    }
    //MM:dd
    //4月1日至11月30日	[(M4d1){M8}]
    function dataToGDF(start, end) {
        //起始时间
        var mm_dd_1 = strToMonthDay(start) ;
        var mm_dd_2 = strToMonthDay(end) ;

        //终止时间
        var mm_dd_3 = dataDuration(mm_dd_1,mm_dd_2);

        //4月1日至11月30日	[(M4d1){M8}]
        var start_md  = 'M'+mm_dd_1[0] + 'd'+mm_dd_1[1] ;
        //
        var duration  ;
        if (mm_dd_3[0]>0)
            duration  = 'M'+mm_dd_3[0] ;
        if (mm_dd_3[1]>0) {
            if (duration==undefined)
                duration = 'd'+mm_dd_3[1] ;
            else
                duration += 'd'+mm_dd_3[1] ;
        }
        if (duration==undefined)
            duration = 'd0';
        return toGDFStr(start_md, duration);
    }
    //日期
    function dataRangeToGDF(dateRange){
        var gdf, val ;
        for (var i=0; i<dateRange.length; i++){
            val = dataToGDF(dateRange[i].start,dateRange[i].end);
            gdf = addPlus(gdf,val) ;
        }
        if (i>1){
            gdf = addCommon(gdf) ;
        }
        return gdf ;
    }

    //1,2,3,4,5,6,7
    //t定义每周的星期。取值：1-星期日、2-星期一、……7-星期六。例：(t2)表示星期一
    //持续天数。{d7}={w1}
    function addWeekDay(prev, last) {
        var delta = last - prev + 1 ;
        if (delta!=7){
            prev++;
        }
        if (prev==8) {
            prev = 1 ;
        }
        return '[(t' + prev + '){d' + delta + '}]' ;
    }
    function weekDayToGDF(weekDay){
        var gdf, count=0;
        var prev,last, val, delta ;
        for (var i=0; i<weekDay.length; i++){
            val = parseInt(weekDay[i]);
            if (prev==undefined) {
                prev = val ;
                last = val ;
            } else {
                delta = val-last ;
                if (delta==1) {
                    last = val ;
                } else {
                    delta = addWeekDay(prev, last) ;
                    gdf = addPlus(gdf, delta) ;
                    prev = val ;
                    last = val ;
                    count++;
                }
            }
        }
        if (prev!=undefined) {
            delta = addWeekDay(prev, last);
            gdf = addPlus(gdf, delta);
            count++;
        }
        if (count>1){
            gdf = addCommon(gdf) ;
        }
        return gdf;
    }

    /*
     5-春季的开始    55-春季
     6-夏季的开始    56-夏季
     7-秋季的开始    57-秋季
     8-冬季的开始    58-冬季
     13-雨季/汛期的开始   63-雨季/汛期
     14-干季的开始。      64-干季
     */
    function seasonToGDFStr(season) {
        switch (season) {
            case "spring" : return '[(z5){z55}]';    break ;
            case "summer" : return '[(z6){z56}]';    break ;
            case "autumn" : return '[(z7){z57}]';    break ;
            case "winter" : return '[(z8){z58}]';    break ;
            case "dry"    : return '[(z14){z64}]';   break ;
            case "rainy"  : return '[(z13){z63}]';   break ;
        }
        return undefined ;
    }

    function seasonToGDF(season) {
        var gdf, val ;
        for (var i=0; i<season.length; i++){
            val = seasonToGDFStr(season[i]);
            gdf = addPlus(gdf,val) ;
        }
        if (i>1){
            gdf = addCommon(gdf) ;
        }
        return gdf;
    }

    //节假日 1   节假日除外2
    function holidayToGDF(holiday){
        var gdf ;
        if (holiday==1) {
            gdf = '[(z4){z54}]' ;
        } else if (holiday==2) {
            gdf = '-[(z4){z54}]' ;
        }
        return gdf;
    }

    //时间段
    var count = 0 ;
    if (timeInfo.timeRange) {
        var timeRange = timeRangeToGDF(timeInfo.timeRange);
        if (timeRange != undefined) {
            count++;
        }
    }

    //日期
    if (timeInfo.dateRange) {
        var dateRange = dataRangeToGDF(timeInfo.dateRange);
        if (dateRange != undefined) {
            timeRange = addMultiply(timeRange, dateRange);
            count++;
        }
    }

    //星期
    if (timeInfo.weekDay) {
        var weekDay = weekDayToGDF(timeInfo.weekDay);
        if (weekDay != undefined) {
            timeRange = addMultiply(timeRange, weekDay);
            count++;
        }
    }

    //季节
    if (timeInfo.season) {
        var season = seasonToGDF(timeInfo.season);
        if (season != undefined) {
            timeRange = addMultiply(timeRange, season);
            count++;
        }
    }

    //节假日
    if (timeInfo.holiday) {
        var holiday = holidayToGDF(timeInfo.holiday);
        if (holiday != undefined) {
            if (timeInfo.holiday == 1)
                timeRange = addMultiply(timeRange, holiday);
            else
                timeRange = addTail(timeRange, holiday);
            count++;
        }
    }

    if (count>1){
        timeRange = addCommon(timeRange) ;
    }

    return timeRange ;
};

/*
 * GDF 转化函数 单元测试
 */
iD.gdfTest1 = function() {

    var info = {
        "timeRange": [{"start": "00:00", "end": "02:59"}, {"start": "03:00", "end": "23:59"}],
        "dateRange": [{"start": "1-1", "end": "3-31"}, {"start": "5-25", "end": "8-18"}, {
            "start": "9-20",
            "end": "10-10"
        }],
        "weekDay": ["2", "6", "7"],
        "season": ["summer", "autumn"],
        "holiday": "2"
    };

    //to GDF
    var gdftime = iD.convertInfoToGDF(info);

    //to Info
    var result = iD.convertGDFToInfo(gdftime);

    gdftime += '----[]' ;
}
iD.gdfTest2 = function() {

    var info = {
        "timeRange":[{"start":"00:00","end":"23:59"}],
        "dateRange":[{"start":"1-1","end":"12-31"}],
        "weekDay":["2","6"],
        "season":["spring","summer","autumn","winter","dry","rainy"],
        "holiday":"1"};

    //to GDF
    var gdftime = iD.convertInfoToGDF(info);

    //to Info
    var result = iD.convertGDFToInfo(gdftime);

    gdftime += '----[]' ;
}

iD.gdfTest = function(info) {

    //to GDF
    var gdftime = iD.convertInfoToGDF(info);

    //to Info
    var result = iD.convertGDFToInfo(gdftime);

    gdftime += '----[]' ;
}

iD.gdfTest_1 = function() {

    var info = {
        "timeRange": [],
        "dateRange": [{"start": "2-26", "end": "3-8"}, {"start": "1-29", "end": "2-27"}],
        "weekDay": ["2", "6", "7"],
        "season": ["summer", "autumn"],
        "holiday": "2"
    };
    iD.gdfTest(info) ;
}

//单元测试
iD.testGDF = function() {

    iD.gdfTest_1() ;
    iD.gdfTest1() ;
    iD.gdfTest2() ;

}