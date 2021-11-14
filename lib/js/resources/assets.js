"use strict";

const assets = {};

assets.load = function (callback) {
	let loaded = 0;

	images.load(imagePaths, () => {
		if (++loaded === 2) { callback(); }
	});

	// sounds.load(soundPaths, () => {
	// 	if (++loaded === 3) { callback(); }
	// });

	music.load(musicPaths, () => {
		if (++loaded === 2) { callback(); }
	});
};
