/**
 * Bus.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    placa: {
      type: 'string',
      required: true
    },

    nobus: {
      type: 'string',
      required: true
    },

    frecuencia: {
      type: 'string'
    },

    marca: {
      type: 'string'
    },

    condicion: {
      type: 'string',
    },

    totalVotes: {
      type: 'number',
      defaultsTo: 0
    },

    rating: {
      type: 'number',
      defaultsTo: 0,
    },

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    cooperativa: {
      model: 'cooperativa'
    },

    users: {
      collection: 'user',
      via: 'busesLikes'
    },

    ruta: {
      model: 'ruta',
    },

    denuncias: {
      collection: 'denuncia',
      via: 'bus'
    },
  },
};

