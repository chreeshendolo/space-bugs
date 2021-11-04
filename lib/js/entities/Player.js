"use strict";

const Player = (function () {

	function Player() {
		this.position = vec2.create();
		this.velocity = vec2.create();
		this.angle = 0;

		this.spriteKey = "player";
		this.render = "player";
		this.weapon = WEAPONS.PISTOL;
	}

	return Player;
})();
