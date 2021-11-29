"use strict";

const Parasite = (function () {

	function Parasite(index) {

		this.player = true;

		this.vision_radius = 128;
		this.vision_width = this.vision_radius * 2;
		this.vision_height = this.vision_radius * 2;

		this.max_health = 1;
		this.health = this.max_health;

		this.faction_type = FACTION_TYPE.PLAYER;

		this.entity_type = ENTITY_TYPE.PARASITE;
		this.collision_mask = ENTITY_TYPE.CREATURE;

		this.position = grid.indexPosition(index);
		this.velocity = vec2.create();
		this.angle = 0;

		this.radius = 16;
		this.width = this.radius * 2;
		this.height = this.radius * 2;

		this.speed = 9;

		this.control_type = CONTROL_TYPE.KEYBOARD_AND_MOUSE;

		this.render_type = RENDER_TYPE.SPRITE;
		this.sprite = "player";

		this.primary_action = EFFECT_TYPE.LUNGE;
		this.weapon_type = WEAPON_TYPE.LUNGE;

		this.remove = false;

		this.effects = [EFFECT_TYPE.MORTAL, EFFECT_TYPE.HIGHTEN_SOUND];
		this.remove_effects = [];
	}

	return Parasite;
})();
