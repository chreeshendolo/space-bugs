"use strict";

// start game only once all assets are loaded. definitely not the right way or place to do this.
const totalAssets = 2;
let loaded = 0;
images.load(["./assets/images/player.png"], () => {
	if (++loaded === totalAssets) {
		loop();
	}
});
sounds.load(["./assets/sounds/laser.mp3", "./assets/sounds/music.wav"], () => {
	if (++loaded === totalAssets) {
		loop();
	}
}), 

input.initialize();
renderer.initialize(960, 540);

const entities = [new Player()];

// why does `time` increase automatically? and by what amount? milliseconds between animation frames?
let _time = 0;
function loop(time = 0) {
	requestAnimationFrame(loop);

	if (input.keys["p"]) {
		sounds.get("music").play();
	}

	// this is very temporary. just wanted to make sure sound was playing in browser.
	// _time++;
	// if (_time % 100 === 0) {
	// 	const sound = sounds.get("laser");
	// 	sound.play();
	// }

	physics(entities);
	render(entities);
}
