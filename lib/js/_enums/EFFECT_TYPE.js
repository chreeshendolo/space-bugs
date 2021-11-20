"use strict";

const EFFECT_TYPE = (function () {
	let _enum = 0;
	return {
		HOST: _enum++,
		SHOOT: _enum++,
		MORTAL: _enum++,
		RELOADING: _enum++,
		LOUD: _enum++,
		STUN: _enum++,
		LUNGE: _enum++,
		LUNGING: _enum++,
	};
})();
