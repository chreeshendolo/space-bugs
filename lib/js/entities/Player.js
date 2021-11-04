"use strict";

const Player = (function () {

	function Player() {
		this.position = vec2.create();
		this.velocity = vec2.create();
		this.spriteKey = "player";
		this.weapon = WEAPONS.PISTOL;
		this.speed = 0.25;
	}

	Player.prototype.update = function (inputs) {
		this.handleInputs(inputs);
		this.updatePosition();
		this.checkBounds();
	};

	Player.prototype.handleInputs = function (inputs) {
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
	};

	Player.prototype.updatePosition = function () {
		this.position = vec2.add(this.position, this.velocity);
	};

	Player.prototype.checkBounds = function () {
		const sprite = assets.getImage(this.spriteKey);
		const width = sprite.width;
		if (this.position[0] + width > World.Width) {
			this.position[0] = World.Width - width;
			this.velocity[0] = 0;
		}

		if (this.position[0] < 0) {
			this.position[0] = 0;
			this.velocity[0] = 0;
		}

		if (this.position[1] + width > World.Height) {
			this.position[1] = World.Height - width;
			this.velocity[1] = 0;
		}

		if (this.position[1] < 0) {
			this.position[1] = 0;
			this.velocity[1] = 0;
		}
	};

	return Player;
})();
