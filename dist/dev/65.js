(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[65],{

/***/ "./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js?!./node_modules/@vue/cli-plugin-babel/node_modules/babel-loader/lib/index.js!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js?!./node_modules/@vue/cli-service/node_modules/vue-loader/lib/index.js?!./src/views/distribute/index.vue?vue&type=script&lang=js&":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/@vue/cli-plugin-babel/node_modules/babel-loader/lib!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader/lib??vue-loader-options!./src/views/distribute/index.vue?vue&type=script&lang=js& ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ \"./node_modules/@babel/runtime/regenerator/index.js\");\n/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ \"./node_modules/@babel/runtime/helpers/asyncToGenerator.js\");\n/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _utils_tools__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/utils/tools */ \"./src/utils/tools.js\");\n/* harmony import */ var _service_work__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/service/work */ \"./src/service/work/index.js\");\n\n\n//\n//\n//\n//\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  name: \"index\",\n  data: function data() {\n    return {\n      num: 0\n    };\n  },\n  mounted: function mounted() {\n    this.init(this.$route.query.id);\n  },\n  methods: {\n    init: function init(id) {\n      var _this = this;\n\n      return _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()(\n      /*#__PURE__*/\n      _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee() {\n        var _ref, code, data;\n\n        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {\n          while (1) {\n            switch (_context.prev = _context.next) {\n              case 0:\n                _this.setStatus(id);\n\n                _context.next = 3;\n                return Object(_service_work__WEBPACK_IMPORTED_MODULE_3__[\"getWorklist\"])(id, function (err) {\n                  _this.$router.go(-1);\n                }).catch(function () {\n                  _this.$router.go(-1);\n                });\n\n              case 3:\n                _ref = _context.sent;\n                code = _ref.code;\n                data = _ref.data;\n\n                if (code === '000000') {\n                  // 审阅的时候走这个逻辑\n                  if (_this.num === 0 && data.objectTypeCode === 'ECM_CONTRACT_CONSULT_FINISH') {\n                    _this.num++;\n\n                    _this.init(data.opinion);\n                  } else if (_utils_tools__WEBPACK_IMPORTED_MODULE_2__[\"projectType\"][data.objectTypeCode].name) {\n                    if (['WAIT_FOR_DEAL', 'SUSPEND', 'WAIT_FOR_READ'].includes(data.taskStauts)) {\n                      _this.$router.replace({\n                        name: _utils_tools__WEBPACK_IMPORTED_MODULE_2__[\"projectType\"][data.objectTypeCode].name,\n                        query: {\n                          type: _utils_tools__WEBPACK_IMPORTED_MODULE_2__[\"projectType\"][data.objectTypeCode].type,\n                          id: data.workflowHistoryId,\n                          taskKey: data.taskKey,\n                          operationType: data.operationType,\n                          sourceType: data.attribute2,\n                          customizeTaskKey: data.attribute1,\n                          objectTypeCode: data.objectTypeCode,\n                          modelTitle: data.attribute3,\n                          taskStauts: data.taskStauts,\n                          draftTypeCode: _utils_tools__WEBPACK_IMPORTED_MODULE_2__[\"objectTypeCode\"][data.objectTypeCode] //变更 废止 续签\n\n                        }\n                      });\n                    } else {\n                      _this.$router.replace({\n                        name: _utils_tools__WEBPACK_IMPORTED_MODULE_2__[\"projectTypes\"][data.objectTypeCode].name,\n                        query: {\n                          type: _utils_tools__WEBPACK_IMPORTED_MODULE_2__[\"projectTypes\"][data.objectTypeCode].type,\n                          id: data.workflowHistoryId,\n                          draftTypeCode: _utils_tools__WEBPACK_IMPORTED_MODULE_2__[\"objectTypeCode\"][data.objectTypeCode],\n                          ispdf: _utils_tools__WEBPACK_IMPORTED_MODULE_2__[\"projectTypes\"][data.objectTypeCode].ispdf\n                        }\n                      });\n                    }\n                  } else {\n                    _this.$router.go(-1);\n                  }\n                } else {\n                  _this.$router.go(-1);\n                }\n\n              case 7:\n              case \"end\":\n                return _context.stop();\n            }\n          }\n        }, _callee);\n      }))();\n    },\n    setStatus: function setStatus(id) {\n      return _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()(\n      /*#__PURE__*/\n      _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee2() {\n        var _ref2, code;\n\n        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee2$(_context2) {\n          while (1) {\n            switch (_context2.prev = _context2.next) {\n              case 0:\n                _context2.next = 2;\n                return Object(_service_work__WEBPACK_IMPORTED_MODULE_3__[\"setStatus\"])(id);\n\n              case 2:\n                _ref2 = _context2.sent;\n                code = _ref2.code;\n\n              case 4:\n              case \"end\":\n                return _context2.stop();\n            }\n          }\n        }, _callee2);\n      }))();\n    }\n  }\n});\n\n//# sourceURL=webpack:///./src/views/distribute/index.vue?./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/@vue/cli-plugin-babel/node_modules/babel-loader/lib!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader/lib??vue-loader-options");

/***/ }),

