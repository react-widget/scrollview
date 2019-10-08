import React from "react";
import PropTypes from "prop-types";

export default class ShouldComponentUpdate extends React.Component {
    static propTypes = {
        shouldComponentUpdate: PropTypes.bool
    };

    static defaultProps = {
        shouldComponentUpdate: true
    };

    shouldComponentUpdate({ shouldComponentUpdate }) {
        return shouldComponentUpdate;
    }

    render() {
        const { children } = this.props;
        return children;
    }
}
