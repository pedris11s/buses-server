let request = require('supertest');
let chai = require('chai');

let expect = chai.expect;

describe('User Update', () => {
  let agent;
  let newUser = {};

  before((done) => {
    agent = request.agent(sails.hooks.http.app);

    sails.services.repository.user.createUser({username: 'update', email: 'algo@gmail.com', password: '1234567890'})
      .then((user) => {
        newUser = user;
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  describe("after login (admin)", () => {
    let token;

    before((done) => {
      agent.post('/api/auth/local').send({password: 'admin1234'}).send({identifier: 'admin'})
        .expect(200)
        .then((res) => {
          token = res.body.autologinToken;
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('Update username', (done) => {
      agent
        .post('/api/user/updateUser')
        .set('token', token)
        .send({username: 'userUpdated'})
        .send({email: newUser.email})
        .send({id: newUser.id})
        .send({imageRealName: ''})
        .expect(200)
        .then((res) => {
          expect(res.body, 'The response is not true').to.be.true;
          if (res.body) {
            return sails.services.repository.user.getUserById(newUser.id);
          } else {
            return Promise.reject(new Error('invalid data'));
          }
        })
        .then((user) => {
          expect(user.username, 'The username was not updated').to.equal('userUpdated');
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('Update profile', (done) => {
      agent
        .post('/api/user/updateProfile')
        .set('token', token)
        .send({id: newUser.id})
        .send({name: 'paco'})
        .send({lastName: 'pacote'})
        .send({pageLanguage: 'en'})
        .expect(200)
        .then((res) => {
          expect(res.body.name, 'The username was not updated').to.equal('paco');
          expect(res.body.lastName, 'The username was not updated').to.equal('pacote');
          expect(res.body.pageLanguage, 'The username was not updated').to.equal('en');
          return sails.services.repository.user.getUserById(newUser.id);
        })
        .then((user) => {
          expect(user.name, 'The username was not updated').to.equal('paco');
          expect(user.lastName, 'The username was not updated').to.equal('pacote');
          expect(user.pageLanguage, 'The username was not updated').to.equal('en');
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('Update email', (done) => {
      agent
        .post('/api/user/updateUser')
        .set('token', token)
        .send({username: newUser.username, email: 'newemail@gmail.com', id: newUser.id, imageRealName: ''})
        .then((data) => {
          expect(data.body, 'The response is not true').to.be.true;
          if (data.body) {
            // check that the user was updated
            return sails.services.repository.user.getUserById(newUser.id);
          } else {
            return Promise.reject(new Error('invalid data'));
          }
        })
        .then((user) => {
          expect(user.email, 'The email was not updated').to.equal('newemail@gmail.com');
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe("after login (ordinary user)", () => {
    let token;
    before((done) => {
      sails.services.repository.user.createUser(
        {
          username: 'ordinary',
          email: 'ordinary@gmail.com',
          accountIsVerify: true,
          password: '1234567890'
        })
        .then(() => {
          return agent
            .post('/api/auth/local')
            .send({password: '1234567890'})
            .send({identifier: 'ordinary@gmail.com'})
            .expect(200);
        })
        .then((res) => {
          token = res.body.autologinToken;
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('Update profile', (done) => {
      agent
        .post('/api/user/updateProfile')
        .send({id: newUser.id})
        .send({name: 'paco'})
        .send({lastName: 'pacote'})
        .send({pageLanguage: 'en'})
        .set('token', token)
        .expect(200)
        .then((res) => {
          expect(res.body.success).to.be.false;
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('Update username', (done) => {
      agent
        .post('/api/user/updateUser')
        .set('token', token)
        .send({username: 'userUpdated', email: newUser.email, id: newUser.id, imageRealName: ''})
        .expect(200)
        .then((res) => {
          expect(res.body.success).to.be.false;
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('Should update the user password');

  });

  describe("before login", () => {
    it('Try update profile should return status 203', (done) => {
      agent
        .post('/api/user/updateProfile')
        .expect(203)
        .then((res) => {
          expect(res.body.error).to.equal(203);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('Update username', (done) => {
      agent
        .post('/api/user/updateUser')
        .expect(203)
        .then((res) => {
          expect(res.body.error).to.equal(203);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });


});
