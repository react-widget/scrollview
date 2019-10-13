import React from "react";
import VirtualScrollBar from "./VirtualScrollBar";

export default options => {
    const scrollRef = React.useRef();
    const _connect = React.useRef();

    const _VirtualScrollBar = React.useMemo(() => {
        return props => {
            const [dom, connect] = React.useState(null);

            _connect.current = connect;

            return (
                <VirtualScrollBar
                    dom={dom}
                    ref={scrollRef}
                    {...options}
                    {...props}
                />
            );
        };
    }, []);

    return [
        _VirtualScrollBar,
        dom => {
            _connect.current && _connect.current(dom);
        }
    ];
};
