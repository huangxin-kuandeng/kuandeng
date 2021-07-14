
// npm run webpack ---- 打包JS文件
// npm run start ---- 运行项目
// npm run all ---- 顺序执行上面步骤


const entry = {
	main: './Apps/Dist/Js/main.js',
	user: './Apps/Dist/Js/user_config.js'
};
const path = require("path");
const time = new Date().getTime();
module.exports = {
	devtool: "#source-map",
    mode: "development",			 //打包为开发模式
    // 出口对象中，属性为输出的js文件名，属性值为入口文件
    entry: entry, 					//入口文件,从项目根目录指定
    output: {						 //输出路径和文件名，使用path模块resolve方法将输出路径解析为绝对路径
        path: path.resolve(__dirname, "./Apps/Dist/Main"), //将js文件打包到dist/js的目录
        filename: "[name].js"
        // filename: `[name].js-[hash].js?time=${time}`,
		// chunkFilename: `js/[name]-[hash].js?time=${time}`
    }
}