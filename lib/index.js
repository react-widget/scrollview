
"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "useScrollView", {
  enumerable: true,
  get: function get() {
    return _useScrollView.default;
  }
});
Object.defineProperty(exports, "useVirtualScrollBar", {
  enumerable: true,
  get: function get() {
    return _useVirtualScrollBar.default;
  }
});
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _reactDom = require("react-dom");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _omit = _interopRequireDefault(require("lodash/omit"));

var _reactWidgetResizeObserver = _interopRequireDefault(require("react-widget-resize-observer"));

var _dom = require("./util/dom");

var _ShouldComponentUpdate = _interopRequireDefault(require("./ShouldComponentUpdate"));

var _ScrollViewContext = _interopRequireDefault(require("./ScrollViewContext"));

var _useScrollView = _interopRequireDefault(require("./useScrollView"));

var _useVirtualScrollBar = _interopRequireDefault(require("./useVirtualScrollBar"));

var ScrollView =
/*#__PURE__*/
function (_React$Component) {
  (0, _inherits2.default)(ScrollView, _React$Component);

  function ScrollView(props) {
    var _this;

    (0, _classCallCheck2.default)(this, ScrollView);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(ScrollView).call(this, props));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_updating", false);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleWheel", function () {
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
            preventDefaultOnEnd = _this$props.preventDefaultOnEnd;
        var curDir = deltaY > 0 ? 1 : -1;
        var state = _this.state;

        if (lastDir != curDir) {
          lastDir = curDir;
          nextEnd = defNoop;
        }

        if (!state.hasScrollY && wheelDir === "y") {
          return;
        } else if (!state.hasScrollX && wheelDir === "x") {
          return;
        }

        _this.scrollTo(wheelDir, deltaY > 0 ? _this.getScrollPos(wheelDir) + wheelStep : _this.getScrollPos(wheelDir) - wheelStep);

        if (!preventDefaultOnEnd
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
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleScroll", function (e) {
      var _this$props2 = _this.props,
          onScroll = _this$props2.onScroll,
          onHScrollEnd = _this$props2.onHScrollEnd,
          onHScrollStart = _this$props2.onHScrollStart,
          onVScrollEnd = _this$props2.onVScrollEnd,
          onVScrollStart = _this$props2.onVScrollStart;
      var privateState = _this.privateState;
      var target = e.target;
      var lastScrollTop = privateState.scrollTop,
          lastScrollLeft = privateState.scrollLeft;
      privateState.scrollTop = target.scrollTop;
      privateState.scrollLeft = target.scrollLeft;

      _this.updateScrollBarLayout();

      _this.updateScrollBarPosition();

      if (onScroll) {
        onScroll(e);
      }

      if (lastScrollTop !== privateState.scrollTop) {
        if (onVScrollEnd && _this.isScrollEnd("y")) {
          onVScrollEnd(e);
        }

        if (onVScrollStart && privateState.scrollTop === 0) {
          onVScrollStart(e);
        }
      }

      if (lastScrollLeft !== privateState.scrollLeft) {
        if (onHScrollEnd && _this.isScrollEnd("x")) {
          onHScrollEnd(e);
        }

        if (onHScrollStart && privateState.scrollLeft === 0) {
          onHScrollStart(e);
        }
      }
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleResize", function () {
      _this.updateScrollBarLayoutAndPosition();
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "updateScrollBarLayoutAndPosition", function () {
      var hasScrollX = _this.hasScroll("x"),
          hasScrollY = _this.hasScroll("y");

      _this.startUpdating();

      _this.setState({
        hasScrollX: hasScrollX,
        hasScrollY: hasScrollY
      }, function () {
        _this.updateScrollRatio();

        _this.updateScrollBarLayout();

        _this.updateScrollBarPosition();

        _this.stopUpdating();
      });
    });
    _this._refs = {};
    _this.privateState = {
      scrollTop: 0,
      scrollLeft: 0,
      thumbXSize: null,
      thumbYSize: null,
      scrollXRatio: null,
      scrollYRatio: null
    };
    _this.state = {
      hasScrollX: false,
      hasScrollY: false
    };
    return _this;
  }

  (0, _createClass2.default)(ScrollView, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.updateScrollBarLayoutAndPosition();
    }
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
      var dir = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "y";

      if (e.button !== 0) {
        return;
      }

      var target = e.target;
      var _this$privateState = this.privateState,
          scrollXRatio = _this$privateState.scrollXRatio,
          scrollYRatio = _this$privateState.scrollYRatio;
      var _this$_refs = this._refs,
          verticalBarThumbEl = _this$_refs.verticalBarThumbEl,
          horizontalBarThumbEl = _this$_refs.horizontalBarThumbEl;
      var rect = target.getBoundingClientRect();
      var isVertical = dir === "y";
      var proto = isVertical ? "scrollTop" : "scrollLeft";
      var trackPos = rect[isVertical ? "top" : "left"] + (document.documentElement && document.documentElement[proto] ? document.documentElement[proto] : document.body[proto]);
      var thumbEl = isVertical ? verticalBarThumbEl : horizontalBarThumbEl;
      var clickPagePos = e[isVertical ? "pageY" : "pageX"];
      var clickPos = clickPagePos - trackPos;
      var thumbPos = parseInt((0, _dom.getStyle)(thumbEl, isVertical ? "top" : "left"), 10);
      var thumbSize = thumbEl[isVertical ? "offsetHeight" : "offsetWidth"];
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

      var dir = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "y";
      var doc = document;
      var privateState = this.privateState;
      var startY = e.pageY;
      var startX = e.pageX;
      var start = this.getScrollPos(dir);
      var ratio = privateState[dir === "y" ? "scrollYRatio" : "scrollXRatio"];
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
    key: "scrollX",
    value: function scrollX(sLeft) {
      this.scrollTo("x", sLeft);
    }
  }, {
    key: "scrollY",
    value: function scrollY(sTop) {
      this.scrollTo("y", sTop);
    }
  }, {
    key: "scrollEnd",
    value: function scrollEnd() {
      var dir = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "y";
      var scrollview = this.getScrollViewBody();
      var proto = dir === "y" ? "Height" : "Width";
      var c = scrollview["client".concat(proto)];
      var s = scrollview["scroll".concat(proto)];

      if (s <= c) {
        return;
      }

      this.scrollTo(dir, s - c);
    }
  }, {
    key: "scrollStart",
    value: function scrollStart() {
      var dir = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "y";
      this.scrollTo(dir, 0);
    }
  }, {
    key: "scrollIntoView",
    value: function scrollIntoView(el) {
      var scrollview = this.getScrollViewBody();
      if (!(0, _dom.contains)(scrollview, el) || !(0, _dom.isVisible)(el)) return false;
      var pOffset = (0, _dom.getOffset)(scrollview);
      var tOffset = (0, _dom.getOffset)(el);
      var pTop = pOffset.top,
          pLeft = pOffset.left,
          pBottom = pOffset.top + scrollview.offsetHeight,
          pRight = pOffset.left + scrollview.offsetWidth,
          tTop = tOffset.top,
          tLeft = tOffset.left;
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

      return true;
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
      var hasScrollY = this.state.hasScrollY;
      var _this$privateState2 = this.privateState,
          scrollTop = _this$privateState2.scrollTop,
          thumbYSize = _this$privateState2.thumbYSize,
          scrollYRatio = _this$privateState2.scrollYRatio;
      if (!hasScrollY) return;
      var verticalBarWrapEl = this._refs.verticalBarWrapEl;
      var minTop = 0;
      var maxTop = verticalBarWrapEl.clientHeight - thumbYSize;
      this._refs.verticalBarThumbEl.style.top = Math.min(Math.max(scrollTop / scrollYRatio, minTop), maxTop) + "px";
    }
  }, {
    key: "setThumbXPos",
    value: function setThumbXPos() {
      var hasScrollX = this.state.hasScrollX;
      var _this$privateState3 = this.privateState,
          scrollLeft = _this$privateState3.scrollLeft,
          thumbXSize = _this$privateState3.thumbXSize,
          scrollXRatio = _this$privateState3.scrollXRatio;
      if (!hasScrollX) return;
      var horizontalBarWrapEl = this._refs.horizontalBarWrapEl;
      var minLeft = 0;
      var maxLeft = horizontalBarWrapEl.clientWidth - thumbXSize;
      this._refs.horizontalBarThumbEl.style.left = Math.min(Math.max(scrollLeft / scrollXRatio, minLeft), maxLeft) + "px";
    }
  }, {
    key: "getScrollViewBody",
    value: function getScrollViewBody() {
      return (0, _reactDom.findDOMNode)(this);
    }
  }, {
    key: "getThumbSize",
    value: function getThumbSize() {
      var dir = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "y";
      var _this$props3 = this.props,
          thumbSize = _this$props3.thumbSize,
          thumbMinSize = _this$props3.thumbMinSize,
          thumbMaxSize = _this$props3.thumbMaxSize;
      var _this$_refs2 = this._refs,
          verticalBarWrapEl = _this$_refs2.verticalBarWrapEl,
          horizontalBarWrapEl = _this$_refs2.horizontalBarWrapEl;
      var scrollview = this.getScrollViewBody();
      var isVertical = dir === "y";
      var client = isVertical ? scrollview.clientHeight : scrollview.clientWidth,
          scroll = isVertical ? scrollview.scrollHeight : scrollview.scrollWidth,
          trackSize = isVertical ? verticalBarWrapEl.clientHeight : horizontalBarWrapEl.clientWidth;
      return thumbSize && thumbSize > 0 ? thumbSize : Math.min(Math.max(thumbMinSize, client / scroll * trackSize), thumbMaxSize);
    } //判断是否创建滚动条

  }, {
    key: "hasVerticalScroll",
    value: function hasVerticalScroll() {
      var _this$props4 = this.props,
          overflow = _this$props4.overflow,
          overflowY = _this$props4.overflowY;
      var scrollview = this.getScrollViewBody();

      if (!overflowY && (overflow === "hidden" || overflow === "visible")) {
        return false;
      } else if (overflow === "scroll") {
        return true;
      }

      if (overflowY === "hidden" || overflowY === "visible") {
        return false;
      } else if (overflow === "scroll") {
        return true;
      }

      return scrollview.scrollHeight - scrollview.clientHeight > 1;
    } //判断是否创建滚动条

  }, {
    key: "hasHorizontalScroll",
    value: function hasHorizontalScroll() {
      var _this$props5 = this.props,
          overflow = _this$props5.overflow,
          overflowX = _this$props5.overflowX;
      var scrollview = this.getScrollViewBody();

      if (!overflowX && (overflow === "hidden" || overflow === "visible")) {
        return false;
      } else if (overflow === "scroll") {
        return true;
      }

      if (overflowX === "hidden" || overflowX === "visible") {
        return false;
      } else if (overflow === "scroll") {
        return true;
      }

      return scrollview.scrollWidth - scrollview.clientWidth > 1;
    }
  }, {
    key: "isScrollEnd",
    value: function isScrollEnd() {
      var dir = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "y";
      var scrollview = this.getScrollViewBody();
      return dir === "y" ? scrollview.scrollTop >= scrollview.scrollHeight - scrollview.clientHeight - ( //部分缩放下可能导致无法触发底部ScrollEnd
      scrollview.scrollTop > 0 ? 2 : 0) : scrollview.scrollLeft >= scrollview.scrollWidth - scrollview.clientWidth - (scrollview.scrollLeft > 0 ? 2 : 0);
    }
  }, {
    key: "getScrollPos",
    value: function getScrollPos() {
      var dir = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "y";
      var scrollview = this.getScrollViewBody();
      return scrollview[dir === "y" ? "scrollTop" : "scrollLeft"];
    }
  }, {
    key: "hasScroll",
    value: function hasScroll() {
      var dir = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "y";
      return dir === "y" ? this.hasVerticalScroll() : this.hasHorizontalScroll();
    }
  }, {
    key: "refreshScrollBar",
    value: function refreshScrollBar() {
      this.updateScrollBarLayoutAndPosition();
    }
  }, {
    key: "refresh",
    value: function refresh() {
      this.updateScrollBarLayoutAndPosition();
    }
  }, {
    key: "updateScrollRatio",
    value: function updateScrollRatio() {
      var _this$_refs3 = this._refs,
          verticalBarWrapEl = _this$_refs3.verticalBarWrapEl,
          horizontalBarWrapEl = _this$_refs3.horizontalBarWrapEl,
          verticalBarThumbEl = _this$_refs3.verticalBarThumbEl,
          horizontalBarThumbEl = _this$_refs3.horizontalBarThumbEl;
      var _this$state = this.state,
          hasScrollX = _this$state.hasScrollX,
          hasScrollY = _this$state.hasScrollY;
      var privateState = this.privateState;
      var scrollview = this.getScrollViewBody();

      if (hasScrollY) {
        var thumbSize = this.getThumbSize("y");
        privateState.thumbYSize = thumbSize;
        verticalBarThumbEl.style.height = thumbSize + "px";
        privateState.scrollYRatio = (scrollview.scrollHeight - scrollview.clientHeight) / (verticalBarWrapEl.clientHeight - thumbSize);
      }

      if (hasScrollX) {
        var _thumbSize = this.getThumbSize("x");

        privateState.thumbXSize = _thumbSize;
        horizontalBarThumbEl.style.width = _thumbSize + "px";
        privateState.scrollXRatio = (scrollview.scrollWidth - scrollview.clientWidth) / (horizontalBarWrapEl.clientWidth - _thumbSize);
      }
    }
  }, {
    key: "updateScrollBarLayout",
    value: function updateScrollBarLayout() {
      var _this$props6 = this.props,
          scrollBarSize = _this$props6.scrollBarSize,
          scrollBarOffsetTopOrLeft = _this$props6.scrollBarOffsetTopOrLeft,
          scrollBarOffsetRightOrBottom = _this$props6.scrollBarOffsetRightOrBottom;
      var _this$state2 = this.state,
          hasScrollX = _this$state2.hasScrollX,
          hasScrollY = _this$state2.hasScrollY;
      var _this$_refs4 = this._refs,
          verticalBarEl = _this$_refs4.verticalBarEl,
          horizontalBarEl = _this$_refs4.horizontalBarEl;
      var container = this.getRef("scrollview");
      var scrollview = this.getScrollViewBody();
      var height = container.clientHeight;
      var width = container.clientWidth;
      var sTop = scrollview.scrollTop;
      var sLeft = scrollview.scrollLeft;

      if (hasScrollY && verticalBarEl) {
        verticalBarEl.style.top = scrollBarOffsetTopOrLeft + sTop + "px";
        verticalBarEl.style.right = scrollBarOffsetRightOrBottom + sLeft * -1 + "px";
        verticalBarEl.style.height = height - scrollBarOffsetTopOrLeft - (hasScrollX ? scrollBarSize + scrollBarOffsetTopOrLeft + scrollBarOffsetRightOrBottom : scrollBarOffsetTopOrLeft) + "px";

        if (horizontalBarEl) {
          horizontalBarEl.style.bottom = scrollBarOffsetRightOrBottom + sTop * -1 + "px";
        }
      }

      if (hasScrollX && horizontalBarEl) {
        horizontalBarEl.style.left = scrollBarOffsetTopOrLeft + sLeft + "px";
        horizontalBarEl.style.bottom = scrollBarOffsetRightOrBottom + sTop * -1 + "px";
        horizontalBarEl.style.width = width - scrollBarOffsetTopOrLeft - (hasScrollY ? scrollBarSize + scrollBarOffsetTopOrLeft + scrollBarOffsetRightOrBottom : scrollBarOffsetTopOrLeft) + "px";

        if (verticalBarEl) {
          verticalBarEl.style.right = scrollBarOffsetRightOrBottom + sLeft * -1 + "px";
        }
      }
    }
  }, {
    key: "updateScrollBarPosition",
    value: function updateScrollBarPosition() {
      this.setThumbPos();
    }
  }, {
    key: "renderScrollBar",
    value: function renderScrollBar() {
      var _classNames,
          _this3 = this,
          _classNames2;

      var dir = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "y";
      var _this$props7 = this.props,
          prefixCls = _this$props7.prefixCls,
          showTrack = _this$props7.showTrack,
          thumbClassName = _this$props7.thumbClassName,
          scrollBarSize = _this$props7.scrollBarSize,
          trackClassName = _this$props7.trackClassName;
      var isVertical = dir === "y";
      var dirCls = "".concat(prefixCls, "-bar-").concat(isVertical ? "vertical" : "horizontal");
      var scrollbarRef = isVertical ? "verticalBarEl" : "horizontalBarEl",
          scrollbarWrapRef = isVertical ? "verticalBarWrapEl" : "horizontalBarWrapEl",
          scrollbarTrackRef = isVertical ? "verticalBarTrackEl" : "horizontalBarTrackEl",
          scrollbarThumbRef = isVertical ? "verticalBarThumbEl" : "horizontalBarThumbEl";
      var barStyle = (0, _defineProperty2.default)({}, isVertical ? "width" : "height", scrollBarSize + "px");
      return _react.default.createElement("div", {
        key: scrollbarRef,
        ref: this.saveRef.bind(this, scrollbarRef),
        style: barStyle,
        className: (0, _classnames.default)("".concat(prefixCls, "-bar"), dirCls)
      }, _react.default.createElement("div", {
        ref: this.saveRef.bind(this, scrollbarWrapRef),
        className: "".concat(prefixCls, "-bar-wrap")
      }, showTrack ? _react.default.createElement("div", {
        ref: this.saveRef.bind(this, scrollbarTrackRef),
        className: (0, _classnames.default)((_classNames = {}, (0, _defineProperty2.default)(_classNames, "".concat(prefixCls, "-bar-track"), true), (0, _defineProperty2.default)(_classNames, trackClassName, trackClassName), _classNames)),
        onMouseDown: function onMouseDown(e) {
          return _this3.handleTrackMouseDown(e, dir);
        }
      }) : null, _react.default.createElement("div", {
        ref: this.saveRef.bind(this, scrollbarThumbRef),
        className: (0, _classnames.default)((_classNames2 = {}, (0, _defineProperty2.default)(_classNames2, "".concat(prefixCls, "-bar-thumb"), true), (0, _defineProperty2.default)(_classNames2, thumbClassName, thumbClassName), _classNames2)),
        onMouseDown: function onMouseDown(e) {
          return _this3.handleThumbMouseDown(e, dir);
        }
      })));
    }
  }, {
    key: "render",
    value: function render() {
      var _classNames3;

      var _this$props8 = this.props,
          prefixCls = _this$props8.prefixCls,
          className = _this$props8.className,
          scrollViewBodyCls = _this$props8.scrollViewBodyCls,
          _this$props8$style = _this$props8.style,
          style = _this$props8$style === void 0 ? {} : _this$props8$style,
          ScrollViewInnerComponent = _this$props8.scrollViewInnerComponent,
          _this$props8$scrollVi = _this$props8.scrollViewBodyStyle,
          scrollViewBodyStyle = _this$props8$scrollVi === void 0 ? {} : _this$props8$scrollVi,
          scrollViewBodyProps = _this$props8.scrollViewBodyProps,
          children = _this$props8.children,
          others = (0, _objectWithoutProperties2.default)(_this$props8, ["prefixCls", "className", "scrollViewBodyCls", "style", "scrollViewInnerComponent", "scrollViewBodyStyle", "scrollViewBodyProps", "children"]);
      var _this$state3 = this.state,
          hasScrollX = _this$state3.hasScrollX,
          hasScrollY = _this$state3.hasScrollY;
      var shouldComponentUpdate = !this._updating;
      var classes = (0, _classnames.default)((_classNames3 = {}, (0, _defineProperty2.default)(_classNames3, "".concat(prefixCls), true), (0, _defineProperty2.default)(_classNames3, "".concat(className), className), _classNames3));
      var otherProps = (0, _omit.default)(others, Object.keys(ScrollView.defaultProps));
      return _react.default.createElement(_ScrollViewContext.default.Provider, {
        value: this
      }, _react.default.createElement("div", (0, _extends2.default)({}, otherProps, {
        ref: this.saveRef.bind(this, "scrollview"),
        className: classes,
        style: style // https://github.com/facebook/react/issues/14856#issuecomment-478144231
        ,
        onWheel: this.handleWheel,
        onScroll: this.handleScroll
      }), _react.default.createElement(_ShouldComponentUpdate.default, {
        shouldComponentUpdate: shouldComponentUpdate
      }, _react.default.createElement(_reactWidgetResizeObserver.default, {
        onResize: this.handleResize
      }, _react.default.createElement(ScrollViewInnerComponent, null, children))), hasScrollY ? this.renderScrollBar("y") : null, hasScrollX ? this.renderScrollBar("x") : null));
    }
  }]);
  return ScrollView;
}(_react.default.Component);

