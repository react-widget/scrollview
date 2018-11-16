/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/ 		var executeModules = data[2];
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 		// add entry modules from loaded chunk to deferred list
/******/ 		deferredModules.push.apply(deferredModules, executeModules || []);
/******/
/******/ 		// run deferred modules when all chunks ready
/******/ 		return checkDeferredModules();
/******/ 	};
/******/ 	function checkDeferredModules() {
/******/ 		var result;
/******/ 		for(var i = 0; i < deferredModules.length; i++) {
/******/ 			var deferredModule = deferredModules[i];
/******/ 			var fulfilled = true;
/******/ 			for(var j = 1; j < deferredModule.length; j++) {
/******/ 				var depId = deferredModule[j];
/******/ 				if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 			}
/******/ 			if(fulfilled) {
/******/ 				deferredModules.splice(i--, 1);
/******/ 				result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 			}
/******/ 		}
/******/ 		return result;
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		"index": 0
/******/ 	};
/******/
/******/ 	var deferredModules = [];
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// add entry module to deferred list
/******/ 	deferredModules.push([0,"vendors"]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ "./examples/Demo.js":
/*!**************************!*\
  !*** ./examples/Demo.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireWildcard = __webpack_require__(/*! @babel/runtime-corejs2/helpers/interopRequireWildcard */ "./node_modules/@babel/runtime-corejs2/helpers/interopRequireWildcard.js");

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime-corejs2/helpers/interopRequireDefault */ "./node_modules/@babel/runtime-corejs2/helpers/interopRequireDefault.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime-corejs2/helpers/classCallCheck */ "./node_modules/@babel/runtime-corejs2/helpers/classCallCheck.js"));

var _createClass2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime-corejs2/helpers/createClass */ "./node_modules/@babel/runtime-corejs2/helpers/createClass.js"));

var _possibleConstructorReturn2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime-corejs2/helpers/possibleConstructorReturn */ "./node_modules/@babel/runtime-corejs2/helpers/possibleConstructorReturn.js"));

var _getPrototypeOf3 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime-corejs2/helpers/getPrototypeOf */ "./node_modules/@babel/runtime-corejs2/helpers/getPrototypeOf.js"));

var _inherits2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime-corejs2/helpers/inherits */ "./node_modules/@babel/runtime-corejs2/helpers/inherits.js"));

var _assertThisInitialized2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime-corejs2/helpers/assertThisInitialized */ "./node_modules/@babel/runtime-corejs2/helpers/assertThisInitialized.js"));

var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime-corejs2/helpers/defineProperty */ "./node_modules/@babel/runtime-corejs2/helpers/defineProperty.js"));

var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "./node_modules/react/index.js"));

var _DemoList = _interopRequireDefault(__webpack_require__(/*! ./DemoList */ "./examples/DemoList.js"));

var Demo =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2.default)(Demo, _Component);

  function Demo() {
    var _getPrototypeOf2;

    var _this;

    (0, _classCallCheck2.default)(this, Demo);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = (0, _possibleConstructorReturn2.default)(this, (_getPrototypeOf2 = (0, _getPrototypeOf3.default)(Demo)).call.apply(_getPrototypeOf2, [this].concat(args)));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "state", {
      current: _DemoList.default[0]
    });
    return _this;
  }

  (0, _createClass2.default)(Demo, [{
    key: "onDemoChange",
    value: function onDemoChange(item, e) {
      this.setState({
        current: item
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var current = this.state.current;
      return _react.default.createElement("div", {
        className: "container"
      }, _react.default.createElement("div", {
        className: "slider"
      }, _DemoList.default.map(function (item, i) {
        return _react.default.createElement("div", {
          className: current === item ? 'active' : '',
          onClick: _this2.onDemoChange.bind(_this2, item)
        }, item.label);
      })), _react.default.createElement("div", {
        className: "content"
      }, current ? _react.default.createElement(current.component, null) : null));
    }
  }]);
  return Demo;
}(_react.Component);

exports.default = Demo;

/***/ }),

/***/ "./examples/DemoList.js":
/*!******************************!*\
  !*** ./examples/DemoList.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime-corejs2/helpers/interopRequireDefault */ "./node_modules/@babel/runtime-corejs2/helpers/interopRequireDefault.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _demo = _interopRequireDefault(__webpack_require__(/*! ./demos/demo1 */ "./examples/demos/demo1.js"));

// import Demo2 from './demos/Demo2';
// import Demo3 from './demos/Demo3';
// import Demo4 from './demos/Demo4';
var _default = [{
  label: '基本功能',
  component: _demo.default
}];
exports.default = _default;

/***/ }),

/***/ "./examples/demos/demo1.js":
/*!*********************************!*\
  !*** ./examples/demos/demo1.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireWildcard = __webpack_require__(/*! @babel/runtime-corejs2/helpers/interopRequireWildcard */ "./node_modules/@babel/runtime-corejs2/helpers/interopRequireWildcard.js");

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime-corejs2/helpers/interopRequireDefault */ "./node_modules/@babel/runtime-corejs2/helpers/interopRequireDefault.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime-corejs2/helpers/classCallCheck */ "./node_modules/@babel/runtime-corejs2/helpers/classCallCheck.js"));

var _createClass2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime-corejs2/helpers/createClass */ "./node_modules/@babel/runtime-corejs2/helpers/createClass.js"));

var _possibleConstructorReturn2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime-corejs2/helpers/possibleConstructorReturn */ "./node_modules/@babel/runtime-corejs2/helpers/possibleConstructorReturn.js"));

var _getPrototypeOf2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime-corejs2/helpers/getPrototypeOf */ "./node_modules/@babel/runtime-corejs2/helpers/getPrototypeOf.js"));

