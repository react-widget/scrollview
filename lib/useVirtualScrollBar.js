
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _react = _interopRequireDefault(require("react"));

var _VirtualScrollBar2 = _interopRequireDefault(require("./VirtualScrollBar"));

var _default = function _default(options) {
  var scrollRef = _react.default.useRef();

  var _connect = _react.default.useRef();

  var _VirtualScrollBar = _react.default.useMemo(function () {
    return function (props) {
      var _React$useState = _react.default.useState(null),
          _React$useState2 = (0, _slicedToArray2.default)(_React$useState, 2),
          dom = _React$useState2[0],
          connect = _React$useState2[1];

      _connect.current = connect;
      return _react.default.createElement(_VirtualScrollBar2.default, (0, _extends2.default)({
        dom: dom,
        ref: scrollRef
      }, options, props));
    };
  }, []);

  return [_VirtualScrollBar, function (dom) {
    _connect.current && _connect.current(dom);
  }];
};

exports.default = _default;