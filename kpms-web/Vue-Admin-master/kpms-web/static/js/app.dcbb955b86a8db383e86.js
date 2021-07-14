webpackJsonp([1],{

/***/ 1058:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('imp-panel',[_c('h3',{staticClass:"box-title",staticStyle:{"width":"100%"},attrs:{"slot":"header"},slot:"header"},[_c('el-row',{staticStyle:{"width":"100%"}},[_c('el-col',{attrs:{"span":12}},[_c('el-button',{attrs:{"type":"primary","icon":"plus"},on:{"click":_vm.addBtnClick}},[_vm._v("新增")])],1)],1)],1),_vm._v(" "),_c('div',{attrs:{"slot":"body"},slot:"body"},[_c('el-table',{directives:[{name:"loading",rawName:"v-loading",value:(_vm.fatherLoading),expression:"fatherLoading"}],staticStyle:{"width":"100%"},attrs:{"data":_vm.tableData,"max-height":"700","row-key":"id","default-expand-all":"","border":""}},[_c('el-table-column',{attrs:{"prop":"name","label":"名称"}}),_vm._v(" "),_c('el-table-column',{attrs:{"label":"状态"},scopedSlots:_vm._u([{key:"default",fn:function(scope){return [_vm._v("\n            "+_vm._s(scope.isShow=='1' ? '显示' : '隐藏')+"\n          ")]}}])}),_vm._v(" "),_c('el-table-column',{attrs:{"prop":"href","label":"链接"}}),_vm._v(" "),_c('el-table-column',{attrs:{"prop":"remarks","label":"描述"}}),_vm._v(" "),_c('el-table-column',{attrs:{"prop":"createDate","label":"创建时间"}}),_vm._v(" "),_c('el-table-column',{attrs:{"label":"操作","width":"285"},scopedSlots:_vm._u([{key:"default",fn:function(scope){return _c('el-button-group',{},[_c('el-button',{attrs:{"size":"small","title":"新增一个菜单","type":"primary"},on:{"click":function($event){return _vm.addParentClick(scope.$index, scope.row)}}},[_vm._v("新增")]),_vm._v(" "),_c('el-button',{attrs:{"size":"small","title":"更新菜单信息","type":"primary"},on:{"click":function($event){return _vm.addBtnClick(scope.$index, scope.row)}}},[_vm._v("编辑")]),_vm._v(" "),_c('el-button',{attrs:{"size":"small","title":"删除当前菜单","type":"danger"},on:{"click":function($event){return _vm.handleDelete(scope.$index, scope.row)}}},[_vm._v("删除")])],1)}}])})],1),_vm._v(" "),_c('el-dialog',{attrs:{"title":_vm.formTitle,"visible":_vm.dialogFormVisible,"width":"30%"},on:{"update:visible":function($event){_vm.dialogFormVisible=$event}}},[_c('el-form',{ref:"createForm",attrs:{"model":_vm.createForm,"label-position":"left"}},[_c('el-form-item',{attrs:{"label":"名称：","label-width":_vm.formLabelWidth,"prop":"name","rules":[{ required: true, message: '菜单名称不能为空'}]}},[_c('el-input',{attrs:{"autocomplete":"off"},model:{value:(_vm.createForm.name),callback:function ($$v) {_vm.$set(_vm.createForm, "name", $$v)},expression:"createForm.name"}})],1),_vm._v(" "),_c('el-form-item',{attrs:{"label":"排序：","label-width":_vm.formLabelWidth,"prop":"sort","rules":[{ required: true, message: '排序不能为空'}]}},[_c('el-slider',{model:{value:(_vm.createForm.sort),callback:function ($$v) {_vm.$set(_vm.createForm, "sort", $$v)},expression:"createForm.sort"}})],1),_vm._v(" "),_c('el-form-item',{attrs:{"label":"状态：","label-width":_vm.formLabelWidth,"prop":"isShow","rules":[{ required: true, message: '状态不能为空'}]}},[_c('el-select',{attrs:{"placeholder":"请选择菜单状态"},model:{value:(_vm.createForm.isShow),callback:function ($$v) {_vm.$set(_vm.createForm, "isShow", $$v)},expression:"createForm.isShow"}},[_c('el-option',{attrs:{"label":"隐藏","value":"0"}}),_vm._v(" "),_c('el-option',{attrs:{"label":"显示","value":"1"}})],1)],1),_vm._v(" "),_c('el-form-item',{attrs:{"label":"链接：","label-width":_vm.formLabelWidth}},[_c('el-input',{attrs:{"autocomplete":"off"},model:{value:(_vm.createForm.href),callback:function ($$v) {_vm.$set(_vm.createForm, "href", $$v)},expression:"createForm.href"}})],1),_vm._v(" "),_c('el-form-item',{attrs:{"label":"描述：","label-width":_vm.formLabelWidth}},[_c('el-input',{attrs:{"autocomplete":"off"},model:{value:(_vm.createForm.remarks),callback:function ($$v) {_vm.$set(_vm.createForm, "remarks", $$v)},expression:"createForm.remarks"}})],1)],1),_vm._v(" "),_c('div',{staticClass:"dialog-footer",attrs:{"slot":"footer"},slot:"footer"},[_c('el-button',{on:{"click":function($event){_vm.dialogFormVisible = false}}},[_vm._v("取 消")]),_vm._v(" "),_c('el-button',{attrs:{"type":"primary"},on:{"click":function($event){return _vm.addUserGroup('createForm')}}},[_vm._v("确 定")])],1)],1)],1)])}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),

/***/ 1059:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_role_vue__ = __webpack_require__(414);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_role_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_role_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_role_vue__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_role_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_3a02d1f8_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_role_vue__ = __webpack_require__(1061);
function injectStyle (ssrContext) {
  __webpack_require__(1060)
}
var normalizeComponent = __webpack_require__(21)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_role_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_3a02d1f8_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_role_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),

/***/ 1060:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 1061:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('imp-panel',[_c('h3',{staticClass:"box-title",staticStyle:{"width":"100%"},attrs:{"slot":"header"},slot:"header"},[_c('el-row',{staticStyle:{"width":"100%"}},[_c('el-col',{attrs:{"span":24}},[_c('el-button',{attrs:{"type":"primary","icon":"plus"},on:{"click":_vm.addBtnClick}},[_vm._v("新增")]),_vm._v(" "),_c('el-form',{staticClass:"demo-form-inline searchForm",attrs:{"inline":true,"model":_vm.searchForm}},[_c('el-form-item',{attrs:{"label":"名称"}},[_c('el-input',{attrs:{"placeholder":"角色名称"},model:{value:(_vm.searchForm.name),callback:function ($$v) {_vm.$set(_vm.searchForm, "name", $$v)},expression:"searchForm.name"}})],1),_vm._v(" "),_c('el-form-item',{attrs:{"label":"英文名"}},[_c('el-input',{attrs:{"placeholder":"角色英文名称"},model:{value:(_vm.searchForm.enname),callback:function ($$v) {_vm.$set(_vm.searchForm, "enname", $$v)},expression:"searchForm.enname"}})],1),_vm._v(" "),_c('el-form-item',{attrs:{"label":"用户登录名"}},[_c('el-input',{attrs:{"placeholder":"用户登录名"},model:{value:(_vm.searchForm.loginName),callback:function ($$v) {_vm.$set(_vm.searchForm, "loginName", $$v)},expression:"searchForm.loginName"}})],1),_vm._v(" "),_c('el-form-item',[_c('el-button',{attrs:{"type":"primary"},on:{"click":_vm.onSubmit}},[_vm._v("查询")])],1)],1)],1)],1)],1),_vm._v(" "),_c('div',{attrs:{"slot":"body"},slot:"body"},[_c('el-table',{directives:[{name:"loading",rawName:"v-loading",value:(_vm.fatherLoading),expression:"fatherLoading"}],staticStyle:{"width":"100%"},attrs:{"max-height":"700","data":_vm.tableData,"border":""}},[_c('el-table-column',{attrs:{"prop":"id","type":"selection","width":"50"}}),_vm._v(" "),_c('el-table-column',{attrs:{"prop":"id","label":"ID"}}),_vm._v(" "),_c('el-table-column',{attrs:{"prop":"name","label":"名称"}}),_vm._v(" "),_c('el-table-column',{attrs:{"prop":"enname","label":"英文名称"}}),_vm._v(" "),_c('el-table-column',{attrs:{"prop":"remarks","label":"描述"}}),_vm._v(" "),_c('el-table-column',{attrs:{"prop":"createDate","label":"创建时间"}}),_vm._v(" "),_c('el-table-column',{attrs:{"label":"操作","width":"285"},scopedSlots:_vm._u([{key:"default",fn:function(scope){return _c('el-button-group',{},[_c('el-button',{attrs:{"size":"small","title":"编辑角色信息","type":"primary"},on:{"click":function($event){return _vm.addBtnClick(scope.$index, scope.row)}}},[_vm._v("编辑")]),_vm._v(" "),_c('el-button',{attrs:{"size":"small","title":"删除当前角色","type":"danger"},on:{"click":function($event){return _vm.userRoleDelete(scope.$index, scope.row)}}},[_vm._v("删除")])],1)}}])})],1),_vm._v(" "),_c('el-dialog',{attrs:{"title":_vm.formTitle,"visible":_vm.dialogFormVisible,"width":"30%"},on:{"update:visible":function($event){_vm.dialogFormVisible=$event}}},[_c('el-form',{ref:"createForm",attrs:{"model":_vm.createForm,"label-position":"left"}},[_c('el-form-item',{attrs:{"label":"角色名：","label-width":_vm.formLabelWidth,"prop":"name","rules":[{ required: true, message: '角色名不能为空'}]}},[_c('el-input',{attrs:{"autocomplete":"off"},model:{value:(_vm.createForm.name),callback:function ($$v) {_vm.$set(_vm.createForm, "name", $$v)},expression:"createForm.name"}})],1),_vm._v(" "),_c('el-form-item',{attrs:{"label":"角色英文名：","label-width":_vm.formLabelWidth,"prop":"enname","rules":[{ required: true, message: '角色英文名不能为空'}]}},[_c('el-input',{attrs:{"autocomplete":"off"},model:{value:(_vm.createForm.enname),callback:function ($$v) {_vm.$set(_vm.createForm, "enname", $$v)},expression:"createForm.enname"}})],1),_vm._v(" "),_c('el-form-item',{staticClass:"menuList",attrs:{"label":"资源菜单：","label-width":_vm.formLabelWidth}},[_c('el-tree',{ref:"menuTree",attrs:{"data":_vm.menuData,"show-checkbox":"","node-key":"id","props":_vm.defaultProps},on:{"check":_vm.checkChange}})],1),_vm._v(" "),_c('el-form-item',{attrs:{"label":"备注：","label-width":_vm.formLabelWidth}},[_c('el-input',{attrs:{"autocomplete":"off"},model:{value:(_vm.createForm.remarks),callback:function ($$v) {_vm.$set(_vm.createForm, "remarks", $$v)},expression:"createForm.remarks"}})],1)],1),_vm._v(" "),_c('div',{staticClass:"dialog-footer",attrs:{"slot":"footer"},slot:"footer"},[_c('el-button',{on:{"click":function($event){_vm.dialogFormVisible = false}}},[_vm._v("取 消")]),_vm._v(" "),_c('el-button',{attrs:{"type":"primary"},on:{"click":function($event){return _vm.addUserGroup('createForm')}}},[_vm._v("确 定")])],1)],1),_vm._v(" "),_c('el-pagination',{attrs:{"current-page":_vm.pageNum,"page-sizes":[5, 10, 20],"page-size":_vm.pageSize,"layout":"total, sizes, prev, pager, next, jumper","total":_vm.total},on:{"size-change":_vm.handleSizeChange,"current-change":_vm.handleCurrentChange}})],1)])}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),

/***/ 1062:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_dataRole_vue__ = __webpack_require__(415);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_dataRole_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_dataRole_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_dataRole_vue__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_dataRole_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_531c2c1b_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_dataRole_vue__ = __webpack_require__(1064);
function injectStyle (ssrContext) {
  __webpack_require__(1063)
}
var normalizeComponent = __webpack_require__(21)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_dataRole_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_531c2c1b_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_dataRole_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),

/***/ 1063:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 1064:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('imp-panel',[_c('h3',{staticClass:"box-title",staticStyle:{"width":"100%"},attrs:{"slot":"header"},slot:"header"},[_c('el-row',{staticStyle:{"width":"100%"}},[_c('el-col',{attrs:{"span":12}},[_c('el-button',{attrs:{"type":"primary","icon":"plus"},on:{"click":_vm.addBtnClick}},[_vm._v("新增")])],1)],1)],1),_vm._v(" "),_c('div',{attrs:{"slot":"body"},slot:"body"},[_c('el-table',{directives:[{name:"loading",rawName:"v-loading",value:(_vm.fatherLoading),expression:"fatherLoading"}],staticStyle:{"width":"100%"},attrs:{"data":_vm.tableData.rows,"max-height":"700","border":""}},[_c('el-table-column',{attrs:{"prop":"id","type":"selection","width":"50"}}),_vm._v(" "),_c('el-table-column',{attrs:{"prop":"id","label":"ID"}}),_vm._v(" "),_c('el-table-column',{attrs:{"prop":"appId","label":"appId"}}),_vm._v(" "),_c('el-table-column',{attrs:{"prop":"name","label":"名称"}}),_vm._v(" "),_c('el-table-column',{attrs:{"prop":"tag","label":"标记"}}),_vm._v(" "),_c('el-table-column',{attrs:{"prop":"remarks","label":"描述"}}),_vm._v(" "),_c('el-table-column',{attrs:{"prop":"createDate","label":"创建时间"}}),_vm._v(" "),_c('el-table-column',{attrs:{"label":"操作","width":"285"},scopedSlots:_vm._u([{key:"default",fn:function(scope){return _c('el-button-group',{},[_c('el-button',{attrs:{"size":"small","title":"更新权限信息","type":"primary"},on:{"click":function($event){return _vm.addBtnClick(scope.$index, scope.row)}}},[_vm._v("编辑")]),_vm._v(" "),_c('el-button',{attrs:{"size":"small","title":"删除当前权限","type":"danger"},on:{"click":function($event){return _vm.permissionDelete(scope.$index, scope.row)}}},[_vm._v("删除")])],1)}}])})],1),_vm._v(" "),_c('el-dialog',{attrs:{"title":_vm.formTitle,"visible":_vm.dialogFormVisible,"width":"30%"},on:{"update:visible":function($event){_vm.dialogFormVisible=$event}}},[_c('el-form',{ref:"createForm",attrs:{"model":_vm.createForm,"label-position":"left"}},[_c('el-form-item',{attrs:{"label":"appID","label-width":_vm.formLabelWidth,"prop":"appId","rules":[{ required: true, message: 'appID不能为空'}]}},[_c('el-input',{attrs:{"autocomplete":"off"},model:{value:(_vm.createForm.appId),callback:function ($$v) {_vm.$set(_vm.createForm, "appId", $$v)},expression:"createForm.appId"}})],1),_vm._v(" "),_c('el-form-item',{attrs:{"label":"权限名","label-width":_vm.formLabelWidth,"prop":"name","rules":[{ required: true, message: '数据权限名不能为空'}]}},[_c('el-input',{attrs:{"autocomplete":"off"},model:{value:(_vm.createForm.name),callback:function ($$v) {_vm.$set(_vm.createForm, "name", $$v)},expression:"createForm.name"}})],1),_vm._v(" "),_c('el-form-item',{attrs:{"label":"标记","label-width":_vm.formLabelWidth,"prop":"tag"}},[_c('el-input',{attrs:{"autocomplete":"off"},model:{value:(_vm.createForm.tag),callback:function ($$v) {_vm.$set(_vm.createForm, "tag", $$v)},expression:"createForm.tag"}})],1),_vm._v(" "),_c('el-form-item',{attrs:{"label":"类型","label-width":_vm.formLabelWidth,"prop":"type"}},[_c('el-input',{attrs:{"autocomplete":"off"},model:{value:(_vm.createForm.type),callback:function ($$v) {_vm.$set(_vm.createForm, "type", $$v)},expression:"createForm.type"}})],1),_vm._v(" "),_c('el-form-item',{attrs:{"label":"描述","label-width":_vm.formLabelWidth}},[_c('el-input',{attrs:{"autocomplete":"off"},model:{value:(_vm.createForm.remarks),callback:function ($$v) {_vm.$set(_vm.createForm, "remarks", $$v)},expression:"createForm.remarks"}})],1)],1),_vm._v(" "),_c('div',{staticClass:"dialog-footer",attrs:{"slot":"footer"},slot:"footer"},[_c('el-button',{on:{"click":function($event){_vm.dialogFormVisible = false}}},[_vm._v("取 消")]),_vm._v(" "),_c('el-button',{attrs:{"type":"primary"},on:{"click":function($event){return _vm.addDataRole('createForm')}}},[_vm._v("确 定")])],1)],1),_vm._v(" "),_c('el-pagination',{attrs:{"current-page":_vm.tableData.pagination.pageNumber,"page-sizes":[5, 10, 20],"page-size":_vm.tableData.pagination.pageSize,"layout":"total, sizes, prev, pager, next, jumper","total":_vm.tableData.pagination.total},on:{"size-change":_vm.handleSizeChange,"current-change":_vm.handleCurrentChange}})],1)])}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),

/***/ 1065:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_userGroup_vue__ = __webpack_require__(416);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_userGroup_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_userGroup_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_userGroup_vue__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_userGroup_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_02668f97_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_userGroup_vue__ = __webpack_require__(1067);
function injectStyle (ssrContext) {
  __webpack_require__(1066)
}
var normalizeComponent = __webpack_require__(21)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_userGroup_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_02668f97_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_userGroup_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),

/***/ 1066:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 1067:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('imp-panel',[_c('h3',{staticClass:"box-title",staticStyle:{"width":"100%"},attrs:{"slot":"header"},slot:"header"},[_c('el-row',{staticStyle:{"width":"100%"}},[_c('el-tabs',{attrs:{"value":"KDS"},on:{"tab-click":_vm.appTabClick}},[_c('el-tab-pane',{attrs:{"label":"KTS","name":"KTS"}}),_vm._v(" "),_c('el-tab-pane',{attrs:{"label":"KMS","name":"KMS"}}),_vm._v(" "),_c('el-tab-pane',{attrs:{"label":"KCS","name":"KCS"}}),_vm._v(" "),_c('el-tab-pane',{attrs:{"label":"KDS","name":"KDS"}})],1)],1)],1),_vm._v(" "),_c('el-row',{staticStyle:{"margin-bottom":"20px"},attrs:{"slot":"body","gutter":24},slot:"body"},[_c('el-col',{staticStyle:{"margin-bottom":"20px"},attrs:{"span":6,"xs":24,"sm":24,"md":6,"lg":6}},[_c('el-tree',{directives:[{name:"loading",rawName:"v-loading",value:(_vm.treeLoading),expression:"treeLoading"}],ref:"groupTree",attrs:{"data":_vm.menuTree,"node-key":"id","props":_vm.defaultProps,"expand-on-click-node":false,"allow-drag":_vm.allowDrag},on:{"node-click":_vm.nodeClick},scopedSlots:_vm._u([{key:"default",fn:function(ref){
var node = ref.node;
var data = ref.data;
return _c('span',{staticClass:"custom-tree-node"},[_c('span',{staticStyle:{"float":"left"}},[_vm._v(_vm._s(node.label))]),_vm._v(" "),_c('span',{staticStyle:{"float":"right"}},[_c('el-button',{staticStyle:{"color":"#67c23a"},attrs:{"type":"text","size":"mini","title":"当前组下新建一个组"},on:{"click":function () { return _vm.appendGroup(data,1); }}},[_vm._v("\n\t\t\t\t\t\t\t\t新增\n\t\t          ")]),_vm._v(" "),_c('el-button',{staticStyle:{"color":"#67c23a"},attrs:{"type":"text","size":"mini","title":"当前组下新建一个组"},on:{"click":function () { return _vm.appendGroup(data); }}},[_vm._v("\n\t\t\t\t\t\t\t\t修改\n\t\t          ")]),_vm._v(" "),_c('el-button',{staticStyle:{"color":"#f56c6c"},attrs:{"type":"text","size":"mini","title":"删除当前组"},on:{"click":function () { return _vm.GroupDelete(node, data); }}},[_vm._v("\n\t\t\t\t\t\t\t\t删除\n\t\t          ")])],1)])}}])})],1),_vm._v(" "),_c('el-col',{attrs:{"span":18,"xs":24,"sm":24,"md":18,"lg":18}},[_c('h4',{staticClass:"tableTitle"},[_vm._v(_vm._s(_vm.tableTitle))]),_vm._v(" "),_c('el-tabs',{staticStyle:{"height":"700px"},attrs:{"type":"border-card","tab-position":"left"}},[_c('el-tab-pane',{attrs:{"label":"用户列表"}},[_c('el-transfer',{directives:[{name:"loading",rawName:"v-loading",value:(_vm.userLoading),expression:"userLoading"}],staticStyle:{"text-align":"left","display":"inline-block"},attrs:{"props":{key: 'id',label: 'name'},"filterable":"","target-order":"unshift","filter-placeholder":"请输入用户名","element-loading-text":"未选择相关组或其他错误","element-loading-spinner":"el-icon-loading","titles":_vm.userTitle,"data":_vm.userData.rows},on:{"change":_vm.userHandleChange},scopedSlots:_vm._u([{key:"default",fn:function(ref){
var option = ref.option;
return _c('span',{},[_c('span',[_vm._v(_vm._s(option.loginName)+" ： ")]),_vm._v(" "),_c('span',{staticStyle:{"margin-left":"10px"}},[_vm._v(_vm._s(option.name))])])}}]),model:{value:(_vm.userData.rightRow),callback:function ($$v) {_vm.$set(_vm.userData, "rightRow", $$v)},expression:"userData.rightRow"}}),_vm._v(" "),_c('el-dialog',{attrs:{"title":_vm.formTitle,"visible":_vm.dialogFormVisible,"width":"30%"},on:{"update:visible":function($event){_vm.dialogFormVisible=$event}}},[_c('el-form',{ref:"createForm",attrs:{"model":_vm.createForm,"label-position":"left"}},[_c('el-form-item',{attrs:{"label":"组名","label-width":_vm.formLabelWidth,"prop":"name","rules":[{ required: true, message: '组名不能为空'}]}},[_c('el-input',{attrs:{"autocomplete":"off"},model:{value:(_vm.createForm.name),callback:function ($$v) {_vm.$set(_vm.createForm, "name", $$v)},expression:"createForm.name"}})],1),_vm._v(" "),_c('el-form-item',{attrs:{"label":"英文名称","label-width":_vm.formLabelWidth}},[_c('el-input',{attrs:{"autocomplete":"off"},model:{value:(_vm.createForm.ename),callback:function ($$v) {_vm.$set(_vm.createForm, "ename", $$v)},expression:"createForm.ename"}})],1),_vm._v(" "),_c('el-form-item',{attrs:{"label":"描述","label-width":_vm.formLabelWidth}},[_c('el-input',{attrs:{"autocomplete":"off"},model:{value:(_vm.createForm.remarks),callback:function ($$v) {_vm.$set(_vm.createForm, "remarks", $$v)},expression:"createForm.remarks"}})],1)],1),_vm._v(" "),_c('div',{staticClass:"dialog-footer",attrs:{"slot":"footer"},slot:"footer"},[_c('el-button',{on:{"click":function($event){_vm.dialogFormVisible = false}}},[_vm._v("取 消")]),_vm._v(" "),_c('el-button',{attrs:{"type":"primary"},on:{"click":function($event){return _vm.addUserGroup('createForm')}}},[_vm._v("确 定")])],1)],1)],1),_vm._v(" "),_c('el-tab-pane',{attrs:{"label":"权限列表"}},[_c('el-transfer',{directives:[{name:"loading",rawName:"v-loading",value:(_vm.roleLoading),expression:"roleLoading"}],staticStyle:{"text-align":"left","display":"inline-block"},attrs:{"props":{key: 'id',label: 'name'},"filterable":"","target-order":"unshift","filter-placeholder":"请输入权限名","element-loading-text":"未选择相关组或其他错误","element-loading-spinner":"el-icon-loading","titles":_vm.roleTitle,"data":_vm.roleData.rows},on:{"change":_vm.roleHandleChange},scopedSlots:_vm._u([{key:"default",fn:function(ref){
var option = ref.option;
return _c('span',{},[_c('span',{staticStyle:{"margin-left":"10px"}},[_vm._v(_vm._s(option.name))])])}}]),model:{value:(_vm.roleData.rightRow),callback:function ($$v) {_vm.$set(_vm.roleData, "rightRow", $$v)},expression:"roleData.rightRow"}})],1)],1)],1)],1)],1)}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),

