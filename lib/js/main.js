"use strict";

(function () {
	// trying to implement a ray caster
	const a = [0, 0];
	const b = [4, 4];

	const c = [0, 4];
	const d = [4, 0];

	const s = (a[0] - c[0]) * (d[1] - c[1]) - (a[1] - c[1]) * (d[0] - c[0]) / (b[1] - a[1]) * (d[0] - c[0]) - (b[0] - a[0]) * (d[1] - c[1]);

	const r = (c[1] - a[1]) * (b[0] - a[0]) - (c[0] - a[0]) * (b[1] - a[1]) / (d[0] - c[0]) * (b[1] - a[1]) - (d[1] - c[1]) * (b[0] - a[0]);

	const ap = [(b[0] - a[0]) * s, (b[1] - a[1]) * s];
	const cp = [(d[0] - c[0]) * r, (d[1] - c[1]) * r];

	console.log(s, r)

})();

input.initialize();
renderer.initialize(960, 540);

assets.load(start);

const entities = [
	new Parasite(988),
	new Gunner(984),
	// new Gunner(852),
	// new Gunner(812),
	// new Gunner(700),
	// new Gunner(652),
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

	render(entities);

	requestAnimationFrame(loop);

	// everything below is temporary. just experimenting with sound/music stuff
	if (input.interacted) { music.play(); }

	tempTime += deltaTime;

	if (input.mouse["left"] && tempTime >= 250) {
		sounds.play(`pickup${MUSIC_CHORDS[music.chordIndex][tempIdx]}`);

		tempIdx++;
		if (tempIdx === 3) { tempIdx = 0; };

		tempTime = 0;
	}

	// player's progression along the page in a value from 0 to 2
	const playerX = entities[0].position[0];
	const intensity = Math.floor((playerX / 960) * 3) % 3;
	music.intensity = intensity;

	music.update(deltaTime);
}
