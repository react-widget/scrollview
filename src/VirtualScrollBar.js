import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

export default class VirtualScrollBar extends React.Component {
    static propTypes = {};

    static defaultProps = {
        dom: null,
        overflow: "auto",
        prefixCls: "rw-scrollview",
        barStyle: {},
        showTrack: true,
        dir: "y",
        dirCls: "",
        trackClassName: "",
        thumbClassName: ""
    };

    state = {
        hasScroll: false
    };

    privateState = {};

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

    hasScroll(dir = "y") {
        return dir === "y"
            ? this.hasVerticalScroll()
            : this.hasHorizontalScroll();
    }

    //判断是否创建滚动条
    hasVerticalScroll() {
        const scrollview = this.getScrollViewBody();

        return scrollview.scrollHeight - scrollview.clientHeight > 1;
    }
    //判断是否创建滚动条
    hasHorizontalScroll() {
        const { dom: scrollview } = this.props;

        return scrollview.scrollWidth - scrollview.clientWidth > 1;
    }

    handleTrackMouseDown() {}

    handleThumbMouseDown() {}

    updateScrollBarLayoutAndPosition() {
        const hasScroll = this.hasScroll("x"),
            hasScroll = this.hasScroll("y");

        this.startUpdating();

        this.setState(
            {
                hasScroll,
                hasScroll
            },
            () => {
                this.updateScrollRatio();
                this.updateScrollBarLayout();
                this.updateScrollBarPosition();

                this.stopUpdating();
            }
        );
    }

    updateScrollRatio() {
        const {
            verticalBarWrapEl,
            horizontalBarWrapEl,
            verticalBarThumbEl,
            horizontalBarThumbEl
        } = this._refs;
        const { dir } = this.props;
        const { hasScroll } = this.state;
        const privateState = this.privateState;
        const scrollview = this.getScrollViewBody();

        if (dir === "y") {
            let thumbSize = this.getThumbSize("y");
            privateState.thumbYSize = thumbSize;
            verticalBarThumbEl.style.height = thumbSize + "px";
            privateState.scrollYRatio =
                (scrollview.scrollHeight - scrollview.clientHeight) /
                (verticalBarWrapEl.clientHeight - thumbSize);
        }

        if (dir === "x") {
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
        const { hasScroll, hasScroll } = this.state;
        const { verticalBarEl, horizontalBarEl } = this._refs;
        const container = this.getRef("scrollview");
        const scrollview = this.getScrollViewBody();
        const height = container.clientHeight;
        const width = container.clientWidth;
        const sTop = scrollview.scrollTop;
        const sLeft = scrollview.scrollLeft;

        if (hasScroll && verticalBarEl) {
            verticalBarEl.style.top = scrollBarOffsetTopOrLeft + sTop + "px";
            verticalBarEl.style.right =
                scrollBarOffsetRightOrBottom + sLeft * -1 + "px";
            verticalBarEl.style.height =
                height -
                scrollBarOffsetTopOrLeft -
                (hasScroll
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

        if (hasScroll && horizontalBarEl) {
            horizontalBarEl.style.left =
                scrollBarOffsetTopOrLeft + sLeft + "px";
            horizontalBarEl.style.bottom =
                scrollBarOffsetRightOrBottom + sTop * -1 + "px";
            horizontalBarEl.style.width =
                width -
                scrollBarOffsetTopOrLeft -
                (hasScroll
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

    setThumbPos() {
        this.setThumbYPos();
        this.setThumbXPos();
    }

    setThumbYPos() {
        const { hasScroll } = this.state;
        const { scrollTop, thumbYSize, scrollYRatio } = this.privateState;
        if (!hasScroll) return;

        const { verticalBarWrapEl } = this._refs;
        const minTop = 0;
        const maxTop = verticalBarWrapEl.clientHeight - thumbYSize;

        this._refs.verticalBarThumbEl.style.top =
            Math.min(Math.max(scrollTop / scrollYRatio, minTop), maxTop) + "px";
    }

    setThumbXPos() {
        const { hasScroll } = this.state;
        const { scrollLeft, thumbXSize, scrollXRatio } = this.privateState;
        if (!hasScroll) return;

        const { horizontalBarWrapEl } = this._refs;
        const minLeft = 0;
        const maxLeft = horizontalBarWrapEl.clientWidth - thumbXSize;

        this._refs.horizontalBarThumbEl.style.left =
            Math.min(Math.max(scrollLeft / scrollXRatio, minLeft), maxLeft) +
            "px";
    }

    componentDidMount() {}

    componentDidUpdate() {}

    render() {
        const {
            dir,
            style,
            prefixCls,
            dirCls,
            showTrack,
            trackClassName,
            thumbClassName
        } = this.props;

        return (
            <div
                ref={this.saveRef.bind(this, "scrollBar")}
                style={style}
                className={classNames(`${prefixCls}-bar`, dirCls)}
            >
                <div
                    ref={this.saveRef.bind(this, "scrollBarInner")}
                    className={`${prefixCls}-bar-wrap`}
                >
                    {showTrack ? (
                        <div
                            ref={this.saveRef.bind(this, "track")}
                            className={classNames({
                                [`${prefixCls}-bar-track`]: true,
                                [trackClassName]: trackClassName
                            })}
                            onMouseDown={e => this.handleTrackMouseDown(e, dir)}
                        ></div>
                    ) : null}
                    <div
                        ref={this.saveRef.bind(this, "thumb")}
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
}
