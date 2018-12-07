let request = require('supertest');
let chai = require('chai');

let expect = chai.expect;

describe('Token Controller', function () {
  let agent;

  this.timeout(0);

  before(() => {
    agent = request.agent(sails.hooks.http.app);
  });

  describe('after login (admin)', () => {
    let token;

    before((done) => {
      agent.post('/api/auth/local').send({password: 'admin1234', identifier: 'admin'}).expect(200)
        .then((res) => {
          token = res.body.autologinToken;
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('Should return a list of tokens', (done) => {
      agent.get('/api/token/list')
        .set('token', token)
        .expect(200)
        .then((res) => {
          expect(res.body).to.be.an('array');
          expect(res.body[0]).to.have.ownProperty('token');
          expect(res.body.length).to.be.above(0);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe('after login (user)', () => {
    let token;

    before((done) => {
      sails.services.repository.user.createUser(
        {
          username: 'testToken',
          email: 'testToken@gmail.com',
          password: '1234567890',
          accountIsVerify: true
        })
        .then(() => {
          return agent
            .post('/api/auth/local')
            .send({password: '1234567890', identifier: 'testToken'})
            .expect(200);
        })
        .then((res) => {
          token = res.body.autologinToken;
          done();
        })
        .catch((err) => {
          done(err);
        })
    });

    it('try to get a list of tokens should return a permission error', (done) => {
      agent.get('/api/token/list')
        .set('token', token)
        .expect(200)
        .then((res) => {
          expect(res.body).to.have.property('success');
          expect(res.body.success).to.be.false;
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe('before login', () => {
    it('try to get a list of tokens should return status 203', (done) => {
      agent.post('/api/token/list').expect(203)
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
