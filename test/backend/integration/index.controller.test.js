let request = require('supertest');

describe('Index Controller test', function () {
  let agent;

  this.timeout(0);

  before(() => {
    agent = request.agent(sails.hooks.http.app);
  });

  it('Should be an html page the response with 200 status', (done) => {
    agent.get('/')
      .expect(200)
      .expect('content-type', 'text/html; charset=UTF-8')
      .then(() => {
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

});
