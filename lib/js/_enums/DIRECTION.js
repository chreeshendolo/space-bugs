"use strict";

const DIRECTION = (function () {
	let _enum = 0;
	return {
		E: 1 << _enum++,
		S: 1 << _enum++,
		W: 1 << _enum++,
		N: 1 << _enum++,
		SE: 1 << _enum++,
		SW: 1 << _enum++,
		NE: 1 << _enum++,
		NW: 1 << _enum++,
	};
})();
