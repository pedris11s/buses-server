/**
 * BusController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  vote: (req, res, busaux) => {
    let modeloId = req.param('modeloId'), userId = req.param('userId'), action = req.param('action'), value = req.param('value');
    sails.models.bus.findOne(modeloId)
      .then(coop => {
        busaux = coop;
        return sails.models.user.findOne(userId);
      })
      .then(user => {
        let promises = [];
        // if(action === 'like') {
          //console.log(busaux.rating);
          //console.log(busaux.rating + 1);
          promises.push(Bus.addToCollection(modeloId, 'users', userId));
          promises.push(sails.models.bus.update({id: modeloId}).set({ 
                        rating: (busaux.sumRating + parseInt(value)) / (busaux.totalVotes + 1), 
                        totalVotes: busaux.totalVotes + 1,
                        sumRating: busaux.sumRating + parseInt(value)
          }))
        // }
        // // else {
        //   promises.push(Bus.removeFromCollection(modeloId, 'users', userId));
        //   promises.push(sails.models.bus.update({id: modeloId}).set({likes: busaux.likes - 1}));
        // }
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

