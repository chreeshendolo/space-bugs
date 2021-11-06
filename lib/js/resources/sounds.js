"use strict";

const sounds = {};

sounds.cache = {};

sounds.load = function (paths, callback) {
	let total = 0;
	for (let i = 0; i < paths.length; i++) {
		const path = paths[i];
		const sound = new Audio(path);

		sound.addEventListener('canplaythrough', (event) => {
			if (++total < paths.length) { return; }
			callback();
		});

		const key = path.match(/[ \w-]+?(?=\.)/);
		this.cache[key] = sound;
	}
};

sounds.get = function (key) {
	return this.cache[key];
};