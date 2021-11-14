"use strict";

let audioContext;

const soundscape = {};

let loaded = 0;
soundscape.load = function (callback) {
	audioContext = new AudioContext();

	const leftPan = audioContext.createStereoPanner();
	leftPan.pan.value = 0;
	leftPan.connect(audioContext.destination);
	soundscape.leftPan = leftPan;

	const rightPan = audioContext.createStereoPanner();
	rightPan.pan.value = 0;
	rightPan.connect(audioContext.destination);
	soundscape.rightPan = rightPan;

	const splitter = audioContext.createChannelSplitter(2);
	splitter.connect(leftPan, 0);
	splitter.connect(rightPan, 1);
	soundscape.splitter = splitter;

	const filter = audioContext.createBiquadFilter();
	filter.frequency.value = 400;
	filter.connect(splitter);
	soundscape.filter = filter;

	sounds.load(soundPaths, () => {
		if (++loaded === 2) { callback(); }
	});

	music.load(musicPaths, () => {
		if (++loaded === 2) { callback(); }
	});
};
