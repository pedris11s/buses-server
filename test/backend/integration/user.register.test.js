let request = require('supertest');
let chai = require('chai');

let expect = chai.expect;

describe('User Register', () => {
  let agent;

  let newUser = {};

  before((done) => {
    agent = request.agent(sails.hooks.http.app);

    sails.services.repository.user.createUser({username: 'existingUser', password: '1234567890', email: 'existingUser@gmail.com'})
      .then((user) => {
        newUser = user;
        done();
      })
      .catch((err) => {
        sails.log.error('verify.account.test.js', err);
        done(err);
      });
  });

  it('Register new user', (done) => {
    agent.post(`/api/auth/local/register`)
      .send({username: 'newUserRegister', password: '1234567890', email: 'newUserRegister@gmail.com'})
      .expect(200)
      .then((res) => {
        expect(res.body.success, "Invalid response in the register").to.be.true;
        // check the new user in database
        return sails.services.repository.user.getUserByEmail('newUserRegister@gmail.com');
      })
      .then((user) => {
        expect(user.email).to.equal('newUserRegister@gmail.com', 'Invalid email');
        expect(user.username).to.equal('newUserRegister', 'Invalid username');
        expect(user.accountIsVerify).to.be.false;
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('Used credentials', (done) => {
    agent.post(`/api/auth/local/register`)
      .send({username: 'existingUser', password: '1234567890', email: 'existingUser@gmail.com'})
      .expect(200)
      .then((res) => {
        expect(res.body.success, "Invalid response in the register").to.be.false;
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('Invalid credentials (username)', (done) => {
    agent.post(`/api/auth/local/register`)
      .send({username: 'existing User', password: '1234567890', email: 'existingUser2@gmail.com'})
      .expect(200)
      .then((res) => {
        expect(res.body.success, "Invalid response in the register").to.be.false;
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('Invalid credentials (email)', (done) => {
    agent.post(`/api/auth/local/register`)
      .send({username: 'newUser1', password: '1', email: 'existingUser'})
      .expect(200)
      .then((res) => {
        expect(res.body.success, "Invalid response in the register").to.be.false;
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('Invalid credentials (password)', (done) => {
    agent.post(`/api/auth/local/register`)
      .send({username: 'newUser2', password: '', email: 'existingUser3@gmail.com'})
      .expect(200)
      .then((res) => {
        expect(res.body.success, "Invalid response in the register").to.be.false;
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

});
