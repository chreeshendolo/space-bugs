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
		// DAMPEN_SOUND: _enum++, // should these be in a separate enum called "SOUND_FX_TYPE" or something
		// HIGHTEN_SOUND: _enum++,
	};
})();
