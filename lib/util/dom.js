
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.on = on;
exports.off = off;
exports.disableSelection = disableSelection;
exports.contains = contains;
exports.getStyle = getStyle;
exports.getOffset = getOffset;
exports.isVisible = isVisible;

function on(el, type, eventHandle) {
  el.addEventListener(type, eventHandle);
  return function () {
    off(el, type, eventHandle);
  };
}

function off(el, type, eventHandle) {
  el.removeEventListener(type, eventHandle);
}

var selectEventName = "onselectstart" in document.createElement("div") ? "selectstart" : "mousedown";

function disableSelection(el) {
  function preventDefault(e) {
    e.preventDefault();
  }

  on(el, selectEventName, preventDefault);
  return function () {
    off(el, selectEventName, preventDefault);
  };
}

function contains(parent, child) {
  if (typeof parent.contains == "function") {
    return parent.contains(child);
  } else if (typeof parent.compareDocumentPosition == "function") {
    // 判断浏览器是否有 compareDocumentPosition 方法 且 返回值为16
    // https://developer.mozilla.org/en-US/docs/Web/API/Node.compareDocumentPosition
    return !!(parent.compareDocumentPosition(child) & 16);
  } else {
    // 循环查出父节点 是否 等于 wrapNode;
    var node = child.parentNode;

    do {
      if (node === parent) {
        return true;
      } else {
        node = node.parentNode;
      }
    } while (node !== null);

    return false;
  }
}

function getStyle(el, proto) {
  var style = getComputedStyle ? getComputedStyle(el) : el.currentStyle;
  return style[proto];
}

function getOffset(el) {
  var rect = el.getBoundingClientRect();
  var docEl = document.documentElement;
  var bd = document.body;
  return {
    top: rect.top + (docEl && docEl.scrollTop ? docEl.scrollTop : bd.scrollTop),
    left: rect.left + (docEl && docEl.scrollLeft ? docEl.scrollLeft : bd.scrollLeft)
  };
}

function isVisible(el) {
  var rect = el.getBoundingClientRect();
  return rect.width || rect.height;
}