var _inherits2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime-corejs2/helpers/inherits */ "./node_modules/@babel/runtime-corejs2/helpers/inherits.js"));

var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "./node_modules/react/index.js"));

var _lib = _interopRequireDefault(__webpack_require__(/*! ../../lib */ "./lib/index.js"));

var DEMO =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2.default)(DEMO, _Component);

  function DEMO() {
    (0, _classCallCheck2.default)(this, DEMO);
    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(DEMO).apply(this, arguments));
  }

  (0, _createClass2.default)(DEMO, [{
    key: "componentDidMount",
    value: function componentDidMount() {}
  }, {
    key: "render",
    value: function render() {
      return _react.default.createElement("div", null, _react.default.createElement(_lib.default, {
        style: {
          width: 260,
          height: 300
        }
      }, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(function (item) {
        return _react.default.createElement("div", {
          className: "s-item",
          key: item
        }, item);
      })));
    }
  }]);
  return DEMO;
}(_react.Component);

exports.default = DEMO;

/***/ }),

/***/ "./examples/index.js":
/*!***************************!*\
  !*** ./examples/index.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime-corejs2/helpers/interopRequireDefault */ "./node_modules/@babel/runtime-corejs2/helpers/interopRequireDefault.js");

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "./node_modules/react/index.js"));

var _reactDom = _interopRequireDefault(__webpack_require__(/*! react-dom */ "./node_modules/react-dom/index.js"));

__webpack_require__(/*! ./style/index.scss */ "./examples/style/index.scss");

__webpack_require__(/*! ./style/animate.scss */ "./examples/style/animate.scss");

__webpack_require__(/*! ../lib/style/index.css */ "./lib/style/index.css");

var _Demo = _interopRequireDefault(__webpack_require__(/*! ./Demo */ "./examples/Demo.js"));

_reactDom.default.render(_react.default.createElement(_Demo.default, null), demo);

/***/ }),

/***/ "./examples/style/animate.scss":
/*!*************************************!*\
  !*** ./examples/style/animate.scss ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./examples/style/index.scss":
/*!***********************************!*\
  !*** ./examples/style/index.scss ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./lib/ScrollViewBody.js":
/*!*******************************!*\
  !*** ./lib/ScrollViewBody.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime-corejs2/helpers/interopRequireDefault */ "./node_modules/@babel/runtime-corejs2/helpers/interopRequireDefault.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _objectWithoutProperties2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime-corejs2/helpers/objectWithoutProperties */ "./node_modules/@babel/runtime-corejs2/helpers/objectWithoutProperties.js"));

var _classCallCheck2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime-corejs2/helpers/classCallCheck */ "./node_modules/@babel/runtime-corejs2/helpers/classCallCheck.js"));

var _createClass2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime-corejs2/helpers/createClass */ "./node_modules/@babel/runtime-corejs2/helpers/createClass.js"));

var _possibleConstructorReturn2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime-corejs2/helpers/possibleConstructorReturn */ "./node_modules/@babel/runtime-corejs2/helpers/possibleConstructorReturn.js"));

var _getPrototypeOf2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime-corejs2/helpers/getPrototypeOf */ "./node_modules/@babel/runtime-corejs2/helpers/getPrototypeOf.js"));

var _inherits2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime-corejs2/helpers/inherits */ "./node_modules/@babel/runtime-corejs2/helpers/inherits.js"));

var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime-corejs2/helpers/defineProperty */ "./node_modules/@babel/runtime-corejs2/helpers/defineProperty.js"));

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "./node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));

var ScrollViewBody =
/*#__PURE__*/
function (_React$Component) {
  (0, _inherits2.default)(ScrollViewBody, _React$Component);

  function ScrollViewBody() {
    (0, _classCallCheck2.default)(this, ScrollViewBody);
    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(ScrollViewBody).apply(this, arguments));
  }

  (0, _createClass2.default)(ScrollViewBody, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(_ref) {
      var _shouldComponentUpdate = _ref.shouldComponentUpdate;
      return _shouldComponentUpdate;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          shouldComponentUpdate = _this$props.shouldComponentUpdate,
          component = _this$props.component,
          others = (0, _objectWithoutProperties2.default)(_this$props, ["shouldComponentUpdate", "component"]);
      var Node = component;
      return _react.default.createElement(Node, others);
    }
  }]);
  return ScrollViewBody;
}(_react.default.Component);

exports.default = ScrollViewBody;
(0, _defineProperty2.default)(ScrollViewBody, "propTypes", {
  className: _propTypes.default.string,
  shouldComponentUpdate: _propTypes.default.bool,
  component: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.func])
});
(0, _defineProperty2.default)(ScrollViewBody, "defaultProps", {
  className: '',
  shouldComponentUpdate: true,
  component: 'div'
});

/***/ }),

/***/ "./lib/index.js":
/*!**********************!*\
  !*** ./lib/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime-corejs2/helpers/interopRequireDefault */ "./node_modules/@babel/runtime-corejs2/helpers/interopRequireDefault.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _extends2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime-corejs2/helpers/extends */ "./node_modules/@babel/runtime-corejs2/helpers/extends.js"));

var _keys = _interopRequireDefault(__webpack_require__(/*! @babel/runtime-corejs2/core-js/object/keys */ "./node_modules/@babel/runtime-corejs2/core-js/object/keys.js"));

var _objectWithoutProperties2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime-corejs2/helpers/objectWithoutProperties */ "./node_modules/@babel/runtime-corejs2/helpers/objectWithoutProperties.js"));

var _parseInt2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime-corejs2/core-js/parse-int */ "./node_modules/@babel/runtime-corejs2/core-js/parse-int.js"));

var _classCallCheck2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime-corejs2/helpers/classCallCheck */ "./node_modules/@babel/runtime-corejs2/helpers/classCallCheck.js"));

