"use strict";

const WEAPON_TYPE = (function () {
	let _enum = 0;
	return {
		LUNGE: _enum++,
		PISTOL: _enum++,
		SNIPER: _enum++,
		GUNNER: _enum++,
	};
})();
