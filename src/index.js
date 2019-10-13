import React, { Fragment } from "react";
import { findDOMNode } from "react-dom";
import PropTypes from "prop-types";
import classNames from "classnames";
import omit from "lodash/omit";
import ReactResizeObserver from "react-widget-resize-observer";
import {
    disableSelection,
    on,
    contains,
    getOffset,
    isVisible,
    getStyle
} from "./util/dom";
import ShouldComponentUpdate from "./ShouldComponentUpdate";
import ScrollViewContext from "./ScrollViewContext";
import useScrollView from "./useScrollView";
import useVirtualScrollBar from "./useVirtualScrollBar";

export { useScrollView, useVirtualScrollBar };

export default class ScrollView extends React.Component {
    static propTypes = {
        prefixCls: PropTypes.string,
        className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
        overflow: PropTypes.oneOf(["hidden", "auto", "scroll", "visible"]),
        overflowX: PropTypes.oneOf(["hidden", "auto", "scroll", "visible"]),
        overflowY: PropTypes.oneOf(["hidden", "auto", "scroll", "visible"]),
        wheelDir: PropTypes.oneOf(["x", "y"]),
        thumbClassName: PropTypes.string,
        trackClassName: PropTypes.string,
        scrollBarSize: PropTypes.number,
        thumbSize: PropTypes.number,
        thumbMinSize: PropTypes.number,
        thumbMaxSize: PropTypes.number,
        showTrack: PropTypes.bool,
        scrollBarOffsetTopOrLeft: PropTypes.number,
        scrollBarOffsetRightOrBottom: PropTypes.number,
        wheelStep: PropTypes.number,
        preventDefaultOnEnd: PropTypes.bool,
        onScroll: PropTypes.func,
        onHScrollEnd: PropTypes.func,
        onVScrollEnd: PropTypes.func,
        onHScrollStart: PropTypes.func,
        onVScrollStart: PropTypes.func
    };

    static defaultProps = {
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
    };

    constructor(props) {
        super(props);

        this._refs = {};

        this.privateState = {
            scrollTop: 0,
            scrollLeft: 0,
            thumbXSize: null,
            thumbYSize: null,
            scrollXRatio: null,
            scrollYRatio: null
        };

        this.state = {
            hasScrollX: false,
            hasScrollY: false
        };
    }

    componentDidMount() {
        this.updateScrollBarLayoutAndPosition();
    }

    _updating = false;
    startUpdating() {
        this._updating = true;
    }

    stopUpdating() {
        this._updating = false;
    }

    isUpdating() {
        return this._updating;
    }

    componentDidUpdate() {
        if (!this.isUpdating()) this.updateScrollBarLayoutAndPosition();
    }

    saveRef(name, node) {
        this._refs[name] = node;
    }

    getRef(name) {
        return this._refs[name];
    }