var _possibleConstructorReturn2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime-corejs2/helpers/possibleConstructorReturn */ "./node_modules/@babel/runtime-corejs2/helpers/possibleConstructorReturn.js"));

var _getPrototypeOf2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime-corejs2/helpers/getPrototypeOf */ "./node_modules/@babel/runtime-corejs2/helpers/getPrototypeOf.js"));

var _createClass2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime-corejs2/helpers/createClass */ "./node_modules/@babel/runtime-corejs2/helpers/createClass.js"));

var _inherits2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime-corejs2/helpers/inherits */ "./node_modules/@babel/runtime-corejs2/helpers/inherits.js"));

var _assertThisInitialized2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime-corejs2/helpers/assertThisInitialized */ "./node_modules/@babel/runtime-corejs2/helpers/assertThisInitialized.js"));

var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime-corejs2/helpers/defineProperty */ "./node_modules/@babel/runtime-corejs2/helpers/defineProperty.js"));

var _dom = __webpack_require__(/*! ./util/dom */ "./lib/util/dom.js");

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "./node_modules/react/index.js"));

var _reactDom = __webpack_require__(/*! react-dom */ "./node_modules/react-dom/index.js");

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));

var _classnames = _interopRequireDefault(__webpack_require__(/*! classnames */ "./node_modules/classnames/index.js"));

var _object = _interopRequireDefault(__webpack_require__(/*! object.omit */ "./node_modules/object.omit/index.js"));

var _ScrollViewBody = _interopRequireDefault(__webpack_require__(/*! ./ScrollViewBody */ "./lib/ScrollViewBody.js"));