/***/ 1068:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_resource_vue__ = __webpack_require__(417);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_resource_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_resource_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_resource_vue__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_resource_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_0b919327_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_resource_vue__ = __webpack_require__(1094);
function injectStyle (ssrContext) {
  __webpack_require__(1069)
}
var normalizeComponent = __webpack_require__(21)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_resource_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_0b919327_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_resource_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),

/***/ 1069:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 1075:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 1076:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"box"},[(_vm.title || _vm.$slots.header)?_c('div',{staticClass:"box-header",class:{'with-border':_vm.widthBorder}},[_vm._t("header",[(_vm.title)?_c('h3',{staticClass:"box-title",domProps:{"textContent":_vm._s(_vm.title)}}):_vm._e()])],2):_vm._e(),_vm._v(" "),_c('div',{staticClass:"box-body"},[(_vm.$slots.body)?_vm._t("body",[_vm._v("\n      暂无内容显示\n    ")]):_vm._t("default")],2),_vm._v(" "),(_vm.footer)?_c('div',{staticClass:"box-footer",domProps:{"textContent":_vm._s(_vm.footer)}}):_vm._e()])}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),

/***/ 1077:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_selectTree_vue__ = __webpack_require__(419);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_selectTree_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_selectTree_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_selectTree_vue__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_selectTree_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_59416e16_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_selectTree_vue__ = __webpack_require__(1093);
var normalizeComponent = __webpack_require__(21)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_selectTree_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_59416e16_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_selectTree_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),

/***/ 1084:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_vue_loader_lib_selector_type_script_index_0_select_dropdown_vue__ = __webpack_require__(421);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_vue_loader_lib_selector_type_script_index_0_select_dropdown_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_vue_loader_lib_selector_type_script_index_0_select_dropdown_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_vue_loader_lib_selector_type_script_index_0_select_dropdown_vue__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_vue_loader_lib_selector_type_script_index_0_select_dropdown_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__vue_loader_lib_template_compiler_index_id_data_v_d9b83de2_hasScoped_false_buble_transforms_vue_loader_lib_selector_type_template_index_0_select_dropdown_vue__ = __webpack_require__(1090);
var normalizeComponent = __webpack_require__(21)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_vue_loader_lib_selector_type_script_index_0_select_dropdown_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__vue_loader_lib_template_compiler_index_id_data_v_d9b83de2_hasScoped_false_buble_transforms_vue_loader_lib_selector_type_template_index_0_select_dropdown_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),

/***/ 1090:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"el-select-dropdown el-popper",class:[{ 'is-multiple': _vm.$parent.multiple }, _vm.popperClass],style:({ minWidth: _vm.minWidth })},[_vm._t("default")],2)}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),

/***/ 1093:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{directives:[{name:"clickoutside",rawName:"v-clickoutside",value:(_vm.handleClose),expression:"handleClose"}],staticClass:"el-select"},[(_vm.multiple)?_c('div',{ref:"tags",staticClass:"el-select__tags",style:({ 'max-width': _vm.inputWidth - 32 + 'px' }),on:{"click":function($event){$event.stopPropagation();return _vm.toggleMenu($event)}}},[_c('transition-group',{on:{"after-leave":_vm.resetInputHeight}},_vm._l((_vm.selected),function(item){return _c('el-tag',{key:item.id,attrs:{"closable":"","type":"primary","close-transition":""},on:{"close":function($event){return _vm.deleteTag($event, item)}}},[_c('span',{staticClass:"el-select__tags-text"},[_vm._v(_vm._s(item[_vm.propNames.label]))])])}),1)],1):_vm._e(),_vm._v(" "),_c('el-input',{ref:"reference",attrs:{"type":"text","placeholder":_vm.currentPlaceholder,"name":_vm.name,"size":_vm.size,"disabled":_vm.disabled,"readonly":_vm.multiple,"validate-event":false,"icon":_vm.iconClass},on:{"focus":function($event){_vm.visible = true},"click":_vm.handleIconClick},nativeOn:{"mouseenter":function($event){_vm.inputHovering = true},"mouseleave":function($event){_vm.inputHovering = false}},model:{value:(_vm.selectedLabel),callback:function ($$v) {_vm.selectedLabel=$$v},expression:"selectedLabel"}}),_vm._v(" "),_c('transition',{attrs:{"name":"el-zoom-in-top"},on:{"after-leave":_vm.doDestroy,"after-enter":_vm.handleMenuEnter}},[_c('el-select-menu',{directives:[{name:"show",rawName:"v-show",value:(_vm.visible && _vm.emptyText !== false),expression:"visible && emptyText !== false"}],ref:"popper"},[_c('el-scrollbar',{directives:[{name:"show",rawName:"v-show",value:(_vm.treeData && !_vm.loading),expression:"treeData && !loading"}],staticClass:"is-empty",attrs:{"tag":"div","wrap-class":"el-select-dropdown__wrap","view-class":"el-select-dropdown__list"}},[_c('el-tree',{ref:"tree",attrs:{"data":_vm.treeData,"show-checkbox":_vm.multiple,"node-key":"id","check-strictly":"","props":_vm.propNames},on:{"check-change":_vm.handleCheckChange,"node-click":_vm.handleTreeNodeClick}})],1)],1)],1)],1)}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),

/***/ 1094:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('imp-panel',[_c('h3',{staticClass:"box-title",staticStyle:{"width":"100%"},attrs:{"slot":"header"},slot:"header"},[_c('el-button',{attrs:{"type":"primary","icon":"plus"},on:{"click":_vm.newAdd}},[_vm._v("新增")]),_vm._v(" "),_c('el-button',{attrs:{"type":"danger","icon":"delete"},on:{"click":_vm.batchDelete}},[_vm._v("删除")])],1),_vm._v(" "),_c('el-row',{staticStyle:{"margin-bottom":"20px"},attrs:{"slot":"body","gutter":24},slot:"body"},[_c('el-col',{staticStyle:{"margin-bottom":"20px"},attrs:{"span":6,"xs":24,"sm":24,"md":6,"lg":6}},[(_vm.resourceTree)?_c('el-tree',{ref:"resourceTree",attrs:{"data":_vm.resourceTree,"show-checkbox":"","highlight-current":"","render-content":_vm.renderContent,"clearable":"","node-key":"id","props":_vm.defaultProps},on:{"node-click":_vm.handleNodeClick}}):_vm._e()],1),_vm._v(" "),_c('el-col',{attrs:{"span":18,"xs":24,"sm":24,"md":18,"lg":18}},[_c('el-card',{staticClass:"box-card"},[_c('div',{staticClass:"text item"},[_c('el-form',{ref:"form",attrs:{"model":_vm.form}},[_c('el-form-item',{attrs:{"label":"父级","label-width":_vm.formLabelWidth}},[_c('el-select-tree',{attrs:{"treeData":_vm.resourceTree,"propNames":_vm.defaultProps,"clearable":"","placeholder":"请选择父级"},model:{value:(_vm.form.parentId),callback:function ($$v) {_vm.$set(_vm.form, "parentId", $$v)},expression:"form.parentId"}})],1),_vm._v(" "),_c('el-form-item',{attrs:{"label":"名称","label-width":_vm.formLabelWidth}},[_c('el-input',{attrs:{"auto-complete":"off"},model:{value:(_vm.form.name),callback:function ($$v) {_vm.$set(_vm.form, "name", $$v)},expression:"form.name"}})],1),_vm._v(" "),_c('el-form-item',{attrs:{"label":"代码","label-width":_vm.formLabelWidth}},[_c('el-input',{attrs:{"auto-complete":"off"},model:{value:(_vm.form.code),callback:function ($$v) {_vm.$set(_vm.form, "code", $$v)},expression:"form.code"}})],1),_vm._v(" "),_c('el-form-item',{attrs:{"label":"类型","label-width":_vm.formLabelWidth}},[_c('el-radio',{staticClass:"radio",attrs:{"label":1},model:{value:(_vm.form.type),callback:function ($$v) {_vm.$set(_vm.form, "type", $$v)},expression:"form.type"}},[_vm._v("菜单")]),_vm._v(" "),_c('el-radio',{staticClass:"radio",attrs:{"label":2},model:{value:(_vm.form.type),callback:function ($$v) {_vm.$set(_vm.form, "type", $$v)},expression:"form.type"}},[_vm._v("按钮")]),_vm._v(" "),_c('el-radio',{staticClass:"radio",attrs:{"label":3},model:{value:(_vm.form.type),callback:function ($$v) {_vm.$set(_vm.form, "type", $$v)},expression:"form.type"}},[_vm._v("功能")])],1),_vm._v(" "),_c('el-form-item',{attrs:{"label":"是否生效","label-width":_vm.formLabelWidth}},[_c('el-radio',{staticClass:"radio",attrs:{"label":"1"},model:{value:(_vm.form.usable),callback:function ($$v) {_vm.$set(_vm.form, "usable", $$v)},expression:"form.usable"}},[_vm._v("是")]),_vm._v(" "),_c('el-radio',{staticClass:"radio",attrs:{"label":"0"},model:{value:(_vm.form.usable),callback:function ($$v) {_vm.$set(_vm.form, "usable", $$v)},expression:"form.usable"}},[_vm._v("否")])],1),_vm._v(" "),_c('el-form-item',{attrs:{"label":"排序","label-width":_vm.formLabelWidth}},[_c('el-slider',{model:{value:(_vm.form.sort),callback:function ($$v) {_vm.$set(_vm.form, "sort", $$v)},expression:"form.sort"}})],1),_vm._v(" "),_c('el-form-item',{attrs:{"label":"备注","label-width":_vm.formLabelWidth}},[_c('el-input',{attrs:{"auto-complete":"off"},model:{value:(_vm.form.remarks),callback:function ($$v) {_vm.$set(_vm.form, "remarks", $$v)},expression:"form.remarks"}})],1),_vm._v(" "),_c('el-form-item',{attrs:{"label":"","label-width":_vm.formLabelWidth}},[_c('el-button',{attrs:{"type":"primary"},domProps:{"textContent":_vm._s(_vm.form.id?'修改':'新增')},on:{"click":_vm.onSubmit}}),_vm._v(" "),_c('el-button',{directives:[{name:"show",rawName:"v-show",value:(_vm.form.id && _vm.form.id!=null),expression:"form.id && form.id!=null"}],attrs:{"type":"danger","icon":"delete"},on:{"click":_vm.deleteSelected}},[_vm._v("删除\n              ")])],1)],1)],1)])],1)],1)],1)}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),

/***/ 1095:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_login_vue__ = __webpack_require__(423);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_login_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_login_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_login_vue__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_login_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_5ed73340_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_login_vue__ = __webpack_require__(1097);
function injectStyle (ssrContext) {
  __webpack_require__(1096)
}
var normalizeComponent = __webpack_require__(21)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_login_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_5ed73340_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_login_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),

/***/ 1096:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 1097:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('el-row',[_c('el-col',{attrs:{"span":12,"offset":6}},[_c('div',{staticClass:"login"},[_c('el-row',{attrs:{"slot":"body","gutter":0},slot:"body"},[_c('el-col',{attrs:{"span":24,"xs":24,"sm":16,"md":16,"lg":16}},[_c('div',{staticClass:"login-form"},[_c('div',{staticClass:"card-block"},[_c('h1',[_vm._v("用户管理系统")]),_vm._v(" "),_c('p',{staticClass:"text-muted"},[_vm._v("任意用户名/密码登录")]),_vm._v(" "),_c('div',{staticClass:"input-group m-b-1"},[_c('span',{staticClass:"input-group-addon"},[_c('i',{staticClass:"fa fa-user"})]),_vm._v(" "),_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.form.username),expression:"form.username"}],staticClass:"form-control",attrs:{"type":"text","placeholder":"user name"},domProps:{"value":(_vm.form.username)},on:{"input":function($event){if($event.target.composing){ return; }_vm.$set(_vm.form, "username", $event.target.value)}}})]),_vm._v(" "),_c('div',{staticClass:"input-group m-b-2"},[_c('span',{staticClass:"input-group-addon"},[_c('i',{staticClass:"fa fa-lock"})]),_vm._v(" "),_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.form.password),expression:"form.password"}],staticClass:"form-control",attrs:{"type":"password","placeholder":"password"},domProps:{"value":(_vm.form.password)},on:{"keyup":function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"enter",13,$event.key,"Enter")){ return null; }return _vm.login($event)},"input":function($event){if($event.target.composing){ return; }_vm.$set(_vm.form, "password", $event.target.value)}}})]),_vm._v(" "),_c('div',{staticClass:"row"},[_c('el-row',[_c('el-col',{attrs:{"span":12}},[_c('el-button',{staticClass:"btn btn-primary p-x-2",attrs:{"type":"primary"},on:{"click":_vm.login}},[_vm._v("登录")])],1),_vm._v(" "),_c('el-col',{attrs:{"span":12}},[_c('el-button',{staticClass:"btn btn-link forgot",staticStyle:{"float":"right"},attrs:{"type":"button"}},[_vm._v("忘记密码?")])],1)],1)],1)])])]),_vm._v(" "),_c('el-col',{attrs:{"span":24,"xs":24,"sm":8,"md":8,"lg":8}},[_c('div',{staticClass:"login-register"},[_c('div',{staticClass:"card-block"},[_c('h2',[_vm._v("注册")]),_vm._v(" "),_c('p',[_vm._v("平台暂时只支持进入系统创建账号。")])])])])],1)],1)])],1)}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),

/***/ 1098:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_App_vue__ = __webpack_require__(424);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_App_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_App_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_App_vue__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_App_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_0fa3dc1c_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_App_vue__ = __webpack_require__(1112);
function injectStyle (ssrContext) {
  __webpack_require__(1099)
}
var normalizeComponent = __webpack_require__(21)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_App_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_0fa3dc1c_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_App_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),

/***/ 1099:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 1100:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_sideMenu_vue__ = __webpack_require__(425);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_sideMenu_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_sideMenu_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_sideMenu_vue__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_sideMenu_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_5bfed243_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_sideMenu_vue__ = __webpack_require__(1104);
function injectStyle (ssrContext) {
  __webpack_require__(1101)
}
var normalizeComponent = __webpack_require__(21)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_sideMenu_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_5bfed243_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_sideMenu_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),

/***/ 1101:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 1102:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 1103:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return (_vm.item.children && _vm.item.children.length>0)?_c('el-submenu',{staticClass:"el-menu-sub",attrs:{"index":_vm.item.href}},[_c('template',{slot:"title"},[_c('i',{class:_vm.item.icon}),_c('span',[_vm._v(_vm._s(_vm.item.name))])]),_vm._v(" "),_vm._l((_vm.item.children),function(child){return [(child.children && child.children.length>0)?_c('sub-menu',{attrs:{"param":child}}):_c('el-menu-item',{attrs:{"index":child.href}},[_c('i',{class:child.icon}),_c('span',[_vm._v(_vm._s(child.name))])])]})],2):_c('el-menu-item',{staticClass:"el-menu-each",attrs:{"index":_vm.item.href}},[_c('i',{class:_vm.item.icon}),_c('span',[_vm._v(_vm._s(_vm.item.name))])])}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),

/***/ 1104:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('aside',{staticClass:"main-sidebar animated",class:{ showSlide: _vm.sidebar.show, hideSlide: !_vm.sidebar.show, expandSide:(!_vm.sidebar.collapsed||_vm.device.isMobile)}},[((!_vm.sidebar.collapsed||_vm.device.isMobile))?_c('el-scrollbar',{attrs:{"tag":"div","wrapClass":"vue-scrollbar"}},[_c('div',{staticClass:"sidebar"},[_c('el-menu',{staticClass:"el-menu-style",attrs:{"default-active":_vm.onRoutes,"default-openeds":_vm.onRouteKeys,"theme":"light","router":"","collapse":_vm.sidebar.collapsed&&!_vm.device.isMobile},on:{"select":_vm.handleSelect}},[_vm._l((_vm.menuList),function(item){return [_c('sub-menu',{attrs:{"param":item}})]})],2)],1)]):_c('div',{staticClass:"sidebar"},[_c('el-menu',{staticClass:"el-menu-style",attrs:{"default-active":_vm.onRoutes,"theme":"light","router":"","collapse":_vm.sidebar.collapsed&&!_vm.device.isMobile},on:{"select":_vm.handleSelect}},[_vm._l((_vm.menuList),function(item){return [_c('sub-menu',{attrs:{"param":item}})]})],2)],1)],1)}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),

/***/ 1105:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_header_vue__ = __webpack_require__(428);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_header_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_header_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_header_vue__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_header_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_888dce50_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_header_vue__ = __webpack_require__(1107);
function injectStyle (ssrContext) {
  __webpack_require__(1106)
}
var normalizeComponent = __webpack_require__(21)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-888dce50"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_header_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_888dce50_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_header_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),

/***/ 1106:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 1107:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('header',{staticClass:"main-header animated",class:{closeLogo:_vm.sidebar.collapsed,mobileLogo:_vm.device.isMobile}},[_vm._m(0),_vm._v(" "),_c('nav',{staticClass:"navbar"},[_c('a',{staticClass:"sidebar-toggle",attrs:{"href":"#","data-toggle":"offcanvas","role":"button"},on:{"click":function($event){$event.stopPropagation();$event.preventDefault();return _vm.toggleMenu(!_vm.sidebar.collapsed,_vm.device.isMobile)}}},[_c('span',{staticClass:"sr-only"},[_vm._v("Toggle navigation")])]),_vm._v(" "),_c('div',{staticClass:"navbar-custom-menu"},[_c('el-dropdown',{staticClass:"navbar-dropdown",attrs:{"trigger":"click"}},[_c('div',{staticClass:"el-dropdown-link"},[_c('img',{staticStyle:{"width":"25px","height":"25px","border-radius":"50%","vertical-align":"middle"},attrs:{"src":__webpack_require__(429),"alt":"U"}}),_vm._v("\n          "+_vm._s(_vm.userInfo.userName)+"\n        ")]),_vm._v(" "),_c('el-dropdown-menu',{staticStyle:{"padding":"0px"}},[_c('div',[_c('div',{staticClass:"header-pic"},[_c('img',{staticClass:"img-circle",attrs:{"src":__webpack_require__(429),"alt":"User Image"}}),_vm._v(" "),_c('p',[_vm._v(_vm._s(_vm.userInfo.userName))])]),_vm._v(" "),_c('div',{staticClass:"pull-left"},[_c('router-link',{attrs:{"to":{ path: '/resetPwd' }}},[_c('el-button',{attrs:{"type":"default"}},[_vm._v("修改密码")])],1)],1),_vm._v(" "),_c('div',{staticClass:"pull-right"},[_c('el-button',{attrs:{"type":"default"},on:{"click":_vm.logout}},[_vm._v("退出")])],1)])])],1)],1)])])}
var staticRenderFns = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('a',{staticClass:"logo",attrs:{"href":"#"}},[_c('span',{staticClass:"logo-lg"},[_c('i',{staticClass:"fa fa-user-circle"}),_vm._v("  "),_c('b',[_vm._v("用户管理")])])])}]
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),

/***/ 1108:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_footer_vue__ = __webpack_require__(430);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_footer_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_footer_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_footer_vue__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_footer_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_616b2cb1_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_footer_vue__ = __webpack_require__(1110);
function injectStyle (ssrContext) {
  __webpack_require__(1109)
}
var normalizeComponent = __webpack_require__(21)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_footer_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_616b2cb1_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_footer_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),

/***/ 1109:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 1110:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('footer',{staticClass:"main-footer"})}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),

/***/ 1111:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 1112:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"wrapper fixed"},[_c('vue-progress-bar'),_vm._v(" "),_c('imp-header'),_vm._v(" "),_c('side-menu'),_vm._v(" "),_c('div',{staticClass:"content-wrapper",class:{ slideCollapse: _vm.sidebar.collapsed,mobileSide:_vm.device.isMobile}},[_c('el-scrollbar',{attrs:{"tag":"div","wrapClass":"content-scrollbar"}},[_c('section',{staticClass:"content"},[_c('el-breadcrumb',{staticStyle:{"margin-bottom":"20px"},attrs:{"separator":"/"}},[_vm._l((_vm.currentMenus),function(child){return [_c('el-breadcrumb-item',{attrs:{"to":{ path: child.href }}},[_vm._v(_vm._s(child.name))])]})],2),_vm._v(" "),_c('transition',{attrs:{"mode":"out-in","enter-active-class":"fadeIn","leave-active-class":"fadeOut","appear":""}},[_c('router-view')],1),_vm._v(" "),_c('imp-footer')],1)])],1)],1)}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),

/***/ 1113:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_user_vue__ = __webpack_require__(431);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_user_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_user_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_user_vue__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_user_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_67f178b9_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_user_vue__ = __webpack_require__(1115);
function injectStyle (ssrContext) {
  __webpack_require__(1114)
}
var normalizeComponent = __webpack_require__(21)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_user_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_67f178b9_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_user_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),

/***/ 1114:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 1115:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('imp-panel',[_c('h3',{staticClass:"box-title",staticStyle:{"width":"100%"},attrs:{"slot":"header"},slot:"header"},[_c('el-row',{staticStyle:{"width":"100%"}},[_c('el-col',{attrs:{"span":24}},[_c('el-button',{attrs:{"type":"primary","icon":"plus"},on:{"click":_vm.createUser}},[_vm._v("新增")]),_vm._v(" "),_c('el-form',{staticClass:"demo-form-inline searchForm",attrs:{"inline":true,"model":_vm.tableData.pagination}},[_c('el-select',{attrs:{"filterable":"","placeholder":"请选择权限组"},model:{value:(_vm.tableData.pagination.groupId),callback:function ($$v) {_vm.$set(_vm.tableData.pagination, "groupId", $$v)},expression:"tableData.pagination.groupId"}},_vm._l((_vm.groupIdList),function(item){return _c('el-option',{key:item.id,attrs:{"label":item.name,"value":item.id}})}),1),_vm._v(" "),_c('el-form-item',{attrs:{"label":"名称"}},[_c('el-input',{attrs:{"placeholder":"名称"},model:{value:(_vm.tableData.pagination.name),callback:function ($$v) {_vm.$set(_vm.tableData.pagination, "name", $$v)},expression:"tableData.pagination.name"}})],1),_vm._v(" "),_c('el-form-item',{attrs:{"label":"登录名"}},[_c('el-input',{attrs:{"placeholder":"登录名"},model:{value:(_vm.tableData.pagination.loginName),callback:function ($$v) {_vm.$set(_vm.tableData.pagination, "loginName", $$v)},expression:"tableData.pagination.loginName"}})],1),_vm._v(" "),_c('el-form-item',{attrs:{"label":"角色ID"}},[_c('el-input',{attrs:{"placeholder":"角色ID"},model:{value:(_vm.tableData.pagination.roleId),callback:function ($$v) {_vm.$set(_vm.tableData.pagination, "roleId", $$v)},expression:"tableData.pagination.roleId"}})],1),_vm._v(" "),_c('el-form-item',[_c('el-button',{attrs:{"type":"primary"},on:{"click":_vm.onSubmit}},[_vm._v("查询")])],1)],1)],1)],1)],1),_vm._v(" "),_c('div',{attrs:{"slot":"body"},slot:"body"},[_c('el-table',{directives:[{name:"loading",rawName:"v-loading",value:(_vm.listLoading),expression:"listLoading"}],staticStyle:{"width":"100%"},attrs:{"data":_vm.tableData.rows,"max-height":"700","border":""},on:{"selection-change":_vm.handleSelectionChange}},[_c('el-table-column',{attrs:{"prop":"id","type":"selection","width":"50"}}),_vm._v(" "),_c('el-table-column',{attrs:{"prop":"loginName","label":"登录名"}}),_vm._v(" "),_c('el-table-column',{attrs:{"prop":"name","label":"名称"}}),_vm._v(" "),_c('el-table-column',{attrs:{"prop":"no","label":"工号"}}),_vm._v(" "),_c('el-table-column',{attrs:{"prop":"email","label":"邮箱"}}),_vm._v(" "),_c('el-table-column',{attrs:{"prop":"remarks","label":"描述"}}),_vm._v(" "),_c('el-table-column',{attrs:{"prop":"joinTime","formatter":_vm.formatDate,"label":"入职时间"}}),_vm._v(" "),_c('el-table-column',{attrs:{"prop":"createDate","label":"创建时间"}}),_vm._v(" "),_c('el-table-column',{attrs:{"label":"操作","width":"300"},scopedSlots:_vm._u([{key:"default",fn:function(scope){return _c('el-button-group',{},[_c('el-button',{attrs:{"size":"small","title":"编辑用户信息","type":"primary"},on:{"click":function($event){return _vm.handleEdit(scope.$index, scope.row)}}},[_vm._v("编辑")]),_vm._v(" "),_c('el-button',{attrs:{"size":"small","title":"更新用户角色","type":"primary"},on:{"click":function($event){return _vm.handleRoleConfig(scope.$index, scope.row)}}},[_vm._v("角色")]),_vm._v(" "),_c('el-button',{attrs:{"size":"small","title":"删除当前用户","type":"danger"},on:{"click":function($event){return _vm.handleDelete(scope.$index, scope.row)}}},[_vm._v("删除")])],1)}}])})],1),_vm._v(" "),_c('el-pagination',{attrs:{"current-page":_vm.tableData.pagination.pageNum,"page-sizes":[5, 10, 20],"page-size":_vm.tableData.pagination.pageSize,"layout":"total, sizes, prev, pager, next, jumper","total":_vm.tableData.pagination.total},on:{"size-change":_vm.handleSizeChange,"current-change":_vm.handleCurrentChange}}),_vm._v(" "),_c('el-dialog',{staticClass:"userRole",attrs:{"title":_vm.userTitle,"visible":_vm.dialogVisible,"width":"30%"},on:{"update:visible":function($event){_vm.dialogVisible=$event}}},[_c('div',{staticClass:"select-tree"},[_c('el-checkbox-group',{model:{value:(_vm.roleIdList),callback:function ($$v) {_vm.roleIdList=$$v},expression:"roleIdList"}},_vm._l((_vm.roleLists),function(role){return _c('el-checkbox',{key:role.id,attrs:{"label":role.id,"title":role.name}},[_vm._v(_vm._s(role.name))])}),1)],1),_vm._v(" "),_c('span',{staticClass:"dialog-footer",attrs:{"slot":"footer"},slot:"footer"},[_c('el-button',{on:{"click":function($event){_vm.dialogVisible = false}}},[_vm._v("取 消")]),_vm._v(" "),_c('el-button',{attrs:{"type":"primary"},on:{"click":function($event){return _vm.configUserRoles()}}},[_vm._v("确 定")])],1)])],1)])}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),

