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
let splitter;
let leftPan;
let rightPan;
const music = {};

music.cache = {};
music.intensity = INTENSITY.HIGH;
music.chordIndex = 0;
music.beatIndex = 0;
music.isPlaying = false;
music.time = 0;
music.onChordChange = new Signal();
music.onBeat = new Signal();

music.load = function (paths, callback) {
	audioContext = new AudioContext();

	const leftPan = audioContext.createStereoPanner();
	leftPan.pan.value = 0;
	leftPan.connect(audioContext.destination);
	music.leftPan = leftPan;

	const rightPan = audioContext.createStereoPanner();
	rightPan.pan.value = 0;
	rightPan.connect(audioContext.destination);
	music.rightPan = rightPan;

	splitter = audioContext.createChannelSplitter(2);
	splitter.connect(leftPan, 0);
	splitter.connect(rightPan, 1);

	const filter = audioContext.createBiquadFilter();
	filter.frequency.value = 400;
	filter.connect(splitter);
	music.filter = filter;

	let total = 0;
	for (let i = 0; i < paths.length; i++) {
		const path = paths[i];
		const key = path.match(/[ \w-]+?(?=\.)/);

		fetch(path).then(data => data.arrayBuffer()).then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer)).then((decodedAudio) => {
			this.cache[key] = decodedAudio;

			if (++total < paths.length) { return; }
			callback();
		});
	}
};

music.play = function () {
	if (this.isPlaying) { return; }

	this.playTracks();

	this.isPlaying = true;
};

music.update = function (deltaTime) {
	if (this.isPlaying) {
		this.time += deltaTime;

		if (this.time >= MS_PER_BEAT) {
			this.time = 0;
			this.onBeat.emit();

			if (++this.beatIndex === BEATS_PER_BAR * BARS_PER_CHORD) {
				this.beatIndex = 0;

				if (++this.chordIndex === MUSIC_CHORDS.length) { this.chordIndex = 0; }

				this.playTracks();
				this.onChordChange.emit(this.chordIndex);
			}
		}
	}
};

music.playTracks = function () {
	for (let i = 0; i <= this.intensity; i++) {
		const trackKey = MUSIC_TRACKS[i];
		const chordKey = trackKey === "perc" ? "" : MUSIC_CHORDS[this.chordIndex][0];
		const soundKey = trackKey + chordKey;
		const sound = audioContext.createBufferSource();

		sound.buffer = this.cache[soundKey];
		sound.connect(music.filter);
		sound.start();
	}
};
