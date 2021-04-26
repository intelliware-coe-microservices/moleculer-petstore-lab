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
                petId: { type: "string", positive: true, integer: true }
            },
			/** @param {Context} ctx  */
			async handler(ctx) {
                const petId = parseInt(ctx.params.petId);
                this.logger.info('Get pet with id ' + petId);
                if (!this.pets.has(petId)) {
                    ctx.meta.$statusCode = 404;
                    ctx.meta.$statusMessage = 'Pet with id ' + petId + ' not found';
                    return;
                }
				return this.pets.get(petId);
			}
		},
        addPet: {
            rest: "POST /",
            params: {
                id: { type: 'number', positive: true, integer: true },
                name: { type: 'string'},
                category: {
                    $$type: "object",
                    id: { type: 'number', positive: true, integer: true },
                    name: { type: 'string'}
                },
                // leave out photoUrls and tags for now
                status: { type: 'enum', values: ['available', 'pending', 'sold']}
            },
			/** @param {Context} ctx  */
			async handler(ctx) {
                const pet = ctx.params;
                this.logger.info('Adding pet ' + JSON.stringify(pet));
                this.pets.set(pet.id, pet);
                this.broker.broadcast('pet.created', pet);
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
        this.pets.set(123, {id: 123, name: 'Fido', category: { id: 1, name: 'Dogs'}, status: 'available'});
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
