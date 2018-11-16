
"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.on = on;
exports.off = off;
exports.disableSelection = disableSelection;
exports.contains = contains;
exports.getStyle = getStyle;
exports.setStyle = setStyle;
exports.getOffset = getOffset;
exports.getPosition = getPosition;
exports.getPositionOfViewport = getPositionOfViewport;
exports.getWidth = getWidth;
exports.getHeight = getHeight;
exports.getOuterWidth = getOuterWidth;
exports.getOuterHeight = getOuterHeight;
exports.isVisible = isVisible;
exports.matches = matches;
exports.closest = closest;
exports.hasClass = hasClass;
exports.addClass = addClass;
exports.removeClass = removeClass;

var _parseInt2 = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/parse-int"));

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
  if (typeof parent.contains == 'function') {
    return parent.contains(child);
  } else if (typeof parent.compareDocumentPosition == 'function') {
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

function setStyle(el, pro, value) {
  el.style[pro] = value;
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

function getPosition(_ref) {
  var offsetLeft = _ref.offsetLeft,
      offsetTop = _ref.offsetTop;
  return {
    left: offsetLeft,
    top: offsetTop
  };
}

function getPositionOfViewport(el) {
  return el.getBoundingClientRect();
}

function getWidth(el) {
  return el.clientWidth + el.scrollLeft - (0, _parseInt2.default)(getStyle(el, 'paddingLeft')) - (0, _parseInt2.default)(getStyle(el, 'paddingRight'));
}

function getHeight(el) {
  return el.clientHeight + el.scrollTop - (0, _parseInt2.default)(getStyle(el, 'paddingTop')) - (0, _parseInt2.default)(getStyle(el, 'paddingBottom'));
}
/**
* @param margin {boolean} 是否包含margin
*/


function getOuterWidth(el, margin) {}

function getOuterHeight(el, margin) {}

function isVisible(el) {
  var node = el;

  do {
    var display = getStyle(node, 'display');

    if (display === 'none') {
      return false;
    } else {
      node = node.parentNode;

      if (node === document.body) {
        return true;
      }
    }
  } while (node !== null);

  return true;
}

function matches(node, selector) {
  if (node === selector) return true;
  if (node.matches) return node.matches(selector);
  var matches = node.matchesSelector || node.msMatchesSelector || node.webkitMatchesSelector;

  if (matches) {
    return matches.call(node, selector);
  }

  return false;
}

function _closest(node, selector) {
  while (node) {
    if (matches(node, selector)) {
      return node;
    } else {
      node = node.parentElement;
    }
  }

  return node;
}

function closest(node, selector) {
  if (node.closest && typeof selector === 'string') {
    return node.closest(selector);
  } else {
    return _closest(node, selector);
  }
}
/*class*/


function hasClass(element, className) {
  if (element.classList) return !!className && element.classList.contains(className);else return " ".concat(element.className.baseVal || element.className, " ").indexOf(" ".concat(className, " ")) !== -1;
}

function addClass(element, className) {
  if (element.classList) element.classList.add(className);else if (!hasClass(element, className)) if (typeof element.className === 'string') element.className = element.className + ' ' + className;else element.setAttribute('class', (element.className && element.className.baseVal || '') + ' ' + className);
}

function replaceClassName(origClass, classToRemove) {
  return origClass.replace(new RegExp('(^|\\s)' + classToRemove + '(?:\\s|$)', 'g'), '$1').replace(/\s+/g, ' ').replace(/^\s*|\s*$/g, '');
}

function removeClass(element, className) {
  if (element.classList) element.classList.remove(className);else if (typeof element.className === 'string') element.className = replaceClassName(element.className, className);else element.setAttribute('class', replaceClassName(element.className && element.className.baseVal || '', className));
}