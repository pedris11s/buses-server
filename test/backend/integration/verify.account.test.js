let request = require('supertest');
let chai = require('chai');

let expect = chai.expect;

describe('User VerifyAccount', () => {
  let agent;

  let newUser = {};

  before((done) => {
    agent = request.agent(sails.hooks.http.app);

    sails.services.repository.user.createUser({username: 'test', password: '1234567890', email: 'eso@gmail.com'})
      .then((user) => {
        newUser = user;
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it.skip('Should verify account and return 203', (done) => {
    agent.get(`/api/verify_account/${newUser.verifyToken}`)
      .send()
      .then((res) => {
        expect(res.header.location).to.equal('/', 'After verify account do not return status 203 endpoint');
        return sails.services.repository.user.getUserById(newUser.id);
      })
      .then((user) => {
        expect(user.accountIsVerify, 'The account is not verify').to.be.true;
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

});
