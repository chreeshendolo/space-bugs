"use strict";

const BEATS_PER_MINUTE = 120;
const BEATS_PER_BAR = 4;
const BARS_PER_CHORD = 4;
const MS_PER_BEAT = (1 / BEATS_PER_MINUTE) * 60 * 1000;
const MS_PER_CHORD = MS_PER_BEAT * BEATS_PER_BAR * BARS_PER_CHORD;

const MUSIC_TRACKS = 2;
const MUSIC_CHORDS = [
	["G", "Bb", "D"],
	["Eb", "G", "Bb"],
	["Bb", "D", "F"],
	["F", "A", "C"],
];
const MUSIC_PARTS = ["pad", "bass", "perc"];

const music = {};

music.cache = [];
music.currentTrackIdx = 0;
music.chordIndex = 0;
music.isPlaying = false;
music.time = 0;

music.load = function (path, callback) {
	let total = 0;
	for (let i = 0; i < MUSIC_TRACKS; i++) {
		const musicTrack = new Audio(path);

		musicTrack.addEventListener('canplaythrough', (event) => {
			if (++total < MUSIC_TRACKS) { return; }
			callback();
		});

		this.cache.push(musicTrack);
	}
};

music.play = function () {
    if (this.isPlaying) { return; }

    this.cache[this.currentTrackIdx].play();
    this.isPlaying = true;
};

music.update = function (deltaTime) {
    if (this.isPlaying) {
		this.time += deltaTime;

        // hacky but necessary at the moment for a smooth loop in music
        const resetTime = this.chordIndex === 3 ? MS_PER_CHORD - 70 : MS_PER_CHORD;

		if (this.time >= resetTime) {
			this.chordIndex++;
			this.time = 0;

            if (this.chordIndex === 4) {
                this.currentTrackIdx = this.currentTrackIdx === 0 ? 1 : 0;
                this.chordIndex = 0;

                this.cache[this.currentTrackIdx].play();
            }

            this.onChordChange.emit(this.chordIndex);
		}
	}
}

music.onChordChange = new Signal();
