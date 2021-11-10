"use strict";

input.initialize();
renderer.initialize(960, 540);

const entities = [new Parasite(988), new Gunner(984)];

let tempIdx = 0;
let tempTime = 0;

assets.load(loop);

let lastTime = 0;
function loop(time = 0) {
	requestAnimationFrame(loop);

	// everything below is temporary. just experimenting with sound/music stuff
	const deltaTime = time - lastTime;
	lastTime = time;

	control(entities);
	physics(entities);
	effects(entities, deltaTime);
	render(entities);
	removal(entities);

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