/***/ 1116:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_userAdd_vue__ = __webpack_require__(432);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_userAdd_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_userAdd_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_userAdd_vue__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_userAdd_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_83fdf9a6_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_userAdd_vue__ = __webpack_require__(1118);
function injectStyle (ssrContext) {
  __webpack_require__(1117)
}
var normalizeComponent = __webpack_require__(21)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_userAdd_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_83fdf9a6_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_userAdd_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),

/***/ 1117:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 1118:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('imp-panel',{attrs:{"title":_vm.userTitle}},[_c('el-row'),_vm._v(" "),_c('el-form',{directives:[{name:"loading",rawName:"v-loading",value:(_vm.editLoading),expression:"editLoading"}],ref:"form",attrs:{"label-position":"left","hide-required-asterisk:":"","true":"","model":_vm.form,"rules":_vm.rules,"label-width":"180px"}},[_c('el-row',{staticClass:"headForm"},[_c('el-form-item',{attrs:{"label":"工号：","prop":"no","rules":[{ required: true, message: '工号不能为空'}]}},[_c('el-input',{model:{value:(_vm.form.no),callback:function ($$v) {_vm.$set(_vm.form, "no", $$v)},expression:"form.no"}})],1),_vm._v(" "),_c('el-form-item',{attrs:{"label":"姓名：","prop":"name","rules":[{ required: true, message: '姓名不能为空'}]}},[_c('el-input',{model:{value:(_vm.form.name),callback:function ($$v) {_vm.$set(_vm.form, "name", $$v)},expression:"form.name"}})],1),_vm._v(" "),_c('el-form-item',{attrs:{"label":"入职日期：","prop":"joinTime"}},[_c('el-date-picker',{attrs:{"align":"right","type":"date","format":"yyyy-MM-dd","value-format":"timestamp","placeholder":"选择日期","editable":false,"picker-options":_vm.pickerOptions},model:{value:(_vm.form.joinTime),callback:function ($$v) {_vm.$set(_vm.form, "joinTime", $$v)},expression:"form.joinTime"}})],1)],1),_vm._v(" "),_c('el-row',{staticClass:"inputForm"},[_c('el-form-item',{attrs:{"label":"登录名：","prop":"loginName","rules":[{ required: true, message: '登录名不能为空'}]}},[_c('el-input',{model:{value:(_vm.form.loginName),callback:function ($$v) {_vm.$set(_vm.form, "loginName", $$v)},expression:"form.loginName"}}),_vm._v(" "),_c('el-input',{staticStyle:{"position":"fixed","bottom":"-9999px"},attrs:{"type":"text"}})],1),_vm._v(" "),(_vm.form.id)?_c('el-form-item',{attrs:{"label":"密码："}},[_c('el-input',{staticStyle:{"position":"fixed","bottom":"-9999px"},attrs:{"type":"password"}}),_vm._v(" "),_c('el-input',{attrs:{"type":"password"},model:{value:(_vm.form.newPassword),callback:function ($$v) {_vm.$set(_vm.form, "newPassword", $$v)},expression:"form.newPassword"}}),_c('span',{staticClass:"passTitle"},[_vm._v("若不修改密码，请留空。")])],1):_c('el-form-item',{attrs:{"label":"密码：","prop":"newPassword","rules":[{ required: true, message: '密码不能为空'}]}},[_c('el-input',{staticStyle:{"position":"fixed","bottom":"-9999px"},attrs:{"type":"password"}}),_vm._v(" "),_c('el-input',{attrs:{"type":"password"},model:{value:(_vm.form.newPassword),callback:function ($$v) {_vm.$set(_vm.form, "newPassword", $$v)},expression:"form.newPassword"}})],1),_vm._v(" "),_c('el-form-item',{attrs:{"label":"邮箱：","prop":"email","rules":[{ required: true, message: '邮箱不能为空'}]}},[_c('el-input',{model:{value:(_vm.form.email),callback:function ($$v) {_vm.$set(_vm.form, "email", $$v)},expression:"form.email"}})],1),_vm._v(" "),_c('el-form-item',{attrs:{"label":"确认密码：","prop":"checkPass"}},[_c('el-input',{attrs:{"type":"password"},model:{value:(_vm.form.checkPass),callback:function ($$v) {_vm.$set(_vm.form, "checkPass", $$v)},expression:"form.checkPass"}})],1),_vm._v(" "),_c('el-form-item',{attrs:{"label":"电话："}},[_c('el-input',{model:{value:(_vm.form.phone),callback:function ($$v) {_vm.$set(_vm.form, "phone", $$v)},expression:"form.phone"}})],1),_vm._v(" "),_c('el-form-item',{attrs:{"label":"用户类型："}},[_c('el-radio-group',{model:{value:(_vm.form.userType),callback:function ($$v) {_vm.$set(_vm.form, "userType", $$v)},expression:"form.userType"}},[_c('el-radio',{attrs:{"label":"1"}},[_vm._v("超级管理员")]),_vm._v(" "),_c('el-radio',{attrs:{"label":"2"}},[_vm._v("管理员")]),_vm._v(" "),_c('el-radio',{attrs:{"label":"3"}},[_vm._v("普通用户")])],1)],1)],1),_vm._v(" "),_c('el-form-item',{directives:[{name:"loading",rawName:"v-loading",value:(_vm.checkLoading),expression:"checkLoading"}],attrs:{"label":"用户角色："}},[_c('el-checkbox-group',{model:{value:(_vm.form.roleIdList),callback:function ($$v) {_vm.$set(_vm.form, "roleIdList", $$v)},expression:"form.roleIdList"}},_vm._l((_vm.roles.roleList),function(role){return _c('el-checkbox',{key:role.id,attrs:{"label":role.id}},[_vm._v(_vm._s(role.name))])}),1)],1),_vm._v(" "),_c('el-form-item',{attrs:{"label":"备注："}},[_c('el-input',{attrs:{"type":"textarea"},model:{value:(_vm.form.remarks),callback:function ($$v) {_vm.$set(_vm.form, "remarks", $$v)},expression:"form.remarks"}})],1),_vm._v(" "),_c('el-form-item',[(_vm.form.id)?_c('el-button',{attrs:{"type":"primary"},on:{"click":function($event){return _vm.userBtnClick('form')}}},[_vm._v("保存")]):_c('el-button',{attrs:{"type":"primary"},on:{"click":function($event){return _vm.userBtnClick('form')}}},[_vm._v("立即创建")])],1)],1)],1)}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),

/***/ 1119:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_resetPwd_vue__ = __webpack_require__(433);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_resetPwd_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_resetPwd_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_resetPwd_vue__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_resetPwd_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_1560ef9d_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_resetPwd_vue__ = __webpack_require__(1120);
var normalizeComponent = __webpack_require__(21)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_resetPwd_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_1560ef9d_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_resetPwd_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),

/***/ 112:
/***/ (function(module, exports) {

module.exports = {"resourceList":[{"id":52,"parentId":null,"sort":0,"name":"登录","code":"/login","type":3,"usable":"1","remarks":"","children":[]},{"id":68,"parentId":null,"sort":0,"name":"仪表盘","code":"/index","type":1,"usable":"1","remarks":"","children":[]},{"id":69,"parentId":null,"sort":0,"name":"系统管理","code":"/sys","type":1,"usable":"1","remarks":"","children":[{"id":82,"parentId":69,"sort":0,"name":"资源管理","code":"/sys/resource","type":1,"usable":"1","remarks":"","children":[{"id":99,"parentId":82,"sort":0,"name":"/sys/resource/get","code":"/sys/resource/get","type":3,"usable":"1","remarks":"","children":[]},{"id":100,"parentId":82,"sort":0,"name":"/sys/resource/update","code":"/sys/resource/update","type":3,"usable":"1","remarks":"","children":[]},{"id":101,"parentId":82,"sort":0,"name":"/sys/resource/delete","code":"/sys/resource/delete","type":3,"usable":"1","remarks":"","children":[]},{"id":102,"parentId":82,"sort":0,"name":"/sys/resource/add","code":"/sys/resource/add","type":3,"usable":"1","remarks":"","children":[]},{"id":103,"parentId":82,"sort":0,"name":"/sys/resource/page","code":"/sys/resource/page","type":3,"usable":"1","remarks":"","children":[]},{"id":104,"parentId":82,"sort":0,"name":"/sys/resource/list","code":"/sys/resource/list","type":3,"usable":"1","remarks":"","children":[]},{"id":105,"parentId":82,"sort":0,"name":"/sys/resource/list2","code":"/sys/resource/list2","type":3,"usable":"1","remarks":"","children":[]}]},{"id":70,"parentId":69,"sort":1,"name":"菜单管理","code":"/sys/menuList","type":1,"usable":"1","remarks":"","children":[{"id":83,"parentId":70,"sort":0,"name":"/sys/menu/get","code":"/sys/menu/get","type":3,"usable":"1","remarks":"","children":[]},{"id":84,"parentId":70,"sort":0,"name":"/sys/menu/update","code":"/sys/menu/update","type":3,"usable":"1","remarks":"","children":[]},{"id":85,"parentId":70,"sort":0,"name":"/sys/menu/delete","code":"/sys/menu/delete","type":3,"usable":"1","remarks":"","children":[]},{"id":86,"parentId":70,"sort":0,"name":"/sys/menu/add","code":"/sys/menu/add","type":3,"usable":"1","remarks":"","children":[]},{"id":87,"parentId":70,"sort":0,"name":"/sys/menu/page","code":"/sys/menu/page","type":3,"usable":"1","remarks":"","children":[]},{"id":88,"parentId":70,"sort":0,"name":"/sys/menu/list","code":"/sys/menu/list","type":3,"usable":"1","remarks":"","children":[]},{"id":89,"parentId":70,"sort":0,"name":"/sys/menu/list2","code":"/sys/menu/list2","type":3,"usable":"1","remarks":"","children":[]}]},{"id":71,"parentId":69,"sort":3,"name":"角色管理","code":"/sys/roleList","type":1,"usable":"1","remarks":"","children":[{"id":90,"parentId":71,"sort":0,"name":"/sys/role/get","code":"/sys/role/get","type":3,"usable":"1","remarks":"","children":[]},{"id":91,"parentId":71,"sort":0,"name":"/sys/role/update","code":"/sys/role/update","type":3,"usable":"1","remarks":"","children":[]},{"id":92,"parentId":71,"sort":0,"name":"/sys/role/delete","code":"/sys/role/delete","type":3,"usable":"1","remarks":"","children":[]},{"id":93,"parentId":71,"sort":0,"name":"/sys/role/add","code":"/sys/role/add","type":3,"usable":"1","remarks":"","children":[]},{"id":94,"parentId":71,"sort":0,"name":"/sys/role/page","code":"/sys/role/page","type":3,"usable":"1","remarks":"","children":[]},{"id":95,"parentId":71,"sort":0,"name":"/sys/role/list","code":"/sys/role/list","type":3,"usable":"1","remarks":"","children":[]},{"id":96,"parentId":71,"sort":0,"name":"/sys/role/list2","code":"/sys/role/list2","type":3,"usable":"1","remarks":"","children":[]},{"id":97,"parentId":71,"sort":0,"name":"/sys/role/resources","code":"/sys/role/resources","type":3,"usable":"1","remarks":"","children":[]},{"id":98,"parentId":71,"sort":0,"name":"/sys/role/setResources","code":"/sys/role/setResources","type":3,"usable":"1","remarks":"","children":[]}]},{"id":73,"parentId":69,"sort":3,"name":"用户组管理","code":"/sys/userGroup","type":1,"usable":"1","remarks":"","children":[{"id":90,"parentId":71,"sort":0,"name":"/sys/role/get","code":"/sys/role/get","type":3,"usable":"1","remarks":"","children":[]},{"id":91,"parentId":73,"sort":0,"name":"/sys/role/update","code":"/sys/role/update","type":3,"usable":"1","remarks":"","children":[]},{"id":92,"parentId":73,"sort":0,"name":"/sys/role/delete","code":"/sys/role/delete","type":3,"usable":"1","remarks":"","children":[]},{"id":93,"parentId":73,"sort":0,"name":"/sys/role/add","code":"/sys/role/add","type":3,"usable":"1","remarks":"","children":[]},{"id":94,"parentId":73,"sort":0,"name":"/sys/role/page","code":"/sys/role/page","type":3,"usable":"1","remarks":"","children":[]},{"id":95,"parentId":73,"sort":0,"name":"/sys/role/list","code":"/sys/role/list","type":3,"usable":"1","remarks":"","children":[]},{"id":96,"parentId":73,"sort":0,"name":"/sys/role/list2","code":"/sys/role/list2","type":3,"usable":"1","remarks":"","children":[]},{"id":97,"parentId":73,"sort":0,"name":"/sys/role/resources","code":"/sys/role/resources","type":3,"usable":"1","remarks":"","children":[]},{"id":98,"parentId":73,"sort":0,"name":"/sys/role/setResources","code":"/sys/role/setResources","type":3,"usable":"1","remarks":"","children":[]}]},{"id":72,"parentId":69,"sort":6,"name":"用户管理","code":"/sys/userList","type":1,"usable":"1","remarks":"","children":[{"id":106,"parentId":72,"sort":0,"name":"/sys/user/get","code":"/sys/user/get","type":3,"usable":"1","remarks":"","children":[]},{"id":107,"parentId":72,"sort":0,"name":"/sys/user/add","code":"/sys/user/add","type":3,"usable":"1","remarks":"","children":[]},{"id":108,"parentId":72,"sort":0,"name":"/sys/user/update","code":"/sys/user/update","type":3,"usable":"1","remarks":"","children":[]},{"id":109,"parentId":72,"sort":0,"name":"/sys/user/delete","code":"/sys/user/delete","type":3,"usable":"1","remarks":"","children":[]},{"id":110,"parentId":72,"sort":0,"name":"/sys/user/page","code":"/sys/user/page","type":3,"usable":"1","remarks":"","children":[]},{"id":111,"parentId":72,"sort":0,"name":"/sys/user/roleIds","code":"/sys/user/roleIds","type":3,"usable":"1","remarks":"","children":[]},{"id":112,"parentId":72,"sort":0,"name":"/sys/user/setRoles","code":"/sys/user/setRoles","type":3,"usable":"1","remarks":"","children":[]}]}]}],"menuList":[{"id":1,"parentId":null,"sort":0,"name":"仪表盘","href":"/index","icon":"fa fa-dashboard","children":[],"isShow":"1"},{"id":31,"parentId":null,"sort":1,"name":"测试1","href":"/test/1","icon":"fa fa-upload","children":[{"id":92,"parentId":31,"sort":0,"name":"测试1-1","href":"/test/1/1","icon":"fa fa-bank","children":[{"id":912,"parentId":92,"sort":0,"name":"测试1-1-1","href":"/test/1/1/1","icon":"fa fa-bank","children":[],"isShow":"1"},{"id":913,"parentId":92,"sort":0,"name":"测试1-1-2","href":"/test/1/1/2","icon":"fa fa-area-chart","children":[],"isShow":"1"}],"isShow":"1"},{"id":93,"parentId":31,"sort":0,"name":"测试1-2","href":"/test/1/2","icon":"fa fa-area-chart","children":[],"isShow":"1"}],"isShow":"1"},{"id":102,"parentId":null,"sort":3,"name":"测试2","href":"/test/2","icon":"fa fa-download","children":[{"id":103,"parentId":102,"sort":0,"name":"测试2-1","href":"/test/2/1","icon":"fa fa-image","children":[],"isShow":"1"}],"isShow":"1"},{"id":6,"parentId":null,"sort":6,"name":"系统管理","href":"/sys","icon":"fa fa-cog","children":[{"id":108,"parentId":6,"sort":0,"name":" 资源管理","href":"/sys/resource","icon":"fa fa-database","children":[],"isShow":"1"},{"id":7,"parentId":6,"sort":1,"name":"菜单管理","href":"/sys/menuList","icon":"fa fa-navicon","children":[],"isShow":"1"},{"id":8,"parentId":6,"sort":2,"name":"权限管理","href":"/sys/roleList","icon":"fa fa-universal-access","children":[],"isShow":"1"},{"id":10,"parentId":6,"sort":4,"name":"用户组管理","href":"/sys/userGroup","icon":"fa fa-universal-access","children":[],"isShow":"1"},{"id":9,"parentId":6,"sort":3,"name":"用户管理","href":"/sys/userList","icon":"fa fa-user-plus","children":[],"isShow":"1"}],"isShow":"1"}],"roleList":[{"id":26,"delFlag":0,"parentId":null,"sort":0,"name":"超级管理员","enName":"super_manager","usable":"1","remarks":"","children":[]},{"id":27,"delFlag":0,"parentId":null,"sort":1,"name":"客服主管","enName":"server_manager","usable":"1","remarks":"","children":[{"id":28,"delFlag":0,"parentId":27,"sort":0,"name":"售后客服","enName":"server1","usable":"1","remarks":"","children":[]},{"id":29,"delFlag":0,"parentId":27,"sort":1,"name":"售前客服","enName":"server2","usable":"1","remarks":"","children":[]}]}],"userList":[{"id":12,"delFlag":"0","companyId":null,"officeId":null,"loginName":"lanux","password":null,"no":null,"name":"12345","email":"lanux@foxmail.com","phone":null,"mobile":null,"userType":null,"photo":null,"loginIp":null,"loginDate":null,"loginFlag":null,"remarks":null,"status":2,"token":null},{"id":23,"delFlag":"0","companyId":null,"officeId":null,"loginName":"lanux","password":null,"no":null,"name":"12345","email":"lanux@foxmail.com","phone":null,"mobile":null,"userType":null,"photo":null,"loginIp":null,"loginDate":null,"loginFlag":null,"remarks":null,"status":1,"token":null},{"id":2333,"delFlag":"0","companyId":null,"officeId":null,"loginName":"lanux","password":null,"no":null,"name":"12345","email":null,"phone":null,"mobile":null,"userType":null,"photo":null,"loginIp":null,"loginDate":null,"loginFlag":null,"remarks":null,"status":1,"token":null},{"id":345,"delFlag":"0","companyId":null,"officeId":null,"loginName":"lanux","password":null,"no":null,"name":"12345","email":"lanux@foxmail.com","phone":null,"mobile":null,"userType":null,"photo":null,"loginIp":null,"loginDate":null,"loginFlag":null,"remarks":null,"status":2,"token":null},{"id":45,"delFlag":"0","companyId":null,"officeId":null,"loginName":"lanux","password":null,"no":null,"name":"12345","email":null,"phone":null,"mobile":null,"userType":null,"photo":null,"loginIp":null,"loginDate":null,"loginFlag":null,"remarks":null,"status":0,"token":null},{"id":56,"delFlag":"0","companyId":null,"officeId":null,"loginName":"lanux","password":null,"no":null,"name":"12345","email":"lanux@foxmail.com","phone":null,"mobile":null,"userType":null,"photo":null,"loginIp":null,"loginDate":null,"loginFlag":null,"remarks":null,"status":null,"token":null},{"id":67,"delFlag":"0","companyId":null,"officeId":null,"loginName":"lanux","password":null,"no":null,"name":"12345","email":null,"phone":null,"mobile":null,"userType":null,"photo":null,"loginIp":null,"loginDate":null,"loginFlag":null,"remarks":null,"status":null,"token":null},{"id":78,"delFlag":"0","companyId":null,"officeId":null,"loginName":"lanux","password":null,"no":null,"name":"12345","email":"lanux@foxmail.com","phone":null,"mobile":null,"userType":null,"photo":null,"loginIp":null,"loginDate":null,"loginFlag":null,"remarks":null,"status":null,"token":null},{"id":87,"delFlag":"0","companyId":null,"officeId":null,"loginName":"lanux","password":null,"no":null,"name":"12345","email":"lanux@foxmail.com","phone":null,"mobile":null,"userType":null,"photo":null,"loginIp":null,"loginDate":null,"loginFlag":null,"remarks":null,"status":null,"token":null}],"messageList":[{"id":"640000201501165883","type":0,"code":107,"timeLine":"2013031613","message":"阶期查音音南这认式给自来走事。手进全线引其质行族导深些。","title":"作几点内部重压示现或采候器日","createTime":"426050337874","senderName":"Hall","senderPic":"http://dummyimage.com/100x100/f2799f/757575.png&text=H"},{"id":"15000019760303327X","type":1,"code":109,"timeLine":"1994030718","message":"听飞叫例感给其团南织主作什。","title":"府铁些以眼铁南单行办其被眼线","createTime":"612808881585","senderName":"Hall","senderPic":"http://dummyimage.com/100x100/79c3f2/757575.png&text=H"},{"id":"530000198607165793","type":1,"code":106,"timeLine":"1990122503","message":"于学认气感很效效引需说报党。调应各近思常市美许自毛完容矿日增。","title":"整近律马造起米农员济解题自例识个","createTime":"234654265042","senderName":"Rodriguez","senderPic":"http://dummyimage.com/100x100/e6f279/757575.png&text=R"},{"id":"320000200905032842","type":1,"code":103,"timeLine":"1980062104","message":"除年命却积同部去断权议党低二易过。","title":"消问料品把精是器话","createTime":"1194108860623","senderName":"Lewis","senderPic":"http://dummyimage.com/100x100/da79f2/757575.png&text=L"},{"id":"210000198109172937","type":1,"code":104,"timeLine":"1993041210","message":"具都主部确特次取圆派不儿日和难力。","title":"导结计市色通证确高想","createTime":"374284498307","senderName":"Hernandez","senderPic":"http://dummyimage.com/100x100/79f2b7/757575.png&text=H"},{"id":"410000200402164212","type":1,"code":108,"timeLine":"2015123015","message":"青矿地级质还进眼件每产它整区土容斯消。","title":"治龙工必近思空例东应","createTime":"626036503938","senderName":"Martinez","senderPic":"http://dummyimage.com/100x100/f29479/757575.png&text=M"},{"id":"620000198507210923","type":0,"code":104,"timeLine":"1983120914","message":"意动林设状军红关风家声会政复增低。上指置由步联其气养精直该才清。信果此二存日效产学者今打品江代面。","title":"教月历统其等革法格油满精发光","createTime":"778399865782","senderName":"Rodriguez","senderPic":"http://dummyimage.com/100x100/7981f2/757575.png&text=R"},{"id":"330000198108089346","type":1,"code":108,"timeLine":"1983032322","message":"温象采色已必使战素并京名或们。报始民名料是究要系后体治给单消容且。","title":"此个同但基广流看","createTime":"396531147139","senderName":"Robinson","senderPic":"http://dummyimage.com/100x100/a4f279/757575.png&text=R"},{"id":"82000019811016775X","type":0,"code":105,"timeLine":"1970082304","message":"你最志造越员因说转拉克要书实结心存。化研则济得象青便图造拉世格。","title":"也作队思国月义听办研成","createTime":"1429957209433","senderName":"Anderson","senderPic":"http://dummyimage.com/100x100/f279c8/757575.png&text=A"},{"id":"710000198510122053","type":0,"code":104,"timeLine":"2014052203","message":"科三解角响观府你满在可之。权任合区员学它果接领速广断领按。","title":"几它场新亲农也区技须究声完社情","createTime":"1013282383046","senderName":"Wilson","senderPic":"http://dummyimage.com/100x100/79ebf2/757575.png&text=W"}]}

/***/ }),

