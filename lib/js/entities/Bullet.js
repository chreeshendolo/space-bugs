"use strict";

const Bullet = (function () {

	function Bullet() {
		this.position = vec2.create();
		this.velocity = vec2.create();
		this.angle = 0;

		this.spriteKey = "player";
		this.render = "player";

		this.damage = 10;
	}

	return Bullet;
})();
