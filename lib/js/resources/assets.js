"use strict";

const assets = {};

assets.load = function (callback) {
    let loaded = 0;

    images.load(imagePaths, () => {
        if (++loaded === 3) { callback(); }
    });

    sounds.load(soundPaths, () => {
        if (++loaded === 3) { callback(); }
    });

    music.load(musicPath, () => {
        if (++loaded === 3) { callback(); }
    })
};