/***/ 1120:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('imp-panel',{attrs:{"title":"重置密码"}},[_c('el-form',{ref:"form",attrs:{"model":_vm.form,"label-width":"180px","rules":_vm.rules}},[_c('el-form-item',{attrs:{"label":"旧密码","prop":"oldPassword","rules":[{ required: true, message: '旧密码不能为空'}]}},[_c('el-input',{attrs:{"type":"password"},model:{value:(_vm.form.oldPassword),callback:function ($$v) {_vm.$set(_vm.form, "oldPassword", $$v)},expression:"form.oldPassword"}})],1),_vm._v(" "),_c('el-form-item',{attrs:{"label":"新密码","prop":"newPassword","rules":[{ required: true, message: '新密码不能为空'}]}},[_c('el-input',{attrs:{"type":"password"},model:{value:(_vm.form.newPassword),callback:function ($$v) {_vm.$set(_vm.form, "newPassword", $$v)},expression:"form.newPassword"}})],1),_vm._v(" "),_c('el-form-item',{attrs:{"label":"重复新密码","prop":"newPassword2"}},[_c('el-input',{attrs:{"type":"password"},model:{value:(_vm.form.newPassword2),callback:function ($$v) {_vm.$set(_vm.form, "newPassword2", $$v)},expression:"form.newPassword2"}})],1),_vm._v(" "),_c('el-form-item',[_c('el-button',{attrs:{"type":"primary"},on:{"click":function($event){return _vm.onSubmit('form')}}},[_vm._v("修改")])],1)],1)],1)}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),

/***/ 1126:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var trim = function trim(string) {
  return string.toString().replace();
};

var subString = function subString(value) {
  var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;

  if (value && value != null && value.length > length) {
    return value.substring(0, length);
  }
  return value;
};

exports.default = {
  trim: trim, subString: subString
};

/***/ }),

/***/ 1128:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 114:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var types = {
  TOGGLE_LOADING: 'TOGGLE_LOADING',
  TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
  TOGGLE_SIDEBAR_SHOW: 'TOGGLE_SIDEBAR_SHOW',
  TOGGLE_DEVICE: "TOGGLE_DEVICE",
  EXPAND_MENU: 'EXPAND_MENU',
  SWITCH_EFFECT: 'SWITCH_EFFECT',
  LOAD_MENU: 'LOAD_MENU',
  LOAD_CURRENT_MENU: 'LOAD_CURRENT_MENU',
  SET_USER_INFO: 'SET_USER_INFO'
};

exports.default = types;

/***/ }),

/***/ 137:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  randomString: function randomString(len, radix) {
    var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var chars = CHARS,
        uuid = [],
        i;
    radix = radix || chars.length;

    if (len) {
      for (i = 0; i < len; i++) {
        uuid[i] = chars[0 | Math.random() * radix];
      }
    } else {
      var r;

      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';

      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random() * 16;
          uuid[i] = chars[i == 19 ? r & 0x3 | 0x8 : r];
        }
      }
    }

    return uuid.join('');
  },
  getUid: function getUid() {
    var uid = window.localStorage.getItem('imp-uuid');
    if (!uid) {
      uid = this.randomString(32);
      window.localStorage.setItem('imp-uuid', uid);
    }
    return uid;
  },

  setSid: function setSid(value) {
    var exp = new Date();
    exp.setTime(exp.getTime() + 24 * 60 * 60 * 1000);
    document.cookie = "imp-sid=" + escape(value) + ";expires=" + exp.toGMTString();
  },

  getSid: function getSid() {
    var arr,
        reg = new RegExp("(^| )imp-sid=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) {
      sid = unescape(arr[2]);
    }
    if (!!sid) {
      return sid;
    }
    return '';

    var sid = window.localStorage.getItem('imp-sid');
    if (!!sid) {
      return sid;
    }
    return '';
  },

  deleteSid: function deleteSid() {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    document.cookie = "imp-sid=v;expires=" + exp.toGMTString();
  },

  login: function login(token, callback) {
    this.setSid(token);
    if (callback) callback();
    return;

    window.localStorage.setItem('imp-sid', token);
    if (callback) callback();
  },
  getToken: function getToken() {
    var sId = this.getSid();
    return sId;

    return window.localStorage.getItem('imp-sid');
  },
  logout: function logout(cb) {
    this.deleteSid();
    if (cb) cb();
    return;

    window.localStorage.removeItem('imp-sid');
    if (cb) cb();
  },
  loggedIn: function loggedIn() {
    return !!this.getSid();
    return !!window.localStorage.getItem('imp-sid');
  }
};

/***/ }),

/***/ 177:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_panel_vue__ = __webpack_require__(418);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_panel_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_panel_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_panel_vue__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_panel_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_1ed02326_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_panel_vue__ = __webpack_require__(1076);
function injectStyle (ssrContext) {
  __webpack_require__(1075)
}
var normalizeComponent = __webpack_require__(21)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-1ed02326"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_panel_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_1ed02326_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_panel_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),

/***/ 297:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

__webpack_require__(649);

exports.default = {
    name: 'frame'
};

/***/ }),

/***/ 299:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = __webpack_require__(73);

var _extends3 = _interopRequireDefault(_extends2);

var _echarts = __webpack_require__(300);

var _echarts2 = _interopRequireDefault(_echarts);

var _macarons = __webpack_require__(948);

var _macarons2 = _interopRequireDefault(_macarons);

var _data = __webpack_require__(112);

var _data2 = _interopRequireDefault(_data);

var _vuex = __webpack_require__(113);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getBeforeDate = function getBeforeDate(n) {
  var list = [];
  var d = new Date();
  var s = '';
  var i = 0;
  while (i < n) {
    d.setDate(d.getDate() - 1);
    var year = d.getFullYear();
    var mon = d.getMonth() + 1;
    var day = d.getDate();
    list.push(year + "-" + (mon < 10 ? '0' + mon : mon) + "-" + (day < 10 ? '0' + day : day));
    i++;
  }
  return list.reverse();
};

var option = {
  title: {
    text: '每日数据统计',
    subtext: '纯属虚构',
    left: 'center'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow' }
  },
  legend: {
    data: ['指标1', '指标2', '指标3', '指标4'],
    orient: 'vertical',
    left: 'right',
    top: 'middle',
    itemGap: 20
  },
  toolbox: {
    show: true,
    orient: 'horizontal',
    x: 'right',
    y: 'top',
    color: ['#1e90ff', '#22bb22', '#4b0082', '#d2691e'],
    feature: {
      mark: { show: true },
      dataView: { show: true, readOnly: false },
      magicType: { show: true, type: ['line', 'bar', 'stack', 'tiled'] },
      restore: { show: true },
      saveAsImage: { show: true }
    }
  },
  calculable: true,
  dataZoom: {
    show: true,
    realtime: true,
    start: 0,
    end: 100
  },
  xAxis: [{
    type: 'category',
    boundaryGap: false,
    data: getBeforeDate(30)
  }],
  yAxis: [{
    type: 'value'
  }],
  series: [{
    name: '指标1',
    type: 'line',
    tiled: '总量',
    areaStyle: { normal: {} },
    data: function () {
      var list = [];
      for (var i = 1; i <= 30; i++) {
        list.push(Math.round(Math.random() * 1000));
      }
      return list;
    }()
  }, {
    name: '指标2',
    type: 'line',
    tiled: '总量',
    areaStyle: { normal: {} },
    data: function () {
      var list = [];
      for (var i = 1; i <= 30; i++) {
        list.push(Math.round(Math.random() * 600));
      }
      return list;
    }()
  }, {
    name: '指标3',
    type: 'line',
    tiled: '总量',
    areaStyle: { normal: {} },
    data: function () {
      var list = [];
      for (var i = 1; i <= 30; i++) {
        list.push(Math.round(Math.random() * 200));
      }
      return list;
    }()
  }, {
    name: '指标4',
    type: 'line',
    tiled: '总量',
    areaStyle: { normal: {} },
    data: function () {
      var list = [];
      for (var i = 1; i <= 30; i++) {
        list.push(Math.round(Math.random() * 100));
      }
      return list;
    }()
  }]
};

exports.default = {
  data: function data() {
    return {
      chart: null
    };
  },

  computed: (0, _extends3.default)({}, (0, _vuex.mapGetters)({
    sidebar: 'sidebar',
    device: 'device'
  })),
  methods: {
    drawbar: function drawbar(id) {
      var o = document.getElementById(id);
      var height = document.documentElement.clientHeight;
      height -= 120;
      o.style.height = height + "px";
      this.chart = _echarts2.default.init(o, 'macarons');
      this.chart.setOption(option);
    }
  },
  mounted: function mounted() {
    this.$nextTick(function () {
      this.drawbar('gotobedbar');
      var that = this;
      var resizeTimer = null;
      window.onresize = function () {
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
          that.drawbar('gotobedbar');
        }, 300);
      };
    });
  },

  watch: {
    'sidebar.collapsed': function sidebarCollapsed(val) {
      this.chart = {};
      var that = this;
      setTimeout(function () {
        that.drawbar('gotobedbar');
      }, 300);
    }
  }
};

/***/ }),

/***/ 373:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {};

/***/ }),

/***/ 374:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _api = __webpack_require__(44);

var api = _interopRequireWildcard(_api);

var _data2 = __webpack_require__(112);

var _data3 = _interopRequireDefault(_data2);

var _sys = __webpack_require__(58);

var sysApi = _interopRequireWildcard(_sys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.default = {
  data: function data() {
    return {
      currentRow: {},
      dialogVisible: false,
      fatherLoading: false,

      formLabelWidth: '80px',
      formTitle: '新增菜单',
      dialogFormVisible: false,
      createForm: {
        name: '',
        isShow: '1',
        href: '',
        id: '',
        sort: 1,
        parentIds: '',
        parent: {
          id: '0'
        },
        remarks: ''
      },
      searchKey: '',
      tableData: []
    };
  },

  methods: {
    search: function search(target) {
      this.loadData();
    },
    addBtnClick: function addBtnClick(index) {
      var row = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (this.$refs && this.$refs.createForm) {
        this.$refs.createForm.clearValidate();
      }
      this.userChangeType = false;
      this.dialogFormVisible = true;
      this.formTitle = '新增菜单';
      if (row.name) {
        this.userChangeType = true;
        this.formTitle = '修改菜单（' + row.name + '）';
      }
      for (var name in this.createForm) {
        if (name == 'isShow') {
          this.createForm[name] = row[name] || '1';
        } else if (name == 'parent') {
          this.createForm[name].id = row.parentId || '0';
        } else {
          this.createForm[name] = row[name];
        }
      }
    },
    addParentClick: function addParentClick(index) {
      var row = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      this.formTitle = '新增菜单（' + row.name + '）';
      for (var name in this.createForm) {
        if (name == 'parent') {
          this.createForm[name].id = row.id;
        } else if (name == 'isShow') {
          this.createForm[name] = '1';
        } else if (name == 'sort') {
          this.createForm[name] = 0;
        } else {
          this.createForm[name] = '';
        }
      }
      this.userChangeType = false;
      this.dialogFormVisible = true;
    },
    addUserGroup: function addUserGroup(formName) {
      var _this = this;

      this.$refs[formName].validate(function (valid) {
        if (valid) {
          _this.dialogFormVisible = false;
          _this.submitMenu();
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    submitMenu: function submitMenu() {
      var _this2 = this;

      this.$http.post(api.SYS_MENU_UPSERT, this.createForm).then(function (res) {
        var _type = 'error';
        if (res.data && res.data.code == '0') {
          _type = 'success';
          _this2.loadData();
        }
        _this2.$message({
          type: _type,
          message: res.data.message
        });
      }).catch(function (err) {
        _this2.$message.error('系统异常!');
      });
    },
    handleDelete: function handleDelete(index, row) {
      var _this3 = this;

      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        _this3.submitDelete(row.id);
      }).catch(function () {
        _this3.$message.info('已取消删除');
      });
    },
    submitDelete: function submitDelete(id) {
      var _this4 = this;

      this.$http.get(api.SYS_MENU_DELETE + "?id=" + id).then(function (res) {
        var _type = 'error';
        if (res.data && res.data.code == '0') {
          _type = 'success';
          _this4.loadData();
        }
        _this4.$message({
          type: _type,
          message: res.data.message
        });
      }).catch(function (err) {
        _this4.$message.error('系统异常');
      });
    },
    loadData: function loadData() {
      var _this5 = this;

      this.fatherLoading = true;
      sysApi.menuList({}).then(function (res) {
        if (!res || res.code != '0') {
          var _message = res && res.message ? res.message : '系统异常';
          _this5.$message.error(_message);
        }
        var _data = res && res.result ? res.result : [];
        _this5.tableData = _data;
        _this5.fatherLoading = false;
      });
    }
  },
  created: function created() {
    this.loadData();
  }
};

/***/ }),

/***/ 391:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = __webpack_require__(73);

var _extends3 = _interopRequireDefault(_extends2);

var _promise = __webpack_require__(375);

var _promise2 = _interopRequireDefault(_promise);

var _stringify = __webpack_require__(240);

var _stringify2 = _interopRequireDefault(_stringify);

exports.fetch = fetch;

var _axios = __webpack_require__(977);

var _axios2 = _interopRequireDefault(_axios);

var _qs = __webpack_require__(996);

var _qs2 = _interopRequireDefault(_qs);

var _auth = __webpack_require__(137);

var _auth2 = _interopRequireDefault(_auth);

var _utils = __webpack_require__(399);

var _elementUi = __webpack_require__(244);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_axios2.default.defaults.timeout = 5000;

_axios2.default.defaults.baseURL = (0, _utils.getBaseUrl)(window.location.href);

_axios2.default.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';

_axios2.default.interceptors.request.use(function (config) {
  if (config.baseURL === config.url) {
    return false;
  }
  if (config.method === 'post') {
    config.data = (0, _stringify2.default)(config.data);
  } else if (config.method === 'get') {
    var _strData = _qs2.default.stringify(config.data);
    config.url = _strData ? config.url + '?' + _strData : config.url;
    config.headers['Content-Type'] = 'application/json; charset=utf-8';
  }
  return config;
}, function (error) {
  return _promise2.default.reject(error);
});

_axios2.default.interceptors.response.use(function (response) {
  if (response.data && response.data.code) {
    if (response.data.code === '2001') {
      _auth2.default.logout();
    }
  }
  return response;
}, function (error) {
  if (error.response) {}
});

function fetch(url) {
  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { method: 'get' };

  return _axios2.default.request((0, _extends3.default)({}, config, { url: url }));
}

exports.default = _axios2.default;

/***/ }),

/***/ 399:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.arrayToTree = exports.keyMirror = exports.getBaseUrl = exports.getSessionKey = undefined;

var _extends2 = __webpack_require__(73);

var _extends3 = _interopRequireDefault(_extends2);

var _typeof2 = __webpack_require__(138);

var _typeof3 = _interopRequireDefault(_typeof2);

exports.getCurrentMenu = getCurrentMenu;

var _pathToRegexp = __webpack_require__(1011);

var _pathToRegexp2 = _interopRequireDefault(_pathToRegexp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getSessionKey = exports.getSessionKey = function getSessionKey(key, defaultValue) {
  var item = window.sessionStorage.getItem(key);
  if (item == undefined && defaultValue != undefined) {
    return defaultValue;
  }
  return item;
};

var getBaseUrl = exports.getBaseUrl = function getBaseUrl(url) {
  var reg = /^((\w+):\/\/([^\/:]*)(?::(\d+))?)(.*)/;
  reg.exec(url);
  return RegExp.$1;
};

var keyMirror = exports.keyMirror = function keyMirror(obj) {
  var key = void 0;
  var mirrored = {};
  if (obj && (typeof obj === 'undefined' ? 'undefined' : (0, _typeof3.default)(obj)) === 'object') {
    for (key in obj) {
      if ({}.hasOwnProperty.call(obj, key)) {
        mirrored[key] = key;
      }
    }
  }
  return mirrored;
};

var arrayToTree = exports.arrayToTree = function arrayToTree(array) {
  var id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'id';
  var pid = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'pid';
  var children = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'children';

  var data = array.map(function (item) {
    return (0, _extends3.default)({}, item);
  });
  var result = [];
  var hash = {};
  data.forEach(function (item, index) {
    hash[data[index][id]] = data[index];
  });

  data.forEach(function (item) {
    var hashVP = hash[item[pid]];
    if (hashVP) {
      !hashVP[children] && (hashVP[children] = []);
      hashVP[children].push(item);
    } else {
      result.push(item);
    }
  });
  return result;
};

function getCurrentMenu(location, arrayMenu) {
  if (!!arrayMenu) {
    var current = [];
    for (var i = 0; i < arrayMenu.length; i++) {
      var e = arrayMenu[i];
      var child = getCurrentMenu(location, e.children);
      if (!!child && child.length > 0) {
        child.push((0, _extends3.default)({}, e, { children: null }));
        return child;
      }
      if (e.href && (0, _pathToRegexp2.default)(e.href).exec(location)) {
        current.push((0, _extends3.default)({}, e, { children: null }));
        return current;
      }
    }
    return current;
  }
  return null;
}

/***/ }),

