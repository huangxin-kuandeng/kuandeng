window.qq = window.qq || {};
qq.maps = qq.maps || {};
window.soso || (window.soso = qq);
soso.maps || (soso.maps = qq.maps);
;;(function () {
    function getScript(src) {
        document.write('<' + 'script src="' + src + '"' +' type="text/javascript"><' + '/script>');
    }
    qq.maps.__load = function (apiLoad) {
        delete qq.maps.__load;
        apiLoad([["2.3.5","d84d6d83e0e51e481e50454ccbe8986b",0],["http://open.map.qq.com/","apifiles/2/3/5/mods/","http://open.map.qq.com/apifiles/2/3/5/theme/",true],[1,18,34.519469,104.461761,4],[1429870598974,"http://pr.map.qq.com/pingd","http://pr.map.qq.com/pingd"],["http://apic.map.qq.com/","http://apikey.map.qq.com/mkey/index.php/mkey/check","http://sv.map.qq.com/xf","http://sv.map.qq.com/rarp"],[[null,["http://p0.map.gtimg.com/maptilesv3","http://p1.map.gtimg.com/maptilesv3","http://p2.map.gtimg.com/maptilesv3","http://p3.map.gtimg.com/maptilesv3"],"png",[256,256],1,19,"",true,false],[null,["http://p0.map.gtimg.com/hwaptiles","http://p1.map.gtimg.com/hwaptiles","http://p2.map.gtimg.com/hwaptiles","http://p3.map.gtimg.com/hwaptiles"],"png",[128,128],1,19,"",false,false],[null,["http://p0.map.gtimg.com/sateTiles","http://p1.map.gtimg.com/sateTiles","http://p2.map.gtimg.com/sateTiles","http://p3.map.gtimg.com/sateTiles"],"jpg",[256,256],1,19,"",false,false],[null,["http://p0.map.gtimg.com/sateTranTilesv3","http://p1.map.gtimg.com/sateTranTilesv3","http://p2.map.gtimg.com/sateTranTilesv3","http://p3.map.gtimg.com/sateTranTilesv3"],"png",[256,256],1,19,"",false,false],[null,["http://sv0.map.qq.com/road/","http://sv1.map.qq.com/road/","http://sv2.map.qq.com/road/","http://sv3.map.qq.com/road/"],"png",[256,256],1,19,"",false,false],[null,["http://rtt2.map.qq.com/live/"],"png",[256,256],1,19,"",false,false],null,null,null],["http://s.map.qq.com/TPano/v1.1/TPano.js","http://map.qq.com/",""]],loadScriptTime);
    };
    var loadScriptTime = (new Date).getTime();
    getScript("http://open.map.qq.com/apifiles/2/3/5/main.js");
})();