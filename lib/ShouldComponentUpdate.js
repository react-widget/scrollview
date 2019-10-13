
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var ShouldComponentUpdate =
/*#__PURE__*/
function (_React$Component) {
  (0, _inherits2.default)(ShouldComponentUpdate, _React$Component);

  function ShouldComponentUpdate() {
    (0, _classCallCheck2.default)(this, ShouldComponentUpdate);
    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(ShouldComponentUpdate).apply(this, arguments));
  }

  (0, _createClass2.default)(ShouldComponentUpdate, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(_ref) {
      var _shouldComponentUpdate = _ref.shouldComponentUpdate;
      return _shouldComponentUpdate;
    }
  }, {
    key: "render",
    value: function render() {
      var children = this.props.children;
      return children;
    }
  }]);
  return ShouldComponentUpdate;
}(_react.default.Component);

exports.default = ShouldComponentUpdate;
(0, _defineProperty2.default)(ShouldComponentUpdate, "propTypes", {
  shouldComponentUpdate: _propTypes.default.bool
});
(0, _defineProperty2.default)(ShouldComponentUpdate, "defaultProps", {
  shouldComponentUpdate: true
});