/***/ 413:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = {
	login: {
		"user": {
			"id": "310000198406275362",
			"name": "叶洋",
			"nickName": "Taylor",
			"phone": "14309472560",
			"age": 74,
			"address": "浙江省 绍兴市 上虞市",
			"isMale": false,
			"email": "w.pdmenv@rwfwadthss.tr",
			"createTime": "1976-08-15 06:37:12",
			"delFlag": 0,
			"status": 1,
			"userType": "1",
			"no": "310000198406275362",
			"remarks": "传方半织意意列业维领细斯样年场不次。样影此么论重示般会际开出二及西高。",
			"avatar": "static/img/user.png"
		},
		"sid": "310000198406275362"
	},
	msgList: [{
		"id": "310000201511210936",
		"type": 1,
		"code": 102,
		"timeLine": "1975051514",
		"message": "元派目想铁难而应才院色种离。义两作期复铁节被制等头设。此能论装受我电局代算素业用我。",
		"title": "除口方增常处装公会深此面",
		"createTime": "1192729032451",
		"senderName": "Smith",
		"senderPic": "http://dummyimage.com/100x100/d9f279/757575.png&text=S"
	}, {
		"id": "460000201611256678",
		"type": 0,
		"code": 108,
		"timeLine": "1972022907",
		"message": "门可太长消题四义人素分天习。",
		"title": "车主精论状第算整京联科出报",
		"createTime": "1019549821001",
		"senderName": "Anderson",
		"senderPic": "http://dummyimage.com/100x100/e779f2/757575.png&text=A"
	}, {
		"id": "21000019780808275X",
		"type": 1,
		"code": 105,
		"timeLine": "1970031803",
		"message": "指给西着林为计着布同细认产。",
		"title": "正白要外高情总儿才必响",
		"createTime": "503250769103",
		"senderName": "Clark",
		"senderPic": "http://dummyimage.com/100x100/79f2c4/757575.png&text=C"
	}, {
		"id": "540000197505267710",
		"type": 1,
		"code": 106,
		"timeLine": "2010020800",
		"message": "变没装调标矿劳土类角九至由。特引南素都则次采特分义管装设青工率新。海者快决角定标门段越美流东厂体。",
		"title": "马争有战采圆还使层极口队理任目器万干",
		"createTime": "1282562311030",
		"senderName": "Anderson",
		"senderPic": "http://dummyimage.com/100x100/f2a179/757575.png&text=A"
	}, {
		"id": "120000201607082136",
		"type": 0,
		"code": 110,
		"timeLine": "1995042315",
		"message": "议价进则族外代水白深白离系。质体们劳确作水今领议圆个中处每容江。",
		"title": "看变易精最领得都",
		"createTime": "557022187618",
		"senderName": "Martinez",
		"senderPic": "http://dummyimage.com/100x100/7d79f2/757575.png&text=M"
	}, {
		"id": "310000199103172213",
		"type": 1,
		"code": 107,
		"timeLine": "1993081322",
		"message": "和油得离接装小都空看来响资。部算调法土图毛重知参时图改用化龙观地。",
		"title": "史运美很且应部想器发此精",
		"createTime": "331067892810",
		"senderName": "Hernandez",
		"senderPic": "http://dummyimage.com/100x100/97f279/757575.png&text=H"
	}, {
		"id": "310000201408208918",
		"type": 0,
		"code": 107,
		"timeLine": "1996071523",
		"message": "影将度更调图界实交接外他度龙习。米战走加系区日委也总图日。",
		"title": "高按我发史社就高水复周",
		"createTime": "1115948146226",
		"senderName": "Robinson",
		"senderPic": "http://dummyimage.com/100x100/f279bb/757575.png&text=R"
	}, {
		"id": "500000200504263440",
		"type": 0,
		"code": 101,
		"timeLine": "1972032318",
		"message": "都八在取音特业划克天造求照般。",
		"title": "整家水山又知整新便分现物精划放干",
		"createTime": "1241409165029",
		"senderName": "Clark",
		"senderPic": "http://dummyimage.com/100x100/79def2/757575.png&text=C"
	}, {
		"id": "320000198908103896",
		"type": 1,
		"code": 105,
		"timeLine": "2009010906",
		"message": "当式名厂采物且计料三公切点应更民体。内反温干华点方上等或划消但名反到准。",
		"title": "况别联东红后还由列级任法向",
		"createTime": "138005376045",
		"senderName": "Walker",
		"senderPic": "http://dummyimage.com/100x100/f2e279/757575.png&text=W"
	}, {
		"id": "330000199709134661",
		"type": 0,
		"code": 102,
		"timeLine": "2007031214",
		"message": "都种形一必采海想元的调次位府团系。社界个向但所历亲器它争计积相所为记。适心称备叫近理或种使水算党须今划文。",
		"title": "酸约况实改火间子直后约质影反",
		"createTime": "434811164417",
		"senderName": "Thompson",
		"senderPic": "http://dummyimage.com/100x100/bf79f2/757575.png&text=T"
	}],
	roleList: [{
		"id": 26,
		"delFlag": 0,
		"parentId": null,
		"sort": 0,
		"name": "超级管理员",
		"enName": "super_manager",
		"usable": "1",
		"remarks": "",
		"children": []
	}, {
		"id": 27,
		"delFlag": 0,
		"parentId": null,
		"sort": 1,
		"name": "客服主管",
		"enName": "server_manager",
		"usable": "1",
		"remarks": "",
		"children": [{
			"id": 28,
			"delFlag": 0,
			"parentId": 27,
			"sort": 0,
			"name": "售后客服",
			"enName": "server1",
			"usable": "1",
			"remarks": "",
			"children": []
		}, {
			"id": 29,
			"delFlag": 0,
			"parentId": 27,
			"sort": 1,
			"name": "售前客服",
			"enName": "server2",
			"usable": "1",
			"remarks": "",
			"children": []
		}]
	}],
	userList: {
		records: [{
			"id": "340000198910193425",
			"name": "曹明",
			"nickName": "Hall",
			"phone": "15692311412",
			"age": 88,
			"address": "湖南省 娄底市 双峰县",
			"isMale": false,
			"email": "c.czieispd@cwp.gov.cn",
			"createTime": "1978-05-22 08:53:07",
			"delFlag": 0,
			"status": 1,
			"userType": "1",
			"no": "340000198910193425",
			"remarks": "近火就把政通增电加能开比没现过对办部。对率大元这证起速构感型众决王每状使。取力近标子组毛济料构论美业。",
			"avatar": "http://dummyimage.com/100x100/79f28a/757575.png&text=H"
		}, {
			"id": "350000201505204609",
			"name": "田磊",
			"nickName": "Young",
			"phone": "15712309986",
			"age": 71,
			"address": "湖北省 随州市 随县",
			"isMale": true,
			"email": "h.xmhalr@tswxut.ba",
			"createTime": "2008-05-09 22:47:14",
			"delFlag": 0,
			"status": 1,
			"userType": "1",
			"no": "350000201505204609",
			"remarks": "作又整只与关法期快口广信认东我比家。克用和科土江族住几起提因体将。",
			"avatar": "http://dummyimage.com/100x100/79d1f2/757575.png&text=Y"
		}, {
			"id": "630000198302122489",
			"name": "顾霞",
			"nickName": "Clark",
			"phone": "14468417672",
			"age": 52,
			"address": "贵州省 黔东南苗族侗族自治州 岑巩县",
			"isMale": true,
			"email": "h.bwzpy@lwlv.lt",
			"createTime": "1978-09-18 16:05:12",
			"delFlag": 0,
			"status": 1,
			"userType": "1",
			"no": "630000198302122489",
			"remarks": "共图务低义间需图加思较极用。理干该认值段或那门动位风义机产。带象商领党系千单证用水可保水今近细。",
			"avatar": "http://dummyimage.com/100x100/8e79f2/757575.png&text=C"
		}, {
			"id": "120000198201065745",
			"name": "汤杰",
			"nickName": "Brown",
			"phone": "14817334423",
			"age": 38,
			"address": "天津 天津市 武清区",
			"isMale": true,
			"email": "y.kxies@rrkf.do",
			"createTime": "1970-09-25 13:39:05",
			"delFlag": 0,
			"status": 1,
			"userType": "1",
			"no": "120000198201065745",
			"remarks": "维重常军规种可真入千组部方程红平水。按四很青水合道数以及铁集路上商。",
			"avatar": "http://dummyimage.com/100x100/7986f2/757575.png&text=B"
		}, {
			"id": "440000200412284520",
			"name": "江涛",
			"nickName": "Lee",
			"phone": "14481283062",
			"age": 13,
			"address": "陕西省 渭南市 白水县",
			"isMale": true,
			"email": "c.ukigvuno@kwfk.bt",
			"createTime": "2008-08-13 02:57:58",
			"delFlag": 0,
			"status": 1,
			"userType": "1",
			"no": "440000200412284520",
			"remarks": "济么形细难今上观难上设水民史。进又十西报成养时求并发者向。近火料新产回造统加正则教管到所别。",
			"avatar": "http://dummyimage.com/100x100/79e6f2/757575.png&text=L"
		}, {
			"id": "440000201502214088",
			"name": "曾桂英",
			"nickName": "Allen",
			"phone": "15501677076",
			"age": 68,
			"address": "黑龙江省 齐齐哈尔市 梅里斯达斡尔族区",
			"isMale": true,
			"email": "g.qaioxl@ffhpyfvnn.bn",
			"createTime": "2000-05-24 08:08:42",
			"delFlag": 0,
			"status": 1,
			"userType": "1",
			"no": "440000201502214088",
			"remarks": "口什采它六委市切门型部感前强子。真部最率体一程基入族外品。",
			"avatar": "http://dummyimage.com/100x100/f2e979/757575.png&text=A"
		}, {
			"id": "440000198106296849",
			"name": "高霞",
			"nickName": "Wilson",
			"phone": "14488966580",
			"age": 82,
			"address": "新疆维吾尔自治区 昌吉回族自治州 奇台县",
			"isMale": false,
			"email": "o.spamgt@nnbdwoaw.ad",
			"createTime": "1977-01-26 04:18:22",
			"delFlag": 0,
			"status": 1,
			"userType": "1",
			"no": "440000198106296849",
			"remarks": "以美理更管它存量种通不派车名然江。它已文道道百其百军达和知色。",
			"avatar": "http://dummyimage.com/100x100/79e0f2/757575.png&text=W"
		}, {
			"id": "640000200202182849",
			"name": "顾平",
			"nickName": "Rodriguez",
			"phone": "14766033445",
			"age": 96,
			"address": "香港特别行政区 新界 离岛区",
			"isMale": false,
			"email": "r.octrublxo@njk.kz",
			"createTime": "1985-10-17 04:53:21",
			"delFlag": 0,
			"status": 1,
			"userType": "1",
			"no": "640000200202182849",
			"remarks": "品持些示调般其需走你气切到热采工土。回响四立干百史号同特实子确又消已。",
			"avatar": "http://dummyimage.com/100x100/8af279/757575.png&text=R"
		}, {
			"id": "230000200802175187",
			"name": "陈洋",
			"nickName": "Garcia",
			"phone": "15288638355",
			"age": 90,
			"address": "江西省 九江市 彭泽县",
			"isMale": true,
			"email": "j.fumo@fcrx.dk",
			"createTime": "2013-05-07 00:53:32",
			"delFlag": 0,
			"status": 1,
			"userType": "1",
			"no": "230000200802175187",
			"remarks": "总其许他年矿率本根参变世。低南育体眼派万精长并车响料战。",
			"avatar": "http://dummyimage.com/100x100/79f2cb/757575.png&text=G"
		}, {
			"id": "610000200403119453",
			"name": "范敏",
			"nickName": "Brown",
			"phone": "15178636234",
			"age": 80,
			"address": "海南省 三亚市 -",
			"isMale": true,
			"email": "k.jbvimbagi@diwsihdqxx.dz",
			"createTime": "1993-04-10 17:15:50",
			"delFlag": 0,
			"status": 1,
			"userType": "1",
			"no": "610000200403119453",
			"remarks": "米界价区质需类边被自则按。江期合行色离接身准连工个称大说应目。称较号重生者素求几那开标算包属。",
			"avatar": "http://dummyimage.com/100x100/79f2c2/757575.png&text=B"
		}],
		total: 99
	},
	menuList: [{
		"id": 6,
		"parentId": null,
		"sort": 6,
		"name": "系统管理",
		"href": "/sys",
		"icon": "fa fa-cog",
		"children": [{
			"id": 9,
			"parentId": 6,
			"sort": 3,
			"name": "用户管理",
			"href": "/sys/userList",

			"children": [],
			"isShow": "1"
		}, {
			"id": 7,
			"parentId": 6,
			"sort": 1,
			"name": "用户角色",
			"href": "/sys/roleList",

			"children": [],
			"isShow": "1"
		}, {
			"id": 8,
			"parentId": 6,
			"sort": 2,
			"name": "资源菜单",
			"href": "/sys/menuList",

			"children": [],
			"isShow": "1"
		}, {
			"id": 10,
			"parentId": 7,
			"sort": 3,
			"name": "数据权限组",
			"href": "/sys/userGroup",

			"children": [],
			"isShow": "1"
		}, {
			"id": 10,
			"parentId": 7,
			"sort": 3,
			"name": "数据权限",
			"href": "/sys/dataRole",

			"children": [],
			"isShow": "1"
		}],
		"isShow": "1"
	}],
	resource: [{
		"id": 52,
		"parentId": null,
		"sort": 0,
		"name": "登录",
		"code": "/login",
		"type": 3,
		"usable": "1",
		"remarks": "",
		"children": []
	}, {
		"id": 68,
		"parentId": null,
		"sort": 0,
		"name": "仪表盘",
		"code": "/index",
		"type": 1,
		"usable": "1",
		"remarks": "",
		"children": []
	}, {
		"id": 69,
		"parentId": null,
		"sort": 0,
		"name": "系统管理",
		"code": "/sys",
		"type": 1,
		"usable": "1",
		"remarks": "",
		"children": [{
			"id": 82,
			"parentId": 69,
			"sort": 0,
			"name": "资源管理",
			"code": "/sys/resource",
			"type": 1,
			"usable": "1",
			"remarks": "",
			"children": [{
				"id": 99,
				"parentId": 82,
				"sort": 0,
				"name": "/sys/resource/get",
				"code": "/sys/resource/get",
				"type": 3,
				"usable": "1",
				"remarks": "",
				"children": []
			}, {
				"id": 100,
				"parentId": 82,
				"sort": 0,
				"name": "/sys/resource/update",
				"code": "/sys/resource/update",
				"type": 3,
				"usable": "1",
				"remarks": "",
				"children": []
			}, {
				"id": 101,
				"parentId": 82,
				"sort": 0,
				"name": "/sys/resource/delete",
				"code": "/sys/resource/delete",
				"type": 3,
				"usable": "1",
				"remarks": "",
				"children": []
			}, {
				"id": 102,
				"parentId": 82,
				"sort": 0,
				"name": "/sys/resource/add",
				"code": "/sys/resource/add",
				"type": 3,
				"usable": "1",
				"remarks": "",
				"children": []
			}, {
				"id": 103,
				"parentId": 82,
				"sort": 0,
				"name": "/sys/resource/page",
				"code": "/sys/resource/page",
				"type": 3,
				"usable": "1",
				"remarks": "",
				"children": []
			}, {
				"id": 104,
				"parentId": 82,
				"sort": 0,
				"name": "/sys/resource/list",
				"code": "/sys/resource/list",
				"type": 3,
				"usable": "1",
				"remarks": "",
				"children": []
			}, {
				"id": 105,
				"parentId": 82,
				"sort": 0,
				"name": "/sys/resource/list2",
				"code": "/sys/resource/list2",
				"type": 3,
				"usable": "1",
				"remarks": "",
				"children": []
			}]
		}, {
			"id": 70,
			"parentId": 69,
			"sort": 1,
			"name": "角色管理",
			"code": "/sys/menuList",
			"type": 1,
			"usable": "1",
			"remarks": "",
			"children": [{
				"id": 83,
				"parentId": 70,
				"sort": 0,
				"name": "/sys/menu/get",
				"code": "/sys/menu/get",
				"type": 3,
				"usable": "1",
				"remarks": "",
				"children": []
			}, {
				"id": 84,
				"parentId": 70,
				"sort": 0,
				"name": "/sys/menu/update",
				"code": "/sys/menu/update",
				"type": 3,
				"usable": "1",
				"remarks": "",
				"children": []
			}, {
				"id": 85,
				"parentId": 70,
				"sort": 0,
				"name": "/sys/menu/delete",
				"code": "/sys/menu/delete",
				"type": 3,
				"usable": "1",
				"remarks": "",
				"children": []
			}, {
				"id": 86,
				"parentId": 70,
				"sort": 0,
				"name": "/sys/menu/add",
				"code": "/sys/menu/add",
				"type": 3,
				"usable": "1",
				"remarks": "",
				"children": []
			}, {
				"id": 87,
				"parentId": 70,
				"sort": 0,
				"name": "/sys/menu/page",
				"code": "/sys/menu/page",
				"type": 3,
				"usable": "1",
				"remarks": "",
				"children": []
			}, {
				"id": 88,
				"parentId": 70,
				"sort": 0,
				"name": "/sys/menu/list",
				"code": "/sys/menu/list",
				"type": 3,
				"usable": "1",
				"remarks": "",
				"children": []
			}, {
				"id": 89,
				"parentId": 70,
				"sort": 0,
				"name": "/sys/menu/list2",
				"code": "/sys/menu/list2",
				"type": 3,
				"usable": "1",
				"remarks": "",
				"children": []
			}]
		}, {
			"id": 71,
			"parentId": 69,
			"sort": 3,
			"name": "权限管理",
			"code": "/sys/roleList",
			"type": 1,
			"usable": "1",
			"remarks": "",
			"children": [{
				"id": 90,
				"parentId": 71,
				"sort": 0,
				"name": "/sys/role/get",
				"code": "/sys/role/get",
				"type": 3,
				"usable": "1",
				"remarks": "",
				"children": []
			}, {
				"id": 91,
				"parentId": 71,
				"sort": 0,
				"name": "/sys/role/update",
				"code": "/sys/role/update",
				"type": 3,
				"usable": "1",
				"remarks": "",
				"children": []
			}, {
				"id": 92,
				"parentId": 71,
				"sort": 0,
				"name": "/sys/role/delete",
				"code": "/sys/role/delete",
				"type": 3,
				"usable": "1",
				"remarks": "",
				"children": []
			}, {
				"id": 93,
				"parentId": 71,
				"sort": 0,
				"name": "/sys/role/add",
				"code": "/sys/role/add",
				"type": 3,
				"usable": "1",
				"remarks": "",
				"children": []
			}, {
				"id": 94,
				"parentId": 71,
				"sort": 0,
				"name": "/sys/role/page",
				"code": "/sys/role/page",
				"type": 3,
				"usable": "1",
				"remarks": "",
				"children": []
			}, {
				"id": 95,
				"parentId": 71,
				"sort": 0,
				"name": "/sys/role/list",
				"code": "/sys/role/list",
				"type": 3,
				"usable": "1",
				"remarks": "",
				"children": []
			}, {
				"id": 96,
				"parentId": 71,
				"sort": 0,
				"name": "/sys/role/list2",
				"code": "/sys/role/list2",
				"type": 3,
				"usable": "1",
				"remarks": "",
				"children": []
			}, {
				"id": 97,
				"parentId": 71,
				"sort": 0,
				"name": "/sys/role/resources",
				"code": "/sys/role/resources",
				"type": 3,
				"usable": "1",
				"remarks": "",
				"children": []
			}, {
				"id": 98,
				"parentId": 71,
				"sort": 0,
				"name": "/sys/role/setResources",
				"code": "/sys/role/setResources",
				"type": 3,
				"usable": "1",
				"remarks": "",
				"children": []
			}]
		}, {
			"id": 72,
			"parentId": 69,
			"sort": 6,
			"name": "用户管理",
			"code": "/sys/userList",
			"type": 1,
			"usable": "1",
			"remarks": "",
			"children": [{
				"id": 106,
				"parentId": 72,
				"sort": 0,
				"name": "/sys/user/get",
				"code": "/sys/user/get",
				"type": 3,
				"usable": "1",
				"remarks": "",
				"children": []
			}, {
				"id": 107,
				"parentId": 72,
				"sort": 0,
				"name": "/sys/user/add",
				"code": "/sys/user/add",
				"type": 3,
				"usable": "1",
				"remarks": "",
				"children": []
			}, {
				"id": 108,
				"parentId": 72,
				"sort": 0,
				"name": "/sys/user/update",
				"code": "/sys/user/update",
				"type": 3,
				"usable": "1",
				"remarks": "",
				"children": []
			}, {
				"id": 109,
				"parentId": 72,
				"sort": 0,
				"name": "/sys/user/delete",
				"code": "/sys/user/delete",
				"type": 3,
				"usable": "1",
				"remarks": "",
				"children": []
			}, {
				"id": 110,
				"parentId": 72,
				"sort": 0,
				"name": "/sys/user/page",
				"code": "/sys/user/page",
				"type": 3,
				"usable": "1",
				"remarks": "",
				"children": []
			}, {
				"id": 111,
				"parentId": 72,
				"sort": 0,
				"name": "/sys/user/roleIds",
				"code": "/sys/user/roleIds",
				"type": 3,
				"usable": "1",
				"remarks": "",
				"children": []
			}, {
				"id": 112,
				"parentId": 72,
				"sort": 0,
				"name": "/sys/user/setRoles",
				"code": "/sys/user/setRoles",
				"type": 3,
				"usable": "1",
				"remarks": "",
				"children": []
			}]
		}]
	}]
};

/***/ }),

/***/ 414:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _api = __webpack_require__(44);

var api = _interopRequireWildcard(_api);

var _data2 = __webpack_require__(112);

var _data3 = _interopRequireDefault(_data2);

var _sys = __webpack_require__(58);

var sysApi = _interopRequireWildcard(_sys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.default = {
  data: function data() {
    return {
      menuData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },

      currentRow: {},
      dialogVisible: false,
      childLoading: false,
      fatherLoading: false,
      dialogLoading: false,
      roleTree: [],
      userChangeType: '',

      formLabelWidth: '120px',
      formTitle: '新增用户角色',
      dialogFormVisible: false,
      createForm: {
        id: '',
        name: '',
        remarks: '',
        menuIdList: '',
        enname: ''
      },
      expands: [],
      searchKey: '',
      tableData: [],
      pageNum: 1,
      searchForm: {
        name: '',
        enname: '',
        loginName: ''
      },
      total: 0,
      pageSize: 10
    };
  },

  methods: {
    search: function search(target) {
      this.loadData();
    },
    onSubmit: function onSubmit() {
      this.loadData();
    },
    getRoleInfo: function getRoleInfo(id) {
      var _this = this;

      if (id) {
        this.$http.get(api.SYS_MENU_GET + "?roleId=" + id).then(function (res) {
          if (!res || !res.data || res.data.code != '0') {
            _this.$message.error(res.data.message);
            return;
          }
          _this.createForm.menuIdList = res.data.result.menuIdList || [];
          _this.$refs.menuTree.setCheckedKeys(_this.createForm.menuIdList);
        }).catch(function (err) {
          _this.$message.error('系统异常!');
        });
      }
    },
    checkChange: function checkChange(value, data) {
      this.createForm.menuIdList = data.checkedKeys;
    },
    addBtnClick: function addBtnClick(index) {
      var row = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      this.createForm.menuIdList = [];
      for (var name in this.createForm) {
        if (name == 'menuIdList') {
          this.createForm[name] = row[name] || [];
        } else {
          this.createForm[name] = row[name] || '';
        }
      }
      if (this.$refs && this.$refs.createForm) {
        this.$refs.createForm.clearValidate();
        this.$refs.menuTree.setCheckedKeys([]);
      }
      this.userChangeType = false;
      this.dialogFormVisible = true;
      this.formTitle = '新增用户角色';
      if (row.name) {
        this.userChangeType = true;
        this.formTitle = '修改用户角色（' + row.name + '）';
        this.getRoleInfo(row.id);
      }
    },
    addUserGroup: function addUserGroup(formName) {
      var that = this;
      that.$refs[formName].validate(function (valid) {
        if (valid) {
          that.submitAddUserGroup();
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    submitAddUserGroup: function submitAddUserGroup() {
      var _this2 = this;

      this.dialogFormVisible = false;
      var _type = this.userChangeType ? '修改' : '新增';
      this.$http.post(api.SYS_ROLE_ADD, this.createForm).then(function (res) {
        var _type = 'error';
        if (res.data && res.data.code == '0') {
          _type = 'success';
          _this2.loadData();
        }
        _this2.$message({
          type: _type,
          message: res.data.message
        });
      }).catch(function (err) {
        _this2.$message.error('系统异常');
      });
    },
    userRoleDelete: function userRoleDelete(index, row) {
      var _this3 = this;

      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        _this3.submitDelete(row.id);
      }).catch(function () {
        _this3.$message.info('已取消删除');
      });
    },
    submitDelete: function submitDelete(id) {
      var _this4 = this;

      this.$http.get(api.SYS_ROLE_DELETE + "?roleId=" + id).then(function (res) {
        var _type = 'error';
        if (res.data && res.data.code == '0') {
          _type = 'success';
          _this4.loadData();
        }
        _this4.$message({
          type: _type,
          message: res.data.message
        });
      }).catch(function (err) {
        _this4.$message.error('系统异常!');
      });
    },
    handleRoleConfig: function handleRoleConfig(index, row) {
      var _this5 = this;

      this.currentRow = row;
      this.dialogVisible = true;
      if (this.roleTree.length <= 0) {
        sysApi.roleList().then(function (res) {
          _this5.roleTree = res;
        });
      }
      this.$http.get(api.SYS_USER_ROLE + "?id=" + row.id).then(function (res) {
        _this5.$refs.roleTree.setCheckedKeys(res.data);
      }).catch(function (err) {});
    },
    configUserRoles: function configUserRoles() {
      var _this6 = this;

      var checkedKeys = this.$refs.roleTree.getCheckedKeys();
      this.$http.get(api.SYS_SET_USER_ROLE + "?userId=" + this.currentRow.id + "&roleIds=" + checkedKeys.join(',')).then(function (res) {
        _this6.$message('修改成功');
        _this6.dialogVisible = false;
      });
    },
    handleSizeChange: function handleSizeChange(val) {
      this.pageSize = val;
      this.loadData();
    },
    handleCurrentChange: function handleCurrentChange(val) {
      this.pageNum = val;
      this.loadData();
    },
    loadMenu: function loadMenu() {
      var _this7 = this;

      sysApi.menuList({}).then(function (res) {
        if (!res || res.code != '0') {
          var _message = res && res.message ? res.message : '系统异常';
          _this7.$message.error(_message);
        }
        var _data = res && res.result ? res.result : [];
        _this7.menuData = _data;
      });
    },
    loadData: function loadData() {
      var _this8 = this;

      this.fatherLoading = true;
      sysApi.roleList({
        name: this.searchForm.name,
        enname: this.searchForm.enname,
        loginName: this.searchForm.loginName,
        pageSize: this.pageSize,
        pageNum: this.pageNum
      }).then(function (res) {
        _this8.fatherLoading = false;
        if (!res || res.code != '0') {
          var _message = res && res.message ? res.message : '系统异常';
          _this8.$message.error(_message);
          return;
        }
        _this8.tableData = res.result.list || [];
        _this8.total = res.result.total || 0;
      });
    }
  },
  created: function created() {
    this.loadData();
    this.loadMenu();
  }
};

/***/ }),

/***/ 415:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _api = __webpack_require__(44);

var api = _interopRequireWildcard(_api);

var _data = __webpack_require__(112);

var _data2 = _interopRequireDefault(_data);

var _sys = __webpack_require__(58);

