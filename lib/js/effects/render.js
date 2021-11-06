const RENDER = {};

RENDER[ENTITY_TYPE.PLAYER] = function () {
	const context = renderer.context;

	const spriteKey = SPRITE_KEYS[ENTITY_TYPE.PLAYER];
	const image = images.get(spriteKey);

	context.drawImage(image, -image.width * 0.5, -image.height * 0.5);
};
