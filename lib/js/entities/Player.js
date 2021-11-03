"use strict";

const Player = (function () {

	function Player() {
		this.position = vec2.create();
		this.velocity = vec2.create();
		this.sprite = "player";
		this.weapon = WEAPONS.PISTOL;
	}

	return Player;
})();
