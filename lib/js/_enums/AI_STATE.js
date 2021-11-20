"use strict";

const AI_STATE = (function () {
	let _enum = 0;
	return {
		IDLE: _enum++,
		ENGAGED: _enum++,
	};
})();
