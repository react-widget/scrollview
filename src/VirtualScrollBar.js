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
        overflow: "auto",
        direction: "vertical",
        prefixCls: "rw-scrollview",
        barStyle: {},
        wheelDir: "y",
        wheelStep: 100,
        preventDefaultOnEndDelay: 500, // preventDefaultOnEnd = false有效
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

    _refs = {};

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
                        : this.getScrollPos(wheelDir) <= 0;
            }

            this.scrollTo(
                wheelDir,
                deltaY > 0
                    ? this.getScrollPos(wheelDir) + wheelStep
                    : this.getScrollPos(wheelDir) - wheelStep
            );

            if (preventDefaultOnEnd) {
                e.preventDefault();
            } else {
                var isEnd =
                    deltaY > 0
                        ? this.isScrollEnd(wheelDir)
                        : this.getScrollPos(wheelDir) <= 0;

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
                    //在锁定状态下阻止时间冒泡
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
        const target = e.target;
        const { scrollRatio: ratio } = this.privateState;
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
            getStyle(scrollBarThumbDOM, isVertical ? "top" : "left"),
            10
        );
        const thumbSize =
            scrollBarThumbDOM[isVertical ? "offsetHeight" : "offsetWidth"];

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
        const ratio = privateState.scrollRatio;
        const startY = e.pageY;
        const startX = e.pageX;
        const start = this.getScrollPos(dir);

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

    getScrollPos(dir = "y") {
        const scrollview = this.getScrollViewBody();

        return scrollview[dir === "y" ? "scrollTop" : "scrollLeft"];
    }

    scrollTo(dir = "y", pos) {
        const scrollview = this.getScrollViewBody();
        const proto = dir === "y" ? "scrollTop" : "scrollLeft";

        if (this.privateState[proto] === pos) {
            return;
        }

        scrollview[proto] = pos;
    }

    handleScroll = e => {
        const { onScroll, onScrollEnd, onScrollStart, dir } = this.props;
        const privateState = this.privateState;
        const target = e.target;

        const lastScrollTop = privateState.scrollTop,
            lastScrollLeft = privateState.scrollLeft;

        privateState.scrollTop = target.scrollTop;
        privateState.scrollLeft = target.scrollLeft;

        // this.updateScrollBarLayout();
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
        const scrollview = this.getScrollViewBody();

        return dir === "y"
            ? scrollview.scrollTop >=
                  scrollview.scrollHeight -
                      scrollview.clientHeight -
                      //部分系统缩放下可能导致无法触发底部ScrollEnd
                      (scrollview.scrollTop > 0 ? 2 : 0)
            : scrollview.scrollLeft >=
                  scrollview.scrollWidth -
                      scrollview.clientWidth -
                      (scrollview.scrollLeft > 0 ? 2 : 0);
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
            // this.updateScrollBarLayout();
            this.updateThumbPosition();
        }
    }

    getThumbSize(dir = "y") {
        const { thumbSize, thumbMinSize, thumbMaxSize } = this.props;
        const { scrollBarInnerDOM } = this._refs;
        const scrollview = this.getScrollViewBody();

        const isVertical = dir === "y";
        const client = isVertical
                ? scrollview.clientHeight
                : scrollview.clientWidth,
            scroll = isVertical
                ? scrollview.scrollHeight
                : scrollview.scrollWidth,
            trackSize = isVertical
                ? scrollBarInnerDOM.clientHeight
                : scrollBarInnerDOM.clientWidth;

        return thumbSize && thumbSize > 0
            ? thumbSize
            : Math.min(
                  Math.max(thumbMinSize, (client / scroll) * trackSize),
                  thumbMaxSize
              );
    }

    updateScrollRatio() {
        const { scrollBarInnerDOM, scrollBarThumbDOM } = this._refs;
        const { dir } = this.props;
        const privateState = this.privateState;
        const scrollview = this.getScrollViewBody();

        if (dir === "y") {
            let thumbSize = this.getThumbSize("y");
            privateState.thumbSize = thumbSize;
            scrollBarThumbDOM.style.height = thumbSize + "px";
            privateState.scrollRatio =
                (scrollview.scrollHeight - scrollview.clientHeight) /
                (scrollBarInnerDOM.clientHeight - thumbSize);
        }

        if (dir === "x") {
            let thumbSize = this.getThumbSize("x");
            privateState.thumbSize = thumbSize;
            scrollBarThumbDOM.style.width = thumbSize + "px";
            privateState.scrollRatio =
                (scrollview.scrollWidth - scrollview.clientWidth) /
                (scrollBarInnerDOM.clientWidth - thumbSize);
        }
    }

    // updateScrollBarLayout() {
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
        const { dir, barSize } = this.props;

        return {
            ...(dir === "y"
                ? {
                      width: barSize
                  }
                : {
                      height: barSize
                  })
        };
    }

    getScrollBarInnerStyle() {
        const { dir } = this.props;
        return {
            position: "absolute",
            ...(dir === "y"
                ? {
                      top: 0,
                      bottom: 0,
                      width: "100%"
                  }
                : {
                      left: 0,
                      right: 0,
                      height: "100%"
                  })
        };
    }

    getScrollBarTrackStyle() {
        const { dir } = this.props;
        return {
            position: "absolute",
            zIndex: 1,
            height: "100%",
            width: "100%",
            ...(dir === "y"
                ? {
                      top: 0
                  }
                : {
                      left: 0
                  })
        };
    }

    getScrollBarThumbStyle() {
        const { dir, thumbMinSize } = this.props;
        return {
            position: "absolute",
            zIndex: 2,
            ...(dir === "y"
                ? {
                      height: thumbMinSize,
                      width: "100%"
                  }
                : {
                      width: thumbMinSize,
                      height: "100%"
                  })
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
            style,
            prefixCls,
            className,
            trackClassName,
            thumbClassName
        } = this.props;
        const { hasScroll } = this.state;

        if (!hasScroll) return null;

        return (
            <div
                ref={this.saveRef.bind(this, "scrollBarDOM")}
                style={{
                    ...this.getScrollBarStyle(),
                    ...style
                }}
                className={classNames(`${prefixCls}-bar`, className)}
                // https://github.com/facebook/react/issues/14856#issuecomment-478144231
                onWheel={this.handleWheel}
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
