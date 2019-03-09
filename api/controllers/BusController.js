/**
 * BusController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  // vote: (req, res, busaux) => {
  //   let modeloId = req.param('modeloId'), userId = req.param('userId'), action = req.param('action');
  //   sails.models.bus.findOne(modeloId)
  //     .then(coop => {
  //       busaux = coop;
  //       return sails.models.user.findOne(userId);
  //     })
  //     .then(user => {
  //       let promises = [];
  //       if(action === 'like') {
  //         promises.push(Bus.addToCollection(modeloId, 'users', userId));
  //         promises.push(sails.models.bus.update({id: modeloId}).set({likes: busaux.likes + 1}));
  //       }
  //       else {
  //         promises.push(Bus.removeFromCollection(modeloId, 'users', userId));
  //         promises.push(sails.models.bus.update({id: modeloId}).set({likes: busaux.likes - 1}));
  //       }
  //       return Promise.all(promises);
  //     })
  //     .then(() => {
  //       res.json({msg: 'done!'});
  //     })
  //     .catch((e) => {
  //       res.serverError(e);
  //     });
  // }

};

