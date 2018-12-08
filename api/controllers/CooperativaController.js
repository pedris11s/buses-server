/**
 * CooperativaController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  
  vote: (req, res, coopaux) => {
    let coopId = req.param('coopId'), userId = req.param('userId'), action = req.param('action');
    sails.models.cooperativa.findOne(coopId)
      .then(coop => {
        coopaux = coop;
        return sails.models.user.findOne(userId);
      })
      .then(user => {
        let promises = [];
        if(action === 'like') {
          promises.push(Cooperativa.addToCollection(coopId, 'users', userId));
          promises.push(sails.models.cooperativa.update({id: coopId}).set({likes: coopaux.likes + 1}));
        }
        else {
          promises.push(Cooperativa.removeFromCollection(coopId, 'users', userId));
          promises.push(sails.models.cooperativa.update({id: coopId}).set({likes: coopaux.likes - 1}));
        }
        return Promise.all(promises);
      })
      .then(() => {
        res.json({msg: 'done!'});
      })
      .catch((e) => {
        res.serverError(e);
      });
  }
};

