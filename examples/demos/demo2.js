import React, { Component } from "react";
import ScrollView from "../../src";

function InnerWrapper(props) {
    return (
        <div
            style={{
                display: "flex",
                height: 35
            }}
            {...props}
        />
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

    handleAdd = () => {
        const { list } = this.state;
        this.setState({
            list: [...list, list.length + 1]
        });
    };

    handleActive = e => {
        const target = e.target;
        this.scrollview.scrollIntoView(target);
    };

    scrollview = null;

    render() {
        const { list } = this.state;

        return (
            <div>
                <ScrollView
                    scrollViewInnerComponent={InnerWrapper}
                    ref={c => (this.scrollview = c)}
                    wheelDir="x"
                    overflowY="hidden"
                    preventDefaultOnEnd
                >
                    {list.map(item => (
                        <div
                            onClick={this.handleActive}
                            style={{
                                borderRight: "1px solid #fff",
                                flex: "none",
                                display: "inline-block",
                                width: 200,
                                lineHeight: "35px",
                                textAlign: "center",
                                backgroundColor: "#ececec"
                            }}
                            key={item}
                        >
                            Title-{item}
                        </div>
                    ))}
                </ScrollView>
                <button onClick={this.handleAdd}>新增</button>
            </div>
        );
    }
}
