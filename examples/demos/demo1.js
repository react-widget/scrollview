import React, { Component } from "react";
import ScrollView, { useVirtualScrollBar } from "../../src";

function VSrollBar() {
    const ref = React.useRef();
    const [VVirtualScrollBar, vconnect] = useVirtualScrollBar();
    const [HVirtualScrollBar, hconnect] = useVirtualScrollBar({
        dir: "x"
    });

    return (
        <div>
            <div
                style={{
                    width: 100,
                    overflow: "auto",
                    height: 100
                }}
                ref={dom => {
                    vconnect(dom);
                    hconnect(dom);
                }}
            >
                <div
                    style={{
                        width: 2620,
                        height: 2620
                    }}
                ></div>
            </div>
            <VVirtualScrollBar
                style={{
                    position: "relative",
                    height: 200
                }}
            />
            <HVirtualScrollBar
                style={{
                    position: "relative",
                    width: 200
                }}
            />
        </div>
    );
}

export default class DEMO extends Component {
    state = {
        list: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    };

    componentDidMount() {
        const { list } = this.state;

        // setInterval(() => {
        //     list.push(list.length + 1);

        //     this.setState({
        //         list
        //     });
        // }, 1000);
    }

    render() {
        const { list } = this.state;

        return (
            <div>
                <VSrollBar />
                <VSrollBar />
                <VSrollBar />
                <ScrollView
                    style={{
                        width: 260,
                        height: 300
                    }}
                >
                    {list.map(item => (
                        <div className="s-item" key={item}>
                            {item}
                        </div>
                    ))}
                </ScrollView>
            </div>
        );
    }
}
