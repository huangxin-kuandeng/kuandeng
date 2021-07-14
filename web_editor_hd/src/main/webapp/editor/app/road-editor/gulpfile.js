var gulp = require('gulp');
var concat = require('gulp-concat');
//var uglify = require('gulp-uglify');
var less = require('gulp-less');
var minifycss = require('gulp-minify-css');
var gutil = require('gulp-util')
var del = require('del');
var template = require('art-template');
var config = require('./load.json');

// gulp-js-minify默认会混淆变量，decode后也无法使用
//var minifyjs = require('gulp-js-minify');
var through = require('through2');
//var uglifyjs = require('uglify-js');
var UglifyJS = require("uglify-js");
var babel = require('gulp-babel');
var babelMinify = require("babel-minify");
require('babel-polyfill');
var fs = require('fs');


template.config('extname', '.tpl');

gulp.task('clean', function() {
	return del(['build']);
});


gulp.task('script', function() {
	/*
	 * 解决babel转换后，ES6语法中的箭头函数中this变为undefined的问题；
	{
	  presets: [
	    ["es2015", {"loose": true,"modules": false}]
	  ],
	  "plugins": [
	    ["transform-es2015-modules-commonjs", {
	      "allowTopLevelThis": true
	    }]
	  ]
	}
	或使用babel-preset-es2015-script
	链接：https://www.jianshu.com/p/a182d4f75e88
	
	 * */
	return gulp.src(config.js)
		/*
		.pipe(babel({
			babelrc: false,
            "presets": [
	            // 默认超过500KB后不转换，取消限制
			    ["env", {
			    	"compact": false,
			    	"modules": false
//					"targets": {
//						"chrome": "60"
//					}
			    }],
			    ["minify", {
					"keepFnName": true,
					"keepClassName": true,
					"evaluate": false
				}]
//	    		"es2016"
//	    		"minify"
			],
            "plugins": [
	            "transform-remove-strict-mode"
            ]
//			"env": {
//				"production": {
//					"presets": ["minify"]
//				}
//			}
		}))
		*/
		/*
		.pipe(babel({
			babelrc: false,
            "presets": [
	            // 默认超过500KB后不转换，取消限制
			    ["env", {
			    	"compact": false
//					"targets": {
//						"chrome": "60"
//					}
			    }],
            	// 无效
//	    		["es2015", {"modules": false}]
//	    		"es2015-script"
	    		["es2015", { "modules": false }]
			],
            "plugins": [
	            ["transform-es2015-modules-commonjs", {
	            	"allowTopLevelThis": true,
	            	"loose":  true,
	            	"strict": false
	            }],
	            "transform-remove-strict-mode"
            ]
        }))
		*/
		.pipe(concat('app.min.js', {
			newLine: '\n;;' //每个文件用该后缀拼接
		}))
		/*
		.pipe(uglify({
			warnings: 'verbose',
            mangle: false,//类型：Boolean 默认：true 是否修改变量名混淆
            compress: false,//类型：Boolean 默认：true 是否完全压缩
            toplevel: true
//          preserveComments: 'all' //保留所有注释
        })
		.on('error', function(e){
        	console.log('\n');
        	console.log('------------------uglify start------------------------------------------------------');
        	console.log(e);
        	console.log('------------------uglify end------------------------------------------------------');
        	console.log('\n');
        })
        */
		/*
		.pipe(through.obj(function(file, encoding, callback){
			if (file.isNull()) {
			    return callback(null, file);
			}
			if (file.isStream()) {
			    return callback(createError(file, 'Streaming not supported'));
			}
			// 更改内容
			console.log('file content length: ' + file.contents && file.contents.length || 0)''
			// 依然语法解析错误；
			var result = uglifyjs.minify(file.contents.toString(), {
				mangle:false //默认true，表示混淆
			});
			console.log('result ======================');
			console.log(result);
//			file.contents = new Buffer();
			callback(null, file);
		}))
		*/
		/*
		.pipe(through.obj(function(file, encoding, callback){
			if (file.isNull()) {
			    return callback(null, file);
			}
			if (file.isStream()) {
			    return callback(createError(file, 'Streaming not supported'));
			}
			// 更改内容
			console.log('file content length: ' + file.contents && file.contents.length || 0);
			var obj = {
				"app.min.js": file.contents.toString()
			};
			var result = UglifyJS.minify(file.contents.toString(), {
				compress: false,
			    mangle: false,
			    ie8: false,
			    output: {
			    	quote_style: 3,
			    	keep_quoted_props: true
			    }
			});
//			console.log('result ======================');
//			fs.writeFile('./uglog/uglifyjs3-error.txt', result.error);
//			fs.writeFile('./uglog/uglifyjs3-warning.txt', result.warnings);
			
//			file.contents = new Buffer(result.code);
			callback(null, file);
		}))
		*/
		.pipe(through.obj(function(file, encoding, callback){
			if (file.isNull()) {
			    return callback(null, file);
			}
			if (file.isStream()) {
			    return callback(createError(file, 'Streaming not supported'));
			}
			// 更改内容
			console.log('file content length: ' + file.contents && file.contents.length || 0);
			var result = babelMinify(file.contents.toString(), {
				mangle: false,
				removeUndefined: false,
				removeConsole: false,
				removeDebugger: true,
				evaluate: false,
				// 会删除函数作用域以外的var变量；
				deadcode: false,
				// boolean变为0/1
				booleans: false,
				// 先声明object，再添加属性，改为声明时设置属性
				consecutiveAdds: false,
				// 会提取出部分重复使用的函数，例如Math.abs等
				builtIns: false,
				// 会合并部分局部变量的声明，可能会更改for循环格式
				mergeVars: false,
				// Infinity，1/0表示
				infinity: false,
				// 科学记数法，e表示
				numericLiterals: false,
				// new RegExp("abc")，/abc/表示
				regexpConstructors: false,
				// 部分if判断改为 && 形式；
				simplify: false,
				// === 改为 ==
				simplifyComparisons: false,
				// 部分类型初始化逻辑更改，例如Array(3)改为[,,,]
				typeConstructors: false,
				// undefined 改为 void 0;
				undefinedToVoid: false,
				// obj.foo = "123" 和 obj["foo"] = "123" 会互换？
				// https://github.com/babel/minify/tree/master/packages/babel-plugin-transform-member-expression-literals
				memberExpressions: false,
				// 会删除通过if条件不会执行的代码
				guards: false
			});
			console.log(Object.keys(result));
			console.log(typeof result.code);
//			console.log(result.map);
			/*
			for(var key in result){
				var value = result[key];
				value = value.toString();
				if(value.length > 200){
					value = value.slice(0, 200); + ' ... ';
				}
				console.log(key + " :\t\t\t" + value)
			}
			*/
//			console.dir(result)
//			console.log('result ======================');
//			fs.writeFile('./uglog/babel-minify-result.txt', result);
			
			file.contents = new Buffer(result.code);
			callback(null, file);
		}))
//		.pipe(concat('app.min.js', {
//			newLine: '\n;;' //每个文件用该后缀拼接
//		}))
		.pipe(gulp.dest('build'));
//		.pipe(gulp.dest('build2'));
});

gulp.task('less', function() {
	return gulp.src(['./css/*.less'])
		.pipe(less())
		.pipe(gulp.dest('./css'));
});

//gulp.task('css', ['less'], function() {
gulp.task('css', function() {
	var cssSet = config.css;
	for( var key in cssSet) {
		var set = cssSet[key];
		gulp.src(set.content)
			.pipe(minifycss())
			.pipe(concat(key + '.min.css'))
			.pipe(gulp.dest(set.path));
	}
});

gulp.task('bootDev', ['less'], function() {
	fs.writeFileSync('boot-dev.js', template(__dirname + '/boot', config));
});

gulp.task('bootProduct', function() {
	var data = {
		css: {},
		js: ['./build/app.min.js']
	}
	var cssSet = config.css;
	for(var key in cssSet) {
		var set = cssSet[key];
		data['css'][key] = {
			content: [set.path + '/' + key + '.min.css']
		};
	}
	fs.writeFileSync('boot-product.js', template(__dirname + '/boot', data));

});

gulp.task('dev', ['bootDev']);

gulp.task('default', ['script', 'css', 'bootProduct']);