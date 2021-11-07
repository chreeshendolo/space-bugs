"use strict";

const BEATS_PER_MINUTE = 120;
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

const music = {};

music.cache = {};
music.intensity = INTENSITY.MEDIUM;
music.chordIndex = 0;
music.beatIndex = 0;
music.isPlaying = false;
music.time = 0;
music.onChordChange = new Signal();
music.onBeat = new Signal();

music.load = function (paths, callback) {
	let total = 0;
	for (let i = 0; i < paths.length; i++) {
		const path = paths[i];
		const key = path.match(/[ \w-]+?(?=\.)/);
		const sound = this.cache[key] = {};
		sound.copies = [];
		sound.index = 0;
		sound.isPlaying = false;

		for (let i = 0; i < TRACK_COPIES; i++) {
			const soundCopy = new Audio(path);
			sound.copies.push(soundCopy);
			soundCopy.addEventListener('canplaythrough', (event) => {
				if (++total < paths.length * TRACK_COPIES) { return; }
				callback();
			});
		}
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

		if (this.time >= MS_PER_BEAT - 4) { // where are these 4 milliseconds coming from? find a way to get a smoother loop
			this.time = 0;
			this.onBeat.emit();

			if (++this.beatIndex === BEATS_PER_BAR * BARS_PER_CHORD) {
				this.beatIndex = 0;

				if (++this.chordIndex === MUSIC_CHORDS.length) { this.chordIndex = 0; }

				this.bumpTrackCopies();
				this.playTracks();
				this.onChordChange.emit(this.chordIndex);
			}
		}
	}
};

music.playTracks = function () {
	for (let i = 0; i < this.intensity + 1; i++) {
		const trackKey = MUSIC_TRACKS[i];
		const chordKey = trackKey === "perc" ? "" : MUSIC_CHORDS[this.chordIndex][0];
		const soundKey = trackKey + chordKey;
		const sound = this.cache[soundKey];
		const soundCopy = sound.copies[sound.index];

		soundCopy.play();
		sound.isPlaying = true;
	}
};

music.bumpTrackCopies = function () {
	for (let i = 0; i < MUSIC_TRACKS.length; i++) {
		const trackKey = MUSIC_TRACKS[i];
		const chordKey = trackKey === "perc" ? "" : MUSIC_CHORDS[this.chordIndex][0];
		const soundKey = trackKey + chordKey;
		const sound = this.cache[soundKey];

		if (sound.isPlaying) {
			sound.index = sound.index === 0 ? 1 : 0;
		}
	}
}
