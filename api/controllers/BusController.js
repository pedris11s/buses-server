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
      .then(bus => {
        busaux = bus;
        return sails.models.user.findOne(userId);
      })
      .then(() => {
        let promises = [];
        // if(action === 'like') {
          //console.log(busaux.rating);
          //console.log(busaux.rating + 1);
          promises.push(Bus.addToCollection(modeloId, 'users', userId));
          promises.push(sails.models.bus.update({id: modeloId}).set({ 
                        rating: (busaux.sumRating + parseFloat(value)) / (busaux.totalVotes + 1), 
                        totalVotes: busaux.totalVotes + 1,
                        sumRating: busaux.sumRating + parseFloat(value)
          }))
        // }
        // // else {
        //   promises.push(Bus.removeFromCollection(modeloId, 'users', userId));
        //   promises.push(sails.models.bus.update({id: modeloId}).set({likes: busaux.likes - 1}));
        // }
        return Promise.all(promises);
      })
      .then(() => {
        return sails.models.cooperativa.findOne(busaux.cooperativa).populate('buses');
      })
      .then((coop) => {
        console.log(coop);
        console.log("-----")
        console.log(coop.buses);
        let sum = 0, total = 0;
        for(let i = 0; i < coop.buses.length; i++){
          if(coop.buses[i].totalVotes > 0){
            sum += coop.buses[i].rating;
            total++;
            console.log(coop.buses[i].rating)
          }
        }
        let prom = sum / total;
        
        let promises = [];
        promises.push(sails.models.cooperativa.update({id: coop.id}).set({rating: prom}));
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