var sysApi = _interopRequireWildcard(_sys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.default = {
  data: function data() {
    return {
      currentRow: {},
      dialogVisible: false,
      childLoading: false,
      fatherLoading: false,
      dialogLoading: false,
      roleTree: [],
      userChangeType: '',

      formLabelWidth: '80px',
      formTitle: '新增数据权限',
      dialogFormVisible: false,
      createForm: {
        appId: '',
        name: '',
        id: '',
        remarks: '',
        tag: '',
        type: ''
      },
      expands: [],
      searchKey: '',
      tableData: {
        pagination: {
          total: 0,
          pageNumber: 1,
          pageSize: 10,
          hasChildren: true,
          parentId: 0
        },
        rows: [],
        childrens: []
      }
    };
  },

  methods: {
    search: function search(target) {
      this.loadData();
    },
    addBtnClick: function addBtnClick(index) {
      var row = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      for (var name in this.createForm) {
        this.createForm[name] = row[name] || '';
      }
      if (this.$refs && this.$refs.createForm) {
        this.$refs.createForm.clearValidate();
      }
      this.userChangeType = false;
      this.dialogFormVisible = true;
      this.formTitle = '新增数据权限';
      if (row.id) {
        this.userChangeType = true;
        this.formTitle = '修改数据权限（' + (row.name || '') + '）';
      }
    },
    addDataRole: function addDataRole(formName) {
      var _this = this;

      this.$refs[formName].validate(function (valid) {
        if (valid) {
          _this.dialogFormVisible = false;
          _this.submitAdd();
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    submitAdd: function submitAdd() {
      var _this2 = this;

      var _dataRoleUrl = this.userChangeType ? api.SYS_PERMISSION_UPDATE : api.SYS_PERMISSION_ADD;
      this.$http.post(_dataRoleUrl, this.createForm).then(function (res) {
        var _type = 'error';
        if (res.data && res.data.code == '0') {
          _type = 'success';
          _this2.loadData();
        }
        _this2.$message({
          type: _type,
          message: res.data.message
        });
      }).catch(function (err) {
        _this2.$message.error('系统异常!');
      });
    },
    permissionDelete: function permissionDelete(index, row) {
      var _this3 = this;

      this.$confirm('此操作将永久删除该数据权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        _this3.submitDelete(row.id);
      }).catch(function () {
        _this3.$message.info('已取消删除');
      });
    },
    submitDelete: function submitDelete(id) {
      var _this4 = this;

      this.$http.post(api.SYS_PERMISSION_DELETE + "?id=" + id).then(function (res) {
        var _type = 'error';
        if (res.data && res.data.code == '0') {
          _type = 'success';
          _this4.loadData();
        }
        _this4.$message({
          type: _type,
          message: res.data.message
        });
      }).catch(function (err) {
        _this4.$message.error('系统异常!');
      });
    },
    handleRoleConfig: function handleRoleConfig(index, row) {
      var _this5 = this;

      this.currentRow = row;
      this.dialogVisible = true;
      if (this.roleTree.length <= 0) {
        sysApi.roleList({ selectChildren: true }).then(function (res) {
          _this5.roleTree = res;
        });
      }
      this.$http.get(api.SYS_USER_ROLE + "?id=" + row.id).then(function (res) {
        _this5.$refs.roleTree.setCheckedKeys(res.data);
      }).catch(function (err) {});
    },
    configUserRoles: function configUserRoles() {
      var _this6 = this;

      var checkedKeys = this.$refs.roleTree.getCheckedKeys();
      this.$http.get(api.SYS_SET_USER_ROLE + "?userId=" + this.currentRow.id + "&roleIds=" + checkedKeys.join(',')).then(function (res) {
        _this6.$message('修改成功');
        _this6.dialogVisible = false;
      });
    },
    handleSizeChange: function handleSizeChange(val) {
      this.tableData.pagination.pageSize = val;
      this.loadData();
    },
    handleCurrentChange: function handleCurrentChange(val) {
      this.tableData.pagination.pageNumber = val;
      this.loadData();
    },
    loadData: function loadData() {
      var _this7 = this;

      this.fatherLoading = true;
      sysApi.permissionList({
        pageSize: this.tableData.pagination.pageSize,
        pageNumber: this.tableData.pagination.pageNumber
      }).then(function (res) {
        _this7.tableData.rows = res.result.list || [];
        _this7.tableData.pagination.total = res.result.total || 0;
        _this7.fatherLoading = false;
      });
    }
  },
  created: function created() {
    this.loadData();
  }
};

/***/ }),

/***/ 416:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = __webpack_require__(240);

var _stringify2 = _interopRequireDefault(_stringify);

var _api = __webpack_require__(44);

var api = _interopRequireWildcard(_api);

var _data = __webpack_require__(112);

var _data2 = _interopRequireDefault(_data);

var _sys = __webpack_require__(58);

var sysApi = _interopRequireWildcard(_sys);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  data: function data() {
    return {
      userTitle: ['用户列表', '组内用户'],
      userLoading: true,
      roleTitle: ['权限列表', '组内权限'],
      roleLoading: true,

      currentAppId: 'KDS',
      currentRow: {},
      menuTree: [],
      treeLoading: false,
      tableTitle: '关联列表',
      defaultProps: {
        children: 'childGroup',
        label: 'name',
        id: "id"
      },
      userChangeType: '',

      formLabelWidth: '80px',
      formTitle: '新增权限组',
      dialogFormVisible: false,
      createForm: {
        name: '',
        ename: '',
        remarks: '',
        parentId: '',
        id: ''
      },
      searchKey: '',
      roleData: {
        rows: [],
        rightRow: []
      },
      userData: {
        rows: [],
        rightRow: []
      }
    };
  },

  methods: {
    search: function search(target) {
      this.loadData();
    },
    appTabClick: function appTabClick(data) {
      this.currentAppId = data.name;
      this.$message.success('切换成功：' + data.name);
      this.roleLoading = true;
      this.userLoading = true;
      this.loadData();
      this.loadUserData();
      this.loadRoleData();
    },
    appendGroup: function appendGroup() {
      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var type = arguments[1];

      for (var name in this.createForm) {
        this.createForm[name] = data[name] && !type ? data[name] : '';
      }
      this.createForm['parentId'] = data['id'] || '';
      if (this.$refs && this.$refs.createForm) {
        this.$refs.createForm.clearValidate();
      }
      this.userChangeType = false;
      this.dialogFormVisible = true;

      var _headTitle = data.name || data.id || '第一级';
      this.formTitle = '新增数据权限组（' + _headTitle + '）';
      if (data.id && !type) {
        this.createForm['parentId'] = data['parentId'] || '';
        this.userChangeType = true;
        this.formTitle = '修改数据权限组（' + _headTitle + '）';
      }
    },
    addUserGroup: function addUserGroup(formName) {
      var _this = this;

      this.$refs[formName].validate(function (valid) {
        if (valid) {
          _this.dialogFormVisible = false;
          _this.submitAdd();
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    submitAdd: function submitAdd() {
      var _this2 = this;

      var _dataRoleUrl = this.userChangeType ? api.SYS_GROUP_UPDATE : api.SYS_GROUP_ADD;
      this.$http.post(_dataRoleUrl, this.createForm).then(function (res) {
        var _type = 'error';
        if (res.data && res.data.code == '0') {
          _type = 'success';
          if (_this2.userChangeType && _this2.currentRow) {
            _this2.currentRow.name = _this2.createForm.name;
          }
        }
        _this2.$message({
          type: _type,
          message: res.data.message
        });
      }).catch(function (err) {
        _this2.$message.error('系统异常!');
      });
    },
    GroupDelete: function GroupDelete(index, row) {
      var _this3 = this;

      this.$confirm('此操作将永久删除该组, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        _this3.submitDelete(row);
      }).catch(function () {
        _this3.$message.info('已取消删除');
      });
    },
    submitDelete: function submitDelete(row) {
      var _this4 = this;

      this.$http.post(api.SYS_GROUP_DELETE + "?id=" + row.id, {}).then(function (res) {
        var _type = 'error';
        if (res.data && res.data.code == '0') {
          _type = 'success';
          _this4.$refs && _this4.$refs.groupTree.remove(row.id);
        }
        _this4.$message({
          type: _type,
          message: res.data.message
        });
      }).catch(function (err) {
        _this4.$message.error('系统异常!');
      });
    },
    groupHandleChange: function groupHandleChange(param) {
      var _this5 = this;

      this.$http.post(param.url, {}).then(function (res) {
        var _type = 'success';
        if (!res.data || res.data.code != '0') {
          _type = 'error';
          _this5[param.loading] = true;
        }
        _this5.$message({
          type: _type,
          message: res.data.message
        });
      }).catch(function (err) {
        _this5.$message.error('系统异常!');
      });
    },
    loadData: function loadData() {
      var _this6 = this;

      this.treeLoading = true;
      sysApi.groupList({}).then(function (res) {
        _this6.treeLoading = false;
        if (res.code == '0') {
          _this6.menuTree = res.result || [];
        } else {
          _this6.$message.error(res.message);
        }
      });
    },
    userHandleChange: function userHandleChange(value, direction, movedKeys) {
      if (!this.currentRow || !this.currentRow.id) {
        this.$message.error('获取组ID失败，当前操作均无效');
        return;
      }
      var groupId = this.currentRow.id,
          ids = (0, _stringify2.default)(movedKeys),
          _url = api.SYS_GROUP_USER_DELETES + '?groupId=' + groupId + '&userIds=' + ids,
          param = {
        'url': _url,
        'loading': 'userLoading'
      };
      if (direction == 'right') {
        param.url = api.SYS_USER_TO_GROUP + "?groupId=" + groupId + '&userIds=' + ids;
      }
      this.groupHandleChange(param);
    },
    loadUserData: function loadUserData() {
      var _this7 = this;

      sysApi.userList({
        pageSize: 99999,
        pageNum: 1
      }).then(function (res) {
        if (!res || res.code != '0') {
          _this7.$message.error(res.message);
          return;
        }
        _this7.userData.rows = res.result.list || [];
      });
    },
    getCatchUser: function getCatchUser() {
      var _this8 = this;

      var _groupId = this.currentRow.id,
          _url = api.SYS_FIND_GROUP_USER + "?groupId=" + _groupId;
      this.$http.get(_url, {}).then(function (res) {
        _this8.userData.rightRow = [];
        _this8.userLoading = false;
        if (!res || !res.data || res.data.code != '0') {
          var _message = res && res.data ? res.data.message : '查询组下用户失败';
          _this8.$message.error(_message);
        }
        for (var i = 0; i < res.data.result.length; i++) {
          _this8.userData.rightRow.push(res.data.result[i].id || '');
        }
      }).catch(function (err) {
        _this8.$message.error('系统异常!');
      });
    },
    roleHandleChange: function roleHandleChange(value, direction, movedKeys) {
      if (!this.currentRow || !this.currentRow.id) {
        this.$message.error('获取组ID失败，当前操作均无效');
        return;
      }
      var groupId = this.currentRow.id,
          ids = (0, _stringify2.default)(movedKeys),
          _url = api.SYS_GROUP_ROLE_DELETES + '?groupId=' + groupId + '&permissionIds=' + ids,
          param = {
        'url': _url,
        'loading': 'roleLoading'
      };
      if (direction == 'right') {
        param.url = api.SYS_ROLE_TO_GROUP + "?groupId=" + groupId + '&permissionIds=' + ids;
      }
      this.groupHandleChange(param);
    },
    loadRoleData: function loadRoleData() {
      var _this9 = this;

      sysApi.permissionList({
        pageSize: 99999,
        pageNumber: 1
      }).then(function (res) {
        if (!res || res.code != '0') {
          _this9.$message.error(res.message);
          return;
        }
        _this9.roleData.rows = res.result.list || [];
      });
    },
    getCatchRole: function getCatchRole() {
      var _this10 = this;

      var _groupId = this.currentRow.id,
          _url = api.SYS_FIND_GROUP_ROLE + "?groupId=" + _groupId;
      this.$http.get(_url, {}).then(function (res) {
        _this10.roleData.rightRow = [];
        _this10.roleLoading = false;
        if (!res || !res.data || res.data.code != '0') {
          var _message = res && res.data ? res.data.message : '查询组下用户失败';
          _this10.$message.error(_message);
          return;
        }
        for (var i = 0; i < res.data.result.length; i++) {
          _this10.roleData.rightRow.push(res.data.result[i].id || '');
        }
      }).catch(function (err) {
        _this10.$message.error('系统异常!');
      });
    },
    nodeClick: function nodeClick(data) {
      this.currentRow = data;
      this.multipleSelectionAll = {
        user: [],
        role: []
      };
      this.tableTitle = '组：' + (data.name || '');
      if (!this.currentRow || !this.currentRow.id) {
        this.$message.error('当前组ID查询失败');
        return;
      }
      this.getCatchUser();
      this.getCatchRole();
    },
    allowDrag: function allowDrag(draggingNode) {
      return draggingNode.childNodes.length === 0;
    }
  },
  created: function created() {
    this.loadData();
    this.loadUserData();
    this.loadRoleData();
  }
};

/***/ }),

/***/ 417:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = __webpack_require__(1070);

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _panel = __webpack_require__(177);

var _panel2 = _interopRequireDefault(_panel);

var _selectTree = __webpack_require__(1077);

var _selectTree2 = _interopRequireDefault(_selectTree);

var _treeter = __webpack_require__(422);

var _treeter2 = _interopRequireDefault(_treeter);

var _merge = __webpack_require__(256);

var _merge2 = _interopRequireDefault(_merge);

var _sys = __webpack_require__(58);

var sysApi = _interopRequireWildcard(_sys);

var _api = __webpack_require__(44);

var api = _interopRequireWildcard(_api);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  mixins: [_treeter2.default],
  components: {
    'imp-panel': _panel2.default,
    'el-select-tree': _selectTree2.default
  },
  data: function data() {
    return {
      formLabelWidth: '100px',
      defaultProps: {
        children: 'children',
        label: 'name',
        id: "id"
      },
      resourceTree: [],
      maxId: 700000,
      form: {
        id: null,
        parentId: null,
        name: '',
        code: '',
        type: 1,
        sort: 0,
        usable: '1',
        remarks: ''
      }
    };
  },

  methods: {
    newAdd: function newAdd() {
      this.form = {
        id: null,
        parentId: null,
        name: '',
        code: '',
        type: 1,
        sort: 0,
        usable: '1',
        remarks: ''
      };
    },
    renderContent: function renderContent(h, _ref) {
      var node = _ref.node,
          data = _ref.data,
          store = _ref.store;

      return h("span", [h("span", [h("span", [node.label])])]);
    },
    deleteSelected: function deleteSelected() {
      var _this = this;

      this.$http.get(api.SYS_RESOURCE_DELETE + "?resourceIds=" + this.form.id).then(function (res) {
        _this.$message('操作成功');
        _this.deleteFromTree(_this.resourceTree, _this.form.id);
        _this.newAdd();
      }).catch(function (e) {
        _this.$message('操作成功');
        _this.deleteFromTree(_this.resourceTree, _this.form.id);
        _this.newAdd();
      });
    },
    batchDelete: function batchDelete() {
      var _this2 = this;

      var checkKeys = this.$refs.resourceTree.getCheckedKeys();
      if (checkKeys == null || checkKeys.length <= 0) {
        this.$message.warning('请选择要删除的资源');
        return;
      }
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        _this2.$http.get(api.SYS_RESOURCE_DELETE + "?resourceIds=" + checkKeys.join(',')).then(function (res) {
          _this2.$message('操作成功');
          _this2.load();
        }).catch(function (e) {
          _this2.$message('操作成功');
          console.log(checkKeys);
          _this2.batchDeleteFromTree(_this2.resourceTree, checkKeys);
        });
      });
    },
    handleNodeClick: function handleNodeClick(data) {
      this.form = (0, _merge2.default)({}, data);
    },
    onSubmit: function onSubmit() {
      var _this3 = this;

      if (this.form.id == null) {
        this.$http.post(api.SYS_RESOURCE_ADD, this.form).then(function (res) {
          _this3.$message('操作成功');
          _this3.form.id = res.data.id;
          _this3.appendTreeNode(_this3.resourceTree, res.data);
        }).catch(function (e) {
          _this3.maxId += 1;
          _this3.$message('操作成功');
          _this3.form.id = _this3.maxId;
          var ddd = {
            id: _this3.form.id,
            name: _this3.form.name,
            sort: _this3.form.sort,
            type: _this3.form.type,
            code: _this3.form.code,
            remarks: _this3.form.remarks,
            parentId: _this3.form.parentId,
            usable: _this3.form.usable,
            children: []
          };
          _this3.appendTreeNode(_this3.resourceTree, ddd);
          _this3.resourceTree.push({});
          _this3.resourceTree.pop();
        });
      } else {
        this.$http.post(api.SYS_RESOURCE_UPDATE, this.form).then(function (res) {
          _this3.$message('操作成功');
          _this3.updateTreeNode(_this3.resourceTree, res.data);
        }).catch(function (e) {
          _this3.$message('操作成功');
          _this3.updateTreeNode(_this3.resourceTree, (0, _merge2.default)({}, _this3.form));
        });
      }
    },
    load: function load() {
      var _this4 = this;

      sysApi.resourceList().then(function (res) {
        var _resourceTree;

        _this4.resourceTree = [];
        (_resourceTree = _this4.resourceTree).push.apply(_resourceTree, (0, _toConsumableArray3.default)(res));
      });
    }
  },
  created: function created() {
    this.load();
  }
};

/***/ }),

/***/ 418:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  name: "ImpPanel",
  props: {
    widthBorder: {
      type: Boolean
    },
    title: {
      type: String
    },
    footer: {
      type: String
    }
  }
};

/***/ }),

/***/ 419:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _emitter = __webpack_require__(1078);

var _emitter2 = _interopRequireDefault(_emitter);

var _locale = __webpack_require__(1079);

var _locale2 = _interopRequireDefault(_locale);

var _selectDropdown = __webpack_require__(1084);

var _selectDropdown2 = _interopRequireDefault(_selectDropdown);

var _clickoutside = __webpack_require__(1091);

var _clickoutside2 = _interopRequireDefault(_clickoutside);

var _dom = __webpack_require__(178);

var _resizeEvent = __webpack_require__(1092);

var _locale3 = __webpack_require__(420);

var _merge = __webpack_require__(256);

var _merge2 = _interopRequireDefault(_merge);

var _treeter = __webpack_require__(422);

var _treeter2 = _interopRequireDefault(_treeter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sizeMap = {
  'large': 42,
  'small': 30,
  'mini': 22
};

exports.default = {
  mixins: [_emitter2.default, _locale2.default, _treeter2.default],

  name: 'ElSelectTree',

  componentName: 'ElSelectTree',

  computed: {
    iconClass: function iconClass() {
      var criteria = this.clearable && !this.disabled && this.inputHovering && !this.multiple && this.value !== undefined && this.value != null && this.value !== '';
      return criteria ? 'circle-close is-show-close' : 'caret-top';
    },
    emptyText: function emptyText() {
      if (this.loading) {
        return this.loadingText || this.t('el.select.loading');
      } else {
        if (this.treeData.length === 0) {
          return this.noDataText || this.t('el.select.noData');
        }
      }
      return null;
    }
  },

  components: { ElSelectMenu: _selectDropdown2.default },

  directives: { Clickoutside: _clickoutside2.default },

  props: {
    name: String,
    value: {},
    treeData: Array,
    size: String,
    disabled: Boolean,
    clearable: Boolean,
    loading: Boolean,
    popperClass: String,
    loadingText: String,
    noDataText: String,
    multiple: Boolean,
    propNames: {
      type: Object,
      default: function _default() {
        return { children: 'children', label: 'label', id: 'id' };
      }
    },
    multipleLimit: {
      type: Number,
      default: 0
    },
    placeholder: {
      type: String,
      default: function _default() {
        return (0, _locale3.t)('el.select.placeholder');
      }
    }
  },

  data: function data() {
    return {
      selected: this.multiple ? [] : {},
      inputLength: 20,
      inputWidth: 0,
      currentPlaceholder: '',
      dropdownUl: null,
      visible: false,
      selectedLabel: '',
      bottomOverflow: 0,
      topOverflow: 0,
      inputHovering: false
    };
  },


  watch: {
    value: function value(val) {
      this.handleResize();
      if (!!val) {
        this.currentPlaceholder = '';
      } else {
        this.currentPlaceholder = this.placeholder;
      }
      this.setSelected(val);
      this.$emit('change', val);
      this.dispatch('ElFormItem', 'el.form.change', val);
    },
    visible: function visible(val) {
      if (!val) {
        this.$refs.reference.$el.querySelector('input').blur();
        this.handleIconHide();
        this.broadcast('ElSelectDropdown', 'destroyPopper');
        if (!this.multiple) {
          this.inputLength = 20;
          this.getOverflows();
        }
      } else {
        this.handleIconShow();
        this.broadcast('ElSelectDropdown', 'updatePopper');
      }
      this.$emit('visible-change', val);
    }
  },

  methods: {
    handleIconHide: function handleIconHide() {
      var icon = this.$el.querySelector('.el-input__icon');
      if (icon) {
        (0, _dom.removeClass)(icon, 'is-reverse');
      }
    },
    handleIconShow: function handleIconShow() {
      var icon = this.$el.querySelector('.el-input__icon');
      if (icon && !(0, _dom.hasClass)(icon, 'el-icon-circle-close')) {
        (0, _dom.addClass)(icon, 'is-reverse');
      }
    },
    handleMenuEnter: function handleMenuEnter() {
      if (!this.dropdownUl) {
        this.dropdownUl = this.$refs.popper.$el.querySelector('.el-select-dropdown__wrap');
        this.getOverflows();
      }
      if (!this.multiple && this.dropdownUl) {
        this.resetMenuScroll();
      }
    },
    getOverflows: function getOverflows() {
      if (this.dropdownUl && this.selected && this.selected.$el) {
        var selectedRect = this.selected.$el.getBoundingClientRect();
        var popperRect = this.$refs.popper.$el.getBoundingClientRect();
        this.bottomOverflow = selectedRect.bottom - popperRect.bottom;
        this.topOverflow = selectedRect.top - popperRect.top;
      }
    },
    resetMenuScroll: function resetMenuScroll() {
      if (this.bottomOverflow > 0) {
        this.dropdownUl.scrollTop += this.bottomOverflow;
      } else if (this.topOverflow < 0) {
        this.dropdownUl.scrollTop += this.topOverflow;
      }
    },
    setSelected: function setSelected(ids) {
      if (!!ids) {
        if (this.multiple) {
          this.$refs.tree.setCheckedKeys(ids);
          this.selected = this.$refs.tree.getCheckedNodes();
        } else {
          this.selected = this.findFromTree(this.treeData, ids, this.propNames.id, this.propNames.children);
          this.selectedLabel = !!this.selected ? this.selected[this.propNames.label] : '';
        }
      } else {
        this.selected = this.multiple ? [] : {};
        this.selectedLabel = '';
      }
    },
    handleIconClick: function handleIconClick(event) {
      if (this.iconClass.indexOf('circle-close') > -1) {
        this.deleteSelected(event);
      } else {
        this.toggleMenu();
      }
    },
    doDestroy: function doDestroy() {
      this.$refs.popper && this.$refs.popper.doDestroy();
    },
    handleClose: function handleClose() {
      this.visible = false;
    },
    managePlaceholder: function managePlaceholder() {
      if (this.currentPlaceholder !== '') {
        this.currentPlaceholder = this.$refs.input.value ? '' : this.cachedPlaceHolder;
      }
    },
    resetInputState: function resetInputState(e) {
      if (e.keyCode !== 8) this.toggleLastOptionHitState(false);
      this.inputLength = this.$refs.input.value.length * 15 + 20;
      this.resetInputHeight();
    },
    resetInputHeight: function resetInputHeight() {
      var _this = this;

      this.$nextTick(function () {
        if (!_this.$refs.reference) return;
        var inputChildNodes = _this.$refs.reference.$el.childNodes;
        var input = [].filter.call(inputChildNodes, function (item) {
          return item.tagName === 'INPUT';
        })[0];
        input.style.height = Math.max(_this.$refs.tags.clientHeight + 6, sizeMap[_this.size] || 36) + 'px';
        if (_this.visible && _this.emptyText !== false) {
          _this.broadcast('ElSelectDropdown', 'updatePopper');
        }
      });
    },
    handleTreeNodeClick: function handleTreeNodeClick(nodeData) {
      if (this.multiple) return;
      this.$emit('input', nodeData.id);
      this.visible = false;
      this.selectedLabel = nodeData[this.propNames.label];
      this.selected = nodeData;
      this.handleResize();
    },
    handleCheckChange: function handleCheckChange(data, checked, indeterminate) {
      if (!this.multiple) return;
      this.selected = this.$refs.tree.getCheckedNodes();
      var tmpValue = [];
      if (this.selected) {
        this.selected.forEach(function (item, index) {
          tmpValue.push(item.id);
        });
      }
      this.$emit('input', tmpValue);
      this.handleResize();
    },
    toggleMenu: function toggleMenu() {
      if (this.visible) {
        return;
      }
      if (!this.disabled) {
        this.visible = !this.visible;
      }
    },
    resetScrollTop: function resetScrollTop() {
      var bottomOverflowDistance = this.options[this.hoverIndex].$el.getBoundingClientRect().bottom - this.$refs.popper.$el.getBoundingClientRect().bottom;
      var topOverflowDistance = this.options[this.hoverIndex].$el.getBoundingClientRect().top - this.$refs.popper.$el.getBoundingClientRect().top;
      if (bottomOverflowDistance > 0) {
        this.dropdownUl.scrollTop += bottomOverflowDistance;
      }
      if (topOverflowDistance < 0) {
        this.dropdownUl.scrollTop += topOverflowDistance;
      }
    },
    deleteSelected: function deleteSelected(event) {
      event.stopPropagation();
      this.$emit('input', '');
      this.selected = {};
      this.selectedLabel = '';
      this.visible = false;
    },
    deleteTag: function deleteTag(event, tag) {
      var index = this.selected.indexOf(tag);
      if (index > -1 && !this.disabled) {
        this.value.splice(index, 1);
        this.selected.splice(index, 1);
        this.$emit('remove-tag', tag);
      }
      event.stopPropagation();
    },
    resetInputWidth: function resetInputWidth() {
      this.inputWidth = this.$refs.reference.$el.getBoundingClientRect().width;
    },
    handleResize: function handleResize() {
      this.resetInputWidth();
      if (this.multiple) {
        this.resetInputHeight();
      } else {
        this.inputLength = 20;
      }
    }
  },

  created: function created() {
    this.cachedPlaceHolder = this.currentPlaceholder = this.placeholder;
    if (this.multiple && !Array.isArray(this.value)) {
      this.$emit('input', []);
    }
    if (!this.multiple && Array.isArray(this.value)) {
      this.$emit('input', '');
    }
    this.setSelected();
    this.$on('setSelected', this.setSelected);
  },
  mounted: function mounted() {
    var _this2 = this;

    (0, _resizeEvent.addResizeListener)(this.$el, this.handleResize);
    this.$nextTick(function () {
      if (_this2.$refs.reference && _this2.$refs.reference.$el) {
        _this2.inputWidth = _this2.$refs.reference.$el.getBoundingClientRect().width;
      }
    });
  },
  beforeDestroy: function beforeDestroy() {
    if (this.$el && this.handleResize) (0, _resizeEvent.removeResizeListener)(this.$el, this.handleResize);
  }
};

/***/ }),

