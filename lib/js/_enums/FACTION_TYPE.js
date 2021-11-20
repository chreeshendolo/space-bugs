"use strict";

const FACTION_TYPE = (function () {
	let _enum = 0;
	return {
		PLAYER: _enum++,
		ENEMY: _enum++,
	};
})();
