const RENDER = {};

RENDER[RENDER_TYPE.SPRITE] = function (entity) {
	const context = renderer.context;

	const image = images.get(entity.sprite);

	context.drawImage(image, -image.width * 0.5, -image.height * 0.5);
};
