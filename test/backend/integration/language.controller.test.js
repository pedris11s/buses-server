let request = require('supertest');
let chai = require('chai');

let expect = chai.expect;

describe('Language Controller', function () {
  let agent;

  this.timeout(0);

  before(() => {
    agent = request.agent(sails.hooks.http.app);
  });

  describe('after login (admin)', () => {
    it('should return a dictionary of translations', () => {
      return agent.get('/api/i18n/en')
        .expect(200)
        .then((res) => {
          expect(Object.keys(res.body).length).to.be.above(0);
        });
    });

    it('should return a dictionary of translations', () => {
      return agent.get('/api/i18n/es')
        .expect(200)
        .then((res) => {
          expect(Object.keys(res.body).length).to.be.above(0);
        });
    });

    it('should return a dictionary of translations', () => {
      return agent.get('/api/language')
        .expect(200)
        .then((res) => {
          expect(res.body.length).to.be.above(0);
          expect(res.body).to.be.an('array');
          expect(res.body[0]).to.have.ownProperty('code');
        });
    });
  });
});
