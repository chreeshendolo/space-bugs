"use strict";

const RENDER_TYPE = (function () {
	let _enum = 0;
	return {
		NONE: _enum++,
		SPRITE: _enum++,
		HOST: _enum++,
		MORTAL: _enum++,
		RELOADING: _enum++,
	};
})();
