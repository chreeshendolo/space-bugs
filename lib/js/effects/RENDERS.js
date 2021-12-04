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
	context.rotate(entity.angle);

	const image = images.get("parasite");
	context.drawImage(image, -image.width * 0.5, -image.height * 0.5);

	context.restore();
};

RENDERS[RENDER_TYPE.MORTAL] = function (entity) {

	const ratio = entity.health / entity.max_health;
	if (ratio === 1) { return; }

	const context = renderer.context;

	context.save();
	context.translate(entity.position[0], entity.position[1]);

	const radius = entity.radius;

	const w = 32;
	const h = 8;

	context.fillStyle = "#AAA";
	context.fillRect(-w * 0.5, -radius - 12, w, h);

	context.fillStyle = "#A44";
	context.fillRect(-w * 0.5 + 2, -radius - 10, Math.max(0, 28 * ratio), 4);

	context.restore();
};

RENDERS[RENDER_TYPE.RELOADING] = function (entity) {
	if (!entity.player) { return; }

	const ratio = entity.reload_remaining / entity.reload_duration;
	if (ratio === 1) { return; }

	const context = renderer.context;

	context.save();
	context.translate(entity.position[0], entity.position[1]);

	const radius = entity.radius;

	const w = 32;
	const h = 8;

	context.fillStyle = "#AAA";
	context.fillRect(-w * 0.5, radius + 8, w, h);

	context.fillStyle = "#44A";
	context.fillRect(-w * 0.5 + 2, radius + 10, Math.max(0, 28 * (1 - ratio)), 4);

	context.restore();
};
