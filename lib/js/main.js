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
	new Parasite(956),
	new Gunner(952),
	new Gunner(820),
	new Gunner(780),
	new Gunner(668),
	new Gunner(620),
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
