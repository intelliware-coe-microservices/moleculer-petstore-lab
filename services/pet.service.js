"use strict";

const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const mongoose = require("mongoose");

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
	name: "pet",
    mixins: [DbService],
    adapter: new MongooseAdapter("mongodb://localhost/pet-service", { user: 'pet-service', pass: 'pet-service', keepAlive: true }),
    model: mongoose.model("pets", mongoose.Schema({
        _id: { type: Number },
        name: { type: String },
        category: {
            id: { type: Number },
            name: { type: String }
        },
        status: { type: String }
    })),

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
                const petId = ctx.params.petId;
                this.logger.info('Get pet with id ' + petId);
                return this.broker.call('pet.get', { id: petId } );
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
                pet._id = pet.id;
                this.broker.call('pet.create', pet);
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

    },

	/**
	 * Service started lifecycle event handler
	 */
	async started() {
        // this.broker.call('pet.create', {id: 123, name: 'Fido', category: { id: 1, name: 'Dogs'}, status: 'available'});
    },

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {

	}
};
