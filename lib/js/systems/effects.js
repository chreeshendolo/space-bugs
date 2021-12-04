"use strict";

function effects(entities, dt) {
	for (let i = 0; i < entities.length; i++) {
		const entity = entities[i];

		for (let ii = 0; ii < entity.effects.length; ii++) {
			EFFECTS[entity.effects[ii]](entity, dt);
		}

		for (let ii = 0; ii < entity.add_effects.length; ii++) {
			const effectType = entity.add_effects[ii];
			if (entity.effects.indexOf(effectType) >= 0) { continue; }
			entity.effects.push(effectType);
		}

		entity.add_effects.length = 0;

		for (let ii = 0; ii < entity.remove_effects.length; ii++) {
			const effect_type = entity.remove_effects[ii];
			entity.effects.splice(entity.effects.indexOf(effect_type), 1);
		}

		entity.remove_effects.length = 0;

	}
}
