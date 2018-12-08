/**
 * Cooperativa.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    nombre: {
      type: 'string',
      required: true
    },

    pais: {
      type: 'string',
      required: true
    },

    provincia: {
      type: 'string',
      required: true
    },

    ciudad: {
      type: 'string',
      required: true
    },

    parroquia: {
      type: 'string',
      required: true
    },

    tipo: {
      type: 'string',
      required: true
    },

    modalidad: {
      type: 'string',
      required: true
    },

    likes: {
      type: 'number',
      defaultsTo: 0
    },


    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    rutas: {
      collection: 'ruta',
      via: 'cooperativas'
    },

    buses: {
      collection: 'bus',
      via: 'cooperativa'
    },

    oficina: {
      model: 'oficina'
    },

    users: {
      collection: 'user',
      via: 'coopsLikes'
    },


  },

};