exports.default = ScrollView;
(0, _defineProperty2.default)(ScrollView, "propTypes", {
  prefixCls: _propTypes.default.string,
  className: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.object]),
  overflow: _propTypes.default.oneOf(["hidden", "auto", "scroll", "visible"]),
  overflowX: _propTypes.default.oneOf(["hidden", "auto", "scroll", "visible"]),
  overflowY: _propTypes.default.oneOf(["hidden", "auto", "scroll", "visible"]),
  wheelDir: _propTypes.default.oneOf(["x", "y"]),
  thumbClassName: _propTypes.default.string,
  trackClassName: _propTypes.default.string,
  scrollBarSize: _propTypes.default.number,
  thumbSize: _propTypes.default.number,
  thumbMinSize: _propTypes.default.number,
  thumbMaxSize: _propTypes.default.number,
  showTrack: _propTypes.default.bool,
  scrollBarOffsetTopOrLeft: _propTypes.default.number,
  scrollBarOffsetRightOrBottom: _propTypes.default.number,
  wheelStep: _propTypes.default.number,
  preventDefaultOnEnd: _propTypes.default.bool,
  onScroll: _propTypes.default.func,
  onHScrollEnd: _propTypes.default.func,
  onVScrollEnd: _propTypes.default.func,
  onHScrollStart: _propTypes.default.func,
  onVScrollStart: _propTypes.default.func
});
(0, _defineProperty2.default)(ScrollView, "defaultProps", {
  scrollViewInnerComponent: "div",
  prefixCls: "rw-scrollview",
  className: "",
  overflow: "auto",
  overflowX: "auto",
  overflowY: "auto",
  scrollBarSize: 5,
  scrollBarOffsetTopOrLeft: 0,
  scrollBarOffsetRightOrBottom: 0,
  wheelDir: "y",
  thumbClassName: "",
  trackClassName: "",
  thumbSize: null,
  thumbMinSize: 6,
  thumbMaxSize: Number.MAX_VALUE,
  showTrack: true,
  wheelStep: 100,
  preventDefaultOnEnd: false,
  onScroll: null,
  onHScrollEnd: null,
  onVScrollEnd: null,
  onHScrollStart: null,
  onVScrollStart: null
});