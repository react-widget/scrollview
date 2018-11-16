# scrollview

## Install

`npm install --save react-widget-scrollview`

## Options

```
static propTypes = {
        prefixCls: PropTypes.string,
        className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
        scrollViewBodyCls: PropTypes.string,
        scrollViewBodyStyle: PropTypes.object,
        overflow: PropTypes.oneOfType(['hidden', 'auto', 'scroll', 'visible']),
        overflowX: PropTypes.oneOfType(['hidden', 'auto', 'scroll', 'visible']),
        overflowY: PropTypes.oneOfType(['hidden', 'auto', 'scroll', 'visible']),
        wheelDir: PropTypes.oneOfType(['x', 'y']),
        thumbCls: PropTypes.string,
        trackCls: PropTypes.string,
        scrollBarSize: PropTypes.number,
        thumbSize: PropTypes.number,
        thumbMinSize: PropTypes.number,
        thumbMaxSize: PropTypes.number,
        showTrack: PropTypes.bool,
        scrollBarOffsetTopOrLeft: PropTypes.number,
        scrollBarOffsetRightOrBottom: PropTypes.number,
        wheelStep: PropTypes.number,
        enablePreventDefaultOnEnd: PropTypes.bool,
        onScroll: PropTypes.func,
        onHScrollEnd: PropTypes.func,
        onVScrollEnd: PropTypes.func,
        onHScrollStart: PropTypes.func,
        onVScrollStart: PropTypes.func,
    };

    static defaultProps = {
        prefixCls: 'rw-scrollview',
        className: '',
        scrollViewBodyCls: '',
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
        onVScrollStart: null,
    };
```