"use strict";

const Creature = (function () {

	function Creature(type) {
		this.position = vec2.create();
		this.velocity = vec2.create();
		this.angle = 0;
		this.type = type;
	}

	return Creature;
})();
