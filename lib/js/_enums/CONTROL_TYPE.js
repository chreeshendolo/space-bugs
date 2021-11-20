"use strict";

const CONTROL_TYPE = (function () {
	let _enum = 0;
	return {
		KEYBOARD_AND_MOUSE: _enum++,
		AI: _enum++,
		PROJECTILE: _enum++,
		STUN: _enum++,
	};
})();
