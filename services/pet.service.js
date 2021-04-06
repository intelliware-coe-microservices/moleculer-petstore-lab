"use strict";

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
	name: "pet",

	/**
	 * Settings
	 */
	settings: {

	},

	/**
	 * Dependencies
	 */
	dependencies: [],

	/**
	 * Actions
	 */
	actions: {

		/**
		 * Find pet by petId
		 *
		 * @param {Number} petId - The pet's unique identifier
		 */
		getPet: {
			rest: "/:petId",
            params: {
                petId: { type: "number", positive: true, integer: true }
            },
			/** @param {Context} ctx  */
			async handler(ctx) {
                const petId = parseInt(ctx.params.petId);
                if (!this.pets.has(petId)) {
                    ctx.meta.$statusCode = 404;
                    ctx.meta.$statusMessage = 'Pet with id ' + petId + ' not found';
                    return;
                }
				return this.pets.get(petId);
			}
		}
	},

	/**
	 * Events
	 */
	events: {

	},

	/**
	 * Methods
	 */
	methods: {

	},

	/**
	 * Service created lifecycle event handler
	 */
	created() {
        this.pets = new Map();
        this.pets.set(123, {id: 123, name: 'Fido'});
	},

	/**
	 * Service started lifecycle event handler
	 */
	async started() {

	},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {

	}
};
