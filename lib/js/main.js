"use strict";

assets.loadImages(["./assets/images/player.png"], main);

const World = {
	Width: 960,
	Height: 540,
}

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
		requestAnimationFrame(this.run.bind(this));

		this.player.update(inputs);

		console.log(this.player.position);

		renderer.clearScreen(World.Width, World.Height);
		renderer.drawImage(assets.getImage(this.player.spriteKey), this.player.position);
	},
}

function main() {
	renderer.initialize(World.Width, World.Height);

	game.run();
}
