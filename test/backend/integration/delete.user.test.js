let request = require('supertest');
let chai = require('chai');

let expect = chai.expect;

describe('User Delete', () => {
  let agent;

  before((done) => {
    agent = request.agent(sails.hooks.http.app);
    done();
  });

  describe("after login (admin)", () => {
    let newUser = {};
    let token;

    before((done) => {
      sails.services.repository.user.createUser(
        {
          username: 'eraseUser1',
          email: 'eraseUser1@gmail.com',
          password: '1234567890'
        })
        .then((user) => {
          newUser = user;
          return agent.post('/api/auth/local').send({password: 'admin1234'}).send({identifier: 'admin'}).expect(200);
        })
        .then((res) => {
          token = res.body.autologinToken;
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('delete user', (done) => {
      agent
        .post('/api/user/deleteUser')
        .send({idUser: newUser.id})
        .set('token', token)
        .expect(200)
        .then((res) => {
          expect(res.body.success, 'The response is not true').to.be.true;
          if (res.body.success) {
            return sails.services.repository.user.getUserById(newUser.id);
          } else {
            return Promise.reject(new Error('Problems in response'));
          }
        })
        .then((user) => {
          expect(user, 'The username was not updated').to.be.an('undefined', 'The user was not erased');
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('delete user does not exist', (done) => {
      agent
        .post('/api/user/deleteUser')
        .send({idUser: 'fdhgsdhgd3456fdf'})
        .set('token', token)
        .expect(200)
        .then((res) => {
          expect(res.body.success, 'The response is not true').to.be.true;
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

  });

  describe("before login", () => {
    let newUser = {};

    before((done) => {
      sails.services.repository.user.createUser(
        {
          username: 'eraseUser2',
          email: 'eraseUser1@gmail.com',
          password: '1234567890'
        })
        .then((user) => {
          newUser = user;
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('try delete user before login should return a 203 status', (done) => {
      agent
        .post('/api/user/deleteUser')
        .send({idUser: newUser.id})
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

  describe("after login (ordinary user)", () => {
    let newUser = {};
    let token;

    before((done) => {
      sails.services.repository.user.createUser(
        {
          username: 'eraseUser3',
          email: 'eraseUser3@gmail.com',
          password: '1234567890',
          accountIsVerify: true
        })
        .then((user) => {
          newUser = user;
          return sails.services.repository.user.createUser(
            {
              username: 'eraseUser4',
              email: 'eraseUser4@gmail.com',
              password: '1234567890',
              accountIsVerify: true
            });
        })
        .then((user) => {
          return agent
            .post('/api/auth/local')
            .send({password: '1234567890'})
            .send({identifier: user.username})
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

    it('delete user', (done) => {
      agent
        .post('/api/user/deleteUser')
        .set('token', token)
        .send({idUser: newUser.id})
        .expect(200)
        .then((res) => {
          expect(res.body.success).to.be.false;
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

  });

});
