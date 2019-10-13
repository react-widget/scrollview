
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf3 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _dom = require("./util/dom");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function hasScroll(dom) {
  var dir = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "y";
  return dir ? dom.scrollHeight - dom.clientHeight > 1 : dom.scrollWidth - dom.clientWidth > 1;
}

var VirtualScrollBar =
/*#__PURE__*/
function (_React$Component) {
  (0, _inherits2.default)(VirtualScrollBar, _React$Component);

  function VirtualScrollBar() {
    var _getPrototypeOf2;

    var _this;

    (0, _classCallCheck2.default)(this, VirtualScrollBar);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = (0, _possibleConstructorReturn2.default)(this, (_getPrototypeOf2 = (0, _getPrototypeOf3.default)(VirtualScrollBar)).call.apply(_getPrototypeOf2, [this].concat(args)));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "state", {
      hasScroll: false
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "privateState", {
      scrollTop: 0,
      scrollLeft: 0,
      thumbSize: null,
      scrollRatio: null,
      prevDOM: null
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_refs", {});
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleWheel", function () {
      var preventDefault = function preventDefault(e) {
        e.preventDefault();
      }; //滚动锁定状态，在锁定状态会阻止事件冒泡


      var wheelLock = false;
      var timer = null;
      return function (e) {
        var deltaY = e.deltaY;
        var _this$props = _this.props,
            wheelStep = _this$props.wheelStep,
            wheelDir = _this$props.wheelDir,
            preventDefaultOnEnd = _this$props.preventDefaultOnEnd,
            preventDefaultOnEndDelay = _this$props.preventDefaultOnEndDelay;
        var hasScroll = _this.state.hasScroll;

        if (!hasScroll) {
          return;
        }

        var alreadyScrollEnd = false;

        if (!wheelLock) {
          alreadyScrollEnd = deltaY > 0 ? _this.isScrollEnd(wheelDir) : _this.getScrollPos(wheelDir) <= 0;
        }

        _this.scrollTo(wheelDir, deltaY > 0 ? _this.getScrollPos(wheelDir) + wheelStep : _this.getScrollPos(wheelDir) - wheelStep);

        if (preventDefaultOnEnd) {
          e.preventDefault();
        } else {
          var isEnd = deltaY > 0 ? _this.isScrollEnd(wheelDir) : _this.getScrollPos(wheelDir) <= 0; //在没有滚动到底部时加锁

          if (!alreadyScrollEnd) {
            wheelLock = true;

            if (timer) {
              clearTimeout(timer);
            }

            timer = setTimeout(function () {
              wheelLock = false;
              timer = null;
            }, preventDefaultOnEndDelay);
          }

          if (!isEnd) {
            e.preventDefault();
          } else {
            //在锁定状态下阻止时间冒泡
            if (wheelLock) {
              preventDefault(e);
            }
          }
        }
      };
    }());
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleScroll", function (e) {
      var _this$props2 = _this.props,
          onScroll = _this$props2.onScroll,
          onScrollEnd = _this$props2.onScrollEnd,
          onScrollStart = _this$props2.onScrollStart,
          dir = _this$props2.dir;
      var privateState = _this.privateState;
      var target = e.target;
      var lastScrollTop = privateState.scrollTop,
          lastScrollLeft = privateState.scrollLeft;
      privateState.scrollTop = target.scrollTop;
      privateState.scrollLeft = target.scrollLeft; // this.updateScrollBarLayout();

      _this.updateThumbPosition();

      if (onScroll) {
        onScroll(e);
      }

      if (dir === "y" && lastScrollTop !== privateState.scrollTop) {
        if (onScrollEnd && _this.isScrollEnd("y")) {
          onScrollEnd(e);
        }

        if (onScrollStart && privateState.scrollTop === 0) {
          onScrollStart(e);
        }
      }

      if (dir === "x" && lastScrollLeft !== privateState.scrollLeft) {
        if (onScrollEnd && _this.isScrollEnd("x")) {
          onScrollEnd(e);
        }

        if (onScrollStart && privateState.scrollLeft === 0) {
          onScrollStart(e);
        }
      }
    });
    return _this;
  }

  (0, _createClass2.default)(VirtualScrollBar, [{
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
    key: "getScrollViewBody",
    value: function getScrollViewBody() {
      return this.props.dom;
    }
  }, {
    key: "hasScroll",
    value: function hasScroll() {
      return this.state.hasScroll;
    }
  }, {
    key: "refresh",
    value: function refresh() {
      this.updateScrollBarLayoutAndPosition();
    }
  }, {
    key: "handleTrackMouseDown",
    value: function handleTrackMouseDown(e) {
      var dir = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "y";

      if (e.button !== 0) {
        return;
      }

      var target = e.target;
      var ratio = this.privateState.scrollRatio;
      var scrollBarThumbDOM = this._refs.scrollBarThumbDOM;
      var rect = target.getBoundingClientRect();
      var isVertical = dir === "y";
      var proto = isVertical ? "scrollTop" : "scrollLeft";
      var trackPos = rect[isVertical ? "top" : "left"] + (document.documentElement && document.documentElement[proto] ? document.documentElement[proto] : document.body[proto]);
      var clickPagePos = e[isVertical ? "pageY" : "pageX"];
      var clickPos = clickPagePos - trackPos;
      var thumbPos = parseInt((0, _dom.getStyle)(scrollBarThumbDOM, isVertical ? "top" : "left"), 10);
      var thumbSize = scrollBarThumbDOM[isVertical ? "offsetHeight" : "offsetWidth"];

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

      var dir = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "y";
      var doc = document;
      var privateState = this.privateState;
      var ratio = privateState.scrollRatio;
      var startY = e.pageY;
      var startX = e.pageX;
      var start = this.getScrollPos(dir);
      var moveOff, upOff, cursor;
      cursor = doc.body.style.cursor;
      doc.body.style.cursor = "default";
      var enableSelection = (0, _dom.disableSelection)(doc.body);
      upOff = (0, _dom.on)(doc, "mouseup", function (e) {
        enableSelection();
        upOff();
        moveOff();
        doc.body.style.cursor = cursor;
      });
      moveOff = (0, _dom.on)(doc, "mousemove", function (e) {
        var moveDist = dir === "y" ? e.pageY - startY : e.pageX - startX;
        var sPos = start + moveDist * ratio;

        _this2.scrollTo(dir, sPos);
      });
    }
  }, {
    key: "getScrollPos",
    value: function getScrollPos() {
      var dir = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "y";
      var scrollview = this.getScrollViewBody();
      return scrollview[dir === "y" ? "scrollTop" : "scrollLeft"];
    }
  }, {
    key: "scrollTo",
    value: function scrollTo() {
      var dir = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "y";
      var pos = arguments.length > 1 ? arguments[1] : undefined;
      var scrollview = this.getScrollViewBody();
      var proto = dir === "y" ? "scrollTop" : "scrollLeft";

      if (this.privateState[proto] === pos) {
        return;
      }

      scrollview[proto] = pos;
    }
  }, {
    key: "isScrollEnd",
    value: function isScrollEnd() {
      var dir = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "y";
      var scrollview = this.getScrollViewBody();
      return dir === "y" ? scrollview.scrollTop >= scrollview.scrollHeight - scrollview.clientHeight - ( //部分系统缩放下可能导致无法触发底部ScrollEnd
      scrollview.scrollTop > 0 ? 2 : 0) : scrollview.scrollLeft >= scrollview.scrollWidth - scrollview.clientWidth - (scrollview.scrollLeft > 0 ? 2 : 0);
    }
  }, {
    key: "initEvents",
    value: function initEvents() {
      var dom = this.props.dom;
      var privateState = this.privateState; //clear

      if (privateState.prevDOM && privateState.prevDOM !== dom && privateState.unbindScrollEvent) {
        privateState.unbindScrollEvent();
        privateState.unbindScrollEvent = null;
      }

      if (dom && !privateState.unbindScrollEvent) {
        privateState.unbindScrollEvent = (0, _dom.on)(dom, "scroll", this.handleScroll);
      }

      privateState.prevDOM = dom;
    }
  }, {
    key: "updateScrollBarLayoutAndPosition",
    value: function updateScrollBarLayoutAndPosition() {
      var hasScroll = this.state.hasScroll;
      this.initEvents();

      if (hasScroll) {
        this.updateScrollRatio(); // this.updateScrollBarLayout();

        this.updateThumbPosition();
      }
    }
  }, {
    key: "getThumbSize",
    value: function getThumbSize() {
      var dir = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "y";
      var _this$props3 = this.props,
          thumbSize = _this$props3.thumbSize,
          thumbMinSize = _this$props3.thumbMinSize,
          thumbMaxSize = _this$props3.thumbMaxSize;
      var scrollBarInnerDOM = this._refs.scrollBarInnerDOM;
      var scrollview = this.getScrollViewBody();
      var isVertical = dir === "y";
      var client = isVertical ? scrollview.clientHeight : scrollview.clientWidth,
          scroll = isVertical ? scrollview.scrollHeight : scrollview.scrollWidth,
          trackSize = isVertical ? scrollBarInnerDOM.clientHeight : scrollBarInnerDOM.clientWidth;
      return thumbSize && thumbSize > 0 ? thumbSize : Math.min(Math.max(thumbMinSize, client / scroll * trackSize), thumbMaxSize);
    }
  }, {
    key: "updateScrollRatio",
    value: function updateScrollRatio() {
      var _this$_refs = this._refs,
          scrollBarInnerDOM = _this$_refs.scrollBarInnerDOM,
          scrollBarThumbDOM = _this$_refs.scrollBarThumbDOM;
      var dir = this.props.dir;
      var privateState = this.privateState;
      var scrollview = this.getScrollViewBody();

      if (dir === "y") {
        var thumbSize = this.getThumbSize("y");
        privateState.thumbSize = thumbSize;
        scrollBarThumbDOM.style.height = thumbSize + "px";
        privateState.scrollRatio = (scrollview.scrollHeight - scrollview.clientHeight) / (scrollBarInnerDOM.clientHeight - thumbSize);
      }

      if (dir === "x") {
        var _thumbSize = this.getThumbSize("x");

        privateState.thumbSize = _thumbSize;
        scrollBarThumbDOM.style.width = _thumbSize + "px";
        privateState.scrollRatio = (scrollview.scrollWidth - scrollview.clientWidth) / (scrollBarInnerDOM.clientWidth - _thumbSize);
      }
    } // updateScrollBarLayout() {
    //     const {
    //         dir,
    //         scrollBarSize,
    //         scrollBarOffsetTopOrLeft,
    //         scrollBarOffsetRightOrBottom
    //     } = this.props;
    //     const { hasScroll } = this.state;
    //     const { scrollBarDOM } = this._refs;
    //     const scrollview = this.getScrollViewBody();
    //     const height = scrollview.clientHeight;
    //     const width = scrollview.clientWidth;
    //     const sTop = scrollview.scrollTop;
    //     const sLeft = scrollview.scrollLeft;
    //     if (hasScroll && dir === "y") {
    //         scrollBarDOM.style.top = scrollBarOffsetTopOrLeft + sTop + "px";
    //         scrollBarDOM.style.right =
    //             scrollBarOffsetRightOrBottom + sLeft * -1 + "px";
    //         scrollBarDOM.style.height =
    //             height -
    //             scrollBarOffsetTopOrLeft -
    //             (hasScroll
    //                 ? scrollBarSize +
    //                   scrollBarOffsetTopOrLeft +
    //                   scrollBarOffsetRightOrBottom
    //                 : scrollBarOffsetTopOrLeft) +
    //             "px";
    //         if (scrollBarDOM) {
    //             scrollBarDOM.style.bottom =
    //                 scrollBarOffsetRightOrBottom + sTop * -1 + "px";
    //         }
    //     }
    //     if (hasScroll && dir === "x") {
    //         scrollBarDOM.style.left = scrollBarOffsetTopOrLeft + sLeft + "px";
    //         scrollBarDOM.style.bottom =
    //             scrollBarOffsetRightOrBottom + sTop * -1 + "px";
    //         scrollBarDOM.style.width =
    //             width -
    //             scrollBarOffsetTopOrLeft -
    //             (hasScroll
    //                 ? scrollBarSize +
    //                   scrollBarOffsetTopOrLeft +
    //                   scrollBarOffsetRightOrBottom
    //                 : scrollBarOffsetTopOrLeft) +
    //             "px";
    //         if (scrollBarDOM) {
    //             scrollBarDOM.style.right =
    //                 scrollBarOffsetRightOrBottom + sLeft * -1 + "px";
    //         }
    //     }
    // }

  }, {
    key: "updateThumbPosition",
    value: function updateThumbPosition() {
      var dir = this.props.dir;
      var _this$privateState = this.privateState,
          scrollTop = _this$privateState.scrollTop,
          scrollLeft = _this$privateState.scrollLeft,
          thumbSize = _this$privateState.thumbSize,
          scrollRatio = _this$privateState.scrollRatio;
      var _this$_refs2 = this._refs,
          scrollBarInnerDOM = _this$_refs2.scrollBarInnerDOM,
          scrollBarThumbDOM = _this$_refs2.scrollBarThumbDOM;

      if (dir === "y") {
        var minTop = 0;
        var maxTop = scrollBarInnerDOM.clientHeight - thumbSize;
        scrollBarThumbDOM.style.top = Math.min(Math.max(scrollTop / scrollRatio, minTop), maxTop) + "px";
      } else {
        var minLeft = 0;
        var maxLeft = scrollBarInnerDOM.clientWidth - thumbSize;
        scrollBarThumbDOM.style.left = Math.min(Math.max(scrollLeft / scrollRatio, minLeft), maxLeft) + "px";
      }
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.updateScrollBarLayoutAndPosition();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      this.updateScrollBarLayoutAndPosition();
    }
  }, {
    key: "getScrollBarStyle",
    value: function getScrollBarStyle() {
      var _this$props4 = this.props,
          dir = _this$props4.dir,
          barSize = _this$props4.barSize;
      return _objectSpread({}, dir === "y" ? {
        width: barSize
      } : {
        height: barSize
      });
    }
  }, {
    key: "getScrollBarInnerStyle",
    value: function getScrollBarInnerStyle() {
      var dir = this.props.dir;
      return _objectSpread({
        position: "absolute"
      }, dir === "y" ? {
        top: 0,
        bottom: 0,
        width: "100%"
      } : {
        left: 0,
        right: 0,
        height: "100%"
      });
    }
  }, {
    key: "getScrollBarTrackStyle",
    value: function getScrollBarTrackStyle() {
      var dir = this.props.dir;
      return _objectSpread({
        position: "absolute",
        zIndex: 1,
        height: "100%",
        width: "100%"
      }, dir === "y" ? {
        top: 0
      } : {
        left: 0
      });
    }
  }, {
    key: "getScrollBarThumbStyle",
    value: function getScrollBarThumbStyle() {
      var _this$props5 = this.props,
          dir = _this$props5.dir,
          thumbMinSize = _this$props5.thumbMinSize;
      return _objectSpread({
        position: "absolute",
        zIndex: 2
      }, dir === "y" ? {
        height: thumbMinSize,
        width: "100%"
      } : {
        width: thumbMinSize,
        height: "100%"
      });
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      var privateState = this.privateState;

      if (privateState.unbindScrollEvent) {
        privateState.unbindScrollEvent();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _classNames,
          _this3 = this,
          _classNames2;

      var _this$props6 = this.props,
          dir = _this$props6.dir,
          style = _this$props6.style,
          prefixCls = _this$props6.prefixCls,
          className = _this$props6.className,
          trackClassName = _this$props6.trackClassName,
          thumbClassName = _this$props6.thumbClassName;
      var hasScroll = this.state.hasScroll;
      if (!hasScroll) return null;
      return _react.default.createElement("div", {
        ref: this.saveRef.bind(this, "scrollBarDOM"),
        style: _objectSpread({}, this.getScrollBarStyle(), {}, style),
        className: (0, _classnames.default)("".concat(prefixCls, "-bar"), className) // https://github.com/facebook/react/issues/14856#issuecomment-478144231
        ,
        onWheel: this.handleWheel
      }, _react.default.createElement("div", {
        ref: this.saveRef.bind(this, "scrollBarInnerDOM"),
        className: "".concat(prefixCls, "-bar-wrap"),
        style: this.getScrollBarInnerStyle()
      }, _react.default.createElement("div", {
        ref: this.saveRef.bind(this, "scrollBarTrackDOM"),
        className: (0, _classnames.default)((_classNames = {}, (0, _defineProperty2.default)(_classNames, "".concat(prefixCls, "-bar-track"), true), (0, _defineProperty2.default)(_classNames, trackClassName, trackClassName), _classNames)),
        style: this.getScrollBarTrackStyle(),
        onMouseDown: function onMouseDown(e) {
          return _this3.handleTrackMouseDown(e, dir);
        }
      }), _react.default.createElement("div", {
        ref: this.saveRef.bind(this, "scrollBarThumbDOM"),
        className: (0, _classnames.default)((_classNames2 = {}, (0, _defineProperty2.default)(_classNames2, "".concat(prefixCls, "-bar-thumb"), true), (0, _defineProperty2.default)(_classNames2, thumbClassName, thumbClassName), _classNames2)),
        style: this.getScrollBarThumbStyle(),
        onMouseDown: function onMouseDown(e) {
          return _this3.handleThumbMouseDown(e, dir);
        }
      })));
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(nextProps, prevState) {
      var dom = nextProps.dom,
          dir = nextProps.dir;
      return {
        hasScroll: dom && hasScroll(dom, dir)
      };
    }
  }]);
  return VirtualScrollBar;
}(_react.default.Component);

exports.default = VirtualScrollBar;
(0, _defineProperty2.default)(VirtualScrollBar, "propTypes", {
  direction: _propTypes.default.oneOf(["vertical", "horizontal"])
});
(0, _defineProperty2.default)(VirtualScrollBar, "defaultProps", {
  dom: null,
  overflow: "auto",
  direction: "vertical",
  prefixCls: "rw-scrollview",
  barStyle: {},
  wheelDir: "y",
  wheelStep: 100,
  preventDefaultOnEndDelay: 500,
  // preventDefaultOnEnd = false有效
  preventDefaultOnEnd: false,
  dir: "y",
  className: "",
  barSize: 5,
  trackClassName: "",
  thumbClassName: "",
  thumbSize: null,
  thumbMinSize: 10,
  thumbMaxSize: Number.MAX_VALUE,
  scrollBarSize: 5,
  scrollBarOffsetTopOrLeft: 0,
  scrollBarOffsetRightOrBottom: 0
});