"use strict";

const Parasite = (function () {

	function Parasite() {

		this.camera = true;

		const index = 988;

		this.position = grid.indexPosition(index);
		this.velocity = vec2.create();
		this.angle = 0;

		this.radius = 16;
		this.width = this.radius * 2;
		this.height = this.radius * 2;

		this.speed = 1;

		this.control_type = CONTROL_TYPE.KEYBOARD_AND_MOUSE;

		this.render_type = RENDER_TYPE.SPRITE;
		this.sprite = "player";
	}

	return Parasite;
})();
