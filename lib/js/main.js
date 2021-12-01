"use strict";

input.initialize();
renderer.initialize(960, 540);

const totalEnemies = 25;

let started = false;
let loaded = false;
images.load(["assets/images/title.png"], start);
assets.load(function () { loaded = true; });

function drawBlank(fillStyle = "#222") {
	renderer.context.resetTransform();
	renderer.context.fillStyle = fillStyle;
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

function drawAwards(mercy, justice) {
	if (mercy) {
		renderer.context.strokeStyle = '#009';
		renderer.context.lineWidth = 15;
		renderer.context.strokeRect(
			renderer.canvas.width * 0.5 - 25,
			renderer.canvas.height * 0.2 - 15,
			50,
			30,
		);
	}

	if (justice) {
		renderer.context.strokeStyle = '#099';
		renderer.context.lineWidth = 15;
		renderer.context.strokeRect(
			renderer.canvas.width * 0.5 - 100,
			renderer.canvas.height * 0.5 - 50,
			200,
			100,
		);
	}
}

const entities = [];

function initializeGame() {
	entities.length = 0;

	entities.push(
		new Parasite(528),
<<<<<<< HEAD
		new Prisoner(1),
		new Prisoner(502, Math.PI),
		new Gunner(566, 0),
		new Sniper(438, 0),
		// new Gunner(566, Math.PI * 1.5),
		// new Sniper(438, Math.PI * 0.5),
=======

		new Prisoner(502, Math.PI),

		new Pistol(566, Math.PI * 1.5),
		new Pistol(438, Math.PI * 0.5),

>>>>>>> e083af816ba49187dbb6fe372e56cc556917d1c1
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
}


function start() {
	lastTime = performance.now();
	loop(lastTime);
}

let playing = false;
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

			return;
		}

		if (Math.sin(flickerRemaining * 0.1) > 0) {
			drawTitle();
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
			return;
		}

		let fillStyle = "#222";
		let enemiesKilled = totalEnemies - (entities.length - 2);
		let mercy = false;
		let justice = false;

		if (enemiesKilled === 0) {
			mercy = true;
			fillStyle = "#ddd";
		}

		if (enemiesKilled === totalEnemies) {
			justice = true;
			fillStyle = "#800";
		}

		drawBlank(fillStyle);
		drawTitle();
		drawAwards(mercy, justice);
		return;
	}

	accumulator += Math.min(deltaTime, maxStep);

	while (accumulator > fixedStep) {
		control(entities);
		physics(entities);
		sound(entities);
		effects(entities, fixedStep);
		removal(entities);

		accumulator -= fixedStep;
	}

	music.update(deltaTime);
	render(entities);

}