var ScrollView =
/*#__PURE__*/
function (_React$Component) {
  (0, _inherits2.default)(ScrollView, _React$Component);
  (0, _createClass2.default)(ScrollView, null, [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps() {
      return {
        shouldComponentUpdate: true
      };
    }
  }]);

  function ScrollView(props) {
    var _this;

    (0, _classCallCheck2.default)(this, ScrollView);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(ScrollView).call(this, props));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "_updating", false);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "handleWheel", function () {
      var defNoop = function defNoop(e) {
        e.preventDefault();
      };

      var noop = function noop() {}; //滚动到底部时下一次滚动不需要禁用默认行为
      //dir 1 向下 -1 向上


      var nextEnd = defNoop;
      var lastDir = 1;
      return function (e) {
        var deltaY = e.deltaY;
        var _this$props = _this.props,
            wheelStep = _this$props.wheelStep,
            wheelDir = _this$props.wheelDir,
            enablePreventDefaultOnEnd = _this$props.enablePreventDefaultOnEnd;
        var curDir = deltaY > 0 ? 1 : -1;
        var state = _this.state;

        if (lastDir != curDir) {
          lastDir = curDir;
          nextEnd = defNoop;
        }

        if (!state.hasScrollY && wheelDir === 'y') {
          return;
        } else if (!state.hasScrollX && wheelDir === 'x') {
          return;
        }

        _this.scrollTo(wheelDir, deltaY > 0 ? _this.getScrollPos(wheelDir) + wheelStep : _this.getScrollPos(wheelDir) - wheelStep);

        if (enablePreventDefaultOnEnd
        /* && wheelDir !== 'x' */
        ) {
            var isEnd = deltaY > 0 ? _this.isScrollEnd(wheelDir) : _this.getScrollPos(wheelDir) <= 0;

            if (!isEnd) {
              e.preventDefault();
              nextEnd = defNoop;
            } else {
              nextEnd(e);
              nextEnd = noop;
            }
          } else {
          e.preventDefault();
        }
      };
    }());
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "handleScroll", function (e) {
      var _this$props2 = _this.props,
          onScroll = _this$props2.onScroll,
          onHScrollEnd = _this$props2.onHScrollEnd,
          onHScrollStart = _this$props2.onHScrollStart,
          onVScrollEnd = _this$props2.onVScrollEnd,
          onVScrollStart = _this$props2.onVScrollStart;
      var state = _this.state;
      var target = e.target;
      var lastScrollTop = state.scrollTop,
          lastScrollLeft = state.scrollLeft;
      state.scrollTop = target.scrollTop;
      state.scrollLeft = target.scrollLeft;

      _this.updateScrollBarPosition();

      if (onScroll) {
        onScroll.call((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), state.scrollLeft, state.scrollTop, e);
      }

      if (lastScrollTop !== state.scrollTop) {
        if (onVScrollEnd && _this.isScrollEnd('y')) {
          onVScrollEnd.call((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), e);
        }

        if (onVScrollStart && state.scrollTop === 0) {
          onVScrollStart.call((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), e);
        }
      }

      if (lastScrollLeft !== state.scrollLeft) {
        if (onHScrollEnd && _this.isScrollEnd('x')) {
          onHScrollEnd.call((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), e);
        }

        if (onHScrollStart && state.scrollLeft === 0) {
          onHScrollStart.call((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), e);
        }
      }
    });
    _this._refs = {};
    _this.state = {
      shouldComponentUpdate: true,
      hasScrollX: false,
      hasScrollY: false,
      thumbXSize: null,
      thumbYSize: null,
      // isUpdating: false,
      scrollXRatio: null,
      scrollYRatio: null,
      scrollTop: 0,
      scrollLeft: 0 // origScrollViewPaddingRight: null,
      // origScrollViewPaddingBottom: null,
      // lastScrollViewPaddingRight: null,
      // lastScrollViewPaddingBottom: null,

    };
    return _this;
  }

  (0, _createClass2.default)(ScrollView, [{
    key: "getChildContext",
    value: function getChildContext() {
      return {
        ScrollView: this
      };
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.updateScrollBarLayoutAndPosition();
    } // componentWillReceiveProps() {
    //     const state = this.state;
    //     // state.origScrollViewPaddingRight = null;
    //     // state.lastScrollViewPaddingRight = null;
    //     // state.origScrollViewPaddingBottom = null;
    //     // state.lastScrollViewPaddingBottom = null;
    //     this.setState({
    //         shouldComponentUpdate: true,
    //     });
    // }

  }, {
    key: "startUpdating",
    value: function startUpdating() {
      this._updating = true;
    }
  }, {
    key: "stopUpdating",
    value: function stopUpdating() {
      this._updating = false;
    }
  }, {
    key: "isUpdating",
    value: function isUpdating() {
      return this._updating;
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      if (!this.isUpdating()) this.updateScrollBarLayoutAndPosition();
    }
  }, {
    key: "saveRef",
    value: function saveRef(name, node) {
      this._refs[name] = node;
    }
  }, {
    key: "getRef",
    value: function getRef(name) {
      return this._refs[name];
    }
  }, {
    key: "handleTrackMouseDown",
    value: function handleTrackMouseDown(e) {
      var dir = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'y';

      if (e.button !== 0) {
        return;
      }

      var target = e.target;
      var _this$state = this.state,
          scrollXRatio = _this$state.scrollXRatio,
          scrollYRatio = _this$state.scrollYRatio;
      var _this$_refs = this._refs,
          verticalBarThumbEl = _this$_refs.verticalBarThumbEl,
          horizontalBarThumbEl = _this$_refs.horizontalBarThumbEl;
      var rect = target.getBoundingClientRect();
      var isVertical = dir === 'y';
      var proto = isVertical ? 'scrollTop' : 'scrollLeft';
      var trackPos = rect[isVertical ? 'top' : 'left'] + (document.documentElement && document.documentElement[proto] ? document.documentElement[proto] : document.body[proto]);
      var thumbEl = isVertical ? verticalBarThumbEl : horizontalBarThumbEl;
      var clickPagePos = e[isVertical ? 'pageY' : 'pageX'];
      var clickPos = clickPagePos - trackPos;
      var thumbPos = (0, _parseInt2.default)((0, _dom.getStyle)(thumbEl, isVertical ? 'top' : 'left'), 10);
      var thumbSize = thumbEl[isVertical ? 'offsetHeight' : 'offsetWidth'];
      var ratio = isVertical ? scrollYRatio : scrollXRatio;

      if (clickPos < thumbPos) {
        this.scrollTo(dir, (clickPagePos - trackPos) * ratio);
      } else {
        this.scrollTo(dir, (thumbPos + clickPagePos - (thumbPos + thumbSize + trackPos)) * ratio);
      }
    }
  }, {
    key: "handleThumbMouseDown",
    value: function handleThumbMouseDown(e) {
      var _this2 = this;

      var dir = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'y';
      var doc = document;
      var state = this.state;
      var startY = e.pageY;
      var startX = e.pageX;
      var start = this.getScrollPos(dir);
      var ratio = state[dir === 'y' ? 'scrollYRatio' : 'scrollXRatio'];
      var moveOff, upOff, cursor;
      cursor = doc.body.style.cursor;
      doc.body.style.cursor = 'default';
      var enableSelection = (0, _dom.disableSelection)(doc.body);
      upOff = (0, _dom.on)(doc, 'mouseup', function (e) {
        enableSelection();
        upOff();
        moveOff();
        doc.body.style.cursor = cursor;
      });
      moveOff = (0, _dom.on)(doc, 'mousemove', function (e) {
        var moveDist = dir === 'y' ? e.pageY - startY : e.pageX - startX;
        var sPos = start + moveDist * ratio;

        _this2.scrollTo(dir, sPos);
      });
    }
  }, {
    key: "scrollTo",
    value: function scrollTo() {
      var dir = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'y';
      var pos = arguments.length > 1 ? arguments[1] : undefined;
      var scrollview = this.getScrollViewBody();
      var proto = dir === 'y' ? 'scrollTop' : 'scrollLeft';

      if (this.state[proto] === pos) {
        return;
      }

      scrollview[proto] = pos;
    }
  }, {
    key: "scrollX",
    value: function scrollX(sLeft) {
      this.scrollTo('x', sLeft);
    }
  }, {
    key: "scrollY",
    value: function scrollY(sTop) {
      this.scrollTo('y', sTop);
    }
  }, {
    key: "scrollEnd",
    value: function scrollEnd() {
      var dir = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'y';
      var scrollview = this.getScrollViewBody();
      var proto = dir === 'y' ? 'Height' : 'Width';
      var c = scrollview["client".concat(proto)];
      var s = scrollview["scroll".concat(proto)];

      if (s <= c) {
        return;
      }

      this.scrollTo(dir, s - c);
    }
  }, {
    key: "scrollIntoView",
    value: function scrollIntoView(el) {
      var scrollview = this.getScrollViewBody();
      if (!(0, _dom.contains)(scrollview, el) || !(0, _dom.isVisible)(el)) return;
      var pOffset = (0, _dom.getOffset)(scrollview);
      var tOffset = (0, _dom.getOffset)(el);
      var pTop = pOffset.top,
          pLeft = pOffset.left,
          pBottom = pOffset.top + scrollview.offsetHeight,
          pRight = pOffset.left + scrollview.offsetWidth,
          tTop = tOffset.top,
          tLeft = tOffset.left,
          tBottom = tOffset.top + el.offsetHeight,
          tRight = tOffset.left + el.offsetWidth;
      var sTop = scrollview.scrollTop,
          sLeft = scrollview.scrollLeft;

      if (pTop > tTop) {
        scrollview.scrollTop = sTop - (pTop - tTop);
      } else if (pBottom < tTop + el.offsetHeight) {
        scrollview.scrollTop = sTop + tTop - pBottom + Math.min(el.offsetHeight, scrollview.clientHeight);
      }

      if (pLeft > tLeft) {
        scrollview.scrollLeft = sLeft - (pLeft - tLeft);
      } else if (pRight < tLeft + el.offsetWidth) {
        scrollview.scrollLeft = sLeft + tLeft - pRight + Math.min(el.offsetWidth, scrollview.clientWidth);
      }
    }
  }, {
    key: "setThumbPos",
    value: function setThumbPos() {
      this.setThumbYPos();
      this.setThumbXPos();
    }
  }, {
    key: "setThumbYPos",
    value: function setThumbYPos() {
      var _this$state2 = this.state,
          hasScrollY = _this$state2.hasScrollY,
          scrollYRatio = _this$state2.scrollYRatio,
          scrollTop = _this$state2.scrollTop,
          thumbYSize = _this$state2.thumbYSize;
      if (!hasScrollY) return;
      var verticalBarWrapEl = this._refs.verticalBarWrapEl;
      var minTop = 0;
      var maxTop = verticalBarWrapEl.clientHeight - thumbYSize;
      this._refs.verticalBarThumbEl.style.top = Math.min(Math.max(scrollTop / scrollYRatio, minTop), maxTop) + 'px';
    }
  }, {
    key: "setThumbXPos",
    value: function setThumbXPos() {
      var _this$state3 = this.state,
          hasScrollX = _this$state3.hasScrollX,
          scrollXRatio = _this$state3.scrollXRatio,
          scrollLeft = _this$state3.scrollLeft,
          thumbXSize = _this$state3.thumbXSize;
      if (!hasScrollX) return;
      var horizontalBarWrapEl = this._refs.horizontalBarWrapEl;
      var minLeft = 0;
      var maxLeft = horizontalBarWrapEl.clientWidth - thumbXSize;
      this._refs.horizontalBarThumbEl.style.left = Math.min(Math.max(scrollLeft / scrollXRatio, minLeft), maxLeft) + 'px';
    }
  }, {
    key: "getScrollViewBody",
    value: function getScrollViewBody() {
      return (0, _reactDom.findDOMNode)(this._refs.scrollviewBody);
    }
  }, {
    key: "getThumbSize",
    value: function getThumbSize() {
      var dir = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'y';
      var _this$props3 = this.props,
          thumbSize = _this$props3.thumbSize,
          thumbMinSize = _this$props3.thumbMinSize,
          thumbMaxSize = _this$props3.thumbMaxSize;
      var _this$_refs2 = this._refs,
          verticalBarWrapEl = _this$_refs2.verticalBarWrapEl,
          horizontalBarWrapEl = _this$_refs2.horizontalBarWrapEl;
      var scrollview = this.getScrollViewBody();
      var isVertical = dir === 'y';
      var client = isVertical ? scrollview.clientHeight : scrollview.clientWidth,
          scroll = isVertical ? scrollview.scrollHeight : scrollview.scrollWidth,
          trackSize = isVertical ? verticalBarWrapEl.clientHeight : horizontalBarWrapEl.clientWidth;
      return thumbSize && thumbSize > 0 ? thumbSize : Math.min(Math.max(thumbMinSize, client / scroll * trackSize), thumbMaxSize);
    } //判断是否创建滚动条

  }, {
    key: "hasVerticalScrollBar",
    value: function hasVerticalScrollBar() {
      var _this$props4 = this.props,
          overflow = _this$props4.overflow,
          overflowY = _this$props4.overflowY;
      var scrollview = this.getScrollViewBody();

      if (!overflowY && (overflow === 'hidden' || overflow === 'visible')) {
        return false;
      } else if (overflow === 'scroll') {
        return true;
      }

      if (overflowY === 'hidden' || overflowY === 'visible') {
        return false;
      } else if (overflow === 'scroll') {
        return true;
      }

      return scrollview.scrollHeight - scrollview.clientHeight > 1;
    } //判断是否创建滚动条

  }, {
    key: "hasHorizontalScrollBar",
    value: function hasHorizontalScrollBar() {
      var _this$props5 = this.props,
          overflow = _this$props5.overflow,
          overflowX = _this$props5.overflowX;
      var scrollview = this.getScrollViewBody();

      if (!overflowX && (overflow === 'hidden' || overflow === 'visible')) {
        return false;
      } else if (overflow === 'scroll') {
        return true;
      }

      if (overflowX === 'hidden' || overflowX === 'visible') {
        return false;
      } else if (overflow === 'scroll') {
        return true;
      }

      return scrollview.scrollWidth - scrollview.clientWidth > 1;
    }
  }, {
    key: "isScrollEnd",
    value: function isScrollEnd() {
      var dir = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'y';
      var scrollview = this.getScrollViewBody();
      return dir === 'y' ? scrollview.scrollTop >= scrollview.scrollHeight - scrollview.clientHeight : scrollview.scrollLeft >= scrollview.scrollWidth - scrollview.clientWidth;
    }
  }, {
    key: "getScrollPos",
    value: function getScrollPos() {
      var dir = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'y';
      var scrollview = this.getScrollViewBody();
      return scrollview[dir === 'y' ? 'scrollTop' : 'scrollLeft'];
    }
  }, {
    key: "hasScroll",
    value: function hasScroll() {
      var dir = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'y';
      return dir === 'y' ? this.hasVerticalScrollBar() : this.hasHorizontalScrollBar();
    }
  }, {
    key: "refreshScrollBar",
    value: function refreshScrollBar() {
      this.updateScrollBarLayoutAndPosition();
    }
  }, {
    key: "updateScrollBarLayoutAndPosition",
    value: function updateScrollBarLayoutAndPosition() {
      var _this3 = this;

      var hasScrollX = this.hasScroll('x'),
          hasScrollY = this.hasScroll('y');
      this.startUpdating();
      this.setState({
        shouldComponentUpdate: false,
        hasScrollX: hasScrollX,
        hasScrollY: hasScrollY
      }, function () {
        _this3.updateScrollBarLayout();

        _this3.updateScrollBarPosition();

        _this3.stopUpdating();
      });
    }
  }, {
    key: "updateScrollBarLayout",
    value: function updateScrollBarLayout() {
      var _this$props6 = this.props,
          scrollBarSize = _this$props6.scrollBarSize,
          scrollBarOffsetTopOrLeft = _this$props6.scrollBarOffsetTopOrLeft,
          scrollBarOffsetRightOrBottom = _this$props6.scrollBarOffsetRightOrBottom;
      var _this$_refs3 = this._refs,
          verticalBarEl = _this$_refs3.verticalBarEl,
          horizontalBarEl = _this$_refs3.horizontalBarEl,
          verticalBarWrapEl = _this$_refs3.verticalBarWrapEl,
          horizontalBarWrapEl = _this$_refs3.horizontalBarWrapEl,
          verticalBarThumbEl = _this$_refs3.verticalBarThumbEl,
          horizontalBarThumbEl = _this$_refs3.horizontalBarThumbEl;
      var container = this._refs.scrollview;
      var scrollview = this.getScrollViewBody();
      var state = this.state;
      var hasScrollX = state.hasScrollX,
          hasScrollY = state.hasScrollY; // if (hasScrollX || hasScrollY) {

      if (hasScrollY) {
        verticalBarEl.style.top = scrollBarOffsetTopOrLeft + 'px';
        verticalBarEl.style.right = scrollBarOffsetRightOrBottom + 'px';
        verticalBarEl.style.bottom = scrollBarOffsetTopOrLeft + (hasScrollX ? scrollBarSize + scrollBarOffsetRightOrBottom : 0) + 'px';
      }

      if (hasScrollX) {
        horizontalBarEl.style.left = scrollBarOffsetTopOrLeft + 'px';
        horizontalBarEl.style.bottom = scrollBarOffsetRightOrBottom + 'px';
        horizontalBarEl.style.right = scrollBarOffsetTopOrLeft + (hasScrollY ? scrollBarSize + scrollBarOffsetRightOrBottom : 0) + 'px';
      } //}


      if (hasScrollY) {
        var thumbSize = this.getThumbSize('y');
        state.thumbYSize = thumbSize;
        verticalBarThumbEl.style.height = thumbSize + 'px';
        state.scrollYRatio = (scrollview.scrollHeight - scrollview.clientHeight) / (verticalBarWrapEl.clientHeight - thumbSize);
      }

      if (hasScrollX) {
        var _thumbSize = this.getThumbSize('x');

        state.thumbXSize = _thumbSize;
        horizontalBarThumbEl.style.width = _thumbSize + 'px';
        state.scrollXRatio = (scrollview.scrollWidth - scrollview.clientWidth) / (horizontalBarWrapEl.clientWidth - _thumbSize);
      }
    }
  }, {
    key: "updateScrollBarPosition",
    value: function updateScrollBarPosition() {
      this.setThumbPos();
    }
  }, {
    key: "getScrollBar",
    value: function getScrollBar() {
      var _classNames,
          _this4 = this,
          _classNames2;

      var dir = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'y';
      var _this$props7 = this.props,
          prefixCls = _this$props7.prefixCls,
          showTrack = _this$props7.showTrack,
          thumbCls = _this$props7.thumbCls,
          scrollBarSize = _this$props7.scrollBarSize,
          trackCls = _this$props7.trackCls;
      var isVertical = dir === 'y';
      var dirCls = "".concat(prefixCls, "-bar-").concat(isVertical ? 'vertical' : 'horizontal');
      var scrollbarRef = isVertical ? 'verticalBarEl' : 'horizontalBarEl',
          scrollbarWrapRef = isVertical ? 'verticalBarWrapEl' : 'horizontalBarWrapEl',
          scrollbarTrackRef = isVertical ? 'verticalBarTrackEl' : 'horizontalBarTrackEl',
          scrollbarThumbRef = isVertical ? 'verticalBarThumbEl' : 'horizontalBarThumbEl';
      var barStyle = (0, _defineProperty2.default)({}, isVertical ? 'width' : 'height', scrollBarSize + 'px');
      return _react.default.createElement("div", {
        ref: this.saveRef.bind(this, scrollbarRef),
        style: barStyle,
        className: (0, _classnames.default)("".concat(prefixCls, "-bar"), dirCls)
      }, _react.default.createElement("div", {
        ref: this.saveRef.bind(this, scrollbarWrapRef),
        className: "".concat(prefixCls, "-bar-wrap")
      }, showTrack ? _react.default.createElement("div", {
        ref: this.saveRef.bind(this, scrollbarTrackRef),
        className: (0, _classnames.default)((_classNames = {}, (0, _defineProperty2.default)(_classNames, "".concat(prefixCls, "-bar-track"), true), (0, _defineProperty2.default)(_classNames, trackCls, trackCls), _classNames)),
        onMouseDown: function onMouseDown(e) {
          return _this4.handleTrackMouseDown(e, dir);
        }
      }) : null, _react.default.createElement("div", {
        ref: this.saveRef.bind(this, scrollbarThumbRef),
        className: (0, _classnames.default)((_classNames2 = {}, (0, _defineProperty2.default)(_classNames2, "".concat(prefixCls, "-bar-thumb"), true), (0, _defineProperty2.default)(_classNames2, thumbCls, thumbCls), _classNames2)),
        onMouseDown: function onMouseDown(e) {
          return _this4.handleThumbMouseDown(e, dir);
        }
      })));
    }
  }, {
    key: "render",
    value: function render() {
      var _classNames3, _classNames4;

      var _this$props8 = this.props,
          prefixCls = _this$props8.prefixCls,
          className = _this$props8.className,
          scrollViewBodyCls = _this$props8.scrollViewBodyCls,
          _this$props8$style = _this$props8.style,
          style = _this$props8$style === void 0 ? {} : _this$props8$style,
          _this$props8$componen = _this$props8.component,
          component = _this$props8$componen === void 0 ? 'div' : _this$props8$componen,
          _this$props8$scrollVi = _this$props8.scrollViewBodyStyle,
          scrollViewBodyStyle = _this$props8$scrollVi === void 0 ? {} : _this$props8$scrollVi,
          children = _this$props8.children,
          others = (0, _objectWithoutProperties2.default)(_this$props8, ["prefixCls", "className", "scrollViewBodyCls", "style", "component", "scrollViewBodyStyle", "children"]);
      var _this$state4 = this.state,
          shouldComponentUpdate = _this$state4.shouldComponentUpdate,
          hasScrollX = _this$state4.hasScrollX,
          hasScrollY = _this$state4.hasScrollY;
      var classes = (0, _classnames.default)((_classNames3 = {}, (0, _defineProperty2.default)(_classNames3, "".concat(prefixCls), true), (0, _defineProperty2.default)(_classNames3, "".concat(className), className), _classNames3));
      var bodyClasses = (0, _classnames.default)((_classNames4 = {}, (0, _defineProperty2.default)(_classNames4, "".concat(prefixCls, "-body"), true), (0, _defineProperty2.default)(_classNames4, "".concat(scrollViewBodyCls), scrollViewBodyCls), _classNames4));
      var otherProps = (0, _object.default)(others, (0, _keys.default)(ScrollView.defaultProps));
      return _react.default.createElement("div", (0, _extends2.default)({}, otherProps, {
        ref: this.saveRef.bind(this, "scrollview"),
        className: classes,
        style: style,
        onWheel: this.handleWheel
      }), _react.default.createElement(_ScrollViewBody.default, {
        ref: this.saveRef.bind(this, "scrollviewBody"),
        className: bodyClasses,
        style: scrollViewBodyStyle,
        component: component,
        onScroll: this.handleScroll,
        shouldComponentUpdate: shouldComponentUpdate
      }, children), hasScrollX ? this.getScrollBar('x') : null, hasScrollY ? this.getScrollBar('y') : null);
    }
  }]);
  return ScrollView;
}(_react.default.Component);

