/*
 * @Author: tao.w
 * @Date: 2020-11-24 20:05:40
 * @LastEditors: tao.w
 * @LastEditTime: 2020-12-03 16:53:00
 * @Description: 
 */


// var http = require('http');
// var fs = require('fs');
// var url = require('url');
 
 
// var MIME_TYPE = {
//     "css": "text/css",
//     "gif": "image/gif",
//     "html": "text/html",
//     "ico": "image/x-icon",
//     "jpeg": "image/jpeg",
//     "jpg": "image/jpeg",
//     "js": "text/javascript",
//     "json": "application/json",
//     "pdf": "application/pdf",
//     "png": "image/png",
//     "svg": "image/svg+xml",
//     "swf": "application/x-shockwave-flash",
//     "tiff": "image/tiff",
//     "txt": "text/plain",
//     "wav": "audio/x-wav",
//     "wma": "audio/x-ms-wma",
//     "wmv": "video/x-ms-wmv",
//     "xml": "text/xml"
// };

// // 创建服务器
// http.createServer( function (request, response) {  
//    // 解析请求，包括文件名
//    var tempUrl = request.url.replace('/web_editor/','./');

//    var pathname = url.parse(tempUrl).pathname;
   
//    // 输出请求的文件名
// //    console.log("Request for " + pathname + " received.");
//     // console.log(tempUrl,pathname);
//    // 从文件系统中读取请求的文件内容
//    fs.readFile(pathname, function (err, data) {
//       if (err) {
//          console.log('err',err);
//          // HTTP 状态码: 404 : NOT FOUND
//          // Content Type: text/html
//          response.writeHead(404, {'Content-Type': 'text/html'});
//       }else{             
//          // HTTP 状态码: 200 : OK
//          // Content Type: text/html
//          var type = pathname.split('.');
//          type = type[type.length - 1];
//          response.writeHead(200, { 'Content-Type': MIME_TYPE[type] + '; charset=utf-8' });
         
//          // 响应文件内容
//          response.write(data.toString());        
//         //  console.log('>>>',data.toString())
//       }
//       //  发送响应数据
//       response.end();
//    });   
// }).listen(8080);
 
// // 控制台会输出以下信息
// console.log('Server running at http://127.0.0.1:8080/');


var http = require('http');
 
var ecstatic = require('ecstatic');
var colors = require('colors/safe');
 

    // http.createServer(
    //     ecstatic({ root: __dirname, cache: 0 })
    // ).listen(8080);
    http.createServer(
        ecstatic({ root: __dirname, cache: 0, baseDir: 'web_editor' })
    ).listen(8080);

    console.log(colors.yellow('Listening on :8080'));
 
