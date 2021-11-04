"use strict";

const assets = {};

assets.images = {};

assets.loadImages = function (paths, callback) {
	let total = 0;
	for (let i = 0; i < paths.length; i++) {
		const path = paths[i];
		const image = new Image();
		image.src = path;

		image.onload = function () {
			if (++total < paths.length) { return; }
			callback();
		};

		const key = path.match(/[ \w-]+?(?=\.)/);
		this.images[key] = image;
	}
};

assets.getImage = function (key) {
	return this.images[key];
};
