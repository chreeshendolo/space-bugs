"use strict";

input.initialize();
renderer.initialize(960, 540);

let started = false;
let loaded = false;
images.load(["assets/images/title.png"], start);
assets.load(function () { loaded = true; });

function drawBlank() {
	renderer.context.resetTransform();
	renderer.context.fillStyle = "#222";
	renderer.context.fillRect(0, 0, renderer.canvas.width, renderer.canvas.height);
}

function drawTitle() {
	const title = images.get("title");
	renderer.context.drawImage(
		title,
		renderer.canvas.width * 0.5 - title.width * 0.5,
		renderer.canvas.height * 0.5 - title.height * 0.5,
	);
}

function drawGameOver() {
	const title = images.get("game_over");
	renderer.context.drawImage(
		title,
		renderer.canvas.width * 0.5 - title.width * 0.5,
		renderer.canvas.height * 0.5 - title.height * 0.5,
	);
}

const entities = [];

let totalEnemies = 0;

let step = 0;
function initializeGame() {
	step = 0;
	entities.length = 0;

	entities.push(
		new Parasite(528),

		new Prisoner(503, Math.PI),
		new Prisoner(68, Math.PI),
		new Prisoner(76, Math.PI),
		new Prisoner(189, Math.PI),
		new Prisoner(829, Math.PI),
		new Prisoner(909, Math.PI),

		new Pistol(438, Math.PI * 0.5),
		new Pistol(566, Math.PI * 1.5),

		new Gunner(93, Math.PI * 0.5),
		new Pistol(186, 0),
		new Sniper(146, 0),
		new Gunner(53, Math.PI * 0.5),
		new Pistol(141, Math.PI * 1.5),
		new Gunner(105, 0),
		new Pistol(66, Math.PI * 0.5),
		new Sniper(132, Math.PI),
		new Gunner(585, Math.PI),
		new Pistol(578, Math.PI * 1.5),
		new Sniper(386, 0),
		new Gunner(358, Math.PI),
		new Pistol(770, 0),
		new Pistol(866, Math.PI * 1.5),
		new Gunner(804, Math.PI * 1.5),
		new Sniper(816, Math.PI * 0.5),
		new Pistol(944, Math.PI),
		new Sniper(906, 0),
		new Pistol(922, Math.PI * 1.5),
		new Pistol(953, Math.PI),
		new Gunner(955, 0),
		new Pistol(669, Math.PI),
		new Gunner(634, 0),
	);

	totalEnemies = countEnemies();
}

function countEnemies() {
	let total = 0;
	for (let i = 0; i < entities.length; i++) {
		const entity = entities[i];
		if (entity.faction_type !== FACTION_TYPE.ENEMY) { continue; }
		if (entity.entity_type === ENTITY_TYPE.PROJECTILE) { continue; }
		total++;
	}

	return total;
}


function start() {
	lastTime = performance.now();
	loop(lastTime);
}

let playing = false;
let gameOver = false;
let flickering = false;
let title = true;

const fixedStep = 16;
const maxStep = 100;
let tempIdx = 0;
let tempTime = 0;
let lastTime = 0;
let accumulator = 0;
let flickerRemaining = 200;
function loop(time) {
	step++;

	const deltaTime = time - lastTime;
	lastTime = time;

	requestAnimationFrame(loop);

	if (title) {
		if (input.mouse.left) {
			title = false;
			flickering = true;
			return;
		}

		drawBlank();
		drawTitle();
		return;
	}

	if (flickering) {
		flickerRemaining -= deltaTime;

		drawBlank();
		if (flickerRemaining < 0) {
			started = true;

			initializeGame();
			music.play();
			playing = true;
			flickering = false;
			gameOver = false;

			return;
		}

		if (Math.sin(flickerRemaining * 0.1) > 0) {
			if (gameOver) {
				drawGameOver();
			} else {
				drawTitle();
			}
		}

		return;
	}

	if (!loaded) {
		drawBlank();
		return;
	}

	if (!playing) {
		music.stop();
		sounds.crawl(false);
		sounds.walk(false);

		if (input.mouse.left) {
			input.mouse.left = false;
			flickerRemaining = 200;
			flickering = true;
			gameOver = true;
			return;
		}

		let fillStyle = "#222";
		let enemiesKilled = totalEnemies - countEnemies();

		drawBlank();
		drawGameOver();

		const ctx = renderer.context;
		const w = renderer.canvas.width;
		const h = renderer.canvas.height;

		let free = 0;
		let prisoners = 0;
		for (let i = 0; i < entities.length; i++) {
			const entity = entities[i];
			if (entity.entity_type !== ENTITY_TYPE.PRISONER) { continue; }

			prisoners++;

			if (!entity.free) { continue; }

			free++;

		}

		const stats = [
			"STATS",
			`KILLS: ${enemiesKilled}`,
			`RESCUED: ${free}/${prisoners}`,
		];

		if (free >= prisoners) {
			stats.push(
				`AWARDS`,
				`MERCY: ${enemiesKilled === 0}`,
				`JUSTICE: ${enemiesKilled === totalEnemies}`,
				`CHAMELEON: ${false}`,
			);
		}

		ctx.fillStyle = "#AAA";

		for (let i = 0; i < stats.length; i++) {
			ctx.fillText(stats[i], w * 0.4, h * 0.6 + 16 * i);
		}

		return;
	}

	accumulator += Math.min(deltaTime, maxStep);

	while (accumulator > fixedStep) {
		control(entities);
		physics(entities);
		sound(entities);
		effects(entities, fixedStep);
		removal(entities);
		spawn(entities);

		accumulator -= fixedStep;
	}

	music.update(deltaTime);
	render(entities);

}
