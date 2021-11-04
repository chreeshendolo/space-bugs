"use strict";

const Player = (function () {

	function Player() {
		this.position = vec2.create();
		this.velocity = vec2.create();
		this.sprite = "player";
		this.weapon = WEAPONS.PISTOL;
		this.speed = 0.25;
	}

	Player.prototype.update = function (inputs) {
		for (let i = 0; i < inputs.length; i++) {
			const input = inputs[i];

			switch (input) {
				case "w":
					this.velocity[1] -= this.speed;
					break;
				case "a":
					this.velocity[0] -= this.speed;
					break;
				case "s":
					this.velocity[1] += this.speed;
					break;
				case "d":
					this.velocity[0] += this.speed;
					break;
				default:
					break;
			}
		}

		this.position = vec2.add(this.position, this.velocity);
	};

	return Player;
})();
