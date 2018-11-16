
"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/objectWithoutProperties"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

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