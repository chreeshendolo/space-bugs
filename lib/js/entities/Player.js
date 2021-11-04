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
				case " ":
					this.shoot();
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

	Player.prototype.shoot = function () {
		const bullet = document.createElement("div");
		bullet.width = 4;

		bullets.push(new Bullet(this.position));
	};

	return Player;
})();

const Bullet = (function () {
	function Bullet(position) {
		this.position = vec2.create(position[0], position[1]);
		this.size = vec2.create(10, 10);
		this.color = "#FFF";
	}

	Bullet.prototype.update = function () {
		this.position[0] += 1;
	}

	return Bullet;
})();