exports.default = ScrollView;
(0, _defineProperty2.default)(ScrollView, "propTypes", {
  prefixCls: _propTypes.default.string,
  className: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.object]),
  scrollViewBodyCls: _propTypes.default.string,
  scrollViewBodyStyle: _propTypes.default.object,
  overflow: _propTypes.default.oneOfType(['hidden', 'auto', 'scroll', 'visible']),
  overflowX: _propTypes.default.oneOfType(['hidden', 'auto', 'scroll', 'visible']),
  overflowY: _propTypes.default.oneOfType(['hidden', 'auto', 'scroll', 'visible']),
  wheelDir: _propTypes.default.oneOfType(['x', 'y']),
  thumbCls: _propTypes.default.string,
  trackCls: _propTypes.default.string,
  scrollBarSize: _propTypes.default.number,
  thumbSize: _propTypes.default.number,
  thumbMinSize: _propTypes.default.number,
  thumbMaxSize: _propTypes.default.number,
  showTrack: _propTypes.default.bool,
  scrollBarOffsetTopOrLeft: _propTypes.default.number,
  scrollBarOffsetRightOrBottom: _propTypes.default.number,
  wheelStep: _propTypes.default.number,
  enablePreventDefaultOnEnd: _propTypes.default.bool,
  onScroll: _propTypes.default.func,
  onHScrollEnd: _propTypes.default.func,
  onVScrollEnd: _propTypes.default.func,
  onHScrollStart: _propTypes.default.func,
  onVScrollStart: _propTypes.default.func
});
(0, _defineProperty2.default)(ScrollView, "defaultProps", {
  prefixCls: 'rw-scrollview',
  className: '',
  scrollViewBodyCls: '',
  overflow: 'auto',
  overflowX: 'auto',
  overflowY: 'auto',
  scrollBarSize: 7,
  scrollBarOffsetTopOrLeft: 2,
  scrollBarOffsetRightOrBottom: 0,
  wheelDir: 'y',
  thumbCls: '',
  trackCls: '',
  thumbSize: null,
  thumbMinSize: 6,
  thumbMaxSize: 999999,
  showTrack: true,
  wheelStep: 100,
  enablePreventDefaultOnEnd: true,
  onScroll: null,
  onHScrollEnd: null,
  onVScrollEnd: null,
  onHScrollStart: null,
  onVScrollStart: null
});
(0, _defineProperty2.default)(ScrollView, "childContextTypes", {
  ScrollView: _propTypes.default.object
});

