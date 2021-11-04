const RENDER = {};

RENDER.player = function (player) {
	const context = renderer.context;

	const image = images.get(player.spriteKey);

	context.drawImage(image, -image.width * 0.5, -image.height * 0.5);

};
