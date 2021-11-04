"use strict";

assets.loadImages(["./assets/images/player.png"], main);

const World = {
	Width: 960,
	Height: 540,
}

const bullets = [];

let time = 0;

let inputs = [];
document.addEventListener("keydown", (data) => {
	data.preventDefault();

	const index = inputs.indexOf(data.key)
	if (index > -1) { return; }

	inputs.push(data.key);
});

document.addEventListener("keyup", (data) => {
	data.preventDefault();
	
	const index = inputs.indexOf(data.key)
	if (index === -1) { return; }

	inputs.splice(index, 1)
});

const game = {
	player: new Player(),
	run: function () {
		time++;

		requestAnimationFrame(this.run.bind(this));

		// update player
		this.player.update(inputs);

		// update bullets
		const toSplice = [];
		for (let i = 0; i < bullets.length; i++) {
			const bullet = bullets[i];

			bullet.update();

			if (bullet.position[0] > World.Width) {
				toSplice.push(i);
			}
		}

		for (let i = toSplice.length - 1; i >= 0; i--) {
			const spliceIdx = toSplice[i];

			bullets.splice(spliceIdx, 1);
		}

		// clear screen
		renderer.clearScreen(World.Width, World.Height);

		// draw player
		renderer.drawImage(assets.getImage(this.player.spriteKey), this.player.position);

		// draw bullets
		for (let i = 0; i < bullets.length; i++) {
			const bullet = bullets[i];

			renderer.drawRect(
				bullet.position[0],
				bullet.position[1],
				bullet.size[0],
				bullet.size[1],
				bullet.color,
			)
		}

		renderer.drawInstructions();
	},
}

function main() {
	renderer.initialize(World.Width, World.Height);

	game.run();
}
