"use strict";

const sounds = {};

sounds.cache = {};

sounds.load = function (paths, callback) {
	let total = 0;
	for (let i = 0; i < paths.length; i++) {
		const path = paths[i];
		const key = path.match(/[ \w-]+?(?=\.)/);

		fetch(path)
		.then(data => data.arrayBuffer())
		.then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
		.then(decodedAudio => {
			this.cache[key] = decodedAudio;

			if (++total < paths.length) { return; }

			callback();
		});
	}
};

sounds.play = function (key) {
	const sound = audioContext.createBufferSource();

	sound.buffer = this.cache[key];
	sound.connect(soundscape.filter);
	sound.start();
};
