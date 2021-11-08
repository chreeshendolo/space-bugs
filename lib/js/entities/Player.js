"use strict";

const Player = (function () {

	function Player() {

		this.position = vec2.create();
		this.velocity = vec2.create();
		this.angle = 0;

		this.speed = 2;

		this.control_type = CONTROL_TYPE.KEYBOARD_AND_MOUSE;
		this.right = "d";
		this.down = "s";
		this.left = "a";
		this.up = "w";

		this.render_type = RENDER_TYPE.SPRITE;
		this.sprite = "player";
	}

	return Player;
})();