/***/ "./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js?{\"cacheDirectory\":\"node_modules/.cache/vue-loader\",\"cacheIdentifier\":\"6fbef325-vue-loader-template\"}!./node_modules/@vue/cli-service/node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js?!./node_modules/@vue/cli-service/node_modules/vue-loader/lib/index.js?!./src/views/distribute/index.vue?vue&type=template&id=4097d13e&scoped=true&":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"6fbef325-vue-loader-template"}!./node_modules/@vue/cli-service/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader/lib??vue-loader-options!./src/views/distribute/index.vue?vue&type=template&id=4097d13e&scoped=true& ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return render; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"staticRenderFns\", function() { return staticRenderFns; });\nvar render = function() {\n  var _vm = this\n  var _h = _vm.$createElement\n  var _c = _vm._self._c || _h\n  return _c(\"div\")\n}\nvar staticRenderFns = []\nrender._withStripped = true\n\n\n\n//# sourceURL=webpack:///./src/views/distribute/index.vue?./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js?%7B%22cacheDirectory%22:%22node_modules/.cache/vue-loader%22,%22cacheIdentifier%22:%226fbef325-vue-loader-template%22%7D!./node_modules/@vue/cli-service/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader/lib??vue-loader-options");

/***/ }),

/***/ "./src/views/distribute/index.vue":
/*!****************************************!*\
  !*** ./src/views/distribute/index.vue ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _index_vue_vue_type_template_id_4097d13e_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.vue?vue&type=template&id=4097d13e&scoped=true& */ \"./src/views/distribute/index.vue?vue&type=template&id=4097d13e&scoped=true&\");\n/* harmony import */ var _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index.vue?vue&type=script&lang=js& */ \"./src/views/distribute/index.vue?vue&type=script&lang=js&\");\n/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_cli_service_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../node_modules/@vue/cli-service/node_modules/vue-loader/lib/runtime/componentNormalizer.js */ \"./node_modules/@vue/cli-service/node_modules/vue-loader/lib/runtime/componentNormalizer.js\");\n\n\n\n\n\n/* normalize component */\n\nvar component = Object(_node_modules_vue_cli_service_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"])(\n  _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__[\"default\"],\n  _index_vue_vue_type_template_id_4097d13e_scoped_true___WEBPACK_IMPORTED_MODULE_0__[\"render\"],\n  _index_vue_vue_type_template_id_4097d13e_scoped_true___WEBPACK_IMPORTED_MODULE_0__[\"staticRenderFns\"],\n  false,\n  null,\n  \"4097d13e\",\n  null\n  \n)\n\n/* hot reload */\nif (false) { var api; }\ncomponent.options.__file = \"src/views/distribute/index.vue\"\n/* harmony default export */ __webpack_exports__[\"default\"] = (component.exports);\n\n//# sourceURL=webpack:///./src/views/distribute/index.vue?");

/***/ }),

/***/ "./src/views/distribute/index.vue?vue&type=script&lang=js&":
/*!*****************************************************************!*\
  !*** ./src/views/distribute/index.vue?vue&type=script&lang=js& ***!
  \*****************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_vue_cli_service_node_modules_cache_loader_dist_cjs_js_ref_12_0_node_modules_vue_cli_plugin_babel_node_modules_babel_loader_lib_index_js_node_modules_vue_cli_service_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_cli_service_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--12-0!../../../node_modules/@vue/cli-plugin-babel/node_modules/babel-loader/lib!../../../node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../node_modules/@vue/cli-service/node_modules/vue-loader/lib??vue-loader-options!./index.vue?vue&type=script&lang=js& */ \"./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js?!./node_modules/@vue/cli-plugin-babel/node_modules/babel-loader/lib/index.js!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js?!./node_modules/@vue/cli-service/node_modules/vue-loader/lib/index.js?!./src/views/distribute/index.vue?vue&type=script&lang=js&\");\n/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__[\"default\"] = (_node_modules_vue_cli_service_node_modules_cache_loader_dist_cjs_js_ref_12_0_node_modules_vue_cli_plugin_babel_node_modules_babel_loader_lib_index_js_node_modules_vue_cli_service_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_cli_service_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[\"default\"]); \n\n//# sourceURL=webpack:///./src/views/distribute/index.vue?");

/***/ }),

/***/ "./src/views/distribute/index.vue?vue&type=template&id=4097d13e&scoped=true&":
/*!***********************************************************************************!*\
  !*** ./src/views/distribute/index.vue?vue&type=template&id=4097d13e&scoped=true& ***!
  \***********************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _cache_loader_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_6fbef325_vue_loader_template_node_modules_vue_cli_service_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_cli_service_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_cli_service_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_4097d13e_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!cache-loader?{\"cacheDirectory\":\"node_modules/.cache/vue-loader\",\"cacheIdentifier\":\"6fbef325-vue-loader-template\"}!../../../node_modules/@vue/cli-service/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../node_modules/@vue/cli-service/node_modules/vue-loader/lib??vue-loader-options!./index.vue?vue&type=template&id=4097d13e&scoped=true& */ \"./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js?{\\\"cacheDirectory\\\":\\\"node_modules/.cache/vue-loader\\\",\\\"cacheIdentifier\\\":\\\"6fbef325-vue-loader-template\\\"}!./node_modules/@vue/cli-service/node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js?!./node_modules/@vue/cli-service/node_modules/vue-loader/lib/index.js?!./src/views/distribute/index.vue?vue&type=template&id=4097d13e&scoped=true&\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return _cache_loader_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_6fbef325_vue_loader_template_node_modules_vue_cli_service_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_cli_service_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_cli_service_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_4097d13e_scoped_true___WEBPACK_IMPORTED_MODULE_0__[\"render\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"staticRenderFns\", function() { return _cache_loader_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_6fbef325_vue_loader_template_node_modules_vue_cli_service_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_cli_service_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_cli_service_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_4097d13e_scoped_true___WEBPACK_IMPORTED_MODULE_0__[\"staticRenderFns\"]; });\n\n\n\n//# sourceURL=webpack:///./src/views/distribute/index.vue?");

/***/ })

}]);