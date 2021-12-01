"use strict";

function sound(entities) {
	for (let i = 0; i < entities.length; i++) {
		const entity = entities[i];

		for (let ii = 0; ii < entity.effects.length; ii++) {
			const hasSound = SOUNDS.effectHasSound(entity.effects[ii]);

			if (hasSound) {
				SOUNDS[entity.effects[ii]](entity);
			}
		}

		if (entity.control_type === CONTROL_TYPE.KEYBOARD_AND_MOUSE) {
			SOUNDS[entity.control_type](entity);
		}
	}
};
