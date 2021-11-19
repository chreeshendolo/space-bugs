"use strict";

const BEATS_PER_MINUTE = 121;
const BEATS_PER_BAR = 4;
const BARS_PER_CHORD = 4;
const MS_PER_BEAT = (1 / BEATS_PER_MINUTE) * 60 * 1000;
const MS_PER_CHORD = MS_PER_BEAT * BEATS_PER_BAR * BARS_PER_CHORD;

const TRACK_COPIES = 2;

const MUSIC_CHORDS = [
	["G", "Bb", "D"],
	["Eb", "G", "Bb"],
	["Bb", "D", "F"],
	["F", "A", "C"],
];

const MUSIC_TRACKS = ["pad", "bass", "perc"];

const INTENSITY = {
	LOW: 0,
	MEDIUM: 1,
	HIGH: 2,
}

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

soundscape.shoot = function () {
	sounds.play("pickupA");
};