    handleWheel = (() => {
        const defNoop = function(e) {
            e.preventDefault();
        };
        const noop = function() {};
        //滚动到底部时下一次滚动不需要禁用默认行为
        //dir 1 向下 -1 向上
        let nextEnd = defNoop;
        let lastDir = 1;
        return e => {
            const deltaY = e.deltaY;
            const { wheelStep, wheelDir, preventDefaultOnEnd } = this.props;
            const curDir = deltaY > 0 ? 1 : -1;
            const state = this.state;

            if (lastDir != curDir) {
                lastDir = curDir;
                nextEnd = defNoop;
            }

            if (!state.hasScrollY && wheelDir === "y") {
                return;
            } else if (!state.hasScrollX && wheelDir === "x") {
                return;
            }

            this.scrollTo(
                wheelDir,
                deltaY > 0
                    ? this.getScrollPos(wheelDir) + wheelStep
                    : this.getScrollPos(wheelDir) - wheelStep
            );

            if (!preventDefaultOnEnd /* && wheelDir !== 'x' */) {
                var isEnd =
                    deltaY > 0
                        ? this.isScrollEnd(wheelDir)
                        : this.getScrollPos(wheelDir) <= 0;
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
    })();

    handleScroll = e => {
        const {
            onScroll,
            onHScrollEnd,
            onHScrollStart,
            onVScrollEnd,
            onVScrollStart
        } = this.props;
        const privateState = this.privateState;
        const target = e.target;

        const lastScrollTop = privateState.scrollTop,
            lastScrollLeft = privateState.scrollLeft;

        privateState.scrollTop = target.scrollTop;
        privateState.scrollLeft = target.scrollLeft;

        this.updateScrollBarLayout();
        this.updateScrollBarPosition();

        if (onScroll) {
            onScroll(e);
        }

        if (lastScrollTop !== privateState.scrollTop) {
            if (onVScrollEnd && this.isScrollEnd("y")) {
                onVScrollEnd(e);
            }
            if (onVScrollStart && privateState.scrollTop === 0) {
                onVScrollStart(e);
            }
        }

        if (lastScrollLeft !== privateState.scrollLeft) {
            if (onHScrollEnd && this.isScrollEnd("x")) {
                onHScrollEnd(e);
            }
            if (onHScrollStart && privateState.scrollLeft === 0) {
                onHScrollStart(e);
            }
        }
    };

    handleTrackMouseDown(e, dir = "y") {
        if (e.button !== 0) {
            return;
        }
        const target = e.target;
        const { scrollXRatio, scrollYRatio } = this.privateState;
        const { verticalBarThumbEl, horizontalBarThumbEl } = this._refs;
        const rect = target.getBoundingClientRect();
        const isVertical = dir === "y";
        const proto = isVertical ? "scrollTop" : "scrollLeft";
        const trackPos =
            rect[isVertical ? "top" : "left"] +
            (document.documentElement && document.documentElement[proto]
                ? document.documentElement[proto]
                : document.body[proto]);
        const thumbEl = isVertical ? verticalBarThumbEl : horizontalBarThumbEl;

        const clickPagePos = e[isVertical ? "pageY" : "pageX"];
        const clickPos = clickPagePos - trackPos;

        const thumbPos = parseInt(
            getStyle(thumbEl, isVertical ? "top" : "left"),
            10
        );
        const thumbSize = thumbEl[isVertical ? "offsetHeight" : "offsetWidth"];

        const ratio = isVertical ? scrollYRatio : scrollXRatio;

        if (clickPos < thumbPos) {
            this.scrollTo(dir, (clickPagePos - trackPos) * ratio);
        } else {
            this.scrollTo(
                dir,
                (thumbPos + clickPagePos - (thumbPos + thumbSize + trackPos)) *
                    ratio
            );
        }
    }

    handleThumbMouseDown(e, dir = "y") {
        const doc = document;
        const privateState = this.privateState;
        const startY = e.pageY;
        const startX = e.pageX;
        const start = this.getScrollPos(dir);
        const ratio =
            privateState[dir === "y" ? "scrollYRatio" : "scrollXRatio"];

        let moveOff, upOff, cursor;

        cursor = doc.body.style.cursor;

        doc.body.style.cursor = "default";

        const enableSelection = disableSelection(doc.body);

        upOff = on(doc, "mouseup", e => {
            enableSelection();
            upOff();
            moveOff();
            doc.body.style.cursor = cursor;
        });

        moveOff = on(doc, "mousemove", e => {
            var moveDist = dir === "y" ? e.pageY - startY : e.pageX - startX;
            var sPos = start + moveDist * ratio;
            this.scrollTo(dir, sPos);
        });
    }

    scrollTo(dir = "y", pos) {
        const scrollview = this.getScrollViewBody();
        const proto = dir === "y" ? "scrollTop" : "scrollLeft";

        if (this.privateState[proto] === pos) {
            return;
        }

        scrollview[proto] = pos;
    }

    scrollX(sLeft) {
        this.scrollTo("x", sLeft);
    }

    scrollY(sTop) {
        this.scrollTo("y", sTop);
    }

    scrollEnd(dir = "y") {
        const scrollview = this.getScrollViewBody();
        const proto = dir === "y" ? "Height" : "Width";

        const c = scrollview[`client${proto}`];
        const s = scrollview[`scroll${proto}`];

        if (s <= c) {
            return;
        }

        this.scrollTo(dir, s - c);
    }

    scrollStart(dir = "y") {
        this.scrollTo(dir, 0);
    }

    scrollIntoView(el) {
        const scrollview = this.getScrollViewBody();
        if (!contains(scrollview, el) || !isVisible(el)) return false;

        const pOffset = getOffset(scrollview);
        const tOffset = getOffset(el);

        const pTop = pOffset.top,
            pLeft = pOffset.left,
            pBottom = pOffset.top + scrollview.offsetHeight,
            pRight = pOffset.left + scrollview.offsetWidth,
            tTop = tOffset.top,
            tLeft = tOffset.left;

        const sTop = scrollview.scrollTop,
            sLeft = scrollview.scrollLeft;

        if (pTop > tTop) {
            scrollview.scrollTop = sTop - (pTop - tTop);
        } else if (pBottom < tTop + el.offsetHeight) {
            scrollview.scrollTop =
                sTop +
                tTop -
                pBottom +
                Math.min(el.offsetHeight, scrollview.clientHeight);
        }

        if (pLeft > tLeft) {
            scrollview.scrollLeft = sLeft - (pLeft - tLeft);
        } else if (pRight < tLeft + el.offsetWidth) {
            scrollview.scrollLeft =
                sLeft +
                tLeft -
                pRight +
                Math.min(el.offsetWidth, scrollview.clientWidth);
        }

        return true;
    }

    setThumbPos() {
        this.setThumbYPos();
        this.setThumbXPos();
    }

    setThumbYPos() {
        const { hasScrollY } = this.state;
        const { scrollTop, thumbYSize, scrollYRatio } = this.privateState;
        if (!hasScrollY) return;

        const { verticalBarWrapEl } = this._refs;
        const minTop = 0;
        const maxTop = verticalBarWrapEl.clientHeight - thumbYSize;

        this._refs.verticalBarThumbEl.style.top =
            Math.min(Math.max(scrollTop / scrollYRatio, minTop), maxTop) + "px";
    }

    setThumbXPos() {
        const { hasScrollX } = this.state;
        const { scrollLeft, thumbXSize, scrollXRatio } = this.privateState;
        if (!hasScrollX) return;

        const { horizontalBarWrapEl } = this._refs;
        const minLeft = 0;
        const maxLeft = horizontalBarWrapEl.clientWidth - thumbXSize;

        this._refs.horizontalBarThumbEl.style.left =
            Math.min(Math.max(scrollLeft / scrollXRatio, minLeft), maxLeft) +
            "px";
    }

    getScrollViewBody() {
        return findDOMNode(this);
    }

    getThumbSize(dir = "y") {
        const { thumbSize, thumbMinSize, thumbMaxSize } = this.props;
        const { verticalBarWrapEl, horizontalBarWrapEl } = this._refs;
        const scrollview = this.getScrollViewBody();
        const isVertical = dir === "y";
        const client = isVertical
                ? scrollview.clientHeight
                : scrollview.clientWidth,
            scroll = isVertical
                ? scrollview.scrollHeight
                : scrollview.scrollWidth,
            trackSize = isVertical
                ? verticalBarWrapEl.clientHeight
                : horizontalBarWrapEl.clientWidth;

        return thumbSize && thumbSize > 0
            ? thumbSize
            : Math.min(
                  Math.max(thumbMinSize, (client / scroll) * trackSize),
                  thumbMaxSize
              );
    }

    //判断是否创建滚动条
    hasVerticalScroll() {
        const { overflow, overflowY } = this.props;
        const scrollview = this.getScrollViewBody();

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
    }
    //判断是否创建滚动条
    hasHorizontalScroll() {
        const { overflow, overflowX } = this.props;
        const scrollview = this.getScrollViewBody();

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

    isScrollEnd(dir = "y") {
        const scrollview = this.getScrollViewBody();

        return dir === "y"
            ? scrollview.scrollTop >=
                  scrollview.scrollHeight -
                      scrollview.clientHeight -
                      //部分缩放下可能导致无法触发底部ScrollEnd
                      (scrollview.scrollTop > 0 ? 2 : 0)
            : scrollview.scrollLeft >=
                  scrollview.scrollWidth -
                      scrollview.clientWidth -
                      (scrollview.scrollLeft > 0 ? 2 : 0);
    }

    getScrollPos(dir = "y") {
        const scrollview = this.getScrollViewBody();

        return scrollview[dir === "y" ? "scrollTop" : "scrollLeft"];
    }

    hasScroll(dir = "y") {
        return dir === "y"
            ? this.hasVerticalScroll()
            : this.hasHorizontalScroll();
    }

    refreshScrollBar() {
        this.updateScrollBarLayoutAndPosition();
    }

    refresh() {
        this.updateScrollBarLayoutAndPosition();
    }

    handleResize = () => {
        this.updateScrollBarLayoutAndPosition();
    };

    updateScrollBarLayoutAndPosition = () => {
        const hasScrollX = this.hasScroll("x"),
            hasScrollY = this.hasScroll("y");

        this.startUpdating();

        this.setState(
            {
                hasScrollX,
                hasScrollY
            },
            () => {
                this.updateScrollRatio();
                this.updateScrollBarLayout();
                this.updateScrollBarPosition();

                this.stopUpdating();
            }
        );
    };

    updateScrollRatio() {
        const {
            verticalBarWrapEl,
            horizontalBarWrapEl,
            verticalBarThumbEl,
            horizontalBarThumbEl
        } = this._refs;
        const { hasScrollX, hasScrollY } = this.state;
        const privateState = this.privateState;
        const scrollview = this.getScrollViewBody();

        if (hasScrollY) {
            let thumbSize = this.getThumbSize("y");
            privateState.thumbYSize = thumbSize;
            verticalBarThumbEl.style.height = thumbSize + "px";
            privateState.scrollYRatio =
                (scrollview.scrollHeight - scrollview.clientHeight) /
                (verticalBarWrapEl.clientHeight - thumbSize);
        }

        if (hasScrollX) {
            let thumbSize = this.getThumbSize("x");
            privateState.thumbXSize = thumbSize;
            horizontalBarThumbEl.style.width = thumbSize + "px";
            privateState.scrollXRatio =
                (scrollview.scrollWidth - scrollview.clientWidth) /
                (horizontalBarWrapEl.clientWidth - thumbSize);
        }
    }

    updateScrollBarLayout() {
        const {
            scrollBarSize,
            scrollBarOffsetTopOrLeft,
            scrollBarOffsetRightOrBottom
        } = this.props;
        const { hasScrollX, hasScrollY } = this.state;
        const { verticalBarEl, horizontalBarEl } = this._refs;
        const container = this.getRef("scrollview");
        const scrollview = this.getScrollViewBody();
        const height = container.clientHeight;
        const width = container.clientWidth;
        const sTop = scrollview.scrollTop;
        const sLeft = scrollview.scrollLeft;

        if (hasScrollY && verticalBarEl) {
            verticalBarEl.style.top = scrollBarOffsetTopOrLeft + sTop + "px";
            verticalBarEl.style.right =
                scrollBarOffsetRightOrBottom + sLeft * -1 + "px";
            verticalBarEl.style.height =
                height -
                scrollBarOffsetTopOrLeft -
                (hasScrollX
                    ? scrollBarSize +
                      scrollBarOffsetTopOrLeft +
                      scrollBarOffsetRightOrBottom
                    : scrollBarOffsetTopOrLeft) +
                "px";
            if (horizontalBarEl) {
                horizontalBarEl.style.bottom =
                    scrollBarOffsetRightOrBottom + sTop * -1 + "px";
            }
        }

        if (hasScrollX && horizontalBarEl) {
            horizontalBarEl.style.left =
                scrollBarOffsetTopOrLeft + sLeft + "px";
            horizontalBarEl.style.bottom =
                scrollBarOffsetRightOrBottom + sTop * -1 + "px";
            horizontalBarEl.style.width =
                width -
                scrollBarOffsetTopOrLeft -
                (hasScrollY
                    ? scrollBarSize +
                      scrollBarOffsetTopOrLeft +
                      scrollBarOffsetRightOrBottom
                    : scrollBarOffsetTopOrLeft) +
                "px";
            if (verticalBarEl) {
                verticalBarEl.style.right =
                    scrollBarOffsetRightOrBottom + sLeft * -1 + "px";
            }
        }
    }

    updateScrollBarPosition() {
        this.setThumbPos();
    }

    renderScrollBar(dir = "y") {
        const {
            prefixCls,
            showTrack,
            thumbClassName,
            scrollBarSize,
            trackClassName
        } = this.props;
        const isVertical = dir === "y";
        const dirCls = `${prefixCls}-bar-${
            isVertical ? "vertical" : "horizontal"
        }`;

        const scrollbarRef = isVertical ? "verticalBarEl" : "horizontalBarEl",
            scrollbarWrapRef = isVertical
                ? "verticalBarWrapEl"
                : "horizontalBarWrapEl",
            scrollbarTrackRef = isVertical
                ? "verticalBarTrackEl"
                : "horizontalBarTrackEl",
            scrollbarThumbRef = isVertical
                ? "verticalBarThumbEl"
                : "horizontalBarThumbEl";

        const barStyle = {
            [isVertical ? "width" : "height"]: scrollBarSize + "px"
        };

        return (
            <div
                key={scrollbarRef}
                ref={this.saveRef.bind(this, scrollbarRef)}
                style={barStyle}
                className={classNames(`${prefixCls}-bar`, dirCls)}
            >
                <div
                    ref={this.saveRef.bind(this, scrollbarWrapRef)}
                    className={`${prefixCls}-bar-wrap`}
                >
                    {showTrack ? (
                        <div
                            ref={this.saveRef.bind(this, scrollbarTrackRef)}
                            className={classNames({
                                [`${prefixCls}-bar-track`]: true,
                                [trackClassName]: trackClassName
                            })}
                            onMouseDown={e => this.handleTrackMouseDown(e, dir)}
                        ></div>
                    ) : null}
                    <div
                        ref={this.saveRef.bind(this, scrollbarThumbRef)}
                        className={classNames({
                            [`${prefixCls}-bar-thumb`]: true,
                            [thumbClassName]: thumbClassName
                        })}
                        onMouseDown={e => this.handleThumbMouseDown(e, dir)}
                    ></div>
                </div>
            </div>
        );
    }

    render() {
        const {
            prefixCls,
            className,
            scrollViewBodyCls,
            style = {},
            scrollViewInnerComponent: ScrollViewInnerComponent,
            scrollViewBodyStyle = {},
            scrollViewBodyProps,
            children,
            ...others
        } = this.props;
        const { hasScrollX, hasScrollY } = this.state;
        const shouldComponentUpdate = !this._updating;

        const classes = classNames({
            [`${prefixCls}`]: true,
            [`${className}`]: className
        });

        const otherProps = omit(others, Object.keys(ScrollView.defaultProps));

        return (
            <ScrollViewContext.Provider value={this}>
                <div
                    {...otherProps}
                    ref={this.saveRef.bind(this, "scrollview")}
                    className={classes}
                    style={style}
                    // https://github.com/facebook/react/issues/14856#issuecomment-478144231
                    onWheel={this.handleWheel}
                    onScroll={this.handleScroll}
                >
                    <ShouldComponentUpdate
                        shouldComponentUpdate={shouldComponentUpdate}
                    >
                        <ReactResizeObserver onResize={this.handleResize}>
                            <ScrollViewInnerComponent>
                                {children}
                            </ScrollViewInnerComponent>
                        </ReactResizeObserver>
                    </ShouldComponentUpdate>
                    {hasScrollY ? this.renderScrollBar("y") : null}
                    {hasScrollX ? this.renderScrollBar("x") : null}
                </div>
            </ScrollViewContext.Provider>
        );
    }
}
