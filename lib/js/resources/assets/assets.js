"use strict";

const assets = {};

assets.load = function (callback) {
	let loaded = 0;

	images.load(imagePaths, () => {
		if (++loaded === 2) { callback(); }
	});

	soundscape.load(() => {
		if (++loaded === 2) { callback(); }
	})
};
