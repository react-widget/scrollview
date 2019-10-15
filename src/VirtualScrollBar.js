import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { on, disableSelection, getStyle } from "./util/dom";

function hasScroll(dom, dir = "y") {
    return dir
        ? dom.scrollHeight - dom.clientHeight > 1
        : dom.scrollWidth - dom.clientWidth > 1;
}

export default class VirtualScrollBar extends React.Component {
    static propTypes = {
        direction: PropTypes.oneOf(["vertical", "horizontal"])
    };

    static defaultProps = {
        dom: null,
        // overflow: "auto",
        direction: "vertical",
        prefixCls: "rw-scrollview",
        style: {},
        className: "",
        trackClassName: "",
        trackStyle: {},
        thumbClassName: "",
        thumbStyle: {},
        // barStyle: {},
        wheelDir: "y",
        wheelStep: 100,
        preventDefaultOnEndDelay: 500, // preventDefaultOnEnd = false有效
        preventDefaultOnEnd: false,
        dir: "y",
        size: 5,
        thumbSize: null,
        thumbMinSize: 10,
        thumbMaxSize: Number.MAX_VALUE,
        // scrollBarSize: 5,
        // scrollBarOffsetTopOrLeft: 0,
        // scrollBarOffsetRightOrBottom: 0,
        handleWheel: null, //自定义wheel事件处理
        onScroll: null,
        onScrollEnd: null,
        onScrollStart: null
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        const { dom, dir } = nextProps;

        return {
            hasScroll: dom && hasScroll(dom, dir)
        };
    }

    state = {
        hasScroll: false
    };

    privateState = {
        scrollTop: 0,
        scrollLeft: 0,
        thumbSize: null,
        scrollRatio: null,
        prevDOM: null
    };

    _refs = {
        scrollBarDOM: null,
        scrollBarInnerDOM: null,
        scrollBarTrackDOM: null,
        scrollBarThumbDOM: null
    };

    saveRef(name, node) {
        this._refs[name] = node;
    }

    getRef(name) {
        return this._refs[name];
    }

    getScrollViewBody() {
        return this.props.dom;
    }

    hasScroll() {
        return this.state.hasScroll;
    }

    refresh() {
        this.updateScrollBarLayoutAndPosition();
    }

    handleWheel = (() => {
        const preventDefault = e => {
            e.preventDefault();
        };

        //滚动锁定状态，在锁定状态会阻止事件冒泡
        let wheelLock = false;
        let timer = null;
        return e => {
            const deltaY = e.deltaY;
            const {
                wheelStep,
                wheelDir,
                preventDefaultOnEnd,
                preventDefaultOnEndDelay
            } = this.props;
            const { hasScroll } = this.state;

            if (!hasScroll) {
                return;
            }

            let alreadyScrollEnd = false;
            if (!wheelLock) {
                alreadyScrollEnd =
                    deltaY > 0
                        ? this.isScrollEnd(wheelDir)
                        : this.getScrollOffset(wheelDir) <= 0;
            }

            this.scrollTo(
                wheelDir,
                deltaY > 0
                    ? this.getScrollOffset(wheelDir) + wheelStep
                    : this.getScrollOffset(wheelDir) - wheelStep
            );

            if (preventDefaultOnEnd) {
                e.preventDefault();
            } else {
                var isEnd =
                    deltaY > 0
                        ? this.isScrollEnd(wheelDir)
                        : this.getScrollOffset(wheelDir) <= 0;

                //在没有滚动到底部时加锁
                if (!alreadyScrollEnd) {
                    wheelLock = true;

                    if (timer) {
                        clearTimeout(timer);
                    }

                    timer = setTimeout(() => {
                        wheelLock = false;
                        timer = null;
                    }, preventDefaultOnEndDelay);
                }

                if (!isEnd) {
                    e.preventDefault();
                } else {
                    //在锁定状态下阻止事件冒泡
                    if (wheelLock) {
                        preventDefault(e);
                    }
                }
            }
        };
    })();

    handleTrackMouseDown(e, dir = "y") {
        if (e.button !== 0) {
            return;
        }
        const target = e.currentTarget;
        const { scrollRatio, thumbSize } = this.privateState;
        const { scrollBarThumbDOM } = this._refs;
        const rect = target.getBoundingClientRect();
        const isVertical = dir === "y";
        const proto = isVertical ? "scrollTop" : "scrollLeft";
        const trackPos =
            rect[isVertical ? "top" : "left"] +
            (document.documentElement && document.documentElement[proto]
                ? document.documentElement[proto]
                : document.body[proto]);

        const clickPagePos = e[isVertical ? "pageY" : "pageX"];
        const clickPos = clickPagePos - trackPos;

        const thumbPos = parseInt(
            getStyle(scrollBarThumbDOM, isVertical ? "top" : "left")
        );

        const thumbMiddle = thumbSize / 2;

        if (clickPos < thumbPos) {
            this.scrollTo(
                dir,
                (clickPagePos - trackPos - thumbMiddle) * scrollRatio
            );
        } else {
            this.scrollTo(
                dir,
                (thumbPos +
                    clickPagePos -
                    (thumbPos + trackPos + thumbMiddle)) *
                    scrollRatio
            );
        }

        this.handleThumbMouseDown(e, dir);
    }

