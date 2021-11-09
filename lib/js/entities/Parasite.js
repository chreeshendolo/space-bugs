"use strict";

const Parasite = (function () {

	function Parasite() {

		this.camera = true;

		const index = 988;

		this.position = vec2.create(grid.column(index) * 64, grid.row(index) * 64);
		this.velocity = vec2.create();
		this.angle = 0;

		this.speed = 1;

		this.control_type = CONTROL_TYPE.KEYBOARD_AND_MOUSE;

		this.render_type = RENDER_TYPE.SPRITE;
		this.sprite = "player";
	}

	return Parasite;
})();