/***/ 421:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vuePopper = __webpack_require__(1085);

var _vuePopper2 = _interopRequireDefault(_vuePopper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  name: 'ElSelectDropdown',

  componentName: 'ElSelectDropdown',

  mixins: [_vuePopper2.default],

  props: {
    placement: {
      default: 'bottom-start'
    },

    boundariesPadding: {
      default: 0
    },

    popperOptions: {
      default: function _default() {
        return {
          gpuAcceleration: false
        };
      }
    },

    visibleArrow: {
      default: true
    },

    appendToBody: {
      type: Boolean,
      default: true
    }
  },

  data: function data() {
    return {
      minWidth: ''
    };
  },


  computed: {
    popperClass: function popperClass() {
      return this.$parent.popperClass;
    }
  },

  watch: {
    '$parent.inputWidth': function $parentInputWidth() {
      this.minWidth = this.$parent.$el.getBoundingClientRect().width + 'px';
    }
  },

  mounted: function mounted() {
    var _this = this;

    this.referenceElm = this.$parent.$refs.reference.$el;
    this.$parent.popperElm = this.popperElm = this.$el;
    this.$on('updatePopper', function () {
      if (_this.$parent.visible) _this.updatePopper();
    });
    this.$on('destroyPopper', this.destroyPopper);
  }
};

/***/ }),

/***/ 422:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var findFromTree = function findFromTree(treeArray, id) {
  var idPropName = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "id";
  var childrenPropName = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "children";

  if (!treeArray || treeArray == null || treeArray.length <= 0) return null;
  for (var i = 0; i < treeArray.length; i++) {
    if (treeArray[i][idPropName] == id) {
      return treeArray[i];
    } else {
      var result = findFromTree(treeArray[i][childrenPropName], id, idPropName, childrenPropName);
      if (result != null) {
        return result;
      }
    }
  }
  return null;
};

var appendTreeNode = function appendTreeNode(treeArray, item) {
  var idPropName = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "id";
  var parentPropName = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "parentId";
  var childrenPropName = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "children";

  if (treeArray == null || treeArray.length <= 0) return;
  if (!item[parentPropName] || item[parentPropName] == null) {
    var i = treeArray.findIndex(function (p) {
      return p.sort > item.sort;
    });
    if (i == -1) {
      i = treeArray.length;
    }
    treeArray.splice(i, 0, item);
    return;
  }
  for (var j = 0; j < treeArray.length; j++) {
    var value = treeArray[j];
    if (item[parentPropName] == value[idPropName]) {
      if (value[childrenPropName] && value[childrenPropName].length > 0) {
        var _i = value[childrenPropName].findIndex(function (p) {
          return p.sort > item.sort;
        });
        if (_i == -1) {
          _i = value[childrenPropName].length;
        }
        value[childrenPropName].splice(_i, 0, item);
      } else {
        value[childrenPropName] = [];
        value[childrenPropName].push(item);
      }
    } else {
      appendTreeNode(value[childrenPropName], item, idPropName, parentPropName, childrenPropName);
    }
  }
};

var deleteFromTree = function deleteFromTree(list, id) {
  var idPropName = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "id";
  var childrenPropName = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "children";

  if (!list || list == null || list.length <= 0) return true;
  for (var i = 0; i < list.length; i++) {
    if (list[i][idPropName] == id) {
      list.splice(i, 1);
      return true;
    } else {
      var result = deleteFromTree(list[i][childrenPropName], id, idPropName, childrenPropName);
      if (result) {
        return result;
      }
    }
  }
  return false;
};

var batchDeleteFromTree = function batchDeleteFromTree(list, ids) {
  var idPropName = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "id";
  var childrenPropName = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "children";

  if (!list || list == null || list.length <= 0) return;
  if (!ids || ids == null || ids.length <= 0) return;
  for (var i = 0; i < list.length; i++) {
    if (ids.findIndex(function (x) {
      return x == list[i][idPropName];
    }) > -1) {
      list.splice(i, 1);
      i--;
      continue;
    } else {
      batchDeleteFromTree(list[i][childrenPropName], ids, idPropName, childrenPropName);
    }
  }
};

var updateTreeNode = function updateTreeNode(list, item) {
  var idPropName = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "id";
  var childrenPropName = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "children";

  if (!list || list == null || list.length <= 0) return false;
  for (var i = 0; i < list.length; i++) {
    if (list[i][idPropName] == item[idPropName]) {
      console.log(list[i][idPropName], item[idPropName]);
      list.splice(i, 1, item);
      return true;
    } else {
      var result = updateTreeNode(list[i][childrenPropName], item, idPropName, childrenPropName);
      if (result) {
        return result;
      }
    }
  }
  return false;
};

exports.default = {
  methods: {
    findFromTree: findFromTree,
    appendTreeNode: appendTreeNode,
    deleteFromTree: deleteFromTree,
    updateTreeNode: updateTreeNode,
    batchDeleteFromTree: batchDeleteFromTree
  }
};

/***/ }),

/***/ 423:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = __webpack_require__(240);

var _stringify2 = _interopRequireDefault(_stringify);

var _mutationTypes = __webpack_require__(114);

var _mutationTypes2 = _interopRequireDefault(_mutationTypes);

var _api = __webpack_require__(44);

var api = _interopRequireWildcard(_api);

var _auth = __webpack_require__(137);

var _auth2 = _interopRequireDefault(_auth);

var _sys = __webpack_require__(58);

var sysApi = _interopRequireWildcard(_sys);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  name: 'login',
  data: function data() {
    return {
      form: {
        username: '',
        password: ''
      }
    };
  },

  components: {},
  methods: {
    login: function login() {
      var _this = this;

      var redirectUrl = '/index',
          _url = api.LOGIN + '?username=' + this.form.username + '&password=' + this.form.password;
      if (this.$route.query && this.$route.query != null && this.$route.query.redirect && this.$route.query.redirect != null) {
        redirectUrl = this.$route.query.redirect;
      }
      this.$http.post(_url).then(function (res) {
        var _message = res && res.data && res.data.message ? res.data.message : '系统异常',
            _type = res && res.data && res.data.code == '0' ? 'success' : 'error';
        _this.$message({
          type: _type,
          message: _message
        });
        if (!res || !res.data || res.data.code != '0') {
          return;
        }
        _this.loginSuccess(res.data.result, redirectUrl);
      }).catch(function (err) {
        _this.$message.error('系统异常!');
      });
    },
    loginSuccess: function loginSuccess(data, redirectUrl) {
      var _sid = data.id;
      _auth2.default.login(_sid);
      window.localStorage.setItem("user-info", (0, _stringify2.default)(data));
      redirectUrl && this.$router.push({ path: redirectUrl });
    }
  }
};

/***/ }),

/***/ 424:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = __webpack_require__(73);

var _extends3 = _interopRequireDefault(_extends2);

var _vue = __webpack_require__(16);

var _vue2 = _interopRequireDefault(_vue);

var _sideMenu = __webpack_require__(1100);

var _sideMenu2 = _interopRequireDefault(_sideMenu);

var _header = __webpack_require__(1105);

var _header2 = _interopRequireDefault(_header);

var _footer = __webpack_require__(1108);

var _footer2 = _interopRequireDefault(_footer);

var _vuex = __webpack_require__(113);

var _mutationTypes = __webpack_require__(114);

var _mutationTypes2 = _interopRequireDefault(_mutationTypes);

__webpack_require__(1111);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  name: 'app',
  components: {
    sideMenu: _sideMenu2.default,
    impFooter: _footer2.default,
    impHeader: _header2.default
  },
  computed: (0, _extends3.default)({}, (0, _vuex.mapGetters)({
    sidebar: 'sidebar',
    device: 'device',
    currentMenus: 'currentMenus'
  })),
  data: function data() {
    return {
      active: true,
      headerFixed: true,
      breadcrumb: []
    };
  },
  methods: (0, _extends3.default)({}, (0, _vuex.mapMutations)({
    toggleDevice: _mutationTypes2.default.TOGGLE_DEVICE,
    toggleSidebar: _mutationTypes2.default.TOGGLE_SIDEBAR,
    toggleSidebarShow: _mutationTypes2.default.TOGGLE_SIDEBAR_SHOW
  }), (0, _vuex.mapActions)({
    changeCurrentMenu: 'changeCurrentMenu' })),
  watch: {
    '$route': function $route(to, from) {}
  },
  beforeMount: function beforeMount() {
    var _this = this;

    var _document = document,
        body = _document.body;

    var WIDTH = 784;
    var handler = function handler() {
      if (!document.hidden) {
        var rect = body.getBoundingClientRect();
        var isMobile = rect.width < WIDTH;
        _this.toggleDevice(isMobile);
        if (isMobile) {
          _this.toggleSidebarShow(false);
          _this.toggleSidebar(false);
        } else {
          _this.toggleSidebarShow(true);
        }
      }
    };
    document.addEventListener('visibilitychange', handler);
    window.addEventListener('DOMContentLoaded', handler);
    window.addEventListener('resize', handler);
  },
  mounted: function mounted() {
    this.$Progress.finish();
  },
  created: function created() {
    var _this2 = this;

    this.$Progress.start();

    this.$router.beforeEach(function (to, from, next) {
      _this2.$store.dispatch('changeCurrentMenu', to);

      _this2.$Progress.start();

      next();
    });

    this.$router.afterEach(function (to, from) {
      _this2.$Progress.finish();
    });
  }
};

/***/ }),

/***/ 425:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = __webpack_require__(73);

var _extends3 = _interopRequireDefault(_extends2);

var _subMenu = __webpack_require__(426);

var _subMenu2 = _interopRequireDefault(_subMenu);

var _vuex = __webpack_require__(113);

var _mutationTypes = __webpack_require__(114);

var _mutationTypes2 = _interopRequireDefault(_mutationTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  props: {
    show: Boolean
  },
  data: function data() {
    return {};
  },

  components: {
    subMenu: _subMenu2.default
  },
  computed: (0, _extends3.default)({}, (0, _vuex.mapGetters)({
    sidebar: 'sidebar',
    device: 'device'
  }), {
    onRoutes: function onRoutes() {
      return this.$route.path;
    },
    onRouteKeys: function onRouteKeys() {
      var getParentArray = function getParentArray(path, ms) {
        var kas = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

        if (ms && ms.length > 0) {
          for (var k = 0, length = ms.length; k < length; k++) {
            if (path == ms[k].href) {
              kas.push(ms[k].href);
              break;
            }
            var i = kas.length;
            if (ms[k].children && ms[k].children.length > 0) {
              getParentArray(path, ms[k].children, kas);
            }
            if (i < kas.length) {
              kas.push(ms[k].href);
            }
          }
        }
        return kas.reverse();
      };
      return getParentArray(this.$route.path, this.menuList);
    }
  }, (0, _vuex.mapGetters)(['menuList'])),
  mounted: function mounted() {
    var route = this.$route;
  },

  created: function created() {
    this.load();
  },
  methods: (0, _extends3.default)({
    handleSelect: function handleSelect() {
      if (this.device.isMobile) {
        this.toggleSidebarShow(false);
      }
    }
  }, (0, _vuex.mapMutations)({
    toggleSidebarShow: _mutationTypes2.default.TOGGLE_SIDEBAR_SHOW
  }), (0, _vuex.mapActions)({
    load: 'loadMenuList' }))
};

/***/ }),

/***/ 426:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_subMenu_vue__ = __webpack_require__(427);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_subMenu_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_subMenu_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_subMenu_vue__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_subMenu_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_37cb3bb7_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_subMenu_vue__ = __webpack_require__(1103);
function injectStyle (ssrContext) {
  __webpack_require__(1102)
}
var normalizeComponent = __webpack_require__(21)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_subMenu_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_37cb3bb7_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_subMenu_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),

/***/ 427:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _subMenu = __webpack_require__(426);

var _subMenu2 = _interopRequireDefault(_subMenu);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  name: 'subMenu',
  props: ['param'],
  data: function data() {
    return { item: this.param };
  },
  components: {
    subMenu: _subMenu2.default
  }
};

/***/ }),

/***/ 428:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = __webpack_require__(73);

var _extends3 = _interopRequireDefault(_extends2);

var _vuex = __webpack_require__(113);

var _mutationTypes = __webpack_require__(114);

var _mutationTypes2 = _interopRequireDefault(_mutationTypes);

var _api = __webpack_require__(44);

var api = _interopRequireWildcard(_api);

var _auth = __webpack_require__(137);

var _auth2 = _interopRequireDefault(_auth);

var _sys = __webpack_require__(58);

var sysApi = _interopRequireWildcard(_sys);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  data: function data() {
    return {
      showMessageBox: false,
      showProfileBox: false,
      list: [],
      count: 4,
      show: true
    };
  },

  computed: (0, _vuex.mapGetters)({
    sidebar: 'sidebar',
    userInfo: 'userInfo',
    device: 'device'
  }),
  methods: (0, _extends3.default)({
    toggleMenu: function toggleMenu(collapsed, isMobile) {
      if (isMobile) {
        this.toggleSidebarShow();
      } else {
        this.toggleSidebar();
      }
    },
    logout: function logout() {
      _auth2.default.logout();

      this.$router.push({ path: '/login' });
    }
  }, (0, _vuex.mapMutations)({
    toggleSidebar: _mutationTypes2.default.TOGGLE_SIDEBAR,
    toggleSidebarShow: _mutationTypes2.default.TOGGLE_SIDEBAR_SHOW,
    setUserInfo: _mutationTypes2.default.SET_USER_INFO
  }), {
    toggleMessage: function toggleMessage() {
      this.showMessageBox = !this.showMessageBox;
    },
    toggleProfile: function toggleProfile() {
      this.showProfileBox = !this.showProfileBox;
    },
    autoHide: function autoHide(evt) {
      if (!this.$el.querySelector('li.messages-menu').contains(evt.target)) {
        this.showMessageBox = false;
      }
      if (!this.$el.querySelector('li.user-menu').contains(evt.target)) {
        this.showProfileBox = false;
      }
    }
  }),
  created: function created() {
    var item = window.localStorage.getItem("user-info");
    if (!!item) {
      this.setUserInfo(JSON.parse(item));
    } else {
      this.$message.error('获取当前用户失败，重置当前页面');
      _auth2.default.logout();
      this.$router.push({ path: '/login' });
    }
    this.count = 0;
    this.list = [];
  },
  mounted: function mounted() {},
  destroyed: function destroyed() {}
};

/***/ }),

/***/ 429:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/img/user.png";

/***/ }),

/***/ 430:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {};

/***/ }),

/***/ 431:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _panel = __webpack_require__(177);

var _panel2 = _interopRequireDefault(_panel);

var _api = __webpack_require__(44);

var api = _interopRequireWildcard(_api);

var _data = __webpack_require__(112);

var _data2 = _interopRequireDefault(_data);

var _sys = __webpack_require__(58);

var sysApi = _interopRequireWildcard(_sys);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  components: {
    'imp-panel': _panel2.default
  },
  data: function data() {
    return {
      dialogVisible: false,
      dialogLoading: false,
      userTitle: '配置用户角色',
      roleIdList: [],
      groupIdList: [],
      userId: '',
      listLoading: false,
      searchKey: '',
      tableData: {
        pagination: {
          name: '',
          roleId: '',
          loginName: '',
          groupId: '',
          total: 0,
          pageNum: 1,
          pageSize: 10,
          parentId: 0
        },
        rows: []
      },
      formatDate: function formatDate(row, column) {
        if (!row.joinTime) {
          return '';
        }
        var date = new Date(parseInt(row.joinTime));
        var Y = date.getFullYear() + '-';
        var M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) + '-' : date.getMonth() + 1 + '-';
        var D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate();;
        return Y + M + D;
      },

      roleLists: []
    };
  },

  methods: {
    search: function search(target) {
      this.loadData();
    },
    onSubmit: function onSubmit() {
      this.loadData();
    },
    createUser: function createUser() {
      this.$router.push({ path: '/sys/userAdd' });
    },
    handleSelectionChange: function handleSelectionChange(val) {},
    handleRoleConfig: function handleRoleConfig(index, row) {
      this.userTitle = '配置用户角色（' + row.name + '）';
      this.roleIdList = row.roleIdList;
      this.userId = row.id;
      this.dialogVisible = true;
    },
    configUserRoles: function configUserRoles() {
      var _this = this;

      var roles = this.roleIdList.join(',');
      var _url = api.SYS_ROLE_ASSIGN + '?roleIds=' + roles + '&userId=' + this.userId;
      this.$http.get(_url, {}).then(function (res) {
        if (res && res.data && res.data.code == '0') {
          _this.$message.success('成功');
          _this.dialogVisible = false;
          _this.loadData();
        } else {
          _this.$message.error(res.data.message);
        }
      });
    },
    handleSizeChange: function handleSizeChange(val) {
      this.tableData.pagination.pageSize = val;
      this.loadData();
    },
    handleCurrentChange: function handleCurrentChange(val) {
      this.tableData.pagination.pageNum = val;
      this.loadData();
    },
    handleEdit: function handleEdit(index, row) {
      this.$router.push({ path: '/sys/userAdd', query: { id: row.id } });
    },
    handleDelete: function handleDelete(index, row) {
      var _this2 = this;

      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        _this2.userDelete(row.id);
      }).catch(function () {
        _this2.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    userDelete: function userDelete(id) {
      var _this3 = this;

      this.$http.get(api.SYS_USER_DELETE + "?id=" + id).then(function (res) {
        if (res) {
          _this3.loadData();
          _this3.$message({
            type: 'success',
            message: '删除成功!'
          });
        } else {
          _this3.$message({
            type: 'error',
            message: '删除失败!'
          });
        }
      }).catch(function (err) {});
    },
    loadGroups: function loadGroups() {
      var _this4 = this;

      this.groupIdList = [];
      this.$http.get(api.SYS_GROUP_LIST_PAGE + "?pageNumber=1&pageSize=10000").then(function (res) {
        if (res && res.data && res.data.code == '0') {
          _this4.groupIdList = res.data.result.list || [];
        } else {
          _this4.$message.error(res.data.message);
        }
      }).catch(function (err) {});
    },
    loadRoles: function loadRoles() {
      var _this5 = this;

      this.roleLists = [];
      sysApi.roleList({
        pageNum: '1',
        pageSize: '9999'
      }).then(function (res) {
        if (!res || res.code != '0') {
          var _message = res && res.message ? res.message : '系统异常';
          _this5.$message.error(_message);
          return;
        }
        _this5.roleLists = res.result.list || [];
      });
    },
    loadData: function loadData() {
      var _this6 = this;

      sysApi.userList({
        pageSize: this.tableData.pagination.pageSize,
        pageNum: this.tableData.pagination.pageNum,
        loginName: this.tableData.pagination.loginName,
        groupId: this.tableData.pagination.groupId,
        roleId: this.tableData.pagination.roleId,
        name: this.tableData.pagination.name
      }).then(function (res) {
        if (!res || res.code != '0') {
          _this6.$message.error(res.message);
          return;
        }
        _this6.tableData.rows = res.result.list;
        _this6.tableData.pagination.total = res.result.total || 0;
      });
    }
  },
  created: function created() {
    this.loadGroups();
    this.loadRoles();
    this.loadData();
  }
};

/***/ }),

/***/ 432:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _panel = __webpack_require__(177);

var _panel2 = _interopRequireDefault(_panel);

var _api = __webpack_require__(44);

var api = _interopRequireWildcard(_api);

var _sys = __webpack_require__(58);

