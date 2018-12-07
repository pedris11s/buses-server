let request = require('supertest');
let chai = require('chai');

let expect = chai.expect;

describe('User Authentication', function () {
  let agent;
  let newUser;

  this.timeout(0);

  before((done) => {
    agent = request.agent(sails.hooks.http.app);

    sails.services.repository.user.createUser(
      {
        username: 'loginNotVerify',
        email: 'loginNotVerify@gmail.com',
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

  it('Login testing', (done) => {
    agent.post('/api/auth/local')
      .send({
        identifier: 'admin',
        password: 'admin1234'
      })
      .then((res) => {
        expect(res.body.username).to.equal('admin', 'The username is not admin');
        expect(res.body.email).to.equal('admin@example.com', 'The email is not the same');
        expect(res.body.autologinToken).to.not.be.an('undefine', 'Auto login token do not exist');

        expect(res.body).to.have.all.keys(
          'id',
          'username',
          'email',
          'autologinToken',
          'roles',
          'imageRealName',
          'pageLanguage');

        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it.skip('Login with not verify user', (done) => {
    agent.post('/api/auth/local')
      .send({
        identifier: newUser.username,
        password: '1234567890'
      })
      .then((res) => {
        expect(res.body.success).to.be.false;
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('Login with invalid data', (done) => {
    agent.post('/api/auth/local')
      .send({
        identifier: 'asdklfjas',
        password: '1234567890'
      })
      .expect(203)
      .then((res) => {
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

});
