/*
 * @Author: tao.w
 * @Date: 2020-11-13 17:53:44
 * @LastEditors: tao.w
 * @LastEditTime: 2020-11-30 16:41:51
 * @Description: 
 */
// import { mapboxgl } from "mapbox-gl";

let token = 'pk.eyJ1Ijoic3BpZGVyejciLCJhIjoiY2lxYXBweWQwMDJhaWZubTFhOW1hNmJraCJ9.NUgEOOc-qxaL52ghK2ic4Q';


//let line = turf.lineString([  trackLocxs
//     [-76.091308, 18.427501],
//     [-76.695556, 18.729501],
//     [-76.552734, 19.40443],
//     [-74.61914, 19.134789],
//     [-73.652343, 20.07657],
//     [-73.157958, 20.210656]
//   ])
// var buffered = turf.buffer(line, 10, {units: 'miles'});
// "http://192.168.7.26:19010/pdds/data/pd/get?queryCriteriaJson={"bbox":"0,0,2,2","polygon":"POLYGON((0 0,0 2,2 2,2 0,0 0))","ops":[{"k":"properties.NAME","v":"中国","op":"eq"}],"sort":[{"k":"properties.TASK_ID","order":"desc"}]}"
//TODO 需要配置底图 图片的访问地址


export function mapInit(containerID, mapOption = {}, images = []) {
    let map;
    let _opt = {
        style: 'mapbox://styles/mapbox/light-v10',
        zoom: 9,
        minZoom: 9,
        // center: [107.26324629629052,26.363503482566767],
        center:  [121.12826135311582, 32.30269121007785, 1051.466086090133],
        maxZoom: 22,
        pitch: 0,
        bearing: 0,
    }
    // _main_map.setCenter({lng: 121.12826135311582, lat: 32.30269121007785})
    
    function addImageItem(map,fname,i) {
        map.loadImage('./Apps/Dist/icon/' + fname, function (error, image) {
            if (error) throw error;
            //Add an image to the style
            let _imageId = fname.split('.')[0];
            if (!map.hasImage('_imageId')){
                map.addImage(_imageId, image);
            } 
        });
    }
    
    mapboxgl.accessToken = token;
    Object.assign(_opt,mapOption);
    map = new mapboxgl.Map({
        container: containerID,
        style: _opt.style,
        zoom: _opt.zoom,
        minZoom:_opt.minZoom,
        maxZoom:_opt.maxZoom,
        center: _opt.center,
        pitch: _opt.pitch,
        logoPosition:"bottom-right",   //右下角
        bearing: _opt.bearing,
        renderWorldCopies: false

    });

    for (let i = 0; i < images.length; i++) {
        addImageItem(map,images[i],i);
    }

    // map.addControl(new mapboxgl.NavigationControl());

    return map;
};