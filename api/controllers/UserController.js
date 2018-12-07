import _ from 'lodash';

/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

// noinspection JSUnusedGlobalSymbols, JSUnusedLocalSymbols
_.merge(exports, {
  getFlash: (req, res) => {
    return res.json({msg: req.getFlash('success')});
  },

  /**
   * Verify account from mail link after the register
   */
  verifyAccount: (req, res) => {
    let verification = req.param('verify_token');

    sails.log('UserController.js', 'verification token ' + verification);
    // sails.log.info(req.param.toString());

    // Find the user and throw and exception if the user not exist or activate the user
    sails.models.user.findOne({verifyToken: verification})
      .then((user) => {
        if (user) {
          return sails.models.user.update({id: user.id}, {accountIsVerify: true});
        } else {
          return Promise.reject(new Error('no user with that token'));
        }
      })
      .then(() => {
        req.addFlash('success', 'Registered');
        return res.redirect('/');
      })
      .catch((err) => {
        sails.log.error(err);
        sails.log('UserController.js', 'no user with that token');
        res.json({message: 'no user with that token'});
      });
  },

  addUser: function (req, res) {
    sails.services.repository.user.createUser(
      {
        username: req.body['username'],
        email: req.body['email'],
        imageRealName: req.body['image']
      })
      .then((user) => {
        res.json({idUser: user.id});
      })
      .catch((err) => {
        sails.log.error('UserController.js', err);
        res.serverError();
      });
  },

  list: function (req, res) {
    sails.models.user.find().populate('role').exec((err, users) => {
      //console.log(users);
      if (!err) {
        res.json({users: users});
      }
    });
  },
  updateAccountVerify: function (req, res) {
    sails.services.repository.user.getUserByEmail(req.body.email)
      .then((user) => {
        User.update(user.id, {accountIsVerify: req.body.setAccountVerify});
      })
      .catch((err) => {
        sails.log.error('UserController.js', err);
        res.serverError();
      });
  },
  updateRole: function (req, res) {
    sails.models.user.findOne({email: req.body.email}).exec((err, user) => {
      if (err) {
        return sails.log.error('UserController.js', err);
      }
      sails.models.role.findOne({name: req.body.role}).exec((err, role) => {
        if (err) {
          return sails.log.error('UserController.js', err);
        }
        if (req.body.value) {
          User.addToCollection(user.id, 'roles', role.id);
        } else {
          User.removeFromCollection(user.id, 'roles', role.id);
        }
      });
    });
  },
  // toDo: guille, 5/3/18 replace for the blueprint action (auto generate rest api)
  findUserById: (req, res) => {
    sails.models.user.findOne({
      id: req.param('userId')
    }).exec((err, user) => {
      if (err) {
        return sails.log.error('UserController.js', err);
      }
      res.json({user: user});
    });
  },
  updateUser: function (req, res) {
    sails.services.repository.user.checkUserData(req.body.username, req.body.email)
      .then((users) => {
        return Promise.all([
          sails.services.repository.user.getUserById(req.body.id),
          Promise.resolve(users)
        ]);
      })
      .then((data) => {
        let user = data[0];
        let usersBefore = data[1];

        if (usersBefore) {
          for (let i = 0; i < usersBefore.length; i++) {
            if (usersBefore[i].id !== user.id) {
              if (usersBefore[i].email === user.email) {
                res.json({type: 'Email', data: req.body.email});
              } else if (usersBefore[i].username === user.username) {
                res.json({type: 'UserName', data: req.body.username});
              } else {
                res.serverError();
              }
              return Promise.reject(new Error());
            }
          }
        }
        return sails.services.repository.user.updateUser({
          id: user.id,
          username: req.body.username,
          email: req.body.email,
          imageRealName: req.body.imageRealName});
      })
      .then((user) => {
        if (user) {
          res.json(true);
        } else {
          res.serverError();
        }
      })
      .catch((err) => {
        if (err.message !== 'ignore') {
          sails.log.error('UserController.js', err);
          res.serverError();
        }
      });
  },
  deleteUser: function (req, res) {
    sails.models.user.destroy({id: req.param('idUser')}).exec((err) => {
      if (err) {
        sails.log.error('UserController.js', err);
      }
      res.json({success: true, msg: 'The user was erased'});
    });
  },
  getCourses: function (req, res) {
    sails.models.user.findOne({
      id: req.body['id']
    }).populate('courses').exec((err, user) => {
      if (err) {
        return sails.log.error('UserController.js', err);
      }
      return res.json({user: user});
    });
  },

  currentUser: (req, res) => {
    sails.services.repository.user.getUserById(req.user.id)
      .populate('roles')
      .then((user) => {
        user = sails.services.repository.user.cleanUser(user);
        res.json(user);
      })
      .catch((err) => {
        sails.log.error('UserController.js', err);
        res.serverError();
      });
  },

  updateProfile: function (req, res) {
    // noinspection JSUnusedLocalSymbols
    if (!req.user) {
      // toDo: guille, 5/7/18 translate
      return res.json({success: false, msg: 'No authenticated user'});
    }
    return sails.models.user.findOne({id: req.user.id}).populate('roles')
      .then((user) => {
        if (user.id !== req.body.id && !sails.services.repository.user.isRoleAdmin(user)) {
          // toDo: guille, 5/7/18 translate
          res.json({success: false, msg: 'The user do not have permission for this action'});
          return Promise.break();
        }
        return sails.models.user.findOne({id: req.body['id']}).populate('roles');
      })
      .then((user) => {
        return sails.services.repository.user.updateUser({
          id: user.id,
          imageRealName: req.body['imageRealName'],
          lastName: req.body['lastName'],
          pageLanguage: req.body['pageLanguage'],
          country: req.body['country'],
          name: req.body['name']
        });
      })
      .then((user) => {
        return sails.services.repository.user.getUserById(user.id)
          .populate('roles');
      })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        if (err) {
          sails.log.error('UserController.js', err);
          res.serverError();
        }
      });
  },
  updateProfilePassword: function (req, res) {
    // noinspection JSUnusedLocalSymbols
    sails.services.repository.user.updateProfilePassword(req, (err, isCorrect) => {
      if (err) {
        return sails.log.error('UserController.js', err);
      } else if (!isCorrect) {
        res.json({msgErrorToken: 'incorrect_password_message'});
      } else {
        res.json(req.user);
      }
    });
  },
  showUser: (req, res) => {
    console.log(req.body);
    res.json();
  }
})
;
