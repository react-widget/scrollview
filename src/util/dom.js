
export function on(el, type, eventHandle) {
	el.addEventListener( type, eventHandle );	
	return function(){
		off(el, type, eventHandle)	
	};
}

export function off(el, type, eventHandle){
	el.removeEventListener(type, eventHandle);	
}

const selectEventName = "onselectstart" in document.createElement( "div" ) ?
				"selectstart" :
				"mousedown";
export function disableSelection(el){
	function preventDefault(e){
		e.preventDefault();	
	}
	on(el, selectEventName, preventDefault);
	
	return function(){
		off(el, selectEventName, preventDefault);	
	};
}

export function contains(parent, child) {
	if(typeof parent.contains == 'function' ) {
		return parent.contains(child);
	} else if (typeof parent.compareDocumentPosition == 'function' ) {
		// 判断浏览器是否有 compareDocumentPosition 方法 且 返回值为16 
		// https://developer.mozilla.org/en-US/docs/Web/API/Node.compareDocumentPosition
		return !!( parent.compareDocumentPosition(child) & 16 );
	}else{
		// 循环查出父节点 是否 等于 wrapNode; 
		let node = child.parentNode;
		do {
			if (node === parent) {
				return true;
			} else {
				node = node.parentNode;
			}
		} while(node !== null);
		
		return false;
	}
}

export function getStyle(el, proto){
	const style = getComputedStyle ? getComputedStyle(el) : el.currentStyle;
	return style[proto];	
}

export function setStyle(el, pro, value){
	el.style[pro] = value;
}

export function getOffset(el){
	const rect = el.getBoundingClientRect();
	const docEl = document.documentElement;
	const bd = document.body;
	
	return {
		top: rect.top + (docEl && docEl.scrollTop ? docEl.scrollTop : bd.scrollTop),
		left: rect.left + (docEl && docEl.scrollLeft ? docEl.scrollLeft : bd.scrollLeft)
	}	
}

export function getPosition({offsetLeft, offsetTop}){
	return {
		left: offsetLeft,
		top: offsetTop	
	}	
}

export function getPositionOfViewport(el){
	return el.getBoundingClientRect();
}

export function getWidth(el) {
	return el.clientWidth + el.scrollLeft - parseInt(getStyle(el, 'paddingLeft')) - parseInt(getStyle(el, 'paddingRight'));
}

export function getHeight(el) {
	return el.clientHeight + el.scrollTop - parseInt(getStyle(el, 'paddingTop')) - parseInt(getStyle(el, 'paddingBottom'));	
}

/**
* @param margin {boolean} 是否包含margin
*/
export function getOuterWidth(el, margin){
}

export function getOuterHeight(el, margin){
		
}

export function isVisible(el){
	let node = el;
	do {
		let display = getStyle(node, 'display');
		if (display === 'none') {
			return false;
		} else {
			node = node.parentNode;
			if( node === document.body ) {
				return true;
			}
		}
	} while(node !== null);
	
	return true;
}

export function matches(node, selector){
	if( node === selector ) return true;
	
	if( node.matches ) return node.matches(selector);
	
	const matches = node.matchesSelector || node.msMatchesSelector || node.webkitMatchesSelector;
	if( matches ) {
		return matches.call(node, selector);
	}
	
	return false;
}

function _closest(node, selector){
	while (node) {
		if (matches(node, selector)) {
			return node;
		}
		else {
			node = node.parentElement;
		}
	}
	
	return node;
}

export function closest(node, selector){
	if( node.closest && typeof selector === 'string') {
		return node.closest(selector);	
	} else {
		return _closest(node, selector);	
	}
}

/*class*/
export function hasClass(element, className) {
	if ( element.classList)
		return !!className && element.classList.contains(className)
	else
		return ` ${element.className.baseVal || element.className} `.indexOf(` ${className} `) !== -1
}

export function addClass(element, className){
	if ( element.classList)
		element.classList.add(className)
	else if ( !hasClass(element, className))
		if (typeof element.className === 'string')
			element.className = element.className + ' ' + className
		else
			element.setAttribute('class', (element.className && element.className.baseVal || '') + ' ' + className)
}

function replaceClassName(origClass, classToRemove) {
	return origClass.replace(new RegExp('(^|\\s)' + classToRemove + '(?:\\s|$)', 'g'), '$1').replace(/\s+/g, ' ').replace(/^\s*|\s*$/g, '');
}

export function removeClass(element, className){
	if ( element.classList)
		element.classList.remove(className)
	else if (typeof element.className === 'string')
		element.className = replaceClassName(element.className, className)
	else
		element.setAttribute('class', replaceClassName(element.className && element.className.baseVal || '', className))
}