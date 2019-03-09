/**
 * CooperativaController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  
  // vote: (req, res, coopaux) => {
  //   let modeloId = req.param('modeloId'), userId = req.param('userId'), action = req.param('action');
  //   sails.models.cooperativa.findOne(modeloId)
  //     .then(coop => {
  //       coopaux = coop;
  //       return sails.models.user.findOne(userId);
  //     })
  //     .then(user => {
  //       let promises = [];
  //       if(action === 'like') {
  //         promises.push(Cooperativa.addToCollection(modeloId, 'users', userId));
  //         promises.push(sails.models.cooperativa.update({id: modeloId}).set({likes: coopaux.likes + 1}));
  //       }
  //       else {
  //         promises.push(Cooperativa.removeFromCollection(modeloId, 'users', userId));
  //         promises.push(sails.models.cooperativa.update({id: modeloId}).set({likes: coopaux.likes - 1}));
  //       }
  //       return Promise.all(promises);
  //     })
  //     .then(() => {
  //       res.json({msg: 'done!'});
  //     })
  //     .catch((e) => {
  //       res.serverError(e);
  //     });
  // },

  // likesById: (req, res, next) => {
  //   sails.models.cooperativa.find(req.param('id'))
  //     .then(coop => {
  //       res.json({likes: coop.likes});
  //     })
  //     .catch(err => {
  //       res.serverError(err);
  //     });
  // }
};

