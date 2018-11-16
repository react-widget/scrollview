import React, { Component } from 'react';
import ScrollView from '../../lib';
export default class DEMO extends Component {


    componentDidMount() {

    }

    render() {

        return (
            <div>
                <ScrollView style={{
                    width: 260,
                    height: 300
                }}>
                    {
                        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(item => <div className="s-item" key={item}>{item}</div>)
                    }
                </ScrollView>
            </div >
        );
    }

}
