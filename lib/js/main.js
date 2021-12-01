"use strict";

input.initialize();
renderer.initialize(960, 540);

let started = false;
document.addEventListener("click", () => {
	if (started) { return; }

	assets.load(() => {
		music.play();
		start();
	});

	started = true;
})

const entities = [
	new Parasite(528),
	new Gunner(566, Math.PI * 1.5),
	new Gunner(438, Math.PI * 0.5),
	new Gunner(93, Math.PI * 0.5),
	new Gunner(186, 0),
	new Gunner(146, 0),
	new Gunner(53, Math.PI * 0.5),
	new Gunner(141, Math.PI * 1.5),
	new Gunner(105, 0),
	new Gunner(66, Math.PI * 0.5),
	new Gunner(132, Math.PI),
	new Gunner(585, Math.PI),
	new Gunner(578, Math.PI * 1.5),
	new Gunner(386, 0),
	new Gunner(358, Math.PI),
	new Gunner(770, 0),
	new Gunner(866, Math.PI * 1.5),
	new Gunner(804, Math.PI * 1.5),
	new Gunner(816, Math.PI * 0.5),
	new Gunner(944, Math.PI),
	new Gunner(906, 0),
	new Gunner(922, Math.PI * 1.5),
	new Gunner(953, Math.PI),
	new Gunner(955, 0),
	new Gunner(669, Math.PI),
	new Gunner(634, 0),
];

function start() {
	lastTime = 0;
	loop(lastTime);
}

const fixedStep = 16;
const maxStep = 100;
let tempIdx = 0;
let tempTime = 0;
let lastTime = 0;
let accumulator = 0;
function loop(time) {

	const deltaTime = time - lastTime;
	lastTime = time;

	accumulator += Math.min(deltaTime, maxStep);

	while (accumulator > fixedStep) {
		control(entities);
		physics(entities);
		effects(entities, fixedStep);
		removal(entities);

		accumulator -= fixedStep;
	}

	music.update(deltaTime);
	render(entities);

	requestAnimationFrame(loop);
}