var sysApi = _interopRequireWildcard(_sys);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cityOptions = ['权限1', '权限2', '权限3', '权限4'];
exports.default = {
  components: {
    'imp-panel': _panel2.default
  },
  data: function data() {
    var _this = this;

    var validatePass2 = function validatePass2(rule, value, callback) {
      if (value !== _this.form.newPassword) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      pickerOptions: {
        disabledDate: function disabledDate(time) {
          return time.getTime() > Date.now();
        },

        shortcuts: [{
          text: '今天',
          onClick: function onClick(picker) {
            picker.$emit('pick', new Date());
          }
        }, {
          text: '昨天',
          onClick: function onClick(picker) {
            var date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            picker.$emit('pick', date);
          }
        }]
      },
      checkLoading: false,
      default_value: new Date(),
      editLoading: false,
      dialogImageUrl: '',
      userTitle: '新增用户',
      dialogVisible: false,
      form: {
        id: '',
        no: '',
        name: '',
        newPassword: '',
        loginName: '',
        checkPass: '',
        joinTime: null,
        phone: '',
        email: '',
        userType: '3',
        remarks: '',
        roleIdList: []
      },
      roles: {
        checkAll: false,
        roleList: cityOptions,
        isIndeterminate: true
      },
      rules: {
        checkPass: [{ validator: validatePass2, trigger: 'blur' }]
      }
    };
  },
  created: function created() {
    this.loadRoles();
    this.loadData();
  },

  methods: {
    handleRemove: function handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview: function handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    userBtnClick: function userBtnClick(formName) {
      var _this2 = this;

      this.$refs[formName].validate(function (valid) {
        if (valid) {
          _this2.userSubmit();
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    userSubmit: function userSubmit() {
      var _this3 = this;

      console.log(this.form);
      this.$http.post(api.SYS_USER_ADD, this.form).then(function (res) {
        if (res && res.data && res.data.code == '0') {
          _this3.$confirm('提交成功, 是否返回列表?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'success'
          }).then(function () {
            _this3.$router.push({ path: 'userList' });
          });
        } else {
          var _message = res && res.data && res.data.message ? res.data.message : '系统异常';
          _this3.$message.error(_message);
        }
      });
    },
    loadRoles: function loadRoles() {
      var _this4 = this;

      this.roles.roleList = [];
      this.checkLoading = true;
      sysApi.roleList({
        pageNum: 1,
        pageSize: 9999
      }).then(function (res) {
        if (!res || res.code != '0') {
          var _message = res && res.message ? res.message : '系统异常';
          _this4.$message.error(_message);
          return;
        }
        _this4.roles.roleList = res.result.list || [];
        _this4.checkLoading = false;
        console.log(_this4.roles.roleList);
      });
    },
    loadData: function loadData() {
      var _this5 = this;

      if (this.$route.query && this.$route.query != null && this.$route.query.id && this.$route.query.id != null) {
        this.form.id = this.$route.query.id;
        this.editLoading = true;
        this.$http.get(api.SYS_USER_GET + "?id=" + this.form.id).then(function (res) {
          _this5.editLoading = false;
          if (res && res.data && res.data.result) {
            for (var name in _this5.form) {
              _this5.form[name] = res.data.result[name] || '';
            }
            _this5.form.roleIdList = res.data.result.roleIdList || [];
          } else {
            _this5.$message.warning('当前用户信息获取失败');
          }
          _this5.userTitle = _this5.form.name ? '用户编辑（' + _this5.form.name + '）' : '新增用户';
        });
      }
    }
  }
};

/***/ }),

/***/ 433:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _api = __webpack_require__(44);

var api = _interopRequireWildcard(_api);

var _sys = __webpack_require__(58);

var sysApi = _interopRequireWildcard(_sys);

var _auth = __webpack_require__(137);

var _auth2 = _interopRequireDefault(_auth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.default = {
  data: function data() {
    var _this = this;

    var validatePass2 = function validatePass2(rule, value, callback) {
      if (!value) {
        callback(new Error('确认新密码不能为空!'));
      } else if (value !== _this.form.newPassword) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      form: {
        oldPassword: '',
        newPassword: '',
        newPassword2: ''
      },
      rules: {
        newPassword2: [{ validator: validatePass2, trigger: 'blur' }]
      }
    };
  },

  methods: {
    onSubmit: function onSubmit(formName) {
      var _this2 = this;

      this.$refs[formName].validate(function (valid) {
        if (valid) {
          _this2.checkConfirm();
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    checkConfirm: function checkConfirm() {
      var _this3 = this;

      this.$confirm('是否修改当前用户密码?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        _this3.modifyPwd();
      }).catch(function () {
        _this3.$message.info('已取消修改');
      });
    },
    modifyPwd: function modifyPwd() {
      var _this4 = this;

      var item = window.localStorage.getItem("user-info");
      if (!!item) {
        item = JSON.parse(item);
        sysApi.modifyPwd({
          userId: item.userId,
          oldPassword: this.form.oldPassword,
          newPassword: this.form.newPassword
        }).then(function (res) {
          if (res && res.code == '0') {
            _this4.pwdSubmit();
          } else {
            _this4.$message.error('修改密码失败：' + res.message);
          }
        });
      } else {
        this.$message.error('修改密码失败：获取当前用户失败，请刷新！');
      }
    },
    pwdSubmit: function pwdSubmit() {
      var _this5 = this;

      this.$alert('修改密码成功, 确认重新登录', '提示', {
        confirmButtonText: '确定',
        callback: function callback(action) {
          _auth2.default.logout();

          _this5.$router.push({ path: '/login' });
        }
      });
    }
  }
};

/***/ }),

/***/ 434:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = __webpack_require__(1122);

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _mutations;

var _vue = __webpack_require__(16);

var _vue2 = _interopRequireDefault(_vue);

var _vuex = __webpack_require__(113);

var _vuex2 = _interopRequireDefault(_vuex);

var _mutationTypes = __webpack_require__(114);

var _mutationTypes2 = _interopRequireDefault(_mutationTypes);

var _default = __webpack_require__(413);

var _default2 = _interopRequireDefault(_default);

var _api = __webpack_require__(44);

var api = _interopRequireWildcard(_api);

var _utils = __webpack_require__(399);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_vue2.default.use(_vuex2.default);

var store = new _vuex2.default.Store({
  strict: true,

  getters: {
    loading: function loading(state) {
      return state.loading;
    },
    menuList: function menuList(state) {
      return state.menuList;
    },
    sidebar: function sidebar(state) {
      return state.sidebar;
    },
    userInfo: function userInfo(state) {
      return state.userInfo;
    },
    device: function device(state) {
      return state.device;
    },
    currentMenus: function currentMenus(state) {
      return state.currentMenus;
    }
  },
  state: {
    loading: false,
    menuList: {},
    sidebar: {
      collapsed: (0, _utils.getSessionKey)('state.sidebar.collapsed', 'false') === 'true',
      show: (0, _utils.getSessionKey)('state.sidebar.show', 'true') === 'true'
    },
    device: {
      isMobile: false
    },
    userInfo: { name: '佚名' },
    currentMenus: []
  },
  mutations: (_mutations = {}, (0, _defineProperty3.default)(_mutations, _mutationTypes2.default.TOGGLE_DEVICE, function (state, isMobile) {
    state.device.isMobile = isMobile;
  }), (0, _defineProperty3.default)(_mutations, _mutationTypes2.default.TOGGLE_LOADING, function (state) {
    state.loading = !state.loading;
  }), (0, _defineProperty3.default)(_mutations, _mutationTypes2.default.LOAD_MENU, function (state, menu) {
    state.menuList = menu;
  }), (0, _defineProperty3.default)(_mutations, _mutationTypes2.default.LOAD_CURRENT_MENU, function (state, menu) {
    state.currentMenus = menu;
  }), (0, _defineProperty3.default)(_mutations, _mutationTypes2.default.SET_USER_INFO, function (state, info) {
    state.userInfo = info;
  }), (0, _defineProperty3.default)(_mutations, _mutationTypes2.default.TOGGLE_SIDEBAR, function (state, collapsed) {
    if (collapsed == null) collapsed = !state.sidebar.collapsed;
    state.sidebar.collapsed = collapsed;
    window.sessionStorage.setItem("state.sidebar.collapsed", collapsed);
  }), (0, _defineProperty3.default)(_mutations, _mutationTypes2.default.TOGGLE_SIDEBAR_SHOW, function (state, show) {
    if (show == null) state.sidebar.show = !state.sidebar.show;else {
      state.sidebar.show = show;
    }
    window.sessionStorage.setItem("state.sidebar.show", state.sidebar.show);
  }), _mutations), actions: {
    toggleLoading: function toggleLoading(_ref) {
      var commit = _ref.commit;
      return commit(_mutationTypes2.default.TOGGLE_LOADING);
    },
    loadMenuList: function loadMenuList(_ref2) {
      var commit = _ref2.commit;

      commit(_mutationTypes2.default.LOAD_MENU, _default2.default.menuList);
    },
    changeCurrentMenu: function changeCurrentMenu(_ref3, _ref4) {
      var state = _ref3.state,
          commit = _ref3.commit;
      var path = _ref4.path,
          matched = _ref4.matched,
          fullPath = _ref4.fullPath;

      var a = (0, _utils.getCurrentMenu)(fullPath, state.menuList);
      commit(_mutationTypes2.default.LOAD_CURRENT_MENU, a.reverse());
    }
  }
});

exports.default = store;

/***/ }),

/***/ 435:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _keys = __webpack_require__(436);

var _keys2 = _interopRequireDefault(_keys);

__webpack_require__(442);

var _vue = __webpack_require__(16);

var _vue2 = _interopRequireDefault(_vue);

var _frame = __webpack_require__(646);

var _frame2 = _interopRequireDefault(_frame);

var _router = __webpack_require__(651);

var _router2 = _interopRequireDefault(_router);

var _store = __webpack_require__(434);

var _store2 = _interopRequireDefault(_store);

var _axios = __webpack_require__(391);

var _axios2 = _interopRequireDefault(_axios);

var _filters = __webpack_require__(1126);

var _filters2 = _interopRequireDefault(_filters);

var _vueProgressbar = __webpack_require__(1127);

var _vueProgressbar2 = _interopRequireDefault(_vueProgressbar);

var _elementUi = __webpack_require__(244);

var _elementUi2 = _interopRequireDefault(_elementUi);

__webpack_require__(1128);

var _panel = __webpack_require__(177);

var _panel2 = _interopRequireDefault(_panel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_vue2.default.prototype.$http = _axios2.default;
_vue2.default.axios = _axios2.default;
_vue2.default.http = _axios2.default;
_vue2.default.use(_axios2.default);

_vue2.default.use(_elementUi2.default);

_vue2.default.component(_panel2.default.name, _panel2.default);

_vue2.default.use(_vueProgressbar2.default, {
  color: '#eeeeee',
  failedColor: '#874b4b',
  thickness: '2px',
  transition: {
    speed: '0.2s',
    opacity: '0.6s'
  },
  autoRevert: true,
  location: 'top',
  inverse: false
});

(0, _keys2.default)(_filters2.default).forEach(function (key) {
  _vue2.default.filter(key, _filters2.default[key]);
});

new _vue2.default({
  store: _store2.default,
  router: _router2.default,
  el: "#root",
  render: function render(h) {
    return h(_frame2.default);
  }
});

/***/ }),

/***/ 44:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SYS_GROUP_ROLE_DELETES = exports.SYS_GROUP_ROLE_DELETE = exports.SYS_GROUP_USER_DELETES = exports.SYS_GROUP_USER_DELETE = exports.SYS_FIND_GROUP_ROLE = exports.SYS_FIND_GROUP_USER = exports.SYS_ROLE_TO_GROUP = exports.SYS_USER_TO_GROUP = exports.SYS_GROUP_DELETE = exports.SYS_GROUP_UPDATE = exports.SYS_GROUP_ADD = exports.SYS_GROUP_TREELIST = exports.SYS_GROUP_LIST_PAGE = exports.SYS_GROUP_LIST = exports.SYS_PERMISSION_DELETE = exports.SYS_PERMISSION_UPDATE = exports.SYS_PERMISSION_ADD = exports.SYS_PERMISSION_LIST = exports.SYS_USER_PAGE = exports.SYS_USER_DELETE = exports.SYS_USER_ADD = exports.SYS_USER_GET = exports.SYS_RESOURCE_LIST2 = exports.SYS_RESOURCE_LIST = exports.SYS_RESOURCE_PAGE = exports.SYS_RESOURCE_ADD = exports.SYS_RESOURCE_DELETE = exports.SYS_RESOURCE_UPDATE = exports.SYS_RESOURCE_GET = exports.SYS_ROLE_ASSIGN = exports.SYS_ROLE_PAGE = exports.SYS_ROLE_ADD = exports.SYS_ROLE_DELETE = exports.SYS_MENU_LIST = exports.SYS_MENU_PAGE = exports.SYS_MENU_ADD = exports.SYS_MENU_DELETE = exports.SYS_MENU_UPSERT = exports.SYS_MENU_GET = exports.SYS_MENU_TREE = exports.CHANGE_PWD = exports.LOGOUT = exports.LOGIN = exports.KPMS = exports.CONTEXT = undefined;

__webpack_require__(957);

window.version = 'v1.0.2';
var CONTEXT = exports.CONTEXT = './Vue-Admin';
var KPMS = exports.KPMS = window.kpms || 'http://192.168.5.34:33410/kpms/';

var LOGIN = exports.LOGIN = KPMS + 'v2/login';var LOGOUT = exports.LOGOUT = CONTEXT + '/logout';
var CHANGE_PWD = exports.CHANGE_PWD = KPMS + 'v2/user/modifyPwd';

var SYS_MENU_TREE = exports.SYS_MENU_TREE = KPMS + 'v2/menu/findTree';var SYS_MENU_GET = exports.SYS_MENU_GET = KPMS + '/v2/role/get';
var SYS_MENU_UPSERT = exports.SYS_MENU_UPSERT = KPMS + 'v2/menu/upsert';var SYS_MENU_DELETE = exports.SYS_MENU_DELETE = KPMS + 'v2/menu/delete';var SYS_MENU_ADD = exports.SYS_MENU_ADD = CONTEXT + '/sys/menu/add';
var SYS_MENU_PAGE = exports.SYS_MENU_PAGE = CONTEXT + '/sys/menu/page';
var SYS_MENU_LIST = exports.SYS_MENU_LIST = CONTEXT + '/sys/menu/list';

var SYS_ROLE_DELETE = exports.SYS_ROLE_DELETE = KPMS + 'v2/role/delete';var SYS_ROLE_ADD = exports.SYS_ROLE_ADD = KPMS + 'v2/role/upsert';var SYS_ROLE_PAGE = exports.SYS_ROLE_PAGE = KPMS + 'v2/role/query';
var SYS_ROLE_ASSIGN = exports.SYS_ROLE_ASSIGN = KPMS + 'v2/role/assign';var SYS_RESOURCE_GET = exports.SYS_RESOURCE_GET = CONTEXT + '/sys/resource/get';
var SYS_RESOURCE_UPDATE = exports.SYS_RESOURCE_UPDATE = CONTEXT + '/sys/resource/update';
var SYS_RESOURCE_DELETE = exports.SYS_RESOURCE_DELETE = CONTEXT + '/sys/resource/delete';
var SYS_RESOURCE_ADD = exports.SYS_RESOURCE_ADD = CONTEXT + '/sys/resource/add';
var SYS_RESOURCE_PAGE = exports.SYS_RESOURCE_PAGE = CONTEXT + '/sys/resource/page';
var SYS_RESOURCE_LIST = exports.SYS_RESOURCE_LIST = CONTEXT + '/sys/resource/list';
var SYS_RESOURCE_LIST2 = exports.SYS_RESOURCE_LIST2 = CONTEXT + '/sys/resource/list2';

var SYS_USER_GET = exports.SYS_USER_GET = KPMS + 'v2/user/get';
var SYS_USER_ADD = exports.SYS_USER_ADD = KPMS + 'v2/user/upsert';
var SYS_USER_DELETE = exports.SYS_USER_DELETE = KPMS + 'v2/user/delete';var SYS_USER_PAGE = exports.SYS_USER_PAGE = KPMS + 'v2/user/query';var SYS_PERMISSION_LIST = exports.SYS_PERMISSION_LIST = KPMS + 'v2/permission/findAllForPage';var SYS_PERMISSION_ADD = exports.SYS_PERMISSION_ADD = KPMS + 'v2/permission/add';var SYS_PERMISSION_UPDATE = exports.SYS_PERMISSION_UPDATE = KPMS + 'v2/permission/update';var SYS_PERMISSION_DELETE = exports.SYS_PERMISSION_DELETE = KPMS + 'v2/permission/delete';var SYS_GROUP_LIST = exports.SYS_GROUP_LIST = KPMS + 'v2/bizGroup/findAll';var SYS_GROUP_LIST_PAGE = exports.SYS_GROUP_LIST_PAGE = KPMS + 'v2/bizGroup/findAllForPage';var SYS_GROUP_TREELIST = exports.SYS_GROUP_TREELIST = KPMS + 'v2/bizGroup/findAllByTree';var SYS_GROUP_ADD = exports.SYS_GROUP_ADD = KPMS + 'v2/bizGroup/add';var SYS_GROUP_UPDATE = exports.SYS_GROUP_UPDATE = KPMS + 'v2/bizGroup/update';var SYS_GROUP_DELETE = exports.SYS_GROUP_DELETE = KPMS + 'v2/bizGroup/delete';var SYS_USER_TO_GROUP = exports.SYS_USER_TO_GROUP = KPMS + 'v2/bizGroup/insertGroupUser';var SYS_ROLE_TO_GROUP = exports.SYS_ROLE_TO_GROUP = KPMS + 'v2/bizGroup/insertDataPermission';var SYS_FIND_GROUP_USER = exports.SYS_FIND_GROUP_USER = KPMS + 'v2/user/findByGroup';var SYS_FIND_GROUP_ROLE = exports.SYS_FIND_GROUP_ROLE = KPMS + 'v2/permission/findByGroup';var SYS_GROUP_USER_DELETE = exports.SYS_GROUP_USER_DELETE = KPMS + 'v2/bizGroup/deleteAllUser';var SYS_GROUP_USER_DELETES = exports.SYS_GROUP_USER_DELETES = KPMS + 'v2/bizGroup/deleteGroupUser';var SYS_GROUP_ROLE_DELETE = exports.SYS_GROUP_ROLE_DELETE = KPMS + 'v2/bizGroup/deleteAllPermission';var SYS_GROUP_ROLE_DELETES = exports.SYS_GROUP_ROLE_DELETES = KPMS + 'v2/bizGroup/deleteDataPermission';

/***/ }),

/***/ 58:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = __webpack_require__(375);

var _promise2 = _interopRequireDefault(_promise);

exports.configList = configList;
exports.login = login;
exports.msgList = msgList;
exports.menuList = menuList;
exports.resourceList = resourceList;
exports.permissionList = permissionList;
exports.roleList = roleList;
exports.groupList = groupList;
exports.userList = userList;
exports.modifyPwd = modifyPwd;

var _axios = __webpack_require__(391);

var _axios2 = _interopRequireDefault(_axios);

var _api = __webpack_require__(44);

var api = _interopRequireWildcard(_api);

var _default = __webpack_require__(413);

var _default2 = _interopRequireDefault(_default);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function configList(params) {
  return new _promise2.default(function (resolve, reject) {
    _axios2.default.get("http://192.168.5.34:33910/kd-config-server/develop-v1.1.x/kts-web-dev.json", {}).then(function (response) {
      resolve(response.data);
    }, function (err) {
      resolve(_default2.default.menuList);
    }).catch(function (error) {
      resolve(_default2.default.menuList);
    });
  });
}

function login(params) {
  return new _promise2.default(function (resolve, reject) {
    var _url = api.LOGIN + '?username=' + params.username + '&password=' + params.password;
    _axios2.default.post(_url, {}).then(function (response) {
      resolve(response.data);
    }, function (err) {
      resolve(err);
    }).catch(function (error) {
      resolve(error);
    });
  });
}
function msgList(params) {
  return new _promise2.default(function (resolve, reject) {
    _axios2.default.post(api.MSG_TOP_TEN, { params: params }).then(function (response) {
      resolve(response.data);
    }, function (err) {
      resolve(_default2.default.msgList);
    }).catch(function (error) {
      resolve(_default2.default.msgList);
    });
  });
}

function menuList(params) {
  return new _promise2.default(function (resolve, reject) {
    _axios2.default.get(api.SYS_MENU_TREE, {}).then(function (response) {
      resolve(response.data);
    }, function (err) {
      resolve(err);
    }).catch(function (error) {
      resolve(error);
    });
  });
}

function resourceList(params) {
  return new _promise2.default(function (resolve, reject) {
    _axios2.default.get(api.SYS_RESOURCE_LIST, { params: params }).then(function (response) {
      resolve(response.data);
    }, function (err) {
      resolve(_default2.default.resource);
    }).catch(function (error) {
      resolve(_default2.default.resource);
    });
  });
}

function permissionList(params) {
  return new _promise2.default(function (resolve, reject) {
    _axios2.default.get(api.SYS_PERMISSION_LIST, { params: params }).then(function (response) {
      resolve(response.data);
    }, function (err) {
      resolve(err);
    }).catch(function (error) {
      resolve(error);
    });
  });
}

function roleList(params) {
  return new _promise2.default(function (resolve, reject) {
    _axios2.default.get(api.SYS_ROLE_PAGE, { params: params }).then(function (response) {
      resolve(response.data);
    }, function (err) {
      resolve(err);
    }).catch(function (error) {
      resolve(error);
    });
  });
}

function groupList(params) {
  return new _promise2.default(function (resolve, reject) {
    _axios2.default.get(api.SYS_GROUP_TREELIST, { params: params }).then(function (response) {
      resolve(response.data);
    }, function (err) {
      resolve(err);
    }).catch(function (error) {
      resolve(error);
    });
  });
}

function userList(params) {
  return new _promise2.default(function (resolve, reject) {
    _axios2.default.get(api.SYS_USER_PAGE, { params: params }).then(function (response) {
      resolve(response.data);
    }, function (err) {
      resolve(err);
    }).catch(function (error) {
      resolve(error);
    });
  });
}

function modifyPwd(params) {
  return new _promise2.default(function (resolve, reject) {
    var _url = api.CHANGE_PWD + '?userId=' + params.userId + '&oldPassword=' + params.oldPassword + '&newPassword=' + params.newPassword;
    _axios2.default.post(_url, {}).then(function (response) {
      resolve(response.data);
    }, function (err) {
      resolve(err);
    }).catch(function (error) {
      resolve(error);
    });
  });
}

/***/ }),

/***/ 646:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_frame_vue__ = __webpack_require__(297);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_frame_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_frame_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_frame_vue__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_frame_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_6cd7b690_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_frame_vue__ = __webpack_require__(650);
function injectStyle (ssrContext) {
  __webpack_require__(647)
}
var normalizeComponent = __webpack_require__(21)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_frame_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_6cd7b690_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_frame_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),

/***/ 647:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 649:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 650:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('transition',{attrs:{"mode":"out-in","enter-active-class":"fadeIn","leave-active-class":"fadeOut","appear":""}},[_c('router-view')],1)}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),

/***/ 651:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vue = __webpack_require__(16);

var _vue2 = _interopRequireDefault(_vue);

var _vueRouter = __webpack_require__(298);

var _vueRouter2 = _interopRequireDefault(_vueRouter);

var _routes = __webpack_require__(652);

var _routes2 = _interopRequireDefault(_routes);

var _vuexRouterSync = __webpack_require__(1121);

var _store = __webpack_require__(434);

var _store2 = _interopRequireDefault(_store);

var _mutationTypes = __webpack_require__(114);

var _mutationTypes2 = _interopRequireDefault(_mutationTypes);

var _auth = __webpack_require__(137);

var _auth2 = _interopRequireDefault(_auth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_vue2.default.use(_vueRouter2.default);

var router = new _vueRouter2.default({
  routes: _routes2.default
});

(0, _vuexRouterSync.sync)(_store2.default, router);

var state = _store2.default.state;

router.beforeEach(function (route, redirect, next) {
  if (state.device.isMobile && state.sidebar.opened) {
    _store2.default.commit(_mutationTypes2.default.TOGGLE_SIDEBAR, false);
  }
  if (!_auth2.default.loggedIn() && route.path !== '/login') {
    next({
      path: '/login',
      query: { redirect: route.fullPath }
    });
  } else {
    next();
  }
});

exports.default = router;

/***/ }),

/***/ 652:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _dashboard = __webpack_require__(653);

var _dashboard2 = _interopRequireDefault(_dashboard);

var _ = __webpack_require__(950);

var _2 = _interopRequireDefault(_);

var _menu = __webpack_require__(954);

var _menu2 = _interopRequireDefault(_menu);

var _role = __webpack_require__(1059);

var _role2 = _interopRequireDefault(_role);

var _dataRole = __webpack_require__(1062);

var _dataRole2 = _interopRequireDefault(_dataRole);

var _userGroup = __webpack_require__(1065);

var _userGroup2 = _interopRequireDefault(_userGroup);

var _resource = __webpack_require__(1068);

var _resource2 = _interopRequireDefault(_resource);

var _login = __webpack_require__(1095);

var _login2 = _interopRequireDefault(_login);

var _App = __webpack_require__(1098);

var _App2 = _interopRequireDefault(_App);

var _user = __webpack_require__(1113);

var _user2 = _interopRequireDefault(_user);

var _userAdd = __webpack_require__(1116);

var _userAdd2 = _interopRequireDefault(_userAdd);

var _resetPwd = __webpack_require__(1119);

var _resetPwd2 = _interopRequireDefault(_resetPwd);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var routes = [{ path: '/login', component: _login2.default }, {
  path: '/test', component: _App2.default, children: [{ path: '*', component: _2.default }]
}, {
  path: '', component: _App2.default, children: [{ path: '/', component: _user2.default }, { path: '/resetPwd', component: _resetPwd2.default }, { path: '/index', component: _user2.default }, { path: '/sys/menuList', component: _menu2.default }, { path: '/sys/roleList', component: _role2.default }, { path: '/sys/userGroup', component: _userGroup2.default }, { path: '/sys/userList', component: _user2.default }, { path: '/sys/userAdd', component: _userAdd2.default }, { path: '/sys/resource', component: _resource2.default }, { path: '/sys/dataRole', component: _dataRole2.default }]
}, { path: '*', component: _2.default }];

exports.default = routes;

/***/ }),

/***/ 653:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_dashboard_vue__ = __webpack_require__(299);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_dashboard_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_dashboard_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_dashboard_vue__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_dashboard_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_89cac4b6_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_dashboard_vue__ = __webpack_require__(949);
function injectStyle (ssrContext) {
  __webpack_require__(654)
}
var normalizeComponent = __webpack_require__(21)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-89cac4b6"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_dashboard_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_89cac4b6_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_dashboard_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),

/***/ 654:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 949:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{ref:"dashboard",staticClass:"dashboard"},[_c('el-row',[_c('el-col',{attrs:{"span":24}},[_c('div',{attrs:{"id":"gotobedbar"}})])],1)],1)}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),

/***/ 950:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_404_vue__ = __webpack_require__(373);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_404_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_404_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_404_vue__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_404_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_5979899c_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_404_vue__ = __webpack_require__(952);
function injectStyle (ssrContext) {
  __webpack_require__(951)
}
var normalizeComponent = __webpack_require__(21)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_404_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_5979899c_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_404_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),

/***/ 951:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 952:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"error-page"},[_c('div',{staticClass:"errorWarp"},[_vm._m(0),_vm._v(" "),_c('h2',{staticClass:"title"},[_vm._v("PAGE NOT FOUND")]),_vm._v(" "),_c('h3',{staticClass:"desc"},[_vm._v("WE COULDN'T FIND THIS PAGE")]),_vm._v(" "),_c('router-link',{staticClass:"backBtn",attrs:{"to":"/","tag":"span"}},[_vm._v("返回首页")])],1)])}
var staticRenderFns = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"image"},[_c('img',{attrs:{"src":__webpack_require__(953)}})])}]
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),

/***/ 953:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/img/404_error.png";

/***/ }),

/***/ 954:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_menu_vue__ = __webpack_require__(374);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_menu_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_menu_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_menu_vue__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_menu_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_a8f5144a_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_menu_vue__ = __webpack_require__(1058);
function injectStyle (ssrContext) {
  __webpack_require__(955)
  __webpack_require__(956)
}
var normalizeComponent = __webpack_require__(21)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_menu_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_a8f5144a_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_menu_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),

/***/ 955:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 956:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 957:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

},[435]);
//# sourceMappingURL=app.dcbb955b86a8db383e86.js.map