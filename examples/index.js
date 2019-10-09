import React from "react";
import ReactDOM from "react-dom";

import "./style/index.scss";
import "./style/animate.scss";

import "../src/style/index.scss";

import Demo from "./Demo";

const EVENTS_TO_MODIFY = [
    "touchstart",
    "touchmove",
    "touchend",
    "touchcancel",
    "wheel"
];

const originalAddEventListener = document.addEventListener.bind();
document.addEventListener = (type, listener, options, wantsUntrusted) => {
    let modOptions = options;
    if (EVENTS_TO_MODIFY.includes(type)) {
        if (typeof options === "boolean") {
            modOptions = {
                capture: options,
                passive: false
            };
        } else if (typeof options === "object") {
            modOptions = {
                passive: false,
                ...options
            };
        }
    }

    return originalAddEventListener(type, listener, modOptions, wantsUntrusted);
};

const originalRemoveEventListener = document.removeEventListener.bind();
document.removeEventListener = (type, listener, options) => {
    let modOptions = options;
    if (EVENTS_TO_MODIFY.includes(type)) {
        if (typeof options === "boolean") {
            modOptions = {
                capture: options,
                passive: false
            };
        } else if (typeof options === "object") {
            modOptions = {
                passive: false,
                ...options
            };
        }
    }
    return originalRemoveEventListener(type, listener, modOptions);
};

ReactDOM.render(<Demo />, document.getElementById("demo"));
