window.alert = function (message) {   
    try {   
        var iframe = document.createElement("IFRAME");   
        iframe.style.display = "none";   
        iframe.setAttribute("src", 'data:text/plain,');   
        document.documentElement.appendChild(iframe);   
        var alertFrame = window.frames[0];   
        var iwindow = alertFrame.window;   
        if (iwindow == undefined) {   
            iwindow = alertFrame.contentWindow;   
        }   
        iwindow.alert(message);   
        iframe.parentNode.removeChild(iframe);   
    }   
    catch (exc) {   
        return wAlert(message);   
    }   
}

window.getAjax = function(param){
    param.callback({code: 0});
    return
    $.ajax( {
        type : "GET",
        url : param.url,
        async : true,
        data : {},
        success : function(data) {
            param.callback(data);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            param.callback(textStatus);
        },
    });
};

window.postAjax = function(param){
    $.ajax( {
        type : "POST",
        url : param.url,
        async : true,
        contentType: "application/json; charset=utf-8",
        data : JSON.stringify(param.form),
        success : function(data) {
            param.callback(data);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            param.callback(textStatus);
        }
    });
};
