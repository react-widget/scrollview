import React from "react";
import VirtualScrollBar from "./VirtualScrollBar";

export default (props = {}) => {
    const scrollRef = React.useRef();
    const _connect = React.useRef();

    const handleWheel = () => {};

    const _VirtualScrollBar = React.useMemo(() => {
        return props => {
            const [dom, connect] = React.useState(null);

            _connect.current = connect;

            if (!dom) return null;

            return <VirtualScrollBar dom={dom} ref={scrollRef} {...props} />;
        };
    }, []);

    return [
        _VirtualScrollBar,
        dom => {
            _connect.current && _connect.current(dom);
        },
        handleWheel
    ];
};
