"use strict";

input.initialize();
renderer.initialize(960, 540);
awards.initialize();

let started = false;
let loaded = false;
images.load([
	"assets/images/title.png",
	"assets/images/award_locked.png",
	"assets/images/award_victory.png",
	"assets/images/award_mercy.png",
	"assets/images/award_justice.png",
	"assets/images/award_contagion.png",
], start);

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

	awards.render();

}

function drawGameOver() {
	const title = images.get(victory ? "victory" : "game_over");
	renderer.context.drawImage(
		title,
		renderer.canvas.width * 0.5 - title.width * 0.5,
		renderer.canvas.height * 0.5 - title.height * 0.5,
	);

	drawStats();

	awards.render();

}

function drawStats() {
	renderer.context.fillStyle = "#AAA";

	for (let i = 0; i < stats.length; i++) {
		renderer.context.fillText(stats[i], renderer.canvas.width * 0.45, renderer.canvas.height * 0.6 + 16 * i);
	}
}

const entities = [];
let stats = [];
let victory = false
let totalEnemies = 0;
let start_time = 0;
let infested = 0;
function initializeGame() {
	start_time = performance.now();
	infested = 0;
	victory = false;
	stats.length = 0;

	entities.length = 0;

	entities.push(
		new Parasite(528),

		new Prisoner(503, Math.PI),
		new Pistol(438, Math.PI * 0.5),
		new Pistol(566, Math.PI * 1.5),

		new Prisoner(68, Math.PI),
		new Prisoner(76, Math.PI),
		new Prisoner(189, Math.PI),
		new Prisoner(829, Math.PI),
		new Prisoner(909, Math.PI),

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
		if (!countEnemy(entity)) { continue; }
		total++;
	}

	return total;
}

function countEnemy(entity) {
	return entity.faction_type === FACTION_TYPE.ENEMY && entity.entity_type !== ENTITY_TYPE.PROJECTILE;
}

function start() {
	lastTime = performance.now();
	loop(lastTime);
}

function checkGameOver() {

	let playerAlive = false;
	let prisoners = 0;
	let free = 0;
	let enemies = 0;
	for (let i = 0; i < entities.length; i++) {
		const entity = entities[i];

		if (entity.player) { playerAlive = true; }

		if (entity.entity_type === ENTITY_TYPE.PRISONER) {
			prisoners++;
			if (entity.free) {
				free++;
			}
		}

		if (countEnemy(entity)) {
			enemies++;
		}
	}

	victory = free >= prisoners;
	if (playerAlive && !victory) { return; }

	playing = false;

	stats = [
		`KILLS: ${totalEnemies - enemies}/${totalEnemies}`,
		`RESCUED: ${free}/${prisoners}`,
	];

	awards.stale();

	if (!victory) { return; }

	const finish_time = performance.now() - start_time;

	awards.set("award_victory", finish_time);

	if (enemies === totalEnemies) {
		awards.set("award_mercy", finish_time);
	}

	if (enemies === 0) {
		awards.set("award_justice", finish_time);
	}

	if (infested === totalEnemies) {
		awards.set("award_contagion", finish_time);
	}

	awards.save();

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

	const deltaTime = time - lastTime;
	lastTime = time;

	requestAnimationFrame(loop);

	if (title) {
		if (input.mouse.left) {
			title = false;
			flickering = true;
			awards.select(input.mouse.position);
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
			awards.select(input.mouse.position);
			return;
		}

		drawBlank();
		drawGameOver();

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

		checkGameOver();

		accumulator -= fixedStep;
	}

	music.update(deltaTime);
	render(entities);

}
