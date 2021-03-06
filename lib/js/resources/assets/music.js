"use strict";

const music = {};

music.cache = {};
music.intensity = INTENSITY.HIGH;
music.chordIndex = 0;
music.beatIndex = 0;
music.isPlaying = false;
music.time = 0;
music.onChordChange = new Signal();
music.onBeat = new Signal();
music.sounds = [];

music.load = function (paths, callback) {
	let total = 0;
	for (let i = 0; i < paths.length; i++) {
		const path = paths[i];
		const key = path.match(/[ \w-]+?(?=\.)/);

		fetch(path)
		.then(data => data.arrayBuffer())
		.then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
		.then(decodedAudio => {
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

music.stop = function () {
	if (!this.isPlaying) { return; }

	this.chordIndex = 0;
	this.beatIndex = 0;
	this.isPlaying = false;
	this.time = 0;

	for (let i = 0; i < this.sounds.length; i++) {
		const sound = this.sounds[i];

		sound.stop();
	}

	this.sounds.length = 0;
}

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
		const gainNode = audioContext.createGain();
		gainNode.gain.value = 0.2;


		sound.buffer = this.cache[soundKey];
		gainNode.connect(soundscape.filter);
		sound.connect(gainNode);
		sound.start();

		this.sounds.push(sound);
	}
};