/***/ }),

/***/ "./lib/style/index.css":
/*!*****************************!*\
  !*** ./lib/style/index.css ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./lib/util/dom.js":
/*!*************************!*\
  !*** ./lib/util/dom.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime-corejs2/helpers/interopRequireDefault */ "./node_modules/@babel/runtime-corejs2/helpers/interopRequireDefault.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.on = on;
exports.off = off;
exports.disableSelection = disableSelection;
exports.contains = contains;
exports.getStyle = getStyle;
exports.setStyle = setStyle;
exports.getOffset = getOffset;
exports.getPosition = getPosition;
exports.getPositionOfViewport = getPositionOfViewport;
exports.getWidth = getWidth;
exports.getHeight = getHeight;
exports.getOuterWidth = getOuterWidth;
exports.getOuterHeight = getOuterHeight;
exports.isVisible = isVisible;
exports.matches = matches;
exports.closest = closest;
exports.hasClass = hasClass;
exports.addClass = addClass;
exports.removeClass = removeClass;

var _parseInt2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime-corejs2/core-js/parse-int */ "./node_modules/@babel/runtime-corejs2/core-js/parse-int.js"));

function on(el, type, eventHandle) {
  el.addEventListener(type, eventHandle);
  return function () {
    off(el, type, eventHandle);
  };
}

