import React, { Component } from "react";
import ScrollView from "../../src";
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