    handleThumbMouseDown(e, dir = "y") {
        const doc = document;
        const privateState = this.privateState;
        const ratio = privateState.scrollRatio;
        const startY = e.pageY;
        const startX = e.pageX;
        const start = this.getScrollOffset(dir);

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

    getScrollOffset(dir = "y") {
        const dom = this.getScrollViewBody();

        return dom[dir === "y" ? "scrollTop" : "scrollLeft"];
    }

    scrollTo(dir = "y", pos) {
        const dom = this.getScrollViewBody();
        const proto = dir === "y" ? "scrollTop" : "scrollLeft";

        if (this.privateState[proto] === pos) {
            return;
        }

        dom[proto] = pos;
    }

    handleScroll = e => {
        const { onScroll, onScrollEnd, onScrollStart, dir } = this.props;
        const privateState = this.privateState;
        const target = e.target;

        const lastScrollTop = privateState.scrollTop,
            lastScrollLeft = privateState.scrollLeft;

        privateState.scrollTop = target.scrollTop;
        privateState.scrollLeft = target.scrollLeft;

        this.updateThumbPosition();

        if (onScroll) {
            onScroll(e);
        }

        if (dir === "y" && lastScrollTop !== privateState.scrollTop) {
            if (onScrollEnd && this.isScrollEnd("y")) {
                onScrollEnd(e);
            }
            if (onScrollStart && privateState.scrollTop === 0) {
                onScrollStart(e);
            }
        }

        if (dir === "x" && lastScrollLeft !== privateState.scrollLeft) {
            if (onScrollEnd && this.isScrollEnd("x")) {
                onScrollEnd(e);
            }
            if (onScrollStart && privateState.scrollLeft === 0) {
                onScrollStart(e);
            }
        }
    };

    isScrollEnd(dir = "y") {
        const dom = this.getScrollViewBody();

        return dir === "y"
            ? dom.scrollTop >=
                  dom.scrollHeight -
                      dom.clientHeight -
                      //部分系统缩放下可能导致无法触发底部ScrollEnd
                      (dom.scrollTop > 0 ? 2 : 0)
            : dom.scrollLeft >=
                  dom.scrollWidth -
                      dom.clientWidth -
                      (dom.scrollLeft > 0 ? 2 : 0);
    }

    initEvents() {
        const { dom } = this.props;
        const privateState = this.privateState;

        //clear
        if (
            privateState.prevDOM &&
            privateState.prevDOM !== dom &&
            privateState.unbindScrollEvent
        ) {
            privateState.unbindScrollEvent();
            privateState.unbindScrollEvent = null;
        }

        if (dom && !privateState.unbindScrollEvent) {
            privateState.unbindScrollEvent = on(
                dom,
                "scroll",
                this.handleScroll
            );
        }

        privateState.prevDOM = dom;
    }

    updateScrollBarLayoutAndPosition() {
        const { hasScroll } = this.state;

        this.initEvents();

        if (hasScroll) {
            this.updateScrollRatio();
            this.updateThumbPosition();
        }
    }

    getThumbSize(dir = "y") {
        const { thumbSize, thumbMinSize, thumbMaxSize } = this.props;
        const { scrollBarInnerDOM } = this._refs;
        const dom = this.getScrollViewBody();

        const isVertical = dir === "y";
        const clientSize = isVertical ? dom.clientHeight : dom.clientWidth,
            scrollSize = isVertical ? dom.scrollHeight : dom.scrollWidth,
            trackSize = isVertical
                ? scrollBarInnerDOM.clientHeight
                : scrollBarInnerDOM.clientWidth;

        return thumbSize && thumbSize > 0
            ? thumbSize
            : Math.min(
                  Math.max(thumbMinSize, (clientSize / scrollSize) * trackSize),
                  thumbMaxSize
              );
    }

    updateScrollRatio() {
        const { scrollBarInnerDOM, scrollBarThumbDOM } = this._refs;
        const { dir } = this.props;
        const privateState = this.privateState;
        const dom = this.getScrollViewBody();

        if (dir === "y") {
            let thumbSize = this.getThumbSize("y");
            privateState.thumbSize = thumbSize;
            scrollBarThumbDOM.style.height = thumbSize + "px";
            privateState.scrollRatio =
                (dom.scrollHeight - dom.clientHeight) /
                (scrollBarInnerDOM.clientHeight - thumbSize);
        }

        if (dir === "x") {
            let thumbSize = this.getThumbSize("x");
            privateState.thumbSize = thumbSize;
            scrollBarThumbDOM.style.width = thumbSize + "px";
            privateState.scrollRatio =
                (dom.scrollWidth - dom.clientWidth) /
                (scrollBarInnerDOM.clientWidth - thumbSize);
        }
    }

    updateThumbPosition() {
        const { dir } = this.props;
        const {
            scrollTop,
            scrollLeft,
            thumbSize,
            scrollRatio
        } = this.privateState;
        const { scrollBarInnerDOM, scrollBarThumbDOM } = this._refs;

        if (dir === "y") {
            const minTop = 0;
            const maxTop = scrollBarInnerDOM.clientHeight - thumbSize;

            scrollBarThumbDOM.style.top =
                Math.min(Math.max(scrollTop / scrollRatio, minTop), maxTop) +
                "px";
        } else {
            const minLeft = 0;
            const maxLeft = scrollBarInnerDOM.clientWidth - thumbSize;

            scrollBarThumbDOM.style.left =
                Math.min(Math.max(scrollLeft / scrollRatio, minLeft), maxLeft) +
                "px";
        }
    }

    componentDidMount() {
        this.updateScrollBarLayoutAndPosition();
    }

    componentDidUpdate() {
        this.updateScrollBarLayoutAndPosition();
    }

    getScrollBarStyle() {
        const { dir, size, style } = this.props;
        const proto = dir === "y" ? "width" : "height";

        return {
            ...style,
            [proto]: size
        };
    }

    getScrollBarInnerStyle() {
        const { dir } = this.props;
        const innerStyle =
            dir === "y"
                ? {
                      top: 0,
                      bottom: 0,
                      width: "100%"
                  }
                : {
                      left: 0,
                      right: 0,
                      height: "100%"
                  };
        return {
            position: "absolute",
            ...innerStyle
        };
    }

    getScrollBarTrackStyle() {
        const { dir, trackStyle } = this.props;

        trackStyle[dir === "y" ? "top" : "left"] = 0;

        return {
            position: "absolute",
            zIndex: 1,
            height: "100%",
            width: "100%",
            ...trackStyle
        };
    }

    getScrollBarThumbStyle() {
        const { dir, thumbMinSize, thumbStyle } = this.props;

        thumbStyle.height = dir === "y" ? thumbMinSize : "100%";
        thumbStyle.width = dir !== "y" ? thumbMinSize : "100%";

        return {
            position: "absolute",
            zIndex: 2,
            ...thumbStyle
        };
    }

    componentWillUnmount() {
        const privateState = this.privateState;

        if (privateState.unbindScrollEvent) {
            privateState.unbindScrollEvent();
        }
    }

    render() {
        const {
            dir,
            prefixCls,
            className,
            trackClassName,
            thumbClassName,
            handleWheel
        } = this.props;
        const { hasScroll } = this.state;

        if (!hasScroll) return null;

        return (
            <div
                ref={this.saveRef.bind(this, "scrollBarDOM")}
                style={this.getScrollBarStyle()}
                className={classNames(`${prefixCls}-bar`, className)}
                // https://github.com/facebook/react/issues/14856#issuecomment-478144231
                onWheel={handleWheel || this.handleWheel}
            >
                <div
                    ref={this.saveRef.bind(this, "scrollBarInnerDOM")}
                    className={`${prefixCls}-bar-wrap`}
                    style={this.getScrollBarInnerStyle()}
                >
                    <div
                        ref={this.saveRef.bind(this, "scrollBarTrackDOM")}
                        className={classNames({
                            [`${prefixCls}-bar-track`]: true,
                            [trackClassName]: trackClassName
                        })}
                        style={this.getScrollBarTrackStyle()}
                        onMouseDown={e => this.handleTrackMouseDown(e, dir)}
                    ></div>
                    <div
                        ref={this.saveRef.bind(this, "scrollBarThumbDOM")}
                        className={classNames({
                            [`${prefixCls}-bar-thumb`]: true,
                            [thumbClassName]: thumbClassName
                        })}
                        style={this.getScrollBarThumbStyle()}
                        onMouseDown={e => this.handleThumbMouseDown(e, dir)}
                    ></div>
                </div>
            </div>
        );
    }
}
