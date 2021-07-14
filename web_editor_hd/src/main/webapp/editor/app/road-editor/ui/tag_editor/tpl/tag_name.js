iD.ui.TagName = {};

iD.ui.TagName.isObjectEmpty = function (obj) {
    if (typeof obj === "object" && !(obj instanceof Array)) {
        var hasProp = false;
        for (var prop in obj) {
            hasProp = true;
            break;
        }
        return hasProp;
    }
    return false;
}

//自动从半角转全角
iD.ui.TagName.SBC = function (text) {
    return text.replace(/[\x20-\x7e]/g, function ($0) {
        return $0 == " " ? "\u3000" : String.fromCharCode($0.charCodeAt(0) + 0xfee0);
    });
}
//全角转半角
iD.ui.TagName.dbc2sbc = function (str) {
    return str.replace(/[\uff01-\uff5e]/g, function (a) {
        return String.fromCharCode(a.charCodeAt(0) - 65248);
    }).replace(/\u3000/g, " ");
}

//判断字符串是否为"引路”、“掉头”、“出口”、“入口”、“桥”、“立交桥”、“辅路”等通用名称
iD.ui.TagName.getInvalidRoadname = function (str) {
    if (str.length > 0) {
        if (str.indexOf(" ") >= 0) {
            return "空格";
        }

        var arr = ["引路", "掉头", "出口", "入口", "桥", "立交桥", "辅路"];
        for (var i = 0; i < arr.length; i++) {
            if (str == arr[i]) {
                return arr[i];
            }
        }
    }
    return undefined;
}