function off(el, type, eventHandle) {
  el.removeEventListener(type, eventHandle);
}

var selectEventName = "onselectstart" in document.createElement("div") ? "selectstart" : "mousedown";

function disableSelection(el) {
  function preventDefault(e) {
    e.preventDefault();
  }

  on(el, selectEventName, preventDefault);
  return function () {
    off(el, selectEventName, preventDefault);
  };
}

function contains(parent, child) {
  if (typeof parent.contains == 'function') {
    return parent.contains(child);
  } else if (typeof parent.compareDocumentPosition == 'function') {
    // 判断浏览器是否有 compareDocumentPosition 方法 且 返回值为16 
    // https://developer.mozilla.org/en-US/docs/Web/API/Node.compareDocumentPosition
    return !!(parent.compareDocumentPosition(child) & 16);
  } else {
    // 循环查出父节点 是否 等于 wrapNode; 
    var node = child.parentNode;

    do {
      if (node === parent) {
        return true;
      } else {
        node = node.parentNode;
      }
    } while (node !== null);

    return false;
  }
}

function getStyle(el, proto) {
  var style = getComputedStyle ? getComputedStyle(el) : el.currentStyle;
  return style[proto];
}

function setStyle(el, pro, value) {
  el.style[pro] = value;
}

function getOffset(el) {
  var rect = el.getBoundingClientRect();
  var docEl = document.documentElement;
  var bd = document.body;
  return {
    top: rect.top + (docEl && docEl.scrollTop ? docEl.scrollTop : bd.scrollTop),
    left: rect.left + (docEl && docEl.scrollLeft ? docEl.scrollLeft : bd.scrollLeft)
  };
}

