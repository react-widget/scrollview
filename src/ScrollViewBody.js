import React from "react";
import PropTypes from "prop-types";

export default class ScrollViewBody extends React.Component {
    static propTypes = {
        className: PropTypes.string,
        shouldComponentUpdate: PropTypes.bool,
        component: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
    };

    static defaultProps = {
        className: "",
        shouldComponentUpdate: true,
        component: "div"
    };

    shouldComponentUpdate({ shouldComponentUpdate }) {
        return shouldComponentUpdate;
    }

    render() {
        const { shouldComponentUpdate, component, ...others } = this.props;

        console.log(345);

        const Node = component;

        return <Node {...others} />;
    }
}
