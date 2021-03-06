"use strict";

const images = {};

images.cache = {};

images.load = function (paths, callback) {
	let total = 0;
	for (let i = 0; i < paths.length; i++) {
		const path = paths[i];
		const image = new Image();
		image.src = path;

		image.onload = function () {
			if (++total < paths.length) { return; }
			callback();
		};

		const key = path.match(/[ \w-]+?(?=\.)/)[0];
		this.cache[key] = image;
	}
};

images.get = function (key) {
	return this.cache[key];
};
