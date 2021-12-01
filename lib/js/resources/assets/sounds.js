"use strict";

let crawlingSound;
let walkingSound;

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

sounds.play = function (key, gain = 1) {
	const sound = audioContext.createBufferSource();
	const gainNode = audioContext.createGain();
	gainNode.gain.value = gain;

	sound.buffer = this.cache[key];

	gainNode.connect(soundscape.filter);
	sound.connect(gainNode);
	sound.start();
};

sounds.crawl = function (moving) {
	if (moving) {
		if (crawlingSound !== undefined) { return; }

		crawlingSound = audioContext.createBufferSource();
		crawlingSound.buffer = sounds.cache["crawl"];
		crawlingSound.connect(soundscape.filter);
		crawlingSound.loop = true;
		crawlingSound.start();
	} else {
		if (crawlingSound === undefined) { return; }

		crawlingSound.stop();
		crawlingSound = undefined;
	}
}

sounds.walk = function (moving) {
	if (moving) {
		if (walkingSound !== undefined) { return; }

		walkingSound = audioContext.createBufferSource();
		walkingSound.buffer = sounds.cache["walk"];
		walkingSound.connect(soundscape.filter);
		walkingSound.loop = true;
		walkingSound.start();
	} else {
		if (walkingSound === undefined) { return; }

		walkingSound.stop();
		walkingSound = undefined;
	}
}
