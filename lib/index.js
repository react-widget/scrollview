
"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/extends"));

var _keys = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/object/keys"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/objectWithoutProperties"));

var _parseInt2 = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/parse-int"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/classCallCheck"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/getPrototypeOf"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/inherits"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/assertThisInitialized"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/defineProperty"));

var _dom = require("./util/dom");

var _react = _interopRequireDefault(require("react"));

var _reactDom = require("react-dom");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _object = _interopRequireDefault(require("object.omit"));

var _ScrollViewBody = _interopRequireDefault(require("./ScrollViewBody"));

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
    key: "refresh",
    value: function refresh() {
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
          horizontalBarThumbEl = _this$_refs3.horizontalBarThumbEl; // const container = this._refs.scrollview;

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
      } // }


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
          scrollViewBodyProps = _this$props8.scrollViewBodyProps,
          children = _this$props8.children,
          others = (0, _objectWithoutProperties2.default)(_this$props8, ["prefixCls", "className", "scrollViewBodyCls", "style", "component", "scrollViewBodyStyle", "scrollViewBodyProps", "children"]);
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
      }), _react.default.createElement(_ScrollViewBody.default, (0, _extends2.default)({
        ref: this.saveRef.bind(this, "scrollviewBody"),
        component: component,
        onScroll: this.handleScroll,
        shouldComponentUpdate: shouldComponentUpdate
      }, scrollViewBodyProps, {
        className: bodyClasses,
        style: scrollViewBodyStyle
      }), children), hasScrollX ? this.getScrollBar('x') : null, hasScrollY ? this.getScrollBar('y') : null);
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
  scrollViewBodyProps: _propTypes.default.object,
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
  scrollViewBodyProps: {},
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