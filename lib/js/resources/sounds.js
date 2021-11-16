"use strict";

const SOUND_COPIES = 5;

const sounds = {};

sounds.cache = {};

sounds.load = function (paths, callback) {
	let total = 0;
	for (let i = 0; i < paths.length; i++) {
		const path = paths[i];
		const key = path.match(/[ \w-]+?(?=\.)/)[0];
		const sound = this.cache[key] = {};
		sound.copies = [];
		sound.index = 0;

		for (let i = 0; i < SOUND_COPIES; i++) {
			const soundCopy = new Audio(path);
			sound.copies.push(soundCopy);
			soundCopy.addEventListener('canplaythrough', (event) => {
				if (++total < paths.length * SOUND_COPIES) { return; }
				callback();
			});
		}
	}
};

sounds.play = function (key) {
	const sound = this.cache[key];

	sound.index++;
	if (sound.index >= SOUND_COPIES) { sound.index = 0; }

	sound.copies[sound.index].play();
};