function getPosition(_ref) {
  var offsetLeft = _ref.offsetLeft,
      offsetTop = _ref.offsetTop;
  return {
    left: offsetLeft,
    top: offsetTop
  };
}

function getPositionOfViewport(el) {
  return el.getBoundingClientRect();
}

function getWidth(el) {
  return el.clientWidth + el.scrollLeft - (0, _parseInt2.default)(getStyle(el, 'paddingLeft')) - (0, _parseInt2.default)(getStyle(el, 'paddingRight'));
}

function getHeight(el) {
  return el.clientHeight + el.scrollTop - (0, _parseInt2.default)(getStyle(el, 'paddingTop')) - (0, _parseInt2.default)(getStyle(el, 'paddingBottom'));
}
/**
* @param margin {boolean} 是否包含margin
*/


function getOuterWidth(el, margin) {}

function getOuterHeight(el, margin) {}

function isVisible(el) {
  var node = el;

  do {
    var display = getStyle(node, 'display');

    if (display === 'none') {
      return false;
    } else {
      node = node.parentNode;

      if (node === document.body) {
        return true;
      }
    }
  } while (node !== null);

  return true;
}

function matches(node, selector) {
  if (node === selector) return true;
  if (node.matches) return node.matches(selector);
  var matches = node.matchesSelector || node.msMatchesSelector || node.webkitMatchesSelector;

  if (matches) {
    return matches.call(node, selector);
  }

  return false;
}

function _closest(node, selector) {
  while (node) {
    if (matches(node, selector)) {
      return node;
    } else {
      node = node.parentElement;
    }
  }

  return node;
}

function closest(node, selector) {
  if (node.closest && typeof selector === 'string') {
    return node.closest(selector);
  } else {
    return _closest(node, selector);
  }
}
/*class*/


function hasClass(element, className) {
  if (element.classList) return !!className && element.classList.contains(className);else return " ".concat(element.className.baseVal || element.className, " ").indexOf(" ".concat(className, " ")) !== -1;
}

function addClass(element, className) {
  if (element.classList) element.classList.add(className);else if (!hasClass(element, className)) if (typeof element.className === 'string') element.className = element.className + ' ' + className;else element.setAttribute('class', (element.className && element.className.baseVal || '') + ' ' + className);
}

function replaceClassName(origClass, classToRemove) {
  return origClass.replace(new RegExp('(^|\\s)' + classToRemove + '(?:\\s|$)', 'g'), '$1').replace(/\s+/g, ' ').replace(/^\s*|\s*$/g, '');
}

function removeClass(element, className) {
  if (element.classList) element.classList.remove(className);else if (typeof element.className === 'string') element.className = replaceClassName(element.className, className);else element.setAttribute('class', replaceClassName(element.className && element.className.baseVal || '', className));
}

/***/ }),

/***/ 0:
/*!********************************************************************************************************************!*\
  !*** multi ./node_modules/packez/lib/fetchPolyfills.js ./node_modules/packez/lib/polyfills.js ./examples/index.js ***!
  \********************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! D:\wamp64\www\github-project\react-widget\scrollview\node_modules\packez\lib\fetchPolyfills.js */"./node_modules/packez/lib/fetchPolyfills.js");
__webpack_require__(/*! D:\wamp64\www\github-project\react-widget\scrollview\node_modules\packez\lib\polyfills.js */"./node_modules/packez/lib/polyfills.js");
module.exports = __webpack_require__(/*! D:\wamp64\www\github-project\react-widget\scrollview\examples\index.js */"./examples/index.js");


/***/ })

/******/ });
//# sourceMappingURL=index.95416b41.js.map