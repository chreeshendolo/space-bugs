"use strict";

assets.loadImages(["./assets/images/player.png"], main);

function main() {

	renderer.initialize(960, 540);

	const player = new Player();

	renderer.drawImage(assets.getImage(player.sprite), player.position);
}
