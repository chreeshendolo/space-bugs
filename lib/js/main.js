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
	new Parasite(988),
	new Gunner(984),
	new Gunner(852),
	new Gunner(812),
	new Gunner(700),
	new Gunner(652),
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
