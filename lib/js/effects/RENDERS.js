const RENDERS = {};

RENDERS[RENDER_TYPE.NONE] = function (entity) {};

RENDERS[RENDER_TYPE.SPRITE] = function (entity) {
	const context = renderer.context;

	context.save();

	context.translate(entity.position[0], entity.position[1]);
	context.rotate(entity.angle);

	const image = images.get(entity.sprite);
	context.drawImage(image, -image.width * 0.5, -image.height * 0.5);

	context.restore();
};

RENDERS[RENDER_TYPE.HOST] = function (entity) {
	const context = renderer.context;

	context.save();
	context.translate(entity.position[0], entity.position[1]);

	const image = images.get(entity.sprite);

	context.fillStyle = "#AAA";
	context.fillRect(-image.width * 0.5, -image.height * 0.5 - 12, 32, 8);

	context.fillStyle = "#846";
	context.fillRect(-image.width * 0.5 + 2, -image.height * 0.5 - 10, 28 * entity.host_timer / EFFECT_DATA[EFFECT_TYPE.HOST].duration, 4);

	context.restore();
};

RENDERS[RENDER_TYPE.MORTAL] = function (entity) {
	const context = renderer.context;

	context.save();
	context.translate(entity.position[0], entity.position[1]);

	const image = images.get(entity.sprite);

	context.fillStyle = "#AAA";
	context.fillRect(-image.width * 0.5, -image.height * 0.5 - 12, 32, 8);

	context.fillStyle = "#A44";
	context.fillRect(-image.width * 0.5 + 2, -image.height * 0.5 - 10, Math.max(0, 28 * entity.health / entity.max_health), 4);

	context.restore();
};
