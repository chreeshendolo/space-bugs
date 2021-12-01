"use strict";

const ENTITY_TYPE = (function () {
	let _enum = 0;
	return {
		PARASITE: 1 << _enum++,
		CREATURE: 1 << _enum++,
		PROJECTILE: 1 << _enum++,
		PRISONER: 1 << _enum++,
	};
})();
