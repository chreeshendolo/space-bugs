"use strict";

input.initialize();
renderer.initialize(960, 540);

const entities = [new Parasite()];

let tempIdx = 0;
let tempTime = 0;

assets.load(loop);

let lastTime = 0;
function loop(time = 0) {
	requestAnimationFrame(loop);

	control(entities);
	physics(entities);
	render(entities);

	// everything below is temporary. just experimenting with sound/music stuff
	const deltaTime = time - lastTime;
	lastTime = time;

	if (Object.keys(input.keys).length > 0) { music.play(); }

	tempTime += deltaTime;

	if (input.mouse["left"] && tempTime >= 250) {
		sounds.play(`pickup${MUSIC_CHORDS[music.chordIndex][tempIdx]}`);

		tempIdx++;
		if (tempIdx === 3) { tempIdx = 0; };

		tempTime = 0;
	}

	// player's progression along the page in a value from 0 to 2
	const playerX = entities[0].position[0];
	const intensity = Math.floor((playerX / 960) * 3);
	music.intensity = intensity;

	music.update(deltaTime);
}
